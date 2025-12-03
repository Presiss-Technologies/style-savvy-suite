import { useLanguage } from '@/contexts/LanguageContext';
import { OrderStatus } from '@/types';
import { Clock, Scissors, Package, User, CheckCircle, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderWorkflowStagesProps {
  currentStatus: OrderStatus;
}

const stages: { status: OrderStatus; icon: typeof Clock }[] = [
  { status: 'pending', icon: Clock },
  { status: 'cutting', icon: Scissors },
  { status: 'stitching', icon: Package },
  { status: 'trial', icon: User },
  { status: 'ready', icon: CheckCircle },
  { status: 'delivered', icon: Truck },
];

export const OrderWorkflowStages = ({ currentStatus }: OrderWorkflowStagesProps) => {
  const { t } = useLanguage();
  
  const statusLabels: Record<OrderStatus, string> = {
    pending: t('orders.pending'),
    cutting: t('orders.cutting'),
    stitching: t('orders.stitching'),
    trial: t('orders.trial'),
    ready: t('orders.ready'),
    delivered: t('orders.delivered'),
    cancelled: t('orders.cancelled'),
  };
  
  const currentIndex = stages.findIndex(s => s.status === currentStatus);
  
  if (currentStatus === 'cancelled') {
    return (
      <div className="p-4 bg-destructive/10 rounded-lg text-center">
        <span className="text-destructive font-medium">{t('orders.cancelled')}</span>
      </div>
    );
  }
  
  return (
    <div className="py-4">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-muted rounded-full" />
        <div 
          className="absolute top-5 left-0 h-1 bg-primary rounded-full transition-all duration-500"
          style={{ width: `${(currentIndex / (stages.length - 1)) * 100}%` }}
        />
        
        {stages.map((stage, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const Icon = stage.icon;
          
          return (
            <div key={stage.status} className="flex flex-col items-center z-10">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  isCompleted 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground",
                  isCurrent && "ring-4 ring-primary/30"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span 
                className={cn(
                  "text-xs mt-2 font-medium text-center max-w-[60px]",
                  isCompleted ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {statusLabels[stage.status]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
