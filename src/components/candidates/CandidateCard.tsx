
import { BadgeCheck, MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CandidateCardProps {
  name: string;
  resumeFile: string;
  status: string;
}

const CandidateCard = ({ name, resumeFile, status }: CandidateCardProps) => {
  return (
    <Card className="mb-3 hover:shadow-md transition-shadow bg-white border-white/70">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-hatch-gold/10 flex items-center justify-center">
              <BadgeCheck className="text-hatch-gold" size={18} />
            </div>
            <h3 className="font-medium text-gray-900">{name}</h3>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal size={16} />
          </Button>
        </div>
        
        <div className="text-sm text-gray-500 mb-2">
          {resumeFile}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="px-2 py-1 text-xs bg-hatch-blue/10 text-hatch-blue font-medium rounded-full">
            {status}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateCard;
