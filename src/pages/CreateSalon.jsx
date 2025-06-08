import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth.jsx';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Store, MapPin, Phone, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const CreateSalon = () => {
  const [salonName, setSalonName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [loading, setLoading] = useState(false);
  const { company, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!company || !user) {
      toast({
        title: "Error",
        description: "Debes tener una empresa registrada y estar autenticado.",
        variant: "destructive",
      });
      navigate('/dashboard');
      return;
    }
    setLoading(true);

    try {
      const salonData = {
        name: salonName,
        address,
        phone,
        opening_hours: openingHours,
        company_id: company.id,
        owner_id: user.id, 
      };

      const { data, error } = await supabase
        .from('salons')
        .insert([salonData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "¡Salón creado exitosamente!",
        description: `${salonName} ha sido añadido a tu empresa.`,
      });

      navigate('/mis-salones');
    } catch (error) {
      toast({
        title: "Error al crear el salón",
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
                <Store className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Crear Nuevo Salón</CardTitle>
            <CardDescription className="text-lg">
              Añade los detalles de tu nuevo salón de belleza.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="salonName">Nombre del salón *</Label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="salonName"
                    type="text"
                    placeholder="Mi Salón Principal"
                    value={salonName}
                    onChange={(e) => setSalonName(e.target.value)}
                    required
                    className="h-12 pl-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección completa *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="address"
                    type="text"
                    placeholder="Calle Falsa 123, Ciudad, País"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="h-12 pl-12"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="h-12 pl-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="openingHours">Horarios de atención *</Label>
                <div className="relative">
                   <Clock className="absolute left-3 top-4 transform -translate-y-0 w-5 h-5 text-gray-400" />
                  <Textarea
                    id="openingHours"
                    placeholder="Ej: Lunes a Viernes: 9am - 7pm, Sábados: 10am - 5pm"
                    value={openingHours}
                    onChange={(e) => setOpeningHours(e.target.value)}
                    required
                    className="h-24 pl-12 pt-3"
                  />
                </div>
                 <p className="text-sm text-gray-500">
                  Puedes detallar los horarios por día.
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 gradient-bg hover:opacity-90 text-lg"
                disabled={loading}
              >
                {loading ? "Guardando salón..." : "Crear Salón"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateSalon;