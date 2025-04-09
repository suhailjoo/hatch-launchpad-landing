
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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-hatch-blue/90 via-white to-hatch-coral/90 relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-60"></div>
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-hatch-blue/40 rounded-full blur-3xl mix-blend-multiply animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-hatch-coral/40 rounded-full blur-3xl mix-blend-multiply animate-pulse" style={{ animationDelay: "1.5s" }}></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-hatch-yellow/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: "0.8s" }}></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-hatch-gold/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: "1.2s" }}></div>
        
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 backdrop-blur-sm rounded-xl rotate-12 border border-white/20"></div>
        <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 backdrop-blur-sm rounded-xl -rotate-12 border border-white/20"></div>
        <div className="absolute bottom-10 left-10 w-20 h-20 bg-white/10 backdrop-blur-sm rounded-xl -rotate-12 border border-white/20"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 bg-white/10 backdrop-blur-sm rounded-xl rotate-12 border border-white/20"></div>
        
        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 text-center relative z-10"
        >
          <Link to="/" className="inline-block transition-all hover:scale-105 duration-300">
            <Logo className="h-12 mx-auto drop-shadow-lg" variant="long" />
          </Link>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 text-3xl font-bold bg-gradient-to-r from-hatch-coral via-hatch-blue to-hatch-coral bg-clip-text text-transparent bg-size-200 animate-gradient"
          >
            Welcome to Hatch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-2 text-gray-700 font-medium"
          >
            AI-powered hiring made simple
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="relative z-10"
        >
          <Card className="w-full border border-white/70 bg-white/70 backdrop-blur-xl shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
            <Tabs
              defaultValue="login"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="px-6 pt-6">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger 
                    value="signup"
                    className={`${activeTab === "signup" ? "bg-gradient-to-r from-hatch-coral to-hatch-coral" : "bg-transparent"} data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600 data-[state=active]:from-hatch-coral data-[state=active]:to-hatch-coral data-[state=active]:text-white font-medium`}
                  >
                    Sign Up
                  </TabsTrigger>
                  <TabsTrigger 
                    value="login"
                    className={`${activeTab === "login" ? "bg-gradient-to-r from-hatch-blue to-hatch-blue" : "bg-transparent"} data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600 data-[state=active]:from-hatch-blue data-[state=active]:to-hatch-blue data-[state=active]:text-white font-medium`}
                  >
                    Log In
                  </TabsTrigger>
                </TabsList>
              </div>

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
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-6 text-center text-sm text-gray-700 font-medium relative z-10"
        >
          <p className="backdrop-blur-sm py-2 px-4 rounded-full bg-white/30 inline-block shadow-sm border border-white/30">
            By continuing, you agree to Hatch's{" "}
            <Link to="#" className="text-hatch-blue hover:text-hatch-coral transition-colors hover:underline font-semibold">
              Terms of Service
            </Link>
            {" "}and{" "}
            <Link to="#" className="text-hatch-blue hover:text-hatch-coral transition-colors hover:underline font-semibold">
              Privacy Policy
            </Link>.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
