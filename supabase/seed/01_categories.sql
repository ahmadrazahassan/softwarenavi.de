insert into public.categories (name, slug, icon, description, display_order) values
('Buchhaltungssoftware', 'buchhaltungssoftware', 'calculator', 'Buchhaltung, Rechnungsstellung, Umsatzsteuer-Voranmeldung und Auswertungen. GoBD-konform und mit DATEV-Schnittstelle für die Zusammenarbeit mit Ihrer Steuerkanzlei.', 1),
('Lohnabrechnung', 'lohnabrechnung', 'wallet', 'Entgeltabrechnung, Lohnsteueranmeldung, DEÜV-Meldungen und Lohnsteuerbescheinigungen für deutsche Arbeitgeber.', 2),
('HR-Software', 'hr-software', 'users', 'Personalverwaltung, Abwesenheiten, Onboarding, Zeugnisse und digitale Personalakte. DSGVO-konform und betriebsratstauglich.', 3),
('CRM-Software', 'crm-software', 'handshake', 'Kontakte, Leads, Angebote und Vertriebsprozesse für den deutschen Mittelstand.', 4),
('ERP & Warenwirtschaft', 'erp-warenwirtschaft', 'boxes', 'Warenwirtschaft, Einkauf, Produktion und Finanzen in einem System, vom Handwerksbetrieb bis zum Mittelständler.', 5),
('Projektmanagement', 'projektmanagement', 'kanban', 'Aufgaben, Zeitpläne und Auslastung im Team, inklusive Anbieter mit Serverstandort in Deutschland.', 6),
('Zeiterfassung', 'zeiterfassung', 'clock', 'Arbeitszeiterfassung nach dem BAG-Beschluss: mobil, manipulationssicher und auswertbar.', 7),
('Dokumentenmanagement', 'dokumentenmanagement', 'folder-archive', 'Revisionssichere Archivierung nach GoBD, Belegablage und Freigabeprozesse.', 8)
on conflict (slug) do update set name = excluded.name, icon = excluded.icon, description = excluded.description, display_order = excluded.display_order;
