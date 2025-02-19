import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface PaymentButtonProps {
  courseId: number;
  className?: string;
}

export function PaymentButton({ courseId, className }: PaymentButtonProps) {
  const { toast } = useToast();

  const handlePayment = () => {
    toast({
      title: "Coming Soon",
      description: "Платежная система находится в разработке.",
    });
  };

  return (
    <Button
      onClick={handlePayment}
      className={className}
    >
      Записаться на курс
    </Button>
  );
}