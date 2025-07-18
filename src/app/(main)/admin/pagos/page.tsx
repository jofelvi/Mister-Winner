'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/shared/card/card';
import { Button } from '@/components/shared/button/Button';
import { Input } from '@/components/shared/input/input';
import {
  AlertCircle,
  Check,
  Copy,
  CreditCard,
  Edit3,
  Eye,
  EyeOff,
  Plus,
  Save,
  Settings,
  Smartphone,
  Trash2,
  X,
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'pago_movil' | 'transferencia';
  name: string;
  bank: string;
  accountNumber: string;
  documentNumber: string;
  phone?: string;
  isActive: boolean;
  createdAt: Date;
}

export default function AdminPagosPage() {
  const { userProfile } = useAuth();
  const [editingMethod, setEditingMethod] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAccountNumbers, setShowAccountNumbers] = useState<{
    [key: string]: boolean;
  }>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Mock data - en producción vendría de Firebase
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'pago_movil',
      name: 'Pago Móvil Principal',
      bank: 'Banco de Venezuela',
      accountNumber: '01020123456789012345',
      documentNumber: '12345678',
      phone: '04141234567',
      isActive: true,
      createdAt: new Date('2025-01-01'),
    },
    {
      id: '2',
      type: 'transferencia',
      name: 'Transferencia Mercantil',
      bank: 'Banco Mercantil',
      accountNumber: '01050987654321098765',
      documentNumber: '12345678',
      isActive: true,
      createdAt: new Date('2025-01-01'),
    },
  ]);

  const [newMethod, setNewMethod] = useState<Partial<PaymentMethod>>({
    type: 'pago_movil',
    name: '',
    bank: '',
    accountNumber: '',
    documentNumber: '',
    phone: '',
    isActive: true,
  });

  const venezuelanBanks = [
    'Banco de Venezuela',
    'Banco Mercantil',
    'Banco Provincial',
    'Banesco',
    'Banco Bicentenario',
    'Banco del Tesoro',
    'Banco Agrícola de Venezuela',
    'Banco Plaza',
    'Banco Caroní',
    'Banplus',
    'Banco Activo',
    'Banco Sofitasa',
    'Banco Fondo Común',
    'Banco Nacional de Crédito',
    'Banco Exterior',
    'Mi Banco',
    'Banco del Sur',
    'Banco de la Fuerza Armada Nacional Bolivariana',
    'Banco Industrial de Venezuela',
    'Banco Venezolano de Crédito',
  ];

  const handleCreateMethod = () => {
    if (
      newMethod.name &&
      newMethod.bank &&
      newMethod.accountNumber &&
      newMethod.documentNumber
    ) {
      const method: PaymentMethod = {
        id: Date.now().toString(),
        type: newMethod.type || 'pago_movil',
        name: newMethod.name,
        bank: newMethod.bank,
        accountNumber: newMethod.accountNumber,
        documentNumber: newMethod.documentNumber,
        phone: newMethod.phone,
        isActive: newMethod.isActive || true,
        createdAt: new Date(),
      };

      setPaymentMethods([...paymentMethods, method]);
      setNewMethod({
        type: 'pago_movil',
        name: '',
        bank: '',
        accountNumber: '',
        documentNumber: '',
        phone: '',
        isActive: true,
      });
      setShowCreateForm(false);
    }
  };

  const toggleMethodStatus = (id: string) => {
    setPaymentMethods(methods =>
      methods.map(method =>
        method.id === id ? { ...method, isActive: !method.isActive } : method
      )
    );
  };

  const deleteMethod = (id: string) => {
    setPaymentMethods(methods => methods.filter(method => method.id !== id));
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const toggleAccountVisibility = (id: string) => {
    setShowAccountNumbers(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber;
    return (
      accountNumber.slice(0, 4) +
      '*'.repeat(accountNumber.length - 8) +
      accountNumber.slice(-4)
    );
  };

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'pago_movil':
        return <Smartphone className="w-5 h-5 text-blue-600" />;
      case 'transferencia':
        return <CreditCard className="w-5 h-5 text-green-600" />;
      default:
        return <CreditCard className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPaymentTypeName = (type: string) => {
    switch (type) {
      case 'pago_movil':
        return 'Pago Móvil';
      case 'transferencia':
        return 'Transferencia';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Métodos de Pago</h1>
          <p className="text-gray-600 mt-1">
            Configura los métodos de pago disponibles para los participantes
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Método
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Agregar Método de Pago</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre del Método"
                value={newMethod.name || ''}
                onChange={e =>
                  setNewMethod({ ...newMethod, name: e.target.value })
                }
                placeholder="Ej: Pago Móvil Principal"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Pago
                </label>
                <select
                  value={newMethod.type}
                  onChange={e =>
                    setNewMethod({
                      ...newMethod,
                      type: e.target.value as 'pago_movil' | 'transferencia',
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                >
                  <option value="pago_movil">Pago Móvil</option>
                  <option value="transferencia">Transferencia</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banco
                </label>
                <select
                  value={newMethod.bank || ''}
                  onChange={e =>
                    setNewMethod({ ...newMethod, bank: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                >
                  <option value="">Seleccionar banco</option>
                  {venezuelanBanks.map(bank => (
                    <option key={bank} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Número de Cuenta"
                value={newMethod.accountNumber || ''}
                onChange={e =>
                  setNewMethod({ ...newMethod, accountNumber: e.target.value })
                }
                placeholder="01020123456789012345"
                maxLength={20}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Número de Documento"
                value={newMethod.documentNumber || ''}
                onChange={e =>
                  setNewMethod({ ...newMethod, documentNumber: e.target.value })
                }
                placeholder="12345678"
              />
              {newMethod.type === 'pago_movil' && (
                <Input
                  label="Teléfono"
                  value={newMethod.phone || ''}
                  onChange={e =>
                    setNewMethod({ ...newMethod, phone: e.target.value })
                  }
                  placeholder="04141234567"
                />
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setShowCreateForm(false)}
                variant="outline"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleCreateMethod}>
                <Save className="w-4 h-4 mr-2" />
                Guardar Método
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Methods List */}
      <div className="space-y-4">
        {paymentMethods.map(method => (
          <Card key={method.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    {getPaymentIcon(method.type)}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {method.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {getPaymentTypeName(method.type)} - {method.bank}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          method.isActive ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          method.isActive ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {method.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">
                          Número de Cuenta
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="font-mono text-sm">
                            {showAccountNumbers[method.id]
                              ? method.accountNumber
                              : maskAccountNumber(method.accountNumber)}
                          </p>
                          <button
                            onClick={() => toggleAccountVisibility(method.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {showAccountNumbers[method.id] ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            method.accountNumber,
                            `account-${method.id}`
                          )
                        }
                        className="text-gray-400 hover:text-cyan-600 transition-colors"
                      >
                        {copiedField === `account-${method.id}` ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Documento</p>
                        <p className="font-mono text-sm">
                          {method.documentNumber}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            method.documentNumber,
                            `doc-${method.id}`
                          )
                        }
                        className="text-gray-400 hover:text-cyan-600 transition-colors"
                      >
                        {copiedField === `doc-${method.id}` ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {method.phone && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Teléfono</p>
                          <p className="font-mono text-sm">{method.phone}</p>
                        </div>
                        <button
                          onClick={() =>
                            copyToClipboard(method.phone!, `phone-${method.id}`)
                          }
                          className="text-gray-400 hover:text-cyan-600 transition-colors"
                        >
                          {copiedField === `phone-${method.id}` ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {!method.isActive && (
                    <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <p className="text-sm text-amber-800">
                        Este método de pago está desactivado y no será visible
                        para los participantes.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-6">
                  <Button
                    onClick={() => toggleMethodStatus(method.id)}
                    variant={method.isActive ? 'outline' : 'default'}
                    size="sm"
                  >
                    {method.isActive ? 'Desactivar' : 'Activar'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    onClick={() => deleteMethod(method.id)}
                    variant="outline"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4 mr-2 text-red-500" />
                    Eliminar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {paymentMethods.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay métodos de pago configurados
            </h3>
            <p className="text-gray-600 mb-4">
              Agrega métodos de pago para que los participantes puedan realizar
              sus transacciones.
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Primer Método
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            Instrucciones para Participantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">
                Para Pago Móvil:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Envía el pago al número de teléfono indicado</li>
                <li>• Usa el número de documento como referencia</li>
                <li>• Envía el comprobante de pago por WhatsApp</li>
                <li>• Indica tu nombre completo y números comprados</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">
                Para Transferencia:
              </h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Transfiere al número de cuenta indicado</li>
                <li>• Usa tu número de documento como referencia</li>
                <li>• Envía el comprobante de transferencia</li>
                <li>• Incluye tu información de contacto</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
