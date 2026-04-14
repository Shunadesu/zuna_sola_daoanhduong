import { useState, useEffect } from 'react';
import { quoteApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { formatDateTime } from '@/lib/utils';
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Eye,
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
  status: QuoteStatus;
  createdAt: string;
}

const statusConfig: Record<QuoteStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  new: {
    label: 'Mới',
    color: 'text-green-600',
    bg: 'bg-green-100',
    icon: <Eye className="w-4 h-4" />,
  },
  contacted: {
    label: 'Đã liên hệ',
    color: 'text-yellow-600',
    bg: 'bg-yellow-100',
    icon: <Phone className="w-4 h-4" />,
  },
  closed: {
    label: 'Đã đóng',
    color: 'text-gray-600',
    bg: 'bg-gray-100',
    icon: <Check className="w-4 h-4" />,
  },
};

export default function QuoteManager() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<QuoteStatus | 'all'>('all');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const response = await quoteApi.getAll();
      setQuotes(response.data.data);
    } catch (error) {
      console.error('Failed to fetch quotes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: QuoteStatus) => {
    try {
      await quoteApi.updateStatus(id, status);
      fetchQuotes();
      if (selectedQuote?._id === id) {
        setSelectedQuote({ ...selectedQuote, status });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const filteredQuotes = filterStatus === 'all'
    ? quotes
    : quotes.filter((q) => q.status === filterStatus);

  const statusCounts = {
    all: quotes.length,
    new: quotes.filter((q) => q.status === 'new').length,
    contacted: quotes.filter((q) => q.status === 'contacted').length,
    closed: quotes.filter((q) => q.status === 'closed').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Yêu cầu báo giá</h2>
          <p className="text-muted-foreground">Quản lý các yêu cầu báo giá từ khách hàng</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b">
        {(['all', 'new', 'contacted', 'closed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
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

      {/* Quote List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quote Cards */}
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {filteredQuotes.map((quote) => {
            const status = statusConfig[quote.status];
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
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(quote.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}
                  >
                    {status.icon}
                    {status.label}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {quote.phone}
                  </span>
                  {quote.apartment && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {quote.apartment}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {filteredQuotes.length === 0 && (
            <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border">
              Không có yêu cầu nào
            </div>
          )}
        </div>

        {/* Quote Detail */}
        <div className="bg-card rounded-xl border p-6 h-fit sticky top-6">
          {selectedQuote ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Chi tiết yêu cầu</h3>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[selectedQuote.status].bg} ${statusConfig[selectedQuote.status].color}`}
                >
                  {statusConfig[selectedQuote.status].icon}
                  {statusConfig[selectedQuote.status].label}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {selectedQuote.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{selectedQuote.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(selectedQuote.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Điện thoại</p>
                      <a
                        href={`tel:${selectedQuote.phone}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {selectedQuote.phone}
                      </a>
                    </div>
                  </div>

                  {selectedQuote.email && (
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <a
                          href={`mailto:${selectedQuote.email}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {selectedQuote.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {selectedQuote.apartment && (
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <MapPin className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Căn hộ</p>
                        <p className="font-medium">{selectedQuote.apartment}</p>
                      </div>
                    </div>
                  )}

                  {selectedQuote.message && (
                    <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                      <MessageSquare className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Tin nhắn</p>
                        <p className="font-medium">{selectedQuote.message}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-3">Cập nhật trạng thái</p>
                  <div className="flex gap-2">
                    {selectedQuote.status !== 'contacted' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleUpdateStatus(selectedQuote._id, 'contacted')
                        }
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Đã liên hệ
                      </Button>
                    )}
                    {selectedQuote.status !== 'closed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(selectedQuote._id, 'closed')}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Đóng yêu cầu
                      </Button>
                    )}
                    {selectedQuote.status !== 'new' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpdateStatus(selectedQuote._id, 'new')}
                      >
                        <X className="w-4 h-4 mr-2" />
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
    </div>
  );
}
