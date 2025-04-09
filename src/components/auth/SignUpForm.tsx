
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Building } from "lucide-react";
import { Form } from "@/components/ui/form";
import { useSignupForm } from "./hooks/useSignupForm";
import AuthFormField from "./components/AuthFormField";
import SubmitButton from "./components/SubmitButton";

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

const SignUpForm = () => {
  const { form, onSubmit, submitting } = useSignupForm();

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
            <AuthFormField 
              form={form}
              name="name"
              label="Full Name"
              icon={<User className="h-4 w-4 text-hatch-coral" />}
              placeholder="Enter your full name"
              disabled={submitting}
            />
          </motion.div>

          <motion.div variants={itemAnimation}>
            <AuthFormField 
              form={form}
              name="email"
              label="Email"
              icon={<Mail className="h-4 w-4 text-hatch-coral" />}
              placeholder="Enter your email"
              type="email"
              disabled={submitting}
            />
          </motion.div>

          <motion.div variants={itemAnimation}>
            <AuthFormField 
              form={form}
              name="password"
              label="Password"
              icon={<Lock className="h-4 w-4 text-hatch-coral" />}
              placeholder="Create a password"
              type="password"
              disabled={submitting}
            />
          </motion.div>

          <motion.div variants={itemAnimation}>
            <AuthFormField 
              form={form}
              name="organization_name"
              label="Organization Name"
              icon={<Building className="h-4 w-4 text-hatch-coral" />}
              placeholder="Enter your organization name"
              disabled={submitting}
            />
          </motion.div>

          <motion.div variants={itemAnimation}>
            <SubmitButton 
              isSubmitting={submitting}
              label="Sign Up"
              loadingLabel="Creating Account..."
            />
          </motion.div>
        </form>
      </Form>

      <motion.div variants={itemAnimation} className="text-center text-sm">
        <p>
          Already have an account?{" "}
          <Link to="/auth" className="text-hatch-blue hover:text-hatch-coral transition-colors font-medium hover:underline">
            Log In
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default SignUpForm;
