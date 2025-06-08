
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "María González",
      business: "Salón Elegance",
      image: "Propietaria de salón de belleza sonriendo",
      rating: 5,
      text: "Fedrita revolucionó mi salón. Ahora mis clientes pueden agendar citas a cualquier hora y nunca perdemos una reserva. ¡Increíble!"
    },
    {
      name: "Carlos Mendoza",
      business: "Beauty Studio CM",
      image: "Estilista profesional en su salón",
      rating: 5,
      text: "La automatización de WhatsApp es fantástica. Mis clientes están más satisfechos y yo tengo más tiempo para enfocarme en mi trabajo."
    },
    {
      name: "Ana Rodríguez",
      business: "Spa & Beauty",
      image: "Mujer profesional en ambiente de spa",
      rating: 5,
      text: "Desde que uso Fedrita, mis ventas aumentaron 35%. La IA entiende perfectamente a mis clientes y agenda todo automáticamente."
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Lo que dicen nuestros <span className="gradient-text">clientes</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Miles de salones ya confían en Fedrita para transformar su negocio. 
            Descubre sus experiencias y resultados.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-purple-200" />
              
              <div className="flex items-center mb-6">
                <img  
                  className="w-16 h-16 rounded-full object-cover mr-4"
                  alt={`${testimonial.name} - ${testimonial.business}`}
                 src="https://images.unsplash.com/photo-1644424235476-295f24d503d9" />
                <div>
                  <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                  <p className="text-purple-600 font-medium">{testimonial.business}</p>
                </div>
              </div>

              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-gray-600 leading-relaxed italic">"{testimonial.text}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
