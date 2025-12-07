import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface StickyProgressBarProps {
  percentage: number;
  current: number;
  goal: number;
  lastDonorName?: string;
  lastDonorAmount?: number;
  isVisible: boolean;
}

const StickyProgressBar = ({
  percentage,
  current,
  goal,
  lastDonorName,
  lastDonorAmount,
  isVisible,
}: StickyProgressBarProps) => {
  const navigate = useNavigate();

  // SVG circle properties
  const size = 56;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const formatAmount = (amount: number) => {
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K`;
    }
    return amount.toLocaleString();
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-large transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="max-w-lg mx-auto px-5 py-4 flex items-center gap-5">
        {/* Mini Progress Circle */}
        <div className="relative flex-shrink-0">
          <svg width={size} height={size} className="-rotate-90">
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="hsl(var(--border))"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="hsl(var(--brand-logo))"
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
        </div>

        {/* Amount Info */}
        <div className="flex-1 min-w-0">
          <div className="text-base font-bold text-foreground">
            ${current.toLocaleString()} raised{" "}
            <span className="font-normal text-muted-foreground">
              of {formatAmount(goal)}
            </span>
          </div>
          {lastDonorName && lastDonorAmount && (
            <div className="text-sm text-muted-foreground truncate">
              {lastDonorName} donated ${lastDonorAmount}
            </div>
          )}
        </div>

        {/* Donate Button */}
        <Button
          variant="donate"
          size="lg"
          className="flex-shrink-0 rounded-full px-8"
          onClick={() => navigate("/checkout")}
        >
          Donate
        </Button>
      </div>
    </div>
  );
};

export default StickyProgressBar;