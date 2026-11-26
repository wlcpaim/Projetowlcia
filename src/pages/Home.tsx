import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Zap, ShieldCheck, TrendingUp, CheckCircle2, ArrowRight, Store, DollarSign, Package } from 'lucide-react';

export const Home: React.FC = () => {
  const [simCart, setSimCart] = useState([{ name: 'Café Espresso', price: 24.90, qty: 1 }]);

  const addSimItem = (name: string, price: number) => {
    const existing = simCart.find(i => i.name === name);
    if (existing) {
      setSimCart(simCart.map(i => i.name === name ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setSimCart([...simCart, { name, price, qty: 1 }]);
    }
  };

  const totalSim = simCart.reduce((acc, i) => acc + i.price * i.qty, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">Projetowlcia</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/pdv"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2 rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/20"
            >
              <ShoppingCart className="w-4 h-4" />
              Acessar PDV
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
          <Zap className="w-3.5 h-3.5" />
          PDV SaaS de Alta Performance & Gestão Híbrida
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          O Sistema de Vendas Definitivo para o seu <span className="text-emerald-400">Negócio</span>
        </h1>
        <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
          Gerencie vendas, controle estoque em tempo real, emita recibos instantâneos e acompanhe o fluxo de caixa com uma interface ultrafluida em tom esmeralda escuro.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/pdv"
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/30"
          >
            Abrir Terminal PDV
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Interactive Simulator Section */}
      <section className="py-16 px-4 bg-slate-900/40 border-y border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Experimente o Simulador de PDV</h2>
            <p className="text-slate-400 text-sm">Clique nos produtos abaixo para testar o cálculo instantâneo do carrinho.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Products grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Café Espresso', price: 24.90 },
                { name: 'Pão de Queijo', price: 32.50 },
                { name: 'Suco Natural', price: 8.00 },
                { name: 'Bolo Belga', price: 55.00 }
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => addSimItem(p.name, p.price)}
                  className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-4 rounded-xl text-left transition-all flex flex-col justify-between group"
                >
                  <span className="font-medium text-white group-hover:text-emerald-400 text-sm">{p.name}</span>
                  <span className="text-emerald-400 font-bold mt-2">R$ {p.price.toFixed(2)}</span>
                </button>
              ))}
            </div>

            {/* Cart Preview */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-emerald-400" />
                Carrinho de Compras
              </h3>
              <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                {simCart.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
                    <span>{item.qty}x {item.name}</span>
                    <span className="font-medium">R$ {(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-800 pt-4 flex justify-between items-center font-bold text-lg text-white">
                <span>Total:</span>
                <span className="text-emerald-400">R$ {totalSim.toFixed(2)}</span>
              </div>
              <Link
                to="/pdv"
                className="mt-6 w-full block text-center bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20"
              >
                Finalizar no PDV Completo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl">
            <div className="w-12 h-12 bg-emerald-600/10 text-emerald-400 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Velocidade Extrema</h3>
            <p className="text-slate-400 text-sm">
              Otimizado para toque e desktop com atalhos de teclado para agilizar o atendimento no balcão.
            </p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl">
            <div className="w-12 h-12 bg-emerald-600/10 text-emerald-400 rounded-xl flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Relatórios em Tempo Real</h3>
            <p className="text-slate-400 text-sm">
              Acompanhe faturamento, lucro bruto, margem e fluxo de caixa com gráficos interativos.
            </p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl">
            <div className="w-12 h-12 bg-emerald-600/10 text-emerald-400 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Persistência Híbrida</h3>
            <p className="text-slate-400 text-sm">
              Funciona perfeitamente em modo demonstração local ou integrado ao Supabase em produção.
            </p>
          </div>
        </div>
      </section>

      {/* Footer with discrete admin link */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-8 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} Projetowlcia. Todos os direitos reservados.</span>
          <Link to="/admin/login" className="hover:text-slate-300 transition-colors">
            Área Administrativa
          </Link>
        </div>
      </footer>
    </div>
  );
};