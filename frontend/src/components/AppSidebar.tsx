import { Home, Sprout, Map, CreditCard, ClipboardList, BarChart3, Settings as SettingsIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const defaultItems = [
  { key: "dashboard", title: "Dashboard", url: "/dashboard", icon: Home },
  { key: "crops", title: "Crops", url: "/crops", icon: Sprout },
  { key: "fields", title: "Fields", url: "/fields", icon: Map },
  { key: "subscriptions", title: "Subscriptions", url: "/subscriptions", icon: CreditCard },
  { key: "practices", title: "Practices", url: "/practices", icon: ClipboardList },
  { key: "reports", title: "Reports", url: "/reports", icon: BarChart3 },
  { key: "settings", title: "Settings", url: "/settings", icon: SettingsIcon },
];

export function AppSidebar() {
  const [menuItems, setMenuItems] = useState(defaultItems);
  useEffect(() => {
    const API_URL = (import.meta as any).env.VITE_API_URL || (import.meta as any).env.REACT_APP_API_URL || "/api";
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/menu/`, { headers: { ...(token ? { Authorization: `Token ${token}` } : {}) } })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setMenuItems(
            data
              .map((i: any) => ({
                key: i.key,
                title: i.label,
                url: `/${i.key}`,
                icon: (defaultItems.find((d) => d.key === i.key)?.icon as any) || Home,
              }))
              .filter(Boolean),
          );
        }
      })
      .catch(() => {});
  }, []);
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground">Agricultural Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) => 
                        isActive ? "bg-sidebar-accent" : ""
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
