import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProgressCircle from "@/components/checkout/ProgressCircle";
import AmountSelector from "@/components/checkout/AmountSelector";
import TipSlider from "@/components/checkout/TipSlider";
import PaymentDrawer from "@/components/checkout/PaymentDrawer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Checkout = () => {
  const navigate = useNavigate();
  const [donationType, setDonationType] = useState<"once" | "monthly">("once");
  const [selectedAmount, setSelectedAmount] = useState<number>(200);
  const [customAmount, setCustomAmount] = useState("");
  const [tipPercent, setTipPercent] = useState(16.5);
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [publishableKey, setPublishableKey] = useState<string | null>(null);
  
  const amounts = [50, 100, 200, 300, 500, 1000];
  
  const getEffectiveAmount = () => {
    if (customAmount) {
      return parseFloat(customAmount) || 0;
    }
    return selectedAmount || 0;
  };
  
  const effectiveAmount = getEffectiveAmount();
  const tipAmount = effectiveAmount * tipPercent / 100;
  const totalAmount = effectiveAmount + tipAmount;
  
  const handleSelectAmount = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };
  
  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    if (value) {
      setSelectedAmount(0);
    }
  };
  
  const handleContinue = async () => {
    if (effectiveAmount <= 0) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-payment-intent", {
        body: {
          amount: effectiveAmount,
          tipAmount: tipAmount,
        },
      });

      if (error) throw error;
      
      if (data?.clientSecret && data?.publishableKey) {
        setClientSecret(data.clientSecret);
        setPublishableKey(data.publishableKey);
        setIsDrawerOpen(true);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to initialize payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentComplete = () => {
    setIsDrawerOpen(false);
    navigate("/success");
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setClientSecret(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Link to="/" className="text-xl font-bold text-brand-logo">
            gofundme
          </Link>
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Sign in
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-xl mx-auto px-4 py-8">
        {/* Progress Circle */}
        <ProgressCircle percentage={57} remaining={21390} title="Help little Sophia fight Leukemia 🙏❤️" />

        {/* Donation Type */}
        <div className="mt-8 space-y-3">
          <div className="flex gap-3">
            <Button 
              variant={donationType === "once" ? "default" : "outline"} 
              className="flex-1 h-12" 
              onClick={() => setDonationType("once")}
            >
              Give once
            </Button>
            <Button 
              variant={donationType === "monthly" ? "default" : "outline"} 
              className="flex-1 h-12" 
              onClick={() => setDonationType("monthly")}
            >
              Monthly ♥
            </Button>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Boost your impact by giving monthly{" "}
            <span className="text-primary">↗</span>
          </p>
        </div>

        {/* Amount Selection */}
        <div className="mt-8">
          <AmountSelector 
            amounts={amounts} 
            selectedAmount={selectedAmount} 
            customAmount={customAmount} 
            suggestedAmount={200} 
            onSelectAmount={handleSelectAmount} 
            onCustomAmountChange={handleCustomAmountChange} 
          />
        </div>

        {/* Tip Slider */}
        <div className="mt-6">
          <TipSlider tipPercent={tipPercent} onTipChange={setTipPercent} />
        </div>

        {/* Continue Button */}
        <div className="mt-8">
          <Button 
            variant="donate" 
            size="xl" 
            className="w-full" 
            onClick={handleContinue} 
            disabled={effectiveAmount <= 0 || isLoading}
          >
            {isLoading ? "Loading..." : effectiveAmount > 0 ? `Continue - $${totalAmount.toFixed(2)}` : "Continue"}
          </Button>
        </div>
      </main>

      {/* Payment Drawer */}
      <PaymentDrawer 
        isOpen={isDrawerOpen} 
        onClose={handleCloseDrawer} 
        totalAmount={totalAmount} 
        clientSecret={clientSecret}
        publishableKey={publishableKey}
        onPaymentComplete={handlePaymentComplete} 
      />
    </div>
  );
};

export default Checkout;
