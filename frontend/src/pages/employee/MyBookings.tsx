import React, { useState } from 'react';
import { Calendar, Clock, MapPin, X, Edit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

interface Booking {
  id: string;
  chairName: string;
  chairId: string;
  chairType: string;
  location: string;
  date: string;
  time: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  canCancel: boolean;
}

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      chairName: 'Herman Miller Aeron',
      chairId: 'ERG-001',
      chairType: 'Ergonomic',
      location: 'Floor 2 - Zone A',
      date: '2024-01-15',
      time: '09:00 - 12:00',
      status: 'upcoming',
      canCancel: true,
    },
    {
      id: '2',
      chairName: 'Large Bean Bag Blue',
      chairId: 'BB-001',
      chairType: 'Bean Bag',
      location: 'Floor 1 - Lounge',
      date: '2024-01-14',
      time: '14:00 - 17:00',
      status: 'active',
      canCancel: false,
    },
    {
      id: '3',
      chairName: 'Steelcase Leap',
      chairId: 'ERG-002',
      chairType: 'Ergonomic',
      location: 'Floor 2 - Zone B',
      date: '2024-01-12',
      time: '10:00 - 13:00',
      status: 'completed',
      canCancel: false,
    },
    {
      id: '4',
      chairName: 'Adjustable Bar Stool',
      chairId: 'HS-001',
      chairType: 'High Stool',
      location: 'Floor 2 - Standing Area',
      date: '2024-01-10',
      time: '15:00 - 18:00',
      status: 'cancelled',
      canCancel: false,
    },
  ]);

  const handleCancelBooking = (bookingId: string) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' as const, canCancel: false }
          : booking
      )
    );
    
    toast({
      title: "Booking cancelled",
      description: "Your chair reservation has been cancelled successfully.",
    });
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'upcoming':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'active':
        return 'bg-success/10 text-success border-success/20';
      case 'completed':
        return 'bg-muted text-muted-foreground border-muted/20';
      case 'cancelled':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const filterBookings = (status: string) => {
    if (status === 'all') return bookings;
    if (status === 'active') return bookings.filter(b => b.status === 'upcoming' || b.status === 'active');
    return bookings.filter(b => b.status === status);
  };

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <Card className="shadow-soft border-0 hover:shadow-elegant transition-all">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">{booking.chairName}</h3>
              <p className="text-sm text-muted-foreground">
                {booking.chairId} • {booking.chairType}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {booking.date} • {booking.time}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {booking.location}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(booking.status)}>
              {booking.status}
            </Badge>
            {booking.canCancel && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCancelBooking(booking.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Bookings</h1>
        <p className="text-muted-foreground mt-2">
          View and manage your chair reservations.
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Bookings</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="space-y-4">
            {filterBookings('all').map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="space-y-4">
            {filterBookings('active').length > 0 ? (
              filterBookings('active').map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <Card className="shadow-soft border-0">
                <CardContent className="p-12 text-center">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No active bookings</h3>
                  <p className="text-muted-foreground mt-2">
                    You don't have any active chair reservations.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="space-y-4">
            {filterBookings('completed').map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          <div className="space-y-4">
            {filterBookings('cancelled').map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyBookings;