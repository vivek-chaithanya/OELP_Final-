import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const Settings = () => {
  const [profile, setProfile] = useState({
    fullName: "John Farmer",
    email: "john.farmer@agriplatform.com",
    phone: "+1 (555) 123-4567",
    location: "California, USA",
  });

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [regional, setRegional] = useState({
    language: "english",
    timezone: "pst",
    currency: "usd",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    weather: true,
  });

  const handleSaveAll = () => {
    toast.success("All settings saved successfully!");
  };

  const handleUpdateProfile = () => {
    toast.success("Profile updated successfully!");
  };

  const handleChangePassword = () => {
    if (!password.current || !password.new || !password.confirm) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (password.new !== password.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    if (password.new.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    toast.success("Password changed successfully!");
    setPassword({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={handleUpdateProfile}>Update Profile</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={password.current}
              onChange={(e) => setPassword({ ...password, current: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={password.new}
              onChange={(e) => setPassword({ ...password, new: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={password.confirm}
              onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
            />
          </div>
          <Button onClick={handleChangePassword}>Change Password</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Language & Regional Settings</CardTitle>
          <CardDescription>Customize your language and regional preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Language</Label>
              <Select value={regional.language} onValueChange={(value) => setRegional({ ...regional, language: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select value={regional.timezone} onValueChange={(value) => setRegional({ ...regional, timezone: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pst">Pacific Standard Time</SelectItem>
                  <SelectItem value="est">Eastern Standard Time</SelectItem>
                  <SelectItem value="cst">Central Standard Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={regional.currency} onValueChange={(value) => setRegional({ ...regional, currency: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">US Dollar</SelectItem>
                  <SelectItem value="eur">Euro</SelectItem>
                  <SelectItem value="gbp">British Pound</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Choose how you want to receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
            </div>
            <Switch
              checked={notifications.sms}
              onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
            </div>
            <Switch
              checked={notifications.push}
              onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Weather Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified about weather conditions</p>
            </div>
            <Switch
              checked={notifications.weather}
              onCheckedChange={(checked) => setNotifications({ ...notifications, weather: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveAll} size="lg">Save All Settings</Button>
      </div>
    </div>
  );
};

export default Settings;
