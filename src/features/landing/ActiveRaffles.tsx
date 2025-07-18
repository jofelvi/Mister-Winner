'use client';

import { useCallback, useEffect, useState } from 'react';
import { Raffle } from '@/types';
import { RaffleCard } from '@/features/landing/RaffleCard';
import raffleService from '@/services/raffleService';
import { Loader } from '@/components/shared/Loader/Loader';
import { Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ActiveRaffles = () => {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(3);

  // Responsive items per view
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  useEffect(() => {
    const fetchActiveRaffles = async () => {
      try {
        setLoading(true);
        const activeRaffles = await raffleService.getActiveRaffles();
        setRaffles(activeRaffles);
        setError(null);
      } catch (err) {
        console.error('Error fetching active raffles:', err);
        setError('Error al cargar las rifas activas');
      } finally {
        setLoading(false);
      }
    };

    void fetchActiveRaffles();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || raffles.length <= itemsPerView) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const maxIndex = Math.max(0, raffles.length - itemsPerView);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, raffles.length, itemsPerView]);

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => {
      const maxIndex = Math.max(0, raffles.length - itemsPerView);
      return prev >= maxIndex ? 0 : prev + 1;
    });
  }, [raffles.length, itemsPerView]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => {
      const maxIndex = Math.max(0, raffles.length - itemsPerView);
      return prev <= 0 ? maxIndex : prev - 1;
    });
  }, [raffles.length, itemsPerView]);

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  if (loading) {
    return (
      <section
        id="rifas"
        className="w-full py-12 md:py-16 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium mb-4">
              <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></div>
              <span>Cargando rifas...</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                Rifas Activas
              </span>
            </h2>
          </div>
          <div className="flex justify-center">
            <Loader />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="rifas"
        className="w-full py-20 md:py-24 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                Rifas Activas
              </span>
            </h2>
          </div>
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-red-700 mb-2">
              Error al cargar rifas
            </h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="rifas"
      className="w-full py-12 md:py-16 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium mb-3">
            <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></div>
            <span>Rifas en Vivo</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Rifas Activas
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubre las emocionantes rifas disponibles ahora. ¡Participa y ten
            la oportunidad de ganar increíbles premios!
          </p>
        </div>

        {raffles.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay rifas activas
            </h3>
            <p className="text-gray-600 mb-6">
              No hay rifas disponibles en este momento. ¡Pronto habrá nuevas
              oportunidades!
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg hover:from-cyan-700 hover:to-teal-700 transition-all duration-200">
              Notifícame cuando haya rifas
            </button>
          </div>
        ) : (
          <div className="relative">
            {/* Carousel Controls */}
            <div className="flex justify-between items-center mb-8">
              {/*<div className="flex items-center gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={prevSlide}
                  disabled={raffles.length <= itemsPerView}
                  className="w-10 h-10 rounded-full border-2 border-cyan-200 hover:border-cyan-400 hover:bg-cyan-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 text-cyan-600" />
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={nextSlide}
                  disabled={raffles.length <= itemsPerView}
                  className="w-10 h-10 rounded-full border-2 border-cyan-200 hover:border-cyan-400 hover:bg-cyan-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4 text-cyan-600" />
                </Button>
              </div>*/}

              {raffles.length > itemsPerView && (
                <div className="flex items-center gap-4">
                  {/* Dots indicator */}
                  <div className="flex gap-2">
                    {Array.from({
                      length: Math.max(0, raffles.length - itemsPerView + 1),
                    }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentIndex
                            ? 'bg-cyan-600 w-6'
                            : 'bg-cyan-200 hover:bg-cyan-300'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Auto-play toggle */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleAutoPlay}
                    className={`flex items-center gap-2 text-sm border-2 transition-all duration-200 ${
                      isAutoPlaying
                        ? 'border-green-200 text-green-700 hover:border-green-400 hover:bg-green-50'
                        : 'border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {isAutoPlaying ? (
                      <>
                        <Pause className="w-3 h-3" /> Auto
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3" /> Manual
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Carousel Container */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                  width: `${(raffles.length / itemsPerView) * 100}%`,
                }}
              >
                {raffles.map((raffle, index) => (
                  <div
                    key={raffle.id}
                    className="flex-shrink-0 px-4"
                    style={{ width: `${100 / raffles.length}%` }}
                  >
                    <RaffleCard raffle={raffle} />
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Info */}
            {raffles.length > 0 && (
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-full text-sm">
                  <span>Mostrando</span>
                  <span className="font-semibold">
                    {Math.min(currentIndex + itemsPerView, raffles.length)}
                  </span>
                  <span>de</span>
                  <span className="font-semibold">{raffles.length}</span>
                  <span>rifas activas</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
