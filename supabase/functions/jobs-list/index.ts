
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { z } from 'https://esm.sh/zod@3.22.4'

// Define the job schema with zod
const JobSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  department: z.string(),
  description: z.string().optional(),
  location: z.string(),
  work_type: z.enum(["in_office", "hybrid", "remote"]),
  salary_currency: z.enum(["USD", "CAD", "EUR", "GBP", "INR", "THB", "VND", "SGD", "AUD"]),
  salary_budget: z.number(),
  experience_range: z.object({
    min: z.number(),
    max: z.number()
  }),
  required_skills: z.array(z.string()),
  created_at: z.string()
})

type Job = z.infer<typeof JobSchema>

// Define the response schema
const ResponseSchema = z.object({
  jobs: z.array(JobSchema)
})

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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
async function getUserOrg(userId: string) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  const adminSupabase = createClient(supabaseUrl, supabaseServiceKey)
  
  // Fetch user data from the users table
  const { data: userData, error: userDataError } = await adminSupabase
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
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Only allow GET requests
    if (req.method !== 'GET') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get authenticated user
    let user;
    
    try {
      const auth = await getAuthenticatedUser(req);
      user = auth.user;
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    // Get user's organization
    let userData;
    
    try {
      userData = await getUserOrg(user.id);
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Create admin client with service role to bypass RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const adminSupabase = createClient(supabaseUrl, supabaseServiceKey)

    // Use the org_id to fetch jobs
    const { data: jobs, error: jobsError } = await adminSupabase
      .from('jobs')
      .select('id, title, description, department, location, work_type, salary_currency, salary_budget, experience_range, required_skills, created_at')
      .eq('org_id', userData.org_id)
      .order('created_at', { ascending: false })

    if (jobsError) {
      console.error('Error fetching jobs:', jobsError)
      return new Response(JSON.stringify({ error: 'Failed to fetch jobs' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Validate and transform the jobs data
    const validJobs = jobs.map(job => JobSchema.parse(job))
    
    // Create and validate the response
    const response = ResponseSchema.parse({ jobs: validJobs })

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Unexpected error in jobs-list function:', error)
    
    let errorMessage = 'Internal server error'
    let statusCode = 500

    if (error instanceof z.ZodError) {
      errorMessage = 'Data validation error'
      statusCode = 422
    } else if (error instanceof Error) {
      errorMessage = error.message
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: statusCode,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
