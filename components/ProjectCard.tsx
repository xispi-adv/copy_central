
import React from 'react';
import type { Project } from '../types';

const CalendarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
);

const EditIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

interface ProjectCardProps {
    project: Project;
    onVisit: (projectId: string) => void;
    onEdit: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onVisit, onEdit }) => {
    const deadline = new Date(project.deadline + 'T00:00:00');
    const isLate = deadline < new Date();
    
    return (
        <div className="group flex flex-col bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-color)] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[var(--accent-glow)]/20 hover:-translate-y-1 h-full animate-fade-in-up">
            {/* Status Bar */}
            <div className="h-1 w-full bg-gradient-to-r from-[var(--bg-elevation-1)] to-[var(--bg-elevation-2)] group-hover:from-[var(--accent-color)] group-hover:to-[var(--accent-hover)] transition-all duration-500"></div>
            
            <div className="p-6 flex flex-col flex-grow">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className="text-[10px] font-bold tracking-widest text-[var(--accent-color)] uppercase mb-1 block">Cliente</span>
                        <h3 className="text-lg font-bold text-[var(--text-primary)] leading-tight group-hover:text-[var(--accent-color)] transition-colors">{project.client}</h3>
                    </div>
                    <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${isLate ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500'}`}>
                        {isLate ? 'Atrasado' : 'Em Dia'}
                    </div>
                </div>

                {/* Project Name & Desc */}
                <div className="mb-6 flex-grow">
                    <h4 className="text-xl font-semibold text-[var(--text-primary)] mb-2 opacity-90">{project.name}</h4>
                    <p className="text-sm text-[var(--text-secondary)] line-clamp-3 leading-relaxed">{project.summary}</p>
                </div>

                {/* Meta Data Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-[var(--bg-elevation-1)] rounded-lg p-2.5 border border-[var(--border-color)]">
                        <span className="block text-[10px] text-[var(--text-muted)] uppercase font-semibold mb-0.5">Foco</span>
                        <span className="block text-xs text-[var(--text-primary)] font-medium truncate" title={project.focus}>{project.focus}</span>
                    </div>
                    <div className="bg-[var(--bg-elevation-1)] rounded-lg p-2.5 border border-[var(--border-color)]">
                        <span className="block text-[10px] text-[var(--text-muted)] uppercase font-semibold mb-0.5">Propósito</span>
                        <span className="block text-xs text-[var(--text-primary)] font-medium truncate" title={project.purpose}>{project.purpose}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)] mt-auto gap-3">
                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mr-auto">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span>{deadline.toLocaleDateString('pt-BR')}</span>
                    </div>
                    
                    <button
                        onClick={() => onEdit(project)}
                        className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-elevation-1)] hover:bg-[var(--bg-elevation-2)] px-3 py-2 rounded-lg transition-all flex items-center gap-2"
                    >
                        <EditIcon className="w-3.5 h-3.5" />
                        Editar
                    </button>

                    <button
                        onClick={() => onVisit(project.id)}
                        className="text-xs font-bold text-white bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] px-4 py-2 rounded-lg transition-all shadow-lg shadow-[var(--accent-glow)]"
                    >
                        Abrir Projeto
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
