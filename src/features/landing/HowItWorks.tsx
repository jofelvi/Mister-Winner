'use client';
import { useEffect } from 'react';
import { Award, CreditCard, Hash, Shield, Ticket, Zap } from 'lucide-react';

export const HowItWorks = () => {
  useEffect(() => {
    // Add CSS for background pattern with Mac optimizations
    const backgroundPatternCSS = `
      .bg-grid-pattern-how {
        background-image: 
          linear-gradient(rgba(6, 182, 212, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(6, 182, 212, 0.05) 1px, transparent 1px);
        background-size: 50px 50px;
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        will-change: transform;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
      }
    `;

    const style = document.createElement('style');
    style.textContent = backgroundPatternCSS;
    document.head.appendChild(style);

    return () => {
      // Cleanup: remove style on unmount
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);
  const steps = [
    {
      icon: <Hash className="h-8 w-8" />,
      title: 'Elige tu número',
      description:
        'Explora las rifas disponibles y selecciona tus números de la suerte. ¡Cada número tiene la misma oportunidad!',
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'from-cyan-50 to-blue-50',
      borderColor: 'border-cyan-200',
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: 'Pago Seguro',
      description:
        'Realiza el pago de forma segura a través de Pago Móvil, transferencias o con tus créditos acumulados.',
      color: 'from-teal-500 to-green-500',
      bgColor: 'from-teal-50 to-green-50',
      borderColor: 'border-teal-200',
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: '¡Gana y Cobra!',
      description:
        'Sigue el sorteo en tiempo real y comprueba si eres el ganador. ¡Recibe tu premio de inmediato!',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'from-amber-50 to-orange-50',
      borderColor: 'border-amber-200',
    },
  ];

  const features = [
    {
      icon: <Shield className="h-5 w-5" />,
      text: 'Totalmente Seguro',
      color: 'text-green-600',
    },
    {
      icon: <Zap className="h-5 w-5" />,
      text: 'Sorteos en Vivo',
      color: 'text-yellow-600',
    },
    {
      icon: <Ticket className="h-5 w-5" />,
      text: 'Sin Comisiones',
      color: 'text-blue-600',
    },
  ];

  return (
    <section
      id="como-funciona"
      className="relative w-full py-10 md:py-10 bg-gradient-to-b from-gray-50 via-white to-cyan-50/30 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern-how opacity-5"></div>
      <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-cyan-400/10 to-teal-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-56 h-56 bg-gradient-to-br from-teal-400/10 to-cyan-400/10 rounded-full blur-3xl"></div>

      <div className="relative container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm font-medium text-cyan-700 border border-cyan-200/50 shadow-sm mb-6">
            <Zap className="w-4 h-4" />
            <span>Fácil y Rápido</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span 
              className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent"
              style={{ 
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              ¿Cómo Funciona
            </span>
            <span className="text-gray-900"> Mister Winner?</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Participar en nuestras rifas es muy sencillo. Solo sigue estos 3
            pasos y podrás ganar increíbles premios.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-cyan-200 to-teal-200 z-0">
                  <div className="absolute top-1/2 right-0 transform translate-x-1 -translate-y-1/2 w-2 h-2 bg-teal-400 rounded-full"></div>
                </div>
              )}

              <div
                className={`relative bg-gradient-to-br ${step.bgColor} rounded-2xl p-8 border-2 ${step.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 z-10`}
              >
                {/* Step number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {index + 1}
                </div>

                {/* Icon */}
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mb-6 mx-auto text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  {step.icon}
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-lg">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              ¿Por qué elegir Mister Winner?
            </h3>
            <p className="text-gray-600">
              Somos la plataforma de rifas más confiable y transparente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center justify-center gap-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className={`${feature.color}`}>{feature.icon}</div>
                <span className="font-medium text-gray-800">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
