import React, { useState, useEffect } from 'react';
import { X, QrCode, CreditCard, Landmark, Wallet, Banknote, ShieldCheck, CheckCircle2, Clock, Sparkles, Star } from 'lucide-react';
import { PaymentMethod } from '../types';
import { StarCelebration } from './StarCelebration';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onPaymentSuccess: (method: PaymentMethod, txnId: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  totalAmount,
  onPaymentSuccess
}) => {
  if (!isOpen) return null;

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('UPI');
  const [upiId, setUpiId] = useState('user@okaxis');
  const [processing, setProcessing] = useState(false);
  const [qrCountdown, setQrCountdown] = useState(300); // 5 mins

  // Card Form state
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('321');

  useEffect(() => {
    let timer: any;
    if (selectedMethod === 'QR Code' && qrCountdown > 0) {
      timer = setInterval(() => setQrCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [selectedMethod, qrCountdown]);

  const [showStarWow, setShowStarWow] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setShowStarWow(true);
    setTimeout(() => {
      setShowStarWow(false);
      setProcessing(false);
      const txnId = `PAY-SS-${Math.floor(100000 + Math.random() * 900000)}`;
      onPaymentSuccess(selectedMethod, txnId);
    }, 2200);
  };

  const minutes = Math.floor(qrCountdown / 60);
  const seconds = qrCountdown % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#fcfae4] border-2 border-[#964261] rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden relative p-6 sm:p-8">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-6 right-6 text-[#553b34] hover:text-[#964261]">
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[#f48fb1]/20 text-[#964261] flex items-center justify-center mx-auto mb-2 text-2xl">
            💳
          </div>
          <h3 className="text-xl font-black text-[#553b34] font-serif">Sweet Scoop Secure Payment</h3>
          <p className="text-xs text-[#8d7871]">Total Payable: <strong className="text-[#964261] text-lg font-serif">₹{totalAmount}</strong></p>
        </div>

        {/* Payment Methods Grid */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[
            { id: 'UPI', label: 'UPI / VPA', icon: QrCode },
            { id: 'QR Code', label: 'Scan QR', icon: QrCode },
            { id: 'Credit/Debit Card', label: 'Card', icon: CreditCard },
            { id: 'Net Banking', label: 'Net Banking', icon: Landmark },
            { id: 'Wallet', label: 'Wallet', icon: Wallet },
            { id: 'Cash on Delivery', label: 'COD', icon: Banknote }
          ].map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMethod(m.id as any)}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 text-xs font-bold ${
                  selectedMethod === m.id
                    ? 'bg-[#964261] text-white border-[#964261] shadow-md'
                    : 'bg-[#f4f1d4] border-[#d8d1a3] text-[#553b34] hover:bg-[#e8e2be]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Method Details Input */}
        <div className="bg-[#f4f1d4] border border-[#d8d1a3] rounded-2xl p-4 mb-6">
          {selectedMethod === 'UPI' && (
            <div>
              <label className="block text-xs font-bold text-[#553b34] mb-2">Enter Virtual Payment Address (VPA)</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="username@okaxis / @ybl"
                className="w-full bg-[#fcfae4] border border-[#d8d1a3] rounded-xl px-3 py-2 text-xs font-bold text-[#553b34]"
              />
              <span className="text-[10px] text-[#8d7871] block mt-1">Accepts GPay, PhonePe, Paytm, BHIM UPI</span>
            </div>
          )}

          {selectedMethod === 'QR Code' && (
            <div className="text-center">
              <div className="bg-white p-3 rounded-2xl border-2 border-dashed border-[#964261] inline-block mb-2 shadow-inner">
                {/* Simulated QR Code */}
                <div className="w-40 h-40 bg-gradient-to-tr from-[#964261] via-[#553b34] to-[#f48fb1] rounded-xl flex items-center justify-center text-white text-center p-2 font-mono text-[10px] font-bold">
                  [UPI QR Code Simulator]
                  <br />Scan with any UPI App
                  <br />₹{totalAmount}
                </div>
              </div>
              <div className="flex items-center justify-center gap-1 text-xs font-extrabold text-[#964261]">
                <Clock className="w-3.5 h-3.5" />
                <span>QR expires in {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span>
              </div>
            </div>
          )}

          {selectedMethod === 'Credit/Debit Card' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-[#553b34]">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-[#fcfae4] border border-[#d8d1a3] rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-[#553b34]">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full bg-[#fcfae4] border border-[#d8d1a3] rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#553b34]">CVV</label>
                  <input
                    type="password"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full bg-[#fcfae4] border border-[#d8d1a3] rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedMethod === 'Cash on Delivery' && (
            <div className="text-center py-2 text-xs text-[#553b34]">
              <Banknote className="w-6 h-6 text-[#964261] mx-auto mb-1" />
              <p className="font-bold">Pay ₹{totalAmount} with Cash or UPI upon delivery.</p>
              <span className="text-[10px] text-[#8d7871]">Delivery rider carries a QR scanner for contactless payment at doorstep.</span>
            </div>
          )}

          {(selectedMethod === 'Net Banking' || selectedMethod === 'Wallet') && (
            <div className="text-center py-2 text-xs text-[#553b34]">
              <ShieldCheck className="w-6 h-6 text-[#964261] mx-auto mb-1" />
              <p className="font-bold">Instant 256-bit SSL Bank Gateway Authorization</p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handlePay}
          disabled={processing}
          className="w-full py-3.5 rounded-full bg-[#964261] hover:bg-[#7e344e] text-white text-sm font-extrabold shadow-[0_4px_0_0_#63263b] flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
        >
          {processing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Verifying & Authorizing...</span>
            </div>
          ) : (
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
              <span>Pay ₹{totalAmount} Now</span>
            </span>
          )}
        </button>

        {/* WOW Stars Celebration Animation */}
        <StarCelebration show={showStarWow} />

      </div>
    </div>
  );
};
