
import React, { useState, useMemo } from 'react';
import { useCalendar } from '../../context/CalendarContext';
import CalendarTaskCard from './CalendarTaskCard';
import type { CalendarTask, CalendarTaskCategory } from '../../types';

const toYYYYMMDD = (date: Date) => date.toISOString().split('T')[0];

const PlusIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
);

interface CalendarColumnProps {
    day: Date;
    isLast: boolean;
    onNewTask: (date: string) => void;
    onEditTask: (task: CalendarTask) => void;
    filterQuery: string;
    filterCategory: CalendarTaskCategory | 'ALL';
}

const CalendarColumn: React.FC<CalendarColumnProps> = ({ 
    day, 
    isLast, 
    onNewTask, 
    onEditTask,
    filterQuery,
    filterCategory
}) => {
    const { getTasksForDate, moveOrReorderTask } = useCalendar();
    const [isOver, setIsOver] = useState(false);
    
    const dateString = toYYYYMMDD(day);
    const allTasks = getTasksForDate(dateString);
    
    const filteredTasks = useMemo(() => {
        return allTasks.filter(task => {
            const matchesSearch = filterQuery === '' || 
                task.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
                (task.description && task.description.toLowerCase().includes(filterQuery.toLowerCase()));
            
            const matchesCategory = filterCategory === 'ALL' || task.category === filterCategory;
            
            return matchesSearch && matchesCategory;
        });
    }, [allTasks, filterQuery, filterCategory]);

    const dayName = day.toLocaleString('pt-BR', { weekday: 'short' }).replace('.', '');
    const isToday = toYYYYMMDD(new Date()) === dateString;

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        setIsOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        if (taskId) {
            moveOrReorderTask(taskId, dateString, null);
        }
        setIsOver(false);
    };

    const bgClass = isOver 
        ? 'bg-[var(--accent-glow)]' 
        : isToday 
        ? 'bg-[var(--bg-card)]' 
        : 'bg-[var(--bg-elevation-1)]';

    return (
        <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col transition-all duration-300 min-h-[200px] relative group ${bgClass}`}
        >
            {/* Header */}
            <div className={`
                p-4 flex flex-col items-center border-b border-[var(--border-color)] relative
                ${isToday ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}
            `}>
                 {isToday && <div className="absolute top-0 left-0 right-0 h-0.5 bg-[var(--accent-color)] shadow-[0_0_10px_var(--accent-color)]"></div>}
                 
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{dayName}</span>
                <span className={`text-2xl font-light mt-1 ${isToday ? 'font-bold' : ''}`}>{day.getDate()}</span>

                {/* Add Button (Appears on Hover) */}
                <button 
                    onClick={() => onNewTask(dateString)} 
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--bg-card)] hover:bg-[var(--bg-elevation-2)] p-1 rounded-md"
                    title="Adicionar Tarefa"
                >
                    <PlusIcon />
                </button>
            </div>

            {/* Tasks Area */}
            <div className="flex-grow p-2 space-y-2 overflow-y-auto custom-scrollbar">
                {filteredTasks.map(task => (
                    <CalendarTaskCard key={task.id} task={task} onEdit={() => onEditTask(task)} />
                ))}
                
                {/* Empty State Placeholder */}
                {filteredTasks.length === 0 && !filterQuery && (
                    <div className="h-full min-h-[50px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest opacity-50">Vazio</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalendarColumn;
