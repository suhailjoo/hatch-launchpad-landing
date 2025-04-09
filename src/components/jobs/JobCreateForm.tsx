
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Briefcase, FileText, Building, Home, Computer, DollarSign, Loader2, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Define the form schema with Zod
const JobFormSchema = z.object({
  title: z.string().min(1, { message: "Job title is required" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  department: z.string({ required_error: "Please select a department" }),
  location: z.string().min(1, { message: "Location is required" }),
  work_type: z.enum(["in_office", "hybrid", "remote"], { 
    required_error: "Please select a work type" 
  }),
  salary_currency: z.enum(["USD", "CAD", "EUR", "GBP", "INR", "THB", "VND", "SGD", "AUD"], {
    required_error: "Please select a currency"
  }),
  salary_budget: z.coerce.number().min(0, { message: "Salary must be a positive number" }),
});

// Define the form type
type JobFormValues = z.infer<typeof JobFormSchema>;

const JobCreateForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  // Initialize form with default values
  const form = useForm<JobFormValues>({
    resolver: zodResolver(JobFormSchema),
    defaultValues: {
      title: "",
      description: "",
      department: "",
      location: "",
      work_type: undefined,
      salary_currency: undefined,
      salary_budget: 0,
    },
  });

  // Form submission handler
  const onSubmit = async (values: JobFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Get current session and access token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication error",
          description: "You must be logged in to create a job",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }
      
      // Call the Supabase Edge Function to create the job
      const response = await supabase.functions.invoke("create-job", {
        body: values,
      });
      
      if (response.error) {
        throw new Error(response.error.message || "Failed to create job");
      }
      
      // Success toast and redirect to jobs page
      toast({
        title: "Job created successfully",
        description: "Your job posting has been created",
      });
      
      // Redirect to jobs page
      navigate("/jobs");
      
    } catch (error) {
      console.error("Error creating job:", error);
      
      toast({
        title: "Error creating job",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Job Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2 relative">
                  <Briefcase className="absolute left-3 text-gray-500" size={18} />
                  <Input 
                    placeholder="e.g. Senior Software Engineer" 
                    className="pl-10"
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Job Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description</FormLabel>
              <FormControl>
                <div className="flex items-start gap-2 relative">
                  <FileText className="absolute left-3 top-3 text-gray-500" size={18} />
                  <Textarea 
                    placeholder="Describe the responsibilities and requirements" 
                    className="min-h-32 pl-10"
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormDescription>
                Provide a detailed description of the job position
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Department Field */}
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2 relative">
                  <Building className="absolute left-3 text-gray-500 z-10" size={18} />
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location Field */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2 relative">
                  <MapPin className="absolute left-3 text-gray-500" size={18} />
                  <Input 
                    placeholder="e.g. New York, NY or Remote" 
                    className="pl-10"
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Work Type Field */}
        <FormField
          control={form.control}
          name="work_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Work Type</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2 relative">
                  <div className="absolute left-3 text-gray-500 z-10">
                    {field.value === "remote" ? (
                      <Computer size={18} />
                    ) : field.value === "in_office" ? (
                      <Building size={18} />
                    ) : field.value === "hybrid" ? (
                      <Home size={18} />
                    ) : (
                      <Home size={18} />
                    )}
                  </div>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select work type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_office">In Office</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Salary Currency Field */}
          <FormField
            control={form.control}
            name="salary_currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary Currency</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2 relative">
                    <DollarSign className="absolute left-3 text-gray-500 z-10" size={18} />
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD (US Dollar)</SelectItem>
                        <SelectItem value="CAD">CAD (Canadian Dollar)</SelectItem>
                        <SelectItem value="EUR">EUR (Euro)</SelectItem>
                        <SelectItem value="GBP">GBP (British Pound)</SelectItem>
                        <SelectItem value="INR">INR (Indian Rupee)</SelectItem>
                        <SelectItem value="THB">THB (Thai Baht)</SelectItem>
                        <SelectItem value="VND">VND (Vietnamese Dong)</SelectItem>
                        <SelectItem value="SGD">SGD (Singapore Dollar)</SelectItem>
                        <SelectItem value="AUD">AUD (Australian Dollar)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Salary Budget Field */}
          <FormField
            control={form.control}
            name="salary_budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary Budget</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2 relative">
                    <DollarSign className="absolute left-3 text-gray-500" size={18} />
                    <Input 
                      type="number" 
                      placeholder="e.g. 85000" 
                      className="pl-10"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.valueAsNumber);
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-2">
          <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Job"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default JobCreateForm;
