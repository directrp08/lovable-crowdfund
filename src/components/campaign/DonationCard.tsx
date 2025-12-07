import { Heart } from "lucide-react";

interface DonationCardProps {
  name: string;
  amount: number;
  comment?: string;
  timeAgo: string;
  likes: number;
}

const DonationCard = ({ name, amount, comment, timeAgo, likes }: DonationCardProps) => {
  return (
    <div className="flex gap-3 py-4 border-b border-border last:border-b-0 animate-fade-in">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gofundme-light flex items-center justify-center">
        <Heart className="w-5 h-5 text-primary fill-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-foreground">{name}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground text-sm">{timeAgo}</span>
        </div>
        <p className="font-bold text-foreground mt-0.5">${amount}</p>
        {comment && (
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{comment}</p>
        )}
        <button className="flex items-center gap-1.5 mt-2 text-muted-foreground hover:text-primary transition-colors text-sm">
          <Heart className="w-4 h-4" />
          <span>{likes}</span>
        </button>
      </div>
    </div>
  );
};

export default DonationCard;
