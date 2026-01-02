
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface ControlLoopAnalysis {
  loop: 'Scope' | 'Quality' | 'Schedule' | 'Cost' | 'Procurement' | 'HSE';
  status: 'OPTIMAL' | 'DEGRADED' | 'CRITICAL';
  findings: string[];
  recommendation: string;
}

export interface DetailedAnalysis {
  summary: string;
  loops: ControlLoopAnalysis[];
  luxuryCompliance: {
    mockupStatus: string;
    holdPointsDetected: string[];
    protectionWarning: string | null;
  };
  risks: Array<{
    description: string;
    severity: 'High' | 'Medium' | 'Low';
    mitigation: string;
  }>;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  size?: string;
}

export type AppView = 'dashboard' | 'chat' | 'analysis' | 'site-control';
