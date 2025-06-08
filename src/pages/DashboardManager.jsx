
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth.jsx';
import { motion } from 'framer-motion';
import { Plus, Eye, Users, Calendar, BarChart3, Clock, UserCheck, Home, Store, Crown } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { format, isToday, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from '@/components/ui/use-toast';

const DashboardManager = () => {
  const { user, company, managedSalon, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    employees: 0,
    totalAppointments: 0,
    upcomingAppointments: [],
    totalClients: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user || !managedSalon) {
        if(!authLoading) setLoadingStats(false);
        return;
      }
      setLoadingStats(true);
      try {
        const [
          { count: employeesCount, error: employeesError },
          { data: appointmentsData, error: appointmentsError },
          { count: clientsCount, error: clientsError }
        ] = await Promise.all([
          supabase.from('employees').select('*', { count: 'exact', head: true }).eq('salon_id', managedSalon.id),
          supabase.from('appointments').select('id, client_name, appointment_time, employees (name)').eq('salon_id', managedSalon.id).order('appointment_time', { ascending: true }).limit(50),
          supabase.from('clients').select('*', { count: 'exact', head: true }).eq('owner_id', managedSalon.owner_id)
        ]);

        if (employeesError) throw employeesError;
        if (appointmentsError) throw appointmentsError;
        if (clientsError) throw clientsError;

        const upcoming = (appointmentsData || [])
          .filter(appt => new Date(appt.appointment_time) >= new Date())
          .slice(0, 3);

        setStats({
          employees: employeesCount || 0,
          totalAppointments: (appointmentsData || []).length,
          upcomingAppointments: upcoming,
          totalClients: clientsCount || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({ title: "Error al cargar datos del panel", description: error.message, variant: "destructive" });
      } finally {
        setLoadingStats(false);
      }
    };

    if (!authLoading) {
      fetchDashboardData();
    }
  }, [user, managedSalon, authLoading]);

  const quickActions = [
    { icon: Calendar, title: "Agendar Cita", description: "Crea una nueva reserva para un cliente", action: "/crear-reserva", color: "from-pink-400 to-pink-600" },
    { icon: UserCheck, title: "Añadir Empleado", description: "Registra un nuevo miembro del equipo", action: "/crear-empleado", color: "from-blue-400 to-blue-600" },
    { icon: Users, title: "Ver Empleados", description: "Gestiona el equipo del salón", action: "/empleados-salon", color: "from-green-400 to-green-600" },
    { icon: BarChart3, title: "Ver Clientes", description: "Administra la base de clientes", action: "/clientes-salon", color: "from-purple-400 to-purple-600" }
  ];

  const overviewStats = [
    { icon: Users, label: "Empleados del Salón", value: stats.employees, color: "text-green-600", link: "/empleados-salon"},
    { icon: Calendar, label: "Citas del Salón", value: stats.totalAppointments, color: "text-purple-600", link: "/citas-salon" },
    { icon: BarChart3, label: "Clientes Totales", value: stats.totalClients, color: "text-orange-600", link: "/clientes-salon" },
    { icon: Store, label: "Salón Asignado", value: managedSalon?.name || "N/A", color: "text-blue-600", link: null }
  ];

  if (authLoading || loadingStats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  if (!managedSalon) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-gray-50 to-pink-50 p-4 text-center">
        <Crown className="w-24 h-24 text-purple-300 mb-6" />
        <h1 className="text-3xl font-bold text-purple-800 mb-4">No tienes un salón asignado</h1>
        <p className="text-gray-600 mb-8">
          Contacta con el administrador de la empresa para que te asigne como manager de un salón.
        </p>
        <Button onClick={() => navigate('/dashboard')} className="gradient-bg hover:opacity-90">
          Volver al Panel Principal
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-gray-50 to-pink-50">
      <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <Crown className="mr-3 h-8 w-8 text-purple-600" />
                Panel de Manager - {managedSalon.name}
              </h1>
              <p className="text-gray-600 mt-1">
                ¡Bienvenido de nuevo, {user?.email?.split('@')[0]}! 👋
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-xl font-semibold gradient-text">Fedrita</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        >
          {overviewStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-xl transition-shadow duration-300 cursor-pointer border-0" onClick={() => stat.link && navigate(stat.link)}>
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-3">
                  <stat.icon className={`w-9 h-9 ${stat.color}`} />
                  <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
                </div>
                <p className="text-md font-semibold text-gray-700">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 group cursor-pointer border-0 overflow-hidden">
                <CardHeader className={`p-6 bg-gradient-to-br ${action.color} text-white`}>
                  <div className="flex items-center space-x-3">
                    <action.icon className="w-7 h-7" />
                    <CardTitle className="text-xl">{action.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-600 text-sm mb-4 min-h-[40px]">{action.description}</p>
                  <Button asChild className="w-full gradient-bg hover:opacity-90">
                    <Link to={action.action}>Comenzar</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Próximas Citas del Salón</h2>
          {stats.upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {stats.upcomingAppointments.map(appt => (
                <Card key={appt.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${isToday(parseISO(appt.appointment_time)) ? 'bg-green-100' : 'bg-purple-100'}`}>
                        <Calendar className={`w-6 h-6 ${isToday(parseISO(appt.appointment_time)) ? 'text-green-600' : 'text-purple-600'}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{appt.client_name}</p>
                        <p className="text-sm text-gray-600">
                          {format(parseISO(appt.appointment_time), "eeee dd 'de' MMMM, HH:mm 'hs'", { locale: es })}
                        </p>
                        {appt.employees?.name && <p className="text-xs text-gray-500">Con: {appt.employees.name}</p>}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/citas-salon#${appt.id}`)}>
                      Ver Detalles <Eye className="ml-2 h-4 w-4"/>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-gray-300 bg-gray-50">
              <CardContent className="p-10 text-center">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hay citas programadas próximamente en este salón.</p>
                <Button onClick={() => navigate('/crear-reserva')} className="mt-4 gradient-bg hover:opacity-90">
                  <Plus className="mr-2 h-4 w-4" /> Agendar una Cita
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.section>
      </main>
    </div>
  );
};

export default DashboardManager;
