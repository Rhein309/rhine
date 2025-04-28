import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PublicLayout from './layouts/PublicLayout';
import ParentLayout from './layouts/ParentLayout';
import TeacherLayout from './layouts/TeacherLayout';
import AdminLayout from './layouts/AdminLayout';
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import CoursesPage from './pages/public/CoursesPage';
import LocationPage from './pages/public/LocationPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ParentDashboard from './pages/parent/Dashboard';
import ParentProfilePage from './pages/parent/ProfilePage';
import ParentWalletPage from './pages/parent/WalletPage';
import ParentNotificationsPage from './pages/parent/NotificationsPage';
import ParentCoursesPage from './pages/parent/CoursesPage';
import ParentBookingsPage from './pages/parent/BookingsPage';
import ParentMaterialsPage from './pages/parent/MaterialsPage';
import ParentAttendancePage from './pages/parent/AttendancePage';
import ParentGradesPage from './pages/parent/GradesPage';
import ParentReportsPage from './pages/parent/ReportsPage';
import ParentForumPage from './pages/parent/ForumPage';
import ParentEnquiriesPage from './pages/parent/EnquiriesPage';
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherProfilePage from './pages/teacher/ProfilePage';
import TeacherOverviewPage from './pages/teacher/OverviewPage';
import TeacherClassesPage from './pages/teacher/ClassesPage';
import TeacherNotificationsPage from './pages/teacher/NotificationsPage';
import TeacherMaterialsPage from './pages/teacher/MaterialsPage';
import TeacherAttendancePage from './pages/teacher/AttendancePage';
import TeacherGradesPage from './pages/teacher/GradesPage';
import TeacherReportsPage from './pages/teacher/ReportsPage';
import TeacherPerformancePage from './pages/teacher/PerformancePage';
import TeacherForumPage from './pages/teacher/ForumPage';
import TeacherEnquiriesPage from './pages/teacher/EnquiriesPage';
import AdminDashboard from './pages/admin/Dashboard';
import AdminStudentsPage from './pages/admin/StudentsPage';
import AdminTeachersPage from './pages/admin/TeachersPage';
import AdminCoursesPage from './pages/admin/CoursesPage';
import AdminAddCoursePage from './pages/admin/AddCoursePage';
import AdminAddTeacherPage from './pages/admin/AddTeacherPage';
import AdminAddStudentPage from './pages/admin/AddStudentPage';
import AdminSettingsPage from './pages/admin/SettingsPage';
import AdminNotificationsPage from './pages/admin/NotificationsPage';
import AdminSendNotificationPage from './pages/admin/SendNotificationPage';
import AdminReportsPage from './pages/admin/ReportsPage';
import AdminLogsPage from './pages/admin/LogsPage';
import AdminMessagesPage from './pages/admin/MessagesPage';
import AdminSupportPage from './pages/admin/SupportPage';

const PrivateRoute = ({ children, allowedTypes }: { children: React.ReactNode; allowedTypes: string[] }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !profile || !allowedTypes.includes(profile.user_type)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile } = useAuth();

  if (user && profile) {
    switch (profile.user_type) {
      case 'teacher':
        return <Navigate to="/teacher" replace />;
      case 'parent':
        return <Navigate to="/parent" replace />;
      case 'admin':
        return <Navigate to="/admin" replace />;
    }
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<PublicRoute><HomePage /></PublicRoute>} />
            <Route path="/about" element={<PublicRoute><AboutPage /></PublicRoute>} />
            <Route path="/courses" element={<PublicRoute><CoursesPage /></PublicRoute>} />
            <Route path="/location" element={<PublicRoute><LocationPage /></PublicRoute>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>

          {/* Parent Routes */}
          <Route
            path="/parent"
            element={
              <PrivateRoute allowedTypes={['parent']}>
                <ParentLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<ParentDashboard />} />
            <Route path="profile" element={<ParentProfilePage />} />
            <Route path="wallet" element={<ParentWalletPage />} />
            <Route path="notifications" element={<ParentNotificationsPage />} />
            <Route path="courses" element={<ParentCoursesPage />} />
            <Route path="bookings" element={<ParentBookingsPage />} />
            <Route path="materials" element={<ParentMaterialsPage />} />
            <Route path="attendance" element={<ParentAttendancePage />} />
            <Route path="grades" element={<ParentGradesPage />} />
            <Route path="reports" element={<ParentReportsPage />} />
            <Route path="forum" element={<ParentForumPage />} />
            <Route path="enquiries" element={<ParentEnquiriesPage />} />
          </Route>

          {/* Teacher Routes */}
          <Route
            path="/teacher"
            element={
              <PrivateRoute allowedTypes={['teacher']}>
                <TeacherLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<TeacherDashboard />} />
            <Route path="profile" element={<TeacherProfilePage />} />
            <Route path="overview" element={<TeacherOverviewPage />} />
            <Route path="classes" element={<TeacherClassesPage />} />
            <Route path="notifications" element={<TeacherNotificationsPage />} />
            <Route path="materials" element={<TeacherMaterialsPage />} />
            <Route path="attendance" element={<TeacherAttendancePage />} />
            <Route path="grades" element={<TeacherGradesPage />} />
            <Route path="reports" element={<TeacherReportsPage />} />
            <Route path="performance" element={<TeacherPerformancePage />} />
            <Route path="forum" element={<TeacherForumPage />} />
            <Route path="enquiries" element={<TeacherEnquiriesPage />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedTypes={['admin']}>
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="students" element={<AdminStudentsPage />} />
            <Route path="students/new" element={<AdminAddStudentPage />} />
            <Route path="teachers" element={<AdminTeachersPage />} />
            <Route path="teachers/new" element={<AdminAddTeacherPage />} />
            <Route path="courses" element={<AdminCoursesPage />} />
            <Route path="courses/new" element={<AdminAddCoursePage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="notifications" element={<AdminNotificationsPage />} />
            <Route path="notifications/new" element={<AdminSendNotificationPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="logs" element={<AdminLogsPage />} />
            <Route path="messages" element={<AdminMessagesPage />} />
            <Route path="support" element={<AdminSupportPage />} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;