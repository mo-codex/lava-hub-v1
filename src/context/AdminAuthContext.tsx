import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'moderator';
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    try {
      const stored = localStorage.getItem('lavahub_admin_session');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return null;
  });

  const login = (email: string, pass: string): boolean => {
    // In preview mode: support admin login credentials
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail.includes('admin') || pass.length >= 6) {
      const user: AdminUser = {
        id: 'admin-usr-1',
        email: cleanEmail,
        name: cleanEmail.split('@')[0],
        role: 'super_admin',
      };
      setAdmin(user);
      localStorage.setItem('lavahub_admin_session', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('lavahub_admin_session');
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
