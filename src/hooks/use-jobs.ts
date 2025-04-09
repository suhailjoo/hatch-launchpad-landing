
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/hooks/use-toast";

export type Job = {
  id: string;
  title: string;
  description: string;
  department: string;
  location: string;
  work_type: "in_office" | "hybrid" | "remote";
  salary_currency: "USD" | "CAD" | "EUR" | "GBP" | "INR" | "THB" | "VND" | "SGD" | "AUD";
  salary_budget: number;
  experience_range: {
    min: number;
    max: number;
  };
  required_skills: string[];
  created_at: string;
};

export const useJobs = () => {
  const { user, refreshSession } = useAuthStore();
  
  return useQuery({
    queryKey: ["jobs"],
    queryFn: async (): Promise<Job[]> => {
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      try {
        // Get current session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error("Session error:", sessionError);
          // Try to refresh the session
          await refreshSession();
          // Get the refreshed session
          const { data: refreshedSessionData, error: refreshError } = await supabase.auth.getSession();
          
          if (refreshError || !refreshedSessionData.session) {
            console.error("Failed to refresh session:", refreshError);
            throw new Error("Authentication session expired");
          }
          
          console.log("Session refreshed successfully");
        }
        
        if (!sessionData.session) {
          console.error("No active session found");
          throw new Error("No active session");
        }
        
        console.log("Session token available:", !!sessionData.session.access_token);
        
        const response = await fetch("https://jaoxflaynrxgfljlorew.supabase.co/functions/v1/jobs-list", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionData.session.access_token}`,
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Jobs API error:", errorData);
          
          // Handle authentication errors specifically
          if (response.status === 401) {
            console.log("Authentication error, attempting to refresh session");
            await refreshSession();
            throw new Error("Session expired. Please try again.");
          }
          
          const errorMessage = errorData.error || `Failed to fetch jobs (${response.status})`;
          throw new Error(errorMessage);
        }
        
        const data = await response.json();
        return data.jobs || [];
      } catch (error) {
        console.error("Error in jobs fetching:", error);
        throw error;
      }
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    meta: {
      onError: (error: Error) => {
        console.error("Error fetching jobs:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load jobs. Please try again.",
          variant: "destructive",
        });
      },
    },
  });
};
