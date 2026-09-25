import { Link } from 'react-router-dom';

const Footer = () => {
  const footerLinkClasses = "text-gray-400 hover:text-brand-accent transition-all duration-300 hover:translate-x-2 inline-block hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]";
  return (
    <footer className="bg-gradient-to-t from-black via-red-950/20 to-black border-t-2 border-brand-accent/50 mt-24 py-16 px-4 relative overflow-hidden shadow-[0_-10px_40px_rgba(239,68,68,0.15)]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ef444408_1px,transparent_1px),linear-gradient(to_bottom,#ef444408_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-accent to-transparent animate-pulse"></div>
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left relative z-10">
        <div className="transform hover:scale-105 transition-transform duration-300">
          <h3 className="font-black text-2xl mb-4 tracking-wider bg-gradient-to-r from-brand-accent via-red-600 to-brand-accent bg-clip-text text-transparent animate-pulse drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">Loomly</h3>
          <p className="text-gray-400 text-sm leading-relaxed font-bold">Clean but crazy as fuck.</p>
        </div>
        <div>
          <h3 className="font-bold text-white mb-4 tracking-wider text-sm group-hover:text-brand-accent transition-colors border-l-2 border-brand-accent/50 pl-3">SHOP</h3>
          <ul className="space-y-2">
            <li><Link to="/style/old-money" className={footerLinkClasses}>Old Money</Link></li>
            <li><Link to="/style/streetwear" className={footerLinkClasses}>Streetwear</Link></li>
            <li><Link to="/style/ethnic" className={footerLinkClasses}>Ethnic</Link></li>
            <li><Link to="/style/formals" className={footerLinkClasses}>Formals</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-white mb-4 tracking-wider text-sm border-l-2 border-brand-accent/50 pl-3">ASSISTANCE</h3>
          <ul className="space-y-2">
            <li><Link to="/blog" className={footerLinkClasses}>Blog</Link></li>
            <li><Link to="/about" className={footerLinkClasses}>About Us</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-white mb-4 tracking-wider text-sm border-l-2 border-brand-accent/50 pl-3">POLICIES</h3>
          <ul className="space-y-2">
            <li><Link to="/terms" className={footerLinkClasses}>Terms & Conditions</Link></li>
            <li><Link to="/returns" className={footerLinkClasses}>Return & Exchange</Link></li>
            <li><Link to="/shipping" className={footerLinkClasses}>Shipping & Delivery</Link></li>
            <li><Link to="/privacy" className={footerLinkClasses}>Privacy Policy</Link></li>
            <li><Link to="/disclaimer" className={footerLinkClasses}>Disclaimer</Link></li>
          </ul>
        </div>
      </div>
      <div className="text-center pt-8 mt-8 border-t-2 border-brand-accent/30 relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-accent to-transparent"></div>
        <p className="text-gray-400 text-sm hover:text-brand-accent transition-colors duration-300">
          © {new Date().getFullYear()} <span className="font-bold text-brand-accent">Loomly</span>. All Rights Reserved. 
          <span className="block mt-2 text-xs text-gray-500 hover:text-brand-accent transition-colors">Not for the faint of heart. 🔥</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;