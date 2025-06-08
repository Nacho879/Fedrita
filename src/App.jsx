
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/hooks/useAuth.jsx';
import { Toaster } from '@/components/ui/toaster';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import CompanyRegistration from '@/pages/CompanyRegistration';
import Dashboard from '@/pages/Dashboard';
import DashboardManager from '@/pages/DashboardManager';
import CreateSalon from '@/pages/CreateSalon';
import MySalons from '@/pages/MySalons';
import CreateEmployee from '@/pages/CreateEmployee';
import MyEmployees from '@/pages/MyEmployees';
import EmployeesSalon from '@/pages/EmployeesSalon';
import CreateAppointment from '@/pages/CreateAppointment';
import MyAppointments from '@/pages/MyAppointments';
import AppointmentsSalon from '@/pages/AppointmentsSalon';
import MyClients from '@/pages/MyClients';
import ClientsSalon from '@/pages/ClientsSalon';
import ConnectWhatsApp from '@/pages/ConnectWhatsApp';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

const CompanySetupRoute = ({ children }) => {
  const { user, company, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  const needsSetup = user.needsCompanySetup === undefined ? !company : user.needsCompanySetup;

  if (needsSetup && !company) {
     return children;
  }
  
  return <Navigate to="/dashboard" />;
};

const DashboardRoute = ({ children }) => {
  const { user, company, userRole, managedSalon, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (userRole === 'manager' && managedSalon) {
    return <Navigate to="/dashboard-manager" />;
  }
  
  const needsSetup = user.needsCompanySetup === undefined ? !company : user.needsCompanySetup;

  if (needsSetup && !company) {
    return <Navigate to="/registro-empresa" />;
  }
  
  return children;
};

const ManagerRoute = ({ children }) => {
  const { user, userRole, managedSalon, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (userRole === 'admin') {
    return <Navigate to="/dashboard" />;
  }

  if (userRole !== 'manager' || !managedSalon) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

const AdminOrManagerRoute = ({ children }) => {
  const { user, userRole, company, managedSalon, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (userRole === 'admin' && company) {
    return children;
  }

  if (userRole === 'manager' && managedSalon) {
    return children;
  }

  const needsSetup = user.needsCompanySetup === undefined ? !company : user.needsCompanySetup;
  if (needsSetup && !company) {
    return <Navigate to="/registro-empresa" />;
  }
  
  return <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/registro-empresa" 
              element={
                <CompanySetupRoute>
                  <CompanyRegistration />
                </CompanySetupRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <DashboardRoute>
                  <Dashboard />
                </DashboardRoute>
              } 
            />
            <Route 
              path="/dashboard-manager" 
              element={
                <ManagerRoute>
                  <DashboardManager />
                </ManagerRoute>
              } 
            />
            <Route 
              path="/crear-salon"
              element={
                <DashboardRoute>
                  <CreateSalon />
                </DashboardRoute>
              }
            />
            <Route
              path="/mis-salones"
              element={
                <DashboardRoute>
                  <MySalons />
                </DashboardRoute>
              }
            />
            <Route
              path="/crear-empleado"
              element={
                <AdminOrManagerRoute>
                  <CreateEmployee />
                </AdminOrManagerRoute>
              }
            />
            <Route
              path="/mis-empleados"
              element={
                <DashboardRoute>
                  <MyEmployees />
                </DashboardRoute>
              }
            />
            <Route
              path="/empleados-salon"
              element={
                <ManagerRoute>
                  <EmployeesSalon />
                </ManagerRoute>
              }
            />
            <Route
              path="/crear-reserva"
              element={
                <AdminOrManagerRoute>
                  <CreateAppointment />
                </AdminOrManagerRoute>
              }
            />
            <Route
              path="/mis-citas"
              element={
                <DashboardRoute>
                  <MyAppointments />
                </DashboardRoute>
              }
            />
            <Route
              path="/citas-salon"
              element={
                <ManagerRoute>
                  <AppointmentsSalon />
                </ManagerRoute>
              }
            />
            <Route
              path="/mis-clientes"
              element={
                <DashboardRoute>
                  <MyClients />
                </DashboardRoute>
              }
            />
            <Route
              path="/clientes-salon"
              element={
                <ManagerRoute>
                  <ClientsSalon />
                </ManagerRoute>
              }
            />
            <Route
              path="/conectar-whatsapp"
              element={
                <DashboardRoute>
                  <ConnectWhatsApp />
                </DashboardRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
