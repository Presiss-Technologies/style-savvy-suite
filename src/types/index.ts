export type CustomerTag = 'VIP' | 'Regular' | 'Walk-in';

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  address?: string;
  tag: CustomerTag;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShirtMeasurement {
  length: number;
  chest: number;
  waist: number;
  shoulder: number;
  sleeveLength: number;
  sleeveOpening: number;
  collar: number;
  armHole: number;
  cuffSize?: number;
  frontChest?: number;
  backWidth?: number;
}

export interface PantMeasurement {
  length: number;
  waist: number;
  hip: number;
  thigh: number;
  knee: number;
  bottom: number;
  crotch: number;
  rise?: number;
  inseam?: number;
}

export interface KurtaMeasurement {
  length: number;
  chest: number;
  waist: number;
  shoulder: number;
  sleeveLength: number;
  sleeveOpening: number;
  collar: number;
  armHole: number;
  slit?: number;
  daaman?: number;
}

export interface KotiMeasurement {
  length: number;
  chest: number;
  waist: number;
  shoulder: number;
  armHole: number;
  frontOpening?: number;
  backWidth?: number;
}

export interface WaistcoatMeasurement {
  length: number;
  chest: number;
  waist: number;
  shoulder: number;
  armHole: number;
  frontLength?: number;
  backLength?: number;
}

export type MeasurementData = {
  shirt?: ShirtMeasurement;
  pant?: PantMeasurement;
  kurta?: KurtaMeasurement;
  koti?: KotiMeasurement;
  waistcoat?: WaistcoatMeasurement;
};

export interface Measurement {
  id: string;
  customerId: string;
  type: 'shirt' | 'pant' | 'kurta' | 'koti' | 'waistcoat';
  data: ShirtMeasurement | PantMeasurement | KurtaMeasurement | KotiMeasurement | WaistcoatMeasurement;
  notes?: string;
  referenceImage?: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'pending' | 'cutting' | 'stitching' | 'trial' | 'ready' | 'delivered' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid';
export type UrgencyLevel = 'normal' | 'urgent' | 'express';

export interface OrderItem {
  id: string;
  garmentType: 'shirt' | 'pant' | 'kurta' | 'koti' | 'waistcoat';
  measurementId?: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  paidAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  urgency: UrgencyLevel;
  deliveryDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppState {
  customers: Customer[];
  measurements: Measurement[];
  orders: Order[];
  lastSynced: string | null;
  isOnline: boolean;
}
