export interface SharedAccount {
  totalAmount: number;
  id: number;
}

export interface PaymentPlan {
  id: number;
  estimatedBalance: number;
  initialDate: string;
  endDate: string;
  paymentPeriod: number;
}

export interface PaymentPlanItem {
  id: number;
  estimatedBalance: number;
  initialDate: string;
  endDate: string;
  paymentPeriod: number;
  accounts: AccountUser[]
}

export interface PaymentItem {
  idAccount: number;
  amount: number;
  account: AccountUser;
  date: string;
}

export interface AccountUser {
  name:string;
  lastName: string;
  idAccount:number;
}
export interface AccountPlanDetailResponse {
  accountId: number;
  balance: number;
  sharedAccount: SharedAccount | null;
  paymentPlan: PaymentPlan | null;
  paymentState: 'CRITIC' | 'NO_CRITIC';
  actualPaymentDate: string;
}

export interface Payment {
  idAccount: number;
  amount: number;
  idPaymentPlan: number;
}

export interface CreateSharedAccountRequest {
  total_amount: number;
  created_date: string;
  account1: string;
  account2: string;
}

export interface CreateSharedAccountResponse {
  sharedAccountId: number;
  totalAmount: number;
  accounts: AccountUser[];
}

export interface codeResponse {
  name:string;
  lastName: string;
  accountId:number;
}

export interface SharedAccountResponse {
  sharedAccountId: number;
  totalAmount: number;
  accounts: AccountUser[];
}

export interface AccountUser {
  idAccount: number;
  balance: number;
  name: string;
  lastname: string;
}

export interface CreatePaymentPlanRequest {
  sharedAccount: number; // ID de la cuenta compartida
  estimated_balance: number; // Saldo estimado
  initial_date: string; // Fecha de inicio (formato YYYY-MM-DD)
  end_date: string; // Fecha de finalización (formato YYYY-MM-DD)
  payment_period: number; // Período de pago en días
}

export interface CreatePaymentPlanResponse {
  idPaymentPlan: number; // ID del plan de pagos creado
  SharedAccountId: number; // ID de la cuenta compartida
  estimatedBalance: number; // Saldo estimado
  initialDate: string; // Fecha de inicio
  endDate: string; // Fecha de finalización
  paymentPeriod: number; // Período de pago en días
}
