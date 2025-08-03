export interface AuditCriteria {
  id: string;
  section: string;
  criteria: string;
  response?: boolean;
}

export interface AuditSection {
  name: string;
  criteria: AuditCriteria[];
  comments?: string;
}

export interface AuditData {
  id?: string;
  restaurantName: string;
  auditorName: string;
  auditDate: string;
  sections: AuditSection[];
  totalItems: number;
  yesCount: number;
  noCount: number;
  successPercentage: number;
  status: 'draft' | 'completed';
}

export interface AuditImprovementSuggestion {
  section: string;
  criteria: string;
  suggestion: string;
  priority: 'low' | 'medium' | 'high';
}