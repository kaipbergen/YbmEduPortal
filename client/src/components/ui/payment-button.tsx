import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface PaymentButtonProps {
  courseId: number;
  className?: string;
  onClick?: () => void;
}

export function PaymentButton({ courseId, className, onClick }: PaymentButtonProps) {
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
      onClick={onClick ? onClick : handlePayment}
      className={className}
    >
      {t("courses.enrollNow")}
    </Button>
  );
}