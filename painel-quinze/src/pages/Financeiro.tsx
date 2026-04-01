import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import { Lock, DollarSign, Users, TrendingUp } from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

function Card({ titulo, valor, icone, restrito = false }: { titulo: string; valor: any; icone: React.ReactNode; restrito?: boolean }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{titulo}</p>
        <div className="mt-1 flex items-center">
          {restrito ? (
            <div className="flex items-center gap-2 text-gray-400 italic">
              <Lock size={16} />
              <span>Restrito</span>
            </div>
          ) : (
            <h3 className="text-2xl font-bold text-primary">{valor || '0'}</h3>
          )}
        </div>
      </div>
      <div className="p-3 bg-gray-50 rounded-lg text-accent">
        {icone}
      </div>
    </div>
  );
}

export default function Financeiro() {
  const { userRole } = useContext(AuthContext);
  const [dados, setDados] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api.get('', { params: { aba: 'financeiro' } })
      .then(response => {
        setDados(response.data);
        setCarregando(false);
      })
      .catch(() => setCarregando(false));
  }, []);

  if (carregando) return <div className="p-10 text-center animate-pulse text-primary font-bold">Carregando Financeiro...</div>;

  const mesAtual = dados[dados.length - 1] || {};

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card titulo="Clientes In Mês" valor={mesAtual.clientes_in_mes} icone={<Users />} />
        <Card titulo="Clientes Out Mês" valor={mesAtual.clientes_out_mes} icone={<Users />} />
        <Card titulo="Valor Jobs Mês" valor={`R$ ${mesAtual.valor_jobs_mes}`} icone={<DollarSign />} />
        <Card titulo="Valor Jobs Ano" valor={`R$ ${mesAtual.valor_jobs_ano}`} icone={<DollarSign />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card titulo="Receita Mensal" valor={`R$ ${mesAtual.receita_mensal}`} icone={<TrendingUp />} restrito={userRole === 'coordenador'} />
        <Card titulo="Despesa Mensal %" valor={`${mesAtual.despesa_mensal_pct}%`} icone={<TrendingUp className="rotate-180" />} restrito={userRole === 'coordenador'} />
        <Card titulo="Taxa de Crescimento" valor="15%" icone={<TrendingUp />} />
        <Card titulo="Rentabilidade %" valor={`${mesAtual.rentabilidade_pct}%`} icone={<TrendingUp />} restrito={userRole === 'coordenador'} />
      </div>

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