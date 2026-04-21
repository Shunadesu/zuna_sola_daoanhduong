import { useState, useEffect, useCallback } from 'react';
import { telegramApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useToast } from '@/components/ui/Toast';
import {
  Send,
  Settings,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MessageSquare,
  Copy,
  Eye,
  EyeOff,
  User,
  Users,
  Bot,
  ShieldCheck,
  Clock,
  Hash,
} from 'lucide-react';

interface BotInfo {
  id: number;
  first_name: string;
  username: string;
  can_join_groups: boolean;
  can_read_all_group_messages: boolean;
}

interface Subscriber {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  type: string;
  firstSeen: string;
  lastSeen: string;
  messageCount: number;
  isConfigured: boolean;
}

export default function TelegramManager() {
  const [savedConfig, setSavedConfig] = useState<{
    botToken: string;
    botTokenRaw: string;
    chatId: string;
    isConfigured: boolean;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isFetchingSubscribers, setIsFetchingSubscribers] = useState(false);

  const [showToken, setShowToken] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'subscribers'>('config');

  const [botTokenInput, setBotTokenInput] = useState('');
  const [chatIdInput, setChatIdInput] = useState('');

  const [botInfo, setBotInfo] = useState<BotInfo | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setIsLoading(true);
    try {
      const response = await telegramApi.getConfig();
      const data = response.data.data;
      setSavedConfig(data);
      setBotTokenInput(data.botTokenRaw || '');
      setChatIdInput(data.chatId || '');
    } catch (error: any) {
      toast({ type: 'error', title: 'Lỗi', description: 'Không thể tải cấu hình Telegram.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchSubscribers = useCallback(async (token?: string) => {
    const tokenToUse = token || botTokenInput.trim();
    if (!tokenToUse) {
      toast({ type: 'error', title: 'Lỗi', description: 'Vui lòng nhập Bot Token trước.' });
      return;
    }

    setIsFetchingSubscribers(true);
    setFetchError(null);
    setActiveTab('subscribers');

    try {
      const response = await telegramApi.getSubscribers(tokenToUse);
      const data = response.data.data;
      setBotInfo(data.bot);
      setSubscribers(data.subscribers);
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Không thể lấy danh sách người dùng.';
      setFetchError(msg);
      toast({ type: 'error', title: 'Lỗi', description: msg });
    } finally {
      setIsFetchingSubscribers(false);
    }
  }, [botTokenInput, toast]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!botTokenInput.trim() || !chatIdInput.trim()) {
      toast({ type: 'error', title: 'Lỗi', description: 'Bot Token và Chat ID đều bắt buộc.' });
      return;
    }
    setIsSaving(true);
    try {
      await telegramApi.updateConfig({
        botToken: botTokenInput.trim(),
        chatId: chatIdInput.trim(),
      });
      toast({ type: 'success', title: 'Thành công', description: 'Cấu hình Telegram đã được lưu!' });
      fetchConfig();
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Không thể lưu cấu hình.';
      toast({ type: 'error', title: 'Lỗi', description: msg });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    try {
      await telegramApi.sendTest({
        botToken: botTokenInput.trim(),
        chatId: chatIdInput.trim(),
      });
      toast({ type: 'success', title: 'Thành công', description: 'Tin nhắn test đã được gửi đến Telegram!' });
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Không thể gửi tin nhắn test.';
      toast({ type: 'error', title: 'Lỗi', description: msg });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSelectSubscriber = (sub: Subscriber) => {
    setChatIdInput(String(sub.id));
    setActiveTab('config');
    toast({
      type: 'success',
      title: 'Đã chọn',
      description: `Chat ID: ${sub.id} — ${sub.first_name || sub.username || 'User'}`,
    });
  };

  const copyToClipboard = (text: string, label?: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ type: 'success', title: 'Đã copy', description: label ? `${label}: ${text}` : 'Đã copy vào clipboard!' });
    });
  };

  const formatDateTime = (iso: string) => {
    return new Date(iso).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse bg-muted rounded" />
        <div className="h-4 w-72 animate-pulse bg-muted rounded" />
        <div className="bg-card rounded-xl border p-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="w-6 h-6" />
          Cài đặt Telegram
        </h2>
        <p className="text-muted-foreground mt-1">
          Quản lý kết nối Bot Telegram để nhận thông báo yêu cầu báo giá
        </p>
      </div>

      {/* Status Banner */}
      <div className={`rounded-xl border p-4 flex items-center gap-4 ${
        savedConfig?.isConfigured
          ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900'
          : 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900'
      }`}>
        {savedConfig?.isConfigured ? (
          <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-8 h-8 text-amber-600 flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <p className={`font-semibold ${savedConfig?.isConfigured ? 'text-green-800 dark:text-green-200' : 'text-amber-800 dark:text-amber-200'}`}>
            {savedConfig?.isConfigured ? 'Đã kết nối thành công' : 'Chưa được cấu hình'}
          </p>
          <p className={`text-sm ${savedConfig?.isConfigured ? 'text-green-700 dark:text-green-300' : 'text-amber-700 dark:text-amber-300'}`}>
            {savedConfig?.isConfigured
              ? `Bot Token: ${savedConfig.botToken} • Chat ID: ${savedConfig.chatId}`
              : 'Vui lòng nhập Bot Token và Chat ID để bắt đầu nhận thông báo'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('config')}
          className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'config'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Settings className="w-4 h-4" />
          Cấu hình
        </button>
        <button
          onClick={() => {
            setActiveTab('subscribers');
            if (!botInfo && botTokenInput.trim()) {
              handleFetchSubscribers();
            }
          }}
          className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'subscribers'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="w-4 h-4" />
          Người đã Start Bot
          {subscribers.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">
              {subscribers.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab: Cấu hình */}
      {activeTab === 'config' && (
        <div className="space-y-6">
          {/* Current Config */}
          {savedConfig?.isConfigured && (
            <div className="bg-muted/50 rounded-xl border p-4 space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Cấu hình hiện tại
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-card rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground mb-1">Bot Token</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono flex-1 truncate">{savedConfig.botToken || '—'}</code>
                    <button onClick={() => copyToClipboard(savedConfig.botTokenRaw || '', 'Bot Token')} className="p-1 hover:bg-accent rounded transition-colors flex-shrink-0" title="Copy token">
                      <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                </div>
                <div className="bg-card rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground mb-1">Chat ID</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono flex-1">{savedConfig.chatId || '—'}</code>
                    <button onClick={() => copyToClipboard(savedConfig.chatId || '', 'Chat ID')} className="p-1 hover:bg-accent rounded transition-colors flex-shrink-0" title="Copy chat ID">
                      <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Config Form */}
          <form onSubmit={handleSave} className="bg-card rounded-xl border p-6 space-y-5">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Kết nối Bot
            </h3>

            <div className="space-y-2">
              <Label htmlFor="botToken">Bot Token</Label>
              <div className="relative">
                <Input
                  id="botToken"
                  type={showToken ? 'text' : 'password'}
                  value={botTokenInput}
                  onChange={(e) => setBotTokenInput(e.target.value)}
                  placeholder="Ví dụ: 123456789:ABCDefGhiJKlmNoPQRsTUVwxYZ"
                  className="pr-20 font-mono text-sm"
                  disabled={isSaving}
                />
                <button
                  type="button"
                  onClick={() => setShowToken((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  title={showToken ? 'Ẩn token' : 'Hiện token'}
                >
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Lấy token từ{' '}
                <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  @BotFather
                </a>{' '}
                trên Telegram. Sau khi nhập token, chuyển sang tab{" "}
                <button type="button" onClick={() => { setActiveTab('subscribers'); if (!botInfo && botTokenInput.trim()) handleFetchSubscribers(); }} className="text-primary hover:underline font-medium">
                  Người đã Start Bot
                </button>{' '}
                để xem danh sách.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chatId">
                Chat ID
                <span className="text-muted-foreground font-normal ml-1">(chọn từ tab Người đã Start Bot)</span>
              </Label>
              <Input
                id="chatId"
                value={chatIdInput}
                onChange={(e) => setChatIdInput(e.target.value)}
                placeholder="Ví dụ: -100123456789 hoặc 123456789"
                className="font-mono text-sm"
                disabled={isSaving}
              />
            </div>

            <div className="flex items-center gap-3 pt-2 border-t">
              <Button type="submit" disabled={isSaving || isTesting} className="min-w-[140px]">
                {isSaving ? 'Đang lưu...' : 'Lưu cấu hình'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleTest}
                disabled={isSaving || isTesting || !botTokenInput.trim() || !chatIdInput.trim()}
              >
                <Send className="w-4 h-4 mr-2" />
                {isTesting ? 'Đang gửi...' : 'Gửi test'}
              </Button>
            </div>
          </form>

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900 p-5 space-y-3">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Hướng dẫn cài đặt nhanh
            </h3>
            <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-2 list-decimal list-inside">
              <li>
                Mở Telegram tìm{' '}
                <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                  @BotFather
                </a>{' '}
                → gửi <strong>/newbot</strong> → đặt tên → lấy <strong>Bot Token</strong>
              </li>
              <li>
                Nhập <strong>Bot Token</strong> vào ô trên → nhấn tab <strong>Người đã Start Bot</strong> để xem danh sách
              </li>
              <li>
                Nhấn vào người dùng để tự động điền <strong>Chat ID</strong> → nhấn <strong>Lưu cấu hình</strong>
              </li>
              <li>Nhấn <strong>Gửi test</strong> để xác nhận kết nối hoạt động</li>
            </ol>
          </div>
        </div>
      )}

      {/* Tab: Người đã Start Bot */}
      {activeTab === 'subscribers' && (
        <div className="space-y-6">
          {/* Bot Token Input + Fetch */}
          <div className="bg-card rounded-xl border p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Nhập Bot Token để xem người dùng</h3>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showToken ? 'text' : 'password'}
                  value={botTokenInput}
                  onChange={(e) => {
                    setBotTokenInput(e.target.value);
                    setBotInfo(null);
                    setSubscribers([]);
                    setFetchError(null);
                  }}
                  placeholder="123456789:ABCDefGhiJKlmNoPQRsTUVwxYZ"
                  className="pr-20 font-mono text-sm"
                  disabled={isFetchingSubscribers}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleFetchSubscribers(); } }}
                />
                <button
                  type="button"
                  onClick={() => setShowToken((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Button
                onClick={() => handleFetchSubscribers()}
                disabled={isFetchingSubscribers || !botTokenInput.trim()}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isFetchingSubscribers ? 'animate-spin' : ''}`} />
                {isFetchingSubscribers ? 'Đang tìm...' : 'Tìm người dùng'}
              </Button>
            </div>
          </div>

          {/* Error State */}
          {fetchError && (
            <div className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 p-4 flex items-center gap-3">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-800 dark:text-red-200">Lỗi</p>
                <p className="text-sm text-red-700 dark:text-red-300">{fetchError}</p>
              </div>
            </div>
          )}

          {/* Bot Info */}
          {botInfo && (
            <div className="bg-card rounded-xl border p-4 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-lg">{botInfo.first_name}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="font-mono">@{botInfo.username}</span>
                    <span>•</span>
                    <span>ID: {botInfo.id}</span>
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-green-600 bg-green-50 dark:bg-green-950/30 px-3 py-1.5 rounded-full text-sm font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  Bot hợp lệ
                </div>
              </div>
            </div>
          )}

          {/* Subscribers List */}
          {botInfo && subscribers.length === 0 && !isFetchingSubscribers && !fetchError && (
            <div className="rounded-xl border border-dashed p-12 text-center space-y-3">
              <Users className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
              <p className="font-semibold text-muted-foreground">Chưa có ai nhắn tin cho bot</p>
              <p className="text-sm text-muted-foreground">
                Hãy mở Telegram, tìm bot <strong>@{botInfo.username}</strong> và nhấn <strong>Start</strong>, sau đó nhấn nút <strong>Tìm người dùng</strong>.
              </p>
            </div>
          )}

          {subscribers.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Danh sách người đã Start Bot ({subscribers.length})
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFetchSubscribers()}
                  disabled={isFetchingSubscribers}
                >
                  <RefreshCw className={`w-4 h-4 mr-1 ${isFetchingSubscribers ? 'animate-spin' : ''}`} />
                  Làm mới
                </Button>
              </div>

              <div className="bg-card rounded-xl border overflow-hidden divide-y">
                {subscribers.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => handleSelectSubscriber(sub)}
                    className={`w-full px-5 py-4 text-left hover:bg-muted/40 transition-colors flex items-center gap-4 ${
                      sub.isConfigured ? 'bg-green-50/50 dark:bg-green-950/10' : ''
                    }`}
                  >
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-primary" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold truncate">
                          {[sub.first_name, sub.last_name].filter(Boolean).join(' ') || 'Không có tên'}
                        </p>
                        {sub.username && (
                          <span className="text-sm text-muted-foreground font-mono">@{sub.username}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          ID: {sub.id}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Lần cuối: {formatDateTime(sub.lastSeen)}
                        </span>
                        <span className="bg-muted px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold">
                          {sub.type}
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {sub.isConfigured && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Đang dùng
                        </span>
                      )}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(String(sub.id), 'Chat ID');
                          }}
                          className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                          title="Copy Chat ID"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectSubscriber(sub);
                          }}
                          className="h-8 text-xs"
                        >
                          Chọn
                        </Button>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
