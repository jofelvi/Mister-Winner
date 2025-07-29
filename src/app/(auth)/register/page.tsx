'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/shared/button/Button';
import { Input } from '@/components/shared/input/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shared/card/card';
import {
  CreditCard,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  Sparkles,
  Trophy,
  User,
  UserPlus,
} from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    ci: '',
    phone: '',
    secondaryPhone: '',
    referredBy: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        ci: formData.ci,
        phone: formData.phone,
        secondaryPhone: formData.secondaryPhone || undefined,
        referredBy: formData.referredBy || undefined,
      });
      router.push('/dashboard');
    } catch {
      setError('Error al crear la cuenta. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-600 to-teal-600 rounded-2xl shadow-lg shadow-cyan-500/25 mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-700 to-teal-700 bg-clip-text text-transparent mb-2">
            Mister Winner
          </h1>
          <p className="text-cyan-600/80 text-sm flex items-center justify-center gap-1">
            <Sparkles className="w-4 h-4" />
            Únete y comienza a ganar
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-white/90 border-cyan-100/50 shadow-xl shadow-cyan-500/10">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-semibold text-cyan-900">
              Crear Cuenta
            </CardTitle>
            <CardDescription className="text-cyan-600/80">
              Completa tu información para participar en las rifas
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="firstName"
                  placeholder="Juan"
                  label="Nombre"
                  value={formData.firstName}
                  onChange={handleChange}
                  icon={User}
                  required
                />
                <Input
                  type="text"
                  name="lastName"
                  placeholder="Pérez"
                  label="Apellido"
                  value={formData.lastName}
                  onChange={handleChange}
                  icon={User}
                  required
                />
              </div>

              <Input
                type="email"
                name="email"
                placeholder="tu@email.com"
                label="Correo Electrónico"
                value={formData.email}
                onChange={handleChange}
                icon={Mail}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="ci"
                  placeholder="12345678"
                  label="Cédula de Identidad"
                  value={formData.ci}
                  onChange={handleChange}
                  icon={CreditCard}
                  required
                />
                <Input
                  type="tel"
                  name="phone"
                  placeholder="04121234567"
                  label="Teléfono Principal"
                  value={formData.phone}
                  onChange={handleChange}
                  icon={Phone}
                  required
                />
              </div>

              <Input
                type="tel"
                name="secondaryPhone"
                placeholder="02121234567"
                label="Teléfono Secundario (Opcional)"
                value={formData.secondaryPhone}
                onChange={handleChange}
                icon={Phone}
              />

              {/* Password fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Mínimo 6 caracteres"
                    label="Contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    icon={Lock}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-cyan-500 hover:text-cyan-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirma tu contraseña"
                    label="Confirmar Contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    icon={Lock}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-9 text-cyan-500 hover:text-cyan-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Input
                type="text"
                name="referredBy"
                placeholder="Código de referencia (opcional)"
                label="Código de Referencia"
                value={formData.referredBy}
                onChange={handleChange}
                icon={UserPlus}
                textHelper="Si alguien te recomendó, ingresa su código aquí"
              />

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={loading}
              >
                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Button>
            </form>

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-cyan-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-cyan-600/80">
                    ¿Ya tienes cuenta?
                  </span>
                </div>
              </div>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm text-cyan-600 hover:text-cyan-700 transition-colors font-medium"
                >
                  Inicia sesión aquí
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-xs text-cyan-600/60">
          © 2025 Mister Winner. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
}
