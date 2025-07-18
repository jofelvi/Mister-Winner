'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
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
import purchaseService, { PaymentMethod } from '@/services/purchaseService';
import { Raffle } from '@/types';
import {
  Trophy,
  Ticket,
  Clock,
  Users,
  Calendar,
  ArrowLeft,
  Search,
  Filter,
  Shuffle,
  Plus,
  Minus,
  ShoppingCart,
  CreditCard,
  Smartphone,
  Building2,
  Star,
  Coins,
  Check,
  X,
  AlertCircle,
  Zap,
  Gift,
  Target,
  Hash,
} from 'lucide-react';

export default function RaffleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { userProfile } = useAuth();
  const raffleId = params.id as string;

  // State
  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [loading, setLoading] = useState(true);
  const [soldNumbers, setSoldNumbers] = useState<string[]>([]);
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([]);
  const [searchNumber, setSearchNumber] = useState('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [paymentReference, setPaymentReference] = useState('');
  const [purchasing, setPurchasing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const numbersPerPage = 100;
  const maxSelectableNumbers = 10;

  // Payment methods
  const paymentMethods = purchaseService.getPaymentMethods();

  // Load raffle data and setup real-time listener
  useEffect(() => {
    const loadRaffle = async () => {
      try {
        setLoading(true);
        const raffleData = await raffleService.getById(raffleId);
        setRaffle(raffleData);
        setSoldNumbers(raffleData.soldNumbers || []);
      } catch (error) {
        console.error('Error loading raffle:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRaffle();

    // Setup real-time listener for sold numbers
    const unsubscribe = purchaseService.listenToSoldNumbers(raffleId, (newSoldNumbers) => {
      setSoldNumbers(newSoldNumbers);
    });

    return () => unsubscribe();
  }, [raffleId]);

  // Generate available numbers
  const availableNumbers = useMemo(() => {
    if (!raffle) return [];
    return purchaseService.generateNumbersForRaffle(raffle.type, soldNumbers);
  }, [raffle, soldNumbers]);

  // Filter and paginate numbers
  const filteredNumbers = useMemo(() => {
    if (!raffle) return [];
    
    let numbers = purchaseService.generateNumbersForRaffle(raffle.type);
    
    // Filter by availability
    if (showAvailableOnly) {
      numbers = numbers.filter(num => !soldNumbers.includes(num));
    }
    
    // Filter by search
    if (searchNumber) {
      numbers = numbers.filter(num => num.includes(searchNumber));
    }
    
    return numbers;
  }, [raffle, soldNumbers, showAvailableOnly, searchNumber]);

  const paginatedNumbers = useMemo(() => {
    const startIndex = (currentPage - 1) * numbersPerPage;
    return filteredNumbers.slice(startIndex, startIndex + numbersPerPage);
  }, [filteredNumbers, currentPage]);

  const totalPages = Math.ceil(filteredNumbers.length / numbersPerPage);

  // Handlers
  const handleNumberSelect = useCallback((number: string) => {
    if (soldNumbers.includes(number)) return;
    
    setSelectedNumbers(prev => {
      if (prev.includes(number)) {
        return prev.filter(n => n !== number);
      } else if (prev.length < maxSelectableNumbers) {
        return [...prev, number].sort();
      }
      return prev;
    });
  }, [soldNumbers]);

  const handleRandomSelection = useCallback((count: number) => {
    const randomNumbers = purchaseService.getRandomAvailableNumbers(availableNumbers, count);
    setSelectedNumbers(randomNumbers.sort());
  }, [availableNumbers]);

  const handlePurchase = async () => {
    if (!userProfile || !raffle || !selectedPaymentMethod || selectedNumbers.length === 0) {
      return;
    }

    try {
      setPurchasing(true);
      
      // Final availability check
      const { available, taken } = await purchaseService.checkNumbersAvailability(
        raffleId, 
        selectedNumbers
      );
      
      if (taken.length > 0) {
        alert(`Los siguientes numeros ya fueron vendidos: ${taken.join(', ')}`);
        setSelectedNumbers(available);
        return;
      }
      
      // Process purchase
      await purchaseService.purchaseNumbers(
        raffleId,
        userProfile.id,
        selectedNumbers,
        selectedPaymentMethod,
        paymentReference
      );
      
      // Success
      alert('Compra realizada exitosamente!');
      setSelectedNumbers([]);
      setShowPaymentModal(false);
      setPaymentReference('');
      
      // Redirect to history
      router.push('/historial');
      
    } catch (error) {
      console.error('Error purchasing numbers:', error);
      alert(error instanceof Error ? error.message : 'Error al procesar la compra');
    } finally {
      setPurchasing(false);
    }
  };

  const getNumberStatus = (number: string) => {
    if (soldNumbers.includes(number)) return 'sold';
    if (selectedNumbers.includes(number)) return 'selected';
    return 'available';
  };

  const getNumberStyles = (number: string) => {
    const status = getNumberStatus(number);
    switch (status) {
      case 'sold':
        return 'bg-red-100 text-red-800 border-red-200 cursor-not-allowed opacity-50';
      case 'selected':
        return 'bg-cyan-500 text-white border-cyan-600 shadow-lg transform scale-105';
      case 'available':
      default:
        return 'bg-white text-gray-900 border-gray-200 hover:border-cyan-300 hover:shadow-md cursor-pointer transition-all duration-200';
    }
  };

  const totalAmount = selectedNumbers.length * (raffle?.pricePerNumber || 0);
  const progress = raffle ? Math.round((raffle.numbersSold / raffle.totalNumbers) * 100) : 0;
  const isNearDraw = progress >= 80;

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
        <Button onClick={() => router.push('/rifas')}>
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
            onClick={() => router.push('/rifas')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{raffle.title}</h1>
            <p className="text-gray-600 mt-1">
              Selecciona tus numeros de la suerte
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Raffle Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Raffle Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-600" />
                Informacion de la Rifa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Premios</h4>
                <div className="space-y-1">
                  {raffle.prizes.slice(0, 3).map(prize => (
                    <div key={prize.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{prize.position} lugar:</span>
                      <span className="font-semibold text-gray-900">
                        ${prize.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  {raffle.prizes.length > 3 && (
                    <p className="text-xs text-gray-500">
                      +{raffle.prizes.length - 3} premios mas
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{raffle.numbersSold.toLocaleString()} participantes</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{formatFirebaseDate(raffle.drawDate)}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
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
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{raffle.numbersSold.toLocaleString()} vendidos</span>
                  <span>{raffle.totalNumbers.toLocaleString()} total</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    ${raffle.pricePerNumber}
                  </p>
                  <p className="text-sm text-gray-500">por numero</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selection Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-green-600" />
                Mi Seleccion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Numeros seleccionados:</span>
                  <span className="font-bold text-green-600">
                    {selectedNumbers.length} / {maxSelectableNumbers}
                  </span>
                </div>

                {selectedNumbers.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Tus numeros:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedNumbers.map(number => (
                        <span
                          key={number}
                          className="px-2 py-1 bg-cyan-100 text-cyan-800 rounded text-sm font-mono cursor-pointer hover:bg-red-100 hover:text-red-800"
                          onClick={() => handleNumberSelect(number)}
                          title="Click para quitar"
                        >
                          {number} x
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total a pagar:</span>
                    <span className="text-xl font-bold text-green-600">
                      ${totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    className="w-full"
                    disabled={selectedNumbers.length === 0}
                    onClick={() => setShowPaymentModal(true)}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Proceder al Pago
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setSelectedNumbers([])}
                    disabled={selectedNumbers.length === 0}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Limpiar Seleccion
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Number Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Controls */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar numero..."
                    value={searchNumber}
                    onChange={e => setSearchNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAvailableOnly(!showAvailableOnly)}
                    className={showAvailableOnly ? 'bg-cyan-50 text-cyan-700 border-cyan-300' : ''}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Solo Disponibles
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRandomSelection(1)}
                    disabled={availableNumbers.length === 0}
                  >
                    <Shuffle className="w-4 h-4 mr-2" />
                    Aleatorio
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRandomSelection(5)}
                    disabled={availableNumbers.length < 5}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    5 Numeros
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Numbers Grid */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  Numeros Disponibles
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-white border border-gray-300 rounded"></div>
                    <span>Disponible</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-cyan-500 rounded"></div>
                    <span>Seleccionado</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
                    <span>Vendido</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-10 gap-2 mb-4">
                {paginatedNumbers.map(number => (
                  <button
                    key={number}
                    onClick={() => handleNumberSelect(number)}
                    disabled={soldNumbers.includes(number)}
                    className={`p-2 text-sm font-mono border rounded text-center ${getNumberStyles(number)}`}
                    title={
                      soldNumbers.includes(number) 
                        ? 'Numero vendido' 
                        : selectedNumbers.includes(number)
                        ? 'Click para quitar'
                        : 'Click para seleccionar'
                    }
                  >
                    {number}
                  </button>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <span className="text-sm text-gray-600">
                      Pagina {currentPage} de {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600">
                    {filteredNumbers.length} numeros {showAvailableOnly ? 'disponibles' : 'total'}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  Metodo de Pago
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPaymentModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Resumen del Pedido</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Numeros seleccionados:</span>
                    <span>{selectedNumbers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Precio por numero:</span>
                    <span>${raffle.pricePerNumber}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-1">
                    <span>Total:</span>
                    <span>${totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Selecciona tu metodo de pago:</h4>
                {paymentMethods.filter(method => method.enabled).map(method => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method)}
                    className={`w-full p-3 border rounded-lg text-left transition-all ${
                      selectedPaymentMethod?.id === method.id
                        ? 'border-cyan-500 bg-cyan-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900">{method.name}</p>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                      {selectedPaymentMethod?.id === method.id && (
                        <Check className="w-5 h-5 text-cyan-600 ml-auto" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Payment Reference */}
              {selectedPaymentMethod?.requiresReference && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numero de Referencia
                  </label>
                  <input
                    type="text"
                    value={paymentReference}
                    onChange={e => setPaymentReference(e.target.value)}
                    placeholder="Ingresa el numero de referencia del pago"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={handlePurchase}
                  disabled={
                    !selectedPaymentMethod || 
                    purchasing ||
                    (selectedPaymentMethod?.requiresReference && !paymentReference.trim())
                  }
                >
                  {purchasing ? (
                    <>
                      <Loader />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Confirmar Compra
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowPaymentModal(false)}
                  disabled={purchasing}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}