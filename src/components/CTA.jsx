
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-20 gradient-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center text-white"
        >
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Únete a miles de salones exitosos</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            ¿Listo para transformar
            <br />
            tu salón con IA?
          </h2>
          
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90 leading-relaxed">
            Comienza gratis hoy y descubre cómo Fedrita puede revolucionar 
            la gestión de tu negocio en menos de 5 minutos.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              size="lg" 
              asChild 
              className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4 shadow-xl"
            >
              <Link to="/register" className="flex items-center space-x-2">
                <span>Crear cuenta gratis</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-8 text-sm opacity-75"
          >
            ✓ Sin tarjeta de crédito requerida • ✓ Configuración en 5 minutos • ✓ Soporte 24/7
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full floating-animation"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-white/10 rounded-full floating-animation" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full floating-animation" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 right-1/3 w-24 h-24 bg-white/10 rounded-full floating-animation" style={{ animationDelay: '0.5s' }}></div>
      </div>
    </section>
  );
};

export default CTA;
