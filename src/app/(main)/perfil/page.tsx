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
  User,
  Mail,
  Phone,
  CreditCard,
  Shield,
  Star,
  Gift,
  UserPlus,
  Edit3,
  Save,
  X,
} from 'lucide-react';

export default function PerfilPage() {
  const { userProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: userProfile?.firstName || '',
    lastName: userProfile?.lastName || '',
    phone: userProfile?.phone || '',
    secondaryPhone: userProfile?.secondaryPhone || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: userProfile?.firstName || '',
      lastName: userProfile?.lastName || '',
      phone: userProfile?.phone || '',
      secondaryPhone: userProfile?.secondaryPhone || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="text-gray-600 mt-1">
            Gestiona tu informacion personal y configuracion
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit3 className="w-4 h-4 mr-2" />
              Editar Perfil
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm">
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-600" />
                Informacion Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="firstName"
                  label="Nombre"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  icon={User}
                />
                <Input
                  name="lastName"
                  label="Apellido"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  icon={User}
                />
              </div>

              <Input
                label="Correo Electronico"
                value={userProfile?.email || ''}
                disabled={true}
                icon={Mail}
                textHelper="El correo no se puede modificar"
              />

              <Input
                label="Cedula de Identidad"
                value={userProfile?.ci || ''}
                disabled={true}
                icon={CreditCard}
                textHelper="La cedula no se puede modificar"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="phone"
                  label="Telefono Principal"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  icon={Phone}
                />
                <Input
                  name="secondaryPhone"
                  label="Telefono Secundario"
                  value={formData.secondaryPhone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  icon={Phone}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Cambiar Contraseña
                  </h4>
                  <p className="text-sm text-gray-600">
                    Actualiza tu contraseña para mantener tu cuenta segura
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Cambiar
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Autenticacion de Dos Factores
                  </h4>
                  <p className="text-sm text-gray-600">
                    Agrega una capa extra de seguridad a tu cuenta
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Configurar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-600" />
                Estadisticas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {userProfile?.points || 0}
                </p>
                <p className="text-sm text-gray-600">Puntos acumulados</p>
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {userProfile?.credits || 0}
                </p>
                <p className="text-sm text-gray-600">Creditos disponibles</p>
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-900">5</p>
                <p className="text-sm text-gray-600">Referidos activos</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-purple-600" />
                Programa de Referidos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Tu Codigo</h4>
                <p className="text-lg font-mono font-bold text-purple-600 mb-2">
                  {userProfile?.referralCode}
                </p>
                <Button size="sm" className="w-full">
                  Compartir Codigo
                </Button>
              </div>

              <div className="text-sm text-gray-600 space-y-2">
                <p>• Gana 100 puntos por cada referido</p>
                <p>• Tu referido recibe 50 puntos de bienvenida</p>
                <p>• Obten 5% de comision en sus compras</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
