import React, { useEffect, useState } from "react";
import { User, Bell, Shield, Palette, Globe, Save } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const Settings = () => {
  const { user, token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    department: "",
    phone: "",
  });

  const [notifications, setNotifications] = useState({
    emailBookingConfirm: false,
    emailBookingReminder: false,
    emailCancellation: false,
    pushNotifications: false,
    smsReminders: false,
  });

  const [preferences, setPreferences] = useState({
    defaultBookingDuration: "",
    autoCancel: false,
    preferredChairType: "",
    timezone: "",
  });

  // Fetch settings from backend on mount
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/settings`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setProfile(data.profile || {});
        setNotifications(data.notifications || {});
        setPreferences(data.preferences || {});
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load settings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    if (token) fetchSettings();
  }, [token]);

  // Save profile
  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/settings/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profile),
        }
      );
      if (!res.ok) throw new Error("Failed to save profile");
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved successfully.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save notification preferences
  const handleSaveNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/settings/notifications`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(notifications),
        }
      );
      if (!res.ok) throw new Error("Failed to save notification preferences");
      toast({
        title: "Notification preferences updated",
        description: "Your notification settings have been saved.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save notification preferences",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save booking preferences
  const handleSavePreferences = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/settings/preferences`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(preferences),
        }
      );
      if (!res.ok) throw new Error("Failed to save booking preferences");
      toast({
        title: "Booking preferences updated",
        description: "Your booking settings have been saved.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save booking preferences",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Profile Settings */}
      <Card className="shadow-elegant border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your personal information and contact details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-surface/50 rounded-lg">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{profile.name}</h3>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
              <Badge variant="secondary" className="mt-1 capitalize">
                {user?.role}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={profile.department}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    department: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </div>
          </div>

          <Button onClick={handleSaveProfile} disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Saving..." : "Save Profile"}
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="shadow-elegant border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose how you want to be notified about bookings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-confirm">
                  Email booking confirmations
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when your booking is confirmed
                </p>
              </div>
              <Switch
                id="email-confirm"
                checked={notifications.emailBookingConfirm}
                onCheckedChange={(checked) =>
                  setNotifications((prev) => ({
                    ...prev,
                    emailBookingConfirm: checked,
                  }))
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-reminder">Email booking reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Receive reminders 30 minutes before your booking
                </p>
              </div>
              <Switch
                id="email-reminder"
                checked={notifications.emailBookingReminder}
                onCheckedChange={(checked) =>
                  setNotifications((prev) => ({
                    ...prev,
                    emailBookingReminder: checked,
                  }))
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-cancel">Email cancellation notices</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when bookings are cancelled
                </p>
              </div>
              <Switch
                id="email-cancel"
                checked={notifications.emailCancellation}
                onCheckedChange={(checked) =>
                  setNotifications((prev) => ({
                    ...prev,
                    emailCancellation: checked,
                  }))
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications">Push notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive browser notifications for important updates
                </p>
              </div>
              <Switch
                id="push-notifications"
                checked={notifications.pushNotifications}
                onCheckedChange={(checked) =>
                  setNotifications((prev) => ({
                    ...prev,
                    pushNotifications: checked,
                  }))
                }
              />
            </div>
          </div>

          <Button onClick={handleSaveNotifications} disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Saving..." : "Save Preferences"}
          </Button>
        </CardContent>
      </Card>

      {/* Booking Preferences */}
      <Card className="shadow-elegant border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Booking Preferences
          </CardTitle>
          <CardDescription>
            Customize your default booking settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Default booking duration (hours)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="8"
                value={preferences.defaultBookingDuration}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    defaultBookingDuration: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chair-type">Preferred chair type</Label>
              <Input
                id="chair-type"
                value={preferences.preferredChairType}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    preferredChairType: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-cancel">Auto-cancel no-shows</Label>
              <p className="text-sm text-muted-foreground">
                Automatically cancel bookings if you don't check in within 15
                minutes
              </p>
            </div>
            <Switch
              id="auto-cancel"
              checked={preferences.autoCancel}
              onCheckedChange={(checked) =>
                setPreferences((prev) => ({ ...prev, autoCancel: checked }))
              }
            />
          </div>

          <Button onClick={handleSavePreferences} disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Saving..." : "Save Preferences"}
          </Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      {user?.role === "admin" && (
        <Card className="shadow-elegant border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Security & Administration
            </CardTitle>
            <CardDescription>
              Manage security settings and administrative options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h4 className="font-medium text-primary mb-2">
                Administrator Access
              </h4>
              <p className="text-sm text-muted-foreground">
                You have administrator privileges. You can manage all chairs,
                bookings, and users.
              </p>
            </div>

            <Button variant="outline">Change Password</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Settings;
