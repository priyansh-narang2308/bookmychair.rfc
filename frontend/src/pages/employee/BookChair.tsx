import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Armchair, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

interface Chair {
  id: string;
  name: string;
  type: string;
  location: string;
  status: 'available' | 'booked' | 'maintenance';
  features: string[];
  image?: string;
}

const BookChair = () => {
  const [selectedChair, setSelectedChair] = useState<Chair | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const chairCategories = [
    {
      id: 'ergonomic',
      name: 'Ergonomic',
      description: 'Professional chairs with lumbar support',
      chairs: [
        {
          id: 'ERG-001',
          name: 'Herman Miller Aeron',
          type: 'Ergonomic',
          location: 'Floor 2 - Zone A',
          status: 'available' as const,
          features: ['Lumbar Support', 'Adjustable Height', 'Mesh Back'],
        },
        {
          id: 'ERG-002',
          name: 'Steelcase Leap',
          type: 'Ergonomic',
          location: 'Floor 2 - Zone B',
          status: 'available' as const,
          features: ['4D Armrests', 'Lumbar Support', 'Breathable Fabric'],
        },
        {
          id: 'ERG-003',
          name: 'Humanscale Freedom',
          type: 'Ergonomic',
          location: 'Floor 3 - Zone A',
          status: 'booked' as const,
          features: ['Auto-Recline', 'Weight-Activated', 'Gel Armrests'],
        },
      ],
    },
    {
      id: 'beanbag',
      name: 'Bean Bag',
      description: 'Comfortable casual seating',
      chairs: [
        {
          id: 'BB-001',
          name: 'Large Bean Bag Blue',
          type: 'Bean Bag',
          location: 'Floor 1 - Lounge',
          status: 'available' as const,
          features: ['Memory Foam', 'Washable Cover', 'Extra Large'],
        },
        {
          id: 'BB-002',
          name: 'Bean Bag Charcoal',
          type: 'Bean Bag',
          location: 'Floor 1 - Lounge',
          status: 'available' as const,
          features: ['Microfiber', 'Water Resistant', 'Medium Size'],
        },
      ],
    },
    {
      id: 'highstool',
      name: 'High Stool',
      description: 'Standing desk compatible stools',
      chairs: [
        {
          id: 'HS-001',
          name: 'Adjustable Bar Stool',
          type: 'High Stool',
          location: 'Floor 2 - Standing Area',
          status: 'available' as const,
          features: ['Gas Lift', 'Swivel Base', 'Footrest'],
        },
        {
          id: 'HS-002',
          name: 'Ergonomic Stool',
          type: 'High Stool',
          location: 'Floor 3 - Standing Area',
          status: 'maintenance' as const,
          features: ['Tilt Mechanism', 'Ring Base', 'Fabric Seat'],
        },
      ],
    },
  ];

  const timeSlots = [
    '09:00 - 12:00',
    '10:00 - 13:00',
    '12:00 - 15:00',
    '13:00 - 16:00',
    '14:00 - 17:00',
    '15:00 - 18:00',
  ];

  const handleBookChair = () => {
    if (!selectedChair || !selectedDate || !selectedTime) {
      toast({
        title: "Missing information",
        description: "Please select a chair, date, and time slot.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Booking confirmed!",
      description: `${selectedChair.name} booked for ${selectedDate} at ${selectedTime}`,
    });

    // Reset form
    setSelectedChair(null);
    setSelectedDate('');
    setSelectedTime('');
  };

  const getStatusColor = (status: Chair['status']) => {
    switch (status) {
      case 'available':
        return 'bg-success/10 text-success border-success/20';
      case 'booked':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'maintenance':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Book a Chair</h1>
        <p className="text-muted-foreground mt-2">
          Choose from our available chair categories and reserve your spot.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chair Selection */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="ergonomic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              {chairCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {chairCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="space-y-4">
                <div className="text-center py-2">
                  <h3 className="text-lg font-semibold">{category.name} Chairs</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.chairs.map((chair) => (
                    <Card 
                      key={chair.id} 
                      className={`cursor-pointer transition-all hover:shadow-elegant ${
                        selectedChair?.id === chair.id 
                          ? 'ring-2 ring-primary shadow-elegant' 
                          : 'shadow-soft'
                      } ${chair.status !== 'available' ? 'opacity-60' : ''}`}
                      onClick={() => chair.status === 'available' && setSelectedChair(chair)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{chair.name}</CardTitle>
                            <CardDescription className="flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3" />
                              {chair.location}
                            </CardDescription>
                          </div>
                          <Badge className={getStatusColor(chair.status)}>
                            {chair.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex flex-wrap gap-1">
                          {chair.features.map((feature) => (
                            <Badge key={feature} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                        {selectedChair?.id === chair.id && (
                          <div className="mt-3 flex items-center gap-2 text-primary">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm">Selected</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Booking Form */}
        <div>
          <Card className="shadow-elegant border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Book Your Chair
              </CardTitle>
              <CardDescription>
                Select date and time for your reservation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedChair ? (
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2">
                    <Armchair className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">{selectedChair.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedChair.location}
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-muted/50 rounded-lg border border-dashed border-muted-foreground/30">
                  <p className="text-sm text-muted-foreground text-center">
                    Select a chair from the categories above
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Time Slot</label>
                <div className="grid grid-cols-1 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`p-2 text-sm rounded-md border transition-colors ${
                        selectedTime === slot
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background hover:bg-surface border-border'
                      }`}
                    >
                      <Clock className="inline h-3 w-3 mr-1" />
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleBookChair}
                className="w-full"
                disabled={!selectedChair || !selectedDate || !selectedTime}
              >
                Confirm Booking
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookChair;