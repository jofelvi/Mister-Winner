'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/shared/card/card';
import { Button } from '@/components/shared/button/Button';
import { Loader } from '@/components/shared/Loader/Loader';
import { formatFirebaseDate } from '@/utils/dateUtils';
import raffleService from '@/services/raffleService';
import winnerService from '@/services/winnerService';
import participationService from '@/services/participationService';
import { Raffle, Winner } from '@/types';
import {
  Calendar,
  Clock,
  Gift,
  Star,
  Target,
  Ticket,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    activeRaffles: 0,
    popularRaffles: [] as Raffle[],
    userParticipations: 0,
    recentWinners: [] as Winner[],
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Use Promise.allSettled to prevent one failure from blocking others
      const [activeRafflesResult, raffleStatsResult, winnersResult] = await Promise.allSettled([
        raffleService.getPaginated(10, 'createdAt', 'desc'), // Get recent active raffles efficiently
        raffleService.getRaffleStats(),
        winnerService.getRecentWinners(3),
      ]);

      // Extract successful results
      const activeRaffles = activeRafflesResult.status === 'fulfilled' ? activeRafflesResult.value : [];
      const raffleStats = raffleStatsResult.status === 'fulfilled' ? raffleStatsResult.value : { active: 0 };
      const winners = winnersResult.status === 'fulfilled' ? winnersResult.value : [];

      // Get popular raffles (sort by numbers sold) - optimize to only slice what's needed
      const popularRaffles = activeRaffles
        .filter(raffle => raffle.status === 'active') // Filter active only
        .sort((a, b) => b.numbersSold - a.numbersSold)
        .slice(0, 3);

      // Count user participations asynchronously if user exists
      let userParticipations = 0;
      if (userProfile?.id) {
        try {
          userParticipations = await participationService.getUserParticipationCount(userProfile.id);
        } catch (error) {
          console.warn('Error fetching user participation count:', error);
        }
      }

      setDashboardData({
        activeRaffles: raffleStats.active,
        popularRaffles,
        userParticipations,
        recentWinners: winners,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [userProfile?.id]);

  useEffect(() => {
    if (userProfile?.id) {
      fetchDashboardData();
    }
  }, [userProfile?.id, fetchDashboardData]);

  const stats = useMemo(() => [
    {
      title: 'Rifas Activas',
      value: dashboardData.activeRaffles.toString(),
      change: '+2',
      icon: Ticket,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Mis Puntos',
      value: userProfile?.points?.toString() || '0',
      change: '+150',
      icon: Star,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Creditos',
      value: userProfile?.credits?.toString() || '0',
      change: '+25',
      icon: Gift,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Participaciones',
      value: dashboardData.userParticipations.toString(),
      change: '+3',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ], [dashboardData.activeRaffles, userProfile?.points, userProfile?.credits, dashboardData.userParticipations]);

  const getProgressPercentage = (sold: number, total: number) => {
    return Math.round((sold / total) * 100);
  };

  const handleShareReferralCode = async () => {
    if (userProfile?.referralCode) {
      try {
        const referralText = `¡Únete a Mister Winner con mi código de referencia! Código: ${userProfile.referralCode}`;

        // Try to use the Web Share API if available
        if (navigator.share) {
          await navigator.share({
            title: 'Mister Winner - Código de Referencia',
            text: referralText,
            url:
              window.location.origin +
              '/register?ref=' +
              userProfile.referralCode,
          });
        } else {
          // Fallback to clipboard
          await navigator.clipboard.writeText(referralText);
          // TODO: Show toast notification
          alert('Código de referencia copiado al portapapeles!');
        }
      } catch (error) {
        console.error('Error sharing referral code:', error);
        // Fallback: just copy the code
        try {
          await navigator.clipboard.writeText(userProfile.referralCode);
          alert('Código copiado: ' + userProfile.referralCode);
        } catch (clipboardError) {
          alert('Código de referencia: ' + userProfile.referralCode);
        }
      }
    }
  };

  const handleParticipateInRaffle = (raffleId: string) => {
    router.push(`/rifas/${raffleId}`);
  };

  const handleViewAllRaffles = () => {
    router.push('/rifas');
  };

  const handleViewWinners = () => {
    router.push('/ganadores');
  };

  const handleManagePoints = () => {
    router.push('/puntos');
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            ¡Bienvenido, {userProfile?.firstName}!
          </h1>
          <p className="text-gray-600 mt-1">
            Aqui tienes un resumen de tu actividad reciente
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-gray-500">Codigo de referencia</p>
            <p className="font-mono font-semibold text-cyan-600">
              {userProfile?.referralCode}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleShareReferralCode}>
            Compartir codigo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => (
          <Card
            key={stat.title}
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-600">
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-600" />
            Acciones Rapidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              className="h-16 flex-col gap-2"
              onClick={() => router.push('/rifas')}
            >
              <Ticket className="w-5 h-5" />
              <span>Comprar Numeros</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 flex-col gap-2"
              onClick={handleViewWinners}
            >
              <Trophy className="w-5 h-5" />
              <span>Ver Ganadores</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 flex-col gap-2"
              onClick={handleManagePoints}
            >
              <Star className="w-5 h-5" />
              <span>Canjear Puntos</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-600" />
            Rifas Populares
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData.popularRaffles.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No hay rifas populares disponibles</p>
                <Button className="mt-4" onClick={handleViewAllRaffles}>
                  Ver todas las rifas
                </Button>
              </div>
            ) : (
              dashboardData.popularRaffles.map(raffle => {
                const progress = getProgressPercentage(
                  raffle.numbersSold,
                  raffle.totalNumbers
                );
                const isNearDraw = progress >= 80;

                return (
                  <div
                    key={raffle.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => handleParticipateInRaffle(raffle.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-medium bg-cyan-100 text-cyan-800 px-2 py-1 rounded">
                            {raffle.type} digitos
                          </span>
                          {isNearDraw && (
                            <span className="text-xs font-medium bg-amber-100 text-amber-800 px-2 py-1 rounded flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Proximo sorteo
                            </span>
                          )}
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900">
                        {raffle.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Gift className="w-4 h-4" />
                          {raffle.prizes.length}{' '}
                          {raffle.prizes.length === 1 ? 'premio' : 'premios'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {raffle.numbersSold.toLocaleString()} participantes
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatFirebaseDate(raffle.drawDate)}
                        </span>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Progreso</span>
                          <span className="font-medium">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              isNearDraw
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                                : 'bg-gradient-to-r from-cyan-500 to-teal-500'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="ml-6 text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        ${raffle.pricePerNumber}
                      </p>
                      <p className="text-sm text-gray-500">por numero</p>
                      <Button
                        size="sm"
                        className="mt-2"
                        onClick={e => {
                          e.stopPropagation();
                          handleParticipateInRaffle(raffle.id);
                        }}
                      >
                        Participar
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Winners Section */}
      {dashboardData.recentWinners.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-green-600" />
              Ganadores Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dashboardData.recentWinners.map(winner => (
                <div
                  key={winner.id}
                  className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-900">
                        {winner.name}
                      </h4>
                      <p className="text-sm text-green-700">
                        {winner.raffleTitle}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-600">Premio:</span>
                    <span className="font-bold text-green-800">
                      ${winner.prizeAmount?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-green-600">Número:</span>
                    <span className="font-mono text-sm text-green-800">
                      {winner.winningNumber}
                    </span>
                  </div>
                  {winner.drawDate && (
                    <div className="text-xs text-green-600 mt-2">
                      {formatFirebaseDate(winner.drawDate)}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Button variant="outline" onClick={handleViewWinners}>
                Ver todos los ganadores
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
