
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 glass-effect border-b border-white/20"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <span className="text-2xl font-bold gradient-text">Fedrita</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-purple-600 transition-colors">
            Inicio
          </Link>
          <Link to="#features" className="text-gray-700 hover:text-purple-600 transition-colors">
            Características
          </Link>
          <Link to="#benefits" className="text-gray-700 hover:text-purple-600 transition-colors">
            Beneficios
          </Link>
          <Link to="#testimonials" className="text-gray-700 hover:text-purple-600 transition-colors">
            Testimonios
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Salir</span>
              </Button>
            </div>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/login">Iniciar sesión</Link>
              </Button>
              <Button asChild className="gradient-bg hover:opacity-90">
                <Link to="/register">Crear cuenta gratuita</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
