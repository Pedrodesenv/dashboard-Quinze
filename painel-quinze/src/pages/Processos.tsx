import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Settings, CheckCircle, AlertTriangle, PlayCircle, Activity } from 'lucide-react';

export default function Processos() {
  const [dados, setDados] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api.get('', { params: { aba: 'processos' } })
      .then(response => {
        setDados(response.data);
        setCarregando(false);
      })
      .catch(() => setCarregando(false));
  }, []);

  if (carregando) return <div className="p-10 text-center animate-pulse text-primary font-bold">Mapeando processos internos...</div>;

  // Cálculos para os cards
  const total = dados.length;
  const concluidos = dados.filter(d => d.status?.toLowerCase() === 'concluído').length;
  const atrasados = dados.filter(d => d.status?.toLowerCase() === 'atrasado').length;
  const emAndamento = dados.filter(d => d.status?.toLowerCase() === 'em andamento').length;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Mapeamento de Processos</h2>
          <p className="text-gray-500 text-sm">Acompanhamento de rotinas e projetos internos</p>
        </div>
        <div className="p-3 bg-primary text-white rounded-xl shadow-sm">
          <Settings size={28} className="animate-[spin_4s_linear_infinite]" />
        </div>
      </div>

      {/* CARDS DE RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-gray-100 text-gray-600 rounded-xl"><Activity size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase">Mapeados</p>
            <h3 className="text-2xl font-black text-primary">{total}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><PlayCircle size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase">Rodando</p>
            <h3 className="text-2xl font-black text-primary">{emAndamento}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl"><CheckCircle size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase">Concluídos</p>
            <h3 className="text-2xl font-black text-primary">{concluidos}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl"><AlertTriangle size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase">Gargalos</p>
            <h3 className="text-2xl font-black text-red-500">{atrasados}</h3>
          </div>
        </div>
      </div>

      {/* LISTA DE PROCESSOS COM BARRA DE PROGRESSO */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-400 uppercase mb-6">Status dos Processos Core</h3>
        <div className="space-y-6">
          {dados.map((item, index) => {
            const progresso = Number(item.progresso) || 0;
            // Define a cor baseada no status
            let corBarra = "bg-blue-500";
            if (item.status?.toLowerCase() === 'concluído') corBarra = "bg-green-500";
            if (item.status?.toLowerCase() === 'atrasado') corBarra = "bg-red-500";

            return (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="font-bold text-gray-700">{item.processo}</h4>
                    <span className="text-xs text-gray-400 uppercase font-bold">{item.area}</span>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400 uppercase">{item.status}</span>
                    <span className="font-black text-primary">{progresso}%</span>
                  </div>
                </div>
                {/* BARRA DE PROGRESSO */}
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-2.5 rounded-full ${corBarra} transition-all duration-1000 ease-out`} 
                    style={{ width: `${progresso}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}