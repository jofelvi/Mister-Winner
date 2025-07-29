'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Raffle } from '@/types';
import { Card } from '@/components/ui/card';
import { Calendar, ChevronLeft, ChevronRight, Gift, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatFirebaseDate } from '@/utils/dateUtils';
import Image from 'next/image';

export const RaffleCard = ({ raffle }: { raffle: Raffle }) => {
  const router = useRouter();
  const progress = (raffle.numbersSold / raffle.totalNumbers) * 100;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePurchase = () => {
    // Navigate to specific raffle purchase page
    router.push(`/rifas/${raffle.id}`);
  };

  const mainPrize = raffle.prizes?.[0];
  const prizesWithImages = raffle.prizes?.filter(prize => prize.imageUrl) || [];
  const hasMultipleImages = prizesWithImages.length > 1;

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % prizesWithImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      prev => (prev - 1 + prizesWithImages.length) % prizesWithImages.length
    );
  };

  return (
    <Card className="group flex flex-col h-full bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-200 hover:border-cyan-300 transform hover:-translate-y-2 transition-all duration-300 overflow-hidden">
      {/* Prize Image(s) Slider */}
      <div className="relative h-48 bg-gradient-to-br from-cyan-50 to-teal-50 overflow-hidden">
        {prizesWithImages.length > 0 ? (
          <>
            {/* Current Image */}
            <div className="relative h-full">
              <Image
                src={prizesWithImages[currentImageIndex]?.imageUrl || ''}
                alt={prizesWithImages[currentImageIndex]?.name || 'Premio'}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Prize position indicator */}
              <div className="absolute top-3 left-3">
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-sm font-bold text-white">
                    {prizesWithImages[currentImageIndex]?.position}°
                  </span>
                </div>
              </div>

              {/* Prize name overlay */}
              <div className="absolute bottom-3 left-3 right-3">
                <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2">
                  <p className="text-white text-sm font-medium truncate">
                    {prizesWithImages[currentImageIndex]?.name}
                  </p>
                  <p className="text-white/80 text-xs">
                    $
                    {prizesWithImages[
                      currentImageIndex
                    ]?.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation arrows - only show if multiple images */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors z-10"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-800" />
                </button>

                <button
                  onClick={e => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors z-10"
                >
                  <ChevronRight className="w-4 h-4 text-gray-800" />
                </button>
              </>
            )}

            {/* Dots indicator - only show if multiple images */}
            {hasMultipleImages && (
              <div className="absolute bottom-3 right-3 flex gap-1">
                {prizesWithImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={e => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? 'bg-white shadow-lg'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center">
              <Gift className="w-8 h-8 text-white" />
            </div>
          </div>
        )}

        {/* Type badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-white/90 backdrop-blur-sm text-cyan-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-cyan-200">
            {raffle.type} dígitos
          </span>
        </div>

        {/* Status indicator */}
        <div className="absolute top-3 left-3 z-20">
          <div className="flex items-center gap-1 bg-green-500/90 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
            Activa
          </div>
        </div>

        {/* Multiple images counter */}
        {hasMultipleImages && (
          <div className="absolute top-3 right-3 translate-y-8">
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm text-cyan-700 text-xs font-medium px-2 py-1 rounded-full shadow-sm border border-cyan-200">
              <Gift className="w-3 h-3" />
              <span className="font-semibold">
                {currentImageIndex + 1}/{prizesWithImages.length}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-cyan-700 transition-colors">
          {raffle.title}
        </h3>

        {/* Prize info */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-amber-500 rounded-lg flex items-center justify-center">
              <Gift className="w-3 h-3 text-white" />
            </div>
            <h4 className="text-sm font-semibold text-gray-700">
              Premios del Sorteo
            </h4>
          </div>

          <div className="space-y-2">
            {raffle.prizes.slice(0, 3).map((prize, index) => (
              <div
                key={prize.id}
                className={`flex items-center justify-between p-2 rounded-lg border ${
                  index === 0
                    ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200'
                    : index === 1
                      ? 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200'
                      : 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0
                        ? 'bg-amber-500 text-white'
                        : index === 1
                          ? 'bg-gray-400 text-white'
                          : 'bg-orange-500 text-white'
                    }`}
                  >
                    {prize.position}°
                  </div>
                  <span
                    className={`text-sm font-medium truncate ${
                      index === 0
                        ? 'text-amber-800'
                        : index === 1
                          ? 'text-gray-700'
                          : 'text-orange-800'
                    }`}
                  >
                    {prize.name}
                  </span>
                </div>
                <span
                  className={`text-sm font-bold ${
                    index === 0
                      ? 'text-amber-900'
                      : index === 1
                        ? 'text-gray-800'
                        : 'text-orange-900'
                  }`}
                >
                  ${prize.amount.toLocaleString()}
                </span>
              </div>
            ))}

            {raffle.prizes.length > 3 && (
              <div className="flex items-center justify-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-xs text-gray-600 font-medium">
                  +{raffle.prizes.length - 3} premios más
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Draw date */}
        <div className="flex items-center gap-2 text-gray-600 mb-4 p-2 bg-gray-50 rounded-lg">
          <Calendar className="w-4 h-4 text-cyan-500" />
          <span className="text-sm font-medium">
            Sorteo: {formatFirebaseDate(raffle.drawDate)}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>Participantes</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {raffle.numbersSold.toLocaleString()} /{' '}
              {raffle.totalNumbers.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.max(progress, 5)}%` }}
            />
          </div>
          <div className="text-right mt-1">
            <span className="text-xs text-gray-500">
              {Math.round(progress)}% vendido
            </span>
          </div>
        </div>

        {/* Purchase button */}
        <div className="mt-auto">
          <Button
            className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 group/button"
            onClick={handlePurchase}
          >
            <span className="font-semibold">
              Comprar por ${raffle.pricePerNumber}
            </span>
            <ChevronRight className="w-5 h-5 ml-2 group-hover/button:translate-x-1 transition-transform duration-200" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
