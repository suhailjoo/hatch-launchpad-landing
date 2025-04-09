
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

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
  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Choose the plan that fits your hiring needs. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <div 
              key={index} 
              className={`rounded-xl p-8 ${
                tier.highlight 
                  ? "bg-hatch-blue/10 border-2 border-hatch-blue relative shadow-xl" 
                  : "bg-white border border-gray-200"
              }`}
            >
              {tier.highlight && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-hatch-blue text-white px-4 py-1 rounded-full font-medium text-sm">
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
                  <div key={i} className="flex items-center">
                    <Check className="h-5 w-5 text-hatch-coral mr-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <Button 
                className={`w-full ${
                  tier.highlight 
                    ? "bg-hatch-blue hover:bg-hatch-blue/90" 
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
