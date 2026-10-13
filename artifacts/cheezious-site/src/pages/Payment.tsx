import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, MapPin, Store, Tag } from 'lucide-react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import type { OrderMode } from '@/auth/AuthContext';
import { BillSummary, type CheckoutLine } from './Basket';

type PaymentMethod = 'Cash on Delivery' | 'Debit/Credit Card' | 'JazzCash';
const methods: { name: PaymentMethod; rate: number; hint: string }[] = [
  { name: 'Cash on Delivery', rate: 15, hint: 'Pay when your order arrives' },
  { name: 'Debit/Credit Card', rate: 5, hint: 'Demo selection — no payment will be taken' },
  { name: 'JazzCash', rate: 5, hint: 'Demo selection — no payment will be taken' },
];
const money = (value: number) => `PKR ${Math.round(value).toLocaleString('en-US')}`;

export function PaymentPage({
  lines,
  subtotal,
  mode,
  address,
  recipientName,
  onBack,
  onEditAddress,
  onConfirm,
}: {
  lines: CheckoutLine[];
  subtotal: number;
  mode: OrderMode;
  address: string;
  recipientName: string;
  onBack: () => void;
  onEditAddress: () => void;
  onConfirm: (data: { paymentMethod: PaymentMethod; instructions: string; discount: number; tax: number; taxRate: number; voucherCode?: string }) => void;
}) {
  const [, setLocation] = useLocation();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery');
  const [voucherExpanded, setVoucherExpanded] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [voucherError, setVoucherError] = useState('');
  const [instructions, setInstructions] = useState('');
  const voucherForm = useForm<{ code: string }>({ defaultValues: { code: '' }, mode: 'onSubmit' });
  const selectedRate = methods.find((method) => method.name === paymentMethod)?.rate ?? 15;
  const tax = Math.round(Math.max(0, subtotal - discount) * selectedRate / 100);
  const total = subtotal - discount + tax;

  useEffect(() => {
    if (!lines.length) setLocation('/basket');
  }, [lines.length, setLocation]);

  const applyVoucher = voucherForm.handleSubmit(({ code }) => {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'WELCOME100') {
      setDiscount(Math.min(100, subtotal));
      setVoucherCode(normalized);
      setVoucherError('');
      return;
    }
    if (normalized === 'CHEEZY10') {
      setDiscount(Math.round(subtotal * 0.1));
      setVoucherCode(normalized);
      setVoucherError('');
      return;
    }
    setDiscount(0);
    setVoucherCode('');
    setVoucherError('That voucher code is not valid. Please try another.');
  });

  if (!lines.length) return null;
  return (
    <main className="cx-checkout-page">
      <div className="cx-checkout-width">
        <button className="cx-checkout-back" type="button" onClick={onBack} data-testid="button-payment-back"><ArrowLeft size={19} /><span>Order Confirmation</span></button>
        <div className="cx-checkout-columns">
          <section className="cx-checkout-maincol">
            <section className="cx-payment-address">
              <div className="cx-payment-address-head"><h2>{mode === 'delivery' ? 'Delivery Address' : 'Pick-up Location'}</h2><button type="button" onClick={onEditAddress} data-testid="button-payment-edit-address">EDIT</button></div>
              <div className="cx-payment-address-content">
                {mode === 'delivery' ? <MapPin size={19} /> : <Store size={19} />}
                <div><strong>{mode === 'delivery' ? (recipientName || 'Deliver to') : 'Underconstruction G-15'}</strong><span>{mode === 'delivery' ? (address || 'Select your delivery address') : 'G-15, Islamabad'}</span></div>
              </div>
            </section>
            <section className="cx-payment-methods">
              <h2>Payment Method</h2>
              {methods.map(({ name, rate, hint }) => {
                const amount = subtotal - discount + Math.round(Math.max(0, subtotal - discount) * rate / 100);
                return (
                  <label className={`cx-payment-option${paymentMethod === name ? ' is-selected' : ''}`} key={name} data-testid={`option-payment-${name.toLowerCase().replace(/[^a-z]+/g, '-')}`}>
                    <input type="radio" name="payment-method" value={name} checked={paymentMethod === name} onChange={() => setPaymentMethod(name)} data-testid={`input-payment-${name.toLowerCase().replace(/[^a-z]+/g, '-')}`} />
                    <span className="cx-payment-radio" />
                    <span className="cx-payment-option-copy"><strong>{name}</strong><small>{rate}% tax · {hint}</small></span>
                    <b>{money(amount)}</b>
                  </label>
                );
              })}
            </section>
            <section className={`cx-voucher-card${voucherExpanded ? ' is-expanded' : ''}`}>
              <button type="button" className="cx-voucher-toggle" onClick={() => setVoucherExpanded((open) => !open)} aria-expanded={voucherExpanded} data-testid="button-voucher-expand">
                <span><Tag size={19} /><strong>Apply a voucher</strong></span><span>{voucherCode || 'ADD CODE'}</span>
              </button>
              {voucherExpanded && (
                <Form {...voucherForm}>
                  <form className="cx-voucher-form" onSubmit={applyVoucher}>
                    <FormField control={voucherForm.control} name="code" render={({ field }) => (
                      <FormItem className="cx-voucher-form-field"><FormControl><input {...field} onChange={(event) => { field.onChange(event); setVoucherError(''); }} aria-label="Voucher code" placeholder="Enter voucher code" data-testid="input-voucher-code" /></FormControl></FormItem>
                    )} />
                    <button type="submit" data-testid="button-apply-voucher">APPLY</button>
                    {voucherError && <p role="alert" data-testid="status-voucher-error">{voucherError}</p>}
                    {voucherCode && <p className="cx-voucher-success" role="status" data-testid="status-voucher-applied">{voucherCode} applied. You saved {money(discount)}.</p>}
                  </form>
                </Form>
              )}
            </section>
            <section className="cx-instructions">
              <label htmlFor="cx-delivery-instructions">Delivery Instructions</label>
              <p>Are there any specific delivery instructions?</p>
              <textarea id="cx-delivery-instructions" value={instructions} onChange={(event) => setInstructions(event.target.value)} placeholder="Additional notes for your delivery..." data-testid="input-delivery-instructions" />
            </section>
          </section>
          <aside className="cx-bill-column">
            <BillSummary subtotal={subtotal} discount={discount} taxRate={selectedRate} tax={tax} />
            <button className="cx-checkout-sticky" type="button" onClick={() => onConfirm({ paymentMethod, instructions, discount, tax, taxRate: selectedRate, voucherCode: voucherCode || undefined })} data-testid="button-confirm-order">
              <span className="cx-action-total"><strong>RS. {Math.round(total).toLocaleString('en-US')}</strong><small>{paymentMethod}</small></span>
              <span className="cx-action-label">CONFIRM ORDER <ArrowRight size={16} /></span>
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
