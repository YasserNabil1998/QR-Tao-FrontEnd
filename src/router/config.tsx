import { lazy } from 'react'

// Lazy load components
const HomePage = lazy(() => import('../pages/home/page'))
const AboutPage = lazy(() => import('../pages/about/page'))
const ContactPage = lazy(() => import('../pages/contact/page'))
const MenuPage = lazy(() => import('../pages/menu/page'))
const LoginPage = lazy(() => import('../pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'))
const AdminDashboard = lazy(() => import('../pages/dashboard/admin/page'))
const CashierDashboard = lazy(() => import('../pages/dashboard/cashier/page'))
const ChefDashboard = lazy(() => import('../pages/dashboard/chef/page'))
const NotFoundPage = lazy(() => import('../pages/NotFound'))

// Legal pages
const PrivacyPolicyPage = lazy(() => import('../pages/legal/privacy/page'))
const TermsOfServicePage = lazy(() => import('../pages/legal/terms/page'))
const CookiePolicyPage = lazy(() => import('../pages/legal/cookies/page'))
const GDPRPage = lazy(() => import('../pages/legal/gdpr/page'))
const SecurityPage = lazy(() => import('../pages/legal/security/page'))
const CompliancePage = lazy(() => import('../pages/legal/compliance/page'))

const routes = [
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/about',
    element: <AboutPage />
  },
  {
    path: '/contact',
    element: <ContactPage />
  },
  {
    path: '/menu',
    element: <MenuPage />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  },
  {
    path: '/dashboard/admin',
    element: <AdminDashboard />
  },
  {
    path: '/dashboard/cashier',
    element: <CashierDashboard />
  },
  {
    path: '/dashboard/chef',
    element: <ChefDashboard />
  },
  {
    path: '/legal/privacy',
    element: <PrivacyPolicyPage />
  },
  {
    path: '/legal/terms',
    element: <TermsOfServicePage />
  },
  {
    path: '/legal/cookies',
    element: <CookiePolicyPage />
  },
  {
    path: '/legal/gdpr',
    element: <GDPRPage />
  },
  {
    path: '/legal/security',
    element: <SecurityPage />
  },
  {
    path: '/legal/compliance',
    element: <CompliancePage />
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
]

export default routes
