
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignUpForm from "@/components/auth/SignUpForm";
import LoginForm from "@/components/auth/LoginForm";
import Logo from "@/components/Logo";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Auth = () => {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-hatch-blue/5 via-white to-hatch-coral/5 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-hatch-lightBlue/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-hatch-coral/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-40 right-20 w-32 h-32 bg-hatch-yellow/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute bottom-60 left-40 w-24 h-24 bg-hatch-blue/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and header section with enhanced animations */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8 text-center relative z-10"
        >
          <Link to="/" className="inline-block transition-all hover:scale-105 duration-300">
            <Logo className="h-10 mx-auto drop-shadow-md" variant="long" />
          </Link>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6 text-3xl font-bold bg-gradient-to-r from-hatch-coral via-hatch-blue to-hatch-coral bg-clip-text text-transparent bg-size-200 animate-gradient"
          >
            Welcome to Hatch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-2 text-muted-foreground"
          >
            AI-powered hiring made simple
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="relative z-10"
        >
          <Card className="w-full border border-white/40 bg-white/80 backdrop-blur-xl shadow-xl rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
            <Tabs
              defaultValue="login"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 w-full p-1 bg-muted/50 rounded-lg m-4">
                <TabsTrigger 
                  value="signup"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-hatch-coral/90 data-[state=active]:to-hatch-coral data-[state=active]:text-white rounded-md transition-all duration-300"
                >
                  Sign Up
                </TabsTrigger>
                <TabsTrigger 
                  value="login"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-hatch-blue/90 data-[state=active]:to-hatch-blue data-[state=active]:text-white rounded-md transition-all duration-300"
                >
                  Log In
                </TabsTrigger>
              </TabsList>

              <CardContent className="p-6">
                <TabsContent value="signup" className="mt-0 animate-in fade-in-50 zoom-in-95 duration-300">
                  <SignUpForm />
                </TabsContent>

                <TabsContent value="login" className="mt-0 animate-in fade-in-50 zoom-in-95 duration-300">
                  <LoginForm />
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6 text-center text-sm text-muted-foreground relative z-10"
        >
          <p>
            By continuing, you agree to Hatch's{" "}
            <Link to="#" className="text-hatch-blue hover:text-hatch-coral transition-colors hover:underline">
              Terms of Service
            </Link>
            {" "}and{" "}
            <Link to="#" className="text-hatch-blue hover:text-hatch-coral transition-colors hover:underline">
              Privacy Policy
            </Link>.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
