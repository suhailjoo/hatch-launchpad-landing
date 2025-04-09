
import { Plus, Briefcase, Building, Clock, DollarSign, Users, ExternalLink, FolderX } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useJobs } from "@/hooks/use-jobs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const Jobs = () => {
  const { data: jobs, isLoading, error } = useJobs();
  
  // Format currency with appropriate symbol
  const formatCurrency = (currency: string, amount: number) => {
    const currencySymbols: Record<string, string> = {
      USD: "$", CAD: "C$", EUR: "€", GBP: "£", INR: "₹", 
      THB: "฿", VND: "₫", SGD: "S$", AUD: "A$"
    };
    
    return `${currencySymbols[currency] || currency}${amount.toLocaleString()}`;
  };
  
  // Format work type for display
  const formatWorkType = (workType: string) => {
    const workTypeLabels: Record<string, string> = {
      remote: "Remote",
      in_office: "In Office",
      hybrid: "Hybrid"
    };
    
    return workTypeLabels[workType] || workType;
  };
  
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        <FolderX size={32} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-3">No jobs posted yet</h3>
      <p className="text-gray-500 mb-8 max-w-md">
        Start building your team by creating your first job posting. It only takes a few minutes to get started.
      </p>
      <div className="space-y-4 w-full max-w-md">
        <Link to="/jobs/create" className="w-full">
          <Button className="w-full bg-gradient-to-r from-hatch-coral to-hatch-blue text-white hover:from-hatch-coral/90 hover:to-hatch-blue/90 transition-all">
            <Plus size={18} />
            <span>Create Your First Job</span>
          </Button>
        </Link>
        <Separator className="my-4" />
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
          <h4 className="font-medium text-gray-700 mb-2">Why create a job?</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 rounded-full bg-hatch-coral/10 p-1 mt-0.5">
                <Users size={14} className="text-hatch-coral" />
              </span>
              <span>Attract qualified candidates to your open positions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 rounded-full bg-hatch-blue/10 p-1 mt-0.5">
                <Building size={14} className="text-hatch-blue" />
              </span>
              <span>Showcase your company culture and benefits</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex-shrink-0 rounded-full bg-purple-100 p-1 mt-0.5">
                <Clock size={14} className="text-purple-600" />
              </span>
              <span>Speed up your hiring process with our tools</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-hatch-coral to-hatch-blue bg-clip-text text-transparent">Jobs</h1>
        
        <Link to="/jobs/create" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-hatch-coral to-hatch-blue text-white rounded-lg shadow-md hover:shadow-lg transition-all">
          <Plus size={18} />
          <span>New Job</span>
        </Link>
      </div>
      
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <p className="text-muted-foreground">Manage your job listings here.</p>
          
          <div className="flex items-center gap-2">
            <select className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-sm">
              <option>All Departments</option>
              <option>Engineering</option>
              <option>Design</option>
              <option>Marketing</option>
            </select>
            
            <select className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-sm">
              <option>All Work Types</option>
              <option>Remote</option>
              <option>In Office</option>
              <option>Hybrid</option>
            </select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-5">
                  <Skeleton className="h-4 w-1/4 mb-3" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3 mb-2" />
                </CardContent>
                <CardFooter className="p-0">
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center p-8 text-red-500">
            <p>Failed to load jobs. Please try again later.</p>
          </div>
        ) : jobs && jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {jobs.map((job) => (
              <Card key={job.id} className="overflow-hidden hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50 group hover:border-hatch-blue/20">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                      job.work_type === 'remote' ? 'bg-blue-100 text-blue-700' : 
                      job.work_type === 'hybrid' ? 'bg-purple-100 text-purple-700' : 
                      'bg-green-100 text-green-700'
                    }`}>
                      {formatWorkType(job.work_type)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(job.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="font-medium text-lg mb-1 group-hover:text-hatch-coral transition-colors">{job.title}</h3>
                  
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                    <Building size={14} />
                    <span>{job.department}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                    <DollarSign size={14} />
                    <span>{formatCurrency(job.salary_currency, job.salary_budget)}</span>
                  </div>
                </CardContent>
                
                <CardFooter className="p-0">
                  <Link 
                    to={`/jobs/${job.id}/pipeline`}
                    className="w-full py-2 px-4 flex items-center justify-center gap-2 text-hatch-blue hover:bg-hatch-blue/5 border-t border-gray-100 transition-colors text-sm font-medium"
                  >
                    <Users size={16} />
                    <span>View Candidates</span>
                    <ExternalLink size={14} />
                  </Link>
                </CardFooter>
              </Card>
            ))}
            
            {/* Add job card */}
            <Link to="/jobs/create" className="p-5 border border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-hatch-coral/30 transition-all cursor-pointer min-h-[160px]">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                <Plus size={20} className="text-gray-500" />
              </div>
              <span className="text-sm font-medium">Create New Job</span>
            </Link>
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default Jobs;
