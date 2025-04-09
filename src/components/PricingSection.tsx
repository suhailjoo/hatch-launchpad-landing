
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useEffect, useRef } from "react";

const pricingTiers = [
  {
    name: "Starter",
    price: "$49",
    description: "Perfect for small businesses just getting started with hiring.",
    features: [
      "Up to 3 active job listings",
      "Basic AI candidate matching",
      "Email support",
      "Candidate tracking",
      "Basic reporting"
    ],
    highlight: false,
    buttonText: "Start Free Trial"
  },
  {
    name: "Professional",
    price: "$99",
    description: "For growing teams with regular hiring needs.",
    features: [
      "Up to 10 active job listings",
      "Advanced AI matching & screening",
      "Team collaboration tools",
      "Priority email support",
      "Advanced analytics",
      "Custom career page",
      "Candidate assessments"
    ],
    highlight: true,
    buttonText: "Start Free Trial"
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organizations with high-volume recruiting needs.",
    features: [
      "Unlimited job listings",
      "Premium AI features",
      "Dedicated account manager",
      "API access",
      "Advanced integrations",
      "Custom workflows",
      "Bias reduction tools",
      "24/7 priority support"
    ],
    highlight: false,
    buttonText: "Contact Sales"
  }
];

const PricingSection = () => {
  const pricingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pricingCards = entry.target.querySelectorAll(".pricing-card");
            pricingCards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add("animate-fade-in");
                card.classList.remove("opacity-0");
                card.classList.add("translate-y-0");
                card.classList.remove("translate-y-8");
              }, index * 200);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (pricingRef.current) {
      observer.observe(pricingRef.current);
    }

    return () => {
      if (pricingRef.current) {
        observer.unobserve(pricingRef.current);
      }
    };
  }, []);

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 opacity-0 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-hatch-blue via-hatch-coral to-hatch-gold bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Choose the plan that fits your hiring needs. All plans include a 14-day free trial.
          </p>
        </div>

        <div ref={pricingRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <div 
              key={index} 
              className={`pricing-card opacity-0 translate-y-8 rounded-xl p-8 transition-all duration-500 ${
                tier.highlight 
                  ? "bg-gradient-to-br from-hatch-blue/10 to-hatch-blue/5 border-2 border-hatch-blue relative shadow-xl" 
                  : "bg-white/90 backdrop-blur-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1"
              }`}
            >
              {tier.highlight && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-hatch-blue to-hatch-coral text-white px-4 py-1 rounded-full font-medium text-sm shadow-md">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">{tier.price}</span>
                {tier.price !== "Custom" && <span className="text-gray-600">/month</span>}
              </div>
              <p className="text-gray-600 mb-6">{tier.description}</p>
              <div className="space-y-3 mb-8">
                {tier.features.map((feature, i) => (
                  <div key={i} className="flex items-center group">
                    <div className={`flex items-center justify-center h-5 w-5 rounded-full ${tier.highlight ? 'bg-hatch-blue' : 'bg-hatch-coral'} text-white mr-2 flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                      <Check className="h-3 w-3" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <Button 
                className={`w-full transition-all duration-300 hover:scale-105 ${
                  tier.highlight 
                    ? "bg-gradient-to-r from-hatch-blue to-hatch-coral hover:bg-hatch-blue/90 shadow-lg" 
                    : "bg-hatch-coral hover:bg-hatch-coral/90"
                } text-white`}
              >
                {tier.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
