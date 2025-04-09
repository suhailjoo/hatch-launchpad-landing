
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

    // Get Supabase environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

    // Get auth token from request
    const authHeader = req.headers.get('Authorization') || ''
    const token = authHeader.replace('Bearer ', '')

    if (!token) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Create a Supabase client to verify the token
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    })

    // Verify the token and get the user
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)

    if (userError || !user) {
      console.error('User verification error:', userError)
      return new Response(JSON.stringify({ error: 'Unauthorized or invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Create admin client with service role to bypass RLS
    const adminSupabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get the user's organization id
    const { data: userData, error: userDataError } = await adminSupabase
      .from('users')
      .select('org_id')
      .eq('user_id', user.id)
      .single()

    if (userDataError || !userData) {
      console.error('Error fetching user data:', userDataError)
      return new Response(JSON.stringify({ error: 'User organization not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

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
