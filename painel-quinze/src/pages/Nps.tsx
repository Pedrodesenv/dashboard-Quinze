import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Smile, Users, Star, Meh, Frown } from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, Tooltip 
} from 'recharts';

export default function Nps() {
  const [dadosGerais, setDadosGerais] = useState<any[]>([]);
  const [dadosClientes, setDadosClientes] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscaGeral = api.get('', { params: { aba: 'nps' } });
    const buscaClientes = api.get('', { params: { aba: 'nps_por_cliente' } });

    Promise.all([buscaGeral, buscaClientes])
      .then(([resGeral, resClientes]) => {
        setDadosGerais(resGeral.data);
        setDadosClientes(resClientes.data);
        setCarregando(false);
      })
      .catch(() => setCarregando(false));
  }, []);

  if (carregando) return <div className="p-10 text-center animate-pulse text-primary font-bold">Processando feedbacks...</div>;

  const geral = dadosGerais[dadosGerais.length - 1] || {};

  const dataRadar = [
    { subject: 'Atendimento', A: Number(geral.nps_atendimento) || 0 },
    { subject: 'Social Media', A: Number(geral.nps_social_media) || 0 },
    { subject: 'Arte', A: Number(geral.nps_direcao_arte) || 0 },
    { subject: 'Tráfego', A: Number(geral.nps_trafego) || 0 },
    { subject: 'Financeiro', A: Number(geral.nps_financeiro) || 0 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">NPS Quinze</h2>
          <p className="text-gray-500 text-sm">Visão geral de satisfação por setor e cliente</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 uppercase font-black">Score Médio</p>
          <span className="text-4xl font-black text-accent">{geral.nps_atendimento || 0}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* GRÁFICO DE RADAR */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <h3 className="text-sm font-bold text-gray-400 uppercase mb-6 flex items-center gap-2">
            <Star size={16} className="text-accent" /> Equilíbrio de Entrega
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dataRadar}>
                <PolarGrid stroke="#f0f0f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="NPS" dataKey="A" stroke="#2D7D9A" fill="#2D7D9A" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TABELA POR CLIENTE */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <Users className="text-primary" size={20} />
            <h3 className="text-lg font-bold text-primary">NPS Detalhado</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-50">
                  <th className="pb-3 font-semibold uppercase">Cliente</th>
                  <th className="pb-3 font-semibold uppercase text-center">Score</th>
                  <th className="pb-3 font-semibold uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {dadosClientes.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 font-bold text-gray-700">{item.cliente}</td>
                    <td className="py-4 text-center">
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg font-mono font-bold">
                        {item.nps_geral}
                      </span>
                    </td>
                    <td className="py-4">
                      {Number(item.nps_geral) >= 80 ? (
                        <span className="text-green-500 flex items-center gap-1 font-medium"><Smile size={16}/> Promotor</span>
                      ) : Number(item.nps_geral) >= 60 ? (
                        <span className="text-amber-500 flex items-center gap-1 font-medium"><Meh size={16}/> Neutro</span>
                      ) : (
                        <span className="text-red-500 flex items-center gap-1 font-medium"><Frown size={16}/> Detrator</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}