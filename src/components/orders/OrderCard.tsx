import { Order, Customer } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Package, Calendar, IndianRupee, Edit, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OrderCardProps {
  order: Order;
  customer?: Customer;
  onEdit?: () => void;
  showCustomer?: boolean;
}

const statusConfig = {
  pending: { label: 'Pending', variant: 'warning' as const },
  'in-progress': { label: 'In Progress', variant: 'info' as const },
  ready: { label: 'Ready', variant: 'success' as const },
  delivered: { label: 'Delivered', variant: 'secondary' as const },
  cancelled: { label: 'Cancelled', variant: 'destructive' as const },
};

const paymentConfig = {
  unpaid: { label: 'Unpaid', variant: 'destructive' as const },
  partial: { label: 'Partial', variant: 'warning' as const },
  paid: { label: 'Paid', variant: 'success' as const },
};

const garmentLabels = {
  shirt: 'Shirt',
  pant: 'Pant',
  kurta: 'Kurta',
  koti: 'Koti',
  waistcoat: 'Waistcoat',
};

export const OrderCard = ({ order, customer, onEdit, showCustomer = false }: OrderCardProps) => {
  const navigate = useNavigate();
  const status = statusConfig[order.status];
  const payment = paymentConfig[order.paymentStatus];
  const balance = order.totalAmount - order.paidAmount;

  const itemsSummary = order.items
    .map(item => `${item.quantity}x ${garmentLabels[item.garmentType]}`)
    .join(', ');

  return (
    <Card className="hover:shadow-lift transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono font-semibold text-primary">#{order.orderNumber}</span>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
            {showCustomer && customer && (
              <p className="text-sm text-muted-foreground">{customer.name}</p>
            )}
          </div>
          <Badge variant={payment.variant}>{payment.label}</Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{itemsSummary}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Delivery: {format(new Date(order.deliveryDate), 'MMM d, yyyy')}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
            <span>
              <span className="font-semibold">₹{order.totalAmount.toLocaleString()}</span>
              {balance > 0 && (
                <span className="text-muted-foreground ml-2">
                  (Balance: ₹{balance.toLocaleString()})
                </span>
              )}
            </span>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(`/orders/${order.id}`)}
            className="gap-1.5"
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </Button>
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit} className="gap-1.5">
              <Edit className="h-3.5 w-3.5" />
              Edit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
