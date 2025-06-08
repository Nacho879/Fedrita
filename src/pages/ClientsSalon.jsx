
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
import { UserCircle, Mail, Phone, CalendarCheck2, Users, Home, Edit3, Trash2, Crown } from 'lucide-react';

const ClientsSalon = () => {
  const { user, managedSalon, loading: authLoading } = useAuth();
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      if (!user || !managedSalon) {
        if (!authLoading) setLoadingClients(false);
        return;
      }
      try {
        setLoadingClients(true);
        const { data, error } = await supabase
          .from('clients')
          .select(`
            *,
            appointments_count:appointments(count)
          `)
          .eq('owner_id', managedSalon.owner_id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setClients(data.map(client => ({
            ...client,
            reservations_count: client.appointments_count[0]?.count || 0
        })) || []);

      } catch (error) {
        toast({ title: 'Error al cargar los clientes', description: error.message, variant: 'destructive' });
      } finally {
        setLoadingClients(false);
      }
    };
    
    if (!authLoading) fetchClients();
  }, [user, managedSalon, authLoading]);

  const handleDeleteClient = async (clientId) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId)
        .eq('owner_id', managedSalon.owner_id);

      if (error) throw error;
      setClients(clients.filter((client) => client.id !== clientId));
      toast({ title: 'Cliente eliminado', description: 'El cliente ha sido eliminado exitosamente.' });
    } catch (error) {
      toast({ title: 'Error al eliminar el cliente', description: error.message, variant: 'destructive' });
    }
  };

  if (authLoading || loadingClients) {
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
              Clientes del Salón
            </h1>
            <p className="text-gray-600 text-lg">Administra los clientes de {managedSalon.name}.</p>
          </div>
          <Button onClick={() => navigate('/dashboard-manager')} variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 hover:text-purple-700">
            <Home className="mr-2 h-4 w-4" /> Volver al Panel
          </Button>
        </div>

        {clients.length === 0 && !loadingClients && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="text-center py-16 bg-white rounded-xl shadow-lg">
            <Users className="w-24 h-24 text-purple-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">Aún no hay clientes registrados</h2>
            <p className="text-gray-500 mb-6">Los clientes se añadirán automáticamente cuando crees una reserva para ellos.</p>
            <Button onClick={() => navigate('/crear-reserva')} className="gradient-bg hover:opacity-90 text-lg px-8 py-3">
              <CalendarCheck2 className="mr-2 h-5 w-5" /> Agendar una Cita
            </Button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clients.map((client, index) => (
            <motion.div key={client.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
              <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 border-0 overflow-hidden flex flex-col h-full">
                <CardHeader className="bg-gradient-to-tr from-teal-500 to-cyan-500 p-6">
                  <CardTitle className="text-2xl font-bold text-white flex items-center">
                    <UserCircle className="mr-3 h-7 w-7" /> {client.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3 flex-grow">
                  {client.email && (
                    <div className="flex items-center text-gray-700">
                      <Mail className="mr-3 h-5 w-5 text-purple-500" />
                      <a href={`mailto:${client.email}`} className="hover:underline">{client.email}</a>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center text-gray-700">
                      <Phone className="mr-3 h-5 w-5 text-purple-500" />
                      <a href={`tel:${client.phone}`} className="hover:underline">{client.phone}</a>
                    </div>
                  )}
                  <div className="flex items-center text-gray-700">
                    <CalendarCheck2 className="mr-3 h-5 w-5 text-purple-500" />
                    <span>{client.reservations_count} reserva{client.reservations_count === 1 ? '' : 's'}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-6 bg-gray-50 border-t flex justify-end space-x-3">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/editar-cliente/${client.id}`)} className="text-purple-600 border-purple-500 hover:bg-purple-50">
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
                        <AlertDialogTitle>¿Estás seguro de eliminar a este cliente?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Se eliminará permanentemente al cliente "{client.name}" y su historial.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteClient(client.id)} className="bg-red-600 hover:bg-red-700">
                          Sí, eliminar cliente
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

export default ClientsSalon;
