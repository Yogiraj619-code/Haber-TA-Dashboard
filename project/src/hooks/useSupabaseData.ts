import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Candidate, Role, Interview, Bottleneck, Offer, Attrition } from '../types';

export const useSupabaseData = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [bottlenecks, setBottlenecks] = useState<Bottleneck[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [attrition, setAttrition] = useState<Attrition[]>([]);
  const [taOwners, setTAOwners] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all data on mount
  useEffect(() => {
    if (isSupabaseConfigured() && supabase) {
      loadAllData();
    } else {
      setLoading(false);
      setError('Supabase is not configured. Please set up your environment variables.');
    }
  }, []);

  const loadAllData = async () => {
    if (!supabase) {
      setError('Supabase client is not available');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      await Promise.all([
        loadCandidates(),
        loadRoles(),
        loadInterviews(),
        loadBottlenecks(),
        loadOffers(),
        loadAttrition(),
        loadTAOwners()
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadCandidates = async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formattedCandidates: Candidate[] = data.map(candidate => ({
      id: candidate.id,
      name: candidate.name,
      photo: candidate.photo || undefined,
      company: candidate.company,
      designation: candidate.designation,
      experience: candidate.experience,
      noticePeriod: candidate.notice_period,
      currentCTC: candidate.current_ctc === 0 ? 'Confidential' : candidate.current_ctc,
      expectedCTC: candidate.expected_ctc === 0 ? 'Confidential' : candidate.expected_ctc,
      role: candidate.role,
      stage: candidate.stage,
      notes: candidate.notes,
      tags: candidate.tags,
      rating: candidate.rating || undefined
    }));

    setCandidates(formattedCandidates);
  };

  const loadRoles = async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formattedRoles: Role[] = data.map(role => ({
      id: role.id,
      title: role.title,
      taOwner: role.ta_owner,
      status: role.status as Role['status'],
      daysOpen: role.days_open,
      pipelineCount: role.pipeline_count,
      interviews: role.interviews,
      offerStatus: role.offer_status,
      isCritical: role.is_critical,
      function: role.function || undefined
    }));

    setRoles(formattedRoles);
  };

  const loadInterviews = async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from('interviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formattedInterviews: Interview[] = data.map(interview => ({
      id: interview.id,
      candidateName: interview.candidate_name,
      stage: interview.stage,
      date: interview.date,
      panel: interview.panel,
      roleTitle: interview.role_title || ''
    }));

    setInterviews(formattedInterviews);
  };

  const loadBottlenecks = async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from('bottlenecks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formattedBottlenecks: Bottleneck[] = data.map(bottleneck => ({
      id: bottleneck.id,
      description: bottleneck.description,
      roleTitle: bottleneck.role_title || ''
    }));

    setBottlenecks(formattedBottlenecks);
  };

  const loadOffers = async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from('offers')
      .select('*');

    if (error) throw error;

    const formattedOffers: Offer[] = data.map(offer => ({
      id: offer.id,
      candidateName: offer.candidate_name,
      roleTitle: offer.role_title,
      offerDate: offer.offer_date || undefined,
      joinDate: offer.join_date || undefined,
      status: offer.status as Offer['status'],
      packageAmount: offer.package_amount || undefined
    }));

    setOffers(formattedOffers);
  };

  const loadAttrition = async () => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('attrition')
        .select('*')
        .order('exit_date', { ascending: false });

      if (error) {
        // If the attrition table doesn't exist, just set empty array
        if (error.code === '42P01') {
          setAttrition([]);
          return;
        }
        throw error;
      }

      const formattedAttrition: Attrition[] = data.map(attrition => ({
        id: attrition.id,
        employeeName: attrition.employee_name,
        role: attrition.role,
        exitDate: attrition.exit_date,
        reason: attrition.reason || undefined
      }));

      setAttrition(formattedAttrition);
    } catch (err) {
      // If there's any error loading attrition data, just set empty array
      setAttrition([]);
    }
  };

  const loadTAOwners = async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from('ta_owners')
      .select('*')
      .order('name');

    if (error) throw error;

    setTAOwners(data.map(owner => owner.name));
  };

  // CRUD operations for candidates
  const saveCandidate = async (candidate: Candidate) => {
    if (!supabase) throw new Error('Supabase is not configured');

    const candidateData = {
      name: candidate.name,
      photo: candidate.photo || null,
      company: candidate.company,
      designation: candidate.designation,
      experience: candidate.experience,
      notice_period: candidate.noticePeriod,
      current_ctc: candidate.currentCTC === 'Confidential' ? 0 : candidate.currentCTC,
      expected_ctc: candidate.expectedCTC === 'Confidential' ? 0 : candidate.expectedCTC,
      role: candidate.role,
      stage: candidate.stage,
      notes: candidate.notes,
      tags: candidate.tags,
      rating: candidate.rating || null,
      updated_at: new Date().toISOString()
    };

    if (candidate.id && candidates.find(c => c.id === candidate.id)) {
      // Update existing
      const { error } = await supabase
        .from('candidates')
        .update(candidateData)
        .eq('id', candidate.id);

      if (error) throw error;
    } else {
      // Insert new
      const { error } = await supabase
        .from('candidates')
        .insert(candidateData);

      if (error) throw error;
    }

    await loadCandidates();
  };

  // Update candidate rating
  const updateCandidateRating = async (candidateId: string, rating: number) => {
    if (!supabase) throw new Error('Supabase is not configured');

    const { error } = await supabase
      .from('candidates')
      .update({ 
        rating: rating,
        updated_at: new Date().toISOString()
      })
      .eq('id', candidateId);

    if (error) throw error;
    await loadCandidates();
  };

  // CRUD operations for roles
  const saveRole = async (role: Role) => {
    if (!supabase) throw new Error('Supabase is not configured');

    const roleData = {
      title: role.title,
      ta_owner: role.taOwner,
      status: role.status,
      days_open: role.daysOpen,
      pipeline_count: role.pipelineCount,
      interviews: role.interviews,
      offer_status: role.offerStatus,
      is_critical: role.isCritical,
      function: role.function || null,
      updated_at: new Date().toISOString()
    };

    if (role.id && roles.find(r => r.id === role.id)) {
      // Update existing
      const { error } = await supabase
        .from('roles')
        .update(roleData)
        .eq('id', role.id);

      if (error) throw error;
    } else {
      // Insert new
      const { error } = await supabase
        .from('roles')
        .insert(roleData);

      if (error) throw error;
    }

    await loadRoles();
  };

  const deleteRole = async (roleId: string) => {
    if (!supabase) throw new Error('Supabase is not configured');

    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', roleId);

    if (error) throw error;
    await loadRoles();
  };

  // CRUD operations for interviews
  const saveInterview = async (interview: Interview) => {
    if (!supabase) throw new Error('Supabase is not configured');

    const interviewData = {
      candidate_name: interview.candidateName,
      stage: interview.stage,
      date: interview.date,
      panel: interview.panel,
      role_title: interview.roleTitle || null,
      updated_at: new Date().toISOString()
    };

    if (interview.id && interviews.find(i => i.id === interview.id)) {
      // Update existing
      const { error } = await supabase
        .from('interviews')
        .update(interviewData)
        .eq('id', interview.id);

      if (error) throw error;
    } else {
      // Insert new
      const { error } = await supabase
        .from('interviews')
        .insert(interviewData);

      if (error) throw error;
    }

    await loadInterviews();
  };

  const deleteInterview = async (interviewId: string) => {
    if (!supabase) throw new Error('Supabase is not configured');

    const { error } = await supabase
      .from('interviews')
      .delete()
      .eq('id', interviewId);

    if (error) throw error;
    await loadInterviews();
  };

  // CRUD operations for bottlenecks
  const saveBottleneck = async (bottleneck: Bottleneck) => {
    if (!supabase) throw new Error('Supabase is not configured');

    const bottleneckData = {
      description: bottleneck.description,
      role_title: bottleneck.roleTitle || null,
      updated_at: new Date().toISOString()
    };

    if (bottleneck.id && bottlenecks.find(b => b.id === bottleneck.id)) {
      // Update existing
      const { error } = await supabase
        .from('bottlenecks')
        .update(bottleneckData)
        .eq('id', bottleneck.id);

      if (error) throw error;
    } else {
      // Insert new
      const { error } = await supabase
        .from('bottlenecks')
        .insert({
          description: bottleneck.description,
          role_title: bottleneck.roleTitle || null
        });

      if (error) throw error;
    }

    await loadBottlenecks();
  };

  const deleteBottleneck = async (bottleneckId: string) => {
    if (!supabase) throw new Error('Supabase is not configured');

    const { error } = await supabase
      .from('bottlenecks')
      .delete()
      .eq('id', bottleneckId);

    if (error) throw error;
    await loadBottlenecks();
  };

  // CRUD operations for TA owners
  const saveTAOwners = async (owners: string[]) => {
    if (!supabase) throw new Error('Supabase is not configured');

    // Delete all existing owners
    await supabase.from('ta_owners').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Insert new owners
    const ownerData = owners.map(name => ({ name }));
    const { error } = await supabase
      .from('ta_owners')
      .insert(ownerData);

    if (error) throw error;
    await loadTAOwners();
  };

  // Calculate metrics for summary
  const getCurrentMonthMetrics = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // New joiners this month
    const newJoiners = offers.filter(offer => {
      if (offer.status === 'Joined' && offer.joinDate) {
        const joinDate = new Date(offer.joinDate);
        return joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear;
      }
      return false;
    }).length;

    // Expected joiners next 30 days
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const expectedJoiners = offers.filter(offer => {
      if (offer.status === 'Accepted' && offer.joinDate) {
        const joinDate = new Date(offer.joinDate);
        return joinDate > currentDate && joinDate <= thirtyDaysFromNow;
      }
      return false;
    }).length;

    // Attrition this month
    const attritionThisMonth = attrition.filter(exit => {
      const exitDate = new Date(exit.exitDate);
      return exitDate.getMonth() === currentMonth && exitDate.getFullYear() === currentYear;
    }).length;

    return {
      newJoiners,
      expectedJoiners,
      attritionThisMonth
    };
  };

  // Calculate function-wise active roles
  const getFunctionWiseActiveRoles = () => {
    const activeRoles = roles.filter(role => role.status !== 'Closed');
    const functionCounts: Record<string, number> = {};
    
    activeRoles.forEach(role => {
      const func = role.function || 'Unassigned';
      functionCounts[func] = (functionCounts[func] || 0) + 1;
    });

    return functionCounts;
  };

  return {
    candidates,
    roles,
    interviews,
    bottlenecks,
    offers,
    attrition,
    taOwners,
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
    getFunctionWiseActiveRoles,
    refreshData: loadAllData
  };
};