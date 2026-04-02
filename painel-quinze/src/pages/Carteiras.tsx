import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Briefcase, User, Layers, HeadphonesIcon, Smartphone } from 'lucide-react';

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

  // Filtro de Separação: Social Media x Atendimento
  // O sistema vai procurar a palavra "Social Media" na coluna "categoria" da sua planilha.
  const carteiraSocialMedia = dados.filter(d => 
    d.categoria === 'Social Media' || d.categoria === 'Social'
  );
  
  // Tudo o que não for classificado como Social Media, vai aparecer em Atendimento como padrão
  const carteiraAtendimento = dados.filter(d => !carteiraSocialMedia.includes(d));

  // Componente de Tabela reaproveitável
  const TabelaCarteira = ({ titulo, icone: Icon, lista, cor }: { titulo: string, icone: any, lista: any[], cor: string }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full min-h-[400px]">
      <h3 className={`text-sm font-bold uppercase mb-6 flex items-center gap-2 ${cor}`}>
        <Icon size={18} /> {titulo} ({lista.length})
      </h3>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-white">
            <tr className="text-gray-400 border-b border-gray-50">
              <th className="pb-3 font-semibold uppercase">Cliente</th>
              <th className="pb-3 font-semibold uppercase">Responsável</th>
              <th className="pb-3 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {lista.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-8 text-center text-gray-400 italic">
                  Nenhum cliente cadastrado nesta carteira.
                </td>
              </tr>
            ) : (
              lista.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 font-bold text-primary flex items-center gap-2">
                    <Layers size={14} className="text-accent" /> {item.cliente}
                  </td>
                  <td className="py-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-gray-400" /> {item.responsavel}
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-bold uppercase">
                      {item.status || 'Ativo'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-8 bg-gray-50 min-h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Gestão de Carteiras</h2>
          <p className="text-gray-500 text-sm mt-1">Distribuição de clientes por setor</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase">Total de Contas</p>
            <h3 className="text-2xl font-black text-accent">{dados.length}</h3>
          </div>
          <Briefcase className="text-accent" size={32} />
        </div>
      </div>

      {/* AS DUAS COLUNAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TabelaCarteira 
          titulo="Carteira de Atendimento" 
          icone={HeadphonesIcon} 
          lista={carteiraAtendimento} 
          cor="text-primary"
        />
        
        <TabelaCarteira 
          titulo="Carteira de Social Media" 
          icone={Smartphone} 
          lista={carteiraSocialMedia} 
          cor="text-accent"
        />
      </div>
    </div>
  );
}