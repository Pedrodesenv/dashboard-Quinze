import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Users, Briefcase, UserCheck, ShieldCheck } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell 
} from 'recharts';

export default function Squads() {
  const [dados, setDados] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api.get('', { params: { aba: 'squads' } })
      .then(response => {
        setDados(response.data);
        setCarregando(false);
      })
      .catch(() => setCarregando(false));
  }, []);

  if (carregando) return <div className="p-10 text-center animate-pulse text-primary font-bold">Mapeando time Quinze...</div>;

  // CÁLCULOS AUTOMÁTICOS BASEADOS NA SUA FOTO
  const totalPessoas = dados.length;
  const squadsUnicas = [...new Set(dados.map(d => d.squad))];
  
  // Contagem de pessoas por squad para o gráfico
  const contagemSquads = squadsUnicas.map(nome => ({
    nome,
    quantidade: dados.filter(d => d.squad === nome).length
  }));

  const cores = ['#1E1B6B', '#2D7D9A', '#4FB3AF', '#88D4D0', '#A5E5E2'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-primary">Time & Squads</h2>
        <p className="text-gray-500 text-sm">Estrutura organizacional e distribuição de talentos</p>
      </div>

      {/* CARDS DE RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users size={28} /></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase">Total de Talentos</p>
            <h3 className="text-3xl font-black text-primary">{totalPessoas}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-xl"><ShieldCheck size={28} /></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase">Frentes/Squads</p>
            <h3 className="text-3xl font-black text-primary">{squadsUnicas.length}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl"><UserCheck size={28} /></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase">Status Geral</p>
            <h3 className="text-3xl font-black text-primary">100% Ativo</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* GRÁFICO DE DISTRIBUIÇÃO POR SQUAD */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-400 uppercase mb-6 flex items-center gap-2">
            <Briefcase size={16} /> Headcount por Squad
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contagemSquads} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="nome" type="category" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} width={80} />
                <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Bar dataKey="quantidade" fill="#2D7D9A" radius={[0, 4, 4, 0]} barSize={20}>
                  {contagemSquads.map((_, index) => (
                    <Cell key={index} fill={cores[index % cores.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TABELA DE INTEGRANTES */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-400 uppercase mb-6">Lista de Colaboradores</h3>
          <div className="overflow-x-auto max-h-72">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-50">
                  <th className="pb-3 font-semibold">NOME</th>
                  <th className="pb-3 font-semibold">SQUAD</th>
                  <th className="pb-3 font-semibold">CARGO</th>
                  <th className="pb-3 font-semibold text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {dados.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 font-bold text-gray-700">{item.nome}</td>
                    <td className="py-4 text-gray-500">{item.squad}</td>
                    <td className="py-4 text-xs italic text-gray-400">{item.cargo}</td>
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