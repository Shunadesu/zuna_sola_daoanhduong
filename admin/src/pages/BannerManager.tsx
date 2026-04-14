import { useState, useEffect } from 'react';
import { bannerApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
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
  const [formData, setFormData] = useState<BannerFormData>({
    title: '',
    subtitle: '',
    imageUrl: '',
    linkUrl: '',
    isActive: true,
    sortOrder: 0,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await bannerApi.getAll();
      setBanners(response.data.data);
    } catch (error) {
      console.error('Failed to fetch banners:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBanner) {
        await bannerApi.update(editingBanner._id, formData);
      } else {
        await bannerApi.create(formData);
      }
      setShowModal(false);
      setEditingBanner(null);
      resetForm();
      fetchBanners();
    } catch (error) {
      console.error('Failed to save banner:', error);
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

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa banner này?')) return;
    try {
      await bannerApi.delete(id);
      fetchBanners();
    } catch (error) {
      console.error('Failed to delete banner:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      imageUrl: '',
      linkUrl: '',
      isActive: true,
      sortOrder: 0,
    });
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

      {/* Banner Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div
            key={banner._id}
            className="bg-card rounded-xl border overflow-hidden group"
          >
            <div className="aspect-video relative bg-muted">
              {banner.imageUrl ? (
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
              {!banner.isActive && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded text-sm">
                    Đã ẩn
                  </span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold truncate">{banner.title}</h3>
              {banner.subtitle && (
                <p className="text-sm text-muted-foreground truncate">
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
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(banner._id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                {editingBanner ? 'Sửa Banner' : 'Thêm Banner'}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowModal(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Phụ đề</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL Hình ảnh</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  placeholder="https://..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkUrl">Link (tùy chọn)</Label>
                <Input
                  id="linkUrl"
                  value={formData.linkUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, linkUrl: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sortOrder">Thứ tự</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sortOrder: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isActive">Trạng thái</Label>
                  <select
                    id="isActive"
                    value={formData.isActive ? 'true' : 'false'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isActive: e.target.value === 'true',
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="true">Hiển thị</option>
                    <option value="false">Ẩn</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </Button>
                <Button type="submit">
                  {editingBanner ? 'Lưu thay đổi' : 'Thêm mới'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
