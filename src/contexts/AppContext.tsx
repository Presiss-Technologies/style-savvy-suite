import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, Customer, Measurement, Order } from '@/types';
import { loadState, saveState } from '@/lib/storage';

type Action =
  | { type: 'SET_CUSTOMERS'; payload: Customer[] }
  | { type: 'ADD_CUSTOMER'; payload: Customer }
  | { type: 'UPDATE_CUSTOMER'; payload: Customer }
  | { type: 'DELETE_CUSTOMER'; payload: string }
  | { type: 'SET_MEASUREMENTS'; payload: Measurement[] }
  | { type: 'ADD_MEASUREMENT'; payload: Measurement }
  | { type: 'UPDATE_MEASUREMENT'; payload: Measurement }
  | { type: 'DELETE_MEASUREMENT'; payload: string }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER'; payload: Order }
  | { type: 'DELETE_ORDER'; payload: string }
  | { type: 'SET_ONLINE'; payload: boolean }
  | { type: 'SET_SYNCED'; payload: string };

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_CUSTOMERS':
      return { ...state, customers: action.payload };
    case 'ADD_CUSTOMER':
      return { ...state, customers: [...state.customers, action.payload] };
    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.map(c =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case 'DELETE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.filter(c => c.id !== action.payload),
        measurements: state.measurements.filter(m => m.customerId !== action.payload),
        orders: state.orders.filter(o => o.customerId !== action.payload),
      };
    case 'SET_MEASUREMENTS':
      return { ...state, measurements: action.payload };
    case 'ADD_MEASUREMENT':
      return { ...state, measurements: [...state.measurements, action.payload] };
    case 'UPDATE_MEASUREMENT':
      return {
        ...state,
        measurements: state.measurements.map(m =>
          m.id === action.payload.id ? action.payload : m
        ),
      };
    case 'DELETE_MEASUREMENT':
      return {
        ...state,
        measurements: state.measurements.filter(m => m.id !== action.payload),
      };
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    case 'ADD_ORDER':
      return { ...state, orders: [...state.orders, action.payload] };
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(o =>
          o.id === action.payload.id ? action.payload : o
        ),
      };
    case 'DELETE_ORDER':
      return {
        ...state,
        orders: state.orders.filter(o => o.id !== action.payload),
      };
    case 'SET_ONLINE':
      return { ...state, isOnline: action.payload };
    case 'SET_SYNCED':
      return { ...state, lastSynced: action.payload };
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  getCustomer: (id: string) => Customer | undefined;
  getCustomerMeasurements: (customerId: string) => Measurement[];
  getCustomerOrders: (customerId: string) => Order[];
  searchCustomers: (query: string) => Customer[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, loadState());

  // Persist to localStorage on every state change
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SET_ONLINE', payload: true });
    const handleOffline = () => dispatch({ type: 'SET_ONLINE', payload: false });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getCustomer = (id: string) => state.customers.find(c => c.id === id);

  const getCustomerMeasurements = (customerId: string) =>
    state.measurements.filter(m => m.customerId === customerId);

  const getCustomerOrders = (customerId: string) =>
    state.orders.filter(o => o.customerId === customerId);

  const searchCustomers = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return state.customers.filter(
      c => c.name.toLowerCase().includes(lowerQuery) || c.mobile.includes(query)
    );
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        getCustomer,
        getCustomerMeasurements,
        getCustomerOrders,
        searchCustomers,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
