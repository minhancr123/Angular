# 🏪 Hệ Thống Quản Lý Mặt Hàng - Inventory Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Angular](https://img.shields.io/badge/Angular-17+-red.svg)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Material Design](https://img.shields.io/badge/Material-Design-blue.svg)](https://material.angular.io/)

Hệ thống quản lý mặt hàng hiện đại được xây dựng trên Angular với Material Design, hỗ trợ đầy đủ các chức năng CRUD, quản lý hình ảnh và xuất nhập dữ liệu Excel.

### ✨ Điểm nổi bật
- 🖼️ **Quản lý hình ảnh**: Upload, preview, quản lý ảnh sản phẩm
- 📊 **Export/Import Excel**: Xuất nhập dữ liệu hàng loạt
- 🔍 **Tìm kiếm thông minh**: Lọc theo nhiều tiêu chí
- 📱 **Responsive Design**: Hoạt động tốt trên mọi thiết bị
- 🎨 **Material Design**: Giao diện hiện đại, đẹp mắt

## 🚀 Tính năng chính

### 📦 Quản lý mặt hàng
- ✅ Thêm mới mặt hàng với đầy đủ thông tin
- ✅ Cập nhật thông tin sản phẩm
- ✅ Xóa mặt hàng (đơn lẻ hoặc hàng loạt)
- ✅ Xem chi tiết mặt hàng với 5 tab thông tin
- ✅ Tìm kiếm và lọc theo nhiều tiêu chí

### 🖼️ Quản lý hình ảnh
- ✅ Upload hình ảnh cho sản phẩm
- ✅ Preview ảnh trước khi lưu
- ✅ Hiển thị thumbnail trong danh sách
- ✅ Xem ảnh full size trong trang chi tiết
- ✅ Thay đổi và cập nhật ảnh

### 📊 Xuất nhập dữ liệu
- ✅ Export danh sách ra Excel
- ✅ Import dữ liệu từ Excel
- ✅ Template Excel mẫu
- ✅ Validation dữ liệu import

## 📋 Mục Lục

- [Tổng quan](#-tổng-quan)
- [Tính năng chính](#-tính-năng-chính)  
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cài đặt](#-cài-đặt)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Hướng dẫn sử dụng](#-hướng-dẫn-sử-dụng)
- [API Documentation](#-api-documentation)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [Tài liệu bổ sung](#-tài-liệu-bổ-sung)

## �️ Công nghệ sử dụng

### Frontend
- **Angular 17+** - Framework chính
- **Angular Material** - UI Components
- **TypeScript** - Ngôn ngữ lập trình
- **RxJS** - Reactive programming
- **SCSS** - Styling

### Dependencies chính
```json
{
  "@angular/animations": "^17.0.0",
  "@angular/cdk": "^17.0.0",
  "@angular/common": "^17.0.0",
  "@angular/material": "^17.0.0",
  "rxjs": "~7.8.0",
  "xlsx": "^0.18.5",
  "file-saver": "^2.0.5"
}
```

## 📥 Cài đặt

### Yêu cầu hệ thống
- Node.js 18+ 
- Angular CLI 17+
- npm hoặc yarn

### Bước 1: Clone dự án
```bash
git clone <repository-url>
cd datta-able-free-angular-admin-template
```

### Bước 2: Cài đặt dependencies
```bash
npm install
# hoặc
yarn install
```

### Bước 3: Cấu hình environment
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  ApiRoot: 'http://localhost:5000/api'  // Thay đổi URL API
};
```

### Bước 4: Chạy dự án
```bash
ng serve
# Mở trình duyệt tại http://localhost:4200
```

## 📁 Cấu trúc dự án

```
src/app/management/InventoryManagement/ItemMangament/
├── item-list/                  # Danh sách mặt hàng
│   ├── item-list.component.ts
│   ├── item-list.component.html
│   └── item-list.component.scss
├── add-item/                   # Thêm mặt hàng mới
│   ├── add-item.component.ts
│   ├── add-item.component.html
│   └── add-item.component.scss
├── item-edit/                  # Chỉnh sửa mặt hàng
├── item-detail-page/           # Chi tiết mặt hàng
├── item-import/                # Import Excel
└── Services/                   # Các service
    └── mat-hang.service.ts     # Service chính
```

## 📖 Hướng dẫn sử dụng

### 🏠 Trang chủ quản lý mặt hàng
1. Truy cập `/management/inventory/item`
2. Xem danh sách tất cả mặt hàng
3. Sử dụng các nút chức năng ở đầu trang

### ➕ Thêm mặt hàng mới
1. Click nút **"Thêm mặt hàng"**
2. Chọn tab **"Thông tin cơ bản"**
3. Điền đầy đủ thông tin:
   - Mã hàng (bắt buộc)
   - Tên mặt hàng (bắt buộc)
   - Loại mặt hàng
   - Đơn vị tính
   - Giá mua, giá bán
4. Click **"Lưu"**

### 🖼️ Thêm hình ảnh cho mặt hàng có sẵn
1. Chọn tab **"Hình ảnh chính"**
2. Chọn mặt hàng từ dropdown
3. Click **"Chọn file"** để upload ảnh
4. Preview ảnh và click **"Lưu"**

### 👁️ Xem chi tiết mặt hàng
1. Click vào **"Chi tiết"** trong danh sách
2. Xem thông tin qua 5 tab:
   - **Thông tin cơ bản**
   - **Thông tin bổ sung**
   - **Hình ảnh**
   - **Giá cả & Kho**
   - **Ghi chú & Mô tả**

### 📊 Xuất/Nhập Excel
#### Xuất Excel:
1. Click **"Xuất Excel"**
2. File sẽ được tải về tự động

#### Nhập Excel:
1. Click **"Nhập Excel"**
2. Tải template mẫu (nếu cần)
3. Chọn file Excel đã chuẩn bị
4. Click **"Nhập dữ liệu"**

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api/InventoryManagement
```

### Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | `/` | Lấy danh sách mặt hàng |
| GET | `/{id}` | Lấy chi tiết mặt hàng |
| POST | `/` | Tạo mặt hàng mới |
| PUT | `/` | Cập nhật mặt hàng |
| DELETE | `/{id}` | Xóa mặt hàng |
| POST | `/upload` | Upload hình ảnh |

### Data Models

```typescript
interface MatHang {
  IdMH: number | null;
  MaHang: string;           // Mã hàng
  TenMatHang: string;       // Tên mặt hàng
  IdLMH: number;            // ID loại mặt hàng
  IdDVT: number;            // ID đơn vị tính
  GiaMua: number;           // Giá mua
  GiaBan: number;           // Giá bán
  HinhAnh: string;          // Đường dẫn hình ảnh
  MoTa: string;             // Mô tả
}
```

## 🐛 Troubleshooting

### Lỗi thường gặp

#### 1. Không hiển thị hình ảnh
**Nguyên nhân**: Đường dẫn API không đúng
```typescript
// Kiểm tra cấu hình environment
export const environment = {
  ApiRoot: 'http://localhost:5000/api'  // Đảm bảo URL đúng
};
```

#### 2. Lỗi CORS khi gọi API
**Giải pháp**: Cấu hình CORS trên backend
```json
// angular.json - proxy config
{
  "/api/*": {
    "target": "http://localhost:5000",
    "secure": true,
    "changeOrigin": true
  }
}
```

#### 3. Không import được Excel
**Kiểm tra**: 
- File Excel đúng format
- Các cột bắt buộc không để trống
- Dữ liệu hợp lệ (số, text)

## Contributor 

**CodedThemes Team**

- https://x.com/codedthemes
- https://github.com/codedthemes

**Rakesh Nakrani**

- https://x.com/rakesh_nakrani

**Brijesh Dobariya**

- https://x.com/dobaria_brijesh

## Useful Resources

- [More Admin Templates From CodedThemes](https://codedthemes.com/item/category/admin-templates/)
- [Freebies From CodedThemes](https://codedthemes.com/item/category/free-templates/)
- [Big Bundles](https://codedthemes.com/item/big-bundle/)
- [Figma UI Kits](https://codedthemes.com/item/category/templates/figma/)
- [Affiliate Program](https://codedthemes.com/affiliate/)
- [Blogs](https://blog.codedthemes.com/)

## Community

- 👥Follow [@codedthemes](https://x.com/codedthemes)
- 🔗Join [Discord](https://discord.com/invite/p2E2WhCb6s)
- 🔔Subscribe to [Codedtheme Blogs](https://blog.codedthemes.com/)

## Follow Us

- [Twitter](https://twitter.com/codedthemes) 🐦
- [Dribbble](https://dribbble.com/codedthemes) 🏀
- [Github](https://github.com/codedthemes) 🐙
- [LinkedIn](https://www.linkedin.com/company/codedthemes/) 💼
- [Instagram](https://www.instagram.com/codedthemes/) 📷
- [Facebook](https://www.facebook.com/codedthemes) 🟦

## 📱 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 80+     | ✅ Đầy đủ |
| Firefox | 75+     | ✅ Đầy đủ |
| Safari  | 13+     | ✅ Đầy đủ |
| Edge    | 80+     | ✅ Đầy đủ |
| IE 11   | -       | ❌ Không hỗ trợ |

## 🧪 Testing

### Chạy tests
```bash
# Unit tests
ng test

# E2E tests  
ng e2e

# Test coverage
ng test --code-coverage
```

### Test scenarios
- ✅ Tạo mặt hàng mới
- ✅ Cập nhật thông tin
- ✅ Upload hình ảnh
- ✅ Tìm kiếm/lọc
- ✅ Export/Import Excel

## 🚀 Deployment

### Build production
```bash
ng build --configuration=production
```

### Deploy với Docker
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

## 🤝 Contributing

### Quy trình đóng góp
1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

### Code Standards
- Sử dụng ESLint và Prettier
- Tuân thủ Angular Style Guide
- Viết unit tests cho features mới
- Comment code rõ ràng

## 📚 Tài liệu bổ sung

- [📖 Hướng dẫn sử dụng chi tiết](./HUONG_DAN_SU_DUNG.md)
- [🛠️ Tài liệu kỹ thuật](./README_TECHNICAL.md)
- [🔄 Changelog](./CHANGELOG.md)

## 📄 License

Dự án này được phân phối dưới MIT License. Xem file `LICENSE` để biết thêm chi tiết.

## 📞 Liên hệ & Hỗ trợ

- **Developer**: Development Team
- **Email**: support@company.com
- **Version**: 6.2.0
- **Last Updated**: August 25, 2025

---

⭐ **Nếu dự án hữu ích, hãy star cho chúng tôi!** ⭐

## 🎯 Screenshots

### Dashboard chính
![Dashboard](./docs/screenshots/dashboard.png)

### Danh sách mặt hàng
![Item List](./docs/screenshots/item-list.png)

### Thêm mặt hàng mới
![Add Item](./docs/screenshots/add-item.png)

### Chi tiết mặt hàng
![Item Detail](./docs/screenshots/item-detail.png)

---

**Powered by Angular 17+ & Material Design** 🚀
