
import React, { useState } from 'react';
import { useAgents } from '../context/AgentContext';

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.553L16.5 21.75l-.398-1.197a3.375 3.375 0 00-2.456-2.456L12.75 18l1.197-.398a3.375 3.375 0 002.456-2.456L17.25 14.25l.398 1.197a3.375 3.375 0 002.456 2.456L21 18l-1.197.398a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
);

interface CreateAgentModalProps {
    groupId: string;
    onClose: () => void;
}

const CreateAgentModal: React.FC<CreateAgentModalProps> = ({ groupId, onClose }) => {
    const { addAgent } = useAgents();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        persona: '',
        knowledge: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const systemInstruction = `
        ATUE COMO: ${formData.title}.
        SUA PERSONA: ${formData.persona}
        CONHECIMENTO BASE: ${formData.knowledge}
        `;

        addAgent({
            groupId: groupId,
            title: formData.title,
            description: formData.description,
            systemInstruction: systemInstruction,
        });
        
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[60] animate-fade-in" onClick={onClose}>
            <div className="bg-[#09090b] border border-white/10 w-full max-w-3xl m-4 p-8 rounded-3xl shadow-2xl shadow-black relative flex flex-col max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
                
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-red-600 rounded-lg shadow-lg shadow-red-600/20">
                        <SparklesIcon className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-light text-white">Criar Agente Inteligente</h2>
                </div>

                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-2 space-y-8 custom-scrollbar">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="group">
                            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1 group-focus-within:text-red-500 transition-colors">Nome do Agente</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="Ex: Especialista em SEO"
                                className="w-full bg-transparent border-b border-white/10 py-2 text-lg text-white placeholder-white/20 focus:outline-none focus:border-red-500 transition-colors"
                            />
                        </div>
                        <div className="group">
                            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1 group-focus-within:text-red-500 transition-colors">Função Principal</label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                placeholder="Descrição curta..."
                                className="w-full bg-transparent border-b border-white/10 py-2 text-lg text-white placeholder-white/20 focus:outline-none focus:border-red-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="group">
                        <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2 group-focus-within:text-red-500 transition-colors">Persona & Comportamento</label>
                        <textarea
                            name="persona"
                            value={formData.persona}
                            onChange={handleChange}
                            required
                            rows={3}
                            placeholder="Defina a personalidade e o tom de voz..."
                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-4 text-white/80 placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-all resize-none text-sm"
                        />
                    </div>

                    <div className="group">
                        <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2 group-focus-within:text-red-500 transition-colors">Base de Conhecimento</label>
                        <textarea
                            name="knowledge"
                            value={formData.knowledge}
                            onChange={handleChange}
                            rows={5}
                            placeholder="Cole dados, contextos ou diretrizes específicas..."
                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-4 text-white/80 placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-all text-sm"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-full text-white/60 hover:text-white hover:bg-white/5 transition-colors text-sm">Cancelar</button>
                        <button type="submit" className="px-8 py-2.5 rounded-full bg-white text-black hover:bg-red-600 hover:text-white font-bold transition-all duration-300 shadow-lg shadow-white/5">
                            Inicializar Agente
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAgentModal;
