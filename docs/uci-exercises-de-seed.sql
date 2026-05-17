-- =============================================================
-- UCI-Übungen: name_de-Updates aus PDF
-- =============================================================
-- Quelle: https://kunstradreglement.com/images/PDF/datenfiles_kufa/2026/UCI-Reglement%20Kunstrad%202026%20deutsch.pdf
-- Geparst: 2026-05-17T09:49:28.330Z
-- Treffer: 2034 Codes
--
-- Auto-generiert von scripts/parse-uci-pdf.mjs — NICHT manuell editieren.
-- Idempotent (ON CONFLICT DO UPDATE).
-- =============================================================

insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1001a', '1er', 0.5, 'Reitsitz HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1001b', '1er', 0.7, 'Reitsitz R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1001c', '1er', 0.7, 'Reitsitz frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1001d', '1er', 0.9, 'Reitsitz frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1002a', '1er', 2.1, 'Reitsitz rw. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1002b', '1er', 2.3, 'Reitsitz rw. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1002c', '1er', 3, 'Reitsitz rw. frh. Lenkerdrehen Eschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1003a', '1er', 1.2, 'Kehrreitsitz HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1003b', '1er', 1.4, 'Kehrreitsitz R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1004a', '1er', 1.9, 'Kehrreitsitz rw. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1004b', '1er', 2.1, 'Kehrreitsitz rw. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1004c', '1er', 2.8, 'Kehrreitsitz rw. S', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1004d', '1er', 3.6, 'Kehrreitsitz rw. 8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1004e', '1er', 3.6, 'Kehrreitsitz rw. frh. Lenkerdrehen Eschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1011a', '1er', 0.7, 'Fußsteuerung HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1011b', '1er', 0.9, 'Fußsteuerung R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1011c', '1er', 0.9, 'Fußsteuerung frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1011d', '1er', 1.1, 'Fußsteuerung frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1012a', '1er', 0.8, 'Damensitz HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1012b', '1er', 1, 'Damensitz R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1012c', '1er', 1.2, 'Damensitz frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1012d', '1er', 1.4, 'Damensitz frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1013a', '1er', 2.5, 'Damensitz rw. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1013b', '1er', 2.7, 'Damensitz rw. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1016a', '1er', 1.8, 'Lenkersitz HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1016b', '1er', 2, 'Lenkersitz R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1016c', '1er', 2, 'Lenkersitz frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1016d', '1er', 2.2, 'Lenkersitz frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1016e', '1er', 2.6, 'Lenkersitz frh. S', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1016f', '1er', 3.4, 'Lenkersitz frh. 8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1017a', '1er', 1.2, 'Kehrlenkersitz HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1017b', '1er', 1.4, 'Kehrlenkersitz R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1017c', '1er', 1.4, 'Kehrlenkersitz frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1017d', '1er', 1.6, 'Kehrlenkersitz frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1021a', '1er', 0.9, 'Reitstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1021b', '1er', 1.1, 'Reitstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1021c', '1er', 1.1, 'Reitstand frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1021d', '1er', 1.3, 'Reitstand frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1022a', '1er', 2.6, 'Reitstand rw. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1022b', '1er', 2.8, 'Reitstand rw. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1023a', '1er', 1.3, 'Kehrreitstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1023b', '1er', 1.5, 'Kehrreitstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1023c', '1er', 1.5, 'Kehrreitstand frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1023d', '1er', 1.7, 'Kehrreitstand frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1024a', '1er', 2.6, 'Kehrreitstand rw. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1024b', '1er', 2.8, 'Kehrreitstand rw. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1031a', '1er', 1.8, 'Frontstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1031b', '1er', 2, 'Frontstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1031c', '1er', 2, 'Frontstand frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1031d', '1er', 2.2, 'Frontstand frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1031e', '1er', 2.6, 'Frontstand frh. S', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1031f', '1er', 3.4, 'Frontstand frh. 8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1032a', '1er', 2, 'Kehrstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1032b', '1er', 2.2, 'Kehrstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1036a', '1er', 1.3, 'Seitpedalstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1036b', '1er', 1.5, 'Seitpedalstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1037a', '1er', 1.2, 'Seitenstand Fußantrieb HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1037b', '1er', 1.4, 'Seitenstand Fußantrieb R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1038a', '1er', 1.2, 'Seitenstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1038b', '1er', 1.4, 'Seitenstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1038c', '1er', 1.4, 'Seitenstand frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1038d', '1er', 1.6, 'Seitenstand frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1039a', '1er', 1.6, 'Kehrseitenstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1039b', '1er', 1.8, 'Kehrseitenstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1039c', '1er', 1.8, 'Kehrseitenstand frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1039d', '1er', 2, 'Kehrseitenstand frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1040a', '1er', 1.2, 'Seitknien Fußantrieb HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1040b', '1er', 1.4, 'Seitknien Fußantrieb R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1041a', '1er', 1.3, 'Rahmensitz HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1041b', '1er', 1.5, 'Rahmensitz R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1046a', '1er', 1.3, 'Dornenstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1046b', '1er', 1.5, 'Dornenstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1046c', '1er', 2.1, 'Dornenstand frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1046d', '1er', 2.3, 'Dornenstand frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1046e', '1er', 2.7, 'Dornenstand frh. S', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1047a', '1er', 1.6, 'Dornbeugestand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1047b', '1er', 1.8, 'Dornbeugestand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1047c', '1er', 3, 'Dornbeugestand frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1047d', '1er', 3.2, 'Dornbeugestand frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1048a', '1er', 3, 'Dornbeugestand rw. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1048b', '1er', 3.2, 'Dornbeugestand rw. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1051a', '1er', 1.3, 'Kniebeugesitz HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1051b', '1er', 1.5, 'Kniebeugesitz R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1053a', '1er', 1.9, 'Sattelknien HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1053b', '1er', 2.1, 'Sattelknien R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1054a', '1er', 3.8, 'Sattelknien rw. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1054b', '1er', 4, 'Sattelknien rw. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1061a', '1er', 1.7, 'Sattelbeugestand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1061b', '1er', 1.9, 'Sattelbeugestand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1062a', '1er', 3.4, 'Sattelbeugestand rw. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1062b', '1er', 3.6, 'Sattelbeugestand rw. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1063a', '1er', 1.7, 'Rahmenbeugestand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1063b', '1er', 1.9, 'Rahmenbeugestand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1064a', '1er', 3.4, 'Rahmenbeugestand rw. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1064b', '1er', 3.6, 'Rahmenbeugestand rw. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1065a', '1er', 2.1, 'Kehrrahmenbeugestand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1065b', '1er', 2.3, 'Kehrrahmenbeugestand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1066a', '1er', 2.2, 'Kehrlenkerbeugestand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1066b', '1er', 2.3, 'Kehrlenkerbeugestand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1071a', '1er', 1.2, 'Kehrpedalseitstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1071b', '1er', 1.4, 'Kehrpedalseitstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1076a', '1er', 1.1, 'Rahmenstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1076b', '1er', 1.3, 'Rahmenstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1076c', '1er', 2.5, 'Rahmenstand frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1076d', '1er', 2.7, 'Rahmenstand frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1076e', '1er', 3.1, 'Rahmenstand frh. S', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1077a', '1er', 3.1, 'Kehrrahmenstand frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1077b', '1er', 3.3, 'Kehrrahmenstand frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1081a', '1er', 1.5, 'Fronthang HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1081b', '1er', 2.1, 'Fronthang R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1082a', '1er', 3.4, 'Fronthang rw. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1083a', '1er', 1.3, 'Kehrhang HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1083b', '1er', 1.5, 'Kehrhang R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1083c', '1er', 1.5, 'Kehrhang frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1083d', '1er', 1.7, 'Kehrhang frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1084a', '1er', 2.4, 'Kehrhang rw. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1091a', '1er', 2.1, 'Lenkerlage HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1091b', '1er', 2.3, 'Lenkerlage R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1092a', '1er', 1.3, 'Sattellage HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1092b', '1er', 1.5, 'Sattellage R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1092c', '1er', 1.5, 'Sattellenkerlage HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1092d', '1er', 1.7, 'Sattellenkerlage R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1093a', '1er', 1.6, 'Wasserwaage unter dem Sattel HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1093b', '1er', 1.8, 'Wasserwaage unter dem Sattel R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1093c', '1er', 1.8, 'Wasserwaage auf dem Sattel HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1093d', '1er', 2, 'Wasserwaage auf dem Sattel R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1096a', '1er', 2.4, 'Vorderradlauf ¼ Runde', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1101a', '1er', 2.9, 'Sattellenkerstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1101b', '1er', 3.1, 'Sattellenkerstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1101c', '1er', 3.6, 'Sattellenkerstand S', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1101d', '1er', 4.1, 'Sattellenkerstand 8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1102a', '1er', 6.5, 'Sattellenkerstand rw. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1102b', '1er', 6.9, 'Sattellenkerstand rw. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1102c', '1er', 7.8, 'Sattellenkerstand rw. S', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1102d', '1er', 9.2, 'Sattellenkerstand rw. 8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1103a', '1er', 5.7, 'Sattelstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1103b', '1er', 6.1, 'Sattelstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1103c', '1er', 6.5, 'Sattelstand S', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1103d', '1er', 7.3, 'Sattelstand 8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1104a', '1er', 4, 'Frontlenkerstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1104b', '1er', 4.2, 'Frontlenkerstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1104c', '1er', 4.7, 'Frontlenkerstand S', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1104d', '1er', 5.2, 'Frontlenkerstand 8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1104e', '1er', 4.6, 'Frontlenkerstand HR. aus Reitsitz', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1104f', '1er', 4.8, 'Frontlenkerstand R. aus Reitsitz', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1104g', '1er', 5.3, 'Frontlenkerstand S aus Reitsitz', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1104h', '1er', 5.8, 'Frontlenkerstand 8 aus Reitsitz', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1104i', '1er', 5.1, 'Frontlenkerstanddrehung ½-fach', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1104j', '1er', 6.9, 'Frontlenkerstanddrehung 1-fach T (6,4 -', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1104k', '1er', 7.7, 'Frontlenkerstanddrehung 1-½fach T (7,2 -', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1104l', '1er', 8.5, 'Frontlenkerstanddrehung 2-fach T (8,0 -', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1104m', '1er', 5.7, 'Frontlenkerstanddrehung ½-fach aus Reitsitz', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1104p', '1er', 8.1, 'Frontlenkerstanddrehung 2-fach aus Reitsitz T', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1105a', '1er', 4.4, 'Kehrlenkerstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1105b', '1er', 4.6, 'Kehrlenkerstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1105c', '1er', 5.1, 'Kehrlenkerstand S', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1105d', '1er', 5.6, 'Kehrlenkerstand 8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1111a', '1er', 2.5, 'Sattelstützwaage HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1111b', '1er', 3.1, 'Sattelstützwaage R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1111c', '1er', 3.5, 'Sattelstützwaage S', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1111d', '1er', 5.1, 'Sattelstützwaage 8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1112a', '1er', 2.5, 'Lenkerstützwaage HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1112b', '1er', 3.1, 'Lenkerstützwaage R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1112c', '1er', 3.5, 'Lenkerstützwaage S', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1112d', '1er', 3.5, 'Kehrlenkerdoppelstützwaage HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1112e', '1er', 4.2, 'Kehrlenkerdoppelstützwaage R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1112f', '1er', 4.6, 'Kehrlenkerdoppelstützwaage S', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1112g', '1er', 6.4, 'Kehrlenkerdoppelstützwaage 8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1112h', '1er', 4.1, 'Lenkerdoppelstützwaage HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1112i', '1er', 4.8, 'Lenkerdoppelstützwaage R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1112j', '1er', 5.2, 'Lenkerdoppelstützwaage S', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1115a', '1er', 2.8, 'Lenkervorhebehalte HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1115b', '1er', 3.2, 'Lenkervorhebehalte R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1115c', '1er', 3.6, 'Lenkervorhebehalte S', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1115d', '1er', 4.8, 'Lenkervorhebehalte 8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1116a', '1er', 3.2, 'Kehrlenkervorhebehalte HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1116b', '1er', 3.6, 'Kehrlenkervorhebehalte R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1116c', '1er', 4, 'Kehrlenkervorhebehalte S', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1116d', '1er', 5.2, 'Kehrlenkervorhebehalte 8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1117a', '1er', 3.8, 'Seitvorhebehalte HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1117b', '1er', 4.4, 'Seitvorhebehalte R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1117c', '1er', 6.5, 'Seitvorhebehalte rw. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1117d', '1er', 7.1, 'Seitvorhebehalte rw. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1118a', '1er', 3.3, 'Lenkerstützgrätsche HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1118b', '1er', 3.9, 'Lenkerstützgrätsche R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1118c', '1er', 4.2, 'Sattelstützgrätsche HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1118d', '1er', 4.8, 'Sattelstützgrätsche R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1121a', '1er', 4.4, 'Kopfstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1121b', '1er', 4.6, 'Kopfstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1122a', '1er', 4.2, 'Schulterstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1122b', '1er', 4.4, 'Schulterstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1123a', '1er', 7, 'Sattellenkerhandstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1123b', '1er', 7.8, 'Sattellenkerhandstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1123c', '1er', 8.6, 'Sattellenkerhandstand S', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1123d', '1er', 10.2, 'Sattellenkerhandstand 8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1123e', '1er', 10.4, 'Seitvorhebehalte Sattellenkerhandstand HR. T (9,8 -', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1123f', '1er', 11.2, 'Seitvorhebehalte Sattellenkerhandstand R. T (10,6 -', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1123g', '1er', 12, 'Seitvorhebehalte Sattellenkerhandstand S T (11,4 -', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1123h', '1er', 13.6, 'Seitvorhebehalte Sattellenkerhandstand 8 T (13,0 -', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1123i', '1er', 10.4, 'Seitvorhebehalte Schweizer Sattellenkerhandstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1123j', '1er', 11.2, 'Seitvorhebehalte Schweizer Sattellenkerhandstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1123k', '1er', 12, 'Seitvorhebehalte Schweizer Sattellenkerhandstand S', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1123l', '1er', 13.6, 'Seitvorhebehalte Schweizer Sattellenkerhandstand 8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1123m', '1er', 11, 'Seitvorhebehalte Deutscher Sattellenkerhandstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1123n', '1er', 11.8, 'Seitvorhebehalte Deutscher Sattellenkerhandstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1123o', '1er', 12.6, 'Seitvorhebehalte Deutscher Sattellenkerhandstand S', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1123p', '1er', 14.2, 'Seitvorhebehalte Deutscher Sattellenkerhandstand 8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1124a', '1er', 7.2, 'Lenkerhandstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1124b', '1er', 8, 'Lenkerhandstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1124c', '1er', 8.8, 'Lenkerhandstand S', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1124d', '1er', 10.4, 'Lenkerhandstand 8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1124e', '1er', 10.6, 'Vorhebehalte Lenkerhandstand HR. T (10,0 -', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1124f', '1er', 11.4, 'Vorhebehalte Lenkerhandstand R. T (10,8 -', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1124g', '1er', 12.2, 'Vorhebehalte Lenkerhandstand S T (11,6 -', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1124h', '1er', 13.8, 'Vorhebehalte Lenkerhandstand 8 T (13,2 -', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1124i', '1er', 10.6, 'Vorhebehalte Schweizer Lenkerhandstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1124j', '1er', 11.4, 'Vorhebehalte Schweizer Lenkerhandstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1124k', '1er', 12.2, 'Vorhebehalte Schweizer Lenkerhandstand S', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1124l', '1er', 13.8, 'Vorhebehalte Schweizer Lenkerhandstand 8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1124m', '1er', 11.2, 'Vorhebehalte Deutscher Lenkerhandstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1124n', '1er', 12, 'Vorhebehalte Deutscher Lenkerhandstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1124o', '1er', 12.8, 'Vorhebehalte Deutscher Lenkerhandstand S', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1124p', '1er', 14.4, 'Vorhebehalte Deutscher Lenkerhandstand 8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1124q', '1er', 10, 'Lenkerstützgrätsche Lenkerhandstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1124r', '1er', 10.8, 'Lenkerstützgrätsche Lenkerhandstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1124s', '1er', 11.6, 'Lenkerstützgrätsche Lenkerhandstand S', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1124t', '1er', 13.2, 'Lenkerstützgrätsche Lenkerhandstand 8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1141a', '1er', 1, 'Pedalstillstand', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1141b', '1er', 1.2, 'Pedalstillstand frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1141c', '1er', 1.3, 'Pedalvorderradstillstand', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1141d', '1er', 1.5, 'Pedalvorderradstillstand frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1151a', '1er', 1.7, 'Seitenstandwende', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1156a', '1er', 1.7, 'Reitsitzhocke', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1156b', '1er', 3.1, 'Reitsitzhocke rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1157a', '1er', 1.8, 'Fronthanghocke abgestoßen', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1157b', '1er', 2, 'Fronthanghocke', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1157c', '1er', 3.5, 'Fronthanghocke rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1158a', '1er', 1.7, 'Kehrhanghocke abgestoßen', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1158b', '1er', 1.9, 'Kehrhanghocke', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1158c', '1er', 3.5, 'Kehrhanghocke rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1159a', '1er', 1.7, 'Kehrlenkersitzhocke', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1159b', '1er', 2.9, 'Kehrlenkersitzhocke rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1171a', '1er', 2.2, 'Kehrlenkersitzscherensprung', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1171b', '1er', 2.6, 'Kehrhangscherensprung', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1172a', '1er', 2, 'Drehsprung Seitenstand Kehrlenkersitz', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1172b', '1er', 2.3, 'Drehsprung Reitsitz Kehrlenkersitz', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1172c', '1er', 2.3, 'Drehsprung Kehrlenkersitz Reitsitz', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1172d', '1er', 2.8, 'Drehsprung Reitsitz Kehrrahmenbeugestand', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1172e', '1er', 3.8, 'Drehscherensprung', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1173a', '1er', 2.2, 'Drehsprung Seitenstand Vorderradlauf', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1173b', '1er', 2.8, 'Drehsprung Reitsitz Vorderradlauf', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1174a', '1er', 1.8, 'Drehsprung Seitenstand Kehrhang', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1174b', '1er', 2.2, 'Drehsprung Reitsitz Kehrhang', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1174c', '1er', 2.3, 'Drehsprung Kehrhang Reitsitz', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1175a', '1er', 4.8, 'Drehsprung 1-fach', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1175b', '1er', 8.2, 'Drehsprung 2-fach T (7,5 -', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1175c', '1er', 10.2, 'Drehsprung 3-fach T (9,5 -', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1175d', '1er', 11.4, 'Drehsprung 4-fach T (10,7 -', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1175e', '1er', 12.5, 'Drehsprung 5-fach T (11,8 -', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1186a', '1er', 7.3, 'Maute Sprung', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1201a', '1er', 2.4, 'Reitsitzsteiger HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1201b', '1er', 2.6, 'Reitsitzsteiger R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1201c', '1er', 2.5, 'Reitsitzsteiger frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1201d', '1er', 2.7, 'Reitsitzsteiger frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1201e', '1er', 3.1, 'Reitsitzsteiger einb. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1201f', '1er', 3.3, 'Reitsitzsteiger einb. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1201g', '1er', 3.4, 'Reitsitzsteiger einb. frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1201h', '1er', 3.6, 'Reitsitzsteiger einb. frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1202a', '1er', 4.3, 'Reitsitzsteiger rw. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1202b', '1er', 4.5, 'Reitsitzsteiger rw. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1202c', '1er', 4.6, 'Reitsitzsteiger rw. frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1202d', '1er', 4.8, 'Reitsitzsteiger rw. frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1202e', '1er', 5.7, 'Reitsitzsteiger rw. einb. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1202f', '1er', 6.5, 'Reitsitzsteiger rw. einb. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1202g', '1er', 6.7, 'Reitsitzsteiger rw. einb. frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1202h', '1er', 7.5, 'Reitsitzsteiger rw. einb. frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1202i', '1er', 5.3, 'Reitsitzsteiger Dreh. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1203a', '1er', 3.1, 'Kehrreitsitzsteiger frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1203b', '1er', 3.5, 'Kehrreitsitzsteiger frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1203c', '1er', 3.9, 'Kehrreitsitzsteiger frh. S', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1203d', '1er', 5.1, 'Kehrreitsitzsteiger frh. 8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1203e', '1er', 3.9, 'Kehrreitsitzsteiger einb. frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1203f', '1er', 4.6, 'Kehrreitsitzsteiger einb. frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1203g', '1er', 5.7, 'Kehrreitsitzsteiger Dreh. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1204a', '1er', 4.8, 'Kehrreitsitzsteiger rw. frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1204b', '1er', 5.2, 'Kehrreitsitzsteiger rw. frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1204c', '1er', 6.3, 'Kehrreitsitzsteiger rw. frh. S', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1204d', '1er', 7.8, 'Kehrreitsitzsteiger rw. frh. 8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1211a', '1er', 3.1, 'Damensitzsteiger HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1211b', '1er', 3.3, 'Damensitzsteiger R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1211c', '1er', 3.4, 'Damensitzsteiger frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1211d', '1er', 3.6, 'Damensitzsteiger frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1212a', '1er', 5.4, 'Damensitzsteiger rw. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1212b', '1er', 6.2, 'Damensitzsteiger rw. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1212c', '1er', 6.4, 'Damensitzsteiger rw. frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1212d', '1er', 7.2, 'Damensitzsteiger rw. frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1216a', '1er', 3, 'Dornstandsteiger HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1216b', '1er', 3.2, 'Dornstandsteiger R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1216c', '1er', 3.3, 'Dornstandsteiger frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1216d', '1er', 3.5, 'Dornstandsteiger frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1216e', '1er', 3.2, 'Seitenstandsteiger HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1216f', '1er', 3.4, 'Seitenstandsteiger R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1216g', '1er', 3.5, 'Seitenstandsteiger frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1216h', '1er', 3.7, 'Seitenstandsteiger frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1217a', '1er', 5.2, 'Dornstandsteiger rw. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1217b', '1er', 6, 'Dornstandsteiger rw. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1217c', '1er', 6.2, 'Dornstandsteiger rw. frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1217d', '1er', 7, 'Dornstandsteiger rw. frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1217e', '1er', 7.2, 'Dornstandsteiger Dreh. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1217f', '1er', 4.8, 'Seitenstandsteiger rw. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1217g', '1er', 5.6, 'Seitenstandsteiger rw. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1219a', '1er', 3.9, 'Kehrdornstandsteiger rw. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1219b', '1er', 4.7, 'Kehrdornstandsteiger rw. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1219c', '1er', 4.2, 'Kehrseitenstandsteiger rw. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1219d', '1er', 5, 'Kehrseitenstandsteiger rw. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1226a', '1er', 2.5, 'Lenkersitzsteiger HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1226b', '1er', 2.7, 'Lenkersitzsteiger R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1226c', '1er', 2.6, 'Lenkersitzsteiger frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1226d', '1er', 2.8, 'Lenkersitzsteiger frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1227a', '1er', 4.3, 'Lenkersitzsteiger rw. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1227b', '1er', 4.5, 'Lenkersitzsteiger rw. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1227c', '1er', 4.4, 'Lenkersitzsteiger rw. frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1227d', '1er', 4.6, 'Lenkersitzsteiger rw. frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1227e', '1er', 5.1, 'Lenkersitzsteiger Dreh. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1228a', '1er', 3, 'Kehrlenkersitzsteiger frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1228b', '1er', 3.4, 'Kehrlenkersitzsteiger frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1228c', '1er', 3.8, 'Kehrlenkersitzsteiger frh. S', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1228d', '1er', 5, 'Kehrlenkersitzsteiger frh. 8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1228e', '1er', 5.5, 'Kehrlenkersitzsteiger Dreh. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1229a', '1er', 4.8, 'Kehrlenkersitzsteiger rw. frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1229b', '1er', 5.2, 'Kehrlenkersitzsteiger rw. frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1229c', '1er', 5.9, 'Kehrlenkersitzsteiger rw. frh. S', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1229d', '1er', 7.4, 'Kehrlenkersitzsteiger rw. frh. 8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1236a', '1er', 2.6, 'Steuerrohrsteiger frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1236b', '1er', 2.8, 'Steuerrohrsteiger frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1236c', '1er', 3, 'Steuerrohrsteiger einb. frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1236d', '1er', 3.2, 'Steuerrohrsteiger einb. frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1236e', '1er', 5.1, 'Steuerrohrsteiger Dreh. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1237a', '1er', 4.4, 'Steuerrohrsteiger rw. frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1237b', '1er', 4.6, 'Steuerrohrsteiger rw. frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1237c', '1er', 5.1, 'Steuerrohrsteiger Dreh. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1238a', '1er', 3, 'Kehrsteuerrohrsteiger frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1238b', '1er', 3.4, 'Kehrsteuerrohrsteiger frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1238c', '1er', 5.5, 'Kehrsteuerrohrsteiger Dreh. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1239a', '1er', 4.8, 'Kehrsteuerrohrsteiger rw. frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1239b', '1er', 5.2, 'Kehrsteuerrohrsteiger rw. frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1246a', '1er', 4, 'Standsteiger HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1246b', '1er', 4.6, 'Standsteiger R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1247a', '1er', 5.3, 'Standsteiger rw. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1247b', '1er', 5.9, 'Standsteiger rw. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1247c', '1er', 6.5, 'Standsteiger Dreh. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1248a', '1er', 4.2, 'Kehrstandsteiger HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1248b', '1er', 4.8, 'Kehrstandsteiger R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1248c', '1er', 6.5, 'Kehrstandsteiger Dreh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1249a', '1er', 5.5, 'Kehrstandsteiger rw. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1249b', '1er', 6.1, 'Kehrstandsteiger rw. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1249c', '1er', 6.8, 'Kehrstandsteiger rw. S', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1249d', '1er', 8.8, 'Kehrstandsteiger rw. 8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1281a', '1er', 5, 'Übergang Fronthang Steuerrohrsteiger', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1281b', '1er', 2.4, 'Übergang Steuerrohrsteiger Fronthang', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1282a', '1er', 7, 'Übergang Fronthang Kehrstandsteiger', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1282b', '1er', 3, 'Übergang Kehrstandsteiger Fronthang', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1283a', '1er', 3.1, 'Übergang Reitsitzsteiger Lenkersitzsteiger', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1283b', '1er', 2.1, 'Übergang Lenkersitzsteiger Reitsitzsteiger', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1284a', '1er', 5.3, 'Übergang Reitsitzsteiger Steuerrohrsteiger', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1284b', '1er', 4.3, 'Übergang Steuerrohrsteiger Reitsitzsteiger', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1285a', '1er', 6.4, 'Übergang Reitsitzsteiger Kehrstandsteiger', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1285b', '1er', 4.7, 'Übergang Kehrstandsteiger Reitsitzsteiger', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1286a', '1er', 3.6, 'Übergang Lenkersitzsteiger Steuerrohrsteiger', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1286b', '1er', 2.7, 'Übergang Steuerrohrsteiger Lenkersitzsteiger', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1287a', '1er', 4.1, 'Übergang Steuerrohrsteiger Kehrstandsteiger', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1287b', '1er', 1.9, 'Übergang Kehrstandsteiger Steuerrohrsteiger', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1288a', '1er', 3.7, 'Übergang Kehrhang Kehrsteuerrohrsteiger', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1288b', '1er', 1.4, 'Übergang Kehrsteuerrohrsteiger Kehrhang', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1289a', '1er', 6.1, 'Übergang Kehrhang Standsteiger', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1289b', '1er', 2.4, 'Übergang Standsteiger Kehrhang', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1290a', '1er', 5.1, 'Übergang Kehrreitsitz Kehrlenkersitzsteiger', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1290b', '1er', 1.7, 'Übergang Kehrlenkersitzsteiger Kehrreitsitz', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1291a', '1er', 6.8, 'Übergang Kehrlenkersitzsteiger Standsteiger', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1291b', '1er', 5.1, 'Übergang Standsteiger Kehrlenkersitzsteiger', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1292a', '1er', 3.9, 'Übergang Kehrsteuerrohrsteiger Kehrlenkersitzsteiger', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1292b', '1er', 5.8, 'Übergang Kehrlenkersitzsteiger Kehrsteuerrohrsteiger', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1293a', '1er', 1.8, 'Übergang Standsteiger Kehrsteuerrohrsteiger', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1293b', '1er', 3.6, 'Übergang Kehrsteuerrohrsteiger Standsteiger', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1301a', '1er', 1.4, 'Reitsitz Lenkerhocke', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1301b', '1er', 1.9, 'Seitpedalstand Hocke über das Rad', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1301c', '1er', 3.5, 'Reitsitz Lenkergrätsche', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1301d', '1er', 2.5, 'Reitsitz Lenkerhocke mit ½ Schraube', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1301e', '1er', 1.6, 'Kehrlenkersitz Lenkerhocke', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1301f', '1er', 3.7, 'Kehrlenkersitz Lenkergrätsche', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1301g', '1er', 9.1, 'Sattelbeugestand Handstandüberschlag', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1301h', '1er', 10.2, 'Reitsitz Handstandüberschlag', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1301i', '1er', 4.3, 'Frontlenkerstand Strecksprung hinter das Rad', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1301j', '1er', 5.1, 'Frontlenkerstand Strecksprung ½ Schraube vor das Rad', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1301k', '1er', 4.7, 'Frontlenkerstand Grätschsprung hinter das Rad', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1301l', '1er', 4.6, 'Kehrlenkerstand Strecksprung vor das Rad', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1301m', '1er', 6.2, 'Kehrlenkerstand Strecksprung 1 Schraube vor das Rad', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1301n', '1er', 11.1, 'Kehrlenkerstand Salto rw. gehockt', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1301o', '1er', 4.1, 'Handstand umgelegtes Rad', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('1301q', '1er', 8.3, '§ 2 2er Kunstradsport', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2001a', '2er', 0.4, 'Reitsitz HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2001b', '2er', 0.5, 'Reitsitz R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2001c', '2er', 0.8, 'Reitsitz frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2001d', '2er', 0.9, 'Reitsitz frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2001e', '2er', 0.5, 'Reitsitz Mühle', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2001f', '2er', 0.9, 'Reitsitz Mühle frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2001g', '2er', 1.5, 'Reitsitz Mühle Eschl. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2002a', '2er', 0.8, 'Reitsitz rw. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2002b', '2er', 1, 'Reitsitz rw. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2002c', '2er', 2.4, 'Reitsitz Eschl rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2004a', '2er', 0.9, 'Reitsitz Mühle rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2004b', '2er', 2, 'Reitsitz Mühle Eschl rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2005a', '2er', 0.7, 'Kehrreitsitz HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2005b', '2er', 0.8, 'Kehrreitsitz R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2005c', '2er', 1.1, 'Kehrreitsitz frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2005d', '2er', 1.2, 'Kehrreitsitz frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2011a', '2er', 0.8, 'Fußsteuerung HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2011b', '2er', 0.9, 'Fußsteuerung R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2011c', '2er', 1, 'Fußsteuerung frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2011d', '2er', 1.2, 'Fußsteuerung frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2012a', '2er', 0.7, 'Damensitz HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2012b', '2er', 0.8, 'Damensitz R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2012c', '2er', 1.1, 'Damensitz frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2012d', '2er', 1.2, 'Damensitz frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2013a', '2er', 1.4, 'Damensitz rw. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2013b', '2er', 1.5, 'Damensitz rw. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2021a', '2er', 1.8, 'Lenkersitz HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2021b', '2er', 2, 'Lenkersitz R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2021c', '2er', 2, 'Lenkersitz frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2021d', '2er', 2.2, 'Lenkersitz frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2022a', '2er', 0.9, 'Kehrlenkersitz HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2022b', '2er', 1, 'Kehrlenkersitz R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2022c', '2er', 1.3, 'Kehrlenkersitz frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2022d', '2er', 1.5, 'Kehrlenkersitz frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2026a', '2er', 0.7, 'Reitstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2026b', '2er', 0.8, 'Reitstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2026c', '2er', 1.1, 'Reitstand frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2026d', '2er', 1.2, 'Reitstand frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2027a', '2er', 1.3, 'Kehrreitstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2027b', '2er', 1.5, 'Kehrreitstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2027c', '2er', 1.5, 'Kehrreitstand frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2027d', '2er', 1.7, 'Kehrreitstand frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2031a', '2er', 1.8, 'Frontstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2031b', '2er', 2, 'Frontstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2031c', '2er', 2, 'Frontstand frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2031d', '2er', 2.2, 'Frontstand frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2036a', '2er', 0.9, 'Seitenstand Fußantrieb HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2036b', '2er', 1, 'Seitenstand Fußantrieb R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2037a', '2er', 0.8, 'Seitenstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2037b', '2er', 1, 'Seitenstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2037c', '2er', 1.2, 'Seitenstand frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2037d', '2er', 1.4, 'Seitenstand frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2046a', '2er', 0.8, 'Dornenstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2046b', '2er', 1, 'Dornenstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2046c', '2er', 1.7, 'Dornenstand frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2046d', '2er', 1.9, 'Dornenstand frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2047a', '2er', 1.1, 'Dornbeugestand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2047b', '2er', 1.2, 'Dornbeugestand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2047c', '2er', 1.9, 'Dornbeugestand frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2047d', '2er', 2.1, 'Dornbeugestand frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2051a', '2er', 1.2, 'Kniebeugesitz HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2051b', '2er', 1.3, 'Kniebeugesitz R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2052a', '2er', 1.2, 'Sattelknien HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2052b', '2er', 1.3, 'Sattelknien R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2061a', '2er', 1.1, 'Sattellage HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2061b', '2er', 1.2, 'Sattellage R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2061c', '2er', 1.9, 'Sattellenkerlage HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2061d', '2er', 2.1, 'Sattellenkerlage R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2062a', '2er', 1.5, 'Wasserwaage unter dem Sattel HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2062b', '2er', 1.7, 'Wasserwaage unter dem Sattel R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2062c', '2er', 2.2, 'Wasserwaage auf dem Sattel HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2062d', '2er', 2.4, 'Wasserwaage auf dem Sattel R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2066a', '2er', 1.1, 'Rahmenstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2066b', '2er', 1.9, 'Rahmenstand frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2066c', '2er', 2.1, 'Rahmenstand frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2067a', '2er', 2.9, 'Sattellenkerstand Einzeln HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2067b', '2er', 3.3, 'Sattellenkerstand Einzeln R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2067c', '2er', 2.9, 'Sattellenkerstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2067d', '2er', 3.3, 'Sattellenkerstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2067e', '2er', 3.9, 'Sattellenkerstand Eschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2067f', '2er', 4.4, 'Sattellenkerstand Gg-8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2068a', '2er', 5.8, 'Sattellenkerstand rw. Einzeln HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2068b', '2er', 6.4, 'Sattellenkerstand rw. Einzeln R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2069a', '2er', 4.2, 'Sattelstand Einzeln HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2069b', '2er', 4.5, 'Sattelstand Einzeln R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2069c', '2er', 4.1, 'Sattelstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2069d', '2er', 4.3, 'Sattelstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2069e', '2er', 5.8, 'Sattelstand Eschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2069f', '2er', 6.7, 'Sattelstand Gg-8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2070a', '2er', 3.7, 'Frontlenkerstand Einzeln HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2070b', '2er', 3.9, 'Frontlenkerstand Einzeln R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2070c', '2er', 3.7, 'Frontlenkerstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2070d', '2er', 3.9, 'Frontlenkerstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2070e', '2er', 4.8, 'Frontlenkerstand Eschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2070f', '2er', 5.4, 'Frontlenkerstand Gg-8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2070g', '2er', 6.8, 'Frontlenkerstanddrehung ½-fach', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2070h', '2er', 8.5, 'Frontlenkerstanddrehung 1-fach T (8,0 -', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2070i', '2er', 9.3, 'Frontlenkerstanddrehung 1½-fach T (8,8 -', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2070j', '2er', 10, 'Frontlenkerstanddrehung 2-fach T (9,5 -', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2070k', '2er', 6.5, 'Gg. Runde Frontlenkerstanddrehung ½-fach', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2071a', '2er', 3.9, 'Kehrlenkerstand Einzeln HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2071b', '2er', 4.1, 'Kehrlenkerstand Einzeln R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2071c', '2er', 3.9, 'Kehrlenkerstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2071d', '2er', 4.1, 'Kehrlenkerstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2071e', '2er', 5, 'Kehrlenkerstand Eschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2071f', '2er', 5.7, 'Kehrlenkerstand Gg-8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2073a', '2er', 4.4, 'Kopfstand Einzeln HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2073b', '2er', 4.6, 'Kopfstand Einzeln R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2074a', '2er', 4.2, 'Schulterstand Einzeln HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2074b', '2er', 4.4, 'Schulterstand Einzeln R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2076a', '2er', 9.2, 'Sattellenkerhandstand Einzeln HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2076b', '2er', 9.6, 'Sattellenkerhandstand Einzeln R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2076c', '2er', 11.4, 'Sattellenkerhandstand Gg-8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2076f', '2er', 14.8, 'Seitvorhebehalte Sattellenkerhandstand Gg-8 T (14,2 -', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2076g', '2er', 12.6, 'Seitvorhebehalte Schweizer Sattellenkerhandstand Einzeln HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2076h', '2er', 13, 'Seitvorhebehalte Schweizer Sattellenkerhandstand Einzeln R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2076i', '2er', 14.8, 'Seitvorhebehalte Schweizer Sattellenkerhandstand Gg-8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2076j', '2er', 13.2, 'Seitvorhabehalte Deutscher Sattellenkerhandstand Einzeln HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2076k', '2er', 13.6, 'Seitvorhabehalte Deutscher Sattellenkerhandstand Einzeln R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2076l', '2er', 15.4, 'Seitvorhabehalte Deutscher Sattellenkerhandstand Gg-8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2077a', '2er', 9.1, 'Lenkerhandstand Einzeln HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2077b', '2er', 9.5, 'Lenkerhandstand Einzeln R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2077c', '2er', 11.3, 'Lenkerhandstand Gg-8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2077d', '2er', 12.5, 'Vorhebehalte Lenkerhandstand Einzeln HR. T (11,9 -', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2077e', '2er', 12.9, 'Vorhebehalte Lenkerhandstand Einzeln R. T (12,3 -', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2077f', '2er', 14.7, 'Vorhebehalte Lenkerhandstand Gg-8 T (14,1 -', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2077g', '2er', 12.5, 'Vorhebehalte Schweizer Lenkerhandstand Einzeln HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2077h', '2er', 12.9, 'Vorhebehalte Schweizer Lenkerhandstand Einzeln R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2077i', '2er', 14.7, 'Vorhebehalte Schweizer Lenkerhandstand Gg-8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2077j', '2er', 13.1, 'Vorhebehalte Deutscher Lenkerhandstand Einzeln HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2077k', '2er', 13.5, 'Vorhebehalte Deutscher Lenkerhandstand Einzeln R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2077l', '2er', 15.3, 'Vorhebehalte Deutscher Lenkerhandstand Gg-8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2077m', '2er', 11.9, 'Lenkerstützgrätsche Lenkerhandstand Einzeln HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2077n', '2er', 12.3, 'Lenkerstützgrätsche Lenkerhandstand Einzeln R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2077o', '2er', 14.1, 'Lenkerstützgrätsche Lenkerhandstand Gg-8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2091a', '2er', 0.8, 'Pedalstillstand', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2091b', '2er', 1.2, 'Pedalstillstand frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2091c', '2er', 1.1, 'Pedalvorderradstillstand', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2091d', '2er', 1.6, 'Pedalvorderradstillstand frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2131a', '2er', 1.5, 'Reitsitzsteiger HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2131b', '2er', 1.7, 'Reitsitzsteiger R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2131c', '2er', 1.9, 'Reitsitzsteiger frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2131d', '2er', 2.1, 'Reitsitzsteiger frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2131e', '2er', 3.1, 'Reitsitzsteiger Eschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2131f', '2er', 3.6, 'Reitsitzsteiger Eschl. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2132a', '2er', 2.3, 'Reitsitzsteiger rw. frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2132b', '2er', 2.5, 'Reitsitzsteiger rw. frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2132c', '2er', 4.5, 'Reitsitzsteiger Eschl. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2133a', '2er', 1.6, 'Reitsitzsteiger Mühle', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2133b', '2er', 2, 'Reitsitzsteiger Mühle frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2133c', '2er', 2.7, 'Reitsitzsteiger Mühle Eschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2133d', '2er', 3.3, 'Reitsitzsteiger Mühle Eschl. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2134a', '2er', 2.3, 'Reitsitzsteiger Mühle rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2134b', '2er', 4.1, 'Reitsitzsteiger Mühle Eschl. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2134c', '2er', 5.5, 'Reitsitzsteiger Mühle Dreh. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2135a', '2er', 2.3, 'Kehrreitsitzsteiger frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2135b', '2er', 2.5, 'Kehrreitsitzsteiger frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2135c', '2er', 4.7, 'Kehrreitsitzsteiger Eschl. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2136a', '2er', 2.9, 'Kehrreitsitzsteiger rw. frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2136b', '2er', 3.1, 'Kehrreitsitzsteiger rw. frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2136c', '2er', 5.7, 'Kehrreitsitzsteiger Eschl. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2137a', '2er', 2.4, 'Kehrreitsitzsteiger Mühle frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2137b', '2er', 4.3, 'Kehrreitsitzsteiger Mühle Eschl. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2137c', '2er', 6, 'Kehrreitsitzsteiger Mühle Dreh. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2138a', '2er', 2.9, 'Kehrreitsitzsteiger Mühle rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2138b', '2er', 5.3, 'Kehrreitsitzsteiger Mühle Eschl. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2147a', '2er', 6.6, 'Damensitzsteiger Eschl. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2151a', '2er', 2.2, 'Dornstandsteiger HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2151b', '2er', 2.4, 'Dornstandsteiger R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2152a', '2er', 5.4, 'Dornstandsteiger Eschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2154a', '2er', 5, 'Dornstandsteiger Mühle Eschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2161a', '2er', 1.7, 'Lenkersitzsteiger HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2161b', '2er', 1.9, 'Lenkersitzsteiger R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2161c', '2er', 2.1, 'Lenkersitzsteiger frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2161d', '2er', 2.3, 'Lenkersitzsteiger frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2161e', '2er', 3.8, 'Lenkersitzsteiger Eschl. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2162a', '2er', 2.5, 'Lenkersitzsteiger rw. frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2162b', '2er', 2.7, 'Lenkersitzsteiger rw. frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2162c', '2er', 4.7, 'Lenkersitzsteiger Eschl. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2163a', '2er', 1.8, 'Lenkersitzsteiger Mühle', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2163b', '2er', 2.2, 'Lenkersitzsteiger Mühle frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2163c', '2er', 3.4, 'Lenkersitzsteiger Mühle Eschl. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2164a', '2er', 2.9, 'Lenkersitzsteiger Mühle rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2164b', '2er', 4.3, 'Lenkersitzsteiger Mühle Eschl. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2164c', '2er', 5.5, 'Lenkersitzsteiger Mühle Dreh. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2165a', '2er', 2.3, 'Kehrlenkersitzsteiger frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2165b', '2er', 2.5, 'Kehrlenkersitzsteiger frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2165c', '2er', 4.4, 'Kehrlenkersitzsteiger Eschl. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2166a', '2er', 2.8, 'Kehrlenkersitzsteiger rw. frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2166b', '2er', 3, 'Kehrlenkersitzsteiger rw. frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2166c', '2er', 5, 'Kehrlenkersitzsteiger Eschl. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2167a', '2er', 2.4, 'Kehrlenkersitzsteiger Mühle frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2167b', '2er', 4, 'Kehrlenkersitzsteiger Mühle Eschl. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2167c', '2er', 5.6, 'Kehrlenkersitzsteiger Mühle Dreh. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2168a', '2er', 3.2, 'Kehrlenkersitzsteiger Mühle rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2168b', '2er', 4.8, 'Kehrlenkersitzsteiger Mühle Eschl. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2176a', '2er', 1.6, 'Steuerrohrsteiger frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2176b', '2er', 1.8, 'Steuerrohrsteiger frh R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2176c', '2er', 3.2, 'Steuerrohrsteiger Eschl. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2177a', '2er', 2.1, 'Steuerrohrsteiger rw. frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2177b', '2er', 2.3, 'Steuerrohrsteiger rw. frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2177c', '2er', 4.1, 'Steuerrohrsteiger Eschl. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2178a', '2er', 1.8, 'Steuerrohrsteiger Mühle frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2178b', '2er', 2.7, 'Steuerrohrsteiger Mühle Eschl. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2179a', '2er', 2.1, 'Steuerrohrsteiger Mühle rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2179b', '2er', 3.7, 'Steuerrohrsteiger Mühle Eschl. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2179c', '2er', 5, 'Steuerrohrsteiger Mühle Dreh. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2180a', '2er', 2.4, 'Kehrsteuerrohrsteiger frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2180b', '2er', 2.6, 'Kehrsteuerrohrsteiger frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2180c', '2er', 4.2, 'Kehrsteuerrohrsteiger Eschl. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2181a', '2er', 2.9, 'Kehrsteuerrohrsteiger rw. frh. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2181b', '2er', 3.1, 'Kehrsteuerrohrsteiger rw. frh. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2181c', '2er', 5.1, 'Kehrsteuerrohrsteiger Eschl. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2182a', '2er', 2.5, 'Kehrsteuerrohrsteiger Mühle frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2182b', '2er', 3.8, 'Kehrsteuerrohrsteiger Mühle Eschl. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2182c', '2er', 5.9, 'Kehrsteuerrohrsteiger Mühle Dreh. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2183a', '2er', 3, 'Kehrsteuerrohrsteiger Mühle rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2183b', '2er', 4.7, 'Kehrsteuerrohrsteiger Mühle Eschl. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2191a', '2er', 2.6, 'Standsteiger HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2191b', '2er', 2.8, 'Standsteiger R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2191c', '2er', 4.4, 'Standsteiger Eschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2192a', '2er', 2.9, 'Standsteiger rw. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2192b', '2er', 3.1, 'Standsteiger rw. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2192c', '2er', 4.9, 'Standsteiger Eschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2193a', '2er', 2.7, 'Standsteiger Mühle', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2193b', '2er', 4, 'Standsteiger Mühle Eschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2194a', '2er', 2.9, 'Standsteiger Mühle rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2194b', '2er', 4.5, 'Standsteiger Mühle Eschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2194c', '2er', 5.9, 'Standsteiger Mühle Dreh. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2195a', '2er', 2.9, 'Kehrstandsteiger HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2195b', '2er', 3.1, 'Kehrstandsteiger R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2195c', '2er', 4.7, 'Kehrstandsteiger Eschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2196a', '2er', 3.2, 'Kehrstandsteiger rw. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2196b', '2er', 3.4, 'Kehrstandsteiger rw. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2196c', '2er', 5.4, 'Kehrstandsteiger Eschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2197a', '2er', 3, 'Kehrstandsteiger Mühle', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2197b', '2er', 4.3, 'Kehrstandsteiger Mühle Eschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2197c', '2er', 6.3, 'Kehrstandsteiger Mühle Dreh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2198a', '2er', 3.2, 'Kehrstandsteiger Mühle rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2198b', '2er', 5, 'Kehrstandsteiger Mühle Eschl rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2211a', '2er', 4.6, 'Lenkersitzsteiger 1 Standdrehung', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2211b', '2er', 7.3, 'Lenkersitzsteiger 2 Standdrehungen T (6,8 -', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2211c', '2er', 7.2, 'Lenkersitzsteiger 3 Standdrehungen T (7,8)', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2212a', '2er', 4.9, 'Kehrlenkersitzsteiger 1 Standdrehung', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2212b', '2er', 7.5, 'Kehrlenkersitzsteiger 2 Standdrehungen T (7,0 -', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2212c', '2er', 7.5, 'Kehrlenkersitzsteiger 3 Standdrehungen T (8,1)', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2213a', '2er', 4.4, 'Steuerrohrsteiger 1 Standdrehung', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2213b', '2er', 7, 'Steuerrohrsteiger 2 Standdrehungen T (6,5 -', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2213c', '2er', 7, 'Steuerrohrsteiger 3 Standdrehungen T (7,6)', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2214a', '2er', 4.9, 'Kehrsteuerrohrsteiger 1 Standdrehung', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2214b', '2er', 7.5, 'Kehrsteuerrohrsteiger 2 Standdrehungen T (7,0 -', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2214c', '2er', 7.5, 'Kehrsteuerrohrsteiger 3 Standdrehungen T (8,1)', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2215a', '2er', 5.2, 'Standsteiger 1 Standdrehung', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2215b', '2er', 7.9, 'Standsteiger 2 Standdrehungen T (7,4 -', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2215c', '2er', 7.8, 'Standsteiger 3 Standdrehungen T (8,4)', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2216a', '2er', 5.5, 'Kehrstandsteiger 1 Standdrehung', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2216b', '2er', 8.2, 'Kehrstandsteiger 2 Standdrehungen T (7,7 -', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2216c', '2er', 8.1, 'Kehrstandsteiger 3 Standdrehungen T (8,7)', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2236a', '2er', 1.9, 'Übergang Reitsitzsteiger Lenkersitzsteiger', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2236b', '2er', 1.9, 'Übergang Lenkersitzsteiger Reitsitzsteiger', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2237a', '2er', 2.9, 'Übergang Reitsitzsteiger Steuerrohrsteiger', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2237b', '2er', 2.9, 'Übergang Steuerrohrsteiger Reitsitzsteiger', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2238a', '2er', 2.4, 'Übergang Lenkersitzsteiger Steuerrohrsteiger', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2238b', '2er', 2.4, 'Übergang Steuerrohrsteiger Lenkersitzsteiger', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2239a', '2er', 2.1, 'Übergang Steuerrohrsteiger Kehrstandsteiger', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2239b', '2er', 2.1, 'Übergang Kehrstandsteiger Steuerrohrsteiger', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2240a', '2er', 2.1, 'Übergang Standsteiger Kehrsteuerrohrsteiger', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2240b', '2er', 2.2, 'Übergang Kehrsteuerrohrsteiger Standsteiger', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2241a', '2er', 3.4, 'Übergang Kehrsteuerrohrsteiger Kehrlenkersitzsteiger', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2241b', '2er', 3.5, 'Übergang Kehrlenkersitzsteiger Kehrsteuerrohrsteiger', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2242a', '2er', 5.7, 'Übergang Kehrhang Standsteiger einzeln', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2243a', '2er', 4.6, 'Übergang Kehrhang Kehrsteuerrohrsteiger einzeln', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2250a', '2er', 12.1, 'Kehrlenkerstand Salto rw. gehockt', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2261a', '2er', 0.3, 'Reitsitz / Dornenstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2261b', '2er', 0.4, 'Reitsitz / Dornenstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2261c', '2er', 0.7, 'Reitsitz / Sattelstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2261d', '2er', 0.9, 'Reitsitz / Sattelstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2266a', '2er', 0.7, 'Reitsitz / Schultersitz HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2266b', '2er', 0.9, 'Reitsitz / Schultersitz R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2266c', '2er', 1.6, 'Reitsitz frh. / Schultersitz HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2266d', '2er', 1.9, 'Reitsitz frh. / Schultersitz R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2267a', '2er', 1.9, 'Reitsitz rw. / Schultersitz HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2267b', '2er', 2.2, 'Reitsitz rw. / Schultersitz R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2268a', '2er', 2, 'Reitsitz / Schulterstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2268b', '2er', 2.3, 'Reitsitz / Schulterstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2268c', '2er', 3, 'Reitsitz frh. / Schulterstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2268d', '2er', 3.4, 'Reitsitz frh. / Schulterstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2269a', '2er', 3.7, 'Reitsitz rw. / Schulterstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2269b', '2er', 4.1, 'Reitsitz rw. / Schulterstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2270a', '2er', 1.3, 'Reitsitz / Brustschwebehang HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2270b', '2er', 1.5, 'Reitsitz / Brustschwegehang R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2270c', '2er', 2.1, 'Reitsitz frh. / Brustschwebehang HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2270d', '2er', 2.4, 'Reitsitz frh. / Brustschwebehang R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2271a', '2er', 2.3, 'Reitsitz rw. / Brustschwebehang HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2271b', '2er', 2.6, 'Reitsitz rw. / Brustschwegehang R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2276a', '2er', 1.2, 'Reitsitz / Lenkerstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2276b', '2er', 1.3, 'Reitsitz / Lenkerstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2277a', '2er', 5, 'Reitsitz / Lenkerhandstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2277b', '2er', 5.4, 'Reitsitz / Lenkerhandstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2277c', '2er', 6.5, 'Reitsitz / Lenkerstützgrätsche Lenkerhandstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2277d', '2er', 6.9, 'Reitsitz / Lenkerstützgrätsche Lenkerhandstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2281a', '2er', 1.1, 'Kehrreitsitz / Schultersitz HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2281b', '2er', 1.3, 'Kehrreitsitz / Schultersitz R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2282a', '2er', 1.9, 'Kehrreitsitz rw. / Schultersitz HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2282b', '2er', 2.1, 'Kehrreitsitz rw. / Schultersitz R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2283a', '2er', 2.7, 'Kehrreitsitz / Schulterstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2283b', '2er', 3, 'Kehrreitsitz / Schulterstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2285a', '2er', 1.7, 'Kehrreitsitz / Brustschwebehang HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2285b', '2er', 1.9, 'Kehrreitsitz / Brustschwebehang R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2286a', '2er', 2.5, 'Kehrreitsitz rw. / Brustschwebehang HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2286b', '2er', 2.7, 'Kehrreitsitz rw. / Brustschwebehang R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2296a', '2er', 1.1, 'Lenkersitz / Dornenstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2296b', '2er', 1.2, 'Lenkersitz / Dornenstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2296c', '2er', 1.6, 'Lenkersitz frh. / Dornenstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2296d', '2er', 1.8, 'Lenkersitz frh. / Dornenstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2296e', '2er', 1.8, 'Lenkersitz / Sattelstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2296f', '2er', 2, 'Lenkersitz / Sattelstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2296g', '2er', 2.3, 'Lenkersitz frh. / Sattelstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2296h', '2er', 2.5, 'Lenkersitz frh. / Sattelstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2301a', '2er', 0.8, 'Kehrlenkersitz / Dornenstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2301b', '2er', 0.9, 'Kehrlenkersitz / Dornenstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2301c', '2er', 1.3, 'Kehrlenkersitz frh. / Dornenstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2301d', '2er', 1.4, 'Kehrlenkersitz frh. / Dornenstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2302a', '2er', 1.3, 'Kehrlenkersitz / Sattellenkerstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2302b', '2er', 1.4, 'Kehrlenkersitz / Sattellenkerstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2302c', '2er', 1.8, 'Kehrlenkersitz frh. / Sattellenkerstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2302d', '2er', 1.9, 'Kehrlenkersitz frh. / Sattellenkerstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2302e', '2er', 1.4, 'Kehrlenkersitz / Sattelstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2302f', '2er', 1.7, 'Kehrlenkersitz / Sattelstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2302g', '2er', 2, 'Kehrlenkersitz frh. / Sattelstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2302h', '2er', 2.3, 'Kehrlenkersitz frh. / Sattelstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2303a', '2er', 1.3, 'Kehrlenkersitz / Schultersitz HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2303b', '2er', 1.5, 'Kehrlenkersitz / Schultersitz R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2303c', '2er', 1.9, 'Kehrlenkersitz frh. / Schultersitz HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2303d', '2er', 2.2, 'Kehrlenkersitz frh. / Schultersitz R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2304a', '2er', 2.9, 'Kehrlenkersitz / Schulterstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2304b', '2er', 3.2, 'Kehrlenkersitz / Schulterstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2304c', '2er', 3.6, 'Kehrlenkersitz frh. / Schulterstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2304d', '2er', 3.9, 'Kehrlenkersitz frh. / Schulterstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2305a', '2er', 1.8, 'Kehrlenkersitz / Brustschwebehang HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2305b', '2er', 2, 'Kehrlenkersitz / Brustschwebehang R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2305c', '2er', 2.4, 'Kehrlenkersitz frh. / Brustschwebehang HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2305d', '2er', 2.6, 'Kehrlenkersitz frh. / Brustschwebehang R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2306a', '2er', 2.7, 'Kehrlenkersitz / Kopfstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2306b', '2er', 2.9, 'Kehrlenkersitz / Kopfstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2311a', '2er', 0.9, 'Frontstand / Dornenstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2311b', '2er', 1, 'Frontstand / Dornenstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2311c', '2er', 1.4, 'Frontstand frh. / Dornenstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2311d', '2er', 1.6, 'Frontstand frh. / Dornenstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2311e', '2er', 1.6, 'Frontstand / Sattelstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2311f', '2er', 1.8, 'Frontstand / Sattelstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2311g', '2er', 2.1, 'Frontstand frh. / Sattelstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2311h', '2er', 2.3, 'Frontstand frh. / Sattelstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2316a', '2er', 1, 'Reitstand / Schultersitz HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2316b', '2er', 1.2, 'Reitstand / Schultersitz R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2316c', '2er', 1.6, 'Reitstand frh. / Schultersitz HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2316d', '2er', 1.8, 'Reitstand frh. / Schultersitz R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2317a', '2er', 1.4, 'Seitenstand / Seitenstand Ringf. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2317b', '2er', 1.6, 'Seitenstand / Seitenstand Ringf. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2319a', '2er', 1.8, 'Sattelbeugestand / Kehrlenkerbeugestand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2319b', '2er', 2, 'Sattelbeugestand / Kehrlenkerbeugestand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2321a', '2er', 1.1, 'Rahmensitz / Sattelbeugestand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2321b', '2er', 1.2, 'Rahmensitz / Sattelbeugestand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2322a', '2er', 1.5, 'Rahmensitz / Sattellenkerstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2322b', '2er', 1.7, 'Rahmensitz / Sattellenkerstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2322c', '2er', 1.8, 'Rahmensitz / Sattelstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2322d', '2er', 2, 'Rahmensitz / Sattelstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2323a', '2er', 2.4, 'Rahmensitz / Sattelstützwaage HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2323b', '2er', 2.8, 'Rahmensitz / Sattelstützwaage R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2331a', '2er', 1, 'Fronthang / Sattelbeugestand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2331b', '2er', 1.2, 'Fronthang / Sattelbeugestand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2332a', '2er', 1.5, 'Fronthang / Sattellenkerstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2332b', '2er', 1.7, 'Fronthang / Sattellenkerstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2332c', '2er', 1.8, 'Fronthang / Sattelstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2332d', '2er', 2, 'Fronthang / Sattelstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2334a', '2er', 2.8, 'Fronthang / Kopfstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2334b', '2er', 3, 'Fronthang / Kopfstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2334c', '2er', 6.1, 'Fronthang / Sattellenkerhandstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2334d', '2er', 6.5, 'Fronthang / Sattellenkerhandstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2341a', '2er', 0.9, 'Kehrhang / Dornenstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2341b', '2er', 1, 'Kehrhang / Dornenstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2342a', '2er', 1.4, 'Kehrhang / Sattellenkerstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2342b', '2er', 1.5, 'Kehrhang / Sattellenkerstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2342c', '2er', 1.7, 'Kehrhang / Sattelstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2342d', '2er', 1.9, 'Kehrhang / Sattelstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2343a', '2er', 1.8, 'Kehrhang / Lenkerstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2343b', '2er', 1.9, 'Kehrhang / Lenkerstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2346a', '2er', 2.7, 'Kehrhang / Kopfstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2346b', '2er', 2.9, 'Kehrhang / Kopfstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2346c', '2er', 6.1, 'Kehrhang / Sattellenkerhandstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2346d', '2er', 6.5, 'Kehrhang / Sattellenkerhandstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2351a', '2er', 1.3, 'Lenkerlage / Sattelbeugestand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2351b', '2er', 1.5, 'Lenkerlage / Sattelbeugestand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2351c', '2er', 2.2, 'Lenkerlage / Sattelstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2351d', '2er', 2.4, 'Lenkerlage / Sattelstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2352a', '2er', 1.9, 'Sattellage / Lenkerstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2352b', '2er', 2, 'Sattellage / Lenkerstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2352c', '2er', 5.5, 'Sattellage / Lenkerhandstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2352d', '2er', 5.9, 'Sattellage / Lenkerhandstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2353a', '2er', 1.5, 'Wasserwaage / Sattelbeugestand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2353b', '2er', 1.6, 'Wasserwaage / Sattelbeugestand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2353c', '2er', 2.2, 'Wasserwaage / Sattelstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2353d', '2er', 2.4, 'Wasserwaage / Sattelstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2356a', '2er', 3, 'Sattellenkerstand / Sattellenkerstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2356b', '2er', 3.2, 'Sattellenkerstand / Sattellenkerstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2356c', '2er', 3.6, 'Sattellenkerstand / Sattellenkerstand S', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2356d', '2er', 4.1, 'Sattellenkerstand / Sattellenkerstand 8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2357a', '2er', 2.5, 'Sattellenkerstand / Dornenstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2357b', '2er', 2.6, 'Sattellenkerstand / Dornenstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2357c', '2er', 3.1, 'Sattellenkerstand / Sattelstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2357d', '2er', 3.2, 'Sattellenkerstand / Sattelstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2357e', '2er', 3.7, 'Sattellenkerstand / Lenkerstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2357f', '2er', 3.8, 'Sattellenkerstand / Lenkerstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2358a', '2er', 3.2, 'Lenkerstand / Dornenstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2358b', '2er', 3.4, 'Lenkerstand / Dornenstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2358c', '2er', 5.9, 'Lenkerstanddrehung ½-fach / Dornenstand', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2358g', '2er', 4, 'Lenkerstand aus Reitsitz / Dornenstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2358h', '2er', 4.1, 'Lenkerstand aus Reitsitz / Dornenstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2358i', '2er', 6.7, 'Lenkerstanddrehung aus Reitsitz ½-fach / Dornenstand', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2359a', '2er', 3.6, 'Lenkerstand / Sattelstand Ringf. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2359b', '2er', 3.7, 'Lenkerstand / Sattelstand Ringf. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2359c', '2er', 4.9, 'Lenkerstand / Sattelstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2359d', '2er', 5.1, 'Lenkerstand / Sattelstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2359e', '2er', 5.6, 'Lenkerstand / Sattelstand S', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2359f', '2er', 6.1, 'Lenkerstand / Sattelstand 8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2366a', '2er', 3, 'Lenkervorhebehalte / Dornenstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2366b', '2er', 3.5, 'Lenkervorhebehalte / Dornenstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2366c', '2er', 3.8, 'Lenkervorhebehalte / Sattelstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2366d', '2er', 4.2, 'Lenkervorhebehalte / Sattelstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2366e', '2er', 5, 'Lenkervorhebehalte / Sattelstützgrätsche HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2366f', '2er', 5.4, 'Lenkervorhebehalte / Sattelstützgrätsche R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2366g', '2er', 6, 'Lenkerstützgrätsche / Sattelstützgrätsche HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2366h', '2er', 6.4, 'Lenkerstützgrätsche / Sattelstützgrätsche R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2371a', '2er', 3.8, 'Kopfstand / Lenkerstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2371b', '2er', 4.1, 'Kopfstand / Lenkerstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2372a', '2er', 5.1, 'Kopfstand / Rahmenschulterstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2372b', '2er', 5.5, 'Kopfstand / Rahmenschulterstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2373a', '2er', 6.1, 'Kopfstand / Lenkerstützgrätsche HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2373b', '2er', 6.5, 'Kopfstand / Lenkerstützgrätsche R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2374a', '2er', 8.5, 'Kopfstand / Lenkerhandstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2374b', '2er', 9, 'Kopfstand / Lenkerhandstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2374c', '2er', 9.8, 'Kopfstand / Lenkerhandstand S', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2374d', '2er', 10.6, 'Kopfstand / Lenkerhandstand 8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2374e', '2er', 11, 'Kopfstand / Lenkerstützgrätsche Lenkerhandstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2374f', '2er', 11.5, 'Kopfstand / Lenkerstützgrätsche Lenkerhandstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2374g', '2er', 12.3, 'Kopfstand / Lenkerstützgrätsche Lenkerhandstand S', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2374h', '2er', 13.1, 'Kopfstand / Lenkerstützgrätsche Lenkerhandstand 8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2376a', '2er', 7.7, 'Sattellenkerhandstand / Lenkerstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2376b', '2er', 8.1, 'Sattellenkerhandstand / Lenkerstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2376c', '2er', 7.6, 'Lenkerhandstand / Sattelstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2376d', '2er', 8, 'Lenkerhandstand / Sattelstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2377a', '2er', 10.6, 'Lenkerhandstand / Sattellenkerhandstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2377b', '2er', 11, 'Lenkerhandstand / Sattellenkerhandstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2391a', '2er', 1.3, 'Pedalstillstand / Schultersitz', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2391b', '2er', 1.8, 'Pedalstillstand frh. / Schultersitz', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2391c', '2er', 2.7, 'Pedalstillstand / Schulterstand', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2391d', '2er', 3.2, 'Pedalstillstand frh. / Schulterstand', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2411a', '2er', 2.2, 'Reitsitzsteiger / Dornenstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2411b', '2er', 2.4, 'Reitsitzsteiger / Dornenstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2412a', '2er', 2.9, 'Reitsitzsteiger / Schultersitz HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2412b', '2er', 3.1, 'Reitsitzsteiger / Schultersitz R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2412c', '2er', 3.5, 'Reitsitzsteiger frh. / Schultersitz HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2412d', '2er', 3.8, 'Reitsitzsteiger frh. / Schultersitz R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2413a', '2er', 4.1, 'Reitsitzsteiger rw. frh. / Schultersitz HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2413b', '2er', 4.4, 'Reitsitzsteiger rw. frh. / Schultersitz R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2413c', '2er', 6.1, 'Reitsitzsteiger Dreh. rw. frh. / Schultersitz', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2414a', '2er', 3.1, 'Reitsitzsteiger / Brustschwebehang HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2414b', '2er', 3.3, 'Reitsitzsteiger / Brustschwebehang R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2414c', '2er', 3.8, 'Reitsitzsteiger frh. / Brustschwebehang HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2414d', '2er', 4.2, 'Reitsitzsteiger frh. / Brustschwebehang R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2415a', '2er', 4.4, 'Reitsitzsteiger rw. frh. / Brustschwebehang HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2415b', '2er', 4.6, 'Reisitzsteiger rw. frh. / Brustschwebehang R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2416a', '2er', 4.8, 'Reitsitzsteiger / Schulterstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2416b', '2er', 5.1, 'Reitsitzsteiger / Schulterstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2416c', '2er', 5.6, 'Reitsitzsteiger frh. / Schulterstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2416d', '2er', 6, 'Reitsitzsteiger frh. / Schulterstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2417a', '2er', 6.5, 'Reitsitzsteiger rw. frh. / Schulterstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2417b', '2er', 7, 'Reitsitzsteiger rw. frh. / Schulterstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2418a', '2er', 3.9, 'Kehrreitsitzsteiger frh. / Schultersitz HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2418b', '2er', 4.3, 'Kehrreitsitzsteiger frh. / Schultersitz R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2418c', '2er', 6.5, 'Kehrreitsitzsteiger Dreh. frh. / Schultersitz', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2419a', '2er', 4.9, 'Kehrreitsitzsteiger rw. frh. / Schultersitz HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2419b', '2er', 5.3, 'Kehrreitsitzsteiger rw. frh. / Schultersitz R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2420a', '2er', 4.1, 'Kehrreitsitzsteiger frh. / Brustschwebehang HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2420b', '2er', 4.5, 'Kehrreitsitzsteiger frh. / Brustschwebehang R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2421a', '2er', 5.1, 'Kehrreitsitzsteiger rw. frh. / Brustschwebehang HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2421b', '2er', 5.5, 'Kehrreitsitzsteiger rw. frh. / Brustschwebehang R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2422a', '2er', 6.7, 'Kehrreitsitzsteiger frh. / Schulterstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2422b', '2er', 7.1, 'Kehrreitsitzsteiger frh. / Schulterstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2426a', '2er', 3.4, 'Lenkersitzsteiger / Schultersitz HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2426b', '2er', 3.7, 'Lenkersitzsteiger / Schultersitz R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2426c', '2er', 4, 'Lenkersitzsteiger frh. / Schultersitz HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2426d', '2er', 4.4, 'Lenkersitzsteiger frh. / Schultersitz R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2427a', '2er', 4.7, 'Lenkersitzsteiger rw. frh. / Schultersitz HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2427b', '2er', 5, 'Lenkersitzsteiger rw. frh. / Schultersitz R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2427c', '2er', 6.9, 'Lenkersitzsteiger Dreh. rw. frh. / Schultersitz', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2428a', '2er', 5.5, 'Lenkersitzsteiger / Schulterstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2428b', '2er', 5.9, 'Lenkersitzsteiger / Schulterstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2428c', '2er', 6.3, 'Lenkersitzsteiger frh. / Schulterstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2428d', '2er', 6.7, 'Lenkersitzsteiger frh. / Schulterstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2429a', '2er', 7.4, 'Lenkersitzsteiger rw. frh. / Schulterstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2429b', '2er', 8, 'Lenkersitzsteiger rw. frh. / Schulterstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2436a', '2er', 3.6, 'Steuerrohrsteiger frh. / Schultersitz HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2436b', '2er', 4, 'Steuerrohrsteiger frh. / Schultersitz R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2437a', '2er', 4.2, 'Steuerrohrsteiger rw. frh. / Schultersitz HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2437b', '2er', 4.6, 'Steuerrohrsteiger rw. frh. / Schultersitz R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2437c', '2er', 6.4, 'Steuerrohrsteiger Dreh. rw. frh. / Schultersitz', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2438a', '2er', 6, 'Steuerrohrsteiger frh. / Schulterstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2438b', '2er', 6.4, 'Steuerrohrsteiger frh. / Schulterstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2439a', '2er', 7, 'Steuerrohrsteiger rw. frh. / Schulterstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2439b', '2er', 7.6, 'Steuerrohrsteiger rw. frh. / Schulterstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2446a', '2er', 4.3, 'Kehrsteuerrohrsteiger frh. / Schultersitz HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2446b', '2er', 4.7, 'Kehrsteuerrohrsteiger frh. / Schultersitz R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2446c', '2er', 7, 'Kehrsteuerrohrsteiger Dreh. frh. / Schultersitz', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2447a', '2er', 5.3, 'Kehrsteuerrohrsteiger rw. frh. / Schultersitz HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2447b', '2er', 5.7, 'Kehrsteuerrohrsteiger rw. frh. / Schultersitz R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2448a', '2er', 6.4, 'Kehrsteuerrohrsteiger frh. / Schulterstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2448b', '2er', 6.8, 'Kehrsteuerrohrsteiger frh. / Schulterstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2449a', '2er', 7.9, 'Kehrsteuerrohrsteiger rw. frh. / Schulterstand HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2449b', '2er', 8.5, 'Kehrsteuerrohrsteiger rw. frh. / Schulterstand R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2471a', '2er', 4.8, 'Übergang Reitsitzsteiger Lenkersitzsteiger / Schultersitz', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2471b', '2er', 6.7, 'Übergang Reitsitzsteiger Lenkersitzsteiger / Schulterstand', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2472a', '2er', 7, 'Übergang Reitsitzsteiger Steuerrohrsteiger / Schultersitz', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2472b', '2er', 9.7, 'Übergang Reitsitzsteiger Steuerrohrsteiger / Schulterstand', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2473a', '2er', 5.9, 'Übergang Lenkersitzsteiger Steuerrohrsteiger / Schultersitz', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('2473b', '2er', 8.2, 'Übergang Lenkersitzsteiger Steuerrohrsteiger / Schulterstand', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4001a', '4er', 0.8, '4 hinter. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4001b', '4er', 1, '4 hinter. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4001c', '4er', 1.4, '4 hinter. HR. 4 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4001d', '4er', 1.6, '4 hinter. R. 4 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4001e', '4er', 1.4, '4 hinter. HR. 4 Rschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4001f', '4er', 1.6, '4 hinter. R. 4 Rschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4001g', '4er', 1.6, '4 hinter. HR. 2 Lschl. 2 Rschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4001h', '4er', 1.8, '4 hinter. R. 2 Lschl. 2 Rschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4001i', '4er', 2.7, '4 Wschl. überlagernd', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4002a', '4er', 1.6, '4 hinter. HR. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4002b', '4er', 2, '4 hinter. R. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4002c', '4er', 2.7, '4 hinter. HR. 4 Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4002d', '4er', 3.1, '4 hinter. R. 4 Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4002e', '4er', 4.9, '4 Wschl. überlagernd rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4003a', '4er', 2, '4 hinter. HR. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4003b', '4er', 2.5, '4 hinter. R. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4003c', '4er', 2.6, '4 hinter. HR. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4003d', '4er', 3.3, '4 hinter. R. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4003e', '4er', 3.4, '4 hinter. HR. 4 Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4003f', '4er', 3.9, '4 hinter. R. 4 Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4003g', '4er', 4.4, '4 hinter. HR. 4 Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4003h', '4er', 5.1, '4 hinter. R. 4 Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4004a', '4er', 3.4, '4 hinter. HR. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4004b', '4er', 4.3, '4 hinter. R. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4004c', '4er', 5.8, '4 hinter. HR. 4 Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4004d', '4er', 6.6, '4 hinter. R. 4 Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4004e', '4er', 6, '4 hinter. HR. 4 Rschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4004f', '4er', 6.8, '4 hinter. R. 4 Rschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4004g', '4er', 6.6, '4 hinter. HR. 2 Lschl. 2 Rschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4004h', '4er', 7.5, '4 hinter. R. 2 Lschl. 2 Rschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4005a', '4er', 9.4, '4 Wschl. überlagernd Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4006a', '4er', 1, '4 hinter. Schrägzug', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4006b', '4er', 1.8, '4 hinter. Schrägzug 2 Lschl. 2 Rschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4007a', '4er', 1.8, '4 hinter. S', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4007b', '4er', 2.2, '4 hinter. 8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4007c', '4er', 2.6, '4 hinter. 8 durch.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4008a', '4er', 3.6, '4 hinter. S rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4008b', '4er', 4.4, '4 hinter. 8 rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4008c', '4er', 5.2, '4 hinter. 8 durch. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4010a', '4er', 7.7, '4 hinter. S Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4010b', '4er', 9.4, '4 hinter. 8 Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4010c', '4er', 10.6, '4 hinter. 8 durch. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4011a', '4er', 1, '4 hinter. Längszug', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4011b', '4er', 1.8, '4 hinter. Längszug 2 Lschl. 2 Rschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4012a', '4er', 1.6, '2 hinter. Gegenlängszug', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4012b', '4er', 2.7, '2 hinter. Gegenlängszug 2 Mühlen', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4013a', '4er', 1.2, '2 neben. Gegenlängszug', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4013b', '4er', 1.7, '2 neben. Gegenlängszug 4 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4013c', '4er', 1.6, '2 neben. Gegenlängszug durch.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4013d', '4er', 2.1, '2 neben. Gegenlängszug durch. 4 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4013e', '4er', 2.2, '2 neben. Gegenlängszug durch. 4 Rschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4013f', '4er', 2.7, '2 neben. Gegenlängszug durch. 2 Mühlen', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4014a', '4er', 1.6, '2 hinter. Gegenschrägzug', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4015a', '4er', 2, '4 neben. halbe Quer-Wschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4015b', '4er', 2.4, '4 neben. Quer-Wschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4016a', '4er', 8.7, '4 neben. halbe Quer-Wschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4016b', '4er', 10.4, '4 neben. Quer-Wschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4017a', '4er', 1, '4 neben. Querzug', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4017b', '4er', 1.6, '4 neben. Querzug 4 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4018a', '4er', 2.1, '4 neben. Querzug rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4018b', '4er', 3.2, '4 neben. Querzug 4 Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4024a', '4er', 9.3, '2er Flügelmühle HU. Dreh. Stg. rw. frh. T (10,3)', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4024b', '4er', 10.2, '2er Flügelmühle Dreh. Stg. rw. frh. T (11,2)', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4024c', '4er', 12.6, 'Remmlinger Dreh. Stg. rw. frh. T (13,6)', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4026a', '4er', 0.8, '2 hinter. halbe Doppelrunde', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4026b', '4er', 1.2, '2 hinter. Doppelrunde', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4026c', '4er', 1.6, '2 hinter. Doppelrunde durch.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4026d', '4er', 1.4, '2 hinter. halbe Doppelrunde 4 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4026e', '4er', 1.8, '2 hinter. Doppelrunde 4 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4026f', '4er', 2.2, '2 hinter. Doppelrunde durch. 4 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4027a', '4er', 1.7, '2 hinter. halbe Doppelrunde rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4027b', '4er', 2.5, '2 hinter. Doppelrunde rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4027c', '4er', 3.3, '2 hinter. Doppelrunde durch. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4027d', '4er', 2.8, '2 hinter. halbe Doppelrunde 4 Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4027e', '4er', 3.6, '2 hinter. Doppelrunde 4 Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4027f', '4er', 4.4, '2 hinter. Doppelrunde durch. 4 Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4028a', '4er', 2.1, '2 hinter. halbe Doppelrunde Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4028b', '4er', 3.1, '2 hinter. Doppelrunde Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4028c', '4er', 4.1, '2 hinter. Doppelrunde durch. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4028d', '4er', 2.7, '2 hinter. halbe Doppelrunde Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4028e', '4er', 3.5, '2 hinter. Doppelrunde Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4028f', '4er', 5.3, '2 hinter. Doppelrunde durch. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4028g', '4er', 3.5, '2 hinter. halbe Doppelrunde 4 Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4028h', '4er', 4.5, '2 hinter. Doppelrunde 4 Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4028i', '4er', 5.5, '2 hinter. Doppelrunde durch. 4 Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4028j', '4er', 4.6, '2 hinter. halbe Doppelrunde 4 Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4028k', '4er', 5.4, '2 hinter. Doppelrunde 4 Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4028l', '4er', 7.2, '2 hinter. Doppelrunde durch. 4 Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4029a', '4er', 4.1, '2 hinter. halbe Doppelrunde Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4029b', '4er', 5.3, '2 hinter. Doppelrunde Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4029c', '4er', 7, '2 hinter. Doppelrunde durch. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4029d', '4er', 6.5, '2 hinter. halbe Doppelrunde 4 Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4029e', '4er', 7.7, '2 hinter. Doppelrunde 4 Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4029f', '4er', 9.4, '2 hinter. Doppelrunde durch. 4 Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4031a', '4er', 1, '2 hinter. Querzug', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4031b', '4er', 1.6, '2 hinter. Querzug 4 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4031c', '4er', 1.8, '2 hinter. Querzug 2 Lschl. 2 Rschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4032a', '4er', 2, '2 hinter. Querzug rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4032b', '4er', 3.1, '2 hinter. Querzug 4 Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4032c', '4er', 3.5, '2 hinter. Querzug 2 Lschl. 2 Rschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4044a', '4er', 1.2, '2 neben. Gegenquerzug', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4044b', '4er', 1.7, '2 neben. Gegenquerzug 4 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4044c', '4er', 1.6, '2 neben. Gegenquerzug durch.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4044d', '4er', 2.1, '2 neben. Gegenquerzug durch. 4 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4044e', '4er', 2.7, '2 neben. Gegenquerzug durch. 2 Mühlen', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4044f', '4er', 2, '2 neben. halbe Ggquer-Wschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4044g', '4er', 2.4, '2 neben. Ggquer-Wschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4045a', '4er', 2.3, '2 neben. Gegenquerzug rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4045b', '4er', 3.1, '2 neben. Gegenquerzug durch. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4045c', '4er', 3.4, '2 neben. Gegenquerzug 4 Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4045d', '4er', 3.9, '2 neben. halbe Ggquer-Wschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4045e', '4er', 4.7, '2 neben. Ggquer-Wschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4048a', '4er', 9, '2 neben. halbe Ggquer-Wschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4048b', '4er', 10, '2 neben. Ggquer-Wschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4048c', '4er', 12.1, '2 neben. Ggquer-Wschl. durch. Stg. rw. frh. T (11,3 -', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4071a', '4er', 0.4, '2er HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4071b', '4er', 0.6, '2er R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4071c', '4er', 0.6, '2er HR. 2er Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4071d', '4er', 1, '2er R. 2er Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4071e', '4er', 1.2, '2er HR. 4 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4071f', '4er', 1.4, '2er R. 4 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4072a', '4er', 0.8, '2er HR. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4072b', '4er', 1.2, '2er R. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4072c', '4er', 1.1, '2er HR. 2er Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4072d', '4er', 1.5, '2er R. 2er Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4072e', '4er', 2.9, '2er HR. 4 Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4072f', '4er', 3.3, '2er R. 4 Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4073a', '4er', 1, '2er HR. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4073b', '4er', 1.5, '2er R. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4073c', '4er', 1.3, '2er HR. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4073d', '4er', 2, '2er R. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4073e', '4er', 1.9, '2er HR. 2er Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4073f', '4er', 2.4, '2er R. 2er Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4073g', '4er', 2.3, '2er HR. 2er Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4073h', '4er', 3, '2er R. 2er Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4073i', '4er', 2.9, '2er HR. 4 Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4073j', '4er', 3.4, '2er R. 4 Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4073k', '4er', 3.6, '2er HR. 4 Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4073l', '4er', 4.3, '2er R. 4 Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4073m', '4er', 3.9, '2er HR. 4 Lschl. durch. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4073n', '4er', 4.4, '2er R. 4 Lschl. durch. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4073o', '4er', 4.4, '2er HR. 4 Lschl. durch. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4073p', '4er', 5.1, '2er R. 4 Lschl. durch. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4074a', '4er', 1.7, '2er HR. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4074b', '4er', 2.6, '2er R. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4074c', '4er', 2.4, '2er HR. 2er Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4074d', '4er', 3.2, '2er R. 2er Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4074e', '4er', 5.1, '2er HR. 4 Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4074f', '4er', 5.9, '2er R. 4 Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4074g', '4er', 6.8, '2er HR. 4 Lschl. durch. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4074h', '4er', 7.6, '2er R. 4 Lschl. durch. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4081a', '4er', 2, '2er hinter. Längszug Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4081b', '4er', 2.5, '2er hinter. Längszug 2er Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4081c', '4er', 2.7, '2er hinter. Längszug 2er Rschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4081d', '4er', 3.8, '2er hinter. Längszug 4 Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4082a', '4er', 2.6, '2er hinter. Längszug Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4082b', '4er', 6.8, '2er hinter. Längszug 2 Lschl. 2 Rschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4083a', '4er', 9.2, '2er Gegenlängszug durch. 4 Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4083b', '4er', 10.4, '2er Gegenlängszug durch. 4 Rschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4083c', '4er', 11.6, '2er Gegenlängszug durch. 2 Mühlen Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4086a', '4er', 0.6, '2er Querzug', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4086b', '4er', 0.8, '2er Querzug 2er Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4086c', '4er', 0.8, '2er Querzug 2er Rschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4086d', '4er', 1.7, '2er Querzug 4 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4087a', '4er', 1.2, '2er Querzug rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4087b', '4er', 1.7, '2er Querzug 2er Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4087c', '4er', 2.5, '2er Querzug 4 Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4088a', '4er', 1.5, '2er Querzug Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4088b', '4er', 2, '2er Querzug Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4088c', '4er', 1.9, '2er Querzug 2er Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4088d', '4er', 2.5, '2er Querzug 2er Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4088e', '4er', 2.7, '2er Querzug 2er Rschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4088f', '4er', 3.9, '2er Querzug 4 Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4088g', '4er', 4.8, '2er Querzug 4 Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4089a', '4er', 2.6, '2er Querzug Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4089b', '4er', 3.2, '2er Querzug 2er Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4089c', '4er', 3.6, '2er Querzug 2er Rschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4089d', '4er', 6.4, '2er Querzug 4 Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4096a', '4er', 0.7, '2er halbe Quer-Wschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4096b', '4er', 1.1, '2er Quer-Wschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4097a', '4er', 1.4, '2er halbe Quer-Wschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4097b', '4er', 2.2, '2er Quer-Wschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4098a', '4er', 1.8, '2er halbe Quer-Wschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4098b', '4er', 2.8, '2er Quer-Wschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4098c', '4er', 2.3, '2er halbe Quer-Wschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4098d', '4er', 3.6, '2er Quer-Wschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4099a', '4er', 3, '2er halbe Quer-Wschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4099b', '4er', 4.7, '2er Quer-Wschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4105a', '4er', 1.2, '2er Gegenquerzug', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4105b', '4er', 1.4, '2er Gegenquerzug 2er Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4105c', '4er', 1.8, '2er Gegenquerzug 4 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4106a', '4er', 2.4, '2er Gegenquerzug rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4106b', '4er', 2.7, '2er Gegenquerzug 2er Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4106c', '4er', 3.5, '2er Gegenquerzug 4 Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4107a', '4er', 3, '2er Gegenquerzug Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4107b', '4er', 3.9, '2er Gegenquerzug Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4107c', '4er', 3.4, '2er Gegenquerzug 2er Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4107d', '4er', 4.4, '2er Gegenquerzug 2er Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4107e', '4er', 4.9, '2er Gegenquerzug 4 Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4107f', '4er', 5.7, '2er Gegenquerzug 4 Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4108a', '4er', 4.1, '2er Gegenquerzug Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4108b', '4er', 7.5, '2er Gegenquerzug 4 Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4108c', '4er', 8.3, '2er Gegenquerzug 2 Lschl. 2 Rschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4116a', '4er', 1.6, 'Umfahrt 1 um 1', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4117a', '4er', 2.2, 'Umfahrt 1 um 1 rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4121a', '4er', 0.8, 'Zwei Mühlen', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4121b', '4er', 1.4, 'Zwei Mühlen 4 Rschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4122a', '4er', 1.7, 'Zwei Mühlen rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4122b', '4er', 2.6, 'Zwei Mühlen rw. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4122c', '4er', 3.1, 'Zwei Mühlen rw. an- u. abgef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4123a', '4er', 2.1, 'Zwei Mühlen Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4123b', '4er', 2.7, 'Zwei Mühlen Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4123c', '4er', 4.3, 'Zwei Mühlen Stg. frh. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4123d', '4er', 4.3, 'Zwei Mühlen Stg. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4123e', '4er', 4.6, 'Zwei Mühlen Stg. frh. an- u. abgef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4123f', '4er', 5.1, 'Zwei Mühlen Stg. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4124a', '4er', 3.6, 'Zwei Mühlen Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4124b', '4er', 5.6, 'Zwei Mühlen Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4124c', '4er', 6.6, 'Zwei Mühlen Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4124d', '4er', 9.4, 'Zwei Mühlen Dreh. Stg. rw. an- u. abgef. frh. T (10,4)', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4124e', '4er', 7.7, 'Zwei Mühlen 4 Rschl. Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4133a', '4er', 1.7, 'Zwei Innenringe Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4133b', '4er', 2.9, 'Zwei Innenringe Stg. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4133c', '4er', 3.8, 'Zwei Innenringe Stg. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4133d', '4er', 3.5, 'Zwei Innenringe Stg. an- u. abgef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4133e', '4er', 4.6, 'Zwei Innenringe Stg. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4134a', '4er', 2.4, 'Zwei Innenringe Stg. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4134b', '4er', 4.9, 'Zwei Innenringe Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4134c', '4er', 6, 'Zwei Innenringe Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4134d', '4er', 8.5, 'Zwei Innenringe 4 Rschl. Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4134e', '4er', 10.7, 'Zwei Innenringe Dreh. Stg. rw. an- u. abgef. frh. T (11,7)', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4135a', '4er', 2.5, 'Zwei Außenringe Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4135b', '4er', 3.7, 'Zwei Außenringe Stg. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4135c', '4er', 4.8, 'Zwei Außenringe Stg. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4135d', '4er', 4.3, 'Zwei Außenringe Stg. an- u. abgef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4135e', '4er', 5.6, 'Zwei Außenringe Stg. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4136a', '4er', 3.5, 'Zwei Außenringe Stg. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4136b', '4er', 6.3, 'Zwei Außenringe Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4136c', '4er', 7.3, 'Zwei Außenringe Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4136d', '4er', 9.9, 'Zwei Außenringe 4 Rschl. Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4136e', '4er', 12.1, 'Zwei Außenringe Dreh. Stg. rw. an- u. abgef. frh. T (13,1)', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4151a', '4er', 0.8, '4er HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4151b', '4er', 1, '4er R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4151c', '4er', 1.2, '4er HR. 2er Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4151d', '4er', 1.4, '4er R. 2er Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4151e', '4er', 2.4, '4er HR. 4 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4151f', '4er', 2.8, '4er R. 4 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4152a', '4er', 1.7, '4er HR. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4152b', '4er', 2.1, '4er R. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4152c', '4er', 2.4, '4er HR. 2er Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4152d', '4er', 2.8, '4er R. 2er Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4152e', '4er', 3.8, '4er HR. 4 Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4152f', '4er', 4.2, '4er R. 4 Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4153a', '4er', 2.1, '4er HR. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4153b', '4er', 2.6, '4er R. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4153c', '4er', 2.7, '4er HR. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4153d', '4er', 3.4, '4er R. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4153e', '4er', 3, '4er HR. 2er Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4153f', '4er', 3.5, '4er R. 2er Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4153g', '4er', 3.9, '4er HR. 2er Lschl. Stg. frh', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4153h', '4er', 3.6, '4er R. 2er Lschl. Stg. frh', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4153i', '4er', 4.5, '4er HR. 4 Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4153j', '4er', 5, '4er R. 4 Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4153k', '4er', 5.6, '4er HR. 4 Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4153l', '4er', 6.2, '4er R. 4 Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4154a', '4er', 3.6, '4er HR. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4154b', '4er', 4.4, '4er R. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4154c', '4er', 5.1, '4er HR. 2er Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4154d', '4er', 6, '4er R. 2er Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4154e', '4er', 7, '4er HR. 4 Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4154f', '4er', 7.8, '4er R. 4 Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4154g', '4er', 9.3, '4er HR. Dreh. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4154h', '4er', 10.2, '4er R. Dreh. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4161a', '4er', 1, '4er Querzug', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4161b', '4er', 1.4, '4er Querzug 2er Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4161c', '4er', 1.5, '4er Querzug 2er Rschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4161d', '4er', 1.6, '4er Querzug 4 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4162a', '4er', 2.1, '4er Querzug rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4162b', '4er', 2.8, '4er Querzug 2er Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4162c', '4er', 3, '4er Querzug 2er Rschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4162d', '4er', 3.2, '4er Querzug 4 Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4163a', '4er', 2.6, '4er Querzug Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4163b', '4er', 3.4, '4er Querzug Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4163c', '4er', 3.5, '4er Querzug 2er Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4163d', '4er', 4.1, '4er Querzug 2er Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4163e', '4er', 5, '4er Querzug 4 Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4163f', '4er', 5.2, '4er Querzug 4 Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4164a', '4er', 3.4, '4er Querzug Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4164b', '4er', 5, '4er Querzug 2er Lschl. Stg. rw. frh', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4164c', '4er', 6.8, '4er Querzug 4 Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4164d', '4er', 7.7, '4er Querzug 2 Lschl. 2 Rschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4164e', '4er', 10.2, '4er Querzug Dreh. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4171a', '4er', 1.1, 'Umfahrt 3er um 1', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4172a', '4er', 2.2, 'Umfahrt 3er um 1 rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4173a', '4er', 2.8, 'Umfahrt 3er um 1 Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4173b', '4er', 3.6, 'Umfahrt 3er um 1 Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4174a', '4er', 4.8, 'Umfahrt 3er um 1 Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4181a', '4er', 0.6, 'Kutsche HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4181b', '4er', 0.8, 'Kutsche R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4182a', '4er', 1.5, 'Kutsche HR. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4182b', '4er', 2, 'Kutsche R. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4183a', '4er', 0.6, 'Schlange HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4183b', '4er', 0.8, 'Schlange R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4191a', '4er', 0.6, 'Kette HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4191b', '4er', 0.8, 'Kette R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4192a', '4er', 2, 'Kette HR. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4192b', '4er', 2.6, 'Kette R. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4196a', '4er', 1, 'Sattelgriff HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4196b', '4er', 1.2, 'Sattelgriff R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4197a', '4er', 1.2, 'Sattelgriffdurchzug', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4198a', '4er', 0.8, 'Sattelgriffring', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4198b', '4er', 1.8, 'Sattelgriffring 4 Rschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4199a', '4er', 1.6, 'Sattelgriffring rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4199b', '4er', 2.6, 'Sattelgriffring rw. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4199c', '4er', 3, 'Sattelgriffring rw. an- u. abgef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4211a', '4er', 1.3, '2er Flügelmühle', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4211b', '4er', 1.7, '2er Flügelmühle HU. 2er Rschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4211c', '4er', 1.9, '2er Flügelmühle 2er Rschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4211d', '4er', 2.1, '2er Flügelmühle HU. 4 Rschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4211e', '4er', 2.4, '2er Flügelmühle 4 Rschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4212a', '4er', 1.6, '2er Flügelmühle rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4212b', '4er', 2.4, '2er Flügelmühle HU. 2er Rschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4212c', '4er', 3.1, '2er Flügelmühle 2er Rschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4212d', '4er', 2.6, '2er Flügelmühle rw. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4212e', '4er', 3, '2er Flügelmühle rw. an- u. abgef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4213a', '4er', 2, '2er Flügelmühle Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4213b', '4er', 2.6, '2er Flügelmühle Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4213c', '4er', 4.2, '2er Flügelmühle Stg. frh. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4213d', '4er', 4.2, '2er Flügelmühle Stg. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4213e', '4er', 4.4, '2er Flügelmühle Stg. frh. an- u. abgef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4213f', '4er', 4.9, '2er Flügelmühle Stg. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4214a', '4er', 3.4, '2er Flügelmühle Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4214b', '4er', 5.4, '2er Flügelmühle Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4214c', '4er', 6, '2er Flügelmühle Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4214d', '4er', 5.1, '2er Flügelmühle HU. Mühle mit 2 Rschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4214e', '4er', 4.1, '2er Flügelmühle HU. 2er Rschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4214f', '4er', 5.4, '2er Flügelmühle 2er Rschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4214g', '4er', 5.6, '2er Flügelmühle HU. 4 Rschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4214h', '4er', 6.6, '2er Flügelmühle HU. 4 Rschl. Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4214i', '4er', 7.2, '2er Flügelmühle HU. 4 Rschl. Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4214j', '4er', 6, '2er Flügelmühle 4 Rschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4214k', '4er', 7.5, '2er Flügelmühle 4 Rschl. Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4214l', '4er', 8.5, '2er Flügelmühle 4 Rschl. Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4223a', '4er', 2, '2er Flügelring Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4223b', '4er', 2.6, '2er Flügelring Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4223c', '4er', 3.7, '2er Flügelring Stg. frh. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4223d', '4er', 4.2, '2er Flügelring Stg. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4223e', '4er', 4.4, '2er Flügelring Stg. frh. an- u. abgef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4223f', '4er', 4.9, '2er Flügelring Stg. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4224a', '4er', 3.4, '2er Flügelring Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4224b', '4er', 5.4, '2er Flügelring Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4224c', '4er', 6.5, '2er Flügelring Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4230a', '4er', 1.7, '2er Flügelmühle Mühle mit 2 hinter. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4231a', '4er', 3.4, '2er Flügelmühle Mühle mit 2 hinter. R. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4232a', '4er', 3.8, '2er Flügelmühle Mühle mit 2 hinter. R. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4232b', '4er', 4.6, '2er Flügelmühle Mühle mit 2 hinter. R. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4232c', '4er', 3.9, '2er Flügelring Innenring mit 2 hinter. R. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4232d', '4er', 4.9, '2er Flügelring Innenring mit 2 hinter. R. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4233a', '4er', 5.3, '2er Flügelmühle Mühle mit 2 hinter. R. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4233b', '4er', 5.6, '2er Flügelring Innenring mit 2 hinter. R. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4233c', '4er', 8.2, '2er Flügelmühle HU. Mühle mit Dreh. Stg. rw. frh. T (9,0)', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4241a', '4er', 2, 'Mühle', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4241b', '4er', 2.6, 'Mühle 4 Rschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4242a', '4er', 3.1, 'Mühle rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4242b', '4er', 4, 'Mühle rw. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4242c', '4er', 4.5, 'Mühle rw. an- u. abgef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4243a', '4er', 2.6, 'Mühle Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4243b', '4er', 3.4, 'Mühle Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4243c', '4er', 4.4, 'Mühle Stg. frh. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4243d', '4er', 4.9, 'Mühle Stg. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4243e', '4er', 5.2, 'Mühle Stg. frh. an- u. abgef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4243f', '4er', 5.7, 'Mühle Stg. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4244a', '4er', 4.4, 'Mühle Stg rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4244b', '4er', 6.5, 'Mühle Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4244c', '4er', 7, 'Mühle Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4244d', '4er', 8, 'Mühle 4 Rschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4244e', '4er', 9, 'Mühle 4 Rschl. Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4251a', '4er', 2.8, 'Innenring um 1 Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4251b', '4er', 4, 'Innenring um 1 Stg. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4251c', '4er', 4.7, 'Innenring um 1 Stg. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4251d', '4er', 4.6, 'Innenring um 1 Stg. an- u. abgef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4251e', '4er', 5.5, 'Innenring um 1 Stg. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4252a', '4er', 3.9, 'Innenring um 1 Stg. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4252b', '4er', 6.8, 'Innenring um 1 Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4252c', '4er', 7.8, 'Innenring um 1 Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4252d', '4er', 8.8, 'Innenring um 1 Stg. rw. angedr. u. abgef. frh. T (9,8)', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4252e', '4er', 11.5, 'Innenring um 1 3 Rschl. um Dreh. Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4258a', '4er', 2.2, 'Innenring Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4258b', '4er', 3.4, 'Innenring Stg. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4258c', '4er', 3.9, 'Innenring Stg. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4258d', '4er', 4, 'Innenring Stg. an- u. abgef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4258e', '4er', 5.2, 'Innenring Stg. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4259a', '4er', 3.1, 'Innenring Stg. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4259b', '4er', 5.8, 'Innenring Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4259c', '4er', 6.3, 'Innenring Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4259d', '4er', 7, 'Innenring Stg. rw. angedr. frh. T (8,0)', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4259e', '4er', 7.5, 'Innenring Stg. rw. angedr. u. abgef. frh. T (8,5)', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4267a', '4er', 2.7, 'Wechselring Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4267b', '4er', 4.1, 'Wechselring HU. / Innenring HU. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4267c', '4er', 3.9, 'Wechselring Stg. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4267d', '4er', 4.6, 'Wechselring Stg. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4267e', '4er', 4.5, 'Wechselring Stg. an- u. abgef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4267f', '4er', 5.9, 'Wechselring Stg. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4268a', '4er', 3.8, 'Wechselring Stg. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4268b', '4er', 5.7, 'Wechselring HU. / Innenring HU. Stg. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4268c', '4er', 6.6, 'Wechselring Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4268d', '4er', 7.7, 'Wechselring Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4268e', '4er', 7.8, 'Wechselring Stg. rw. angedr. u. abgef. frh. T (8,8)', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4272a', '4er', 3, 'Außenring Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4272b', '4er', 4.2, 'Außenring Stg. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4272c', '4er', 5, 'Außenring Stg. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4272d', '4er', 4.8, 'Außenring Stg. an- u. abgef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4272e', '4er', 5.7, 'Außenring Stg. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4272f', '4er', 4.4, 'Außenring HU. / Innenring HU. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4273a', '4er', 4.2, 'Außenring Stg. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4273b', '4er', 7.1, 'Außenring Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4273c', '4er', 8.2, 'Außenring Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4273d', '4er', 6.2, 'Außenring HU. / Innenring HU. Stg. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4273e', '4er', 10.7, 'Außenring 4 Rschl. Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4280a', '4er', 0.8, 'Halbe Torfahrt', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4280b', '4er', 1.2, 'Torfahrt', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4280c', '4er', 1.4, 'Halbe Synchrontorfahrt', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4280d', '4er', 2.8, 'Synchrontorfahrt', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4280e', '4er', 3.4, 'Gegentorfahrt glz.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4281a', '4er', 1.6, 'Halbe Torfahrt rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4281b', '4er', 2.4, 'Torfahrt rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4281c', '4er', 2.8, 'Halbe Synchrontorfahrt rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4281d', '4er', 3.6, 'Synchrontorfahrt rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4281e', '4er', 4.8, 'Gegentorfahrt glz. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4281f', '4er', 6.6, 'Gegentorfahrt Wschl. glz. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4282a', '4er', 2, 'Halbe Torfahrt Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4282b', '4er', 3, 'Torfahrt Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4282c', '4er', 2.6, 'Halbe Torfahrt Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4282d', '4er', 3.9, 'Torfahrt Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4283a', '4er', 4.4, 'Halbe Torfahrt Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4283b', '4er', 5.1, 'Torfahrt Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4284a', '4er', 8.2, 'Gegentorfahrt glz. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4284b', '4er', 9.2, 'Mühle mit Gegentorfahrt glz. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4285a', '4er', 3, 'Halbe Synchrontorfahrt Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4285b', '4er', 4, 'Synchrontorfahrt Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4285c', '4er', 4.1, 'Halbe Synchrontorfahrt Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4285d', '4er', 4.9, 'Synchrontorfahrt Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4286a', '4er', 6, 'Halbe Synchrontorfahrt Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4286b', '4er', 6.7, 'Synchrontorfahrt Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4287a', '4er', 6, 'Gegentorfahrt glz. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4287b', '4er', 6.8, 'Gegentorfahrt glz. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4288a', '4er', 6, 'Mühle mit halber Synchrontorfahrt Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4288b', '4er', 7.2, 'Mühle mit Synchrontorfahrt Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4289a', '4er', 5.1, 'Mühle mit Synchrontorfahrt Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4289b', '4er', 6.6, 'Mühle mit Gegentorfahrt glz. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4290a', '4er', 9.4, 'Schleifentorfahrt glz. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4291a', '4er', 1.4, 'Doppeltorfahrt', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4292a', '4er', 3.8, 'Doppeltorfahrt rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4292b', '4er', 5.1, 'Schlangenbogendoppeltorfahrt rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4293a', '4er', 7, 'Doppeltorfahrt Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4293b', '4er', 9.9, 'Turbine Doppeltorfahrt gegenf. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4294a', '4er', 7.7, 'Schlangenbogendoppeltorfahrt Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4294b', '4er', 9.6, 'Turbine Schlangenbogendoppeltorfahrt gegenf. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4296a', '4er', 5.2, 'Wschl. Torfahrt rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4297a', '4er', 9.6, 'Wschl. Torfahrt Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4298a', '4er', 11.2, 'Gegentorfahrt Wschl. glz. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4298b', '4er', 12.2, 'Mühle mit Gegentorfahrt Wschl. glz. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4307a', '4er', 5.1, 'Halber Torring Stg. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4307b', '4er', 6.5, 'Torring Stg. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4307c', '4er', 8.4, 'Zirkel mit Innenring gegenf. Stg. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4316a', '4er', 1.7, 'Innenstern', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4316b', '4er', 2.2, 'Innenstern 4 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4317a', '4er', 3.2, 'Innenstern Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4317b', '4er', 4.2, 'Innenstern Stg. 2er angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4317c', '4er', 5.2, 'Innenstern Stg. 4er angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4317d', '4er', 5.4, 'Innenstern Stg. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4317e', '4er', 6, 'Innenstern Stg. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4317f', '4er', 9.2, 'Innenstern Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4317g', '4er', 10.6, 'Innenstern 4 Lschl. Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4317h', '4er', 11.2, 'Innenstern 4 Rschl. Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4326a', '4er', 1, 'Außenstern', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4326b', '4er', 3, 'Außenstern rw. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4326c', '4er', 4.1, 'Außenstern 4 Lschl. rw. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4327a', '4er', 1.4, 'Wechselstern', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4327b', '4er', 3.5, 'Wechselstern Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4327c', '4er', 4.7, 'Wechselstern Stg. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4327d', '4er', 5.1, 'Wechselstern Stg. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4327e', '4er', 8, 'Wechselstern Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4328a', '4er', 2.5, 'Außenstern Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4328b', '4er', 4.6, 'Außenstern Stg. rw. 2er angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4328c', '4er', 3.9, 'Außenstern Stg. rw. 4er angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4328d', '4er', 6.3, 'Außenstern Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4328e', '4er', 8.2, 'Außenstern 4 Lschl. Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4328f', '4er', 8.8, 'Außenstern 4 Rschl. Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4331a', '4er', 6.7, 'Innenstern Stg. ½ Standdrehung', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4331b', '4er', 9.7, 'Innenstern Stg. 1 Standdrehung', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4341a', '4er', 6, '2er Stg. ½ Standdrehung', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4341b', '4er', 7, '2er Stg. 1 Standdrehung', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4341c', '4er', 8, '2er Stg. 1½ Standdrehungen', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4341d', '4er', 9, '2er Stg. 2 Standdrehungen', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4342a', '4er', 7.1, '4er Stg. ½ Standdrehung', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4342b', '4er', 8.1, '4er Stg. 1 Standdrehung', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4342c', '4er', 9.1, '4er Stg. 1½ Standdrehungen', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('4342d', '4er', 10.1, '4er Stg. 2 Standdrehungen', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6001a', '6er', 0.8, '6 hinter. HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6001b', '6er', 1, '6 hinter. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6001c', '6er', 1.4, '6 hinter. HR. 6 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6001d', '6er', 1.6, '6 hinter. R. 6 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6001e', '6er', 1.4, '6 hinter. HR. 6 Rschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6001f', '6er', 1.6, '6 hinter. R. 6 Rschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6001g', '6er', 1.6, '6 hinter. HR. 3 Lschl. 3 Rschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6001h', '6er', 1.8, '6 hinter. R. 3 Lschl. 3 Rschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6001i', '6er', 2.7, '6 hinter. 6 Wschl. überlagernd', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6002a', '6er', 1.6, '6 hinter. HR. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6002b', '6er', 2, '6 hinter. R. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6002c', '6er', 2.7, '6 hinter. HR. 6 Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6002d', '6er', 3.1, '6 hinter. R. 6 Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6002e', '6er', 4.9, '6 hinter. 6 Wschl. überlagernd rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6003a', '6er', 2, '6 hinter. HR. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6003b', '6er', 2.5, '6 hinter. R. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6003c', '6er', 2.6, '6 hinter. HR. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6003d', '6er', 3.3, '6 hinter. R. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6003e', '6er', 3.4, '6 hinter. HR. 6 Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6003f', '6er', 3.9, '6 hinter. R. 6 Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6003g', '6er', 4.4, '6 hinter. HR. 6 Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6003h', '6er', 5.1, '6 hinter. R. 6 Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6004a', '6er', 3.4, '6 hinter. HR. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6004b', '6er', 4.3, '6 hinter. R. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6004c', '6er', 5.8, '6 hinter. HR. 6 Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6004d', '6er', 6.6, '6 hinter. R. 6 Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6004e', '6er', 6, '6 hinter. HR. 6 Rschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6004f', '6er', 6.8, '6 hinter. R. 6 Rschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6004g', '6er', 6.6, '6 hinter. HR. 3 Lschl. 3 Rschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6004h', '6er', 7.5, '6 hinter. R. 3 Lschl. 3 Rschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6004i', '6er', 9.4, '6 hinter. 6 Wschl. überlagernd Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6006a', '6er', 1, '6 hinter. Schrägzug', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6006b', '6er', 1.8, '6 hinter. Schrägzug 3 Lschl. 3 Rschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6007a', '6er', 1.8, '6 hinter. S', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6007b', '6er', 2.2, '6 hinter. 8', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6007c', '6er', 2.6, '6 hinter. 8 durch.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6008a', '6er', 3.6, '6 hinter. S rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6008b', '6er', 4.4, '6 hinter. 8 rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6008c', '6er', 5.2, '6 hinter. 8 durch. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6010a', '6er', 7.7, '6 hinter. S Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6010b', '6er', 9.4, '6 hinter. 8 Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6010c', '6er', 10.6, '6 hinter. 8 durch. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6011a', '6er', 1, '6 hinter. Längszug', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6011b', '6er', 1.8, '6 hinter. Längszug 3 Lschl. 3 Rschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6012a', '6er', 1.6, '3 hinter. Gegenlängszug', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6012b', '6er', 2.7, '3 hinter. Gegenlängszug 3 Mühlen', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6013a', '6er', 1.2, '3 neben. Gegenlängszug', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6013b', '6er', 1.7, '3 neben. Gegenlängszug 6 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6013c', '6er', 1.6, '3 neben. Gegenlängszug durch.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6013d', '6er', 2.1, '3 neben. Gegenlängszug durch. 6 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6013e', '6er', 2.2, '3 neben. Gegenlängszug durch. 6 Rschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6013f', '6er', 2.7, '3 neben. Gegenlängszug durch. 3 Mühlen', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6014a', '6er', 1.6, '3 hinter. Gegenschrägzug', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6015a', '6er', 2, '6 neben. halbe Quer-Wschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6015b', '6er', 2.4, '6 neben. Quer-Wschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6016a', '6er', 8.7, '6 neben. halbe Quer-Wschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6016b', '6er', 10.4, '6 neben. Quer-Wschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6017a', '6er', 1, '6 neben. Querzug', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6017b', '6er', 1.6, '6 neben. Querzug 6 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6018a', '6er', 2.1, '6 neben. Querzug rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6018b', '6er', 3.2, '6 neben. Querzug 6 Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6024a', '6er', 10.3, '2er Flügelmühle HU. Dreh. Stg. rw. frh. T (11,3)', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6024b', '6er', 11.2, '2er Flügelmühle Dreh. Stg. rw. frh. T (12,2)', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6025a', '6er', 9.3, '3er Flügelmühle HU. Dreh. Stg. rw. frh. T (10,3)', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6025b', '6er', 10.2, '3er Flügelmühle Dreh. Stg. rw. frh. T (11,2)', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6026a', '6er', 0.8, '3 hinter. halbe Doppelrunde', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6026b', '6er', 1.2, '3 hinter. Doppelrunde', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6026c', '6er', 1.4, '3 hinter. halbe Doppelrunde 6 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6026d', '6er', 1.8, '3 hinter. Doppelrunde 6 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6027a', '6er', 1.7, '3 hinter. halbe Doppelrunde rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6027b', '6er', 2.5, '3 hinter. Doppelrunde rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6027c', '6er', 2.8, '3 hinter. halbe Doppelrunde 6 Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6027d', '6er', 3.6, '3 hinter. Doppelrunde 6 Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6028a', '6er', 2.1, '3 hinter. halbe Doppelrunde Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6028b', '6er', 3.1, '3 hinter. Doppelrunde Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6028c', '6er', 2.7, '3 hinter. halbe Doppelrunde Stg frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6028d', '6er', 3.5, '3 hinter. Doppelrunde Stg frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6028e', '6er', 3.5, '3 hinter. halbe Doppelrunde 6 Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6028f', '6er', 4.5, '3 hinter. Doppelrunde 6 Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6028g', '6er', 4.6, '3 hinter. halbe Doppelrunde 6 Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6028h', '6er', 5.4, '3 hinter. Doppelrunde 6 Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6029a', '6er', 4.1, '3 hinter. halbe Doppelrunde Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6029b', '6er', 5.3, '3 hinter. Doppelrunde Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6029c', '6er', 6.5, '3 hinter. halbe Doppelrunde 6 Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6029d', '6er', 7.7, '3 hinter. Doppelrunde 6 Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6039a', '6er', 1.2, '3 neben. Gegenquerzug', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6039b', '6er', 1.7, '3 neben. Gegenquerzug 6 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6039c', '6er', 1.6, '3 neben. Gegenquerzug durch.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6039d', '6er', 2.1, '3 neben. Gegenquerzug durch. 6 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6039e', '6er', 2.7, '3 neben. Gegenquerzug durch. 3 Mühlen', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6039f', '6er', 2, '3 neben. halbe Ggquer-Wschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6039g', '6er', 2.4, '3 neben. Ggquer-Wschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6040a', '6er', 2.3, '3 neben. Gegenquerzug rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6040b', '6er', 3.1, '3 neben. Gegenquerzug durch. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6040c', '6er', 3.4, '3 neben. Gegenquerzug 6 Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6040d', '6er', 3.9, '3 neben. halbe Ggquer-Wschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6040e', '6er', 4.7, '3 neben. Ggquer-Wschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6042a', '6er', 9, '3 neben. halbe Ggquer-Wschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6042b', '6er', 10, '3 neben. Ggquer-Wschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6042c', '6er', 12.1, '3 neben. Ggquer-Wschl. durch. Stg. rw. frh. T (11,3 -', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6052a', '6er', 1, '2 hinter. Querzug', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6052b', '6er', 1.6, '2 hinter. Querzug 6 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6053a', '6er', 2, '2 hinter. Querzug rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6053b', '6er', 3.1, '2 hinter. Querzug 6 Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6061a', '6er', 1.8, 'Triple R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6062a', '6er', 3.6, 'Triple R. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6063a', '6er', 3.4, 'Triple R. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6063b', '6er', 3.9, 'Triple R. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6064a', '6er', 6, 'Triple R. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6081a', '6er', 0.4, '2er HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6081b', '6er', 0.6, '2er R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6081c', '6er', 0.6, '2er HR. 2er Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6081d', '6er', 1, '2er R. 2er Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6081e', '6er', 1.2, '2er HR. 6 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6081f', '6er', 1.4, '2er R. 6 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6082a', '6er', 0.8, '2er HR. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6082b', '6er', 1.2, '2er R. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6082c', '6er', 1.1, '2er HR. 2er Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6082d', '6er', 1.5, '2er R. 2er Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6082e', '6er', 2.9, '2er HR. 6 Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6082f', '6er', 3.3, '2er R. 6 Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6083a', '6er', 1, '2er HR. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6083b', '6er', 1.5, '2er R. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6083c', '6er', 1.3, '2er HR. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6083d', '6er', 2, '2er R. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6083e', '6er', 1.9, '2er HR. 2er Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6083f', '6er', 2.4, '2er R. 2er Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6083g', '6er', 2.3, '2er HR. 2er Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6083h', '6er', 3, '2er R. 2er Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6083i', '6er', 2.9, '2er HR. 6 Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6083j', '6er', 3.4, '2er R. 6 Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6083k', '6er', 3.6, '2er HR. 6 Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6083l', '6er', 4.3, '2er R. 6 Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6084a', '6er', 1.7, '2er HR. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6084b', '6er', 2.6, '2er R. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6084c', '6er', 2.4, '2er HR. 2er Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6084d', '6er', 3.2, '2er R. 2er Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6084e', '6er', 5.1, '2er HR. 6 Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6084f', '6er', 5.9, '2er R. 6 Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6091a', '6er', 2, '2er hinter. Längszug Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6091b', '6er', 2.5, '2er hinter. Längszug 2er Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6091c', '6er', 2.7, '2er hinter. Längszug 2er Rschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6091d', '6er', 3.8, '2er hinter. Längszug 6 Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6092a', '6er', 2.6, '2er hinter. Längszug Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6092b', '6er', 6.8, '2er hinter. Längszug 3 Lschl. 3 Rschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6093a', '6er', 9.2, '3er Gegenlängszug durch. 6 Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6093b', '6er', 10.4, '3er Gegenlängszug durch. 6 Rschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6093c', '6er', 11.6, '3er Gegenlängszug durch. 3 Mühlen Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6096a', '6er', 0.6, '2er Querzug', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6096b', '6er', 0.8, '2er Querzug 2er Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6096c', '6er', 0.8, '2er Querzug 2er Rschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6096d', '6er', 1.7, '2er Querzug 6 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6097a', '6er', 1.2, '2er Querzug rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6097b', '6er', 1.7, '2er Querzug 2er Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6097c', '6er', 2.5, '2er Querzug 6 Lschl. rw', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6098a', '6er', 1.5, '2er Querzug Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6098b', '6er', 2, '2er Querzug Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6098c', '6er', 1.9, '2er Querzug 2er Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6098d', '6er', 2.5, '2er Querzug 2er Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6098e', '6er', 2.7, '2er Querzug 2er Rschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6098f', '6er', 3.9, '2er Querzug 6 Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6098g', '6er', 4.8, '2er Querzug 6 Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6099a', '6er', 2.6, '2er Querzug Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6099b', '6er', 3.2, '2er Querzug 2er Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6099c', '6er', 3.6, '2er Querzug 2er Rschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6099d', '6er', 6.4, '2er Querzug 6 Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6106a', '6er', 0.7, '2er halbe Quer-Wschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6106b', '6er', 1.1, '2er Quer-Wschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6107a', '6er', 1.4, '2er halbe Quer-Wschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6107b', '6er', 2.2, '2er Quer-Wschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6108a', '6er', 1.8, '2er halbe Quer-Wschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6108b', '6er', 2.8, '2er Quer-Wschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6108c', '6er', 2.3, '2er halbe Quer-Wschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6108d', '6er', 3.6, '2er Quer-Wschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6109a', '6er', 3, '2er halbe Quer-Wschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6109b', '6er', 4.7, '2er Quer-Wschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6121a', '6er', 0.8, 'Drei Mühlen', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6121b', '6er', 1.4, 'Drei Mühlen 6 Rschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6122a', '6er', 1.7, 'Drei Mühlen rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6122b', '6er', 2.6, 'Drei Mühlen rw. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6122c', '6er', 3.1, 'Drei Mühlen rw. an -u. abgef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6123a', '6er', 2.1, 'Drei Mühlen Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6123b', '6er', 2.7, 'Drei Mühlen Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6123c', '6er', 4.3, 'Drei Mühlen Stg. frh. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6123d', '6er', 4.3, 'Drei Mühlen Stg. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6123e', '6er', 4.6, 'Drei Mühlen Stg. frh. an- u. abgef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6123f', '6er', 5.1, 'Drei Mühlen Stg. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6124a', '6er', 3.6, 'Drei Mühlen Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6124b', '6er', 5.6, 'Drei Mühlen Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6124c', '6er', 6.6, 'Drei Mühlen Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6124d', '6er', 9.4, 'Drei Mühlen Dreh. Stg. rw. an- u. abgef. frh. T (10,4)', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6124e', '6er', 7.7, 'Drei Mühlen 6 Rschl. Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6133a', '6er', 1.7, 'Drei Innenringe Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6133b', '6er', 2.9, 'Drei Innenringe Stg. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6133c', '6er', 3.8, 'Drei Innenringe Stg. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6133d', '6er', 3.5, 'Drei Innenringe Stg. an- u. abgef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6133e', '6er', 4.6, 'Drei Innenringe Stg. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6134a', '6er', 2.4, 'Drei Innenringe Stg. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6134b', '6er', 4.9, 'Drei Innenringe Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6134c', '6er', 6, 'Drei Innenringe Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6134d', '6er', 8.5, 'Drei Innenringe 6 Rschl. Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6134e', '6er', 10.7, 'Drei Innenringe Dreh. Stg. rw. an- u. abgef. frh. T (11,7)', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6135a', '6er', 2.5, 'Drei Außenringe Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6135b', '6er', 3.7, 'Drei Außenringe Stg. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6135c', '6er', 4.8, 'Drei Außenringe Stg. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6135d', '6er', 4.3, 'Drei Außenringe Stg. an- u. abgef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6135e', '6er', 5.6, 'Drei Außenringe Stg. an- u. abgef. frh', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6136a', '6er', 3.5, 'Drei Außenringe Stg. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6136b', '6er', 6.3, 'Drei Außenringe Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6136c', '6er', 7.3, 'Drei Außenringe Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6136d', '6er', 9.9, 'Drei Außenringe Dreh. Stg. rw. an- u. abgef. frh. T (10,9)', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6136e', '6er', 12.1, 'Drei Außenringe 6 Rschl. Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6151a', '6er', 0.7, '3er HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6151b', '6er', 0.9, '3er R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6151c', '6er', 1.3, '3er HR. 6 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6151d', '6er', 1.5, '3er R. 6 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6152a', '6er', 1.4, '3er HR. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6152b', '6er', 1.8, '3er R. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6152c', '6er', 2.6, '3er HR. 6 Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6152d', '6er', 3, '3er R. 6 Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6153a', '6er', 1.8, '3er HR. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6153b', '6er', 2.3, '3er R. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6153c', '6er', 2.3, '3er HR. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6153d', '6er', 3, '3er R. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6153e', '6er', 3.2, '3er HR. 6 Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6153f', '6er', 3.7, '3er R. 6 Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6153g', '6er', 4.2, '3er HR. 6 Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6153h', '6er', 4.8, '3er R. 6 Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6154a', '6er', 3.1, '3er HR. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6154b', '6er', 3.9, '3er R. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6154c', '6er', 5.4, '3er HR. 6 Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6154d', '6er', 6.3, '3er R. 6 Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6165a', '6er', 0.9, '3er Querzug', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6165b', '6er', 1.5, '3er Querzug 6 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6165c', '6er', 1.5, '3er Querzug 6 Rschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6166a', '6er', 1.8, '3er Querzug rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6166b', '6er', 3, '3er Querzug 6 Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6166c', '6er', 3, '3er Querzug 6 Rschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6167a', '6er', 2.3, '3er Querzug Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6167b', '6er', 3, '3er Querzug Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6167c', '6er', 3.7, '3er Querzug 6 Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6167d', '6er', 4.8, '3er Querzug 6 Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6168a', '6er', 3.9, '3er Querzug Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6168b', '6er', 6.3, '3er Querzug 6 Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6168c', '6er', 7.2, '3er Querzug 6 Rschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6170a', '6er', 1.2, '3er Gegenquerzug', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6170b', '6er', 1.8, '3er Gegenquerzug 6 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6171a', '6er', 2.4, '3er Gegenquerzug rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6171b', '6er', 3.5, '3er Gegenquerzug 6 Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6172a', '6er', 3, '3er Gegenquerzug Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6172b', '6er', 3.9, '3er Gegenquerzug Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6172c', '6er', 4.9, '3er Gegenquerzug 6 Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6172d', '6er', 5.7, '3er Gegenquerzug 6 Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6173a', '6er', 4.1, '3er Gegenquerzug Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6173b', '6er', 7.5, '3er Gegenquerzug 6 Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6184a', '6er', 1.6, 'Umfahrt 1 um 1', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6185a', '6er', 2.2, 'Umfahrt 1 um 1 rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6186a', '6er', 1.2, 'Umfahrt 2er um 1', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6187a', '6er', 2.4, 'Umfahrt 2er um 1 rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6208a', '6er', 3, 'Zwei Turbinen Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6208b', '6er', 3.9, 'Zwei Turbinen Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6208c', '6er', 4.5, 'Zwei Turbinen Stg. frh. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6208d', '6er', 4.5, 'Zwei Turbinen Stg. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6208e', '6er', 4.7, 'Zwei Turbinen Stg. frh. an- u. abgef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6208f', '6er', 5.2, 'Zwei Turbinen Stg. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6209a', '6er', 4.1, 'Zwei Turbinen Stg. rw. frh', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6209b', '6er', 6.1, 'Zwei Turbinen Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6209c', '6er', 6.7, 'Zwei Turbinen Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6209d', '6er', 7.9, 'Zwei Turbinen Dreh. Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6216a', '6er', 0.8, 'Zwei Mühlen', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6217a', '6er', 1.7, 'Zwei Mühlen rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6217b', '6er', 2.6, 'Zwei Mühlen rw. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6217c', '6er', 3.1, 'Zwei Mühlen rw. an- u. abgef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6218a', '6er', 2.1, 'Zwei Mühlen Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6218b', '6er', 2.7, 'Zwei Mühlen Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6218c', '6er', 4.3, 'Zwei Mühlen Stg. frh. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6218d', '6er', 4.3, 'Zwei Mühlen Stg. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6218e', '6er', 4.6, 'Zwei Mühlen Stg. frh. an- u. abgef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6218f', '6er', 5.1, 'Zwei Mühlen Stg. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6219a', '6er', 3.6, 'Zwei Mühlen Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6219b', '6er', 5.6, 'Zwei Mühlen Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6219c', '6er', 6.6, 'Zwei Mühlen Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6219d', '6er', 9.2, 'Zwei Mühlen 6 Rschl. Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6228a', '6er', 1.7, 'Zwei Innenringe Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6228b', '6er', 3.4, 'Zwei Innenringe Stg. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6228c', '6er', 3.8, 'Zwei Innenringe Stg. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6228d', '6er', 4, 'Zwei Innenringe Stg. an- u. abgef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6228e', '6er', 4.6, 'Zwei Innenringe Stg. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6229a', '6er', 2.4, 'Zwei Innenringe Stg. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6229b', '6er', 4.9, 'Zwei Innenringe Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6229c', '6er', 6, 'Zwei Innenringe Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6229d', '6er', 8.5, 'Zwei Innenringe 6 Rschl. Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6236a', '6er', 2.5, 'Zwei Außenringe Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6236b', '6er', 4.2, 'Zwei Außenringe Stg. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6236c', '6er', 4.8, 'Zwei Außenringe Stg. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6236d', '6er', 4.3, 'Zwei Außenringe Stg. an- u. abgef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6236e', '6er', 4.8, 'Zwei Außenringe Stg. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6236f', '6er', 3.9, 'Zwei Außenringe HU. / Zwei Innenringe HU. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6237a', '6er', 3.5, 'Zwei Außenringe Stg. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6237b', '6er', 6.3, 'Zwei Außenringe Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6237c', '6er', 7.3, 'Zwei Außenringe Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6237d', '6er', 5.5, 'Zwei Außenringe HU. / Zwei Innenringe HU. Stg. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6238a', '6er', 4.1, 'Zwei Innensterne Stg. 3er angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6238b', '6er', 6.4, 'Zwei Innensterne Stg. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6238c', '6er', 8.3, 'Zwei Innensterne Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6251a', '6er', 3.6, 'Zwei Außensterne rw. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6252a', '6er', 4.7, 'Zwei Außensterne Stg. rw. 3er angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6252b', '6er', 6.4, 'Zwei Außensterne Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6271a', '6er', 0.8, '6er HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6271b', '6er', 1, '6er R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6271c', '6er', 1.2, '6er HR. 2er Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6271d', '6er', 1.4, '6er R. 2er Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6271e', '6er', 2.4, '6er HR. 6 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6271f', '6er', 2.8, '6er R. 6 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6272a', '6er', 1.7, '6er HR. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6272b', '6er', 2.1, '6er R. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6272c', '6er', 2.4, '6er HR. 2er Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6272d', '6er', 2.8, '6er R. 2er Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6272e', '6er', 3.8, '6er HR. 6 Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6272f', '6er', 4.2, '6er R. 6 Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6273a', '6er', 2.1, '6er HR. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6273b', '6er', 2.6, '6er R. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6273c', '6er', 2.7, '6er HR. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6273d', '6er', 3.4, '6er R. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6273e', '6er', 3, '6er HR. 2er Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6273f', '6er', 3.5, '6er R. 2er Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6273g', '6er', 3.9, '6er HR. 2er Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6273h', '6er', 3.6, '6er R. 2er Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6273i', '6er', 4.5, '6er HR. 6 Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6273j', '6er', 5, '6er R. 6 Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6273k', '6er', 5.6, '6er HR. 6 Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6273l', '6er', 6.2, '6er R. 6 Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6274a', '6er', 3.6, '6er HR. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6274b', '6er', 4.4, '6er R. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6274c', '6er', 5.1, '6er HR. 2er Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6274d', '6er', 6, '6er R. 2er Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6274e', '6er', 7, '6er HR. 6 Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6274f', '6er', 7.8, '6er R. 6 Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6281a', '6er', 1, '6er Querzug', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6281b', '6er', 1.4, '6er Querzug 2er Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6281c', '6er', 1.5, '6er Querzug 2er Rschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6281d', '6er', 1.6, '6er Querzug 6 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6282a', '6er', 2.1, '6er Querzug rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6282b', '6er', 2.8, '6er Querzug 2er Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6282c', '6er', 3, '6er Querzug 2er Rschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6282d', '6er', 3.2, '6er Querzug 6 Lschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6283a', '6er', 2.6, '6er Querzug Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6283b', '6er', 3.4, '6er Querzug Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6283c', '6er', 3.5, '6er Querzug 2er Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6283d', '6er', 4.1, '6er Querzug 2er Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6283e', '6er', 5, '6er Querzug 6 Lschl. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6283f', '6er', 5.2, '6er Querzug 6 Lschl. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6284a', '6er', 3.4, '6er Querzug Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6284b', '6er', 5, '6er Querzug 2er Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6284c', '6er', 6.8, '6er Querzug 6 Lschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6284d', '6er', 7.7, '6er Querzug 3 Lschl. 3 Rschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6284e', '6er', 10.2, '6er Querzug Dreh. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6291a', '6er', 1.1, 'Umfahrt 5er um 1', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6292a', '6er', 2.2, 'Umfahrt 5er um 1 rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6293a', '6er', 2.8, 'Umfahrt 5er um 1 Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6293b', '6er', 3.6, 'Umfahrt 5er um 1 Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6294a', '6er', 4.8, 'Umfahrt 5er um 1 Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6301a', '6er', 0.6, 'Kutsche HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6301b', '6er', 0.8, 'Kutsche R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6302a', '6er', 1.5, 'Kutsche HR. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6302b', '6er', 2, 'Kutsche R. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6311a', '6er', 0.6, 'Schlange HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6311b', '6er', 0.8, 'Schlange R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6316a', '6er', 0.6, 'Kette HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6316b', '6er', 0.8, 'Kette R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6317a', '6er', 2, 'Kette HR. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6317b', '6er', 2.6, 'Kette R. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6321a', '6er', 1, 'Sattelgriff HR.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6321b', '6er', 1.2, 'Sattelgriff R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6322a', '6er', 1.2, 'Sattelgriffdurchzug', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6323a', '6er', 0.8, 'Sattelgriffring', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6323b', '6er', 1.8, 'Sattelgriffring 6 Rschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6324a', '6er', 1.6, 'Sattelgriffring rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6324b', '6er', 2.6, 'Sattelgriffring rw. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6324c', '6er', 3, 'Sattelgriffring rw. an- u. abgef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6331a', '6er', 5.2, '2er Flügelmühle Gegentorfahrt außen glz. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6331b', '6er', 6.4, '2er Flügelmühle Gegentorfahrt glz. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6332a', '6er', 4.5, '2er Flügelmühle Gegentorfahrt außen glz. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6332b', '6er', 5, '2er Flügelmühle Gegentorfahrt außen glz. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6332c', '6er', 6, '2er Flügelmühle Gegentorfahrt glz. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6332d', '6er', 6.9, '2er Flügelmühle Gegentorfahrt glz. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6333a', '6er', 7.1, '2er Flügelmühle Gegentorfahrt außen glz. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6333b', '6er', 8.6, '2er Flügelmühle Gegentorfahrt glz. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6341a', '6er', 2.1, '3er Flügelmühle', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6341b', '6er', 2.8, '3er Flügelmühle HU. 6 Rschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6341c', '6er', 3.1, '3er Flügelmühle 6 Rschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6342a', '6er', 2.2, '3er Flügelmühle rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6342b', '6er', 3.2, '3er Flügelmühle rw. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6342c', '6er', 3.7, '3er Flügelmühle rw. an- u. abgef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6343a', '6er', 2.8, '3er Flügelmühle Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6343b', '6er', 3.1, '3er Flügelmühle Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6343c', '6er', 4.2, '3er Flügelmühle Stg. frh. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6343d', '6er', 4.7, '3er Flügelmühle Stg. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6343e', '6er', 5, '3er Flügelmühle Stg. frh. an- u. abgef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6343f', '6er', 5.5, '3er Flügelmühle Stg. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6344a', '6er', 3.8, '3er Flügelmühle Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6344b', '6er', 5.8, '3er Flügelmühle Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6344c', '6er', 6.8, '3er Flügelmühle Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6344d', '6er', 7.7, '3er Flügelmühle HU. Mühle mit 4 Rschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6344e', '6er', 8, '3er Flügelmühle HU. 6 Rschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6344f', '6er', 9.3, '3er Flügelmühle 6 Rschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6351a', '6er', 1.3, '2er Flügelmühle', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6351b', '6er', 1.7, '2er Flügelmühle HU. 2er Rschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6351c', '6er', 1.9, '2er Flügelmühle 2er Rschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6351d', '6er', 2.1, '2er Flügelmühle HU. 6 Rschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6351e', '6er', 2.4, '2er Flügelmühle 6 Rschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6352a', '6er', 1.6, '2er Flügelmühle rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6352b', '6er', 2.4, '2er Flügelmühle HU. 2er Rschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6352c', '6er', 3.1, '2er Flügelmühle 2er Rschl. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6352d', '6er', 2.6, '2er Flügelmühle rw. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6352e', '6er', 3, '2er Flügelmühle rw. an- u. abgef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6353a', '6er', 2, '2er Flügelmühle Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6353b', '6er', 2.6, '2er Flügelmühle Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6353c', '6er', 4.2, '2er Flügelmühle Stg. frh. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6353d', '6er', 4.2, '2er Flügelmühle Stg. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6353e', '6er', 4.4, '2er Flügelmühle Stg. frh. an- u. abgef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6353f', '6er', 4.9, '2er Flügelmühle Stg. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6354a', '6er', 3.4, '2er Flügelmühle Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6354b', '6er', 5.4, '2er Flügelmühle Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6354c', '6er', 6, '2er Flügelmühle Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6354d', '6er', 5.1, '2er Flügelmühle HU. Mühle mit 3 Rschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6354e', '6er', 4.1, '2er Flügelmühle HU. 2er Rschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6354f', '6er', 5.4, '2er Flügelmühle 2er Rschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6354g', '6er', 5.6, '2er Flügelmühle HU. 6 Rschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6354h', '6er', 6.6, '2er Flügelmühle HU. 6 Rschl. Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6354i', '6er', 7.2, '2er Flügelmühle HU. 6 Rschl. Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6354j', '6er', 6, '2er Flügelmühle 6 Rschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6354k', '6er', 7.5, '2er Flügelmühle 6 Rschl. Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6354l', '6er', 8.5, '2er Flügelmühle 6 Rschl. Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6363a', '6er', 2, '2er Flügelring Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6363b', '6er', 2.6, '2er Flügelring Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6363c', '6er', 3.7, '2er Flügelring Stg. frh. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6363d', '6er', 4.2, '2er Flügelring Stg. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6363e', '6er', 4.4, '2er Flügelring Stg. frh. an- u. abgef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6363f', '6er', 4.9, '2er Flügelring Stg. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6364a', '6er', 3.4, '2er Flügelring Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6364b', '6er', 5.4, '2er Flügelring Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6364c', '6er', 6.5, '2er Flügelring Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6371a', '6er', 3.7, '3er Flügelmühle Mühle mit 4 hinter. R. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6371b', '6er', 3.4, '3er Flügelring Innenring mit 4 hinter. R. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6372a', '6er', 3.4, '3er Flügelmühle Mühle mit 4 hinter. R. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6372b', '6er', 3.7, '3er Flügelmühle Mühle mit 4 hinter. R. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6372c', '6er', 3.5, '3er Flügelring Innenring mit 4 hinter. R. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6372d', '6er', 4.2, '3er Flügelring Innenring mit 4 hinter. R. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6373a', '6er', 6, '3er Flügelmühle Mühle mit 4 hinter. R. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6373b', '6er', 6.4, '3er Flügelring Innenring mit 4 hinter. R. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6375a', '6er', 1.7, '2er Flügelmühle Mühle mit 3 hinter. R.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6376a', '6er', 3.4, '2er Flügelmühle Mühle mit 3 hinter. R. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6377a', '6er', 3.8, '2er Flügelmühle Mühle mit 3 hinter. R. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6377b', '6er', 4.6, '2er Flügelmühle Mühle mit 3 hinter. R. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6377c', '6er', 3.9, '2er Flügelring Innenring mit 3 hinter. R. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6377d', '6er', 4.9, '2er Flügelring Innenring mit 3 hinter. R. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6378a', '6er', 5.3, '2er Flügelmühle Mühle mit 3 hinter. R. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6378b', '6er', 5.6, '2er Flügelring Innenring mit 3 hinter. R. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6378c', '6er', 8.2, '2er Flügelmühle HU. Mühle mit Dreh. Stg. rw. frh. T (9,0)', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6386a', '6er', 2, 'Mühle', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6386b', '6er', 2.6, 'Mühle 6 Rschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6387a', '6er', 3.1, 'Mühle rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6387b', '6er', 4, 'Mühle rw. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6387c', '6er', 4.5, 'Mühle rw. an- u. abgef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6388a', '6er', 2.6, 'Mühle Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6388b', '6er', 3.4, 'Mühle Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6388c', '6er', 4.4, 'Mühle Stg. frh. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6388d', '6er', 4.9, 'Mühle Stg. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6388e', '6er', 5.2, 'Mühle Stg. frh. an- u. abgef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6388f', '6er', 5.7, 'Mühle Stg. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6389a', '6er', 4.4, 'Mühle Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6389b', '6er', 6.5, 'Mühle Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6389c', '6er', 7, 'Mühle Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6389d', '6er', 8, 'Mühle 6 Rschl. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6389e', '6er', 9, 'Mühle 6 Rschl. Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6396a', '6er', 2.8, 'Innenring um 2 Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6396b', '6er', 4, 'Innenring um 2 Stg. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6396c', '6er', 4.7, 'Innenring um 2 Stg. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6396d', '6er', 6, 'Innenring um 2 gegenf. Stg. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6396e', '6er', 4.6, 'Innenring um 2 Stg. an- u. abgef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6396f', '6er', 5.5, 'Innenring um 2 Stg. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6396g', '6er', 6.8, 'Innenring um 2 gegenf. Stg. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6397a', '6er', 3.9, 'Innenring um 2 Stg. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6397b', '6er', 6.8, 'Innenring um 2 Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6397c', '6er', 8.1, 'Innenring um 2 gegenf. Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6397d', '6er', 7.8, 'Innenring um 2 Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6397e', '6er', 8.9, 'Innenring um 2 gegenf. Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6403a', '6er', 2.2, 'Innenring Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6403b', '6er', 3.4, 'Innenring Stg. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6403c', '6er', 3.9, 'Innenring Stg. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6403d', '6er', 4, 'Innenring Stg. an- u. abgef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6403e', '6er', 5.2, 'Innenring Stg. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6404a', '6er', 3.1, 'Innenring Stg. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6404b', '6er', 5.8, 'Innenring Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6404c', '6er', 6.3, 'Innenring Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6404d', '6er', 8, 'Innenring Stg. rw. angedr. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6404e', '6er', 8.5, 'Innenring Stg. rw. angedr. u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6412a', '6er', 2.7, 'Wechselring Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6412b', '6er', 4.1, 'Wechselring HU. / Innenring HU. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6412c', '6er', 3.9, 'Wechselring Stg. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6412d', '6er', 4.6, 'Wechselring Stg. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6412e', '6er', 4.5, 'Wechselring Stg. an- u. abgef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6412f', '6er', 5.9, 'Wechselring Stg. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6413a', '6er', 3.8, 'Wechselring Stg. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6413b', '6er', 5.7, 'Wechselring HU. / Innenring HU. Stg. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6413c', '6er', 6.6, 'Wechselring Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6413d', '6er', 7.7, 'Wechselring Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6413e', '6er', 8.8, 'Wechselring Stg. rw. angedr. u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6417a', '6er', 3, 'Außenring Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6417b', '6er', 4.2, 'Außenring Stg. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6417c', '6er', 5, 'Außenring Stg. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6417d', '6er', 4.8, 'Außenring Stg. an- u. abgef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6417e', '6er', 5.7, 'Außenring Stg. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6417f', '6er', 4.4, 'Außenring HU. / Innenring HU. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6418a', '6er', 4.2, 'Außenring Stg. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6418b', '6er', 7.1, 'Außenring Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6418c', '6er', 8.2, 'Außenring Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6418d', '6er', 6.2, 'Außenring HU. / Innenring HU. Stg. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6418e', '6er', 10.7, 'Außenring 6 Rschl. Stg. rw. an- u. abgef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6425a', '6er', 0.8, 'Halbe Torfahrt', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6425b', '6er', 1.2, 'Torfahrt', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6425c', '6er', 1.4, 'Halbe Synchrontorfahrt', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6425d', '6er', 2.8, 'Synchrontorfahrt', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6425e', '6er', 3.4, 'Gegentorfahrt glz.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6426a', '6er', 1.6, 'Halbe Torfahrt rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6426b', '6er', 2.4, 'Torfahrt rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6426c', '6er', 2.8, 'Halbe Synchrontorfahrt rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6426d', '6er', 3.6, 'Synchrontorfahrt rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6426e', '6er', 4.8, 'Gegentorfahrt glz. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6427a', '6er', 2, 'Halbe Torfahrt Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6427b', '6er', 3, 'Torfahrt Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6427c', '6er', 2.6, 'Halbe Torfahrt Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6427d', '6er', 3.9, 'Torfahrt Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6428a', '6er', 4.4, 'Halbe Torfahrt Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6428b', '6er', 5.1, 'Torfahrt Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6429a', '6er', 8.2, 'Gegentorfahrt glz. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6429b', '6er', 9.2, 'Mühle mit Gegentorfahrt glz. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6430a', '6er', 3, 'Halbe Synchrontorfahrt Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6430b', '6er', 4, 'Synchrontorfahrt Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6430c', '6er', 4.1, 'Halbe Synchrontorfahrt Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6430d', '6er', 4.9, 'Synchrontorfahrt Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6431a', '6er', 6, 'Halbe Synchrontorfahrt Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6431b', '6er', 6.7, 'Synchrontorfahrt Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6432a', '6er', 6, 'Gegentorfahrt glz. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6432b', '6er', 6.8, 'Gegentorfahrt glz. Stg. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6433a', '6er', 6, 'Mühle mit halber Synchrontorfahrt Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6433b', '6er', 7.2, 'Mühle mit Synchrontorfahrt Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6434a', '6er', 5.1, 'Mühle mit Synchrontorfahrt Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6434b', '6er', 6.6, 'Mühle mit Gegentorfahrt glz. Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6435a', '6er', 9.4, 'Schleifentorfahrt glz. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6436a', '6er', 1.4, 'Doppeltorfahrt', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6436b', '6er', 2, 'Synchrondoppeltorfahrt', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6437a', '6er', 3.8, 'Doppeltorfahrt rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6437b', '6er', 5.1, 'Schlangenbogendoppeltorfahrt rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6437c', '6er', 4.8, 'Synchrondoppeltorfahrt rw', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6438a', '6er', 7, 'Doppeltorfahrt Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6438b', '6er', 9.9, 'Turbine Doppeltorfahrt gegenf. Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6438c', '6er', 8.5, 'Synchrondoppeltorfahrt Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6441a', '6er', 7.7, 'Schlangenbogendoppeltorfahrt Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6442a', '6er', 5.2, 'Wschl. Torfahrt rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6443a', '6er', 9.6, 'Wschl. Torfahrt Stg. rw. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6452a', '6er', 3.5, 'Halber Torring Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6452b', '6er', 4.2, 'Torring Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6453a', '6er', 5.1, 'Halber Torring Stg. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6453b', '6er', 6.5, 'Torring Stg. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6462a', '6er', 2.7, 'Halber Doppeltorring Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6462b', '6er', 3.7, 'Doppeltorring Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6463a', '6er', 3.8, 'Halber Doppeltorring Stg. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6463b', '6er', 5.2, 'Doppeltorring Stg. rw.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6471a', '6er', 1.7, 'Innenstern', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6471b', '6er', 2.2, 'Innenstern 6 Lschl.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6472a', '6er', 3.2, 'Innenstern Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6472b', '6er', 4.2, 'Innenstern Stg. 2er angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6472c', '6er', 5.2, 'Innenstern Stg. 6er angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6472d', '6er', 5.4, 'Innenstern Stg. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6472e', '6er', 6, 'Innenstern Stg. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6472f', '6er', 9.2, 'Innenstern Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6472g', '6er', 10.6, 'Innenstern 6 Lschl. Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6472h', '6er', 11.2, 'Innenstern 6 Rschl. Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6481a', '6er', 1, 'Außenstern', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6481b', '6er', 3, 'Außenstern rw. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6481c', '6er', 4.1, 'Außenstern 6 Lschl. rw. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6482a', '6er', 1.4, 'Wechselstern', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6482b', '6er', 3.5, 'Wechselstern Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6482c', '6er', 4.7, 'Wechselstern Stg. angef.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6482d', '6er', 5.1, 'Wechselstern Stg. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6482e', '6er', 8, 'Wechselstern Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6483a', '6er', 2.5, 'Außenstern Stg.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6483b', '6er', 4.6, 'Außenstern Stg. rw. 2er angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6483c', '6er', 3.9, 'Außenstern Stg. rw. 6er angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6483d', '6er', 6.3, 'Außenstern Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6483e', '6er', 8.2, 'Außenstern 6 Lschl. Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6483f', '6er', 8.8, 'Außenstern 6 Rschl. Stg. rw. angef. frh.', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6485a', '6er', 6.2, 'Zwei Innensterne Stg. ½ Standdrehung', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6486a', '6er', 6.7, 'Innenstern Stg. ½ Standdrehung', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6486b', '6er', 9.7, 'Innenstern Stg. 1 Standdrehung', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6496a', '6er', 6, '2er Stg. ½ Standdrehung', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6496b', '6er', 7, '2er Stg. 1 Standdrehung', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6496c', '6er', 8, '2er Stg. 1½ Standdrehungen', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6496d', '6er', 9, '2er Stg. 2 Standdrehungen', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6496e', '6er', 6.5, '3er Stg. ½ Standdrehung', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6496f', '6er', 7.5, '3er Stg. 1 Standdrehung', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6496g', '6er', 8.5, '3er Stg. 1½ Standdrehungen', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6496h', '6er', 9.5, '3er Stg. 2 Standdrehungen', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6497a', '6er', 7.1, '6er Stg. ½ Standdrehung', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6497b', '6er', 8.1, '6er Stg. 1 Standdrehung', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6497c', '6er', 9.1, '6er Stg. 1½ Standdrehungen', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();
insert into public.uci_exercises (code, discipline, points, name_de, version)
  values ('6497d', '6er', 10.1, '6er Stg. 2 Standdrehungen', '2026')
  on conflict (code, version) do update set
    discipline = excluded.discipline, points = excluded.points, name_de = excluded.name_de, updated_at = now();

-- Verifizieren:
--   select code, name_de, name_de from public.uci_exercises where version = '2026' and name_de is not null limit 10;
--   select count(*) from public.uci_exercises where version = '2026' and name_de is not null;
--   -- erwartet: ~2034
