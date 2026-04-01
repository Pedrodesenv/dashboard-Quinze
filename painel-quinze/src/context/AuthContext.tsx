import React, { createContext, useState } from 'react';

type Role = 'diretor' | 'coordenador' | null;

interface AuthContextType {
  userRole: Role;
  login: (role: Role) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<Role>(null);

  const login = (role: Role) => {
    setUserRole(role);
  };

  const logout = () => {
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}