# ⚡ Tâm Store - Website Bán Hàng Điện Tử Cá Nhân (Messenger Commerce)

Website thương mại điện tử chuyên ngành thiết bị công nghệ và điện tử được xây dựng theo mô hình **cửa hàng cá nhân hiện đại**: tập trung tối đa vào sản phẩm, thông tin cấu hình, thiết kế tối giản và trải nghiệm mua sắm nhanh gọn thông qua **Facebook Messenger** hoặc **Sao chép nội dung đơn hàng** để gửi trực tiếp cho chủ shop.

---

## 🌟 Điểm nổi bật & Triết lý thiết kế

1. **Thiết kế tối giản & Chuyên nghiệp (Minimalism)**:
   - Sử dụng toàn bộ font chữ **Roboto Flex** hiện đại, dễ đọc, chuẩn typography quốc tế.
   - Bảng màu tương phản cao, tinh tế: không gradient rực rỡ, không bo tròn quá đà, không lạm dụng animation hay glassmorphism.
   - Hỗ trợ hoàn hảo **Light Mode ↔ Dark Mode**, tự động phát hiện theme hệ thống và lưu lựa chọn vào `localStorage`.

2. **Cơ chế mua hàng qua Messenger (Không Checkout phức tạp)**:
   - Khách hàng nhấn **"Mua"** trên bất kỳ sản phẩm nào -> Modal mở ra cung cấp 2 lựa chọn:
     - 💬 **Mở Messenger**: Tự động sao chép nội dung đơn hàng và mở Messenger của chủ shop.
     - 📋 **Sao chép nội dung**: Sử dụng Clipboard API copy nội dung soạn sẵn chuẩn mẫu và thông báo hướng dẫn gửi shop.
   - Mua nhiều sản phẩm: Giỏ hàng tích hợp sẵn cho phép gom nhiều sản phẩm, chọn biến thể, tự động tính tổng tiền dự kiến và tạo tin nhắn mua hàng tổng hợp.

3. **Hệ thống Quản Trị (Admin Dashboard) toàn diện**:
   - Bảo mật Server-side: Người dùng role `USER` truy cập `/admin` sẽ bị chặn với thông báo: *"Bạn không có quyền truy cập trang này."*
   - Quản lý sản phẩm: Xem, Thêm mới, Sửa, Xóa (kèm Confirmation Modal), Ẩn/Hiện (Active / Draft) nhanh.
   - Trình tạo bảng thông số kỹ thuật (Specifications) động và tạo biến thể (Màu sắc, Dung lượng, RAM...).
   - Quản lý danh mục & Thương hiệu với thống kê số lượng sản phẩm liên quan.
   - Quản lý kho hàng (Inventory): Cập nhật số lượng tồn kho trực tiếp không cần tải lại trang.
   - Quản lý danh sách người dùng đăng ký và đánh giá khách hàng.

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React, Font Roboto Flex.
- **Backend**: Next.js Route Handlers & Server Components.
- **Database & ORM**: Prisma ORM với SQLite (mặc định sẵn sàng chạy ngay, dễ dàng chuyển sang PostgreSQL).
- **Authentication**: JWT Session Cookies (thư viện chuẩn `jose`), mã hóa mật khẩu một chiều an toàn bằng `bcryptjs`.
- **State Management**: React Context (`CartContext`, `AuthContext`, `ToastContext`, `PurchaseModalContext`) kết hợp `localStorage`.

---

## 🚀 Hướng dẫn cài đặt & Khởi chạy

### Bước 1: Cài đặt Dependencies
```bash
npm install
```

### Bước 2: Đồng bộ cơ sở dữ liệu
```bash
npx prisma db push
```

### Bước 3: Nạp dữ liệu mẫu (Seed Data)
Nạp 14 sản phẩm công nghệ cao cấp kèm thông số chi tiết, danh mục, thương hiệu và tài khoản demo:
```bash
node prisma/seed.js
```

### Bước 4: Chạy môi trường phát triển (Development)
```bash
npm run dev
```
Mở trình duyệt và truy cập: **[http://localhost:3000](http://localhost:3000)**

---

## 🔑 Tài khoản Demo (Chỉ dùng cho môi trường Development)

| Vai trò | Email | Mật khẩu | Quyền hạn |
| :--- | :--- | :--- | :--- |
| **ADMIN (Quản trị viên)** | `admin@shop.com` | `admin123` | Toàn quyền truy cập `/admin`, CRUD sản phẩm, kho hàng, danh mục, thương hiệu, người dùng |
| **USER (Khách hàng)** | `user@shop.com` | `user123` | Xem, tìm kiếm, lọc sản phẩm, thêm vào giỏ, gửi đánh giá, mua qua Messenger |

---

## ⚙️ Cấu hình biến môi trường (`.env`)

Mọi thông tin liên kết Messenger của shop và cấu hình hệ thống được khai báo tập trung trong file `.env`:

```env
# Cơ sở dữ liệu (SQLite chạy ngay không cần cài thêm, hoặc PostgreSQL)
DATABASE_URL="file:./dev.db"

# Khóa bí mật ký JWT Session Cookie (tối thiểu 32 ký tự)
AUTH_SECRET="techstore-super-secure-random-secret-key-32-chars-long"

# Liên kết Facebook Messenger của chủ shop (ví dụ: m.me/username hoặc link fanpage)
MESSENGER_URL="https://m.me/your_username"
NEXT_PUBLIC_MESSENGER_URL="https://m.me/your_username"

# URL gốc của ứng dụng (dùng để sinh link sản phẩm trong tin nhắn)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 📱 Cấu trúc thư mục dự án

```text
├── app/
│   ├── page.tsx                     # Trang chủ (Hero, Danh mục, Sản phẩm nổi bật, Hướng dẫn mua hàng)
│   ├── products/
│   │   ├── page.tsx                 # Trang danh sách sản phẩm (Search, Filter, Sort, Pagination)
│   │   └── [slug]/
│   │       └── page.tsx             # Chi tiết sản phẩm (Gallery, Thông số, Biến thể, Đánh giá, SEO)
│   ├── cart/page.tsx                # Trang giỏ hàng & Mua nhiều món qua Messenger
│   ├── login/page.tsx               # Đăng nhập
│   ├── register/page.tsx            # Đăng ký tài khoản mới
│   ├── profile/page.tsx             # Quản lý hồ sơ & Đổi mật khẩu
│   ├── admin/
│   │   ├── layout.tsx               # Kiểm tra quyền ADMIN ở cấp độ Server
│   │   ├── page.tsx                 # Dashboard thống kê tổng quan
│   │   ├── products/                # Quản lý danh sách sản phẩm (Table, Ẩn/Hiện, Xóa)
│   │   │   ├── new/page.tsx         # Thêm sản phẩm mới (Upload ảnh, Thông số kỹ thuật, Biến thể)
│   │   │   └── [id]/edit/page.tsx   # Chỉnh sửa sản phẩm
│   │   ├── categories/page.tsx      # Quản lý danh mục
│   │   ├── brands/page.tsx          # Quản lý thương hiệu
│   │   ├── inventory/page.tsx       # Quản lý tồn kho (Sửa số lượng inline)
│   │   ├── users/page.tsx           # Quản lý người dùng
│   │   └── settings/page.tsx        # Cài đặt Messenger & Hệ thống
│   └── api/                         # REST API routes (Auth, Products, Inventory, Categories, Reviews)
├── components/
│   ├── Header/                      # Header cố định, Menu Drawer mobile, Ô tìm kiếm, Badge giỏ hàng
│   ├── Footer/                      # Footer tối giản với link chat Messenger nhanh
│   ├── ProductCard/                 # Thẻ sản phẩm với giá cũ/mới, đánh giá, nút "Mua"
│   ├── ProductGrid/                 # Grid responsive (4 cột Desktop, 3 Tablet, 2 Mobile)
│   ├── ProductDetail/               # Trình xem chi tiết: chuyển thumbnail ảnh, chọn cấu hình, review
│   ├── PurchaseModal/               # Modal chọn "Mở Messenger" hoặc "Sao chép nội dung"
│   ├── ThemeToggle/                 # Nút chuyển đổi Light Mode ↔ Dark Mode
│   ├── Cart/                        # CartContext và quản lý LocalStorage
│   ├── Toast/                       # Hệ thống thông báo toast notification
│   ├── Auth/                        # AuthContext và hook người dùng
│   └── admin/                       # Sidebar thu gọn, Table sản phẩm, Modal xác nhận xóa
├── lib/
│   ├── auth/                        # Tiện ích phiên đăng nhập (JWT, bcrypt)
│   ├── db/                          # Prisma client singleton
│   ├── messenger/purchase.ts        # Helper tạo tin nhắn mua hàng, Clipboard copy, Open Messenger
│   └── utils/                       # Định dạng tiền tệ VNĐ, ngày tháng, tính % giảm giá
└── prisma/
    ├── schema.prisma                # Database Schema chuẩn hóa
    └── seed.js                      # Dữ liệu sản phẩm mẫu phong phú
```

---

## 💬 Format tin nhắn Messenger tự động

### Khi mua 1 sản phẩm:
```text
Xin chào shop, mình muốn mua sản phẩm:

Sản phẩm: iPhone 16 Pro Max
SKU: IP16PM-256-NT
Giá: 34.990.000đ
Số lượng: 1
Phân loại: 256GB - Titan Sa Mạc

Link sản phẩm:
http://localhost:3000/products/iphone-16-pro-max

Shop kiểm tra giúp mình sản phẩm này còn hàng không ạ?
```

### Khi mua nhiều sản phẩm từ Giỏ hàng:
```text
Xin chào shop, mình muốn mua các sản phẩm sau:

1. iPhone 16 Pro Max
   Phân loại: 256GB - Titan Sa Mạc
   Số lượng: 1
   Giá: 34.990.000đ

2. Chuột không dây Logitech MX Master 3S
   Phân loại: Graphite (Xám Đen)
   Số lượng: 1
   Giá: 2.190.000đ

Tổng tiền dự kiến: 37.180.000đ

Shop kiểm tra giúp mình các sản phẩm trên còn hàng không ạ?
```

---

Dự án đã sẵn sàng để triển khai và sử dụng ngay lập tức!
