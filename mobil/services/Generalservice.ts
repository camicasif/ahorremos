import {Auth, AuthResponse, UserRequestDto, UserRespDto} from "../models/Auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance, {getToken} from "../config/axiosConfig";
import {
    AccountPlanDetailResponse, codeResponse, CreatePaymentPlanRequest, CreatePaymentPlanResponse,
    CreateSharedAccountRequest,
    CreateSharedAccountResponse,
    Payment, PaymentPlan, PaymentPlanItem, SharedAccountResponse,
} from '../models/SharedAccount';
import axios from 'axios';
import { PeluqueriaServiciosResponseDto } from '../models/Peluqueria.interface';
import moment from "moment";

const API_URL = '/api/account';
const ENV_URL = 'https://localhost:3000';
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

export const getAccountPlanDetail = async (accountId: string): Promise<any> => {

    if(accountId == "5327f3f3-20aa-4789-84df-15c1342f154a"){
        return {
            accountId: accountId,
            balance: 2500,
            sharedAccount: {
                totalAmount: 3000,
                id: 23,
            },
            paymentPlan: {
                id: 5,
                estimatedBalance: 10000,
                initialDate: '01-01-2025',
                endDate: '31-12-2025',
                paymentPeriod: 30,
            },
            paymentState: 'NO_CRITIC',
            actualPaymentDate: moment().add("1","M"),
        };
    }
    else{
    try {
        const response = await axiosInstance.get<any>(`/payment-plans/${accountId}`);
        console.log("URL enviada:", response.config.url);
        console.log("la respuesta es ",response)
        return response.data;
    } catch (error) {
        console.error('Error fetching account plan details:', error);
           throw error
        }
        // Datos quemados como fallback en caso de error
     
    }
};


export const abonar = async (body: Payment): Promise<any> => {
    try {
        const response = await axiosInstance.post<any>('/payment', body);
        return response.data ;
    } catch (error) {
        console.error('Error al crear la cita:', error);
        throw error;
    }
};



export const generateCode = async (accountId: string): Promise<string> => {
    try {
        const response = await axiosInstance.get<string>(`/accounts/code/${accountId}`);
        return response.data;
    } catch (error) {
        console.error('Error generating code:', error);
        throw error;
    }
};

export const getInfoCode = async (code: string): Promise<codeResponse> => {
    try {
        const response = await axiosInstance.get<codeResponse>(`/accounts/info/${code}`);
        return response.data;
    } catch (error) {
        console.error('Error generating code:', error);
        throw error;
    }
};

export const createSharedAccount = async (
  body: CreateSharedAccountRequest
): Promise<CreateSharedAccountResponse> => {
    try {
        const response = await axiosInstance.post<CreateSharedAccountResponse>('/shared-accounts', body);
        return response.data;
    } catch (error) {
        console.error('Error creating shared account:', error);
        throw error;
    }
};



/**
 * Obtiene la información de una cuenta compartida.
 * @param id - El ID de la cuenta compartida.
 * @returns La información de la cuenta compartida.
 */
export const getSharedAccount = async (id: string): Promise<SharedAccountResponse> => {
    try {
        const response = await axiosInstance.get<SharedAccountResponse>(`/shared-accounts/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error obteniendo la cuenta compartida:", error);
        throw error;
    }
};

/**
 * Crea un plan de pagos.
 * @param body - El cuerpo de la solicitud para crear el plan de pagos.
 * @returns La respuesta del servidor.
 */
export const createPaymentPlan = async (body: {
    end_date: string;
    payment_period: number;
    initial_date: string;
    sharedAccount: number;
    estimated_balance: string
}): Promise<CreatePaymentPlanResponse> => {
    try {
        const response = await axiosInstance.post<CreatePaymentPlanResponse>("/payment-plans", body);
        return response.data;
    } catch (error) {
        console.error("Error creando el plan de pagos:", error);
        throw error;
    }
};




/**
 * Obtiene los planes de pago de una cuenta específica
 * @param idAccount - ID de la cuenta (UUID)
 * @returns Lista de planes de pago asociados a la cuenta
 */
export const getPaymentPlansByAccount = async (idAccount: string): Promise<PaymentPlanItem[]> => {
    try {
        const response = await axiosInstance.get<PaymentPlanItem[]>(`/payment-plans/${idAccount}`);
        return response.data;
    } catch (error) {
        console.error("Error obteniendo planes de pago:", error);
        throw error;
    }
};

export const getPaymentsByAccount = async (idAccount: string): Promise<PaymentItem[]> => {
    try {
        const response = await axiosInstance.get<PaymentItem[]>(`/payments/account/${idAccount}`);
        return response.data;
    } catch (error) {
        console.error("Error obteniendo planes de pago:", error);
        throw error;
    }
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
export const obtenerServiciosPeluqueria = async (id: number): Promise<PeluqueriaServiciosResponseDto> => {
    try {
        const response = await axiosInstance.get<PeluqueriaServiciosResponseDto>(`/api/v1/peluqueria/${id}`);
        return response.data as PeluqueriaServiciosResponseDto;
    } catch (error) {
        console.error('Error al obtener los servicios de la peluquería:', error);
        throw error;
    }
};
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
