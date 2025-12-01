
import React, { useState } from 'react';
import { useCalendar } from '../../context/CalendarContext';
import type { CalendarTask, CalendarTaskCategory } from '../../types';

const CATEGORY_CONFIG: Record<CalendarTaskCategory, { color: string; label: string }> = {
    CAMPANHA: { color: '#a855f7', label: 'Campanha' }, // Purple
    SOCIAL_MEDIA: { color: '#ec4899', label: 'Social' }, // Pink
    CONTEUDO: { color: '#22c55e', label: 'Conteúdo' }, // Green
    EMAIL: { color: '#3b82f6', label: 'E-mail' }, // Blue
    SEO: { color: '#14b8a6', label: 'SEO' }, // Teal
    ADS: { color: '#f97316', label: 'Ads' }, // Orange
    REUNIAO: { color: '#6366f1', label: 'Reunião' }, // Indigo
    OUTRO: { color: '#71717a', label: 'Geral' }, // Zinc
};

const CheckIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
  </svg>
);

const AlertIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-red-500">
        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
);


const CalendarTaskCard: React.FC<{ task: CalendarTask; onEdit: () => void }> = ({ task, onEdit }) => {
    const { moveOrReorderTask } = useCalendar();
    const [isDragOver, setIsDragOver] = useState(false);
    
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('taskId', task.id);
        e.dataTransfer.effectAllowed = 'move';
    };
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const draggedTaskId = e.dataTransfer.getData('taskId');
        if (draggedTaskId && draggedTaskId !== task.id) {
            moveOrReorderTask(draggedTaskId, task.dueDate, task.id);
        }
        setIsDragOver(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(true);
    };
    
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        setIsDragOver(false);
    };

    const config = CATEGORY_CONFIG[task.category] || CATEGORY_CONFIG.OUTRO;
    const isCompleted = task.status === 'CONCLUIDO';
    const isUrgent = task.priority === 'URGENTE';

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={onEdit}
            className={`
                relative group rounded-md p-2 cursor-pointer transition-all duration-200
                bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--text-muted)] hover:bg-[var(--bg-elevation-2)]
                ${isDragOver ? 'border-t-2 border-t-[var(--accent-color)]' : ''}
                ${isCompleted ? 'opacity-60 grayscale-[0.5]' : ''}
                hover:shadow-lg hover:scale-[1.02] hover:z-10 overflow-hidden
            `}
        >
            {/* Category Indicator Strip */}
            <div 
                className="absolute top-0 bottom-0 left-0 w-1" 
                style={{ backgroundColor: config.color }}
            ></div>

            <div className="pl-3 flex flex-col gap-1">
                {/* Header: Status Icons & Category */}
                <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold uppercase tracking-wider opacity-80" style={{ color: config.color }}>
                        {config.label}
                    </span>
                    <div className="flex gap-1">
                        {isUrgent && !isCompleted && <AlertIcon />}
                        {isCompleted && <div className="bg-green-500/20 p-0.5 rounded text-green-500"><CheckIcon /></div>}
                    </div>
                </div>

                {/* Title */}
                <p className={`text-xs font-medium text-[var(--text-primary)] leading-snug ${isCompleted ? 'line-through text-[var(--text-muted)]' : ''}`}>
                    {task.title}
                </p>

                {/* Footer: Avatar */}
                {task.assignedTo && (
                    <div className="flex justify-end mt-1">
                        <div className="w-4 h-4 rounded-full bg-[var(--bg-elevation-1)] text-[var(--text-secondary)] text-[8px] flex items-center justify-center font-bold border border-[var(--border-color)]">
                            {task.assignedTo.charAt(0)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalendarTaskCard;
