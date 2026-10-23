/** Builds the WhatsApp order message as an itemised invoice (WhatsApp *bold* / _italic_ markup). */
export function buildOrderMessage({ product, label, quantity, unitPrice, originalPrice, percent, currency, customer }) {
  const inr = currency === 'INR';
  const symbol = inr ? '₹' : '$';
  const money = (n) => `${symbol}${new Intl.NumberFormat(inr ? 'en-IN' : 'en-US', { minimumFractionDigits: 0, maximumFractionDigits: inr ? 0 : 2 }).format(n)}`;

  const mrpTotal = originalPrice * quantity;
  const total = unitPrice * quantity;
  const saved = mrpTotal - total;
  const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const line = '━━━━━━━━━━━━━━━━━━━━';

  const lines = [
    '*P-KOT SPICES*',
    '*ORDER INVOICE*',
    `Date: ${date}`,
    line,
    '',
    '*ITEM*',
    `${product.name} (${label})`,
    `${money(unitPrice)} × ${quantity}`,
    '',
    '*BILL SUMMARY*',
    `Price (${quantity} × ${label}): ${money(mrpTotal)}`,
  ];
  if (saved > 0) lines.push(`Discount${percent ? ` (${percent}% off)` : ''}: -${money(saved)}`);
  lines.push(
    'Shipping: FREE',
    line,
    `*TOTAL PAYABLE: ${money(total)}*`,
  );
  if (saved > 0) lines.push(`_You save ${money(saved)} on this order_`);
  lines.push(
    line,
    '',
    '*DELIVERY DETAILS*',
    `Name: ${customer.name}`,
    `Phone: ${customer.phone}`,
    `Address: ${customer.address}, ${customer.city} - ${customer.pincode}`,
    '',
    '_Please confirm this order and share the payment details._',
  );
  return lines.join('\n');
}
