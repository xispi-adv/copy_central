
import React, { useState } from 'react';
import { useTaskManager } from '../context/TaskManagerContext';
import type { ProjectGroup, Project } from '../types';
import ProjectModal from './ProjectModal';
import ProjectGroupModal from './ProjectGroupModal';
import ProjectCard from './ProjectCard';
import ProjectGroupCard from './ProjectGroupCard';

const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const ChevronRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
);

const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.5 1.5 0 012.12 0l8.955 8.955M3 10.5v.75a3 3 0 003 3h12a3 3 0 003-3v-.75M9 21v-6a2.25 2.25 0 012.25-2.25h1.5A2.25 2.25 0 0115 15v6" />
    </svg>
);


const MeusProjetosView: React.FC<{ setActiveView: (view: string) => void }> = ({ setActiveView }) => {
    const { projectGroups, projects, selectProject } = useTaskManager();
    const [selectedGroup, setSelectedGroup] = useState<ProjectGroup | null>(null);
    
    // States for Create/Edit Modals
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [editingGroup, setEditingGroup] = useState<ProjectGroup | null>(null);

    const handleVisitProject = (projectId: string) => {
        selectProject(projectId);
        setActiveView('Tarefas');
    };

    const handleEditProject = (project: Project) => {
        setEditingProject(project);
        setIsProjectModalOpen(true);
    };

    const handleEditGroup = (group: ProjectGroup) => {
        setEditingGroup(group);
        setIsGroupModalOpen(true);
    };

    const closeProjectModal = () => {
        setIsProjectModalOpen(false);
        setEditingProject(null);
    }

    const closeGroupModal = () => {
        setIsGroupModalOpen(false);
        setEditingGroup(null);
    }

    const projectsInSelectedGroup = projects.filter(p => p.groupId === selectedGroup?.id);

    // Render Groups View (Root)
    if (!selectedGroup) {
        return (
            <div className="h-full flex flex-col animate-fade-in-up">
                 <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-[var(--border-color)] flex-shrink-0">
                    <div>
                        <h1 className="text-3xl font-light text-[var(--text-primary)]">Meus Projetos</h1>
                        <p className="text-[var(--text-muted)] mt-2 font-light">Organize e gerencie seus grupos de trabalho.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsProjectModalOpen(true)} // Open modal without groupId
                            className="flex items-center gap-2 bg-[var(--bg-elevation-1)] hover:bg-[var(--bg-elevation-2)] text-[var(--text-primary)] font-medium py-2.5 px-5 rounded-lg transition-all duration-300 border border-[var(--border-color)] hover:border-[var(--accent-color)]"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Novo Projeto
                        </button>
                        <button
                            onClick={() => setIsGroupModalOpen(true)}
                            className="flex items-center gap-2 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-medium py-2.5 px-5 rounded-lg transition-all duration-300 shadow-lg shadow-[var(--accent-glow)] hover:-translate-y-0.5"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Novo Grupo
                        </button>
                    </div>
                </header>

                <div className="flex-1 min-h-0 overflow-y-auto pb-20 pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {projectGroups.map((group, index) => (
                            <div key={group.id} style={{ animationDelay: `${index * 50}ms`}} className="animate-fade-in">
                               <ProjectGroupCard 
                                    group={group} 
                                    onSelect={() => setSelectedGroup(group)} 
                                    onEdit={() => handleEditGroup(group)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                {isGroupModalOpen && <ProjectGroupModal onClose={closeGroupModal} group={editingGroup} />}
                {isProjectModalOpen && <ProjectModal onClose={closeProjectModal} project={editingProject} />}
            </div>
        );
    }

    // Render Projects in Group View (Drill-down)
    return (
        <div className="h-full flex flex-col animate-fade-in-up">
            {/* Breadcrumb & Header */}
            <header className="mb-8 pb-6 border-b border-[var(--border-color)] flex-shrink-0">
                <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
                    <button onClick={() => setSelectedGroup(null)} className="hover:text-[var(--text-primary)] transition-colors flex items-center gap-1">
                        <HomeIcon className="w-4 h-4" />
                        Grupos
                    </button>
                    <ChevronRightIcon className="w-4 h-4" />
                    <span className="text-[var(--accent-color)] font-medium">{selectedGroup.name}</span>
                </nav>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-light text-[var(--text-primary)]">{selectedGroup.name}</h1>
                        <p className="text-[var(--text-secondary)] mt-1 font-light text-sm max-w-2xl">{selectedGroup.description}</p>
                    </div>
                    <button
                        onClick={() => setIsProjectModalOpen(true)}
                        className="flex items-center gap-2 bg-[var(--bg-elevation-1)] hover:bg-[var(--bg-elevation-2)] border border-[var(--border-color)] text-[var(--text-primary)] font-medium py-2 px-4 rounded-lg transition-all hover:border-[var(--accent-color)]"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Novo Projeto
                    </button>
                </div>
            </header>

            {/* Project Grid */}
            <div className="flex-1 min-h-0 overflow-y-auto pb-20 pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
                    {projectsInSelectedGroup.length > 0 ? (
                        projectsInSelectedGroup.map((project, index) => (
                            <div key={project.id} style={{ animationDelay: `${index * 50}ms`}} className="h-full">
                                <ProjectCard 
                                    project={project} 
                                    onVisit={handleVisitProject} 
                                    onEdit={handleEditProject}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-[var(--text-muted)] border-2 border-dashed border-[var(--border-color)] rounded-2xl bg-[var(--bg-elevation-1)]/20">
                            <p className="text-xl font-light mb-2">Pasta Vazia</p>
                            <p className="text-sm">Clique em "Novo Projeto" para começar.</p>
                        </div>
                    )}
                </div>
            </div>
            {isProjectModalOpen && (
                <ProjectModal 
                    groupId={selectedGroup.id} 
                    onClose={closeProjectModal} 
                    project={editingProject}
                />
            )}
        </div>
    );
};

export default MeusProjetosView;
