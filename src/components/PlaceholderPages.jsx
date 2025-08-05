import React from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

// Generic placeholder component
const PlaceholderPage = ({ title, description }) => (
  <div>
    <Title level={2}>{title}</Title>
    <Card>
      <p>{description || 'هذه الصفحة قيد التطوير...'}</p>
    </Card>
  </div>
);

// OPD Management
export const EditOPDDetails = () => <PlaceholderPage title="تعديل تفاصيل العيادة الخارجية" />;
export const PatientMedicalRecord = () => <PlaceholderPage title="السجل الطبي للمريض" />;
export const RescheduleOPD = () => <PlaceholderPage title="إعادة جدولة العيادة الخارجية" />;

// IPD Management
export const IPDManagement = () => <PlaceholderPage title="إدارة المرضى الداخليين" />;
export const NewAdmissionAPI = () => <PlaceholderPage title="إدخال جديد" />;
export const IPDPatientDetails = () => <PlaceholderPage title="تفاصيل المريض الداخلي" />;
export const UpdateStatus = () => <PlaceholderPage title="تحديث الحالة" />;
export const WardManagement = () => <PlaceholderPage title="إدارة الأجنحة" />;
export const DischargeManagement = () => <PlaceholderPage title="إدارة الخروج" />;
export const DailyRounds = () => <PlaceholderPage title="الجولات اليومية" />;

// Human Resources
export const HumanResources = () => <PlaceholderPage title="الموارد البشرية" />;

// Reports & Analytics
export const ReportsAnalytics = () => <PlaceholderPage title="التقارير والتحليلات" />;

// Settings
export const Settings = () => <PlaceholderPage title="الإعدادات" />;

// Profile
export const ProfilePage = () => <PlaceholderPage title="الملف الشخصي" />;

// Finance
export const IncomeManagement = () => <PlaceholderPage title="إدارة الإيرادات" />;
export const ExpenseManagement = () => <PlaceholderPage title="إدارة المصروفات" />;

// Billing
export const BillingSystem = () => <PlaceholderPage title="نظام الفواتير" />;

// Inventory
export const Inventory = () => <PlaceholderPage title="المخزون" />;

// Operation Theatre
export const OperationTheatre = () => <PlaceholderPage title="غرفة العمليات" />;

// Pharmacy
export const Pharmacy = () => <PlaceholderPage title="الصيدلية" />;

// Diagnostics
export const Pathology = () => <PlaceholderPage title="علم الأمراض" />;
export const Radiology = () => <PlaceholderPage title="الأشعة" />;
export const BloodBank = () => <PlaceholderPage title="بنك الدم" />;

// Insurance
export const Insurance = () => <PlaceholderPage title="التأمين" />;
export const InsuranceTPAManagement = () => <PlaceholderPage title="إدارة شركات التأمين" />;
export const ClaimsManagement = () => <PlaceholderPage title="إدارة المطالبات" />;
export const InsuranceReports = () => <PlaceholderPage title="تقارير التأمين" />;
export const InsuranceSettings = () => <PlaceholderPage title="إعدادات التأمين" />;

// Medical Services
export const Physiotherapy = () => <PlaceholderPage title="العلاج الطبيعي" />;
export const Nursery = () => <PlaceholderPage title="الحضانة" />;
export const ICU = () => <PlaceholderPage title="العناية المركزة" />;

export default PlaceholderPage;
