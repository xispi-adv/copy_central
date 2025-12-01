
import React, { useState, useEffect } from 'react';
import type { GeneratedMedia } from '../types';
import RecentsView from './playground/RecentsView';
import ToolsView from './playground/ToolsView';
import SupportView from './playground/SupportView';
import ImageGenerator from './playground/ImageGenerator';
import VideoGenerator from './playground/VideoGenerator';

type PlaygroundView = 'main' | 'imageGenerator' | 'videoGenerator';
type MainTab = 'recentes' | 'ferramentas' | 'suporte';

interface AIPlaygroundViewProps {
    initialTool?: PlaygroundView;
    initialTab?: MainTab;
}

const AIPlaygroundView: React.FC<AIPlaygroundViewProps> = ({ initialTool, initialTab }) => {
    const [view, setView] = useState<PlaygroundView>('main');
    const [activeTab, setActiveTab] = useState<MainTab>('ferramentas'); 
    const [history, setHistory] = useState<GeneratedMedia[]>([]);

    useEffect(() => {
        if (initialTool) setView(initialTool);
        if (initialTab) setActiveTab(initialTab);
    }, [initialTool, initialTab]);

    const handleMediaGenerated = (media: GeneratedMedia) => {
        setHistory(prev => [media, ...prev]);
    };

    if (view === 'imageGenerator') {
        return <ImageGenerator onBack={() => setView('main')} onMediaGenerated={handleMediaGenerated} history={history} />;
    }

    if (view === 'videoGenerator') {
        return <VideoGenerator onBack={() => setView('main')} onMediaGenerated={handleMediaGenerated} history={history} />;
    }

    const tabs: { id: MainTab, label: string }[] = [
        { id: 'ferramentas', label: 'Ferramentas' },
        { id: 'recentes', label: 'Galeria' },
        { id: 'suporte', label: 'Status' },
    ];

    return (
        <div className="animate-fade-in-up h-full flex flex-col relative">
            {/* Background Ambience - Adaptive */}
            <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[var(--accent-color)]/10 to-transparent pointer-events-none -z-10" />

            <header className="flex-shrink-0 flex flex-col items-center justify-center py-8">
                <h1 className="text-4xl font-thin text-[var(--text-primary)] tracking-[0.2em] uppercase">AI Playground</h1>
                <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[var(--accent-color)] to-transparent mt-4 opacity-50"></div>
            </header>

            <div className="flex-shrink-0 mb-8 flex justify-center">
                <nav className="flex bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border-color)] p-1 rounded-full shadow-sm">
                    {tabs.map(tab => {
                        const IsActive = activeTab === tab.id;
                        return (
                             <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    relative px-8 py-2.5 rounded-full text-sm font-medium transition-all duration-300 overflow-hidden
                                    ${IsActive ? 'text-white shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevation-1)]'}
                                `}
                            >
                                {IsActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-color)] to-red-600 opacity-90 rounded-full -z-10 animate-fade-in"></div>
                                )}
                                <span className="relative z-10 tracking-wide uppercase">{tab.label}</span>
                            </button>
                        )
                    })}
                </nav>
            </div>

            <div className="flex-grow min-h-0 w-full max-w-7xl mx-auto px-4 pb-6">
                 {activeTab === 'recentes' && <RecentsView history={history} />}
                 {activeTab === 'ferramentas' && <ToolsView onSelectTool={(tool) => setView(tool)} />}
                 {activeTab === 'suporte' && <SupportView />}
            </div>
        </div>
    );
};

export default AIPlaygroundView;
