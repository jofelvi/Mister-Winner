import { Timestamp } from 'firebase/firestore';

/**
 * Convierte un timestamp de Firebase a una fecha formateada
 * @param timestamp - Timestamp de Firebase, Date, string o número
 * @returns string - Fecha formateada
 */
export const formatFirebaseDate = (
  timestamp: Timestamp | Date | string | number | null | undefined
): string => {
  if (!timestamp) return 'Fecha no disponible';

  let date: Date;

  try {
    if (timestamp instanceof Timestamp) {
      // Firebase Timestamp
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      // JavaScript Date
      date = timestamp;
    } else if (typeof timestamp === 'string') {
      // String date
      date = new Date(timestamp);
    } else if (typeof timestamp === 'number') {
      // Unix timestamp
      date = new Date(timestamp * 1000);
    } else {
      return 'Fecha no disponible';
    }

    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      return 'Fecha no disponible';
    }

    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return 'Fecha no disponible';
  }
};

/**
 * Convierte un timestamp de Firebase a una fecha y hora formateada
 * @param timestamp - Timestamp de Firebase, Date, string o número
 * @returns string - Fecha y hora formateada
 */
export const formatFirebaseDateTime = (
  timestamp: Timestamp | Date | string | number | null | undefined
): string => {
  if (!timestamp) return 'Fecha no disponible';

  let date: Date;

  try {
    if (timestamp instanceof Timestamp) {
      // Firebase Timestamp
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      // JavaScript Date
      date = timestamp;
    } else if (typeof timestamp === 'string') {
      // String date
      date = new Date(timestamp);
    } else if (typeof timestamp === 'number') {
      // Unix timestamp
      date = new Date(timestamp * 1000);
    } else {
      return 'Fecha no disponible';
    }

    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      return 'Fecha no disponible';
    }

    return date.toLocaleString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error('Error al formatear fecha y hora:', error);
    return 'Fecha no disponible';
  }
};

/**
 * Convierte un timestamp de Firebase a formato ISO string
 * @param timestamp - Timestamp de Firebase, Date, string o número
 * @returns string - Fecha en formato ISO
 */
export const formatFirebaseToISO = (
  timestamp: Timestamp | Date | string | number | null | undefined
): string => {
  if (!timestamp) return '';

  let date: Date;

  try {
    if (timestamp instanceof Timestamp) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === 'string') {
      date = new Date(timestamp);
    } else if (typeof timestamp === 'number') {
      date = new Date(timestamp * 1000);
    } else {
      return '';
    }

    if (isNaN(date.getTime())) {
      return '';
    }

    return date.toISOString();
  } catch (error) {
    console.error('Error al convertir fecha a ISO:', error);
    return '';
  }
};

/**
 * Obtiene la fecha actual en formato Timestamp de Firebase
 * @returns Timestamp - Timestamp actual
 */
export const getCurrentTimestamp = (): Timestamp => {
  return Timestamp.now();
};

/**
 * Convierte una fecha JavaScript a Timestamp de Firebase
 * @param date - Fecha JavaScript
 * @returns Timestamp - Timestamp de Firebase
 */
export const dateToFirebaseTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};