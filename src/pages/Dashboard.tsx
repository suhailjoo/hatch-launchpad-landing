
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const Dashboard = () => {
  const { user, orgId, isInitialized, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if user is not authenticated and initialization is complete
    if (isInitialized && !user) {
      navigate("/auth");
    }
  }, [user, isInitialized, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  if (!user || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-hatch-blue"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-hatch-coral to-hatch-blue bg-clip-text text-transparent">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-gradient-to-r from-hatch-coral to-hatch-blue text-white rounded-md hover:opacity-90 transition-opacity shadow-md"
        >
          Logout
        </button>
      </div>
      
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <div className="px-4 py-5">
          <h2 className="text-lg leading-6 font-medium text-gray-900">
            User Information
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Your account details and organization information.
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 rounded-md my-2">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.email}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">User ID</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.id}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 rounded-md my-2">
              <dt className="text-sm font-medium text-gray-500">
                Organization ID
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {orgId}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
