
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import type { NavLink, AgentCardData } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MeusAgentsView from './components/MeusAgentsView'; 
import TarefasView from './components/TarefasView';
import MeusProjetosView from './components/MeusProjetosView';
import HomeView from './components/HomeView';
import AIPlaygroundView from './components/AIPlaygroundView';
import MarketingOpsCalendarView from './components/calendar/MarketingOpsCalendarView';
import EmailCentralView from './components/EmailCentralView';
import FinanceiroView from './components/finance/FinanceiroView';
import GestaoClientesView from './components/clients/GestaoClientesView';

import { TaskManagerProvider } from './context/TaskManagerContext';
import { CalendarProvider } from './context/CalendarContext';
import { EmailProvider } from './context/EmailContext';
import { AgentProvider } from './context/AgentContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { FinanceProvider } from './context/FinanceContext';
import { ClientProvider } from './context/ClientContext';

const navLinks: NavLink[] = [
  { id: 'Home', label: 'Home' },
  { id: 'Tarefas', label: 'Tarefas' },
  { id: 'Meus Projetos', label: 'Meus Projetos' },
  { id: 'Meus Agents', label: 'Meus Agents' },
  { id: 'Email Central', label: 'Email Central'},
  { id: 'Financeiro', label: 'Financeiro' },
  { id: 'AI Playground', label: 'AI Playground' },
  { id: 'Calendário', label: 'Calendário' },
  { id: 'Gestão de clientes', label: 'Gestão de clientes' },
  { id: 'Fale com Alita', label: 'Fale com Alita' },
];

interface PlaceholderViewProps {
    title: string;
}

const PlaceholderView: React.FC<PlaceholderViewProps> = ({ title }) => (
    <div className="flex items-center justify-center h-full animate-fade-in-up">
        <h1 className="text-4xl font-bold text-[var(--text-muted)]">{`Página de ${title}`}</h1>
    </div>
);

const AppContent: React.FC = () => {
  const { theme } = useTheme();
  const [activeView, setActiveView] = useState<string>('Home');
  const [navParams, setNavParams] = useState<any>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleNavigate = (view: string, params?: any) => {
      setActiveView(view);
      if (params) {
          setNavParams(params);
      } else {
          setNavParams(null);
      }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'Home':
        return <HomeView setActiveView={handleNavigate} />;
      case 'Meus Agents':
        return <MeusAgentsView initialAgentId={navParams?.agentId} />;
      case 'Email Central':
        return <EmailCentralView />;
      case 'Financeiro':
        return <FinanceiroView initialTab={navParams?.tab} />;
      case 'Gestão de clientes':
        return <GestaoClientesView setActiveView={handleNavigate} />;
      case 'Fale com Alita':
        return <PlaceholderView title={activeView} />;
      case 'Tarefas':
        return <TarefasView />;
      case 'Meus Projetos':
        return <MeusProjetosView setActiveView={handleNavigate} />;
      case 'AI Playground':
        return <AIPlaygroundView initialTool={navParams?.tool} initialTab={navParams?.tab} />;
      case 'Calendário':
        return <MarketingOpsCalendarView />;
      default:
        return <PlaceholderView title="Página não encontrada" />;
    }
  };

  const isHome = activeView === 'Home';

  return (
    <div 
        className="h-screen flex transition-colors duration-300" 
        style={{ background: 'var(--bg-main)' }}
        data-theme={theme}
    >
        <Sidebar 
            navLinks={navLinks} 
            activeView={activeView} 
            onNavigate={handleNavigate} 
            isCollapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <main className={`flex-1 p-6 md:p-8 lg:p-10 flex flex-col overflow-y-auto transition-all duration-300 ${!isHome ? 'pt-4' : ''}`}>
            {/* Only show Global Header on Home View */}
            {isHome && <Header />}
            
            <div className={`flex-grow min-h-0 ${isHome ? 'mt-8' : 'mt-0'}`}>
                {renderContent()}
            </div>
        </main>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <ThemeProvider>
        <ClientProvider>
            <AgentProvider>
                <TaskManagerProvider>
                    <CalendarProvider>
                        <EmailProvider>
                            <FinanceProvider>
                                <AppContent />
                            </FinanceProvider>
                        </EmailProvider>
                    </CalendarProvider>
                </TaskManagerProvider>
            </AgentProvider>
        </ClientProvider>
    </ThemeProvider>
  );
};

export default App;
