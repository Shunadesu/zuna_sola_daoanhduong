import { useState, useEffect, useRef } from 'react';
import api, { uploadApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Upload,
  Loader2,
  X,
  GripVertical,
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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageDragOver, setImageDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setUploadingImage(false);
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({ type: 'error', title: 'Lỗi', description: 'Vui lòng chọn file hình ảnh.' });
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast({ type: 'error', title: 'Lỗi', description: 'File quá lớn (tối đa 50MB).' });
      return;
    }
    setUploadingImage(true);
    try {
      const response = await uploadApi.uploadImage(file);
      const newImage: AmenityImage = {
        imageUrl: response.data.data.url,
        sortOrder: formData.images.length,
      };
      setFormData((prev) => ({ ...prev, images: [...prev.images, newImage] }));
      toast({ type: 'success', title: 'Thành công', description: 'Hình ảnh đã được tải lên.' });
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Không thể tải ảnh lên.';
      toast({ type: 'error', title: 'Lỗi', description: msg });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => handleImageUpload(file));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setImageDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    files.filter((f) => f.type.startsWith('image/')).forEach((file) => handleImageUpload(file));
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

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...formData.images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newImages.length) return;
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-muted rounded animate-pulse" />
            <div className="h-4 w-48 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card rounded-xl border overflow-hidden">
              <div className="aspect-[4/3] bg-muted animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Quản lý Tiện ích Công viên</h2>
          <p className="text-muted-foreground">Quản lý hình ảnh công viên Stella, Horizon, Fountain</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setEditingAmenity(null);
            setShowModal(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm công viên
        </Button>
      </div>

      {/* Grid */}
      {amenities.length === 0 ? (
        <EmptyState
          title="Chưa có công viên nào"
          description="Bắt đầu bằng cách thêm công viên."
          action={() => {
            resetForm();
            setEditingAmenity(null);
            setShowModal(true);
          }}
          actionLabel="Thêm công viên"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {amenities.map((item) => (
            <div
              key={item._id}
              className="bg-card rounded-xl border overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div className="aspect-[4/3] relative bg-muted">
                {item.images && item.images.length > 0 ? (
                  <>
                    <img
                      src={item.images[0].imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {item.images.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                        +{item.images.length - 1}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEdit(item)}
                        className="gap-2"
                      >
                        <Pencil className="w-4 h-4" />
                        Chỉnh sửa
                      </Button>
                    </div>
                  </>
                ) : (
                  <div
                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleEdit(item)}
                  >
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3">
                      <Plus className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">Tải ảnh lên</p>
                  </div>
                )}
                {!item.isActive && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded text-sm font-medium">
                      Đã ẩn
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold truncate">{item.name}</h3>
                {item.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-muted-foreground">
                    {item.images?.length || 0} ảnh
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(item)}
                      aria-label="Sửa công viên"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(item._id)}
                      className="text-destructive hover:text-destructive"
                      aria-label="Xóa công viên"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
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

          {/* Images Section */}
          <div className="space-y-3">
            <Label>Hình ảnh ({formData.images.length})</Label>
            <div
              className={`
                relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
                ${imageDragOver ? 'border-primary' : 'border-muted-foreground/25 hover:border-muted-foreground/50'}
                ${uploadingImage ? 'pointer-events-none opacity-60' : ''}
              `}
              onDragOver={(e) => { e.preventDefault(); setImageDragOver(true); }}
              onDragLeave={() => setImageDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !uploadingImage && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              {uploadingImage ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Đang tải lên...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    {imageDragOver ? (
                      <Upload className="w-6 h-6 text-primary" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {imageDragOver ? 'Thả file vào đây' : 'Kéo thả ảnh hoặc click để chọn'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP (tối đa 50MB mỗi ảnh)</p>
                  </div>
                </div>
              )}
            </div>

            {/* Image Grid */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group aspect-square bg-muted rounded-lg overflow-hidden">
                    <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveImage(index, 'up')}
                        disabled={index === 0}
                        className="p-1 bg-white rounded text-black disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(index, 'down')}
                        disabled={index === formData.images.length - 1}
                        className="p-1 bg-white rounded text-black disabled:opacity-30"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-1 bg-red-500 rounded text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {index === 0 && (
                      <div className="absolute top-1 left-1 bg-primary text-white text-xs px-1.5 py-0.5 rounded">
                        Ảnh chính
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
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
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowModal(false)}
              disabled={submitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={submitting || !formData.name}>
              {submitting ? 'Đang lưu...' : editingAmenity ? 'Lưu thay đổi' : 'Thêm mới'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Xóa công viên"
        description="Bạn có chắc muốn xóa công viên này? Hành động này không thể hoàn tác."
        confirmLabel="Xóa"
        variant="danger"
        loading={submitting}
      />
    </div>
  );
}
