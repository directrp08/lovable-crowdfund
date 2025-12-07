interface ProgressCircleProps {
  percentage: number;
  remaining: number;
  title: string;
}

const ProgressCircle = ({ percentage, remaining, title }: ProgressCircleProps) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="text-center animate-fade-in">
      <div className="relative w-28 h-28 mx-auto mb-4">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="hsl(var(--border))"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="hsl(var(--primary))"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-foreground">{percentage}%</span>
        </div>
      </div>
      <h2 className="text-lg font-bold text-foreground mb-1">{title}</h2>
      <p className="text-muted-foreground text-sm">
        Still ${remaining.toLocaleString()} to go. Help us build momentum.
      </p>
    </div>
  );
};

export default ProgressCircle;
