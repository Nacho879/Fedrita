import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth.jsx';
import { motion } from 'framer-motion';
import { Plus, Eye, Bot, Building2, Users, Calendar, BarChart3, Clock, UserCheck, Home, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { format, isToday, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const { user, company, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    salons: 0,
    employees: 0,
    totalAppointments: 0,
    upcomingAppointments: [],
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user || !company) {
        if(!authLoading) setLoadingStats(false);
        return;
      }
      setLoadingStats(true);
      try {
        const [
          { count: salonsCount, error: salonsError },
          { count: employeesCount, error: employeesError },
          { data: appointmentsData, error: appointmentsError }
        ] = await Promise.all([
          supabase.from('salons').select('*', { count: 'exact', head: true }).eq('owner_id', user.id).eq('company_id', company.id),
          supabase.from('employees').select('*', { count: 'exact', head: true }).eq('owner_id', user.id),
          supabase.from('appointments').select('id, client_name, appointment_time, salons (name)').eq('owner_id', user.id).order('appointment_time', { ascending: true }).limit(50)
        ]);

        if (salonsError) throw salonsError;
        if (employeesError) throw employeesError;
        if (appointmentsError) throw appointmentsError;

        const upcoming = (appointmentsData || [])
          .filter(appt => new Date(appt.appointment_time) >= new Date())
          .slice(0, 3);

        setStats({
          salons: salonsCount || 0,
          employees: employeesCount || 0,
          totalAppointments: (appointmentsData || []).length,
          upcomingAppointments: upcoming,
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
  }, [user, company, authLoading]);


  const quickActions = [
    { icon: Calendar, title: "Agendar Cita", description: "Crea una nueva reserva para un cliente", action: "/crear-reserva", color: "from-pink-400 to-pink-600" },
    { icon: Plus, title: "Crear Salón", description: "Configura un nuevo salón de belleza", action: "/crear-salon", color: "from-green-400 to-green-600" },
    { icon: UserCheck, title: "Añadir Empleado", description: "Registra un nuevo miembro del equipo", action: "/crear-empleado", color: "from-blue-400 to-blue-600" },
    { icon: Bot, title: "Asistente Fedrita", description: "Configura tu IA de WhatsApp", action: "https://app.fedrita.com", color: "from-purple-400 to-purple-600", external: true }
  ];

  const overviewStats = [
    { icon: Building2, label: "Salones Registrados", value: stats.salons, color: "text-blue-600", link: "/mis-salones"},
    { icon: Users, label: "Empleados Activos", value: stats.employees, color: "text-green-600", link: "/mis-empleados" },
    { icon: Calendar, label: "Total de Citas", value: stats.totalAppointments, color: "text-purple-600", link: "/mis-citas" },
    { icon: BarChart3, label: "Mis Clientes", value: "Ver", color: "text-orange-600", link: "/mis-clientes" } 
  ];

  if (authLoading || loadingStats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-gray-50 to-pink-50">
      <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Panel de {company?.name || 'Fedrita'}
              </h1>
              <p className="text-gray-600 mt-1">
                ¡Bienvenido de nuevo, {user?.email?.split('@')[0]}! 👋
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <img  src="/logo-placeholder.png" alt="Fedrita Logo" className="h-10 w-10 rounded-lg object-contain gradient-bg p-1" src="https://images.unsplash.com/photo-1684577088653-f14e310d841b" />
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
                  {action.external ? (
                    <Button asChild variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-50 hover:text-purple-700">
                      <a href={action.action} target="_blank" rel="noopener noreferrer">
                        Ir Ahora <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  ) : (
                    <Button asChild className="w-full gradient-bg hover:opacity-90">
                      <Link to={action.action}>Comenzar</Link>
                    </Button>
                  )}
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
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Próximas Citas</h2>
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
                        {appt.salons?.name && <p className="text-xs text-gray-500">En: {appt.salons.name}</p>}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/mis-citas#${appt.id}`)}>
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
                <p className="text-gray-600">No tienes citas programadas próximamente.</p>
                <Button onClick={() => navigate('/crear-reserva')} className="mt-4 gradient-bg hover:opacity-90">
                  <Plus className="mr-2 h-4 w-4" /> Agendar una Cita
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.section>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-r from-violet-50 to-fuchsia-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-xl text-purple-800">🚀 Siguientes Pasos con Fedrita</CardTitle>
              <CardDescription className="text-purple-700">
                ¡Sigue estos pasos para potenciar tu negocio al máximo!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 list-inside">
                {[
                  { text: "Configurar servicios y precios detallados en cada salón.", done: stats.salons > 0 && stats.employees > 0 },
                  { text: "Personalizar mensajes y flujos del asistente Fedrita.", done: false },
                  { text: "Conectar tu número de WhatsApp Business.", done: false },
                  { text: "Explorar las estadísticas avanzadas (próximamente).", done: false },
                ].map((step, idx) => (
                  <li key={idx} className="flex items-center">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${step.done ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <span className={`text-xs ${step.done ? 'text-white' : 'text-gray-600'}`}>{step.done ? '✓' : idx + 1}</span>
                    </div>
                    <span className={`text-gray-700 ${step.done ? 'line-through text-gray-500' : ''}`}>{step.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

      </main>
    </div>
  );
};

export default Dashboard;