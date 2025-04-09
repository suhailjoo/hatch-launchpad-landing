
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Lock } from "lucide-react";

const LoginFormSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof LoginFormSchema>;

const LoginForm = () => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    console.log(data);
  };

  const formAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="show"
      variants={formAnimation}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <motion.div variants={itemAnimation}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-hatch-coral" /> Email
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="Enter your email" 
                      {...field} 
                      className="border-gray-300 focus:border-hatch-coral focus:ring-hatch-coral/20 transition-all duration-300"
                    />
                  </FormControl>
                  <FormMessage className="text-hatch-coral" />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={itemAnimation}>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 flex items-center gap-2">
                    <Lock className="h-4 w-4 text-hatch-coral" /> Password
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Enter your password" 
                      {...field} 
                      className="border-gray-300 focus:border-hatch-coral focus:ring-hatch-coral/20 transition-all duration-300"
                    />
                  </FormControl>
                  <FormMessage className="text-hatch-coral" />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={itemAnimation}>
            <Button 
              type="submit" 
              className="w-full mt-2 bg-gradient-to-r from-hatch-blue to-hatch-coral hover:from-hatch-coral hover:to-hatch-blue text-white transition-all duration-500 group"
            >
              Log In <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </motion.div>
        </form>
      </Form>

      <motion.div variants={itemAnimation} className="text-center text-sm">
        <p>
          Don't have an account?{" "}
          <Link to="/auth" className="text-hatch-blue hover:text-hatch-coral transition-colors font-medium hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default LoginForm;
