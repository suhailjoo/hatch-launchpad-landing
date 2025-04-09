
import { z } from "zod";

export const SignupFormSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  organization_name: z.string().min(1, "Organization name is required"),
});

export type SignupFormValues = z.infer<typeof SignupFormSchema>;
