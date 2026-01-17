-- Drop existing policies on employees table
DROP POLICY IF EXISTS "Admins can view employees" ON public.employees;
DROP POLICY IF EXISTS "Admins can insert employees" ON public.employees;
DROP POLICY IF EXISTS "Admins can update employees" ON public.employees;
DROP POLICY IF EXISTS "Admins can delete employees" ON public.employees;

-- Force RLS - ensures even table owners must pass RLS checks
ALTER TABLE public.employees FORCE ROW LEVEL SECURITY;

-- Revoke all default privileges from public
REVOKE ALL ON public.employees FROM PUBLIC;
REVOKE ALL ON public.employees FROM anon;

-- Grant only necessary privileges to authenticated users (RLS will control actual access)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employees TO authenticated;

-- Create PERMISSIVE policies that ONLY allow admin access
-- These are the ONLY policies - no other access path exists

CREATE POLICY "Admins can view employees"
ON public.employees
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert employees"
ON public.employees
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update employees"
ON public.employees
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete employees"
ON public.employees
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Also secure the user_roles table properly
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

ALTER TABLE public.user_roles FORCE ROW LEVEL SECURITY;

REVOKE ALL ON public.user_roles FROM PUBLIC;
REVOKE ALL ON public.user_roles FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;

-- Users can only view their own role (for checking admin status)
CREATE POLICY "Users can view own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Only existing admins can manage roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Secure profiles table
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;
REVOKE ALL ON public.profiles FROM PUBLIC;
REVOKE ALL ON public.profiles FROM anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;

-- Secure departments table  
ALTER TABLE public.departments FORCE ROW LEVEL SECURITY;
REVOKE ALL ON public.departments FROM PUBLIC;
REVOKE ALL ON public.departments FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.departments TO authenticated;