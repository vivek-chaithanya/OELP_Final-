import { useEffect, useMemo, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Crops = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [crops, setCrops] = useState<{ id: number; name: string; icon_url?: string | null }[]>([]);
  const [varieties, setVarieties] = useState<{ id: number; crop: number; name: string; is_primary: boolean }[]>([]);
  const [openCropDialog, setOpenCropDialog] = useState(false);
  const [openVarietyDialog, setOpenVarietyDialog] = useState(false);
  const [openLifecycleDialog, setOpenLifecycleDialog] = useState(false);
  const [editingCrop, setEditingCrop] = useState<{ id: number; name: string; icon_url?: string | null } | null>(null);
  const [editingVariety, setEditingVariety] = useState<{ id: number; crop: number; name: string; is_primary: boolean } | null>(null);
  const [formCrop, setFormCrop] = useState({ name: "", icon_url: "" });
  const [formVariety, setFormVariety] = useState({ crop: "", name: "", is_primary: false });
  const [fields, setFields] = useState<any[]>([]);
  const [lifecycle, setLifecycle] = useState({ field: "", sowing_date: "", growth_start_date: "", flowering_date: "", harvesting_date: "", yield_amount: "" });

  const API_URL = (import.meta as any).env.VITE_API_URL || (import.meta as any).env.REACT_APP_API_URL || "/api";

  const authHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Token ${token}` } : {};
  };

  const loadData = async () => {
    try {
      const [cropsRes, varietiesRes, fieldsRes] = await Promise.all([
        fetch(`${API_URL}/crops/`, { headers: { "Content-Type": "application/json", ...authHeaders() } }),
        fetch(`${API_URL}/crop-varieties/`, { headers: { "Content-Type": "application/json", ...authHeaders() } }),
        fetch(`${API_URL}/fields/`, { headers: { "Content-Type": "application/json", ...authHeaders() } }),
      ]);
      if (!cropsRes.ok) throw new Error("Failed to load crops");
      if (!varietiesRes.ok) throw new Error("Failed to load varieties");
      if (!fieldsRes.ok) throw new Error("Failed to load fields");
      const cropsData = await cropsRes.json();
      const varietiesData = await varietiesRes.json();
      const fieldsData = await fieldsRes.json();
      const cropsItems = Array.isArray(cropsData.results) ? cropsData.results : cropsData;
      const varietyItems = Array.isArray(varietiesData.results) ? varietiesData.results : varietiesData;
      const fieldsItems = Array.isArray(fieldsData.results) ? fieldsData.results : fieldsData;
      setCrops(cropsItems);
      setVarieties(varietyItems);
      setFields(fieldsItems);
    } catch (e: any) {
      toast.error(e.message || "Failed to load data");
    }
  };

  useEffect(() => {
    loadData();
    const params = new URLSearchParams(window.location.search);
    if (params.get('dialog') === 'add') setOpenCropDialog(true);
  }, []);

  const lifecycleStages = [
    { stage: "Planting", count: 0, completion: "0%" },
    { stage: "Growing", count: 0, completion: "0%" },
    { stage: "Ready to Harvest", count: 0, completion: "0%" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Growing": return "default";
      case "Harvested": return "secondary";
      case "Flowering": return "outline";
      default: return "default";
    }
  };

  const filteredCrops = useMemo(() => {
    if (!searchQuery) return crops;
    return crops.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, crops]);

  const handleOpenNewCrop = () => {
    setEditingCrop(null);
    setFormCrop({ name: "", icon_url: "" });
    setOpenCropDialog(true);
  };

  const handleOpenEditCrop = (crop: { id: number; name: string; icon_url?: string | null }) => {
    setEditingCrop(crop);
    setFormCrop({ name: crop.name, icon_url: crop.icon_url || "" });
    setOpenCropDialog(true);
  };

  const handleDeleteCrop = async (cropId: number) => {
    if (!confirm("Delete this crop?")) return;
    const res = await fetch(`${API_URL}/crops/${cropId}/`, { method: "DELETE", headers: authHeaders() });
    if (res.ok) {
      toast.success("Crop deleted");
      loadData();
    } else {
      toast.error("Failed to delete crop");
    }
  };

  const submitCrop = async () => {
    const payload = { name: formCrop.name, icon_url: formCrop.icon_url || null };
    const isEdit = !!editingCrop;
    const url = isEdit ? `${API_URL}/crops/${editingCrop!.id}/` : `${API_URL}/crops/`;
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      toast.success(isEdit ? "Crop updated" : "Crop created");
      setOpenCropDialog(false);
      loadData();
    } else {
      const err = await res.json().catch(() => ({}));
      toast.error(err.detail || "Failed to save crop");
    }
  };

  const sampleCrops: Record<string, string> = {
    Wheat: "https://img.icons8.com/?size=100&id=sG7uHhOyoJxY&format=png",
    Corn: "https://img.icons8.com/?size=100&id=Y1c3gJHn5yXn&format=png",
    Rice: "https://img.icons8.com/?size=100&id=eiwHws37JfSC&format=png",
    Tomato: "https://img.icons8.com/?size=100&id=6mV0h3PZLw8s&format=png",
    Soybean: "https://img.icons8.com/?size=100&id=MkqY0b1GQkUR&format=png",
  };

  const applySampleCrop = (name: string) => {
    setFormCrop({ name, icon_url: sampleCrops[name] || "" });
  };

  const submitLifecycle = async () => {
    if (!lifecycle.field) {
      toast.error("Select a field");
      return;
    }
    const res = await fetch(`${API_URL}/fields/${lifecycle.field}/update_lifecycle/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({
        sowing_date: lifecycle.sowing_date || null,
        growth_start_date: lifecycle.growth_start_date || null,
        flowering_date: lifecycle.flowering_date || null,
        harvesting_date: lifecycle.harvesting_date || null,
        yield_amount: lifecycle.yield_amount ? Number(lifecycle.yield_amount) : null,
      }),
    });
    if (res.ok) {
      toast.success("Lifecycle updated");
      setOpenLifecycleDialog(false);
    } else {
      toast.error("Failed to update lifecycle");
    }
  };

  const handleOpenNewVariety = () => {
    setEditingVariety(null);
    setFormVariety({ crop: "", name: "", is_primary: false });
    setOpenVarietyDialog(true);
  };

  const handleOpenEditVariety = (v: { id: number; crop: number; name: string; is_primary: boolean }) => {
    setEditingVariety(v);
    setFormVariety({ crop: String(v.crop), name: v.name, is_primary: v.is_primary });
    setOpenVarietyDialog(true);
  };

  const handleDeleteVariety = async (id: number) => {
    if (!confirm("Delete this variety?")) return;
    const res = await fetch(`${API_URL}/crop-varieties/${id}/`, { method: "DELETE", headers: authHeaders() });
    if (res.ok) {
      toast.success("Variety deleted");
      loadData();
    } else {
      toast.error("Failed to delete variety");
    }
  };

  const submitVariety = async () => {
    const payload = {
      crop: Number(formVariety.crop),
      name: formVariety.name,
      is_primary: !!formVariety.is_primary,
    };
    const isEdit = !!editingVariety;
    const url = isEdit ? `${API_URL}/crop-varieties/${editingVariety!.id}/` : `${API_URL}/crop-varieties/`;
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      toast.success(isEdit ? "Variety updated" : "Variety created");
      setOpenVarietyDialog(false);
      loadData();
    } else {
      const err = await res.json().catch(() => ({}));
      toast.error(err.detail || "Failed to save variety");
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
          <Button onClick={handleOpenNewVariety}>
            <Plus className="mr-2 h-4 w-4" />
            Add Variety
          </Button>
          <Button onClick={handleOpenNewCrop}>
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
              {filteredCrops.map((crop) => (
                <TableRow key={crop.id}>
                  <TableCell className="font-medium">{crop.name}</TableCell>
                  <TableCell>{varieties.find((v) => v.crop === crop.id && v.is_primary)?.name || "-"}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    <Badge>—</Badge>
                  </TableCell>
                  <TableCell>—</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenEditCrop(crop)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteCrop(crop.id)}>
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
            <Button onClick={() => setOpenLifecycleDialog(true)}>Update Lifecycle</Button>
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

      <Dialog open={openCropDialog} onOpenChange={setOpenCropDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCrop ? "Edit Crop" : "Add Crop"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input value={formCrop.name} onChange={(e) => setFormCrop({ ...formCrop, name: e.target.value })} />
                <select className="border rounded-md h-10 px-3" onChange={(e) => applySampleCrop(e.target.value)} defaultValue="">
                  <option value="" disabled>Choose sample</option>
                  {Object.keys(sampleCrops).map((n) => (<option key={n} value={n}>{n}</option>))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Icon URL</Label>
              <Input value={formCrop.icon_url} onChange={(e) => setFormCrop({ ...formCrop, icon_url: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpenCropDialog(false)}>Cancel</Button>
              <Button onClick={submitCrop}>{editingCrop ? "Update" : "Create"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openLifecycleDialog} onOpenChange={setOpenLifecycleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Lifecycle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Field</Label>
              <select className="border rounded-md h-10 px-3 w-full" value={lifecycle.field} onChange={(e) => setLifecycle({ ...lifecycle, field: e.target.value })}>
                <option value="" disabled>Select field</option>
                {fields.map((f) => (<option key={f.id} value={f.id}>{f.name}</option>))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label>Sowing Date</Label>
                <Input type="date" value={lifecycle.sowing_date} onChange={(e) => setLifecycle({ ...lifecycle, sowing_date: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Growth Start</Label>
                <Input type="date" value={lifecycle.growth_start_date} onChange={(e) => setLifecycle({ ...lifecycle, growth_start_date: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Flowering Date</Label>
                <Input type="date" value={lifecycle.flowering_date} onChange={(e) => setLifecycle({ ...lifecycle, flowering_date: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Harvesting Date</Label>
                <Input type="date" value={lifecycle.harvesting_date} onChange={(e) => setLifecycle({ ...lifecycle, harvesting_date: e.target.value })} />
              </div>
              <div className="space-y-1 col-span-2">
                <Label>Yield</Label>
                <Input type="number" placeholder="0" value={lifecycle.yield_amount} onChange={(e) => setLifecycle({ ...lifecycle, yield_amount: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpenLifecycleDialog(false)}>Cancel</Button>
              <Button onClick={submitLifecycle}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openVarietyDialog} onOpenChange={setOpenVarietyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingVariety ? "Edit Variety" : "Add Variety"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Crop</Label>
              <select
                className="border rounded-md h-10 px-3"
                value={formVariety.crop}
                onChange={(e) => setFormVariety({ ...formVariety, crop: e.target.value })}
              >
                <option value="" disabled>
                  Select crop
                </option>
                {crops.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={formVariety.name} onChange={(e) => setFormVariety({ ...formVariety, name: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="is_primary"
                type="checkbox"
                checked={formVariety.is_primary}
                onChange={(e) => setFormVariety({ ...formVariety, is_primary: e.target.checked })}
              />
              <Label htmlFor="is_primary">Primary variety</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpenVarietyDialog(false)}>Cancel</Button>
              <Button onClick={submitVariety}>{editingVariety ? "Update" : "Create"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Crops;
