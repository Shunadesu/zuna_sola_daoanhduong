import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, CheckCircle, Phone, Mail, MapPin } from 'lucide-react';
import { FadeInUp } from '@/components/animated';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { Select } from '@/components/ui';
import { Label } from '@/components/ui';
import { useQuoteStore } from '@/store';
import toast from 'react-hot-toast';

const quoteSchema = z.object({
  fullName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  phone: z.string().min(10, 'Số điện thoại không hợp lệ'),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  apartment: z.string().optional(),
  message: z.string().optional(),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

const apartmentOptions = [
  { value: '', label: 'Chọn loại căn hộ' },
  { value: '1-phong-ngu', label: 'Căn hộ 1 phòng ngủ' },
  { value: '2-phong-ngu', label: 'Căn hộ 2 phòng ngủ' },
  { value: '3-phong-ngu', label: 'Căn hộ 3 phòng ngủ' },
  { value: 'penthouse', label: 'Penthouse' },
];

export function ContactSection() {
  const { isSubmitting, isSubmitted, submitQuote, reset } = useQuoteStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
  });

  const onSubmit = async (data: QuoteFormData) => {
    const success = await submitQuote(data);
    if (success) {
      toast.success('Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
      resetForm();
    } else {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left - Info */}
          <div>
            <FadeInUp>
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                Liên hệ
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Đăng Ký Nhận Báo Giá
              </h2>
              <p className="text-lg text-gray-600 mb-10">
                Điền thông tin để nhận tư vấn và báo giá chi tiết về dự án Sola Đảo Ảnh Dương
              </p>
            </FadeInUp>

            <FadeInUp delay={0.2}>
              <div className="space-y-4">
                <ContactInfoItem
                  icon={<Phone className="w-5 h-5" />}
                  title="Hotline"
                  value="0909 123 456"
                  href="tel:0909123456"
                />
                <ContactInfoItem
                  icon={<Mail className="w-5 h-5" />}
                  title="Email"
                  value="info@sola.vn"
                  href="mailto:info@sola.vn"
                />
                <ContactInfoItem
                  icon={<MapPin className="w-5 h-5" />}
                  title="Địa chỉ"
                  value="Đường Đại Lộ Võ Văn Kiệt, Quận 7, TP. HCM"
                />
              </div>
            </FadeInUp>
          </div>

          {/* Right - Form */}
          <FadeInUp delay={0.3}>
            <div className="bg-white p-6 md:p-10 rounded-2xl shadow-soft-lg">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Gửi Thành Công!</h3>
                  <p className="text-gray-600 mb-8 max-w-sm mx-auto">
                    Cảm ơn bạn đã quan tâm đến dự án. Chúng tôi sẽ liên hệ trong thời gian sớm nhất.
                  </p>
                  <Button onClick={reset} variant="outline">
                    Gửi yêu cầu khác
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <Label htmlFor="fullName">Họ và tên *</Label>
                    <Input
                      id="fullName"
                      placeholder="Nhập họ và tên"
                      error={errors.fullName?.message}
                      {...register('fullName')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Nhập số điện thoại"
                      error={errors.phone?.message}
                      {...register('phone')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Nhập email (tùy chọn)"
                      error={errors.email?.message}
                      {...register('email')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="apartment">Căn hộ quan tâm</Label>
                    <Select
                      id="apartment"
                      options={apartmentOptions}
                      error={errors.apartment?.message}
                      {...register('apartment')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Lời nhắn</Label>
                    <Textarea
                      id="message"
                      rows={4}
                      placeholder="Nhập lời nhắn của bạn (tùy chọn)"
                      {...register('message')}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    loading={isSubmitting}
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Gửi Yêu Cầu
                  </Button>

                  <p className="text-xs text-center text-gray-400">
                    Bằng việc gửi yêu cầu, bạn đồng ý với{' '}
                    <a href="#contact" className="text-primary hover:underline">
                      chính sách bảo mật
                    </a>{' '}
                    của chúng tôi.
                  </p>
                </form>
              )}
            </div>
          </FadeInUp>
        </div>
      </div>
    </section>
  );
}

function ContactInfoItem({
  icon,
  title,
  value,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 text-primary">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-0.5">{title}</p>
        {href ? (
          <a href={href} className="font-medium text-gray-900 hover:text-primary transition-colors">
            {value}
          </a>
        ) : (
          <p className="font-medium text-gray-900">{value}</p>
        )}
      </div>
    </div>
  );
}
