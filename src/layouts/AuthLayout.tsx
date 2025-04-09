
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
  useSidebar,
  SidebarRail
} from "@/components/ui/sidebar";
import { LayoutDashboard, Briefcase, Users, Settings, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import Logo from "@/components/Logo";

// Main AuthLayout component that handles authentication logic
const AuthLayout = () => {
  const { user, isInitialized } = useAuthStore();
  const navigate = useNavigate();
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

  // Wrap the layout in SidebarProvider to make useSidebar hook available
  return (
    <SidebarProvider defaultOpen={true}>
      <AuthLayoutContent currentPath={pathname} />
    </SidebarProvider>
  );
};

// Separate component for the layout content to use useSidebar hook safely
const AuthLayoutContent = ({ currentPath }: { currentPath: string }) => {
  const { state } = useSidebar();
  
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-gray-50 to-hatch-lightBlue/10">
      <AppSidebar currentPath={currentPath} />
      
      {/* Adding SidebarRail for better control of collapsed sidebar */}
      <SidebarRail className="z-30" />
      
      <main className={`flex-1 p-8 overflow-auto animate-fade-in transition-all duration-200 ${state === "collapsed" ? "ml-[70px]" : ""}`}>
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

// Separate sidebar component for better organization
const AppSidebar = ({ 
  currentPath
}: { 
  currentPath: string;
}) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { state, toggleSidebar } = useSidebar();
  
  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  // Determine active state based on current path
  const isActive = (path: string) => currentPath.startsWith(path);

  return (
    <Sidebar 
      className="border-r shadow-lg bg-gradient-to-b from-hatch-blue/10 to-hatch-coral/5 backdrop-blur-sm fixed h-full transition-all duration-200" 
      collapsible="icon" // Keep icons visible when collapsed
    >
      {/* Sidebar header with logo and collapse button */}
      <SidebarHeader className={`flex items-center justify-between px-5 py-5 border-b border-hatch-blue/10 ${state === "collapsed" ? "px-3" : ""}`}>
        <div className="flex items-center">
          <Logo variant={state === "collapsed" ? "short" : "long"} className={`text-2xl ${state === "collapsed" ? "mx-auto" : ""}`} />
        </div>
        
        {/* Collapse button positioned at the right side */}
        <button
          onClick={toggleSidebar}
          className={`p-1.5 rounded-md hover:bg-hatch-blue/10 text-hatch-blue transition-colors ${state === "collapsed" ? "absolute right-1.5" : ""}`}
          aria-label={state === "collapsed" ? "Expand sidebar" : "Collapse sidebar"}
        >
          {state === "collapsed" ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </SidebarHeader>
      
      {/* Main sidebar content with menu groups */}
      <SidebarContent className={`px-3 py-4 ${state === "collapsed" ? "px-2" : ""}`}>
        <SidebarGroup>
          <SidebarGroupLabel className={`text-hatch-blue font-medium ml-2 mb-3 ${state === "collapsed" ? "hidden" : ""}`}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="mb-2">
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive("/dashboard")}
                  className={`hover:bg-gradient-to-r hover:from-hatch-coral/5 hover:to-hatch-blue/5 rounded-xl transition-all duration-200 
                    data-[active=true]:bg-gradient-to-r data-[active=true]:from-hatch-coral/15 data-[active=true]:to-hatch-blue/15
                    ${state === "collapsed" ? "justify-center" : ""}`}
                  tooltip="Dashboard"
                >
                  <Link to="/dashboard" className={`flex items-center gap-4 px-4 py-3 ${state === "collapsed" ? "px-2 py-3 gap-0" : ""}`}>
                    <div className={`p-2 bg-hatch-coral/10 rounded-lg ${state === "collapsed" ? "mx-auto" : ""}`}>
                      <LayoutDashboard className="text-hatch-coral" size={20} />
                    </div>
                    {state !== "collapsed" && <span className="font-medium">Dashboard</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem className="mb-2">
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive("/jobs")}
                  className={`hover:bg-gradient-to-r hover:from-hatch-coral/5 hover:to-hatch-blue/5 rounded-xl transition-all duration-200 
                    data-[active=true]:bg-gradient-to-r data-[active=true]:from-hatch-coral/15 data-[active=true]:to-hatch-blue/15
                    ${state === "collapsed" ? "justify-center" : ""}`}
                  tooltip="Jobs"
                >
                  <Link to="/jobs" className={`flex items-center gap-4 px-4 py-3 ${state === "collapsed" ? "px-2 py-3 gap-0" : ""}`}>
                    <div className={`p-2 bg-hatch-blue/10 rounded-lg ${state === "collapsed" ? "mx-auto" : ""}`}>
                      <Briefcase className="text-hatch-blue" size={20} />
                    </div>
                    {state !== "collapsed" && <span className="font-medium">Jobs</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem className="mb-2">
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive("/pipeline")}
                  className={`hover:bg-gradient-to-r hover:from-hatch-coral/5 hover:to-hatch-blue/5 rounded-xl transition-all duration-200 
                    data-[active=true]:bg-gradient-to-r data-[active=true]:from-hatch-coral/15 data-[active=true]:to-hatch-blue/15
                    ${state === "collapsed" ? "justify-center" : ""}`}
                  tooltip="Candidates"
                >
                  <Link to="/pipeline" className={`flex items-center gap-4 px-4 py-3 ${state === "collapsed" ? "px-2 py-3 gap-0" : ""}`}>
                    <div className={`p-2 bg-hatch-gold/10 rounded-lg ${state === "collapsed" ? "mx-auto" : ""}`}>
                      <Users className="text-hatch-gold" size={20} />
                    </div>
                    {state !== "collapsed" && <span className="font-medium">Candidates</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive("/settings")}
                  className={`hover:bg-gradient-to-r hover:from-hatch-coral/5 hover:to-hatch-blue/5 rounded-xl transition-all duration-200 
                    data-[active=true]:bg-gradient-to-r data-[active=true]:from-hatch-coral/15 data-[active=true]:to-hatch-blue/15
                    ${state === "collapsed" ? "justify-center" : ""}`}
                  tooltip="Settings"
                >
                  <Link to="/settings" className={`flex items-center gap-4 px-4 py-3 ${state === "collapsed" ? "px-2 py-3 gap-0" : ""}`}>
                    <div className={`p-2 bg-hatch-yellow/10 rounded-lg ${state === "collapsed" ? "mx-auto" : ""}`}>
                      <Settings className="text-hatch-yellow" size={20} />
                    </div>
                    {state !== "collapsed" && <span className="font-medium">Settings</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      {/* Sidebar footer with logout button */}
      <SidebarFooter className={`mt-auto p-4 border-t border-hatch-blue/10 ${state === "collapsed" ? "p-2" : ""}`}>
        <button 
          onClick={handleLogout} 
          className={`flex items-center gap-4 px-4 py-3 w-full rounded-xl text-gray-600 hover:bg-gradient-to-r hover:from-hatch-coral/5 hover:to-hatch-blue/5 transition-all ${state === "collapsed" ? "px-0 justify-center" : ""}`}
          aria-label="Log out"
          title={state === "collapsed" ? "Log out" : undefined}
        >
          <div className={`p-2 bg-gray-100 rounded-lg ${state === "collapsed" ? "mx-auto" : ""}`}>
            <LogOut size={18} className="text-gray-500" />
          </div>
          {state !== "collapsed" && <span className="font-medium">Log out</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AuthLayout;
