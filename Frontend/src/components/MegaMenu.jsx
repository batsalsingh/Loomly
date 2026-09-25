import { Link } from 'react-router-dom';

const MegaMenu = ({ menuData }) => {
  if (!menuData || !menuData.columns) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 w-full bg-black/70 backdrop-blur-xl border-t border-gray-800 shadow-lg animate-fade-in-down">
      <div className={`container mx-auto p-8 grid gap-x-8 ${menuData.id === 'collections' ? 'grid-cols-1' : 'grid-cols-5'}`}>
        {menuData.columns.map((column, index) => (
          <div key={index} className={menuData.id === 'collections' ? 'w-full' : ''}>
            <h3 className="font-primary tracking-widest text-brand-accent mb-4 uppercase">
              {column.title}
            </h3>
            <ul className={menuData.id === 'collections' ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-3' : 'space-y-3'}>
              {column.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <Link 
                    to={link.href} 
                    className="text-gray-300 hover:text-white transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MegaMenu;