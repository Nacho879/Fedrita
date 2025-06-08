
import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Settings, Rocket } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "1. Regístrate gratis",
      description: "Crea tu cuenta en menos de 2 minutos y configura los datos básicos de tu salón."
    },
    {
      icon: Settings,
      title: "2. Configura tu asistente",
      description: "Personaliza Fedrita con tus servicios, horarios y equipo de trabajo."
    },
    {
      icon: Rocket,
      title: "3. ¡Listo para funcionar!",
      description: "Conecta tu WhatsApp y deja que Fedrita gestione automáticamente tus reservas."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Cómo <span className="gradient-text">funciona</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            En solo 3 pasos simples tendrás tu asistente virtual funcionando 
            y transformando la gestión de tu salón.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`flex items-center mb-16 ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}
            >
              <div className="flex-1 px-8">
                <div className={`text-center ${index % 2 === 1 ? 'text-right' : 'text-left'}`}>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">{step.title}</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-24 h-24 gradient-bg rounded-full flex items-center justify-center shadow-2xl floating-animation">
                  <step.icon className="w-12 h-12 text-white" />
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-1 h-16 bg-gradient-to-b from-purple-400 to-purple-200"></div>
                )}
              </div>
              
              <div className="flex-1 px-8"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
