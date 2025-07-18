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
  Search,
  Filter,
  Download,
  Eye,
  Edit3,
  Trophy,
  Users,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  TrendingUp,
  FileText,
} from 'lucide-react';

export default function AdminHistorialPage() {
  const router = useRouter();
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [allRaffles, setAllRaffles] = useState<Raffle[]>([]);
  const [winners, setWinners] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistorialData = async () => {
      try {
        setLoading(true);
        const [rafflesData, winnersData] = await Promise.all([
          raffleService.getAll(),
          winnerService.getAll(),
        ]);
        setAllRaffles(rafflesData);
        setWinners(winnersData);
      } catch (error) {
        console.error('Error fetching historial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorialData();
  }, []);

  const filteredRaffles = allRaffles.filter(raffle => {
    const matchesSearch = raffle.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || raffle.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const raffleDate = new Date(raffle.drawDate);
      const now = new Date();
      
      switch (dateFilter) {
        case 'this_month':
          matchesDate = raffleDate.getMonth() === now.getMonth() && 
                       raffleDate.getFullYear() === now.getFullYear();
          break;
        case 'last_month':
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          matchesDate = raffleDate.getMonth() === lastMonth.getMonth() && 
                       raffleDate.getFullYear() === lastMonth.getFullYear();
          break;
        case 'this_year':
          matchesDate = raffleDate.getFullYear() === now.getFullYear();
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const stats = {
    totalRaffles: allRaffles.length,
    completedRaffles: allRaffles.filter(r => r.status === 'completed').length,
    activeRaffles: allRaffles.filter(r => r.status === 'active').length,
    cancelledRaffles: allRaffles.filter(r => r.status === 'cancelled').length,
    totalRevenue: allRaffles
      .filter(r => r.status === 'completed')
      .reduce((sum, r) => sum + (r.numbersSold * r.pricePerNumber), 0),
    totalParticipants: allRaffles.reduce((sum, r) => sum + r.numbersSold, 0),
  };

  // Helper function to get winner info for a raffle
  const getWinnerForRaffle = (raffleId: string) => {
    return winners.find(w => w.raffleId === raffleId);
  };

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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activa';
      case 'completed':
        return 'Finalizada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return 'Desconocido';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const exportData = () => {
    // Aquí iría la lógica para exportar datos
    console.log('Exportando datos del historial...');
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
            Historial de Rifas
          </h1>
          <p className="text-gray-600 mt-1">
            Revisa el historial completo de todas las rifas realizadas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push('/admin/reportes')}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Reportes
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Rifas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalRaffles}
                </p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completadas</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.completedRaffles}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Activas</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.activeRaffles}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Canceladas</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.cancelledRaffles}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ingresos</p>
                <p className="text-2xl font-bold text-green-600">
                  ${stats.totalRevenue.toLocaleString()}
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
                <p className="text-sm font-medium text-gray-600">Participantes</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.totalParticipants.toLocaleString()}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
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
            placeholder="Buscar rifas..."
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
            <option value="active">Activas</option>
            <option value="completed">Finalizadas</option>
            <option value="cancelled">Canceladas</option>
          </select>
          <select
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          >
            <option value="all">Todas las fechas</option>
            <option value="this_month">Este mes</option>
            <option value="last_month">Mes pasado</option>
            <option value="this_year">Este año</option>
          </select>
        </div>
      </div>

      {/* Raffles List */}
      <div className="space-y-4">
        {filteredRaffles.map(raffle => (
          <Card key={raffle.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {raffle.title}
                    </h3>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(raffle.status)}
                      <span className={`text-sm font-medium px-2 py-1 rounded ${getStatusColor(raffle.status)}`}>
                        {getStatusText(raffle.status)}
                      </span>
                    </div>
                    <span className="text-xs font-medium bg-cyan-100 text-cyan-800 px-2 py-1 rounded">
                      {raffle.type} dígitos
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Participantes</p>
                        <p className="font-semibold">
                          {raffle.numbersSold.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Precio/Número</p>
                        <p className="font-semibold">${raffle.pricePerNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Premios</p>
                        <p className="font-semibold">{raffle.prizes.length}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Fecha Sorteo</p>
                        <p className="font-semibold">
                          {formatFirebaseDate(raffle.drawDate)}
                        </p>
                      </div>
                    </div>
                    {raffle.status === 'completed' && (
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Ingresos</p>
                          <p className="font-semibold text-green-600">
                            ${(raffle.numbersSold * raffle.pricePerNumber).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                    {(() => {
                      const winner = getWinnerForRaffle(raffle.id);
                      return winner && raffle.status === 'completed' ? (
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Ganador</p>
                            <p className="font-semibold text-amber-600">
                              {winner.name}
                            </p>
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>

                  {raffle.status === 'completed' && (raffle as any).winnerNumber && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg mb-4">
                      <Trophy className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm text-green-800">
                          <span className="font-semibold">Número ganador:</span> {(raffle as any).winnerNumber}
                        </p>
                        <p className="text-sm text-green-800">
                          <span className="font-semibold">Ganador:</span> {(raffle as any).winnerName}
                        </p>
                      </div>
                    </div>
                  )}

                  {raffle.status === 'cancelled' && (raffle as any).cancelReason && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg mb-4">
                      <XCircle className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="text-sm text-red-800">
                          <span className="font-semibold">Motivo de cancelación:</span> {(raffle as any).cancelReason}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {raffle.prizes.slice(0, 3).map(prize => (
                      <span
                        key={prize.id}
                        className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-sm"
                      >
                        {prize.position}° - ${prize.amount.toLocaleString()}
                      </span>
                    ))}
                    {raffle.prizes.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
                        +{raffle.prizes.length - 3} más
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-6">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => router.push(`/admin/rifas/${raffle.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalle
                  </Button>
                  {raffle.status === 'active' && (
                    <Button size="sm" variant="outline">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredRaffles.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay rifas en el historial
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                ? 'No se encontraron rifas con los filtros aplicados.'
                : 'Aún no hay rifas en el historial.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}