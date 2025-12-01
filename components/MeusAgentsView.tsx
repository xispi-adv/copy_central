
import React, { useState, useEffect } from 'react';
import AgentCard from './AgentCard';
import AgentGroupCard from './AgentGroupCard';
import ChatView from './ChatView';
import CreateAgentModal from './CreateAgentModal';
import CreateAgentGroupModal from './CreateAgentGroupModal';
import { useAgents } from '../context/AgentContext';
import type { AgentCardData, AgentGroup } from '../types';

const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const BackIcon: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" fill="currentColor"/>
    </svg>
);

interface MeusAgentsViewProps {
    initialAgentId?: string;
}

const MeusAgentsView: React.FC<MeusAgentsViewProps> = ({ initialAgentId }) => {
    const { agents, groups } = useAgents();
    const [selectedGroup, setSelectedGroup] = useState<AgentGroup | null>(null);
    const [selectedAgent, setSelectedAgent] = useState<AgentCardData | null>(null);
    const [isCreateAgentModalOpen, setIsCreateAgentModalOpen] = useState(false);
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);

    useEffect(() => {
        if (initialAgentId) {
            const agent = agents.find(a => a.id === initialAgentId);
            if (agent) setSelectedAgent(agent);
        }
    }, [initialAgentId, agents]);

    // 1. Chat View
    if (selectedAgent) {
        return <ChatView agent={selectedAgent} onBack={() => setSelectedAgent(null)} />;
    }

    // 2. Agent List View (Inside a Group)
    if (selectedGroup) {
        const groupAgents = agents.filter(a => a.groupId === selectedGroup.id);

        return (
            <div className="animate-fade-in-up h-full flex flex-col">
                <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--border-color)] pb-4 flex-shrink-0">
                    <div className="flex items-center gap-4">
                         <button onClick={() => setSelectedGroup(null)} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors rounded-full hover:bg-[var(--bg-card-hover)]">
                            <BackIcon />
                        </button>
                        <div>
                            <h1 className="text-3xl font-light text-[var(--text-primary)]">{selectedGroup.name}</h1>
                            <p className="text-[var(--text-muted)] text-sm font-light">
                                {selectedGroup.description}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsCreateAgentModalOpen(true)}
                        className="flex items-center gap-2 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 shadow-lg shadow-[var(--accent-glow)] hover:-translate-y-0.5"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>Novo Agente</span>
                    </button>
                </header>

                {/* Scrollable Container Fix */}
                <div className="flex-1 min-h-0 overflow-y-auto pb-20 pr-2">
                     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <button 
                            onClick={() => setIsCreateAgentModalOpen(true)}
                            className="group h-full min-h-[200px] rounded-xl border border-dashed border-[var(--border-color)] hover:border-[var(--accent-color)] bg-[var(--bg-elevation-1)] hover:bg-[var(--bg-elevation-2)] transition-all duration-300 flex flex-col items-center justify-center p-6 cursor-pointer"
                        >
                            <div className="w-12 h-12 rounded-full bg-[var(--bg-card)] group-hover:bg-[var(--accent-color)] transition-colors flex items-center justify-center mb-3 shadow-inner">
                                <PlusIcon className="w-6 h-6 text-[var(--text-muted)] group-hover:text-white" />
                            </div>
                            <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">Adicionar Agente</h3>
                            <p className="text-[var(--text-muted)] text-center text-xs">
                                Adicione um especialista a esta equipe.
                            </p>
                        </button>

                        {groupAgents.map((agent) => (
                            <AgentCard 
                                key={agent.id} 
                                {...agent} 
                                onSelect={() => setSelectedAgent(agent)} 
                            />
                        ))}
                     </div>
                     {groupAgents.length === 0 && (
                         <div className="text-center py-20 opacity-50 text-[var(--text-muted)]">
                             <p>Nenhum agente nesta equipe ainda.</p>
                         </div>
                     )}
                </div>

                 {isCreateAgentModalOpen && (
                    <CreateAgentModal groupId={selectedGroup.id} onClose={() => setIsCreateAgentModalOpen(false)} />
                )}
            </div>
        );
    }

    // 3. Group List View (Main)
    return (
        <div className="animate-fade-in-up h-full flex flex-col">
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[var(--border-color)] pb-6 flex-shrink-0">
                <div>
                    <h1 className="text-3xl font-light text-[var(--text-primary)]">Meus Agentes</h1>
                    <p className="text-[var(--text-muted)] mt-2 font-light">
                        Gerencie suas equipes de inteligência artificial.
                    </p>
                </div>
                <button 
                    onClick={() => setIsCreateGroupModalOpen(true)}
                    className="flex items-center gap-2 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-medium py-2.5 px-5 rounded-lg transition-all duration-300 shadow-lg shadow-[var(--accent-glow)] hover:-translate-y-0.5"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>Nova Equipe</span>
                </button>
            </header>

            {/* Scrollable Container Fix */}
            <div className="flex-1 min-h-0 overflow-y-auto pb-20 pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {groups.map((group) => (
                        <AgentGroupCard 
                            key={group.id} 
                            group={group} 
                            onSelect={() => setSelectedGroup(group)} 
                        />
                    ))}
                </div>
            </div>

            {isCreateGroupModalOpen && (
                <CreateAgentGroupModal onClose={() => setIsCreateGroupModalOpen(false)} />
            )}
        </div>
    );
};

export default MeusAgentsView;
