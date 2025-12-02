import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { CustomerSearch } from '@/components/customers/CustomerSearch';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, User, Phone, Tag, Search, SortAsc, SortDesc } from 'lucide-react';
import { Customer } from '@/types';

type SortField = 'name' | 'createdAt';
type SortOrder = 'asc' | 'desc';

const Customers = () => {
  const navigate = useNavigate();
  const { state } = useApp();
  const [filter, setFilter] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const filteredCustomers = state.customers
    .filter(c => 
      c.name.toLowerCase().includes(filter.toLowerCase()) ||
      c.mobile.includes(filter) ||
      c.tag.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1;
      if (sortField === 'name') {
        return a.name.localeCompare(b.name) * order;
      }
      return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * order;
    });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold">Customers</h1>
            <p className="text-muted-foreground">
              {state.customers.length} total customers
            </p>
          </div>
          <Button variant="gold" onClick={() => navigate('/customers/new')} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Customer
          </Button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter by name, mobile, or tag..."
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={sortField === 'name' ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleSort('name')}
              className="gap-1.5"
            >
              Name
              {sortField === 'name' && (sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />)}
            </Button>
            <Button
              variant={sortField === 'createdAt' ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleSort('createdAt')}
              className="gap-1.5"
            >
              Date
              {sortField === 'createdAt' && (sortOrder === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />)}
            </Button>
          </div>
        </div>

        {/* Customer Grid */}
        {filteredCustomers.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((customer, index) => (
              <Card 
                key={customer.id}
                className="cursor-pointer hover:shadow-lift transition-all duration-200 animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => navigate(`/customers/${customer.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{customer.name}</h3>
                        <Badge variant={getTagVariant(customer.tag)} className="text-[10px]">
                          {customer.tag}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        {customer.mobile}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">No Customers Found</h3>
              <p className="text-muted-foreground mb-6">
                {filter ? 'Try adjusting your search criteria' : 'Start by adding your first customer'}
              </p>
              {!filter && (
                <Button variant="gold" onClick={() => navigate('/customers/new')} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Customer
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Customers;
