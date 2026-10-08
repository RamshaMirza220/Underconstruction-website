import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import {
  ArrowRight, Award, Bike, Check, ChevronRight, MapPin, Megaphone, Menu,
  Pizza, Plus, Search, ShoppingCart, Store, UserRound, X,
} from 'lucide-react';

const queryClient = new QueryClient();

type Notice = { title: string; body: string; eyebrow?: string } | null;

type MenuCategory = 'Pizzas' | 'Burgers' | 'Pasta' | 'Deals';
type MenuItem = {
  id: string;
  name: string;
  description: string;
  category: MenuCategory;
  price: number;
  photo: string;
  tag: string;
};

const menuItems: MenuItem[] = [
  { id: 'cheezious-special', name: 'Cheezious Special', description: 'Chicken, black olives, sausages and bell pepper under a generous layer of cheese.', category: 'Pizzas', price: 1480, photo: '/food-pizza.jpg', tag: 'Cheezy Treats' },
  { id: 'behari-kabab', name: 'Behari Kabab', description: 'Smoky, tender kabab with a desi spice blend, onions and melty cheese.', category: 'Pizzas', price: 1480, photo: '/food-pizza.jpg', tag: 'Local favourite' },
  { id: 'sausage-pizza', name: 'Sausage Pizza', description: 'Chicken sausages, pizza sauce and a classic cheese pull in every slice.', category: 'Pizzas', price: 660, photo: '/food-pizza.jpg', tag: 'Cheezy classic' },
  { id: 'reggy-burger', name: 'Reggy Burger', description: 'A crispy chicken fillet, fresh lettuce and creamy house sauce.', category: 'Burgers', price: 380, photo: '/food-burger.jpg', tag: 'A quick favourite' },
  { id: 'bazinga-burger', name: 'Bazinga Burger', description: 'Crunchy chicken, cool lettuce and a bold, creamy sauce in a soft bun.', category: 'Burgers', price: 540, photo: '/food-burger.jpg', tag: 'Crispy & saucy' },
  { id: 'bazinga-supreme', name: 'Bazinga Supreme', description: 'A bigger, bolder chicken burger layered with cheese and signature sauce.', category: 'Burgers', price: 800, photo: '/food-burger.jpg', tag: 'Big bite' },
  { id: 'crunchy-chicken-pasta', name: 'Crunchy Chicken Pasta', description: 'Creamy pasta with golden crunchy chicken and a savoury cheesy finish.', category: 'Pasta', price: 850, photo: '/food-pasta.svg', tag: 'Comfort food' },
  { id: 'fettuccine-alfredo', name: 'Fettuccine Alfredo Pasta', description: 'Silky Alfredo sauce, tender chicken and fettuccine tossed until creamy.', category: 'Pasta', price: 990, photo: '/food-pasta.svg', tag: 'Rich & creamy' },
  { id: 'small-pizza-deal', name: 'Small Pizza Deal', description: 'Pick a Local or Sooper flavour and pair it with a chilled regular drink.', category: 'Deals', price: 1290, photo: '/food-pizza.jpg', tag: 'Easy pick' },
  { id: 'bazinga-pair', name: 'Bazinga Pair Deal', description: 'Two Bazinga burgers, regular fries and two regular drinks to share.', category: 'Deals', price: 1150, photo: '/food-burger.jpg', tag: 'For two' },
  { id: 'bazinga-chicken-feast', name: 'Chicken Feast Deal', description: 'Two Bazinga burgers, two chicken pieces, large fries and two drinks.', category: 'Deals', price: 1550, photo: '/food-wings.jpg', tag: 'A table full' },
  { id: 'triple-bazinga-deal', name: 'Triple Bazinga Deal', description: 'Three Bazinga burgers, large fries and a one-litre drink for the crew.', category: 'Deals', price: 1750, photo: '/food-burger.jpg', tag: 'Made to share' },
];
const categories = ['All', 'Pizzas', 'Burgers', 'Pasta', 'Deals'] as const;
type CategoryFilter = (typeof categories)[number];

const formatPrice = (price: number) => `Rs. ${price.toLocaleString('en-PK')}`;

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="Cheezious home">
      <span className="brand-mark"><Pizza size={27} strokeWidth={2.4} /></span>
      <span className="brand-name">Cheezious</span>
    </a>
  );
}

function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 350);
    return () => window.clearTimeout(timer);
  }, []);
  return (
    <div className={`loading-screen${visible ? '' : ' is-gone'}`} aria-hidden={!visible}>
      <div className="loader-brand">
        <div className="loader-pizza" />
        <div className="loader-wordmark">chee<span>zious</span></div>
      </div>
    </div>
  );
}

function Header({
  onNotice,
  cartCount,
  searchQuery,
  onSearch,
  onOpenCart,
}: {
  onNotice: (notice: Notice) => void;
  cartCount: number;
  searchQuery: string;
  onSearch: (value: string) => void;
  onOpenCart: () => void;
}) {
  const [mode, setMode] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const orderMode = (
    <div className="order-mode" aria-label="Choose order type">
      <button className={`mode-btn${mode === 'delivery' ? ' selected' : ''}`} onClick={() => setMode('delivery')}><MapPin size={14} /> Delivery</button>
      <button className={`mode-btn${mode === 'pickup' ? ' selected' : ''}`} onClick={() => setMode('pickup')}><Store size={14} /> Pick-up</button>
    </div>
  );
  const searchField = (
    <label className="cheez-search">
      <Search size={16} aria-hidden="true" />
      <input aria-label="Search the Cheezious menu" type="search" value={searchQuery} onChange={(event) => onSearch(event.target.value)} placeholder="Find in cheezious" />
    </label>
  );
  const addressField = mode === 'delivery' ? (
    <label className="cheez-address">
      <MapPin size={16} aria-hidden="true" />
      <input aria-label="Delivery address" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Enter the Delivery Address" />
      <ChevronRight size={16} aria-hidden="true" />
    </label>
  ) : null;
  return (
    <header className="cheez-header" id="top">
      <div className="cheez-header-row">
        <div className="brand-nav-wrap">
          <button className="menu-trigger" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Brand />
        </div>
        <div className="desktop-controls">
          {orderMode}
          {searchField}
          {addressField}
        </div>
        <div className="header-actions">
          <button className="cart-btn" onClick={onOpenCart} aria-label={`Open cart, ${cartCount} items`}>
            <ShoppingCart size={16} /><span>CART</span><span className="cart-count">{cartCount}</span>
          </button>
          <button className="login-btn" onClick={() => onNotice({ eyebrow: 'Welcome to Cheezious', title: 'Good food brings us together', body: 'This page is a front-end preview. Account sign-in is not connected.' })}><UserRound size={15} /> LOGIN</button>
        </div>
      </div>
      <div className="mobile-controls">
        {orderMode}
        {searchField}
        {addressField}
      </div>
      {menuOpen && <div className="drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setMenuOpen(false); }}>
        <nav className="mobile-drawer" aria-label="Cheezious navigation">
          <div className="drawer-heading"><span>Explore Cheezious</span><button aria-label="Close menu" onClick={() => setMenuOpen(false)}><X size={19} /></button></div>
          <a href="#menu" onClick={() => setMenuOpen(false)}>Explore Menu <ChevronRight size={16} /></a>
          <a href="#app" onClick={() => setMenuOpen(false)}>Download Our App <ChevronRight size={16} /></a>
          <a href="#stories" onClick={() => setMenuOpen(false)}>Blogs <ChevronRight size={16} /></a>
          <a href="#offers" onClick={() => setMenuOpen(false)}>Special Offers & News <ChevronRight size={16} /></a>
        </nav>
      </div>}
    </header>
  );
}

function Hero() {
  return (
    <section className="hero-banner" aria-label="Now open in G-15, Islamabad">
      <div className="hero-pattern" aria-hidden="true" />
      <div className="hero-food" aria-hidden="true"><img src="/food-pizza.jpg" alt="" /></div>
      <div className="hero-copy">
        <h1><span>NOW OPEN</span><strong>G-15, ISLAMABAD</strong></h1>
      </div>
      <div className="hero-orange-strip" />
    </section>
  );
}

function PromoCards({ onOrder }: { onOrder: () => void }) {
  const promos = [
    { className: 'delivery', overline: 'DELIVERING', graphic: 'CHEEZY\\nKHUSHIYAN', caption: 'Delivering cheezy khushiyan', icon: <Bike size={54} strokeWidth={1.6} /> },
    { className: 'award', overline: 'THE BRAND OF', graphic: 'CHEEZY\\nHEARTS', caption: 'Fastest Growing Brand of the Year', icon: <Award size={58} strokeWidth={1.6} /> },
    { className: 'local', overline: 'FOR THE LOVE OF', graphic: 'LOCAL\\nFLAVORS', caption: 'Made with fresh, local ingredients and love', icon: <Pizza size={54} strokeWidth={1.6} /> },
  ];
  return <section className="promo-strip site-width" aria-label="Why Cheezious">
    {promos.map((item, index) => <article className="promo-tile" key={item.caption}>
      <div className={`promo-art promo-art-${item.className}`}>
        <span className="promo-art-overline">{item.overline}</span>
        <strong>{item.graphic.split('\\n').map((line) => <span key={line}>{line}</span>)}</strong>
        <span className="promo-art-icon">{item.icon}</span>
        {index === 2 && <button className="promo-order-tab" onClick={onOrder}>ORDER NOW</button>}
      </div>
      <p>{item.caption}</p>
    </article>)}
  </section>;
}

function MenuSection({
  searchQuery,
  onAddToCart,
}: {
  searchQuery: string;
  onAddToCart: (item: MenuItem) => void;
}) {
  const [category, setCategory] = useState<CategoryFilter>('All');
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filtered = menuItems.filter((item) => {
    const categoryMatches = category === 'All' || item.category === category;
    const searchMatches = !normalizedSearch || `${item.name} ${item.description} ${item.category}`.toLowerCase().includes(normalizedSearch);
    return categoryMatches && searchMatches;
  });
  return (
    <section className="menu-area site-width" id="menu">
      <div className="menu-title-row">
        <h2>Explore Menu</h2>
        <div className="menu-heading-actions">
          <button className="text-action" onClick={() => setCategory('All')}>VIEW ALL</button>
          <a className="order-action" href="#menu-grid">ORDER NOW</a>
        </div>
      </div>
      <div className="category-pills" role="tablist" aria-label="Menu categories">
        {categories.map((item) => <button key={item} role="tab" aria-selected={category === item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}
      </div>
      {filtered.length ? <div className="food-grid" id="menu-grid">
        {filtered.map((item) => <article className="food-card" key={item.id}>
          <div className="food-card-image"><img src={item.photo} alt={item.name} /><span>{item.category}</span></div>
          <div className="food-card-info">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <div className="food-card-bottom">
              <strong>{formatPrice(item.price)}</strong>
              <button aria-label={`Add ${item.name} to cart`} title={`Add ${item.name} to cart`} onClick={() => onAddToCart(item)}><Plus size={17} /></button>
            </div>
          </div>
        </article>)}
      </div> : <p className="menu-empty">No menu items match “{searchQuery}”. Try another search.</p>}
    </section>
  );
}

function AppBand() {
  return (
    <section className="app-promo-section site-width" id="app">
      <div className="app-promo-panel">
        <div className="phone-scene" aria-hidden="true">
          <div className="phone">
            <div className="phone-notch" />
            <div className="phone-head">chee<span>zious</span><small>GOOD FOOD, ONE TAP AWAY</small></div>
            <div className="phone-pizza" />
            <div className="phone-mini-grid"><span /><span /><span /></div>
            <div className="phone-line" /><div className="phone-line short" />
          </div>
        </div>
        <div className="app-copy">
          <div className="app-copy-heading"><span className="eyebrow">Cheezious, wherever you are</span><h2>Download Our<br />Mobile App</h2></div>
          <p>Elevate your experience by downloading our mobile app for seamless ordering experience.</p>
          <div className="app-social-row" aria-label="Join the Cheezious community">
            <span className="app-avatar avatar-one">S</span><span className="app-avatar avatar-two">A</span><span className="app-avatar avatar-three">M</span><span className="app-avatar avatar-four">H</span><a href="#menu" aria-label="Explore the menu"><ArrowRight size={17} /></a>
          </div>
          <div className="store-buttons" aria-label="App download badges">
            <a className="store-button" href="#app"><span className="store-symbol">▶</span><span>GET IT ON<strong>Google Play</strong></span></a>
            <a className="store-button" href="#app"><span className="store-symbol">●</span><span>Download on the<strong>App Store</strong></span></a>
          </div>
        </div>
        <div className="app-pizza-sticker" aria-hidden="true"><Pizza size={42} /></div>
      </div>
    </section>
  );
}

function Stories() {
  const stories = [
    { title: 'Burgers Beyond Borders: Iconic Fast-Food Classics', photo: '/food-burger.jpg', date: '11 JUN 2026' },
    { title: 'The joy of bringing local flavours to the table', photo: '/food-pizza.jpg', date: '24 JUL 2026' },
    { title: 'A little extra cheese makes every moment better', photo: '/food-fries.jpg', date: '09 AUG 2026' },
  ];
  return (
    <section className="blogs-section site-width" id="stories">
      <div className="blogs-heading"><h2>Blogs</h2><a className="text-action" href="#stories">VIEW ALL</a></div>
      <div className="blogs-grid">{stories.map((story) => <article className="blog-tile" key={story.title}>
        <img src={story.photo} alt="" /><time>{story.date}</time><h3>{story.title}</h3>
      </article>)}</div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setStatus('Thanks for subscribing');
    setEmail('');
  };
  return (
    <section className="newsletter-section" id="offers">
      <svg className="newsletter-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 0h1440v45c-57 0-78 45-136 45s-62-59-118-59-66 85-132 85-81-68-148-68-72 58-132 58-65-83-128-83-76 91-140 91-71-67-137-67-74 45-136 45-92-47-151-47-75 43-129 43S51 54 0 54V0z" />
      </svg>
      <div className="newsletter-content site-width">
        <div className="newsletter-copy">
          <h2>Special Offers &amp; News</h2>
          <p>Subscribe now for news, promotions and more delivered right to your inbox.</p>
          <form className="newsletter-form" onSubmit={submit}>
            <input type="email" required aria-label="Email address" placeholder="Your Email Address" value={email} onChange={(event) => { setEmail(event.target.value); setStatus(''); }} />
            <button type="submit">{status ? <><Check size={14} /> SUBSCRIBED</> : 'SUBSCRIBE'}</button>
          </form>
          {status && <div className="newsletter-status" role="status">{status}</div>}
        </div>
        <div className="newsletter-graphic" aria-hidden="true"><Megaphone size={102} strokeWidth={1.4} /><span>let’s talk<br /><strong>CHEEZY</strong></span></div>
      </div>
    </section>
  );
}

function Footer({ onNotice }: { onNotice: (notice: Notice) => void }) {
  const show = (label: string) => onNotice({ eyebrow: 'Cheezious', title: label, body: 'This page is a front-end preview. This link is not connected to an account or policy service.' });
  return (
    <footer className="simple-footer">
      <a className="footer-logo-mark" href="#top" aria-label="Cheezious home"><Pizza size={18} /></a>
      <p>© Cheezious. Copyright © 2024 All Rights Reserved.</p>
      <div><button onClick={() => show('Terms & Conditions')}>TERMS &amp; CONDITIONS</button><span>|</span><button onClick={() => show('Privacy Policy')}>PRIVACY POLICY</button></div>
    </footer>
  );
}

function CartDrawer({
  cart,
  onClose,
}: {
  cart: Record<string, number>;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  const items = menuItems.filter((item) => (cart[item.id] ?? 0) > 0);
  const total = items.reduce((sum, item) => sum + item.price * (cart[item.id] ?? 0), 0);
  return (
    <div className="cart-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <aside className="cart-panel" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <div className="cart-panel-heading">
          <div><span>Your Cheezious order</span><h2 id="cart-title">Your Cart <small>({items.reduce((count, item) => count + cart[item.id], 0)})</small></h2></div>
          <button aria-label="Close cart" onClick={onClose}><X size={20} /></button>
        </div>
        {items.length ? <>
          <div className="cart-line-items">{items.map((item) => <div className="cart-line" key={item.id}>
            <img src={item.photo} alt="" />
            <div><strong>{item.name}</strong><span>{cart[item.id] ?? 0} × {formatPrice(item.price)}</span></div>
            <b>{formatPrice(item.price * (cart[item.id] ?? 0))}</b>
          </div>)}</div>
          <div className="cart-subtotal"><span>Subtotal</span><strong>{formatPrice(total)}</strong></div>
          <p className="cart-preview-note">Ordering is a front-end preview; checkout is not connected.</p>
        </> : <div className="cart-empty"><ShoppingCart size={30} /><strong>Your cart is empty</strong><span>Add a favourite from the menu to get started.</span><button onClick={onClose}>EXPLORE MENU</button></div>}
      </aside>
    </div>
  );
}

function NoticeDialog({ notice, onClose }: { notice: Notice; onClose: () => void }) {
  useEffect(() => {
    if (!notice) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [notice, onClose]);
  if (!notice) return null;
  return <div className="notice-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="notice-card" role="dialog" aria-modal="true" aria-labelledby="notice-title"><button className="notice-close" aria-label="Close dialog" onClick={onClose}><X size={18} /></button><div className="notice-label">{notice.eyebrow ?? 'Cheezious'}</div><h3 id="notice-title">{notice.title}</h3><p>{notice.body}</p><button className="button button-dark" onClick={onClose}>Got it <ArrowRight size={14} /></button></section></div>;
}

function Home() {
  const [notice, setNotice] = useState<Notice>(null);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const closeNotice = () => setNotice(null);
  const addToCart = (item: MenuItem) => setCart((current) => ({ ...current, [item.id]: (current[item.id] ?? 0) + 1 }));
  return (
    <>
      <LoadingScreen />
      <Header onNotice={setNotice} cartCount={cartCount} searchQuery={searchQuery} onSearch={setSearchQuery} onOpenCart={() => setCartOpen(true)} />
      <main>
        <Hero />
        <PromoCards onOrder={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })} />
        <MenuSection searchQuery={searchQuery} onAddToCart={addToCart} />
        <AppBand />
        <Stories />
        <Newsletter />
      </main>
      <Footer onNotice={setNotice} />
      {cartOpen && <CartDrawer cart={cart} onClose={() => setCartOpen(false)} />}
      <NoticeDialog notice={notice} onClose={closeNotice} />
    </>
  );
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;
