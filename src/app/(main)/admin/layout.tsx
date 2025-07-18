'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/shared/card/card';
import { Button } from '@/components/shared/button/Button';
import { AlertTriangle, ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userProfile, loading, isAdmin } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Verificar si el usuario tiene permisos de admin
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Acceso Denegado
            </h2>
            <p className="text-gray-600 mb-6">
              No tienes permisos para acceder a esta sección. Solo los
              administradores pueden ver el panel de administración.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Shield className="w-4 h-4" />
                <span>Tu rol actual: {userProfile?.role || 'No definido'}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Shield className="w-4 h-4" />
                <span>Rol requerido: admin</span>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link href="/dashboard" className="flex-1">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al Dashboard
                </Button>
              </Link>
              <Link href="/perfil" className="flex-1">
                <Button className="w-full">Ver Mi Perfil</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Si es admin, mostrar el contenido
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de administración */}
      <div className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white py-2 px-6">
        <div className="flex items-center gap-2 text-sm">
          <Shield className="w-4 h-4" />
          <span>Panel de Administración</span>
          <span className="mx-2">•</span>
          <span>
            Conectado como: {userProfile?.firstName} {userProfile?.lastName}
          </span>
        </div>
      </div>

      {/* Contenido principal */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
