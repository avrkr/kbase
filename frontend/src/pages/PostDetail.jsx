import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { 
  Calendar, 
  User, 
  Folder, 
  ArrowLeft, 
  Clock,
  AlertCircle
} from 'lucide-react';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        setPost(data);
      } catch (err) {
        setError('Post not found or you do not have permission to view it.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-red-50 border border-red-200 rounded-xl flex items-start gap-4">
        <AlertCircle className="text-red-600 shrink-0" size={24} />
        <div>
          <h3 className="text-lg font-semibold text-red-800 mb-1">Error Loading Post</h3>
          <p className="text-red-600">{error}</p>
          <Link to="/" className="text-red-700 font-medium hover:underline mt-4 inline-block">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <Link 
        to="/" 
        className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 transition-colors mb-6"
      >
        <ArrowLeft size={16} className="mr-1" /> Back to Articles
      </Link>

      <article className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Header */}
        <header className="p-8 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700 border border-primary-100">
              <Folder size={12} /> {post.categoryId?.name || 'Uncategorized'}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar size={12} /> {format(new Date(post.createdAt), 'MMMM d, yyyy')}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <Clock size={12} /> {format(new Date(post.createdAt), 'h:mm a')}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 border border-slate-300">
              <User size={20} />
            </div>
            <div>
              <div className="font-medium text-slate-900">{post.authorId?.name || 'Unknown Author'}</div>
              <div className="text-xs text-slate-500">Author</div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 md:p-10 prose prose-slate max-w-none prose-headings:font-bold prose-a:text-primary-600 hover:prose-a:text-primary-700 prose-img:rounded-xl">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
};

export default PostDetail;
