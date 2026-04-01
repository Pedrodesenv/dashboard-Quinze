import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Puxa a função de login da nossa "memória"
  const { login } = useContext(AuthContext);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Lógica exata do Briefing da Quinze
    if (email === 'adm@quinzecomunicacao.com' && password === '15787632') {
      login('diretor');
    } else if (email === 'eduardo@quinzecomunicacao.com' && password === 'Eu1507') {
      login('diretor');
    } else if (
      (email === 'wellquinze' || email === 'amandaquinze' || email === 'caladoquinze') && 
      password === 'Quinze15'
    ) {
      login('coordenador');
    } else {
      setError('Credenciais inválidas. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <div className="flex flex-col items-center">
          <div className="p-3 bg-primary rounded-full mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-primary">Painel Quinze</h2>
          <p className="text-gray-500">Faça login para acessar os dashboards</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">E-mail ou Usuário</label>
            <input 
              type="text" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-accent focus:border-accent outline-none"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-accent focus:border-accent outline-none"
              required 
            />
          </div>

          {error && <p className="text-sm font-medium text-red-500 text-center">{error}</p>}

          <button 
            type="submit" 
            className="w-full px-4 py-2 font-bold text-white bg-primary rounded-md hover:bg-opacity-90 transition-all"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}