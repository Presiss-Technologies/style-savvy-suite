import { Customer, Measurement, Order, AppState } from '@/types';

const STORAGE_KEY = 'tailor_app_data';

const defaultState: AppState = {
  customers: [],
  measurements: [],
  orders: [],
  lastSynced: null,
  isOnline: navigator.onLine,
};

export const loadState = (): AppState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
  }
  return defaultState;
};

export const saveState = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
};

export const saveCustomer = (customer: Customer): void => {
  const state = loadState();
  const existingIndex = state.customers.findIndex(c => c.id === customer.id);
  
  if (existingIndex >= 0) {
    state.customers[existingIndex] = customer;
  } else {
    state.customers.push(customer);
  }
  
  saveState(state);
};

export const deleteCustomer = (customerId: string): void => {
  const state = loadState();
  state.customers = state.customers.filter(c => c.id !== customerId);
  state.measurements = state.measurements.filter(m => m.customerId !== customerId);
  state.orders = state.orders.filter(o => o.customerId !== customerId);
  saveState(state);
};

export const saveMeasurement = (measurement: Measurement): void => {
  const state = loadState();
  const existingIndex = state.measurements.findIndex(m => m.id === measurement.id);
  
  if (existingIndex >= 0) {
    state.measurements[existingIndex] = measurement;
  } else {
    state.measurements.push(measurement);
  }
  
  saveState(state);
};

export const deleteMeasurement = (measurementId: string): void => {
  const state = loadState();
  state.measurements = state.measurements.filter(m => m.id !== measurementId);
  saveState(state);
};

export const saveOrder = (order: Order): void => {
  const state = loadState();
  const existingIndex = state.orders.findIndex(o => o.id === order.id);
  
  if (existingIndex >= 0) {
    state.orders[existingIndex] = order;
  } else {
    state.orders.push(order);
  }
  
  saveState(state);
};

export const deleteOrder = (orderId: string): void => {
  const state = loadState();
  state.orders = state.orders.filter(o => o.id !== orderId);
  saveState(state);
};

export const getCustomerByMobile = (mobile: string): Customer | undefined => {
  const state = loadState();
  return state.customers.find(c => c.mobile === mobile);
};

export const searchCustomers = (query: string): Customer[] => {
  const state = loadState();
  const lowerQuery = query.toLowerCase();
  return state.customers.filter(
    c => c.name.toLowerCase().includes(lowerQuery) || c.mobile.includes(query)
  );
};

export const getCustomerMeasurements = (customerId: string): Measurement[] => {
  const state = loadState();
  return state.measurements.filter(m => m.customerId === customerId);
};

export const getCustomerOrders = (customerId: string): Order[] => {
  const state = loadState();
  return state.orders.filter(o => o.customerId === customerId);
};

export const generateOrderNumber = (): string => {
  const state = loadState();
  const today = new Date();
  const datePrefix = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
  const todayOrders = state.orders.filter(o => o.orderNumber.startsWith(datePrefix));
  const sequence = String(todayOrders.length + 1).padStart(3, '0');
  return `${datePrefix}-${sequence}`;
};
