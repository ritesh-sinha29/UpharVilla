"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  User,
  CheckCircle2,
  ArrowRight,
  LogOut,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const isValidPassword = (pw: string) => {
  return (
    pw.length >= 8 &&
    /[A-Z]/.test(pw) &&
    /[a-z]/.test(pw) &&
    /\d/.test(pw) &&
    /[^A-Za-z0-9]/.test(pw)
  );
};

const AuthPage = () => {
  const { data: session } = authClient.useSession();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setOtp("");
    setShowOTP(false);
  };

  const handleSocialAuth = async (provider: "google" | "facebook") => {
    setIsLoading(true);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch (error: any) {
      console.error(`${provider} auth error:`, error);
      toast.error(error.message || `Failed to sign in with ${provider}`);
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isForgotPassword) {
        if (!showOTP) {
          const { error } = await authClient.emailOtp.sendVerificationOtp({
            email,
            type: "forget-password",
          });
          if (error) throw error;
          setShowOTP(true);
          toast.success("Reset OTP sent to your email!");
          return;
        }

        if (otp.length !== 6) {
          toast.error("Please enter the 6-digit OTP");
          setIsLoading(false);
          return;
        }

        const { error } = await authClient.emailOtp.resetPassword({
          email,
          otp,
          password,
        });

        if (error) throw error;
        
        toast.success("Password reset successful! Please sign in.");
        resetForm();
        setIsForgotPassword(false);
        setIsLogin(true);
        return;
      }

      if (isLogin) {
        const { error } = await authClient.signIn.email({
          email,
          password,
          callbackURL: "/",
        });
        if (error) throw error;
        toast.success("Welcome back!");
        router.push("/");
      } else {
        if (!isValidPassword(password)) {
          toast.error(
            "Password must be at least 8 characters long and contain an uppercase letter, lowercase letter, number, and special character."
          );
          setIsLoading(false);
          return;
        }

        if (!showOTP) {
          const { error } = await authClient.signUp.email({
            email,
            password,
            name: name || email.split("@")[0],
          });
          
          if (error) {
            toast.error(error.message || "Failed to create account");
            setIsLoading(false);
            return;
          }

          setShowOTP(true);
          toast.success("OTP sent to your email!");
          setIsLoading(false);
          return;
        }

        if (otp.length !== 6) {
          toast.error("Please enter a valid 6-digit OTP");
          setIsLoading(false);
          return;
        }

        const { error: verifyError } = await authClient.emailOtp.verifyEmail({
          email,
          otp,
        });

        if (verifyError) {
          toast.error(verifyError.message || "Invalid or expired OTP");
          setIsLoading(false);
          return;
        }

        // Automatically sign in the user after verification
        const { error: signInError } = await authClient.signIn.email({
          email,
          password,
          callbackURL: "/",
        });

        if (signInError) {
          toast.error("Verified, but failed to sign in automatically. Please log in manually.");
          setIsLogin(true);
          setShowOTP(false);
          return;
        }

        toast.success("Account created and verified! Welcome to upharVilla.");
        router.push("/");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };


  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await authClient.signOut();
      toast.success("Logged out successfully");
      setIsLoading(false);
    } catch (error: any) {
      toast.error("Failed to logout");
      setIsLoading(false);
    }
  };

  const isFormValid = isForgotPassword
    ? showOTP 
      ? otp.length === 6 && isValidPassword(password)
      : email.trim().length > 0
    : isLogin
    ? email.trim().length > 0 && password.trim().length > 0
    : showOTP
    ? otp.length === 6
    : name.trim().length > 0 && email.trim().length > 0 && isValidPassword(password);

  return (
    <div className="min-h-screen w-full bg-background flex flex-col overflow-hidden font-sans">
      {/* Outer Container */}
      <div className="flex-1 bg-background flex flex-col relative">
        {/* Header */}
        <header className="flex justify-between items-center px-10 py-4 z-20">
          <h1
            className="text-2xl font-bold tracking-tight lowercase font-serif cursor-pointer"
            onClick={() => router.push("/")}
          >
            upharVilla
          </h1>
          <div className="flex items-center gap-6">
            {session ? (
              <>
                <Button
                  variant="default"
                  className="h-9! px-5! rounded-full"
                  onClick={() => router.push("/")}
                >
                  Shop
                </Button>
                <Button variant="outline" className="h-9! px-5! rounded-full">
                  About
                </Button>

                <Button
                  variant="outline"
                  className="h-9! px-5! rounded-full border-zinc-200 hover:bg-zinc-50 flex items-center gap-2"
                  onClick={handleLogout}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4" />
                  )}
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="default"
                  className="h-9! px-5! rounded-full"
                  onClick={() => router.push("/")}
                >
                  Shop
                </Button>
                <Button variant="outline" className="h-9! px-5! rounded-full">
                  About
                </Button>
              </>
            )}
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 p-6 relative flex flex-col">
          {/* Large Rounded Image Container */}
          <div className="flex-1 w-full rounded-[40px] overflow-hidden relative border border-white/20 shadow-inner">
            <Image
              src="/auth-img.jpg"
              alt="upharVilla Luxury"
              fill
              className="object-cover"
              priority
            />

            {/* Floating Auth Card */}
            <div className="absolute right-6 md:right-10 lg:right-12 top-1/2 -translate-y-1/2 w-full max-w-[400px] z-30">
              <motion.div
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/95 backdrop-blur-md p-7 md:p-8 rounded-[32px] shadow-2xl border border-white min-h-[520px] flex flex-col justify-center"
              >
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center space-y-6"
                  >
                    <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-900 shadow-inner">
                      <Mail className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                        Check your email
                      </h2>
                      <p className="text-zinc-500 text-sm leading-relaxed">
                        We've sent a {isForgotPassword ? "password reset link" : "secure link"} to{" "}
                        <span className="font-bold text-zinc-900">{email}</span>
                        .<br />
                        Please click the link to{" "}
                        {isForgotPassword ? "reset your password" : isLogin ? "sign in" : "verify your account"}.
                      </p>
                    </div>
                      <div className="w-full p-4 bg-zinc-50 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold text-zinc-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Verification successful
                      </div>
                    <button
                      onClick={() => {
                        resetForm();
                        setIsSuccess(false);
                        setIsForgotPassword(false);
                      }}
                      className="text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-widest"
                    >
                      {isForgotPassword ? "Back to Login" : "Try a different email"}
                    </button>
                  </motion.div>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isForgotPassword ? (showOTP ? "forgot-otp" : "forgot-email") : isLogin ? "login" : "signup"}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold font-sans tracking-tight">
                            {isForgotPassword
                              ? "Reset Password"
                              : isLogin
                              ? "Welcome back"
                              : "Create Account"}
                          </h2>
                          <p className="text-base font-serif  text-muted-foreground">
                            {isForgotPassword
                              ? showOTP 
                                ? "Enter the code and your new password"
                                : "Enter your email to receive a reset code"
                              : isLogin
                              ? "Sign in to your account with your email"
                              : "Join the elite collection of UpharVilla"}
                          </p>
                        </div>
                      </div>

                      <form onSubmit={handleEmailAuth} className="space-y-3">
                        {((!isLogin && showOTP) || (isForgotPassword && showOTP)) ? (
                          <div className="flex flex-col items-center justify-center space-y-4 py-4">
                            <p className="text-sm text-zinc-500 text-center">
                              Please enter the 6-digit code sent to <br />
                              <span className="font-semibold text-zinc-900">{email}</span>
                            </p>
                            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                              <InputOTPGroup>
                                <InputOTPSlot index={0} className="w-10 h-12 text-lg" />
                                <InputOTPSlot index={1} className="w-10 h-12 text-lg" />
                                <InputOTPSlot index={2} className="w-10 h-12 text-lg" />
                              </InputOTPGroup>
                              <InputOTPSeparator />
                              <InputOTPGroup>
                                <InputOTPSlot index={3} className="w-10 h-12 text-lg" />
                                <InputOTPSlot index={4} className="w-10 h-12 text-lg" />
                                <InputOTPSlot index={5} className="w-10 h-12 text-lg" />
                              </InputOTPGroup>
                            </InputOTP>
                            {isForgotPassword && (
                              <div className="w-full relative mt-4">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="New Password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  required
                                  className="h-12 pl-11 bg-white border-border/40 rounded-xl transition-all text-sm"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                                >
                                  {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                  ) : (
                                    <Eye className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <>
                            {!isLogin && (
                              <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                  placeholder="Full Name"
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  className="h-12 pl-11 bg-white border-border/40 rounded-xl  transition-all text-sm"
                                />
                              </div>
                            )}
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                              <Input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-12 pl-11 bg-white border-border/40 rounded-xl  transition-all text-sm"
                              />
                            </div>
                            {!isForgotPassword && (
                              <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  required
                                  className="h-12 pl-11 bg-white border-border/40 rounded-xl  transition-all text-sm"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                                >
                                  {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                  ) : (
                                    <Eye className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            )}

                            {isLogin && !isForgotPassword && (
                              <div className="flex justify-end px-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    resetForm();
                                    setIsForgotPassword(true);
                                  }}
                                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                                >
                                  Forgot Password?
                                </button>
                              </div>
                            )}
                            {!isLogin && password.length > 0 && !isValidPassword(password) && (
                              <p className="text-xs text-red-500 text-left px-1 mt-1">
                                Password must be at least 8 characters, and include an uppercase letter, lowercase letter, number, and special character.
                              </p>
                            )}
                          </>
                        )}

                        <Button
                          type="submit"
                          disabled={isLoading || (!isLogin && showOTP && otp.length !== 6)}
                          className={`w-full h-12 text-white rounded-xl font-semibold transition-all mt-1 flex items-center justify-center gap-2 ${
                            isFormValid
                              ? "bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-black/5"
                              : "bg-primary hover:bg-indigo-500 shadow-md shadow-black/5"
                          }`}
                        >
                          {isLoading && (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          )}
                          {isForgotPassword
                            ? showOTP ? "Reset Password" : "Send Reset OTP"
                            : !isLogin && showOTP
                            ? "Verify & Create Account"
                            : isLogin
                            ? "Sign In"
                            : "Sign Up"}
                          {!isLoading && <ArrowRight className="w-4 h-4" />}
                        </Button>
                      </form>

                      <div className="relative py-1 flex items-center justify-center">
                        <div className="w-full h-px bg-zinc-300" />
                        <span className="absolute bg-popover px-4 text-[9px] font-bold text-zinc-400 uppercase tracking-widest rounded-full">
                          Or continue with
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          disabled={isLoading}
                          onClick={() => handleSocialAuth("google")}
                          className="h-12 border-zinc-100 bg-white hover:bg-zinc-50 rounded-xl flex items-center justify-center transition-all"
                        >
                          <Image
                            src="/google.png"
                            alt="Google"
                            width={20}
                            height={20}
                          />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={isLoading}
                          onClick={() => handleSocialAuth("facebook")}
                          className="h-12 border-zinc-100 bg-white hover:bg-zinc-50 rounded-xl flex items-center justify-center transition-all"
                        >
                          <Image
                            src="/facebook.svg"
                            alt="Facebook"
                            width={20}
                            height={20}
                          />
                        </Button>
                      </div>
                      <div className="text-center pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            resetForm();
                            if (isForgotPassword) {
                              setIsForgotPassword(false);
                            } else {
                              setIsLogin(!isLogin);
                            }
                          }}
                          className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
                        >
                          {isForgotPassword ? (
                            <>
                              Remembered your password?{" "}
                              <span className="font-bold text-zinc-900 border-b border-zinc-200">
                                Sign In
                              </span>
                            </>
                          ) : isLogin ? (
                            <>
                              Don't have an account?{" "}
                              <span className="font-bold text-zinc-900 border-b border-zinc-200">
                                Sign Up
                              </span>
                            </>
                          ) : (
                            <>
                              Already have an account?{" "}
                              <span className="font-bold text-zinc-900 border-b border-zinc-200">
                                Sign In
                              </span>
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
