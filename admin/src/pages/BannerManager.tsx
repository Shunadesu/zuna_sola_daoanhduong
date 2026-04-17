import { useState, useEffect, useMemo, useRef } from 'react';
import { bannerApi, uploadApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { SkeletonCardList } from '@/components/ui/Skeleton';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import {
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Search,
  X,
  Upload,
  Loader2,
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

const PAGE_SIZE = 6;

export default function BannerManager() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [filterActive, setFilterActive] = useState<string>('all');

  const [formData, setFormData] = useState<BannerFormData>({
    title: '',
    subtitle: '',
    imageUrl: '',
    linkUrl: '',
    isActive: true,
    sortOrder: 0,
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageDragOver, setImageDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const filtered = useMemo(() => {
    let result = banners;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) => b.title.toLowerCase().includes(q) || (b.subtitle || '').toLowerCase().includes(q)
      );
    }
    if (filterActive !== 'all') {
      result = result.filter((b) => b.isActive === (filterActive === 'active'));
    }
    return result;
  }, [banners, search, filterActive]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [search, filterActive]);

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <SkeletonCardList count={1} />
          </div>
        </div>
        <SkeletonCardList count={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Quản lý Banner</h2>
          <p className="text-muted-foreground">Quản lý banner hiển thị trên trang chủ</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setEditingBanner(null);
            setShowModal(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm Banner
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
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

      {/* Banner Grid */}
      {paginated.length === 0 ? (
        <EmptyState
          variant={search ? 'no-results' : 'default'}
          title={search ? 'Không tìm thấy banner' : 'Chưa có banner nào'}
          description={
            search
              ? `Không có banner nào phù hợp với "${search}"`
              : 'Bắt đầu bằng cách thêm banner mới.'
          }
          action={
            !search
              ? () => {
                  resetForm();
                  setEditingBanner(null);
                  setShowModal(true);
                }
              : undefined
          }
          actionLabel={!search ? 'Thêm Banner' : undefined}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginated.map((banner) => (
              <div
                key={banner._id}
                className="bg-card rounded-xl border overflow-hidden group hover:shadow-md transition-shadow"
              >
                <div className="aspect-video relative bg-muted">
                  {banner.imageUrl ? (
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  {!banner.isActive && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded text-sm font-medium">
                        Đã ẩn
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold truncate">{banner.title}</h3>
                  {banner.subtitle && (
                    <p className="text-sm text-muted-foreground truncate mt-0.5">
                      {banner.subtitle}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-muted-foreground">
                      Thứ tự: {banner.sortOrder}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(banner)}
                        aria-label="Sửa banner"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(banner._id)}
                        className="text-destructive hover:text-destructive"
                        aria-label="Xóa banner"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Form Modal */}
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

          <div className="space-y-2">
            <Label>Hình ảnh</Label>
            <div
              className={`
                relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
                ${imageDragOver ? 'border-primary btn-gold-shimmer /5' : 'border-muted-foreground/25 hover:border-muted-foreground/50'}
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
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Đang lưu...' : editingBanner ? 'Lưu thay đổi' : 'Thêm mới'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
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
