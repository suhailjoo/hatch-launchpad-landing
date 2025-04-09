
import { useEffect } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarProvider, 
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarFooter
} from "@/components/ui/sidebar";
import { LayoutDashboard, Briefcase, Users, Settings, LogOut } from "lucide-react";

const AuthLayout = () => {
  const { user, isInitialized } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if user is not authenticated and initialization is complete
    if (isInitialized && !user) {
      navigate("/auth");
    }
  }, [user, isInitialized, navigate]);

  // Don't render anything until auth state is initialized
  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-hatch-coral/30 to-hatch-blue/30">
        <div className="animate-spin rounded-full h-14 w-14 border-t-3 border-b-3 border-hatch-coral shadow-lg"></div>
      </div>
    );
  }

  // Don't render content for unauthenticated users
  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-gray-50 to-hatch-lightBlue/10">
        <AppSidebar />
        <main className="flex-1 p-8 overflow-auto animate-fade-in">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

// Separate sidebar component for better organization
const AppSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  
  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  return (
    <Sidebar className="border-r border-hatch-blue/10 shadow-lg glass-card">
      <SidebarHeader className="flex items-center px-6 py-4">
        <div className="bg-gradient-to-r from-hatch-coral to-hatch-blue p-0.5 rounded-lg shadow-md">
          <div className="bg-white rounded-md px-3 py-1">
            <h2 className="text-xl font-bold bg-gradient-to-r from-hatch-coral to-hatch-blue bg-clip-text text-transparent">
              Hatch
            </h2>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-hatch-blue font-medium ml-2 mt-4">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  className="hover:bg-gradient-to-r hover:from-hatch-coral/5 hover:to-hatch-blue/5 rounded-xl my-1 transition-all duration-200 data-[active=true]:bg-gradient-to-r data-[active=true]:from-hatch-coral/10 data-[active=true]:to-hatch-blue/10"
                >
                  <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2.5">
                    <div className="p-1.5 bg-hatch-coral/10 rounded-lg">
                      <LayoutDashboard className="text-hatch-coral" size={20} />
                    </div>
                    <span className="font-medium">Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  className="hover:bg-gradient-to-r hover:from-hatch-coral/5 hover:to-hatch-blue/5 rounded-xl my-1 transition-all duration-200 data-[active=true]:bg-gradient-to-r data-[active=true]:from-hatch-coral/10 data-[active=true]:to-hatch-blue/10"
                >
                  <Link to="/jobs" className="flex items-center gap-3 px-3 py-2.5">
                    <div className="p-1.5 bg-hatch-blue/10 rounded-lg">
                      <Briefcase className="text-hatch-blue" size={20} />
                    </div>
                    <span className="font-medium">Jobs</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  className="hover:bg-gradient-to-r hover:from-hatch-coral/5 hover:to-hatch-blue/5 rounded-xl my-1 transition-all duration-200 data-[active=true]:bg-gradient-to-r data-[active=true]:from-hatch-coral/10 data-[active=true]:to-hatch-blue/10"
                >
                  <Link to="/pipeline" className="flex items-center gap-3 px-3 py-2.5">
                    <div className="p-1.5 bg-hatch-gold/10 rounded-lg">
                      <Users className="text-hatch-gold" size={20} />
                    </div>
                    <span className="font-medium">Candidates</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  className="hover:bg-gradient-to-r hover:from-hatch-coral/5 hover:to-hatch-blue/5 rounded-xl my-1 transition-all duration-200 data-[active=true]:bg-gradient-to-r data-[active=true]:from-hatch-coral/10 data-[active=true]:to-hatch-blue/10"
                >
                  <Link to="/settings" className="flex items-center gap-3 px-3 py-2.5">
                    <div className="p-1.5 bg-hatch-yellow/10 rounded-lg">
                      <Settings className="text-hatch-yellow" size={20} />
                    </div>
                    <span className="font-medium">Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="mt-auto p-4">
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors w-full px-3 py-2.5 hover:bg-gray-100 rounded-xl"
        >
          <LogOut size={18} />
          <span className="font-medium">Log out</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AuthLayout;
