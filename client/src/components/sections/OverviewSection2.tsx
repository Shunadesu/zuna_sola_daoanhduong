import { motion } from 'framer-motion';

export function OverviewSection2() {
  return (
    <section id="overview" className="w-full">
      <div className="w-full overflow-hidden bg-gray-100">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full"
        >
          <img
            src="https://masterisehomese.vn/wp-content/uploads/2025/11/PHOI-CANH-NGOAI-THAT-BIET-THU-SOLA-GLOBALCITYSONG-LAP-4-scaled.png"
            alt="Phối cảnh ngoại thất biệt thự Sola Global City"
            className="w-full h-auto object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
