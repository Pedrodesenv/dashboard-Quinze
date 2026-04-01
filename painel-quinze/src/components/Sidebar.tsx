import { LayoutDashboard, TrendingUp, Smile, Clock, Users, Briefcase, Settings } from 'lucide-react';

interface SidebarProps {
  setTelaAtiva: (tela: string) => void;
  telaAtiva: string;
}

export default function Sidebar({ setTelaAtiva, telaAtiva }: SidebarProps) {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Financeiro' },
    { icon: TrendingUp, label: 'Produção Diária' },
    { icon: Smile, label: 'NPS' },
    { icon: Clock, label: 'Tempo & SLA' },
    { icon: Users, label: 'Squads' },
    { icon: Briefcase, label: 'Carteiras' },
    { icon: Settings, label: 'Processos' },
  ];

  return (
    <aside className="w-64 bg-primary text-white flex flex-col min-h-screen">
      <div className="p-6 border-b border-white/10 flex items-center justify-center">
        <h2 className="text-2xl font-bold tracking-wider">QUINZE</h2>
      </div>

      <nav className="flex-1 py-6 space-y-1">
        {menuItems.map((item) => {
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