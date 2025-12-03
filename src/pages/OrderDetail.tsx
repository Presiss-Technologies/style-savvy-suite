import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  ArrowLeft, User, Phone, Package, Calendar, IndianRupee, 
  Edit, Printer, CheckCircle, Clock, Truck
} from 'lucide-react';
import { format } from 'date-fns';
import { Order, OrderStatus, PaymentStatus } from '@/types';

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, getCustomer, dispatch } = useApp();
  const { t } = useLanguage();
  
  const order = state.orders.find(o => o.id === id);
  const customer = order ? getCustomer(order.customerId) : undefined;

  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<OrderStatus>(order?.status || 'pending');
  const [paidAmount, setPaidAmount] = useState(order?.paidAmount || 0);

  const garmentLabels: Record<string, string> = {
    shirt: t('orderForm.shirt'),
    pant: t('orderForm.pant'),
    kurta: t('orderForm.kurta'),
    koti: t('orderForm.koti'),
    waistcoat: t('orderForm.waistcoat'),
  };

  const statusConfig: Record<string, { label: string; variant: 'warning' | 'info' | 'success' | 'secondary' | 'destructive'; icon: typeof Clock }> = {
    pending: { label: t('orders.pending'), variant: 'warning', icon: Clock },
    'in-progress': { label: t('orders.inProgress'), variant: 'info', icon: Package },
    ready: { label: t('orders.ready'), variant: 'success', icon: CheckCircle },
    delivered: { label: t('orders.delivered'), variant: 'secondary', icon: Truck },
    cancelled: { label: t('orders.cancelled'), variant: 'destructive', icon: Clock },
  };

  if (!order || !customer) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-display font-bold mb-2">{t('orderDetail.notFound')}</h2>
          <p className="text-muted-foreground mb-4">{t('orderDetail.notFoundDesc')}</p>
          <Button onClick={() => navigate('/orders')}>{t('orderDetail.goToOrders')}</Button>
        </div>
      </Layout>
    );
  }

  const handleUpdateOrder = () => {
    const paymentStatus: PaymentStatus = 
      paidAmount >= order.totalAmount ? 'paid' : 
      paidAmount > 0 ? 'partial' : 'unpaid';

    const updatedOrder: Order = {
      ...order,
      status,
      paidAmount,
      paymentStatus,
      updatedAt: new Date().toISOString(),
    };

    dispatch({ type: 'UPDATE_ORDER', payload: updatedOrder });
    toast.success(t('orderDetail.orderUpdated'));
    setIsEditing(false);
  };

  const balance = order.totalAmount - order.paidAmount;
  const StatusIcon = statusConfig[order.status].icon;

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/orders')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('orderDetail.back')}
        </Button>

        {/* Order Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-display font-bold">{t('orderDetail.order')} #{order.orderNumber}</h1>
                  <Badge variant={statusConfig[order.status].variant} className="gap-1">
                    <StatusIcon className="h-3 w-3" />
                    {statusConfig[order.status].label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('orderDetail.createdOn')} {format(new Date(order.createdAt), 'MMMM d, yyyy')}
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(!isEditing)}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  {isEditing ? t('orderDetail.cancel') : t('orderDetail.edit')}
                </Button>
                <Button variant="outline" className="gap-2">
                  <Printer className="h-4 w-4" />
                  {t('orderDetail.printInvoice')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  {t('orderDetail.customerDetails')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{customer.name}</p>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" />
                      {customer.mobile}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate(`/customers/${customer.id}`)}
                    className="ml-auto"
                  >
                    {t('orderDetail.viewProfile')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  {t('orderDetail.orderItems')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div 
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                          {item.quantity}x
                        </span>
                        <span className="font-medium">{garmentLabels[item.garmentType]}</span>
                      </div>
                      <span className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>{t('orderDetail.total')}</span>
                    <span>₹{order.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {order.notes && (
                  <div className="mt-4 p-3 bg-accent rounded-lg">
                    <p className="text-sm">{order.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Status & Payment */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{t('orderDetail.orderStatus')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label>{t('orderDetail.status')}</Label>
                      <Select value={status} onValueChange={(v) => setStatus(v as OrderStatus)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">{t('orders.pending')}</SelectItem>
                          <SelectItem value="in-progress">{t('orders.inProgress')}</SelectItem>
                          <SelectItem value="ready">{t('orders.ready')}</SelectItem>
                          <SelectItem value="delivered">{t('orders.delivered')}</SelectItem>
                          <SelectItem value="cancelled">{t('orders.cancelled')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>{t('orderDetail.paidAmount')} (₹)</Label>
                      <Input
                        type="number"
                        min="0"
                        max={order.totalAmount}
                        value={paidAmount}
                        onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <Button onClick={handleUpdateOrder} variant="gold" className="w-full">
                      {t('orderDetail.saveChanges')}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{t('orderDetail.status')}</span>
                      <Badge variant={statusConfig[order.status].variant}>
                        {statusConfig[order.status].label}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{t('orderDetail.deliveryDate')}</span>
                      <span className="font-medium">
                        {format(new Date(order.deliveryDate), 'MMM d, yyyy')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{t('orderDetail.urgency')}</span>
                      <Badge variant={order.urgency === 'express' ? 'destructive' : order.urgency === 'urgent' ? 'warning' : 'secondary'}>
                        {order.urgency === 'normal' ? t('orderDetail.normal') : order.urgency === 'urgent' ? t('orderDetail.urgent') : t('orderDetail.express')}
                      </Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Payment Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-primary" />
                  {t('orderDetail.payment')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('orderDetail.total')}</span>
                  <span className="font-semibold">₹{order.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('orders.paid')}</span>
                  <span className="text-success font-semibold">₹{order.paidAmount.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-medium">{t('orderDetail.balance')}</span>
                  <span className={`font-bold ${balance > 0 ? 'text-destructive' : 'text-success'}`}>
                    ₹{balance.toLocaleString()}
                  </span>
                </div>
                <Badge 
                  variant={order.paymentStatus === 'paid' ? 'success' : order.paymentStatus === 'partial' ? 'warning' : 'destructive'}
                  className="w-full justify-center py-1.5"
                >
                  {order.paymentStatus === 'paid' ? t('orderDetail.fullyPaid') : order.paymentStatus === 'partial' ? t('orderDetail.partiallyPaid') : t('orders.unpaid')}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetail;
