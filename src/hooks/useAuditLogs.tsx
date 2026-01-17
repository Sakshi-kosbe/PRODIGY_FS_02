import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AuditLog {
  id: string;
  table_name: string;
  record_id: string | null;
  action: string;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
  user_id: string | null;
  ip_address: string | null;
  created_at: string;
}

export interface AuditLogFilters {
  action?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export function useAuditLogs(filters: AuditLogFilters = {}) {
  return useQuery({
    queryKey: ['audit_logs', filters],
    queryFn: async () => {
      let query = supabase
        .from('audit_logs')
        .select('*')
        .eq('table_name', 'employees')
        .order('created_at', { ascending: false });

      if (filters.action && filters.action !== 'all') {
        query = query.eq('action', filters.action);
      }

      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate);
      }

      if (filters.endDate) {
        query = query.lte('created_at', `${filters.endDate}T23:59:59`);
      }

      const { data, error } = await query.limit(100);

      if (error) throw error;
      return data as AuditLog[];
    },
  });
}
