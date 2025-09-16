import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  ClipboardList, 
  Settings, 
  Users, 
  BarChart3, 
  Armchair,
  CalendarCheck
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';

export function AppSidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const employeeItems = [
    { title: 'Dashboard', url: '/dashboard', icon: Home },
    { title: 'Book a Chair', url: '/book-chair', icon: Calendar },
    { title: 'My Bookings', url: '/my-bookings', icon: ClipboardList },
    { title: 'Settings', url: '/settings', icon: Settings },
  ];

  const adminItems = [
    { title: 'Dashboard', url: '/admin', icon: Home },
    { title: 'Chair Management', url: '/admin/chairs', icon: Armchair },
    { title: 'Booking Management', url: '/admin/bookings', icon: CalendarCheck },
    { title: 'Reports', url: '/admin/reports', icon: BarChart3 },
    { title: 'User Management', url: '/admin/users', icon: Users },
    { title: 'Settings', url: '/admin/settings', icon: Settings },
  ];

  const items = user?.role === 'admin' ? adminItems : employeeItems;

  const isActive = (path: string) => location.pathname === path;
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
      : 'hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground';

  return (
    <Sidebar 
      className={`border-r border-sidebar-border transition-all duration-300 ${
        collapsed ? 'w-14' : 'w-64'
      }`}
      collapsible="icon"
    >
      <SidebarHeader className={`p-4 border-b border-sidebar-border ${collapsed ? 'px-2' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Armchair className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-semibold text-sidebar-primary">Chair Scheduler</h2>
              <p className="text-xs text-sidebar-foreground/60 capitalize">
                {user?.role} Portal
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${getNavCls({ isActive })}`}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
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