import { useState, useEffect } from 'react';
import { contactApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
  Plus,
  Pencil,
  Trash2,
  Phone,
  MessageCircle,
  Facebook,
  FileText,
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

interface ContactFormData {
  type: ContactType;
  label: string;
  value: string;
  icon: string;
  isActive: boolean;
  sortOrder: number;
}

const contactIcons: Record<ContactType, React.ReactNode> = {
  phone: <Phone className="w-5 h-5" />,
  whatsapp: <MessageCircle className="w-5 h-5" />,
  zalo: <span className="text-sm font-bold">Zalo</span>,
  facebook: <Facebook className="w-5 h-5" />,
  quote: <FileText className="w-5 h-5" />,
};

const contactTypeOptions = [
  { value: 'phone', label: 'Điện thoại' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'zalo', label: 'Zalo' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'quote', label: 'Báo giá' },
];

export default function ContactManager() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState<ContactFormData>({
    type: 'phone',
    label: '',
    value: '',
    icon: '',
    isActive: true,
    sortOrder: 0,
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await contactApi.getAll();
      setContacts(response.data.data);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingContact) {
        await contactApi.update(editingContact._id, formData);
      } else {
        await contactApi.create(formData);
      }
      setShowModal(false);
      setEditingContact(null);
      resetForm();
      fetchContacts();
    } catch (error) {
      console.error('Failed to save contact:', error);
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

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa liên hệ này?')) return;
    try {
      await contactApi.delete(id);
      fetchContacts();
    } catch (error) {
      console.error('Failed to delete contact:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'phone',
      label: '',
      value: '',
      icon: '',
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
          <h2 className="text-2xl font-bold">Quản lý Liên hệ</h2>
          <p className="text-muted-foreground">Quản lý các liên kết liên hệ trên trang web</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setEditingContact(null);
            setShowModal(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm Liên hệ
        </Button>
      </div>

      {/* Contact List */}
      <div className="bg-card rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Icon
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Loại
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Nhãn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Giá trị
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Thứ tự
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {contacts.map((contact) => (
              <tr key={contact._id} className="hover:bg-muted/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                    {contactIcons[contact.type]}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium capitalize">
                    {contact.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm">{contact.label}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-muted-foreground truncate max-w-xs block">
                    {contact.value}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm">{contact.sortOrder}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {contact.isActive ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Hiển thị
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Ẩn
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(contact)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(contact._id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {contacts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Chưa có liên hệ nào
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                {editingContact ? 'Sửa Liên hệ' : 'Thêm Liên hệ'}
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
                <Label htmlFor="type">Loại liên hệ</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as ContactType })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {contactTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="label">Nhãn hiển thị</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) =>
                    setFormData({ ...formData, label: e.target.value })
                  }
                  placeholder="Ví dụ: Hotline, Zalo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">
                  {formData.type === 'quote' ? 'Giá trị' : 'Số điện thoại / URL'}
                </Label>
                <Input
                  id="value"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value })
                  }
                  placeholder={
                    formData.type === 'quote'
                      ? '#quote'
                      : formData.type === 'facebook'
                      ? 'https://facebook.com/...'
                      : '0909123456'
                  }
                  required
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
                  {editingContact ? 'Lưu thay đổi' : 'Thêm mới'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
