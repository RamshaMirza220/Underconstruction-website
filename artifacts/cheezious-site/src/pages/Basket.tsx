import { ArrowLeft, ArrowRight, ChevronRight, Frown, MapPin, Plus, ShoppingBag, ShoppingCart, Store, Trash2 } from 'lucide-react';
import { Link } from 'wouter';
import { ProductCard } from '@/components/ProductCard';
import type { MenuItem } from '@/data/menu';
import type { OrderMode } from '@/auth/AuthContext';

export type CheckoutLine = { item: MenuItem; quantity: number };
const money = (value: number) => `PKR ${Math.round(value).toLocaleString('en-US')}`;

export function BasketPage({
  lines,
  subtotal,
  mode,
  address,
  recommendations,
  favorites,
  onBack,
  onRemove,
  onIncrease,
  onAdd,
  onToggleFavorite,
  onPayment,
}: {
  lines: CheckoutLine[];
  subtotal: number;
  mode: OrderMode;
  address: string;
  recommendations: MenuItem[];
  favorites: string[];
  onBack: () => void;
  onRemove: (id: string) => void;
  onIncrease: (id: string) => void;
  onAdd: (item: MenuItem) => void;
  onToggleFavorite: (id: string) => void;
  onPayment: () => void;
}) {
  const count = lines.reduce((total, line) => total + line.quantity, 0);
  if (!lines.length) {
    return (
      <main className="cx-checkout-page">
        <div className="cx-checkout-width cx-empty-checkout" data-testid="status-basket-empty">
          <div className="cx-empty-bag"><ShoppingBag size={42} /><Frown size={19} /></div>
          <h1>Your Basket is empty</h1>
          <p>There’s nothing on the table just yet. Find something good to share.</p>
          <Link href="/menu" className="cx-checkout-primary" data-testid="link-empty-basket-menu">EXPLORE MENU</Link>
        </div>
      </main>
    );
  }
  return (
    <main className="cx-checkout-page">
      <div className="cx-checkout-width">
        <button className="cx-checkout-back" type="button" onClick={onBack} data-testid="button-basket-back"><ArrowLeft size={19} /> <span>Your Basket</span></button>
        <p className="cx-checkout-location" data-testid="text-basket-address">
          {mode === 'delivery' ? <><MapPin size={16} /> {address || 'Choose a delivery address'}</> : <><Store size={16} /> Pick-up: G-15, Islamabad</>}
        </p>
        <div className="cx-checkout-columns">
          <section className="cx-checkout-maincol" aria-label="Basket items">
            <div className="cx-checkout-items">
              {lines.map(({ item, quantity }) => (
                <article className="cx-basket-item" key={item.id} data-testid={`row-basket-${item.id}`}>
                  <img src={item.image} alt={item.name} />
                  <div className="cx-basket-item-info">
                    <strong>{item.name}</strong>
                    <span className="cx-basket-variation">Regular</span>
                    <b className="cx-orange-price">{money(item.price * quantity)}</b>
                  </div>
                  <Link className="cx-basket-edit" href={`/menu?category=${encodeURIComponent(item.categoryId)}`} data-testid={`link-edit-${item.id}`}>EDIT</Link>
                  <div className="cx-basket-controls">
                    <button className="cx-round-remove" type="button" aria-label={`Remove ${item.name}`} onClick={() => onRemove(item.id)} data-testid={`button-basket-remove-${item.id}`}><Trash2 size={16} /></button>
                    <span data-testid={`text-basket-quantity-${item.id}`}>{quantity}</span>
                    <button className="cx-round-plus" type="button" aria-label={`Add one ${item.name}`} onClick={() => onIncrease(item.id)} data-testid={`button-basket-increase-${item.id}`}><Plus size={17} /></button>
                  </div>
                </article>
              ))}
            </div>
            <section className="cx-you-may-like">
              <h2>More Products You May Love</h2>
              <div className="cx-recommendation-scroll" data-testid="list-basket-recommendations">
                {recommendations.slice(0, 8).map((item) => (
                  <div className="cx-recommendation-card" key={item.id}>
                    <ProductCard item={item} liked={favorites.includes(item.id)} onLike={() => onToggleFavorite(item.id)} onAdd={() => onAdd(item)} />
                  </div>
                ))}
              </div>
            </section>
            <Link className="cx-explore-menu-card" href="/menu" data-testid="link-basket-explore-menu">
              <span><strong>Explore Menu</strong><small>Add more items in your cart</small></span><ChevronRight size={21} />
            </Link>
          </section>
          <aside className="cx-bill-column">
            <BillSummary subtotal={subtotal} discount={0} taxRate={15} />
            <button className="cx-checkout-sticky" type="button" onClick={onPayment} data-testid="button-review-payment">
              <span className="cx-checkout-cart-icon"><ShoppingCart size={19} /></span>
              <span className="cx-action-total"><strong>{money(subtotal)}</strong><small>Prices Are Exclusive Of Tax</small></span>
              <span className="cx-action-label">REVIEW PAYMENT <ArrowRight size={16} /></span>
            </button>
            <p className="cx-item-count">{count} {count === 1 ? 'item' : 'items'} in your basket</p>
          </aside>
        </div>
      </div>
    </main>
  );
}

export function BillSummary({ subtotal, discount, taxRate, tax }: { subtotal: number; discount: number; taxRate: number; tax?: number }) {
  const taxAmount = tax ?? Math.round(Math.max(0, subtotal - discount) * taxRate / 100);
  return (
    <section className="cx-bill-summary" data-testid="card-bill-summary">
      <h2>Bill Summary</h2>
      <div><span>Product Price</span><strong>{money(subtotal)}</strong></div>
      <div><span>Discount</span><strong className="cx-discount-value">- {money(discount)}</strong></div>
      <div><span>Tax ({taxRate}%)</span><strong>+ {money(taxAmount)}</strong></div>
      <div className="cx-bill-total"><span>Total</span><strong>{money(subtotal - discount + taxAmount)}</strong></div>
    </section>
  );
}
