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
  { value: 'căn hộ', label: 'Căn hộ' },
  { value: 'nội thất', label: 'Nội thất' },
  { value: 'tiện ích', label: 'Tiện ích' },
];

export default function GalleryManager() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageDragOver, setImageDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<GalleryFormData>({
    title: '',
    imageUrl: '',
    category: 'căn hộ',
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
    setFormData({ title: '', imageUrl: '', category: 'căn hộ', isActive: true, sortOrder: 0 });
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
      setFormData((prev) => ({ ...prev, imageUrl: response.data.data.url }));
      toast({ type: 'success', title: 'Thành công', description: 'Hình ảnh đã được tải lên.' });
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Không thể tải ảnh lên.';
      toast({ type: 'error', title: 'Lỗi', description: msg });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setImageDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageUpload(file);
  };

  const getCategoryLabel = (category: string) => {
    return CATEGORIES.find((c) => c.value === category)?.label || category;
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'căn hộ': return 'bg-blue-100 text-blue-700';
      case 'nội thất': return 'bg-purple-100 text-purple-700';
      case 'tiện ích': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
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
          <h2 className="text-2xl font-bold">Quản lý Thư Viện Ảnh</h2>
          <p className="text-muted-foreground">Thêm, sửa, xóa hình ảnh theo danh mục</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setEditingGallery(null);
            setShowModal(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm ảnh
        </Button>
      </div>

      {/* Grid */}
      {galleries.length === 0 ? (
        <EmptyState
          title="Chưa có ảnh nào"
          description="Bắt đầu bằng cách thêm ảnh vào thư viện."
          action={() => {
            resetForm();
            setEditingGallery(null);
            setShowModal(true);
          }}
          actionLabel="Thêm ảnh"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {galleries.map((item) => (
            <div
              key={item._id}
              className="bg-card rounded-xl border overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div className="aspect-video relative bg-muted">
                {item.imageUrl ? (
                  <>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
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
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-muted-foreground" />
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
                <h3 className="font-semibold truncate">{item.title}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getCategoryBadgeClass(item.category)}`}>
                    {getCategoryLabel(item.category)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Thứ tự: {item.sortOrder}
                  </span>
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

          <div className="space-y-2">
            <Label>Hình ảnh</Label>
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
                onChange={handleFileChange}
                className="hidden"
              />
              {uploadingImage ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Đang tải lên...</p>
                </div>
              ) : formData.imageUrl ? (
                <div className="space-y-3">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-lg object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <p className="text-xs text-muted-foreground">Kéo thả hoặc click để thay ảnh khác</p>
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
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP (tối đa 50MB)</p>
                  </div>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {formData.imageUrl ? 'Hình ảnh đã được tải lên server.' : 'Chưa có hình ảnh nào được chọn.'}
            </p>
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
            <Button type="submit" disabled={submitting || !formData.title || !formData.imageUrl}>
              {submitting ? 'Đang lưu...' : editingGallery ? 'Lưu thay đổi' : 'Thêm mới'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Xóa ảnh"
        description="Bạn có chắc muốn xóa ảnh này? Hành động này không thể hoàn tác."
        confirmLabel="Xóa"
        variant="danger"
        loading={submitting}
      />
    </div>
  );
}
