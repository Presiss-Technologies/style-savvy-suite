import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MeasurementForm } from '@/components/measurements/MeasurementForm';
import { MeasurementCard } from '@/components/measurements/MeasurementCard';
import { OrderForm } from '@/components/orders/OrderForm';
import { OrderCard } from '@/components/orders/OrderCard';
import { toast } from 'sonner';
import { 
  ArrowLeft, User, Phone, Mail, MapPin, Edit, Trash2, Plus, 
  Ruler, ShoppingBag, Calendar, Tag 
} from 'lucide-react';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const CustomerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCustomer, getCustomerMeasurements, getCustomerOrders, dispatch } = useApp();
  const { t } = useLanguage();
  
  const [showMeasurementForm, setShowMeasurementForm] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState<string | null>(null);

  const customer = id ? getCustomer(id) : undefined;
  const measurements = id ? getCustomerMeasurements(id) : [];
  const orders = id ? getCustomerOrders(id) : [];

  if (!customer) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-display font-bold mb-2">{t('customerDetail.notFound')}</h2>
          <p className="text-muted-foreground mb-4">{t('customerDetail.notFoundDesc')}</p>
          <Button onClick={() => navigate('/customers')}>{t('customerDetail.goToCustomers')}</Button>
        </div>
      </Layout>
    );
  }

  const handleDeleteCustomer = () => {
    dispatch({ type: 'DELETE_CUSTOMER', payload: customer.id });
    toast.success(t('common.customerDeleted'));
    navigate('/customers');
  };

  const handleDeleteMeasurement = (measurementId: string) => {
    dispatch({ type: 'DELETE_MEASUREMENT', payload: measurementId });
    toast.success(t('measurementCard.deletedSuccess'));
  };

  const getTagVariant = (tag: string) => {
    switch (tag) {
      case 'VIP': return 'vip';
      case 'Regular': return 'regular';
      default: return 'walkin';
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/customers')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('customerDetail.back')}
        </Button>

        {/* Customer Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-display font-bold">{customer.name}</h1>
                    <Badge variant={getTagVariant(customer.tag)}>{customer.tag}</Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {customer.mobile}
                    </div>
                    {customer.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {customer.email}
                      </div>
                    )}
                    {customer.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {customer.address}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {t('customerDetail.customerSince')} {format(new Date(customer.createdAt), 'MMM d, yyyy')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/customers/${customer.id}/edit`)}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  {t('customerDetail.edit')}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" className="text-destructive hover:text-destructive gap-2">
                      <Trash2 className="h-4 w-4" />
                      {t('customerDetail.delete')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('customerDetail.deleteTitle')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('customerDetail.deleteDesc').replace('{name}', customer.name)}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('customerDetail.cancel')}</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteCustomer} className="bg-destructive text-destructive-foreground">
                        {t('customerDetail.delete')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {customer.notes && (
              <div className="mt-4 p-3 bg-accent rounded-lg">
                <p className="text-sm">{customer.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold">{measurements.length}</p>
            <p className="text-sm text-muted-foreground">{t('customerDetail.measurements')}</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold">{orders.length}</p>
            <p className="text-sm text-muted-foreground">{t('customerDetail.orders')}</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold">₹{orders.reduce((s, o) => s + o.totalAmount, 0).toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">{t('customerDetail.totalValue')}</p>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="measurements">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="measurements" className="gap-2">
              <Ruler className="h-4 w-4" />
              {t('customerDetail.measurements')} ({measurements.length})
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              {t('customerDetail.orders')} ({orders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="measurements" className="mt-6 space-y-4">
            {!showMeasurementForm && !editingMeasurement && (
              <Button 
                variant="gold" 
                onClick={() => setShowMeasurementForm(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                {t('customerDetail.addMeasurement')}
              </Button>
            )}

            {showMeasurementForm && (
              <MeasurementForm
                customerId={customer.id}
                onSave={() => setShowMeasurementForm(false)}
                onCancel={() => setShowMeasurementForm(false)}
              />
            )}

            {editingMeasurement && (
              <MeasurementForm
                customerId={customer.id}
                measurement={measurements.find(m => m.id === editingMeasurement)}
                onSave={() => setEditingMeasurement(null)}
                onCancel={() => setEditingMeasurement(null)}
              />
            )}

            {!showMeasurementForm && !editingMeasurement && (
              <div className="grid sm:grid-cols-2 gap-4">
                {measurements.map(measurement => (
                  <MeasurementCard
                    key={measurement.id}
                    measurement={measurement}
                    onEdit={() => setEditingMeasurement(measurement.id)}
                    onDelete={() => handleDeleteMeasurement(measurement.id)}
                  />
                ))}
              </div>
            )}

            {measurements.length === 0 && !showMeasurementForm && (
              <Card className="p-8 text-center">
                <Ruler className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">{t('customerDetail.noMeasurementsYet')}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('customerDetail.addFirstMeasurement')}
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="orders" className="mt-6 space-y-4">
            {!showOrderForm && (
              <Button 
                variant="gold" 
                onClick={() => setShowOrderForm(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                {t('customerDetail.createOrder')}
              </Button>
            )}

            {showOrderForm && (
              <OrderForm
                customerId={customer.id}
                onSave={() => setShowOrderForm(false)}
                onCancel={() => setShowOrderForm(false)}
              />
            )}

            {!showOrderForm && (
              <div className="grid sm:grid-cols-2 gap-4">
                {orders.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}

            {orders.length === 0 && !showOrderForm && (
              <Card className="p-8 text-center">
                <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">{t('customerDetail.noOrdersYet')}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('customerDetail.createFirstOrder')}
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CustomerDetail;
