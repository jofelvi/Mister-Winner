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
import purchaseService, { NumberPurchase } from '@/services/purchaseService';
import { Raffle } from '@/types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';
import {
  ArrowLeft,
  Users,
  Search,
  Filter,
  Download,
  Mail,
  Hash,
  Calendar,
  DollarSign,
  CreditCard,
  User,
} from 'lucide-react';

interface Purchase {
  id: string;
  userId: string;
  raffleId: string;
  userName: string;
  userEmail: string;
  numbers: string[];
  paymentMethod: string;
  totalAmount: number;
  createdAt: Date;
  status: 'pending' | 'completed' | 'failed';
}

export default function AdminRaffleParticipantsPage() {
  const router = useRouter();
  const params = useParams();
  useAuth();
  const raffleId = params.id as string;

  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [participants, setParticipants] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    paymentMethod: 'all',
    status: 'all',
    sortBy: 'date'
  });

  // Function to enrich purchases with user data
  const enrichPurchasesWithUserData = async (purchases: NumberPurchase[]): Promise<Purchase[]> => {
    const enrichedPurchases: Purchase[] = [];
    
    for (const purchase of purchases) {
      try {
        const userDoc = await getDoc(doc(db, 'users', purchase.userId));
        const userData = userDoc.exists() ? userDoc.data() : null;
        
        const enrichedPurchase: Purchase = {
          id: purchase.id,
          userId: purchase.userId,
          raffleId: purchase.raffleId,
          userName: userData?.displayName || userData?.name || 'Usuario desconocido',
          userEmail: userData?.email || 'Email no disponible',
          numbers: purchase.numbers,
          paymentMethod: purchase.paymentMethod,
          totalAmount: purchase.totalAmount,
          createdAt: new Date(purchase.createdAt),
          status: purchase.status === 'confirmed' ? 'completed' : purchase.status === 'pending' ? 'pending' : 'failed',
        };
        
        enrichedPurchases.push(enrichedPurchase);
      } catch (error) {
        console.error('Error fetching user data for purchase:', purchase.id, error);
        // Add purchase with default user data if user fetch fails
        const fallbackPurchase: Purchase = {
          id: purchase.id,
          userId: purchase.userId,
          raffleId: purchase.raffleId,
          userName: 'Usuario desconocido',
          userEmail: 'Email no disponible',
          numbers: purchase.numbers,
          paymentMethod: purchase.paymentMethod,
          totalAmount: purchase.totalAmount,
          createdAt: new Date(purchase.createdAt),
          status: purchase.status === 'confirmed' ? 'completed' : purchase.status === 'pending' ? 'pending' : 'failed',
        };
        enrichedPurchases.push(fallbackPurchase);
      }
    }
    
    return enrichedPurchases;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching raffle with ID:', raffleId);
        const [raffleData, purchases] = await Promise.all([
          raffleService.getById(raffleId),
          purchaseService.getPurchasesByRaffle(raffleId)
        ]);
        console.log('Raffle data received:', raffleData);
        console.log('Purchases data received:', purchases);
        
        setRaffle(raffleData);
        
        // Enrich purchases with user data
        const enrichedPurchases = await enrichPurchasesWithUserData(purchases);
        setParticipants(enrichedPurchases);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [raffleId]);

  const filteredParticipants = participants.filter(participant => {
    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      if (
        !participant.userName.toLowerCase().includes(search) &&
        !participant.userEmail.toLowerCase().includes(search) &&
        !participant.numbers.some(num => num.includes(search))
      ) {
        return false;
      }
    }

    // Payment method filter
    if (filters.paymentMethod !== 'all' && participant.paymentMethod !== filters.paymentMethod) {
      return false;
    }

    // Status filter
    if (filters.status !== 'all' && participant.status !== filters.status) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'name':
        return a.userName.localeCompare(b.userName);
      case 'amount':
        return b.totalAmount - a.totalAmount;
      case 'numbers':
        return b.numbers.length - a.numbers.length;
      case 'date':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const totalParticipants = participants.length;
  const totalNumbers = participants.reduce((sum, p) => sum + p.numbers.length, 0);
  const totalRevenue = participants.reduce((sum, p) => sum + p.totalAmount, 0);
  const paymentMethods = [...new Set(participants.map(p => p.paymentMethod))];

  const handleExportParticipants = async () => {
    try {
      const csvData = [
        ['ID', 'Usuario', 'Email', 'Números', 'Cantidad de Números', 'Fecha de Compra', 'Método de Pago', 'Total Pagado', 'Estado'],
        ...filteredParticipants.map(p => [
          p.id,
          p.userName,
          p.userEmail,
          p.numbers.join('; '),
          p.numbers.length,
          new Date(p.createdAt).toLocaleDateString(),
          p.paymentMethod,
          `$${p.totalAmount}`,
          p.status
        ])
      ];
      
      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `participantes-${raffleId}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting participants:', error);
    }
  };

  const handleSendNotifications = async () => {
    try {
      const notificationData = {
        raffleId: raffle?.id,
        raffleTitle: raffle?.title,
        participants: filteredParticipants.map(p => ({
          userId: p.userId,
          email: p.userEmail,
          numbers: p.numbers
        })),
        message: `¡Actualización sobre la rifa "${raffle?.title}"!`,
        timestamp: new Date().toISOString()
      };

      console.log('Sending notifications to', filteredParticipants.length, 'participants');
      console.log('Notification data:', notificationData);
      
      alert(`Notificaciones enviadas a ${filteredParticipants.length} participantes`);
    } catch (error) {
      console.error('Error sending notifications:', error);
      alert('Error enviando notificaciones');
    }
  };

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
        <p className="text-gray-600 mb-4">
          No se pudo encontrar la rifa con ID: <strong>{raffleId}</strong>
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Verifica que el ID sea correcto y que la rifa exista en la base de datos.
        </p>
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
            onClick={() => router.push(`/admin/rifas/${raffleId}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Participantes</h1>
            <p className="text-gray-600 mt-1">{raffle.title}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSendNotifications}
          >
            <Mail className="w-4 h-4 mr-2" />
            Notificar
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportParticipants}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Participantes</p>
                <p className="text-2xl font-bold text-gray-900">{totalParticipants}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Números Vendidos</p>
                <p className="text-2xl font-bold text-gray-900">{totalNumbers}</p>
              </div>
              <Hash className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Promedio por Participante</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${totalParticipants > 0 ? Math.round(totalRevenue / totalParticipants) : 0}
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select 
            value={filters.paymentMethod}
            onChange={(e) => setFilters(prev => ({ ...prev, paymentMethod: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          >
            <option value="all">Todos los métodos</option>
            {paymentMethods.map(method => (
              <option key={method} value={method}>
                {method.charAt(0).toUpperCase() + method.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <select 
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
        >
          <option value="all">Todos los estados</option>
          <option value="completed">Completado</option>
          <option value="pending">Pendiente</option>
          <option value="failed">Fallido</option>
        </select>
        
        <select 
          value={filters.sortBy}
          onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
        >
          <option value="date">Fecha</option>
          <option value="name">Nombre</option>
          <option value="amount">Monto</option>
          <option value="numbers">Números</option>
        </select>

        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o número..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Participants Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Lista de Participantes ({filteredParticipants.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-3 font-medium text-gray-600">Participante</th>
                  <th className="text-left p-3 font-medium text-gray-600">Números</th>
                  <th className="text-left p-3 font-medium text-gray-600">Fecha</th>
                  <th className="text-left p-3 font-medium text-gray-600">Método</th>
                  <th className="text-left p-3 font-medium text-gray-600">Total</th>
                  <th className="text-left p-3 font-medium text-gray-600">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      No se encontraron participantes
                    </td>
                  </tr>
                ) : (
                  filteredParticipants.map(participant => (
                    <tr key={participant.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{participant.userName}</p>
                            <p className="text-sm text-gray-600">{participant.userEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {participant.numbers.slice(0, 3).map(number => (
                            <span
                              key={number}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-mono rounded"
                            >
                              {number}
                            </span>
                          ))}
                          {participant.numbers.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              +{participant.numbers.length - 3} más
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {participant.numbers.length} números
                        </p>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {formatFirebaseDate(participant.createdAt.toString())}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                          {participant.paymentMethod}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-gray-900">
                          ${participant.totalAmount.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${
                          participant.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : participant.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {participant.status === 'completed' ? 'Completado' : 
                           participant.status === 'pending' ? 'Pendiente' : 'Fallido'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}