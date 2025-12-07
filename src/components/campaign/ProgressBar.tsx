interface ProgressBarProps {
  current: number;
  goal: number;
  donors: number;
}

const ProgressBar = ({ current, goal, donors }: ProgressBarProps) => {
  const percentage = Math.min((current / goal) * 100, 100);

  return (
    <div className="space-y-3">
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-2xl font-bold text-foreground">
          ${current.toLocaleString()}
        </span>
        <span className="text-muted-foreground">
          raised of ${goal.toLocaleString()} goal
        </span>
      </div>
      <p className="text-muted-foreground">
        <span className="font-semibold text-foreground">{donors.toLocaleString()}</span> donations
      </p>
    </div>
  );
};

export default ProgressBar;
