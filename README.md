# Sola Đảo Ảnh Dương

> Website bất động sản cao cấp với CMS toàn diện — MERN Stack

---

## ✨ Tổng Quan

Website landing page cho dự án căn hộ cao cấp **Sola Đảo Ảnh Dương**, tích hợp trang quản trị admin giúp quản lý nội dung dễ dàng. Hệ thống được xây dựng trên nền tảng MERN Stack (MongoDB, Express, React, Node.js).

---

## 🏗️ Kiến Trúc

```
sola-apartment/
├── 📂 client/          Landing page — trang chủ thu hút khách hàng
├── 📂 admin/           Trang quản trị CMS
├── 📂 server/          Backend API
└── 📂 docs/            Tài liệu chi tiết
```

| Module | Công nghệ | Port |
|--------|-----------|------|
| **Client** | React + Vite | `4888` |
| **Admin** | React + Vite | `5174` |
| **Server** | Express + Node | `4844` |

---

## 🎯 Tính Năng Nổi Bật

### Landing Page — Trải Nghiệm Đẳng Cấp

```
┌─────────────────────────────────────────────────────────┐
│  Hero Banner          ▸ Swiper carousel, auto-play       │
│  About Section        ▸ Animated counter, fade-in       │
│  Location             ▸ Bản đồ tương tác               │
│  Amenities            ▸ Grid hover effects             │
│  Gallery              ▸ Lightbox, lazy loading          │
│  Contact Form         ▸ Submit quote request            │
└─────────────────────────────────────────────────────────┘
```

- **Smooth Scroll** — Lenis library
- **Parallax Effects** — Framer Motion
- **Scroll Animations** — Fade, slide, stagger
- **Lazy Loading** — Blur-up image placeholder
- **Floating Contact Bar** — Gọi, Zalo, Đăng ký

### Admin Dashboard — Quản Trị Dễ Dàng

| Trang | Chức năng |
|-------|-----------|
| **Dashboard** | Biểu đồ thống kê visits, quotes theo ngày/tháng |
| **Banner Manager** | CRUD banner, sắp xếp thứ tự, active/inactive |
| **Quote Manager** | Xem & xóa yêu cầu báo giá |
| **Contact Manager** | Quản lý hotline, Zalo, Facebook |

---

## 📊 Database Schema

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   admins     │     │   banners    │     │   quotes     │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ _id          │     │ _id          │     │ _id          │
│ username     │     │ title        │     │ name         │
│ password     │     │ subtitle     │     │ phone        │
│ createdAt   │     │ imageUrl     │     │ email        │
└──────────────┘     │ linkUrl      │     │ message      │
                     │ isActive     │     │ createdAt    │
                     │ sortOrder    │     └──────────────┘
                     └──────────────┘
                           │
                     ┌──────────────┐     ┌──────────────┐
                     │   contacts    │     │   visits     │
                     ├──────────────┤     ├──────────────┤
                     │ _id          │     │ _id          │
                     │ type         │     │ ip           │
                     │ value        │     │ userAgent    │
                     │ label        │     │ referrer     │
                     │ isActive     │     │ path         │
                     │ sortOrder    │     │ createdAt    │
                     └──────────────┘     └──────────────┘
```

---

## 🌐 API Reference

### Public Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| `GET` | `/api/banners` | Banner active |
| `GET` | `/api/contacts` | Contacts active |
| `POST` | `/api/quotes` | Submit quote |
| `GET` | `/api/uploads/:file` | Serve file |

### Admin Endpoints — *JWT Required*

**Authentication**

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| `POST` | `/api/auth/login` | Admin login |

**Banners**

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| `GET` | `/api/admin/banners` | List all |
| `POST` | `/api/admin/banners` | Create |
| `PUT` | `/api/admin/banners/:id` | Update |
| `DELETE` | `/api/admin/banners/:id` | Delete |

**Quotes**

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| `GET` | `/api/admin/quotes` | List all |
| `DELETE` | `/api/admin/quotes/:id` | Delete |

**Contacts**

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| `GET` | `/api/admin/contacts` | List all |
| `POST` | `/api/admin/contacts` | Create |
| `PUT` | `/api/admin/contacts/:id` | Update |
| `DELETE` | `/api/admin/contacts/:id` | Delete |

**Stats**

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| `GET` | `/api/admin/stats` | Dashboard stats |

### Upload

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| `POST` | `/api/upload` | Single image (max 5MB) |
| `POST` | `/api/upload-multiple` | Multiple images (max 10) |

**Allowed formats:** `JPEG`, `PNG`, `GIF`, `WebP`, `SVG`

---

## 🛠️ Tech Stack

```
Frontend
├── React 18 + Vite
├── TailwindCSS + shadcn/ui
├── Framer Motion        ▸ Animations
├── Swiper.js            ▸ Carousel
├── Lenis                ▸ Smooth scroll
├── Zustand              ▸ State management
├── React Router v6      ▸ Routing
├── React Hook Form      ▸ Forms
└── Axios                ▸ HTTP client

Backend
├── Node.js + Express
├── MongoDB + Mongoose
├── JWT + bcryptjs        ▸ Authentication
├── Multer                ▸ File upload
└── Morgan + Helmet       ▸ Logging & security

Admin
├── React 18 + Vite
├── TailwindCSS
└── Recharts              ▸ Analytics charts
```

---

## 📁 Routes

### Client

| Route | Mô tả |
|-------|--------|
| `/` | Landing page |

### Admin

| Route | Mô tả |
|-------|--------|
| `/login` | Login page |
| `/admin` | Dashboard |
| `/admin/banners` | Banner Manager |
| `/admin/quotes` | Quote Manager |
| `/admin/contacts` | Contact Manager |

---

## 💡 Điểm Nổi Bật

```
▸ Responsive Design     ▸ Mobile-first approach
▸ SEO Optimized         ▸ Meta tags, JSON-LD structured data
▸ Analytics Built-in    ▸ Visit tracking, referrer, user agent
▸ Telegram Bot          ▸ Real-time notifications
▸ Secure                ▸ JWT auth, helmet, input validation
▸ Performance          ▸ Lazy loading, blur-up images
```

---

## 📌 Liên Hệ

Dự án **Sola Đảo Ảnh Dương** — Bất động sản cao cấp

*Designed & Developed with ❤️*
