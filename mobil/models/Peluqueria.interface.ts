export interface Servicio {
    id: number;
    nombre: string;
    costo: number;
    tiempo: number;
}

export interface Disponibilidad {
    dia: string;
    inicio:string;
    fin:string;
}

export interface PeluqueriaServiciosResponseDto {
    ubicacionDescripcion:string;
    servicios: Servicio[];
    disponibilidad: Disponibilidad[];
}

export interface Page<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number; // Current page number
    numberOfElements: number;
    first: boolean;
    last: boolean;
}

export interface PeluqueriaResponseDto {
    puntuacion: number;   // Representa la puntuación de la peluquería
    id: number;           // ID único de la peluquería
    nombre: string;       // Nombre de la peluquería
    descripcion: string;  // Descripción de la peluquería
    imagen: string;       // Imagen codificada en base64
    longitud: string;     // Longitud para la ubicación de la peluquería
    latitud: string;      // Latitud para la ubicación de la peluquería
}
export enum TipoLugar {
    Domicilio = "Domicilio",
    onSite = "onSite"
}

// Definición del Enum de Estado
export enum EnumEstado {
    PENDIENTE = "PENDIENTE",
    CONFIRMADA = "CONFIRMADA",
    RECHAZADA = "RECHAZADA",
    COMPLETADA = "COMPLETADA"
}

// Definimos la interfaz para ServicioResponseDto
export interface ServicioResponseDto {
    id: number;
    nombre: string;
    costo: string;
    tiempo: string;
}
// Definimos la interfaz principal para CitaPeluqueroResponseDto
export interface CitaPeluqueroResponseDto {
    idCita: number;
    idPeluqueria: number;
    idCliente: string; // UUID se representa como string en TypeScript
    nombreCompletoCliente: string;
    celular: string;
    servicios: ServicioResponseDto[];
    latitud: string;
    longitud: string;
    ubicacionDescripcion: string;
    tipoLugar: TipoLugar;
    inicio: string; // LocalTime se maneja como string en TypeScript
    fin: string; // LocalTime se maneja como string en TypeScript
    fecha: string; // LocalDate se maneja como string en TypeScript
    estado: EnumEstado;
}

export default CitaPeluqueroResponseDto;
