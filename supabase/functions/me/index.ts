
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { getUser } from 'https://esm.sh/@supabase/supabase-js@2.39.7/dist/module/lib/helpers'
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
    
    // Get user from auth cookie
    const authHeader = req.headers.get('Authorization') || ''
    const user = await getUser(authHeader, supabaseAnonKey)
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    // Create Supabase client with service role key for fetching protected data
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Fetch user data from the users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*, organizations:org_id(id, name)')
      .eq('user_id', user.id)
      .single()
    
    if (userError || !userData) {
      console.error('Error fetching user data:', userError)
      return new Response(JSON.stringify({ 
        error: 'Failed to fetch user data',
        details: userError?.message 
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    // Fetch user email from auth.users
    const { data: authUserData, error: authUserError } = await supabase.auth.admin.getUserById(user.id)
    
    if (authUserError || !authUserData.user) {
      console.error('Error fetching auth user data:', authUserError)
      return new Response(JSON.stringify({ 
        error: 'Failed to fetch auth user data',
        details: authUserError?.message 
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    // Build the response
    const response: UserResponse = {
      user_id: user.id,
      email: authUserData.user.email || '',
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
