import { useState } from 'react';
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

const sidebarItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'داشبورد' },
  { id: 'cases', icon: FolderOpen, label: 'پرونده‌های من' },
  { id: 'documents', icon: FileText, label: 'مدارک' },
  { id: 'messages', icon: MessageSquare, label: 'پیام‌ها' },
  { id: 'appointments', icon: Calendar, label: 'قرارها' },
  { id: 'settings', icon: Settings, label: 'تنظیمات' },
];

// Mock data
const mockCases: Case[] = [
  {
    id: '1',
    title: 'درخواست پناهندگی',
    status: 'in-progress',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-20'),
    description: 'در حال بررسی مدارک',
  },
  {
    id: '2',
    title: 'ویزای کار',
    status: 'pending',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
    description: 'منتظر تکمیل مدارک',
  },
];

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'case_update',
    title: 'پرونده شما به مرحله بعد منتقل شد',
    date: new Date('2024-02-20'),
    status: 'completed',
  },
  {
    id: '2',
    type: 'document_upload',
    title: 'مدرک جدید آپلود شد',
    date: new Date('2024-02-18'),
    status: 'completed',
  },
  {
    id: '3',
    type: 'message',
    title: 'پیام جدید از مشاور',
    date: new Date('2024-02-15'),
    status: 'pending',
  },
];

const stats = [
  { id: 'cases', label: 'پرونده‌های فعال', value: '2', icon: FolderOpen, color: 'bg-primary/10 text-primary' },
  { id: 'documents', label: 'مدارک در انتظار', value: '3', icon: FileText, color: 'bg-warning/10 text-warning' },
  { id: 'messages', label: 'پیام خوانده نشده', value: '5', icon: MessageSquare, color: 'bg-secondary/10 text-secondary' },
  { id: 'appointments', label: 'قرار بعدی', value: '3 روز', icon: Calendar, color: 'bg-success/10 text-success' },
];

export default function Dashboard({ onClose }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
  };

  const getStatusBadge = (status: Case['status']) => {
    const configs = {
      pending: { label: 'در انتظار', className: 'bg-warning/10 text-warning' },
      'in-progress': { label: 'در حال بررسی', className: 'bg-primary/10 text-primary' },
      completed: { label: 'تکمیل شده', className: 'bg-success/10 text-success' },
      rejected: { label: 'رد شده', className: 'bg-error/10 text-error' },
    };
    const config = configs[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getActivityIcon = (type: Activity['type']) => {
    const icons = {
      'case_update': CheckCircle,
      'document_upload': Upload,
      'message': MessageSquare,
      'appointment': Calendar,
    };
    return icons[type];
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-50">
      <div className="flex h-full">
        {/* Sidebar */}
        <aside className="w-72 bg-navy text-white hidden lg:flex flex-col">
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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === item.id
                      ? 'bg-primary text-white'
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
              <span>خروج</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 lg:hidden">
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <span className="font-display font-bold text-lg">Panahyar</span>
              </div>

              <div className="hidden md:flex items-center gap-4 flex-1 max-w-xl">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="جستجو..."
                    className="pr-10"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full" />
                </button>

                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 bg-primary/10">
                    <AvatarFallback className="text-primary font-medium">
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block">
                    <p className="font-medium text-sm">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <ScrollArea className="flex-1 p-6">
            <div className="max-w-6xl mx-auto">
              {/* Welcome */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">
                  خوش آمدید، {user?.name}!
                </h1>
                <p className="text-gray-500">
                  این داشبورد شماست. از اینجا می‌توانید پرونده‌ها و فعالیت‌های خود را مدیریت کنید.
                </p>
              </div>

              {/* Stats */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat) => (
                  <Card key={stat.id} className="card-hover">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                          <stat.icon className="w-6 h-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                  <Plus className="w-6 h-6" />
                  <span>پرونده جدید</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                  <Upload className="w-6 h-6" />
                  <span>آپلود مدرک</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                  <Phone className="w-6 h-6" />
                  <span>تماس با مشاور</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                  <HeadphonesIcon className="w-6 h-6" />
                  <span>پشتیبانی</span>
                </Button>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Cases */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>پرونده‌های اخیر</CardTitle>
                    <Button variant="ghost" size="sm" className="text-primary">
                      مشاهده همه
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockCases.map((caseItem) => (
                        <div
                          key={caseItem.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <div>
                            <h4 className="font-medium mb-1">{caseItem.title}</h4>
                            <p className="text-sm text-gray-500">{caseItem.description}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {getStatusBadge(caseItem.status)}
                            <span className="text-xs text-gray-400">
                              {caseItem.updatedAt.toLocaleDateString('fa-IR')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>فعالیت‌های اخیر</CardTitle>
                    <Button variant="ghost" size="sm" className="text-primary">
                      مشاهده همه
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockActivities.map((activity) => {
                        const Icon = getActivityIcon(activity.type);
                        return (
                          <div
                            key={activity.id}
                            className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl"
                          >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              activity.status === 'completed'
                                ? 'bg-success/10 text-success'
                                : 'bg-primary/10 text-primary'
                            }`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium mb-1">{activity.title}</p>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock className="w-4 h-4" />
                                <span>{activity.date.toLocaleDateString('fa-IR')}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}
