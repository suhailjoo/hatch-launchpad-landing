
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/hooks/use-toast";
import { SignupFormSchema, SignupFormValues } from "../schemas/signupSchema";

export const useSignupForm = () => {
  const { signup, clearErrors } = useAuthStore();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      organization_name: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      setSubmitting(true);
      clearErrors();
      
      await signup(
        data.email,
        data.password,
        data.name,
        data.organization_name
      );
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully.",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "An error occurred during signup",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    onSubmit,
    submitting,
  };
};
