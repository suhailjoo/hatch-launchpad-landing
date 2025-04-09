
const Jobs = () => {
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-hatch-coral to-hatch-blue bg-clip-text text-transparent">Jobs</h1>
      
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <p className="text-muted-foreground mb-4">Manage your job listings here.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="p-5 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50">
              <div className="h-4 w-3/4 bg-gray-200 rounded mb-3 animate-pulse"></div>
              <div className="h-3 w-1/2 bg-gray-100 rounded mb-4 animate-pulse"></div>
              <div className="h-10 w-full bg-gray-100 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
