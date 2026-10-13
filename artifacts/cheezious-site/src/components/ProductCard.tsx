import { Heart, Plus } from 'lucide-react';
import type { MenuItem } from '@/data/menu';

export type ProductCardProps = {
  item: MenuItem;
  liked: boolean;
  onLike: () => void;
  onAdd: () => void;
};

export function ProductCard({ item, liked, onLike, onAdd }: ProductCardProps) {
  return (
    <article className="cx-product-card" data-testid={`card-product-${item.id}`}>
      <div className="cx-product-image">
        <img src={item.image} alt={item.name} loading="lazy" />
        <button
          type="button"
          className={`cx-favorite${liked ? ' is-liked' : ''}`}
          aria-label={liked ? `Remove ${item.name} from favorites` : `Add ${item.name} to favorites`}
          aria-pressed={liked}
          onClick={onLike}
          data-testid={`button-favorite-${item.id}`}
        >
          <Heart size={19} fill={liked ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="cx-product-info">
        <h3>{item.name}</h3>
        <p className="cx-product-description">{item.description || 'A tasty extra to add to your order.'}</p>
        <div className="cx-product-price">
          <strong>Rs. {item.price.toLocaleString('en-US')}</strong>
          {item.startingPrice && <span>Starting Price</span>}
        </div>
        <button className="cx-add-button" type="button" onClick={onAdd} data-testid={`button-add-${item.id}`}>
          <Plus size={15} /> ADD TO CART
        </button>
      </div>
    </article>
  );
}
