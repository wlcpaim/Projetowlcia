import React from 'react';
import { Printer, CheckCircle2, X } from 'lucide-react';
import { Sale } from '../types';

interface Props {
  sale: Sale | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<Props> = ({ sale, onClose }) => {
  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col">
        <div className="p-4 bg-emerald-950/40 border-b border-emerald-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-white">Venda Finalizada</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-slate-300 text-sm">
          <div className="text-center border-b border-slate-800 pb-4">
            <h3 className="font-bold text-white text-base">Projetowlcia PDV</h3>
            <p className="text-xs text-slate-400">Comprovante Não Fiscal</p>
            <p className="text-xs text-slate-500 mt-1">{new Date(sale.created_at).toLocaleString('pt-BR')}</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Código: {sale.code}</span>
              <span>Pgto: {sale.payment_method.toUpperCase()}</span>
            </div>
            <div className="border-t border-slate-800 pt-2 space-y-1">
              {sale.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <span>{item.quantity}x {item.product_name}</span>
                  <span>R$ {item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-800 pt-3 space-y-1">
            <div className="flex justify-between font-bold text-white text-base">
              <span>Total:</span>
              <span className="text-emerald-400">R$ {sale.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-800 flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-xl transition-all text-sm"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};