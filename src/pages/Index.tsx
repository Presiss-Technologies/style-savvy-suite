import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Layout } from '@/components/layout/Layout';
import { CustomerSearch } from '@/components/customers/CustomerSearch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OrderCard } from '@/components/orders/OrderCard';
import { useNavigate } from 'react-router-dom';
import { Users, Ruler, ShoppingBag, TrendingUp, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const Index = () => {
  const { state, getCustomer } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const stats = {
    totalCustomers: state.customers.length,
    totalMeasurements: state.measurements.length,
    totalOrders: state.orders.length,
    pendingOrders: state.orders.filter(o => ['pending', 'cutting', 'stitching', 'trial'].includes(o.status)).length,
    readyOrders: state.orders.filter(o => o.status === 'ready').length,
    revenue: state.orders.reduce((sum, o) => sum + o.paidAmount, 0),
  };

  const recentOrders = [...state.orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const pendingOrders = state.orders
    .filter(o => ['pending', 'cutting', 'stitching', 'trial'].includes(o.status))
    .sort((a, b) => new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime())
    .slice(0, 3);

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Hero Search Section */}
        <section className="text-center py-8">
          <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2">
            {t('dashboard.welcome')} <span className="text-gradient">TailorPro</span>
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {t('dashboard.subtitle')}
          </p>
          <div className="max-w-xl mx-auto">
            <CustomerSearch placeholder={t('dashboard.searchPlaceholder')} />
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('dashboard.customers')}</p>
                  <p className="text-2xl font-bold">{stats.totalCustomers}</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('dashboard.measurements')}</p>
                  <p className="text-2xl font-bold">{stats.totalMeasurements}</p>
                </div>
                <div className="p-3 rounded-xl bg-info/10">
                  <Ruler className="h-5 w-5 text-info" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('dashboard.orders')}</p>
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
                </div>
                <div className="p-3 rounded-xl bg-success/10">
                  <ShoppingBag className="h-5 w-5 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: '0.25s' }}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('dashboard.revenue')}</p>
                  <p className="text-2xl font-bold">₹{stats.revenue.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-warning/10">
                  <TrendingUp className="h-5 w-5 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Quick Actions */}
        <section className="grid sm:grid-cols-3 gap-4">
          <Button
            variant="gold"
            size="lg"
            className="h-16 gap-3 text-base"
            onClick={() => navigate('/customers/new')}
          >
            <Plus className="h-5 w-5" />
            {t('dashboard.newCustomer')}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-16 gap-3 text-base"
            onClick={() => navigate('/customers')}
          >
            <Users className="h-5 w-5" />
            {t('dashboard.allCustomers')}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-16 gap-3 text-base"
            onClick={() => navigate('/orders')}
          >
            <ShoppingBag className="h-5 w-5" />
            {t('dashboard.allOrders')}
          </Button>
        </section>

        {/* Order Status Overview */}
        <section className="grid lg:grid-cols-3 gap-4">
          <Card className="flex items-center gap-4 p-5">
            <div className="p-3 rounded-full bg-warning/15">
              <Clock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pendingOrders}</p>
              <p className="text-sm text-muted-foreground">{t('dashboard.pendingOrders')}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4 p-5">
            <div className="p-3 rounded-full bg-success/15">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.readyOrders}</p>
              <p className="text-sm text-muted-foreground">{t('dashboard.readyForPickup')}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4 p-5">
            <div className="p-3 rounded-full bg-destructive/15">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                ₹{state.orders.reduce((sum, o) => sum + (o.totalAmount - o.paidAmount), 0).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">{t('dashboard.outstandingBalance')}</p>
            </div>
          </Card>
        </section>

        {/* Recent & Pending Orders */}
        <section className="grid lg:grid-cols-2 gap-6">
          {/* Pending Orders */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-warning" />
                  {t('dashboard.upcomingDeliveries')}
                </CardTitle>
                <Badge variant="warning">{pendingOrders.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {pendingOrders.length > 0 ? (
                <div className="space-y-3">
                  {pendingOrders.map(order => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      customer={getCustomer(order.customerId)}
                      showCustomer 
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  {t('dashboard.noPendingOrders')}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  {t('dashboard.recentOrders')}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/orders')}>
                  {t('dashboard.viewAll')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentOrders.length > 0 ? (
                <div className="space-y-3">
                  {recentOrders.map(order => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      customer={getCustomer(order.customerId)}
                      showCustomer 
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  {t('dashboard.noOrders')}
                </p>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
