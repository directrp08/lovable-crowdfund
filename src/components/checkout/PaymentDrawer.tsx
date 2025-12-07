import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, ExpressCheckoutElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "sonner";
interface PaymentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  clientSecret: string | null;
  publishableKey: string | null;
  onPaymentComplete: () => void;
}
const CheckoutForm = ({
  totalAmount,
  onPaymentComplete,
  onClose
}: {
  totalAmount: number;
  onPaymentComplete: () => void;
  onClose: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);
    setMessage(null);
    const {
      error
    } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`
      }
    });
    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "An error occurred");
      } else {
        setMessage("An unexpected error occurred.");
      }
      setIsLoading(false);
    }
  };
  const handleExpressCheckoutConfirm = async () => {
    if (!stripe || !elements) return;
    setIsLoading(true);
    const {
      error
    } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`
      }
    });
    if (error) {
      setMessage(error.message || "An error occurred");
      setIsLoading(false);
    }
  };
  return <div className="p-6 overflow-y-auto max-h-[70vh]">
      {/* Amount Display */}
      <div className="text-center mb-6">
        
      </div>

      {/* Express Checkout */}
      <div className="mb-4">
        <p className="text-sm font-medium text-foreground mb-3">Express Checkout</p>
        <ExpressCheckoutElement onConfirm={handleExpressCheckoutConfirm} options={{
        buttonType: {
          applePay: 'donate',
          googlePay: 'donate'
        },
        buttonTheme: {
          applePay: 'black',
          googlePay: 'black'
        },
        layout: {
          maxColumns: 1,
          maxRows: 4,
          overflow: 'auto'
        }
      }} />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground uppercase tracking-wide">Or pay with card</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Payment Element Form */}
      <form onSubmit={handleSubmit}>
        <PaymentElement options={{
        layout: {
          type: 'accordion',
          defaultCollapsed: false,
          radios: true,
          spacedAccordionItems: true
        },
        paymentMethodOrder: ['card', 'cashapp', 'afterpay_clearpay', 'us_bank_account', 'link']
      }} />

        {message && <div className="mt-4 p-3 bg-destructive/10 text-destructive text-sm rounded-lg">
            {message}
          </div>}

        <Button variant="donate" size="xl" className="w-full mt-6" type="submit" disabled={isLoading || !stripe || !elements}>
          {isLoading ? "Processing..." : `Donate $${totalAmount.toFixed(2)}`}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground text-center mt-4">
        Your donation is secure and encrypted
      </p>
    </div>;
};
const PaymentDrawer = ({
  isOpen,
  onClose,
  totalAmount,
  clientSecret,
  publishableKey,
  onPaymentComplete
}: PaymentDrawerProps) => {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  useEffect(() => {
    if (publishableKey && !stripePromise) {
      setStripePromise(loadStripe(publishableKey));
    }
  }, [publishableKey]);
  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#4a9d44',
      borderRadius: '8px'
    }
  };
  return <>
      {/* Overlay */}
      <div className={`fixed inset-0 bg-foreground/60 z-50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={onClose} />

      {/* Bottom Drawer */}
      <div className={`fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl shadow-large z-50 transition-transform duration-300 ease-out ${isOpen ? "translate-y-0" : "translate-y-full"}`} style={{
      maxHeight: '90vh'
    }}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-4">
          <h2 className="text-xl font-bold text-foreground">Complete Your Donation</h2>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {clientSecret && stripePromise ? <Elements stripe={stripePromise} options={{
        clientSecret,
        appearance
      }}>
            <CheckoutForm totalAmount={totalAmount} onPaymentComplete={onPaymentComplete} onClose={onClose} />
          </Elements> : <div className="p-6 flex items-center justify-center min-h-[200px]">
            <div className="text-muted-foreground">Loading payment form...</div>
          </div>}
      </div>
    </>;
};
export default PaymentDrawer;