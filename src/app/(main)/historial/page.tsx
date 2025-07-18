'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/shared/card/card';
import { Button } from '@/components/shared/button/Button';
import { Loader } from '@/components/shared/Loader/Loader';
import { formatFirebaseDate } from '@/utils/dateUtils';
import participationService, { UserParticipation } from '@/services/participationService';
import {
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Filter,
  History,
  Search,
  Ticket,
  Trophy,
  XCircle,
} from 'lucide-react';

export default function HistorialPage() {
  const router = useRouter();
  const { userProfile } = useAuth();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [participations, setParticipations] = useState<UserParticipation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParticipations = async () => {
      if (!userProfile?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userParticipations = await participationService.getUserParticipations(userProfile.id);
        setParticipations(userParticipations);
      } catch (error) {
        console.error('Error fetching user participations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipations();
  }, [userProfile?.id]);

  const filteredHistory = participations.filter(item => {
    const matchesFilter = filter === 'all' || item.status === filter;
    const matchesSearch =
      item.raffleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.numbers.some(num => num.includes(searchTerm));
    return matchesFilter && matchesSearch;
  });

  const stats = {
    totalParticipations: participations.length,
    activeRaffles: participations.filter(h => h.status === 'active').length,
    totalSpent: participations.reduce((sum, h) => sum + h.totalPaid, 0),
    totalNumbers: participations.reduce((sum, h) => sum + h.numbers.length, 0),
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
        return <Clock className="w-4 h-4 text-gray-500" />;
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
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleViewDetail = (participationId: string) => {
    // TODO: Navigate to participation detail page
    console.log('View detail for participation:', participationId);
  };

  const handleBuyMore = (raffleId: string) => {
    router.push(`/rifas/${raffleId}`);
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
          <h1 className="text-3xl font-bold text-gray-900">Mi Historial</h1>
          <p className="text-gray-600 mt-1">
            Revisa todas tus participaciones y resultados
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.push('/ganadores')}
        >
          <Eye className="w-4 h-4 mr-2" />
          Ver Ganadores
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Participaciones
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalParticipations}
                </p>
              </div>
              <div className="p-2 bg-blue-50 rounded-full">
                <History className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Rifas Activas
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.activeRaffles}
                </p>
              </div>
              <div className="p-2 bg-green-50 rounded-full">
                <Ticket className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Gastado
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.totalSpent}
                </p>
              </div>
              <div className="p-2 bg-amber-50 rounded-full">
                <DollarSign className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Números
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalNumbers}
                </p>
              </div>
              <div className="p-2 bg-purple-50 rounded-full">
                <Trophy className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          >
            <option value="all">Todas</option>
            <option value="active">Activas</option>
            <option value="completed">Finalizadas</option>
            <option value="cancelled">Canceladas</option>
          </select>
        </div>

        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre de rifa o número..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {participations.length === 0 ? 'No hay participaciones' : 'No se encontraron resultados'}
              </h3>
              <p className="text-gray-600 mb-4">
                {participations.length === 0
                  ? 'Aún no has participado en ninguna rifa.'
                  : filter === 'all'
                  ? 'Intenta ajustar los filtros de búsqueda.'
                  : `No tienes participaciones con el filtro "${getStatusText(filter)}".`}
              </p>
              <Button onClick={() => router.push('/rifas')}>
                <Ticket className="w-4 h-4 mr-2" />
                Explorar Rifas
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredHistory.map(item => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.raffleTitle}
                      </h3>
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        <span>{getStatusText(item.status)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Números comprados</p>
                        <p className="font-semibold">{item.numbers.length}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total pagado</p>
                        <p className="font-semibold">${item.totalPaid}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Fecha compra</p>
                        <p className="font-semibold">
                          {formatFirebaseDate(item.purchaseDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Fecha sorteo</p>
                        <p className="font-semibold">
                          {formatFirebaseDate(item.drawDate)}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-2">Tus números:</p>
                      <div className="flex flex-wrap gap-2">
                        {item.numbers.map((number, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm font-mono"
                          >
                            {number}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewDetail(item.id)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalle
                    </Button>

                    {item.status === 'active' && (
                      <Button 
                        size="sm"
                        onClick={() => handleBuyMore(item.raffleId)}
                      >
                        <Ticket className="w-4 h-4 mr-2" />
                        Comprar Más
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}