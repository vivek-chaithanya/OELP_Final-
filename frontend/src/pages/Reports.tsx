import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileDown, TrendingUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const Reports = () => {
  const API_URL = (import.meta as any).env.VITE_API_URL || (import.meta as any).env.REACT_APP_API_URL || "/api";
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const authHeaders = token ? { Authorization: `Token ${token}` } : {};
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const stats = [
    { title: "Total Yield", value: "146.1 tons", change: "+12% from last quarter", icon: TrendingUp },
    { title: "Revenue", value: "$91,700", change: "+8% from last quarter" },
    { title: "Avg Efficiency", value: "91%" },
    { title: "Active Reports", value: "24", subtitle: "6 pending review" },
  ];

  const cropHealth = [
    { crop: "Wheat", health: "Excellent", yield: "95%", issues: "None" },
    { crop: "Corn", health: "Good", yield: "88%", issues: "Minor pest activity" },
    { crop: "Rice", health: "Fair", yield: "76%", issues: "Nutrient deficiency" },
    { crop: "Tomato", health: "Good", yield: "82%", issues: "Fungal spots" },
  ];

  const soilHealth = [
    { field: "Field A1", ph: "6.8", nitrogen: "High", phosphorus: "Medium", potassium: "High", date: "2024-01-15" },
    { field: "Field B2", ph: "7.2", nitrogen: "Medium", phosphorus: "High", potassium: "Medium", date: "2024-01-20" },
    { field: "Field C3", ph: "6.5", nitrogen: "Low", phosphorus: "Low", potassium: "Medium", date: "2024-01-10" },
  ];

  const productivity = [
    { period: "Q4 2023", yield: "45.2 tons", revenue: "$28,400", efficiency: "92%" },
    { period: "Q3 2023", yield: "52.8 tons", revenue: "$33,200", efficiency: "89%" },
    { period: "Q2 2023", yield: "48.1 tons", revenue: "$30,100", efficiency: "91%" },
  ];

  const yieldData = [
    { name: "Q1", yield: 45 },
    { name: "Q2", yield: 48 },
    { name: "Q3", yield: 53 },
    { name: "Q4", yield: 45 },
  ];

  const cropDistribution = [
    { name: "Wheat", value: 30 },
    { name: "Corn", value: 25 },
    { name: "Rice", value: 25 },
    { name: "Others", value: 20 },
  ];

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

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
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights into your farming operations</p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Start</label>
            <input type="date" className="border rounded h-9 px-2" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">End</label>
            <input type="date" className="border rounded h-9 px-2" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} />
          </div>
          <Button
            variant="outline"
            onClick={() => {
              const qs = new URLSearchParams();
              if (dateRange.start) qs.set('start_date', dateRange.start);
              if (dateRange.end) qs.set('end_date', dateRange.end);
              window.open(`${API_URL}/reports/export/csv/?${qs.toString()}`, '_blank');
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Download CSV
          </Button>
          <Button
            onClick={() => {
              const qs = new URLSearchParams();
              if (dateRange.start) qs.set('start_date', dateRange.start);
              if (dateRange.end) qs.set('end_date', dateRange.end);
              window.open(`${API_URL}/reports/export/pdf/?${qs.toString()}`, '_blank');
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon && <stat.icon className="h-4 w-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change || stat.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quarterly Yield Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={yieldData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="yield" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crop Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={cropDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {cropDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Crop Health Analysis</CardTitle>
              <CardDescription>Current health status and expected yields</CardDescription>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Crop</TableHead>
                <TableHead>Health Status</TableHead>
                <TableHead>Expected Yield</TableHead>
                <TableHead>Issues</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cropHealth.map((crop) => (
                <TableRow key={crop.crop}>
                  <TableCell className="font-medium">{crop.crop}</TableCell>
                  <TableCell>
                    <Badge variant={getHealthColor(crop.health)}>{crop.health}</Badge>
                  </TableCell>
                  <TableCell>{crop.yield}</TableCell>
                  <TableCell>{crop.issues}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Soil Health Analysis</CardTitle>
          <CardDescription>Comprehensive soil condition reports for all fields</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field</TableHead>
                <TableHead>pH Level</TableHead>
                <TableHead>Nitrogen</TableHead>
                <TableHead>Phosphorus</TableHead>
                <TableHead>Potassium</TableHead>
                <TableHead>Report Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {soilHealth.map((soil) => (
                <TableRow key={soil.field}>
                  <TableCell className="font-medium">{soil.field}</TableCell>
                  <TableCell>{soil.ph}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{soil.nitrogen}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{soil.phosphorus}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{soil.potassium}</Badge>
                  </TableCell>
                  <TableCell>{soil.date}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">View</Button>
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
              <CardTitle>Productivity Analysis</CardTitle>
              <CardDescription>Quarterly performance metrics</CardDescription>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Total Yield</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Efficiency</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productivity.map((data) => (
                <TableRow key={data.period}>
                  <TableCell className="font-medium">{data.period}</TableCell>
                  <TableCell>{data.yield}</TableCell>
                  <TableCell>{data.revenue}</TableCell>
                  <TableCell>{data.efficiency}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
