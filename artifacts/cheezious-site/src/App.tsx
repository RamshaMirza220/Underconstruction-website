import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Route, Router as WouterRouter, Switch, useLocation } from 'wouter';
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Frown,
  Heart,
  MapPin,
  Megaphone,
  Menu as MenuIcon,
  Pizza,
  Plus,
  Search,
  ShoppingBag,
  ShoppingCart,
  Store,
  Trash2,
  UserRound,
  X,
} from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useForm } from 'react-hook-form';
import { homeMenuCategories, menuCategories, menuItems, type MenuCategory, type MenuItem } from './data/menu';

type CartLine = { item: MenuItem; quantity: number };
type Notice = { title: string; body: string } | null;
type NewsletterValues = { email: string };

const STORAGE_KEY = 'cheezious-preview-cart-v2';
const formatPrice = (price: number) => `Rs. ${price.toLocaleString('en-US')}`;

function readCartFromStorage(): Record<string, number> {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return {};
    const parsed = JSON.parse(saved) as Record<string, unknown>;
    const cart: Record<string, number> = {};
    for (const [id, quantity] of Object.entries(parsed)) {
      if (typeof quantity === 'number' && Number.isInteger(quantity) && quantity > 0) cart[id] = quantity;
    }
    return cart;
  } catch {
    return {};
  }
}

function Brand() {
  return (
    <Link className="cx-brand" href="/" aria-label="Underconstruction home" data-testid="link-underconstruction-home">
      <span className="cx-brand-mark" aria-hidden="true">U</span>
      <span className="cx-brand-name">Underconstruction</span>
    </Link>
  );
}

function Header({
  cartCount,
  searchQuery,
  onSearch,
  onOpenCart,
  onNotice,
}: {
  cartCount: number;
  searchQuery: string;
  onSearch: (value: string) => void;
  onOpenCart: () => void;
  onNotice: (notice: Notice) => void;
}) {
  const [mode, setMode] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [, setLocation] = useLocation();

  const orderMode = (
    <div className="cx-order-mode" aria-label="Choose order type">
      <button
        type="button"
        className={mode === 'delivery' ? 'is-selected' : ''}
        aria-pressed={mode === 'delivery'}
        onClick={() => setMode('delivery')}
        data-testid="button-delivery"
      >
        <MapPin size={15} /> DELIVERY
      </button>
      <button
        type="button"
        className={mode === 'pickup' ? 'is-selected' : ''}
        aria-pressed={mode === 'pickup'}
        onClick={() => setMode('pickup')}
        data-testid="button-pickup"
      >
        <Store size={15} /> PICK-UP
      </button>
    </div>
  );

  const searchField = (id: string) => (
    <label className="cx-search-field" htmlFor={id}>
      <Search size={16} aria-hidden="true" />
      <input
        id={id}
        type="search"
        value={searchQuery}
        onChange={(event) => onSearch(event.target.value)}
        placeholder="Find in Underconstruction"
        aria-label="Find in Underconstruction menu"
        data-testid={`input-menu-search-${id}`}
      />
    </label>
  );

  const addressField = mode === 'delivery' ? (
    <label className="cx-address-field">
      <MapPin size={15} aria-hidden="true" />
      <input
        value={address}
        onChange={(event) => setAddress(event.target.value)}
        placeholder="Enter the Delivery Address"
        aria-label="Delivery address"
        data-testid="input-delivery-address"
      />
      <ChevronRight size={16} aria-hidden="true" />
    </label>
  ) : null;

  const navLinks = (
    <>
      <Link href="/" onClick={() => setDrawerOpen(false)} data-testid="link-drawer-home">Home <ChevronRight size={16} /></Link>
      <Link href="/menu" onClick={() => setDrawerOpen(false)} data-testid="link-drawer-menu">Explore Menu <ChevronRight size={16} /></Link>
      <a href="/#app" onClick={() => setDrawerOpen(false)} data-testid="link-drawer-app">Download Our App <ChevronRight size={16} /></a>
      <a href="/#stories" onClick={() => setDrawerOpen(false)} data-testid="link-drawer-blogs">Blogs <ChevronRight size={16} /></a>
      <a href="/#offers" onClick={() => setDrawerOpen(false)} data-testid="link-drawer-offers">Special Offers &amp; News <ChevronRight size={16} /></a>
    </>
  );

  return (
    <header className="cx-header">
      <div className="cx-header-main">
        <div className="cx-brand-wrap">
          <button
            className="cx-menu-toggle"
            type="button"
            aria-label={drawerOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen((open) => !open)}
            data-testid="button-navigation-menu"
          >
            {drawerOpen ? <X size={21} /> : <MenuIcon size={21} />}
          </button>
          <Brand />
        </div>
        <div className="cx-desktop-controls">
          {orderMode}
          {searchField('cx-search-desktop')}
          {addressField}
        </div>
        <div className="cx-header-actions">
          <button
            className="cx-header-action cx-cart-action"
            type="button"
            aria-label={`Open cart, ${cartCount} items`}
            onClick={onOpenCart}
            data-testid="button-header-cart"
          >
            <ShoppingCart size={17} /> <span>CART</span><b className="cx-cart-badge">{cartCount}</b>
          </button>
          <button
            className="cx-header-action"
            type="button"
            onClick={() => onNotice({ title: 'Welcome to Underconstruction', body: 'Account sign-in is not connected in this front-end preview.' })}
            data-testid="button-header-login"
          >
            <UserRound size={16} /> <span>LOGIN</span>
          </button>
        </div>
      </div>
      <div className="cx-mobile-controls">
        {orderMode}
        {searchField('cx-search-mobile')}
        {addressField}
      </div>
      {drawerOpen && (
        <div className="cx-drawer-backdrop" onClick={() => setDrawerOpen(false)}>
          <nav className="cx-drawer" aria-label="Underconstruction navigation" onClick={(event) => event.stopPropagation()}>
            <div className="cx-drawer-heading">
              <strong>Explore Underconstruction</strong>
              <button type="button" aria-label="Close menu" onClick={() => setDrawerOpen(false)} data-testid="button-close-navigation"><X size={19} /></button>
            </div>
            {navLinks}
          </nav>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="cx-hero" aria-label="Now open in G-15, Islamabad">
      <div className="cx-hero-pattern" aria-hidden="true" />
      <div className="cx-hero-food"><img src="/food-pizza.jpg" alt="Loaded pizza" /></div>
      <div className="cx-hero-copy">
        <h1><span>NOW OPEN</span><strong>G-15, ISLAMABAD</strong></h1>
      </div>
      <div className="cx-hero-strip" />
    </section>
  );
}

function HomeMenuCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: -1 | 1) => {
    carouselRef.current?.scrollBy({ left: direction * 270, behavior: 'smooth' });
  };

  return (
    <section className="cx-home-menu cx-site-width" id="menu">
      <div className="cx-section-heading">
        <div><span className="cx-eyebrow">Good food, good mood</span><h2>Explore Menu</h2></div>
        <div className="cx-section-actions">
          <Link className="cx-view-all" href="/menu" data-testid="link-menu-view-all">VIEW ALL <ArrowRight size={14} /></Link>
          <div className="cx-carousel-arrows">
            <button type="button" aria-label="Scroll menu categories left" onClick={() => scroll(-1)} data-testid="button-carousel-left"><ChevronLeft size={18} /></button>
            <button type="button" aria-label="Scroll menu categories right" onClick={() => scroll(1)} data-testid="button-carousel-right"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>
      <div className="cx-home-category-carousel" ref={carouselRef}>
        {homeMenuCategories.map((category) => (
          <Link
            href={`/menu?category=${category.id}`}
            key={category.id}
            className="cx-home-category-card"
            data-testid={`link-home-category-${category.id}`}
          >
            <span className="cx-home-category-image"><img src={category.image} alt="" loading="lazy" /></span>
            <strong>{category.name}</strong>
          </Link>
        ))}
      </div>
    </section>
  );
}

function PromoCards() {
  const promos = [
    { image: '/food-pizza.jpg', alt: 'Freshly made pizza', caption: 'Freshly made and delivered with care' },
    { image: '/food-burger.jpg', alt: 'Burger made for sharing', caption: 'Made for sharing with your favorite people' },
    { image: '/food-wings.jpg', alt: 'Freshly prepared wings', caption: 'Fresh ingredients and plenty of flavor' },
  ];

  return (
    <section className="cx-promo-grid cx-site-width" aria-label="About Underconstruction">
      {promos.map((promo) => (
        <article className="cx-promo-card" key={promo.caption}>
          <img src={promo.image} alt={promo.alt} loading="lazy" />
          <p>{promo.caption}</p>
        </article>
      ))}
    </section>
  );
}

function AppBand() {
  return (
    <section className="cx-app-section cx-site-width" id="app">
      <div className="cx-app-panel">
        <div className="cx-app-background" aria-hidden="true" />
        <div className="cx-app-phone">
          <div className="cx-phone-mock" aria-label="Underconstruction mobile app preview">
            <div className="cx-phone-brand"><span>U</span><strong>Underconstruction</strong></div>
            <img className="cx-phone-feature-image" src="/food-pizza.jpg" alt="Pizza featured in the Underconstruction app preview" loading="lazy" />
            <div className="cx-phone-caption"><strong>Freshly made</strong><span>Explore today's menu</span></div>
            <div className="cx-phone-menu-pills"><span>Pizza</span><span>Burgers</span><span>Sides</span></div>
          </div>
        </div>
        <div className="cx-app-copy">
          <span className="cx-eyebrow">Underconstruction, wherever you are</span>
          <h2>Download Our<br />Mobile App</h2>
          <p>Elevate your experience by downloading our mobile app for seamless ordering experience.</p>
          <div className="cx-store-links">
            <a href="#app" aria-label="Google Play app listing"><span aria-hidden="true">▶</span><span>Google Play</span></a>
            <a href="#app" aria-label="Apple App Store listing"><span aria-hidden="true">A</span><span>App Store</span></a>
          </div>
        </div>
        <span className="cx-app-sticker" aria-hidden="true"><Pizza size={37} /></span>
      </div>
    </section>
  );
}

function Stories() {
  const stories = [
    { title: 'A little extra cheese makes every moment better', photo: '/food-pizza.jpg', date: 'UNDERCONSTRUCTION STORIES' },
    { title: 'Fresh flavors, made for sharing', photo: '/food-burger.jpg', date: 'FROM OUR KITCHEN' },
    { title: 'Find your next favorite bite', photo: '/food-wings.jpg', date: 'MENU SPOTLIGHT' },
  ];
  return (
    <section className="cx-stories cx-site-width" id="stories">
      <div className="cx-section-heading cx-simple-heading">
        <h2>Blogs</h2>
        <a className="cx-view-all" href="#stories" data-testid="link-blog-view-all">VIEW ALL <ArrowRight size={14} /></a>
      </div>
      <div className="cx-story-grid">
        {stories.map((story) => (
          <article className="cx-story-card" key={story.title}>
            <img src={story.photo} alt="" loading="lazy" />
            <div><span>{story.date}</span><h3>{story.title}</h3><a href="#stories">READ MORE <ArrowRight size={13} /></a></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Newsletter() {
  const form = useForm<NewsletterValues>({ defaultValues: { email: '' }, mode: 'onSubmit' });
  const [subscribed, setSubscribed] = useState(false);
  const subscribe = form.handleSubmit(({ email }) => {
    if (!email.trim()) return;
    setSubscribed(true);
    form.reset();
  });

  return (
    <section className="cx-newsletter" id="offers">
      <svg className="cx-newsletter-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 0h1440v45c-57 0-78 45-136 45s-62-59-118-59-66 85-132 85-81-68-148-68-72 58-132 58-65-83-128-83-76 91-140 91-71-67-137-67-74 45-136 45-92-47-151-47-75 43-129 43S51 54 0 54V0z" />
      </svg>
      <div className="cx-newsletter-inner cx-site-width">
        <div className="cx-newsletter-copy">
          <span className="cx-eyebrow">Stay in the loop</span>
          <h2>Special Offers &amp; News</h2>
          <p>Subscribe now for news, promotions and more delivered right to your inbox.</p>
          <Form {...form}>
            <form className="cx-newsletter-form" onSubmit={subscribe} noValidate>
              <FormField
                control={form.control}
                name="email"
                rules={{
                  required: 'Enter your email address.',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address.' },
                }}
                render={({ field }) => (
                  <FormItem className="cx-newsletter-field">
                    <FormControl>
                      <input type="email" placeholder="Your Email Address" aria-label="Email address" {...field} data-testid="input-newsletter-email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button type="submit" data-testid="button-newsletter-subscribe">
                {subscribed ? <><Check size={14} /> SUBSCRIBED</> : 'SUBSCRIBE'}
              </button>
            </form>
          </Form>
          {subscribed && <p className="cx-subscribe-status" role="status">Thanks for subscribing.</p>}
        </div>
        <div className="cx-newsletter-art" aria-hidden="true">
          <span>let’s talk<br /><strong>CHEEZY</strong></span><Megaphone size={96} strokeWidth={1.5} />
        </div>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <>
      <main className="cx-home">
        <Hero />
        <HomeMenuCarousel />
        <PromoCards />
        <AppBand />
        <Stories />
        <Newsletter />
      </main>
    </>
  );
}

function MenuTabs({ activeCategory, onSelect }: { activeCategory: string; onSelect: (id: string) => void }) {
  const tabsRef = useRef<HTMLDivElement>(null);

  return (
    <div className="cx-category-tabs-wrap">
      <button
        className="cx-tabs-arrow"
        type="button"
        aria-label="Scroll categories left"
        onClick={() => tabsRef.current?.scrollBy({ left: -260, behavior: 'smooth' })}
        data-testid="button-category-scroll-left"
      >
        <ChevronLeft size={18} />
      </button>
      <nav className="cx-category-tabs" aria-label="Menu categories" ref={tabsRef}>
        {menuCategories.map((category) => (
          <button
            key={category.id}
            className={activeCategory === category.id ? 'is-active' : ''}
            type="button"
            aria-current={activeCategory === category.id ? 'true' : undefined}
            onClick={() => onSelect(category.id)}
            data-testid={`button-category-${category.id}`}
          >
            {category.name}
          </button>
        ))}
      </nav>
      <button
        className="cx-tabs-arrow"
        type="button"
        aria-label="Scroll categories right"
        onClick={() => tabsRef.current?.scrollBy({ left: 260, behavior: 'smooth' })}
        data-testid="button-category-scroll-right"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

function ProductCard({
  item,
  liked,
  onLike,
  onAdd,
}: {
  item: MenuItem;
  liked: boolean;
  onLike: () => void;
  onAdd: () => void;
}) {
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
          <strong>{formatPrice(item.price)}</strong>
          {item.startingPrice && <span>Starting Price</span>}
        </div>
        <button className="cx-add-button" type="button" onClick={onAdd} data-testid={`button-add-${item.id}`}>
          <Plus size={15} /> ADD TO CART
        </button>
      </div>
    </article>
  );
}

function CartPanel({
  lines,
  total,
  overlay = false,
  onClose,
  onRemove,
  onIncrease,
  onCheckout,
}: {
  lines: CartLine[];
  total: number;
  overlay?: boolean;
  onClose?: () => void;
  onRemove: (id: string) => void;
  onIncrease: (id: string) => void;
  onCheckout: () => void;
}) {
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <aside className={`cx-cart-panel${overlay ? ' is-overlay-panel' : ''}`} role={overlay ? 'dialog' : 'complementary'} aria-modal={overlay || undefined} aria-labelledby="cx-cart-title">
      <div className="cx-cart-heading">
        <div><span>Your Underconstruction order</span><h2 id="cx-cart-title">Your Cart <small>({itemCount})</small></h2></div>
        {onClose && <button className="cx-cart-close" type="button" aria-label="Close cart" onClick={onClose} data-testid="button-close-cart"><X size={19} /></button>}
      </div>
      {lines.length > 0 ? (
        <>
          <div className="cx-cart-lines">
            {lines.map(({ item, quantity }) => (
              <article className="cx-cart-line" key={item.id} data-testid={`row-cart-${item.id}`}>
                <img src={item.image} alt="" />
                <div className="cx-cart-line-main">
                  <strong>{item.name}</strong>
                  <span>Regular · {formatPrice(item.price)}</span>
                  <div className="cx-quantity-row">
                    <span>Qty: {quantity}</span>
                    <button type="button" aria-label={`Add one ${item.name}`} onClick={() => onIncrease(item.id)} data-testid={`button-increase-${item.id}`}><Plus size={14} /></button>
                  </div>
                </div>
                <div className="cx-cart-line-side">
                  <strong>{formatPrice(item.price * quantity)}</strong>
                  <button type="button" className="cx-remove-item" aria-label={`Remove ${item.name}`} onClick={() => onRemove(item.id)} data-testid={`button-remove-${item.id}`}><Trash2 size={15} /></button>
                </div>
              </article>
            ))}
          </div>
          <div className="cx-cart-summary">
            <div><span>Total</span><strong>{formatPrice(total)}</strong></div>
            <p>Prices are shown for preview only.</p>
            <button className="cx-checkout-button" type="button" onClick={onCheckout} data-testid="button-checkout">CHECKOUT <ArrowRight size={16} /></button>
          </div>
        </>
      ) : (
        <div className="cx-empty-cart" data-testid="status-cart-empty">
          <div className="cx-empty-bag"><ShoppingBag size={39} /><Frown size={19} /></div>
          <strong>YOUR CART IS EMPTY</strong>
          <p>Go ahead and explore top categories.</p>
          {onClose && <button type="button" onClick={onClose} data-testid="button-empty-cart-menu">EXPLORE MENU</button>}
        </div>
      )}
    </aside>
  );
}

function MobileCartBar({ count, total, onOpen }: { count: number; total: number; onOpen: () => void }) {
  return (
    <button className="cx-mobile-cart-bar" type="button" onClick={onOpen} data-testid="button-mobile-cart-bar">
      <span className="cx-mobile-cart-count"><ShoppingCart size={17} /> {count} {count === 1 ? 'ITEM' : 'ITEMS'}</span>
      <strong>{count ? formatPrice(total) : 'VIEW CART'}</strong>
      <ArrowRight size={17} />
    </button>
  );
}

function MenuPage({
  searchQuery,
  lines,
  total,
  onAdd,
  onOpenCart,
  onRemove,
  onIncrease,
  onCheckout,
}: {
  searchQuery: string;
  lines: CartLine[];
  total: number;
  onAdd: (item: MenuItem) => void;
  onOpenCart: () => void;
  onRemove: (id: string) => void;
  onIncrease: (id: string) => void;
  onCheckout: () => void;
}) {
  const [activeCategory, setActiveCategory] = useState(menuCategories[0].id);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const query = searchQuery.trim().toLowerCase();
  const matchingItems = useMemo(
    () => menuItems.filter((item) => !query || `${item.name} ${item.description} ${item.categoryId}`.toLowerCase().includes(query)),
    [query],
  );

  const selectCategory = (id: string) => {
    setActiveCategory(id);
    document.getElementById(`cx-category-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('category');
    if (requested && menuCategories.some((category) => category.id === requested)) {
      setActiveCategory(requested);
      window.setTimeout(() => document.getElementById(`cx-category-${requested}`)?.scrollIntoView({ block: 'start' }), 80);
    }
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-cx-category]'));
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        const next = visible?.target.getAttribute('data-cx-category');
        if (next) setActiveCategory(next);
      },
      { rootMargin: '-150px 0px -68% 0px', threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [matchingItems.length]);

  const count = lines.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <main className="cx-menu-page">
      <div className="cx-menu-intro cx-site-width">
        <div><span className="cx-eyebrow">The good stuff</span><h1>Explore Menu</h1></div>
        <p>Made fresh. Made to share. Find your next favorite.</p>
      </div>
      <MenuTabs activeCategory={activeCategory} onSelect={selectCategory} />
      <div className="cx-menu-layout cx-site-width">
        <div className="cx-menu-results">
          {query && <div className="cx-search-summary"><Search size={15} /> Results for “{searchQuery}” <span>{matchingItems.length} items</span></div>}
          {matchingItems.length === 0 ? (
            <p className="cx-no-results" role="status">No menu items match “{searchQuery}”. Try another search.</p>
          ) : (
            menuCategories.map((category: MenuCategory) => {
              const categoryItems = matchingItems.filter((item) => item.categoryId === category.id);
              if (!categoryItems.length) return null;
              return (
                <section
                  className="cx-menu-category"
                  id={`cx-category-${category.id}`}
                  data-cx-category={category.id}
                  key={category.id}
                >
                  <div className="cx-menu-category-heading">
                    <div><span className="cx-eyebrow">Underconstruction menu</span><h2>{category.name}</h2></div>
                    <span>{categoryItems.length} items</span>
                  </div>
                  <div className="cx-products-grid">
                    {categoryItems.map((item) => (
                      <ProductCard
                        item={item}
                        key={item.id}
                        liked={Boolean(favorites[item.id])}
                        onLike={() => setFavorites((current) => ({ ...current, [item.id]: !current[item.id] }))}
                        onAdd={() => onAdd(item)}
                      />
                    ))}
                  </div>
                </section>
              );
            })
          )}
        </div>
        <div className="cx-desktop-cart">
          <CartPanel lines={lines} total={total} onRemove={onRemove} onIncrease={onIncrease} onCheckout={onCheckout} />
        </div>
      </div>
      <MobileCartBar count={count} total={total} onOpen={onOpenCart} />
    </main>
  );
}

function Footer({ onNotice }: { onNotice: (notice: Notice) => void }) {
  return (
    <footer className="cx-footer">
      <div className="cx-footer-brand"><span aria-hidden="true">U</span><strong>Underconstruction</strong></div>
      <p>Underconstruction Copyright © 2026. All Rights Reserved.</p>
      <div>
        <button type="button" onClick={() => onNotice({ title: 'Terms & Conditions', body: 'This preview does not connect to the Underconstruction terms service.' })} data-testid="button-terms">TERMS &amp; CONDITIONS</button>
        <span>|</span>
        <button type="button" onClick={() => onNotice({ title: 'Privacy Policy', body: 'This preview does not connect to the Underconstruction privacy service.' })} data-testid="button-privacy">PRIVACY POLICY</button>
      </div>
    </footer>
  );
}

function OrderNow() {
  return <Link className="cx-order-now" href="/menu" data-testid="link-order-now">ORDER NOW <ArrowRight size={16} /></Link>;
}

function AddLoading({ item }: { item: MenuItem | null }) {
  if (!item) return null;
  return (
    <div className="cx-loading-backdrop" role="status" aria-live="polite" aria-label={`Adding ${item.name}`}>
      <div className="cx-loading-card"><Pizza size={42} /><strong>Adding to your order</strong><span>Please wait a moment</span></div>
    </div>
  );
}

function VariationModal({
  item,
  selected,
  onSelect,
  onClose,
  onAdd,
}: {
  item: MenuItem | null;
  selected: boolean;
  onSelect: () => void;
  onClose: () => void;
  onAdd: () => void;
}) {
  useEffect(() => {
    if (!item) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [item, onClose]);

  if (!item) return null;
  return (
    <div className="cx-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="cx-variation-modal" role="dialog" aria-modal="true" aria-labelledby="cx-modal-title">
        <button className="cx-modal-close" type="button" aria-label="Close item options" onClick={onClose} data-testid="button-close-item-modal"><X size={21} /></button>
        <div className="cx-modal-image"><img src={item.image} alt={item.name} /></div>
        <div className="cx-modal-content">
          <span className="cx-modal-category">{menuCategories.find((category) => category.id === item.categoryId)?.name}</span>
          <h2 id="cx-modal-title">{item.name}</h2>
          <p>{item.description || 'A tasty extra to add to your order.'}</p>
          <strong className="cx-modal-price">{formatPrice(item.price)}</strong>
          <div className="cx-variation-heading"><h3>Choose Your Variation</h3><span>REQUIRED</span></div>
          <label className={`cx-variation-option${selected ? ' is-selected' : ''}`}>
            <input type="radio" name="menu-variation" checked={selected} onChange={onSelect} data-testid="radio-variation-regular" />
            <span className="cx-custom-radio" />
            <span>Regular</span>
            <strong>{formatPrice(item.price)}</strong>
          </label>
          <button className="cx-modal-add" type="button" disabled={!selected} onClick={onAdd} data-testid="button-confirm-add">
            ADD TO CART <span>{formatPrice(item.price)}</span>
          </button>
        </div>
      </section>
    </div>
  );
}

function CartOverlay({
  open,
  lines,
  total,
  onClose,
  onRemove,
  onIncrease,
  onCheckout,
}: {
  open: boolean;
  lines: CartLine[];
  total: number;
  onClose: () => void;
  onRemove: (id: string) => void;
  onIncrease: (id: string) => void;
  onCheckout: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="cx-cart-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <CartPanel
        lines={lines}
        total={total}
        overlay
        onClose={onClose}
        onRemove={onRemove}
        onIncrease={onIncrease}
        onCheckout={onCheckout}
      />
    </div>
  );
}

function NoticeDialog({ notice, onClose }: { notice: Notice; onClose: () => void }) {
  useEffect(() => {
    if (!notice) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [notice, onClose]);

  if (!notice) return null;
  return (
    <div className="cx-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="cx-notice-modal" role="dialog" aria-modal="true" aria-labelledby="cx-notice-title">
        <button type="button" className="cx-modal-close" aria-label="Close message" onClick={onClose} data-testid="button-close-notice"><X size={20} /></button>
        <span className="cx-eyebrow">Underconstruction</span>
        <h2 id="cx-notice-title">{notice.title}</h2>
        <p>{notice.body}</p>
        <button className="cx-notice-ok" type="button" onClick={onClose} data-testid="button-notice-ok">GOT IT</button>
      </section>
    </div>
  );
}

function NotFoundPage() {
  return (
    <main className="cx-not-found">
      <Pizza size={42} />
      <h1>We couldn’t find that page</h1>
      <p>Head back to the menu and find something cheezy.</p>
      <Link href="/menu" className="cx-notice-ok" data-testid="link-not-found-menu">EXPLORE MENU</Link>
    </main>
  );
}

function AppShell() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<Record<string, number>>(readCartFromStorage);
  const [cartOpen, setCartOpen] = useState(false);
  const [loadingItem, setLoadingItem] = useState<MenuItem | null>(null);
  const [modalItem, setModalItem] = useState<MenuItem | null>(null);
  const [selectedVariation, setSelectedVariation] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const addTimer = useRef<number | null>(null);

  const lines = useMemo(
    () => menuItems.flatMap((item) => {
      const quantity = cart[item.id] ?? 0;
      return quantity > 0 ? [{ item, quantity }] : [];
    }),
    [cart],
  );
  const cartCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const cartTotal = lines.reduce((sum, line) => sum + line.item.price * line.quantity, 0);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    document.body.style.overflow = cartOpen || Boolean(modalItem) || Boolean(loadingItem) || Boolean(notice) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [cartOpen, modalItem, loadingItem, notice]);

  useEffect(() => () => {
    if (addTimer.current !== null) window.clearTimeout(addTimer.current);
  }, []);

  useEffect(() => {
    const isMenu = location.split('?')[0] === '/menu';
    document.title = isMenu ? 'Menu | Underconstruction' : 'Underconstruction | Fresh Food, Made to Share';
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) {
      description.content = isMenu
        ? 'Browse the Underconstruction menu: pizzas, burgers, pasta, starters, sides and more.'
        : 'Explore Underconstruction pizzas, burgers, sides, special offers, and stories made for sharing.';
    }
  }, [location]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.trim() && location.split('?')[0] !== '/menu') setLocation('/menu');
  };

  const beginAdd = (item: MenuItem) => {
    if (addTimer.current !== null) window.clearTimeout(addTimer.current);
    setLoadingItem(item);
    addTimer.current = window.setTimeout(() => {
      setLoadingItem(null);
      setModalItem(item);
      setSelectedVariation(false);
      addTimer.current = null;
    }, 600);
  };

  const addSelectedItem = () => {
    if (!modalItem || !selectedVariation) return;
    setCart((current) => ({ ...current, [modalItem.id]: (current[modalItem.id] ?? 0) + 1 }));
    setModalItem(null);
    setSelectedVariation(false);
  };

  const increaseItem = (id: string) => {
    setCart((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }));
  };

  const removeItem = (id: string) => {
    setCart((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  };

  const checkoutNotice = () => setNotice({
    title: 'Checkout is a preview',
    body: 'Your cart is saved in this browser, but payments and order placement are not connected.',
  });

  return (
    <>
      <Header
        cartCount={cartCount}
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onOpenCart={() => setCartOpen(true)}
        onNotice={setNotice}
      />
      <Switch>
        <Route path="/">
          <HomePage />
        </Route>
        <Route path="/menu">
          <MenuPage
            searchQuery={searchQuery}
            lines={lines}
            total={cartTotal}
            onAdd={beginAdd}
            onOpenCart={() => setCartOpen(true)}
            onRemove={removeItem}
            onIncrease={increaseItem}
            onCheckout={checkoutNotice}
          />
        </Route>
        <Route component={NotFoundPage} />
      </Switch>
      <Footer onNotice={setNotice} />
      <OrderNow />
      <CartOverlay
        open={cartOpen}
        lines={lines}
        total={cartTotal}
        onClose={() => setCartOpen(false)}
        onRemove={removeItem}
        onIncrease={increaseItem}
        onCheckout={checkoutNotice}
      />
      <AddLoading item={loadingItem} />
      <VariationModal
        item={modalItem}
        selected={selectedVariation}
        onSelect={() => setSelectedVariation(true)}
        onClose={() => { setModalItem(null); setSelectedVariation(false); }}
        onAdd={addSelectedItem}
      />
      <NoticeDialog notice={notice} onClose={() => setNotice(null)} />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <AppShell />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </ErrorBoundary>
  );
}

export default App;
