
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.36.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define schema for job creation input
const JobCreateInput = z.object({
  title: z.string().min(1, "Job title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  department: z.string().min(1, "Department is required"),
  location: z.string().min(1, "Location is required"),
  work_type: z.enum(["in_office", "hybrid", "remote"], {
    required_error: "Work type must be one of: in_office, hybrid, remote",
  }),
  salary_currency: z.enum(["USD", "CAD", "EUR", "GBP", "INR", "THB", "VND", "SGD", "AUD"], {
    required_error: "Salary currency is required",
  }),
  salary_budget: z.number().min(0, "Salary budget must be a positive number"),
  experience_range: z.object({
    min: z.number().min(0, "Minimum experience must be non-negative"),
    max: z.number().min(0, "Maximum experience must be non-negative")
  }).refine(data => data.min <= data.max, {
    message: "Minimum experience must be less than or equal to maximum experience",
    path: ["experience_range"]
  }),
  required_skills: z.array(z.string().min(1, "Each skill must not be empty"))
});

// Define schema for job creation response
const JobCreateResponse = z.object({
  job_id: z.string(),
});

// Helper function to get authenticated user
async function getAuthenticatedUser(req: Request) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
  
  // Extract the JWT token from the Authorization header
  const authHeader = req.headers.get('Authorization') || ''
  const token = authHeader.replace('Bearer ', '')
  
  if (!token) {
    throw new Error('Missing authorization header')
  }
  
  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: authHeader
      }
    }
  })
  
  // Get user from the JWT
  const { data: { user }, error: userError } = await supabase.auth.getUser(token)
  
  if (userError || !user) {
    throw new Error('Unauthorized')
  }
  
  return { supabase, user, token }
}

// Helper function to get user's organization
async function getUserOrg(userId: string, supabase: any) {
  // Fetch user data from the users table
  const { data: userData, error: userDataError } = await supabase
    .from('users')
    .select('org_id')
    .eq('user_id', userId)
    .single()
  
  if (userDataError || !userData) {
    throw new Error('User record not found')
  }
  
  return userData
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
  
  try {
    // Get authenticated user
    let user;
    let supabase;
    
    try {
      const auth = await getAuthenticatedUser(req);
      user = auth.user;
      supabase = auth.supabase;
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    // Parse request body
    const requestBody = await req.json();
    
    // Validate input using Zod schema
    const parsedInput = JobCreateInput.safeParse(requestBody);
    
    if (!parsedInput.success) {
      console.error("Validation error:", parsedInput.error.format());
      return new Response(
        JSON.stringify({ error: 'Invalid request data', details: parsedInput.error.format() }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    const jobData = parsedInput.data;
    
    // Get user's org_id from the users table
    let userData;
    
    try {
      userData = await getUserOrg(user.id, supabase);
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    // Use service role for insert operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Insert job into jobs table
    const { data: insertedJob, error: jobError } = await adminSupabase
      .from('jobs')
      .insert({
        title: jobData.title,
        description: jobData.description,
        department: jobData.department,
        location: jobData.location,
        work_type: jobData.work_type,
        salary_currency: jobData.salary_currency,
        salary_budget: jobData.salary_budget,
        experience_range: jobData.experience_range,
        required_skills: jobData.required_skills,
        org_id: userData.org_id,
      })
      .select('id')
      .single();
    
    if (jobError || !insertedJob) {
      console.error("Job insert error:", jobError);
      return new Response(
        JSON.stringify({ error: 'Failed to create job', details: jobError }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    // Insert workflow job for market salary analysis
    const { error: workflowError } = await adminSupabase
      .from('workflow_jobs')
      .insert({
        job_type: 'fetch_market_salary',
        job_id: insertedJob.id,
        org_id: userData.org_id,
        status: 'pending',
      });
    
    if (workflowError) {
      console.error('Failed to create workflow job:', workflowError);
      // We don't fail the whole process if workflow creation fails
    }
    
    // Prepare response
    const response: z.infer<typeof JobCreateResponse> = {
      job_id: insertedJob.id,
    };
    
    // Return successful response
    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
    
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
