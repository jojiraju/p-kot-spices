// Two ways of pricing, set per product in the CMS:
//  - "weight" (default): loose items priced per kg, offered in the CMS weight options (100g, 250g, 1kg…).
//  - "pack": ready-packed items (e.g. pickle jars); each pack has its own size and price.
// Either way, stock is a packet count per size: `weightStock` ({ '250g': 20 }) or `packs[i].stock`.
// A size without a number is untracked, so only the manual `inStock` flag applies.

const num = (v) => parseFloat(String(v ?? '').replace(/,/g, '')) || 0;
const count = (n) => (typeof n === 'number' ? n : Infinity);

/** Show "only N left" at or below this many packets. */
const LOW_STOCK = 5;

/** Percentage off set on the product in the CMS (0 = none). Stored prices are undiscounted. */
export const discountPercent = (product) => {
  const n = Number(product?.discountPercent);
  return n > 0 && n < 100 ? n : 0;
};
// Discounted prices are rounded to a whole number (no decimals) in every currency.
const afterDiscount = (price, product) => (discountPercent(product) ? Math.round(price * (1 - discountPercent(product) / 100)) : price);

/** Headline price for a product card: { price, original, percent } (original is null without a discount). */
export function cardPrice(product, currency) {
  const base = num(product[currency === 'INR' ? 'priceINR' : 'priceUSD']);
  const percent = discountPercent(product);
  return { price: afterDiscount(base, product), original: percent ? base : null, percent };
}

/**
 * What a customer can pick for this product, in the given currency:
 * [{ label, unitPrice, originalPrice, max }] where unitPrice is already discounted and max is how many packets can still be ordered (Infinity when untracked).
 */
export function sellOptions(product, weights, currency) {
  const key = currency === 'INR' ? 'priceINR' : 'priceUSD';
  if (product.sellBy === 'pack' && product.packs?.length) {
    return product.packs.map((k) => ({ label: k.label, unitPrice: afterDiscount(num(k[key]), product), originalPrice: num(k[key]), max: count(k.stock) }));
  }
  const base = num(product[key]);
  return weights.map((w) => ({ label: w.label, unitPrice: afterDiscount(base * w.value, product), originalPrice: base * w.value, max: count(product.weightStock?.[w.label]) }));
}

/** "Only N left" text for the selected size, or '' when there is plenty. */
export function lowStockNote(option) {
  return Number.isFinite(option?.max) && option.max > 0 && option.max <= LOW_STOCK
    ? `Only ${option.max} left in this size.`
    : '';
}
