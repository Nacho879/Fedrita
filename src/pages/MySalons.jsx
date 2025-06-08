import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/hooks/useAuth.jsx';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { PlusCircle, Edit3, Trash2, MapPin, Phone, Clock, Building, Home, ExternalLink } from 'lucide-react';

const MySalons = () => {
  const { user, company, loading: authLoading } = useAuth();
  const [salons, setSalons] = useState([]);
  const [loadingSalons, setLoadingSalons] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSalons = async () => {
      if (!company) {
        if (!authLoading) { // Only set loading to false if auth is also done
          setLoadingSalons(false);
        }
        return;
      }
      try {
        setLoadingSalons(true);
        const { data, error } = await supabase
          .from('salons')
          .select('*')
          .eq('company_id', company.id)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }
        setSalons(data || []);
      } catch (error) {
        toast({
          title: 'Error al cargar los salones',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoadingSalons(false);
      }
    };

    if (!authLoading) {
      fetchSalons();
    }
  }, [company, authLoading]);

  const handleDeleteSalon = async (salonId) => {
    try {
      const { error } = await supabase
        .from('salons')
        .delete()
        .eq('id', salonId);

      if (error) {
        throw error;
      }
      setSalons(salons.filter((salon) => salon.id !== salonId));
      toast({
        title: 'Salón eliminado',
        description: 'El salón ha sido eliminado exitosamente.',
      });
    } catch (error) {
      toast({
        title: 'Error al eliminar el salón',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  if (authLoading || loadingSalons) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-50 p-4 text-center">
        <Building className="w-24 h-24 text-purple-300 mb-6" />
        <h1 className="text-3xl font-bold text-purple-800 mb-4">No se encontró información de la empresa</h1>
        <p className="text-gray-600 mb-8">
          Parece que aún no has registrado tu empresa. Por favor, completa el registro para poder administrar tus salones.
        </p>
        <Button onClick={() => navigate('/registro-empresa')} className="gradient-bg hover:opacity-90">
          Registrar mi empresa
        </Button>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h1 className="text-4xl font-bold gradient-text">Mis Salones</h1>
            <p className="text-gray-600 text-lg">Gestiona todos los salones de tu empresa {company.name}.</p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={() => navigate('/dashboard')} variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 hover:text-purple-700">
              <Home className="mr-2 h-4 w-4" /> Volver al Panel
            </Button>
            <Button onClick={() => navigate('/crear-salon')} className="gradient-bg hover:opacity-90">
              <PlusCircle className="mr-2 h-5 w-5" /> Crear Nuevo Salón
            </Button>
          </div>
        </div>

        {salons.length === 0 && !loadingSalons && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16 bg-white rounded-xl shadow-lg"
          >
            <Building className="w-24 h-24 text-purple-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">Aún no tienes salones registrados</h2>
            <p className="text-gray-500 mb-6">¡Empieza añadiendo tu primer salón para administrarlo con Fedrita!</p>
            <Button onClick={() => navigate('/crear-salon')} className="gradient-bg hover:opacity-90 text-lg px-8 py-3">
              <PlusCircle className="mr-2 h-5 w-5" /> Añadir mi Primer Salón
            </Button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {salons.map((salon, index) => (
            <motion.div
              key={salon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 border-0 overflow-hidden flex flex-col h-full">
                <CardHeader className="bg-gradient-to-tr from-purple-600 to-indigo-600 p-6">
                  <CardTitle className="text-2xl font-bold text-white">{salon.name}</CardTitle>
                  {salon.address && (
                    <CardDescription className="text-purple-200 flex items-center pt-1">
                      <MapPin className="mr-2 h-4 w-4" /> {salon.address}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="p-6 space-y-3 flex-grow">
                  {salon.phone && (
                    <div className="flex items-center text-gray-700">
                      <Phone className="mr-3 h-5 w-5 text-purple-500" />
                      <span>{salon.phone}</span>
                    </div>
                  )}
                  {salon.opening_hours && (
                    <div className="flex items-start text-gray-700">
                      <Clock className="mr-3 h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                      <span className="whitespace-pre-wrap">{salon.opening_hours}</span>
                    </div>
                  )}
                  {!salon.phone && !salon.opening_hours && (
                     <p className="text-gray-500 italic">No hay detalles adicionales.</p>
                  )}
                </CardContent>
                <CardFooter className="p-6 bg-gray-50 border-t flex justify-end space-x-3">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/editar-salon/${salon.id}`)} className="text-purple-600 border-purple-500 hover:bg-purple-50">
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
                        <AlertDialogTitle>¿Estás seguro de eliminar este salón?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Esto eliminará permanentemente el salón "{salon.name}" y todos sus datos asociados.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteSalon(salon.id)} className="bg-red-600 hover:bg-red-700">
                          Sí, eliminar salón
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

export default MySalons;