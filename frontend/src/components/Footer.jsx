import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-3 shrink-0 z-40">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs md:text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-primary-600 rounded flex items-center justify-center text-white font-bold text-xs">
            K
          </div>
          <span className="font-semibold text-slate-700">kbase</span>
          <span className="hidden md:inline text-slate-300">|</span>
          <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
        </div>
        
        <div className="flex items-center gap-6">
          <Link to="/privacy" className="hover:text-primary-600 transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-primary-600 transition-colors">Terms of Service</Link>
          <Link to="/contact" className="hover:text-primary-600 transition-colors">Contact Support</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
