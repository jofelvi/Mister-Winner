'use client';
import { Ticket, Mail, Phone, MapPin, Shield, Heart, Star } from 'lucide-react';
import Link from 'next/link';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative container mx-auto px-4 md:px-6">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500">
                  <Ticket className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                    Mister Winner
                  </h3>
                  <p className="text-sm text-gray-400">Tu oportunidad de ganar</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
                La plataforma de rifas más confiable y transparente de Venezuela. 
                Participa, gana y disfruta de una experiencia segura y emocionante.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>100% Seguro</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>Verificado</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#rifas" className="text-gray-300 hover:text-cyan-400 transition-colors duration-200 flex items-center gap-2">
                    <span>Rifas Activas</span>
                  </a>
                </li>
                <li>
                  <a href="#como-funciona" className="text-gray-300 hover:text-cyan-400 transition-colors duration-200">
                    ¿Cómo Funciona?
                  </a>
                </li>
                <li>
                  <a href="#ganadores" className="text-gray-300 hover:text-cyan-400 transition-colors duration-200">
                    Ganadores
                  </a>
                </li>
                <li>
                  <Link href="/login" className="text-gray-300 hover:text-cyan-400 transition-colors duration-200">
                    Iniciar Sesión
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-gray-300 hover:text-cyan-400 transition-colors duration-200">
                    Registrarse
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contacto</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-300">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm">info@misterwinner.com</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <Phone className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm">+58 414-123-4567</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm">Caracas, Venezuela</span>
                </li>
              </ul>
              
              {/* Trust Badge */}
              <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium text-white">Hecho con amor</span>
                </div>
                <p className="text-xs text-gray-400">
                  Para brindar la mejor experiencia de rifas en línea
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              &copy; {currentYear} Mister Winner. Todos los derechos reservados.
            </p>
            
            <div className="flex items-center gap-6">
              <Link 
                href="/terminos" 
                className="text-sm text-gray-400 hover:text-cyan-400 transition-colors duration-200"
              >
                Términos y Condiciones
              </Link>
              <Link 
                href="/privacidad" 
                className="text-sm text-gray-400 hover:text-cyan-400 transition-colors duration-200"
              >
                Política de Privacidad
              </Link>
              <Link 
                href="/ayuda" 
                className="text-sm text-gray-400 hover:text-cyan-400 transition-colors duration-200"
              >
                Ayuda
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Grid pattern styles */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </footer>
  );
};
