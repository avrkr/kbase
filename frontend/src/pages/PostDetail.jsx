import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  User, 
  Folder, 
  ArrowLeft, 
  Clock,
  AlertCircle,
  Eye,
  ThumbsUp,
  MessageSquare,
  Send
} from 'lucide-react';

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

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

  const handleLike = async () => {
    try {
      const { data } = await api.post(`/posts/${id}/like`);
      setPost(prev => ({ ...prev, likes: data }));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const { data } = await api.post(`/posts/${id}/comment`, { text: commentText });
      setPost(prev => ({
        ...prev,
        comments: [...prev.comments, data]
      }));
      setCommentText('');
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment');
    } finally {
      setSubmittingComment(false);
    }
  };

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
        className="inline-flex items-center text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-6"
      >
        <ArrowLeft size={16} className="mr-1" /> Back to Articles
      </Link>

      <article className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <header className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border border-primary-100 dark:border-primary-800">
              <Folder size={12} /> {post.categoryId?.name || 'Uncategorized'}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Calendar size={12} /> {format(new Date(post.createdAt), 'MMMM d, yyyy')}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Clock size={12} /> {format(new Date(post.createdAt), 'h:mm a')}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 ml-auto">
              <Eye size={14} /> {post.views || 0} Views
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
              <User size={20} />
            </div>
            <div>
              <div className="font-medium text-slate-900 dark:text-slate-100">{post.authorId?.name || 'Unknown Author'}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Author</div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 md:p-10 prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary-600 dark:prose-a:text-primary-400 hover:prose-a:text-primary-700 dark:hover:prose-a:text-primary-300 prose-img:rounded-xl border-b border-slate-100 dark:border-slate-800">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        {/* Actions & Comments */}
        <div className="p-8 bg-slate-50/50 dark:bg-slate-900/50">
          {/* Like Button */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={handleLike}
              disabled={!user}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                user && post.likes?.includes(user._id)
                  ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-400'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ThumbsUp size={18} className={user && post.likes?.includes(user._id) ? 'fill-current' : ''} />
              {post.likes?.length || 0} Likes
            </button>
            {!user && <span className="text-sm text-slate-500 dark:text-slate-400">Login to like and comment</span>}
          </div>

          {/* Comments Section */}
          <div className="space-y-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <MessageSquare size={20} />
              Comments ({post.comments?.length || 0})
            </h3>

            {/* Comment Form */}
            {user && (
              <form onSubmit={handleCommentSubmit} className="flex gap-4">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-700 dark:text-primary-400 font-bold shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 min-h-[80px] bg-white dark:bg-slate-800 dark:text-slate-100"
                    required
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={submittingComment || !commentText.trim()}
                      className="btn btn-primary btn-sm flex items-center gap-2"
                    >
                      {submittingComment ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Send size={16} />
                      )}
                      Post Comment
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {post.comments?.map((comment, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold shrink-0">
                    {comment.user?.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{comment.user?.name || 'Unknown User'}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {format(new Date(comment.createdAt), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{comment.text}</p>
                  </div>
                </div>
              ))}
              {post.comments?.length === 0 && (
                <p className="text-slate-500 dark:text-slate-400 italic">No comments yet. Be the first to share your thoughts!</p>
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default PostDetail;
