import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Search, Calendar, User, ArrowRight, Tag } from 'lucide-react';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, bannersRes, categoriesRes] = await Promise.all([
          // Explicitly fetch only published posts for the home feed
          api.get(`/posts?pageNumber=${page}&keyword=${keyword}&category=${selectedCategory}&status=published`),
          api.get('/banners'),
          api.get('/categories'),
        ]);

        setPosts(postsRes.data.posts);
        setPages(postsRes.data.pages);
        setBanners(bannersRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, keyword, selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Hero / Banners Section */}
      {banners.length > 0 && (
        <div className="grid gap-6">
          {banners.map((banner) => (
            <div key={banner._id} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-primary-800 text-white shadow-xl shadow-primary-900/20">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl"></div>
              
              <div className="relative p-8 md:p-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">{banner.title}</h2>
                <p className="text-primary-100 text-lg mb-6 max-w-2xl">{banner.content}</p>
                {banner.link && (
                  <a 
                    href={banner.link} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors shadow-sm"
                  >
                    Learn More <ArrowRight size={18} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-slate-800">Latest Articles</h1>
            
            <form onSubmit={handleSearch} className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search articles..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="input-field pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </form>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-64 bg-slate-100 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
              <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Search className="text-slate-400" size={24} />
              </div>
              <h3 className="text-lg font-medium text-slate-900">No articles found</h3>
              <p className="text-slate-500">Try adjusting your search or category filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <Link 
                  to={`/post/${post._id}`} 
                  key={post._id} 
                  className="group card hover:shadow-md hover:border-primary-200 transition-all duration-300 flex flex-col h-full"
                >
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full uppercase tracking-wide">
                        {post.categoryId?.name || 'General'}
                      </span>
                      <span className="text-slate-400 text-xs flex items-center gap-1">
                        <Calendar size={12} />
                        {format(new Date(post.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 text-slate-800 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-slate-600 mb-6 line-clamp-3 flex-1">
                      {post.content.substring(0, 150)}...
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                          <User size={14} />
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                          {post.authorId?.name || 'Unknown'}
                        </span>
                      </div>
                      <span className="text-primary-600 text-sm font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Read <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center mt-12 gap-2">
              {[...Array(pages).keys()].map((x) => (
                <button
                  key={x + 1}
                  onClick={() => setPage(x + 1)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    page === x + 1
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {x + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 sticky top-24">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Tag size={20} className="text-primary-500" />
              Categories
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === '' 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat._id)}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat._id 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
