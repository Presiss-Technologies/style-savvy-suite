import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { CustomerForm } from '@/components/customers/CustomerForm';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const CustomerEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCustomer } = useApp();
  const { t } = useLanguage();
  
  const customer = id ? getCustomer(id) : undefined;

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

  return (
    <Layout>
      <CustomerForm customer={customer} />
    </Layout>
  );
};

export default CustomerEdit;
