'use client';
import { Ticket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

// Add CSS for background pattern
const backgroundPatternCSS = `
  .bg-grid-pattern {
    background-image: 
      linear-gradient(rgba(6, 182, 212, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(6, 182, 212, 0.05) 1px, transparent 1px);
    background-size: 50px 50px;
  }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = backgroundPatternCSS;
  document.head.appendChild(style);
}

export const HeroSection = () => {
  const router = useRouter();

  const handleViewRaffles = () => {
    // Check if user is authenticated - for now just navigate to rifas
    router.push('/rifas');
  };

  const handleLearnMore = () => {
    // Scroll to how it works section
    const element = document.getElementById('como-funciona');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <section className="relative w-full py-24 md:py-40 bg-gradient-to-br from-gray-50 via-cyan-50/30 to-teal-50/30 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-cyan-400/20 to-teal-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-56 h-56 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
      
      <div className="relative container mx-auto px-4 md:px-6 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm font-medium text-cyan-700 border border-cyan-200/50 shadow-sm">
            <Ticket className="w-4 h-4" />
            <span>Bienvenido a Mister Winner</span>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-6">
          <span className="bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-700 bg-clip-text text-transparent">
            La forma más fácil
          </span>
          <br />
          <span className="text-gray-900">de participar y ganar</span>
        </h1>
        
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
          Compra tus números de la suerte, sigue los sorteos en tiempo real y reclama
          tus premios de manera segura. ¡La emoción de ganar nunca fue tan sencilla!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            className="group px-8 py-4 text-lg bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={handleViewRaffles}
          >
            <Ticket className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" /> 
            Ver Rifas Disponibles
          </Button>
          <Button 
            variant="outline"
            className="px-8 py-4 text-lg border-2 border-gray-300 hover:border-cyan-400 hover:bg-cyan-50 text-gray-700 hover:text-cyan-700 rounded-xl transition-all duration-300"
            onClick={handleLearnMore}
          >
            Aprende Más
          </Button>
        </div>
        
        {/* Trust indicators */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>100% Seguro</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Sorteos Transparentes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Pagos Inmediatos</span>
          </div>
        </div>
      </div>
    </section>
  );
};
