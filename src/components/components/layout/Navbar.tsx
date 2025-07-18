'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, Ticket, X } from 'lucide-react';

const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '#rifas', label: 'Rifas Activas' },
    { href: '#como-funciona', label: '¿Cómo Funciona?' },
    { href: '#ganadores', label: 'Ganadores' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 group-hover:from-cyan-600 group-hover:to-teal-600 transition-all duration-200">
            <Ticket className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
            Mister Winner
          </span>
        </Link>
        <nav className="hidden md:flex gap-6">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-700 hover:text-cyan-600 transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-teal-500 group-hover:w-full transition-all duration-200"></span>
            </a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => router.push('/login')}
            className="text-gray-700 hover:text-cyan-600 hover:bg-cyan-50 transition-colors"
          >
            Iniciar Sesión
          </Button>
          <Button
            onClick={() => router.push('/register')}
            className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            Registrarse
          </Button>
        </div>
        <div className="md:hidden">
          <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
          <nav className="flex flex-col items-center gap-4 p-6">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-base font-medium text-gray-700 hover:text-cyan-600 transition-colors py-2"
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col w-full gap-3 mt-4">
              <Button
                variant="ghost"
                className="w-full text-gray-700 hover:text-cyan-600 hover:bg-cyan-50 py-3"
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push('/login');
                }}
              >
                Iniciar Sesión
              </Button>
              <Button
                className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white py-3 rounded-lg shadow-md"
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push('/register');
                }}
              >
                Registrarse
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
