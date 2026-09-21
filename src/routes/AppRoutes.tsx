import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AppLayout from '../layouts/AppLayout';
import AuthLayout from '../layouts/AuthLayout';

// Pages
import LandingPage from '../pages/landing/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import TransactionsPage from '../pages/transactions/TransactionsPage';
import CategoriesPage from '../pages/categories/CategoriesPage';
import BudgetsPage from '../pages/budgets/BudgetsPage';
import RecurringPage from '../pages/recurring/RecurringPage';
import GoalsPage from '../pages/goals/GoalsPage';
import AnalyticsPage from '../pages/analytics/AnalyticsPage';
import ReportsPage from '../pages/reports/ReportsPage';
import NotificationsPage from '../pages/notifications/NotificationsPage';
import SettingsPage from '../pages/settings/SettingsPage';
import NotFoundPage from '../pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/landing" element={<LandingPage />} />

      {/* Public Authentication Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected Application Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/budgets" element={<BudgetsPage />} />
          <Route path="/recurring" element={<RecurringPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* Catch-all 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
