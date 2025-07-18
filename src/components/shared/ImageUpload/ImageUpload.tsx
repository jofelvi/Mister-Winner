'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import storageService, { UploadProgress } from '@/services/storageService';

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  onImageRemoved: () => void;
  currentImageUrl?: string;
  entityId: string;
  uploadPath?: 'prizes' | 'raffles';
  className?: string;
  placeholder?: string;
}

export default function ImageUpload({
  onImageUploaded,
  onImageRemoved,
  currentImageUrl,
  entityId,
  uploadPath = 'prizes',
  className = '',
  placeholder = 'Subir imagen'
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file
    const validation = storageService.validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.error || 'Archivo inválido');
      return;
    }

    try {
      // Show preview immediately
      const preview = await storageService.getImagePreview(file);
      setPreviewUrl(preview);

      setIsUploading(true);
      setUploadProgress({ progress: 0, state: 'running' });

      // Upload file
      const uploadMethod = uploadPath === 'prizes' 
        ? storageService.uploadPrizeImage.bind(storageService)
        : storageService.uploadRaffleImage.bind(storageService);

      const imageUrl = await uploadMethod(
        file,
        entityId,
        (progress) => setUploadProgress(progress)
      );

      onImageUploaded(imageUrl);
      setUploadProgress({ progress: 100, state: 'success' });
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error instanceof Error ? error.message : 'Error al subir la imagen');
      setPreviewUrl(currentImageUrl || null);
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(null), 2000);
    }
  };

  const handleRemoveImage = async () => {
    try {
      if (currentImageUrl) {
        await storageService.deletePrizeImage(currentImageUrl);
      }
      setPreviewUrl(null);
      onImageRemoved();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error removing image:', error);
      setError('Error al eliminar la imagen');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative">
          <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {isUploading && uploadProgress && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-2" />
                  <p className="text-sm">{Math.round(uploadProgress.progress)}%</p>
                </div>
              </div>
            )}
          </div>
          
          <button
            type="button"
            onClick={handleRemoveImage}
            disabled={isUploading}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleUploadClick}
          disabled={isUploading}
          className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-cyan-400 hover:text-cyan-600 transition-colors disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-2" />
              <span className="text-sm">Subiendo...</span>
              {uploadProgress && (
                <span className="text-xs">{Math.round(uploadProgress.progress)}%</span>
              )}
            </>
          ) : (
            <>
              <Upload size={24} className="mb-2" />
              <span className="text-sm">{placeholder}</span>
              <span className="text-xs text-gray-400">JPG, PNG, WebP (máx. 10MB)</span>
            </>
          )}
        </button>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 p-2 rounded border">
          {error}
        </p>
      )}
    </div>
  );
}