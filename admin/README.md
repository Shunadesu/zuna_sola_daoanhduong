# Admin Panel - Sola Apartment

Admin dashboard để quản lý banners, contacts, và quotes.

## Cài đặt

```bash
npm install
cp .env.example .env
```

## Chạy development

```bash
npm run dev
```

## Build production

```bash
npm run build
npm run preview
```

## Environment Variables

```env
VITE_API_URL=https://your-api-domain.com
```

## Deploy lên Vercel

1. Push code lên GitHub
2. Import project trên [Vercel](https://vercel.com)
3. Thêm environment variable `VITE_API_URL`
4. Deploy

## Pages

- `/login` - Trang đăng nhập
- `/` - Dashboard với stats và charts
- `/banners` - Quản lý banners
- `/contacts` - Quản lý liên hệ
- `/quotes` - Quản lý yêu cầu báo giá
