
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { MessageCircle, Calendar, Users, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center hero-pattern overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-purple-50"></div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Automatización inteligente para salones</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="gradient-text">Fedrita</span>, tu asistente
              <br />
              inteligente para salones
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Atiende WhatsApp, agenda turnos y gestiona tu equipo sin esfuerzo. 
              La IA que revoluciona la gestión de salones de belleza.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button size="lg" asChild className="gradient-bg hover:opacity-90 text-lg px-8 py-4 pulse-glow">
              <Link to="/register">Crear cuenta gratuita</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-4">
              <Link to="/login">Iniciar sesión</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center space-x-3 bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <MessageCircle className="w-8 h-8 text-purple-600" />
              <span className="font-semibold text-gray-700">WhatsApp Automático</span>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <Calendar className="w-8 h-8 text-purple-600" />
              <span className="font-semibold text-gray-700">Agenda Inteligente</span>
            </div>
            <div className="flex items-center justify-center space-x-3 bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <Users className="w-8 h-8 text-purple-600" />
              <span className="font-semibold text-gray-700">Gestión de Equipo</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-purple-300 rounded-full flex justify-center"
        >
          <div className="w-1 h-3 bg-purple-400 rounded-full mt-2"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
