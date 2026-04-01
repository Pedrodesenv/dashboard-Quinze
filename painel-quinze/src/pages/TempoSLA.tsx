import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Clock, CheckCircle2, AlertCircle, Timer } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend 
} from 'recharts';

export default function TempoSLA() {
  const [dados, setDados] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api.get('', { params: { aba: 'tempo_sla' } })
      .then(response => {
        setDados(response.data);
        setCarregando(false);
      })
      .catch(() => setCarregando(false));
  }, []);

  if (carregando) return <div className="p-10 text-center animate-pulse text-primary font-bold">Calculando agilidade da equipe...</div>;

  // CÁLCULOS AUTOMÁTICOS
  const totalJobs = dados.length;
  const noPrazo = dados.filter(d => d.status === 'no prazo').length;
  const atrasados = dados.filter(d => d.status === 'atrasado').length;
  const slaPct = totalJobs > 0 ? Math.round((noPrazo / totalJobs) * 100) : 0;
  
  const tempoMedioArte = totalJobs > 0 
    ? Math.round(dados.reduce((acc, d) => acc + Number(d.tempo_entrada_ate_arte_horas), 0) / totalJobs) 
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-primary">Tempo & SLA</h2>
        <p className="text-gray-500 text-sm">Monitoramento de prazos e gargalos operacionais</p>
      </div>

      {/* CARDS DINÂMICOS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase mb-1">SLA Global</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black text-primary">{slaPct}%</h3>
            <CheckCircle2 className="text-green-500 mb-1" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Média de Criação</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black text-primary">{tempoMedioArte}h</h3>
            <Timer className="text-blue-500 mb-1" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Jobs no Prazo</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black text-primary">{noPrazo}</h3>
            <Clock className="text-accent mb-1" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Atrasos</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black text-red-500">{atrasados}</h3>
            <AlertCircle className="text-red-500 mb-1" size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* GRÁFICO DE BARRAS: COMPARAÇÃO DE TEMPOS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-400 uppercase mb-6">Esforço por Tarefa (Horas)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dados} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="tarefa" type="category" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} width={100} />
                <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Legend />
                <Bar dataKey="tempo_entrada_ate_arte_horas" name="Criação (h)" fill="#2D7D9A" radius={[0, 4, 4, 0]} />
                <Bar dataKey="tempo_arte_ate_aprovacao_horas" name="Aprovação (h)" fill="#1E1B6B" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TABELA DE STATUS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-400 uppercase mb-6">Status das Demandas</h3>
          <div className="overflow-y-auto max-h-72">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-gray-50">
                {dados.map((item, index) => (
                  <tr key={index}>
                    <td className="py-3 font-medium text-gray-700">{item.tarefa}</td>
                    <td className="py-3 text-right">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        item.status === 'no prazo' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {item.status}
                      </span>
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