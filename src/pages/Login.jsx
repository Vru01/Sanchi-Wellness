import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
// Make sure this path matches your project structure
import Logo from '@/assets/logo.png'; 

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col font-sans">
      
      {/* --- NATURE BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2000&auto=format&fit=crop" 
          alt="Nature Background" 
          className="w-full h-full object-cover"
        />
        {/* Dark overlay to make text readable and card pop */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
      </div>

      {/* --- CONTENT WRAPPER (z-index 10 to sit above background) --- */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* --- HEADER WITH LOGO --- */}
        <header className="p-6 flex justify-center lg:justify-start">
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={Logo} 
              alt="Sanchi Wellness" 
              className="h-10 w-auto object-contain bg-white/90 rounded-full p-1" 
            />
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-white drop-shadow-md group-hover:opacity-90 transition-opacity">
                SANCHI WELLNESS
              </span>
              <span className="text-[0.65rem] text-gray-200 font-medium tracking-widest uppercase -mt-1 hidden sm:block drop-shadow-sm">
                Keeping Wellness In Everyday Life
              </span>
            </div>
          </Link>
        </header>

        <div className="flex-grow flex items-center justify-center p-4 -mt-10">
          <Card className="w-full max-w-md shadow-2xl border-none bg-white/95 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-3xl font-bold text-gray-800">
                Welcome Back
              </CardTitle>
              <CardDescription>
                Enter your credentials to access your wellness dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input id="email" type="email" placeholder="name@example.com" className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      className="pl-10 pr-10" 
                      required 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="text-right">
                    <Link to="#" className="text-xs text-green-600 hover:underline">Forgot password?</Link>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-cyan-500 to-green-600 hover:from-cyan-600 hover:to-green-700 text-white transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...</>
                  ) : (
                    <>Login <ArrowRight className="ml-2 h-4 w-4" /></>
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center flex-col space-y-2">
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <Link to="/signup" className="text-green-600 font-semibold hover:underline">
                  Sign Up
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;