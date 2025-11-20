import React from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p';
}

const GlitchText: React.FC<GlitchTextProps> = ({ text, className = "", as: Component = 'span' }) => {
  return (
    <Component className={`relative inline-block group ${className}`}>
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-gray-500 opacity-0 group-hover:opacity-50 group-hover:translate-x-[2px] transition-all duration-100 select-none">
        {text}
      </span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-gray-300 opacity-0 group-hover:opacity-50 group-hover:-translate-x-[2px] transition-all duration-100 select-none">
        {text}
      </span>
    </Component>
  );
};

export default GlitchText;