import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Employee {
  id: string;
  employee_id: string;
  full_name: string;
  email: string;
  phone_number: string | null;
  department_id: string | null;
  role: string;
  date_of_joining: string;
  employment_status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  departments?: {
    id: string;
    name: string;
  } | null;
}

export interface Department {
  id: string;
  name: string;
}

export interface EmployeeInput {
  employee_id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  department_id?: string;
  role: string;
  date_of_joining: string;
  employment_status: 'active' | 'inactive';
}

export function useEmployees() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const employeesQuery = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select(`
          *,
          departments (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Employee[];
    },
  });

  const departmentsQuery = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Department[];
    },
  });

  const createEmployee = useMutation({
    mutationFn: async (employee: EmployeeInput) => {
      const { data, error } = await supabase
        .from('employees')
        .insert([employee])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: 'Employee Added',
        description: 'The employee has been successfully added.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateEmployee = useMutation({
    mutationFn: async ({ id, ...employee }: EmployeeInput & { id: string }) => {
      const { data, error } = await supabase
        .from('employees')
        .update(employee)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: 'Employee Updated',
        description: 'The employee has been successfully updated.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteEmployee = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: 'Employee Deleted',
        description: 'The employee has been successfully removed.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    employees: employeesQuery.data ?? [],
    departments: departmentsQuery.data ?? [],
    isLoading: employeesQuery.isLoading || departmentsQuery.isLoading,
    error: employeesQuery.error || departmentsQuery.error,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  };
}
