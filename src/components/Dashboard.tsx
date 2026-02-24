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

type DashboardTab = 'dashboard' | 'cases' | 'documents' | 'messages' | 'appointments' | 'settings';

const sidebarItems: Array<{ id: DashboardTab; icon: ElementType; label: string }> = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'cases', icon: FolderOpen, label: 'My Cases' },
  { id: 'documents', icon: FileText, label: 'Documents' },
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

const stats = [
  { id: 'cases', label: 'Active cases', value: '2', icon: FolderOpen, color: 'bg-primary/10 text-primary' },
  { id: 'documents', label: 'Pending docs', value: '3', icon: FileText, color: 'bg-warning/10 text-warning' },
  { id: 'messages', label: 'Unread messages', value: '5', icon: MessageSquare, color: 'bg-secondary/10 text-secondary' },
  { id: 'appointments', label: 'Next appointment', value: '3 days', icon: Calendar, color: 'bg-success/10 text-success' },
];

export default function Dashboard({ onClose }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard');
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
  };

  const getStatusBadge = (status: Case['status']) => {
    const configs = {
      pending: { label: 'Pending', className: 'bg-warning/10 text-warning' },
      'in-progress': { label: 'In progress', className: 'bg-primary/10 text-primary' },
      completed: { label: 'Completed', className: 'bg-success/10 text-success' },
      rejected: { label: 'Rejected', className: 'bg-error/10 text-error' },
    };
    const config = configs[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getActivityIcon = (type: Activity['type']) => {
    const icons = {
      case_update: CheckCircle,
      document_upload: Upload,
      message: MessageSquare,
      appointment: Calendar,
    };
    return icons[type];
  };

  const tabTitle = useMemo(
    () => sidebarItems.find((item) => item.id === activeTab)?.label ?? 'Dashboard',
    [activeTab]
  );

  const renderDashboardHome = () => (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Use the sidebar to switch sections. Each section is now fully clickable and loads its own content.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
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

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2 dark:border-slate-700 dark:hover:bg-slate-800">
          <Plus className="w-6 h-6" />
          <span>New case</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2 dark:border-slate-700 dark:hover:bg-slate-800">
          <Upload className="w-6 h-6" />
          <span>Upload document</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2 dark:border-slate-700 dark:hover:bg-slate-800">
          <Phone className="w-6 h-6" />
          <span>Call advisor</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2 dark:border-slate-700 dark:hover:bg-slate-800">
          <HeadphonesIcon className="w-6 h-6" />
          <span>Support</span>
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent cases</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary">View all</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCases.map((caseItem) => (
                <div
                  key={caseItem.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  onClick={() => setActiveTab('cases')}
                >
                  <div>
                    <h4 className="font-medium mb-1 dark:text-white">{caseItem.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-300">{caseItem.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(caseItem.status)}
                    <span className="text-xs text-gray-400">{caseItem.updatedAt.toLocaleDateString('en-US')}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent activity</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary">View all</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockActivities.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-xl">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activity.status === 'completed' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-1 dark:text-white">{activity.title}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300">
                        <Clock className="w-4 h-4" />
                        <span>{activity.date.toLocaleDateString('en-US')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboardHome();
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
        return renderDashboardHome();
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
              <span className="font-display font-bold text-xl">Panahyar</span>
            </div>

            <nav className="space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                    activeTab === item.id
                      ? 'bg-primary text-white shadow-lg'
                      : 'text-gray-400 hover:bg-white/10 hover:text-white'
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
                <span className="font-display font-bold text-lg dark:text-white">Panahyar</span>
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
                    <AvatarFallback className="text-primary font-medium">
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
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
            <div className="max-w-6xl mx-auto">{renderContent()}</div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}
