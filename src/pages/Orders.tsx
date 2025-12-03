import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OrderCard } from '@/components/orders/OrderCard';
import { Search, ShoppingBag } from 'lucide-react';
import { OrderStatus, PaymentStatus } from '@/types';

const Orders = () => {
  const navigate = useNavigate();
  const { state, getCustomer } = useApp();
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'all'>('all');

  const filteredOrders = state.orders
    .filter(order => {
      const customer = getCustomer(order.customerId);
      const matchesSearch = search === '' || 
        order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        customer?.name.toLowerCase().includes(search.toLowerCase()) ||
        customer?.mobile.includes(search);
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
      
      return matchesSearch && matchesStatus && matchesPayment;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const statusCounts = {
    all: state.orders.length,
    pending: state.orders.filter(o => o.status === 'pending').length,
    cutting: state.orders.filter(o => o.status === 'cutting').length,
    stitching: state.orders.filter(o => o.status === 'stitching').length,
    trial: state.orders.filter(o => o.status === 'trial').length,
    ready: state.orders.filter(o => o.status === 'ready').length,
    delivered: state.orders.filter(o => o.status === 'delivered').length,
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'all': return t('orders.all');
      case 'pending': return t('orders.pending');
      case 'cutting': return t('orders.cutting');
      case 'stitching': return t('orders.stitching');
      case 'trial': return t('orders.trial');
      case 'ready': return t('orders.ready');
      case 'delivered': return t('orders.delivered');
      default: return status;
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold">{t('orders.title')}</h1>
            <p className="text-muted-foreground">
              {state.orders.length} {t('orders.totalOrders')}
            </p>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'pending', 'cutting', 'stitching', 'trial', 'ready', 'delivered'] as const).map(status => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className="gap-2"
            >
              {getStatusLabel(status)}
              <Badge variant="secondary" className="ml-1">
                {statusCounts[status]}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('orders.searchPlaceholder')}
              className="pl-10"
            />
          </div>
          <Select value={paymentFilter} onValueChange={(v) => setPaymentFilter(v as PaymentStatus | 'all')}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t('orders.allPayments')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('orders.allPayments')}</SelectItem>
              <SelectItem value="unpaid">{t('orders.unpaid')}</SelectItem>
              <SelectItem value="partial">{t('orders.partial')}</SelectItem>
              <SelectItem value="paid">{t('orders.paid')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders Grid */}
        {filteredOrders.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map((order, index) => (
              <div 
                key={order.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <OrderCard 
                  order={order} 
                  customer={getCustomer(order.customerId)}
                  showCustomer
                />
              </div>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{t('orders.noOrdersFound')}</h3>
              <p className="text-muted-foreground mb-6">
                {search || statusFilter !== 'all' || paymentFilter !== 'all'
                  ? t('orders.adjustFilters')
                  : t('orders.createFromCustomers')}
              </p>
              <Button variant="outline" onClick={() => navigate('/customers')}>
                {t('orders.goToCustomers')}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Orders;
