import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { CheckCircle, Globe, MapPin, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Producao() {
  const [dados, setDados] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Puxando da aba que você já tem pronta: producao_diaria
    api.get('', { params: { aba: 'producao_diaria' } })
      .then(response => {
        setDados(response.data);
        setCarregando(false);
      })
      .catch(() => setCarregando(false));
  }, []);

  if (carregando) return <div className="p-10 text-center animate-pulse text-primary font-bold">Lendo dados da equipe...</div>;

  // Pega a última linha da planilha para os cards
  const hoje = dados[dados.length - 1] || {};

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-primary">Produção Diária</h2>
        <p className="text-gray-500 text-sm">Performance detalhada por canal e equipe (Dados Reais)</p>
      </div>

      {/* CARDS COM OS DADOS DA SUA PLANILHA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg"><CheckCircle /></div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Taxa de Entrega Online</p>
            <h3 className="text-2xl font-bold">{hoje.taxa_entrega_online_pct}%</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Globe size={24} /></div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Total Online</p>
            <h3 className="text-2xl font-bold">{hoje.total_entregues_online} <span className="text-sm font-normal text-gray-400">mat.</span></h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><MapPin size={24} /></div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Total OOH</p>
            <h3 className="text-2xl font-bold">{hoje.total_entregues_ooh} <span className="text-sm font-normal text-gray-400">mat.</span></h3>
          </div>
        </div>
      </div>

      {/* GRÁFICO COM A GALERA DA PLANILHA */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
          <BarChart3 size={20}/> Entrega por Integrante (Online)
        </h3>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dados} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="data" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#9ca3af', fontSize: 11}} 
              />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              <Tooltip 
                cursor={{fill: '#f9fafb'}} 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
              />
              <Legend iconType="circle" />
              
              {/* As colunas exatas da sua foto */}
              <Bar dataKey="dudu_online" name="Dudu" stackId="a" fill="#1E1B6B" />
              <Bar dataKey="artur_online" name="Artur" stackId="a" fill="#2D7D9A" />
              <Bar dataKey="gabriel_online" name="Gabriel" stackId="a" fill="#4FB3AF" />
              <Bar dataKey="well_online" name="Well" stackId="a" fill="#88D4D0" />
              <Bar dataKey="matheus_online" name="Matheus" stackId="a" fill="#A5E5E2" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}