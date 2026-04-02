import { useContext } from 'react';
import { LayoutDashboard, TrendingUp, Smile, Clock, Users, Briefcase, Settings, PieChart } from 'lucide-react';
import logoQuinze from '../assets/logo_quinze.png'; 
import { AuthContext } from '../context/AuthContext'; 

interface SidebarProps {
  setTelaAtiva: (tela: string) => void;
  telaAtiva: string;
}

export default function Sidebar({ setTelaAtiva, telaAtiva }: SidebarProps) {
  // Truque de força bruta para o TypeScript parar de reclamar do Contexto
  const authContext = useContext(AuthContext) as any;
  const userRole = authContext?.userRole || '';

  const menuItems = [
    { icon: LayoutDashboard, label: 'Financeiro' },
    { icon: PieChart, label: 'Clientes' }, 
    { icon: TrendingUp, label: 'Produção Diária' },
    { icon: Smile, label: 'NPS' },
    { icon: Clock, label: 'Tempo & SLA' },
    { icon: Users, label: 'Squads' },
    { icon: Briefcase, label: 'Carteiras' },
    { icon: Settings, label: 'Processos' },
  ];

  // Filtro de Segurança do Chefe
  const menuPermitido = menuItems.filter(item => {
    if (item.label === 'Financeiro' && userRole !== 'direção') {
      return false; 
    }
    return true; 
  });

  return (
    <aside className="w-64 bg-primary text-white flex flex-col min-h-screen">
      <div className="p-6 border-b border-white/10 flex items-center justify-center">
        <img 
    src={logoQuinze} 
     alt="Logo Quinze" 
     className="w-32 object-contain brightness-0 invert" 
      />
      </div>

      <nav className="flex-1 py-6 space-y-1">
        {menuPermitido.map((item) => {
          const Icon = item.icon;
          const isAtivo = telaAtiva === item.label;
          return (
            <button
              key={item.label}
              onClick={() => setTelaAtiva(item.label)}
              className={`w-full flex items-center gap-3 px-6 py-3 transition-all ${
                isAtivo ? 'bg-accent/20 border-r-4 border-accent text-accent' : 'hover:bg-white/5 text-gray-300'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}