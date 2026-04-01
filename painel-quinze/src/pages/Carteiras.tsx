import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Briefcase, User, Layers, PieChart as PieIcon } from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend 
} from 'recharts';

export default function Carteiras() {
  const [dados, setDados] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api.get('', { params: { aba: 'carteiras' } })
      .then(response => {
        setDados(response.data);
        setCarregando(false);
      })
      .catch(() => setCarregando(false));
  }, []);

  if (carregando) return <div className="p-10 text-center animate-pulse text-primary font-bold">Organizando carteiras...</div>;

  // Agrupa os clientes por responsável para montar o gráfico de pizza
  const responsaveis = [...new Set(dados.map(d => d.responsavel))];
  const dataPie = responsaveis.map(nome => ({
    name: nome,
    value: dados.filter(d => d.responsavel === nome).length
  }));

  const cores = ['#1E1B6B', '#2D7D9A', '#4FB3AF', '#88D4D0', '#A5E5E2'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Gestão de Carteiras</h2>
          <p className="text-gray-500 text-sm">Distribuição de clientes por atendimento</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase">Total de Clientes</p>
            <h3 className="text-2xl font-black text-accent">{dados.length}</h3>
          </div>
          <Briefcase className="text-accent" size={32} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* GRÁFICO DE PIZZA (DISTRIBUIÇÃO) */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-400 uppercase mb-6 flex items-center gap-2">
            <PieIcon size={16} /> Contas por Responsável
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dataPie} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {dataPie.map((_, index) => <Cell key={index} fill={cores[index % cores.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TABELA DE DETALHAMENTO */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-400 uppercase mb-6">Detalhamento de Contas</h3>
          <div className="overflow-x-auto max-h-[400px]">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="text-gray-400 border-b border-gray-50">
                  <th className="pb-3 font-semibold uppercase">Cliente</th>
                  <th className="pb-3 font-semibold uppercase">Responsável</th>
                  <th className="pb-3 font-semibold uppercase">Segmento</th>
                  <th className="pb-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {dados.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 font-bold text-primary flex items-center gap-2">
                      <Layers size={14} className="text-accent" /> {item.cliente}
                    </td>
                    <td className="py-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-gray-400" /> {item.responsavel}
                      </div>
                    </td>
                    <td className="py-4 text-xs text-gray-400 italic">{item.segmento}</td>
                    <td className="py-4 text-right">
                      <span className="bg-green-50 text-green-600 px-2 py-1 rounded text-[10px] font-bold uppercase">
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