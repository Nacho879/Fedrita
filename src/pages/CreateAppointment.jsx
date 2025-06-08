
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useAuth } from '@/hooks/useAuth.jsx';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { CalendarPlus as CalendarIcon, User, Mail, Phone, Store, Briefcase, Scissors, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const CreateAppointment = () => {
  const navigate = useNavigate();
  const { user, company } = useAuth();

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [selectedSalon, setSelectedSalon] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('no-preference');
  const [appointmentDateTime, setAppointmentDateTime] = useState(null);
  const [service, setService] = useState('');
  
  const [salons, setSalons] = useState([]);
  const [employees, setEmployees] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [loadingSalons, setLoadingSalons] = useState(true);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  useEffect(() => {
    const fetchSalons = async () => {
      if (!company || !user) {
        setLoadingSalons(false);
        return;
      }
      try {
        setLoadingSalons(true);
        const { data, error } = await supabase
          .from('salons')
          .select('id, name')
          .eq('company_id', company.id)
          .eq('owner_id', user.id);
        if (error) throw error;
        setSalons(data || []);
      } catch (error) {
        toast({ title: "Error al cargar salones", description: error.message, variant: "destructive" });
      } finally {
        setLoadingSalons(false);
      }
    };
    fetchSalons();
  }, [company, user]);

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!selectedSalon || !user) {
        setEmployees([]);
        setSelectedEmployee('no-preference');
        return;
      }
      try {
        setLoadingEmployees(true);
        const { data, error } = await supabase
          .from('employees')
          .select('id, name')
          .eq('salon_id', selectedSalon)
          .eq('owner_id', user.id);
        if (error) throw error;
        setEmployees(data || []);
      } catch (error) {
        toast({ title: "Error al cargar empleados", description: error.message, variant: "destructive" });
      } finally {
        setLoadingEmployees(false);
      }
    };
    if (selectedSalon) {
      fetchEmployees();
    }
  }, [selectedSalon, user]);

  const handleClientDataLookup = async () => {
    if (!clientEmail && !clientPhone) return;
    if (!user) return;

    let query = supabase.from('clients').select('name, email, phone').eq('owner_id', user.id);
    if (clientEmail) query = query.eq('email', clientEmail);
    else if (clientPhone) query = query.eq('phone', clientPhone);
    
    query = query.limit(1).single();

    const { data, error } = await query;

    if (data) {
      setClientName(data.name || clientName);
      setClientEmail(data.email || clientEmail);
      setClientPhone(data.phone || clientPhone);
      toast({ title: "Cliente encontrado", description: "Datos del cliente autocompletados."});
    } else if (error && error.code !== 'PGRST116') { 
      toast({ title: "Error al buscar cliente", description: error.message, variant: "destructive" });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !selectedSalon || !appointmentDateTime || !service) {
      toast({ title: "Campos incompletos", description: "Por favor, rellena todos los campos obligatorios.", variant: "destructive" });
      return;
    }
    setLoading(true);

    try {
      let clientRecord = null;
      if(clientEmail || clientPhone) {
        const { data: existingClient, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('owner_id', user.id)
        .or(`email.eq.${clientEmail},phone.eq.${clientPhone}`)
        .limit(1)
        .single();
        
        if (clientError && clientError.code !== 'PGRST116') throw clientError;
        clientRecord = existingClient;
      }


      const appointmentData = {
        salon_id: selectedSalon,
        employee_id: selectedEmployee === 'no-preference' ? null : selectedEmployee,
        owner_id: user.id,
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone,
        service,
        appointment_time: appointmentDateTime.toISOString(),
      };

      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select()
        .single();

      if (appointmentError) throw appointmentError;

      if (!clientRecord && (clientEmail || clientPhone)) {
         await supabase.from('clients').insert([{
            owner_id: user.id,
            name: clientName,
            email: clientEmail,
            phone: clientPhone,
            first_appointment_id: appointment.id
        }]);
      }


      toast({ title: "¡Reserva creada!", description: `Cita para ${clientName} agendada.` });
      navigate('/mis-citas');
    } catch (error) {
      toast({ title: "Error al crear la reserva", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDateTimeChange = (date) => {
    if (!date) {
      setAppointmentDateTime(null);
      return;
    }
    const currentTime = appointmentDateTime || new Date();
    const newDateTime = new Date(date);
    newDateTime.setHours(currentTime.getHours(), currentTime.getMinutes(), 0, 0);
    setAppointmentDateTime(newDateTime);
  };

  const handleTimeChange = (e) => {
    const timeValue = e.target.value; 
    if (!appointmentDateTime || !timeValue) return;
    
    const [hours, minutes] = timeValue.split(':').map(Number);
    const newDateTime = new Date(appointmentDateTime);
    newDateTime.setHours(hours, minutes, 0, 0);
    setAppointmentDateTime(newDateTime);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-3xl">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-xl gradient-bg flex items-center justify-center">
                <CalendarIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Crear Nueva Reserva</CardTitle>
            <CardDescription className="text-lg">Agenda una nueva cita para tus clientes.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Nombre del Cliente *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input id="clientName" placeholder="Nombre Apellido" value={clientName} onChange={(e) => setClientName(e.target.value)} required className="h-12 pl-12" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Email del Cliente</Label>
                   <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input id="clientEmail" type="email" placeholder="cliente@ejemplo.com" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} onBlur={handleClientDataLookup} className="h-12 pl-12" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientPhone">Teléfono del Cliente</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input id="clientPhone" type="tel" placeholder="+1 234 567 8900" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} onBlur={handleClientDataLookup} className="h-12 pl-12" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="salon">Salón *</Label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                    <Select onValueChange={setSelectedSalon} value={selectedSalon} disabled={loadingSalons}>
                      <SelectTrigger className="h-12 pl-12">
                        <SelectValue placeholder={loadingSalons ? "Cargando..." : "Selecciona un salón"} />
                      </SelectTrigger>
                      <SelectContent>
                        {salons.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                        {salons.length === 0 && !loadingSalons && <div className="p-4 text-sm text-gray-500">No hay salones. <Link to="/crear-salon" className="underline">Crear uno</Link>.</div>}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employee">Empleado (Opcional)</Label>
                   <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                    <Select onValueChange={setSelectedEmployee} value={selectedEmployee} disabled={!selectedSalon || loadingEmployees}>
                      <SelectTrigger className="h-12 pl-12">
                        <SelectValue placeholder={loadingEmployees ? "Cargando..." : "Selecciona un empleado"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no-preference">Ninguno / Sin preferencia</SelectItem>
                        {employees.map(emp => <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>)}
                         {employees.length === 0 && !loadingEmployees && selectedSalon && <div className="p-4 text-sm text-gray-500">No hay empleados para este salón.</div>}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="appointmentDate">Fecha de la Cita *</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal h-12 pl-12", !appointmentDateTime && "text-muted-foreground")}>
                            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            {appointmentDateTime ? format(appointmentDateTime, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={appointmentDateTime} onSelect={handleDateTimeChange} initialFocus disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="appointmentTime">Hora de la Cita *</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input id="appointmentTime" type="time" value={appointmentDateTime ? format(appointmentDateTime, "HH:mm") : ""} onChange={handleTimeChange} required className="h-12 pl-12" disabled={!appointmentDateTime} />
                    </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="service">Servicio Solicitado *</Label>
                <div className="relative">
                  <Scissors className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input id="service" placeholder="Ej: Corte de pelo, Manicura" value={service} onChange={(e) => setService(e.target.value)} required className="h-12 pl-12" />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 gradient-bg hover:opacity-90 text-lg" disabled={loading || loadingSalons}>
                {loading ? "Agendando..." : "Crear Reserva"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateAppointment;
