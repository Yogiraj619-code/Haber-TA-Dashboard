export interface Candidate {
  id: string;
  name: string;
  photo?: string;
  company: string;
  designation: string;
  experience: number | string; // Allow "Fresher" as well as numbers
  noticePeriod: string;
  currentCTC: number | string; // Allow "Confidential" as well as numbers
  expectedCTC: number | string; // Allow "Confidential" as well as numbers
  role: string;
  stage: string;
  notes: string;
  tags: string[];
  rating?: number; // 1-5 rating scale
}

export interface Role {
  id: string;
  title: string;
  taOwner: string;
  status: 'Research' | 'Sourcing' | 'Going Slow' | 'Discussions' | 'Offer' | 'Closed';
  daysOpen: number;
  pipelineCount: number;
  interviews: number;
  offerStatus: string;
  isCritical: boolean;
  function?: string; // Department/function categorization
}

export interface Interview {
  id: string;
  candidateName: string;
  stage: string;
  date: string;
  panel: string[];
  roleTitle: string; // Make role association required
}

export interface Attrition {
  id: string;
  employeeName: string;
  role: string;
  exitDate: string;
  reason?: string;
}

export interface Bottleneck {
  id: string;
  description: string;
  roleTitle: string; // Link bottleneck to specific role
}

export interface Offer {
  id: string;
  candidateName: string;
  roleTitle: string;
  offerDate?: string;
  joinDate?: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Joined';
  packageAmount?: number;
}