import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitted(true);
    setIsSubmitting(false);
    
    toast({
      title: "Reset link sent",
      description: "Check your email for password reset instructions.",
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface to-background p-4">
        <div className="w-full max-w-md space-y-6">
          <Card className="shadow-elegant border-0 text-center">
            <CardHeader className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <CardTitle className="text-2xl font-semibold">Check your email</CardTitle>
              <CardDescription>
                We've sent a password reset link to <strong>{email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder or try again with a different email address.
              </p>
              <Button
                variant="outline"
                onClick={() => setIsSubmitted(false)}
                className="w-full"
              >
                Try again
              </Button>
              <Link to="/login">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to sign in
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface to-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Chair Scheduler
          </h1>
          <p className="text-muted-foreground">
            Reset your password
          </p>
        </div>

        <Card className="shadow-elegant border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold">Forgot password?</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="pl-10"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send reset link'}
              </Button>
            </form>

            <Link to="/login">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to sign in
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;