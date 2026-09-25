import { Instagram, Facebook, Twitter, Mail } from 'lucide-react';

const SocialIcons = () => {
  const iconClasses = "w-6 h-6 text-gray-400 hover:text-brand-accent transition-colors duration-300";

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden md:flex">
      <div className="flex flex-col space-y-6">
        <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram className={iconClasses} /></a>
        <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook className={iconClasses} /></a>
        <a href="https://x.com/" target="_blank" rel="noreferrer" aria-label="X (formerly Twitter)"><Twitter className={iconClasses} /></a>
        <a href="mailto:hello@loomly.com" aria-label="Email Loomly"><Mail className={iconClasses} /></a>
      </div>
    </div>
  );
};

export default SocialIcons;