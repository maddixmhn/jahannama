import { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Users, Globe, Briefcase } from 'lucide-react';
import type { Locale } from '@/App';

interface MigrationStatsChartProps {
  locale: Locale;
}

const content = {
  fa: {
    title: 'آمار جهانی مهاجرت و پناهندگی',
    tabs: {
      trend: 'روند تاریخی',
      regional: 'توزیع منطقه‌ای',
      categories: 'دسته‌بندی ویزا',
    },
    chartLabels: {
      asylum: 'درخواست‌های پناهندگی',
      refugee: 'پناهندگان ثبت‌شده',
      resettlement: 'اسکان مجدد',
      year: 'سال',
      count: 'تعداد (هزار)',
    },
    regions: {
      africa: 'آفریقا',
      asia: 'آسیا',
      europe: 'اروپا',
      americas: 'قاره آمریکا',
      middleEast: 'خاورمیانه',
    },
    visaTypes: {
      asylum: 'پناهندگی',
      student: 'دانشجویی',
      work: 'کاری',
      family: 'خانوادگی',
      humanitarian: 'بشردوستانه',
    },
  },
  en: {
    title: 'Global Migration & Asylum Statistics',
    tabs: {
      trend: 'Historical Trend',
      regional: 'Regional Distribution',
      categories: 'Visa Categories',
    },
    chartLabels: {
      asylum: 'Asylum Applications',
      refugee: 'Registered Refugees',
      resettlement: 'Resettlement',
      year: 'Year',
      count: 'Count (thousands)',
    },
    regions: {
      africa: 'Africa',
      asia: 'Asia',
      europe: 'Europe',
      americas: 'Americas',
      middleEast: 'Middle East',
    },
    visaTypes: {
      asylum: 'Asylum',
      student: 'Student',
      work: 'Work',
      family: 'Family',
      humanitarian: 'Humanitarian',
    },
  },
};

// Historical migration data (2018-2025)
const trendData = [
  { year: '2018', asylum: 1480, refugee: 19900, resettlement: 92 },
  { year: '2019', asylum: 1750, refugee: 24100, resettlement: 105 },
  { year: '2020', asylum: 1230, refugee: 26400, resettlement: 34 },
  { year: '2021', asylum: 1510, refugee: 27100, resettlement: 38 },
  { year: '2022', asylum: 2870, refugee: 32500, resettlement: 63 },
  { year: '2023', asylum: 3450, refugee: 36400, resettlement: 78 },
  { year: '2024', asylum: 3890, refugee: 38200, resettlement: 95 },
  { year: '2025', asylum: 4120, refugee: 40100, resettlement: 110 },
];

// Regional distribution data
const regionalData = [
  { name: 'africa', value: 28, color: '#0D7377' },
  { name: 'asia', value: 26, color: '#F4A261' },
  { name: 'europe', value: 12, color: '#2ECC71' },
  { name: 'americas', value: 20, color: '#3498DB' },
  { name: 'middleEast', value: 14, color: '#E74C3C' },
];

// Visa category distribution
const categoryData = [
  { name: 'asylum', value: 35, color: '#0D7377' },
  { name: 'student', value: 22, color: '#F4A261' },
  { name: 'work', value: 25, color: '#2ECC71' },
  { name: 'family', value: 10, color: '#3498DB' },
  { name: 'humanitarian', value: 8, color: '#E74C3C' },
];

const statsCards = [
  { icon: TrendingUp, label: 'Total Displaced', value: '117M', change: '+12%', color: 'text-primary' },
  { icon: Users, label: 'Refugees', value: '40.1M', change: '+8%', color: 'text-secondary' },
  { icon: Globe, label: 'Asylum Seekers', value: '5.8M', change: '+15%', color: 'text-success' },
  { icon: Briefcase, label: 'Resettled', value: '110K', change: '+16%', color: 'text-warning' },
];

export default function MigrationStatsChart({ locale }: MigrationStatsChartProps) {
  const [activeTab, setActiveTab] = useState<'trend' | 'regional' | 'categories'>('trend');
  const t = content[locale];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700">
          <p className="font-semibold text-sm text-slate-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}K
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="dark:bg-slate-900 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
          <TrendingUp className="w-5 h-5 text-primary" />
          {t.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((stat, index) => (
            <div key={index} className="rounded-xl bg-white/80 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white number-ltr">{stat.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="trend">{t.tabs.trend}</TabsTrigger>
            <TabsTrigger value="regional">{t.tabs.regional}</TabsTrigger>
            <TabsTrigger value="categories">{t.tabs.categories}</TabsTrigger>
          </TabsList>

          <TabsContent value="trend" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAsylum" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D7377" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0D7377" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorRefugee" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F4A261" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#F4A261" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="year" 
                  stroke="#64748b" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="asylum"
                  name={t.chartLabels.asylum}
                  stroke="#0D7377"
                  fillOpacity={1}
                  fill="url(#colorAsylum)"
                />
                <Area
                  type="monotone"
                  dataKey="refugee"
                  name={t.chartLabels.refugee}
                  stroke="#F4A261"
                  fillOpacity={1}
                  fill="url(#colorRefugee)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="regional" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={regionalData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${t.regions[name as keyof typeof t.regions]}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {regionalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="categories" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" fontSize={12} unit="%" />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={(name) => t.visaTypes[name as keyof typeof t.visaTypes]}
                />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}