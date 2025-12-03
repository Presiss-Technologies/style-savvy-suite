import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Order, OrderItem, UrgencyLevel } from '@/types';
import { generateOrderNumber } from '@/lib/storage';
import { toast } from 'sonner';
import { ShoppingBag, Plus, Trash2, Save, Calendar } from 'lucide-react';
import { format, addDays } from 'date-fns';

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

export const OrderForm = ({ customerId, order, onSave, onCancel }: OrderFormProps) => {
  const { dispatch, getCustomerMeasurements } = useApp();
  const { t } = useLanguage();
  const measurements = getCustomerMeasurements(customerId);

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

  const addItem = () => {
    setItems([
      ...items,
      { id: uuidv4(), garmentType: 'shirt', quantity: 1, price: garmentPrices.shirt },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, updates: Partial<OrderItem>) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, ...updates };
        // Auto-update price when garment type changes
        if (updates.garmentType) {
          updated.price = garmentPrices[updates.garmentType] * urgencyMultiplier[urgency];
        }
        return updated;
      }
      return item;
    }));
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

          {items.map((item, index) => (
            <div key={item.id} className="flex gap-3 items-end p-4 bg-secondary/30 rounded-lg">
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
          ))}
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
