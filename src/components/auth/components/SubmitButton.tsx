
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type SubmitButtonProps = {
  isSubmitting: boolean;
  label: string;
  loadingLabel: string;
};

const SubmitButton = ({ isSubmitting, label, loadingLabel }: SubmitButtonProps) => {
  return (
    <Button
      type="submit"
      className="w-full mt-2 bg-gradient-to-r from-hatch-coral to-hatch-blue hover:from-hatch-blue hover:to-hatch-coral text-white transition-all duration-500 group"
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <span className="animate-pulse">{loadingLabel}</span>
          <span className="ml-1 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
        </>
      ) : (
        <>
          {label} <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
        </>
      )}
    </Button>
  );
};

export default SubmitButton;
