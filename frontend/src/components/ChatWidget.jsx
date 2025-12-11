import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ChatWidget = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting
      setIsTyping(true);
      setTimeout(() => {
        let greeting = "Hello! 👋 Welcome to kbase support. How can we help you today?";
        if (user) {
          greeting = `Hello ${user.name || user.email}! 👋 Welcome back. How can we help you with your account (${user.email}) today?`;
        }

        setMessages([
          {
            id: 1,
            text: greeting,
            sender: 'agent',
            timestamp: new Date()
          }
        ]);
        setIsTyping(false);
      }, 1000);
    }
  }, [isOpen, user]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      const responses = [
        "Thanks for reaching out! One of our team members will be with you shortly.",
        "I understand. Could you provide more details about that?",
        "That's a great question. Let me check our knowledge base for you.",
        "Please hold on a moment while I look into that.",
        "Is there anything else I can help you with?"
      ];
      
      // Simple keyword matching for better demo experience
      let responseText = responses[Math.floor(Math.random() * responses.length)];
      const lowerInput = userMsg.text.toLowerCase();
      
      if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        responseText = user ? `Hi ${user.name}! How are you doing today?` : "Hi there! How are you doing today?";
      } else if (lowerInput.includes('price') || lowerInput.includes('cost')) {
        responseText = "kbase is currently free to use! We might introduce premium features in the future.";
      } else if (lowerInput.includes('post') || lowerInput.includes('article')) {
        responseText = "You can create posts from your dashboard. Make sure you're logged in!";
      } else if (lowerInput.includes('bug') || lowerInput.includes('error')) {
        responseText = "I'm sorry to hear you're facing an issue. Could you describe the error message?";
      } else if (lowerInput.includes('email') || lowerInput.includes('account')) {
        responseText = user 
          ? `I see you are logged in as ${user.email}. Is this regarding your current account?` 
          : "Please log in so we can better assist you with your account details.";
      } else if (lowerInput.includes('reset') || lowerInput.includes('password')) {
        responseText = user
          ? `We can send a password reset link to ${user.email}. Would you like that?`
          : "You can reset your password from the login page.";
      }

      const agentMsg = {
        id: Date.now() + 1,
        text: responseText,
        sender: 'agent',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);
    }, 1500);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
        aria-label="Open Chat"
      >
        <MessageCircle size={28} />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 flex flex-col transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[500px]'}`}>
      {/* Header */}
      <div className="bg-primary-600 p-4 flex items-center justify-between text-white shrink-0 cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <User size={20} />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-primary-600 rounded-full"></div>
          </div>
          <div>
            <h3 className="font-bold text-sm">kbase Support</h3>
            <p className="text-xs text-primary-100">We typically reply in minutes</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Minimize2 size={18} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            <div className="text-center text-xs text-slate-400 my-4">
              <span>Today</span>
            </div>
            
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-primary-600 text-white rounded-tr-none' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              />
              <button 
                type="submit"
                disabled={!inputValue.trim()}
                className="p-2.5 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatWidget;
