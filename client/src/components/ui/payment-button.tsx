import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PaymentButtonProps {
  courseId: number;
  className?: string;
}

export function PaymentButton({ courseId, className }: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    if (!stripePromise) {
      toast({
        title: "Configuration Error",
        description: "Payment system is not properly configured. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Create Stripe Checkout Session
      const response = await apiRequest("POST", "/api/payments/create-session", {
        courseId,
        email: "student@example.com", // TODO: Get from user input or auth
      });

      const data = await response.json();

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Error",
        description: error instanceof Error 
          ? error.message 
          : "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? "Processing..." : "Enroll Now"}
    </Button>
  );
}