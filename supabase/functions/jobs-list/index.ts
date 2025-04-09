
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.36.0";
import * as z from "https://esm.sh/zod@3.22.4";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client using Deno runtime
const supabaseClient = (req: Request) => {
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader) {
    throw new Error('Missing Authorization header');
  }
  
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  
  return createClient(
    supabaseUrl,
    supabaseServiceKey,
    {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    }
  );
};

// Define the job summary schema using zod
const JobSummarySchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  department: z.string(),
  work_type: z.enum(["in_office", "hybrid", "remote"]),
  salary_currency: z.enum(["USD", "CAD", "EUR", "GBP", "INR", "THB", "VND", "SGD", "AUD"]),
  salary_budget: z.number(),
  created_at: z.string(),
});

// Define the response schema
const ResponseSchema = z.object({
  jobs: z.array(JobSummarySchema),
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
  
  try {
    // Initialize Supabase client
    const supabase = supabaseClient(req);
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    // Get user's org_id from the users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('org_id')
      .eq('user_id', user.id)
      .single();
    
    if (userError || !userData) {
      return new Response(
        JSON.stringify({ error: 'Failed to retrieve user organization data' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    // Query jobs for the user's organization
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('id, title, description, department, work_type, salary_currency, salary_budget, created_at')
      .eq('org_id', userData.org_id)
      .order('created_at', { ascending: false });
    
    if (jobsError) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch jobs', details: jobsError }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    // Return successful response
    return new Response(
      JSON.stringify({ jobs }),
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
