
import React from 'react';
import type { AgentGroup } from '../types';
import { useAgents } from '../context/AgentContext';

const TeamIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.226c-3.42-.74-6.36-3.686-6.36-7.226 0-4.024 3.28-7.297 7.348-7.297s7.348 3.273 7.348 7.297c0 3.54-2.94 6.486-6.36 7.226m-1.546-9.332a9.014 9.014 0 0110.153-2.191m-10.153 2.191L4.5 21m0 0a9.014 9.014 0 0010.153-2.191m-4.243-5.344a9.015 9.015 0 01-3.182-2.152m3.182 2.152a2.25 2.25 0 00-3.182-2.152" />
    </svg>
);

interface AgentGroupCardProps {
    group: AgentGroup;
    onSelect: () => void;
}

const AgentGroupCard: React.FC<AgentGroupCardProps> = ({ group, onSelect }) => {
    const { agents } = useAgents();
    const agentCount = agents.filter(a => a.groupId === group.id).length;

    return (
        <div 
            onClick={onSelect}
            className="group bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-xl transition-all duration-300 hover:border-[var(--accent-color)] hover:shadow-lg hover:shadow-[var(--accent-glow)] hover:-translate-y-1 cursor-pointer flex flex-col animate-fade-in-up h-full min-h-[180px]"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-[var(--bg-elevation-1)] rounded-lg group-hover:bg-[var(--accent-glow)] transition-colors">
                    <TeamIcon className="w-6 h-6 text-[var(--text-secondary)] group-hover:text-[var(--accent-color)]" />
                </div>
                <span className="text-xs font-medium text-[var(--text-muted)] bg-[var(--bg-elevation-1)] px-2 py-1 rounded-full">
                    {agentCount} {agentCount === 1 ? 'Agente' : 'Agentes'}
                </span>
            </div>
            
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-color)] transition-colors">{group.name}</h3>
            <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{group.description}</p>
            
            <div className="mt-auto pt-4 flex items-center text-xs text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
                <span>Ver equipe</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 ml-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </div>
        </div>
    );
};

export default AgentGroupCard;
