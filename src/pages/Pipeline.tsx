
const Pipeline = () => {
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-hatch-coral to-hatch-blue bg-clip-text text-transparent">Candidates Pipeline</h1>
      
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <p className="text-muted-foreground mb-4">Manage your candidate pipeline here.</p>
        
        <div className="grid grid-cols-1 gap-4 mt-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-5 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-hatch-gold/10 animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 w-1/4 bg-gray-200 rounded mb-3 animate-pulse"></div>
                <div className="h-3 w-1/3 bg-gray-100 rounded animate-pulse"></div>
              </div>
              <div className="h-8 w-20 bg-hatch-coral/10 rounded-full animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pipeline;
