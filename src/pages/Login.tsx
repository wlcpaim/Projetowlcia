import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { AUTH_STORAGE_KEY } from '../lib/constants';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@owlcia.com');
  const [password, setPassword] = useState('123456');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ email, role: 'admin', loggedInAt: new Date().toISOString() }));
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center mx-auto mb-4 font-bold text-xl shadow-lg shadow-emerald-950">
            W
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Acesso Administrativo</h1>
          <p className="text-zinc-400 text-sm mt-1">WLC 1.9.9 Secure Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Senha</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-950 flex items-center justify-center gap-2"
          >
            Entrar como Admin Demo <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-xs text-zinc-500 hover:text-zinc-300">← Voltar para a vitrine</a>
        </div>
      </div>
    </div>
  );
};
