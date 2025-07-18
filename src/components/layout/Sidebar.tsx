'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/shared/button/Button';
import {
  Trophy,
  Home,
  Ticket,
  History,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Crown,
  Shield,
  Star,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { userProfile, logout, isAdmin, isAgent } = useAuth();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      description: 'Panel principal',
    },
    {
      name: 'Rifas Activas',
      href: '/rifas',
      icon: Ticket,
      description: 'Participar en rifas',
    },
    {
      name: 'Mi Historial',
      href: '/historial',
      icon: History,
      description: 'Historial de participaciones',
    },
    {
      name: 'Mi Perfil',
      href: '/perfil',
      icon: User,
      description: 'Información personal',
    },
  ];

  const adminNavigation = [
    {
      name: 'Panel Admin',
      href: '/admin',
      icon: Crown,
      description: 'Dashboard administrativo',
    },
    {
      name: 'Crear Rifas',
      href: '/admin/rifas',
      icon: Ticket,
      description: 'Crear y gestionar rifas',
    },
    {
      name: 'Métodos de Pago',
      href: '/admin/pagos',
      icon: Settings,
      description: 'Configurar pagos',
    },
    {
      name: 'Historial Rifas',
      href: '/admin/historial',
      icon: History,
      description: 'Historial de rifas',
    },
    {
      name: 'Ganadores',
      href: '/admin/ganadores',
      icon: Trophy,
      description: 'Gestionar ganadores',
    },
  ];

  const handleLogout = async () => {
    await logout();
  };

  const isActivePath = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <div
      className={cn(
        'h-screen bg-gradient-to-b from-cyan-900 via-cyan-800 to-teal-900 text-white transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-cyan-700/50">
        <div
          className={cn(
            'flex items-center gap-3 transition-opacity duration-300',
            isCollapsed && 'opacity-0'
          )}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center shadow-lg">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Mister Winner</h1>
            <p className="text-xs text-cyan-300">Tu próxima victoria</p>
          </div>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-cyan-700/50 rounded-lg transition-colors"
        >
          {isCollapsed ? (
            <Menu className="w-4 h-4" />
          ) : (
            <X className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-cyan-700/50">
        <div
          className={cn(
            'flex items-center gap-3 transition-opacity duration-300',
            isCollapsed && 'opacity-0'
          )}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">
              {userProfile?.firstName} {userProfile?.lastName}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {userProfile?.role === 'admin' && (
                  <Crown className="w-3 h-3 text-amber-400" />
                )}
                {userProfile?.role === 'agent' && (
                  <Shield className="w-3 h-3 text-blue-400" />
                )}
                {userProfile?.role === 'user' && (
                  <Star className="w-3 h-3 text-green-400" />
                )}
                <span className="text-xs text-cyan-300 capitalize">
                  {userProfile?.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {!isCollapsed && (
          <div className="mt-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-amber-400 font-semibold">
                  {userProfile?.points || 0}
                </p>
                <p className="text-cyan-300">Puntos</p>
              </div>
              <div className="text-center">
                <p className="text-green-400 font-semibold">
                  {userProfile?.credits || 0}
                </p>
                <p className="text-cyan-300">Créditos</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-2">
          {navigation.map(item => {
            const isActive = isActivePath(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  'hover:bg-cyan-700/50 hover:translate-x-1',
                  isActive &&
                    'bg-gradient-to-r from-cyan-600 to-teal-600 shadow-lg shadow-cyan-500/25',
                  isCollapsed && 'justify-center'
                )}
              >
                <item.icon
                  className={cn('w-5 h-5', isActive && 'text-white')}
                />
                {!isCollapsed && (
                  <>
                    <div className="flex-1">
                      <p
                        className={cn('font-medium', isActive && 'text-white')}
                      >
                        {item.name}
                      </p>
                      <p
                        className={cn(
                          'text-xs',
                          isActive ? 'text-cyan-100' : 'text-cyan-400'
                        )}
                      >
                        {item.description}
                      </p>
                    </div>
                    {isActive && (
                      <ChevronRight className="w-4 h-4 text-white" />
                    )}
                  </>
                )}
              </Link>
            );
          })}

          {/* Admin Navigation */}
          {isAdmin && (
            <>
              <div
                className={cn(
                  'px-3 py-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider',
                  isCollapsed && 'hidden'
                )}
              >
                Administración
              </div>
              {adminNavigation.map(item => {
                const isActive = isActivePath(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                      'hover:bg-cyan-700/50 hover:translate-x-1',
                      isActive &&
                        'bg-gradient-to-r from-cyan-600 to-teal-600 shadow-lg shadow-cyan-500/25',
                      isCollapsed && 'justify-center'
                    )}
                  >
                    <item.icon
                      className={cn('w-5 h-5', isActive && 'text-white')}
                    />
                    {!isCollapsed && (
                      <>
                        <div className="flex-1">
                          <p
                            className={cn(
                              'font-medium',
                              isActive && 'text-white'
                            )}
                          >
                            {item.name}
                          </p>
                          <p
                            className={cn(
                              'text-xs',
                              isActive ? 'text-cyan-100' : 'text-cyan-400'
                            )}
                          >
                            {item.description}
                          </p>
                        </div>
                        {isActive && (
                          <ChevronRight className="w-4 h-4 text-white" />
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-cyan-700/50">
        <div className="space-y-2">
          <Link
            href="/configuracion"
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              'hover:bg-cyan-700/50',
              isCollapsed && 'justify-center'
            )}
          >
            <Settings className="w-5 h-5" />
            {!isCollapsed && <span>Configuración</span>}
          </Link>

          <Button
            onClick={handleLogout}
            variant="ghost"
            className={cn(
              'w-full justify-start gap-3 text-white hover:bg-red-600/20 hover:text-red-300',
              isCollapsed && 'justify-center'
            )}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span>Cerrar Sesión</span>}
          </Button>
        </div>
      </div>
    </div>
  );
}
