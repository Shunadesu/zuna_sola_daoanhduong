import { useEffect, useState, useCallback } from 'react';
import { statsApi } from '@/lib/api';
import { SkeletonCard, SkeletonChart } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  LayoutDashboard,
  Image,
  FileText,
  Eye,
  TrendingUp,
} from 'lucide-react';

interface DashboardStats {
  banners: number;
  quotes: number;
  totalVisits: number;
  todayVisits: number;
}

interface DailyStat {
  date: string;
  count: number;
  uniqueVisitors: number;
}

interface QuoteStatusStat {
  name: string;
  value: number;
  color: string;
}

const PIE_COLORS = ['#22c55e', '#eab308', '#6b7280'];

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [quoteStats, setQuoteStats] = useState<QuoteStatusStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [statsRes, dailyRes, quoteRes] = await Promise.all([
        statsApi.getDashboard(),
        statsApi.getDaily(),
        statsApi.getQuoteStatus(),
      ]);
      setStats(statsRes.data.data);
      setDailyStats(dailyRes.data.data);
      setQuoteStats(quoteRes.data.data);
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Không thể tải dữ liệu. Vui lòng thử lại.';
      toast({ type: 'error', title: 'Lỗi tải dữ liệu', description: msg });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const statCards = [
    {
      label: 'Tổng Banner',
      value: stats?.banners || 0,
      icon: Image,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      label: 'Yêu cầu báo giá',
      value: stats?.quotes || 0,
      icon: FileText,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      label: 'Lượt truy cập hôm nay',
      value: stats?.todayVisits || 0,
      icon: Eye,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    {
      label: 'Tổng lượt truy cập',
      value: stats?.totalVisits || 0,
      icon: TrendingUp,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonChart />
          <SkeletonChart />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-card rounded-xl border p-5 flex items-center gap-4 hover:shadow-md transition-shadow cursor-default"
            >
              <div className={`p-3 rounded-lg ${card.bg}`}>
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="text-2xl font-bold">{card.value.toLocaleString()}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visit Chart */}
        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center gap-2 mb-4">
            <LayoutDashboard className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Lượt truy cập (7 ngày)</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                    })
                  }
                  className="text-xs"
                />
                <YAxis className="text-xs" />
                <Tooltip
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString('vi-VN', {
                      weekday: 'short',
                      day: '2-digit',
                      month: '2-digit',
                    })
                  }
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quote Status Chart */}
        <div className="bg-card rounded-xl border p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Trạng thái yêu cầu báo giá</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={quoteStats}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                >
                  {quoteStats.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {quoteStats.map((stat, index) => (
              <div key={stat.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                />
                <span className="text-sm">
                  {stat.name}: <strong>{stat.value}</strong>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
