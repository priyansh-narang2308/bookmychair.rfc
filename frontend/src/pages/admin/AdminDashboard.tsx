import React from 'react';
import { 
  Armchair, 
  Users, 
  Calendar, 
  AlertTriangle,
  TrendingUp,
  Clock,
  MapPin
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Chairs',
      value: '48',
      change: '+2 from last month',
      icon: Armchair,
      color: 'text-primary',
    },
    {
      title: 'Active Bookings',
      value: '23',
      change: '+12% from yesterday',
      icon: Calendar,
      color: 'text-success',
    },
    {
      title: 'Blocked Chairs',
      value: '3',
      change: '2 under maintenance',
      icon: AlertTriangle,
      color: 'text-warning',
    },
    {
      title: 'Total Users',
      value: '127',
      change: '+8 this week',
      icon: Users,
      color: 'text-primary',
    },
  ];

  const recentBookings = [
    {
      id: '1',
      user: 'John Doe',
      chair: 'ERG-001',
      type: 'Ergonomic',
      time: '09:00 - 12:00',
      status: 'active',
    },
    {
      id: '2',
      user: 'Jane Smith',
      chair: 'BB-005',
      type: 'Bean Bag',
      time: '14:00 - 17:00',
      status: 'upcoming',
    },
    {
      id: '3',
      user: 'Mike Johnson',
      chair: 'HS-012',
      type: 'High Stool',
      time: '10:30 - 13:30',
      status: 'completed',
    },
  ];

  const popularChairs = ['Ergonomic (45%)', 'Bean Bag (32%)', 'High Stool (23%)'];
  const peakHours = ['9:00 AM', '1:00 PM', '3:00 PM'];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage chair bookings across your workspace.
          </p>
        </div>
        <Badge variant="secondary" className="self-start sm:self-auto">
          {user?.name} • Administrator
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Chair Types */}
        <Card className="shadow-elegant border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Most Popular Chair Types
            </CardTitle>
            <CardDescription>
              Usage distribution by chair category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularChairs.map((chair, index) => (
                <div key={chair} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{chair}</span>
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ 
                        width: index === 0 ? '45%' : index === 1 ? '32%' : '23%' 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Peak Hours */}
        <Card className="shadow-elegant border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Peak Booking Hours
            </CardTitle>
            <CardDescription>
              Busiest times for chair reservations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {peakHours.map((hour, index) => (
                <div key={hour} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{hour}</span>
                  <Badge 
                    variant={index === 0 ? 'default' : 'secondary'}
                    className={index === 0 ? 'bg-primary' : ''}
                  >
                    {index === 0 ? 'Peak' : index === 1 ? 'High' : 'Moderate'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card className="shadow-elegant border-0">
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>
            Latest chair reservations and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-surface/50 hover:bg-surface transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">
                      {booking.user}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {booking.chair} • {booking.type}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">
                    {booking.time}
                  </div>
                  <Badge 
                    variant={
                      booking.status === 'active' ? 'default' :
                      booking.status === 'upcoming' ? 'secondary' :
                      'outline'
                    }
                    className={
                      booking.status === 'active' ? 'bg-success text-success-foreground' :
                      booking.status === 'upcoming' ? 'bg-warning/10 text-warning border-warning/20' :
                      ''
                    }
                  >
                    {booking.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;