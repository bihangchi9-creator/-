import React, { useRef, useState } from 'react';
import { Terminal, ArrowUpRight } from 'lucide-react';

interface ProjectCardProps {
  project: {
    name: string;
    period?: string;
    details: string[];
    tags?: string[];
  };
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation based on mouse position (max rotation 15deg)
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotation({ x: 0, y: 0 }); // Reset
  };

  return (
    <div
      className="relative perspective-container group"
      style={{ perspective: '1000px' }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="bg-[#111] border border-white/10 p-8 rounded-2xl h-full transition-all duration-200 ease-out transform-style-3d relative overflow-hidden"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(${isHovering ? 1.02 : 1}, ${isHovering ? 1.02 : 1}, 1)`,
        }}
      >
        {/* Glossy Sheen Effect */}
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white to-transparent"
          style={{
            background: `linear-gradient(125deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0) 100%)`,
            transform: `translateX(${rotation.y * 2}px) translateY(${rotation.x * 2}px)`,
          }}
        />

        {/* Header */}
        <div className="flex justify-between items-start mb-6 transform-style-3d translate-z-10">
          <div className="p-3 bg-white/5 rounded-xl text-white mb-4 group-hover:bg-white group-hover:text-black transition-colors shadow-lg">
            <Terminal size={24} />
          </div>
          <div className="flex flex-col items-end gap-2">
             <span className="text-[10px] font-mono text-gray-500 border border-white/10 px-2 py-1 rounded bg-black shadow-sm">
                {project.period}
             </span>
             <ArrowUpRight className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Content */}
        <h4 className="text-xl font-bold text-white mb-3 transform-style-3d translate-z-20 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
            {project.name}
        </h4>
        
        <ul className="list-disc list-inside text-sm text-ios-gray mb-8 space-y-3 font-light transform-style-3d translate-z-10">
          {project.details.map((d, i) => (
            <li key={i} className="line-clamp-3 group-hover:text-gray-300 transition-colors">
                {d}
            </li>
          ))}
        </ul>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto transform-style-3d translate-z-10">
          {project.tags?.map((tag, tIdx) => (
            <span
              key={tIdx}
              className="px-2 py-1 bg-black text-[10px] font-medium text-gray-400 border border-white/10 rounded group-hover:border-white/30 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .translate-z-10 {
          transform: translateZ(20px);
        }
        .translate-z-20 {
          transform: translateZ(40px);
        }
      `}</style>
    </div>
  );
};

export default ProjectCard;