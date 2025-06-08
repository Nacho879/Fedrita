
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Heart, DollarSign } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Aumenta tus ventas hasta 40%",
      description: "Nunca pierdas una cita. Fedrita convierte consultas en reservas automáticamente.",
      stat: "+40%",
      color: "from-green-400 to-green-600"
    },
    {
      icon: Clock,
      title: "Ahorra 15 horas semanales",
      description: "Automatiza tareas repetitivas y enfócate en lo que realmente importa: tus clientes.",
      stat: "15h",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: Heart,
      title: "Clientes más satisfechos",
      description: "Respuesta inmediata 24/7 mejora la experiencia y fidelización de clientes.",
      stat: "98%",
      color: "from-pink-400 to-pink-600"
    },
    {
      icon: DollarSign,
      title: "Reduce costos operativos",
      description: "Menos personal administrativo necesario, más eficiencia en la gestión.",
      stat: "-30%",
      color: "from-purple-400 to-purple-600"
    }
  ];

  return (
    <section id="benefits" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Beneficios para tu <span className="gradient-text">Salón</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre cómo Fedrita transforma la gestión de tu salón y potencia tu negocio 
            con resultados medibles desde el primer día.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start space-x-6">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${benefit.color} flex items-center justify-center shadow-lg`}>
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{benefit.title}</h3>
                    <span className={`text-2xl font-bold bg-gradient-to-r ${benefit.color} bg-clip-text text-transparent`}>
                      {benefit.stat}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
              
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${benefit.color} opacity-5 rounded-full -translate-y-16 translate-x-16`}></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
