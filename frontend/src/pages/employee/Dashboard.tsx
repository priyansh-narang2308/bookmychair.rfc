import React from 'react';
import { Calendar, Clock, MapPin, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  // Mock upcoming bookings
  const upcomingBookings = [
    {
      id: '1',
      chairType: 'Ergonomic',
      chairId: 'ERG-001',
      date: '2024-01-15',
      time: '09:00 - 12:00',
      location: 'Floor 2 - Zone A',
      status: 'confirmed'
    },
    {
      id: '2',
      chairType: 'Bean Bag',
      chairId: 'BB-005',
      date: '2024-01-16',
      time: '14:00 - 17:00',
      location: 'Floor 1 - Lounge',
      status: 'confirmed'
    },
  ];

  const quickStats = [
    {
      title: 'Total Bookings',
      value: '12',
      description: 'This month',
      icon: Calendar,
    },
    {
      title: 'Upcoming',
      value: '3',
      description: 'Next 7 days',
      icon: Clock,
    },
    {
      title: 'Favorite Type',
      value: 'Ergonomic',
      description: 'Most booked',
      icon: MapPin,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.name?.split(' ')[0]}!
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
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming Bookings */}
      <Card className="shadow-elegant border-0">
        <CardHeader>
          <CardTitle>Upcoming Bookings</CardTitle>
          <CardDescription>
            Your confirmed chair reservations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingBookings.length > 0 ? (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
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
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">
                      {booking.date}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {booking.time}
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="mt-1 bg-success/10 text-success border-success/20"
                    >
                      Confirmed
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
              <h3 className="mt-4 text-lg font-medium">No upcoming bookings</h3>
              <p className="text-muted-foreground mt-2">
                You don't have any chair reservations yet.
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