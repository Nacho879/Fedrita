
import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Calendar, Brain, Users, BarChart3, Shield } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: MessageCircle,
      title: "Atención WhatsApp 24/7",
      description: "Responde automáticamente a tus clientes las 24 horas, agenda citas y resuelve consultas básicas."
    },
    {
      icon: Calendar,
      title: "Agenda Inteligente",
      description: "Gestiona turnos, evita solapamientos y optimiza los horarios de tu equipo automáticamente."
    },
    {
      icon: Brain,
      title: "IA Conversacional",
      description: "Comprende el lenguaje natural de tus clientes y ofrece respuestas personalizadas."
    },
    {
      icon: Users,
      title: "Gestión de Equipo",
      description: "Administra horarios, servicios y disponibilidad de cada profesional de tu salón."
    },
    {
      icon: BarChart3,
      title: "Reportes y Analytics",
      description: "Obtén insights valiosos sobre tu negocio con reportes detallados y métricas clave."
    },
    {
      icon: Shield,
      title: "Seguridad Total",
      description: "Protección de datos de clientes con encriptación y cumplimiento de normativas."
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Qué es <span className="gradient-text">Fedrita</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Una plataforma completa que combina inteligencia artificial con gestión empresarial 
            para revolucionar la forma en que manejas tu salón de belleza.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-16 h-16 gradient-bg rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
