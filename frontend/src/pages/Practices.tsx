import { useEffect, useMemo, useState } from "react";
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
  const API_URL = (import.meta as any).env.VITE_API_URL || (import.meta as any).env.REACT_APP_API_URL || "/api";
  const authHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Token ${token}` } : {};
  };
  const [practices, setPractices] = useState<any[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [methods, setMethods] = useState<any[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [form, setForm] = useState({ field: "", irrigation_method: "", notes: "" });

  const load = async () => {
    try {
      const [pRes, fRes, mRes] = await Promise.all([
        fetch(`${API_URL}/irrigation-practices/`, { headers: authHeaders() }),
        fetch(`${API_URL}/fields/`, { headers: authHeaders() }),
        fetch(`${API_URL}/irrigation-methods/`, { headers: authHeaders() }),
      ]);
      const j = async (r: Response) => (Array.isArray(await r.clone().json().catch(() => [])) ? await r.json() : (await r.json()).results);
      setPractices(await j(pRes));
      setFields(await j(fRes));
      setMethods(await j(mRes));
    } catch {}
  };
  useEffect(() => {
    load();
    const params = new URLSearchParams(window.location.search);
    if (params.get('dialog') === 'add') setOpenAdd(true);
  }, []);

  const stats = [
    { label: "Total Practices", value: String(practices.length || 0) },
    { label: "Completed", value: "0% complete" },
    { label: "In Progress", value: String(practices.length || 0) },
    { label: "Overdue", value: "0" },
  ];

  const rows = useMemo(() => practices.map((p: any) => ({
    id: p.id,
    name: p.method_name || methods.find((m: any) => m.id === p.irrigation_method)?.name || 'Irrigation',
    crop: fields.find((f: any) => f.id === p.field)?.crop_name || '-',
    stage: '-',
    status: new Date(p.performed_at).toLocaleString(),
    dueDate: '-',
  })), [practices, fields, methods]);

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
        <Button onClick={() => setOpenAdd(true)}>
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
              {rows.map((practice) => (
                <TableRow key={practice.id}>
                  <TableCell className="font-medium">{practice.name}</TableCell>
                  <TableCell>{practice.crop}</TableCell>
                  <TableCell>{practice.stage}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor('In Progress')}>{practice.status}</Badge>
                  </TableCell>
                  <TableCell>{practice.dueDate}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => {}} disabled>Update Status</Button>
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
      {/* Add Practice Dialog */}
      <div className={`fixed inset-0 ${openAdd ? '' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black/30" onClick={() => setOpenAdd(false)}></div>
        <div className="absolute right-0 top-0 h-full w-full max-w-md bg-background p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4">Record Practice</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm">Field</label>
              <select className="border rounded h-10 w-full px-3" value={form.field} onChange={(e) => setForm({ ...form, field: e.target.value })}>
                <option value="" disabled>Select field</option>
                {fields.map((f) => (<option key={f.id} value={f.id}>{f.name}</option>))}
              </select>
            </div>
            <div>
              <label className="text-sm">Irrigation Method</label>
              <select className="border rounded h-10 w-full px-3" value={form.irrigation_method} onChange={(e) => setForm({ ...form, irrigation_method: e.target.value })}>
                <option value="" disabled>Select method</option>
                {methods.map((m) => (<option key={m.id} value={m.id}>{m.name}</option>))}
              </select>
            </div>
            <div>
              <label className="text-sm">Notes</label>
              <input className="border rounded h-10 w-full px-3" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setOpenAdd(false)}>Cancel</Button>
              <Button onClick={async () => {
                if (!form.field || !form.irrigation_method) return;
                const res = await fetch(`${API_URL}/irrigation-practices/`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ field: Number(form.field), irrigation_method: Number(form.irrigation_method), notes: form.notes || null }) });
                if (res.ok) { setOpenAdd(false); load(); }
              }}>Save</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Practices;
