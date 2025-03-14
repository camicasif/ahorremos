import {Auth, AuthResponse, UserRequestDto, UserRespDto} from "../models/Auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance, {getToken} from "../config/axiosConfig";
import { AccountPlanDetailResponse } from '../models/SharedAccount';
import axios from 'axios';

const API_URL = '/api/account';

export const login = async (credentials: Auth): Promise<AuthResponse> => {
    try {
        const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
        const data: AuthResponse = response.data as AuthResponse;

        await AsyncStorage.multiSet([
            ['accessToken', data.accessToken],
            ['name', data.name],
            ['lastName', data.lastName],
            ['accountId', data.accountId]
        ]);


        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const getAccountPlanDetail = async (accountId: number): Promise<AccountPlanDetailResponse> => {
    // try {
    //     const response = await axios.get<AccountPlanDetailResponse>(`${API_URL}/${accountId}/plan-detail`);
    //     return response.data;
    // } catch (error) {
    //     console.error('Error fetching account plan details:', error);

        // Datos quemados como fallback en caso de error
        return {
            accountId: accountId,
            balance: 2500,
            sharedAccount: {
                totalAmount: 34,
                id: 23,
            },
            paymentPlan: {
                id: 5,
                estimatedBalance: 10000,
                initialDate: '2024-01-01',
                endDate: '2024-12-31',
                paymentPeriod: 30,
            },
            paymentState: 'NO_CRITIC',
            actualPaymentDate: '2024-03-15',
        };
    // }
};









































//
// // Implementación del método register
// export const register = async (userData: UserRequestDto): Promise<UserRespDto> => {
//     try {
//         const response = await axiosInstance.post<UserRespDto>('/api/v1/authUser/register', userData); // Realiza la solicitud POST al endpoint de registro
//         return response.data as UserRespDto; // Devuelve la respuesta como UserRespDto
//     } catch (error) {
//         console.error('Error al registrar usuario:', error);
//         throw error; // Lanza el error para que pueda ser manejado donde se llama a esta función
//     }
// };
// export const obtenerServiciosPeluqueria = async (id: number): Promise<PeluqueriaServiciosResponseDto> => {
//     try {
//         const response = await axiosInstance.get<PeluqueriaServiciosResponseDto>(`/api/v1/peluqueria/${id}`);
//         return response.data as PeluqueriaServiciosResponseDto;
//     } catch (error) {
//         console.error('Error al obtener los servicios de la peluquería:', error);
//         throw error;
//     }
// };
//
// export interface PeluqueriaFilterParams {
//     onSite?: boolean;
//     domicilio?: boolean;
//     nombre?: string;
//     size?: number;
//     page?: number;
// }
//
// export const filtrarPeluquerias = async (params: PeluqueriaFilterParams): Promise<Page<PeluqueriaResponseDto>> => {
//     try {
//         const response = await axiosInstance.get<Page<PeluqueriaResponseDto>>('/api/v1/peluqueria', {
//             params: {
//                 onSite: params.onSite,
//                 domicilio: params.domicilio,
//                 nombre: params.nombre,
//                 size: params.size || 5,
//                 page: params.page || 0,
//             }
//         });
//
//         return response.data as Page<PeluqueriaResponseDto>;
//     } catch (error) {
//         console.error('Error al filtrar las peluquerías:', error);
//         throw error;
//     }
// };
//
// export const crearCita = async (citaRequestDto: CitaRequestDto): Promise<CitaResponseDto> => {
//     try {
//         const response = await axiosInstance.post<CitaResponseDto>('/api/v1/cita', citaRequestDto);
//         return response.data as CitaResponseDto;
//     } catch (error) {
//         console.error('Error al crear la cita:', error);
//         throw error;
//     }
// };
//
// export const obtenerCitas = async (userId: string): Promise<CitaResponseDto[]> => {
//     try {
//         const response = await axiosInstance.get<CitaResponseDto[]>(`/api/v1/cita/user/${userId}`);
//         return response.data as CitaResponseDto[];
//     } catch (error) {
//         console.error('Error al crear la cita:', error);
//         throw error;
//     }
// };
//
// export const obtenerCitasPeluqueria = async (id: number): Promise<CitaPeluqueroResponseDto[]> => {
//     try {
//         const response = await axiosInstance.get<CitaPeluqueroResponseDto[]>(`/api/v1/cita/peluqueria/${id}`);
//         return response.data as CitaPeluqueroResponseDto[];
//     } catch (error) {
//         console.error('Error al obtener los servicios de la peluquería:', error);
//         throw error;
//     }
// };
// export const modificarCita = async (idCita: number, nuevoEstado: EnumEstado): Promise<CitaResponseDto> => {
//     console.log("id:cita: ", idCita, nuevoEstado);
//     try {
//         const response = await axiosInstance.put<CitaResponseDto>(
//             `/api/v1/cita/confirmar/${idCita}`,
//             nuevoEstado, // Send the EnumEstado value directly as the request body
//             { headers: { 'Content-Type': 'application/json' } } // Ensure JSON content type
//         );
//         return response.data as CitaResponseDto; // Return the updated appointment response
//     } catch (error) {
//         console.error('Error al modificar el estado de la cita:', error);
//         throw error; // Propagate error to be handled by the caller
//     }
// };
//
// export const calificarCita = async (idCita: number, calificacion: number): Promise<CitaResponseDto> => {
//     try {
//         const response = await axiosInstance.post<CitaResponseDto>(
//             '/api/v1/cita/puntuar',
//             null, // No request body
//             { params: { idCita, calificacion } } // Send as request parameters
//         );
//         return response.data as CitaResponseDto; // Return the rated cita response
//     } catch (error) {
//         console.error('Error al calificar la cita:', error);
//         throw error; // Propagate error to be handled by the caller
//     }
// };
//
// export const obtenerEstadoCita = async (id: string): Promise<CitaEstado> => {
//     try {
//         const response = await axiosInstance.get<CitaEstado>(`/api/v1/cita/estado/${id}`);
//         return response.data as CitaEstado;
//     } catch (error) {
//         console.error('Error al crear la cita:', error);
//         throw error;
//     }
// };
