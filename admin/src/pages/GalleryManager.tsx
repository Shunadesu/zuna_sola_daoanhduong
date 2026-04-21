import { useState, useEffect, useMemo } from 'react';
import api, { uploadApi } from '@/lib/api';
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

interface Gallery {
  _id: string;
  title: string;
  imageUrl: string;
  category: string;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
}

interface GalleryFormData {
  title: string;
  imageUrl: string;
  category: string;
  isActive: boolean;
  sortOrder: number;
}

const CATEGORIES = [
  { value: 'biệt thự song lập', label: 'Biệt thự song lập' },
  { value: 'biệt thự đơn lập', label: 'Biệt thự đơn lập' },
  { value: 'nhà phố liền kề', label: 'Nhà phố liền kề' },
];

const CATEGORY_COLORS: Record<string, string> = {
  'biệt thự song lập': 'bg-blue-100 text-blue-700',
  'biệt thự đơn lập': 'bg-purple-100 text-purple-700',
  'nhà phố liền kề': 'bg-green-100 text-green-700',
};

const CATEGORY_LABELS: Record<string, string> = {
  'biệt thự song lập': 'Biệt thự song lập',
  'biệt thự đơn lập': 'Biệt thự đơn lập',
  'nhà phố liền kề': 'Nhà phố liền kề',
};

export default function GalleryManager() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterActive, setFilterActive] = useState<string>('all');
  const [sortKey, setSortKey] = useState('sortOrder');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const [formData, setFormData] = useState<GalleryFormData>({
    title: '',
    imageUrl: '',
    category: 'biệt thự song lập',
    isActive: true,
    sortOrder: 0,
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      const response = await api.get('/api/admin/galleries');
      setGalleries(response.data.data);
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Không thể tải danh sách.';
      toast({ type: 'error', title: 'Lỗi', description: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.imageUrl) {
      toast({ type: 'error', title: 'Lỗi', description: 'Vui lòng nhập tiêu đề và chọn ảnh.' });
      return;
    }
    setSubmitting(true);
    try {
      if (editingGallery) {
        await api.put(`/api/admin/galleries/${editingGallery._id}`, formData);
        toast({ type: 'success', title: 'Thành công', description: 'Đã cập nhật.' });
      } else {
        await api.post('/api/admin/galleries', formData);
        toast({ type: 'success', title: 'Thành công', description: 'Đã thêm ảnh mới.' });
      }
      setShowModal(false);
      setEditingGallery(null);
      resetForm();
      fetchGalleries();
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Không thể lưu.';
      toast({ type: 'error', title: 'Lỗi', description: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item: Gallery) => {
    setEditingGallery(item);
    setFormData({
      title: item.title,
      imageUrl: item.imageUrl,
      category: item.category,
      isActive: item.isActive,
      sortOrder: item.sortOrder,
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSubmitting(true);
    try {
      await api.delete(`/api/admin/galleries/${deleteId}`);
      toast({ type: 'success', title: 'Thành công', description: 'Đã xóa ảnh.' });
      setDeleteId(null);
      fetchGalleries();
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Không thể xóa.';
      toast({ type: 'error', title: 'Lỗi', description: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', imageUrl: '', category: 'biệt thự song lập', isActive: true, sortOrder: 0 });
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
    let result = [...galleries];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((g) => g.title.toLowerCase().includes(q));
    }
    if (filterCategory !== 'all') {
      result = result.filter((g) => g.category === filterCategory);
    }
    if (filterActive !== 'all') {
      result = result.filter((g) => g.isActive === (filterActive === 'active'));
    }
    result.sort((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)[sortKey];
      const bVal = (b as unknown as Record<string, unknown>)[sortKey];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [galleries, search, filterCategory, filterActive, sortKey, sortDir]);

  const columns: Column<Gallery>[] = [
    {
      key: 'thumb',
      header: 'Ảnh',
      width: '80px',
      render: (item) => (
        <div className="w-16 h-12 rounded overflow-hidden bg-muted flex-shrink-0">
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
        <span className="font-medium">{item.title}</span>
      ),
    },
    {
      key: 'category',
      header: 'Danh mục',
      width: '140px',
      render: (item) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[item.category] || 'bg-gray-100 text-gray-700'}`}>
          {CATEGORY_LABELS[item.category] || item.category}
        </span>
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
          <h2 className="text-2xl font-bold">Quản lý Thư Viện Ảnh</h2>
          <p className="text-muted-foreground text-sm">Thêm, sửa, xóa hình ảnh theo danh mục</p>
        </div>
        <Button onClick={() => { resetForm(); setEditingGallery(null); setShowModal(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm ảnh
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm tiêu đề..."
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
        <div className="w-full sm:w-40">
          <Select
            value={filterCategory}
            onChange={setFilterCategory}
            options={[
              { value: 'all', label: 'Tất cả danh mục' },
              ...CATEGORIES,
            ]}
          />
        </div>
        <div className="w-full sm:w-44">
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
        emptyMessage="Chưa có ảnh nào"
      />

      <Modal
        open={showModal}
        onClose={() => !submitting && setShowModal(false)}
        title={editingGallery ? 'Sửa ảnh' : 'Thêm ảnh mới'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Nhập tiêu đề ảnh"
              required
              disabled={submitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Danh mục</Label>
            <Select
              id="category"
              value={formData.category}
              onChange={(v) => setFormData({ ...formData, category: v })}
              options={CATEGORIES}
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
            <Button type="submit" disabled={submitting || !formData.title || !formData.imageUrl}>
              {submitting ? 'Đang lưu...' : editingGallery ? 'Lưu thay đổi' : 'Thêm mới'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Xóa ảnh"
        description="Bạn có chắc muốn xóa ảnh này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        variant="destructive"
        loading={submitting}
      />
    </div>
  );
}
