
import React from 'react';

export interface NavLink {
  id: string;
  label: string;
}

export interface AgentGroup {
  id: string;
  name: string;
  description: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface AgentCardData {
  id: string;
  groupId: string; // Added groupId link
  title: string;
  description: string;
  systemInstruction: string;
  isHighlighted?: boolean;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  chatHistory?: Message[];
}

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp?: string;
}

// --- CLIENTE TYPES (UPDATED) ---
export type ClientStatus = 'ACTIVE' | 'PROSPECT' | 'CHURNED';

export interface ClientPersona {
    name: string;
    description: string;
}

export interface ClientBrand {
    toneOfVoice: string; // e.g. "Formal", "Jovem", "Técnico"
    visualIdentity: string; // e.g. "Minimalista", "Colorido"
    coreValues: string;
}

// New: Objectives and Key Results (Metas)
export interface ClientKeyResult {
    id: string;
    title: string;
    isCompleted: boolean;
}

export interface ClientObjective {
    id: string;
    title: string;
    deadline: string;
    status: 'EM_ANDAMENTO' | 'CONCLUIDO' | 'ATRASADO';
    keyResults: ClientKeyResult[];
}

export interface Client {
  id: string;
  name: string; // Nome do Contato Principal ou Apelido
  companyName?: string; // Razão Social ou Nome Fantasia
  logo?: string; 
  status: ClientStatus;
  
  // Dados Corporativos Extras
  cnpj?: string;
  responsibleName?: string; // Responsável Contratante
  email?: string;
  phone?: string;
  website?: string;
  socialInstagram?: string;
  socialLinkedin?: string;
  
  // Contexto Estratégico
  contractObjective?: string; // Objetivo da contratação
  description?: string; // Notas gerais / Sobre o cliente
  
  // Branding & Personas
  brand?: ClientBrand;
  personas?: ClientPersona[]; // Array fixo de 3 slots idealmente

  // Objetivos e Metas (NOVO)
  objectives?: ClientObjective[];

  onboardingChecklist?: { id: string; label: string; completed: boolean }[];
  since: string; // ISO Date
}

// New types for Task Manager
export type TaskStatus = 'A_FAZER' | 'EM_ANDAMENTO' | 'CONCLUIDO';
export type TaskPriority = 'ALTA' | 'MEDIA' | 'BAIXA';

export interface ProjectGroup {
  id: string;
  name: string;
  description: string;
  clientId?: string; // LINK TO CLIENT
}

export interface Project {
  id: string;
  name: string;
  purpose: string;
  focus: string;
  client: string; // Legacy string field, kept for compatibility
  summary: string;
  deadline: string; // Using string for simplicity, can be Date
  groupId: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignee: string;
}

// Type for Home Dashboard
export interface AdMetric {
    date: string;
    platform: 'google' | 'meta';
    cost: number;
    clicks: number;
    impressions: number;
}

// Types for AI Playground
export interface GeneratedMedia {
  id: string;
  type: 'image' | 'video';
  prompt: string;
  url: string;
  options?: Record<string, string>;
}

// Types for Marketing Ops Calendar
export type CalendarTaskPriority = 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';
export type CalendarTaskCategory = 'CAMPANHA' | 'SOCIAL_MEDIA' | 'CONTEUDO' | 'EMAIL' | 'SEO' | 'ADS' | 'REUNIAO' | 'OUTRO';
export type CalendarTaskStatus = 'A_FAZER' | 'EM_PROGRESSO' | 'REVISAO' | 'CONCLUIDO';

export interface CalendarTask {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // YYYY-MM-DD
  priority: CalendarTaskPriority;
  category: CalendarTaskCategory;
  assignedTo?: string;
  status: CalendarTaskStatus;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  estimatedTime?: number; // in hours
  relatedLink?: string;
  order: number;
  clientId?: string; // LINK TO CLIENT
}

// Types for Email Central
export type EmailFolderId = 'inbox' | 'sent' | 'drafts' | 'spam' | 'trash' | string;

export interface EmailFolder {
  id: EmailFolderId;
  name: string;
  unreadCount: number;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface EmailAttachment {
  id: string;
  filename: string;
  size: number; // in bytes
  type: string; // MIME type
  url: string;
}

export interface Email {
  id: string;
  folderId: EmailFolderId;
  from: {
    name: string;
    email: string;
    avatar?: string;
  };
  to: { name: string; email: string }[];
  cc?: { name: string; email: string }[];
  bcc?: { name: string; email: string }[];
  subject: string;
  snippet: string;
  body: string; // Can be HTML content
  date: string; // ISO 8601 format
  isRead: boolean;
  attachments: EmailAttachment[];
}

// --- FINANCEIRO TYPES ---

export type TransactionType = 'receita' | 'despesa';
export type TransactionStatus = 'pago' | 'pendente';

export interface FinancialAccount {
  id: string;
  name: string;
  balance: number;
  type: 'bank' | 'cash' | 'credit';
}

export interface FinancialCategory {
  id: string;
  name: string;
  budget?: number;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  accountId: string;
  status: TransactionStatus;
  clientId?: string; // LINK TO CLIENT
}

export interface FinancialReport {
  status_geral: 'Positivo' | 'Alerta' | 'Crítico';
  resumo_executivo: string;
  maiores_ofensores: string[];
  sugestao_acao: string;
  generatedAt: string;
}
