import React, { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

interface Booking {
  _id: string;
  chairType: string;
  chairId: string;
  date: string;
  timeSlot: string;
  location: string;
  status: string;
}

const Dashboard = () => {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/bookings/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setBookings(data.bookings || []);
      } catch (err) {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchBookings();
  }, [token]);

  // Calculate stats
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const totalBookings = bookings.filter((b) => {
    const d = new Date(b.date);
    return d >= startOfMonth && d <= endOfMonth;
  }).length;

  // Helper to parse booking date and timeSlot
  function getBookingDateTime(b: Booking) {
    // If timeSlot is present, use its start time
    if (b.timeSlot) {
      // Example timeSlot: "13:00 - 16:00"
      const startTime = b.timeSlot.split("-")[0].trim();
      // Combine date and start time
      return new Date(`${b.date}T${startTime}`);
    }
    // Fallback: just date
    return new Date(b.date);
  }

  // Show all future confirmed bookings as upcoming
  const upcomingBookings = bookings.filter((b) => {
    const bookingDate = getBookingDateTime(b);
    // Use only date part for comparison
    return bookingDate >= new Date() && b.status === "confirmed";
  });

  // Optionally, you can also show a message if there are future bookings but none in next 7 days
  const next7DaysBookings = bookings.filter((b) => {
    const d = new Date(b.date);
    return (
      d >= now &&
      d <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) &&
      b.status === "confirmed"
    );
  });

  const favoriteType = (() => {
    const typeCount: Record<string, number> = {};
    bookings.forEach((b) => {
      typeCount[b.chairType] = (typeCount[b.chairType] || 0) + 1;
    });
    return Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
  })();

  const quickStats = [
    {
      title: "Total Bookings",
      value: totalBookings,
      description: "This month",
      icon: Calendar,
    },
    {
      title: "Upcoming",
      value: upcomingBookings.length,
      description: "Next 7 days",
      icon: Clock,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's what's happening with your chair bookings today.
          </p>
        </div>
        <Link to="/book-chair">
          <Button className="self-start sm:self-auto">
            <Plus className="mr-2 h-4 w-4" />
            Book a Chair
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStats.map((stat) => (
          <Card key={stat.title} className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Bookings */}
      <Card className="shadow-elegant border-0">
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Your latest chair reservations</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading...
            </div>
          ) : bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings
                .slice(-3)
                .reverse()
                .map((booking) => (
                  <div
                    key={booking._id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border bg-surface/50 hover:bg-surface transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {booking.chairType} Chair
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {booking.chairId} • {booking.location}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <Clock className="inline-block mr-1 h-4 w-4 align-middle" />
                          {booking.date} • {booking.timeSlot}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <Badge
                        variant="secondary"
                        className={
                          booking.status === "confirmed"
                            ? "bg-success/10 text-success border-success/20"
                            : booking.status === "cancelled"
                            ? "bg-destructive/10 text-destructive border-destructive/20"
                            : "bg-muted/10 text-muted border-muted/20"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              <div className="pt-4 border-t border-border">
                <Link to="/my-bookings">
                  <Button variant="outline" className="w-full">
                    View All Bookings
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">No bookings yet</h3>
              <p className="text-muted-foreground mt-2">
                You haven't made any chair reservations yet.
              </p>
              <Link to="/book-chair">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Book Your First Chair
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-soft border-0 hover:shadow-elegant transition-all cursor-pointer">
          <Link to="/book-chair">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Quick Book
              </CardTitle>
              <CardDescription>
                Find and reserve an available chair instantly
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="shadow-soft border-0 hover:shadow-elegant transition-all cursor-pointer">
          <Link to="/my-bookings">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Manage Bookings
              </CardTitle>
              <CardDescription>
                View, modify, or cancel your reservations
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
