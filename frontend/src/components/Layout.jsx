import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="h-dvh flex flex-col bg-background font-sans text-slate-900 overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto w-full">
        <div className="container mx-auto px-4 py-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
