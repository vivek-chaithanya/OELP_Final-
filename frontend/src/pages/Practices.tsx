import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const Practices = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    { label: "Total Practices", value: "18" },
    { label: "Completed", value: "75% complete" },
    { label: "In Progress", value: "4" },
    { label: "Overdue", value: "1" },
  ];

  const practices = [
    { id: 1, name: "Wheat Fertilization", crop: "Wheat", stage: "Growth", status: "Completed", dueDate: "2024-01-10" },
    { id: 2, name: "Corn Irrigation", crop: "Corn", stage: "Seedling", status: "In Progress", dueDate: "2024-01-25" },
    { id: 3, name: "Rice Pest Control", crop: "Rice", stage: "Flowering", status: "Pending", dueDate: "2024-01-30" },
    { id: 4, name: "Tomato Pruning", crop: "Tomato", stage: "Vegetative", status: "Overdue", dueDate: "2024-01-15" },
  ];

  const lifecycleStages = [
    { stage: "Seed Preparation", crops: 2, completion: 100 },
    { stage: "Planting", crops: 3, completion: 80 },
    { stage: "Seedling", crops: 4, completion: 60 },
    { stage: "Vegetative", crops: 5, completion: 40 },
    { stage: "Flowering", crops: 3, completion: 70 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "secondary";
      case "In Progress": return "default";
      case "Pending": return "outline";
      case "Overdue": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Practices & Lifecycle</h1>
          <p className="text-muted-foreground">Track and manage your farming activities</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Practice
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search practices..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Practices</CardTitle>
          <CardDescription>Track and manage your farming activities</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Practice</TableHead>
                <TableHead>Crop</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {practices.map((practice) => (
                <TableRow key={practice.id}>
                  <TableCell className="font-medium">{practice.name}</TableCell>
                  <TableCell>{practice.crop}</TableCell>
                  <TableCell>{practice.stage}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(practice.status)}>{practice.status}</Badge>
                  </TableCell>
                  <TableCell>{practice.dueDate}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Update Status</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Crop Lifecycle Management</CardTitle>
          <CardDescription>Track crops through different growth stages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lifecycleStages.map((stage) => (
              <div key={stage.stage} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{stage.stage}</p>
                    <p className="text-sm text-muted-foreground">{stage.crops} crops</p>
                  </div>
                  <p className="text-sm font-medium text-primary">{stage.completion}% complete</p>
                </div>
                <Progress value={stage.completion} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Practices;
