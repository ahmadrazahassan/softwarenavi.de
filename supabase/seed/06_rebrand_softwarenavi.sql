-- One-off update for an EXISTING database: Softwarelotse -> Softwarenavi, founder byline, contact data.
-- Run once in Supabase → SQL Editor, then run 05_pages.sql again to load the completed Impressum/Datenschutz.

update public.software set
  editorial_author = 'Nadeem Abbas'
where editorial_author is null or editorial_author ilike '%redaktion%';

update public.articles set
  author_name  = 'Nadeem Abbas',
  author_title = 'Gründer und Autor von Softwarenavi',
  author_bio   = 'Nadeem Abbas betreibt Softwarenavi als private, unabhängige Website und vergleicht Unternehmenssoftware für den deutschen Markt auf Basis von Herstellerangaben, geprüften Preislisten und Nutzerbewertungen.';

update public.articles set
  content = replace(replace(replace(content, 'redaktion@softwarelotse.de', 'hallo@softwarenavi.de'), 'softwarelotse', 'softwarenavi'), 'Softwarelotse', 'Softwarenavi'),
  title   = replace(title, 'Softwarelotse', 'Softwarenavi');

update public.pages set
  content = replace(replace(replace(replace(content, 'redaktion@softwarelotse.de', 'hallo@softwarenavi.de'), 'presse@softwarelotse.de', 'hallo@softwarenavi.de'), 'softwarelotse', 'softwarenavi'), 'Softwarelotse', 'Softwarenavi'),
  meta_title = replace(meta_title, 'Softwarelotse', 'Softwarenavi'),
  meta_description = replace(meta_description, 'Softwarelotse', 'Softwarenavi');

update public.site_settings set value = replace(replace(value, 'softwarelotse', 'softwarenavi'), 'Softwarelotse', 'Softwarenavi');
update public.site_settings set value = 'hallo@softwarenavi.de' where key = 'contact_email';
update public.site_settings set value = '+49 155 10369734'      where key = 'contact_phone';
update public.site_settings set value = 'hallo@softwarenavi.de' where key = 'editorial_email';
update public.site_settings set value = 'Neu-Isenburg (bei Frankfurt am Main), Deutschland' where key = 'contact_city';
