'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/shared/button/Button';
import { Loader } from '@/components/shared/Loader/Loader';
import { RaffleCard } from '@/features/landing/RaffleCard';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import raffleService from '@/services/raffleService';
import { Raffle } from '@/types';
import { Filter, Search, Star, Ticket } from 'lucide-react';

export default function RifasPage() {
  const router = useRouter();
  const { userProfile } = useAuth();
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'all',
    sortBy: 'drawDate',
    priceRange: 'all',
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRaffles = async () => {
      try {
        setLoading(true);
        const activeRaffles = await raffleService.getActiveRaffles();
        setRaffles(activeRaffles);
      } catch (error) {
        console.error('Error fetching raffles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRaffles();
  }, []);

  const filteredRaffles = raffles
    .filter(raffle => {
      // Type filter
      if (filters.type !== 'all' && raffle.type.toString() !== filters.type) {
        return false;
      }

      // Price range filter
      if (filters.priceRange !== 'all') {
        const price = raffle.pricePerNumber;
        switch (filters.priceRange) {
          case '1-5':
            if (price < 1 || price > 5) return false;
            break;
          case '5-10':
            if (price < 5 || price > 10) return false;
            break;
          case '10+':
            if (price < 10) return false;
            break;
        }
      }

      // Search filter
      if (
        searchTerm &&
        !raffle.title.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'price':
          return a.pricePerNumber - b.pricePerNumber;
        case 'popularity':
          return b.numbersSold - a.numbersSold;
        case 'drawDate':
        default:
          return (
            new Date(a.drawDate).getTime() - new Date(b.drawDate).getTime()
          );
      }
    });

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rifas Activas</h1>
          <p className="text-gray-600 mt-1">
            Descubre las mejores oportunidades para ganar
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/favoritas')}
          >
            <Star className="w-4 h-4 mr-2" />
            Favoritas
          </Button>
          <Button size="sm" onClick={() => router.push('/historial')}>
            <Ticket className="w-4 h-4 mr-2" />
            Mis Participaciones
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filters.type}
            onChange={e =>
              setFilters(prev => ({ ...prev, type: e.target.value }))
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          >
            <option value="all">Todos los tipos</option>
            <option value="2">2 dígitos</option>
            <option value="4">4 dígitos</option>
            <option value="5">5 dígitos</option>
            <option value="6">6 dígitos</option>
          </select>
        </div>

        <select
          value={filters.sortBy}
          onChange={e =>
            setFilters(prev => ({ ...prev, sortBy: e.target.value }))
          }
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
        >
          <option value="drawDate">Fecha de sorteo</option>
          <option value="price">Precio</option>
          <option value="popularity">Popularidad</option>
        </select>

        <select
          value={filters.priceRange}
          onChange={e =>
            setFilters(prev => ({ ...prev, priceRange: e.target.value }))
          }
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
        >
          <option value="all">Todos los precios</option>
          <option value="1-5">$1 - $5</option>
          <option value="5-10">$5 - $10</option>
          <option value="10+">$10+</option>
        </select>

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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRaffles.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No se encontraron rifas
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ||
              filters.type !== 'all' ||
              filters.priceRange !== 'all'
                ? 'Intenta ajustar los filtros para ver más resultados.'
                : 'No hay rifas activas en este momento.'}
            </p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setFilters({
                  type: 'all',
                  sortBy: 'drawDate',
                  priceRange: 'all',
                });
              }}
            >
              Limpiar Filtros
            </Button>
          </div>
        ) : (
          filteredRaffles.map(raffle => (
            <RaffleCard key={raffle.id} raffle={raffle} />
          ))
        )}
      </div>

      {/* Load More - Only show if there are results */}
      {filteredRaffles.length > 0 && (
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              // TODO: Implement pagination
              console.log('Load more raffles');
            }}
          >
            Cargar más rifas
          </Button>
        </div>
      )}
    </div>
  );
}
