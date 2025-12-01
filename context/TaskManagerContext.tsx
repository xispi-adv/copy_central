
import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { Project, Task, TaskStatus, TaskPriority, ProjectGroup } from '../types';

// Simple ID generator
const generateId = () => `id-${new Date().getTime()}-${Math.random().toString(36).substring(2, 9)}`;

// Mock Data - STRICT HIERARCHY: 1 Group = 1 Client (or Internal)
const MOCK_PROJECT_GROUPS: ProjectGroup[] = [
    { id: 'group-nubank', name: 'Campanhas Nubank', description: 'Foco em performance e lançamentos do cartão.', clientId: 'cli-1' }, // Linked to Nubank
    { id: 'group-mcd', name: 'Social McDonald\'s', description: 'Gestão de comunidade e sazonalidade.', clientId: 'cli-2' }, // Linked to McDonalds
    { id: 'group-internal', name: 'AdVerge Interno', description: 'Iniciativas e desenvolvimentos da própria agência.' }, // No Client (Internal)
];

const MOCK_PROJECTS: Project[] = [
  { 
    id: 'proj-1', 
    groupId: 'group-nubank',
    name: 'Lançamento Ultravioleta Q3',
    purpose: 'Aumentar adesão ao segmento premium.',
    focus: 'Performance e Mídia Paga.',
    client: 'Nubank', 
    summary: 'Campanha integrada para gerar awareness e conversão para o cartão Ultravioleta.',
    deadline: '2024-09-30',
  },
  { 
    id: 'proj-2', 
    groupId: 'group-internal',
    name: 'Rebranding Site Agência',
    purpose: 'Modernizar a identidade visual da nossa marca.',
    focus: 'UI/UX Design e Frontend.',
    client: 'AdVerge.ads',
    summary: 'Refazer o site principal com nova logo, paleta de cores e portfólio atualizado.',
    deadline: '2024-11-15',
  },
  { 
    id: 'proj-3', 
    groupId: 'group-internal',
    name: 'Estratégia SEO 2025',
    purpose: 'Aumentar o tráfego orgânico em 50%.',
    focus: 'SEO On-Page e Técnico.',
    client: 'AdVerge.ads',
    summary: 'Plano de ação completo de SEO para melhorar o ranking em palavras-chave B2B.',
    deadline: '2024-12-31',
  },
  { 
    id: 'proj-4', 
    groupId: 'group-mcd',
    name: 'McLanche Feliz - Julho',
    purpose: 'Divulgação dos novos brinquedos.',
    focus: 'Social Media e Influencers.',
    client: 'McDonald\'s',
    summary: 'Campanha focada no público familiar para as férias de julho.',
    deadline: '2024-07-30',
  },
];

const MOCK_TASKS: Task[] = [
  // Project 1 (Nubank)
  { id: 'task-1', projectId: 'proj-1', title: 'Definir Budget Mídia', description: 'Alocar verba entre Meta e Google.', status: 'A_FAZER', priority: 'ALTA', dueDate: '2024-08-15', assignee: 'Alice' },
  { id: 'task-2', projectId: 'proj-1', title: 'Criativos Ultravioleta', description: 'Aprovar peças estáticas e vídeos.', status: 'EM_ANDAMENTO', priority: 'ALTA', dueDate: '2024-08-20', assignee: 'Bob' },
  
  // Project 2 (Interno)
  { id: 'task-5', projectId: 'proj-2', title: 'Benchmarking Agências', description: 'Analisar sites de 5 concorrentes.', status: 'CONCLUIDO', priority: 'MEDIA', dueDate: '2024-09-05', assignee: 'Bob' },
  { id: 'task-6', projectId: 'proj-2', title: 'Wireframe Homepage', description: 'Estrutura da nova home.', status: 'EM_ANDAMENTO', priority: 'ALTA', dueDate: '2024-09-15', assignee: 'Diana' },

  // Project 4 (McD)
  { id: 'task-10', projectId: 'proj-4', title: 'Briefing Influenciadores', description: 'Selecionar 5 perfis família.', status: 'A_FAZER', priority: 'MEDIA', dueDate: '2024-06-20', assignee: 'Charlie' },
];


interface TaskManagerContextState {
  projectGroups: ProjectGroup[];
  projects: Project[];
  tasks: Task[];
  selectedProjectId: string | null;
  selectProject: (projectId: string) => void;
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  addProjectGroup: (groupData: Omit<ProjectGroup, 'id'>) => void;
  updateProjectGroup: (groupId: string, groupData: Partial<Omit<ProjectGroup, 'id'>>) => void;
  addProject: (projectData: Omit<Project, 'id'>) => void;
  updateProject: (projectId: string, projectData: Partial<Omit<Project, 'id' | 'groupId'>>) => void;
  addTask: (taskData: Omit<Task, 'id'>) => void;
  updateTask: (taskId: string, taskData: Partial<Omit<Task, 'id' | 'projectId'>>) => void;
  deleteTask: (taskId: string) => void;
}

const TaskManagerContext = createContext<TaskManagerContextState | undefined>(undefined);

export const TaskManagerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projectGroups, setProjectGroups] = useState<ProjectGroup[]>(MOCK_PROJECT_GROUPS);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const selectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const updateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };
  
  const addProjectGroup = (groupData: Omit<ProjectGroup, 'id'>) => {
    const newGroup = { ...groupData, id: generateId() };
    setProjectGroups(prev => [...prev, newGroup]);
  };

  const updateProjectGroup = (groupId: string, groupData: Partial<Omit<ProjectGroup, 'id'>>) => {
    setProjectGroups(prev => prev.map(g => g.id === groupId ? { ...g, ...groupData } : g));
  };

  const addProject = (projectData: Omit<Project, 'id'>) => {
    const newProject = { ...projectData, id: generateId() };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (projectId: string, projectData: Partial<Omit<Project, 'id' | 'groupId'>>) => {
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...projectData } : p));
  };

  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask = { ...taskData, id: generateId() };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (taskId: string, taskData: Partial<Omit<Task, 'id' | 'projectId'>>) => {
    setTasks(prev => prev.map(task => task.id === taskId ? { ...task, ...taskData } : task));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  return (
    <TaskManagerContext.Provider value={{ 
        projectGroups,
        projects, 
        tasks, 
        selectedProjectId, 
        selectProject, 
        updateTaskStatus,
        addProjectGroup,
        updateProjectGroup,
        addProject,
        updateProject,
        addTask,
        updateTask,
        deleteTask,
    }}>
      {children}
    </TaskManagerContext.Provider>
  );
};

export const useTaskManager = (): TaskManagerContextState => {
  const context = useContext(TaskManagerContext);
  if (!context) {
    throw new Error('useTaskManager must be used within a TaskManagerProvider');
  }
  return context;
};
