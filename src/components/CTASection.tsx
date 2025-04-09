
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-hatch-coral/90 to-hatch-coral text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Hiring Process?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
          Join thousands of companies that are hiring smarter with Hatch.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-white text-hatch-coral hover:bg-opacity-90 hover:bg-white px-8 py-6 text-lg">
            Start Your Free Trial
          </Button>
          <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
            Schedule a Demo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
