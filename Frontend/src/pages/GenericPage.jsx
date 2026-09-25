const GenericPage = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-black text-white pt-40 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-5xl md:text-6xl font-primary tracking-widest text-center uppercase mb-12">{title}</h1>
        <div className="prose prose-invert prose-lg max-w-none text-gray-300 prose-headings:text-white prose-a:text-brand-accent hover:prose-a:text-white prose-strong:text-white">
          {children}
        </div>
      </div>
    </div>
  );
};

export default GenericPage;