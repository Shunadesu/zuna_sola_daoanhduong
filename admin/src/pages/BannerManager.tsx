import { useState, useEffect, useMemo } from 'react';
import { bannerApi, uploadApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';
import { DataTable, Column } from '@/components/ui/DataTable';
import { ImageInput } from '@/components/ui/ImageInput';
import {
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Search,
  X,
} from 'lucide-react';

interface Banner {
  _id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

interface BannerFormData {
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  sortOrder: number;
}

export default function BannerManager() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [filterActive, setFilterActive] = useState<string>('all');
  const [sortKey, setSortKey] = useState('sortOrder');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const [formData, setFormData] = useState<BannerFormData>({
    title: '',
    subtitle: '',
    imageUrl: '',
    linkUrl: '',
    isActive: true,
    sortOrder: 0,
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await bannerApi.getAll();
      setBanners(response.data.data);
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Không thể tải danh sách banner.';
      toast({ type: 'error', title: 'Lỗi', description: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingBanner) {
        await bannerApi.update(editingBanner._id, formData);
        toast({ type: 'success', title: 'Thành công', description: 'Banner đã được cập nhật.' });
      } else {
        await bannerApi.create(formData);
        toast({ type: 'success', title: 'Thành công', description: 'Banner mới đã được tạo.' });
      }
      setShowModal(false);
      setEditingBanner(null);
      resetForm();
      fetchBanners();
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Không thể lưu banner.';
      toast({ type: 'error', title: 'Lỗi', description: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl || '',
      isActive: banner.isActive,
      sortOrder: banner.sortOrder,
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSubmitting(true);
    try {
      await bannerApi.delete(deleteId);
      toast({ type: 'success', title: 'Thành công', description: 'Banner đã được xóa.' });
      setDeleteId(null);
      fetchBanners();
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Không thể xóa banner.';
      toast({ type: 'error', title: 'Lỗi', description: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', subtitle: '', imageUrl: '', linkUrl: '', isActive: true, sortOrder: 0 });
  };

  const handleUpload = async (file: File): Promise<string> => {
    const response = await uploadApi.uploadImage(file);
    return response.data.data.url as string;
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filtered = useMemo(() => {
    let result = [...banners];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) => b.title.toLowerCase().includes(q) || (b.subtitle || '').toLowerCase().includes(q)
      );
    }
    if (filterActive !== 'all') {
      result = result.filter((b) => b.isActive === (filterActive === 'active'));
    }
    result.sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey];
      const bVal = (b as Record<string, unknown>)[sortKey];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [banners, search, filterActive, sortKey, sortDir]);

  const columns: Column<Banner>[] = [
    {
      key: 'thumb',
      header: 'Ảnh',
      width: '100px',
      render: (item) => (
        <div className="w-20 h-12 rounded overflow-hidden bg-muted flex-shrink-0">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-muted-foreground" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'title',
      header: 'Tiêu đề',
      sortable: true,
      render: (item) => (
        <div className="max-w-xs">
          <span className="font-medium truncate block">{item.title}</span>
          {item.subtitle && (
            <span className="text-xs text-muted-foreground truncate block">{item.subtitle}</span>
          )}
        </div>
      ),
    },
    {
      key: 'linkUrl',
      header: 'Link',
      width: '160px',
      render: (item) =>
        item.linkUrl ? (
          <a
            href={item.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline truncate block max-w-xs"
            onClick={(e) => e.stopPropagation()}
          >
            {item.linkUrl}
          </a>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        ),
    },
    {
      key: 'isActive',
      header: 'Trạng thái',
      width: '120px',
      render: (item) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
          item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
        }`}>
          {item.isActive ? 'Hiển thị' : 'Đã ẩn'}
        </span>
      ),
    },
    {
      key: 'sortOrder',
      header: 'Thứ tự',
      width: '80px',
      sortable: true,
      render: (item) => (
        <span className="text-sm text-muted-foreground">{item.sortOrder}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      width: '120px',
      render: (item) => (
        <div className="flex items-center gap-1">
          <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setDeleteId(item._id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Quản lý Banner</h2>
          <p className="text-muted-foreground text-sm">Quản lý banner hiển thị trên trang chủ</p>
        </div>
        <Button onClick={() => { resetForm(); setEditingBanner(null); setShowModal(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm Banner
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm banner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={filterActive}
            onChange={setFilterActive}
            options={[
              { value: 'all', label: 'Tất cả trạng thái' },
              { value: 'active', label: 'Đang hiển thị' },
              { value: 'inactive', label: 'Đã ẩn' },
            ]}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(item) => item._id}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
        loading={isLoading}
        skeletonRows={5}
        emptyMessage="Chưa có banner nào"
      />

      <Modal
        open={showModal}
        onClose={() => !submitting && setShowModal(false)}
        title={editingBanner ? 'Sửa Banner' : 'Thêm Banner'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Nhập tiêu đề banner"
              required
              disabled={submitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Phụ đề</Label>
            <Input
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="Nhập phụ đề (tùy chọn)"
              disabled={submitting}
            />
          </div>

          <ImageInput
            value={formData.imageUrl}
            onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
            onUpload={async (file) => {
              if (file.size > 50 * 1024 * 1024) {
                toast({ type: 'error', title: 'Lỗi', description: 'File quá lớn (tối đa 50MB).' });
                return;
              }
              if (!file.type.startsWith('image/')) {
                toast({ type: 'error', title: 'Lỗi', description: 'Vui lòng chọn file hình ảnh.' });
                return;
              }
              try {
                const url = await handleUpload(file);
                setFormData((prev) => ({ ...prev, imageUrl: url }));
                toast({ type: 'success', title: 'Thành công', description: 'Hình ảnh đã được tải lên.' });
              } catch {
                toast({ type: 'error', title: 'Lỗi', description: 'Không thể tải ảnh lên.' });
              }
            }}
            label="Hình ảnh"
            hint="Dùng URL từ bên ngoài hoặc upload ảnh lên server"
          />

          <div className="space-y-2">
            <Label htmlFor="linkUrl">Link (tùy chọn)</Label>
            <Input
              id="linkUrl"
              value={formData.linkUrl}
              onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
              placeholder="https://..."
              disabled={submitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sortOrder">Thứ tự</Label>
              <Input
                id="sortOrder"
                type="number"
                min={0}
                value={formData.sortOrder}
                onChange={(e) =>
                  setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })
                }
                disabled={submitting}
              />
            </div>
            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select
                value={formData.isActive ? 'true' : 'false'}
                onChange={(v) => setFormData({ ...formData, isActive: v === 'true' })}
                options={[
                  { value: 'true', label: 'Hiển thị' },
                  { value: 'false', label: 'Ẩn' },
                ]}
                disabled={submitting}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)} disabled={submitting}>
              Hủy
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Đang lưu...' : editingBanner ? 'Lưu thay đổi' : 'Thêm mới'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Xóa Banner"
        description="Bạn có chắc muốn xóa banner này? Hành động này không thể hoàn tác."
        confirmLabel="Xóa"
        variant="danger"
        loading={submitting}
      />
    </div>
  );
}
