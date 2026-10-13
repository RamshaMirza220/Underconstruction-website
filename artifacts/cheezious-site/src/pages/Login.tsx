import { ArrowLeft, Phone } from 'lucide-react';
import { Link } from 'wouter';
import { UnderconstructionBrand } from '@/components/UnderconstructionBrand';

export function LoginPage({
  onContinueWithPhone,
  onContinueAsGuest,
}: {
  onContinueWithPhone: () => void;
  onContinueAsGuest: () => void;
}) {
  return (
    <main className="cx-login-page">
      <section className="cx-login-left">
        <Link href="/" className="cx-login-back" data-testid="link-login-back"><ArrowLeft size={16} /> Back to home</Link>
        <div className="cx-login-content">
          <UnderconstructionBrand className="cx-login-brand" />
          <span className="cx-eyebrow">Welcome</span>
          <h1>Hey there,<br />feeling hungry?</h1>
          <p>Let’s enjoy your food with Underconstruction!</p>
          <button className="cx-login-phone" type="button" onClick={onContinueWithPhone} data-testid="button-continue-phone">
            <Phone size={18} /> CONTINUE WITH PHONE
          </button>
          <button className="cx-login-guest" type="button" onClick={onContinueAsGuest} data-testid="button-continue-guest">
            CONTINUE AS A GUEST
          </button>
        </div>
      </section>
      <aside className="cx-login-art-panel" aria-label="Underconstruction food">
        <UnderconstructionBrand className="cx-login-art-brand" />
        <div className="cx-login-art-copy"><span>Freshly made.</span><strong>Made for sharing.</strong></div>
        <img src="/food-pizza.jpg" alt="Fresh pizza from Underconstruction" />
        <div className="cx-login-art-sticker">GOOD<br />FOOD<br />GOOD MOOD</div>
      </aside>
    </main>
  );
}
