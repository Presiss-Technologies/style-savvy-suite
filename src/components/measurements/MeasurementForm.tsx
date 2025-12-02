import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/contexts/AppContext';
import { Measurement, ShirtMeasurement, PantMeasurement, KurtaMeasurement, KotiMeasurement, WaistcoatMeasurement } from '@/types';
import { toast } from 'sonner';
import { Ruler, Save, Copy } from 'lucide-react';

interface MeasurementFormProps {
  customerId: string;
  measurement?: Measurement;
  onSave?: () => void;
  onCancel?: () => void;
}

const defaultShirt: ShirtMeasurement = {
  length: 0, chest: 0, waist: 0, shoulder: 0, sleeveLength: 0,
  sleeveOpening: 0, collar: 0, armHole: 0, cuffSize: 0, frontChest: 0, backWidth: 0
};

const defaultPant: PantMeasurement = {
  length: 0, waist: 0, hip: 0, thigh: 0, knee: 0,
  bottom: 0, crotch: 0, rise: 0, inseam: 0
};

const defaultKurta: KurtaMeasurement = {
  length: 0, chest: 0, waist: 0, shoulder: 0, sleeveLength: 0,
  sleeveOpening: 0, collar: 0, armHole: 0, slit: 0, daaman: 0
};

const defaultKoti: KotiMeasurement = {
  length: 0, chest: 0, waist: 0, shoulder: 0, armHole: 0,
  frontOpening: 0, backWidth: 0
};

const defaultWaistcoat: WaistcoatMeasurement = {
  length: 0, chest: 0, waist: 0, shoulder: 0, armHole: 0,
  frontLength: 0, backLength: 0
};

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
  <div className="space-y-1.5">
    <Label className="text-xs text-muted-foreground">{label}</Label>
    <div className="relative">
      <Input
        type="number"
        step="0.25"
        min="0"
        value={value || ''}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="pr-8 h-10"
        placeholder="0"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
        {unit}
      </span>
    </div>
  </div>
);

export const MeasurementForm = ({ customerId, measurement, onSave, onCancel }: MeasurementFormProps) => {
  const { dispatch, getCustomerMeasurements } = useApp();
  const existingMeasurements = getCustomerMeasurements(customerId);
  
  const [type, setType] = useState<Measurement['type']>(measurement?.type || 'shirt');
  const [notes, setNotes] = useState(measurement?.notes || '');
  
  const [shirtData, setShirtData] = useState<ShirtMeasurement>(
    measurement?.type === 'shirt' ? measurement.data as ShirtMeasurement : defaultShirt
  );
  const [pantData, setPantData] = useState<PantMeasurement>(
    measurement?.type === 'pant' ? measurement.data as PantMeasurement : defaultPant
  );
  const [kurtaData, setKurtaData] = useState<KurtaMeasurement>(
    measurement?.type === 'kurta' ? measurement.data as KurtaMeasurement : defaultKurta
  );
  const [kotiData, setKotiData] = useState<KotiMeasurement>(
    measurement?.type === 'koti' ? measurement.data as KotiMeasurement : defaultKoti
  );
  const [waistcoatData, setWaistcoatData] = useState<WaistcoatMeasurement>(
    measurement?.type === 'waistcoat' ? measurement.data as WaistcoatMeasurement : defaultWaistcoat
  );

  const copyFromPrevious = () => {
    const previous = existingMeasurements.find(m => m.type === type);
    if (previous) {
      switch (type) {
        case 'shirt':
          setShirtData(previous.data as ShirtMeasurement);
          break;
        case 'pant':
          setPantData(previous.data as PantMeasurement);
          break;
        case 'kurta':
          setKurtaData(previous.data as KurtaMeasurement);
          break;
        case 'koti':
          setKotiData(previous.data as KotiMeasurement);
          break;
        case 'waistcoat':
          setWaistcoatData(previous.data as WaistcoatMeasurement);
          break;
      }
      toast.success('Copied from previous measurement');
    } else {
      toast.info('No previous measurement found for this type');
    }
  };

  const handleSubmit = () => {
    let data: ShirtMeasurement | PantMeasurement | KurtaMeasurement | KotiMeasurement | WaistcoatMeasurement;
    
    switch (type) {
      case 'shirt': data = shirtData; break;
      case 'pant': data = pantData; break;
      case 'kurta': data = kurtaData; break;
      case 'koti': data = kotiData; break;
      case 'waistcoat': data = waistcoatData; break;
    }

    const now = new Date().toISOString();
    const savedMeasurement: Measurement = {
      id: measurement?.id || uuidv4(),
      customerId,
      type,
      data,
      notes: notes.trim() || undefined,
      createdAt: measurement?.createdAt || now,
      updatedAt: now,
    };

    if (measurement) {
      dispatch({ type: 'UPDATE_MEASUREMENT', payload: savedMeasurement });
      toast.success('Measurement updated');
    } else {
      dispatch({ type: 'ADD_MEASUREMENT', payload: savedMeasurement });
      toast.success('Measurement saved');
    }

    onSave?.();
  };

  const hasPreviousMeasurement = existingMeasurements.some(m => m.type === type);

  return (
    <Card className="animate-slide-up">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Ruler className="h-5 w-5 text-primary" />
            {measurement ? 'Edit Measurement' : 'New Measurement'}
          </CardTitle>
          {hasPreviousMeasurement && !measurement && (
            <Button variant="outline" size="sm" onClick={copyFromPrevious} className="gap-2">
              <Copy className="h-4 w-4" />
              Copy Previous
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={type} onValueChange={(v) => setType(v as Measurement['type'])}>
          <TabsList className="w-full grid grid-cols-5 mb-6">
            <TabsTrigger value="shirt">Shirt</TabsTrigger>
            <TabsTrigger value="pant">Pant</TabsTrigger>
            <TabsTrigger value="kurta">Kurta</TabsTrigger>
            <TabsTrigger value="koti">Koti</TabsTrigger>
            <TabsTrigger value="waistcoat">Waistcoat</TabsTrigger>
          </TabsList>

          <TabsContent value="shirt" className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <MeasurementInput label="Length" value={shirtData.length} onChange={(v) => setShirtData({ ...shirtData, length: v })} />
              <MeasurementInput label="Chest" value={shirtData.chest} onChange={(v) => setShirtData({ ...shirtData, chest: v })} />
              <MeasurementInput label="Waist" value={shirtData.waist} onChange={(v) => setShirtData({ ...shirtData, waist: v })} />
              <MeasurementInput label="Shoulder" value={shirtData.shoulder} onChange={(v) => setShirtData({ ...shirtData, shoulder: v })} />
              <MeasurementInput label="Sleeve Length" value={shirtData.sleeveLength} onChange={(v) => setShirtData({ ...shirtData, sleeveLength: v })} />
              <MeasurementInput label="Sleeve Opening" value={shirtData.sleeveOpening} onChange={(v) => setShirtData({ ...shirtData, sleeveOpening: v })} />
              <MeasurementInput label="Collar" value={shirtData.collar} onChange={(v) => setShirtData({ ...shirtData, collar: v })} />
              <MeasurementInput label="Arm Hole" value={shirtData.armHole} onChange={(v) => setShirtData({ ...shirtData, armHole: v })} />
              <MeasurementInput label="Cuff Size" value={shirtData.cuffSize || 0} onChange={(v) => setShirtData({ ...shirtData, cuffSize: v })} />
              <MeasurementInput label="Front Chest" value={shirtData.frontChest || 0} onChange={(v) => setShirtData({ ...shirtData, frontChest: v })} />
              <MeasurementInput label="Back Width" value={shirtData.backWidth || 0} onChange={(v) => setShirtData({ ...shirtData, backWidth: v })} />
            </div>
          </TabsContent>

          <TabsContent value="pant" className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <MeasurementInput label="Length" value={pantData.length} onChange={(v) => setPantData({ ...pantData, length: v })} />
              <MeasurementInput label="Waist" value={pantData.waist} onChange={(v) => setPantData({ ...pantData, waist: v })} />
              <MeasurementInput label="Hip" value={pantData.hip} onChange={(v) => setPantData({ ...pantData, hip: v })} />
              <MeasurementInput label="Thigh" value={pantData.thigh} onChange={(v) => setPantData({ ...pantData, thigh: v })} />
              <MeasurementInput label="Knee" value={pantData.knee} onChange={(v) => setPantData({ ...pantData, knee: v })} />
              <MeasurementInput label="Bottom" value={pantData.bottom} onChange={(v) => setPantData({ ...pantData, bottom: v })} />
              <MeasurementInput label="Crotch" value={pantData.crotch} onChange={(v) => setPantData({ ...pantData, crotch: v })} />
              <MeasurementInput label="Rise" value={pantData.rise || 0} onChange={(v) => setPantData({ ...pantData, rise: v })} />
              <MeasurementInput label="Inseam" value={pantData.inseam || 0} onChange={(v) => setPantData({ ...pantData, inseam: v })} />
            </div>
          </TabsContent>

          <TabsContent value="kurta" className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <MeasurementInput label="Length" value={kurtaData.length} onChange={(v) => setKurtaData({ ...kurtaData, length: v })} />
              <MeasurementInput label="Chest" value={kurtaData.chest} onChange={(v) => setKurtaData({ ...kurtaData, chest: v })} />
              <MeasurementInput label="Waist" value={kurtaData.waist} onChange={(v) => setKurtaData({ ...kurtaData, waist: v })} />
              <MeasurementInput label="Shoulder" value={kurtaData.shoulder} onChange={(v) => setKurtaData({ ...kurtaData, shoulder: v })} />
              <MeasurementInput label="Sleeve Length" value={kurtaData.sleeveLength} onChange={(v) => setKurtaData({ ...kurtaData, sleeveLength: v })} />
              <MeasurementInput label="Sleeve Opening" value={kurtaData.sleeveOpening} onChange={(v) => setKurtaData({ ...kurtaData, sleeveOpening: v })} />
              <MeasurementInput label="Collar" value={kurtaData.collar} onChange={(v) => setKurtaData({ ...kurtaData, collar: v })} />
              <MeasurementInput label="Arm Hole" value={kurtaData.armHole} onChange={(v) => setKurtaData({ ...kurtaData, armHole: v })} />
              <MeasurementInput label="Slit" value={kurtaData.slit || 0} onChange={(v) => setKurtaData({ ...kurtaData, slit: v })} />
              <MeasurementInput label="Daaman" value={kurtaData.daaman || 0} onChange={(v) => setKurtaData({ ...kurtaData, daaman: v })} />
            </div>
          </TabsContent>

          <TabsContent value="koti" className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <MeasurementInput label="Length" value={kotiData.length} onChange={(v) => setKotiData({ ...kotiData, length: v })} />
              <MeasurementInput label="Chest" value={kotiData.chest} onChange={(v) => setKotiData({ ...kotiData, chest: v })} />
              <MeasurementInput label="Waist" value={kotiData.waist} onChange={(v) => setKotiData({ ...kotiData, waist: v })} />
              <MeasurementInput label="Shoulder" value={kotiData.shoulder} onChange={(v) => setKotiData({ ...kotiData, shoulder: v })} />
              <MeasurementInput label="Arm Hole" value={kotiData.armHole} onChange={(v) => setKotiData({ ...kotiData, armHole: v })} />
              <MeasurementInput label="Front Opening" value={kotiData.frontOpening || 0} onChange={(v) => setKotiData({ ...kotiData, frontOpening: v })} />
              <MeasurementInput label="Back Width" value={kotiData.backWidth || 0} onChange={(v) => setKotiData({ ...kotiData, backWidth: v })} />
            </div>
          </TabsContent>

          <TabsContent value="waistcoat" className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <MeasurementInput label="Length" value={waistcoatData.length} onChange={(v) => setWaistcoatData({ ...waistcoatData, length: v })} />
              <MeasurementInput label="Chest" value={waistcoatData.chest} onChange={(v) => setWaistcoatData({ ...waistcoatData, chest: v })} />
              <MeasurementInput label="Waist" value={waistcoatData.waist} onChange={(v) => setWaistcoatData({ ...waistcoatData, waist: v })} />
              <MeasurementInput label="Shoulder" value={waistcoatData.shoulder} onChange={(v) => setWaistcoatData({ ...waistcoatData, shoulder: v })} />
              <MeasurementInput label="Arm Hole" value={waistcoatData.armHole} onChange={(v) => setWaistcoatData({ ...waistcoatData, armHole: v })} />
              <MeasurementInput label="Front Length" value={waistcoatData.frontLength || 0} onChange={(v) => setWaistcoatData({ ...waistcoatData, frontLength: v })} />
              <MeasurementInput label="Back Length" value={waistcoatData.backLength || 0} onChange={(v) => setWaistcoatData({ ...waistcoatData, backLength: v })} />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label>Notes / Special Instructions</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any special tailoring instructions or notes..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button onClick={handleSubmit} variant="gold" className="gap-2">
              <Save className="h-4 w-4" />
              Save Measurement
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
