# Datta Able Free Angular Admin Template

![Version](https://img.shields.io/badge/version-6.2.0-blue.svg)
![Angular](https://img.shields.io/badge/angular-20.0.5-red.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 Mô tả

Datta Able là một template admin dashboard miễn phí được xây dựng bằng Angular 20, cung cấp giao diện quản trị hiện đại và responsive. Template này bao gồm các module quản lý khách hàng, tài khoản, kho hàng và các tính năng admin khác.

## ✨ Tính năng chính

- **Dashboard Admin**: Trang tổng quan với biểu đồ và thống kê
- **Quản lý Khách hàng**: CRUD operations cho customer management
- **Quản lý Tài khoản**: Account management và user roles
- **Quản lý Kho hàng**: 
  - Quản lý mặt hàng (Item Management)
  - Import/Export dữ liệu
  - Quản lý loại mặt hàng, nhãn hiệu, xuất xứ
- **Authentication**: Đăng nhập/đăng xuất với JWT
- **Responsive Design**: Tương thích với mobile và desktop
- **Multi-language**: Hỗ trợ đa ngôn ngữ (EN/VI)
- **Material Design**: UI components từ Angular Material

## 🛠️ Công nghệ sử dụng

- **Framework**: Angular 20.0.5
- **UI Library**: Angular Material, Bootstrap 5.3.7
- **Charts**: ApexCharts
- **State Management**: RxJS
- **Styling**: SCSS/SASS
- **Icons**: Feather Icons, FontAwesome
- **Authentication**: JWT
- **Build Tool**: Angular CLI

## 📁 Cấu trúc dự án

```
src/
├── app/
│   ├── management/              # Các module quản lý
│   │   ├── CustomerManagement/  # Quản lý khách hàng
│   │   ├── InventoryManagement/ # Quản lý kho hàng
│   │   ├── AccountManagement/   # Quản lý tài khoản
│   │   ├── RoleManagement/      # Quản lý quyền
│   │   ├── Services/           # Business logic services
│   │   └── Model/              # Data models
│   ├── modules/                # Feature modules
│   │   ├── auth/               # Authentication
│   │   ├── user-management/    # Quản lý user
│   │   └── ...
│   ├── shared/                 # Shared components
│   ├── theme/                  # Theme và layout
│   └── _core/                  # Core utilities
├── assets/                     # Static assets
├── environments/               # Environment configs
└── scss/                      # Global styles
```

## 🚀 Cài đặt và chạy dự án

### Yêu cầu hệ thống

- Node.js >= 18.x
- npm >= 9.x
- Angular CLI >= 20.x

### Cài đặt

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd datta-able-free-angular-admin-template
   ```

2. **Cài đặt dependencies**
   ```bash
   npm install
   ```

3. **Chạy development server**
   ```bash
   npm start
   # hoặc
   ng serve
   ```

4. **Mở trình duyệt và truy cập**
   ```
   http://localhost:4200
   ```

### Build cho production

```bash
npm run build-prod
# hoặc
ng build --configuration production
```

## 📝 Scripts có sẵn

| Script | Mô tả |
|--------|--------|
| `npm start` | Chạy development server |
| `npm run build` | Build cho development |
| `npm run build-prod` | Build cho production |
| `npm run test` | Chạy unit tests |
| `npm run lint` | Kiểm tra code style |
| `npm run lint:fix` | Tự động fix linting issues |
| `npm run prettier` | Format code với Prettier |

## 🔧 Cấu hình

### Environment

Cấu hình API endpoints trong `src/environments/`:

```typescript
// environment.ts
export const environment = {
  production: false,
  ApiRoot: 'http://localhost:3000/api'
};
```

### Theme customization

Tùy chỉnh theme trong `src/scss/_variables.scss`:

```scss
// Primary colors
$primary: #1890ff;
$secondary: #6c757d;
$success: #52c41a;
// ...
```

## 📱 Responsive Design

Template hỗ trợ đầy đủ các breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 992px  
- **Desktop**: > 992px

## 🌍 Đa ngôn ngữ

Hỗ trợ i18n với các ngôn ngữ:

- **Tiếng Anh** (en)
- **Tiếng Việt** (vi)

File ngôn ngữ được lưu trong `src/assets/i18n/`

## 🔐 Authentication

Template sử dụng JWT cho authentication:

- Login/Logout
- Route guards
- Role-based access control
- Token refresh

## 📊 Charts & Visualization

Sử dụng ApexCharts cho các biểu đồ:

- Line charts
- Bar charts  
- Pie charts
- Area charts

## 🛡️ Security Features

- JWT token validation
- Route protection
- XSS protection
- CSRF protection

## 📦 Dependencies chính

| Package | Version | Mô tả |
|---------|---------|--------|
| @angular/core | 20.0.5 | Angular framework |
| @angular/material | 20.1.2 | Material Design components |
| bootstrap | 5.3.7 | CSS framework |
| apexcharts | 4.7.0 | Charting library |
| @ngx-translate/core | 16.0.4 | Internationalization |
| rxjs | 7.8.2 | Reactive programming |

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📋 Code Style

Dự án sử dụng:

- **ESLint**: Linting JavaScript/TypeScript
- **Prettier**: Code formatting
- **Angular Style Guide**: Tuân thủ Angular best practices

## 🐛 Báo lỗi

Nếu bạn tìm thấy lỗi, vui lòng tạo issue với:

- Mô tả lỗi chi tiết
- Các bước tái tạo lỗi
- Screenshots (nếu có)
- Thông tin môi trường

## 📄 License

Dự án này được phân phối dưới MIT License. Xem file `LICENSE` để biết thêm chi tiết.

## 👥 Tác giả

- **CodedThemes** - *Initial work*

## 🙏 Lời cảm ơn

- Angular team cho framework tuyệt vời
- Material Design team cho UI components
- Cộng đồng open source

---

**Lưu ý**: Đây là phiên bản miễn phí của Datta Able. Để có thêm nhiều tính năng và components, vui lòng xem xét phiên bản Pro.
