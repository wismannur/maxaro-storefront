// shared/types/checkout.ts
export type PaymentMethodId = 'ideal' | 'bancontact' | 'in3' | 'klarna' | 'creditcard' | 'applepay';

export interface DutchBankOption {
  id: string;
  name: string;
  shortName: string;
  badgeColor: string;
  popular?: boolean;
}

export const DUTCH_BANKS: DutchBankOption[] = [
  { id: 'rabobank', name: 'Rabobank', shortName: 'RABO', badgeColor: '#000066', popular: true },
  { id: 'ing', name: 'ING Bank', shortName: 'ING', badgeColor: '#FF6200', popular: true },
  { id: 'abnamro', name: 'ABN AMRO', shortName: 'ABN', badgeColor: '#009286', popular: true },
  { id: 'sns', name: 'SNS Bank', shortName: 'SNS', badgeColor: '#E60000', popular: true },
  { id: 'asnbank', name: 'ASN Bank', shortName: 'ASN', badgeColor: '#B2002D' },
  { id: 'regiobank', name: 'RegioBank', shortName: 'REGIO', badgeColor: '#DE1C24' },
  { id: 'knab', name: 'Knab', shortName: 'KNAB', badgeColor: '#78BE20' },
  { id: 'bunq', name: 'bunq', shortName: 'BUNQ', badgeColor: '#0085FF' },
];

export type DeliveryMethodId = 'express' | 'scheduled' | 'pickup';

export interface DeliveryOption {
  id: DeliveryMethodId;
  title: string;
  subtitle: string;
  badge: string;
  cost: number;
}

export interface In3Installment {
  termNumber: number;
  dueDateLabel: string;
  amount: number;
  percentage: number;
}

export interface ConfirmedOrderDetails {
  orderNumber: string;
  trackingCode: string;
  paymentMethod: PaymentMethodId;
  bankName?: string;
  deliveryMethod: DeliveryMethodId;
  deliveryDateLabel: string;
  totalPaid: number;
  itemCount: number;
  in3Installments?: In3Installment[];
  confirmedAt: string;
}
