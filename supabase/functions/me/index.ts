
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { z } from 'https://esm.sh/zod@3.22.4'

// Define response schema with Zod
const UserResponseSchema = z.object({
  user_id: z.string().uuid(),
  email: z.string().email(),
  org_id: z.string().uuid(),
  name: z.string()
})

type UserResponse = z.infer<typeof UserResponseSchema>

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
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

    // Get the user from the request context
    // This will fail if the user is not authenticated
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
    
    // Extract the JWT token from the Authorization header
    const authHeader = req.headers.get('Authorization') || ''
    const token = authHeader.replace('Bearer ', '')
    
    if (!token) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
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
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    // Create Supabase client with service role key for fetching protected data
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const adminSupabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Fetch user data from the users table
    const { data: userData, error: userDataError } = await adminSupabase
      .from('users')
      .select('*, organizations:org_id(*)')
      .eq('user_id', user.id)
      .single()
    
    if (userDataError || !userData) {
      console.error('Error fetching user data:', userDataError)
      return new Response(JSON.stringify({ 
        error: 'Failed to fetch user data',
        details: userDataError?.message 
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    // Build the response
    const response: UserResponse = {
      user_id: user.id,
      email: user.email || '',
      org_id: userData.org_id,
      name: userData.name
    }
    
    // Validate response against schema
    const validatedResponse = UserResponseSchema.parse(response)
    
    return new Response(JSON.stringify(validatedResponse), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('Unexpected error fetching user data:', error)
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
