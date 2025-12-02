import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { CustomerForm } from '@/components/customers/CustomerForm';
import { useApp } from '@/contexts/AppContext';

const CustomerEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCustomer } = useApp();
  
  const customer = id ? getCustomer(id) : undefined;

  if (!customer) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-display font-bold mb-2">Customer Not Found</h2>
          <p className="text-muted-foreground mb-4">The customer you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/customers')}>Go to Customers</button>
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
