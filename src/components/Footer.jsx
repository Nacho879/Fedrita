
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-2xl font-bold">Fedrita</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              La plataforma de IA más avanzada para salones de belleza. 
              Automatiza tu WhatsApp, gestiona reservas y potencia tu negocio.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>hola@fedrita.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          <div>
            <span className="text-lg font-semibold mb-4 block">Producto</span>
            <ul className="space-y-3">
              <li><Link to="#features" className="text-gray-400 hover:text-white transition-colors">Características</Link></li>
              <li><Link to="#benefits" className="text-gray-400 hover:text-white transition-colors">Beneficios</Link></li>
              <li><Link to="#testimonials" className="text-gray-400 hover:text-white transition-colors">Testimonios</Link></li>
              <li><Link to="/register" className="text-gray-400 hover:text-white transition-colors">Precios</Link></li>
            </ul>
          </div>

          <div>
            <span className="text-lg font-semibold mb-4 block">Empresa</span>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">Acerca de</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contacto</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacidad</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Términos</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Fedrita. Todos los derechos reservados.
            </p>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>Hecho con</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>para salones de belleza</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
