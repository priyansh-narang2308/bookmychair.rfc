import React, { useEffect, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Download,
  Armchair,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPopularChairs, getPeakHours } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface ChairTypeUsage {
  type: string;
  bookings: number;
}
interface PeakHour {
  hour: string;
  bookings: number;
}

const Reports = () => {
  const { token } = useAuth();
  const [chairTypeUsage, setChairTypeUsage] = useState<ChairTypeUsage[]>([]);
  const [peakHours, setPeakHours] = useState<PeakHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [chairs, hours] = await Promise.all([
          getPopularChairs(token || ""),
          getPeakHours(token || ""),
        ]);
        setChairTypeUsage(chairs);
        setPeakHours(hours);
        setError("");
      } catch (err) {
        setError("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchAnalytics();
  }, [token]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground mt-2">
            Insights and statistics about chair booking patterns.
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>
      {loading ? (
        <div className="text-center py-10 text-muted-foreground">
          Loading analytics...
        </div>
      ) : error ? (
        <div className="text-center py-10 text-destructive">{error}</div>
      ) : (
        <>
          {/* Chair Type Usage */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                          <div className="text-sm font-medium">
                            {data.bookings}
                          </div>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{
                            width: `${
                              (data.bookings /
                                Math.max(
                                  ...chairTypeUsage.map((c) => c.bookings)
                                )) *
                              100
                            }%`,
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
                    <div
                      key={data.hour}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium">{data.hour}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-primary rounded-full transition-all"
                            style={{
                              width: `${
                                (data.bookings /
                                  Math.max(
                                    ...peakHours.map((h) => h.bookings)
                                  )) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-6">
                          {data.bookings}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
