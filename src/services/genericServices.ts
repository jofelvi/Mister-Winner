import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  limit,
  orderBy,
  startAfter,
  endBefore,
  limitToLast,
} from 'firebase/firestore';
import { db } from '@/services/firebase';

class FirestoreService<T extends { id: string }> {
  constructor(private collectionName: string) {}

  async getAll(): Promise<T[]> {
    try {
      const snapshot = await getDocs(collection(db, this.collectionName));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
    } catch (error) {
      console.error(
        `Error al obtener documentos de ${this.collectionName}:`,
        error
      );
      throw error;
    }
  }

  // Método optimizado para obtener documentos con límite y paginación
  async getPaginated(
    pageSize: number = 10,
    orderByField?: string,
    orderDirection: 'asc' | 'desc' = 'asc',
    startAfterDoc?: any
  ): Promise<T[]> {
    try {
      let q = query(collection(db, this.collectionName));
      
      if (orderByField) {
        q = query(q, orderBy(orderByField, orderDirection));
      }
      
      if (startAfterDoc) {
        q = query(q, startAfter(startAfterDoc));
      }
      
      q = query(q, limit(pageSize));
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
    } catch (error) {
      console.error(
        `Error al obtener documentos paginados de ${this.collectionName}:`,
        error
      );
      throw error;
    }
  }

  // Método optimizado para obtener documentos recientes
  async getRecent(limitCount: number = 10): Promise<T[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
    } catch (error) {
      console.error(
        `Error al obtener documentos recientes de ${this.collectionName}:`,
        error
      );
      throw error;
    }
  }

  async getById(id: string): Promise<T | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists()
        ? ({ id: docSnap.id, ...docSnap.data() } as T)
        : null;
    } catch (error) {
      console.error(
        `Error al obtener documento ${id} de ${this.collectionName}:`,
        error
      );
      throw error;
    }
  }

  async getWhere(field: string, operator: any, value: any): Promise<T[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where(field, operator, value)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
    } catch (error) {
      console.error(
        `Error al obtener documentos de ${this.collectionName} donde ${field} ${operator} ${value}:`,
        error
      );
      throw error;
    }
  }

  async create(item: Omit<T, 'id'>): Promise<T> {
    try {
      // Sanitizar los datos eliminando valores undefined
      const sanitizedItem = this.sanitizeData(item);

      const docRef = await addDoc(
        collection(db, this.collectionName),
        sanitizedItem
      );
      return { id: docRef.id, ...sanitizedItem } as T;
    } catch (error) {
      console.error(
        `Error al crear documento en ${this.collectionName}:`,
        error
      );
      throw error;
    }
  }

  async createWithId(id: string, item: Omit<T, 'id'>): Promise<T> {
    try {
      // Sanitizar los datos eliminando valores undefined
      const sanitizedItem = this.sanitizeData(item);

      const docRef = doc(db, this.collectionName, id);
      await setDoc(docRef, sanitizedItem);
      return { id, ...sanitizedItem } as T;
    } catch (error) {
      console.error(
        `Error al crear documento con ID ${id} en ${this.collectionName}:`,
        error
      );
      throw error;
    }
  }

  async update(id: string, item: Partial<Omit<T, 'id'>>): Promise<void> {
    try {
      if (!id) {
        throw new Error('ID no proporcionado para actualización');
      }

      // Sanitizar los datos eliminando valores undefined
      const sanitizedItem = this.sanitizeData(item);

      // Verificar que haya datos para actualizar
      if (Object.keys(sanitizedItem).length === 0) {
        console.warn(
          `No hay datos válidos para actualizar el documento ${id} en ${this.collectionName}`
        );
        return;
      }

      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, sanitizedItem as { [x: string]: any });
    } catch (error) {
      console.error(
        `Error al actualizar documento ${id} en ${this.collectionName}:`,
        error
      );
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(
        `Error al eliminar documento ${id} de ${this.collectionName}:`,
        error
      );
      throw error;
    }
  }

  // Método auxiliar para sanitizar datos antes de enviarlos a Firestore
  private sanitizeData<D extends Record<string, any>>(
    data: D | null | undefined
  ): Record<string, unknown> {
    if (data === null || data === undefined) {
      return {};
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sanitized: Record<string, any> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const [key, value] of Object.entries(data as Record<string, any>)) {
      // Omitir valores undefined y funciones
      if (value !== undefined && typeof value !== 'function') {
        // Convertir fechas a timestamps de Firestore si son objetos Date
        if (value instanceof Date) {
          sanitized[key] = value; // Firestore convertirá automáticamente Date a Timestamp
        }
        // Sanitizar objetos anidados
        else if (
          value !== null &&
          typeof value === 'object' &&
          !Array.isArray(value)
        ) {
          sanitized[key] = this.sanitizeData(value);
        }
        // Convertir arrays con objetos anidados
        else if (Array.isArray(value)) {
          sanitized[key] = value.map(item => {
            if (
              item !== null &&
              typeof item === 'object' &&
              !(item instanceof Date)
            ) {
              return this.sanitizeData(item);
            }
            return item;
          });
        }
        // Valores primitivos o null
        else {
          sanitized[key] = value;
        }
      }
    }

    return sanitized;
  }
}

export default FirestoreService;
export { FirestoreService };
