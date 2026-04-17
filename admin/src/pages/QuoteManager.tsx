import { useState, useEffect, useMemo } from 'react';
import { quoteApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SkeletonQuoteList } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { Badge } from '@/components/ui/Badge';
import { formatDateTime } from '@/lib/utils';
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Eye,
  Check,
  Search,
} from 'lucide-react';

type QuoteStatus = 'new' | 'contacted' | 'closed';

interface Quote {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
  apartment: string;
  message: string;
  status: QuoteStatus;
  createdAt: string;
}

const statusConfig: Record<QuoteStatus, { label: string; variant: 'success' | 'warning' | 'secondary' }> = {
  new: { label: 'Mới', variant: 'success' },
  contacted: { label: 'Đã liên hệ', variant: 'warning' },
  closed: { label: 'Đã đóng', variant: 'secondary' },
};

const PAGE_SIZE = 10;

export default function QuoteManager() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<QuoteStatus | 'all'>('all');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { toast } = useToast();

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const response = await quoteApi.getAll();
      setQuotes(response.data.data);
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Không thể tải danh sách yêu cầu.';
      toast({ type: 'error', title: 'Lỗi', description: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: QuoteStatus) => {
    try {
      await quoteApi.updateStatus(id, status);
      toast({ type: 'success', title: 'Đã cập nhật', description: `Trạng thái đã được chuyển sang "${statusConfig[status].label}".` });
      fetchQuotes();
      if (selectedQuote?._id === id) {
        setSelectedQuote({ ...selectedQuote, status });
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Không thể cập nhật trạng thái.';
      toast({ type: 'error', title: 'Lỗi', description: msg });
    }
  };

  const filtered = useMemo(() => {
    let result = quotes;
    if (filterStatus !== 'all') {
      result = result.filter((q) => q.status === filterStatus);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.fullName.toLowerCase().includes(q) ||
          r.phone.includes(q) ||
          (r.email && r.email.toLowerCase().includes(q)) ||
          (r.apartment && r.apartment.toLowerCase().includes(q))
      );
    }
    return result;
  }, [quotes, filterStatus, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => { setPage(1); }, [filterStatus, search]);

  const statusCounts = {
    all: quotes.length,
    new: quotes.filter((q) => q.status === 'new').length,
    contacted: quotes.filter((q) => q.status === 'contacted').length,
    closed: quotes.filter((q) => q.status === 'closed').length,
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-2 border-b">
          {['all', 'new', 'contacted', 'closed'].map((_, i) => (
            <div key={i} className="h-9 w-20 rounded" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonQuoteList count={4} />
          <div className="bg-card rounded-xl border p-6 h-fit sticky top-6">
            <div className="h-6 w-32 mb-6" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Yêu cầu báo giá</h2>
        <p className="text-muted-foreground">Quản lý các yêu cầu báo giá từ khách hàng</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 border-b overflow-x-auto">
        {(['all', 'new', 'contacted', 'closed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              filterStatus === status
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {status === 'all' ? 'Tất cả' : statusConfig[status].label}
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-muted">
              {statusCounts[status]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo tên, số điện thoại, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Content */}
      {paginated.length === 0 ? (
        <EmptyState
          variant={search ? 'no-results' : 'default'}
          title={search ? 'Không tìm thấy yêu cầu' : 'Chưa có yêu cầu nào'}
          description={search ? `Không có yêu cầu nào phù hợp với "${search}"` : 'Danh sách yêu cầu báo giá sẽ xuất hiện ở đây.'}
        />
      ) : (
        <>
          {/* List + Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quote Cards */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {paginated.map((quote) => {
                const cfg = statusConfig[quote.status];
                return (
                  <div
                    key={quote._id}
                    onClick={() => setSelectedQuote(quote)}
                    className={`bg-card rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedQuote?._id === quote._id ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{quote.fullName}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDateTime(quote.createdAt)}
                        </p>
                      </div>
                      <Badge variant={cfg.variant}>{cfg.label}</Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />
                        {quote.phone}
                      </span>
                      {quote.apartment && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {quote.apartment}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quote Detail */}
            <div className="bg-card rounded-xl border p-6 h-fit sticky top-6">
              {selectedQuote ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Chi tiết yêu cầu</h3>
                    <Badge variant={statusConfig[selectedQuote.status].variant}>
                      {statusConfig[selectedQuote.status].label}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full btn-gold-shimmer /10 text-primary flex items-center justify-center font-semibold">
                        {selectedQuote.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold">{selectedQuote.fullName}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(selectedQuote.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <InfoRow icon={<Phone className="w-4 h-4" />} label="Điện thoại">
                        <a href={`tel:${selectedQuote.phone}`} className="font-medium text-primary hover:underline">
                          {selectedQuote.phone}
                        </a>
                      </InfoRow>

                      {selectedQuote.email && (
                        <InfoRow icon={<Mail className="w-4 h-4" />} label="Email">
                          <a href={`mailto:${selectedQuote.email}`} className="font-medium text-primary hover:underline">
                            {selectedQuote.email}
                          </a>
                        </InfoRow>
                      )}

                      {selectedQuote.apartment && (
                        <InfoRow icon={<MapPin className="w-4 h-4" />} label="Căn hộ">
                          <span className="font-medium">{selectedQuote.apartment}</span>
                        </InfoRow>
                      )}

                      {selectedQuote.message && (
                        <InfoRow icon={<MessageSquare className="w-4 h-4" />} label="Tin nhắn">
                          <span className="font-medium">{selectedQuote.message}</span>
                        </InfoRow>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t space-y-2">
                      <p className="text-sm text-muted-foreground">Cập nhật trạng thái</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedQuote.status !== 'contacted' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(selectedQuote._id, 'contacted')}
                          >
                            <Phone className="w-4 h-4 mr-1" />
                            Đã liên hệ
                          </Button>
                        )}
                        {selectedQuote.status !== 'closed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(selectedQuote._id, 'closed')}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Đóng yêu cầu
                          </Button>
                        )}
                        {selectedQuote.status !== 'new' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateStatus(selectedQuote._id, 'new')}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Đánh dấu mới
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  Chọn một yêu cầu để xem chi tiết
                </div>
              )}
            </div>
          </div>

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
      <div className="text-muted-foreground mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        {children}
      </div>
    </div>
  );
}
