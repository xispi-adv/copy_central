
import React from 'react';
import type { ProjectGroup } from '../types';
import { useTaskManager } from '../context/TaskManagerContext';
import { useClients } from '../context/ClientContext';

const FolderIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </svg>
);

const ArrowRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
);

const EditIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

interface ProjectGroupCardProps {
    group: ProjectGroup;
    onSelect: () => void;
    onEdit: () => void;
}

const ProjectGroupCard: React.FC<ProjectGroupCardProps> = ({ group, onSelect, onEdit }) => {
    const { projects } = useTaskManager();
    const { getClientById } = useClients();
    
    const projectCount = projects.filter(p => p.groupId === group.id).length;
    const client = group.clientId ? getClientById(group.clientId) : null;

    return (
        <div 
            className="group relative bg-[var(--bg-card)] hover:bg-[var(--bg-elevation-1)] border border-[var(--border-color)] hover:border-[var(--accent-color)] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[var(--accent-glow)]/10 overflow-hidden flex flex-col h-full min-h-[220px]"
        >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-color)] opacity-5 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:opacity-10 pointer-events-none"></div>

            <div className="relative z-10 flex items-start justify-between mb-6">
                <div className="p-3.5 bg-[var(--bg-elevation-1)] rounded-xl border border-[var(--border-color)] group-hover:border-[var(--accent-color)]/20 group-hover:bg-[var(--accent-color)]/10 transition-all duration-300">
                    <FolderIcon className="w-8 h-8 text-[var(--text-secondary)] group-hover:text-[var(--accent-color)] transition-colors" />
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className="text-xs font-medium text-[var(--text-muted)] bg-[var(--bg-elevation-1)] px-2 py-1 rounded-full border border-[var(--border-color)]">
                        {projectCount} {projectCount === 1 ? 'Projeto' : 'Projetos'}
                    </span>
                    {client && (
                        <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 uppercase tracking-wide">
                            {client.name}
                        </span>
                    )}
                </div>
            </div>

            <div className="relative z-10 flex-grow cursor-pointer" onClick={onSelect}>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-color)] transition-colors">{group.name}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">{group.description}</p>
            </div>

            <div className="relative z-10 mt-6 pt-4 border-t border-[var(--border-color)] flex items-center justify-between text-sm gap-3">
                <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors px-3 py-1.5 rounded-lg hover:bg-[var(--bg-elevation-2)]"
                >
                    <EditIcon className="w-3.5 h-3.5" />
                    <span>Editar</span>
                </button>

                <button 
                    onClick={onSelect}
                    className="flex items-center gap-2 text-[var(--accent-color)] font-medium hover:text-[var(--accent-hover)] transition-colors px-3 py-1.5 rounded-lg hover:bg-[var(--accent-glow)]"
                >
                    <span>Acessar</span>
                    <ArrowRightIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default ProjectGroupCard;
