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
  const [editingCrop, setEditingCrop] = useState<{ id: number; name: string; icon_url?: string | null } | null>(null);
  const [cropDetailsDialog, setCropDetailsDialog] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<any>(null);
  const [formCrop, setFormCrop] = useState({ 
    name: "", 
    icon_url: "", 
    season: "", 
    status: "", 
    planted_date: "", 
    variety: "", 
    sowing_date: "", 
    harvesting_date: "" 
  });
  const [fields, setFields] = useState<any[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState({ has_variety: "", crop_id: "" });

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

  const lifecycleStages = useMemo(() => {
    const now = new Date();
    const planting = crops.filter(crop => {
      const plantedDate = crop.planted_date ? new Date(crop.planted_date) : null;
      const sowingDate = crop.sowing_date ? new Date(crop.sowing_date) : null;
      const harvestDate = crop.harvesting_date ? new Date(crop.harvesting_date) : null;
      
      if (!plantedDate && !sowingDate) return false;
      
      const startDate = plantedDate || sowingDate;
      const daysSinceStart = Math.floor((now.getTime() - startDate!.getTime()) / (1000 * 60 * 60 * 24));
      
      return daysSinceStart <= 30; // Planting stage: first 30 days
    }).length;
    
    const growing = crops.filter(crop => {
      const plantedDate = crop.planted_date ? new Date(crop.planted_date) : null;
      const sowingDate = crop.sowing_date ? new Date(crop.sowing_date) : null;
      const harvestDate = crop.harvesting_date ? new Date(crop.harvesting_date) : null;
      
      if (!plantedDate && !sowingDate) return false;
      
      const startDate = plantedDate || sowingDate;
      const daysSinceStart = Math.floor((now.getTime() - startDate!.getTime()) / (1000 * 60 * 60 * 24));
      
      return daysSinceStart > 30 && (!harvestDate || now < harvestDate);
    }).length;
    
    const readyToHarvest = crops.filter(crop => {
      const harvestDate = crop.harvesting_date ? new Date(crop.harvesting_date) : null;
      if (!harvestDate) return false;
      
      const daysToHarvest = Math.floor((harvestDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysToHarvest <= 7 && daysToHarvest >= 0; // Ready to harvest: within 7 days
    }).length;
    
    const total = crops.length;
    
    return [
      { stage: "Planting", count: planting, completion: total > 0 ? `${Math.round((planting / total) * 100)}%` : "0%" },
      { stage: "Growing", count: growing, completion: total > 0 ? `${Math.round((growing / total) * 100)}%` : "0%" },
      { stage: "Ready to Harvest", count: readyToHarvest, completion: total > 0 ? `${Math.round((readyToHarvest / total) * 100)}%` : "0%" },
    ];
  }, [crops]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Growing": return "default";
      case "Harvested": return "secondary";
      case "Flowering": return "outline";
      default: return "default";
    }
  };

  const filteredCrops = useMemo(() => {
    let list = crops;
    if (filter.crop_id) list = list.filter((c) => String(c.id) === String(filter.crop_id));
    if (filter.has_variety === "yes") list = list.filter((c) => varieties.some((v) => v.crop === c.id));
    if (filter.has_variety === "no") list = list.filter((c) => !varieties.some((v) => v.crop === c.id));
    if (searchQuery) list = list.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return list;
  }, [searchQuery, crops, varieties, filter]);

  const handleOpenNewCrop = () => {
    setEditingCrop(null);
    setFormCrop({ 
      name: "", 
      icon_url: "", 
      season: "", 
      status: "", 
      planted_date: "", 
      variety: "", 
      sowing_date: "", 
      harvesting_date: "" 
    });
    setOpenCropDialog(true);
  };

  const handleOpenEditCrop = (crop: { id: number; name: string; icon_url?: string | null }) => {
    setEditingCrop(crop);
    setFormCrop({ 
      name: crop.name, 
      icon_url: crop.icon_url || "", 
      season: "", 
      status: "", 
      planted_date: "", 
      variety: "", 
      sowing_date: "", 
      harvesting_date: "" 
    });
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
    if (!formCrop.name || !formCrop.season || !formCrop.status || !formCrop.planted_date) { 
      toast.error('Please fill all required fields'); 
      return; 
    }
    const payload = { 
      name: formCrop.name, 
      icon_url: formCrop.icon_url || null,
      season: formCrop.season,
      status: formCrop.status,
      planted_date: formCrop.planted_date,
      variety: formCrop.variety,
      sowing_date: formCrop.sowing_date,
      harvesting_date: formCrop.harvesting_date
    };
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



  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Crops Management</h1>
          <p className="text-muted-foreground">Manage your crops, varieties, and lifecycles</p>
        </div>
        <div className="flex gap-2">
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
          <div className="flex gap-2 mt-3">
            <Button variant="outline" onClick={() => setFilterOpen((v) => !v)}>Filter</Button>
            {filterOpen && (
              <div className="flex gap-2 items-center text-sm">
                <label>Has Variety</label>
                <select className="border rounded h-9 px-2" value={filter.has_variety} onChange={(e) => setFilter({ ...filter, has_variety: e.target.value })}>
                  <option value="">Any</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
                <label>Crop</label>
                <select className="border rounded h-9 px-2" value={filter.crop_id} onChange={(e) => setFilter({ ...filter, crop_id: e.target.value })}>
                  <option value="">All</option>
                  {crops.map((c) => (<option key={c.id} value={String(c.id)}>{c.name}</option>))}
                </select>
                <Button variant="outline" size="sm" onClick={() => setFilter({ has_variety: "", crop_id: "" })}>Reset</Button>
              </div>
            )}
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
                <TableHead>Sowing Date</TableHead>
                <TableHead>Harvesting Date</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCrops.map((crop) => {
                const cropFeatures = [
                  crop.variety && `Variety: ${crop.variety}`,
                  crop.season && `Season: ${crop.season}`,
                  crop.status && `Status: ${crop.status}`,
                  crop.planted_date && `Planted: ${new Date(crop.planted_date).toLocaleDateString()}`,
                  crop.sowing_date && `Sowing: ${new Date(crop.sowing_date).toLocaleDateString()}`,
                  crop.harvesting_date && `Harvest: ${new Date(crop.harvesting_date).toLocaleDateString()}`
                ].filter(Boolean);
                
                const displayFeatures = cropFeatures.slice(0, 3);
                const hasMoreFeatures = cropFeatures.length > 3;
                
                return (
                  <TableRow 
                    key={crop.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => {
                      // Show detailed crop information in a dialog
                      setSelectedCrop(crop);
                      setCropDetailsDialog(true);
                    }}
                  >
                    <TableCell className="font-medium">{crop.name}</TableCell>
                    <TableCell>{crop.variety || varieties.find((v) => v.crop === crop.id && v.is_primary)?.name || "-"}</TableCell>
                    <TableCell>{crop.season || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(crop.status)}>{crop.status || "—"}</Badge>
                    </TableCell>
                    <TableCell>{crop.planted_date || "—"}</TableCell>
                    <TableCell>{crop.sowing_date || "—"}</TableCell>
                    <TableCell>{crop.harvesting_date || "—"}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {displayFeatures.map((feature, idx) => (
                          <div key={idx} className="text-xs text-muted-foreground">{feature}</div>
                        ))}
                        {hasMoreFeatures && (
                          <div className="text-xs text-primary font-medium">
                            +{cropFeatures.length - 3} more features
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
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
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lifecycle Management</CardTitle>
          <CardDescription>Track and update crop lifecycle stages</CardDescription>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingCrop ? "Edit Crop" : "Add Crop"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input value={formCrop.name} onChange={(e) => setFormCrop({ ...formCrop, name: e.target.value })} />
                <select className="border rounded-md h-10 px-3" onChange={(e) => applySampleCrop(e.target.value)} defaultValue="">
                  <option value="" disabled>Choose sample</option>
                  {Object.keys(sampleCrops).map((n) => (<option key={n} value={n}>{n}</option>))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Season *</Label>
                <select className="border rounded-md h-10 px-3 w-full" value={formCrop.season} onChange={(e) => setFormCrop({ ...formCrop, season: e.target.value })}>
                  <option value="" disabled>Select season</option>
                  <option value="Kharif">Kharif</option>
                  <option value="Rabi">Rabi</option>
                  <option value="Zaid">Zaid</option>
                  <option value="Summer">Summer</option>
                  <option value="Winter">Winter</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Status *</Label>
                <select className="border rounded-md h-10 px-3 w-full" value={formCrop.status} onChange={(e) => setFormCrop({ ...formCrop, status: e.target.value })}>
                  <option value="" disabled>Select status</option>
                  <option value="Planting">Planting</option>
                  <option value="Growing">Growing</option>
                  <option value="Flowering">Flowering</option>
                  <option value="Ready to Harvest">Ready to Harvest</option>
                  <option value="Harvested">Harvested</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Planted Date *</Label>
                <Input type="date" value={formCrop.planted_date} onChange={(e) => setFormCrop({ ...formCrop, planted_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Variety</Label>
                <Input value={formCrop.variety} onChange={(e) => setFormCrop({ ...formCrop, variety: e.target.value })} placeholder="Enter variety name" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sowing Date</Label>
                <Input type="date" value={formCrop.sowing_date} onChange={(e) => setFormCrop({ ...formCrop, sowing_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Harvesting Date</Label>
                <Input type="date" value={formCrop.harvesting_date} onChange={(e) => setFormCrop({ ...formCrop, harvesting_date: e.target.value })} />
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


      {/* Crop Details Dialog */}
      <Dialog open={cropDetailsDialog} onOpenChange={setCropDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crop Details</DialogTitle>
          </DialogHeader>
          {selectedCrop && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                {selectedCrop.icon_url && (
                  <img src={selectedCrop.icon_url} alt={selectedCrop.name} className="w-16 h-16 rounded-lg object-cover" />
                )}
                <div>
                  <h3 className="text-2xl font-bold">{selectedCrop.name}</h3>
                  <p className="text-muted-foreground">Complete crop information</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Variety</Label>
                  <p className="text-sm">{selectedCrop.variety || "Not specified"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Season</Label>
                  <p className="text-sm">{selectedCrop.season || "Not specified"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge variant={getStatusColor(selectedCrop.status)}>{selectedCrop.status || "Not specified"}</Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Planted Date</Label>
                  <p className="text-sm">{selectedCrop.planted_date ? new Date(selectedCrop.planted_date).toLocaleDateString() : "Not specified"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Sowing Date</Label>
                  <p className="text-sm">{selectedCrop.sowing_date ? new Date(selectedCrop.sowing_date).toLocaleDateString() : "Not specified"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Harvesting Date</Label>
                  <p className="text-sm">{selectedCrop.harvesting_date ? new Date(selectedCrop.harvesting_date).toLocaleDateString() : "Not specified"}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">All Features</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    selectedCrop.variety && `Variety: ${selectedCrop.variety}`,
                    selectedCrop.season && `Season: ${selectedCrop.season}`,
                    selectedCrop.status && `Status: ${selectedCrop.status}`,
                    selectedCrop.planted_date && `Planted: ${new Date(selectedCrop.planted_date).toLocaleDateString()}`,
                    selectedCrop.sowing_date && `Sowing: ${new Date(selectedCrop.sowing_date).toLocaleDateString()}`,
                    selectedCrop.harvesting_date && `Harvest: ${new Date(selectedCrop.harvesting_date).toLocaleDateString()}`
                  ].filter(Boolean).map((feature, idx) => (
                    <div key={idx} className="p-2 bg-muted rounded-md text-sm">{feature}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Crops;
