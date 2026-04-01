import { useContext, useState } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Layout from './components/Layout';
import Financeiro from './pages/Financeiro';
import Producao from './pages/Producao'; // Importando a nova tela
import Nps from './pages/Nps';
import TempoSLA from './pages/TempoSLA';
import Squads from './pages/Squads';
import Carteiras from './pages/Carteiras';
import Processos from './pages/Processos';

function ControleDeTelas() {
  const { userRole } = useContext(AuthContext);
  const [telaAtiva, setTelaAtiva] = useState('Financeiro'); // Estado que controla a navegação

  if (!userRole) return <Login />;

  // Função que escolhe qual componente mostrar no meio da tela
  const renderizarTela = () => {
    switch (telaAtiva) {
      case 'Financeiro': 
        return <Financeiro />;
      
      case 'Produção Diária': 
        return <Producao />;
      
      case 'NPS': // <-- O segredo está aqui! Tem que ser 'NPS' tudo maiúsculo
        return <Nps />;
      
      case 'Tempo & SLA':
        return <TempoSLA />;

      case 'Squads':
        return <Squads />;

      case 'Processos':
        return <Processos />;

      case 'Carteiras':
        return <Carteiras />;
      
      default: 
        return <Financeiro />;
    }
  };

  return (
    <Layout setTelaAtiva={setTelaAtiva} telaAtiva={telaAtiva}>
      {renderizarTela()}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ControleDeTelas />
    </AuthProvider>
  );
}