import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Order, OrderItem, UrgencyLevel, ShirtMeasurement, PantMeasurement, KurtaMeasurement, KotiMeasurement, WaistcoatMeasurement, MeasurementData } from '@/types';
import { generateOrderNumber } from '@/lib/storage';
import { toast } from 'sonner';
import { ShoppingBag, Plus, Trash2, Save, Calendar } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { InlineMeasurementFields } from './InlineMeasurementFields';

interface OrderFormProps {
  customerId: string;
  order?: Order;
  onSave?: () => void;
  onCancel?: () => void;
}

const garmentPrices = {
  shirt: 800,
  pant: 600,
  kurta: 1200,
  koti: 1500,
  waistcoat: 1800,
};

const urgencyMultiplier = {
  normal: 1,
  urgent: 1.25,
  express: 1.5,
};

const defaultDeliveryDays = {
  normal: 7,
  urgent: 3,
  express: 1,
};

const defaultShirt: ShirtMeasurement = {
  length: 0, chest: 0, waist: 0, shoulder: 0, sleeveLength: 0,
  sleeveOpening: 0, collar: 0, armHole: 0
};

const defaultPant: PantMeasurement = {
  length: 0, waist: 0, hip: 0, thigh: 0, knee: 0,
  bottom: 0, crotch: 0
};

const defaultKurta: KurtaMeasurement = {
  length: 0, chest: 0, waist: 0, shoulder: 0, sleeveLength: 0,
  sleeveOpening: 0, collar: 0, armHole: 0
};

const defaultKoti: KotiMeasurement = {
  length: 0, chest: 0, waist: 0, shoulder: 0, armHole: 0
};

const defaultWaistcoat: WaistcoatMeasurement = {
  length: 0, chest: 0, waist: 0, shoulder: 0, armHole: 0
};

type GarmentType = 'shirt' | 'pant' | 'kurta' | 'koti' | 'waistcoat';

const getDefaultMeasurement = (type: GarmentType) => {
  switch (type) {
    case 'shirt': return { ...defaultShirt };
    case 'pant': return { ...defaultPant };
    case 'kurta': return { ...defaultKurta };
    case 'koti': return { ...defaultKoti };
    case 'waistcoat': return { ...defaultWaistcoat };
  }
};

export const OrderForm = ({ customerId, order, onSave, onCancel }: OrderFormProps) => {
  const { dispatch, getCustomerMeasurements } = useApp();
  const { t } = useLanguage();
  const existingMeasurements = getCustomerMeasurements(customerId);

  const [items, setItems] = useState<OrderItem[]>(
    order?.items || [
      { id: uuidv4(), garmentType: 'shirt', quantity: 1, price: garmentPrices.shirt },
    ]
  );
  const [urgency, setUrgency] = useState<UrgencyLevel>(order?.urgency || 'normal');
  const [deliveryDate, setDeliveryDate] = useState(
    order?.deliveryDate || format(addDays(new Date(), defaultDeliveryDays.normal), 'yyyy-MM-dd')
  );
  const [paidAmount, setPaidAmount] = useState(order?.paidAmount || 0);
  const [notes, setNotes] = useState(order?.notes || '');

  // Track measurements for each garment type in the order
  const [orderMeasurements, setOrderMeasurements] = useState<MeasurementData>(() => {
    const initial: MeasurementData = {};
    const garmentTypes = new Set((order?.items || [{ garmentType: 'shirt' }]).map(i => i.garmentType));
    
    garmentTypes.forEach(type => {
      const existing = existingMeasurements.find(m => m.type === type);
      if (existing) {
        initial[type] = existing.data as any;
      } else {
        initial[type] = getDefaultMeasurement(type);
      }
    });
    
    return initial;
  });

  // Get unique garment types in order
  const getUniqueGarmentTypes = (): GarmentType[] => {
    const types = new Set<GarmentType>();
    items.forEach(item => types.add(item.garmentType));
    return Array.from(types);
  };

  // Find last item index for each garment type
  const getLastItemIndexForType = (type: GarmentType): number => {
    for (let i = items.length - 1; i >= 0; i--) {
      if (items[i].garmentType === type) return i;
    }
    return -1;
  };

  const addItem = () => {
    const newItem: OrderItem = { 
      id: uuidv4(), 
      garmentType: 'shirt', 
      quantity: 1, 
      price: garmentPrices.shirt 
    };
    setItems([...items, newItem]);
    
    // Add measurement data if not exists
    if (!orderMeasurements.shirt) {
      const existing = existingMeasurements.find(m => m.type === 'shirt');
      setOrderMeasurements(prev => ({
        ...prev,
        shirt: existing ? existing.data as ShirtMeasurement : { ...defaultShirt }
      }));
    }
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      const itemToRemove = items.find(item => item.id === id);
      const newItems = items.filter(item => item.id !== id);
      setItems(newItems);
      
      // Clean up measurement if no more items of that type
      if (itemToRemove) {
        const stillHasType = newItems.some(item => item.garmentType === itemToRemove.garmentType);
        if (!stillHasType) {
          setOrderMeasurements(prev => {
            const updated = { ...prev };
            delete updated[itemToRemove.garmentType];
            return updated;
          });
        }
      }
    }
  };

  const updateItem = (id: string, updates: Partial<OrderItem>) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, ...updates };
        // Auto-update price when garment type changes
        if (updates.garmentType) {
          updated.price = garmentPrices[updates.garmentType] * urgencyMultiplier[urgency];
          
          // Add measurement data for new garment type if not exists
          if (!orderMeasurements[updates.garmentType]) {
            const existing = existingMeasurements.find(m => m.type === updates.garmentType);
            const newMeasurement = existing ? existing.data : getDefaultMeasurement(updates.garmentType!);
            setOrderMeasurements(prev => ({
              ...prev,
              [updates.garmentType!]: newMeasurement
            } as MeasurementData));
          }
        }
        return updated;
      }
      return item;
    }));
  };

  const updateMeasurement = (type: GarmentType, data: any) => {
    setOrderMeasurements(prev => ({
      ...prev,
      [type]: data
    }));
  };

  const copyPreviousMeasurement = (type: GarmentType) => {
    const existing = existingMeasurements.find(m => m.type === type);
    if (existing) {
      setOrderMeasurements(prev => ({
        ...prev,
        [type]: existing.data
      }));
      toast.success(t('measurementForm.copiedSuccess'));
    }
  };

  const handleUrgencyChange = (newUrgency: UrgencyLevel) => {
    setUrgency(newUrgency);
    // Update prices based on urgency
    setItems(items.map(item => ({
      ...item,
      price: garmentPrices[item.garmentType] * urgencyMultiplier[newUrgency],
    })));
    // Update delivery date
    setDeliveryDate(format(addDays(new Date(), defaultDeliveryDays[newUrgency]), 'yyyy-MM-dd'));
  };

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = () => {
    if (items.length === 0) {
      toast.error(t('orderForm.itemError'));
      return;
    }

    const now = new Date().toISOString();
    const paymentStatus = paidAmount >= totalAmount ? 'paid' : paidAmount > 0 ? 'partial' : 'unpaid';

    // Save measurements for each garment type
    const uniqueTypes = getUniqueGarmentTypes();
    uniqueTypes.forEach(type => {
      const measurementData = orderMeasurements[type];
      if (measurementData) {
        const existingMeasurement = existingMeasurements.find(m => m.type === type);
        const measurement = {
          id: existingMeasurement?.id || uuidv4(),
          customerId,
          type,
          data: measurementData,
          createdAt: existingMeasurement?.createdAt || now,
          updatedAt: now,
        };
        
        if (existingMeasurement) {
          dispatch({ type: 'UPDATE_MEASUREMENT', payload: measurement });
        } else {
          dispatch({ type: 'ADD_MEASUREMENT', payload: measurement });
        }
      }
    });

    const savedOrder: Order = {
      id: order?.id || uuidv4(),
      orderNumber: order?.orderNumber || generateOrderNumber(),
      customerId,
      items,
      totalAmount,
      paidAmount,
      status: order?.status || 'pending',
      paymentStatus,
      urgency,
      deliveryDate,
      notes: notes.trim() || undefined,
      createdAt: order?.createdAt || now,
      updatedAt: now,
    };

    if (order) {
      dispatch({ type: 'UPDATE_ORDER', payload: savedOrder });
      toast.success(t('orderForm.updatedSuccess'));
    } else {
      dispatch({ type: 'ADD_ORDER', payload: savedOrder });
      toast.success(t('orderForm.createdSuccess').replace('{number}', savedOrder.orderNumber));
    }

    onSave?.();
  };

  return (
    <Card className="animate-slide-up">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShoppingBag className="h-5 w-5 text-primary" />
          {order ? t('orderForm.editOrder') : t('orderForm.newOrder')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">{t('orderForm.orderItems')}</Label>
            <Button variant="outline" size="sm" onClick={addItem} className="gap-1.5">
              <Plus className="h-4 w-4" />
              {t('orderForm.addItem')}
            </Button>
          </div>

          {items.map((item, index) => {
            const isLastOfType = getLastItemIndexForType(item.garmentType) === index;
            const existingMeasurement = existingMeasurements.find(m => m.type === item.garmentType);
            
            return (
              <div key={item.id}>
                <div className="flex gap-3 items-end p-4 bg-secondary/30 rounded-lg">
                  <div className="flex-1 space-y-2">
                    <Label className="text-xs">{t('orderForm.garmentType')}</Label>
                    <Select
                      value={item.garmentType}
                      onValueChange={(value) => updateItem(item.id, { garmentType: value as OrderItem['garmentType'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shirt">{t('orderForm.shirt')}</SelectItem>
                        <SelectItem value="pant">{t('orderForm.pant')}</SelectItem>
                        <SelectItem value="kurta">{t('orderForm.kurta')}</SelectItem>
                        <SelectItem value="koti">{t('orderForm.koti')}</SelectItem>
                        <SelectItem value="waistcoat">{t('orderForm.waistcoat')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-20 space-y-2">
                    <Label className="text-xs">{t('orderForm.qty')}</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, { quantity: parseInt(e.target.value) || 1 })}
                    />
                  </div>

                  <div className="w-28 space-y-2">
                    <Label className="text-xs">{t('orderForm.price')} (₹)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, { price: parseFloat(e.target.value) || 0 })}
                    />
                  </div>

                  {items.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Show measurement fields below the last item of each garment type */}
                {isLastOfType && orderMeasurements[item.garmentType] && (
                  <InlineMeasurementFields
                    garmentType={item.garmentType}
                    data={orderMeasurements[item.garmentType]!}
                    onChange={(data) => updateMeasurement(item.garmentType, data)}
                    existingMeasurement={existingMeasurement}
                    onCopyPrevious={existingMeasurement ? () => copyPreviousMeasurement(item.garmentType) : undefined}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Urgency & Delivery */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{t('orderForm.urgencyLevel')}</Label>
            <Select value={urgency} onValueChange={(v) => handleUrgencyChange(v as UrgencyLevel)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">{t('orderForm.normal7days')}</SelectItem>
                <SelectItem value="urgent">{t('orderForm.urgent3days')}</SelectItem>
                <SelectItem value="express">{t('orderForm.express1day')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t('orderForm.deliveryDate')}</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{t('orderForm.totalAmount')}</Label>
            <div className="h-10 px-3 flex items-center bg-primary/10 rounded-lg font-semibold text-lg">
              ₹{totalAmount.toLocaleString()}
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('orderForm.advancePayment')} (₹)</Label>
            <Input
              type="number"
              min="0"
              max={totalAmount}
              value={paidAmount}
              onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t('orderForm.orderNotes')}</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('orderForm.notesPlaceholder')}
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-3">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              {t('orderForm.cancel')}
            </Button>
          )}
          <Button onClick={handleSubmit} variant="gold" className="gap-2">
            <Save className="h-4 w-4" />
            {order ? t('orderForm.updateOrder') : t('orderForm.createOrder')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
