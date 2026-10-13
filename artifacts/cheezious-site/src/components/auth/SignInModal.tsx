import { useEffect, useRef, useState, type ClipboardEvent } from 'react';
import { Check, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { UnderconstructionBrand } from '@/components/UnderconstructionBrand';
import { useAuth } from '@/auth/AuthContext';
import type { AuthToastTone } from './AuthToast';

type PhoneForm = { phone: string };
type SignInStep = 'phone' | 'captcha' | 'otp';
const DEMO_CODE = '123456';
const OTP_DURATION_SECONDS = 90;

export function SignInModal({
  open,
  mode,
  onClose,
  onNeedAddress,
  onComplete,
  onToast,
}: {
  open: boolean;
  mode: 'delivery' | 'pickup';
  onClose: () => void;
  onNeedAddress: () => void;
  onComplete: () => void;
  onToast: (message: string, tone: AuthToastTone) => void;
}) {
  const { logIn } = useAuth();
  const [step, setStep] = useState<SignInStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [captchaChecking, setCaptchaChecking] = useState(false);
  const [captchaReady, setCaptchaReady] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpSeconds, setOtpSeconds] = useState(OTP_DURATION_SECONDS);
  const [otpError, setOtpError] = useState('');
  const otpInputs = useRef<Array<HTMLInputElement | null>>([]);
  const captchaTimer = useRef<number | null>(null);
  const phoneForm = useForm<PhoneForm>({ defaultValues: { phone: '' }, mode: 'onChange' });
  const currentPhone = phoneForm.watch('phone') ?? '';
  const isPhoneValid = /^3\d{9}$/.test(currentPhone);

  useEffect(() => {
    if (captchaTimer.current !== null) {
      window.clearTimeout(captchaTimer.current);
      captchaTimer.current = null;
    }
    if (!open) return;
    setStep('phone');
    setPhoneNumber('');
    setCaptchaChecked(false);
    setCaptchaChecking(false);
    setCaptchaReady(false);
    setOtpDigits(['', '', '', '', '', '']);
    setOtpSeconds(OTP_DURATION_SECONDS);
    setOtpError('');
    phoneForm.reset({ phone: '' });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || step !== 'otp') return;
    const timer = window.setInterval(() => setOtpSeconds((remaining) => Math.max(0, remaining - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [open, step]);

  useEffect(() => () => {
    if (captchaTimer.current !== null) window.clearTimeout(captchaTimer.current);
  }, []);

  const sendOtp = phoneForm.handleSubmit(({ phone }) => {
    setPhoneNumber(phone);
    setStep('captcha');
    setCaptchaChecked(false);
    setCaptchaReady(false);
  });

  const changeCaptcha = (checked: boolean) => {
    setCaptchaChecked(checked);
    setCaptchaReady(false);
    setCaptchaChecking(checked);
    if (captchaTimer.current !== null) window.clearTimeout(captchaTimer.current);
    if (checked) {
      captchaTimer.current = window.setTimeout(() => {
        setCaptchaChecking(false);
        setCaptchaReady(true);
        captchaTimer.current = null;
      }, 700);
    } else {
      setCaptchaChecking(false);
    }
  };

  const completeCaptcha = () => {
    if (!captchaReady) return;
    setOtpDigits(['', '', '', '', '', '']);
    setOtpSeconds(OTP_DURATION_SECONDS);
    setOtpError('');
    setStep('otp');
    onToast('OTP is sent to customer phone number Successfully (demo code 123456)', 'success');
    window.setTimeout(() => otpInputs.current[0]?.focus(), 0);
  };

  const verifyOtp = (code: string) => {
    if (code !== DEMO_CODE) {
      setOtpError('That code is not correct. Please try again.');
      return;
    }
    setOtpError('');
    logIn(phoneNumber);
    if (mode === 'pickup') onComplete();
    else onNeedAddress();
  };

  const updateOtpDigit = (index: number, rawValue: string) => {
    const numericValue = rawValue.replace(/\D/g, '');
    const next = [...otpDigits];
    if (numericValue.length > 1) {
      numericValue.slice(0, next.length - index).split('').forEach((digit, offset) => {
        next[index + offset] = digit;
      });
      setOtpDigits(next);
      setOtpError('');
      otpInputs.current[Math.min(index + numericValue.length, next.length - 1)]?.focus();
      if (next.every(Boolean)) window.setTimeout(() => verifyOtp(next.join('')), 20);
      return;
    }
    const digit = numericValue.slice(-1);
    next[index] = digit;
    setOtpDigits(next);
    setOtpError('');
    if (digit && index < next.length - 1) otpInputs.current[index + 1]?.focus();
    if (next.every(Boolean)) window.setTimeout(() => verifyOtp(next.join('')), 20);
  };

  const pasteOtp = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    const next = ['', '', '', '', '', ''];
    pasted.forEach((digit, index) => { next[index] = digit; });
    setOtpDigits(next);
    setOtpError('');
    otpInputs.current[Math.min(pasted.length, 5)]?.focus();
    if (pasted.length === 6) window.setTimeout(() => verifyOtp(next.join('')), 20);
  };

  const resendOtp = () => {
    setOtpSeconds(OTP_DURATION_SECONDS);
    setOtpDigits(['', '', '', '', '', '']);
    setOtpError('');
    otpInputs.current[0]?.focus();
    onToast('OTP is sent to customer phone number Successfully (demo code 123456)', 'success');
  };

  if (!open) return null;
  const timeLabel = `0${Math.floor(otpSeconds / 60)}:${String(otpSeconds % 60).padStart(2, '0')}`;

  return (
    <div className="cx-auth-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="cx-signin-modal" role="dialog" aria-modal="true" aria-labelledby="cx-signin-title" data-testid="modal-sign-in">
        <button className="cx-auth-close" type="button" aria-label="Close sign in" onClick={onClose} data-testid="button-close-sign-in"><X size={20} /></button>
        <UnderconstructionBrand className="cx-auth-brand" />
        {step === 'phone' && (
          <>
            <h2 id="cx-signin-title">Please Sign-In to Place an Order</h2>
            <p className="cx-auth-subtitle">Please enter your phone number</p>
            <Form {...phoneForm}>
              <form className="cx-phone-form" onSubmit={sendOtp} noValidate>
                <div className="cx-phone-input-row">
                  <span className="cx-country-code">+92</span>
                  <FormField
                    control={phoneForm.control}
                    name="phone"
                    rules={{
                      required: 'Please enter your phone number.',
                      pattern: { value: /^3\d{9}$/, message: 'Enter 10 digits starting with 3.' },
                    }}
                    render={({ field }) => (
                      <FormItem className="cx-phone-form-item">
                        <FormControl>
                          <input
                            {...field}
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            placeholder="301xxxxxxx"
                            aria-label="Phone number"
                            autoComplete="tel-national"
                            data-testid="input-auth-phone"
                            onChange={(event) => field.onChange(event.target.value.replace(/\D/g, '').slice(0, 10))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <button className="cx-auth-primary" type="submit" disabled={!isPhoneValid} data-testid="button-send-otp">SEND OTP</button>
              </form>
            </Form>
          </>
        )}
        {step === 'captcha' && (
          <>
            <h2 id="cx-signin-title">Confirm you’re human</h2>
            <p className="cx-auth-subtitle">Complete this quick check to continue.</p>
            <label className="cx-captcha-box">
              <input
                type="checkbox"
                checked={captchaChecked}
                onChange={(event) => changeCaptcha(event.target.checked)}
                data-testid="checkbox-fake-captcha"
              />
              <span className="cx-fake-checkbox">{captchaChecking ? <span className="cx-captcha-spinner" /> : captchaChecked ? <Check size={19} /> : null}</span>
              <span>I’m not a robot</span>
              <span className="cx-captcha-brand"><span aria-hidden="true">↻</span> CAPTCHA</span>
            </label>
            <button className="cx-auth-primary" type="button" disabled={!captchaReady} onClick={completeCaptcha} data-testid="button-complete-captcha">
              COMPLETE CAPTCHA
            </button>
          </>
        )}
        {step === 'otp' && (
          <>
            <h2 id="cx-signin-title">Enter One Time Pin</h2>
            <p className="cx-auth-subtitle">We have sent an OTP to your phone number +92 {phoneNumber}</p>
            <div className="cx-otp-inputs" role="group" aria-label="Six digit one time pin">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => { otpInputs.current[index] = element; }}
                  value={digit}
                  onChange={(event) => updateOtpDigit(index, event.target.value)}
                  onPaste={pasteOtp}
                  onKeyDown={(event) => {
                    if (event.key === 'Backspace') {
                      event.preventDefault();
                      const next = [...otpDigits];
                      const targetIndex = otpDigits[index] ? index : Math.max(0, index - 1);
                      next[targetIndex] = '';
                      setOtpDigits(next);
                      setOtpError('');
                      otpInputs.current[targetIndex]?.focus();
                    }
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete={index === 0 ? 'one-time-code' : 'off'}
                  maxLength={1}
                  aria-label={`OTP digit ${index + 1}`}
                  data-testid={`input-otp-${index + 1}`}
                />
              ))}
            </div>
            {otpError && <p className="cx-otp-error" role="alert" data-testid="error-otp">{otpError}</p>}
            <div className="cx-otp-footer">
              <p>Didn’t Receive OTP Code? <button type="button" disabled={otpSeconds > 0} onClick={resendOtp} data-testid="button-resend-otp">Resend</button></p>
              <span className="cx-otp-timer" aria-label={`Resend available in ${timeLabel}`}>{timeLabel}</span>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
