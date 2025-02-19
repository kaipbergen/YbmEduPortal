import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const sessionId = searchParams.get("session_id");

  const { data: payment, isLoading } = useQuery({
    queryKey: [`/api/payments/${sessionId}`],
    enabled: !!sessionId,
  });

  if (isLoading) {
    return <div>Verifying payment...</div>;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <CardTitle>Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Thank you for enrolling. You will receive an email with further instructions.
          </p>
          <div className="flex justify-center">
            <Button onClick={() => setLocation("/courses")}>
              Back to Courses
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
