
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { z } from 'https://esm.sh/zod@3.22.4'

// Define request and response schemas with Zod
const SignupRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  organization_name: z.string().min(1)
})

const SignupResponseSchema = z.object({
  user_id: z.string().uuid(),
  org_id: z.string().uuid()
})

type SignupRequest = z.infer<typeof SignupRequestSchema>
type SignupResponse = z.infer<typeof SignupResponseSchema>

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
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get request body
    const requestData = await req.json()
    
    // Validate request body against schema
    const validationResult = SignupRequestSchema.safeParse(requestData)
    if (!validationResult.success) {
      return new Response(JSON.stringify({ 
        error: 'Invalid request data',
        details: validationResult.error.format() 
      }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    const { email, password, name, organization_name } = validationResult.data
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Create user in Auth system
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })
    
    if (userError || !userData.user) {
      console.error('Error creating user:', userError)
      return new Response(JSON.stringify({ 
        error: 'Failed to create user',
        details: userError?.message 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    const userId = userData.user.id
    
    // Create organization
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .insert({ name: organization_name })
      .select('id')
      .single()
    
    if (orgError || !orgData) {
      console.error('Error creating organization:', orgError)
      // Clean up: delete the user since we couldn't complete the signup process
      await supabase.auth.admin.deleteUser(userId)
      
      return new Response(JSON.stringify({ 
        error: 'Failed to create organization',
        details: orgError?.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    const orgId = orgData.id
    
    // Create user profile linking auth user to organization
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert({
        user_id: userId,
        org_id: orgId,
        name,
        role: 'admin'
      })
      .select('id')
      .single()
    
    if (profileError) {
      console.error('Error creating user profile:', profileError)
      // Clean up: delete the organization and user
      await supabase.from('organizations').delete().eq('id', orgId)
      await supabase.auth.admin.deleteUser(userId)
      
      return new Response(JSON.stringify({ 
        error: 'Failed to create user profile',
        details: profileError?.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    // Return success response
    const response: SignupResponse = {
      user_id: userId,
      org_id: orgId
    }
    
    // Validate response against schema
    const validatedResponse = SignupResponseSchema.parse(response)
    
    return new Response(JSON.stringify(validatedResponse), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('Unexpected error during signup:', error)
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
