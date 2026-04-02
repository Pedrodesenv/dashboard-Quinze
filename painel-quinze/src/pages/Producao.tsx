import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Globe, MapPin, BarChart3, TrendingUp } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line
} from 'recharts';

export default function Producao() {
  const [dados, setDados] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api.get('', { params: { aba: 'producao_diaria' } })
      .then(response => {
        setDados(response.data);
        setCarregando(false);
      })
      .catch(() => setCarregando(false));
  }, []);

  if (carregando) return <div className="p-10 text-center animate-pulse text-primary font-bold">Lendo dados da equipe...</div>;

  const hoje = dados[dados.length - 1] || {};

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 p-8 bg-gray-50 min-h-full">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Produção Diária</h2>
        <p className="text-gray-500 text-sm mt-1">Acompanhamento de metas e entregas da equipe</p>
      </div>

      {/* BLOCO DE DESTAQUE: A Porcentagem Diária Gigante */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card Principal - O Destaque que o Chefe pediu */}
        <div className="lg:col-span-1 bg-primary text-white p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          <p className="text-white/80 uppercase tracking-widest font-bold text-sm mb-2 text-center">
            Andamento de Hoje
          </p>
          <h3 className="text-7xl font-black tracking-tighter">
            {hoje.taxa_entrega_online_pct || 0}%
          </h3>
          <p className="text-accent text-sm font-bold mt-4 flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full">
            <TrendingUp size={16} /> Taxa de Entrega Online
          </p>
        </div>

        {/* Cards Secundários */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Globe size={20} /></div>
              <p className="text-sm text-gray-400 uppercase font-bold">Total Online</p>
            </div>
            <h3 className="text-4xl font-bold text-gray-800">
              {hoje.total_entregues_online || 0} <span className="text-lg font-normal text-gray-400">materiais</span>
            </h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><MapPin size={20} /></div>
              <p className="text-sm text-gray-400 uppercase font-bold">Total OOH</p>
            </div>
            <h3 className="text-4xl font-bold text-gray-800">
              {hoje.total_entregues_ooh || 0} <span className="text-lg font-normal text-gray-400">materiais</span>
            </h3>
          </div>
        </div>
      </div>

      {/* NOVO GRÁFICO: Evolução da Porcentagem Diária */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
          <TrendingUp size={20}/> Evolução da Entrega (%)
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dados} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="data" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                formatter={(value: any) => [`${value}%`, 'Taxa de Entrega']}
              />
              <Line 
                type="monotone" 
                dataKey="taxa_entrega_online_pct" 
                stroke="#2D7D9A" 
                strokeWidth={4} 
                dot={{ r: 4, strokeWidth: 2 }} 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* GRÁFICO ANTIGO: Detalhamento por Integrante */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-500 mb-6 flex items-center gap-2">
          <BarChart3 size={20}/> Detalhamento por Integrante (Online)
        </h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dados} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="data" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 11}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
              <Legend iconType="circle" />
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