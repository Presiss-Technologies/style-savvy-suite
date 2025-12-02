import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { Customer, CustomerTag } from '@/types';
import { toast } from 'sonner';
import { ArrowLeft, Save, UserPlus, AlertCircle } from 'lucide-react';

interface CustomerFormProps {
  customer?: Customer;
  onSave?: (customer: Customer) => void;
}

export const CustomerForm = ({ customer, onSave }: CustomerFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state: appState, dispatch, searchCustomers } = useApp();
  
  const initialMobile = location.state?.mobile || '';
  
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    mobile: customer?.mobile || initialMobile,
    email: customer?.email || '',
    address: customer?.address || '',
    tag: (customer?.tag || 'Regular') as CustomerTag,
    notes: customer?.notes || '',
  });

  const [duplicateWarning, setDuplicateWarning] = useState<Customer | null>(null);

  // Check for duplicate mobile number
  useEffect(() => {
    if (formData.mobile.length >= 10 && !customer) {
      const existing = searchCustomers(formData.mobile).find(
        c => c.mobile === formData.mobile
      );
      setDuplicateWarning(existing || null);
    } else {
      setDuplicateWarning(null);
    }
  }, [formData.mobile, customer, searchCustomers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Please enter customer name');
      return;
    }

    if (!formData.mobile.trim() || formData.mobile.length < 10) {
      toast.error('Please enter a valid mobile number');
      return;
    }

    if (duplicateWarning) {
      toast.error('A customer with this mobile number already exists');
      return;
    }

    const now = new Date().toISOString();
    const savedCustomer: Customer = {
      id: customer?.id || uuidv4(),
      name: formData.name.trim(),
      mobile: formData.mobile.trim(),
      email: formData.email.trim() || undefined,
      address: formData.address.trim() || undefined,
      tag: formData.tag,
      notes: formData.notes.trim() || undefined,
      createdAt: customer?.createdAt || now,
      updatedAt: now,
    };

    if (customer) {
      dispatch({ type: 'UPDATE_CUSTOMER', payload: savedCustomer });
      toast.success('Customer updated successfully');
    } else {
      dispatch({ type: 'ADD_CUSTOMER', payload: savedCustomer });
      toast.success('Customer added successfully');
    }

    if (onSave) {
      onSave(savedCustomer);
    } else {
      navigate(`/customers/${savedCustomer.id}`);
    }
  };

  return (
    <div className="animate-fade-in">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-4 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            {customer ? 'Edit Customer' : 'New Customer'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter customer name"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number *</Label>
                <Input
                  id="mobile"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  placeholder="Enter 10-digit mobile"
                  className="h-11"
                />
                {duplicateWarning && (
                  <div className="flex items-center gap-2 text-sm text-warning mt-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>
                      Customer "{duplicateWarning.name}" already exists with this number
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tag">Customer Type</Label>
                <Select
                  value={formData.tag}
                  onValueChange={(value) => setFormData({ ...formData, tag: value as CustomerTag })}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIP">VIP</SelectItem>
                    <SelectItem value="Regular">Regular</SelectItem>
                    <SelectItem value="Walk-in">Walk-in</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter full address"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any special instructions or preferences"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold" className="gap-2">
                <Save className="h-4 w-4" />
                {customer ? 'Update Customer' : 'Save Customer'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
