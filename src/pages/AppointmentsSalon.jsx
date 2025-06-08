
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/hooks/useAuth.jsx';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { PlusCircle, Edit3, Trash2, User, Scissors, CalendarDays, Clock, Home, Briefcase, Crown } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const AppointmentsSalon = () => {
  const { user, managedSalon, loading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user || !managedSalon) {
        if (!authLoading) setLoadingAppointments(false);
        return;
      }
      try {
        setLoadingAppointments(true);
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            *,
            employees (name)
          `)
          .eq('salon_id', managedSalon.id)
          .order('appointment_time', { ascending: false });

        if (error) throw error;
        setAppointments(data || []);
      } catch (error) {
        toast({ title: 'Error al cargar las citas', description: error.message, variant: 'destructive' });
      } finally {
        setLoadingAppointments(false);
      }
    };
    
    if (!authLoading) fetchAppointments();
  }, [user, managedSalon, authLoading]);

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId)
        .eq('salon_id', managedSalon.id);

      if (error) throw error;
      setAppointments(appointments.filter((appt) => appt.id !== appointmentId));
      toast({ title: 'Cita eliminada', description: 'La cita ha sido eliminada exitosamente.' });
    } catch (error) {
      toast({ title: 'Error al eliminar la cita', description: error.message, variant: 'destructive' });
    }
  };

  if (authLoading || loadingAppointments) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  if (!managedSalon) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-50 p-4 text-center">
        <Crown className="w-24 h-24 text-purple-300 mb-6" />
        <h1 className="text-3xl font-bold text-purple-800 mb-4">No tienes un salón asignado</h1>
        <p className="text-gray-600 mb-8">
          Contacta con el administrador de la empresa para que te asigne como manager de un salón.
        </p>
        <Button onClick={() => navigate('/dashboard-manager')} className="gradient-bg hover:opacity-90">
          Volver al Panel de Manager
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 p-4 md:p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h1 className="text-4xl font-bold gradient-text flex items-center">
              <Crown className="mr-3 h-10 w-10 text-purple-600" />
              Citas del Salón
            </h1>
            <p className="text-gray-600 text-lg">Gestiona las reservas de {managedSalon.name}.</p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={() => navigate('/dashboard-manager')} variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 hover:text-purple-700">
              <Home className="mr-2 h-4 w-4" /> Volver al Panel
            </Button>
            <Button onClick={() => navigate('/crear-reserva')} className="gradient-bg hover:opacity-90">
              <PlusCircle className="mr-2 h-5 w-5" /> Agendar Nueva Cita
            </Button>
          </div>
        </div>

        {appointments.length === 0 && !loadingAppointments && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="text-center py-16 bg-white rounded-xl shadow-lg">
            <CalendarDays className="w-24 h-24 text-purple-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">Aún no hay citas en este salón</h2>
            <p className="text-gray-500 mb-6">¡Empieza creando la primera reserva para tus clientes!</p>
            <Button onClick={() => navigate('/crear-reserva')} className="gradient-bg hover:opacity-90 text-lg px-8 py-3">
              <PlusCircle className="mr-2 h-5 w-5" /> Agendar Primera Cita
            </Button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {appointments.map((appt, index) => (
            <motion.div key={appt.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
              <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 border-0 overflow-hidden flex flex-col h-full">
                <CardHeader className="bg-gradient-to-tr from-pink-500 to-rose-500 p-6">
                  <CardTitle className="text-2xl font-bold text-white flex items-center">
                    <User className="mr-3 h-6 w-6" /> {appt.client_name}
                  </CardTitle>
                  <CardDescription className="text-pink-100 flex items-center pt-1">
                    <Scissors className="mr-2 h-4 w-4" /> {appt.service}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-3 flex-grow">
                  <div className="flex items-center text-gray-700">
                    <CalendarDays className="mr-3 h-5 w-5 text-purple-500" />
                    <span>{format(new Date(appt.appointment_time), "PPP", { locale: es })}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Clock className="mr-3 h-5 w-5 text-purple-500" />
                    <span>{format(new Date(appt.appointment_time), "p", { locale: es })}</span>
                  </div>
                  {appt.employees?.name && (
                    <div className="flex items-center text-gray-700">
                      <Briefcase className="mr-3 h-5 w-5 text-purple-500" />
                      <span>Atendido por: {appt.employees.name}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-6 bg-gray-50 border-t flex justify-end space-x-3">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/editar-reserva/${appt.id}`)} className="text-purple-600 border-purple-500 hover:bg-purple-50">
                    <Edit3 className="mr-2 h-4 w-4" /> Editar
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="bg-red-500 hover:bg-red-600">
                        <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro de eliminar esta cita?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Se eliminará la cita para "{appt.client_name}" el {format(new Date(appt.appointment_time), "PPP 'a las' p", { locale: es })}.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteAppointment(appt.id)} className="bg-red-600 hover:bg-red-700">
                          Sí, eliminar cita
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AppointmentsSalon;
