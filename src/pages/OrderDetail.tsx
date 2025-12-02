import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useApp } from '@/contexts/AppContext';
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

const garmentLabels = {
  shirt: 'Shirt',
  pant: 'Pant',
  kurta: 'Kurta',
  koti: 'Koti',
  waistcoat: 'Waistcoat',
};

const statusConfig = {
  pending: { label: 'Pending', variant: 'warning' as const, icon: Clock },
  'in-progress': { label: 'In Progress', variant: 'info' as const, icon: Package },
  ready: { label: 'Ready', variant: 'success' as const, icon: CheckCircle },
  delivered: { label: 'Delivered', variant: 'secondary' as const, icon: Truck },
  cancelled: { label: 'Cancelled', variant: 'destructive' as const, icon: Clock },
};

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, getCustomer, dispatch } = useApp();
  
  const order = state.orders.find(o => o.id === id);
  const customer = order ? getCustomer(order.customerId) : undefined;

  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<OrderStatus>(order?.status || 'pending');
  const [paidAmount, setPaidAmount] = useState(order?.paidAmount || 0);

  if (!order || !customer) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-display font-bold mb-2">Order Not Found</h2>
          <p className="text-muted-foreground mb-4">The order you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/orders')}>Go to Orders</Button>
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
    toast.success('Order updated');
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
          Back to Orders
        </Button>

        {/* Order Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-display font-bold">Order #{order.orderNumber}</h1>
                  <Badge variant={statusConfig[order.status].variant} className="gap-1">
                    <StatusIcon className="h-3 w-3" />
                    {statusConfig[order.status].label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Created on {format(new Date(order.createdAt), 'MMMM d, yyyy')}
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(!isEditing)}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
                <Button variant="outline" className="gap-2">
                  <Printer className="h-4 w-4" />
                  Print Invoice
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
                  Customer Details
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
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Order Items
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
                    <span>Total</span>
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
                <CardTitle className="text-lg">Order Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={status} onValueChange={(v) => setStatus(v as OrderStatus)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="ready">Ready</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Paid Amount (₹)</Label>
                      <Input
                        type="number"
                        min="0"
                        max={order.totalAmount}
                        value={paidAmount}
                        onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <Button onClick={handleUpdateOrder} variant="gold" className="w-full">
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant={statusConfig[order.status].variant}>
                        {statusConfig[order.status].label}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Delivery Date</span>
                      <span className="font-medium">
                        {format(new Date(order.deliveryDate), 'MMM d, yyyy')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Urgency</span>
                      <Badge variant={order.urgency === 'express' ? 'destructive' : order.urgency === 'urgent' ? 'warning' : 'secondary'}>
                        {order.urgency.charAt(0).toUpperCase() + order.urgency.slice(1)}
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
                  Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-semibold">₹{order.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paid</span>
                  <span className="text-success font-semibold">₹{order.paidAmount.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-medium">Balance</span>
                  <span className={`font-bold ${balance > 0 ? 'text-destructive' : 'text-success'}`}>
                    ₹{balance.toLocaleString()}
                  </span>
                </div>
                <Badge 
                  variant={order.paymentStatus === 'paid' ? 'success' : order.paymentStatus === 'partial' ? 'warning' : 'destructive'}
                  className="w-full justify-center py-1.5"
                >
                  {order.paymentStatus === 'paid' ? 'Fully Paid' : order.paymentStatus === 'partial' ? 'Partially Paid' : 'Unpaid'}
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
