'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/shared/card/card';
import { Button } from '@/components/shared/button/Button';
import { Loader } from '@/components/shared/Loader/Loader';
import { formatFirebaseDate } from '@/utils/dateUtils';
import winnerService from '@/services/winnerService';
import raffleService from '@/services/raffleService';
import { Raffle, Winner } from '@/types';
import {
  AlertCircle,
  Award,
  Calendar,
  Check,
  Crown,
  DollarSign,
  Download,
  Eye,
  Filter,
  Gift,
  Mail,
  Phone,
  Search,
  Star,
  TrendingUp,
  Trophy,
  User,
} from 'lucide-react';

interface ExtendedWinner extends Winner {
  raffleTitle: string;
  prizeAmount: number;
  prizeName: string;
  prizePosition: number;
}

export default function AdminGanadoresPage() {
  const router = useRouter();
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [raffleFilter, setRaffleFilter] = useState('all');
  const [winners, setWinners] = useState<ExtendedWinner[]>([]);
  const [raffles, setRaffles] = useState<Raffle[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [winnersData, rafflesData] = await Promise.all([
          winnerService.getAll(),
          raffleService.getAll(),
        ]);

        // Create extended winners with raffle information
        const extendedWinners: ExtendedWinner[] = winnersData.map(winner => {
          const raffle = rafflesData.find(r => r.id === winner.raffleId);
          const prize = raffle?.prizes.find(
            p => p.position === winner.prizePosition
          );

          return {
            ...winner,
            raffleTitle: raffle?.title || 'Rifa no encontrada',
            prizeAmount: prize?.amount || 0,
            prizeName: prize?.name || 'Premio no encontrado',
            prizePosition: winner.prizePosition || 1,
          };
        });

        setWinners(extendedWinners);
        setRaffles(rafflesData);
      } catch (error) {
        console.error('Error fetching winners data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredWinners = winners.filter(winner => {
    const matchesSearch =
      winner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      winner.winningNumber.includes(searchTerm) ||
      winner.raffleTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || winner.status === statusFilter;
    const matchesRaffle =
      raffleFilter === 'all' || winner.raffleId === raffleFilter;

    return matchesSearch && matchesStatus && matchesRaffle;
  });

  const stats = {
    totalWinners: winners.length,
    pendingWinners: winners.filter(w => w.status === 'pending').length,
    contactedWinners: winners.filter(w => w.status === 'contacted').length,
    paidWinners: winners.filter(w => w.status === 'paid').length,
    deliveredWinners: winners.filter(w => w.status === 'delivered').length,
    totalPrizesValue: winners.reduce((sum, w) => sum + w.prizeAmount, 0),
    avgPrizeValue:
      winners.length > 0
        ? winners.reduce((sum, w) => sum + w.prizeAmount, 0) / winners.length
        : 0,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'contacted':
        return <Phone className="w-4 h-4 text-blue-500" />;
      case 'paid':
        return <DollarSign className="w-4 h-4 text-green-500" />;
      case 'delivered':
        return <Check className="w-4 h-4 text-green-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'contacted':
        return 'Contactado';
      case 'paid':
        return 'Pagado';
      case 'delivered':
        return 'Entregado';
      default:
        return 'Desconocido';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'contacted':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-green-200 text-green-900';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrizeIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Award className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Star className="w-5 h-5 text-amber-600" />;
      default:
        return <Gift className="w-5 h-5 text-purple-500" />;
    }
  };

  const updateWinnerStatus = async (
    winnerId: string,
    newStatus: 'pending' | 'contacted' | 'paid' | 'delivered'
  ) => {
    try {
      const now = new Date().toISOString();
      const updates: Partial<Winner> = {
        status: newStatus,
        updatedAt: new Date(),
      };

      switch (newStatus) {
        case 'contacted':
          updates.contactedAt = now;
          break;
        case 'paid':
          updates.paidAt = now;
          break;
        case 'delivered':
          updates.deliveredAt = now;
          break;
      }

      await winnerService.update(winnerId, updates);

      // Update local state
      setWinners(prev =>
        prev.map(winner => {
          if (winner.id === winnerId) {
            return { ...winner, ...updates };
          }
          return winner;
        })
      );
    } catch (error) {
      console.error('Error updating winner status:', error);
    }
  };

  const exportData = () => {
    console.log('Exportando datos de ganadores...');
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
            Gestión de Ganadores
          </h1>
          <p className="text-gray-600 mt-1">
            Administra y da seguimiento a todos los ganadores de rifas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="w-4 h-4 mr-2" />
            Enviar Recordatorio
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
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
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pendingWinners}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Contactados</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.contactedWinners}
                </p>
              </div>
              <Phone className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pagados</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.paidWinners}
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
                <p className="text-sm font-medium text-gray-600">Entregados</p>
                <p className="text-2xl font-bold text-green-700">
                  {stats.deliveredWinners}
                </p>
              </div>
              <Check className="w-8 h-8 text-green-700" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${stats.totalPrizesValue.toLocaleString()}
                </p>
              </div>
              <Gift className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Promedio</p>
                <p className="text-2xl font-bold text-indigo-600">
                  ${Math.round(stats.avgPrizeValue).toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-indigo-600" />
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
            placeholder="Buscar ganadores..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="contacted">Contactados</option>
            <option value="paid">Pagados</option>
            <option value="delivered">Entregados</option>
          </select>
          <select
            value={raffleFilter}
            onChange={e => setRaffleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          >
            <option value="all">Todas las rifas</option>
            {raffles.map(raffle => (
              <option key={raffle.id} value={raffle.id}>
                {raffle.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Winners List */}
      <div className="space-y-4">
        {filteredWinners.map(winner => (
          <Card key={winner.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {getPrizeIcon(winner.prizePosition)}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {winner.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {winner.raffleTitle} - {winner.prizeName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(winner.status)}
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded ${getStatusColor(winner.status)}`}
                      >
                        {getStatusText(winner.status)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Cédula</p>
                        <p className="font-mono text-sm">{winner.ci}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Teléfono</p>
                        <p className="font-mono text-sm">{winner.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Número Ganador</p>
                        <p className="font-mono text-sm font-bold text-green-600">
                          {winner.winningNumber}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Premio</p>
                        <p className="font-semibold text-amber-600">
                          ${winner.prizeAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Fecha Sorteo</p>
                        <p className="font-semibold">
                          {formatFirebaseDate(winner.drawDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    {winner.contactedAt && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>
                          Contactado: {formatFirebaseDate(winner.contactedAt)}
                        </span>
                      </div>
                    )}
                    {winner.paidAt && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        <span>Pagado: {formatFirebaseDate(winner.paidAt)}</span>
                      </div>
                    )}
                    {winner.deliveredAt && (
                      <div className="flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>
                          Entregado: {formatFirebaseDate(winner.deliveredAt)}
                        </span>
                      </div>
                    )}
                  </div>

                  {winner.notes && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Notas:</span>{' '}
                        {winner.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-6">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/admin/ganadores/${winner.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalle
                  </Button>
                  <Button size="sm" variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    Contactar
                  </Button>

                  {winner.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => updateWinnerStatus(winner.id, 'contacted')}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Marcar Contactado
                    </Button>
                  )}

                  {winner.status === 'contacted' && (
                    <Button
                      size="sm"
                      onClick={() => updateWinnerStatus(winner.id, 'paid')}
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      Marcar Pagado
                    </Button>
                  )}

                  {winner.status === 'paid' && (
                    <Button
                      size="sm"
                      onClick={() => updateWinnerStatus(winner.id, 'delivered')}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Marcar Entregado
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredWinners.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay ganadores
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' || raffleFilter !== 'all'
                ? 'No se encontraron ganadores con los filtros aplicados.'
                : 'Aún no hay ganadores registrados.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
