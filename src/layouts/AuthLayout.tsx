
import { useEffect, useState } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
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
  SidebarFooter,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { LayoutDashboard, Briefcase, Users, Settings, LogOut, ChevronRight, ChevronLeft } from "lucide-react";
import Logo from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";

const AuthLayout = () => {
  const { user, isInitialized } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { pathname } = useLocation();

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
    <SidebarProvider defaultOpen={!sidebarCollapsed}>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-gray-50 to-hatch-lightBlue/10">
        <AppSidebar 
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          currentPath={pathname}
        />
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
const AppSidebar = ({ 
  sidebarCollapsed, 
  setSidebarCollapsed,
  currentPath
}: { 
  sidebarCollapsed: boolean; 
  setSidebarCollapsed: (collapsed: boolean) => void;
  currentPath: string;
}) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { state } = useSidebar(); // Get the state from useSidebar
  
  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  // Determine active state based on current path
  const isActive = (path: string) => currentPath.startsWith(path);

  return (
    <Sidebar className="border-r shadow-lg bg-gradient-to-b from-hatch-blue/10 to-hatch-coral/5 backdrop-blur-sm">
      <SidebarHeader className="flex items-center justify-between px-6 py-4 border-b border-hatch-blue/10">
        <div className="flex items-center">
          {/* Use the correct Logo variant based on sidebar state */}
          <Logo variant={state === "collapsed" ? "short" : "long"} className="text-2xl" />
        </div>
        <SidebarTrigger 
          onClick={() => setSidebarCollapsed(state === "expanded")}
          className="p-1.5 rounded-md hover:bg-hatch-blue/10 text-hatch-blue transition-colors"
        >
          {state === "collapsed" ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </SidebarTrigger>
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
                  isActive={isActive("/dashboard")}
                  className="hover:bg-gradient-to-r hover:from-hatch-coral/5 hover:to-hatch-blue/5 rounded-xl my-1 transition-all duration-200 data-[active=true]:bg-gradient-to-r data-[active=true]:from-hatch-coral/15 data-[active=true]:to-hatch-blue/15"
                  tooltip="Dashboard"
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
                  isActive={isActive("/jobs")}
                  className="hover:bg-gradient-to-r hover:from-hatch-coral/5 hover:to-hatch-blue/5 rounded-xl my-1 transition-all duration-200 data-[active=true]:bg-gradient-to-r data-[active=true]:from-hatch-coral/15 data-[active=true]:to-hatch-blue/15"
                  tooltip="Jobs"
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
                  isActive={isActive("/pipeline")}
                  className="hover:bg-gradient-to-r hover:from-hatch-coral/5 hover:to-hatch-blue/5 rounded-xl my-1 transition-all duration-200 data-[active=true]:bg-gradient-to-r data-[active=true]:from-hatch-coral/15 data-[active=true]:to-hatch-blue/15"
                  tooltip="Candidates"
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
                  isActive={isActive("/settings")}
                  className="hover:bg-gradient-to-r hover:from-hatch-coral/5 hover:to-hatch-blue/5 rounded-xl my-1 transition-all duration-200 data-[active=true]:bg-gradient-to-r data-[active=true]:from-hatch-coral/15 data-[active=true]:to-hatch-blue/15"
                  tooltip="Settings"
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
      
      <SidebarFooter className="mt-auto p-4 border-t border-hatch-blue/10">
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-2 px-3 py-2.5 w-full rounded-xl text-gray-600 hover:bg-gradient-to-r hover:from-hatch-coral/5 hover:to-hatch-blue/5 transition-all"
          aria-label="Log out"
        >
          <div className="p-1.5 bg-gray-100 rounded-lg">
            <LogOut size={18} className="text-gray-500" />
          </div>
          <span className="font-medium">Log out</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AuthLayout;
