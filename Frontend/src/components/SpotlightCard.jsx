import { useEffect, useRef } from 'react';

const SpotlightCard = ({ children, className = '' }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const cardElement = cardRef.current;
    if (!cardElement) return;

    const handleMouseMove = (e) => {
      const rect = cardElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      cardElement.style.setProperty('--mouse-x', `${x}px`);
      cardElement.style.setProperty('--mouse-y', `${y}px`);
    };

    cardElement.addEventListener('mousemove', handleMouseMove);

    return () => {
      cardElement.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative rounded-md border border-gray-800 transition-all duration-300 before:absolute before:inset-0 before:rounded-md before:bg-[radial-gradient(250px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(255,0,255,0.2),transparent_100%)] before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 ${className}`}
      style={{ opacity: 1 }}
    >
      <div 
        className="absolute inset-px rounded-[6px] bg-black/95 transition-all duration-300"
        style={{
          opacity: 1,
          background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(255, 0, 255, 0.05), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
};

export default SpotlightCard;