// models/Cita.interface.ts

export enum TipoLugar {
  DOMICILIO = 0,
  EN_SITIO = 1,
}

export interface ServicioResponseDto {
  id: number;
  nombre: string;
  costo: number;
  tiempo: number;
}

export interface CitaRequestDto {
  idPeluqueria: number;
  idCliente: string;
  servicios: ServicioResponseDto[];
  latitud: string;
  longitud: string;
  ubicacionDescripcion: string;
  tipoLugar: TipoLugar;
  inicio: string; // Using string to represent LocalTime in ISO format
  fin?: string;   // Using string to represent LocalTime in ISO format
  fecha: string;  // Using string to represent LocalDate in ISO format
}

export interface CitaResponseDto {
  id: number;
  idPeluqueria: number;
  idCliente: string;
  servicios: ServicioResponseDto[];
  fecha: string;
  inicio: string;
  fin: string;
  estado: string; // Add other properties based on the response
  nombrePeluqueria: string;
  ubicacionDescripcion: string;

}

export interface CitaEstado {
  id:number;
  estado:string;
}
