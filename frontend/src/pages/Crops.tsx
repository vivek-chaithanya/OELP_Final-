import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Crops = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const crops = [
    { id: 1, name: "Wheat", variety: "Winter Wheat", season: "Rabi", status: "Growing", plantedDate: "2024-11-15" },
    { id: 2, name: "Corn", variety: "Sweet Corn", season: "Kharif", status: "Harvested", plantedDate: "2024-06-10" },
    { id: 3, name: "Rice", variety: "Basmati", season: "Kharif", status: "Growing", plantedDate: "2024-07-01" },
    { id: 4, name: "Tomato", variety: "Cherry Tomato", season: "All Season", status: "Flowering", plantedDate: "2024-09-20" },
  ];

  const lifecycleStages = [
    { stage: "Planting", count: 4, completion: "100%" },
    { stage: "Growing", count: 6, completion: "60%" },
    { stage: "Ready to Harvest", count: 2, completion: "95%" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Growing": return "default";
      case "Harvested": return "secondary";
      case "Flowering": return "outline";
      default: return "default";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Crops Management</h1>
          <p className="text-muted-foreground">Manage your crops, varieties, and lifecycles</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Variety
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Crop
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search crops or varieties..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Crops</CardTitle>
          <CardDescription>Overview of all your crops and their current status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Crop Name</TableHead>
                <TableHead>Variety</TableHead>
                <TableHead>Season</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Planted Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {crops.map((crop) => (
                <TableRow key={crop.id}>
                  <TableCell className="font-medium">{crop.name}</TableCell>
                  <TableCell>{crop.variety}</TableCell>
                  <TableCell>{crop.season}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(crop.status)}>{crop.status}</Badge>
                  </TableCell>
                  <TableCell>{crop.plantedDate}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Lifecycle Management</CardTitle>
              <CardDescription>Track and update crop lifecycle stages</CardDescription>
            </div>
            <Button>Update Lifecycle</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {lifecycleStages.map((stage) => (
              <Card key={stage.stage}>
                <CardHeader>
                  <CardTitle className="text-lg">{stage.stage}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary">{stage.count} crops</p>
                  <p className="text-sm text-muted-foreground">{stage.completion} complete</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Crops;
