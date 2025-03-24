import axios from 'axios';
import { Alert } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const axiosInstance = axios.create({
    // baseURL: 'http://192.168.1.144:8081', // Elige esta baseURL
    // baseURL: 'http://172.20.10.3:3000',
  baseURL: 'http://192.168.2.109:3000',

    // baseURL: 'http://172.16.41.21:3000',
});

// Interceptor para agregar el token a las solicitudes
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await getToken(); // Asume que tienes una función para obtener el token
        console.log(`Realizando petición a la IP: ${axiosInstance.defaults.baseURL}`);

        if (token && !config.url.includes('login')) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores globales
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 403) {
            showSnackbar('Sesión expirada. Por favor, inicia sesión nuevamente.');
        } else if (error.response && error.response.status === 401) {
            showSnackbar('Usuario o contraseña incorrecto.');
        }
        // else {
        //     showSnackbar('Algo salió mal. Por favor, intenta nuevamente.');
        // }
        return Promise.reject(error);
    }
);

export const setBaseURL = (newBaseURL) => {
    axiosInstance.defaults.baseURL = newBaseURL; // Actualizar la baseURL de axiosInstance
    console.log(`Base URL actualizada a: ${newBaseURL}`); // Confirmación en consola
};


export const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem('accessToken');
        if (token !== null) {
            return token;
        }
        return null;
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

const showSnackbar = (message) => {
    Alert.alert('Error', message);
};

export default axiosInstance;
