import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface PaymentButtonProps {
  courseId: number;
  className?: string;
<<<<<<< HEAD
}

export function PaymentButton({ courseId, className }: PaymentButtonProps) {
=======
  onClick?: () => void;
}

export function PaymentButton({ courseId, className, onClick }: PaymentButtonProps) {
>>>>>>> 96e18c4 (Initial commit with latest updates)
  const { toast } = useToast();
  const { t } = useTranslation();

  const handlePayment = () => {
    toast({
      title: t("courses.comingSoon"),
      description: t("courses.paymentInProgress"),
    });
  };

  return (
    <Button
<<<<<<< HEAD
      onClick={handlePayment}
=======
      onClick={onClick ? onClick : handlePayment}
>>>>>>> 96e18c4 (Initial commit with latest updates)
      className={className}
    >
      {t("courses.enrollNow")}
    </Button>
  );
}