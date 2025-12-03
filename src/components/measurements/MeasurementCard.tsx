import { Measurement } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';
import { Ruler, Edit, Trash2 } from 'lucide-react';

interface MeasurementCardProps {
  measurement: Measurement;
  onEdit?: () => void;
  onDelete?: () => void;
}

const typeVariants: Record<string, 'info' | 'success' | 'default' | 'warning' | 'destructive'> = {
  shirt: 'info',
  pant: 'success',
  kurta: 'default',
  koti: 'warning',
  waistcoat: 'destructive',
};

export const MeasurementCard = ({ measurement, onEdit, onDelete }: MeasurementCardProps) => {
  const { t } = useLanguage();
  
  const typeLabels: Record<string, string> = {
    shirt: t('measurementForm.shirt'),
    pant: t('measurementForm.pant'),
    kurta: t('measurementForm.kurta'),
    koti: t('measurementForm.koti'),
    waistcoat: t('measurementForm.waistcoat'),
  };

  const data = measurement.data as unknown as Record<string, number>;
  const entries = Object.entries(data).filter(([_, value]) => value > 0);

  return (
    <Card className="hover:shadow-lift transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Ruler className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold font-body">
                {typeLabels[measurement.type]}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {format(new Date(measurement.updatedAt), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          <Badge variant={typeVariants[measurement.type]}>
            {typeLabels[measurement.type]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
          {entries.slice(0, 8).map(([key, value]) => (
            <div key={key} className="text-center p-2 rounded-lg bg-secondary/50">
              <p className="text-lg font-semibold">{value}"</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </p>
            </div>
          ))}
        </div>

        {measurement.notes && (
          <p className="text-sm text-muted-foreground bg-accent/50 p-3 rounded-lg mb-4">
            {measurement.notes}
          </p>
        )}

        <div className="flex gap-2 justify-end">
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit} className="gap-1.5">
              <Edit className="h-3.5 w-3.5" />
              {t('measurementCard.edit')}
            </Button>
          )}
          {onDelete && (
            <Button variant="ghost" size="sm" onClick={onDelete} className="gap-1.5 text-destructive hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
              {t('measurementCard.delete')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
