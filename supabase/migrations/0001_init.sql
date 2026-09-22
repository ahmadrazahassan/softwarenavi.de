-- Softwarenavi · core schema (backend spec §2–§4). Idempotent where Postgres allows it.
-- Region: eu-central-1 (Frankfurt). Schema/columns in English, seeded content in German.

create extension if not exists "uuid-ossp";
create extension if not exists unaccent;
create extension if not exists pg_trgm;
create extension if not exists citext;

-- ───────────────────────── categories ─────────────────────────
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  icon text,
  description text,
  software_count int not null default 0,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ───────────────────────── software ─────────────────────────
create table if not exists public.software (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  tagline text,
  description_short text not null,
  description_full text not null,
  logo_url text,
  screenshots jsonb not null default '[]',
  category_id uuid references public.categories(id) on delete set null,

  -- pricing
  starting_price numeric,
  price_currency text not null default 'EUR',
  billing_period text not null default 'month' check (billing_period in ('month','year','once')),
  price_is_net boolean not null default true,
  price_unit text not null default 'account' check (price_unit in ('account','user','employee','client','once')),
  free_trial boolean not null default false,
  trial_days int,
  free_version boolean not null default false,
  free_demo boolean not null default false,
  pricing_plans jsonb not null default '[]',
  pricing_note text,

  -- features
  features jsonb not null default '[]',
  top_features jsonb not null default '[]',
  integrations jsonb not null default '[]',
  pros jsonb not null default '[]',
  cons jsonb not null default '[]',
  ideal_for text,
  brand_color text,

  -- German compliance block (nullable = „keine Angabe")
  gobd_compliant text check (gobd_compliant in ('ja','teilweise','nein')),
  datev_interface text check (datev_interface in ('vollintegriert','export','nein')),
  e_invoicing jsonb not null default '[]',
  elster_submission boolean,
  hosting_location text check (hosting_location in ('Deutschland','EU','Drittland','on-premise')),
  dpa_available boolean,
  iso27001 boolean,
  tse_certified boolean,
  skr_support jsonb not null default '[]',
  german_support boolean,
  vendor_country text,
  compliance_checked_at date,

  -- affiliate
  affiliate_url text,
  vendor_website text,
  affiliate_network text not null default 'keins' check (affiliate_network in ('awin','belboon','direkt','keins')),

  -- vendor
  vendor_name text,
  founded_year int,
  vendor_hq text,
  support_types jsonb not null default '[]',
  countries_available jsonb not null default '[]',
  languages jsonb not null default '[]',

  -- editorial test (written by the Redaktion, clearly labelled; independent of user reviews)
  editorial_rating numeric(3,1),
  editorial_ease numeric(3,1),
  editorial_value numeric(3,1),
  editorial_service numeric(3,1),
  editorial_functionality numeric(3,1),
  editorial_verdict text,
  editorial_review text,
  editorial_author text,
  editorial_tested_at date,

  -- user ratings: trigger-maintained, never written by hand
  overall_rating numeric(3,1) not null default 0,
  ease_of_use_rating numeric(3,1) not null default 0,
  value_for_money_rating numeric(3,1) not null default 0,
  customer_service_rating numeric(3,1) not null default 0,
  functionality_rating numeric(3,1) not null default 0,
  review_count int not null default 0,

  -- seo
  meta_title text,
  meta_description text,
  og_image_url text,

  status text not null default 'draft' check (status in ('published','draft')),
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  search_vector tsvector generated always as (
    to_tsvector('german',
      coalesce(name,'') || ' ' || coalesce(tagline,'') || ' ' ||
      coalesce(description_short,'') || ' ' || coalesce(vendor_name,''))
  ) stored
);

create index if not exists idx_software_search on public.software using gin (search_vector);
create index if not exists idx_software_name_trgm on public.software using gin (name gin_trgm_ops);
create index if not exists idx_software_category on public.software (category_id) where status = 'published';
create index if not exists idx_software_status on public.software (status);
create index if not exists idx_software_hosting on public.software (hosting_location) where status = 'published';
create index if not exists idx_software_datev on public.software (datev_interface) where status = 'published';

-- ───────────────────────── reviews (moderated, UWG § 5b Abs. 3) ─────────────────────────
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  software_id uuid not null references public.software(id) on delete cascade,
  reviewer_name text not null,
  reviewer_job_title text,
  reviewer_company text,
  reviewer_industry text,
  reviewer_company_size text,
  reviewer_country text not null default 'Deutschland',
  reviewer_legal_form text,
  reviewer_avatar_url text,
  verified_linkedin boolean not null default false,
  verified_badge text,
  used_for_duration text,
  overall_rating int not null check (overall_rating between 1 and 5),
  ease_of_use int check (ease_of_use between 1 and 5),
  value_for_money int check (value_for_money between 1 and 5),
  customer_service int check (customer_service between 1 and 5),
  functionality int check (functionality between 1 and 5),
  review_title text not null,
  summary text,
  pros text,
  cons text,
  vendor_response text,
  vendor_response_date date,
  review_date date not null default current_date,
  helpful_count int not null default 0,
  status text not null default 'pending' check (status in ('pending','published','hidden')),
  consent_given boolean not null default false,
  consent_text_version text,
  consent_ip_hash text,
  consent_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists idx_reviews_software_pub on public.reviews (software_id) where status = 'published';
create index if not exists idx_reviews_date on public.reviews (review_date desc);
create index if not exists idx_reviews_status on public.reviews (status);

-- ───────────────────────── articles ─────────────────────────
create table if not exists public.articles (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text not null,
  featured_image_url text,
  category_tag text,
  related_software_id uuid references public.software(id) on delete set null,
  author_name text not null,
  author_bio text,
  author_avatar_url text,
  author_title text,
  meta_title text,
  meta_description text,
  og_image_url text,
  read_time_minutes int not null default 5,
  status text not null default 'draft' check (status in ('published','draft')),
  featured boolean not null default false,
  published_date date,
  updated_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_vector tsvector generated always as (
    to_tsvector('german', coalesce(title,'') || ' ' || coalesce(excerpt,''))
  ) stored
);
create index if not exists idx_articles_search on public.articles using gin (search_vector);

-- ───────────────────────── alternatives & comparisons ─────────────────────────
create table if not exists public.software_alternatives (
  id uuid primary key default uuid_generate_v4(),
  software_id uuid not null references public.software(id) on delete cascade,
  alternative_id uuid not null references public.software(id) on delete cascade,
  display_order int not null default 0,
  unique (software_id, alternative_id)
);

create table if not exists public.comparisons (
  id uuid primary key default uuid_generate_v4(),
  software_a_id uuid not null references public.software(id) on delete cascade,
  software_b_id uuid not null references public.software(id) on delete cascade,
  custom_verdict text,
  meta_title text,
  meta_description text,
  status text not null default 'published' check (status in ('published','draft')),
  created_at timestamptz not null default now(),
  unique (software_a_id, software_b_id)
);

-- ───────────────────────── affiliate clicks (service role only) ─────────────────────────
create table if not exists public.affiliate_clicks (
  id uuid primary key default uuid_generate_v4(),
  software_id uuid references public.software(id) on delete set null,
  software_name text,
  affiliate_url text,
  clicked_at timestamptz not null default now(),
  ip_hash text,
  user_agent text,
  referrer text,
  country_code text
);
create index if not exists idx_clicks_software on public.affiliate_clicks (software_id, clicked_at desc);
create index if not exists idx_clicks_time on public.affiliate_clicks (clicked_at desc);

-- ───────────────────────── settings & pages ─────────────────────────
create table if not exists public.site_settings (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null,
  value text,
  updated_at timestamptz not null default now()
);

create table if not exists public.pages (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  content text not null default '',
  meta_title text,
  meta_description text,
  status text not null default 'draft' check (status in ('published','draft')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ───────────────────────── enterprise additions ─────────────────────────
create table if not exists public.audit_log (
  id bigserial primary key,
  table_name text not null,
  record_id text,
  action text not null,
  actor uuid,
  changed_at timestamptz not null default now(),
  diff jsonb
);

create table if not exists public.redirects (
  id uuid primary key default uuid_generate_v4(),
  from_path text unique not null,
  to_path text not null,
  status_code int not null default 301,
  active boolean not null default true
);

create table if not exists public.media_library (
  id uuid primary key default uuid_generate_v4(),
  bucket text not null,
  path text not null,
  filename text not null,
  mime_type text,
  size_bytes bigint,
  alt_text text,
  uploaded_at timestamptz not null default now()
);

-- ───────────────────────── DSGVO: newsletter, contact, consent ─────────────────────────
create table if not exists public.newsletter_subscribers (
  id uuid primary key default uuid_generate_v4(),
  email citext not null unique,
  status text not null default 'pending' check (status in ('pending','confirmed','unsubscribed')),
  interests text[] not null default '{}',
  confirm_token text unique,
  confirm_token_expires_at timestamptz,
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  unsubscribe_token text unique,
  consent_ip_hash text,
  consent_source text,
  consent_text_version text,
  user_agent text,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  consent_given boolean not null,
  consent_ip_hash text,
  user_agent text,
  status text not null default 'neu' check (status in ('neu','beantwortet','archiviert')),
  answered_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.consent_log (
  id uuid primary key default uuid_generate_v4(),
  consent_id text not null,
  categories jsonb not null,
  action text not null check (action in ('granted','denied','updated','withdrawn')),
  policy_version text,
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now()
);
create index if not exists idx_consent_id on public.consent_log (consent_id, created_at desc);

-- ───────────────────────── triggers ─────────────────────────
create or replace function public.refresh_software_ratings(sid uuid) returns void
language sql security definer set search_path = public as $$
  update public.software s set
    overall_rating          = coalesce((select round(avg(overall_rating)::numeric, 1)   from public.reviews where software_id = sid and status = 'published'), 0),
    ease_of_use_rating      = coalesce((select round(avg(ease_of_use)::numeric, 1)      from public.reviews where software_id = sid and status = 'published'), 0),
    value_for_money_rating  = coalesce((select round(avg(value_for_money)::numeric, 1)  from public.reviews where software_id = sid and status = 'published'), 0),
    customer_service_rating = coalesce((select round(avg(customer_service)::numeric, 1) from public.reviews where software_id = sid and status = 'published'), 0),
    functionality_rating    = coalesce((select round(avg(functionality)::numeric, 1)    from public.reviews where software_id = sid and status = 'published'), 0),
    review_count            = (select count(*) from public.reviews where software_id = sid and status = 'published'),
    updated_at = now()
  where s.id = sid;
$$;

create or replace function public.update_software_ratings() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  perform public.refresh_software_ratings(coalesce(new.software_id, old.software_id));
  if tg_op = 'UPDATE' and old.software_id is distinct from new.software_id then
    perform public.refresh_software_ratings(old.software_id);
  end if;
  return coalesce(new, old);
end $$;

drop trigger if exists trg_reviews_ratings on public.reviews;
create trigger trg_reviews_ratings after insert or update or delete on public.reviews
  for each row execute function public.update_software_ratings();

create or replace function public.update_category_counts() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update public.categories c set software_count =
    (select count(*) from public.software s where s.category_id = c.id and s.status = 'published')
  where c.id in (coalesce(new.category_id, old.category_id), coalesce(old.category_id, new.category_id));
  return coalesce(new, old);
end $$;

drop trigger if exists trg_software_category_counts on public.software;
create trigger trg_software_category_counts
  after insert or update of category_id, status or delete on public.software
  for each row execute function public.update_category_counts();

create or replace function public.set_updated_at() returns trigger
language plpgsql set search_path = public as $$ begin new.updated_at = now(); return new; end $$;

drop trigger if exists trg_software_updated on public.software;
create trigger trg_software_updated before update on public.software for each row execute function public.set_updated_at();
drop trigger if exists trg_articles_updated on public.articles;
create trigger trg_articles_updated before update on public.articles for each row execute function public.set_updated_at();
drop trigger if exists trg_pages_updated on public.pages;
create trigger trg_pages_updated before update on public.pages for each row execute function public.set_updated_at();

create or replace function public.write_audit_log() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.audit_log (table_name, record_id, action, actor, diff)
  values (
    tg_table_name,
    coalesce((to_jsonb(new) ->> 'id'), (to_jsonb(old) ->> 'id')),
    tg_op,
    auth.uid(),
    jsonb_build_object('old', case when tg_op in ('UPDATE','DELETE') then to_jsonb(old) - 'search_vector' end,
                       'new', case when tg_op in ('INSERT','UPDATE') then to_jsonb(new) - 'search_vector' end)
  );
  return coalesce(new, old);
end $$;

do $$
declare t text;
begin
  foreach t in array array['software','reviews','articles','pages','site_settings'] loop
    execute format('drop trigger if exists trg_audit_%1$s on public.%1$I', t);
    execute format('create trigger trg_audit_%1$s after insert or update or delete on public.%1$I for each row execute function public.write_audit_log()', t);
  end loop;
end $$;

-- Löschkonzept (spec §9): call nightly via pg_cron or a cron route.
create or replace function public.purge_expired_personal_data() returns void
language plpgsql security definer set search_path = public as $$
begin
  delete from public.newsletter_subscribers where status = 'pending' and created_at < now() - interval '48 hours';
  delete from public.contact_messages where status = 'beantwortet' and coalesce(answered_at, created_at) < now() - interval '6 months';
  delete from public.consent_log where created_at < now() - interval '3 years';
  update public.affiliate_clicks set ip_hash = null, user_agent = null where clicked_at < now() - interval '90 days' and ip_hash is not null;
  update public.reviews set consent_ip_hash = null where consent_at < now() - interval '3 years' and consent_ip_hash is not null;
end $$;

-- ───────────────────────── RLS ─────────────────────────
do $$
declare t text;
begin
  foreach t in array array['categories','software','reviews','articles','software_alternatives','comparisons','affiliate_clicks',
                           'site_settings','pages','audit_log','redirects','media_library','newsletter_subscribers',
                           'contact_messages','consent_log'] loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- public reads
drop policy if exists "anon read categories" on public.categories;
create policy "anon read categories" on public.categories for select using (true);
drop policy if exists "anon read software" on public.software;
create policy "anon read software" on public.software for select using (status = 'published');
drop policy if exists "anon read reviews" on public.reviews;
create policy "anon read reviews" on public.reviews for select using (status = 'published');
drop policy if exists "anon read articles" on public.articles;
create policy "anon read articles" on public.articles for select using (status = 'published');
drop policy if exists "anon read alternatives" on public.software_alternatives;
create policy "anon read alternatives" on public.software_alternatives for select using (true);
drop policy if exists "anon read comparisons" on public.comparisons;
create policy "anon read comparisons" on public.comparisons for select using (status = 'published');
drop policy if exists "anon read pages" on public.pages;
create policy "anon read pages" on public.pages for select using (status = 'published');
drop policy if exists "anon read settings" on public.site_settings;
create policy "anon read settings" on public.site_settings for select using (true);

-- admin: full access on content tables
do $$
declare t text;
begin
  foreach t in array array['categories','software','reviews','articles','software_alternatives','comparisons','pages',
                           'site_settings','redirects','media_library'] loop
    execute format('drop policy if exists "admin all %1$s" on public.%1$I', t);
    execute format('create policy "admin all %1$s" on public.%1$I for all to authenticated using (true) with check (true)', t);
  end loop;
  -- evidentiary records: read only
  foreach t in array array['affiliate_clicks','consent_log','audit_log'] loop
    execute format('drop policy if exists "admin read %1$s" on public.%1$I', t);
    execute format('create policy "admin read %1$s" on public.%1$I for select to authenticated using (true)', t);
  end loop;
  -- personal-data inboxes: read, update status, delete (Auskunft / Löschung)
  foreach t in array array['newsletter_subscribers','contact_messages'] loop
    execute format('drop policy if exists "admin read %1$s" on public.%1$I', t);
    execute format('create policy "admin read %1$s" on public.%1$I for select to authenticated using (true)', t);
    execute format('drop policy if exists "admin update %1$s" on public.%1$I', t);
    execute format('create policy "admin update %1$s" on public.%1$I for update to authenticated using (true) with check (true)', t);
    execute format('drop policy if exists "admin delete %1$s" on public.%1$I', t);
    execute format('create policy "admin delete %1$s" on public.%1$I for delete to authenticated using (true)', t);
  end loop;
end $$;

-- ───────────────────────── storage ─────────────────────────
insert into storage.buckets (id, name, public)
values ('logos','logos',true), ('screenshots','screenshots',true), ('avatars','avatars',true), ('articles','articles',true)
on conflict (id) do nothing;

drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects for select
  using (bucket_id in ('logos','screenshots','avatars','articles'));
drop policy if exists "admin write media" on storage.objects;
create policy "admin write media" on storage.objects for insert to authenticated
  with check (bucket_id in ('logos','screenshots','avatars','articles'));
drop policy if exists "admin update media" on storage.objects;
create policy "admin update media" on storage.objects for update to authenticated
  using (bucket_id in ('logos','screenshots','avatars','articles'));
drop policy if exists "admin delete media" on storage.objects;
create policy "admin delete media" on storage.objects for delete to authenticated
  using (bucket_id in ('logos','screenshots','avatars','articles'));

-- ───────────────────────── default settings ─────────────────────────
insert into public.site_settings (key, value) values
  ('site_name','Softwarenavi'),
  ('tagline','Unabhängiges Vergleichsportal für Unternehmenssoftware in Deutschland'),
  ('footer_tagline','Unabhängige Tests und Vergleiche von Unternehmenssoftware für den deutschen Mittelstand.'),
  ('footer_text','Softwarenavi hilft deutschen Unternehmen, die passende Software zu finden. Mit ausführlichen Redaktionstests, geprüften Nutzerbewertungen und Nettopreisen.'),
  ('contact_email','hallo@softwarenavi.de'),
  ('editorial_email','hallo@softwarenavi.de'),
  ('contact_phone','+49 155 10369734'),
  ('contact_city','Neu-Isenburg (bei Frankfurt am Main), Deutschland'),
  ('social_linkedin',''),
  ('social_xing',''),
  ('social_twitter',''),
  ('social_facebook',''),
  ('years_active','1'),
  ('items_per_page','12'),
  ('analytics_domain',''),
  ('vat_rate_standard','19'),
  ('vat_rate_reduced','7')
on conflict (key) do nothing;
