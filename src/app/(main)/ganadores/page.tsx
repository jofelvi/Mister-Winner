'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/shared/card/card';
import { Button } from '@/components/shared/button/Button';
import { Loader } from '@/components/shared/Loader/Loader';
import { formatFirebaseDate } from '@/utils/dateUtils';
import winnerService from '@/services/winnerService';
import { Winner } from '@/types';
import {
  ArrowLeft,
  Award,
  Calendar,
  Crown,
  DollarSign,
  Filter,
  Gift,
  Hash,
  Search,
  Sparkles,
  Star,
  Trophy,
  User,
} from 'lucide-react';

export default function GanadoresPage() {
  const router = useRouter();
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('all');

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        setLoading(true);
        const allWinners = await winnerService.getAll();
        // Sort by creation date, most recent first
        const sortedWinners = allWinners.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setWinners(sortedWinners);
      } catch (error) {
        console.error('Error fetching winners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWinners();
  }, []);

  const filteredWinners = winners.filter(winner => {
    const matchesSearch =
      winner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      winner.raffleTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      winner.winningNumber.includes(searchTerm);

    const matchesPosition =
      positionFilter === 'all' ||
      winner.prizePosition.toString() === positionFilter;

    return matchesSearch && matchesPosition;
  });

  const getPrizeIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Award className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Star className="w-6 h-6 text-amber-600" />;
      default:
        return <Gift className="w-6 h-6 text-purple-500" />;
    }
  };

  const getPrizeColors = (position: number) => {
    switch (position) {
      case 1:
        return {
          bg: 'from-amber-400 to-yellow-500',
          text: 'text-amber-600',
          badge: 'bg-amber-100 text-amber-800 border-amber-200',
          card: 'border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50',
        };
      case 2:
        return {
          bg: 'from-gray-400 to-slate-500',
          text: 'text-gray-600',
          badge: 'bg-gray-100 text-gray-800 border-gray-200',
          card: 'border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50',
        };
      case 3:
        return {
          bg: 'from-orange-400 to-amber-500',
          text: 'text-orange-600',
          badge: 'bg-orange-100 text-orange-800 border-orange-200',
          card: 'border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50',
        };
      default:
        return {
          bg: 'from-purple-400 to-indigo-500',
          text: 'text-purple-600',
          badge: 'bg-purple-100 text-purple-800 border-purple-200',
          card: 'border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50',
        };
    }
  };

  const stats = {
    totalWinners: winners.length,
    firstPlaceWinners: winners.filter(w => w.prizePosition === 1).length,
    totalPrizeValue: winners.reduce((sum, w) => sum + (w.prizeAmount || 0), 0),
    averagePrize:
      winners.length > 0
        ? winners.reduce((sum, w) => sum + (w.prizeAmount || 0), 0) /
          winners.length
        : 0,
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Trophy className="w-8 h-8 text-amber-600" />
              Ganadores de Mister Winner
            </h1>
            <p className="text-gray-600 mt-1">
              Conoce a todos los afortunados ganadores de nuestras rifas
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Sparkles className="w-4 h-4 text-yellow-500" />
          <span>¡Tú podrías ser el próximo!</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Ganadores
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalWinners}
                </p>
              </div>
              <Trophy className="w-8 h-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Primeros Lugares
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.firstPlaceWinners}
                </p>
              </div>
              <Crown className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Premios Entregados
                </p>
                <p className="text-2xl font-bold text-green-600">
                  ${stats.totalPrizeValue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Premio Promedio
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  ${Math.round(stats.averagePrize).toLocaleString()}
                </p>
              </div>
              <Gift className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar ganadores, rifas o números..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={positionFilter}
            onChange={e => setPositionFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          >
            <option value="all">Todas las posiciones</option>
            <option value="1">1er Lugar</option>
            <option value="2">2do Lugar</option>
            <option value="3">3er Lugar</option>
          </select>
        </div>
      </div>

      {/* Winners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWinners.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No se encontraron ganadores
            </h3>
            <p className="text-gray-600 mb-4">
              {winners.length === 0
                ? 'Aún no hay ganadores registrados.'
                : 'Intenta ajustar los filtros de búsqueda.'}
            </p>
            <Button onClick={() => router.push('/rifas')}>
              <Trophy className="w-4 h-4 mr-2" />
              Ver Rifas Activas
            </Button>
          </div>
        ) : (
          filteredWinners.map(winner => {
            const colors = getPrizeColors(winner.prizePosition);
            return (
              <Card
                key={winner.id}
                className={`hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${colors.card} border-2`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-bold ${colors.badge}`}
                    >
                      {getPrizeIcon(winner.prizePosition)}
                      <span>{winner.prizePosition}° Lugar</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Ganó</p>
                      <p className={`text-xl font-bold ${colors.text}`}>
                        ${(winner.prizeAmount || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-600" />
                    {winner.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Rifa</p>
                        <p className="font-medium text-gray-900">
                          {winner.raffleTitle || 'Sin título'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Número Ganador</p>
                        <p className="font-mono text-lg font-bold text-green-600">
                          {winner.winningNumber}
                        </p>
                      </div>
                    </div>

                    {winner.prizeName && (
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Premio</p>
                          <p className="font-medium text-gray-900">
                            {winner.prizeName}
                          </p>
                        </div>
                      </div>
                    )}

                    {winner.drawDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">
                            Fecha del Sorteo
                          </p>
                          <p className="font-medium text-gray-900">
                            {formatFirebaseDate(winner.drawDate)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">
                          ¡Felicitaciones! 🎉
                        </p>
                        <p className="text-sm font-medium text-gray-700">
                          Ganador verificado
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* CTA Section */}
      {winners.length > 0 && (
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-0">
            <CardContent className="p-8 text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-white" />
              <h3 className="text-2xl font-bold mb-4">
                ¡Tú podrías ser el próximo ganador!
              </h3>
              <p className="text-cyan-100 mb-6 max-w-2xl mx-auto">
                Únete a los {stats.totalWinners} ganadores que ya han disfrutado
                de increíbles premios. Participa en nuestras rifas y ten la
                oportunidad de ganar.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  className="bg-white text-cyan-600 hover:bg-gray-50 border-white"
                  onClick={() => router.push('/rifas')}
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Ver Rifas Activas
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent text-white border-white hover:bg-white/10"
                  onClick={() => router.push('/dashboard')}
                >
                  <User className="w-4 h-4 mr-2" />
                  Mi Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
