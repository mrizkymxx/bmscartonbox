
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Package, AlertCircle, Mail, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, resetPassword, error, clearError } = useAuth();

  const handleLogin = async () => {
    if (!email.trim()) {
      return;
    }
    
    if (!password.trim()) {
      return;
    }

    setLoading(true);
    clearError();

    try {
      const success = await login(email, password);
      
      if (success) {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail.trim()) {
      return;
    }

    setLoading(true);
    clearError();

    try {
      await resetPassword(resetEmail);
      setResetSent(true);
    } catch (error) {
      console.error('Reset password error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowResetForm(false);
    setResetSent(false);
    setResetEmail("");
    clearError();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (showResetForm) {
        handleResetPassword();
      } else {
        handleLogin();
      }
    }
  };

  if (showResetForm) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md mx-auto">
          <Card className="bg-card border border-border shadow-lg shadow-black/20">
            <CardContent className="p-8 space-y-6">
              {/* Logo and Title */}
              <div className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center ring-1 ring-border/50">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-foreground">
                    {resetSent ? 'Check Your Email' : 'Reset Password'}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {resetSent ? 'Password reset link sent' : 'Enter your email to reset password'}
                  </p>
                </div>
              </div>

              {resetSent ? (
                <div className="space-y-6">
                  <div className="text-center space-y-4">
                    <div className="text-green-500 text-4xl">✓</div>
                    <div className="space-y-2">
                      <p className="text-foreground">
                        We've sent a password reset link to <strong>{resetEmail}</strong>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Please check your email and follow the instructions to reset your password.
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleBackToLogin}
                    className="w-full h-10 text-sm font-medium bg-foreground text-background hover:bg-foreground/90"
                    variant="outline"
                  >
                    Back to Login
                  </Button>
                </div>
              ) : (
                <>
                  {/* Error message */}
                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50/10 border border-red-500/20 rounded-md text-red-400">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}

                  {/* Reset email input */}
                  <div className="space-y-2">
                    <Label htmlFor="resetEmail" className="text-sm font-medium text-foreground">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="resetEmail"
                        type="email"
                        value={resetEmail}
                        onChange={(e) => {
                          setResetEmail(e.target.value);
                          clearError();
                        }}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter your email address"
                        className="pl-10 h-10 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/20"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex space-x-3">
                    <Button
                      onClick={handleResetPassword}
                      disabled={loading || !resetEmail.trim()}
                      className="flex-1 h-10 text-sm font-medium bg-foreground text-background hover:bg-foreground/90"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Send Reset Link'
                      )}
                    </Button>
                    <Button
                      onClick={handleBackToLogin}
                      disabled={loading}
                      variant="outline"
                      className="h-10 text-sm font-medium"
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md mx-auto">
        <Card className="bg-card border border-border shadow-lg shadow-black/20">
          <CardContent className="p-8 space-y-6">
            {/* Logo and Title */}
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center ring-1 ring-border/50">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">BSM Carton</h1>
                <p className="text-sm text-muted-foreground">生产管理系统</p>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50/10 border border-red-500/20 rounded-md text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Demo credentials info */}
            <div className="bg-blue-50/10 border border-blue-500/20 rounded-md p-3 text-xs text-blue-400">
              <div className="font-medium mb-1">Demo Credentials:</div>
              <div>Admin: admin@bsmcartonbox.com</div>
              <div>Viewer: viewer@bsmcartonbox.com</div>
              <div className="mt-1 italic">Contact administrator for password</div>
            </div>

            {/* Email input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError();
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your email"
                  className="pl-10 h-10 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/20"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password input */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearError();
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 h-10 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/20"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Login button */}
            <Button
              onClick={handleLogin}
              disabled={loading || !email.trim() || !password.trim()}
              className="w-full h-10 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            {/* Forgot password link */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowResetForm(true)}
                className="text-sm text-primary hover:text-primary/80 underline transition-colors"
                disabled={loading}
              >
                Forgot your password?
              </button>
            </div>

            {/* Additional info */}
            <div className="text-center space-y-1">
              <p className="text-sm text-muted-foreground">安全访问您的纸箱生产管理系统</p>
              <p className="text-xs text-muted-foreground">Secure access to your carton production management system</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">© 2025 BSM Carton Management System</p>
        </div>
      </div>
    </div>
  );
}
