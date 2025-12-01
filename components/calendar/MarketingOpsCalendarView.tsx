
import React, { useState, useMemo, useCallback } from 'react';
import { useCalendar } from '../../context/CalendarContext';
import CalendarColumn from './CalendarColumn';
import CalendarTaskModal from './CalendarTaskModal';
import type { CalendarTask, CalendarTaskCategory } from '../../types';

const toYYYYMMDD = (date: Date) => date.toISOString().split('T')[0];

const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
};

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

const FilterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
    </svg>
);

const CATEGORIES: { id: CalendarTaskCategory | 'ALL', label: string }[] = [
    { id: 'ALL', label: 'Todas as Categorias' },
    { id: 'CAMPANHA', label: 'Campanhas' },
    { id: 'SOCIAL_MEDIA', label: 'Social Media' },
    { id: 'CONTEUDO', label: 'Conteúdo' },
    { id: 'REUNIAO', label: 'Reuniões' },
    { id: 'ADS', label: 'Ads / Tráfego' },
    { id: 'SEO', label: 'SEO' },
    { id: 'EMAIL', label: 'Email Marketing' },
];

const MarketingOpsCalendarView: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<CalendarTask | null>(null);
    const [newTaskDate, setNewTaskDate] = useState<string | null>(null);
    
    // Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<CalendarTaskCategory | 'ALL'>('ALL');

    const weekDays = useMemo(() => {
        const start = getWeekStart(currentDate);
        return Array.from({ length: 7 }).map((_, i) => {
            const day = new Date(start);
            day.setDate(start.getDate() + i);
            return day;
        });
    }, [currentDate]);

    const handlePrevWeek = () => setCurrentDate(d => new Date(d.setDate(d.getDate() - 7)));
    const handleNextWeek = () => setCurrentDate(d => new Date(d.setDate(d.getDate() + 7)));
    const handleToday = () => setCurrentDate(new Date());

    const openModalForNewTask = useCallback((date: string) => {
        setEditingTask(null);
        setNewTaskDate(date);
        setIsModalOpen(true);
    }, []);
    
    const openModalForEditing = useCallback((task: CalendarTask) => {
        setNewTaskDate(null);
        setEditingTask(task);
        setIsModalOpen(true);
    }, []);

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTask(null);
        setNewTaskDate(null);
    };

    const month = currentDate.toLocaleString('pt-BR', { month: 'long' });
    const year = currentDate.getFullYear();

    return (
        <div className="h-full flex flex-col animate-fade-in-up">
            {/* Advanced Header */}
            <header className="flex flex-col gap-4 mb-6 flex-shrink-0">
                
                {/* Title Area */}
                <div>
                    <h1 className="text-4xl font-extralight text-[var(--text-primary)] tracking-tight">
                        <span className="capitalize font-bold">{month}</span> <span className="text-[var(--text-muted)]">{year}</span>
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">Planejamento e Operações de Marketing</p>
                </div>

                {/* Controls Row: Search + Filter + Nav */}
                <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 bg-[var(--bg-card)] p-2 rounded-2xl border border-[var(--border-color)]">
                    
                    {/* Left: Search & Filter */}
                    <div className="flex flex-grow items-center gap-3">
                        {/* Search Box */}
                        <div className="relative group w-full md:w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="h-4 w-4 text-[var(--text-muted)] group-focus-within:text-[var(--accent-color)] transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-[var(--border-color)] rounded-xl leading-5 bg-[var(--bg-elevation-1)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] sm:text-sm transition-all"
                                placeholder="Buscar..."
                            />
                        </div>

                        {/* Category Dropdown */}
                        <div className="relative w-full md:w-56">
                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FilterIcon className="h-4 w-4 text-[var(--text-muted)]" />
                             </div>
                             <select 
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value as CalendarTaskCategory | 'ALL')}
                                className="block w-full pl-10 pr-3 py-2 border border-[var(--border-color)] rounded-xl leading-5 bg-[var(--bg-elevation-1)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] sm:text-sm transition-all appearance-none cursor-pointer hover:bg-[var(--bg-elevation-2)]"
                             >
                                 {CATEGORIES.map(cat => (
                                     <option key={cat.id} value={cat.id} className="bg-[var(--bg-card)]">{cat.label}</option>
                                 ))}
                             </select>
                        </div>
                    </div>

                    {/* Right: Navigation */}
                    <div className="flex items-center gap-1 bg-[var(--bg-elevation-1)] p-1 rounded-xl border border-[var(--border-color)] ml-auto">
                        <button onClick={handlePrevWeek} className="w-9 h-9 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevation-2)] rounded-lg transition-all">
                            &lt;
                        </button>
                        <button onClick={handleToday} className="px-4 h-9 flex items-center justify-center text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] hover:bg-[var(--bg-elevation-2)] rounded-lg transition-all">
                            Hoje
                        </button>
                        <button onClick={handleNextWeek} className="w-9 h-9 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevation-2)] rounded-lg transition-all">
                            &gt;
                        </button>
                    </div>
                </div>
            </header>

            {/* Calendar Grid */}
            <div className="flex-grow grid grid-cols-7 gap-px bg-[var(--border-color)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-2xl shadow-black/10">
                {weekDays.map((day, index) => (
                    <CalendarColumn 
                        key={day.toISOString()} 
                        day={day} 
                        isLast={index === weekDays.length - 1}
                        onNewTask={openModalForNewTask}
                        onEditTask={openModalForEditing}
                        filterQuery={searchQuery}
                        filterCategory={selectedCategory}
                    />
                ))}
            </div>

            {isModalOpen && (
                <CalendarTaskModal 
                    task={editingTask} 
                    dueDate={newTaskDate} 
                    onClose={closeModal} 
                />
            )}
        </div>
    );
};

export default MarketingOpsCalendarView;
