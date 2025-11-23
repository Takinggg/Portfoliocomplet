import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Reveal } from '../Reveal';

interface AdminLoginProps {
  onLogin: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication - simple password check
    if (password === 'admin' || password === '1234') {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden">
      {/* Background Matrix Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      
      <div className="w-full max-w-md p-8 relative z-10">
        <Reveal>
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-10 shadow-2xl relative overflow-hidden">
            
            <div className="flex justify-center mb-8">
               <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                  <Lock size={32} />
               </div>
            </div>

            <h2 className="text-2xl font-display font-bold text-white text-center mb-2">System Access</h2>
            <p className="text-neutral-500 text-center text-sm mb-8 font-mono uppercase tracking-widest">Restricted Area</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-neutral-400 uppercase">Passkey</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-[#050505] border ${error ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors font-mono text-center tracking-widest`}
                  placeholder="••••••••"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black font-bold uppercase tracking-widest py-3 rounded-lg hover:bg-primary transition-colors flex items-center justify-center gap-2"
              >
                Authenticate <ArrowRight size={16} />
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-green-500/50 text-xs font-mono">
                <ShieldCheck size={12} />
                <span>Encrypted Connection</span>
            </div>

          </div>
        </Reveal>
      </div>
    </div>
  );
};