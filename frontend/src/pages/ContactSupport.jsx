import { useState } from 'react';
import { Mail, MessageSquare, Send, Loader2, CheckCircle } from 'lucide-react';
import api from '../utils/api';

const ContactSupport = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.post('/contact', formData);
      setLoading(false);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="md:col-span-1 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Contact Support</h1>
            <p className="text-slate-500">
              Have questions or need help? We're here to assist you.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 shrink-0">
                <Mail size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Email Us</h3>
                <p className="text-sm text-slate-500 mb-1">For general inquiries</p>
                <a href="mailto:support@kbase.com" className="text-primary-600 font-medium hover:underline">
                  support@kbase.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 shrink-0">
                <MessageSquare size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Live Chat</h3>
                <p className="text-sm text-slate-500 mb-1">Available Mon-Fri, 9am-5pm</p>
                <span className="text-slate-400 text-sm">Currently Offline</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
            {success ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                  <CheckCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h2>
                <p className="text-slate-500 mb-6">
                  Thank you for contacting us. We'll get back to you as soon as possible.
                </p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="btn btn-primary"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Your Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows="5"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} /> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSupport;
