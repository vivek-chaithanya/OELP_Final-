import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sprout, CreditCard, Map, Plus, FileText, Upload, BarChart } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState([
    { title: "Active Crops", value: "0", icon: Sprout, description: "Currently growing", onClick: () => navigate("/crops") },
    { title: "Current Subscription", value: "Free", icon: CreditCard, description: "—", onClick: () => navigate("/subscriptions") },
    { title: "Total Fields", value: "0 acres", icon: Map, description: "0 fields", onClick: () => navigate("/fields") },
  ]);
  const [practices, setPractices] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const API_URL = (import.meta as any).env.VITE_API_URL || (import.meta as any).env.REACT_APP_API_URL || "/api";
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/dashboard/`, { headers: { ...(token ? { Authorization: `Token ${token}` } : {}) } })
      .then(async (r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        const activeCrops = Number(data.active_crops || 0);
        const fieldsCount = Number(data.active_fields || 0);
        const planLabel = data.current_plan?.plan_name || "Free";
        setStats([
          { title: "Active Crops", value: String(activeCrops), icon: Sprout, description: "Currently growing", onClick: () => navigate("/crops") },
          { title: "Current Subscription", value: planLabel, icon: CreditCard, description: "—", onClick: () => navigate("/subscriptions") },
          { title: "Total Fields", value: `${0} acres`, icon: Map, description: `${fieldsCount} fields`, onClick: () => navigate("/fields") },
        ]);
        setPractices(data.current_practices || []);
        setRecentActivity((data.recent_activity || []).map((a: any) => ({ action: a.file, time: new Date(a.uploaded_at).toLocaleString() })));
      })
      .catch(() => {});
  }, []);

  const practiceRow = (p: any) => ({ name: p.method_name || "Irrigation", status: new Date(p.performed_at).toLocaleString(), field: p.field_name, time: "" });


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back!</h1>
        <p className="text-muted-foreground">Here's your farm overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card 
            key={stat.title} 
            className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/50"
            onClick={stat.onClick}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Practices</CardTitle>
            <CardDescription>Active farming activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {practices.map((practice, index) => (
                <div key={index} className="flex items-start justify-between border-b pb-3 last:border-0">
                  <div className="space-y-1">
                    <p className="font-medium">{practice.name}</p>
                    <p className="text-sm text-muted-foreground">{practice.field}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary">{practice.status}</p>
                    <p className="text-xs text-muted-foreground">{practice.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates</CardDescription>
              </div>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex justify-between items-center">
                  <p className="text-sm">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => navigate('/crops?dialog=add')}>
              <Plus className="h-5 w-5" />
              <span>Add New Crop</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => navigate('/practices?dialog=add')}>
              <FileText className="h-5 w-5" />
              <span>Record Practice</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => navigate('/fields?dialog=soil')}>
              <Upload className="h-5 w-5" />
              <span>Generate Soil Report</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2">
              <BarChart className="h-5 w-5" />
              <span>View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
