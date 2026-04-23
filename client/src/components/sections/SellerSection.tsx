import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { sellerApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, Star, Award, Clock } from 'lucide-react';

interface SellerInfo {
  name: string;
  title: string;
  phone: string;
  zalo: string;
  avatar: string;
  description: string;
  intro: string;
}

const DEFAULT_SELLER: SellerInfo = {
  name: '',
  title: '',
  phone: '',
  zalo: '',
  avatar: '',
  description: '',
  intro: '',
};

function renderQuillContent(html: string) {
  if (!html) return null;
  return (
    <div
      className="[&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_a]:text-primary [&_a]:underline [&_strong]:font-semibold [&_em]:italic"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function SellerSection() {
  const [seller, setSeller] = useState<SellerInfo>(DEFAULT_SELLER);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSeller();
  }, []);

  const fetchSeller = async () => {
    try {
      const response = await sellerApi.get();
      const data = response.data?.data;
      if (data) {
        setSeller({
          name: data.name || '',
          title: data.title || '',
          phone: data.phone || '',
          zalo: data.zalo || '',
          avatar: data.avatar || '',
          description: data.description || '',
          intro: data.intro || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch seller info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 max-w-5xl mx-auto">
            <div className="lg:col-span-7 space-y-4 animate-pulse">
              <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-4 w-4/6 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
            <div className="lg:col-span-3 space-y-4 animate-pulse">
              <div className="w-full aspect-[9/12] rounded-2xl bg-slate-200 dark:bg-slate-700 overflow-hidden" />
              <div className="h-6 w-40 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-4 w-56 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!seller.name && !seller.phone && !seller.zalo) {
    return null;
  }

  // Build Person schema for seller - Google loves this for phone discovery
  const personSchema = seller.phone ? {
    '@context': 'https://schema.org',
    '@type': 'Person',
    'name': seller.name || 'Chuyên viên tư vấn Sola Global City',
    'jobTitle': seller.title || 'Chuyên viên tư vấn bất động sản',
    'description': seller.description ? seller.description.replace(/<[^>]*>/g, '') : 'Chuyên viên tư vấn dự án Biệt Thự Sola Đảo Ảnh Dương',
    'telephone': seller.phone.startsWith('0') ? `+84-${seller.phone.slice(1).replace(/\s/g, '')}` : seller.phone,
    'email': 'thanhpham.02092002@gmail.com',
    'image': seller.avatar || undefined,
    'worksFor': {
      '@type': 'Organization',
      'name': 'Biệt Thự Sola Đảo Ảnh Dương - Sola Global City',
      'url': 'https://soladaoanhduong.nthanhproperty.fun'
    },
    'areaServed': {
      '@type': 'Place',
      'name': 'Quận 2, TP. Hồ Chí Minh'
    }
  } : null;

  return (
    <>
      {/* SEO: Person Schema for seller phone */}
      <Helmet>
        {personSchema && (
          <script type="application/ld+json">
            {JSON.stringify(personSchema)}
          </script>
        )}
      </Helmet>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto"
          >
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 lg:gap-8 items-start">

              {/* === LEFT: Giới thiệu dài (7/10) === */}
              <div className="lg:col-span-7">
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 lg:p-8 shadow-lg">
                  {/* Header */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Giới thiệu về {seller.name || 'Biệt Thự Sola Đảo Ảnh Dương'}
                    </h2>
                    <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full" />
                  </div>

                  {/* Stats badges */}
                  <div className="flex flex-wrap gap-3 mb-8">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 rounded-lg text-xs font-semibold shadow-sm">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      Chuyên viên hàng đầu
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 rounded-lg text-xs font-semibold shadow-sm">
                      <Award className="w-3.5 h-3.5" />
                      +5 năm kinh nghiệm
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 rounded-lg text-xs font-semibold shadow-sm">
                      <Clock className="w-3.5 h-3.5" />
                      Hỗ trợ 24/7
                    </div>
                  </div>

                  {/* Intro content from Quill */}
                  {seller.intro ? (
                    renderQuillContent(seller.intro)
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm italic">Chưa có nội dung giới thiệu.</p>
                      <p className="text-xs mt-1">Admin có thể thêm nội dung trong trang quản lý.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* === RIGHT: Seller Card (3/10) === */}
              <div className="lg:col-span-3">
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
                  {/* Avatar */}
                  <div className="w-full aspect-[9/12] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 overflow-hidden relative">
                    {seller.avatar ? (
                      <img
                        src={seller.avatar}
                        alt={seller.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl font-bold text-slate-300 dark:text-slate-600">
                          {seller.name ? seller.name.charAt(0).toUpperCase() : '?'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-foreground mb-0.5">
                      {seller.name || 'Chưa có tên'}
                    </h3>
                    {seller.title && (
                      <p className="text-sm text-muted-foreground mb-4">{seller.title}</p>
                    )}

                    {/* Description from Quill */}
                    {seller.description && renderQuillContent(seller.description)}

                    {/* SEO-optimized phone section */}
                    {seller.phone && (
                      <div itemScope itemType="https://schema.org/LocalBusiness" className="hidden">
                        <meta itemProp="name" content={seller.name || 'Biệt Thự Sola Đảo Ảnh Dương'} />
                        <meta itemProp="telephone" content={seller.phone} />
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="flex flex-col gap-2.5 mt-4">
                      {seller.phone && (
                        <a
                          href={`tel:${seller.phone.replace(/\s/g, '')}`}
                          className="btn-gold-shimmer flex items-center justify-center gap-2 text-white px-5 py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md"
                          title={`Liên hệ ngay: ${seller.phone}`}
                        >
                          <Phone className="w-4 h-4" />
                          <span className="text-sm font-medium">{seller.phone}</span>
                        </a>
                      )}
                      {seller.zalo && (
                        <a
                          href={`https://zalo.me/${seller.zalo.replace(/\s/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0068ff] hover:bg-[#0052cc] text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Chat Zalo ngay
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
