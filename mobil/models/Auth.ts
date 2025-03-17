export interface Auth {
    email : string,
    password:string

}
export interface AuthResponse {
    name : string,
    lastName : string,

    accountId: string;
    accessToken:string

}
export enum UserRol{
    ADMIN="ADMIN",
    USER="USER",
    PELUQUERO = "PELUQUERO"
}


export interface UserRequestDto {
    name: string;
    firstName: string;
    secondName: string;
    email: string;
    address: string;
    phone: string;
    password: string;
    ci: number;
}

// Definición de UserRespDto
export interface UserRespDto {
    name: string;
    email: string;
    phone?: string; // Campo opcional
    address?: string; // Campo opcional
}
