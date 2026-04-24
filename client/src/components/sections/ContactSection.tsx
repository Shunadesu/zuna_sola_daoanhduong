import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, CheckCircle, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { useQuoteStore } from '@/store';
import toast from 'react-hot-toast';

const quoteSchema = z.object({
  fullName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  phone: z.string().min(10, 'Số điện thoại không hợp lệ'),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  apartment: z.string().optional(),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

const PROJECT_NAME = 'Biệt Thự Sola Đảo Ảnh Dương';
const PHONE = '0845 228 379';
const PHONE_RAW = '0845228379';
const EMAIL = 'thanhpham.02092002@gmail.com';

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
    <section id="contact" className="relative min-h-screen flex items-center overflow-hidden bg-gray-50">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-white via-gray-50 to-amber-50/20" />

      <div className="container mx-auto px-4 relative z-10 h-full flex items-center py-16">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center w-full">
          {/* Left - Info */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              Liên hệ
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Đăng Ký Nhận Báo Giá
            </h2>
            <p className="text-lg text-gray-600 mb-10">
              Điền thông tin để nhận tư vấn và báo giá chi tiết về dự án {PROJECT_NAME}
            </p>

            <div className="space-y-4">
              <motion.a
                href={`tel:${PHONE_RAW}`}
                className="flex items-center gap-4 p-5 bg-white rounded-2xl hover:bg-gray-50 transition-all group shadow-sm border border-gray-100"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Hotline</p>
                  <p className="text-xl font-bold text-gray-900">{PHONE}</p>
                </div>
              </motion.a>

              <motion.a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-4 p-5 bg-white rounded-2xl hover:bg-gray-50 transition-all group shadow-sm border border-gray-100"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-lg font-semibold text-gray-900 break-all">{EMAIL}</p>
                </div>
              </motion.a>
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-lg">
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
                  <Button onClick={reset} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                    Gửi yêu cầu khác
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <Label htmlFor="fullName" className="text-gray-700 font-medium">Họ và tên *</Label>
                    <Input
                      id="fullName"
                      placeholder="Nhập họ và tên"
                      className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-primary/20"
                      error={errors.fullName?.message}
                      {...register('fullName')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-gray-700 font-medium">Số điện thoại *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Nhập số điện thoại"
                      className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-primary/20"
                      error={errors.phone?.message}
                      {...register('phone')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gray-700 font-medium">Email (tuỳ chọn)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Nhập email của bạn"
                      className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-primary/20"
                      error={errors.email?.message}
                      {...register('email')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="apartment" className="text-gray-700 font-medium">Căn hộ quan tâm</Label>
                    <select
                      id="apartment"
                      {...register('apartment')}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-primary/20 outline-none transition-all"
                    >
                      <option value="">-- Chọn loại căn hộ --</option>
                      <option value="biệt thự song lập">Biệt thự song lập</option>
                      <option value="biệt thự đơn lập">Biệt thự đơn lập</option>
                      <option value="nhà phố liền kề">Nhà phố liền kề</option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white border-0"
                    size="lg"
                    loading={isSubmitting}
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Gửi Yêu Cầu
                  </Button>

                  <p className="text-xs text-center text-gray-500">
                    Bằng việc gửi yêu cầu, bạn đồng ý với chính sách bảo mật của chúng tôi.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
