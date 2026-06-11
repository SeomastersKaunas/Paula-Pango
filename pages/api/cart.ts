import type { NextApiRequest, NextApiResponse } from 'next';
import { artworks } from '../../lib/artworks';

/**
 * Paula Pango cart enrichment.
 * Takes cartItems (minimal localStorage entries) and returns full artwork details
 * for display in the cart UI. Pricing & metadata come from lib/artworks.ts.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { cartItems } = req.body || {};
  if (!Array.isArray(cartItems)) {
    return res.status(400).json({ message: 'cartItems must be an array' });
  }

  const enriched = cartItems
    .map((item: any) => {
      const artwork = artworks.find((a) => a.id === item.id);
      if (!artwork) return null;
      return {
        id: artwork.id,
        title: artwork.title,
        imageUrl: artwork.imageUrl,
        price: artwork.price.toString(),
        oneTime: artwork.price.toString(),
        priceMonthly: '0',
        priceYearly: '0',
        price3Month: '0',
        mode: 'payment' as const,
        quantity: item.quantity || 1,
        stripePriceId: '',
        widthCm: artwork.widthCm,
        heightCm: artwork.heightCm,
        year: artwork.year,
        medium: artwork.medium,
        sold: artwork.sold,
      };
    })
    .filter(Boolean);

  return res.status(200).json(enriched);
}
