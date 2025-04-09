
import { BadgeCheck, Plus, Search } from "lucide-react";
import CandidateUploadDialog from "@/components/candidates/CandidateUploadDialog";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Pipeline = () => {
  // We're adding state to store the job ID from the URL
  const [jobId, setJobId] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    // Extract job ID from URL if present
    const path = window.location.pathname;
    const match = path.match(/\/jobs\/([^\/]+)\/pipeline/);
    if (match && match[1]) {
      setJobId(match[1]);
    }
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-hatch-coral to-hatch-blue bg-clip-text text-transparent">Candidates Pipeline</h1>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search candidates..." 
              className="pl-9 pr-4 py-2 bg-white border border-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-hatch-blue/20 w-64"
            />
          </div>
          
          <CandidateUploadDialog 
            jobId={jobId}
            trigger={
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-hatch-coral to-hatch-blue text-white rounded-lg shadow-md hover:shadow-lg transition-all">
                <Plus size={18} />
                <span>Add Candidate</span>
              </button>
            }
          />
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">Manage your candidate pipeline here.</p>
          
          <div className="flex items-center gap-2">
            <select className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-sm">
              <option>All Stages</option>
              <option>Applied</option>
              <option>Screening</option>
              <option>Interview</option>
              <option>Offer</option>
            </select>
            
            <select className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-sm">
              <option>All Jobs</option>
              <option>Senior Developer</option>
              <option>UX Designer</option>
              <option>Marketing Lead</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 mt-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-5 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50 flex items-center gap-4 group hover:border-hatch-blue/20">
              <div className="h-12 w-12 rounded-full bg-hatch-gold/10 flex items-center justify-center">
                <BadgeCheck className="text-hatch-gold" size={22} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium group-hover:text-hatch-coral transition-colors">Alex Johnson</h3>
                <p className="text-sm text-gray-500">Applied for Senior Developer • 3 days ago</p>
              </div>
              <div className="px-3 py-1 bg-hatch-blue/10 text-hatch-blue text-sm font-medium rounded-full">
                Screening
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pipeline;
