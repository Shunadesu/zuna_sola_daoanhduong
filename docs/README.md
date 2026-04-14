# Website Căn Hộ Sola Đảo Ảnh Dương

Xây dựng trang web quảng cáo căn hộ Sola Đảo Ảnh Dương với MERN stack (MongoDB/Express/React/Node).

## Mục Lục

- [Công Nghệ Stack](#1-công-nghệ-stack)
- [Frontend - Landing Page Đẳng Cấp](#11-frontend-landing-page-đẳng-cấp)
- [Kiến Trúc Hệ Thống](#2-kiến-trúc-hệ-thống)
- [Cấu Trúc Database](#3-cấu-trúc-database-mongodb--mongoose)
- [Tính Năng Chính](#4-tính-năng-chính)
- [Analytics & Tracking](#5-analytics--tracking)
- [Telegram Bot Integration](#6-telegram-bot-integration)
- [API Endpoints](#7-api-endpoints)
- [SEO Chiến Lược](#8-seo-chiến-lược)
- [Cấu Trúc Thư Mục](#9-cấu-trúc-thư-mục)
- [Floating Contact Bar](#10-floating-contact-bar)
- [Image Optimization & Lazy Loading](#11-image-optimization--lazy-loading)
- [Animation Patterns - Framer Motion](#12-animation-patterns---framer-motion)
- [Chart cho Admin Dashboard](#13-chart-cho-admin-dashboard)
- [Deployment](#14-deployment)
- [Thứ Tự Triển Khai](#15-thứ-tự-triển-khai)

---

## 1. Công Nghệ Stack

### Frontend (React + Vite)

| Công nghệ | Mô tả |
|-----------|-------|
| React 18 + Vite | Framework với fast dev/build |
| TailwindCSS + shadcn/ui | UI library đẹp, responsive |
| Swiper.js | Carousel cho Hero Banner |
| react-icons | Bộ icons (Feather, Lucide, FontAwesome...) |
| Zustand | State management, tránh gọi API lặp |
| React Hook Form + Zod | Form handling và validation |
| Framer Motion | Animation cho transitions |
| React Router v6 | Routing |
| Axios | HTTP client với interceptors |
| @vercel/analytics | Analytics (page views, unique visitors) |

### Backend (Node.js + Express)

| Công nghệ | Mô tả |
|-----------|-------|
| Node.js 20 LTS | Runtime |
| Express.js | Framework |
| Mongoose | ODM cho MongoDB |
| MongoDB Atlas | Database (free tier 512MB) |
| JWT + bcrypt | Authentication |
| Visit Tracker | Analytics chi tiết (IP, referrer) |
| Telegram Bot API | Notifications real-time |

### SEO & Performance

| Công nghệ | Mô tả |
|-----------|-------|
| react-helmet-async | Meta tags |
| JSON-LD | Structured data RealEstateListing |
| Cloudinary/Imgix | Image optimization |
| Lazy loading | Core Web Vitals |

---

## 1.1 Frontend - Landing Page Đẳng Cấp

### Design Philosophy - Ảnh Hưởng từ Thị Trường BĐS Cao Cấp

Dựa trên nghiên cứu các landing page bất động sản cao cấp Việt Nam 2025 (Vinhomes, The Emerald Boulevard, Khải Hoàn Imperial...):

**Layout Modules:**
- Header navigation với sticky behavior và blur backdrop
- Hero section với parallax và video background option
- Section thông tin: Vị trí, Tiện ích, Mặt bằng, Chính sách
- CTAs rõ ràng: Đăng ký, Hotline, Zalo

**Visual Elements:**
- Hình ảnh phối cảnh 3D chuyên nghiệp
- Sơ đồ mặt bằng chi tiết
- Bảng so sánh dữ liệu dự án
- Tagline định vị cao cấp

### Frontend Stack - Animation & Optimization

| Công nghệ | Mô tả | Mục đích |
|-----------|-------|----------|
| **Framer Motion** | Scroll animations, parallax, transitions | UX mượt mà, engagement cao |
| **Swiper.js** | Hero carousel, gallery slider | Content nổi bật |
| **@studio-freight/react-lenis** | Smooth scroll | Scroll experience đẳng cấp |
| **vite-plugin-lqip** | Blur-up image placeholder | Load ảnh mượt, không layout shift |
| **Framer Motion + IntersectionObserver** | Scroll-triggered animations | Fade-in, reveal effects |
| **React Intersection Observer** | Lazy load images, sections | Performance, Core Web Vitals |

### Animation Patterns - Chi Tiết

#### 1. Scroll-Triggered Animations (whileInView)

```tsx
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

<motion.div
  variants={fadeInUp}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
>
  {/* Content */}
</motion.div>
```

#### 2. Staggered Children Animation

```tsx
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

<motion.div variants={containerVariants}>
  {[1,2,3].map(i => (
    <motion.div key={i} variants={itemVariants} />
  ))}
</motion.div>
```

#### 3. Parallax Effect

```tsx
import { useScroll, useTransform } from 'framer-motion';

const { scrollY } = useScroll();
const y = useTransform(scrollY, [0, 500], [0, 150]);

<motion.div style={{ y }}>
  <img src="/hero-bg.jpg" />
</motion.div>
```

#### 4. Number Counter Animation

```tsx
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';

function AnimatedNumber({ target }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, target, { duration: 2 });
    return controls.stop;
  }, [target]);

  return <motion.span>{rounded}</motion.span>;
}
```

#### 5. Image Reveal with Clip Path

```tsx
const imageVariants = {
  hidden: { clipPath: 'inset(100% 0 0 0)' },
  visible: {
    clipPath: 'inset(0% 0 0 0)',
    transition: { duration: 0.8, ease: 'easeOut' }
  }
};

<motion.img variants={imageVariants} src={src} />
```

#### 6. Smooth Scroll (Lenis)

```tsx
// src/lib/LenisProvider.tsx
import { ReactLenis } from '@studio-freight/react-lenis';

export function LenisProvider({ children }) {
  return (
    <ReactLenis root options={{ duration: 1.2, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
```

#### 7. Hover Scale + Glow Effect

```tsx
const cardHover = {
  rest: { scale: 1, boxShadow: '0 0 0 rgba(0,0,0,0)' },
  hover: {
    scale: 1.02,
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    transition: { duration: 0.3 }
  }
};

<motion.div variants={cardHover} whileHover="hover">
  {/* Card content */}
</motion.div>
```

### Image Optimization Chi Tiết

#### 1. Blur-Up with vite-plugin-lqip

```bash
npm install -D vite-plugin-lqip
```

```typescript
// vite.config.ts
import lqip from 'vite-plugin-lqip';

export default {
  plugins: [
    lqip({
      dir: './src/assets',
      quality: 20,
      scales: [1, 2]
    })
  ]
};
```

```tsx
// Usage
import backgroundImage from './hero.jpg?lqip';

<div
  className="bg-cover bg-center transition-opacity duration-500"
  style={{
    backgroundImage: `url("${backgroundImage.lqip}")`,
    opacity: isLoaded ? 1 : 0
  }}
/>
```

#### 2. Lazy Image Component

```tsx
import { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  blurHash?: string;
}

export function LazyImage({ src, alt, className, blurHash }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsInView(true); },
      { rootMargin: '200px', threshold: 0.1 }
    );
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Blur placeholder */}
      {blurHash && !isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      {/* Actual image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
}
```

#### 3. Responsive Image Sizes

```tsx
<LazyImage
  src={`${imageUrl}?w=800&q=80`}
  alt={alt}
  className="aspect-video"
  srcSet={`
    ${imageUrl}?w=400&q=80 400w,
    ${imageUrl}?w=800&q=80 800w,
    ${imageUrl}?w=1200&q=80 1200w
  `}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

### Hero Section Design

```tsx
// Sections: Hero, Vị Trí, Tiện Ích, Mặt Bằng, Chính Sách, Đăng Ký

const heroVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 }
  }
};

const slideUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
};
```

### Performance Metrics Target

| Metric | Target | Technique |
|--------|--------|-----------|
| LCP (Largest Contentful Paint) | < 2.5s | Blur-up images, preload fonts |
| FID (First Input Delay) | < 100ms | Code splitting, lazy routes |
| CLS (Cumulative Layout Shift) | < 0.1 | Aspect ratio boxes, skeleton |
| TTI (Time to Interactive) | < 3.8s | Bundle optimization |

### Mobile Optimization

```tsx
// Responsive animation variants
const mobileVariants = {
  desktop: { scale: 1, duration: 0.5 },
  mobile: { scale: 0.95, duration: 0.3 }
};

// Reduce motion for accessibility
const reducedMotion = useReducedMotion();

const animationConfig = {
  transition: reducedMotion ? { duration: 0 } : { duration: 0.6 },
  variants: reducedMotion ? {} : standardVariants
};
```

---

## 2. Kiến Trúc Hệ Thống

```mermaid
flowchart TB
    subgraph Client["Frontend - React (Vite)"]
        Public["Trang Public<br/>- Hero Swiper<br/>- Gallery<br/>- Form Báo Giá<br/>- Zustand Store<br/>- Vercel Analytics"]
    end

    subgraph Admin["Admin Panel - React (Vite)"]
        Dashboard["Dashboard<br/>- Stats Chart<br/>- Visit Analytics"]
        BannerManager["Banner Manager<br/>- CRUD + Drag-Drop"]
        ContactManager["Contact Manager<br/>- CRUD Contacts"]
        QuoteManager["Quote Manager<br/>- Xem + Update Status"]
        AdminLogin["Login Page"]
    end

    subgraph Server["Backend API - Express + Mongoose"]
        Auth["JWT Auth Middleware"]
        BannersAPI["Banners API"]
        QuotesAPI["Quotes API"]
        ContactsAPI["Contacts API"]
        VisitTracker["Visit Tracker<br/>- IP, User-Agent, Date"]
        TelegramBot["Telegram Bot<br/>- Notify New Quote<br/>- Notify New Visit"]
    end

    subgraph Database["MongoDB Atlas (Cloud)"]
        Banners["Banners Collection"]
        Quotes["Quotes Collection"]
        Contacts["Contacts Collection"]
        Visits["Visits Collection"]
        Admins["Admins Collection"]
    end

    Public -->|"GET Banners<br/>POST Quote| Server
    Public -->|"Track Visit| VisitTracker
    Dashboard -->|"GET Stats| Server
    BannerManager -->|"CRUD Banners| BannersAPI
    ContactManager -->|"CRUD Contacts| ContactsAPI
    QuoteManager -->|"CRUD Quotes| QuotesAPI
    AdminLogin -->|"JWT Auth| Auth

    BannersAPI --> Banners
    QuotesAPI --> Quotes
    ContactsAPI --> Contacts
    VisitTracker --> Visits
    Auth --> Admins

    TelegramBot -.->|"Notify| Admin["Telegram"]
```

---

## 3. Cấu Trúc Database (MongoDB + Mongoose)

### 3.1 Admin Model

```typescript
// server/src/models/Admin.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
}, { timestamps: true });

export const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);
```

### 3.2 Banner Model

```typescript
// server/src/models/Banner.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IBanner extends Document {
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema({
  title: { type: String, required: true },
  subtitle: String,
  imageUrl: { type: String, required: true },
  linkUrl: String,
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

export const Banner = mongoose.model<IBanner>('Banner', BannerSchema);
```

### 3.3 Quote Model

```typescript
// server/src/models/Quote.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IQuote extends Document {
  fullName: string;
  phone: string;
  email?: string;
  apartment?: string;
  message?: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const QuoteSchema = new Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,
  apartment: String,
  message: String,
  status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
}, { timestamps: true });

export const Quote = mongoose.model<IQuote>('Quote', QuoteSchema);
```

### 3.4 Contact Model

```typescript
// server/src/models/Contact.ts
import mongoose, { Schema, Document } from 'mongoose';

export type ContactType = 'phone' | 'whatsapp' | 'zalo' | 'facebook' | 'quote';

export interface IContact extends Document {
  type: ContactType;
  label: string;
  value: string;
  icon?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema({
  type: { type: String, enum: ['phone', 'whatsapp', 'zalo', 'facebook', 'quote'], required: true },
  label: { type: String, required: true },
  value: { type: String, required: true },
  icon: String,
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

export const Contact = mongoose.model<IContact>('Contact', ContactSchema);
```

### 3.5 Visit Model

```typescript
// server/src/models/Visit.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IVisit extends Document {
  ip: string;
  path: string;
  userAgent?: string;
  referrer?: string;
  createdAt: Date;
}

const VisitSchema = new Schema({
  ip: { type: String, required: true },
  path: { type: String, required: true },
  userAgent: String,
  referrer: String,
}, { timestamps: true });

export const Visit = mongoose.model<IVisit>('Visit', VisitSchema);
```

### 3.6 MongoDB Connection

```typescript
// server/src/config/db.config.ts
import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || '');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
```

---

## 4. Tính Năng Chính

### 4.1 Trang Public (Khách hàng)

| Tính năng | Mô tả |
|-----------|-------|
| **Hero Carousel** | Hiển thị banner động từ database, auto-play, responsive (Swiper.js) |
| **Giới thiệu dự án** | Section giới thiệu tổng quan căn hộ |
| **Hình ảnh/Video** | Gallery với lightbox, lazy loading |
| **Form Báo Giá** | Khách điền thông tin, gửi yêu cầu báo giá |
| **Floating Contact Bar** | Thanh contact cố định góc phải với icon: Phone, WhatsApp, Zalo, Facebook, Quote |

### 4.2 Trang Admin Dashboard

| Tính năng | Mô tả |
|-----------|-------|
| **Stats Cards** | Tổng số banner, tổng yêu cầu, lượt truy cập hôm nay |
| **Visit Chart** | Biểu đồ line thể hiện lượt truy cập theo ngày (7 ngày gần nhất) |
| **Quote Chart** | Biểu đồ pie thể hiện tỷ lệ trạng thái yêu cầu |
| **Recent Activity** | Danh sách hoạt động gần đây |

### 4.3 Trang Admin Quản lý

| Tính năng | Mô tả |
|-----------|-------|
| **Quản lý Banner** | CRUD banner với upload ảnh (drag-drop), preview, sắp xếp |
| **Quản lý Contact** | CRUD contact (phone, whatsapp, zalo, facebook, quote) |
| **Quản lý Yêu cầu** | Xem danh sách, filter theo trạng thái, cập nhật trạng thái |
| **Đăng nhập** | JWT auth cho admin |

---

## 5. Analytics & Tracking

### 5.1 Vercel Analytics (Frontend)

Cài đặt nhanh, không cần backend:

```bash
npm install @vercel/analytics
```

```tsx
// client/src/App.tsx
import { Analytics } from '@vercel/analytics/react'

function App() {
  return (
    <>
      <YourRoutes />
      <Analytics />
    </>
  )
}
```

**Tính năng:**
- Page views
- Unique visitors
- Session duration
- Real-time dashboard (Vercel dashboard)

### 5.2 Backend Visit Tracker (Chi tiết)

Middleware đếm lượt truy cập với chi tiết hơn:

```typescript
// server/src/services/visit.service.ts
interface VisitService {
  trackVisit(data: { ip: string; path: string; userAgent?: string; referrer?: string }): Promise<void>
  getDailyStats(days: number): Promise<{ date: string; count: number; uniqueVisitors: number }[]>
  getTotalVisits(): Promise<number>
  checkMilestone(): Promise<number | null>
}
```

**Tính năng:**
- IP tracking
- Referrer tracking
- Path tracking
- Telegram notify khi đạt mốc (100, 500, 1000...)

---

## 6. Telegram Bot Integration

### Cài đặt

```bash
# .env
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

### Message Format

```typescript
// Khi có yêu cầu báo giá mới
const quoteMessage = `
📩 *Yêu cầu báo giá mới*

👤 Họ tên: ${name}
📱 Điện thoại: ${phone}
📧 Email: ${email || 'Không có'}
🏠 Căn hộ: ${apartment || 'Chưa chọn'}
💬 Tin nhắn: ${message || 'Không có'}
⏰ Thời gian: ${new Date().toLocaleString('vi-VN')}
`

// Khi đạt mốc lượt truy cập
const milestoneMessage = `
🎉 *Mốc lượt truy cập mới!*

📊 Tổng lượt truy cập: *${total.toLocaleString('vi-VN')}*
🕐 Thời gian: ${new Date().toLocaleString('vi-VN')}
`
```

---

## 7. API Endpoints

### Authentication

```
POST   /api/auth/login          - Admin login
POST   /api/auth/verify         - Verify token
GET    /api/auth/me             - Get current admin info
```

### Banners (Public + Admin)

```
GET    /api/banners             - Get active banners (public)
GET    /api/admin/banners       - Get all banners (admin, protected)
POST   /api/admin/banners       - Create banner (admin, protected)
PUT    /api/admin/banners/:id   - Update banner (admin, protected)
DELETE /api/admin/banners/:id   - Delete banner (admin, protected)
```

### Quotes (Public + Admin)

```
POST   /api/quotes              - Submit quote request (public)
GET    /api/admin/quotes        - Get all quotes (admin, protected)
PUT    /api/admin/quotes/:id    - Update quote status (admin, protected)
```

### Contacts (Public + Admin)

```
GET    /api/contacts            - Get active contacts (public)
GET    /api/admin/contacts      - Get all contacts (admin, protected)
POST   /api/admin/contacts      - Create contact (admin, protected)
PUT    /api/admin/contacts/:id  - Update contact (admin, protected)
DELETE /api/admin/contacts/:id  - Delete contact (admin, protected)
```

### Visits (Tracking)

```
POST   /api/track               - Track page visit (public)
GET    /api/admin/stats         - Get visit stats (admin, protected)
GET    /api/admin/stats/daily   - Get daily stats for chart (admin, protected)
GET    /api/admin/stats/quote-status - Get quote status distribution (admin, protected)
```

---

## 8. SEO Chiến Lược

### On-Page SEO

- **Meta Tags**: Title, description, og:image, twitter:card
- **Schema.org**: RealEstateListing JSON-LD
- **Semantic HTML**: article, section, nav, header, footer
- **Alt Text**: Tất cả ảnh có mô tả

### Technical SEO

- **Sitemap.xml**: Auto-generate với tất cả pages
- **robots.txt**: Cấu hình crawling
- **Canonical URL**: Tránh duplicate content
- **Performance**: Image lazy loading, font preload, code splitting, CDN

### Content SEO

- **Keywords**: "căn hộ Sola Đảo Ảnh Dương", "bất động sản Đảo Ảnh Dương"
- **Local SEO**: Google Business Profile integration
- **Page Speed**: Target < 3s load time (Core Web Vitals)

---

## 9. Cấu Trúc Thư Mục

```
/apartment-landing/
│
├── /packages/
│   └── /constants/              # Shared constants, types
│       ├── src/
│       │   ├── types.ts
│       │   └── index.ts
│       └── package.json
│
├── /client/                     # Public Frontend
│   ├── src/
│   │   ├── /components/
│   │   │   ├── /ui/            # shadcn/ui components
│   │   │   ├── /public/        # HeroBanner, Gallery, FloatingContactBar
│   │   │   ├── /sections/       # Landing sections (Hero, About, Location, Amenities...)
│   │   │   ├── /layout/        # Header, Footer, SmoothScroll
│   │   │   └── /animated/      # Animated wrappers (FadeIn, SlideIn, Parallax...)
│   │   ├── /pages/
│   │   │   └── Home.tsx
│   │   ├── /hooks/
│   │   ├── /lib/
│   │   │   ├── api.ts          # Axios instance
│   │   │   └── utils.ts        # Helpers (formatPrice, cn...)
│   │   ├── /store/             # Zustand stores
│   │   │   ├── useBannerStore.ts
│   │   │   ├── useContactStore.ts
│   │   │   ├── useQuoteStore.ts
│   │   │   └── useAppStore.ts
│   │   └── App.tsx
│   ├── vercel.json
│   ├── .env.example
│   └── package.json
│
├── /admin/                      # Admin Panel
│   ├── src/
│   │   ├── /components/
│   │   │   ├── /ui/            # shadcn/ui
│   │   │   ├── /charts/        # Recharts
│   │   │   └── /forms/         # BannerForm, ContactForm, QuoteFilter
│   │   ├── /pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── BannerManager.tsx
│   │   │   ├── ContactManager.tsx
│   │   │   └── QuoteManager.tsx
│   │   ├── /hooks/
│   │   ├── /store/             # useAuthStore, useStatsStore
│   │   ├── /lib/               # api.ts
│   │   └── App.tsx
│   ├── vercel.json
│   ├── .env.example
│   └── package.json
│
├── /server/                     # Backend
│   ├── src/
│   │   ├── /config/            # db.config.ts
│   │   ├── /models/            # Mongoose models (Admin, Banner, Quote, Contact, Visit)
│   │   ├── /routes/            # auth, banner, quote, contact, stats + admin/
│   │   ├── /services/          # telegram.service, visit.service
│   │   ├── /middleware/        # auth, track
│   │   └── index.ts
│   ├── vercel.json
│   ├── .env.example
│   └── package.json
│
└── .gitignore                   # Root gitignore
```

### Client Components Chi Tiết

```
/client/src/components/
├── /ui/                        # Base UI
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Label.tsx
│   └── ...
│
├── /sections/                  # Landing Sections
│   ├── HeroSection.tsx         # Swiper carousel + parallax
│   ├── AboutSection.tsx        # Giới thiệu dự án
│   ├── LocationSection.tsx     # Bản đồ + vị trí
│   ├── AmenitiesSection.tsx    # Tiện ích
│   ├── GallerySection.tsx      # Ảnh dự án
│   ├── FloorPlanSection.tsx    # Mặt bằng
│   ├── PriceSection.tsx        # Bảng giá
│   ├── PolicySection.tsx       # Chính sách
│   └── CTASection.tsx         # Form đăng ký
│
├── /public/                   # Public Components
│   ├── Header.tsx             # Sticky header + nav
│   ├── Footer.tsx              # Footer
│   ├── FloatingContactBar.tsx  # Contact icons bar
│   ├── QuoteForm.tsx          # Form báo giá
│   └── ImageGallery.tsx       # Lightbox gallery
│
└── /animated/                 # Animation Components
    ├── FadeIn.tsx             # Scroll-triggered fade
    ├── SlideIn.tsx           # Slide from direction
    ├── ScaleIn.tsx           # Scale animation
    ├── StaggerContainer.tsx  # Stagger children
    ├── ParallaxImage.tsx      # Parallax image
    └── AnimatedCounter.tsx    # Number counter
```

### Zustand Store Strategy

```typescript
// Cache Strategy: Zustand + persist middleware
// Lưu vào localStorage → tránh gọi API lặp khi refresh page
```

---

## 10. Floating Contact Bar

### Các loại Contact

| Type | Icon | Color | Action |
|------|------|-------|--------|
| `phone` | FiPhone | #e74c3c | tel: link |
| `whatsapp` | FaWhatsapp | #25D366 | https://wa.me/ link |
| `zalo` | SiZalo | #0068FF | zalo:// link |
| `facebook` | FaFacebook | #1877F2 | fb:// hoặc URL |
| `quote` | FiFileText | #f59e0b | Open modal báo giá |

### UI Component

```tsx
// client/src/components/public/FloatingContactBar.tsx
import { motion } from "framer-motion"
import { FiPhone, FiFileText } from "react-icons/fi"
import { FaWhatsapp, FaFacebook } from "react-icons/fa"
import { SiZalo } from "react-icons/si"

const FloatingContactBar = ({ contacts }) => {
  return (
    <motion.div className="fixed right-4 bottom-4 z-50 flex flex-col gap-3">
      {contacts.map(contact => (
        <ContactIcon key={contact.id} contact={contact} />
      ))}
    </motion.div>
  )
}
```

---

## 11. Image Optimization & Lazy Loading

### Core Techniques

#### 1. Blur-Up với vite-plugin-lqip

```bash
npm install -D vite-plugin-lqip
```

```typescript
// vite.config.ts
import lqip from 'vite-plugin-lqip';

export default {
  plugins: [
    lqip({
      dir: './src/assets',
      quality: 20,
      scales: [1, 2]
    })
  ]
};
```

```tsx
// Sử dụng với hero image
import heroImage from './hero.jpg?lqip';

<div
  className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
  style={{
    backgroundImage: `url("${heroImage.lqip}")`,
    backgroundImage: `url("${heroImage.src}")`
  }}
/>
```

#### 2. Lazy Image Component

```tsx
// client/src/components/animated/LazyImage.tsx
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}

export function LazyImage({ src, alt, className, aspectRatio = '16/9' }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px', threshold: 0.01 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`} style={{ aspectRatio }}>
      {/* Skeleton loader */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
      )}

      {/* Actual image */}
      {isInView && (
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}
```

#### 3. Responsive Images với srcset

```tsx
<LazyImage
  src={imageUrl}
  alt={alt}
  className="w-full"
  srcSet={`
    ${imageUrl}?w=640&q=80 640w,
    ${imageUrl}?w=1024&q=80 1024w,
    ${imageUrl}?w=1920&q=80 1920w
  `}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
/>
```

### CDN Image Optimization

```tsx
// Format: WebP/AVIF với quality optimization
const optimizeImage = (url: string, options = {}) => {
  const { width = 800, quality = 80, format = 'webp' } = options;
  // Nếu dùng Cloudinary
  // return `https://res.cloudinary.com/demo/image/fetch/f_${format},q_${quality},w_${width}/${url}`;
  // Nếu dùng Imgix
  // return `https://example.imgix.net/${url}?w=${width}&q=${quality}&fm=${format}`;
  return url;
};
```

---

## 12. Animation Patterns - Framer Motion

### Animation Variants Library

```tsx
// client/src/lib/animations.ts
import { Variants } from 'framer-motion';

// Fade In Up
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

// Fade In
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } }
};

// Scale In
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

// Slide In Left
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
};

// Slide In Right
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
};

// Stagger Container
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

// Image Reveal
export const imageReveal: Variants = {
  hidden: { clipPath: 'inset(100% 0 0 0)' },
  visible: {
    clipPath: 'inset(0% 0 0 0)',
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};
```

### Scroll-Triggered Animation Wrapper

```tsx
// client/src/components/animated/ScrollAnimation.tsx
import { motion, Variants } from 'framer-motion';

interface ScrollAnimationProps {
  children: React.ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
}

export function ScrollAnimation({
  children,
  variants = fadeInUp,
  className,
  delay = 0
}: ScrollAnimationProps) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

### Parallax Image Component

```tsx
// client/src/components/animated/ParallaxImage.tsx
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
}

export function ParallaxImage({ src, alt, className, speed = 0.5 }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], [-100 * speed, 100 * speed]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y, scale: 1.2 }}
        className="w-full h-[120%] object-cover"
      />
    </div>
  );
}
```

### Animated Counter Component

```tsx
// client/src/components/animated/AnimatedCounter.tsx
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export function AnimatedCounter({ target, duration = 2, suffix = '', prefix = '' }: AnimatedCounterProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const display = useTransform(rounded, (latest) => `${prefix}${latest.toLocaleString()}${suffix}`);

  useEffect(() => {
    const controls = animate(count, target, {
      duration,
      ease: 'easeOut'
    });
    return controls.stop;
  }, [target]);

  return <motion.span>{display}</motion.span>;
}
```

### Usage Examples

```tsx
// Trong component section
import { staggerContainer, fadeInUp } from '@/lib/animations';
import { ScrollAnimation } from '@/components/animated/ScrollAnimation';
import { ParallaxImage } from '@/components/animated/ParallaxImage';
import { AnimatedCounter } from '@/components/animated/AnimatedCounter';

// Section với stagger children
<ScrollAnimation variants={staggerContainer}>
  <motion.h2 variants={fadeInUp} className="text-4xl font-bold">
    Tiêu đề
  </motion.h2>
  <motion.p variants={fadeInUp} className="text-lg text-gray-600">
    Mô tả
  </motion.p>
</ScrollAnimation>

// Stats với animated counter
<div className="grid grid-cols-3 gap-8">
  <ScrollAnimation>
    <AnimatedCounter target={1500} suffix="+" />
    <p>Căn hộ</p>
  </ScrollAnimation>
  <ScrollAnimation>
    <AnimatedCounter target={98} suffix="%" />
    <p>Đã bán</p>
  </ScrollAnimation>
  <ScrollAnimation>
    <AnimatedCounter target={30} suffix="+" prefix="$" />
    <p>Tỷ đồng</p>
  </ScrollAnimation>
</div>

// Parallax hero
<ParallaxImage src="/hero-bg.jpg" alt="Hero" className="h-screen" speed={0.3} />
```

---

## 13. Chart cho Admin Dashboard

**Thư viện**: Recharts (React chart library)

### Visit Line Chart

```tsx
<LineChart data={dailyStats}>
  <Line type="monotone" dataKey="count" stroke="#8884d8" />
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
</LineChart>
```

### Quote Status Pie Chart

```tsx
<PieChart>
  <Pie data={quoteStats} dataKey="value" nameKey="name" cx="50%" cy="50%">
    <Cell fill="#22c55e" /> {/* new */}
    <Cell fill="#f59e0b" /> {/* contacted */}
    <Cell fill="#6b7280" /> {/* closed */}
  </Pie>
  <Legend />
</PieChart>
```

---

## 14. Deployment

| Service | Option | Free Tier |
|---------|--------|-----------|
| Client (Public) | Vercel | ✅ Free |
| Admin Panel | Vercel | ✅ Free |
| Backend | Railway / Render / Vercel | ✅ Free |
| Database | MongoDB Atlas | ✅ Free (512MB) |
| Images | Cloudinary (500MB) | ✅ Free |
| Analytics | Vercel Analytics | ✅ Free |
| Domain | .vn domain | Paid |

### Vercel Configuration

```json
// client/vercel.json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "port": 5173,
  "env": {
    "VITE_API_URL": "@api-url"
  }
}
```

### Performance Checklist

- [ ] Image optimization (WebP/AVIF, lazy loading)
- [ ] Blur-up placeholders
- [ ] Font preload
- [ ] Code splitting
- [ ] Lighthouse audit (LCP < 2.5s)

---

## 15. Thứ Tự Triển Khai

### Phase 1: Setup & Backend Foundation

- 1.1 Setup project structure (client, admin, server)
- 1.2 Setup MongoDB Atlas cluster
- 1.3 Configure MongoDB + Mongoose connection
- 1.4 Implement Auth (login, JWT middleware)
- 1.5 Implement Telegram Bot service
- 1.6 Implement Visit Tracker middleware

### Phase 2: Backend APIs

- 2.1 Banners CRUD API
- 2.2 Quotes CRUD API + Telegram notify on new
- 2.3 Contacts CRUD API
- 2.4 Stats API (daily visits, quote status)

### Phase 3: Client (Public Website) - Landing Page Đẳng Cấp

- 3.1 Setup Vite + Tailwind + Framer Motion + Swiper.js
- 3.2 Smooth scroll với Lenis
- 3.3 Animation components (FadeIn, SlideIn, Parallax, Counter)
- 3.4 Hero section với parallax + Swiper carousel
- 3.5 Sections: About, Location, Amenities, Gallery, Floor Plan, Price
- 3.6 Floating Contact Bar với animations
- 3.7 Image optimization (blur-up, lazy loading)
- 3.8 Zustand stores (banner, contact, quote)
- 3.9 Form Báo Giá với validation
- 3.10 SEO optimization (meta tags, schema, sitemap)

### Phase 4: Admin Panel

- 4.1 Setup Vite + Tailwind + shadcn/ui
- 4.2 Auth store + protected routes
- 4.3 Dashboard với Recharts (stats cards, line chart, pie chart)
- 4.4 Banner Manager (CRUD, drag-drop upload)
- 4.5 Contact Manager (CRUD contacts)
- 4.6 Quote Manager (filter, update status)

### Phase 5: Deploy & Polish

- 5.1 Deploy client to Vercel
- 5.2 Deploy admin to Vercel
- 5.3 Deploy server to Railway/Render
- 5.4 Connect MongoDB Atlas whitelist
- 5.5 Lighthouse audit & fix issues
- 5.6 Performance optimization

---

## Environment Variables

```env
# Server
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sola-apartment
JWT_SECRET=your_jwt_secret
PORT=3000
NODE_ENV=development

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id

# Client
VITE_API_URL=https://api.yourdomain.com

# Admin
VITE_API_URL=https://api.yourdomain.com
```

---

## MongoDB Atlas Setup Guide

### 1. Tạo tài khoản

1. Truy cập [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Đăng ký tài khoản miễn phí
3. Chọn "Free Tier" (M0 Sandbox)

### 2. Tạo Cluster

1. Click "Build a Database"
2. Chọn provider (AWS, Google Cloud, Azure)
3. Chọn region gần nhất (Singapore)
4. Chọn "Free Tier" tier
5. Click "Create"

### 3. Tạo Database User

1. Vào "Security" > "Database Access"
2. Click "Add New Database User"
3. Username: `sola-admin`
4. Password: (tạo strong password)
5. Role: "Read and write to any database"
6. Click "Add User"

### 4. Whitelist IP

1. Vào "Security" > "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 5. Lấy Connection String

1. Vào "Clusters" > "Connect"
2. Chọn "Connect your application"
3. Copy connection string:
   ```
   mongodb+srv://sola-admin:<password>@cluster.mongodb.net/sola-apartment?retryWrites=true&w=majority
   ```
4. Thay `<password>` bằng password đã tạo ở bước 3

### 6. Cập nhật .env

```env
MONGODB_URI=mongodb+srv://sola-admin:YOUR_PASSWORD@cluster.mongodb.net/sola-apartment?retryWrites=true&w=majority
```
