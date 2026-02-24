import { useMemo, useState, type ElementType } from 'react';
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  MessageSquare,
  Calendar,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronLeft,
  Clock,
  CheckCircle,
  Plus,
  Upload,
  Phone,
  HeadphonesIcon,
  UserCog,
  ShieldCheck,
  ClipboardList,
  ShoppingCart,
  Check,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { Case, Activity } from '@/types';

interface DashboardProps {
  onClose: () => void;
}

type UserTab = 'dashboard' | 'cases' | 'documents' | 'messages' | 'appointments' | 'settings';
type AdminTab = 'admin-overview' | 'requests' | 'orders' | 'messages' | 'appointments' | 'settings';
type DashboardTab = UserTab | AdminTab;

type AdminRequest = {
  id: string;
  customer: string;
  service: string;
  status: 'pending' | 'approved' | 'rejected';
};
type AdminOrder = {
  id: string;
  customer: string;
  packageName: string;
  amount: number;
  status: 'new' | 'processing' | 'completed';
};
type AdminMessage = {
  id: string;
  from: string;
  text: string;
  replied: boolean;
};
type AdminAppointment = {
  id: string;
  customer: string;
  slot: string;
  status: 'requested' | 'booked' | 'done';
};

const userSidebar: Array<{ id: UserTab; icon: ElementType; label: string }> = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'cases', icon: FolderOpen, label: 'My Cases' },
  { id: 'documents', icon: FileText, label: 'Documents' },
  { id: 'messages', icon: MessageSquare, label: 'Messages' },
  { id: 'appointments', icon: Calendar, label: 'Appointments' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

const adminSidebar: Array<{ id: AdminTab; icon: ElementType; label: string }> = [
  { id: 'admin-overview', icon: LayoutDashboard, label: 'Admin Overview' },
  { id: 'requests', icon: ClipboardList, label: 'Customer Requests' },
  { id: 'orders', icon: ShoppingCart, label: 'Orders' },
  { id: 'messages', icon: MessageSquare, label: 'Messages' },
  { id: 'appointments', icon: Calendar, label: 'Appointments' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

const mockCases: Case[] = [
  {
    id: '1',
    title: 'Asylum request',
    status: 'in-progress',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-20'),
    description: 'Documents under review',
  },
  {
    id: '2',
    title: 'Work visa',
    status: 'pending',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
    description: 'Waiting for final files',
  },
];

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'case_update',
    title: 'Your case moved to the next step',
    date: new Date('2024-02-20'),
    status: 'completed',
  },
  {
    id: '2',
    type: 'document_upload',
    title: 'A new file was uploaded',
    date: new Date('2024-02-18'),
    status: 'completed',
  },
  {
    id: '3',
    type: 'message',
    title: 'New advisor message',
    date: new Date('2024-02-15'),
    status: 'pending',
  },
];

const userStats = [
  { id: 'cases', label: 'Active cases', value: '2', icon: FolderOpen, color: 'bg-primary/10 text-primary' },
  { id: 'documents', label: 'Pending docs', value: '3', icon: FileText, color: 'bg-warning/10 text-warning' },
  { id: 'messages', label: 'Unread messages', value: '5', icon: MessageSquare, color: 'bg-secondary/10 text-secondary' },
  { id: 'appointments', label: 'Next appointment', value: '3 days', icon: Calendar, color: 'bg-success/10 text-success' },
];

export default function Dashboard({ onClose }: DashboardProps) {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [activeTab, setActiveTab] = useState<DashboardTab>(isAdmin ? 'admin-overview' : 'dashboard');

  const [adminRequests, setAdminRequests] = useState<AdminRequest[]>([
    { id: 'R-1001', customer: 'Sarah M', service: 'Asylum Filing', status: 'pending' },
    { id: 'R-1002', customer: 'John D', service: 'Family Reunification', status: 'pending' },
    { id: 'R-1003', customer: 'Ahmad K', service: 'Travel Document', status: 'approved' },
  ]);
  const [adminOrders, setAdminOrders] = useState<AdminOrder[]>([
    { id: 'O-501', customer: 'Maria L', packageName: 'Premium Legal', amount: 890, status: 'new' },
    { id: 'O-502', customer: 'David P', packageName: 'Document Pack', amount: 240, status: 'processing' },
    { id: 'O-503', customer: 'Leila N', packageName: 'Settlement Plus', amount: 460, status: 'completed' },
  ]);
  const [adminMessages, setAdminMessages] = useState<AdminMessage[]>([
    { id: 'M-1', from: 'Sarah M', text: 'Can I update my appointment date?', replied: false },
    { id: 'M-2', from: 'Ahmad K', text: 'I uploaded my passport. Please review.', replied: false },
    { id: 'M-3', from: 'John D', text: 'Need help with sponsorship docs.', replied: true },
  ]);
  const [adminAppointments, setAdminAppointments] = useState<AdminAppointment[]>([
    { id: 'A-1', customer: 'Sarah M', slot: '2026-03-02 10:00', status: 'requested' },
    { id: 'A-2', customer: 'John D', slot: '2026-03-02 14:30', status: 'booked' },
    { id: 'A-3', customer: 'Ahmad K', slot: '2026-03-03 09:15', status: 'requested' },
  ]);

  const handleLogout = () => {
    logout();
    onClose();
  };

  const sidebar = isAdmin ? adminSidebar : userSidebar;
  const tabTitle = useMemo(
    () => sidebar.find((item) => item.id === activeTab)?.label ?? 'Dashboard',
    [activeTab, sidebar]
  );

  const getStatusBadge = (status: Case['status']) => {
    const configs = {
      pending: { label: 'Pending', className: 'bg-warning/10 text-warning' },
      'in-progress': { label: 'In progress', className: 'bg-primary/10 text-primary' },
      completed: { label: 'Completed', className: 'bg-success/10 text-success' },
      rejected: { label: 'Rejected', className: 'bg-error/10 text-error' },
    };
    return <Badge className={configs[status].className}>{configs[status].label}</Badge>;
  };

  const getActivityIcon = (type: Activity['type']) => {
    const icons = { case_update: CheckCircle, document_upload: Upload, message: MessageSquare, appointment: Calendar };
    return icons[type];
  };

  const updateRequestStatus = (id: string, status: AdminRequest['status']) => {
    setAdminRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };
  const updateOrderStatus = (id: string, status: AdminOrder['status']) => {
    setAdminOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };
  const replyToMessage = (id: string) => {
    setAdminMessages((prev) => prev.map((m) => (m.id === id ? { ...m, replied: true } : m)));
  };
  const bookAppointment = (id: string) => {
    setAdminAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'booked' } : a)));
  };

  const renderUserDashboard = () => (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Use the sidebar to switch sections. Each section is clickable and loads its own content.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {userStats.map((stat) => (
          <Card key={stat.id} className="card-hover dark:bg-slate-900 dark:border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );

  const renderAdminOverview = () => (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Admin Control Center</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage requests, orders, customer messages, and appointment booking from one place.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="dark:bg-slate-900 dark:border-slate-800"><CardContent className="p-5"><p className="text-sm text-gray-500">Pending requests</p><p className="text-3xl font-bold text-primary">{adminRequests.filter((r) => r.status === 'pending').length}</p></CardContent></Card>
        <Card className="dark:bg-slate-900 dark:border-slate-800"><CardContent className="p-5"><p className="text-sm text-gray-500">Open orders</p><p className="text-3xl font-bold text-secondary">{adminOrders.filter((o) => o.status !== 'completed').length}</p></CardContent></Card>
        <Card className="dark:bg-slate-900 dark:border-slate-800"><CardContent className="p-5"><p className="text-sm text-gray-500">Unreplied messages</p><p className="text-3xl font-bold text-warning">{adminMessages.filter((m) => !m.replied).length}</p></CardContent></Card>
        <Card className="dark:bg-slate-900 dark:border-slate-800"><CardContent className="p-5"><p className="text-sm text-gray-500">Requested appointments</p><p className="text-3xl font-bold text-success">{adminAppointments.filter((a) => a.status === 'requested').length}</p></CardContent></Card>
      </div>
    </>
  );

  const renderRequests = () => (
    <Card className="dark:bg-slate-900 dark:border-slate-800">
      <CardHeader><CardTitle>Customer Requests</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {adminRequests.map((item) => (
          <div key={item.id} className="rounded-xl border border-gray-200 dark:border-slate-700 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="font-semibold">{item.customer}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.service}</p>
              <Badge className="mt-2">{item.status}</Badge>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="btn-primary" onClick={() => updateRequestStatus(item.id, 'approved')}>
                <Check className="w-4 h-4 mr-1" /> Approve
              </Button>
              <Button size="sm" variant="outline" onClick={() => updateRequestStatus(item.id, 'rejected')} className="dark:border-slate-700">
                <X className="w-4 h-4 mr-1" /> Reject
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const renderOrders = () => (
    <Card className="dark:bg-slate-900 dark:border-slate-800">
      <CardHeader><CardTitle>Order Management</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {adminOrders.map((order) => (
          <div key={order.id} className="rounded-xl border border-gray-200 dark:border-slate-700 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="font-semibold">{order.customer}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{order.packageName} - ${order.amount}</p>
              <Badge className="mt-2">{order.status}</Badge>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => updateOrderStatus(order.id, 'processing')} className="dark:border-slate-700">Set Processing</Button>
              <Button size="sm" className="btn-primary" onClick={() => updateOrderStatus(order.id, 'completed')}>Set Completed</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const renderAdminMessages = () => (
    <Card className="dark:bg-slate-900 dark:border-slate-800">
      <CardHeader><CardTitle>Message Center</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {adminMessages.map((msg) => (
          <div key={msg.id} className="rounded-xl border border-gray-200 dark:border-slate-700 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="font-semibold">{msg.from}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{msg.text}</p>
              <Badge className="mt-2">{msg.replied ? 'Replied' : 'Pending reply'}</Badge>
            </div>
            <Button size="sm" className="btn-primary" onClick={() => replyToMessage(msg.id)} disabled={msg.replied}>
              {msg.replied ? 'Replied' : 'Reply'}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const renderAdminAppointments = () => (
    <Card className="dark:bg-slate-900 dark:border-slate-800">
      <CardHeader><CardTitle>Appointment Booking</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {adminAppointments.map((app) => (
          <div key={app.id} className="rounded-xl border border-gray-200 dark:border-slate-700 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="font-semibold">{app.customer}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{app.slot}</p>
              <Badge className="mt-2">{app.status}</Badge>
            </div>
            <Button size="sm" className="btn-primary" onClick={() => bookAppointment(app.id)} disabled={app.status !== 'requested'}>
              {app.status === 'requested' ? 'Book Time' : 'Booked'}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const renderSimpleList = (title: string, items: string[]) => (
    <Card className="dark:bg-slate-900 dark:border-slate-800">
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item} className="rounded-xl border border-gray-200 dark:border-slate-700 px-4 py-3 text-sm dark:text-gray-100">
              {item}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderUserContent = () => {
    switch (activeTab as UserTab) {
      case 'dashboard':
        return renderUserDashboard();
      case 'cases':
        return renderSimpleList('My Cases', mockCases.map((c) => `${c.title} - ${c.description}`));
      case 'documents':
        return renderSimpleList('Documents', ['Passport scan', 'Identity card', 'Application form', 'Address proof']);
      case 'messages':
        return renderSimpleList('Messages', mockActivities.filter((a) => a.type === 'message').map((m) => m.title));
      case 'appointments':
        return renderSimpleList('Appointments', ['Consultation call - Monday 10:00', 'Document review - Wednesday 15:00']);
      case 'settings':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="dark:bg-slate-900 dark:border-slate-800">
              <CardHeader><CardTitle className="flex items-center gap-2"><UserCog className="w-5 h-5" /> Profile</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Input defaultValue={user?.name} />
                <Input defaultValue={user?.email} />
                <Button className="btn-primary">Save profile</Button>
              </CardContent>
            </Card>
            <Card className="dark:bg-slate-900 dark:border-slate-800">
              <CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> Security</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full dark:border-slate-700 dark:hover:bg-slate-800">Change password</Button>
                <Button variant="outline" className="w-full dark:border-slate-700 dark:hover:bg-slate-800">Enable 2FA</Button>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return renderUserDashboard();
    }
  };

  const renderAdminContent = () => {
    switch (activeTab as AdminTab) {
      case 'admin-overview':
        return renderAdminOverview();
      case 'requests':
        return renderRequests();
      case 'orders':
        return renderOrders();
      case 'messages':
        return renderAdminMessages();
      case 'appointments':
        return renderAdminAppointments();
      case 'settings':
        return (
          <Card className="dark:bg-slate-900 dark:border-slate-800">
            <CardHeader><CardTitle>Admin Settings</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="dark:border-slate-700">Manage Team Access</Button>
              <Button variant="outline" className="dark:border-slate-700">Notification Rules</Button>
            </CardContent>
          </Card>
        );
      default:
        return renderAdminOverview();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 dark:bg-slate-950">
      <div className="flex h-full">
        <aside className="w-72 bg-navy dark:bg-slate-900 text-white hidden lg:flex flex-col border-r border-white/10">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="font-bold text-lg">P</span>
              </div>
              <span className="font-display font-bold text-xl">{isAdmin ? 'Admin Panel' : 'Panahyar'}</span>
            </div>

            <nav className="space-y-1">
              {sidebar.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                    activeTab === item.id ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-6">
            <Separator className="bg-white/10 mb-4" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-error/10 hover:text-error transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 lg:hidden">
                <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">
                  <ChevronLeft className="w-6 h-6 dark:text-gray-100" />
                </button>
                <span className="font-display font-bold text-lg dark:text-white">{isAdmin ? 'Admin Panel' : 'Panahyar'}</span>
              </div>

              <div className="hidden md:flex items-center gap-4 flex-1 max-w-xl">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input placeholder={`Search in ${tabTitle}...`} className="pr-10 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100" />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-200" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full" />
                </button>

                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 bg-primary/10">
                    <AvatarFallback className="text-primary font-medium">{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block">
                    <p className="font-medium text-sm dark:text-white">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <ScrollArea className="flex-1 p-6">
            <div className="max-w-6xl mx-auto">
              {isAdmin ? renderAdminContent() : renderUserContent()}
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}
