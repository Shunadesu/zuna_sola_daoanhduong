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
import { MultiImageInput } from '@/components/ui/MultiImageInput';
import {
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Search,
  X,
} from 'lucide-react';

interface AmenityImage {
  imageUrl: string;
  sortOrder: number;
}

interface Amenity {
  _id: string;
  name: string;
  images: AmenityImage[];
  description: string;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
}

interface AmenityFormData {
  name: string;
  images: AmenityImage[];
  description: string;
  isActive: boolean;
  sortOrder: number;
}

const DEFAULT_PARKS = [
  { value: 'Công viên Stella', label: 'Công viên Stella', description: 'Không gian xanh mát với hồ cảnh quan và vườn hoa tự nhiên' },
  { value: 'Công viên Horizon', label: 'Công viên Horizon', description: 'Khu vực giải trí ngoài trời với sân chơi và đường dạo' },
  { value: 'Công viên Fountain', label: 'Công viên Fountain', description: 'Công viên với đài phun nước nghệ thuật trung tâm' },
];

export default function AmenityManager() {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState('');
  const [filterActive, setFilterActive] = useState<string>('all');
  const [sortKey, setSortKey] = useState('sortOrder');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const [formData, setFormData] = useState<AmenityFormData>({
    name: '',
    images: [],
    description: '',
    isActive: true,
    sortOrder: 0,
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchAmenities();
  }, []);

  const fetchAmenities = async () => {
    try {
      const response = await api.get('/api/admin/amenities');
      setAmenities(response.data.data);
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Không thể tải danh sách công viên.';
      toast({ type: 'error', title: 'Lỗi', description: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast({ type: 'error', title: 'Lỗi', description: 'Vui lòng chọn công viên.' });
      return;
    }
    setSubmitting(true);
    try {
      if (editingAmenity) {
        await api.put(`/api/admin/amenities/${editingAmenity._id}`, formData);
        toast({ type: 'success', title: 'Thành công', description: 'Công viên đã được cập nhật.' });
      } else {
        await api.post('/api/admin/amenities', formData);
        toast({ type: 'success', title: 'Thành công', description: 'Công viên đã được tạo.' });
      }
      setShowModal(false);
      setEditingAmenity(null);
      resetForm();
      fetchAmenities();
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Không thể lưu thông tin.';
      toast({ type: 'error', title: 'Lỗi', description: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item: Amenity) => {
    setEditingAmenity(item);
    setFormData({
      name: item.name,
      images: item.images || [],
      description: item.description || '',
      isActive: item.isActive,
      sortOrder: item.sortOrder,
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSubmitting(true);
    try {
      await api.delete(`/api/admin/amenities/${deleteId}`);
      toast({ type: 'success', title: 'Thành công', description: 'Công viên đã được xóa.' });
      setDeleteId(null);
      fetchAmenities();
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Không thể xóa công viên.';
      toast({ type: 'error', title: 'Lỗi', description: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', images: [], description: '', isActive: true, sortOrder: 0 });
  };

  const handleParkSelect = (parkName: string) => {
    const park = DEFAULT_PARKS.find((p) => p.value === parkName);
    if (park) {
      setFormData((prev) => ({
        ...prev,
        name: park.value,
        description: park.description,
      }));
    }
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
    let result = [...amenities];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)
      );
    }
    if (filterActive !== 'all') {
      result = result.filter((a) => a.isActive === (filterActive === 'active'));
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
  }, [amenities, search, filterActive, sortKey, sortDir]);

  const columns: Column<Amenity>[] = [
    {
      key: 'thumb',
      header: 'Ảnh',
      width: '80px',
      render: (item) => (
        <div className="w-16 h-12 rounded overflow-hidden bg-muted flex-shrink-0">
          {item.images && item.images.length > 0 ? (
            <img src={item.images[0].imageUrl} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-muted-foreground" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Tên công viên',
      sortable: true,
      render: (item) => (
        <div className="max-w-xs">
          <span className="font-medium truncate block">{item.name}</span>
          {item.description && (
            <span className="text-xs text-muted-foreground truncate block">{item.description}</span>
          )}
        </div>
      ),
    },
    {
      key: 'images',
      header: 'Số ảnh',
      width: '100px',
      render: (item) => (
        <span className="text-sm text-muted-foreground">{item.images?.length || 0}</span>
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
          <h2 className="text-2xl font-bold">Quản lý Tiện ích Công viên</h2>
          <p className="text-muted-foreground text-sm">Quản lý hình ảnh công viên Stella, Horizon, Fountain</p>
        </div>
        <Button onClick={() => { resetForm(); setEditingAmenity(null); setShowModal(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm công viên
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm công viên..."
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
        emptyMessage="Chưa có công viên nào"
      />

      <Modal
        open={showModal}
        onClose={() => !submitting && setShowModal(false)}
        title={editingAmenity ? `Chỉnh sửa ${editingAmenity.name}` : 'Thêm công viên'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {!editingAmenity && (
            <div className="space-y-2">
              <Label>Chọn công viên</Label>
              <Select
                value={formData.name}
                onChange={(v) => handleParkSelect(v)}
                options={[
                  { value: '', label: '--- Chọn công viên ---' },
                  ...DEFAULT_PARKS.map((p) => ({ value: p.value, label: p.label })),
                ]}
                disabled={submitting}
              />
              {formData.name && (
                <p className="text-sm text-muted-foreground mt-1">{formData.description}</p>
              )}
            </div>
          )}

          {editingAmenity && (
            <div className="space-y-2">
              <Label htmlFor="name">Tên công viên</Label>
              <Input id="name" value={formData.name} disabled className="bg-muted" />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mô tả ngắn về công viên"
              disabled={submitting}
            />
          </div>

          <MultiImageInput
            value={formData.images}
            onChange={(images) => setFormData((prev) => ({ ...prev, images }))}
            onUpload={handleUpload}
            label="Hình ảnh công viên"
            hint="Thêm nhiều ảnh bằng upload hoặc dán URL"
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
            <Button type="submit" disabled={submitting || !formData.name}>
              {submitting ? 'Đang lưu...' : editingAmenity ? 'Lưu thay đổi' : 'Thêm mới'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Xóa công viên"
        description="Bạn có chắc muốn xóa công viên này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        variant="destructive"
        loading={submitting}
      />
    </div>
  );
}
