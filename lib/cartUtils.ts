export type BillingCycle = 'monthly' | 'yearly' | '3month';
export type Mode = 'payment' | 'subscription';

// Base item used during "add to cart" (no quantity)
export interface CartProductBase {
  id: string;
  billingCycle?: BillingCycle;
  stripePriceId: string;
  price: string;
  title: string;
  imageUrl: string;
  mode: Mode;
  // Store all price fields for correct display in cart
  oneTime?: string;
  priceMonthly?: string;
  priceYearly?: string;
  price3Month?: string;
}

// Final cart item used *inside the cart* (includes quantity)
export interface CartProduct extends CartProductBase {
  quantity: number;
}

/**
 * Merges an LT product with its corresponding EN product to ensure all price fields are present.
 * This EXACTLY matches the logic used in PricingPlans component (lines 217-263).
 */
export function mergeProductWithEnPrices(
  product: any,
  allProducts: any[] = [],
  isLithuanian: boolean = false
): any {
  // Use the EXACT same normalization logic as PricingPlans
  const normalizeTitleKey = (title: string) =>
    title?.toLowerCase().replace(/plan(as)?/i, '').trim() || '';
  
  const ltToEnTitle: Record<string, string> = {
    pazengusiems: 'advanced',
    'pažengusiems': 'advanced',
    verslui: 'business',
    pradedantiesiems: 'beginner',
  };
  
  const baseTitleKey = (p: any) => {
    const keys = [
      p.titleLt,
      p.slugLt,
      p.slug,
      p.title,
    ].filter(Boolean) as string[];
    for (const k of keys) {
      const norm = normalizeTitleKey(k);
      if (ltToEnTitle[norm]) return ltToEnTitle[norm];
      if (ltToEnTitle[k.toLowerCase()]) return ltToEnTitle[k.toLowerCase()];
      if (norm) return norm;
    }
    return '';
  };
  
  // Build Maps exactly like PricingPlans does (lines 219-229)
  const enByBase = new Map<string, any>();
  const ltByBase = new Map<string, any>();
  
  // Add the current product to the array if not already there
  const productsToProcess = allProducts.some(p => p.id === product.id) 
    ? allProducts 
    : [...allProducts, product];
  
  productsToProcess.forEach((p) => {
    const key = baseTitleKey(p);
    if (!key) return;
    if (p.tags?.includes('LT')) {
      if (!ltByBase.has(key)) ltByBase.set(key, p);
    } else {
      if (!enByBase.has(key)) enByBase.set(key, p);
    }
  });
  
  const key = baseTitleKey(product);
  if (!key) {
    // No key found, return product as is (PricingPlans would filter this out)
    return product;
  }
  
  // Get docs from Maps exactly like PricingPlans (lines 234-235)
  const ltDoc = ltByBase.get(key);
  const enDoc = enByBase.get(key);
  
  // Match PricingPlans EXACT merge logic (lines 236-258)
  if (isLithuanian && ltDoc && enDoc) {
    return {
      ...enDoc,  // Spread EN first (base)
      ...ltDoc,  // Then spread LT (overrides)
      // Ensure Stripe + price fields always present from EN as fallback
      stripeOneTimePriceId:
        ltDoc.stripeOneTimePriceId || enDoc.stripeOneTimePriceId,
      stripePriceMonthlyId:
        ltDoc.stripePriceMonthlyId || enDoc.stripePriceMonthlyId,
      stripePriceYearlyId:
        ltDoc.stripePriceYearlyId || enDoc.stripePriceYearlyId,
      oneTime: ltDoc.oneTime || enDoc.oneTime,
      price: ltDoc.price || enDoc.price,
      title: ltDoc.title || enDoc.title,
      titleLt: ltDoc.titleLt || ltDoc.title || enDoc.titleLt || enDoc.title,
      imageUrl: ltDoc.imageUrl || enDoc.imageUrl,
      gallery: ltDoc.gallery || enDoc.gallery,
      // carry over ids/prices to simplify cart usage (with proper fallbacks)
      priceMonthly: ltDoc.priceMonthly || enDoc.priceMonthly || enDoc.price,
      priceYearly: ltDoc.priceYearly || enDoc.priceYearly || enDoc.priceMonthly || enDoc.price,
    };
  }
  
  // Match PricingPlans fallback logic (line 260)
  const chosen = isLithuanian ? ltDoc || enDoc : enDoc || ltDoc;
  return chosen || ltDoc || enDoc || product;
}

/**
 * Creates a product object for CartContext
 * IMPORTANT: The product should have all price fields (oneTime, priceMonthly, priceYearly) 
 * before calling this function. Use mergeProductWithEnPrices if needed.
 */
export function createCartItem(
  product: any,
  billingCycle: BillingCycle = 'monthly',
  mode: Mode = 'subscription'
): CartProductBase {
  const isGBP = product.id?.startsWith('gbp-') || product.id?.startsWith('geo-');
  
  // Get Stripe price IDs - these are required for checkout
  const stripePriceId =
    mode === 'payment'
      ? product.stripeOneTimePriceId || ''
      : billingCycle === 'yearly'
      ? product.stripePriceYearlyId || ''
      : billingCycle === '3month'
      ? (isGBP ? (product.stripePrice3MonthId_EUR || product.stripePrice3MonthId_US || product.stripePrice3MonthId_GB || product.stripePrice3MonthId) : '')
      : product.stripePriceMonthlyId || '';

  // Get the correct price based on mode and billing cycle
  // IMPORTANT: priceYearly from Stripe is the TOTAL yearly amount (e.g., €718.80/year)
  // priceMonthly is the monthly rate (e.g., €69.90/month)
  // price3Month is the 3-month rate for GBP plans (e.g., €X.XX/3mo)
  // oneTime is the one-time payment (e.g., €799.90)
  let price: string | number | undefined;
  
  if (mode === 'payment') {
    // One-time payment: use oneTime field, fallback to price
    price = product.oneTime ?? product.price;
  } else if (billingCycle === 'yearly') {
    // Yearly subscription: use priceYearly (total for year), fallback to priceMonthly * 12, then price
    price = product.priceYearly ?? 
            (product.priceMonthly ? Number(product.priceMonthly) * 12 : undefined) ??
            product.price;
  } else if (billingCycle === '3month') {
    // 3-month subscription (GBP): use price3Month, fallback to priceMonthly * 3, then price
    price = product.price3Month ?? 
            (product.priceMonthly ? Number(product.priceMonthly) * 3 : undefined) ??
            product.price;
  } else {
    // Monthly subscription: use priceMonthly, fallback to price
    price = product.priceMonthly ?? product.price;
  }

  // Convert to string, ensure it's a valid number
  const priceStr = price != null ? String(price) : '0.00';
  const priceNum = parseFloat(priceStr);
  const finalPrice = isNaN(priceNum) ? '0.00' : priceNum.toFixed(2);

  // Store all price fields for reference in cart display
  const oneTimePrice = product.oneTime?.toString() || product.price?.toString() || '0.00';
  const monthlyPrice = product.priceMonthly?.toString() || product.price?.toString() || '0.00';
  const yearlyPrice = product.priceYearly?.toString() || 
                      (product.priceMonthly ? (Number(product.priceMonthly) * 12).toFixed(2) : undefined) ||
                      product.price?.toString() || '0.00';
  const threeMonthPrice = product.price3Month?.toString() || 
                          (product.priceMonthly ? (Number(product.priceMonthly) * 3).toFixed(2) : undefined) ||
                          product.price?.toString() || '0.00';

  return {
    id: product.id,
    billingCycle: mode === 'subscription' ? billingCycle : undefined,
    stripePriceId,
    price: finalPrice,
    title: product.title || product.titleLt || 'Product',
    imageUrl: product.imageUrl || product.gallery?.[0] || '',
    mode,
    oneTime: oneTimePrice,
    priceMonthly: monthlyPrice,
    priceYearly: yearlyPrice,
    price3Month: isGBP ? threeMonthPrice : undefined,
  };
}
