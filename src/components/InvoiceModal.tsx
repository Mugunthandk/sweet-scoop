import React from 'react';
import { X, Printer, Download, CheckCircle, ShieldCheck } from 'lucide-react';
import { Order } from '../types';

interface InvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-[#FFFFFF] border-2 border-[#4A3728] rounded-[2.5rem] w-full max-w-2xl my-8 p-6 sm:p-10 shadow-2xl relative space-y-6 print:border-none print:shadow-none print:p-0">
        
        {/* Modal Controls (Hidden when printing) */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D6] print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧾</span>
            <div>
              <h3 className="text-lg font-black text-[#4A3728] font-serif">Official Tax Invoice</h3>
              <p className="text-xs text-[#8C7A6B]">Order #{order.id} • GST Compliant</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-full bg-[#964261] text-white text-xs font-bold hover:bg-[#7A324E] flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-[#F3EFE7] text-[#4A3728]">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Document Sheet */}
        <div className="p-6 border border-[#E8E2D6] rounded-2xl bg-[#FDFBF7] space-y-6 font-sans">
          
          {/* Header & Store GSTIN */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#E8E2D6]">
            <div>
              <h1 className="text-2xl font-black text-[#4A3728] font-serif tracking-tight">SWEET SCOOP ARTISANAL CREAMERY</h1>
              <p className="text-xs text-[#6B5A4E]">Flagship Outlet: 100 Feet Road, Indiranagar, Bengaluru - 560038</p>
              <p className="text-[11px] text-[#8C7A6B] font-mono mt-1">FSSAI Lic No: 11223344556677 • GSTIN: 29AAAAA0000A1Z5</p>
            </div>
            <div className="text-right sm:text-right">
              <span className="bg-[#e8f5e9] text-[#2e7d32] text-xs font-extrabold px-3 py-1 rounded-full inline-block mb-1">
                PAID & VERIFIED
              </span>
              <p className="text-xs font-bold text-[#4A3728]">Invoice #: INV-{order.id}</p>
              <p className="text-[10px] text-[#8C7A6B]">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
          </div>

          {/* Customer & Delivery Address Details */}
          <div className="grid grid-cols-2 gap-4 text-xs text-[#4A3728]">
            <div className="p-3 bg-[#FFFFFF] rounded-xl border border-[#E8E2D6]">
              <strong className="block text-[10px] uppercase text-[#8C7A6B] mb-1">Billed To:</strong>
              <p className="font-bold">{order.customerName}</p>
              <p>{order.customerEmail}</p>
              <p>{order.customerPhone}</p>
            </div>

            <div className="p-3 bg-[#FFFFFF] rounded-xl border border-[#E8E2D6]">
              <strong className="block text-[10px] uppercase text-[#8C7A6B] mb-1">Shipping Address:</strong>
              <p className="font-bold">{order.deliveryAddress?.house}, {order.deliveryAddress?.street}</p>
              <p>{order.deliveryAddress?.city} - {order.deliveryAddress?.pincode}</p>
              <p className="text-[#964261] font-semibold">Mode: {order.deliveryType} Delivery</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#E8E2D6] text-[#8C7A6B] font-bold uppercase text-[10px]">
                  <th className="py-2">Item Description</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D6]">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="text-[#4A3728]">
                    <td className="py-2.5">
                      <strong className="block">{item.name}</strong>
                      <span className="text-[10px] text-[#8C7A6B]">{item.details}</span>
                    </td>
                    <td className="py-2.5 text-center font-bold">{item.quantity}</td>
                    <td className="py-2.5 text-right font-serif">₹{item.unitPrice}</td>
                    <td className="py-2.5 text-right font-serif font-bold">₹{item.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Breakdown */}
          <div className="pt-4 border-t border-[#E8E2D6] flex justify-end">
            <div className="w-64 space-y-1.5 text-xs text-[#4A3728]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-serif">₹{order.subtotal}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[#2e7d32]">
                  <span>Discount Applied:</span>
                  <span className="font-serif">- ₹{order.discount}</span>
                </div>
              )}
              {order.pointsDiscount > 0 && (
                <div className="flex justify-between text-[#2e7d32]">
                  <span>Sweet Points Redeemed:</span>
                  <span className="font-serif">- ₹{order.pointsDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-[#8C7A6B]">
                <span>Delivery Charge:</span>
                <span className="font-serif">₹{order.deliveryCharge}</span>
              </div>
              <div className="flex justify-between text-[#8C7A6B]">
                <span>GST (5% Food Tax):</span>
                <span className="font-serif">₹{order.tax}</span>
              </div>
              <div className="pt-2 border-t border-[#E8E2D6] flex justify-between text-base font-black text-[#964261] font-serif">
                <span>Total Amount Paid:</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-4 border-t border-[#E8E2D6] flex items-center justify-between text-[10px] text-[#8C7A6B]">
            <span>Payment Method: <strong>{order.paymentMethod}</strong> ({order.transactionId})</span>
            <span>Thank you for choosing Sweet Scoop! 🍦</span>
          </div>

        </div>

      </div>
    </div>
  );
};
