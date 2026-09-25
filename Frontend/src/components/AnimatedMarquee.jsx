const MarqueeItem = ({ children }) => (
    <div className="flex-shrink-0 text-3xl md:text-5xl font-primary tracking-widest uppercase mx-8">
        {children}
    </div>
);

const AnimatedMarquee = () => {
  return (
    <div className="relative flex overflow-x-hidden bg-brand-accent text-black py-4 my-20 border-y-2 border-brand-accent transform -rotate-2">
      <div className="animate-marquee whitespace-nowrap flex">
        <MarqueeItem>Minimalist</MarqueeItem>
        <MarqueeItem>Iconoclast</MarqueeItem>
        <MarqueeItem>Defiant</MarqueeItem>
        <MarqueeItem>Cyber-Chic</MarqueeItem>
        <MarqueeItem>Rebellion</MarqueeItem>
        <MarqueeItem>Statement</MarqueeItem>
        <MarqueeItem>Loomly</MarqueeItem>
      </div>
      <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex">
        <MarqueeItem>Minimalist</MarqueeItem>
        <MarqueeItem>Iconoclast</MarqueeItem>
        <MarqueeItem>Defiant</MarqueeItem>
        <MarqueeItem>Cyber-Chic</MarqueeItem>
        <MarqueeItem>Rebellion</MarqueeItem>
        <MarqueeItem>Statement</MarqueeItem>
        <MarqueeItem>Loomly</MarqueeItem>
      </div>
    </div>
  );
};

export default AnimatedMarquee;