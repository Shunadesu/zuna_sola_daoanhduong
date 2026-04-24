import { lazy, Suspense, useState, useEffect } from 'react';
import { sellerApi, uploadApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useToast } from '@/components/ui/Toast';
import { ImageInput } from '@/components/ui/ImageInput';
import {
  UserCircle,
  Save,
  Loader2,
} from 'lucide-react';

const ReactQuill = lazy(() => import('react-quill'));

interface FormData {
  name: string;
  title: string;
  phone: string;
  zalo: string;
  avatar: string;
  description: string;
  intro: string;
}

export default function SellerManager() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    title: '',
    phone: '',
    zalo: '',
    avatar: '',
    description: '',
    intro: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const response = await sellerApi.get();
      const data = response.data.data;
      setFormData({
        name: data.name || '',
        title: data.title || '',
        phone: data.phone || '',
        zalo: data.zalo || '',
        avatar: data.avatar || '',
        description: data.description || '',
        intro: data.intro || '',
      });
    } catch {
      toast({ type: 'error', title: 'Lỗi', description: 'Không thể tải cấu hình.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await sellerApi.update(formData);
      toast({ type: 'success', title: 'Thành công', description: 'Cấu hình đã được lưu.' });
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Không thể lưu cấu hình.';
      toast({ type: 'error', title: 'Lỗi', description: msg });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      const response = await uploadApi.uploadImage(file);
      const url = response.data.data.url as string;
      setFormData((prev) => ({ ...prev, avatar: url }));
      toast({ type: 'success', title: 'Thành công', description: 'Avatar đã được tải lên.' });
    } catch {
      toast({ type: 'error', title: 'Lỗi', description: 'Không thể tải avatar lên.' });
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      [{ size: ['11px', '12px', '14px', '16px', '18px', '20px', false] }],
      ['clean'],
    ],
  };

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link',
    'size',
  ];

  // Register custom font sizes for Quill
  useEffect(() => {
    const Quill = (window as any).Quill;
    if (!Quill) return;

    const SizeStyle = Quill.import('attributors/style/size');
    SizeStyle.whitelist = ['11px', '12px', '14px', '16px', '18px', '20px'];
    Quill.register(SizeStyle, true);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse bg-muted rounded" />
        <div className="h-4 w-72 animate-pulse bg-muted rounded" />
        <div className="bg-card rounded-xl border p-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <UserCircle className="w-6 h-6" />
          Thông tin Seller
        </h2>
        <p className="text-muted-foreground mt-1">
          Quản lý thông tin người bán hiển thị trên trang chủ
        </p>
      </div>

      

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-card rounded-xl border p-6 space-y-5">
        <ImageInput
          value={formData.avatar}
          onChange={(url) => setFormData((prev) => ({ ...prev, avatar: url }))}
          onUpload={handleAvatarUpload}
          label="Avatar"
          hint="Hình vuông, kích thước tối thiểu 200x200px"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Họ tên</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Ví dụ: Nguyễn Đức Thắng"
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Chức danh</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Ví dụ: Chuyên viên tư vấn"
              disabled={isSaving}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="Ví dụ: 0845 228 379"
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zalo">Zalo</Label>
            <Input
              id="zalo"
              value={formData.zalo}
              onChange={(e) => setFormData((prev) => ({ ...prev, zalo: e.target.value }))}
              placeholder="Ví dụ: 0845228379"
              disabled={isSaving}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Mô tả ngắn</Label>
          <Suspense fallback={<div className="h-32 border rounded-md animate-pulse bg-muted" />}>
            <ReactQuill
              value={formData.description}
              onChange={(value: string) => setFormData((prev) => ({ ...prev, description: value }))}
              modules={quillModules}
              formats={quillFormats}
              theme="snow"
              placeholder="Mô tả ngắn về seller (hiển thị bên dưới tên trong card)"
            />
          </Suspense>
        </div>

        <div className="space-y-2">
          <Label>Giới thiệu dài</Label>
          <Suspense fallback={<div className="h-48 border rounded-md animate-pulse bg-muted" />}>
            <ReactQuill
              value={formData.intro}
              onChange={(value: string) => setFormData((prev) => ({ ...prev, intro: value }))}
              modules={quillModules}
              formats={quillFormats}
              theme="snow"
              placeholder="Bài viết giới thiệu dài về seller, kinh nghiệm, thành tựu..."
            />
          </Suspense>
        </div>

        <div className="flex items-center gap-3 pt-2 border-t">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Lưu thay đổi
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
