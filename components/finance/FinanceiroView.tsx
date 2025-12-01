
import React, { useState, useEffect } from 'react';
import FinancialCockpit from './FinancialCockpit';
import BookkeepingView from './BookkeepingView';
import AIAuditorView from './AIAuditorView';

interface FinanceiroViewProps {
    initialTab?: 'cockpit' | 'bookkeeping' | 'auditor';
}

const FinanceiroView: React.FC<FinanceiroViewProps> = ({ initialTab }) => {
  const [activeTab, setActiveTab] = useState<'cockpit' | 'bookkeeping' | 'auditor'>('cockpit');

  useEffect(() => {
      if (initialTab) {
          setActiveTab(initialTab);
      }
  }, [initialTab]);

  return (
    <div className="h-full flex flex-col animate-fade-in-up">
      <header className="flex-shrink-0 mb-6 border-b border-[var(--border-color)] pb-4 flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-light text-[var(--text-primary)]">Financeiro Inteligente</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">Gestão de caixa e auditoria com IA.</p>
        </div>
        <div className="flex gap-2">
             {['cockpit', 'bookkeeping', 'auditor'].map((tab) => (
                 <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all uppercase tracking-wider
                        ${activeTab === tab 
                            ? 'bg-[var(--bg-card)] text-[var(--accent-color)] border border-[var(--accent-color)] shadow-sm' 
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'}
                    `}
                 >
                     {tab === 'cockpit' ? 'Cockpit' : tab === 'bookkeeping' ? 'Lançamentos' : 'Auditor IA'}
                 </button>
             ))}
        </div>
      </header>

      <div className="flex-1 min-h-0 overflow-y-auto">
          {activeTab === 'cockpit' && <FinancialCockpit onRequestAuditor={() => setActiveTab('auditor')} />}
          {activeTab === 'bookkeeping' && <BookkeepingView />}
          {activeTab === 'auditor' && <AIAuditorView />}
      </div>
    </div>
  );
};

export default FinanceiroView;
