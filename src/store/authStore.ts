
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';

// Define types for user data
type User = {
  id: string;
  email: string;
};

type MeResponse = {
  user_id: string;
  email: string;
  org_id: string;
  name: string;
};

// Define the auth store state and actions
interface AuthState {
  user: User | null;
  orgId: string | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, organization_name: string) => Promise<void>;
  logout: () => Promise<void>;
  setSessionFromStorage: () => Promise<void>;
  clearErrors: () => void;
}

const SUPABASE_URL = "https://jaoxflaynrxgfljlorew.supabase.co";
const FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1`;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      orgId: null,
      isLoading: false,
      error: null,
      isInitialized: false,
      
      // Clear any error messages
      clearErrors: () => set({ error: null }),
      
      // Refresh the session
      refreshSession: async () => {
        try {
          console.log("Attempting to refresh session");
          set({ isLoading: true, error: null });
          
          // Try to refresh the session
          const { data, error } = await supabase.auth.refreshSession();
          
          if (error) {
            console.error("Session refresh error:", error);
            set({
              error: error.message,
              isLoading: false,
            });
            return;
          }
          
          if (data.session) {
            console.log("Session refreshed successfully");
            // If we have a session, fetch user data from /me endpoint
            const response = await fetch(`${FUNCTIONS_URL}/me`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.session.access_token}`,
              },
            });
            
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to fetch user data after refresh');
            }
            
            const userData: MeResponse = await response.json();
            
            // Update store with user and organization data
            set({
              user: {
                id: userData.user_id,
                email: userData.email,
              },
              orgId: userData.org_id,
              isLoading: false,
            });
          } else {
            console.warn("No session after refresh");
            set({
              user: null,
              orgId: null,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('Session refresh error:', error);
          set({
            user: null,
            orgId: null,
            error: error instanceof Error ? error.message : 'An unknown error occurred during refresh',
            isLoading: false,
          });
        }
      },
      
      // Login with email and password
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // Sign in with Supabase auth
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (authError) throw new Error(authError.message);
          if (!authData?.session) throw new Error('No session returned from authentication');
          
          // Fetch user profile data from /me endpoint
          const response = await fetch(`${FUNCTIONS_URL}/me`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authData.session.access_token}`,
            },
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch user data');
          }
          
          const userData: MeResponse = await response.json();
          
          // Update store with user and organization data
          set({
            user: {
              id: userData.user_id,
              email: userData.email,
            },
            orgId: userData.org_id,
            isLoading: false,
            isInitialized: true,
          });
          
        } catch (error) {
          console.error('Login error:', error);
          set({
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            isLoading: false,
            isInitialized: true,
          });
          throw error;
        }
      },
      
      // Sign up new user
      signup: async (email: string, password: string, name: string, organization_name: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // 1. Call /signup endpoint to create user, org, and profile
          const signupResponse = await fetch(`${FUNCTIONS_URL}/signup`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              password,
              name,
              organization_name,
            }),
          });
          
          if (!signupResponse.ok) {
            const errorData = await signupResponse.json();
            throw new Error(errorData.error || 'Signup failed');
          }
          
          const { user_id, org_id } = await signupResponse.json();
          
          // 2. Sign in with the newly created credentials
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (authError) throw new Error(authError.message);
          if (!authData?.session) throw new Error('No session returned after authentication');
          
          // 3. Update store with user and organization data
          set({
            user: {
              id: user_id,
              email: email,
            },
            orgId: org_id,
            isLoading: false,
            isInitialized: true,
          });
          
        } catch (error) {
          console.error('Signup error:', error);
          set({
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            isLoading: false,
            isInitialized: true,
          });
          throw error;
        }
      },
      
      // Logout user
      logout: async () => {
        try {
          set({ isLoading: true, error: null });
          
          // Sign out from Supabase
          const { error } = await supabase.auth.signOut();
          if (error) throw new Error(error.message);
          
          // Clear store
          set({
            user: null,
            orgId: null,
            isLoading: false,
            isInitialized: true,
          });
          
        } catch (error) {
          console.error('Logout error:', error);
          set({
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            isLoading: false,
          });
        }
      },
      
      // Restore session from storage on page load/refresh
      setSessionFromStorage: async () => {
        try {
          set({ isLoading: true, error: null });
          
          // Get current session
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) throw new Error(sessionError.message);
          
          // If no session, clear store and return
          if (!session) {
            set({
              user: null,
              orgId: null,
              isLoading: false,
              isInitialized: true,
            });
            return;
          }
          
          // Setup session refresh listener
          supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Auth state changed:", event);
            if (event === 'SIGNED_OUT') {
              set({
                user: null,
                orgId: null,
                isLoading: false,
                isInitialized: true,
              });
            } else if (event === 'TOKEN_REFRESHED' && session) {
              console.log("Token refreshed automatically");
              // Don't make async calls directly in the callback to avoid deadlocks
              setTimeout(async () => {
                try {
                  // Fetch user profile data
                  const response = await fetch(`${FUNCTIONS_URL}/me`, {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${session.access_token}`,
                    },
                  });
                  
                  if (!response.ok) {
                    console.error("Failed to fetch user data after token refresh");
                    return;
                  }
                  
                  const userData: MeResponse = await response.json();
                  
                  set({
                    user: {
                      id: userData.user_id,
                      email: userData.email,
                    },
                    orgId: userData.org_id,
                  });
                } catch (error) {
                  console.error("Error updating user after token refresh:", error);
                }
              }, 0);
            }
          });
          
          // Fetch user profile data from /me endpoint
          const response = await fetch(`${FUNCTIONS_URL}/me`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
            },
          });
          
          if (!response.ok) {
            // If endpoint fails, try to refresh the session
            const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
            
            if (refreshError || !refreshData.session) {
              console.error("Failed to refresh session:", refreshError);
              set({
                user: null,
                orgId: null,
                error: "Session expired. Please log in again.",
                isLoading: false,
                isInitialized: true,
              });
              return;
            }
            
            // Try again with refreshed token
            const retryResponse = await fetch(`${FUNCTIONS_URL}/me`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${refreshData.session.access_token}`,
              },
            });
            
            if (!retryResponse.ok) {
              // If still fails, just use basic data from session
              set({
                user: {
                  id: session.user.id,
                  email: session.user.email || '',
                },
                orgId: null,
                isLoading: false,
                isInitialized: true,
              });
              return;
            }
            
            const userData: MeResponse = await retryResponse.json();
            
            set({
              user: {
                id: userData.user_id,
                email: userData.email,
              },
              orgId: userData.org_id,
              isLoading: false,
              isInitialized: true,
            });
            return;
          }
          
          const userData: MeResponse = await response.json();
          
          // Update store with user and organization data
          set({
            user: {
              id: userData.user_id,
              email: userData.email,
            },
            orgId: userData.org_id,
            isLoading: false,
            isInitialized: true,
          });
          
        } catch (error) {
          console.error('Session restoration error:', error);
          set({
            user: null,
            orgId: null,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
            isLoading: false,
            isInitialized: true,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        orgId: state.orgId,
      }),
    }
  )
);
