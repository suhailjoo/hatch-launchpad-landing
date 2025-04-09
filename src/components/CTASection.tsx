
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

const CTASection = () => {
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            entry.target.classList.remove("opacity-0");
          }
        });
      },
      { threshold: 0.2 }
    );

    if (ctaRef.current) {
      observer.observe(ctaRef.current);
    }

    return () => {
      if (ctaRef.current) {
        observer.unobserve(ctaRef.current);
      }
    };
  }, []);

  return (
    <section ref={ctaRef} className="py-20 bg-gradient-to-r from-hatch-coral/80 via-hatch-coral to-hatch-coral/90 text-white opacity-0 relative overflow-hidden">
      {/* Abstract shapes in background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-white/5 blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-on-scroll">Ready to Transform Your Hiring Process?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90 animate-on-scroll" style={{ animationDelay: "0.2s" }}>
          Join thousands of companies that are hiring smarter with Hatch.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-white text-hatch-coral hover:bg-opacity-90 hover:bg-white px-8 py-6 text-lg transition-all duration-300 hover:scale-105 animate-on-scroll shadow-lg" style={{ animationDelay: "0.3s" }}>
            Start Your Free Trial
          </Button>
          <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg transition-all duration-300 hover:scale-105 animate-on-scroll" style={{ animationDelay: "0.4s" }}>
            Schedule a Demo
          </Button>
        </div>
        <div className="mt-8 animate-on-scroll" style={{ animationDelay: "0.5s" }}>
          <p className="text-white/80 text-sm">No credit card required • Cancel anytime</p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
