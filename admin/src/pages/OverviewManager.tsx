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
} from 'lucide-react';

interface OverviewImage {
  imageUrl: string;
  sortOrder: number;
}

interface Overview {
  _id: string;
  title: string;
  images: OverviewImage[];
  linkUrl?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
}

interface OverviewFormData {
  title: string;
  images: OverviewImage[];
  linkUrl: string;
  isActive: boolean;
  sortOrder: number;
}

export default function OverviewManager() {
  const [overviews, setOverviews] = useState<Overview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingOverview, setEditingOverview] = useState<Overview | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageDragOver, setImageDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<OverviewFormData>({
    title: '',
    images: [],
    linkUrl: '',
    isActive: true,
    sortOrder: 0,
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchOverviews();
  }, []);

  const fetchOverviews = async () => {
    try {
      const response = await api.get('/api/admin/overviews');
      setOverviews(response.data.data);
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Không thể tải danh sách hình ảnh.';
      toast({ type: 'error', title: 'Lỗi', description: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast({ type: 'error', title: 'Lỗi', description: 'Vui lòng nhập tiêu đề.' });
      return;
    }
    setSubmitting(true);
    try {
      if (editingOverview) {
        await api.put(`/api/admin/overviews/${editingOverview._id}`, formData);
        toast({ type: 'success', title: 'Thành công', description: 'Hình ảnh đã được cập nhật.' });
      } else {
        await api.post('/api/admin/overviews', formData);
        toast({ type: 'success', title: 'Thành công', description: 'Hình ảnh mới đã được tạo.' });
      }
      setShowModal(false);
      setEditingOverview(null);
      resetForm();
      fetchOverviews();
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Không thể lưu hình ảnh.';
      toast({ type: 'error', title: 'Lỗi', description: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item: Overview) => {
    setEditingOverview(item);
    setFormData({
      title: item.title,
      images: item.images || [],
      linkUrl: item.linkUrl || '',
      isActive: item.isActive,
      sortOrder: item.sortOrder,
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSubmitting(true);
    try {
      await api.delete(`/api/admin/overviews/${deleteId}`);
      toast({ type: 'success', title: 'Thành công', description: 'Hình ảnh đã được xóa.' });
      setDeleteId(null);
      fetchOverviews();
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Không thể xóa hình ảnh.';
      toast({ type: 'error', title: 'Lỗi', description: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', images: [], linkUrl: '', isActive: true, sortOrder: 0 });
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
      const newImage: OverviewImage = {
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
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card rounded-xl border overflow-hidden">
              <div className="aspect-video bg-muted animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
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
          <h2 className="text-2xl font-bold">Quản lý Hình ảnh Tổng thể</h2>
          <p className="text-muted-foreground">Quản lý hình ảnh tổng thể dự án</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setEditingOverview(null);
            setShowModal(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm hình ảnh
        </Button>
      </div>

      {/* Grid */}
      {overviews.length === 0 ? (
        <EmptyState
          title="Chưa có hình ảnh nào"
          description="Bắt đầu bằng cách thêm hình ảnh tổng thể dự án."
          action={() => {
            resetForm();
            setEditingOverview(null);
            setShowModal(true);
          }}
          actionLabel="Thêm hình ảnh"
        />
      ) : (
        <div className="space-y-4">
          {overviews.map((item) => (
            <div
              key={item._id}
              className="bg-card rounded-xl border overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-80 h-48 md:h-40 relative bg-muted flex-shrink-0">
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={item.images[0].imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <ImageIcon className="w-10 h-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Chưa có ảnh</p>
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
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.images?.length || 0} ảnh
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4 md:mt-0">
                    <span className="text-xs text-muted-foreground">
                      Thứ tự: {item.sortOrder}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(item)}
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Sửa
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteId(item._id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Xóa
                      </Button>
                    </div>
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
        title={editingOverview ? 'Chỉnh sửa' : 'Thêm hình ảnh'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Nhập tiêu đề hình ảnh"
              required
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
              <div className="grid grid-cols-4 gap-3 mt-3">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group aspect-square bg-muted rounded-lg overflow-hidden">
                    <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveImage(index, 'up')}
                        disabled={index === 0}
                        className="p-1 bg-white rounded text-black disabled:opacity-30"
                        title="Di chuyển lên"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(index, 'down')}
                        disabled={index === formData.images.length - 1}
                        className="p-1 bg-white rounded text-black disabled:opacity-30"
                        title="Di chuyển xuống"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-1 bg-red-500 rounded text-white"
                        title="Xóa ảnh"
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
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowModal(false)}
              disabled={submitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={submitting || !formData.title}>
              {submitting ? 'Đang lưu...' : editingOverview ? 'Lưu thay đổi' : 'Thêm mới'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Xóa hình ảnh"
        description="Bạn có chắc muốn xóa hình ảnh này? Hành động này không thể hoàn tác."
        confirmLabel="Xóa"
        variant="danger"
        loading={submitting}
      />
    </div>
  );
}
