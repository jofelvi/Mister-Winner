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
import { Input } from '@/components/shared/input/input';
import { Raffle } from '@/types';
import { formatFirebaseDate } from '@/utils/dateUtils';
import raffleService from '@/services/raffleService';
import ImageUpload from '@/components/shared/ImageUpload/ImageUpload';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Edit3,
  Eye,
  Filter,
  Plus,
  Save,
  Search,
  Trash2,
  Trophy,
  Users,
  X,
  XCircle,
} from 'lucide-react';

export default function AdminRifasPage() {
  const router = useRouter();
  const { userProfile } = useAuth();
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRaffle, setEditingRaffle] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [newRaffle, setNewRaffle] = useState({
    title: '',
    type: 4 as 2 | 4 | 5 | 6,
    pricePerNumber: 0,
    drawDate: '',
    prizes: [
      {
        id: '1',
        name: '',
        amount: 0,
        position: 1,
        imageUrl: '',
        description: '',
      },
    ],
  });

  useEffect(() => {
    fetchRaffles();
  }, []);

  const fetchRaffles = async () => {
    try {
      setLoading(true);
      const allRaffles = await raffleService.getAll();
      setRaffles(allRaffles);
    } catch (error) {
      console.error('Error fetching raffles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRaffles = raffles.filter(raffle => {
    const matchesSearch = raffle.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || raffle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  const getProgressPercentage = (sold: number, total: number) => {
    return Math.round((sold / total) * 100);
  };

  const handleCreateRaffle = async () => {
    try {
      setCreating(true);

      // Calculate total numbers based on raffle type
      const totalNumbers = Math.pow(10, newRaffle.type);

      // Add IDs to prizes
      const prizesWithIds = newRaffle.prizes.map((prize, index) => ({
        ...prize,
        id: `prize-${Date.now()}-${index}`,
      }));

      const raffleData = {
        title: newRaffle.title,
        type: newRaffle.type,
        pricePerNumber: newRaffle.pricePerNumber,
        drawDate: newRaffle.drawDate,
        prizes: prizesWithIds,
        totalNumbers,
        numbersSold: 0,
        soldNumbers: [],
        status: 'active' as const,
      };

      await raffleService.createRaffle(raffleData);
      await fetchRaffles(); // Refresh the list

      setShowCreateForm(false);
      setNewRaffle({
        title: '',
        type: 4,
        pricePerNumber: 0,
        drawDate: '',
        prizes: [
          {
            id: '1',
            name: '',
            amount: 0,
            position: 1,
            imageUrl: '',
            description: '',
          },
        ],
      });
    } catch (error) {
      console.error('Error creating raffle:', error);
    } finally {
      setCreating(false);
    }
  };

  const addPrize = () => {
    setNewRaffle({
      ...newRaffle,
      prizes: [
        ...newRaffle.prizes,
        {
          id: `temp-${Date.now()}`,
          name: '',
          amount: 0,
          position: newRaffle.prizes.length + 1,
          imageUrl: '',
          description: '',
        },
      ],
    });
  };

  const updatePrize = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedPrizes = newRaffle.prizes.map((prize, i) =>
      i === index ? { ...prize, [field]: value } : prize
    );
    setNewRaffle({ ...newRaffle, prizes: updatedPrizes });
  };

  const removePrize = (index: number) => {
    const updatedPrizes = newRaffle.prizes.filter((_, i) => i !== index);
    setNewRaffle({ ...newRaffle, prizes: updatedPrizes });
  };

  const handleViewRaffle = (raffleId: string) => {
    router.push(`/admin/rifas/${raffleId}`);
  };

  const handleEditRaffle = (raffle: Raffle) => {
    setNewRaffle({
      title: raffle.title,
      type: raffle.type,
      pricePerNumber: raffle.pricePerNumber,
      drawDate: raffle.drawDate,
      prizes: raffle.prizes.map(prize => ({
        ...prize,
        imageUrl: prize.imageUrl || '',
        description: prize.description || '',
      })),
    });
    setEditingRaffle(raffle.id);
    setShowCreateForm(true);
  };

  const handleCancelRaffle = async (raffleId: string) => {
    if (window.confirm('¿Estás seguro de que quieres cancelar esta rifa?')) {
      try {
        await raffleService.updateRaffleStatus(raffleId, 'cancelled');
        await fetchRaffles(); // Refresh the list
      } catch (error) {
        console.error('Error cancelling raffle:', error);
      }
    }
  };

  const handleUpdateRaffle = async () => {
    if (!editingRaffle) return;

    try {
      setCreating(true);

      // Calculate total numbers based on raffle type
      const totalNumbers = Math.pow(10, newRaffle.type);

      // Add IDs to prizes that don't have them
      const prizesWithIds = newRaffle.prizes.map((prize, index) => ({
        ...prize,
        id: prize.id || `prize-${Date.now()}-${index}`,
      }));

      const raffleData = {
        title: newRaffle.title,
        type: newRaffle.type,
        pricePerNumber: newRaffle.pricePerNumber,
        drawDate: newRaffle.drawDate,
        prizes: prizesWithIds,
        totalNumbers,
        updatedAt: new Date(),
      };

      await raffleService.update(editingRaffle, raffleData);
      await fetchRaffles(); // Refresh the list

      setShowCreateForm(false);
      setEditingRaffle(null);
      setNewRaffle({
        title: '',
        type: 4,
        pricePerNumber: 0,
        drawDate: '',
        prizes: [
          {
            id: '1',
            name: '',
            amount: 0,
            position: 1,
            imageUrl: '',
            description: '',
          },
        ],
      });
    } catch (error) {
      console.error('Error updating raffle:', error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Rifas</h1>
          <p className="text-gray-600 mt-1">
            Crea, edita y administra todas las rifas del sistema
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Rifa
        </Button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingRaffle ? 'Editar Rifa' : 'Crear Nueva Rifa'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Título de la Rifa"
                value={newRaffle.title}
                onChange={e =>
                  setNewRaffle({ ...newRaffle, title: e.target.value })
                }
                placeholder="Ej: Rifa Especial de Agosto"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Rifa
                </label>
                <select
                  value={newRaffle.type}
                  onChange={e =>
                    setNewRaffle({
                      ...newRaffle,
                      type: parseInt(e.target.value) as 2 | 4 | 5 | 6,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                >
                  <option value={2}>2 Dígitos</option>
                  <option value={4}>4 Dígitos</option>
                  <option value={5}>5 Dígitos</option>
                  <option value={6}>6 Dígitos</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Precio por Número"
                type="number"
                value={newRaffle.pricePerNumber}
                onChange={e =>
                  setNewRaffle({
                    ...newRaffle,
                    pricePerNumber: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0.00"
              />
              <Input
                label="Fecha del Sorteo"
                type="date"
                value={newRaffle.drawDate}
                onChange={e =>
                  setNewRaffle({ ...newRaffle, drawDate: e.target.value })
                }
              />
            </div>

            {/* Premios */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Premios</h3>
                <Button onClick={addPrize} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Premio
                </Button>
              </div>
              <div className="space-y-3">
                {newRaffle.prizes.map((prize, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-cyan-100 text-cyan-800 rounded-full text-sm font-semibold">
                      {prize.position}°
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          placeholder="Nombre del premio"
                          value={prize.name}
                          onChange={e =>
                            updatePrize(index, 'name', e.target.value)
                          }
                        />
                        <Input
                          type="number"
                          placeholder="Monto"
                          value={prize.amount}
                          onChange={e =>
                            updatePrize(
                              index,
                              'amount',
                              parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      </div>

                      <Input
                        placeholder="Descripción del premio (opcional)"
                        value={prize.description}
                        onChange={e =>
                          updatePrize(index, 'description', e.target.value)
                        }
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Imagen del Premio
                        </label>
                        <ImageUpload
                          entityId={`prize-${index}`}
                          currentImageUrl={prize.imageUrl}
                          onImageUploaded={url =>
                            updatePrize(index, 'imageUrl', url)
                          }
                          onImageRemoved={() =>
                            updatePrize(index, 'imageUrl', '')
                          }
                          placeholder="Subir imagen del premio"
                          className="w-full"
                        />
                      </div>
                    </div>
                    {newRaffle.prizes.length > 1 && (
                      <Button
                        onClick={() => removePrize(index)}
                        variant="outline"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingRaffle(null);
                  setNewRaffle({
                    title: '',
                    type: 4,
                    pricePerNumber: 0,
                    drawDate: '',
                    prizes: [
                      {
                        id: '1',
                        name: '',
                        amount: 0,
                        position: 1,
                        imageUrl: '',
                        description: '',
                      },
                    ],
                  });
                }}
                variant="outline"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button
                onClick={
                  editingRaffle ? handleUpdateRaffle : handleCreateRaffle
                }
                disabled={creating}
              >
                <Save className="w-4 h-4 mr-2" />
                {creating
                  ? editingRaffle
                    ? 'Actualizando...'
                    : 'Creando...'
                  : editingRaffle
                    ? 'Actualizar Rifa'
                    : 'Crear Rifa'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
            <option value="all">Todas</option>
            <option value="active">Activas</option>
            <option value="completed">Finalizadas</option>
            <option value="cancelled">Canceladas</option>
          </select>
        </div>
      </div>

      {/* Rifas List */}
      <div className="space-y-4">
        {filteredRaffles.map(raffle => {
          const progress = getProgressPercentage(
            raffle.numbersSold,
            raffle.totalNumbers
          );
          return (
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
                        <span className="text-sm font-medium text-gray-600">
                          {getStatusText(raffle.status)}
                        </span>
                      </div>
                      <span className="text-xs font-medium bg-cyan-100 text-cyan-800 px-2 py-1 rounded">
                        {raffle.type} dígitos
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
                          <p className="text-sm text-gray-500">Precio</p>
                          <p className="font-semibold">
                            ${raffle.pricePerNumber}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Premios</p>
                          <p className="font-semibold">
                            {raffle.prizes.length}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Sorteo</p>
                          <p className="font-semibold">
                            {formatFirebaseDate(raffle.drawDate)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Progreso</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

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
                      onClick={() => handleViewRaffle(raffle.id)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalle
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditRaffle(raffle)}
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    {raffle.status === 'active' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancelRaffle(raffle.id)}
                      >
                        <XCircle className="w-4 h-4 mr-2 text-red-500" />
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredRaffles.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay rifas
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all'
                ? 'No se encontraron rifas con los filtros aplicados.'
                : 'Aún no has creado ninguna rifa.'}
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Primera Rifa
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
