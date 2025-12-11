import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Edit2, 
  Eye,
  User,
  Mail,
  Shield
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch only my posts (includes pending/rejected)
        const { data } = await api.get(`/posts?authorId=${user._id}`);
        setPosts(data.posts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchPosts();
    }
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
            <CheckCircle size={12} /> Published
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
            <XCircle size={12} /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200">
            <Clock size={12} /> Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Dashboard</h1>
          <p className="text-slate-500">Manage your profile and contributions</p>
        </div>
        <Link 
          to="/dashboard/posts/new" 
          className="btn btn-primary shadow-lg shadow-primary-500/20 flex items-center gap-2"
        >
          <Plus size={18} /> Create New Post
        </Link>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <User size={20} className="text-primary-500" /> Profile Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
            <div className="font-semibold text-slate-900 flex items-center gap-2">
              <User size={16} className="text-slate-400" /> {user.name}
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
            <div className="font-semibold text-slate-900 flex items-center gap-2">
              <Mail size={16} className="text-slate-400" /> {user.email}
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Account Role</label>
            <div className="font-semibold text-slate-900 flex items-center gap-2 capitalize">
              <Shield size={16} className="text-slate-400" /> {user.role}
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <FileText size={24} className="text-primary-500" /> My Posts
        </h2>
        
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-dashed border-slate-300 p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-slate-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No posts yet</h3>
            <p className="text-slate-500 mb-6">Share your knowledge with the community by creating your first post.</p>
            <Link to="/dashboard/posts/new" className="btn btn-primary">
              Start Writing
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 font-semibold text-slate-500 text-sm">Title</th>
                    <th className="px-6 py-4 font-semibold text-slate-500 text-sm">Status</th>
                    <th className="px-6 py-4 font-semibold text-slate-500 text-sm">Date Created</th>
                    <th className="px-6 py-4 font-semibold text-slate-500 text-sm text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {posts.map((post) => (
                    <tr key={post._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{post.title}</div>
                        {post.status === 'rejected' && post.rejectReason && (
                          <div className="text-xs text-red-600 mt-1 bg-red-50 p-2 rounded border border-red-100 inline-block">
                            <strong>Reason:</strong> {post.rejectReason}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(post.status)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {format(new Date(post.createdAt), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            to={`/post/${post._id}`} 
                            className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye size={18} />
                          </Link>
                          {post.status !== 'published' && (
                            <Link 
                              to={`/dashboard/posts/${post._id}/edit`} 
                              className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
