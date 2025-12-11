import { useState, useEffect } from 'react';
import api from '../utils/api';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Image as ImageIcon, 
  Folder, 
  Shield, 
  Check, 
  X, 
  Trash2, 
  Plus,
  ExternalLink,
  MessageSquare,
  Reply
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // New Banner State
  const [newBanner, setNewBanner] = useState({ title: '', content: '', link: '', visibleFrom: '', visibleTo: '' });
  // New Category State
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', description: '' });
  // New Admin State
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '' });
  // Message Reply State
  const [replyText, setReplyText] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'posts') {
        const res = await api.get('/posts');
        setPosts(res.data.posts);
      } else if (activeTab === 'users') {
        const { data } = await api.get('/users');
        setUsers(data.users);
      } else if (activeTab === 'banners') {
        const { data } = await api.get('/banners');
        setBanners(data);
      } else if (activeTab === 'categories') {
        const { data } = await api.get('/categories');
        setCategories(data);
      } else if (activeTab === 'messages') {
        const { data } = await api.get('/contact');
        setMessages(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (window.confirm('Approve this post?')) {
      await api.post(`/posts/${id}/approve`);
      fetchData();
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      await api.post(`/posts/${id}/reject`, { reason });
      fetchData();
    }
  };

  const handleDeletePost = async (id) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        await api.delete(`/posts/${id}`);
        fetchData();
      } catch (error) {
        console.error('Failed to delete post', error);
        alert('Failed to delete post');
      }
    }
  };

  const handleCreateBanner = async (e) => {
    e.preventDefault();
    await api.post('/banners', newBanner);
    setNewBanner({ title: '', content: '', link: '', visibleFrom: '', visibleTo: '' });
    fetchData();
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    await api.post('/categories', newCategory);
    setNewCategory({ name: '', slug: '', description: '' });
    fetchData();
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    await api.post('/admins', newAdmin);
    setNewAdmin({ name: '', email: '' });
    alert('Admin created and email sent');
  };

  const handleReplyMessage = async (e) => {
    e.preventDefault();
    if (!selectedMessage) return;
    
    try {
      await api.post(`/contact/${selectedMessage._id}/reply`, { message: replyText });
      alert('Reply sent successfully');
      setReplyText('');
      setSelectedMessage(null);
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Failed to send reply');
    }
  };

  const handleDeleteMessage = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await api.delete(`/contact/${id}`);
        fetchData();
      } catch (error) {
        console.error(error);
        alert('Failed to delete message');
      }
    }
  };

  const tabs = [
    { id: 'posts', label: 'Posts', icon: FileText },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'banners', label: 'Banners', icon: ImageIcon },
    { id: 'categories', label: 'Categories', icon: Folder },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'admins', label: 'Admins', icon: Shield },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500">Manage your application content and users</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-2 space-y-1 sticky top-24">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              {activeTab === 'posts' && (
                <div className="p-6">
                  <h2 className="text-lg font-bold mb-6">Manage Posts</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="pb-4 font-semibold text-slate-500 text-sm">Title</th>
                          <th className="pb-4 font-semibold text-slate-500 text-sm">Author</th>
                          <th className="pb-4 font-semibold text-slate-500 text-sm">Status</th>
                          <th className="pb-4 font-semibold text-slate-500 text-sm text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {posts.map((post) => (
                          <tr key={post._id} className="group hover:bg-slate-50">
                            <td className="py-4 pr-4">
                              <div className="font-medium text-slate-900">{post.title}</div>
                              <div className="text-xs text-slate-500">{format(new Date(post.createdAt), 'MMM d, yyyy')}</div>
                            </td>
                            <td className="py-4 pr-4 text-slate-600">{post.authorId?.name}</td>
                            <td className="py-4 pr-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                post.status === 'published' ? 'bg-green-100 text-green-800' :
                                post.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {post.status}
                              </span>
                            </td>
                            <td className="py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {post.status === 'pending' && (
                                  <>
                                    <button onClick={() => handleApprove(post._id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Approve">
                                      <Check size={16} />
                                    </button>
                                    <button onClick={() => handleReject(post._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Reject">
                                      <X size={16} />
                                    </button>
                                  </>
                                )}
                                <a href={`/post/${post._id}`} target="_blank" rel="noreferrer" className="p-1.5 text-primary-600 hover:bg-primary-50 rounded" title="View">
                                  <ExternalLink size={16} />
                                </a>
                                <button onClick={() => handleDeletePost(post._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div className="p-6">
                  <h2 className="text-lg font-bold mb-6">Manage Users</h2>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="pb-4 font-semibold text-slate-500 text-sm">Name</th>
                        <th className="pb-4 font-semibold text-slate-500 text-sm">Email</th>
                        <th className="pb-4 font-semibold text-slate-500 text-sm">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.map((u) => (
                        <tr key={u._id} className="hover:bg-slate-50">
                          <td className="py-4 font-medium text-slate-900">{u.name}</td>
                          <td className="py-4 text-slate-600">{u.email}</td>
                          <td className="py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 capitalize">
                              {u.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'banners' && (
                <div className="p-6">
                  <h2 className="text-lg font-bold mb-6">Manage Banners</h2>
                  <form onSubmit={handleCreateBanner} className="mb-8 bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-4">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Create New Banner</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" placeholder="Title" value={newBanner.title} onChange={e => setNewBanner({...newBanner, title: e.target.value})} className="input-field" required />
                      <input type="text" placeholder="Link (optional)" value={newBanner.link} onChange={e => setNewBanner({...newBanner, link: e.target.value})} className="input-field" />
                    </div>
                    <textarea placeholder="Content" value={newBanner.content} onChange={e => setNewBanner({...newBanner, content: e.target.value})} className="input-field min-h-[100px]" required />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">Visible From</label>
                        <input type="date" value={newBanner.visibleFrom} onChange={e => setNewBanner({...newBanner, visibleFrom: e.target.value})} className="input-field" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">Visible To</label>
                        <input type="date" value={newBanner.visibleTo} onChange={e => setNewBanner({...newBanner, visibleTo: e.target.value})} className="input-field" />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary">
                      <Plus size={18} className="mr-2" /> Create Banner
                    </button>
                  </form>
                  
                  <div className="space-y-4">
                    {banners.map(b => (
                      <div key={b._id} className="border border-slate-200 p-4 rounded-lg flex justify-between items-center bg-white hover:shadow-sm transition-shadow">
                        <div>
                          <h3 className="font-bold text-slate-900">{b.title}</h3>
                          <p className="text-slate-600 text-sm mt-1">{b.content}</p>
                        </div>
                        <button onClick={async () => { await api.delete(`/banners/${b._id}`); fetchData(); }} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'categories' && (
                <div className="p-6">
                  <h2 className="text-lg font-bold mb-6">Manage Categories</h2>
                  <form onSubmit={handleCreateCategory} className="mb-8 bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Add Category</h3>
                    <div className="flex flex-col md:flex-row gap-4">
                      <input type="text" placeholder="Name" value={newCategory.name} onChange={e => setNewCategory({...newCategory, name: e.target.value})} className="input-field flex-1" required />
                      <input type="text" placeholder="Slug" value={newCategory.slug} onChange={e => setNewCategory({...newCategory, slug: e.target.value})} className="input-field flex-1" required />
                      <input type="text" placeholder="Description" value={newCategory.description} onChange={e => setNewCategory({...newCategory, description: e.target.value})} className="input-field flex-1" />
                      <button type="submit" className="btn btn-primary whitespace-nowrap">
                        <Plus size={18} className="mr-2" /> Add
                      </button>
                    </div>
                  </form>

                  <ul className="divide-y divide-slate-100">
                    {categories.map(c => (
                      <li key={c._id} className="flex justify-between items-center py-3 px-2 hover:bg-slate-50 rounded-lg">
                        <div>
                          <span className="font-medium text-slate-900">{c.name}</span>
                          <span className="text-slate-400 text-sm ml-2">({c.slug})</span>
                        </div>
                        <button onClick={async () => { await api.delete(`/categories/${c._id}`); fetchData(); }} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'messages' && (
                <div className="p-6">
                  <h2 className="text-lg font-bold mb-6">Support Messages</h2>
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div key={msg._id} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-slate-900">{msg.subject}</h3>
                            <div className="text-sm text-slate-500 flex gap-2">
                              <span>{msg.name} ({msg.email})</span>
                              <span>•</span>
                              <span>{format(new Date(msg.createdAt), 'MMM d, yyyy HH:mm')}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              msg.status === 'replied' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {msg.status}
                            </span>
                            <button 
                              onClick={() => handleDeleteMessage(msg._id)}
                              className="text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="bg-slate-50 p-3 rounded text-slate-700 text-sm mb-4 whitespace-pre-wrap">
                          {msg.message}
                        </div>

                        {msg.status === 'replied' && msg.reply && (
                          <div className="ml-8 mb-4 bg-green-50 p-3 rounded border border-green-100">
                            <div className="text-xs font-bold text-green-800 mb-1">
                              Replied on {format(new Date(msg.reply.repliedAt), 'MMM d, yyyy HH:mm')}
                            </div>
                            <div className="text-sm text-green-900 whitespace-pre-wrap">
                              {msg.reply.message}
                            </div>
                          </div>
                        )}

                        {selectedMessage?._id === msg._id ? (
                          <form onSubmit={handleReplyMessage} className="mt-4 space-y-3">
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Type your reply here..."
                              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 min-h-[100px]"
                              required
                            />
                            <div className="flex gap-2">
                              <button type="submit" className="btn btn-primary btn-sm">
                                Send Reply
                              </button>
                              <button 
                                type="button" 
                                onClick={() => {
                                  setSelectedMessage(null);
                                  setReplyText('');
                                }}
                                className="btn btn-ghost btn-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          msg.status !== 'replied' && (
                            <button 
                              onClick={() => setSelectedMessage(msg)}
                              className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
                            >
                              <Reply size={16} /> Reply
                            </button>
                          )
                        )}
                      </div>
                    ))}
                    {messages.length === 0 && (
                      <div className="text-center py-12 text-slate-500">
                        No messages found
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'admins' && (
                <div className="p-6">
                  <h2 className="text-lg font-bold mb-6">Create Admin</h2>
                  <div className="max-w-md">
                    <form onSubmit={handleCreateAdmin} className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                        <input type="text" value={newAdmin.name} onChange={e => setNewAdmin({...newAdmin, name: e.target.value})} className="input-field" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input type="email" value={newAdmin.email} onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} className="input-field" required />
                      </div>
                      <button type="submit" className="btn btn-primary w-full">
                        Create Admin & Send Email
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
