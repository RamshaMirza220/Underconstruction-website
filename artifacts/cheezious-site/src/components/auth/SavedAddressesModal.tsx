import { useEffect, useState } from 'react';
import { ArrowRight, Crosshair, X } from 'lucide-react';
import { useAuth } from '@/auth/AuthContext';
import { UnderconstructionBrand } from '@/components/UnderconstructionBrand';

export function SavedAddressesModal({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: () => void;
}) {
  const { savedAddresses, selectedAddress, addAddress, selectAddress } = useAuth();
  const [newAddress, setNewAddress] = useState('');

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open, onClose]);

  useEffect(() => {
    if (open) setNewAddress('');
  }, [open]);

  const submitAddress = () => {
    const value = newAddress.trim();
    if (!value) return;
    addAddress(value);
    setNewAddress('');
  };

  const chooseAddress = (address: string) => {
    selectAddress(address);
    onSelect();
  };

  if (!open) return null;
  return (
    <div className="cx-auth-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="cx-address-modal" role="dialog" aria-modal="true" aria-labelledby="cx-address-title" data-testid="modal-saved-addresses">
        <button className="cx-address-close" type="button" aria-label="Close saved addresses" onClick={onClose} data-testid="button-close-addresses"><X size={20} /></button>
        <UnderconstructionBrand className="cx-auth-brand" />
        <h2 id="cx-address-title">Saved Addresses</h2>
        <p className="cx-address-intro">Please allow location for free delivery and good food experience.</p>
        <div className="cx-address-entry">
          <input
            value={newAddress}
            onChange={(event) => setNewAddress(event.target.value)}
            onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); submitAddress(); } }}
            placeholder="Enter text to search"
            aria-label="Enter address"
            data-testid="input-new-address"
          />
          <button
            type="button"
            aria-label="Use current location"
            onClick={() => setNewAddress('Current location')}
            data-testid="button-current-location"
          >
            <Crosshair size={18} />
          </button>
          <button
            type="button"
            className="cx-address-add"
            aria-label="Add typed address"
            onClick={submitAddress}
            disabled={!newAddress.trim()}
            data-testid="button-add-address"
          >
            <ArrowRight size={18} />
          </button>
        </div>
        <div className="cx-saved-address-list" role="radiogroup" aria-label="Saved addresses">
          <h3>Saved Addresses</h3>
          {savedAddresses.map((address) => (
            <button
              type="button"
              className={`cx-saved-address${selectedAddress === address ? ' is-selected' : ''}`}
              key={address}
              role="radio"
              aria-checked={selectedAddress === address}
              onClick={() => chooseAddress(address)}
              data-testid="button-select-saved-address"
            >
              <span className="cx-address-radio" aria-hidden="true" />
              <span>{address}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
