import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AuthLayout from "../layouts/AuthLayout";
import AppShell from "../layouts/AppShell";
import LandingPage from "../pages/shared/LandingPage";
import NotFoundPage from "../pages/shared/NotFoundPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import OtpVerificationPage from "../pages/auth/OtpVerificationPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import DashboardPage from "../pages/user/DashboardPage";
import ProfilePage from "../pages/user/ProfilePage";
import EditProfilePage from "../pages/user/EditProfilePage";
import ChangePasswordPage from "../pages/user/ChangePasswordPage";
import CreatePostPage from "../pages/user/CreatePostPage";
import ViewPostsPage from "../pages/user/ViewPostsPage";
import PostDetailsPage from "../pages/user/PostDetailsPage";
import EditPostPage from "../pages/user/EditPostPage";
import DraftsPage from "../pages/user/DraftsPage";
import NotificationsPage from "../pages/user/NotificationsPage";
import SessionManagementPage from "../pages/user/SessionManagementPage";
import ApprovalQueuePage from "../pages/manager/ApprovalQueuePage";
import DepartmentAnalyticsPage from "../pages/manager/DepartmentAnalyticsPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import UserManagementPage from "../pages/admin/UserManagementPage";
import RoleManagementPage from "../pages/admin/RoleManagementPage";
import KeyManagementPage from "../pages/admin/KeyManagementPage";
import AuditLogsPage from "../pages/admin/AuditLogsPage";
import IntegrityAlertsPage from "../pages/admin/IntegrityAlertsPage";
import SecurityAnalyticsPage from "../pages/admin/SecurityAnalyticsPage";
import CompanyOverviewPage from "../pages/admin/CompanyOverviewPage";
import EmployeeAnalyticsPage from "../pages/admin/EmployeeAnalyticsPage";
import SessionMonitoringPage from "../pages/admin/SessionMonitoringPage";
import BiometricLogsPage from "../pages/admin/BiometricLogsPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<OtpVerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route path="/profile/change-password" element={<ChangePasswordPage />} />
          <Route path="/posts/create" element={<CreatePostPage />} />
          <Route path="/posts" element={<ViewPostsPage />} />
          <Route path="/posts/:id" element={<PostDetailsPage />} />
          <Route path="/posts/:id/edit" element={<EditPostPage />} />
          <Route path="/drafts" element={<DraftsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/sessions" element={<SessionManagementPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={["MANAGER", "ADMIN"]} />}>
        <Route element={<AppShell />}>
          <Route path="/manager/approvals" element={<ApprovalQueuePage />} />
          <Route path="/manager/department-analytics" element={<DepartmentAnalyticsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
        <Route element={<AppShell />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<UserManagementPage />} />
          <Route path="/admin/roles" element={<RoleManagementPage />} />
          <Route path="/admin/keys" element={<KeyManagementPage />} />
          <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
          <Route path="/admin/integrity-alerts" element={<IntegrityAlertsPage />} />
          <Route path="/admin/security-analytics" element={<SecurityAnalyticsPage />} />
          <Route path="/admin/company-overview" element={<CompanyOverviewPage />} />
          <Route path="/admin/employee-analytics" element={<EmployeeAnalyticsPage />} />
          <Route path="/admin/sessions" element={<SessionMonitoringPage />} />
          <Route path="/admin/biometric-logs" element={<BiometricLogsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
      <Route path="/app" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRouter;

