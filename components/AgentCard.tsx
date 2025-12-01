
import React from 'react';
import type { AgentCardData } from '../types';

// Generic Robot Icon if specific icon is missing
const BotIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12h1.5m12 0h1.5m-1.5 3.75h1.5m-1.5 3.75H3m1.5-3.75H3m15.75 4.5V3m-15.75 18V3m-9 9h1.5M12 8.25a3 75 0 00-3 3v3a3 3 0 003 3m0-6a3 3 0 013 3v3a3 3 0 01-3 3m0-6h.008v.008H12V8.25zm0 6h.008v.008H12V14.25z" />
    </svg>
);

interface AgentCardProps extends AgentCardData {
  onSelect: () => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ title, description, isHighlighted, icon: Icon, onSelect }) => {
  const DisplayIcon = Icon || BotIcon;

  return (
    <div 
        onClick={onSelect}
        className={`
            relative group overflow-hidden rounded-xl p-[1px] transition-all duration-300 hover:-translate-y-1 cursor-pointer
            ${isHighlighted 
                ? 'bg-gradient-to-br from-[var(--accent-color)] via-red-900 to-black' 
                : 'bg-gradient-to-br from-[var(--border-color)] via-[var(--bg-card)] to-transparent hover:from-[var(--accent-color)] hover:via-[var(--accent-glow)]'
            }
        `}
    >
        {/* Content Container */}
        <div className="h-full bg-[var(--bg-card)] backdrop-blur-xl rounded-xl p-5 flex flex-col border border-[var(--border-color)] group-hover:border-[var(--accent-color)] transition-colors min-h-[200px]">
            <div className="flex justify-between items-start mb-3">
                <div className={`p-2.5 rounded-lg ${isHighlighted ? 'bg-[var(--accent-color)] text-white' : 'bg-[var(--bg-elevation-1)] text-[var(--text-secondary)] group-hover:bg-[var(--accent-color)] group-hover:text-white transition-colors'}`}>
                    <DisplayIcon className="w-6 h-6" />
                </div>
                {isHighlighted && (
                    <span className="bg-[var(--accent-glow)] text-[var(--accent-color)] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[var(--accent-color)]/30">
                        Destaque
                    </span>
                )}
            </div>
            
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-color)] transition-colors line-clamp-1">{title}</h2>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed flex-grow line-clamp-3">{description}</p>
            
            <div className="mt-4 flex items-center text-xs font-medium text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
                <span>Iniciar conversa</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
            </div>
        </div>
    </div>
  );
};

export default AgentCard;
