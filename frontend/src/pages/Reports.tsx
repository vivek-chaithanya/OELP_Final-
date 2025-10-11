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
    { title: "Total Yield", value: "0", change: "" },
    { title: "Active Reports", value: "0", subtitle: "" },
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

      {/* Analytics cards intentionally removed per requirements */}

      {/* Health and productivity sections removed per requirements */}
    </div>
  );
};

export default Reports;
