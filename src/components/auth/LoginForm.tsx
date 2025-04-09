
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Lock, KeyRound } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const LoginFormSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof LoginFormSchema>;

const LoginForm = () => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
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
                    <Mail className="h-4 w-4 text-hatch-blue" /> Email
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="Enter your email" 
                      {...field} 
                      className="border-gray-300 focus:border-hatch-blue focus:ring-hatch-blue/20 transition-all duration-300"
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
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-gray-700 flex items-center gap-2">
                      <Lock className="h-4 w-4 text-hatch-blue" /> Password
                    </FormLabel>
                    <Link to="#" className="text-xs text-hatch-blue hover:text-hatch-coral transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type="password" 
                        placeholder="Enter your password" 
                        {...field} 
                        className="border-gray-300 focus:border-hatch-blue focus:ring-hatch-blue/20 transition-all duration-300 pr-10"
                      />
                      <KeyRound className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                    </div>
                  </FormControl>
                  <FormMessage className="text-hatch-coral" />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={itemAnimation}>
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-hatch-blue data-[state=checked]:border-hatch-blue"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-normal">
                      Remember me for 30 days
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={itemAnimation} className="pt-2">
            <Button 
              type="submit" 
              className="w-full mt-2 bg-gradient-to-r from-hatch-blue to-hatch-coral hover:from-hatch-coral hover:to-hatch-blue text-white transition-all duration-500 group shadow-md hover:shadow-lg"
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
