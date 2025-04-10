
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { UploadCloud } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { RecruitingWorkflow } from "@/workflows/custom/RecruitingWorkflow";

interface CandidateUploadDialogProps {
  jobId?: string;
  trigger: React.ReactNode;
}

const CandidateUploadDialog: React.FC<CandidateUploadDialogProps> = ({ jobId, trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [candidateEmail, setCandidateEmail] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [orgId, setOrgId] = useState<string | null>(null);
  
  // Fetch organization ID from user metadata when component mounts
  useEffect(() => {
    const fetchOrgId = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user && user.user_metadata && user.user_metadata.orgId) {
        setOrgId(user.user_metadata.orgId as string);
      }
    };
    
    fetchOrgId();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setResumeFile(file || null);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCandidateEmail(e.target.value);
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    
    try {
      if (!orgId) {
        throw new Error("Organization ID not found.");
      }
      
      if (!jobId) {
        throw new Error("Job ID not found.");
      }

      // Upload resume to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const filePath = `resumes/${uuidv4()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Error uploading resume:", uploadError);
        toast({
          title: "Upload Failed",
          description: "Failed to upload resume to storage.",
          variant: "destructive",
        });
        return;
      }

      const resumeUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/resumes/${filePath}`;

      // Create candidate record in database
      const candidateData = {
        email: candidateEmail,
        resume_url: resumeUrl,
        job_id: jobId,
        org_id: orgId,
      };

      const { data: insertData, error: insertError } = await supabase
        .from('candidates')
        .insert(candidateData)
        .select()
        .single();

      if (insertError) {
        console.error("Error creating candidate:", insertError);
        toast({
          title: "Candidate Creation Failed",
          description: "Failed to create candidate record.",
          variant: "destructive",
        });
        return;
      }
      
      // Process the candidate using our custom workflow
      await RecruitingWorkflow.processCandidate({
        resume_url: resumeUrl,
        candidate_id: insertData.id,
        org_id: orgId
      });

      // Close dialog and show success message
      setIsOpen(false);
      toast({
        title: "Candidate Added",
        description: "Candidate added successfully!",
      });
      
    } catch (error) {
      console.error("Error uploading candidate:", error);
      toast({
        title: "Upload Error",
        description: error instanceof Error ? error.message : "Failed to upload candidate.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Candidate</DialogTitle>
          <DialogDescription>
            Upload a resume to automatically parse candidate information.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input 
              id="email" 
              value={candidateEmail}
              onChange={handleEmailChange}
              className="col-span-3" 
              type="email" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="resume" className="text-right">
              Resume
            </Label>
            <Input
              id="resume"
              type="file"
              className="col-span-3"
              onChange={handleFileChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="button" 
            onClick={() => {
              if (resumeFile) {
                handleFileUpload(resumeFile);
              } else {
                toast({
                  title: "No Resume Selected",
                  description: "Please select a resume file to upload.",
                  variant: "destructive",
                });
              }
            }}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <UploadCloud className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Candidate"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateUploadDialog;
