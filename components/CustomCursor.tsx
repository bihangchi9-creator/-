import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Check if hovering over clickable elements
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a');
      
      setIsHovering(!!isClickable);
    };

    window.addEventListener('mousemove', updateCursor);
    return () => window.removeEventListener('mousemove', updateCursor);
  }, []);

  return (
    <>
      {/* Main Dot */}
      <div 
        className="fixed pointer-events-none z-[100] mix-blend-difference hidden md:block"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${isHovering ? 1.5 : 1})`,
          transition: 'transform 0.2s ease-out',
        }}
      >
        <div className="w-3 h-3 bg-white rounded-full" />
      </div>

      {/* Trailing Circle */}
      <div 
        className="fixed pointer-events-none z-[100] mix-blend-difference hidden md:block"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${isHovering ? 2.5 : 1})`,
          transition: 'transform 0.15s ease-out, left 0.1s ease-out, top 0.1s ease-out',
        }}
      >
        <div className={`rounded-full border border-white transition-all duration-300 ${isHovering ? 'w-12 h-12 bg-white/20 border-transparent' : 'w-8 h-8'}`} />
      </div>
    </>
  );
};

export default CustomCursor;