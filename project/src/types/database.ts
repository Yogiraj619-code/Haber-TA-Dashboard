export interface Database {
  public: {
    Tables: {
      candidates: {
        Row: {
          id: string;
          name: string;
          photo: string | null;
          company: string;
          designation: string;
          experience: number;
          notice_period: string;
          current_ctc: number | null;
          expected_ctc: number | null;
          role: string;
          stage: string;
          notes: string;
          tags: string[];
          rating: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          photo?: string | null;
          company: string;
          designation: string;
          experience: number;
          notice_period: string;
          current_ctc: number | null;
          expected_ctc: number | null;
          role: string;
          stage?: string;
          notes?: string;
          tags?: string[];
          rating?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          photo?: string | null;
          company?: string;
          designation?: string;
          experience?: number;
          notice_period?: string;
          current_ctc?: number | null;
          expected_ctc?: number | null;
          role?: string;
          stage?: string;
          notes?: string;
          tags?: string[];
          rating?: number | null;
          updated_at?: string;
        };
      };
      roles: {
        Row: {
          id: string;
          title: string;
          ta_owner: string;
          status: string;
          days_open: number;
          pipeline_count: number;
          interviews: number;
          offer_status: string;
          is_critical: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          ta_owner: string;
          status?: string;
          days_open?: number;
          pipeline_count?: number;
          interviews?: number;
          offer_status?: string;
          is_critical?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          ta_owner?: string;
          status?: string;
          days_open?: number;
          pipeline_count?: number;
          interviews?: number;
          offer_status?: string;
          is_critical?: boolean;
          updated_at?: string;
        };
      };
      interviews: {
        Row: {
          id: string;
          candidate_name: string;
          stage: string;
          date: string;
          panel: string[];
          role_title: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          candidate_name: string;
          stage: string;
          date: string;
          panel?: string[];
          role_title?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          candidate_name?: string;
          stage?: string;
          date?: string;
          panel?: string[];
          role_title?: string | null;
          updated_at?: string;
        };
      };
      bottlenecks: {
        Row: {
          id: string;
          description: string;
          role_title: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          description: string;
          role_title?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          description?: string;
          role_title?: string | null;
          updated_at?: string;
        };
      };
      ta_owners: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          updated_at?: string;
        };
      };
      offers: {
        Row: {
          id: string;
          candidate_name: string;
          role_title: string;
          offer_date: string | null;
          join_date: string | null;
          status: string;
          package_amount: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          candidate_name: string;
          role_title: string;
          offer_date?: string | null;
          join_date?: string | null;
          status?: string;
          package_amount?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          candidate_name?: string;
          role_title?: string;
          offer_date?: string | null;
          join_date?: string | null;
          status?: string;
          package_amount?: number | null;
          updated_at?: string;
        };
      };
      attrition: {
        Row: {
          id: string;
          employee_name: string;
          role: string;
          exit_date: string;
          reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          employee_name: string;
          role: string;
          exit_date: string;
          reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          employee_name?: string;
          role?: string;
          exit_date?: string;
          reason?: string | null;
          updated_at?: string;
        };
      };
    };
  };
}