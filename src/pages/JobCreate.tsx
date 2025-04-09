
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import JobCreateForm from "@/components/jobs/JobCreateForm";

const JobCreate = () => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Link 
          to="/jobs" 
          className="flex items-center gap-1 text-gray-500 hover:text-hatch-coral transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Jobs</span>
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold bg-gradient-to-r from-hatch-coral to-hatch-blue bg-clip-text text-transparent mb-6">
        Create New Job
      </h1>
      
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>
            Enter the details for the new job posting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JobCreateForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default JobCreate;
