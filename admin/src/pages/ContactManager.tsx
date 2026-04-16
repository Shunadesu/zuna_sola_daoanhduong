import { useState, useEffect, useMemo } from 'react';
import { contactApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { SkeletonTable } from '@/components/ui/Skeleton';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { Badge } from '@/components/ui/Badge';
import {
  Plus,
  Pencil,
  Trash2,
  Phone,
  MessageCircle,
  Facebook,
  FileText,
  Search,
  X,
} from 'lucide-react';

type ContactType = 'phone' | 'whatsapp' | 'zalo' | 'facebook' | 'quote';

interface Contact {
  _id: string;
  type: ContactType;
  label: string;
  value: string;
  icon: string;
  isActive: boolean;
  sortOrder: number;
}

const contactIcons: Record<ContactType, React.ReactNode> = {
  phone: <Phone className="w-4 h-4" />,
  whatsapp: <MessageCircle className="w-4 h-4" />,
  zalo: <span className="text-xs font-bold">Zalo</span>,
  facebook: <Facebook className="w-4 h-4" />,
  quote: <FileText className="w-4 h-4" />,
};

const contactTypeLabels: Record<ContactType, string> = {
  phone: 'Điện thoại',
  whatsapp: 'WhatsApp',
  zalo: 'Zalo',
  facebook: 'Facebook',
  quote: 'Báo giá',
};

const PAGE_SIZE = 10;

export default function ContactManager() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [formData, setFormData] = useState({
    type: 'phone' as ContactType,
    label: '',
    value: '',
    icon: '',
    isActive: true,
    sortOrder: 0,
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await contactApi.getAll();
      setContacts(response.data.data);
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Không thể tải danh sách liên hệ.';
      toast({ type: 'error', title: 'Lỗi', description: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return contacts;
    const q = search.toLowerCase();
    return contacts.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.value.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q)
    );
  }, [contacts, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => { setPage(1); }, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingContact) {
        await contactApi.update(editingContact._id, formData);
        toast({ type: 'success', title: 'Thành công', description: 'Liên hệ đã được cập nhật.' });
      } else {
        await contactApi.create(formData);
        toast({ type: 'success', title: 'Thành công', description: 'Liên hệ mới đã được tạo.' });
      }
      setShowModal(false);
      setEditingContact(null);
      resetForm();
      fetchContacts();
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Không thể lưu liên hệ.';
      toast({ type: 'error', title: 'Lỗi', description: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      type: contact.type,
      label: contact.label,
      value: contact.value,
      icon: contact.icon || '',
      isActive: contact.isActive,
      sortOrder: contact.sortOrder,
    });
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSubmitting(true);
    try {
      await contactApi.delete(deleteId);
      toast({ type: 'success', title: 'Thành công', description: 'Liên hệ đã được xóa.' });
      setDeleteId(null);
      fetchContacts();
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Không thể xóa liên hệ.';
      toast({ type: 'error', title: 'Lỗi', description: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ type: 'phone', label: '', value: '', icon: '', isActive: true, sortOrder: 0 });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonTable rows={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Quản lý Liên hệ</h2>
          <p className="text-muted-foreground">Quản lý các liên kết liên hệ trên trang web</p>
        </div>
        <Button
          onClick={() => { resetForm(); setEditingContact(null); setShowModal(true); }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm Liên hệ
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm theo nhãn, giá trị, loại..."
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

      {/* Table */}
      {paginated.length === 0 ? (
        <EmptyState
          variant={search ? 'no-results' : 'default'}
          title={search ? 'Không tìm thấy liên hệ' : 'Chưa có liên hệ nào'}
          description={search ? `Không có liên hệ nào phù hợp với "${search}"` : 'Bắt đầu bằng cách thêm liên hệ mới.'}
          action={!search ? () => { resetForm(); setEditingContact(null); setShowModal(true); } : undefined}
          actionLabel={!search ? 'Thêm Liên hệ' : undefined}
        />
      ) : (
        <>
          <div className="bg-card rounded-xl border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Icon</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Loại</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nhãn</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Giá trị</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Thứ tự</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Trạng thái</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginated.map((contact) => (
                    <tr key={contact._id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary">
                          {contactIcons[contact.type]}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium">{contactTypeLabels[contact.type]}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm">{contact.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-muted-foreground truncate max-w-[200px] block">
                          {contact.value}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm">{contact.sortOrder}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={contact.isActive ? 'success' : 'secondary'}>
                          {contact.isActive ? 'Hiển thị' : 'Ẩn'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(contact)} aria-label="Sửa">
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(contact._id)}
                            className="text-destructive hover:text-destructive"
                            aria-label="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {/* Form Modal */}
      <Modal
        open={showModal}
        onClose={() => !submitting && setShowModal(false)}
        title={editingContact ? 'Sửa Liên hệ' : 'Thêm Liên hệ'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Loại liên hệ</Label>
            <Select
              value={formData.type}
              onChange={(v) => setFormData({ ...formData, type: v as ContactType })}
              options={[
                { value: 'phone', label: 'Điện thoại' },
                { value: 'whatsapp', label: 'WhatsApp' },
                { value: 'zalo', label: 'Zalo' },
                { value: 'facebook', label: 'Facebook' },
                { value: 'quote', label: 'Báo giá' },
              ]}
              disabled={submitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="label">Nhãn hiển thị</Label>
            <Input
              id="label"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="Ví dụ: Hotline, Zalo"
              required
              disabled={submitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">
              {formData.type === 'quote' ? 'Giá trị' : 'Số điện thoại / URL'}
            </Label>
            <Input
              id="value"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              placeholder={
                formData.type === 'quote'
                  ? '#quote'
                  : formData.type === 'facebook'
                  ? 'https://facebook.com/...'
                  : '0909123456'
              }
              required
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
              {submitting ? 'Đang lưu...' : editingContact ? 'Lưu thay đổi' : 'Thêm mới'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Xóa Liên hệ"
        description="Bạn có chắc muốn xóa liên hệ này? Hành động này không thể hoàn tác."
        confirmLabel="Xóa"
        variant="danger"
        loading={submitting}
      />
    </div>
  );
}
