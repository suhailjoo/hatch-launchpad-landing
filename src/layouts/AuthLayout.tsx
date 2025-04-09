
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
    <div className="flex min-h-screen w-full bg-gradient-to-br from-gray-50 to-hatch-lightBlue/5">
      <AppSidebar currentPath={currentPath} />
      
      {/* Adding SidebarRail for better control of collapsed sidebar */}
      <SidebarRail className="z-30" />
      
      <main className={`flex-1 p-8 overflow-auto animate-fade-in transition-all duration-300 ${state === "collapsed" ? "ml-[72px]" : ""}`}>
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
      className="border-r shadow-xl fixed h-full transition-all duration-300 ease-in-out sidebar-gradient-subtle" 
      collapsible="icon" // Keep icons visible when collapsed
    >
      {/* Sidebar header with logo and collapse button */}
      <SidebarHeader className={`flex items-center justify-between p-5 border-b border-white/10 bg-gradient-to-br from-hatch-coral/80 to-hatch-blue/80 backdrop-blur-md relative ${state === "collapsed" ? "p-3" : ""}`}>
        <div className="flex items-center">
          <Logo variant={state === "collapsed" ? "short" : "long"} className={`text-2xl ${state === "collapsed" ? "mx-auto" : ""}`} />
        </div>
        
        {/* Collapse button positioned to avoid logo overlap */}
        <button
          onClick={toggleSidebar}
          className={`p-1.5 rounded-full text-white/70 hover:bg-white/10 hover:text-white transition-colors absolute ${state === "collapsed" ? "right-1.5 top-1.5" : "right-4"}`}
          aria-label={state === "collapsed" ? "Expand sidebar" : "Collapse sidebar"}
        >
          {state === "collapsed" ? <ChevronRight size={16} /> : <ChevronLeft size={18} />}
        </button>
      </SidebarHeader>
      
      {/* Main sidebar content with menu groups */}
      <SidebarContent className={`px-4 py-6 ${state === "collapsed" ? "px-2 py-4" : ""}`}>
        <SidebarGroup>
          <SidebarGroupLabel className={`text-gray-500 text-xs font-medium uppercase tracking-wider ml-2 mb-4 ${state === "collapsed" ? "hidden" : ""}`}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="mb-3">
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive("/dashboard")}
                  className={`hover:bg-gradient-to-r hover:from-hatch-coral/10 hover:to-hatch-blue/10 rounded-lg transition-all duration-200 
                    data-[active=true]:bg-gradient-to-r data-[active=true]:from-hatch-coral/15 data-[active=true]:to-hatch-blue/15 data-[active=true]:backdrop-blur-sm data-[active=true]:border data-[active=true]:border-white/10 data-[active=true]:shadow-md
                    ${state === "collapsed" ? "justify-center" : ""}`}
                  tooltip="Dashboard"
                >
                  <Link to="/dashboard" className={`flex items-center gap-4 px-4 py-3 text-gray-700 hover:text-gray-900 ${state === "collapsed" ? "px-0 justify-center" : ""}`}>
                    <div className={`p-2 bg-hatch-coral/10 backdrop-blur-sm rounded-lg shadow-sm ${state === "collapsed" ? "mx-auto" : ""}`}>
                      <LayoutDashboard className="text-hatch-coral" size={20} />
                    </div>
                    {state !== "collapsed" && <span className="font-medium">Dashboard</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem className="mb-3">
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive("/jobs")}
                  className={`hover:bg-gradient-to-r hover:from-hatch-coral/10 hover:to-hatch-blue/10 rounded-lg transition-all duration-200 
                    data-[active=true]:bg-gradient-to-r data-[active=true]:from-hatch-coral/15 data-[active=true]:to-hatch-blue/15 data-[active=true]:backdrop-blur-sm data-[active=true]:border data-[active=true]:border-white/10 data-[active=true]:shadow-md
                    ${state === "collapsed" ? "justify-center" : ""}`}
                  tooltip="Jobs"
                >
                  <Link to="/jobs" className={`flex items-center gap-4 px-4 py-3 text-gray-700 hover:text-gray-900 ${state === "collapsed" ? "px-0 justify-center" : ""}`}>
                    <div className={`p-2 bg-hatch-blue/10 backdrop-blur-sm rounded-lg shadow-sm ${state === "collapsed" ? "mx-auto" : ""}`}>
                      <Briefcase className="text-hatch-blue" size={20} />
                    </div>
                    {state !== "collapsed" && <span className="font-medium">Jobs</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem className="mb-3">
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive("/pipeline")}
                  className={`hover:bg-gradient-to-r hover:from-hatch-coral/10 hover:to-hatch-blue/10 rounded-lg transition-all duration-200 
                    data-[active=true]:bg-gradient-to-r data-[active=true]:from-hatch-coral/15 data-[active=true]:to-hatch-blue/15 data-[active=true]:backdrop-blur-sm data-[active=true]:border data-[active=true]:border-white/10 data-[active=true]:shadow-md
                    ${state === "collapsed" ? "justify-center" : ""}`}
                  tooltip="Candidates"
                >
                  <Link to="/pipeline" className={`flex items-center gap-4 px-4 py-3 text-gray-700 hover:text-gray-900 ${state === "collapsed" ? "px-0 justify-center" : ""}`}>
                    <div className={`p-2 bg-hatch-gold/10 backdrop-blur-sm rounded-lg shadow-sm ${state === "collapsed" ? "mx-auto" : ""}`}>
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
                  className={`hover:bg-gradient-to-r hover:from-hatch-coral/10 hover:to-hatch-blue/10 rounded-lg transition-all duration-200 
                    data-[active=true]:bg-gradient-to-r data-[active=true]:from-hatch-coral/15 data-[active=true]:to-hatch-blue/15 data-[active=true]:backdrop-blur-sm data-[active=true]:border data-[active=true]:border-white/10 data-[active=true]:shadow-md
                    ${state === "collapsed" ? "justify-center" : ""}`}
                  tooltip="Settings"
                >
                  <Link to="/settings" className={`flex items-center gap-4 px-4 py-3 text-gray-700 hover:text-gray-900 ${state === "collapsed" ? "px-0 justify-center" : ""}`}>
                    <div className={`p-2 bg-hatch-yellow/10 backdrop-blur-sm rounded-lg shadow-sm ${state === "collapsed" ? "mx-auto" : ""}`}>
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
      <SidebarFooter className={`mt-auto p-5 border-t border-gray-100/20 ${state === "collapsed" ? "p-3" : ""}`}>
        <button 
          onClick={handleLogout} 
          className={`flex items-center gap-4 px-4 py-3 w-full rounded-lg text-gray-600 hover:bg-red-50 transition-all hover:text-red-600 ${state === "collapsed" ? "px-0 justify-center" : ""}`}
          aria-label="Log out"
          title={state === "collapsed" ? "Log out" : undefined}
        >
          <div className={`p-2 bg-red-50 rounded-lg ${state === "collapsed" ? "mx-auto" : ""}`}>
            <LogOut size={18} className="text-red-500" />
          </div>
          {state !== "collapsed" && <span className="font-medium">Log out</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AuthLayout;
