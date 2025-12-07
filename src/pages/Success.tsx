import { Link } from "react-router-dom";
import { CheckCircle, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Success = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-center">
          <Link to="/" className="text-xl font-bold text-primary">
            gofundme
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center py-12 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gofundme-light flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-primary" />
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-3">
            Thank you for your donation!
          </h1>

          <p className="text-muted-foreground mb-8">
            Your generous contribution will help make a real difference. The organizer and beneficiary will be notified of your support.
          </p>

          <div className="space-y-4">
            <Button variant="donate" size="lg" className="w-full gap-2">
              <Share2 className="w-5 h-5" />
              Share this campaign
            </Button>

            <Link to="/">
              <Button variant="outline" size="lg" className="w-full">
                Return to campaign
              </Button>
            </Link>
          </div>

          <div className="mt-12 p-6 bg-gofundme-gray rounded-lg">
            <div className="flex items-center justify-center gap-2 text-primary mb-2">
              <Heart className="w-5 h-5 fill-primary" />
              <span className="font-semibold">Every donation counts</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Consider sharing this campaign to help reach more people who might want to contribute.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Success;
