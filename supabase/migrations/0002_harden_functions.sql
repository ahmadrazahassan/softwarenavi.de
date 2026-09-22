-- Supabase advisor fixes: extensions out of `public`, internal SECURITY DEFINER functions not callable via the REST API.
-- Triggers still fire (they run as the table owner); only direct RPC calls are blocked.
create schema if not exists extensions;
alter extension unaccent set schema extensions;
alter extension pg_trgm set schema extensions;
alter extension citext set schema extensions;

revoke execute on function public.purge_expired_personal_data() from public, anon, authenticated;
revoke execute on function public.refresh_software_ratings(uuid) from public, anon, authenticated;
revoke execute on function public.update_category_counts() from public, anon, authenticated;
revoke execute on function public.update_software_ratings() from public, anon, authenticated;
revoke execute on function public.write_audit_log() from public, anon, authenticated;
grant execute on function public.purge_expired_personal_data() to service_role;
grant execute on function public.refresh_software_ratings(uuid) to service_role;
