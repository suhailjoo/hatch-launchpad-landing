
import { Plus } from "lucide-react";
import Logo from "@/components/Logo";

const Jobs = () => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-hatch-coral to-hatch-blue bg-clip-text text-transparent">Jobs</h1>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-hatch-coral to-hatch-blue text-white rounded-lg shadow-md hover:shadow-lg transition-all">
          <Plus size={18} />
          <span>New Job</span>
        </button>
      </div>
      
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <p className="text-muted-foreground">Manage your job listings here.</p>
          
          <div className="flex items-center gap-2">
            <select className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-sm">
              <option>All Categories</option>
              <option>Engineering</option>
              <option>Design</option>
              <option>Marketing</option>
            </select>
            
            <select className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-sm">
              <option>All Status</option>
              <option>Active</option>
              <option>Draft</option>
              <option>Archived</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-5 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50 group hover:border-hatch-blue/20">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 bg-hatch-blue/10 text-hatch-blue text-xs font-medium rounded-full">
                  Full-time
                </span>
                <span className="text-xs text-gray-400">Posted 2d ago</span>
              </div>
              <h3 className="font-medium text-lg mb-1 group-hover:text-hatch-coral transition-colors">Senior Developer</h3>
              <p className="text-sm text-gray-500 mb-3">San Francisco, CA (Remote)</p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="px-2 py-0.5 bg-gray-100 rounded-full">React</span>
                <span className="px-2 py-0.5 bg-gray-100 rounded-full">TypeScript</span>
                <span className="px-2 py-0.5 bg-gray-100 rounded-full">+3</span>
              </div>
            </div>
          ))}
          
          {/* Empty job card as a placeholder for creating a new job */}
          <div className="p-5 border border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-hatch-coral/30 transition-all cursor-pointer min-h-[160px]">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
              <Plus size={20} className="text-gray-500" />
            </div>
            <span className="text-sm font-medium">Create New Job</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
