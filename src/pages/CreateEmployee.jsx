
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth.jsx';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { UserPlus, Briefcase, Store, Clock, Crown } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const CreateEmployee = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [availability, setAvailability] = useState('');
  const [selectedSalon, setSelectedSalon] = useState('');
  const [isManager, setIsManager] = useState(false);
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSalons, setLoadingSalons] = useState(true);
  const { user, company, userRole, managedSalon } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSalons = async () => {
      if (!company || !user) {
        setLoadingSalons(false);
        return;
      }
      try {
        setLoadingSalons(true);
        let query = supabase
          .from('salons')
          .select('id, name');

        if (userRole === 'admin') {
          query = query.eq('company_id', company.id).eq('owner_id', user.id);
        } else if (userRole === 'manager' && managedSalon) {
          query = query.eq('id', managedSalon.id);
          setSelectedSalon(managedSalon.id);
        }

        const { data, error } = await query;
        if (error) throw error;
        setSalons(data || []);
      } catch (error) {
        toast({
          title: "Error al cargar salones",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoadingSalons(false);
      }
    };
    fetchSalons();
  }, [company, user, userRole, managedSalon]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !selectedSalon) {
      toast({
        title: "Error",
        description: "Debes estar autenticado y seleccionar un salón.",
        variant: "destructive",
      });
      return;
    }

    if (isManager && !employeeEmail) {
      toast({
        title: "Email requerido",
        description: "Para designar un manager, necesitas proporcionar su email.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let managerId = null;

      if (isManager && employeeEmail) {
        const { data: userData, error: userError } = await supabase.auth.admin.getUserByEmail(employeeEmail);
        
        if (userError || !userData.user) {
          toast({
            title: "Usuario no encontrado",
            description: "No se encontró un usuario con ese email. El empleado debe registrarse primero en Fedrita.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        
        managerId = userData.user.id;
      }

      const employeeData = {
        name: employeeName,
        specialty,
        availability,
        salon_id: selectedSalon,
        owner_id: userRole === 'admin' ? user.id : managedSalon.owner_id,
      };

      const { data: employee, error: employeeError } = await supabase
        .from('employees')
        .insert([employeeData])
        .select()
        .single();

      if (employeeError) throw employeeError;

      if (isManager && managerId) {
        const { error: salonUpdateError } = await supabase
          .from('salons')
          .update({ manager_id: managerId })
          .eq('id', selectedSalon);

        if (salonUpdateError) throw salonUpdateError;

        toast({
          title: "¡Empleado y Manager creados!",
          description: `${employeeName} ha sido añadido como manager del salón.`,
        });
      } else {
        toast({
          title: "¡Empleado creado exitosamente!",
          description: `${employeeName} ha sido añadido al salón.`,
        });
      }

      if (userRole === 'manager') {
        navigate('/empleados-salon');
      } else {
        navigate('/mis-empleados');
      }
    } catch (error) {
      toast({
        title: "Error al crear el empleado",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-xl gradient-bg flex items-center justify-center">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Añadir Nuevo Empleado</CardTitle>
            <CardDescription className="text-lg">
              Completa los datos del nuevo miembro de tu equipo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="employeeName">Nombre del empleado *</Label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="employeeName"
                    type="text"
                    placeholder="Nombre Apellido"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    required
                    className="h-12 pl-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialty">Rol o especialidad *</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="specialty"
                    type="text"
                    placeholder="Ej: Estilista, Manicurista, Colorista"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    required
                    className="h-12 pl-12"
                  />
                </div>
              </div>
              
              {userRole === 'admin' && (
                <div className="space-y-2">
                  <Label htmlFor="salon">Salón al que pertenece *</Label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                    <Select onValueChange={setSelectedSalon} value={selectedSalon} disabled={loadingSalons}>
                      <SelectTrigger className="h-12 pl-12">
                        <SelectValue placeholder={loadingSalons ? "Cargando salones..." : "Selecciona un salón"} />
                      </SelectTrigger>
                      <SelectContent>
                        {salons.map((salon) => (
                          <SelectItem key={salon.id} value={salon.id}>
                            {salon.name}
                          </SelectItem>
                        ))}
                        {salons.length === 0 && !loadingSalons && (
                          <div className="p-4 text-sm text-gray-500">No tienes salones creados.</div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  {salons.length === 0 && !loadingSalons && (
                    <p className="text-sm text-red-500">Debes <a href="/crear-salon" className="underline">crear un salón</a> primero.</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="availability">Horarios disponibles</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-4 transform -translate-y-0 w-5 h-5 text-gray-400" />
                  <Textarea
                    id="availability"
                    placeholder="Ej: Lunes a Viernes: 10am - 6pm"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="h-24 pl-12 pt-3"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Indica la disponibilidad general del empleado.
                </p>
              </div>

              <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="isManager"
                    checked={isManager}
                    onCheckedChange={setIsManager}
                  />
                  <Label htmlFor="isManager" className="flex items-center space-x-2 cursor-pointer">
                    <Crown className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-purple-800">Este empleado será manager del salón</span>
                  </Label>
                </div>
                
                {isManager && (
                  <div className="space-y-2">
                    <Label htmlFor="employeeEmail">Email del empleado (requerido para managers) *</Label>
                    <Input
                      id="employeeEmail"
                      type="email"
                      placeholder="empleado@email.com"
                      value={employeeEmail}
                      onChange={(e) => setEmployeeEmail(e.target.value)}
                      required={isManager}
                      className="h-12"
                    />
                    <p className="text-sm text-purple-600">
                      El empleado debe tener una cuenta registrada en Fedrita para ser designado como manager.
                    </p>
                  </div>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 gradient-bg hover:opacity-90 text-lg"
                disabled={loading || loadingSalons || (userRole === 'admin' && salons.length === 0)}
              >
                {loading ? "Guardando empleado..." : "Añadir Empleado"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateEmployee;
