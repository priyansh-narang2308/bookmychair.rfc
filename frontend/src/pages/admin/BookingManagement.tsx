import React, { useState } from 'react';
import { Search, Filter, Calendar, MoreHorizontal, X, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

interface Booking {
  id: string;
  userId: string;
  userName: string;
  chairId: string;
  chairName: string;
  chairType: string;
  location: string;
  date: string;
  time: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  bookedAt: string;
}

const BookingManagement = () => {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'BK-001',
      userId: 'USR-001',
      userName: 'John Doe',
      chairId: 'ERG-001',
      chairName: 'Herman Miller Aeron',
      chairType: 'Ergonomic',
      location: 'Floor 2 - Zone A',
      date: '2024-01-15',
      time: '09:00 - 12:00',
      status: 'upcoming',
      bookedAt: '2024-01-14 10:30',
    },
    {
      id: 'BK-002',
      userId: 'USR-002',
      userName: 'Jane Smith',
      chairId: 'BB-001',
      chairName: 'Large Bean Bag Blue',
      chairType: 'Bean Bag',
      location: 'Floor 1 - Lounge',
      date: '2024-01-15',
      time: '14:00 - 17:00',
      status: 'active',
      bookedAt: '2024-01-13 15:20',
    },
    {
      id: 'BK-003',
      userId: 'USR-003',
      userName: 'Mike Johnson',
      chairId: 'ERG-002',
      chairName: 'Steelcase Leap',
      chairType: 'Ergonomic',
      location: 'Floor 2 - Zone B',
      date: '2024-01-14',
      time: '10:00 - 13:00',
      status: 'completed',
      bookedAt: '2024-01-12 09:15',
    },
    {
      id: 'BK-004',
      userId: 'USR-004',
      userName: 'Sarah Wilson',
      chairId: 'HS-001',
      chairName: 'Adjustable Bar Stool',
      chairType: 'High Stool',
      location: 'Floor 2 - Standing Area',
      date: '2024-01-16',
      time: '15:00 - 18:00',
      status: 'upcoming',
      bookedAt: '2024-01-14 14:45',
    },
    {
      id: 'BK-005',
      userId: 'USR-005',
      userName: 'David Brown',
      chairId: 'ERG-003',
      chairName: 'Humanscale Freedom',
      chairType: 'Ergonomic',
      location: 'Floor 3 - Zone A',
      date: '2024-01-12',
      time: '11:00 - 14:00',
      status: 'cancelled',
      bookedAt: '2024-01-10 16:20',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterChairType, setFilterChairType] = useState<string>('all');

  const handleCancelBooking = (bookingId: string) => {
    setBookings(prev =>
      prev.map(booking =>
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' as const }
          : booking
      )
    );

    toast({
      title: "Booking cancelled",
      description: `Booking ${bookingId} has been cancelled by admin`,
    });
  };

  const handleCompleteBooking = (bookingId: string) => {
    setBookings(prev =>
      prev.map(booking =>
        booking.id === bookingId 
          ? { ...booking, status: 'completed' as const }
          : booking
      )
    );

    toast({
      title: "Booking completed",
      description: `Booking ${bookingId} has been marked as completed`,
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

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.chairName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.chairId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatusFilter = filterStatus === 'all' || booking.status === filterStatus;
    const matchesTypeFilter = filterChairType === 'all' || booking.chairType === filterChairType;
    
    return matchesSearch && matchesStatusFilter && matchesTypeFilter;
  });

  const stats = [
    {
      title: 'Total Bookings',
      value: bookings.length,
      color: 'text-primary',
    },
    {
      title: 'Active Today',
      value: bookings.filter(b => b.status === 'active').length,
      color: 'text-success',
    },
    {
      title: 'Upcoming',
      value: bookings.filter(b => b.status === 'upcoming').length,
      color: 'text-primary',
    },
    {
      title: 'Completed',
      value: bookings.filter(b => b.status === 'completed').length,
      color: 'text-muted-foreground',
    },
  ];

  const chairTypes = [...new Set(bookings.map(b => b.chairType))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Booking Management</h1>
        <p className="text-muted-foreground mt-2">
          Monitor and manage all chair bookings across your workspace.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Calendar className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bookings Table */}
      <Card className="shadow-elegant border-0">
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>
            View and manage all chair reservations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user, chair, or booking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Status: {filterStatus === 'all' ? 'All' : filterStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('upcoming')}>
                  Upcoming
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('active')}>
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('completed')}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('cancelled')}>
                  Cancelled
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Type: {filterChairType === 'all' ? 'All' : filterChairType}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterChairType('all')}>
                  All Types
                </DropdownMenuItem>
                {chairTypes.map(type => (
                  <DropdownMenuItem 
                    key={type}
                    onClick={() => setFilterChairType(type)}
                  >
                    {type}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Chair</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Booked At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.userName}</div>
                        <div className="text-sm text-muted-foreground">{booking.userId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.chairName}</div>
                        <div className="text-sm text-muted-foreground">
                          {booking.chairId} • {booking.chairType}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {booking.location}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.date}</div>
                        <div className="text-sm text-muted-foreground">{booking.time}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {booking.bookedAt}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {booking.status === 'active' && (
                            <DropdownMenuItem
                              onClick={() => handleCompleteBooking(booking.id)}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark Completed
                            </DropdownMenuItem>
                          )}
                          {(booking.status === 'upcoming' || booking.status === 'active') && (
                            <DropdownMenuItem
                              onClick={() => handleCancelBooking(booking.id)}
                              className="text-destructive"
                            >
                              <X className="mr-2 h-4 w-4" />
                              Cancel Booking
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">No bookings found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingManagement;