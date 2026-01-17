-- Drop the overly permissive INSERT policy on audit_logs
DROP POLICY IF EXISTS "Allow authenticated users to insert audit logs" ON public.audit_logs;

-- Create a restrictive INSERT policy - only allow service role or direct database triggers to insert
-- Since audit logs should only be created by database triggers, we deny all direct inserts from clients
CREATE POLICY "Deny direct inserts - only triggers can insert" 
ON public.audit_logs 
FOR INSERT 
TO authenticated
WITH CHECK (false);

-- Keep the SELECT policy for admins to view logs (assuming it exists, if not we add it)
DROP POLICY IF EXISTS "Allow admins to view audit logs" ON public.audit_logs;
CREATE POLICY "Allow admins to view audit logs" 
ON public.audit_logs 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));