import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Map as MapIcon, Droplets, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Fields = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    { title: "Total Fields", value: "8", subtitle: "25.5 hectares total", icon: MapIcon },
    { title: "Irrigation Systems", value: "5", subtitle: "3 types in use", icon: Droplets },
    { title: "Soil Reports", value: "12", subtitle: "Last updated this month", icon: FileText },
  ];

  const fields = [
    { id: 1, name: "Field A1", size: "5.2 hectares", soilType: "Loamy", irrigation: "Drip", health: "Good", lastReport: "2024-01-15" },
    { id: 2, name: "Field B2", size: "3.8 hectares", soilType: "Clay", irrigation: "Sprinkler", health: "Excellent", lastReport: "2024-01-20" },
    { id: 3, name: "Field C3", size: "7.1 hectares", soilType: "Sandy", irrigation: "Flood", health: "Fair", lastReport: "2024-01-10" },
  ];

  const getHealthColor = (health: string) => {
    switch (health) {
      case "Excellent": return "default";
      case "Good": return "secondary";
      case "Fair": return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Fields Management</h1>
          <p className="text-muted-foreground">Manage your farmland, soil reports, and irrigation systems</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Field
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search fields by name or soil type..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Fields</CardTitle>
          <CardDescription>Overview of all your farmland and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Soil Type</TableHead>
                <TableHead>Irrigation</TableHead>
                <TableHead>Soil Health</TableHead>
                <TableHead>Last Report</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field) => (
                <TableRow key={field.id}>
                  <TableCell className="font-medium">{field.name}</TableCell>
                  <TableCell>{field.size}</TableCell>
                  <TableCell>{field.soilType}</TableCell>
                  <TableCell>{field.irrigation}</TableCell>
                  <TableCell>
                    <Badge variant={getHealthColor(field.health)}>{field.health}</Badge>
                  </TableCell>
                  <TableCell>{field.lastReport}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">Report</Button>
                      <Button variant="ghost" size="sm">Irrigation</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Soil Management</CardTitle>
            <CardDescription>Upload and manage soil reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Generate Soil Report
            </Button>
            <Button variant="outline" className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              View Soil Analysis
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Irrigation Control</CardTitle>
            <CardDescription>Manage irrigation systems</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full">
              <Droplets className="mr-2 h-4 w-4" />
              Set Irrigation Method
            </Button>
            <Button variant="outline" className="w-full">
              <Droplets className="mr-2 h-4 w-4" />
              Schedule Irrigation
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Fields;
