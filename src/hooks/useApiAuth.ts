import { useAuth } from './useAuth';
import authService from '@/services/authService';

interface ApiOptions extends RequestInit {
  requireAuth?: boolean;
}

export function useApiAuth() {
  const { user } = useAuth();

  const apiCall = async (url: string, options: ApiOptions = {}) => {
    const { requireAuth = true, headers = {}, ...restOptions } = options;

    if (requireAuth && !user) {
      throw new Error('Authentication required');
    }

    let authHeaders = {};
    if (requireAuth && user) {
      try {
        const token = await authService.getIdToken();
        if (token) {
          authHeaders = {
            'Authorization': `Bearer ${token}`
          };
        }
      } catch (error) {
        console.error('Failed to get auth token:', error);
        throw new Error('Authentication failed');
      }
    }

    const response = await fetch(url, {
      ...restOptions,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...authHeaders,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  const get = (url: string, options?: Omit<ApiOptions, 'method'>) =>
    apiCall(url, { ...options, method: 'GET' });

  const post = (url: string, data?: any, options?: Omit<ApiOptions, 'method' | 'body'>) =>
    apiCall(url, { ...options, method: 'POST', body: JSON.stringify(data) });

  const put = (url: string, data?: any, options?: Omit<ApiOptions, 'method' | 'body'>) =>
    apiCall(url, { ...options, method: 'PUT', body: JSON.stringify(data) });

  const del = (url: string, options?: Omit<ApiOptions, 'method'>) =>
    apiCall(url, { ...options, method: 'DELETE' });

  return {
    get,
    post,
    put,
    delete: del,
    apiCall,
  };
}