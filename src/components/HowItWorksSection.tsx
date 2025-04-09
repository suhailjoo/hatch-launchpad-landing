
import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Create Job Listings",
    description: "Start by creating detailed job listings with all the skills and qualifications you need.",
  },
  {
    number: "02",
    title: "AI Candidate Matching",
    description: "Our AI identifies and ranks candidates who best match your requirements.",
  },
  {
    number: "03",
    title: "Smart Screening Process",
    description: "Automated screening questions help you quickly identify top candidates.",
  },
  {
    number: "04",
    title: "Team Collaboration",
    description: "Invite team members to review candidates and provide feedback.",
  },
  {
    number: "05",
    title: "Interview & Select",
    description: "Schedule interviews and make data-driven hiring decisions.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How Hatch Works</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Our streamlined process makes hiring simple, efficient, and effective.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex mb-8 last:mb-0">
              <div className="mr-6">
                <div className="w-12 h-12 rounded-full bg-hatch-coral flex items-center justify-center text-white font-bold">
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className="ml-6 h-full border-l-2 border-dashed border-gray-300"></div>
                )}
              </div>
              <div className="pt-2 pb-8">
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600 mb-4">{step.description}</p>
                {index < steps.length - 1 && (
                  <ArrowRight className="text-hatch-coral" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
