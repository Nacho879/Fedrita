
import React, { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/lib/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [managedSalon, setManagedSalon] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        setLoading(false);
        return;
      }
      
      if (session?.user) {
        setUser(session.user);
        await fetchUserData(session.user.id);
      } else {
        const localUser = localStorage.getItem('fedrita_user_temp');
        if(localUser) setUser(JSON.parse(localUser));
      }
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchUserData(session.user.id);
        } else {
          setCompany(null);
          setUserRole(null);
          setManagedSalon(null);
          localStorage.removeItem('fedrita_company');
        }
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const fetchUserData = async (userId) => {
    if (!userId) return;
    try {
      const [companyResult, managedSalonResult] = await Promise.all([
        supabase
          .from('companies')
          .select('*')
          .eq('owner_id', userId)
          .single(),
        supabase
          .from('salons')
          .select('*')
          .eq('manager_id', userId)
          .single()
      ]);

      if (companyResult.data) {
        setCompany(companyResult.data);
        setUserRole('admin');
        localStorage.setItem('fedrita_company', JSON.stringify(companyResult.data));
      } else if (managedSalonResult.data) {
        setManagedSalon(managedSalonResult.data);
        setUserRole('manager');
        
        const { data: companyData } = await supabase
          .from('companies')
          .select('*')
          .eq('id', managedSalonResult.data.company_id)
          .single();
        
        if (companyData) {
          setCompany(companyData);
          localStorage.setItem('fedrita_company', JSON.stringify(companyData));
        }
      } else {
        setCompany(null);
        setUserRole(null);
        setManagedSalon(null);
        localStorage.removeItem('fedrita_company');
      }
    } catch (e) {
      console.error('Exception fetching user data:', e);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      return { success: false, error: error.message };
    }
    if (data.user) {
      setUser(data.user);
      await fetchUserData(data.user.id);
    }
    return { success: true, user: data.user };
  };

  const register = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      return { success: false, error: error.message };
    }
    if (data.user) {
      localStorage.setItem('fedrita_user_temp', JSON.stringify({ ...data.user, needsCompanySetup: true }));
      setUser({ ...data.user, needsCompanySetup: true });
    }
    return { success: true, user: data.user };
  };

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setCompany(null);
    setUserRole(null);
    setManagedSalon(null);
    localStorage.removeItem('fedrita_user_temp');
    localStorage.removeItem('fedrita_company');
    setLoading(false);
  };
  
  const updateUserContext = async (userId) => {
    if (!userId) return;
    const { data: { user: refreshedUser } } = await supabase.auth.getUser();
    setUser(refreshedUser);
    await fetchUserData(refreshedUser.id);
  };

  const value = {
    user,
    company,
    userRole,
    managedSalon,
    login,
    register,
    logout,
    loading,
    fetchUserData,
    updateUserContext
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
