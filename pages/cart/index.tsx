'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useCart, BillingCycle } from '../../lib/CartContext';
import axios from 'axios';
import Link from 'next/link';
import Spinner from '../../components/Spinner';
import Success from '../../components/Success';
import customToast from '../../lib/toastUtils';
import SEOHead from '../../components/SEOHead';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { useLocalePath } from '../../lib/useLocalePath';
import { cormorant, jost } from '../../lib/fonts';

import { reportPurchaseConversion } from '../../lib/gtag';
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCcStripe,
  FaLock,
  FaTrash,
  FaShoppingBag,
} from 'react-icons/fa';

const VAT_RATE = 0.21;
const formatPrice = (price: number): string =>
  price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export default function Cart() {
  const {
    cartProducts,
    removeProduct,
    addProduct,
    switchSubscriptionCycle,
    updateCartItemsFromEnriched,
    clearCart,
  } = useCart();
  const router = useRouter();
  const { t, lang } = useTranslation('common');
  const { prefix } = useLocalePath();
  const isLithuanian = router.asPath.startsWith('/lt');
  const isUS = router.asPath.startsWith('/us');
  const galleryHref = isLithuanian ? '/lt/galerija' : '/gallery';
  const contactHref = isLithuanian ? '/lt/kontaktai' : (prefix ? `${prefix}/contact` : '/contact');
  const currentCartPath =
    (router.asPath || '').split('#')[0] ||
    (isUS ? '/us/cart' : isLithuanian ? '/lt/krepselis' : '/cart');
  const cartCurrencySymbol = isUS ? '$' : (router.query.currency === 'gbp' ? '£' : '€');

  const [products, setProducts] = useState<any[]>([]);
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [zip, setZip] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const purchaseConversionFired = useRef(false);

  const market =
    router.asPath.startsWith('/us')
      ? 'us'
      : router.query.currency === 'gbp'
      ? 'gb'
      : 'eu';

  useEffect(() => {
    let cancelled = false;
    // Only show loading if we have cart products but haven't loaded enriched products yet
    if (cartProducts.length > 0) {
      setLoading(true);
      axios
        .post('/api/cart', { cartItems: cartProducts, market })
        .then((res) => {
          if (!cancelled) {
            const enrichedProducts = res.data || [];
            setProducts(enrichedProducts);
            // Update cart items' stripePriceId to match current market
            // This only updates if prices actually changed (handled in CartContext)
            updateCartItemsFromEnriched(enrichedProducts);
            setLoading(false);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setLoading(false);
          }
        });
    } else {
      setProducts([]);
      setLoading(false);
    }
    return () => {
      cancelled = true;
    };
  }, [cartProducts, market, router.asPath]);
  
  // Function to remove both subscription and payment items for a product
  const removeProductCompletely = (productId: string, billingCycle?: BillingCycle) => {
    // Remove subscription item (if exists)
    const hasSubscription = cartProducts.some(
      (p) => p.id === productId && p.mode === 'subscription' && p.billingCycle === billingCycle
    );
    if (hasSubscription) {
      removeProduct(productId, billingCycle);
    }
    
    // Remove payment item (if exists) - payment items don't have billingCycle
    const hasPayment = cartProducts.some(
      (p) => p.id === productId && p.mode === 'payment'
    );
    if (hasPayment) {
      removeProduct(productId, undefined);
    }
    
    customToast.success(isLithuanian ? 'Produktas pašalintas' : 'Product removed');
  };

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.location.href.includes('success')
    ) {
      setIsSuccess(true);
      clearCart();

      // Fire Google Ads purchase conversion (once per visit)
      if (!purchaseConversionFired.current) {
        const storageKey = 'paulapango_purchase_conversion_fired';
        if (sessionStorage.getItem(storageKey) !== '1') {
          const tryFire = () => {
            if (typeof window === 'undefined') return;
            if (!window.gtag) return;
            
            // Extract session_id (transaction_id) from URL query params
            const urlParams = new URLSearchParams(window.location.search);
            const transactionId = urlParams.get('session_id') || '';
            
            // Calculate total from products before cart is cleared
            const purchaseTotal = products.reduce((acc, item) => {
              let perCycle: number;
              if (item.mode === 'subscription') {
                perCycle = item.billingCycle === 'yearly'
                  ? parseFloat(String(item.priceYearly ?? item.price).replace(/[^\d.-]/g, '')) || 0
                  : item.billingCycle === '3month'
                  ? parseFloat(String(item.price3Month ?? item.price).replace(/[^\d.-]/g, '')) || 0
                  : parseFloat(String(item.priceMonthly ?? item.price).replace(/[^\d.-]/g, '')) || 0;
              } else {
                perCycle = parseFloat(String(item.oneTime ?? item.price).replace(/[^\d.-]/g, '')) || 0;
              }
              return acc + perCycle * item.quantity;
            }, 0);
            
            // Currency: USD for /us/, EUR for /lt/ or root
            const currency = window.location.pathname.includes('/us/') ? 'USD' : 'EUR';
            
            // Push purchase value, currency, and transaction_id to GTM dataLayer with ecommerce structure
            if (window.dataLayer) {
              window.dataLayer.push({
                'event': 'purchase',
                'ecommerce': {
                  'value': purchaseTotal,
                  'currency': currency,
                  'transaction_id': transactionId
                }
              });
            }
            
            if (reportPurchaseConversion(purchaseTotal > 0 ? purchaseTotal : undefined, currency)) {
              purchaseConversionFired.current = true;
              sessionStorage.setItem(storageKey, '1');
            }
          };
          tryFire();
          if (!purchaseConversionFired.current) {
            const timeout = window.setTimeout(tryFire, 500);
            return () => window.clearTimeout(timeout);
          }
        }
      }
    }
  }, [clearCart, isUS, router.query.currency, products]);

  const toNumber = (v: any) => {
    const num = parseFloat(String(v ?? '').replace(/[^\d.-]/g, ''));
    return Number.isFinite(num) ? num : 0;
  };

  const subTotal = products.reduce((acc, item) => {
    let perCycle: number;
    if (item.mode === 'subscription') {
      perCycle =
        item.billingCycle === 'yearly'
          ? toNumber(item.priceYearly ?? item.price)
          : item.billingCycle === '3month'
          ? toNumber(item.price3Month ?? item.price)
          : toNumber(item.priceMonthly ?? item.price);
    } else {
      perCycle = toNumber(item.oneTime ?? item.price);
    }
    return acc + perCycle * item.quantity;
  }, 0);
  const vatAmount = subTotal - subTotal / (1 + VAT_RATE);
  const total = subTotal;

  const hasMixedSessionTypes = (() => {
    const hasSubscription = cartProducts.some((p) => p.mode === 'subscription');
    const hasPayment = cartProducts.some((p) => p.mode === 'payment');
    return hasSubscription && hasPayment;
  })();

  // Group products: subscription items with their payment counterparts, standalone payment items
  // Ensure ALL products are displayed correctly - MUST be before early returns
  const groupedProducts = React.useMemo(() => {
    const subscriptionItems = products.filter((p) => p.mode === 'subscription');
    const paymentItems = products.filter((p) => p.mode === 'payment');
    
    // Group subscriptions with their payment counterparts (same product ID)
    const subscriptionsWithPayment = subscriptionItems.map((sub) => ({
      subscription: sub,
      payment: paymentItems.find((p) => p.id === sub.id),
    }));
    
    // Standalone payment items (no matching subscription)
    const standalonePayments = paymentItems.filter(
      (p) => !subscriptionItems.some((s) => s.id === p.id)
    );

    return {
      subscriptions: subscriptionsWithPayment,
      standalonePayments,
    };
  }, [products]);

  const stripeCheckout = async () => {
    const isLithuanian = router.asPath.startsWith('/lt');
    const lang = isLithuanian ? 'lt' : 'en';

    try {
      const response = await axios.post('/api/checkout', {
        email,
        name,
        address,
        city,
        country,
        zip,
        cartProducts,
        lang,
        market,
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        customToast.error('Checkout error: No redirect URL');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'An error occurred during checkout';
      customToast.error(errorMessage);
    }
  };

  if (isSuccess) return <Success />;

  return (
    <>
      <SEOHead
        title={isLithuanian ? 'Krepšelis — Paula Pango' : 'Cart — Paula Pango'}
        description={isLithuanian ? 'Jūsų pasirinkti paveikslai' : 'Your selected paintings'}
        noIndex
      />
      <div className='max-w-6xl mx-auto px-6 py-16'>

        {/* Page heading */}
        <h1 className={`text-4xl text-[#3e3232] mb-12 ${cormorant.className}`} style={{ fontStyle: 'italic' }}>
          {isLithuanian ? 'Krepšelis' : 'Your Cart'}
        </h1>

        {loading && cartProducts.length > 0 ? (
          <div className='flex justify-center items-center min-h-[300px]'>
            <Spinner />
          </div>
        ) : products.length === 0 && cartProducts.length === 0 ? (
          /* Empty cart */
          <div className='flex flex-col items-center py-24 text-center'>
            <p className={`text-xl text-[#3e3232] mb-3 ${cormorant.className}`} style={{ fontStyle: 'italic' }}>
              {isLithuanian ? 'Krepšelis tuščias' : 'Your cart is empty'}
            </p>
            <p className={`text-sm text-[#9e8080] mb-8 ${jost.className}`}>
              {isLithuanian ? 'Pridėkite paveikslų iš galerijos.' : 'Add paintings from the gallery.'}
            </p>
            <Link href={isLithuanian ? '/lt/galerija' : '/gallery'}
              className={`px-8 py-3 bg-[#7b5d5d] text-white text-xs uppercase tracking-[0.2em] hover:bg-[#6a4f4f] transition-colors ${jost.className}`}>
              {isLithuanian ? 'Žiūrėti galeriją' : 'View Gallery'}
            </Link>
          </div>
        ) : (
          /* Cart content */
          <div className='grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16'>

            {/* LEFT — product list */}
            <div>
              {/* Column headers */}
              <div className={`hidden md:grid grid-cols-[1fr_auto_auto] gap-4 pb-3 border-b border-[#e4d4d4] text-xs uppercase tracking-[0.15em] text-[#9e8080] ${jost.className}`}>
                <span>{isLithuanian ? 'Paveikslas' : 'Painting'}</span>
                <span className='text-right'>{isLithuanian ? 'Kaina' : 'Price'}</span>
                <span />
              </div>

              <div className='divide-y divide-[#e4d4d4]'>
                {[...groupedProducts.subscriptions.map(s => s.subscription), ...groupedProducts.standalonePayments].map((item, idx) => {
                  const rawPrice = toNumber(item.oneTime ?? item.price ?? 0);
                  return (
                    <div key={`${item.id}-${idx}`} className='py-6 grid grid-cols-[80px_1fr] md:grid-cols-[80px_1fr_auto_auto] gap-4 items-center'>
                      {/* Thumbnail */}
                      <div className='relative w-20 h-20 bg-[#f0e9e9] overflow-hidden shrink-0'>
                        {item.imageUrl && item.imageUrl !== '/no-image.png' ? (
                          <Image src={item.imageUrl} alt={item.title} fill className='object-cover object-center' sizes='80px' />
                        ) : (
                          <div className='w-full h-full bg-[#f0e9e9]' />
                        )}
                      </div>

                      {/* Title */}
                      <div>
                        <p className={`text-[#3e3232] text-lg ${cormorant.className}`}>{item.title}</p>
                        <p className={`text-[#9e8080] text-xs mt-0.5 ${jost.className}`}>
                          {isLithuanian ? 'Originalus paveikslas' : 'Original painting'}
                        </p>
                        {/* Mobile price */}
                        <p className={`md:hidden text-[#3e3232] text-sm mt-1 ${jost.className}`}>
                          €{rawPrice.toLocaleString('en-US')}
                        </p>
                      </div>

                      {/* Price (desktop) */}
                      <p className={`hidden md:block text-[#3e3232] text-sm text-right ${jost.className}`}>
                        €{rawPrice.toLocaleString('en-US')}
                      </p>

                      {/* Remove */}
                      <button
                        onClick={() => removeProductCompletely(item.id, item.billingCycle)}
                        className={`text-[#9e8080] hover:text-[#7b5d5d] text-xs uppercase tracking-[0.1em] transition-colors ${jost.className}`}
                        aria-label='Remove'
                      >
                        {isLithuanian ? 'Pašalinti' : 'Remove'}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Continue shopping */}
              <div className='mt-8 pt-6 border-t border-[#e4d4d4]'>
                <Link href={isLithuanian ? '/lt/galerija' : '/gallery'}
                  className={`text-sm text-[#9e8080] hover:text-[#7b5d5d] transition-colors ${jost.className}`}>
                  ← {isLithuanian ? 'Tęsti apsipirkimą' : 'Continue shopping'}
                </Link>
              </div>
            </div>

            {/* RIGHT — order summary + details form */}
            <div>
              <div className='bg-[#f0e9e9] p-8'>
                <h2 className={`text-2xl text-[#3e3232] mb-6 ${cormorant.className}`}>
                  {isLithuanian ? 'Užsakymo suvestinė' : 'Order Summary'}
                </h2>

                {/* Subtotal */}
                <div className='space-y-2 mb-6 pb-6 border-b border-[#e4d4d4]'>
                  <div className={`flex justify-between text-sm text-[#3e3232] ${jost.className}`}>
                    <span>{isLithuanian ? 'Subtotalas' : 'Subtotal'}</span>
                    <span>€{subTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className={`flex justify-between text-xs text-[#9e8080] ${jost.className}`}>
                    <span>{isLithuanian ? `PVM (${Math.round(VAT_RATE * 100)}%)` : `VAT (${Math.round(VAT_RATE * 100)}%)`}</span>
                    <span>€{vatAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
                <div className={`flex justify-between text-base text-[#3e3232] font-medium mb-8 ${jost.className}`}>
                  <span>{isLithuanian ? 'Iš viso' : 'Total'}</span>
                  <span>€{total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>

                {/* Customer details form */}
                <form onSubmit={(e) => { e.preventDefault(); stripeCheckout(); }} className='space-y-4'>
                  <div>
                    <label className={`block text-xs uppercase tracking-[0.12em] text-[#9e8080] mb-1.5 ${jost.className}`}>
                      {isLithuanian ? 'El. paštas' : 'Email'} *
                    </label>
                    <input type='email' required value={email} onChange={(e) => setEmail(e.target.value)}
                      className={`w-full border border-[#cfb0ae] bg-transparent px-4 py-2.5 text-sm text-[#3e3232] placeholder-[#9e8080] focus:outline-none focus:border-[#7b5d5d] transition-colors ${jost.className}`}
                      placeholder='you@example.com' />
                  </div>
                  <div>
                    <label className={`block text-xs uppercase tracking-[0.12em] text-[#9e8080] mb-1.5 ${jost.className}`}>
                      {isLithuanian ? 'Vardas Pavardė' : 'Full Name'} *
                    </label>
                    <input type='text' required value={name} onChange={(e) => setName(e.target.value)}
                      className={`w-full border border-[#cfb0ae] bg-transparent px-4 py-2.5 text-sm text-[#3e3232] placeholder-[#9e8080] focus:outline-none focus:border-[#7b5d5d] transition-colors ${jost.className}`}
                      placeholder={isLithuanian ? 'Jūsų vardas pavardė' : 'Your full name'} />
                  </div>
                  <div>
                    <label className={`block text-xs uppercase tracking-[0.12em] text-[#9e8080] mb-1.5 ${jost.className}`}>
                      {isLithuanian ? 'Adresas' : 'Address'} *
                    </label>
                    <input type='text' required value={address} onChange={(e) => setAddress(e.target.value)}
                      className={`w-full border border-[#cfb0ae] bg-transparent px-4 py-2.5 text-sm text-[#3e3232] placeholder-[#9e8080] focus:outline-none focus:border-[#7b5d5d] transition-colors ${jost.className}`}
                      placeholder={isLithuanian ? 'Gatvė, namo nr.' : 'Street address'} />
                  </div>
                  <div className='grid grid-cols-2 gap-3'>
                    <div>
                      <label className={`block text-xs uppercase tracking-[0.12em] text-[#9e8080] mb-1.5 ${jost.className}`}>
                        {isLithuanian ? 'Miestas' : 'City'} *
                      </label>
                      <input type='text' required value={city} onChange={(e) => setCity(e.target.value)}
                        className={`w-full border border-[#cfb0ae] bg-transparent px-4 py-2.5 text-sm text-[#3e3232] placeholder-[#9e8080] focus:outline-none focus:border-[#7b5d5d] transition-colors ${jost.className}`} />
                    </div>
                    <div>
                      <label className={`block text-xs uppercase tracking-[0.12em] text-[#9e8080] mb-1.5 ${jost.className}`}>
                        {isLithuanian ? 'Pašto kodas' : 'Zip'} *
                      </label>
                      <input type='text' required value={zip} onChange={(e) => setZip(e.target.value)}
                        className={`w-full border border-[#cfb0ae] bg-transparent px-4 py-2.5 text-sm text-[#3e3232] placeholder-[#9e8080] focus:outline-none focus:border-[#7b5d5d] transition-colors ${jost.className}`} />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-xs uppercase tracking-[0.12em] text-[#9e8080] mb-1.5 ${jost.className}`}>
                      {isLithuanian ? 'Šalis' : 'Country'} *
                    </label>
                    <input type='text' required value={country} onChange={(e) => setCountry(e.target.value)}
                      className={`w-full border border-[#cfb0ae] bg-transparent px-4 py-2.5 text-sm text-[#3e3232] placeholder-[#9e8080] focus:outline-none focus:border-[#7b5d5d] transition-colors ${jost.className}`}
                      placeholder={isLithuanian ? 'Lietuva' : 'Lithuania'} />
                  </div>

                  <button type='submit'
                    className={`w-full mt-2 py-3.5 bg-[#7b5d5d] hover:bg-[#6a4f4f] transition text-white text-xs uppercase tracking-[0.2em] ${jost.className}`}>
                    {isLithuanian ? 'Pereiti prie apmokėjimo' : 'Proceed to Checkout'}
                  </button>

                  {/* Payment logos */}
                  <div className={`pt-4 text-center text-xs text-[#9e8080] ${jost.className}`}>
                    <p className='mb-3'>{isLithuanian ? 'Mokėjimai saugiai tvarkomi per' : 'Payments securely processed through'} <span className='text-[#7b5d5d]'>Stripe</span></p>
                    <div className='flex justify-center items-center gap-3'>
                      <FaCcMastercard className='w-8 h-6 text-[#9e8080]' />
                      <FaCcVisa className='w-8 h-6 text-[#9e8080]' />
                      <FaCcPaypal className='w-8 h-6 text-[#9e8080]' />
                      <FaCcStripe className='w-8 h-6 text-[#9e8080]' />
                    </div>
                  </div>
                </form>
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  );
}
