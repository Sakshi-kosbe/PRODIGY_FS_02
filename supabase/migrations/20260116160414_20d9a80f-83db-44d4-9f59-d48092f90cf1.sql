-- Drop the overly permissive system insert policy
DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Deny direct inserts - only triggers can insert" ON public.audit_logs;

-- Audit logs should only be inserted via the SECURITY DEFINER trigger function
-- No direct client inserts are allowed - the trigger runs as the function owner
-- We create a policy that denies all authenticated user inserts
CREATE POLICY "No direct client inserts allowed" 
ON public.audit_logs 
FOR INSERT 
TO authenticated
WITH CHECK (false);