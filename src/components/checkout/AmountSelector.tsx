import { Button } from "@/components/ui/button";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";
interface AmountSelectorProps {
  amounts: number[];
  selectedAmount: number | null;
  customAmount: string;
  suggestedAmount?: number;
  onSelectAmount: (amount: number) => void;
  onCustomAmountChange: (value: string) => void;
}
const AmountSelector = ({
  amounts,
  selectedAmount,
  customAmount,
  suggestedAmount = 200,
  onSelectAmount,
  onCustomAmountChange
}: AmountSelectorProps) => {
  const handleCustomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    onCustomAmountChange(value);
  };
  const effectiveAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount || 0;
  const animatedAmount = useAnimatedNumber(effectiveAmount, 400);
  return <div className="space-y-4 animate-slide-up" style={{
    animationDelay: "0.1s"
  }}>
      <div className="grid grid-cols-3 gap-3">
        {amounts.map(amount => {
        const isSelected = selectedAmount === amount && !customAmount;
        const isSuggested = amount === suggestedAmount;
        return <div key={amount} className="relative pb-5">
              <Button variant={isSelected ? "amount-selected" : "amount"} className={`w-full h-12 ${isSuggested && !isSelected ? "border-primary/50" : ""}`} onClick={() => onSelectAmount(amount)}>
                ${amount}
              </Button>
              {isSuggested}
            </div>;
      })}
      </div>
      
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-semibold text-muted-foreground">$</div>
        <input
          type="text"
          inputMode="decimal"
          placeholder="Other amount"
          value={customAmount}
          onChange={handleCustomInput}
          className="w-full h-14 pl-10 pr-4 text-lg font-medium bg-muted/50 border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-muted-foreground/60"
        />
      </div>
      
      <div className="pt-2">
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold text-foreground">$</span>
          <span className="text-5xl font-bold text-foreground tabular-nums transition-all">
            {Math.floor(animatedAmount).toLocaleString()}
          </span>
          <span className="text-2xl font-bold text-muted-foreground">.00</span>
        </div>
      </div>
    </div>;
};
export default AmountSelector;