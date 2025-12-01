
import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { AgentCardData, AgentGroup, Message } from '../types';

// Initial Groups
const INITIAL_GROUPS: AgentGroup[] = [
    { id: 'marketing_team', name: 'Equipe de Marketing', description: 'Especialistas em SEO, Social Media e Tráfego.' },
    { id: 'ops_team', name: 'Equipe Operacional', description: 'Gestão de projetos e processos.' },
    { id: 'accounting_team', name: 'Contabilidade & Financeiro', description: 'Gestão fiscal, notas e balanços.' },
];

// Update Initial Agents with Group IDs
const INITIAL_AGENTS: AgentCardData[] = [
    {
      id: 'strategist',
      groupId: 'marketing_team',
      title: 'Estrategista Digital',
      description: 'Visão holística para conectar canais.',
      isHighlighted: true,
      systemInstruction: 'Você é um Estrategista Digital Sênior. Sua função é analisar funis de marketing.',
    },
    {
      id: 'social_media',
      groupId: 'marketing_team',
      title: 'Mestre de Mídias Sociais',
      description: 'Crescimento orgânico e engajamento.',
      systemInstruction: 'Você é um especialista em Mídias Sociais e Viralização.',
    },
    {
      id: 'copywriter',
      groupId: 'marketing_team',
      title: 'Copywriter Pro',
      description: 'Especialista em resposta direta e persuasão.',
      systemInstruction: 'Você é um Copywriter de Resposta Direta world-class.',
    },
    {
      id: 'traffic',
      groupId: 'marketing_team',
      title: 'Gestor de Tráfego Pago',
      description: 'Otimização de Google ADS e Meta ADS.',
      systemInstruction: 'Você é um Gestor de Tráfego Pago focado em performance.',
    },
    {
      id: 'project_manager',
      groupId: 'ops_team',
      title: 'Gestor de Projetos',
      description: 'Organização de sprints e prazos.',
      systemInstruction: 'Você é um Gestor de Projetos Ágil.',
    },
];

interface AgentContextState {
    groups: AgentGroup[];
    agents: AgentCardData[];
    addAgentGroup: (group: Omit<AgentGroup, 'id'>) => void;
    addAgent: (agent: Omit<AgentCardData, 'id' | 'chatHistory'>) => void;
    addMessageToHistory: (agentId: string, message: Message) => void;
}

const AgentContext = createContext<AgentContextState | undefined>(undefined);

export const AgentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [groups, setGroups] = useState<AgentGroup[]>(INITIAL_GROUPS);
    const [agents, setAgents] = useState<AgentCardData[]>(INITIAL_AGENTS);

    const addAgentGroup = (groupData: Omit<AgentGroup, 'id'>) => {
        const newGroup: AgentGroup = {
            ...groupData,
            id: `group-${Date.now()}`,
        };
        setGroups(prev => [...prev, newGroup]);
    }

    const addAgent = (newAgentData: Omit<AgentCardData, 'id' | 'chatHistory'>) => {
        const newAgent: AgentCardData = {
            ...newAgentData,
            id: `custom-agent-${Date.now()}`,
            chatHistory: [],
            isHighlighted: false
        };
        setAgents(prev => [...prev, newAgent]);
    };

    const addMessageToHistory = (agentId: string, message: Message) => {
        setAgents(prev => prev.map(agent => {
            if (agent.id === agentId) {
                const history = agent.chatHistory || [];
                return { ...agent, chatHistory: [...history, message] };
            }
            return agent;
        }));
    };

    return (
        <AgentContext.Provider value={{ groups, agents, addAgentGroup, addAgent, addMessageToHistory }}>
            {children}
        </AgentContext.Provider>
    );
};

export const useAgents = (): AgentContextState => {
    const context = useContext(AgentContext);
    if (!context) {
        throw new Error('useAgents must be used within an AgentProvider');
    }
    return context;
};
