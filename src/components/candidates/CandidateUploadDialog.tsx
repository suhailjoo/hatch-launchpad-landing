
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
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

interface CandidateUploadDialogProps {
  trigger?: React.ReactNode;
}

const CandidateUploadDialog: React.FC<CandidateUploadDialogProps> = ({ 
  trigger
}) => {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [email, setEmail] = useState('');

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

  const handleUpload = () => {
    // Just close the dialog for now - logic will be added later
    setOpen(false);
    // Reset state after closing
    setFiles([]);
    setEmail('');
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
            />
          </div>
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button variant="outline" type="button" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            type="button" 
            className="bg-gradient-to-r from-hatch-coral to-hatch-blue text-white"
            onClick={handleUpload}
            disabled={files.length === 0}
          >
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateUploadDialog;
