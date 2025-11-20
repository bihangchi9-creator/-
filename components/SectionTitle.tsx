import React from 'react';

const SectionTitle: React.FC<{ title: string; number: string }> = ({ title, number }) => {
  return (
    <div className="flex items-baseline gap-4 mb-12 border-b border-white/20 pb-4">
      <span className="text-gray-500 font-mono text-xl md:text-2xl font-bold">
        {number}
      </span>
      <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter text-white">
        {title}
      </h2>
    </div>
  );
};

export default SectionTitle;