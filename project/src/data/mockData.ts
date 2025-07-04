import { Candidate, Role, Interview, Bottleneck } from '../types';

export const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Raj Patel',
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    company: 'TechCorp Solutions',
    designation: 'Senior Software Engineer',
    experience: 5,
    noticePeriod: '2 months',
    currentCTC: 18,
    expectedCTC: 25,
    role: 'App Engineer – East',
    stage: 'L2 Tech',
    notes: 'Strong technical background in React and Node.js. Showed excellent problem-solving skills in initial round.',
    tags: ['Offer Discussion']
  },
  {
    id: '2',
    name: 'Priya Sharma',
    photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    company: 'DataFlow Inc',
    designation: 'Product Manager',
    experience: 8,
    noticePeriod: '1 month',
    currentCTC: 32,
    expectedCTC: 40,
    role: 'Sr. PM – AI/ML',
    stage: 'Final',
    notes: 'Excellent AI/ML domain expertise. Previously worked on recommendation systems at scale.',
    tags: ['Offer Released']
  },
  {
    id: '3',
    name: 'Arjun Mehta',
    company: 'StartupXYZ',
    designation: 'Full Stack Developer',
    experience: 'Fresher',
    noticePeriod: '1 month',
    currentCTC: 'Confidential',
    expectedCTC: 18,
    role: 'App Engineer – East',
    stage: 'L1 Screen',
    notes: 'Young talent with good potential. Needs to improve system design knowledge.',
    tags: ['Drop-off Risk']
  },
  {
    id: '4',
    name: 'Sneha Gupta',
    photo: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    company: 'Corporate Solutions Ltd',
    designation: 'Executive Assistant',
    experience: 6,
    noticePeriod: '15 days',
    currentCTC: 8,
    expectedCTC: 'Confidential',
    role: 'Exec Asst. to CEO',
    stage: 'Final',
    notes: 'Excellent organizational skills and experience supporting C-level executives.',
    tags: []
  }
];

export const mockRoles: Role[] = [
  {
    id: '1',
    title: 'Sr. PM – AI/ML',
    taOwner: 'Yogiraj',
    status: 'Discussions',
    daysOpen: 42,
    pipelineCount: 3,
    interviews: 2,
    offerStatus: '1 offer in draft',
    isCritical: true,
    function: 'Product'
  },
  {
    id: '2',
    title: 'Exec Asst. to CEO',
    taOwner: 'Shambhavi',
    status: 'Discussions',
    daysOpen: 18,
    pipelineCount: 2,
    interviews: 1,
    offerStatus: '',
    isCritical: true,
    function: 'People Ops'
  },
  {
    id: '3',
    title: 'Corp Acc. Mgr – West',
    taOwner: 'Maaz',
    status: 'Sourcing',
    daysOpen: 30,
    pipelineCount: 2,
    interviews: 1,
    offerStatus: '',
    isCritical: false,
    function: 'Business Ops'
  },
  {
    id: '4',
    title: 'Process Eng – US',
    taOwner: 'Yogiraj',
    status: 'Going Slow',
    daysOpen: 55,
    pipelineCount: 2,
    interviews: 1,
    offerStatus: '',
    isCritical: true,
    function: 'Engineering'
  },
  {
    id: '5',
    title: 'App Engineer – East',
    taOwner: 'Ishita',
    status: 'Offer',
    daysOpen: 0,
    pipelineCount: 0,
    interviews: 0,
    offerStatus: 'Offer Accepted',
    isCritical: false,
    function: 'Engineering'
  }
];

export const mockInterviews: Interview[] = [
  {
    id: '1',
    candidateName: 'Priya Sharma',
    stage: 'Final',
    date: '2025-01-15',
    panel: ['Yogiraj', 'Ravi Kumar'],
    roleTitle: 'Sr. PM – AI/ML'
  },
  {
    id: '2',
    candidateName: 'Sneha Gupta',
    stage: 'Final',
    date: '2025-01-16',
    panel: ['CEO', 'Shambhavi'],
    roleTitle: 'Exec Asst. to CEO'
  },
  {
    id: '3',
    candidateName: 'Raj Patel',
    stage: 'L2 Tech',
    date: '2025-01-17',
    panel: ['Tech Lead', 'Senior Engineer'],
    roleTitle: 'App Engineer – East'
  }
];

export const mockBottlenecks: Bottleneck[] = [
  {
    id: '1',
    description: 'Feedback delay from hiring managers',
    roleTitle: 'Sr. PM – AI/ML'
  },
  {
    id: '2',
    description: 'Panel unavailable for critical roles',
    roleTitle: 'Exec Asst. to CEO'
  },
  {
    id: '3',
    description: 'Low sourcing for specialized positions',
    roleTitle: 'Process Eng – US'
  }
];

// REMOVED mockAttritions - attrition data is now managed completely locally