
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/hooks/use-toast";

export type Job = {
  id: string;
  title: string;
  description: string;
  department: string;
  work_type: "in_office" | "hybrid" | "remote";
  salary_currency: "USD" | "CAD" | "EUR" | "GBP" | "INR" | "THB" | "VND" | "SGD" | "AUD";
  salary_budget: number;
  created_at: string;
};

export const useJobs = () => {
  const { user } = useAuthStore();
  
  return useQuery({
    queryKey: ["jobs"],
    queryFn: async (): Promise<Job[]> => {
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        throw new Error("Failed to get authentication session");
      }
      
      const response = await fetch("https://jaoxflaynrxgfljlorew.supabase.co/functions/v1/jobs-list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionData.session.access_token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch jobs");
      }
      
      const data = await response.json();
      return data.jobs || [];
    },
    enabled: !!user,
    meta: {
      onError: (error: Error) => {
        console.error("Error fetching jobs:", error);
        toast({
          title: "Error",
          description: "Failed to load jobs. Please try again.",
          variant: "destructive",
        });
      },
    },
  });
};
