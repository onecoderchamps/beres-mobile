import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL API
const API_URL = 'https://apiberes.coderchamps.co.id/api/v1/';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 detik
});

// Ambil token dari AsyncStorage
const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('accessTokens');
    return token;
  } catch (e) {
    console.error('Error reading token from AsyncStorage:', e);
    return null;
  }
};

// Interceptor request: Tambah Authorization header
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Deteksi dan atur Content-Type
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor response: Tangani error secara global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      console.error(`Error Response [${status}]:`, data);

      switch (status) {
        case 400:
          console.error('❌ [400] Bad Request:', data?.errorMessage?.Error || 'Permintaan tidak valid');
          return Promise.reject(data?.errorMessage?.Error);
        case 401:
          console.error('🔒 [401] Unauthorized: Token tidak valid atau kadaluarsa');
          // Aksi tambahan untuk 401: misal, navigasi ke layar login
          break;
        case 403:
          console.error('🚫 [403] Forbidden: Anda tidak memiliki akses');
          break;
        case 404:
          console.error('🔍 [404] Not Found: Resource tidak ditemukan');
          break;
        case 500:
          console.error('🔥 [500] Server Error:', data?.message || 'Terjadi kesalahan pada server');
          return Promise.reject(data?.errorMessage?.Error);
        default:
          console.error(`⚠️ [${status}] Error tidak terduga:`, data?.message || 'Terjadi kesalahan');
          return Promise.reject(data?.errorMessage?.Error);
      }
    } else if (error.request) {
      console.error('⏳ Tidak ada respons dari server, periksa koneksi jaringan Anda');
    } else {
      console.error('⚠️ Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
