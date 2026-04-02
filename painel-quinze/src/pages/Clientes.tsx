import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
// Ícones importados certinhos
import { Users, UserPlus, UserMinus, Target, Briefcase } from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';

// Componente do Card igual ao do Financeiro
function Card({ titulo, valor, icone }: { titulo: string; valor: any; icone: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{titulo}</p>
        <h3 className="text-2xl font-bold text-primary mt-1">{valor || '0'}</h3>
      </div>
      <div className="p-3 bg-gray-50 rounded-lg text-accent">
        {icone}
      </div>
    </div>
  );
}

export default function Clientes() {
  const [dados, setDados] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Puxando da mesma aba por enquanto para aproveitar os dados que já existem
    api.get('', { params: { aba: 'financeiro' } })
      .then(response => {
        setDados(response.data);
        setCarregando(false);
      })
      .catch(() => setCarregando(false));
  }, []);

  if (carregando) return <div className="p-10 text-center animate-pulse text-primary font-bold">Carregando Clientes...</div>;

  const mesAtual = dados[dados.length - 1] || {};

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-8 bg-gray-50 min-h-full overflow-y-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestão de Clientes</h1>

      {/* Cards de Movimentação (Item 3) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card titulo="Clientes In (Mês)" valor={mesAtual.clientes_in_mes} icone={<UserPlus />} />
        <Card titulo="Clientes Out (Mês)" valor={mesAtual.clientes_out_mes} icone={<UserMinus />} />
        <Card titulo="Clientes In (Ano)" valor={mesAtual.clientes_in_ano} icone={<Users />} />
        <Card titulo="Clientes Out (Ano)" valor={mesAtual.clientes_out_ano} icone={<Users />} />
      </div>

      {/* Cards de Metas (Item 4) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card titulo="Meta de Cliente Mensal" valor={mesAtual.meta_cliente_mensal} icone={<Target />} />
        <Card titulo="Meta de Jobs Mensal" valor={mesAtual.meta_jobs_mensal} icone={<Briefcase />} />
      </div>

      {/* Gráfico de Evolução de Jobs que veio do Financeiro (Item 10) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-primary mb-6">Evolução de Jobs (Mensal)</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dados}>
              <defs>
                <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2D7D9A" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2D7D9A" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="mes_ano" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Area type="monotone" dataKey="valor_jobs_mes" name="Valor em Jobs" stroke="#2D7D9A" strokeWidth={3} fillOpacity={1} fill="url(#colorJobs)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}