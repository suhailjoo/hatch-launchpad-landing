
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "long" | "short";
  className?: string;
}

const Logo = ({ variant = "long", className }: LogoProps) => {
  return (
    <div className={cn("font-roboto font-bold text-hatch-coral", className)}>
      {variant === "long" ? (
        <span>hatch.</span>
      ) : (
        <span>h.</span>
      )}
    </div>
  );
};

export default Logo;
