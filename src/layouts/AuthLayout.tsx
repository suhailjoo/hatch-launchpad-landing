
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
  SidebarGroupLabel
} from "@/components/ui/sidebar";
import { LayoutDashboard, Briefcase, Users, Settings } from "lucide-react";

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-hatch-coral"></div>
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
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

// Separate sidebar component for better organization
const AppSidebar = () => {
  return (
    <Sidebar className="border-r border-hatch-blue/10">
      <SidebarHeader className="flex items-center px-4 py-2 bg-gradient-to-r from-hatch-coral to-hatch-blue bg-clip-text">
        <h2 className="text-lg font-semibold text-transparent">Hatch</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-hatch-blue font-medium">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="hover:bg-hatch-blue/5 data-[active=true]:bg-hatch-blue/10">
                  <Link to="/dashboard">
                    <LayoutDashboard className="text-hatch-coral" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="hover:bg-hatch-blue/5 data-[active=true]:bg-hatch-blue/10">
                  <Link to="/jobs">
                    <Briefcase className="text-hatch-blue" />
                    <span>Jobs</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="hover:bg-hatch-blue/5 data-[active=true]:bg-hatch-blue/10">
                  <Link to="/pipeline">
                    <Users className="text-hatch-gold" />
                    <span>Candidates</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="hover:bg-hatch-blue/5 data-[active=true]:bg-hatch-blue/10">
                  <Link to="/settings">
                    <Settings className="text-hatch-yellow" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AuthLayout;
