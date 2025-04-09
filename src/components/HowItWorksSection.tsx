
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

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
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const steps = entry.target.querySelectorAll(".step-item");
            steps.forEach((step, index) => {
              setTimeout(() => {
                step.classList.add("animate-fade-in-right");
                step.classList.remove("opacity-0");
              }, index * 200);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (stepsRef.current) {
      observer.observe(stepsRef.current);
    }

    return () => {
      if (stepsRef.current) {
        observer.unobserve(stepsRef.current);
      }
    };
  }, []);

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-r from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 opacity-0 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-hatch-blue to-hatch-coral bg-clip-text text-transparent">
            How Hatch Works
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Our streamlined process makes hiring simple, efficient, and effective.
          </p>
        </div>

        <div ref={stepsRef} className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex mb-8 last:mb-0 step-item opacity-0">
              <div className="mr-6 relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-hatch-coral to-hatch-blue flex items-center justify-center text-white font-bold shadow-lg transition-transform duration-300 hover:scale-110">
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className="ml-6 h-full border-l-2 border-dashed border-gray-300"></div>
                )}
              </div>
              <div className="pt-2 pb-8 bg-white/50 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-gray-100 w-full transition-all duration-300 hover:shadow-md hover:bg-white">
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600 mb-4">{step.description}</p>
                {index < steps.length - 1 && (
                  <ArrowRight className="text-hatch-coral animate-pulse" />
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
