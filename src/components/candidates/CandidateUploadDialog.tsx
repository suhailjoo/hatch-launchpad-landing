
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { z } from 'zod';

interface CandidateUploadDialogProps {
  trigger?: React.ReactNode;
  jobId?: string;
}

// Validation schema
const candidateSchema = z.object({
  email: z.string().email().optional().or(z.literal('')),
  resume_url: z.string().url(),
  job_id: z.string().uuid(),
  org_id: z.string().uuid(),
  status: z.literal('pending')
});

type CandidateInsert = z.infer<typeof candidateSchema>;

const CandidateUploadDialog: React.FC<CandidateUploadDialogProps> = ({ 
  trigger,
  jobId 
}) => {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { toast } = useToast();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true,
    onDrop: (acceptedFiles) => {
      setFiles(prev => [...prev, ...acceptedFiles]);
    }
  });

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one resume to upload",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);
    
    try {
      // 1. Get current user and org_id
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Get the org_id from the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('org_id')
        .eq('user_id', user.id)
        .single();
      
      if (userError || !userData) {
        throw new Error("Failed to fetch user organization");
      }
      
      const orgId = userData.org_id;
      const currentJobId = jobId || ''; // Use provided jobId or empty string for now
      
      if (!orgId) {
        throw new Error("User has no organization");
      }
      
      if (!currentJobId) {
        throw new Error("No job ID provided");
      }
      
      // Start uploading files one by one
      const results = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(Math.floor((i / files.length) * 50)); // First half of progress is for uploads
        
        // 2. Upload file to Supabase Storage
        const timestamp = new Date().getTime();
        const filePath = `${orgId}/${timestamp}_${file.name.replace(/\s+/g, '_')}`;
        
        const { data: fileData, error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(filePath, file);
        
        if (uploadError) {
          console.error("Error uploading file:", uploadError);
          toast({
            title: "Upload failed",
            description: `Failed to upload ${file.name}: ${uploadError.message}`,
            variant: "destructive"
          });
          continue; // Skip to next file
        }
        
        // 3. Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('resumes')
          .getPublicUrl(filePath);
        
        // 4. Insert candidate record
        const candidateData: CandidateInsert = {
          email: email || undefined,
          resume_url: publicUrl,
          job_id: currentJobId,
          org_id: orgId,
          status: 'pending'
        };
        
        // Validate data with Zod
        try {
          candidateSchema.parse(candidateData);
        } catch (validationError) {
          console.error("Validation error:", validationError);
          toast({
            title: "Validation Error",
            description: "Invalid candidate data format",
            variant: "destructive"
          });
          continue; // Skip to next file
        }
        
        const { data: candidate, error: insertError } = await supabase
          .from('candidates')
          .insert(candidateData)
          .select('id')
          .single();
        
        if (insertError || !candidate) {
          console.error("Error inserting candidate:", insertError);
          toast({
            title: "Database Error",
            description: `Failed to create candidate record for ${file.name}`,
            variant: "destructive"
          });
          continue; // Skip to next file
        }
        
        setUploadProgress(50 + Math.floor((i / files.length) * 50)); // Second half is for DB operations
        
        // 5. Create workflow job for resume parsing
        const workflowData = {
          job_type: 'parse_resume',
          candidate_id: candidate.id,
          org_id: orgId,
          job_id: currentJobId,
          status: 'pending'
        };
        
        const { error: workflowError } = await supabase
          .from('workflow_jobs')
          .insert(workflowData);
        
        if (workflowError) {
          console.error("Error creating workflow job:", workflowError);
          toast({
            title: "Workflow Error",
            description: "Failed to create parsing workflow",
            variant: "destructive"
          });
          // Continue anyway since the candidate was created
        }
        
        results.push(candidate.id);
      }
      
      // Final success message
      if (results.length > 0) {
        toast({
          title: "Upload Successful",
          description: `Successfully uploaded ${results.length} of ${files.length} résumés`,
        });
        
        // Reset form state
        setFiles([]);
        setEmail('');
        setOpen(false);
      } else {
        toast({
          title: "Upload Failed",
          description: "Failed to upload any résumés",
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error("Upload process error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    // Reset state after closing
    setFiles([]);
    setEmail('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="flex items-center gap-2">
            <Upload size={18} />
            <span>Upload Résumés</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Upload Candidate Résumés</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors text-center ${
              isDragActive 
                ? 'border-hatch-blue bg-hatch-blue/5' 
                : 'border-gray-200 hover:border-hatch-blue/50 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-hatch-blue/10 flex items-center justify-center">
                <Upload className="text-hatch-blue" size={24} />
              </div>
              {isDragActive ? (
                <p className="text-hatch-blue font-medium">Drop the files here...</p>
              ) : (
                <>
                  <p className="font-medium">Drag & drop résumé files here</p>
                  <p className="text-sm text-gray-500">or click to browse files</p>
                  <p className="text-xs text-gray-400 mt-1">Only PDF files are accepted</p>
                </>
              )}
              <Button 
                variant="outline" 
                type="button" 
                onClick={e => e.stopPropagation()} 
                className="mt-2"
              >
                Browse Files
              </Button>
            </div>
          </div>

          {files.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto">
              <h4 className="text-sm font-medium mb-2">Selected Files ({files.length})</h4>
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li key={`${file.name}-${index}`} className="flex items-center justify-between bg-white p-2 rounded border text-sm">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText size={16} className="text-hatch-coral flex-shrink-0" />
                      <span className="truncate">{file.name}</span>
                    </div>
                    <button 
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-gray-600"
                      type="button"
                      disabled={isLoading}
                    >
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Candidate Email (optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="candidate@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {isLoading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading files...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-hatch-coral to-hatch-blue h-2 rounded-full" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button variant="outline" type="button" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            type="button" 
            className="bg-gradient-to-r from-hatch-coral to-hatch-blue text-white"
            onClick={handleUpload}
            disabled={files.length === 0 || isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Uploading...
              </span>
            ) : (
              'Upload'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateUploadDialog;
