import React, { useState, useEffect } from 'react';
import { Users, Calendar, TrendingUp, AlertTriangle, Plus, Settings, Edit, Trash2, UserPlus, UserCheck, UserMinus, Building } from 'lucide-react';
import CandidateCard from './components/CandidateCard';
import CandidateModal from './components/CandidateModal';
import RoleModal from './components/RoleModal';
import InterviewModal from './components/InterviewModal';
import InterviewTable from './components/InterviewTable';
import OverviewTable from './components/OverviewTable';
import BottleneckModal from './components/BottleneckModal';
import TAOwnerModal from './components/TAOwnerModal';
import HeadcountChart from './components/HeadcountChart';
import HeadcountAdminModal from './components/HeadcountAdminModal';
import { Candidate, Role, Interview, Bottleneck } from './types';
import { useSupabaseData } from './hooks/useSupabaseData';
import { useHeadcountData } from './hooks/useHeadcountData';
import { mockCandidates, mockRoles, mockInterviews, mockBottlenecks } from './data/mockData';

function App() {
  // Supabase data hook
  const {
    candidates: dbCandidates,
    roles: dbRoles,
    interviews: dbInterviews,
    bottlenecks: dbBottlenecks,
    offers: dbOffers,
    attrition: dbAttrition,
    taOwners: dbTAOwners,
    loading,
    error,
    saveCandidate,
    updateCandidateRating,
    saveRole,
    deleteRole,
    saveInterview,
    deleteInterview,
    saveBottleneck,
    deleteBottleneck,
    saveTAOwners,
    getCurrentMonthMetrics,
    getFunctionWiseActiveRoles
  } = useSupabaseData();

  // Headcount data hook
  const {
    headcountData,
    loading: headcountLoading,
    error: headcountError,
    saveHeadcountData,
    deleteHeadcountData
  } = useHeadcountData();

  // Local state for data (fallback to mock data if Supabase not configured)
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [bottlenecks, setBottlenecks] = useState<Bottleneck[]>([]);
  const [taOwners, setTAOwners] = useState<string[]>([]);

  // Pipeline filter states
  const [selectedRole, setSelectedRole] = useState<string>('All Roles');
  const [selectedStage, setSelectedStage] = useState<string>('All Stages');

  // Modal states
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [isBottleneckModalOpen, setIsBottleneckModalOpen] = useState(false);
  const [isTAOwnerModalOpen, setIsTAOwnerModalOpen] = useState(false);
  const [isHeadcountAdminModalOpen, setIsHeadcountAdminModalOpen] = useState(false);

  // Edit states
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null);
  const [editingBottleneck, setEditingBottleneck] = useState<Bottleneck | null>(null);
  const [editingHeadcountData, setEditingHeadcountData] = useState<any>(null);

  // Initialize data from Supabase or fallback to mock data
  useEffect(() => {
    if (!loading && !error) {
      setCandidates(dbCandidates.length > 0 ? dbCandidates : mockCandidates);
      setRoles(dbRoles.length > 0 ? dbRoles : mockRoles);
      setInterviews(dbInterviews.length > 0 ? dbInterviews : mockInterviews);
      setBottlenecks(dbBottlenecks.length > 0 ? dbBottlenecks : mockBottlenecks);
      setTAOwners(dbTAOwners.length > 0 ? dbTAOwners : ['Yogiraj', 'Shambhavi', 'Maaz', 'Ishita']);
    } else if (error) {
      // Use mock data if Supabase is not configured
      setCandidates(mockCandidates);
      setRoles(mockRoles);
      setInterviews(mockInterviews);
      setBottlenecks(mockBottlenecks);
      setTAOwners(['Yogiraj', 'Shambhavi', 'Maaz', 'Ishita']);
    }
  }, [dbCandidates, dbRoles, dbInterviews, dbBottlenecks, dbTAOwners, loading, error]);

  // Helper function to get status color and styling
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'research':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'sourcing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'going slow':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'discussions':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'offer':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get bottlenecks for a specific role
  const getBottlenecksForRole = (roleTitle: string) => {
    return bottlenecks.filter(bottleneck => bottleneck.roleTitle === roleTitle);
  };

  // Get function for a role by title
  const getRoleFunction = (roleTitle: string) => {
    const role = roles.find(r => r.title === roleTitle);
    return role?.function || 'Unassigned';
  };

  // Candidate handlers
  const handleSaveCandidate = async (candidate: Candidate) => {
    try {
      if (!error) {
        await saveCandidate(candidate);
      } else {
        setCandidates(prev => {
          const existing = prev.find(c => c.id === candidate.id);
          if (existing) {
            return prev.map(c => c.id === candidate.id ? candidate : c);
          } else {
            return [...prev, { ...candidate, id: Date.now().toString() }];
          }
        });
      }
    } catch (err) {
      console.error('Error saving candidate:', err);
    }
  };

  const handleEditCandidate = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setIsCandidateModalOpen(true);
  };

  // Handle candidate rating change
  const handleCandidateRatingChange = async (candidateId: string, rating: number) => {
    try {
      if (!error) {
        await updateCandidateRating(candidateId, rating);
      } else {
        setCandidates(prev => 
          prev.map(c => c.id === candidateId ? { ...c, rating } : c)
        );
      }
    } catch (err) {
      console.error('Error updating candidate rating:', err);
    }
  };

  // Role handlers
  const handleSaveRole = async (role: Role) => {
    try {
      if (!error) {
        await saveRole(role);
      } else {
        setRoles(prev => {
          const existing = prev.find(r => r.id === role.id);
          if (existing) {
            return prev.map(r => r.id === role.id ? role : r);
          } else {
            return [...prev, { ...role, id: Date.now().toString() }];
          }
        });
      }
    } catch (err) {
      console.error('Error saving role:', err);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      if (!error) {
        await deleteRole(roleId);
      } else {
        setRoles(prev => prev.filter(r => r.id !== roleId));
      }
    } catch (err) {
      console.error('Error deleting role:', err);
    }
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setIsRoleModalOpen(true);
  };

  // Critical role click handler - filters pipeline to that role
  const handleCriticalRoleClick = (roleTitle: string) => {
    setSelectedRole(roleTitle);
    setSelectedStage('All Stages');
    // Scroll to candidate pipeline section
    const pipelineSection = document.getElementById('candidate-pipeline');
    if (pipelineSection) {
      pipelineSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Interview handlers
  const handleSaveInterview = async (interview: Interview) => {
    try {
      if (!error) {
        await saveInterview(interview);
      } else {
        setInterviews(prev => {
          const existing = prev.find(i => i.id === interview.id);
          if (existing) {
            return prev.map(i => i.id === interview.id ? interview : i);
          } else {
            return [...prev, { ...interview, id: Date.now().toString() }];
          }
        });
      }
    } catch (err) {
      console.error('Error saving interview:', err);
    }
  };

  const handleEditInterview = (interview: Interview) => {
    setEditingInterview(interview);
    setIsInterviewModalOpen(true);
  };

  const handleDeleteInterview = async (interviewId: string) => {
    try {
      if (!error) {
        await deleteInterview(interviewId);
      } else {
        setInterviews(prev => prev.filter(i => i.id !== interviewId));
      }
    } catch (err) {
      console.error('Error deleting interview:', err);
    }
  };

  // Bottleneck handlers
  const handleSaveBottleneck = async (bottleneck: Bottleneck) => {
    try {
      if (!error) {
        await saveBottleneck(bottleneck);
      } else {
        setBottlenecks(prev => {
          const existing = prev.find(b => b.id === bottleneck.id);
          if (existing) {
            return prev.map(b => b.id === bottleneck.id ? bottleneck : b);
          } else {
            return [...prev, { ...bottleneck, id: Date.now().toString() }];
          }
        });
      }
    } catch (err) {
      console.error('Error saving bottleneck:', err);
    }
  };

  const handleDeleteBottleneck = async (bottleneckId: string) => {
    try {
      if (!error) {
        await deleteBottleneck(bottleneckId);
      } else {
        setBottlenecks(prev => prev.filter(b => b.id !== bottleneckId));
      }
    } catch (err) {
      console.error('Error deleting bottleneck:', err);
    }
  };

  // TA Owner handlers
  const handleSaveTAOwners = async (owners: string[]) => {
    try {
      if (!error) {
        await saveTAOwners(owners);
      } else {
        setTAOwners(owners);
      }
    } catch (err) {
      console.error('Error saving TA owners:', err);
    }
  };

  // Headcount handlers
  const handleSaveHeadcountData = async (data: any) => {
    try {
      await saveHeadcountData(data);
    } catch (err) {
      console.error('Error saving headcount data:', err);
      throw err;
    }
  };

  const handleEditHeadcountData = (data: any) => {
    setEditingHeadcountData(data);
    setIsHeadcountAdminModalOpen(true);
  };

  // Calculate metrics
  const totalRoles = roles.filter(role => role.status !== 'Closed').length;
  const interviewsThisWeek = interviews.length;

  // Get monthly metrics
  const monthlyMetrics = getCurrentMonthMetrics();

  // Get function-wise active roles
  const functionWiseRoles = getFunctionWiseActiveRoles();

  // Get available role titles for dropdowns
  const availableRoles = roles.map(role => role.title);
  const availableCandidates = candidates.map(candidate => candidate.name);

  // Get critical roles
  const criticalRoles = roles.filter(role => role.isCritical && role.status !== 'Closed');

  // Filter candidates based on selected role and stage
  const filteredCandidates = candidates.filter(candidate => {
    const roleMatch = selectedRole === 'All Roles' || candidate.role === selectedRole;
    const stageMatch = selectedStage === 'All Stages' || candidate.stage === selectedStage;
    return roleMatch && stageMatch;
  });

  // Available stages
  const stages = ['All Stages', 'L1 Screen', 'L2 Tech', 'Final', 'Offer Released'];

  // Get unique roles from candidates for filter
  const candidateRoles = ['All Roles', ...Array.from(new Set(candidates.map(c => c.role)))];

  // Get remaining bottlenecks (not associated with critical roles)
  const remainingBottlenecks = bottlenecks.filter(bottleneck => 
    !criticalRoles.some(role => role.title === bottleneck.roleTitle)
  );

  // Get existing months for validation
  const existingMonths = headcountData.map(data => data.month);

  if (loading || headcountLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Haber Talentsort</h1>
                <p className="text-sm text-gray-600">Collaborative Talent Acquisition Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsHeadcountAdminModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Manage Headcount
              </button>
              <button
                onClick={() => setIsTAOwnerModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Manage TA Owners
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {(error || headcountError) && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              <strong>Note:</strong> Using demo data. {error || headcountError}
            </p>
          </div>
        )}

        {/* 1. Headcount Analysis Section */}
        <div className="mb-8">
          <HeadcountChart 
            data={headcountData} 
            onEditMonth={handleEditHeadcountData}
          />
        </div>

        {/* 2. Critical Roles with Integrated Bottlenecks */}
        {criticalRoles.length > 0 && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold text-red-900">Critical Roles</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {criticalRoles.map((role) => {
                const roleBottlenecks = getBottlenecksForRole(role.title);
                return (
                  <div 
                    key={role.id} 
                    className="bg-white rounded-lg p-4 border border-red-200 group hover:shadow-md transition-all cursor-pointer hover:border-red-300 relative"
                    onClick={() => handleCriticalRoleClick(role.title)}
                    title="Click to view candidates for this role"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 group-hover:text-red-700 transition-colors">
                        {role.title}
                      </h4>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(role.status)}`}>
                        {role.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1 mb-3">
                      <div className="flex items-center gap-2">
                        <Building className="w-3 h-3" />
                        <span>{role.function || 'Unassigned'}</span>
                      </div>
                      <p>TA Owner: {role.taOwner}</p>
                      <p>Days Open: {role.daysOpen}</p>
                      <p>Pipeline: {role.pipelineCount} candidates</p>
                    </div>

                    {/* Role-specific Bottlenecks */}
                    {roleBottlenecks.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-red-100">
                        <div className="flex items-center gap-1 mb-2">
                          <AlertTriangle className="w-3 h-3 text-orange-600" />
                          <span className="text-xs font-medium text-orange-800">Bottlenecks:</span>
                        </div>
                        <div className="space-y-1">
                          {roleBottlenecks.map((bottleneck) => (
                            <div key={bottleneck.id} className="flex items-center justify-between group/bottleneck">
                              <p className="text-xs text-orange-700 bg-orange-50 px-2 py-1 rounded flex-1 mr-2">
                                {bottleneck.description}
                              </p>
                              <div className="opacity-0 group-hover/bottleneck:opacity-100 transition-opacity flex gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingBottleneck(bottleneck);
                                    setIsBottleneckModalOpen(true);
                                  }}
                                  className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                  title="Edit bottleneck"
                                >
                                  <Edit className="w-2 h-2" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteBottleneck(bottleneck.id);
                                  }}
                                  className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                                  title="Delete bottleneck"
                                >
                                  <Trash2 className="w-2 h-2" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingRole(role);
                          setIsRoleModalOpen(true);
                        }}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRole(role.id);
                        }}
                        className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                    
                    {/* Subtle click indicator */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-60 transition-opacity">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Remaining Bottlenecks (not associated with critical roles) */}
        {remainingBottlenecks.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-400">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Other Bottlenecks</h3>
                </div>
                <button
                  onClick={() => setIsBottleneckModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Bottleneck
                </button>
              </div>
              
              <div className="space-y-3">
                {remainingBottlenecks.map((bottleneck) => (
                  <div key={bottleneck.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg group hover:bg-orange-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="text-orange-600">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-sm text-orange-800 font-medium">{bottleneck.description}</span>
                        {bottleneck.roleTitle && (
                          <p className="text-xs text-orange-600 mt-1">Related to: {bottleneck.roleTitle}</p>
                        )}
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button
                        onClick={() => {
                          setEditingBottleneck(bottleneck);
                          setIsBottleneckModalOpen(true);
                        }}
                        className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        title="Edit bottleneck"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteBottleneck(bottleneck.id)}
                        className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                        title="Delete bottleneck"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add Bottleneck button when no remaining bottlenecks */}
        {remainingBottlenecks.length === 0 && criticalRoles.length > 0 && (
          <div className="mb-8 text-center">
            <button
              onClick={() => setIsBottleneckModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors mx-auto"
            >
              <Plus className="w-4 h-4" />
              Add Bottleneck
            </button>
          </div>
        )}

        {/* 4. Candidate Pipeline */}
        <div id="candidate-pipeline" className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-900">Candidate Pipeline</h2>
              {selectedRole !== 'All Roles' && (
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                    Filtered: {selectedRole}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedRole('All Roles');
                      setSelectedStage('All Stages');
                    }}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Clear filter
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsCandidateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Candidate
            </button>
          </div>

          {/* FILTERS - Role and Stage Selection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Filter by Role:</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  {candidateRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Filter by Stage:</label>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  {stages.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>

              <div className="text-sm text-gray-600">
                Showing {filteredCandidates.length} of {candidates.length} candidates
              </div>
            </div>
          </div>

          {/* CANDIDATE CARDS - Filtered Results */}
          {filteredCandidates.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                {selectedRole !== 'All Roles' 
                  ? `No candidates found for "${selectedRole}"` 
                  : 'No candidates found for the selected filters'
                }
              </p>
              <button
                onClick={() => {
                  setSelectedRole('All Roles');
                  setSelectedStage('All Stages');
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCandidates.map((candidate) => (
                <CandidateCard 
                  key={candidate.id} 
                  candidate={candidate} 
                  onEdit={handleEditCandidate}
                  onRatingChange={handleCandidateRatingChange}
                />
              ))}
            </div>
          )}
        </div>

        {/* 5. Interviews This Week */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Interviews This Week</h2>
            <button
              onClick={() => setIsInterviewModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Schedule Interview
            </button>
          </div>
          <InterviewTable 
            interviews={interviews} 
            onEdit={handleEditInterview}
            onDelete={handleDeleteInterview}
            getRoleFunction={getRoleFunction}
          />
        </div>

        {/* 6. All Roles - Overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">All Roles - Overview</h2>
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Role
            </button>
          </div>
          <OverviewTable 
            roles={roles} 
            onEdit={handleEditRole}
            onDelete={handleDeleteRole}
          />
        </div>
      </main>

      {/* Modals */}
      <CandidateModal
        isOpen={isCandidateModalOpen}
        onClose={() => {
          setIsCandidateModalOpen(false);
          setEditingCandidate(null);
        }}
        onSave={handleSaveCandidate}
        candidate={editingCandidate}
        availableRoles={availableRoles}
      />

      <RoleModal
        isOpen={isRoleModalOpen}
        onClose={() => {
          setIsRoleModalOpen(false);
          setEditingRole(null);
        }}
        onSave={handleSaveRole}
        role={editingRole}
        taOwners={taOwners}
      />

      <InterviewModal
        isOpen={isInterviewModalOpen}
        onClose={() => {
          setIsInterviewModalOpen(false);
          setEditingInterview(null);
        }}
        onSave={handleSaveInterview}
        interview={editingInterview}
        availableCandidates={availableCandidates}
        availableRoles={availableRoles}
      />

      <BottleneckModal
        isOpen={isBottleneckModalOpen}
        onClose={() => {
          setIsBottleneckModalOpen(false);
          setEditingBottleneck(null);
        }}
        onSave={handleSaveBottleneck}
        bottleneck={editingBottleneck}
        availableRoles={availableRoles}
      />

      <TAOwnerModal
        isOpen={isTAOwnerModalOpen}
        onClose={() => setIsTAOwnerModalOpen(false)}
        onSave={handleSaveTAOwners}
        owners={taOwners}
      />

      <HeadcountAdminModal
        isOpen={isHeadcountAdminModalOpen}
        onClose={() => {
          setIsHeadcountAdminModalOpen(false);
          setEditingHeadcountData(null);
        }}
        onSave={handleSaveHeadcountData}
        data={editingHeadcountData}
        existingMonths={existingMonths}
      />
    </div>
  );
}

export default App;