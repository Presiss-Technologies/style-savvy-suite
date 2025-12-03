import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import {
  ShirtMeasurement,
  PantMeasurement,
  KurtaMeasurement,
  KotiMeasurement,
  WaistcoatMeasurement,
  Measurement,
} from '@/types';

type MeasurementType = 'shirt' | 'pant' | 'kurta' | 'koti' | 'waistcoat';
type MeasurementDataType = ShirtMeasurement | PantMeasurement | KurtaMeasurement | KotiMeasurement | WaistcoatMeasurement;

interface InlineMeasurementFieldsProps {
  garmentType: MeasurementType;
  data: MeasurementDataType;
  onChange: (data: MeasurementDataType) => void;
  existingMeasurement?: Measurement;
  onCopyPrevious?: () => void;
}

const MeasurementInput = ({
  label,
  value,
  onChange,
  unit = 'in'
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
}) => (
  <div className="space-y-1">
    <Label className="text-xs text-muted-foreground">{label}</Label>
    <div className="relative">
      <Input
        type="number"
        step="0.25"
        min="0"
        value={value || ''}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="pr-8 h-9 text-sm"
        placeholder="0"
      />
      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
        {unit}
      </span>
    </div>
  </div>
);

export const InlineMeasurementFields = ({
  garmentType,
  data,
  onChange,
  existingMeasurement,
  onCopyPrevious,
}: InlineMeasurementFieldsProps) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(true);

  const updateField = (field: string, value: number) => {
    onChange({ ...data, [field]: value } as MeasurementDataType);
  };

  const renderShirtFields = (d: ShirtMeasurement) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      <MeasurementInput label={t('measurementForm.length')} value={d.length} onChange={(v) => updateField('length', v)} />
      <MeasurementInput label={t('measurementForm.chest')} value={d.chest} onChange={(v) => updateField('chest', v)} />
      <MeasurementInput label={t('measurementForm.waist')} value={d.waist} onChange={(v) => updateField('waist', v)} />
      <MeasurementInput label={t('measurementForm.shoulder')} value={d.shoulder} onChange={(v) => updateField('shoulder', v)} />
      <MeasurementInput label={t('measurementForm.sleeveLength')} value={d.sleeveLength} onChange={(v) => updateField('sleeveLength', v)} />
      <MeasurementInput label={t('measurementForm.sleeveOpening')} value={d.sleeveOpening} onChange={(v) => updateField('sleeveOpening', v)} />
      <MeasurementInput label={t('measurementForm.collar')} value={d.collar} onChange={(v) => updateField('collar', v)} />
      <MeasurementInput label={t('measurementForm.armHole')} value={d.armHole} onChange={(v) => updateField('armHole', v)} />
    </div>
  );

  const renderPantFields = (d: PantMeasurement) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      <MeasurementInput label={t('measurementForm.length')} value={d.length} onChange={(v) => updateField('length', v)} />
      <MeasurementInput label={t('measurementForm.waist')} value={d.waist} onChange={(v) => updateField('waist', v)} />
      <MeasurementInput label={t('measurementForm.hip')} value={d.hip} onChange={(v) => updateField('hip', v)} />
      <MeasurementInput label={t('measurementForm.thigh')} value={d.thigh} onChange={(v) => updateField('thigh', v)} />
      <MeasurementInput label={t('measurementForm.knee')} value={d.knee} onChange={(v) => updateField('knee', v)} />
      <MeasurementInput label={t('measurementForm.bottom')} value={d.bottom} onChange={(v) => updateField('bottom', v)} />
      <MeasurementInput label={t('measurementForm.crotch')} value={d.crotch} onChange={(v) => updateField('crotch', v)} />
    </div>
  );

  const renderKurtaFields = (d: KurtaMeasurement) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      <MeasurementInput label={t('measurementForm.length')} value={d.length} onChange={(v) => updateField('length', v)} />
      <MeasurementInput label={t('measurementForm.chest')} value={d.chest} onChange={(v) => updateField('chest', v)} />
      <MeasurementInput label={t('measurementForm.waist')} value={d.waist} onChange={(v) => updateField('waist', v)} />
      <MeasurementInput label={t('measurementForm.shoulder')} value={d.shoulder} onChange={(v) => updateField('shoulder', v)} />
      <MeasurementInput label={t('measurementForm.sleeveLength')} value={d.sleeveLength} onChange={(v) => updateField('sleeveLength', v)} />
      <MeasurementInput label={t('measurementForm.sleeveOpening')} value={d.sleeveOpening} onChange={(v) => updateField('sleeveOpening', v)} />
      <MeasurementInput label={t('measurementForm.collar')} value={d.collar} onChange={(v) => updateField('collar', v)} />
      <MeasurementInput label={t('measurementForm.armHole')} value={d.armHole} onChange={(v) => updateField('armHole', v)} />
    </div>
  );

  const renderKotiFields = (d: KotiMeasurement) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      <MeasurementInput label={t('measurementForm.length')} value={d.length} onChange={(v) => updateField('length', v)} />
      <MeasurementInput label={t('measurementForm.chest')} value={d.chest} onChange={(v) => updateField('chest', v)} />
      <MeasurementInput label={t('measurementForm.waist')} value={d.waist} onChange={(v) => updateField('waist', v)} />
      <MeasurementInput label={t('measurementForm.shoulder')} value={d.shoulder} onChange={(v) => updateField('shoulder', v)} />
      <MeasurementInput label={t('measurementForm.armHole')} value={d.armHole} onChange={(v) => updateField('armHole', v)} />
    </div>
  );

  const renderWaistcoatFields = (d: WaistcoatMeasurement) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      <MeasurementInput label={t('measurementForm.length')} value={d.length} onChange={(v) => updateField('length', v)} />
      <MeasurementInput label={t('measurementForm.chest')} value={d.chest} onChange={(v) => updateField('chest', v)} />
      <MeasurementInput label={t('measurementForm.waist')} value={d.waist} onChange={(v) => updateField('waist', v)} />
      <MeasurementInput label={t('measurementForm.shoulder')} value={d.shoulder} onChange={(v) => updateField('shoulder', v)} />
      <MeasurementInput label={t('measurementForm.armHole')} value={d.armHole} onChange={(v) => updateField('armHole', v)} />
    </div>
  );

  const renderFields = () => {
    switch (garmentType) {
      case 'shirt':
        return renderShirtFields(data as ShirtMeasurement);
      case 'pant':
        return renderPantFields(data as PantMeasurement);
      case 'kurta':
        return renderKurtaFields(data as KurtaMeasurement);
      case 'koti':
        return renderKotiFields(data as KotiMeasurement);
      case 'waistcoat':
        return renderWaistcoatFields(data as WaistcoatMeasurement);
    }
  };

  const garmentLabel = t(`orderForm.${garmentType}`);

  return (
    <div className="mt-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {garmentLabel} {t('orderForm.measurements')}
        </button>
        {existingMeasurement && onCopyPrevious && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCopyPrevious}
            className="h-7 text-xs gap-1.5"
          >
            <Copy className="h-3 w-3" />
            {t('measurementForm.copyPrevious')}
          </Button>
        )}
      </div>
      {isExpanded && renderFields()}
    </div>
  );
};
