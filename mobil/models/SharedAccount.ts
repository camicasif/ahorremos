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

export interface AccountPlanDetailResponse {
  accountId: number;
  balance: number;
  sharedAccount: SharedAccount | null;
  paymentPlan: PaymentPlan | null;
  paymentState: 'CRITIC' | 'NO_CRITIC';
  actualPaymentDate: string;
}
