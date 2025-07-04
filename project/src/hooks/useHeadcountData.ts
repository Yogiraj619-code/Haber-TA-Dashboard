import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface HeadcountData {
  id?: string;
  month: string;
  existingHeadcount: number;
  newJoinees: number;
  joinerNames: string;
  exits: number;
  exiterNames: string;
  expectedJoiners: number;
  expectedJoinerRoles: string;
}

export const useHeadcountData = () => {
  const [headcountData, setHeadcountData] = useState<HeadcountData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load headcount data
  const loadHeadcountData = async () => {
    if (!supabase || !isSupabaseConfigured()) {
      setError('Supabase is not configured');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('headcount_summary')
        .select('*')
        .order('month');

      if (error) throw error;

      const formattedData: HeadcountData[] = data.map(item => ({
        id: item.id,
        month: item.month,
        existingHeadcount: item.existing_headcount,
        newJoinees: item.new_joinees,
        joinerNames: item.joiner_names || '',
        exits: item.exits,
        exiterNames: item.exiter_names || '',
        expectedJoiners: item.expected_joiners,
        expectedJoinerRoles: item.expected_joiner_roles || ''
      }));

      setHeadcountData(formattedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load headcount data');
    } finally {
      setLoading(false);
    }
  };

  // Save headcount data
  const saveHeadcountData = async (data: HeadcountData) => {
    if (!supabase || !isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const dbData = {
      month: data.month,
      existing_headcount: data.existingHeadcount,
      new_joinees: data.newJoinees,
      joiner_names: data.joinerNames,
      exits: data.exits,
      exiter_names: data.exiterNames,
      expected_joiners: data.expectedJoiners,
      expected_joiner_roles: data.expectedJoinerRoles,
      updated_at: new Date().toISOString()
    };

    if (data.id) {
      // Update existing
      const { error } = await supabase
        .from('headcount_summary')
        .update(dbData)
        .eq('id', data.id);

      if (error) throw error;
    } else {
      // Insert new
      const { error } = await supabase
        .from('headcount_summary')
        .insert(dbData);

      if (error) throw error;
    }

    await loadHeadcountData();
  };

  // Delete headcount data
  const deleteHeadcountData = async (id: string) => {
    if (!supabase || !isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const { error } = await supabase
      .from('headcount_summary')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await loadHeadcountData();
  };

  useEffect(() => {
    loadHeadcountData();
  }, []);

  return {
    headcountData,
    loading,
    error,
    saveHeadcountData,
    deleteHeadcountData,
    refreshData: loadHeadcountData
  };
};