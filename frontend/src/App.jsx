import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOtp from './pages/VerifyOtp';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ContactSupport from './pages/ContactSupport';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import ChatWidget from './components/ChatWidget';

function App() {
  return (
    <AuthProvider>
      <ChatWidget />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="verify-otp" element={<VerifyOtp />} />
          <Route path="post/:id" element={<PostDetail />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsOfService />} />
          <Route path="contact" element={<ContactSupport />} />

          {/* User Routes */}
          <Route element={<ProtectedRoute roles={['user', 'admin', 'superadmin']} />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="dashboard/posts/new" element={<CreatePost />} />
            <Route path="dashboard/posts/:id/edit" element={<EditPost />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute roles={['admin', 'superadmin']} />}>
            <Route path="admin" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
