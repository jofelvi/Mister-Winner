import { storage } from './firebase';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  uploadBytesResumable,
  UploadTaskSnapshot 
} from 'firebase/storage';

export interface UploadProgress {
  progress: number;
  state: 'running' | 'paused' | 'success' | 'error';
}

class StorageService {
  async uploadPrizeImage(
    file: File,
    prizeId: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string> {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen');
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('La imagen no debe superar los 5MB');
      }

      // Create unique filename
      const timestamp = Date.now();
      const filename = `prizes/${prizeId}-${timestamp}-${file.name}`;
      const storageRef = ref(storage, filename);

      if (onProgress) {
        // Upload with progress tracking
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        return new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot: UploadTaskSnapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              onProgress({
                progress,
                state: snapshot.state as any
              });
            },
            (error) => {
              console.error('Error uploading image:', error);
              reject(new Error('Error al subir la imagen'));
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadURL);
              } catch (error) {
                reject(new Error('Error al obtener la URL de la imagen'));
              }
            }
          );
        });
      } else {
        // Simple upload without progress
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
      }
    } catch (error) {
      console.error('Error uploading prize image:', error);
      throw error;
    }
  }

  async deletePrizeImage(imageUrl: string): Promise<void> {
    try {
      // Extract the file path from the URL
      const url = new URL(imageUrl);
      const filePath = decodeURIComponent(url.pathname.split('/o/')[1].split('?')[0]);
      
      const storageRef = ref(storage, filePath);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting prize image:', error);
      throw new Error('Error al eliminar la imagen');
    }
  }

  async uploadRaffleImage(
    file: File,
    raffleId: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string> {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen');
      }

      // Validate file size (max 10MB for raffle images)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('La imagen no debe superar los 10MB');
      }

      // Create unique filename
      const timestamp = Date.now();
      const filename = `raffles/${raffleId}-${timestamp}-${file.name}`;
      const storageRef = ref(storage, filename);

      if (onProgress) {
        // Upload with progress tracking
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        return new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot: UploadTaskSnapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              onProgress({
                progress,
                state: snapshot.state as any
              });
            },
            (error) => {
              console.error('Error uploading raffle image:', error);
              reject(new Error('Error al subir la imagen'));
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadURL);
              } catch (error) {
                reject(new Error('Error al obtener la URL de la imagen'));
              }
            }
          );
        });
      } else {
        // Simple upload without progress
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
      }
    } catch (error) {
      console.error('Error uploading raffle image:', error);
      throw error;
    }
  }

  getImagePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsDataURL(file);
    });
  }

  validateImageFile(file: File): { isValid: boolean; error?: string } {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return { isValid: false, error: 'El archivo debe ser una imagen' };
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return { isValid: false, error: 'La imagen no debe superar los 10MB' };
    }

    // Check supported formats
    const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!supportedFormats.includes(file.type)) {
      return { isValid: false, error: 'Formato no soportado. Use JPG, PNG o WebP' };
    }

    return { isValid: true };
  }
}

const storageService = new StorageService();
export default storageService;