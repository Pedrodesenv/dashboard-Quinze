import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from './Sidebar';
import { LogOut } from 'lucide-react';

// Aqui dizemos ao TypeScript o que o Layout deve aceitar
interface LayoutProps {
  children: React.ReactNode;
  setTelaAtiva: (tela: string) => void;
  telaAtiva: string;
}

export default function Layout({ children, setTelaAtiva, telaAtiva }: LayoutProps) {
  const { userRole, logout } = useContext(AuthContext);

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Passamos as funções para a Sidebar também */}
      <Sidebar setTelaAtiva={setTelaAtiva} telaAtiva={telaAtiva} />
      
      <main className="flex-1 flex flex-col">
        {/* O título do Header agora muda dinamicamente */}
        <header className="bg-white h-16 shadow-sm flex items-center justify-between px-8">
          <h1 className="text-xl font-bold text-gray-800">{telaAtiva}</h1>
          
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-500">
              Perfil: <strong className="text-accent uppercase">{userRole}</strong>
            </span>
            <button 
              onClick={logout} 
              className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}