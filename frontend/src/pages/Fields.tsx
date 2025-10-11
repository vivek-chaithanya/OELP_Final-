import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Map as MapIcon, Droplets, FileText, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Fields = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [fields, setFields] = useState<any[]>([]);
  const [farms, setFarms] = useState<any[]>([]);
  const [crops, setCrops] = useState<any[]>([]);
  const [varieties, setVarieties] = useState<any[]>([]);
  const [openFieldDialog, setOpenFieldDialog] = useState(false);
  const [openIrrigationDialog, setOpenIrrigationDialog] = useState(false);
  const [openSoilReportDialog, setOpenSoilReportDialog] = useState(false);
  const [editingField, setEditingField] = useState<any | null>(null);
  const [formField, setFormField] = useState({
    name: "",
    farm: "",
    crop: "",
    crop_variety: "",
    device: "",
    location_name: "",
    soil_type: "",
    is_active: true,
  });
  const [irrigationMethods, setIrrigationMethods] = useState<any[]>([]);
  const [soilTextures, setSoilTextures] = useState<any[]>([]);
  const [irrigationForm, setIrrigationForm] = useState({ field: "", irrigation_method: "", notes: "" });
  const [soilForm, setSoilForm] = useState({ field: "", ph: "", ec: "", soil_type: "" });
  const API_URL = (import.meta as any).env.VITE_API_URL || (import.meta as any).env.REACT_APP_API_URL || "/api";
  const authHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Token ${token}` } : {};
  };
  const loadData = async () => {
    try {
      const [fieldsRes, farmsRes, cropsRes, varietiesRes, irrRes, soilTexRes] = await Promise.all([
        fetch(`${API_URL}/fields/`, { headers: authHeaders() }),
        fetch(`${API_URL}/farms/`, { headers: authHeaders() }),
        fetch(`${API_URL}/crops/`, { headers: authHeaders() }),
        fetch(`${API_URL}/crop-varieties/`, { headers: authHeaders() }),
        fetch(`${API_URL}/irrigation-methods/`, { headers: authHeaders() }),
        fetch(`${API_URL}/soil-textures/`, { headers: authHeaders() }),
      ]);
      const j = async (r: Response) => (Array.isArray(await r.clone().json().catch(() => [])) ? await r.json() : (await r.json()).results);
      setFields(await j(fieldsRes));
      setFarms(await j(farmsRes));
      setCrops(await j(cropsRes));
      setVarieties(await j(varietiesRes));
      setIrrigationMethods(await j(irrRes));
      setSoilTextures(await j(soilTexRes));
    } catch (e: any) {
      toast.error(e.message || "Failed to load data");
    }
  };
  useEffect(() => {
    loadData();
    const params = new URLSearchParams(window.location.search);
    if (params.get('dialog') === 'soil') setOpenSoilReportDialog(true);
  }, []);

  const stats = [
    { title: "Total Fields", value: String(fields.length || 0), subtitle: `${0} acres total`, icon: MapIcon },
    { title: "Irrigation Systems", value: "0", subtitle: "0 types in use", icon: Droplets },
    { title: "Soil Reports", value: "0", subtitle: "—", icon: FileText },
  ];

  const filteredFields = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return fields.filter((f) => f.name.toLowerCase().includes(q));
  }, [fields, searchQuery]);

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
        <Button onClick={() => { setEditingField(null); setFormField({ name: "", farm: "", crop: "", crop_variety: "", device: "", location_name: "", is_active: true }); setOpenFieldDialog(true); }}>
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
              {filteredFields.map((field) => (
                <TableRow key={field.id}>
                  <TableCell className="font-medium">{field.name}</TableCell>
                  <TableCell>{field.area?.hectares ? `${field.area.hectares} ha` : "-"}</TableCell>
                  <TableCell>{field.soil_type_name || "-"}</TableCell>
                  <TableCell>{field.irrigation || "-"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">—</Badge>
                  </TableCell>
                  <TableCell>{field.updated_at?.slice(0,10) || "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => { setEditingField(field); setFormField({ name: field.name || "", farm: String(field.farm || ""), crop: String(field.crop || ""), crop_variety: String(field.crop_variety || ""), device: String(field.device || ""), location_name: field.location_name || "", is_active: !!field.is_active }); setOpenFieldDialog(true); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={async () => { if (!confirm("Delete this field?")) return; const res = await fetch(`${API_URL}/fields/${field.id}/`, { method: "DELETE", headers: authHeaders() }); if (res.ok) { toast.success("Field deleted"); loadData(); } else { toast.error("Failed to delete field"); } }}>
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

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Soil Management</CardTitle>
            <CardDescription>Upload and manage soil reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" onClick={() => setOpenSoilReportDialog(true)}>
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
            <Button className="w-full" onClick={() => setOpenIrrigationDialog(true)}>
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
      <Dialog open={openFieldDialog} onOpenChange={setOpenFieldDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingField ? "Edit Field" : "Add Field"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={formField.name} onChange={(e) => setFormField({ ...formField, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Farm</Label>
                <select className="border rounded-md h-10 px-3 w-full" value={formField.farm} onChange={(e) => setFormField({ ...formField, farm: e.target.value })}>
                  <option value="" disabled>Select farm</option>
                  {farms.map((f) => (<option key={f.id} value={f.id}>{f.name}</option>))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Device</Label>
                <Input value={formField.device} onChange={(e) => setFormField({ ...formField, device: e.target.value })} placeholder="Device ID (optional)" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Crop</Label>
                <select className="border rounded-md h-10 px-3 w-full" value={formField.crop} onChange={(e) => setFormField({ ...formField, crop: e.target.value })}>
                  <option value="">None</option>
                  {crops.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Variety</Label>
                <select className="border rounded-md h-10 px-3 w-full" value={formField.crop_variety} onChange={(e) => setFormField({ ...formField, crop_variety: e.target.value })}>
                  <option value="">None</option>
                  {varieties.filter((v) => String(v.crop) === String(formField.crop)).map((v) => (<option key={v.id} value={v.id}>{v.name}</option>))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Soil Type</Label>
              <select className="border rounded-md h-10 px-3 w-full" value={formField.soil_type} onChange={(e) => setFormField({ ...formField, soil_type: e.target.value })}>
                <option value="">None</option>
                {soilTextures.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Location Name</Label>
              <Input value={formField.location_name} onChange={(e) => setFormField({ ...formField, location_name: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpenFieldDialog(false)}>Cancel</Button>
              <Button onClick={async () => {
                const payload: any = {
                  name: formField.name,
                  farm: formField.farm ? Number(formField.farm) : undefined,
                  crop: formField.crop ? Number(formField.crop) : null,
                  crop_variety: formField.crop_variety ? Number(formField.crop_variety) : null,
                  device: formField.device ? Number(formField.device) : null,
                  location_name: formField.location_name || null,
                  soil_type: formField.soil_type ? Number(formField.soil_type) : null,
                  is_active: !!formField.is_active,
                };
                const isEdit = !!editingField;
                const url = isEdit ? `${API_URL}/fields/${editingField.id}/` : `${API_URL}/fields/`;
                const method = isEdit ? "PUT" : "POST";
                const res = await fetch(url, { method, headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify(payload) });
                if (res.ok) { toast.success(isEdit ? "Field updated" : "Field created"); setOpenFieldDialog(false); loadData(); } else { const err = await res.json().catch(() => ({})); toast.error(err.detail || "Failed to save field"); }
              }}>{editingField ? "Update" : "Create"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Irrigation Practice Dialog */}
      <Dialog open={openIrrigationDialog} onOpenChange={setOpenIrrigationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Irrigation Practice</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Field</Label>
              <select className="border rounded-md h-10 px-3 w-full" value={irrigationForm.field} onChange={(e) => setIrrigationForm({ ...irrigationForm, field: e.target.value })}>
                <option value="" disabled>Select field</option>
                {fields.map((f) => (<option key={f.id} value={f.id}>{f.name}</option>))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Irrigation Method</Label>
              <select className="border rounded-md h-10 px-3 w-full" value={irrigationForm.irrigation_method} onChange={(e) => setIrrigationForm({ ...irrigationForm, irrigation_method: e.target.value })}>
                <option value="" disabled>Select method</option>
                {irrigationMethods.map((m) => (<option key={m.id} value={m.id}>{m.name}</option>))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Input value={irrigationForm.notes} onChange={(e) => setIrrigationForm({ ...irrigationForm, notes: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpenIrrigationDialog(false)}>Cancel</Button>
              <Button onClick={async () => {
                if (!irrigationForm.field || !irrigationForm.irrigation_method) { toast.error("Select field and method"); return; }
                const res = await fetch(`${API_URL}/irrigation-practices/`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json", ...authHeaders() },
                  body: JSON.stringify({ field: Number(irrigationForm.field), irrigation_method: Number(irrigationForm.irrigation_method), notes: irrigationForm.notes || null }),
                });
                if (res.ok) { toast.success("Practice recorded"); setOpenIrrigationDialog(false); } else { toast.error("Failed to record practice"); }
              }}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Soil Report Dialog */}
      <Dialog open={openSoilReportDialog} onOpenChange={setOpenSoilReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Soil Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Field</Label>
              <select className="border rounded-md h-10 px-3 w-full" value={soilForm.field} onChange={(e) => setSoilForm({ ...soilForm, field: e.target.value })}>
                <option value="" disabled>Select field</option>
                {fields.map((f) => (<option key={f.id} value={f.id}>{f.name}</option>))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>pH</Label>
                <Input type="number" step="0.01" value={soilForm.ph} onChange={(e) => setSoilForm({ ...soilForm, ph: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>EC</Label>
                <Input type="number" step="0.01" value={soilForm.ec} onChange={(e) => setSoilForm({ ...soilForm, ec: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Soil Type</Label>
              <select className="border rounded-md h-10 px-3 w-full" value={soilForm.soil_type} onChange={(e) => setSoilForm({ ...soilForm, soil_type: e.target.value })}>
                <option value="" disabled>Select texture</option>
                {soilTextures.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpenSoilReportDialog(false)}>Cancel</Button>
              <Button onClick={async () => {
                if (!soilForm.field || !soilForm.ph || !soilForm.ec || !soilForm.soil_type) { toast.error("Fill all required fields"); return; }
                const res = await fetch(`${API_URL}/soil-reports/`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json", ...authHeaders() },
                  body: JSON.stringify({ field: Number(soilForm.field), ph: Number(soilForm.ph), ec: Number(soilForm.ec), soil_type: Number(soilForm.soil_type) }),
                });
                if (res.ok) { toast.success("Soil report created"); setOpenSoilReportDialog(false); } else { toast.error("Failed to create report"); }
              }}>Generate</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Fields;
