import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
// Adicionei o Users aqui na importação!
import { Lock, DollarSign, TrendingUp, AlertCircle, Users } from 'lucide-react';

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
  // O mesmo truque que usamos no Sidebar para o TS não reclamar
  const authContext = useContext(AuthContext) as any;
  const userRole = authContext?.userRole || '';
  
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
  
  // Regra do Chefe (Item 7): Bloqueia os valores se não for direção
  const bloquearValores = userRole !== 'direção';

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-8 bg-gray-50 min-h-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Financeiro</h1>
      
      {/* Cards de Faturamento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card titulo="Valor Jobs Mês" valor={`R$ ${mesAtual.valor_jobs_mes}`} icone={<DollarSign />} restrito={bloquearValores} />
        <Card titulo="Valor Jobs Ano" valor={`R$ ${mesAtual.valor_jobs_ano}`} icone={<DollarSign />} restrito={bloquearValores} />
        <Card titulo="Receita Mensal" valor={`R$ ${mesAtual.receita_mensal}`} icone={<TrendingUp />} restrito={bloquearValores} />
      </div>

      {/* Cards de Custos e Desempenho (Incluindo os Novos do Item 6) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card titulo="Despesa Mensal %" valor={`${mesAtual.despesa_mensal_pct}%`} icone={<TrendingUp className="rotate-180" />} restrito={bloquearValores} />
        <Card titulo="Custo c/ Pessoal" valor={`R$ ${mesAtual.custo_pessoal || '0'}`} icone={<Users />} restrito={bloquearValores} />
        <Card titulo="Outras Despesas" valor={`R$ ${mesAtual.outras_despesas || '0'}`} icone={<AlertCircle />} restrito={bloquearValores} />
        <Card titulo="Rentabilidade %" valor={`${mesAtual.rentabilidade_pct}%`} icone={<TrendingUp />} restrito={bloquearValores} />
      </div>
    </div>
  );
}