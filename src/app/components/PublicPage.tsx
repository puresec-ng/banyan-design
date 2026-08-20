import Navbar from './Navbar';
import Footer from './Footer';
import CookieBanner from './CookieBanner';

export default function PublicPage({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={`min-h-screen bg-white ${className}`}>
      <Navbar />
      {children}
      <Footer />
      <CookieBanner />
    </main>
  );
}
