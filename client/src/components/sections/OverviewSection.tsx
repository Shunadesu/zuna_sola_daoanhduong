import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { overviewApi } from '@/lib/api';

interface Overview {
  _id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  isActive: boolean;
  sortOrder: number;
}

export function OverviewSection() {
  const [overviews, setOverviews] = useState<Overview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    overviewApi.getActive()
      .then((res) => {
        if (res.data?.data) {
          setOverviews(res.data.data);
        }
      })
      .catch((err) => {
        console.error('[OverviewSection] Error:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="overview" className="w-full bg-gray-100">
        <div className="w-full h-[50vh] md:h-[70vh] flex items-center justify-center">
          <span className="text-gray-500">Đang tải...</span>
        </div>
      </section>
    );
  }

  if (overviews.length === 0) {
    return (
      <section id="overview" className="w-full bg-gray-100">
        <div className="w-full h-[50vh] md:h-[70vh] flex items-center justify-center">
          <span className="text-gray-500">Chưa có tổng thể</span>
        </div>
      </section>
    );
  }

  return (
    <section id="overview" className="w-full">
      <div className="flex flex-col gap-0">
        {overviews.map((item, index) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="w-full h-auto overflow-hidden bg-gray-200"
          >
            <img
              src={item.imageUrl}
              alt={item.title || `Hình ảnh tổng quan dự án Sola Global City Quận 2 - Biệt thự cao cấp ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
              width="1920"
              height="1080"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
