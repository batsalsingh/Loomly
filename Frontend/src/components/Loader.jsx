const Loader = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-24 h-24',
  };

  return (
    <span
      className={`inline-block shrink-0 animate-spin rounded-full border-2 border-brand-accent border-t-transparent ${sizeClasses[size] || sizeClasses.md} ${className}`}
      aria-hidden="true"
    ></span>
  );
};

export default Loader;