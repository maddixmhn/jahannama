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
  UserCog,
  ShieldCheck,
  ClipboardList,
  ShoppingCart,
  Check,
  X,
  Send,
  Clock3,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import type { Case } from '@/types';

interface DashboardProps {
  onClose: () => void;
  onHomeClick: () => void;
}

type UserTab = 'dashboard' | 'orders' | 'cases' | 'documents' | 'messages' | 'appointments' | 'settings';
type AdminTab = 'admin-overview' | 'requests' | 'orders' | 'messages' | 'appointments' | 'settings';
type DashboardTab = UserTab | AdminTab;

type OrderStatus = 'pending' | 'approved' | 'processing' | 'completed' | 'rejected';
type AppointmentStatus = 'requested' | 'booked' | 'done' | 'rejected';

type ServiceOrder = {
  id: string;
  customer: string;
  customerEmail: string;
  service: string;
  notes: string;
  budget: number;
  status: OrderStatus;
  createdAt: string;
};

type SupportMessage = {
  id: string;
  fromName: string;
  fromEmail: string;
  subject: string;
  message: string;
  adminReply?: string;
  createdAt: string;
};

type AppointmentRequest = {
  id: string;
  customer: string;
  customerEmail: string;
  slot: string;
  topic: string;
  status: AppointmentStatus;
};

const userSidebar: Array<{ id: UserTab; icon: ElementType; label: string }> = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'orders', icon: ShoppingCart, label: 'Service Orders' },
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
    id: 'C-1001',
    title: 'Asylum Request',
    status: 'in-progress',
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-02-20'),
    description: 'Documents under legal review',
  },
  {
    id: 'C-1002',
    title: 'Work Permit',
    status: 'pending',
    createdAt: new Date('2026-02-10'),
    updatedAt: new Date('2026-02-10'),
    description: 'Waiting for financial records',
  },
];

const servicesCatalog = [
  'Asylum Filing',
  'Skilled Worker Route',
  'Family Reunification',
  'Student Visa',
  'Document Review',
];

const userStatsBase = [
  { id: 'cases', label: 'Active cases', icon: FolderOpen, color: 'bg-primary/10 text-primary' },
  { id: 'orders', label: 'Open orders', icon: ShoppingCart, color: 'bg-secondary/10 text-secondary' },
  { id: 'messages', label: 'Unread replies', icon: MessageSquare, color: 'bg-warning/10 text-warning' },
  { id: 'appointments', label: 'Upcoming appointments', icon: Calendar, color: 'bg-success/10 text-success' },
];

export default function Dashboard({ onClose, onHomeClick }: DashboardProps) {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [activeTab, setActiveTab] = useState<DashboardTab>(isAdmin ? 'admin-overview' : 'dashboard');

  const [orders, setOrders] = useState<ServiceOrder[]>([
    {
      id: 'O-2001',
      customer: 'Test User',
      customerEmail: 'user.panel@panahyar.test',
      service: 'Asylum Filing',
      notes: 'Need full package with legal review.',
      budget: 950,
      status: 'pending',
      createdAt: '2026-02-20',
    },
  ]);

  const [appointments, setAppointments] = useState<AppointmentRequest[]>([
    {
      id: 'A-3001',
      customer: 'Test User',
      customerEmail: 'user.panel@panahyar.test',
      slot: '2026-03-05 10:00',
      topic: 'Eligibility review',
      status: 'requested',
    },
  ]);

  const [messages, setMessages] = useState<SupportMessage[]>([
    {
      id: 'M-4001',
      fromName: 'Test User',
      fromEmail: 'user.panel@panahyar.test',
      subject: 'Document checklist',
      message: 'Please confirm if translated bank statements are required.',
      createdAt: '2026-02-22',
    },
  ]);

  const [orderForm, setOrderForm] = useState({ service: servicesCatalog[0], budget: '800', notes: '' });
  const [appointmentForm, setAppointmentForm] = useState({ slot: '', topic: '' });
  const [messageForm, setMessageForm] = useState({ subject: '', message: '' });

  const currentEmail = user?.email ?? '';
  const userOrders = orders.filter((o) => o.customerEmail === currentEmail);
  const userAppointments = appointments.filter((a) => a.customerEmail === currentEmail);
  const userMessages = messages.filter((m) => m.fromEmail === currentEmail);

  const userStats = [
    { ...userStatsBase[0], value: String(mockCases.length) },
    { ...userStatsBase[1], value: String(userOrders.filter((o) => o.status !== 'completed' && o.status !== 'rejected').length) },
    { ...userStatsBase[2], value: String(userMessages.filter((m) => Boolean(m.adminReply)).length) },
    { ...userStatsBase[3], value: String(userAppointments.filter((a) => a.status === 'booked').length) },
  ];

  const handleLogout = () => {
    logout();
    onClose();
  };

  const sidebar = isAdmin ? adminSidebar : userSidebar;
  const tabTitle = useMemo(
    () => sidebar.find((item) => item.id === activeTab)?.label ?? 'Dashboard',
    [activeTab, sidebar]
  );

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const replyToMessage = (id: string, reply: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, adminReply: reply } : m)));
  };

  const submitOrder = () => {
    if (!user) return;
    setOrders((prev) => [
      {
        id: `O-${Date.now()}`,
        customer: user.name,
        customerEmail: user.email,
        service: orderForm.service,
        notes: orderForm.notes.trim(),
        budget: Number(orderForm.budget) || 0,
        status: 'pending',
        createdAt: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    setOrderForm({ service: servicesCatalog[0], budget: '800', notes: '' });
  };

  const submitAppointment = () => {
    if (!user || !appointmentForm.slot || !appointmentForm.topic.trim()) return;
    setAppointments((prev) => [
      {
        id: `A-${Date.now()}`,
        customer: user.name,
        customerEmail: user.email,
        slot: appointmentForm.slot,
        topic: appointmentForm.topic.trim(),
        status: 'requested',
      },
      ...prev,
    ]);
    setAppointmentForm({ slot: '', topic: '' });
  };

  const submitMessage = () => {
    if (!user || !messageForm.subject.trim() || !messageForm.message.trim()) return;
    setMessages((prev) => [
      {
        id: `M-${Date.now()}`,
        fromName: user.name,
        fromEmail: user.email,
        subject: messageForm.subject.trim(),
        message: messageForm.message.trim(),
        createdAt: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    setMessageForm({ subject: '', message: '' });
  };

  const renderUserDashboard = () => (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your migration journey: service orders, appointments, and secure messaging with admin.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {userStats.map((stat) => (
          <Card key={stat.id} className="card-hover dark:bg-slate-900 dark:border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold dark:text-white number-ltr">{stat.value}</p>
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

  const renderUserOrders = () => (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="dark:bg-slate-900 dark:border-slate-800">
        <CardHeader>
          <CardTitle>Create Service Order</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <select
            value={orderForm.service}
            onChange={(e) => setOrderForm((prev) => ({ ...prev, service: e.target.value }))}
            className="w-full h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm"
          >
            {servicesCatalog.map((service) => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
          <Input
            value={orderForm.budget}
            onChange={(e) => setOrderForm((prev) => ({ ...prev, budget: e.target.value }))}
            placeholder="Budget (USD)"
            className="number-ltr"
          />
          <Textarea
            value={orderForm.notes}
            onChange={(e) => setOrderForm((prev) => ({ ...prev, notes: e.target.value }))}
            placeholder="Order details"
          />
          <Button className="btn-primary" onClick={submitOrder}>Submit Order</Button>
        </CardContent>
      </Card>

      <Card className="dark:bg-slate-900 dark:border-slate-800">
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {userOrders.map((order) => (
            <div key={order.id} className="rounded-xl border border-gray-200 dark:border-slate-700 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">{order.service}</p>
                <Badge>{order.status}</Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 number-ltr">{order.id} | {order.createdAt}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{order.notes || 'No extra notes'}</p>
              <p className="text-sm mt-2">Budget: <span className="number-ltr">${order.budget}</span></p>
            </div>
          ))}
          {userOrders.length === 0 && <p className="text-sm text-gray-500">No order submitted yet.</p>}
        </CardContent>
      </Card>
    </div>
  );

  const renderUserAppointments = () => (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="dark:bg-slate-900 dark:border-slate-800">
        <CardHeader>
          <CardTitle>Request Appointment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            type="datetime-local"
            value={appointmentForm.slot}
            onChange={(e) => setAppointmentForm((prev) => ({ ...prev, slot: e.target.value }))}
            className="number-ltr"
          />
          <Input
            value={appointmentForm.topic}
            onChange={(e) => setAppointmentForm((prev) => ({ ...prev, topic: e.target.value }))}
            placeholder="Topic"
          />
          <Button className="btn-primary" onClick={submitAppointment}>Send Request</Button>
        </CardContent>
      </Card>

      <Card className="dark:bg-slate-900 dark:border-slate-800">
        <CardHeader>
          <CardTitle>My Appointments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {userAppointments.map((app) => (
            <div key={app.id} className="rounded-xl border border-gray-200 dark:border-slate-700 p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{app.topic}</p>
                <Badge>{app.status}</Badge>
              </div>
              <p className="text-sm text-gray-500 mt-2 flex items-center gap-2 number-ltr">
                <Clock3 className="w-4 h-4" /> {app.slot}
              </p>
            </div>
          ))}
          {userAppointments.length === 0 && <p className="text-sm text-gray-500">No appointment requested yet.</p>}
        </CardContent>
      </Card>
    </div>
  );

  const renderUserMessages = () => (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="dark:bg-slate-900 dark:border-slate-800">
        <CardHeader>
          <CardTitle>Message Admin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            value={messageForm.subject}
            onChange={(e) => setMessageForm((prev) => ({ ...prev, subject: e.target.value }))}
            placeholder="Subject"
          />
          <Textarea
            value={messageForm.message}
            onChange={(e) => setMessageForm((prev) => ({ ...prev, message: e.target.value }))}
            placeholder="Your message"
          />
          <Button className="btn-primary" onClick={submitMessage}>
            <Send className="w-4 h-4 mr-2" /> Send
          </Button>
        </CardContent>
      </Card>

      <Card className="dark:bg-slate-900 dark:border-slate-800">
        <CardHeader>
          <CardTitle>Conversation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {userMessages.map((msg) => (
            <div key={msg.id} className="rounded-xl border border-gray-200 dark:border-slate-700 p-4">
              <p className="font-semibold">{msg.subject}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{msg.message}</p>
              <p className="text-xs text-gray-500 mt-2 number-ltr">{msg.createdAt}</p>
              {msg.adminReply ? (
                <div className="mt-3 rounded-lg bg-primary/10 p-3 text-sm">
                  <p className="font-medium text-primary">Admin Reply</p>
                  <p>{msg.adminReply}</p>
                </div>
              ) : (
                <p className="mt-3 text-xs text-gray-500">Waiting for admin reply</p>
              )}
            </div>
          ))}
          {userMessages.length === 0 && <p className="text-sm text-gray-500">No message sent yet.</p>}
        </CardContent>
      </Card>
    </div>
  );

  const renderAdminOverview = () => (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Admin Control Center</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Full relationship map between users and operations: orders, appointments, and support messages.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="dark:bg-slate-900 dark:border-slate-800"><CardContent className="p-5"><p className="text-sm text-gray-500">Pending requests</p><p className="text-3xl font-bold text-primary number-ltr">{orders.filter((o) => o.status === 'pending').length}</p></CardContent></Card>
        <Card className="dark:bg-slate-900 dark:border-slate-800"><CardContent className="p-5"><p className="text-sm text-gray-500">Open orders</p><p className="text-3xl font-bold text-secondary number-ltr">{orders.filter((o) => o.status !== 'completed' && o.status !== 'rejected').length}</p></CardContent></Card>
        <Card className="dark:bg-slate-900 dark:border-slate-800"><CardContent className="p-5"><p className="text-sm text-gray-500">Unreplied messages</p><p className="text-3xl font-bold text-warning number-ltr">{messages.filter((m) => !m.adminReply).length}</p></CardContent></Card>
        <Card className="dark:bg-slate-900 dark:border-slate-800"><CardContent className="p-5"><p className="text-sm text-gray-500">Requested appointments</p><p className="text-3xl font-bold text-success number-ltr">{appointments.filter((a) => a.status === 'requested').length}</p></CardContent></Card>
      </div>
    </>
  );

  const renderAdminRequests = () => (
    <Card className="dark:bg-slate-900 dark:border-slate-800">
      <CardHeader><CardTitle>Customer Requests Queue</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {orders.filter((o) => o.status === 'pending').map((item) => (
          <div key={item.id} className="rounded-xl border border-gray-200 dark:border-slate-700 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="font-semibold">{item.customer} - {item.service}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 number-ltr">{item.customerEmail} | {item.id}</p>
              <p className="text-sm mt-2">{item.notes || 'No notes'}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="btn-primary" onClick={() => updateOrderStatus(item.id, 'approved')}>
                <Check className="w-4 h-4 mr-1" /> Approve
              </Button>
              <Button size="sm" variant="outline" onClick={() => updateOrderStatus(item.id, 'rejected')} className="dark:border-slate-700">
                <X className="w-4 h-4 mr-1" /> Reject
              </Button>
            </div>
          </div>
        ))}
        {orders.filter((o) => o.status === 'pending').length === 0 && <p className="text-sm text-gray-500">No pending request.</p>}
      </CardContent>
    </Card>
  );

  const renderAdminOrders = () => (
    <Card className="dark:bg-slate-900 dark:border-slate-800">
      <CardHeader><CardTitle>Order Management</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="rounded-xl border border-gray-200 dark:border-slate-700 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="font-semibold">{order.customer} - {order.service}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 number-ltr">{order.customerEmail} | {order.id}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Budget: <span className="number-ltr">${order.budget}</span></p>
              <Badge className="mt-2">{order.status}</Badge>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => updateOrderStatus(order.id, 'processing')} className="dark:border-slate-700">Processing</Button>
              <Button size="sm" className="btn-primary" onClick={() => updateOrderStatus(order.id, 'completed')}>Completed</Button>
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
        {messages.map((msg) => (
          <div key={msg.id} className="rounded-xl border border-gray-200 dark:border-slate-700 p-4">
            <p className="font-semibold">{msg.fromName} - {msg.subject}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 number-ltr">{msg.fromEmail} | {msg.createdAt}</p>
            <p className="text-sm mt-2">{msg.message}</p>
            {msg.adminReply ? (
              <div className="mt-3 rounded-lg bg-success/10 p-3 text-sm">
                <p className="font-medium text-success">Reply sent</p>
                <p>{msg.adminReply}</p>
              </div>
            ) : (
              <Button size="sm" className="btn-primary mt-3" onClick={() => replyToMessage(msg.id, 'We reviewed your request. The advisor will contact you within 24 hours.')}>Quick Reply</Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const renderAdminAppointments = () => (
    <Card className="dark:bg-slate-900 dark:border-slate-800">
      <CardHeader><CardTitle>Appointment Booking</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {appointments.map((app) => (
          <div key={app.id} className="rounded-xl border border-gray-200 dark:border-slate-700 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="font-semibold">{app.customer} - {app.topic}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 number-ltr">{app.customerEmail}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 number-ltr">{app.slot}</p>
              <Badge className="mt-2">{app.status}</Badge>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="btn-primary" onClick={() => updateAppointmentStatus(app.id, 'booked')} disabled={app.status !== 'requested'}>Book</Button>
              <Button size="sm" variant="outline" onClick={() => updateAppointmentStatus(app.id, 'done')} className="dark:border-slate-700" disabled={app.status !== 'booked'}>Done</Button>
              <Button size="sm" variant="outline" onClick={() => updateAppointmentStatus(app.id, 'rejected')} className="dark:border-slate-700" disabled={app.status === 'done'}>Reject</Button>
            </div>
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
      case 'orders':
        return renderUserOrders();
      case 'cases':
        return renderSimpleList('My Cases', mockCases.map((c) => `${c.title} - ${c.description}`));
      case 'documents':
        return renderSimpleList('Documents', ['Passport scan', 'Identity card', 'Application form', 'Address proof']);
      case 'messages':
        return renderUserMessages();
      case 'appointments':
        return renderUserAppointments();
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
        return renderAdminRequests();
      case 'orders':
        return renderAdminOrders();
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
            <button type="button" onClick={onHomeClick} className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="font-bold text-lg">P</span>
              </div>
              <span className="font-display font-bold text-xl">{isAdmin ? 'Admin Panel' : 'Panahyar'}</span>
            </button>

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
                <button type="button" onClick={onHomeClick} className="font-display font-bold text-lg dark:text-white">
                  {isAdmin ? 'Admin Panel' : 'Panahyar'}
                </button>
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
