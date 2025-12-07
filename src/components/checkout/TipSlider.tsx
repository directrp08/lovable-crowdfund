import { Slider } from "@/components/ui/slider";

interface TipSliderProps {
  tipPercent: number;
  onTipChange: (percent: number) => void;
}

const TipSlider = ({ tipPercent, onTipChange }: TipSliderProps) => {
  return (
    <div className="bg-gofundme-gray rounded-lg p-4 space-y-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <h3 className="font-semibold text-foreground">Tip GoFundMe services</h3>
      <p className="text-sm text-muted-foreground">
        GoFundMe has a 0% platform fee for organizers. GoFundMe survives on tips from donors like you.
      </p>
      
      <div className="space-y-3">
        <div className="text-center">
          <span className="text-lg font-bold text-primary">{tipPercent.toFixed(1)}%</span>
        </div>
        
        <div className="px-1 py-2">
          <Slider
            value={[tipPercent]}
            onValueChange={(values) => onTipChange(values[0])}
            min={0}
            max={25}
            step={0.5}
            className="w-full touch-none"
          />
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0%</span>
          <span>25%</span>
        </div>
      </div>
      
      <button className="text-primary text-sm font-medium hover:underline">
        Enter custom tip
      </button>
    </div>
  );
};

export default TipSlider;
