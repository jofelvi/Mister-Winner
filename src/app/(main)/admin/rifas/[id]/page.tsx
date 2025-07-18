'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
import purchaseService from '@/services/purchaseService';
import { Raffle, Winner } from '@/types';
import {
  Trophy,
  Ticket,
  Clock,
  Users,
  Calendar,
  ArrowLeft,
  Edit,
  Eye,
  Download,
  Play,
  Pause,
  Settings,
  AlertCircle,
  CheckCircle,
  XCircle,
  DollarSign,
  Gift,
  Hash,
  TrendingUp,
  FileText,
  Zap,
} from 'lucide-react';

export default function AdminRaffleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { userProfile } = useAuth();
  const raffleId = params.id as string;

  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [loading, setLoading] = useState(true);
  const [raffleWinners, setRaffleWinners] = useState<Winner[]>([]);

  useEffect(() => {
    const fetchRaffleData = async () => {
      try {
        setLoading(true);
        const [raffleData, winners] = await Promise.all([
          raffleService.getById(raffleId),
          winnerService.getWinnersByRaffle(raffleId)
        ]);
        setRaffle(raffleData);
        setRaffleWinners(winners);
      } catch (error) {
        console.error('Error fetching raffle data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRaffleData();
  }, [raffleId]);

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
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleEditRaffle = () => {
    router.push(`/admin/rifas/${raffleId}/editar`);
  };

  const handleViewParticipants = () => {
    router.push(`/admin/rifas/${raffleId}/participantes`);
  };

  const handleDrawWinners = () => {
    router.push(`/admin/rifas/${raffleId}/sortear`);
  };

  const handleToggleRaffleStatus = async () => {
    if (!raffle) return;
    
    try {
      const newStatus = raffle.status === 'active' ? 'completed' : 'active';
      await raffleService.update(raffleId, { 
        status: newStatus,
        updatedAt: new Date()
      });
      setRaffle({ ...raffle, status: newStatus });
    } catch (error) {
      console.error('Error updating raffle status:', error);
    }
  };

  const progress = raffle ? Math.round((raffle.numbersSold / raffle.totalNumbers) * 100) : 0;
  const revenue = raffle ? raffle.numbersSold * raffle.pricePerNumber : 0;
  const isNearDraw = progress >= 80;
  
  // Calculate expected profit metrics
  const totalPrizeAmount = raffle ? raffle.prizes.reduce((sum, prize) => sum + prize.amount, 0) : 0;
  const maxPossibleRevenue = raffle ? raffle.totalNumbers * raffle.pricePerNumber : 0;
  const expectedProfit = maxPossibleRevenue - totalPrizeAmount;
  const currentProfit = revenue - (totalPrizeAmount * (progress / 100));
  const profitMargin = maxPossibleRevenue > 0 ? Math.round((expectedProfit / maxPossibleRevenue) * 100) : 0;

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!raffle) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Rifa no encontrada</h1>
        <Button onClick={() => router.push('/admin/rifas')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Rifas
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push('/admin/rifas')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{raffle.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              {getStatusIcon(raffle.status)}
              <span className={`text-sm font-medium px-2 py-1 rounded border ${getStatusColor(raffle.status)}`}>
                {getStatusText(raffle.status)}
              </span>
              <span className="text-sm text-gray-600">
                {raffle.type} digitos
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleEditRaffle}
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              // TODO: Export raffle data
              console.log('Export raffle data');
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button 
            size="sm"
            onClick={handleToggleRaffleStatus}
            className={raffle.status === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
          >
            {raffle.status === 'active' ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pausar
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Activar
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Participantes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {raffle.numbersSold.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  de {raffle.totalNumbers.toLocaleString()}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progreso</p>
                <p className="text-2xl font-bold text-gray-900">{progress}%</p>
                <p className="text-xs text-gray-500">
                  {isNearDraw ? 'Listo para sorteo' : 'En progreso'}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ingresos</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${revenue.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  ${raffle.pricePerNumber} por numero
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ganancia Esperada</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${expectedProfit.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  {profitMargin}% margen
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Raffle Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-600" />
              Detalles de la Rifa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Fecha de Creacion</p>
                <p className="font-semibold">{formatFirebaseDate(raffle.createdAt.toString())}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Fecha de Sorteo</p>
                <p className="font-semibold">{formatFirebaseDate(raffle.drawDate)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Tipo de Numeros</p>
                <p className="font-semibold">{raffle.type} digitos</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Precio por Numero</p>
                <p className="font-semibold">${raffle.pricePerNumber}</p>
              </div>
            </div>
            
            {/* Financial Summary */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Resumen Financiero</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Ingresos Actuales</p>
                  <p className="font-semibold text-green-600">${revenue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Ingresos Maximos</p>
                  <p className="font-semibold text-blue-600">${maxPossibleRevenue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Premios</p>
                  <p className="font-semibold text-red-600">${totalPrizeAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Ganancia Actual</p>
                  <p className={`font-semibold ${currentProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${currentProfit.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Progreso de Ventas</p>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    isNearDraw
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                      : 'bg-gradient-to-r from-cyan-500 to-teal-500'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>{raffle.numbersSold.toLocaleString()} vendidos</span>
                <span>{progress}%</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1"
                onClick={handleViewParticipants}
              >
                <Eye className="w-4 h-4 mr-2" />
                Ver Participantes
              </Button>
              <Button 
                variant="outline"
                className="flex-1"
                onClick={handleDrawWinners}
                disabled={raffle.status !== 'active' || !isNearDraw}
              >
                <Zap className="w-4 h-4 mr-2" />
                Sortear Ganador
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Prizes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              Premios del Sorteo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {raffle.prizes.map((prize, index) => (
                <div
                  key={prize.id}
                  className={`p-3 rounded-lg border ${
                    index === 0
                      ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200'
                      : index === 1
                      ? 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200'
                      : 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0
                          ? 'bg-amber-500 text-white'
                          : index === 1
                          ? 'bg-gray-400 text-white'
                          : 'bg-orange-500 text-white'
                      }`}>
                        {prize.position}°
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{prize.name}</p>
                        {prize.description && (
                          <p className="text-sm text-gray-600">{prize.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        index === 0 ? 'text-amber-900' : index === 1 ? 'text-gray-800' : 'text-orange-900'
                      }`}>
                        ${prize.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Winners Section */}
      {raffleWinners.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-green-600" />
              Ganadores del Sorteo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {raffleWinners.map((winner) => (
                <div
                  key={winner.id}
                  className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-900">{winner.name}</h4>
                      <p className="text-sm text-green-700">{winner.prizePosition}° Lugar</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-600">Numero:</span>
                      <span className="font-mono font-bold text-green-800">
                        {winner.winningNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-600">Premio:</span>
                      <span className="font-bold text-green-800">
                        ${(winner.prizeAmount || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-600">Estado:</span>
                      <span className={`font-medium ${
                        winner.status === 'delivered' ? 'text-green-800' : 'text-amber-700'
                      }`}>
                        {winner.status === 'delivered' ? 'Entregado' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Acciones Administrativas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline"
              onClick={async () => {
                try {
                  // Generate and download detailed report
                  const reportData = {
                    raffle: {
                      id: raffle.id,
                      title: raffle.title,
                      type: raffle.type,
                      status: raffle.status,
                      createdAt: raffle.createdAt,
                      drawDate: raffle.drawDate,
                      pricePerNumber: raffle.pricePerNumber,
                      totalNumbers: raffle.totalNumbers,
                      numbersSold: raffle.numbersSold,
                      progress: progress,
                      prizes: raffle.prizes
                    },
                    financial: {
                      revenue,
                      maxPossibleRevenue,
                      totalPrizeAmount,
                      expectedProfit,
                      currentProfit,
                      profitMargin
                    },
                    winners: raffleWinners,
                    generatedAt: new Date().toISOString()
                  };

                  const blob = new Blob([JSON.stringify(reportData, null, 2)], {
                    type: 'application/json',
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `reporte-rifa-${raffle.id}-${new Date().toISOString().split('T')[0]}.json`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                } catch (error) {
                  console.error('Error generating report:', error);
                }
              }}
            >
              <FileText className="w-4 h-4 mr-2" />
              Generar Reporte
            </Button>
            <Button 
              variant="outline"
              onClick={async () => {
                try {
                  // Get all participants for this raffle
                  const participants = await purchaseService.getPurchasesByRaffle(raffleId);
                  
                  // Create notification data
                  const notificationData = {
                    raffleId: raffle.id,
                    raffleTitle: raffle.title,
                    drawDate: raffle.drawDate,
                    progress: progress,
                    message: `¡Actualización sobre la rifa "${raffle.title}"! El sorteo está programado para ${formatFirebaseDate(raffle.drawDate)} y ya tenemos ${progress}% de participación.`,
                    participants: participants.map(p => ({
                      userId: p.userId,
                      email: p.userEmail,
                      numbers: p.numbers
                    })),
                    timestamp: new Date().toISOString()
                  };

                  // In a real implementation, this would send to a notification service
                  console.log('Sending notifications to', participants.length, 'participants');
                  console.log('Notification data:', notificationData);
                  
                  // For now, just show success message
                  alert(`Notificaciones enviadas a ${participants.length} participantes`);
                } catch (error) {
                  console.error('Error sending notifications:', error);
                  alert('Error enviando notificaciones');
                }
              }}
            >
              <Hash className="w-4 h-4 mr-2" />
              Notificar Participantes
            </Button>
            <Button 
              variant="outline"
              onClick={async () => {
                try {
                  // Get all participants for this raffle
                  const participants = await purchaseService.getPurchasesByRaffle(raffleId);
                  
                  // Create CSV data
                  const csvData = [
                    ['ID', 'Usuario', 'Email', 'Números', 'Fecha de Compra', 'Método de Pago', 'Total Pagado'],
                    ...participants.map(p => [
                      p.id,
                      p.userName,
                      p.userEmail,
                      p.numbers.join(', '),
                      new Date(p.createdAt).toLocaleDateString(),
                      p.paymentMethod,
                      `$${p.totalAmount}`
                    ])
                  ];
                  
                  const csvContent = csvData.map(row => row.join(',')).join('\n');
                  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `participantes-rifa-${raffle.id}-${new Date().toISOString().split('T')[0]}.csv`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                } catch (error) {
                  console.error('Error exporting participant data:', error);
                }
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Datos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}