import { useState, useEffect, useMemo } from 'react';
import { quoteApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SkeletonQuoteList } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { Badge } from '@/components/ui/Badge';
import { DataTable, Column } from '@/components/ui/DataTable';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { formatDateTime } from '@/lib/utils';
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Search,
  Globe,
  Trash2,
  Copy,
  Check,
  X,
} from 'lucide-react';

type QuoteStatus = 'new' | 'contacted' | 'closed';

interface Quote {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
  apartment: string;
  message: string;
  ipAddress: string;
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
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { toast } = useToast();

  const copyPhone = (phone: string, id: string) => {
    navigator.clipboard.writeText(phone).then(() => {
      setCopiedId(id);
      toast({ type: 'success', title: 'Đã copy', description: `SĐT: ${phone}` });
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

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
      setQuotes((prev) =>
        prev.map((q) => (q._id === id ? { ...q, status } : q))
      );
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Không thể cập nhật trạng thái.';
      toast({ type: 'error', title: 'Lỗi', description: msg });
    }
  };

  const handleDelete = async (id: string) => {
    const quote = quotes.find((q) => q._id === id);
    setDeleteTarget({ id, name: quote?.fullName || '' });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await quoteApi.delete(deleteTarget.id);
      toast({ type: 'success', title: 'Đã xóa', description: 'Yêu cầu đã được xóa khỏi hệ thống.' });
      setQuotes((prev) => prev.filter((q) => q._id !== deleteTarget.id));
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Không thể xóa yêu cầu.';
      toast({ type: 'error', title: 'Lỗi', description: msg });
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleSort = (key: string) => {
    setSortDir((prev) => (sortKey === key ? (prev === 'asc' ? 'desc' : 'asc') : 'desc'));
    setSortKey(key);
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
          (r.apartment && r.apartment.toLowerCase().includes(q)) ||
          (r.ipAddress && r.ipAddress.toLowerCase().includes(q))
      );
    }
    return result;
  }, [quotes, filterStatus, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal: any = (a as any)[sortKey];
      let bVal: any = (b as any)[sortKey];
      if (sortKey === 'createdAt') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, page]);

  useEffect(() => { setPage(1); }, [filterStatus, search]);

  const statusCounts = {
    all: quotes.length,
    new: quotes.filter((q) => q.status === 'new').length,
    contacted: quotes.filter((q) => q.status === 'contacted').length,
    closed: quotes.filter((q) => q.status === 'closed').length,
  };

  const columns: Column<Quote>[] = [
    {
      key: 'fullName',
      header: 'Khách hàng',
      sortable: true,
      render: (q) => (
        <div className="min-w-0">
          <p className="font-medium text-sm truncate">{q.fullName}</p>
          {q.email && (
            <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
              <Mail className="w-3 h-3 flex-shrink-0" />
              {q.email}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Điện thoại',
      width: '200px',
      render: (q) => (
        <div className="flex items-center gap-1.5">
          <a
            href={`tel:${q.phone}`}
            className="font-medium text-sm text-primary hover:underline"
          >
            {q.phone}
          </a>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              copyPhone(q.phone, q._id);
            }}
            className="p-1 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground flex-shrink-0"
            title="Copy số điện thoại"
          >
            {copiedId === q._id ? (
              <Check className="w-3.5 h-3.5 text-green-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      ),
    },
    {
      key: 'apartment',
      header: 'Căn hộ',
      width: '150px',
      render: (q) => (
        <span className="text-sm text-muted-foreground flex items-center gap-1">
          {q.apartment ? (
            <>
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{q.apartment}</span>
            </>
          ) : (
            <span className="text-xs italic">—</span>
          )}
        </span>
      ),
    },
    {
      key: 'message',
      header: 'Tin nhắn',
      render: (q) => (
        <div className="max-w-xs">
          {q.message ? (
            <p className="text-sm text-muted-foreground line-clamp-2 flex items-start gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>{q.message}</span>
            </p>
          ) : (
            <span className="text-xs italic text-muted-foreground">Không có</span>
          )}
        </div>
      ),
    },
    {
      key: 'ipAddress',
      header: 'IP',
      width: '130px',
      sortable: true,
      render: (q) => (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Globe className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="font-mono">{q.ipAddress || '—'}</span>
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Ngày gửi',
      width: '140px',
      sortable: true,
      render: (q) => (
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {formatDateTime(q.createdAt)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      width: '220px',
      render: (q) => (
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant={statusConfig[q.status].variant}>
            {statusConfig[q.status].label}
          </Badge>
          {q.status === 'new' && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-6 px-2 text-xs text-green-600 border-green-200 hover:bg-green-50 dark:hover:bg-green-950/30 hover:border-green-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdateStatus(q._id, 'contacted');
                }}
              >
                Đã liên hệ
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdateStatus(q._id, 'closed');
                }}
              >
                Hủy
              </Button>
            </>
          )}
          {q.status === 'contacted' && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                handleUpdateStatus(q._id, 'closed');
              }}
            >
              Hủy
            </Button>
          )}
          {q.status === 'closed' && (
            <Button
              variant="outline"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                handleUpdateStatus(q._id, 'new');
              }}
            >
              Mở lại
            </Button>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '48px',
      render: (q) => (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(q._id);
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-2 border-b">
          {['all', 'new', 'contacted', 'closed'].map((_, i) => (
            <div key={i} className="h-9 w-20 rounded" />
          ))}
        </div>
        <div className="bg-card rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/40">
                  {columns.map((col) => (
                    <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse border-b">
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3">
                        <div className="h-5 bg-muted rounded w-24" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
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
          placeholder="Tìm theo tên, SĐT, email, IP..."
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
          <DataTable
            columns={columns}
            data={paginated}
            keyExtractor={(q) => q._id}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
            emptyMessage="Không có yêu cầu nào"
          />

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Xóa yêu cầu"
        description={`Bạn có chắc muốn xóa yêu cầu từ "${deleteTarget?.name}" không? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="destructive"
      />
    </div>
  );
}
