import React, { useState } from 'react';
import { RESUME_DATA } from './constants';
import GlitchText from './components/GlitchText';
import SectionTitle from './components/SectionTitle';
import ChatBot from './components/ChatBot';
import NeuralBackground from './components/NeuralBackground';
import JobMatchModal from './components/JobMatchModal';
import ProjectCard from './components/ProjectCard';
import { Box, Cpu, Zap, Globe, Mail, Phone, MapPin, ExternalLink, GraduationCap, Trophy, Bot, Download, ScanLine } from 'lucide-react';

const App: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);

  const handleDownloadResume = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-black selection:bg-white selection:text-black cursor-default">
      {/* High-End Interactivity Components */}
      <NeuralBackground />

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-20">
        
        {/* HERO SECTION */}
        <section className="mb-32 relative">
          <div className="border-l-2 border-white pl-8 md:pl-12 py-4">
            <p className="text-gray-400 font-mono mb-2 tracking-[0.2em] uppercase text-sm">角色: {RESUME_DATA.title}</p>
            <h1 className="text-5xl md:text-8xl font-bold leading-tight mb-6 text-white">
              <GlitchText text={RESUME_DATA.name} as="span" />
            </h1>
            <p className="text-xl md:text-2xl text-ios-gray max-w-2xl leading-relaxed font-light">
              弥合 <span className="text-white border-b border-white/30 pb-1">复杂AI逻辑</span> 与 <span className="text-white border-b border-white/30 pb-1">以人为本的产品设计</span> 之间的鸿沟。
            </p>
            
            {/* Contact Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 max-w-xl font-mono text-sm text-gray-500">
              <div className="flex items-center gap-3 hover:text-white transition-colors">
                <Mail size={16} /> {RESUME_DATA.contact.email}
              </div>
              <div className="flex items-center gap-3 hover:text-white transition-colors">
                <Phone size={16} /> {RESUME_DATA.contact.phone}
              </div>
              <div className="flex items-center gap-3 hover:text-white transition-colors">
                <MapPin size={16} /> {RESUME_DATA.contact.location}
              </div>
              <a href={RESUME_DATA.contact.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-white transition-colors group">
                <Globe size={16} /> 
                <span className="border-b border-gray-700 group-hover:border-white transition-colors">个人作品集网站</span>
                <ExternalLink size={12} />
              </a>
            </div>

            {/* Hero CTA Buttons */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4 items-start">
               <button 
                  onClick={() => setIsChatOpen(true)}
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-black transition-all duration-300 bg-white font-sans tracking-wide hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] focus:outline-none rounded-full"
               >
                  <Bot className="w-5 h-5 mr-2" />
                  <span>开启 AI 对话</span>
               </button>
               
               <button 
                  onClick={() => setIsMatchModalOpen(true)}
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white transition-all duration-300 bg-zinc-900 border border-white/30 font-sans tracking-wide hover:bg-zinc-800 hover:border-white focus:outline-none rounded-full overflow-hidden"
               >
                   {/* Shimmer Effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                  <ScanLine className="w-5 h-5 mr-2" />
                  <span>分析岗位匹配度</span>
               </button>

               <button 
                  onClick={handleDownloadResume}
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white transition-all duration-300 bg-transparent border border-white/10 font-sans tracking-wide hover:bg-white/5 focus:outline-none rounded-full"
               >
                  <Download className="w-5 h-5 mr-2" />
                  <span>下载简历</span>
               </button>
            </div>

          </div>
          
          {/* Abstract Badge */}
          <div className="absolute top-0 right-0 hidden md:flex flex-col items-end">
             <div className="text-gray-500 font-mono text-[10px] mb-2 tracking-widest uppercase">System Status</div>
             <div className="flex items-center gap-2 border border-white/10 px-4 py-2 rounded-full bg-white/5 backdrop-blur">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-white text-xs font-bold tracking-widest">ONLINE</span>
             </div>
          </div>
        </section>

        {/* 01 EDUCATION SECTION */}
        <section className="mb-32">
          <SectionTitle number="01" title="教育经历" />
          <div className="glass-panel p-8 md:p-12 relative overflow-hidden group rounded-3xl border border-white/5 hover:border-white/20 transition-all duration-500">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                <GraduationCap className="w-40 h-40 text-white" />
             </div>
             <div className="relative z-10">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 md:mb-0 tracking-tight">{RESUME_DATA.education.school}</h3>
                  <div className="inline-block px-4 py-1 bg-white/10 border border-white/10 text-white font-mono text-sm rounded-full">
                    {RESUME_DATA.education.period}
                  </div>
               </div>
               <div className="flex items-center gap-3 mb-8 text-xl text-gray-300 font-light">
                  <span className="w-1.5 h-1.5 bg-white rounded-full" />
                  <span className="font-medium">{RESUME_DATA.education.degree}</span>
                  <span className="text-gray-600">/</span>
                  <span>{RESUME_DATA.education.major}</span>
               </div>
               <div className="border-t border-white/10 pt-6">
                 <p className="text-lg text-ios-gray leading-relaxed max-w-4xl font-light">
                   {RESUME_DATA.education.details}
                 </p>
               </div>
             </div>
          </div>
        </section>

        {/* 02 EXPERIENCE SECTION */}
        <section className="mb-32">
          <SectionTitle number="02" title="工作经历" />
          <div className="space-y-16 relative">
            {/* Timeline Line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-white/50 via-white/10 to-transparent hidden md:block" />

            {RESUME_DATA.internships.map((exp, idx) => (
              <div key={idx} className={`relative flex flex-col md:flex-row gap-12 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Content Box */}
                <div className="flex-1">
                  <div className="glass-panel p-8 rounded-3xl hover:bg-white/5 transition-colors duration-500 relative overflow-hidden group border border-white/5">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                       <Zap className="w-32 h-32 text-white" />
                    </div>

                    <div className="text-gray-400 font-mono text-xs mb-3 uppercase tracking-wider">{exp.period}</div>
                    <h3 className="text-2xl font-bold text-white mb-1">{exp.role}</h3>
                    <div className="text-gray-500 mb-8 font-medium text-lg">{exp.company}</div>

                    <div className="space-y-8">
                      {exp.projects.map((project, pIdx) => (
                        <div key={pIdx}>
                          <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-white rounded-full" />
                            {project.name}
                          </h4>
                          <ul className="space-y-3 mb-4">
                            {project.details.map((detail, dIdx) => (
                              <li key={dIdx} className="text-ios-gray text-[15px] leading-relaxed pl-4 border-l border-white/10">
                                {detail}
                              </li>
                            ))}
                          </ul>
                          <div className="flex gap-2">
                            {project.tags?.map((tag, tIdx) => (
                              <span key={tIdx} className="text-[10px] font-medium tracking-wider uppercase text-gray-400 bg-white/5 px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Timeline Dot */}
                <div className="hidden md:flex items-center justify-center w-12 relative">
                  <div className="w-3 h-3 bg-black border-2 border-white rounded-full z-10" />
                </div>
                
                {/* Empty space for grid balance */}
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </section>

        {/* 03 PROJECTS SECTION - UPDATED WITH 3D CARDS */}
        <section className="mb-32">
          <SectionTitle number="03" title="个人项目" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {RESUME_DATA.projects.map((proj, idx) => (
               <div key={idx} className="h-[400px]">
                 <ProjectCard project={proj} />
               </div>
            ))}
          </div>
        </section>

        {/* 04 SKILLS & AWARDS SECTION */}
        <section className="mb-32">
           <SectionTitle number="04" title="技能与荣誉" />
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Skills Column */}
              <div>
                 <div className="flex items-center gap-3 mb-8">
                   <Cpu className="text-white" />
                   <h3 className="text-2xl font-bold text-white">专业技能</h3>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {RESUME_DATA.skills.map((skill, idx) => (
                      <div key={idx} className="p-6 border border-white/10 bg-[#111] rounded-xl hover:bg-[#1c1c1e] transition-colors group">
                         <h4 className="text-white font-bold mb-4 font-mono text-xs uppercase tracking-wider opacity-70 group-hover:text-white group-hover:opacity-100 transition-all">{skill.category}</h4>
                         <div className="flex flex-wrap gap-2">
                           {skill.items.map((item, i) => (
                             <span key={i} className="text-sm text-ios-gray font-light">
                               {item}{i < skill.items.length - 1 ? ' • ' : ''}
                             </span>
                           ))}
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Awards Column */}
              <div>
                 <div className="flex items-center gap-3 mb-8">
                   <Trophy className="text-white" />
                   <h3 className="text-2xl font-bold text-white">荣誉奖项</h3>
                 </div>
                 <div className="bg-[#111] p-8 border border-white/10 rounded-2xl h-full relative overflow-hidden group hover:bg-[#1c1c1e] transition-colors">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                       <Trophy className="w-32 h-32 text-white" />
                    </div>
                    <div className="space-y-8 relative z-10">
                      {RESUME_DATA.awards.map((award, idx) => (
                        <div key={idx} className="relative pl-6 border-l border-white/20">
                           <p className="text-gray-300 leading-relaxed text-lg font-light">{award}</p>
                        </div>
                      ))}
                    </div>
                 </div>
              </div>

           </div>
        </section>
        
        {/* Footer */}
        <footer className="text-center border-t border-white/10 pt-12 pb-24">
          <div className="text-white font-mono text-4xl font-bold mb-4 tracking-tighter">
             HIRE_ME.exe
          </div>
          <p className="text-gray-600 text-sm font-mono">
            © {new Date().getFullYear()} 毕航驰. Designed with strict minimalism.
          </p>
        </footer>

      </main>
      
      {/* Gemini Chat Component */}
      <ChatBot isOpen={isChatOpen} onToggle={() => setIsChatOpen(!isChatOpen)} />

      {/* Job Match Agent Modal */}
      <JobMatchModal isOpen={isMatchModalOpen} onClose={() => setIsMatchModalOpen(false)} />
    </div>
  );
};

export default App;