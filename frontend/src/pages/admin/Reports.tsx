import React from 'react';
import { BarChart3, TrendingUp, Users, Calendar, Download, Armchair } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Reports = () => {
  // Mock data for charts
  const monthlyBookings = [
    { month: 'Jan', bookings: 145 },
    { month: 'Feb', bookings: 167 },
    { month: 'Mar', bookings: 189 },
    { month: 'Apr', bookings: 203 },
    { month: 'May', bookings: 178 },
    { month: 'Jun', bookings: 221 },
  ];

  const chairTypeUsage = [
    { type: 'Ergonomic', percentage: 45, bookings: 98 },
    { type: 'Bean Bag', percentage: 32, bookings: 67 },
    { type: 'High Stool', percentage: 23, bookings: 48 },
  ];

  const peakHours = [
    { hour: '9:00 AM', bookings: 23 },
    { hour: '10:00 AM', bookings: 31 },
    { hour: '11:00 AM', bookings: 18 },
    { hour: '12:00 PM', bookings: 12 },
    { hour: '1:00 PM', bookings: 28 },
    { hour: '2:00 PM', bookings: 25 },
    { hour: '3:00 PM', bookings: 34 },
    { hour: '4:00 PM', bookings: 22 },
  ];

  const topUsers = [
    { name: 'John Doe', bookings: 23, department: 'Engineering' },
    { name: 'Jane Smith', bookings: 19, department: 'Design' },
    { name: 'Mike Johnson', bookings: 17, department: 'Marketing' },
    { name: 'Sarah Wilson', bookings: 15, department: 'Engineering' },
    { name: 'David Brown', bookings: 14, department: 'Sales' },
  ];

  const stats = [
    {
      title: 'Total Bookings',
      value: '1,247',
      change: '+12.5%',
      description: 'vs last month',
      icon: Calendar,
      color: 'text-primary',
    },
    {
      title: 'Unique Users',
      value: '89',
      change: '+8.2%',
      description: 'active this month',
      icon: Users,
      color: 'text-success',
    },
    {
      title: 'Avg. Daily Usage',
      value: '76%',
      change: '+5.1%',
      description: 'chair utilization',
      icon: TrendingUp,
      color: 'text-primary',
    },
    {
      title: 'Peak Hour',
      value: '3:00 PM',
      change: '34 bookings',
      description: 'highest activity',
      icon: BarChart3,
      color: 'text-warning',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Insights and statistics about chair booking patterns.
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
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
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs bg-success/10 text-success">
                  {stat.change}
                </Badge>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Bookings Trend */}
        <Card className="shadow-elegant border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Monthly Booking Trends
            </CardTitle>
            <CardDescription>
              Booking volume over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyBookings.map((data, index) => (
                <div key={data.month} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{data.month}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ 
                          width: `${(data.bookings / Math.max(...monthlyBookings.map(m => m.bookings))) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8">{data.bookings}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chair Type Usage */}
        <Card className="shadow-elegant border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Armchair className="h-5 w-5 text-primary" />
              Chair Type Popularity
            </CardTitle>
            <CardDescription>
              Usage distribution by chair category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chairTypeUsage.map((data) => (
                <div key={data.type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{data.type}</span>
                    <div className="text-right">
                      <div className="text-sm font-medium">{data.percentage}%</div>
                      <div className="text-xs text-muted-foreground">{data.bookings} bookings</div>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${data.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Peak Hours and Top Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Hours */}
        <Card className="shadow-elegant border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Peak Booking Hours
            </CardTitle>
            <CardDescription>
              Busiest times for chair reservations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {peakHours.map((data) => (
                <div key={data.hour} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{data.hour}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-primary rounded-full transition-all"
                        style={{ 
                          width: `${(data.bookings / Math.max(...peakHours.map(h => h.bookings))) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-6">{data.bookings}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Users */}
        <Card className="shadow-elegant border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Most Active Users
            </CardTitle>
            <CardDescription>
              Top chair booking users this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topUsers.map((user, index) => (
                <div key={user.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium text-primary">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.department}</div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {user.bookings} bookings
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;