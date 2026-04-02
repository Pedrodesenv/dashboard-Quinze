import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { FileText, ExternalLink, Search } from 'lucide-react';

export default function Processos() {
  const [dados, setDados] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    // Puxando os dados da aba processos
    api.get('', { params: { aba: 'processos' } })
      .then(response => {
        setDados(response.data);
        setCarregando(false);
      })
      .catch(() => setCarregando(false));
  }, []);

  if (carregando) return <div className="p-10 text-center animate-pulse text-primary font-bold">Carregando Documentos...</div>;

  // Sistema de busca prático para achar os PDFs rápido
  const processosFiltrados = dados.filter(p => 
    p.titulo?.toLowerCase().includes(busca.toLowerCase()) || 
    p.categoria?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-8 bg-gray-50 min-h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Processos e Manuais</h2>
          <p className="text-gray-500 text-sm mt-1">Repositório oficial de PDFs da agência</p>
        </div>
        
        {/* Barra de Pesquisa */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar documento..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Se não tiver PDF, mostra esse aviso ensinando como colocar */}
      {processosFiltrados.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
          <FileText className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-gray-600">Nenhum documento encontrado</h3>
          <p className="text-gray-400 mt-2">
            Para adicionar PDFs, vá na aba "processos" da sua planilha e crie as colunas: <br/>
            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-primary">titulo</span>, 
            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-primary mx-2">categoria</span> e 
            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded text-primary">link_pdf</span>
          </p>
        </div>
      ) : (
        /* Grid com os "Cards" de cada PDF */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processosFiltrados.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group flex flex-col h-full hover:border-primary/30">
              <div className="flex items-start gap-4 mb-4 flex-1">
                <div className="p-3 bg-red-50 text-red-500 rounded-xl">
                  <FileText size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{item.categoria || 'Geral'}</span>
                  <h3 className="text-lg font-bold text-gray-800 leading-tight mt-1 group-hover:text-primary transition-colors">{item.titulo}</h3>
                  {item.descricao && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{item.descricao}</p>}
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-50 flex gap-3">
                <a 
                  href={item.link_pdf} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-primary/5 hover:bg-primary/10 text-primary py-2 rounded-lg text-sm font-bold transition-colors"
                >
                  <ExternalLink size={16} /> Abrir PDF
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}