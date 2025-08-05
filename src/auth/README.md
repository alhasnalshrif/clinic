# نظام المصادقة والتصريحات - Clinic Auth System

نظام مصادقة شامل لعيادة الأسنان يدعم التحكم في الوصول القائم على الأدوار والصلاحيات.

## المميزات

### 🔐 المصادقة
- تسجيل الدخول والخروج الآمن
- إدارة الجلسات بالتوكن
- التحقق التلقائي من صحة التوكن
- حفظ حالة المصادقة

### 👥 إدارة الأدوار
- **Admin**: مدير النظام - صلاحيات كاملة
- **Doctor**: طبيب - صلاحيات طبية شاملة
- **Nurse**: ممرض/ة - صلاحيات محدودة للرعاية
- **Receptionist**: موظف استقبال - إدارة المرضى والمواعيد
- **Manager**: مدير - عرض التقارير والإحصائيات

### 🛡️ نظام الصلاحيات
- إدارة المرضى (عرض، إضافة، تعديل، حذف)
- إدارة المواعيد (عرض، إضافة، تعديل، حذف)
- السجلات الطبية (عرض، إضافة، تعديل، حذف)
- العلاجات (عرض، إضافة، تعديل، حذف)
- المدفوعات (عرض، إضافة، تعديل، حذف)
- التقارير (عرض، إنشاء)
- إدارة المستخدمين (عرض، إضافة، تعديل، حذف)
- إعدادات النظام (عرض، تعديل)
- الرسائل النصية (إرسال، عرض السجلات)

## الاستخدام

### 1. إعداد AuthProvider

```jsx
import { AuthProvider } from './auth';

function App() {
  return (
    <AuthProvider>
      {/* مكونات التطبيق */}
    </AuthProvider>
  );
}
```

### 2. حماية الصفحات

```jsx
import { ProtectedRoute } from './auth';

// حماية بسيطة (المصادقة فقط)
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// حماية بدور محدد
<ProtectedRoute requiredRole="admin">
  <UserManagement />
</ProtectedRoute>

// حماية بصلاحية محددة
<ProtectedRoute requiredPermission="view_patients">
  <PatientsList />
</ProtectedRoute>
```

### 3. الصفحات العامة

```jsx
import { PublicRoute } from './auth';

// صفحة تسجيل الدخول (متاحة فقط لغير المسجلين)
<PublicRoute>
  <Login />
</PublicRoute>
```

### 4. التحكم في المحتوى

```jsx
import { RoleGuard, PermissionGuard } from './auth';

// عرض محتوى لأدوار محددة
<RoleGuard allowedRoles={['admin', 'doctor']}>
  <SensitiveData />
</RoleGuard>

// عرض محتوى لصلاحيات محددة
<PermissionGuard requiredPermissions={['view_reports']}>
  <ReportsSection />
</PermissionGuard>
```

### 5. استخدام الـ Hooks

```jsx
import { useAuth, usePermissions, useLogin } from './auth';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  const { hasPermission, hasRole } = usePermissions();
  const { login, isSubmitting, error } = useLogin();

  // فحص الصلاحيات
  if (hasPermission('create_patients')) {
    // عرض زر إضافة مريض
  }

  // فحص الدور
  if (hasRole('admin')) {
    // عرض إعدادات المدير
  }
}
```

## ملفات النظام

### Frontend
```
src/auth/
├── AuthContext.jsx      # السياق الرئيسي للمصادقة
├── ProtectedRoute.jsx   # مكونات حماية الصفحات
├── permissions.js       # تعريف الأدوار والصلاحيات
├── hooks.js            # Hooks مساعدة للمصادقة
└── index.js            # التصدير الرئيسي
```

### Backend
```
backend/src/
├── controllers/authController.js  # معالج المصادقة
├── middleware/auth.js            # وسط التحقق من التوكن
└── routes/authRoutes.js          # مسارات المصادقة
```

## نقاط النهاية API

### المصادقة
- `POST /api-token-auth/` - تسجيل الدخول
- `GET /api/auth/user/` - معلومات المستخدم الحالي
- `POST /auth/logout/` - تسجيل الخروج

### المستخدمين
- `POST /register/` - إنشاء مستخدم جديد
- `GET /users/` - قائمة المستخدمين

## الأمان

### التوكن
- استخدام توكن عشوائي آمن (40 حرف)
- حفظ التوكن في localStorage
- إزالة التوكن عند انتهاء الصلاحية أو تسجيل الخروج

### الصلاحيات
- فحص الصلاحيات في الواجهة والخلفية
- منع الوصول للصفحات بدون صلاحية
- تحديد الصلاحيات بناءً على الدور

### الحماية
- التحقق من التوكن في كل طلب
- إعادة توجيه للصفحة الرئيسية عند انتهاء الجلسة
- تشفير كلمات المرور

## مثال كامل

```jsx
import React from 'react';
import { 
  AuthProvider, 
  ProtectedRoute, 
  useAuth, 
  usePermissions 
} from './auth';

// مكون تسجيل الدخول
function LoginPage() {
  const { login, isSubmitting, error } = useLogin();

  const handleSubmit = async (values) => {
    const result = await login(values);
    if (result.success) {
      // تم تسجيل الدخول بنجاح
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* نموذج تسجيل الدخول */}
    </form>
  );
}

// لوحة التحكم الرئيسية
function Dashboard() {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();

  return (
    <div>
      <h1>مرحباً {user?.firstName}</h1>
      
      {hasPermission('view_patients') && (
        <button>عرض المرضى</button>
      )}
      
      {hasPermission('create_appointments') && (
        <button>حجز موعد</button>
      )}
    </div>
  );
}

// التطبيق الرئيسي
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminPanel />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
```

## التخصيص

### إضافة دور جديد
1. أضف الدور في `USER_ROLES` في `permissions.js`
2. حدد صلاحيات الدور في `ROLE_PERMISSIONS`
3. أضف الدور في قاعدة البيانات

### إضافة صلاحية جديدة
1. أضف الصلاحية في `PERMISSIONS` في `permissions.js`
2. أضفها للأدوار المناسبة في `ROLE_PERMISSIONS`
3. استخدمها في المكونات مع `hasPermission()`

## استكشاف الأخطاء

### مشاكل شائعة
1. **التوكن منتهي الصلاحية**: يتم إعادة التوجيه تلقائياً لصفحة تسجيل الدخول
2. **عدم وجود صلاحية**: يظهر صفحة "غير مصرح" أو يخفي المحتوى
3. **خطأ في الشبكة**: يظهر رسالة خطأ مناسبة

### سجلات المراقبة
- فحص وحدة التحكم للأخطاء
- مراقبة طلبات الشبكة
- التحقق من صحة التوكن

## الدعم

للمساعدة أو الإبلاغ عن مشاكل، يرجى مراجعة:
- [ملف التوثيق الفني](../TECHNICAL.md)
- [دليل التطوير](../README.md)
