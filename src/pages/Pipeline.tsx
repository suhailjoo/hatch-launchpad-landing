import { Plus, Search } from "lucide-react";
import CandidateUploadDialog from "@/components/candidates/CandidateUploadDialog";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import CandidateCard from "@/components/candidates/CandidateCard";
import { useQuery } from "@tanstack/react-query";

const PIPELINE_STAGES = [
  "Applied", 
  "Screening", 
  "Interview", 
  "Offer", 
  "Hired", 
  "Rejected"
];

const Pipeline = () => {
  const { jobId } = useParams<{ jobId?: string }>();
  const [jobTitle, setJobTitle] = useState<string>("");
  
  const { data: candidatesData, isLoading } = useQuery({
    queryKey: ['candidates', jobId],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('candidates-by-job', {
        body: { job_id: jobId }
      });
      
      if (error) throw error;
      return data;
    },
    enabled: !!jobId
  });

  const candidatesByStage = PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage] = candidatesData?.candidates.filter(c => c.status === stage.toLowerCase()) || [];
    return acc;
  }, {} as Record<string, any[]>);

  useEffect(() => {
    if (jobId) {
      const fetchJobTitle = async () => {
        const { data, error } = await supabase
          .from('jobs')
          .select('title')
          .eq('id', jobId)
          .single();
          
        if (data && !error) {
          setJobTitle(data.title);
        }
      };
      
      fetchJobTitle();
    }
  }, [jobId]);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-hatch-coral to-hatch-blue bg-clip-text text-transparent">
          {jobId && jobTitle ? `${jobTitle} - ` : ""}Candidates Pipeline
        </h1>
        
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
              <Button 
                className="flex items-center gap-2 bg-gradient-to-r from-hatch-coral to-hatch-blue text-white hover:shadow-lg transition-all"
                disabled={!jobId}
              >
                <Plus size={18} />
                <span>Add Candidate</span>
              </Button>
            }
          />
        </div>
      </div>
      
      {!jobId && (
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-lg text-gray-600">Please select a job to view its candidate pipeline</p>
            <p className="text-sm text-gray-400 mt-2">
              Go to the <a href="/jobs" className="text-hatch-blue hover:underline">Jobs page</a> to select a job
            </p>
          </div>
        </div>
      )}
      
      {jobId && (
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">Drag candidates between stages to update their status</p>
            
            <div className="flex items-center gap-2">
              <select className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-sm">
                <option>All Stages</option>
                {PIPELINE_STAGES.map((stage) => (
                  <option key={stage}>{stage}</option>
                ))}
              </select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              Loading candidates...
            </div>
          ) : (
            <div className="w-full overflow-x-auto pb-6">
              <div className="grid grid-cols-6 gap-4 min-w-[1000px]">
                {PIPELINE_STAGES.map((stage) => (
                  <div key={stage} className="flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-700">{stage}</h3>
                      <div className="bg-gray-100 text-gray-700 text-xs font-medium rounded-full px-2 py-1">
                        {candidatesByStage[stage]?.length || 0}
                      </div>
                    </div>
                    
                    <ScrollArea className="h-[calc(100vh-320px)]">
                      <div className="pr-3">
                        {stage === "Applied" && (
                          <Button 
                            variant="outline" 
                            className="w-full mb-3 border-dashed border-gray-300 text-gray-500 hover:text-hatch-blue hover:border-hatch-blue/30"
                            disabled={!jobId}
                          >
                            <Plus size={16} className="mr-1" />
                            Add Candidate
                          </Button>
                        )}
                        
                        {candidatesByStage[stage]?.length === 0 ? (
                          <div className="text-center py-4 text-gray-400 text-sm">
                            No candidates in {stage.toLowerCase()}
                          </div>
                        ) : (
                          candidatesByStage[stage]?.map(candidate => (
                            <CandidateCard
                              key={candidate.id}
                              name={candidate.email}
                              resumeFile={candidate.resume_url}
                              status={candidate.status}
                            />
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Pipeline;
