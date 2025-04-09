
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignUpForm from "@/components/auth/SignUpForm";
import LoginForm from "@/components/auth/LoginForm";
import Logo from "@/components/Logo";
import { Link } from "react-router-dom";

const Auth = () => {
  const [activeTab, setActiveTab] = useState<string>("login");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block">
            <Logo className="h-8 mx-auto" variant="long" />
          </Link>
          <h1 className="mt-6 text-2xl font-bold">Welcome to Hatch</h1>
          <p className="mt-2 text-muted-foreground">AI-powered hiring made simple</p>
        </div>

        <Card className="w-full border-0 shadow-lg animate-fade-in">
          <Tabs
            defaultValue="login"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full mb-4">
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="login">Log In</TabsTrigger>
            </TabsList>

            <CardContent className="p-6">
              <TabsContent value="signup" className="mt-0">
                <SignUpForm />
              </TabsContent>

              <TabsContent value="login" className="mt-0">
                <LoginForm />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            By continuing, you agree to Hatch's{" "}
            <Link to="#" className="text-primary hover:underline">Terms of Service</Link>
            {" "}and{" "}
            <Link to="#" className="text-primary hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
