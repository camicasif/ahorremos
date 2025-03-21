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

