import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Armchair,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { io } from "socket.io-client";

interface Chair {
  id: string;
  name: string;
  type: string;
  location: string;
  status: "available" | "occupied" | "blocked" | "maintenance";
  features: string[];
  lastBooking?: string;
}

// Backend chair type
interface BackendChair {
  chairId: string;
  chairName: string;
  chairType: string;
  chairLocation: string;
  chairStatus: "available" | "booked" | "blocked" | "maintenance";
  chairFeatures: string[];
  lastBooking?: string;
}

const socket = io(import.meta.env.VITE_API_URL);

const ChairManagement = () => {
  const { token } = useAuth();
  const [chairs, setChairs] = useState<Chair[]>([
    {
      id: "ERG-001",
      name: "Herman Miller Aeron",
      type: "Ergonomic",
      location: "Floor 2 - Zone A",
      status: "available",
      features: ["Lumbar Support", "Adjustable Height", "Mesh Back"],
      lastBooking: "2024-01-14",
    },
    {
      id: "ERG-002",
      name: "Steelcase Leap",
      type: "Ergonomic",
      location: "Floor 2 - Zone B",
      status: "occupied",
      features: ["4D Armrests", "Lumbar Support", "Breathable Fabric"],
      lastBooking: "2024-01-15",
    },
    {
      id: "BB-001",
      name: "Large Bean Bag Blue",
      type: "Bean Bag",
      location: "Floor 1 - Lounge",
      status: "available",
      features: ["Memory Foam", "Washable Cover", "Extra Large"],
      lastBooking: "2024-01-13",
    },
    {
      id: "HS-001",
      name: "Adjustable Bar Stool",
      type: "High Stool",
      location: "Floor 2 - Standing Area",
      status: "blocked",
      features: ["Gas Lift", "Swivel Base", "Footrest"],
      lastBooking: "2024-01-12",
    },
    {
      id: "ERG-003",
      name: "Humanscale Freedom",
      type: "Ergonomic",
      location: "Floor 3 - Zone A",
      status: "maintenance",
      features: ["Auto-Recline", "Weight-Activated", "Gel Armrests"],
      lastBooking: "2024-01-10",
    },
  ]);
  const [dbChairs, setDbChairs] = useState<Chair[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    id: "",
    name: "",
    type: "",
    location: "",
    features: "",
    status: "available",
  });

  // Fetch chairs from backend
  const fetchDbChairs = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chairs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setDbChairs(
      (data.chairs || []).map((c: BackendChair) => ({
        id: c.chairId,
        name: c.chairName,
        type: c.chairType,
        location: c.chairLocation,
        status: c.chairStatus,
        features: c.chairFeatures,
        lastBooking: c.lastBooking,
      }))
    );
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchDbChairs();
    socket.on("chairUpdated", fetchDbChairs);
    return () => {
      socket.off("chairUpdated", fetchDbChairs);
    };
  }, [fetchDbChairs]);

  const handleStatusChange = (chairId: string, newStatus: Chair["status"]) => {
    setChairs((prev) =>
      prev.map((chair) =>
        chair.id === chairId ? { ...chair, status: newStatus } : chair
      )
    );

    toast({
      title: "Chair status updated",
      description: `Chair ${chairId} status changed to ${newStatus}`,
    });
  };

  const handleRemoveChair = (chairId: string) => {
    setChairs((prev) => prev.filter((chair) => chair.id !== chairId));
    toast({
      title: "Chair removed",
      description: `Chair ${chairId} has been removed from the system`,
      variant: "destructive",
    });
  };

  // Add new chair to DB
  const handleAddChair = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chairs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        chairId: form.id,
        chairName: form.name,
        chairType: form.type,
        chairLocation: form.location,
        chairFeatures: form.features.split(",").map((f) => f.trim()),
        chairStatus: form.status,
      }),
    });
    if (res.ok) {
      setForm({
        id: "",
        name: "",
        type: "",
        location: "",
        features: "",
        status: "available",
      });
      setShowAdd(false);
      toast({
        title: "Chair added",
        description: "New chair added successfully.",
      });
    } else {
      const error = await res.json();
      toast({
        title: "Error adding chair",
        description: error.error || "Unknown error",
        variant: "destructive",
      });
    }
  };

  // Delete chair from DB
  const handleRemoveDbChair = async (chairId: string) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/chairs/${chairId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    toast({
      title: "Chair removed",
      description: `Chair ${chairId} removed from database.`,
      variant: "destructive",
    });
  };

  // Block chair in DB
  const handleBlockDbChair = async (chairId: string) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/chairs/${chairId}/block`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    toast({
      title: "Chair blocked",
      description: `Chair ${chairId} is now blocked.`,
    });
  };

  const getStatusColor = (status: Chair["status"]) => {
    switch (status) {
      case "available":
        return "bg-success/10 text-success border-success/20";
      case "occupied":
        return "bg-primary/10 text-primary border-primary/20";
      case "blocked":
        return "bg-warning/10 text-warning border-warning/20";
      case "maintenance":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const filteredChairs = chairs.filter((chair) => {
    const matchesSearch =
      chair.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chair.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chair.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || chair.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const stats = [
    {
      title: "Total Chairs",
      value: chairs.length,
      color: "text-primary",
    },
    {
      title: "Available",
      value: chairs.filter((c) => c.status === "available").length,
      color: "text-success",
    },
    {
      title: "Occupied",
      value: chairs.filter((c) => c.status === "occupied").length,
      color: "text-primary",
    },
    {
      title: "Blocked/Maintenance",
      value: chairs.filter(
        (c) => c.status === "blocked" || c.status === "maintenance"
      ).length,
      color: "text-warning",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Chair Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage all chairs in your workspace.
          </p>
        </div>
        <Button onClick={() => setShowAdd(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Chair
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-soft border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Armchair className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Chair Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <form
            onSubmit={handleAddChair}
            className="bg-white p-8 rounded-lg shadow-lg space-y-4 w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-2">Add New Chair</h2>
            <Input
              placeholder="Chair ID"
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
              required
            />
            <Input
              placeholder="Chair Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              placeholder="Chair Type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              required
            />
            <Input
              placeholder="Chair Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
            />
            <Input
              placeholder="Chair Features (comma separated)"
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
              required
            />
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAdd(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Chair</Button>
            </div>
          </form>
        </div>
      )}

      {/* Filters and Search */}
      <Card className="shadow-elegant border-0">
        <CardHeader>
          <CardTitle>All Chairs</CardTitle>
          <CardDescription>
            Manage chair availability and maintenance status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search chairs by name, ID, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter: {filterStatus === "all" ? "All" : filterStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("available")}>
                  Available
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("occupied")}>
                  Occupied
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("blocked")}>
                  Blocked
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterStatus("maintenance")}
                >
                  Maintenance
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Chair</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Hardcoded chairs for demo/user */}
                {filteredChairs.map((chair) => (
                  <TableRow key={chair.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{chair.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {chair.id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{chair.type}</TableCell>
                    <TableCell>{chair.location}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(chair.status)}>
                        {chair.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{chair.features.join(", ")}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(chair.id, "available")
                            }
                            disabled={chair.status === "available"}
                          >
                            Mark Available
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(chair.id, "blocked")
                            }
                            disabled={chair.status === "blocked"}
                          >
                            Block Chair
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(chair.id, "maintenance")
                            }
                            disabled={chair.status === "maintenance"}
                          >
                            Mark for Maintenance
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleRemoveChair(chair.id)}
                            className="text-destructive"
                          >
                            Remove Chair
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {/* DB chairs for admin */}
                {dbChairs.map((chair) => (
                  <TableRow key={chair.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{chair.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {chair.id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{chair.type}</TableCell>
                    <TableCell>{chair.location}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(chair.status)}>
                        {chair.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{chair.features.join(", ")}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleBlockDbChair(chair.id)}
                            disabled={chair.status === "blocked"}
                          >
                            Block Chair
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleRemoveDbChair(chair.id)}
                            className="text-destructive"
                          >
                            Remove Chair
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredChairs.length === 0 && (
            <div className="text-center py-8">
              <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">No chairs found</h3>
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

export default ChairManagement;
