import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Loader2 } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { useAuth, loginSchema, registerSchema } from "@/hooks/use-auth";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [location, navigate] = useLocation();
  
  // Use the auth context
  const { user, loginMutation, registerMutation } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    try {
      await loginMutation.mutateAsync(values);
      navigate("/");
    } catch (error) {
      // Error is handled by the mutation
      console.error("Login error:", error);
    }
  };

  // Register form
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      profession: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleRegister = async (values: z.infer<typeof registerSchema>) => {
    try {
      await registerMutation.mutateAsync(values);
      navigate("/");
    } catch (error) {
      // Error is handled by the mutation
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row bg-white rounded-lg overflow-hidden shadow-lg">
        {/* Form Section */}
        <div className="md:w-1/2 p-6 md:p-10">
          <div className="mb-6">
            <PlusCircle className="h-10 w-10 text-primary mb-2" />
            <h1 className="text-2xl font-bold">Rate My Locum</h1>
            <p className="text-slate-600 mt-2">Connect with other healthcare professionals and find the best locum opportunities.</p>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "register")}>
            <TabsList className="grid grid-cols-2 w-full mb-8">
              <TabsTrigger value="login">Log In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="johndoe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full mt-6" 
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Log In
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center text-sm text-slate-600">
                <p>
                  Don't have an account?{" "}
                  <button 
                    onClick={() => setActiveTab("register")} 
                    className="text-primary hover:text-blue-700 font-medium"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </TabsContent>

            <TabsContent value="register">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="johndoe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="profession"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profession</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your profession" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="pharmacist">Pharmacist</SelectItem>
                              <SelectItem value="doctor">Doctor</SelectItem>
                              <SelectItem value="optometrist">Optometrist</SelectItem>
                              <SelectItem value="nurse">Nurse</SelectItem>
                              <SelectItem value="pharmacy_dispenser">Pharmacy Dispenser</SelectItem>
                              <SelectItem value="accuracy_checking_technician">Accuracy Checking Technician</SelectItem>
                              <SelectItem value="dispensing_optician">Dispensing Optician</SelectItem>
                              <SelectItem value="optical_assistant">Optical Assistant</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-start mt-4">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-1 rounded border-slate-300 text-primary focus:ring-primary"
                      required
                    />
                    <label htmlFor="terms" className="ml-2 text-sm text-slate-600">
                      I agree to the Terms of Service and Privacy Policy
                    </label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full mt-6" 
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Sign Up
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center text-sm text-slate-600">
                <p>
                  Already have an account?{" "}
                  <button 
                    onClick={() => setActiveTab("login")} 
                    className="text-primary hover:text-blue-700 font-medium"
                  >
                    Log in
                  </button>
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Hero Section */}
        <div className="md:w-1/2 bg-gradient-to-br from-blue-500 to-violet-600 p-6 md:p-10 text-white flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Find the Best Locum Opportunities</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <svg className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Read authentic reviews from healthcare professionals</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Share your own experiences to help others</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Find details on pay rates, facilities, and transport options</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Rate both workplaces and agencies</span>
            </li>
          </ul>
          <div className="mt-8 p-4 bg-white/10 rounded-lg">
            <p className="italic">
              "Join our growing community of healthcare professionals and help build a more transparent locum work environment."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}