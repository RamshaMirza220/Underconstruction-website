import { useEffect } from 'react';
import { Check, Clock3, MapPin, Store } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import type { Order } from '@/auth/AuthContext';

const money = (value: number) => `PKR ${Math.round(value).toLocaleString('en-US')}`;

export function ReceiptPage({ order }: { order: Order | undefined }) {
  const [, setLocation] = useLocation();
  useEffect(() => {
    if (!order) setLocation('/');
  }, [order, setLocation]);
  if (!order) return null;
  const date = new Date(order.createdAt);
  return (
    <main className="cx-receipt-page">
      <article className="cx-receipt-card" data-testid={`card-receipt-${order.id}`}>
        <div className="cx-receipt-success"><Check size={27} strokeWidth={3} /></div>
        <span className="cx-receipt-eyebrow">Underconstruction kitchen</span>
        <h1>Order Confirmed</h1>
        <p className="cx-receipt-thanks">Your food is being prepared with care.</p>
        <div className="cx-receipt-order-meta">
          <strong data-testid="text-receipt-order-number">{order.id}</strong>
          <span data-testid="text-receipt-date">{date.toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}</span>
        </div>
        <div className="cx-receipt-status"><span>{order.status}</span><span><Clock3 size={16} /> 35–45 min</span></div>
        <section className="cx-receipt-block">
          <h2>{order.mode === 'delivery' ? 'Delivery address' : 'Pick-up location'}</h2>
          <p>{order.mode === 'delivery' ? <MapPin size={16} /> : <Store size={16} />}{order.address}</p>
        </section>
        <section className="cx-receipt-block">
          <h2>Payment method</h2><p>{order.paymentMethod}</p>
        </section>
        <section className="cx-receipt-block">
          <h2>Your items</h2>
          <div className="cx-receipt-items">
             {order.items.map((item) => <div key={item.id} data-testid={`row-receipt-item-${item.id}`}><span>{item.quantity} × {item.name} <small>{item.variation}</small></span><strong>{money(item.unitPrice * item.quantity)}</strong></div>)}
          </div>
        </section>
        <section className="cx-receipt-block cx-receipt-bill">
          <h2>Bill details</h2>
          <div><span>Product price</span><strong>{money(order.subtotal)}</strong></div>
          <div><span>Discount</span><strong>- {money(order.discount)}</strong></div>
          <div><span>Tax ({order.taxRate}%)</span><strong>+ {money(order.tax)}</strong></div>
          <div className="cx-receipt-total"><span>Total paid</span><strong>{money(order.total)}</strong></div>
        </section>
        <section className="cx-receipt-block">
          <h2>Delivery instructions</h2><p>{order.instructions || 'No additional instructions'}</p>
        </section>
        <div className="cx-receipt-actions">
          <Link href="/" className="cx-checkout-primary" data-testid="link-receipt-home">BACK TO HOME</Link>
          <Link href="/account?tab=orders" className="cx-receipt-secondary" data-testid="link-receipt-history">ORDER HISTORY</Link>
        </div>
      </article>
    </main>
  );
}
