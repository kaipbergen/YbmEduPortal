import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function PaymentCancel() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <CardTitle>Payment Cancelled</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Your payment was cancelled. No charges were made.
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
