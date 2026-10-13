import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CalendarDays, Camera, Check, ChevronRight, Copy, Heart, MapPin, Plus, Trash2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/auth/AuthContext';
import { ProductCard } from '@/components/ProductCard';
import type { MenuItem } from '@/data/menu';

type AccountTab = 'profile' | 'orders' | 'favorites' | 'addresses' | 'promos';
const tabDetails: { id: AccountTab; label: string }[] = [
  { id: 'profile', label: 'EDIT PROFILE' },
  { id: 'orders', label: 'ORDER HISTORY' },
  { id: 'favorites', label: 'FAVOURITES' },
  { id: 'addresses', label: 'SAVED ADDRESSES' },
  { id: 'promos', label: 'PROMOS' },
];
const money = (value: number) => `PKR ${Math.round(value).toLocaleString('en-US')}`;
const promoCards = [
  { code: 'WELCOME100', title: 'A little welcome treat', detail: 'Take Rs. 100 off your first order.' },
  { code: 'CHEEZY10', title: 'More to share', detail: 'Save 10% on your order.' },
];

export function AccountPage({
  menuItems,
  onAdd,
  onToggleFavorite,
}: {
  menuItems: MenuItem[];
  onAdd: (item: MenuItem) => void;
  onToggleFavorite: (id: string) => void;
}) {
  const [location, setLocation] = useLocation();
  const { userPhone, profile, updateProfile, orders, favorites, savedAddresses, selectedAddress, selectAddress, addAddress, removeAddress } = useAuth();
  const selectedTab = new URLSearchParams(location.split('?')[1] ?? '').get('tab');
  const [tab, setTab] = useState<AccountTab>(selectedTab === 'orders' ? 'orders' : 'profile');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [toast, setToast] = useState('');
  const [copiedCode, setCopiedCode] = useState('');
  const form = useForm<{ name: string; dob: string }>({ defaultValues: { name: profile.name, dob: profile.dob }, mode: 'onChange' });
  const addressForm = useForm<{ address: string }>({ defaultValues: { address: '' }, mode: 'onChange' });
  const { reset } = form;
  const watchedName = form.watch('name') ?? '';
  const watchedDob = form.watch('dob') ?? '';
  const addressValue = addressForm.watch('address') ?? '';
  const changed = watchedName !== profile.name || watchedDob !== profile.dob;
  const likedItems = menuItems.filter((item) => favorites.includes(item.id));

  useEffect(() => {
    reset({ name: profile.name, dob: profile.dob });
  }, [profile.name, profile.dob, reset]);
  useEffect(() => {
    if (selectedTab === 'orders' || selectedTab === 'favorites' || selectedTab === 'addresses' || selectedTab === 'promos') {
      setTab(selectedTab);
    } else if (!selectedTab || selectedTab === 'profile') {
      setTab('profile');
    }
  }, [selectedTab]);
  useEffect(() => {
    if (!avatarPreview) return;
    return () => URL.revokeObjectURL(avatarPreview);
  }, [avatarPreview]);
  useEffect(() => {
    if (!userPhone) setAvatarPreview('');
  }, [userPhone]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const changeTab = (next: AccountTab) => {
    setTab(next);
    setLocation(next === 'profile' ? '/account' : `/account?tab=${next}`);
  };
  const saveProfile = form.handleSubmit((values) => {
    updateProfile({ name: values.name.trim(), dob: values.dob });
    setToast('Profile updated');
  });
  const addSavedAddress = addressForm.handleSubmit(({ address }) => {
    const value = address.trim();
    if (!value) return;
    addAddress(value);
    addressForm.reset({ address: '' });
  });
  const copyPromo = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
    } catch {
      setCopiedCode(`Select and copy: ${code}`);
    }
  };

  return (
    <main className="cx-account-page">
      <div className="cx-account-width">
        <div className="cx-account-heading"><span>Underconstruction / Account</span><h1>My Account</h1><p>Your details, past orders and the things you love.</p></div>
        <div className="cx-account-tabs" role="tablist" aria-label="Account sections" data-testid="tabs-account">
          {tabDetails.map(({ id, label }) => <button type="button" role="tab" aria-selected={tab === id} className={tab === id ? 'is-active' : ''} key={id} onClick={() => changeTab(id)} data-testid={`tab-account-${id}`}>{label}</button>)}
        </div>
        {tab === 'profile' && (
          <section className="cx-account-panel" role="tabpanel" data-testid="panel-account-profile">
            <div className="cx-account-panel-title"><div><span>YOUR DETAILS</span><h2>Edit Profile</h2></div></div>
            <div className="cx-avatar-field">
              <div className="cx-account-avatar" data-testid="img-account-avatar">
                {avatarPreview ? <img src={avatarPreview} alt="Your profile preview" /> : <span>{profile.name.trim() ? profile.name.trim().slice(0, 1).toUpperCase() : 'U'}</span>}
              <label htmlFor="cx-avatar-upload" aria-label="Choose a profile picture" data-testid="label-avatar-upload"><Camera size={16} /></label>
              </div>
              <input id="cx-avatar-upload" type="file" accept="image/*" className="cx-visually-hidden" onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) setAvatarPreview(URL.createObjectURL(file));
              }} data-testid="input-avatar-file" />
              <p>Your photo is previewed for this session only.</p>
            </div>
            <Form {...form}>
              <form className="cx-profile-form" onSubmit={saveProfile}>
                <FormField control={form.control} name="name" rules={{ required: 'Please enter your name.' }} render={({ field }) => (
                  <FormItem className="cx-account-field"><label htmlFor="account-name">Full Name</label><FormControl><input {...field} id="account-name" placeholder="Enter your full name" data-testid="input-profile-name" /></FormControl></FormItem>
                )} />
                <div className="cx-account-field"><label htmlFor="account-phone">Phone Number</label><div className="cx-readonly-phone"><span>+92</span><input id="account-phone" value={userPhone || 'Sign in to add a phone number'} readOnly aria-readonly="true" data-testid="input-profile-phone" /></div></div>
                <FormField control={form.control} name="dob" render={({ field }) => (
                  <FormItem className="cx-account-field"><label htmlFor="account-dob">Date of Birthday</label><div className="cx-date-field"><FormControl><input {...field} id="account-dob" type="date" data-testid="input-profile-dob" /></FormControl><CalendarDays size={17} aria-hidden="true" /></div></FormItem>
                )} />
                <button className="cx-checkout-primary cx-profile-submit" type="submit" disabled={!changed} data-testid="button-update-profile">UPDATE</button>
              </form>
            </Form>
          </section>
        )}
        {tab === 'orders' && (
          <section className="cx-account-panel" role="tabpanel" data-testid="panel-account-orders">
            <div className="cx-account-panel-title"><div><span>FROM OUR KITCHEN</span><h2>Order History</h2></div></div>
            {orders.length ? <div className="cx-order-history">
              {orders.map((order) => <Link href={`/receipt/${order.id}`} className="cx-order-card" key={order.id} data-testid={`card-order-${order.id}`}>
                <div className="cx-order-card-top"><strong>{order.id}</strong><span>{order.status}</span></div>
                <time>{new Date(order.createdAt).toLocaleString('en-PK', { dateStyle: 'medium', timeStyle: 'short' })}</time>
                <p>{order.items.map((item) => `${item.quantity} × ${item.name}`).join(' · ')}</p>
                <div className="cx-order-card-bottom"><b>{money(order.total)}</b><span>View receipt <ChevronRight size={16} /></span></div>
              </Link>)}
            </div> : <div className="cx-account-empty" data-testid="status-orders-empty"><span>01</span><h3>No orders here yet</h3><p>Your next favorite meal is waiting.</p><Link className="cx-checkout-primary" href="/menu" data-testid="link-orders-menu">EXPLORE MENU</Link></div>}
          </section>
        )}
        {tab === 'favorites' && (
          <section className="cx-account-panel" role="tabpanel" data-testid="panel-account-favorites">
            <div className="cx-account-panel-title"><div><span>KEEP YOUR REGULARS CLOSE</span><h2>Favourites</h2></div></div>
            {likedItems.length ? <div className="cx-products-grid cx-account-favorites">{likedItems.map((item) => <ProductCard key={item.id} item={item} liked onLike={() => onToggleFavorite(item.id)} onAdd={() => onAdd(item)} />)}</div> : <div className="cx-account-empty" data-testid="status-favorites-empty"><Heart size={27} /><h3>No favourites yet</h3><p>Tap the heart on a menu item to save it here.</p><Link className="cx-checkout-primary" href="/menu" data-testid="link-favorites-menu">EXPLORE MENU</Link></div>}
          </section>
        )}
        {tab === 'addresses' && (
          <section className="cx-account-panel" role="tabpanel" data-testid="panel-account-addresses">
            <div className="cx-account-panel-title"><div><span>WHERE SHOULD WE GO?</span><h2>Saved Addresses</h2></div></div>
            <div className="cx-account-address-list" role="radiogroup" aria-label="Saved addresses">
              {savedAddresses.map((address, index) => <div className="cx-account-address" key={address} data-testid={`row-account-address-${index}`}>
                <label><input type="radio" name="saved-address" checked={selectedAddress === address} onChange={() => selectAddress(address)} data-testid={`radio-account-address-${index}`} /><span className="cx-address-choice"><MapPin size={18} /></span><span>{address}</span></label>
                <button type="button" aria-label={`Delete address ${address}`} onClick={() => removeAddress(address)} data-testid={`button-delete-address-${index}`}><Trash2 size={17} /></button>
              </div>)}
            </div>
            <Form {...addressForm}>
              <form className="cx-account-add-address" onSubmit={addSavedAddress}>
                <label htmlFor="account-new-address">Add a new address</label>
                <div>
                  <FormField control={addressForm.control} name="address" render={({ field }) => (
                    <FormItem className="cx-account-address-field-control"><FormControl><input {...field} id="account-new-address" placeholder="House, street, area and city" data-testid="input-account-address" /></FormControl></FormItem>
                  )} />
                  <button type="submit" disabled={!addressValue.trim()} aria-label="Add address" data-testid="button-account-add-address"><Plus size={18} /> ADD</button>
                </div>
              </form>
            </Form>
          </section>
        )}
        {tab === 'promos' && (
          <section className="cx-account-panel" role="tabpanel" data-testid="panel-account-promos">
            <div className="cx-account-panel-title"><div><span>A LITTLE SOMETHING EXTRA</span><h2>Promos</h2></div></div>
            <div className="cx-promo-codes">
              {promoCards.map((promo) => <article className="cx-promo-code-card" key={promo.code} data-testid={`card-promo-${promo.code.toLowerCase()}`}>
                <span className="cx-promo-ticket">UNDERCONSTRUCTION OFFER</span><h3>{promo.title}</h3><p>{promo.detail}</p>
                <div className="cx-promo-code-line"><strong>{promo.code}</strong><button type="button" onClick={() => void copyPromo(promo.code)} data-testid={`button-copy-${promo.code.toLowerCase()}`}>{copiedCode === promo.code ? <><Check size={15} /> COPIED</> : copiedCode.startsWith('Select and copy') && promo.code === copiedCode.split(': ')[1] ? 'COPY CODE' : <><Copy size={15} /> COPY</>}</button></div>
                {copiedCode === `Select and copy: ${promo.code}` && <small role="status" data-testid="status-copy-fallback">{copiedCode}</small>}
              </article>)}
            </div>
          </section>
        )}
        {toast && <div className="cx-profile-toast" role="status" data-testid="status-profile-updated"><Check size={17} /> {toast}</div>}
      </div>
    </main>
  );
}
