import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, CheckCircle, Loader2 } from 'lucide-react';
import { FadeInUp } from '@/components/animated';
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
  message: z.string().optional(),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

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
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Info */}
          <div>
            <FadeInUp>
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                Liên hệ
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Đăng Ký Nhận Báo Giá
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Điền thông tin để nhận tư vấn và báo giá chi tiết về dự án Sola Đảo Ảnh Dương
              </p>
            </FadeInUp>

            <FadeInUp delay={0.2}>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📞</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Hotline</h3>
                    <p className="text-gray-600">0909 123 456</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">✉️</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">info@sola.vn</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Địa chỉ</h3>
                    <p className="text-gray-600">Đường Đại Lộ Võ Văn Kiệt, Quận 7, TP. HCM</p>
                  </div>
                </div>
              </div>
            </FadeInUp>
          </div>

          {/* Right - Form */}
          <FadeInUp delay={0.3}>
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Gửi Thành Công!</h3>
                  <p className="text-gray-600 mb-6">
                    Cảm ơn bạn đã quan tâm đến dự án. Chúng tôi sẽ liên hệ trong thời gian sớm nhất.
                  </p>
                  <Button onClick={reset} variant="outline">
                    Gửi yêu cầu khác
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <Label htmlFor="fullName">Họ và tên *</Label>
                    <Input
                      id="fullName"
                      placeholder="Nhập họ và tên"
                      {...register('fullName')}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-red-500 mt-1">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input
                      id="phone"
                      placeholder="Nhập số điện thoại"
                      {...register('phone')}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Nhập email (tùy chọn)"
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="apartment">Căn hộ quan tâm</Label>
                    <select
                      id="apartment"
                      className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
                      {...register('apartment')}
                    >
                      <option value="">Chọn loại căn hộ</option>
                      <option value="1-phong-ngu">Căn hộ 1 phòng ngủ</option>
                      <option value="2-phong-ngu">Căn hộ 2 phòng ngủ</option>
                      <option value="3-phong-ngu">Căn hộ 3 phòng ngủ</option>
                      <option value="penthouse">Penthouse</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="message">Lời nhắn</Label>
                    <textarea
                      id="message"
                      rows={4}
                      placeholder="Nhập lời nhắn của bạn (tùy chọn)"
                      className="flex w-full rounded-lg border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...register('message')}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Gửi Yêu Cầu
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </FadeInUp>
        </div>
      </div>
    </section>
  );
}
