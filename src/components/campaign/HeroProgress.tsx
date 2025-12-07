interface HeroProgressProps {
  percentage: number;
  current: number;
  goal: number;
  recentDonations: { name: string; amount: number }[];
}

const HeroProgress = ({ percentage, current, goal, recentDonations }: HeroProgressProps) => {
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-4 p-4 bg-background rounded-xl shadow-large animate-slide-up">
      {/* Progress Circle */}
      <div className="relative w-20 h-20 flex-shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="hsl(var(--border))"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="hsl(var(--primary))"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-primary">{percentage}%</span>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-lg font-bold text-foreground">
          ${current.toLocaleString()} raised{" "}
          <span className="font-normal text-muted-foreground">of {goal >= 1000 ? `${goal / 1000}K` : goal}</span>
        </p>
        <div className="mt-1 space-y-0.5">
          {recentDonations.slice(0, 2).map((donation, index) => (
            <p key={index} className="text-sm text-muted-foreground truncate">
              <span className="font-medium text-foreground">{donation.name}</span> donated ${donation.amount}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroProgress;
