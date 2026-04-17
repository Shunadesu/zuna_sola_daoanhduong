import { useState, useEffect } from 'react';
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
import api from '@/lib/api';

const quoteSchema = z.object({
  fullName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  phone: z.string().min(10, 'Số điện thoại không hợp lệ'),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

const HOTLINE = '0845228379';
const EMAIL = 'thanhpham.02092002@gmail.com';

export function ContactSection() {
  const { isSubmitting, isSubmitted, submitQuote, reset } = useQuoteStore();
  const [bannerImage, setBannerImage] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
  });

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await api.get('/api/banners');
        const banners = res.data.data;
        const contactBanner = banners.find(
          (b: any) => b.type === 'contact' || b.location === 'contact'
        );
        const fallback = banners[0];
        setBannerImage(contactBanner?.imageUrl || fallback?.imageUrl || '');
      } catch (err) {
        console.error('Failed to fetch banner:', err);
      }
    };
    fetchBanner();
  }, []);

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
    <section id="contact" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {bannerImage ? (
          <img
            src={bannerImage}
            alt="Contact background"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/80" />
      </div>

      <div className="container mx-auto px-4 relative z-10 h-full flex items-center py-16">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center w-full">
          {/* Left - Info */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm text-white/80 text-sm font-medium rounded-full mb-4">
              Liên hệ
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Đăng Ký Nhận Báo Giá
            </h2>
            <p className="text-lg text-white/70 mb-10">
              Điền thông tin để nhận tư vấn và báo giá chi tiết về dự án Sola Đảo Ảnh Dương
            </p>

            <div className="space-y-4">
              <motion.a
                href={`tel:${HOTLINE}`}
                className="flex items-center gap-4 p-5 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-white/20 transition-all group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-white/60 mb-1">Hotline</p>
                  <p className="text-xl font-bold text-white">{HOTLINE}</p>
                </div>
              </motion.a>

              <motion.a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-4 p-5 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-white/20 transition-all group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-white/60 mb-1">Email</p>
                  <p className="text-lg font-semibold text-white break-all">{EMAIL}</p>
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
            <div className="bg-white/10 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/20 shadow-2xl">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 bg-green-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Gửi Thành Công!</h3>
                  <p className="text-white/70 mb-8 max-w-sm mx-auto">
                    Cảm ơn bạn đã quan tâm đến dự án. Chúng tôi sẽ liên hệ trong thời gian sớm nhất.
                  </p>
                  <Button onClick={reset} variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    Gửi yêu cầu khác
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <Label htmlFor="fullName" className="text-white/90">Họ và tên *</Label>
                    <Input
                      id="fullName"
                      placeholder="Nhập họ và tên"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/50 focus:ring-white/30"
                      error={errors.fullName?.message}
                      {...register('fullName')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-white/90">Số điện thoại *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Nhập số điện thoại"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/50 focus:ring-white/30"
                      error={errors.phone?.message}
                      {...register('phone')}
                    />
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

                  <p className="text-xs text-center text-white/50">
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
