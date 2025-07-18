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
import { Mail, Lock, Eye, EyeOff, Trophy, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch {
      setError('Credenciales invalidas. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-600 to-teal-600 rounded-2xl shadow-lg shadow-cyan-500/25 mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-700 to-teal-700 bg-clip-text text-transparent mb-2">
            Mister Winner
          </h1>
          <p className="text-cyan-600/80 text-sm flex items-center justify-center gap-1">
            <Sparkles className="w-4 h-4" />
            Tu proxima gran victoria te espera
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-white/90 border-cyan-100/50 shadow-xl shadow-cyan-500/10">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-semibold text-cyan-900">
              Iniciar Sesion
            </CardTitle>
            <CardDescription className="text-cyan-600/80">
              Ingresa a tu cuenta para participar en las rifas
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="tu@email.com"
                label="Correo Electronico"
                value={email}
                onChange={e => setEmail(e.target.value)}
                icon={Mail}
                required
              />

              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Tu contraseña"
                  label="Contraseña"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
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
                {loading ? 'Iniciando sesion...' : 'Iniciar Sesion'}
              </Button>
            </form>

            <div className="space-y-4">
              <div className="text-center">
                <Link
                  href="/forgot-password"
                  className="text-sm text-cyan-600 hover:text-cyan-700 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-cyan-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-cyan-600/80">
                    ¿No tienes cuenta?
                  </span>
                </div>
              </div>

              <div className="text-center">
                <Link
                  href="/register"
                  className="text-sm text-cyan-600 hover:text-cyan-700 transition-colors font-medium"
                >
                  Registrate aqui
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
