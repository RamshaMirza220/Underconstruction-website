import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import {
  ArrowDown, ArrowRight, ArrowUpRight, Bike, Check, ChevronDown, Clock3,
  Crosshair, MapPin, Menu, Pizza, ShoppingBag, Smartphone, Store, X,
} from 'lucide-react';

const queryClient = new QueryClient();

type Notice = { title: string; body: string; eyebrow?: string } | null;

const menuItems = [
  { name: 'Crown Crust', description: 'A golden crown, filled with creamy cheese and all the good stuff.', category: 'Pizza', tag: 'Cheezy classic', photo: '/food-pizza.jpg', note: 'Stuffed crust' },
  { name: 'Crispy Chicken Burger', description: 'Crunchy, saucy, melty. The kind of burger that needs both hands.', category: 'Burgers', tag: 'Fan favourite', photo: '/food-burger.jpg', note: 'Big bite energy' },
  { name: 'Flamin’ Wings', description: 'Juicy wings tossed in a bold, sticky, finger-licking glaze.', category: 'Sides', tag: 'A little heat', photo: '/food-wings.jpg', note: 'Hot & saucy' },
  { name: 'Loaded Fries', description: 'Crispy fries, a generous cheese blanket, and a little kick.', category: 'Sides', tag: 'Share if you dare', photo: '/food-fries.jpg', note: 'Extra loaded' },
];
const categories = ['All the good stuff', 'Pizza', 'Burgers', 'Sides'];

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="Cheezious home">
      <span className="brand-mark"><Pizza size={27} strokeWidth={2.4} /></span>
      <span className="brand-name">cheezious<small>KHUSHIYAN SERVED HOT</small></span>
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

function Header({ onNotice }: { onNotice: (notice: Notice) => void }) {
  const [mode, setMode] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="site-header" id="top">
      <div className="page-shell header-inner">
        <Brand />
        <div className="order-controls">
          <div className="order-mode" aria-label="Choose order type">
            <button className={`mode-btn${mode === 'delivery' ? ' selected' : ''}`} onClick={() => setMode('delivery')}><Bike size={14} /> Delivery</button>
            <button className={`mode-btn${mode === 'pickup' ? ' selected' : ''}`} onClick={() => setMode('pickup')}><Store size={14} /> Pick-up</button>
          </div>
          <label className="address-box">
            {mode === 'delivery' ? <MapPin size={17} /> : <Crosshair size={17} />}
            <input aria-label="Delivery address or city" value={address} onChange={(event) => setAddress(event.target.value)} placeholder={mode === 'delivery' ? 'Enter your delivery area' : 'Choose a nearby branch'} />
            <ChevronDown size={15} />
          </label>
        </div>
        <div className="header-actions">
          <button className="cart-btn" onClick={() => onNotice({ eyebrow: 'Your bag', title: 'Nothing in your bag yet', body: 'Your next cheesy favourite is just around the corner. Explore the menu and find your new go-to.' })}><ShoppingBag size={16} /> Your cart</button>
          <button className="login-btn" onClick={() => onNotice({ eyebrow: 'Welcome to Cheezious', title: 'Good food brings us together', body: 'This is a preview of the Cheezious homepage. Sign-in and ordering are not part of this demo.' })}>Log in</button>
          <button className="mobile-menu" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
        </div>
      </div>
      {menuOpen && <nav className="mobile-nav page-shell" aria-label="Mobile navigation">
        <div className="mobile-order-controls">
          <div className="order-mode" aria-label="Choose order type">
            <button className={`mode-btn${mode === 'delivery' ? ' selected' : ''}`} onClick={() => setMode('delivery')}><Bike size={14} /> Delivery</button>
            <button className={`mode-btn${mode === 'pickup' ? ' selected' : ''}`} onClick={() => setMode('pickup')}><Store size={14} /> Pick-up</button>
          </div>
          <label className="address-box">
            {mode === 'delivery' ? <MapPin size={17} /> : <Crosshair size={17} />}
            <input aria-label="Delivery address or city" value={address} onChange={(event) => setAddress(event.target.value)} placeholder={mode === 'delivery' ? 'Enter your delivery area' : 'Choose a nearby branch'} />
            <ChevronDown size={15} />
          </label>
        </div>
        <a href="#menu" onClick={() => setMenuOpen(false)}>Explore menu <ArrowRight size={14} /></a><a href="#app" onClick={() => setMenuOpen(false)}>Our app <ArrowRight size={14} /></a><a href="#stories" onClick={() => setMenuOpen(false)}>Stories <ArrowRight size={14} /></a><a href="#offers" onClick={() => setMenuOpen(false)}>Offers & news <ArrowRight size={14} /></a>
      </nav>}
    </header>
  );
}

function Hero() {
  return (
    <section className="hero page-shell" aria-label="Cheezious promotion">
      <div className="hero-frame">
        <div className="hero-copy">
          <div className="hero-kicker"><span>Hot, fresh & full of khushi</span></div>
          <h1>Good times.<br /><em>Extra cheese.</em></h1>
          <p>Pizza nights, crispy bites, and all the little moments that taste better together. Made fresh, delivered with love.</p>
          <div className="hero-bottom">
            <a className="button" href="#menu">Explore the menu <ArrowRight size={16} /></a>
            <span className="hero-note"><Clock3 size={15} /> Freshly made, always</span>
          </div>
        </div>
        <div className="hero-stamp"><div><strong>100%<br />KHUSHI</strong><span>IN EVERY BITE</span></div></div>
        <div className="hero-dots" aria-label="Promotion 1 of 3"><span /><span /><span /></div>
      </div>
    </section>
  );
}

function PromoCards() {
  const promos = [
    { overline: 'At your door, with a smile', title: <>Delivering<br />cheezy khushiyan</> },
    { overline: 'Growing together', title: <>Fastest Growing<br />Brand of the Year</> },
    { overline: 'Good food starts here', title: <>Fresh, local<br />ingredients & love</> },
  ];
  return <div className="page-shell promo-grid">{promos.map((item) => (
    <article className="promo-card" key={item.overline}><div className="promo-text"><small>{item.overline}</small><h3>{item.title}</h3></div></article>
  ))}</div>;
}

function MenuSection({ onNotice }: { onNotice: (notice: Notice) => void }) {
  const [category, setCategory] = useState(categories[0]);
  const filtered = category === categories[0] ? menuItems : menuItems.filter((item) => item.category === category);
  return (
    <section className="page-shell menu-section section-pad" id="menu">
      <div className="section-topline">
        <div><div className="eyebrow">A menu full of moments</div><h2 className="section-heading">Explore the <span>menu.</span></h2><p className="section-intro">Big flavours, proper portions, and all the cheesy goodness you came for.</p></div>
        <div className="menu-tabs" role="tablist" aria-label="Menu categories">{categories.map((item) => <button key={item} role="tab" aria-selected={category === item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div>
      </div>
      <div className="menu-grid">{filtered.map((item) => <article className="menu-card" key={item.name}>
        <div className="menu-photo"><img src={item.photo} alt={item.name} /><span className="menu-photo-label">{item.tag}</span></div>
        <div className="menu-info"><h3>{item.name}</h3><p>{item.description}</p><div className="menu-footer"><span>{item.note}</span><span>Made for sharing</span></div></div>
      </article>)}</div>
      <div className="menu-action"><button className="button button-dark" onClick={() => onNotice({ eyebrow: 'Our menu', title: 'There’s more to love', body: 'Explore our full range of pizzas, burgers, sides, and sweet treats at a Cheezious near you.' })}>See what else is cooking <ArrowRight size={15} /></button></div>
    </section>
  );
}

function AppBand({ onNotice }: { onNotice: (notice: Notice) => void }) {
  return (
    <section className="app-band" id="app">
      <div className="page-shell app-inner">
        <div className="app-copy">
          <div className="eyebrow">Khushi, one tap away</div>
          <h2>Cheezious in your pocket.</h2>
          <p>Your favourites, your way. Get the Cheezious app for the latest offers and an even easier way to bring everyone to the table.</p>
          <div className="store-buttons">
            <button className="store-button" onClick={() => onNotice({ eyebrow: 'Coming right up', title: 'Find us in your app store', body: 'The Cheezious app links will be available here when the live site is connected.' })}><Smartphone size={19} /><span>Download on the<strong>App Store</strong></span></button>
            <button className="store-button" onClick={() => onNotice({ eyebrow: 'Coming right up', title: 'Find us in your app store', body: 'The Cheezious app links will be available here when the live site is connected.' })}><ArrowDown size={19} /><span>GET IT ON<strong>Google Play</strong></span></button>
          </div>
        </div>
        <div className="phone-scene" aria-hidden="true"><span className="app-spark">Good stuff!</span><div className="phone"><div className="phone-notch" /><div className="phone-head">cheezious<small>MADE FOR YOUR KIND OF HUNGER</small></div><div className="phone-pizza" /><div className="phone-line" /><div className="phone-line short" /></div></div>
      </div>
    </section>
  );
}

function Stories() {
  const stories = [
    { tag: 'Community', title: 'A little extra cheese. A lot more joy.', copy: 'The best meals are the ones that bring everybody to the table.', photo: '/food-pizza.jpg', date: 'OUR STORY' },
    { tag: 'Behind the bite', title: 'Freshness you can taste in every bite.', copy: 'Local ingredients, generous toppings, and care in every kitchen.', photo: '/food-fries.jpg', date: 'MADE WITH LOVE' },
    { tag: 'The Cheezious way', title: 'Good food. Great company. Always.', copy: 'Here’s to the shared slices and stories that stay with you.', photo: '/food-burger.jpg', date: 'GOOD TIMES' },
  ];
  return (
    <section className="page-shell blog-section section-pad" id="stories">
      <div className="blog-heading-row"><div><div className="eyebrow">A little something to read</div><h2 className="section-heading">From our <span>kitchen.</span></h2></div><a className="button button-dark" href="#offers">All stories <ArrowRight size={15} /></a></div>
      <div className="blog-grid">{stories.map((story) => <article className="blog-card" key={story.title}><div className="blog-img"><img src={story.photo} alt="" /><span className="blog-date">{story.date}</span></div><div className="blog-body"><small>{story.tag}</small><h3>{story.title}</h3><p>{story.copy}</p><a href="#offers" className="text-link">Read the story <ArrowUpRight size={13} /></a></div></article>)}</div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setStatus('Thanks for joining the Cheezious family.');
    setEmail('');
  };
  return (
    <section className="newsletter" id="offers">
      <div className="page-shell newsletter-inner">
        <div><div className="eyebrow">Stay in the loop</div><h2>Special offers & news.</h2><p>Good news, fresh from our kitchen. No spam, just the good stuff.</p></div>
        <form className="newsletter-form" onSubmit={submit}><input type="email" required aria-label="Email address" placeholder="Your email address" value={email} onChange={(event) => { setEmail(event.target.value); setStatus(''); }} /><button type="submit">{status ? <><Check size={15} /> Joined</> : 'Sign me up'}</button></form>
        {status && <div className="newsletter-status" role="status">{status}</div>}
      </div>
    </section>
  );
}

function Footer({ onNotice }: { onNotice: (notice: Notice) => void }) {
  const show = (label: string) => onNotice({ eyebrow: 'Cheezious', title: label, body: 'Thanks for checking in. This page is a front-end preview of the Cheezious homepage.' });
  return (
    <footer className="site-footer">
      <div className="page-shell">
        <div className="footer-main">
          <div className="footer-brand"><Brand /><p>Cheezy goodness, crispy favourites, and a whole lot of khushi. Proudly bringing people together, one bite at a time.</p><div className="socials"><a href="#top" aria-label="Instagram">in</a><a href="#top" aria-label="Facebook">f</a><a href="#top" aria-label="TikTok">tk</a></div></div>
          <div className="footer-col"><h4>Hungry?</h4><a href="#menu">Explore menu</a><a href="#offers">Special offers</a><a href="#app">Get the app</a></div>
          <div className="footer-col"><h4>Our world</h4><a href="#stories">Our story</a><button onClick={() => show('Find your nearest Cheezious')}>Find a location</button><button onClick={() => show('Get in touch')}>Contact us</button></div>
          <div className="footer-col"><h4>Say hello</h4><button onClick={() => show('Questions? We’re listening.')}>We’re here to help</button><button onClick={() => show('Careers at Cheezious')}>Join our team</button><button onClick={() => show('Franchise with us')}>Franchise</button></div>
        </div>
        <div className="footer-legal"><span>© 2025 Cheezious. Made with love, served with cheese.</span><div className="legal-links"><button onClick={() => show('Privacy policy')}>Privacy policy</button><button onClick={() => show('Terms & conditions')}>Terms & conditions</button></div></div>
      </div>
    </footer>
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
  const closeNotice = () => setNotice(null);
  return (
    <>
      <LoadingScreen />
      <Header onNotice={setNotice} />
      <main>
        <Hero />
        <PromoCards />
        <MenuSection onNotice={setNotice} />
        <AppBand onNotice={setNotice} />
        <Stories />
        <Newsletter />
      </main>
      <Footer onNotice={setNotice} />
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
