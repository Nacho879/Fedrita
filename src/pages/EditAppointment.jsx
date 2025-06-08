import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const EditAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [service, setService] = useState('');

  useEffect(() => {
    const fetchAppointment = async () => {
      const { data, error } = await supabase.from('appointments').select('*').eq('id', id).single();
      if (error) {
        toast.error('No se pudo cargar la cita.');
        navigate('/mis-citas');
      } else {
        setAppointment(data);
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone);
        setDate(data.date);
        setTime(data.time);
        setService(data.service);
      }
      setLoading(false);
    };
    fetchAppointment();
  }, [id, navigate]);

  const handleUpdate = async () => {
    if (!name || !email || !phone || !date || !time || !service) {
      toast.error('Todos los campos son obligatorios.');
      return;
    }

    const { error } = await supabase
      .from('appointments')
      .update({ name, email, phone, date, time, service })
      .eq('id', id);

    if (error) {
      toast.error('Error al actualizar la cita.');
    } else {
      toast.success('Cita actualizada exitosamente.');
      navigate('/mis-citas');
    }
  };

  if (loading) return <p className="text-center mt-8">Cargando...</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Editar Cita</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Nombre</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label>Teléfono</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <div>
            <Label>Fecha</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div>
            <Label>Hora</Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
          </div>
          <div>
            <Label>Servicio</Label>
            <Input value={service} onChange={(e) => setService(e.target.value)} required />
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button onClick={handleUpdate}>Guardar Cambios</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EditAppointment;
