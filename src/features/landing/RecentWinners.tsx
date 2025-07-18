'use client';

import { useEffect, useState, memo, useMemo } from 'react';
import { Winner } from '@/types';
import { Card } from '@/components/ui/card';
import { Award, Calendar, Crown, Hash, Sparkles, Trophy } from 'lucide-react';
import winnerService from '@/services/winnerService';
import { Loader } from '@/components/shared/Loader/Loader';
import { formatFirebaseDate } from '@/utils/dateUtils';

export const RecentWinners = () => {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentWinners = async () => {
      try {
        setLoading(true);
        const recentWinners = await winnerService.getRecentWinners(5);
        setWinners(recentWinners);
        setError(null);
      } catch (err) {
        console.error('Error fetching recent winners:', err);
        setError('Error al cargar los ganadores recientes');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentWinners();
  }, []);

  if (loading) {
    return (
      <section
        id="ganadores"
        className="w-full py-24 md:py-32 bg-gradient-to-b from-white via-teal-50/30 to-cyan-50/30"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm font-medium text-teal-700 border border-teal-200/50 shadow-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Historias de Éxito</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Últimos Ganadores
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
        id="ganadores"
        className="w-full py-24 md:py-32 bg-gradient-to-b from-white via-teal-50/30 to-cyan-50/30"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Últimos Ganadores
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
              Error al cargar ganadores
            </h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  const getPrizeIcon = useMemo(() => (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-6 h-6" />;
      case 2:
        return <Award className="w-6 h-6" />;
      case 3:
        return <Trophy className="w-6 h-6" />;
      default:
        return <Trophy className="w-6 h-6" />;
    }
  }, []);

  const getPrizeColors = useMemo(() => (position: number) => {
    switch (position) {
      case 1:
        return {
          bg: 'from-amber-400 to-yellow-500',
          text: 'text-amber-600',
          badge: 'bg-amber-100 text-amber-800',
          glow: 'shadow-amber-200/50',
        };
      case 2:
        return {
          bg: 'from-gray-400 to-slate-500',
          text: 'text-gray-600',
          badge: 'bg-gray-100 text-gray-800',
          glow: 'shadow-gray-200/50',
        };
      case 3:
        return {
          bg: 'from-orange-400 to-amber-500',
          text: 'text-orange-600',
          badge: 'bg-orange-100 text-orange-800',
          glow: 'shadow-orange-200/50',
        };
      default:
        return {
          bg: 'from-teal-400 to-cyan-500',
          text: 'text-teal-600',
          badge: 'bg-teal-100 text-teal-800',
          glow: 'shadow-teal-200/50',
        };
    }
  }, []);

  return (
    <section
      id="ganadores"
      className="relative w-full py-15 md:py-15 bg-gradient-to-b from-white via-teal-50/30 to-cyan-50/30 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-20 right-10 w-40 h-40 bg-gradient-to-br from-teal-400/10 to-cyan-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-56 h-56 bg-gradient-to-br from-cyan-400/10 to-teal-400/10 rounded-full blur-3xl"></div>

      <div className="relative container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm font-medium text-teal-700 border border-teal-200/50 shadow-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Historias de Éxito</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Últimos Ganadores
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Conoce a nuestros ganadores más recientes y sus increíbles premios.
            ¡Tú podrías ser el próximo!
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {winners.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aún no hay ganadores
              </h3>
              <p className="text-gray-600 mb-6">
                Pronto habrá ganadores increibles. ¡Sé el primero en ganar!
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200">
                Participar Ahora
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {winners.map((winner, index) => {
                const colors = getPrizeColors(winner.prizePosition || 1);
                return (
                  <Card
                    key={winner.id}
                    className={`group relative overflow-hidden bg-white/80 backdrop-blur-sm border-2 border-gray-200/50 hover:border-teal-300 shadow-lg hover:shadow-xl ${colors.glow} transition-all duration-300 transform hover:-translate-y-1`}
                  >
                    {/* Winner badge */}
                    <div className="absolute top-4 right-4">
                      <div
                        className={`${colors.badge} px-3 py-1 rounded-full text-xs font-bold`}
                      >
                        {winner.prizePosition}° Lugar
                      </div>
                    </div>

                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="relative p-6">
                      <div className="flex items-start gap-4">
                        {/* Prize icon */}
                        <div
                          className={`w-16 h-16 bg-gradient-to-br ${colors.bg} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                          {getPrizeIcon(winner.prizePosition || 1)}
                        </div>

                        <div className="flex-1">
                          {/* Winner name */}
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {winner.name}
                          </h3>

                          {/* Raffle title */}
                          <p className="text-sm text-gray-600 mb-2">
                            Ganó en “{winner.raffleTitle}”
                          </p>

                          {/* Prize details */}
                          <div className="space-y-2">
                            {winner.prizeName && (
                              <div className="flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  {winner.prizeName}
                                </span>
                              </div>
                            )}

                            <div className="flex items-center gap-2">
                              <Hash className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600 font-mono">
                                Número: {winner.winningNumber}
                              </span>
                            </div>

                            {winner.drawDate && (
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  {formatFirebaseDate(winner.drawDate)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Prize amount */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 font-medium">
                            Premio Ganado:
                          </span>
                          <div className="text-right">
                            <p className={`text-2xl font-bold ${colors.text}`}>
                              ${winner.prizeAmount?.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">Bolivares</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* CTA Section */}
          {winners.length > 0 && (
            <div className="mt-16 text-center">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  ¡Tú podrías ser el próximo ganador!
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Únete a miles de participantes y ten la oportunidad de ganar
                  increíbles premios.
                </p>
                <button className="px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <span className="font-semibold">Ver Rifas Activas</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
