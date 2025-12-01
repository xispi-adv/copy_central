
import React, { useState, useMemo } from 'react';
import { useClients } from '../../context/ClientContext';
import type { Client, ClientStatus } from '../../types';
import ClientDetailsView from './ClientDetailsView';
import ClientModal from './ClientModal';

// Icons
const BuildingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
);

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

interface ClientColumnProps {
    title: string;
    status: ClientStatus;
    clients: Client[];
    onSelectClient: (clientId: string) => void;
}

const ClientColumn: React.FC<ClientColumnProps> = ({ title, status, clients, onSelectClient }) => {
    const { updateClient } = useClients();
    const [isOver, setIsOver] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const clientId = e.dataTransfer.getData('clientId');
        if (clientId) {
            updateClient(clientId, { status: status });
        }
        setIsOver(false);
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, clientId: string) => {
        e.dataTransfer.setData('clientId', clientId);
        e.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
                flex flex-col h-full min-w-[300px] flex-1 rounded-2xl border overflow-hidden transition-colors duration-300
                ${isOver ? 'bg-[var(--bg-card-hover)] border-[var(--accent-color)]' : 'bg-[var(--bg-card)] border-[var(--border-color)]'}
            `}
        >
            <div className={`p-4 border-b border-[var(--border-color)] flex justify-between items-center`}>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${status === 'ACTIVE' ? 'bg-emerald-500' : status === 'PROSPECT' ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">{title}</h3>
                </div>
                <span className="text-xs font-bold bg-[var(--bg-elevation-2)] px-2 py-1 rounded text-[var(--text-secondary)]">{clients.length}</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                {clients.map(client => (
                    <div 
                        key={client.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, client.id)}
                        onClick={() => onSelectClient(client.id)}
                        className={`
                            p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg
                            bg-[var(--bg-elevation-1)] border-[var(--border-color)] hover:border-[var(--accent-color)] group
                            active:cursor-grabbing
                        `}
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[var(--bg-elevation-2)] flex items-center justify-center text-[var(--text-muted)] border border-[var(--border-color)]">
                                    {client.logo ? <img src={client.logo} className="w-full h-full object-cover rounded-lg" /> : <BuildingIcon className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-[var(--text-primary)]">{client.name}</h4>
                                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{client.companyName}</p>
                                </div>
                            </div>
                        </div>
                        
                        <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3">{client.description}</p>
                        
                        <div className="flex justify-between items-center pt-3 border-t border-[var(--border-color)]">
                            <span className="text-[10px] text-[var(--text-muted)]">Desde: {new Date(client.since).toLocaleDateString()}</span>
                            <span className={`text-[10px] font-bold uppercase ${status === 'ACTIVE' ? 'text-emerald-500' : status === 'PROSPECT' ? 'text-blue-500' : 'text-gray-500'}`}>
                                {status === 'ACTIVE' ? 'Ativo' : status === 'PROSPECT' ? 'Negociação' : 'Encerrado'}
                            </span>
                        </div>
                    </div>
                ))}
                
                {clients.length === 0 && (
                    <div className="text-center py-8 text-[var(--text-muted)] opacity-50 text-sm border-2 border-dashed border-[var(--border-color)] rounded-xl m-2">
                        Arraste um cliente aqui
                    </div>
                )}
            </div>
        </div>
    );
}

const GestaoClientesView: React.FC<{ setActiveView: (view: string) => void }> = ({ setActiveView }) => {
    const { clients } = useClients();
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Derive selected client from list to ensure we always have the latest data
    const selectedClient = useMemo(() => 
        clients.find(c => c.id === selectedClientId) || null
    , [clients, selectedClientId]);

    const filteredClients = clients.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedClient) {
        return (
            <ClientDetailsView 
                client={selectedClient} 
                onBack={() => setSelectedClientId(null)} 
                setActiveView={setActiveView}
            />
        );
    }

    return (
        <div className="h-full flex flex-col animate-fade-in-up">
            {/* Header */}
            <header className="flex-shrink-0 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-light text-[var(--text-primary)]">Gestão de Clientes</h1>
                    <p className="text-sm text-[var(--text-muted)] mt-1">CRM Integrado e Visão 360º.</p>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-grow md:flex-grow-0">
                        <input 
                            type="text" 
                            placeholder="Buscar cliente..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] w-full md:w-64"
                        />
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[var(--accent-color)] text-white px-4 py-2 rounded-lg hover:bg-[var(--accent-hover)] transition-colors flex items-center gap-2 shadow-lg shadow-[var(--accent-glow)]"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span className="text-sm font-bold">Novo Cliente</span>
                    </button>
                </div>
            </header>

            {/* Swimlanes */}
            <div className="flex-1 min-h-0 flex gap-6 overflow-x-auto pb-4">
                <ClientColumn 
                    title="Contratos Ativos" 
                    status="ACTIVE" 
                    clients={filteredClients.filter(c => c.status === 'ACTIVE')} 
                    onSelectClient={setSelectedClientId}
                />
                <ClientColumn 
                    title="Propostas em Aberto" 
                    status="PROSPECT" 
                    clients={filteredClients.filter(c => c.status === 'PROSPECT')} 
                    onSelectClient={setSelectedClientId}
                />
                <ClientColumn 
                    title="Encerrados" 
                    status="CHURNED" 
                    clients={filteredClients.filter(c => c.status === 'CHURNED')} 
                    onSelectClient={setSelectedClientId}
                />
            </div>

            {isModalOpen && <ClientModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default GestaoClientesView;
