
const Settings = () => {
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-hatch-coral to-hatch-blue bg-clip-text text-transparent">Settings</h1>
      
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <p className="text-muted-foreground mb-6">Manage your account settings here.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-medium text-lg mb-3">Profile Settings</h3>
            <p className="text-sm text-gray-500 mb-4">Update your profile information and preferences</p>
            <div className="h-10 w-full bg-gray-100 rounded animate-pulse"></div>
          </div>
          
          <div className="p-5 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-medium text-lg mb-3">Account Security</h3>
            <p className="text-sm text-gray-500 mb-4">Manage your password and security settings</p>
            <div className="h-10 w-full bg-gray-100 rounded animate-pulse"></div>
          </div>
          
          <div className="p-5 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-medium text-lg mb-3">Notifications</h3>
            <p className="text-sm text-gray-500 mb-4">Configure how you receive notifications</p>
            <div className="h-10 w-full bg-gray-100 rounded animate-pulse"></div>
          </div>
          
          <div className="p-5 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-medium text-lg mb-3">Billing</h3>
            <p className="text-sm text-gray-500 mb-4">Manage your subscription and payment methods</p>
            <div className="h-10 w-full bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
