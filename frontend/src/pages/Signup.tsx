import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Signup = () => {
  const { user, signup, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // default role
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user) {
    return (
      <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setIsSubmitting(true);
    const result = await signup(
      formData.name,
      formData.email,
      formData.password,
      formData.role === "user" ? "employee" : "admin"
    );
    setIsSubmitting(false);
    if (result.success) {
      toast({
        title: "Account created!",
        description: `Your ${formData.role} account has been created successfully. Please sign in.`,
      });
      window.location.href = "/login";
    } else {
      setError(result.error || "Signup failed");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface to-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Chair Scheduler
          </h1>
          <p className="text-muted-foreground">
            Create your account to get started
          </p>
        </div>

        <Card className="shadow-elegant border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold">
              Create account
            </CardTitle>
            <CardDescription>
              Enter your information to create your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Role Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, role: value }))
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
