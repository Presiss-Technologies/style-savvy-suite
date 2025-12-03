import { useState, useEffect, useRef } from 'react';
import { Search, User, Phone, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Customer } from '@/types';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface CustomerSearchProps {
  onSelect?: (customer: Customer) => void;
  showAddButton?: boolean;
  placeholder?: string;
}

export const CustomerSearch = ({ 
  onSelect, 
  showAddButton = true,
  placeholder
}: CustomerSearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Customer[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { searchCustomers } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const searchPlaceholder = placeholder || t('customerSearch.placeholder');

  useEffect(() => {
    if (query.length >= 2) {
      const found = searchCustomers(query);
      setResults(found);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query, searchCustomers]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (customer: Customer) => {
    setQuery('');
    setIsOpen(false);
    if (onSelect) {
      onSelect(customer);
    } else {
      navigate(`/customers/${customer.id}`);
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
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-10 pr-4 h-12 text-base bg-card border-2 focus:border-primary/50 transition-colors"
        />
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 overflow-hidden animate-scale-in">
          {results.length > 0 ? (
            <div className="max-h-80 overflow-y-auto">
              {results.map((customer) => (
                <button
                  key={customer.id}
                  onClick={() => handleSelect(customer)}
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-accent transition-colors border-b last:border-b-0"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{customer.name}</span>
                      <Badge variant={getTagVariant(customer.tag)} className="text-[10px]">
                        {customer.tag}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {customer.mobile}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-muted-foreground mb-4">{t('customerSearch.noCustomersFound')}</p>
              {showAddButton && (
                <Button
                  onClick={() => navigate('/customers/new', { state: { mobile: query } })}
                  variant="gold"
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {t('customerSearch.addNewCustomer')}
                </Button>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
