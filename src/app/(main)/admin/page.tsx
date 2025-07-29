'use client';

import { useEffect, useState } from 'react';
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
import { Raffle } from '@/types';
import { formatFirebaseDate } from '@/utils/dateUtils';
import raffleService from '@/services/raffleService';
import winnerService from '@/services/winnerService';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  DollarSign,
  Eye,
  Plus,
  Star,
  Ticket,
  TrendingUp,
  Trophy,
  Users,
  XCircle,
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalRaffles: 0,
    activeRaffles: 0,
    completedRaffles: 0,
    totalParticipants: 0,
    totalRevenue: 0,
    thisMonthRevenue: 0,
    pendingPayments: 0,
    totalPrizes: 0,
    averageParticipation: 0,
  });
  const [upcomingDraws, setUpcomingDraws] = useState<Raffle[]>([]);
  const [recentWinners, setRecentWinners] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Get raffles and stats
        const [raffles, stats, winners] = await Promise.all([
          raffleService.getAll(),
          raffleService.getRaffleStats(),
          winnerService.getRecentWinners(4),
        ]);

        // Get active raffles for upcoming draws
        const activeRaffles = raffles
          .filter(raffle => raffle.status === 'active')
          .slice(0, 3);
        setUpcomingDraws(activeRaffles);

        // Set dashboard stats
        setDashboardStats({
          totalRaffles: stats.total,
          activeRaffles: stats.active,
          completedRaffles: stats.completed,
          totalParticipants: raffles.reduce(
            (sum, raffle) => sum + raffle.numbersSold,
            0
          ),
          totalRevenue: stats.totalRevenue,
          thisMonthRevenue: 0, // TODO: Calculate this month's revenue
          pendingPayments: 0, // TODO: Get from payments service
          totalPrizes: raffles.reduce(
            (sum, raffle) => sum + raffle.prizes.length,
            0
          ),
          averageParticipation:
            raffles.length > 0
              ? raffles.reduce((sum, raffle) => sum + raffle.numbersSold, 0) /
                raffles.length
              : 0,
        });

        // Convert recent winners to recent activity
        const recentActivity = winners.map((winner, index) => ({
          id: winner.id,
          type: 'winner_announced',
          message: `Ganador anunciado: ${winner.name} - ${winner.raffleTitle}`,
          time: winner.drawDate || new Date().toISOString(),
          icon: Trophy,
          color: 'text-amber-600',
        }));
        setRecentWinners(recentActivity);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getProgressPercentage = (sold: number, total: number) => {
    return Math.round((sold / total) * 100);
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Panel Administrativo
          </h1>
          <p className="text-gray-600 mt-1">
            Bienvenido, {userProfile?.firstName}. Aquí tienes el resumen de tu
            sistema
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/admin/reportes')}
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver Reportes
          </Button>
          <Button size="sm" onClick={() => router.push('/admin/rifas')}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Rifa
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Rifas</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {dashboardStats.totalRaffles}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">+3 este mes</span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <Ticket className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Participantes
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {dashboardStats.totalParticipants.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">
                    +127 esta semana
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Ingresos Totales
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${dashboardStats.totalRevenue.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">
                    +${dashboardStats.thisMonthRevenue.toLocaleString()} este
                    mes
                  </span>
                </div>
              </div>
              <div className="p-3 bg-amber-50 rounded-full">
                <DollarSign className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Rifas Activas
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {dashboardStats.activeRaffles}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs text-yellow-600">
                    {dashboardStats.pendingPayments} pagos pendientes
                  </span>
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-full">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximos Sorteos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-600" />
              Próximos Sorteos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDraws.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  <p>No hay sorteos programados</p>
                </div>
              ) : (
                upcomingDraws.map(raffle => {
                  const progress = getProgressPercentage(
                    raffle.numbersSold,
                    raffle.totalNumbers
                  );
                  return (
                    <div
                      key={raffle.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusIcon(raffle.status)}
                          <h4 className="font-semibold text-gray-900">
                            {raffle.title}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {formatFirebaseDate(raffle.drawDate)}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-600">
                            {raffle.numbersSold}/{raffle.totalNumbers}
                          </span>
                          <span className="font-medium">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-gradient-to-r from-cyan-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/admin/rifas/${raffle.id}`)}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actividad Reciente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentWinners.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  <p>No hay actividad reciente</p>
                </div>
              ) : (
                recentWinners.map(activity => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="p-2 bg-white rounded-full">
                      <activity.icon className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatFirebaseDate(activity.time)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Acciones Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-600" />
            Acciones Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              className="h-20 flex-col gap-2"
              onClick={() => router.push('/admin/rifas')}
            >
              <Plus className="w-5 h-5" />
              <span>Crear Rifa</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => router.push('/admin/participantes')}
            >
              <Users className="w-5 h-5" />
              <span>Ver Participantes</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => router.push('/admin/pagos')}
            >
              <DollarSign className="w-5 h-5" />
              <span>Procesar Pagos</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => router.push('/admin/ganadores')}
            >
              <Trophy className="w-5 h-5" />
              <span>Sortear Ganador</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
