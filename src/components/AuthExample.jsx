import React from 'react';
import { Card, Space, Button, Typography, Tag } from 'antd';
import { useAuth } from '../auth/AuthContext';
import { usePermissions, useUserProfile } from '../auth/hooks';
import { RoleGuard, PermissionGuard } from '../auth/ProtectedRoute';
import { USER_ROLES, PERMISSIONS } from '../auth/permissions';

const { Title, Text } = Typography;

const AuthExample = () => {
  const { user, isAuthenticated } = useAuth();
  const { hasPermission, hasRole, userRole, permissions } = usePermissions();
  const { isAdmin, isDoctor, isNurse, isReceptionist } = useUserProfile();

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>مثال على نظام التصريحات والأدوار</Title>
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* User Info */}
        <Card title="معلومات المستخدم الحالي">
          {isAuthenticated ? (
            <Space direction="vertical">
              <Text><strong>اسم المستخدم:</strong> {user?.username}</Text>
              <Text><strong>الدور:</strong> <Tag color="blue">{userRole}</Tag></Text>
              <Text><strong>الصلاحيات:</strong></Text>
              <div>
                {permissions.map(permission => (
                  <Tag key={permission} color="green" style={{ margin: '2px' }}>
                    {permission}
                  </Tag>
                ))}
              </div>
            </Space>
          ) : (
            <Text>غير مسجل الدخول</Text>
          )}
        </Card>

        {/* Role-based content */}
        <Card title="المحتوى حسب الدور">
          <Space direction="vertical" size="middle">
            <RoleGuard allowedRoles={[USER_ROLES.ADMIN]}>
              <Card size="small" style={{ backgroundColor: '#f6ffed' }}>
                <Text strong>محتوى المديرين فقط</Text>
                <br />
                <Button type="primary" size="small">إدارة النظام</Button>
              </Card>
            </RoleGuard>

            <RoleGuard allowedRoles={[USER_ROLES.DOCTOR, USER_ROLES.NURSE]}>
              <Card size="small" style={{ backgroundColor: '#e6f7ff' }}>
                <Text strong>محتوى الأطباء والممرضات</Text>
                <br />
                <Button type="default" size="small">عرض السجلات الطبية</Button>
              </Card>
            </RoleGuard>

            <RoleGuard allowedRoles={[USER_ROLES.RECEPTIONIST]}>
              <Card size="small" style={{ backgroundColor: '#fff7e6' }}>
                <Text strong>محتوى موظفي الاستقبال</Text>
                <br />
                <Button type="default" size="small">حجز المواعيد</Button>
              </Card>
            </RoleGuard>
          </Space>
        </Card>

        {/* Permission-based content */}
        <Card title="المحتوى حسب الصلاحيات">
          <Space direction="vertical" size="middle">
            <PermissionGuard requiredPermissions={[PERMISSIONS.CREATE_PATIENTS]}>
              <Card size="small" style={{ backgroundColor: '#f6ffed' }}>
                <Text strong>إضافة مرضى جدد</Text>
                <br />
                <Button type="primary" size="small">إضافة مريض</Button>
              </Card>
            </PermissionGuard>

            <PermissionGuard requiredPermissions={[PERMISSIONS.VIEW_REPORTS]}>
              <Card size="small" style={{ backgroundColor: '#e6f7ff' }}>
                <Text strong>عرض التقارير</Text>
                <br />
                <Button type="default" size="small">عرض التقارير</Button>
              </Card>
            </PermissionGuard>

            <PermissionGuard requiredPermissions={[PERMISSIONS.SEND_SMS]}>
              <Card size="small" style={{ backgroundColor: '#fff7e6' }}>
                <Text strong>إرسال الرسائل النصية</Text>
                <br />
                <Button type="default" size="small">إرسال رسالة</Button>
              </Card>
            </PermissionGuard>

            <PermissionGuard requiredPermissions={[PERMISSIONS.DELETE_USERS]}>
              <Card size="small" style={{ backgroundColor: '#fff1f0' }}>
                <Text strong>حذف المستخدمين (خطير)</Text>
                <br />
                <Button danger size="small">حذف مستخدم</Button>
              </Card>
            </PermissionGuard>
          </Space>
        </Card>

        {/* Permission checks */}
        <Card title="فحص الصلاحيات">
          <Space direction="vertical">
            <Text>يمكنك عرض المرضى: {hasPermission(PERMISSIONS.VIEW_PATIENTS) ? '✅' : '❌'}</Text>
            <Text>يمكنك إنشاء مرضى: {hasPermission(PERMISSIONS.CREATE_PATIENTS) ? '✅' : '❌'}</Text>
            <Text>يمكنك حذف المرضى: {hasPermission(PERMISSIONS.DELETE_PATIENTS) ? '✅' : '❌'}</Text>
            <Text>يمكنك عرض التقارير: {hasPermission(PERMISSIONS.VIEW_REPORTS) ? '✅' : '❌'}</Text>
            <Text>يمكنك إرسال الرسائل: {hasPermission(PERMISSIONS.SEND_SMS) ? '✅' : '❌'}</Text>
          </Space>
        </Card>

        {/* Role checks */}
        <Card title="فحص الأدوار">
          <Space direction="vertical">
            <Text>أنت مدير: {isAdmin ? '✅' : '❌'}</Text>
            <Text>أنت طبيب: {isDoctor ? '✅' : '❌'}</Text>
            <Text>أنت ممرضة: {isNurse ? '✅' : '❌'}</Text>
            <Text>أنت موظف استقبال: {isReceptionist ? '✅' : '❌'}</Text>
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default AuthExample;
