
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
import { PlusCircle, Edit3, Trash2, User, Briefcase, Clock, Users, Home, Store } from 'lucide-react';

const MyEmployees = () => {
  const { user, company, loading: authLoading } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!user) {
         if (!authLoading) setLoadingEmployees(false);
        return;
      }
      try {
        setLoadingEmployees(true);
        // Fetch employees owned by the user, and join with salons to get salon name
        const { data, error } = await supabase
          .from('employees')
          .select(`
            *,
            salons (name)
          `)
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setEmployees(data || []);
      } catch (error) {
        toast({
          title: 'Error al cargar los empleados',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoadingEmployees(false);
      }
    };
    
    if (!authLoading) {
        fetchEmployees();
    }
  }, [user, authLoading]);

  const handleDeleteEmployee = async (employeeId) => {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employeeId)
        .eq('owner_id', user.id);

      if (error) throw error;
      setEmployees(employees.filter((employee) => employee.id !== employeeId));
      toast({
        title: 'Empleado eliminado',
        description: 'El empleado ha sido eliminado exitosamente.',
      });
    } catch (error) {
      toast({
        title: 'Error al eliminar el empleado',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  if (authLoading || loadingEmployees) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-purple-600"></div>
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
            <h1 className="text-4xl font-bold gradient-text">Mis Empleados</h1>
            <p className="text-gray-600 text-lg">Gestiona todos los empleados de tus salones.</p>
          </div>
          <div className="flex space-x-3">
             <Button onClick={() => navigate('/dashboard')} variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50 hover:text-purple-700">
              <Home className="mr-2 h-4 w-4" /> Volver al Panel
            </Button>
            <Button onClick={() => navigate('/crear-empleado')} className="gradient-bg hover:opacity-90">
              <PlusCircle className="mr-2 h-5 w-5" /> Añadir Empleado
            </Button>
          </div>
        </div>

        {employees.length === 0 && !loadingEmployees && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16 bg-white rounded-xl shadow-lg"
          >
            <Users className="w-24 h-24 text-purple-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">Aún no tienes empleados registrados</h2>
            <p className="text-gray-500 mb-6">¡Empieza añadiendo tu primer empleado para gestionar tu equipo!</p>
            <Button onClick={() => navigate('/crear-empleado')} className="gradient-bg hover:opacity-90 text-lg px-8 py-3">
              <PlusCircle className="mr-2 h-5 w-5" /> Añadir mi Primer Empleado
            </Button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {employees.map((employee, index) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 border-0 overflow-hidden flex flex-col h-full">
                <CardHeader className="bg-gradient-to-tr from-indigo-500 to-blue-500 p-6">
                  <CardTitle className="text-2xl font-bold text-white flex items-center">
                    <User className="mr-3 h-6 w-6" /> {employee.name}
                  </CardTitle>
                  {employee.specialty && (
                    <CardDescription className="text-indigo-100 flex items-center pt-1">
                      <Briefcase className="mr-2 h-4 w-4" /> {employee.specialty}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="p-6 space-y-3 flex-grow">
                  {employee.salons?.name && (
                     <div className="flex items-center text-gray-700">
                      <Store className="mr-3 h-5 w-5 text-purple-500" />
                      <span>Salón: {employee.salons.name}</span>
                    </div>
                  )}
                  {employee.availability && (
                    <div className="flex items-start text-gray-700">
                      <Clock className="mr-3 h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                      <span className="whitespace-pre-wrap">{employee.availability}</span>
                    </div>
                  )}
                  {!employee.availability && !employee.salons?.name && (
                     <p className="text-gray-500 italic">No hay detalles adicionales.</p>
                  )}
                </CardContent>
                <CardFooter className="p-6 bg-gray-50 border-t flex justify-end space-x-3">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/editar-empleado/${employee.id}`)} className="text-purple-600 border-purple-500 hover:bg-purple-50">
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
                        <AlertDialogTitle>¿Estás seguro de eliminar a este empleado?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Esto eliminará permanentemente al empleado "{employee.name}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteEmployee(employee.id)} className="bg-red-600 hover:bg-red-700">
                          Sí, eliminar empleado
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

export default MyEmployees;
