import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Trophy, Dumbbell, Plus, ChevronLeft, ChevronRight, Save, Check, X, Edit2, Trash2,
  Search, Info, Archive, AlertTriangle, ListChecks,
  Home, BarChart3, Users, Download, Sparkles, FileText, Lock,
  Settings as SettingsIcon, LogOut, Shield, User, RotateCcw,
  TrendingUp, Calendar, Target, Activity, FileSpreadsheet,
  Mail, KeyRound, UserCog, MessageCircle, Send, Loader2,
  Sun, Moon, SunMoon, Globe, Paperclip, Image as ImageIcon,
  Copy, ExternalLink, RefreshCw, MailCheck, Crown, UserX
} from 'lucide-react';
import { supabase, getCurrentProfile, fetchCloudSnapshot, pushCloudSnapshot, fetchAthletes, fetchProfiles, createAthlete, updateAthlete, deleteAthlete, generateClaimCodeForAthlete, clearClaimCodeForAthlete, redeemAthleteCode, migrateBlobToTables, fetchSessions, insertSession, updateSession, deleteSession, bulkInsertSessions, deleteSessionsByExercise, bulkUpdateSessions, fetchCompetitions, upsertCompetition, deleteCompetition, fetchPrograms, upsertProgram, deleteProgram, fetchExercises, upsertExercise, deleteExercise, isAppOwner, adminListUsers, adminResendConfirmation, adminSendMagicLink, adminSendPasswordReset, adminConfirmEmail, adminSetRole, adminSetDisplayName, adminUpdateEmail, adminDeleteUser, adminCreateImpersonation } from './lib/supabase';
import { useI18n, LANGUAGES, SUPPORTED_LANG_CODES, detectBrowserLang } from './lib/i18n.jsx';
import { submitFeedback, getFeedback, clearFeedback, buildFeedbackMailto, attachGlobalFeedbackBridge, pushFeedbackToCloud, fileToBase64 } from './lib/feedback.js';
import { parseProgramFile } from './lib/programImport.js';
import { loadUciExercisesFromDb, getRulesLanguage, fetchActiveNotices, dismissNotice, RULES_LANG_KEY, SUPPORTED_RULES_LANGS } from './lib/uciRules.js';

// =============================================================
// UCI 2026 Datenbank: Alle Disziplinen
// d = Disziplin: '1er', '2er', '4er', '6er'
// =============================================================
const UCI_DB_2026 = [
{c:'1001a',n:'Reitsitz HR.',p:0.5,d:'1er'},
{c:'1001b',n:'Reitsitz R.',p:0.7,d:'1er'},
{c:'1001c',n:'Reitsitz frh. HR.',p:0.7,d:'1er'},
{c:'1001d',n:'Reitsitz frh. R.',p:0.9,d:'1er'},
{c:'1002a',n:'Reitsitz rw. HR.',p:2.1,d:'1er'},
{c:'1002b',n:'Reitsitz rw. R.',p:2.3,d:'1er'},
{c:'1002c',n:'Reitsitz rw. frh. Lenkerdrehen Eschl.',p:3.0,d:'1er'},
{c:'1003a',n:'Kehrreitsitz HR.',p:1.2,d:'1er'},
{c:'1003b',n:'Kehrreitsitz R.',p:1.4,d:'1er'},
{c:'1004a',n:'Kehrreitsitz rw. HR.',p:1.9,d:'1er'},
{c:'1004b',n:'Kehrreitsitz rw. R.',p:2.1,d:'1er'},
{c:'1004c',n:'Kehrreitsitz rw. S',p:2.8,d:'1er'},
{c:'1004d',n:'Kehrreitsitz rw. 8',p:3.6,d:'1er'},
{c:'1004e',n:'Kehrreitsitz rw. frh. Lenkerdrehen Eschl.',p:3.6,d:'1er'},
{c:'1011a',n:'Fußsteuerung HR.',p:0.7,d:'1er'},
{c:'1011b',n:'Fußsteuerung R.',p:0.9,d:'1er'},
{c:'1011c',n:'Fußsteuerung frh. HR.',p:0.9,d:'1er'},
{c:'1011d',n:'Fußsteuerung frh. R.',p:1.1,d:'1er'},
{c:'1012a',n:'Damensitz HR.',p:0.8,d:'1er'},
{c:'1012b',n:'Damensitz R.',p:1.0,d:'1er'},
{c:'1012c',n:'Damensitz frh. HR.',p:1.2,d:'1er'},
{c:'1012d',n:'Damensitz frh. R.',p:1.4,d:'1er'},
{c:'1013a',n:'Damensitz rw. HR.',p:2.5,d:'1er'},
{c:'1013b',n:'Damensitz rw. R.',p:2.7,d:'1er'},
{c:'1016a',n:'Lenkersitz HR.',p:1.8,d:'1er'},
{c:'1016b',n:'Lenkersitz R.',p:2.0,d:'1er'},
{c:'1016c',n:'Lenkersitz frh. HR.',p:2.0,d:'1er'},
{c:'1016d',n:'Lenkersitz frh. R.',p:2.2,d:'1er'},
{c:'1016e',n:'Lenkersitz frh. S',p:2.6,d:'1er'},
{c:'1016f',n:'Lenkersitz frh. 8',p:3.4,d:'1er'},
{c:'1017a',n:'Kehrlenkersitz HR.',p:1.2,d:'1er'},
{c:'1017b',n:'Kehrlenkersitz R.',p:1.4,d:'1er'},
{c:'1017c',n:'Kehrlenkersitz frh. HR.',p:1.4,d:'1er'},
{c:'1017d',n:'Kehrlenkersitz frh. R.',p:1.6,d:'1er'},
{c:'1021a',n:'Reitstand HR.',p:0.9,d:'1er'},
{c:'1021b',n:'Reitstand R.',p:1.1,d:'1er'},
{c:'1021c',n:'Reitstand frh. HR.',p:1.1,d:'1er'},
{c:'1021d',n:'Reitstand frh. R.',p:1.3,d:'1er'},
{c:'1022a',n:'Reitstand rw. HR.',p:2.6,d:'1er'},
{c:'1022b',n:'Reitstand rw. R.',p:2.8,d:'1er'},
{c:'1023a',n:'Kehrreitstand HR.',p:1.3,d:'1er'},
{c:'1023b',n:'Kehrreitstand R.',p:1.5,d:'1er'},
{c:'1023c',n:'Kehrreitstand frh. HR.',p:1.5,d:'1er'},
{c:'1023d',n:'Kehrreitstand frh. R.',p:1.7,d:'1er'},
{c:'1024a',n:'Kehrreitstand rw. HR.',p:2.6,d:'1er'},
{c:'1024b',n:'Kehrreitstand rw. R.',p:2.8,d:'1er'},
{c:'1031a',n:'Frontstand HR.',p:1.8,d:'1er'},
{c:'1031b',n:'Frontstand R.',p:2.0,d:'1er'},
{c:'1031c',n:'Frontstand frh. HR.',p:2.0,d:'1er'},
{c:'1031d',n:'Frontstand frh. R.',p:2.2,d:'1er'},
{c:'1031e',n:'Frontstand frh. S',p:2.6,d:'1er'},
{c:'1031f',n:'Frontstand frh. 8',p:3.4,d:'1er'},
{c:'1032a',n:'Kehrstand HR.',p:2.0,d:'1er'},
{c:'1032b',n:'Kehrstand R.',p:2.2,d:'1er'},
{c:'1036a',n:'Seitpedalstand HR.',p:1.3,d:'1er'},
{c:'1036b',n:'Seitpedalstand R.',p:1.5,d:'1er'},
{c:'1037a',n:'Seitenstand Fußantrieb HR.',p:1.2,d:'1er'},
{c:'1037b',n:'Seitenstand Fußantrieb R.',p:1.4,d:'1er'},
{c:'1038a',n:'Seitenstand HR.',p:1.2,d:'1er'},
{c:'1038b',n:'Seitenstand R.',p:1.4,d:'1er'},
{c:'1038c',n:'Seitenstand frh. HR.',p:1.4,d:'1er'},
{c:'1038d',n:'Seitenstand frh. R.',p:1.6,d:'1er'},
{c:'1039a',n:'Kehrseitenstand HR.',p:1.6,d:'1er'},
{c:'1039b',n:'Kehrseitenstand R.',p:1.8,d:'1er'},
{c:'1039c',n:'Kehrseitenstand frh. HR.',p:1.8,d:'1er'},
{c:'1039d',n:'Kehrseitenstand frh. R.',p:2.0,d:'1er'},
{c:'1040a',n:'Seitknien Fußantrieb HR.',p:1.2,d:'1er'},
{c:'1040b',n:'Seitknien Fußantrieb R.',p:1.4,d:'1er'},
{c:'1041a',n:'Rahmensitz HR.',p:1.3,d:'1er'},
{c:'1041b',n:'Rahmensitz R.',p:1.5,d:'1er'},
{c:'1046a',n:'Dornenstand HR.',p:1.3,d:'1er'},
{c:'1046b',n:'Dornenstand R.',p:1.5,d:'1er'},
{c:'1046c',n:'Dornenstand frh. HR.',p:2.1,d:'1er'},
{c:'1046d',n:'Dornenstand frh. R.',p:2.3,d:'1er'},
{c:'1046e',n:'Dornenstand frh. S',p:2.7,d:'1er'},
{c:'1047a',n:'Dornbeugestand HR.',p:1.6,d:'1er'},
{c:'1047b',n:'Dornbeugestand R.',p:1.8,d:'1er'},
{c:'1047c',n:'Dornbeugestand frh. HR.',p:3.0,d:'1er'},
{c:'1047d',n:'Dornbeugestand frh. R.',p:3.2,d:'1er'},
{c:'1048a',n:'Dornbeugestand rw. HR.',p:3.0,d:'1er'},
{c:'1048b',n:'Dornbeugestand rw. R.',p:3.2,d:'1er'},
{c:'1051a',n:'Kniebeugesitz HR.',p:1.3,d:'1er'},
{c:'1051b',n:'Kniebeugesitz R.',p:1.5,d:'1er'},
{c:'1053a',n:'Sattelknien HR.',p:1.9,d:'1er'},
{c:'1053b',n:'Sattelknien R.',p:2.1,d:'1er'},
{c:'1054a',n:'Sattelknien rw. HR.',p:3.8,d:'1er'},
{c:'1054b',n:'Sattelknien rw. R.',p:4.0,d:'1er'},
{c:'1061a',n:'Sattelbeugestand HR.',p:1.7,d:'1er'},
{c:'1061b',n:'Sattelbeugestand R.',p:1.9,d:'1er'},
{c:'1062a',n:'Sattelbeugestand rw. HR.',p:3.4,d:'1er'},
{c:'1062b',n:'Sattelbeugestand rw. R.',p:3.6,d:'1er'},
{c:'1063a',n:'Rahmenbeugestand HR.',p:1.7,d:'1er'},
{c:'1063b',n:'Rahmenbeugestand R.',p:1.9,d:'1er'},
{c:'1064a',n:'Rahmenbeugestand rw. HR.',p:3.4,d:'1er'},
{c:'1064b',n:'Rahmenbeugestand rw. R.',p:3.6,d:'1er'},
{c:'1065a',n:'Kehrrahmenbeugestand HR.',p:2.1,d:'1er'},
{c:'1065b',n:'Kehrrahmenbeugestand R.',p:2.3,d:'1er'},
{c:'1066a',n:'Kehrlenkerbeugestand HR.',p:2.2,d:'1er'},
{c:'1066b',n:'Kehrlenkerbeugestand R.',p:2.3,d:'1er'},
{c:'1071a',n:'Kehrpedalseitstand HR.',p:1.2,d:'1er'},
{c:'1071b',n:'Kehrpedalseitstand R.',p:1.4,d:'1er'},
{c:'1076a',n:'Rahmenstand HR.',p:1.1,d:'1er'},
{c:'1076b',n:'Rahmenstand R.',p:1.3,d:'1er'},
{c:'1076c',n:'Rahmenstand frh. HR.',p:2.5,d:'1er'},
{c:'1076d',n:'Rahmenstand frh. R.',p:2.7,d:'1er'},
{c:'1076e',n:'Rahmenstand frh. S',p:3.1,d:'1er'},
{c:'1077a',n:'Kehrrahmenstand frh. HR.',p:3.1,d:'1er'},
{c:'1077b',n:'Kehrrahmenstand frh. R.',p:3.3,d:'1er'},
{c:'1081a',n:'Fronthang HR.',p:1.5,d:'1er'},
{c:'1081b',n:'Fronthang R.',p:2.1,d:'1er'},
{c:'1082a',n:'Fronthang rw. HR.',p:3.4,d:'1er'},
{c:'1083a',n:'Kehrhang HR.',p:1.3,d:'1er'},
{c:'1083b',n:'Kehrhang R.',p:1.5,d:'1er'},
{c:'1083c',n:'Kehrhang frh. HR.',p:1.5,d:'1er'},
{c:'1083d',n:'Kehrhang frh. R.',p:1.7,d:'1er'},
{c:'1084a',n:'Kehrhang rw. HR.',p:2.4,d:'1er'},
{c:'1091a',n:'Lenkerlage HR.',p:2.1,d:'1er'},
{c:'1091b',n:'Lenkerlage R.',p:2.3,d:'1er'},
{c:'1092a',n:'Sattellage HR.',p:1.3,d:'1er'},
{c:'1092b',n:'Sattellage R.',p:1.5,d:'1er'},
{c:'1092c',n:'Sattellenkerlage HR.',p:1.5,d:'1er'},
{c:'1092d',n:'Sattellenkerlage R.',p:1.7,d:'1er'},
{c:'1093a',n:'Wasserwaage unter dem Sattel HR.',p:1.6,d:'1er'},
{c:'1093b',n:'Wasserwaage unter dem Sattel R.',p:1.8,d:'1er'},
{c:'1093c',n:'Wasserwaage auf dem Sattel HR.',p:1.8,d:'1er'},
{c:'1093d',n:'Wasserwaage auf dem Sattel R.',p:2.0,d:'1er'},
{c:'1096a',n:'Vorderradlauf ¼ Runde',p:2.4,d:'1er'},
{c:'1101a',n:'Sattellenkerstand HR.',p:2.9,d:'1er'},
{c:'1101b',n:'Sattellenkerstand R.',p:3.1,d:'1er'},
{c:'1101c',n:'Sattellenkerstand S',p:3.6,d:'1er'},
{c:'1101d',n:'Sattellenkerstand 8',p:4.1,d:'1er'},
{c:'1102a',n:'Sattellenkerstand rw. HR.',p:6.5,d:'1er'},
{c:'1102b',n:'Sattellenkerstand rw. R.',p:6.9,d:'1er'},
{c:'1102c',n:'Sattellenkerstand rw. S',p:7.8,d:'1er'},
{c:'1102d',n:'Sattellenkerstand rw. 8',p:9.2,d:'1er'},
{c:'1103a',n:'Sattelstand HR.',p:5.7,d:'1er'},
{c:'1103b',n:'Sattelstand R.',p:6.1,d:'1er'},
{c:'1103c',n:'Sattelstand S',p:6.5,d:'1er'},
{c:'1103d',n:'Sattelstand 8',p:7.3,d:'1er'},
{c:'1104a',n:'Frontlenkerstand HR.',p:4.0,d:'1er'},
{c:'1104b',n:'Frontlenkerstand R.',p:4.2,d:'1er'},
{c:'1104c',n:'Frontlenkerstand S',p:4.7,d:'1er'},
{c:'1104d',n:'Frontlenkerstand 8',p:5.2,d:'1er'},
{c:'1104e',n:'Frontlenkerstand HR. aus Reitsitz',p:4.6,d:'1er'},
{c:'1104f',n:'Frontlenkerstand R. aus Reitsitz',p:4.8,d:'1er'},
{c:'1104g',n:'Frontlenkerstand S aus Reitsitz',p:5.3,d:'1er'},
{c:'1104h',n:'Frontlenkerstand 8 aus Reitsitz',p:5.8,d:'1er'},
{c:'1104i',n:'Frontlenkerstanddrehung ½-fach',p:5.1,d:'1er'},
{c:'1104j',n:'Frontlenkerstanddrehung 1-fach T (6,4 -',p:6.9,d:'1er'},
{c:'1104k',n:'Frontlenkerstanddrehung 1-½fach T (7,2 -',p:7.7,d:'1er'},
{c:'1104l',n:'Frontlenkerstanddrehung 2-fach T (8,0 -',p:8.5,d:'1er'},
{c:'1104m',n:'Frontlenkerstanddrehung ½-fach aus Reitsitz',p:5.7,d:'1er'},
{c:'1104p',n:'Frontlenkerstanddrehung 2-fach aus Reitsitz T',p:8.1,d:'1er'},
{c:'1105a',n:'Kehrlenkerstand HR.',p:4.4,d:'1er'},
{c:'1105b',n:'Kehrlenkerstand R.',p:4.6,d:'1er'},
{c:'1105c',n:'Kehrlenkerstand S',p:5.1,d:'1er'},
{c:'1105d',n:'Kehrlenkerstand 8',p:5.6,d:'1er'},
{c:'1111a',n:'Sattelstützwaage HR.',p:2.5,d:'1er'},
{c:'1111b',n:'Sattelstützwaage R.',p:3.1,d:'1er'},
{c:'1111c',n:'Sattelstützwaage S',p:3.5,d:'1er'},
{c:'1111d',n:'Sattelstützwaage 8',p:5.1,d:'1er'},
{c:'1112a',n:'Lenkerstützwaage HR.',p:2.5,d:'1er'},
{c:'1112b',n:'Lenkerstützwaage R.',p:3.1,d:'1er'},
{c:'1112c',n:'Lenkerstützwaage S',p:3.5,d:'1er'},
{c:'1112d',n:'Kehrlenkerdoppelstützwaage HR.',p:3.5,d:'1er'},
{c:'1112e',n:'Kehrlenkerdoppelstützwaage R.',p:4.2,d:'1er'},
{c:'1112f',n:'Kehrlenkerdoppelstützwaage S',p:4.6,d:'1er'},
{c:'1112g',n:'Kehrlenkerdoppelstützwaage 8',p:6.4,d:'1er'},
{c:'1112h',n:'Lenkerdoppelstützwaage HR.',p:4.1,d:'1er'},
{c:'1112i',n:'Lenkerdoppelstützwaage R.',p:4.8,d:'1er'},
{c:'1112j',n:'Lenkerdoppelstützwaage S',p:5.2,d:'1er'},
{c:'1115a',n:'Lenkervorhebehalte HR.',p:2.8,d:'1er'},
{c:'1115b',n:'Lenkervorhebehalte R.',p:3.2,d:'1er'},
{c:'1115c',n:'Lenkervorhebehalte S',p:3.6,d:'1er'},
{c:'1115d',n:'Lenkervorhebehalte 8',p:4.8,d:'1er'},
{c:'1116a',n:'Kehrlenkervorhebehalte HR.',p:3.2,d:'1er'},
{c:'1116b',n:'Kehrlenkervorhebehalte R.',p:3.6,d:'1er'},
{c:'1116c',n:'Kehrlenkervorhebehalte S',p:4.0,d:'1er'},
{c:'1116d',n:'Kehrlenkervorhebehalte 8',p:5.2,d:'1er'},
{c:'1117a',n:'Seitvorhebehalte HR.',p:3.8,d:'1er'},
{c:'1117b',n:'Seitvorhebehalte R.',p:4.4,d:'1er'},
{c:'1117c',n:'Seitvorhebehalte rw. HR.',p:6.5,d:'1er'},
{c:'1117d',n:'Seitvorhebehalte rw. R.',p:7.1,d:'1er'},
{c:'1118a',n:'Lenkerstützgrätsche HR.',p:3.3,d:'1er'},
{c:'1118b',n:'Lenkerstützgrätsche R.',p:3.9,d:'1er'},
{c:'1118c',n:'Sattelstützgrätsche HR.',p:4.2,d:'1er'},
{c:'1118d',n:'Sattelstützgrätsche R.',p:4.8,d:'1er'},
{c:'1121a',n:'Kopfstand HR.',p:4.4,d:'1er'},
{c:'1121b',n:'Kopfstand R.',p:4.6,d:'1er'},
{c:'1122a',n:'Schulterstand HR.',p:4.2,d:'1er'},
{c:'1122b',n:'Schulterstand R.',p:4.4,d:'1er'},
{c:'1123a',n:'Sattellenkerhandstand HR.',p:7.0,d:'1er'},
{c:'1123b',n:'Sattellenkerhandstand R.',p:7.8,d:'1er'},
{c:'1123c',n:'Sattellenkerhandstand S',p:8.6,d:'1er'},
{c:'1123d',n:'Sattellenkerhandstand 8',p:10.2,d:'1er'},
{c:'1123e',n:'Seitvorhebehalte Sattellenkerhandstand HR. T (9,8 -',p:10.4,d:'1er'},
{c:'1123f',n:'Seitvorhebehalte Sattellenkerhandstand R. T (10,6 -',p:11.2,d:'1er'},
{c:'1123g',n:'Seitvorhebehalte Sattellenkerhandstand S T (11,4 -',p:12.0,d:'1er'},
{c:'1123h',n:'Seitvorhebehalte Sattellenkerhandstand 8 T (13,0 -',p:13.6,d:'1er'},
{c:'1123i',n:'Seitvorhebehalte Schweizer Sattellenkerhandstand HR.',p:10.4,d:'1er'},
{c:'1123j',n:'Seitvorhebehalte Schweizer Sattellenkerhandstand R.',p:11.2,d:'1er'},
{c:'1123k',n:'Seitvorhebehalte Schweizer Sattellenkerhandstand S',p:12.0,d:'1er'},
{c:'1123l',n:'Seitvorhebehalte Schweizer Sattellenkerhandstand 8',p:13.6,d:'1er'},
{c:'1123m',n:'Seitvorhebehalte Deutscher Sattellenkerhandstand HR.',p:11.0,d:'1er'},
{c:'1123n',n:'Seitvorhebehalte Deutscher Sattellenkerhandstand R.',p:11.8,d:'1er'},
{c:'1123o',n:'Seitvorhebehalte Deutscher Sattellenkerhandstand S',p:12.6,d:'1er'},
{c:'1123p',n:'Seitvorhebehalte Deutscher Sattellenkerhandstand 8',p:14.2,d:'1er'},
{c:'1124a',n:'Lenkerhandstand HR.',p:7.2,d:'1er'},
{c:'1124b',n:'Lenkerhandstand R.',p:8.0,d:'1er'},
{c:'1124c',n:'Lenkerhandstand S',p:8.8,d:'1er'},
{c:'1124d',n:'Lenkerhandstand 8',p:10.4,d:'1er'},
{c:'1124e',n:'Vorhebehalte Lenkerhandstand HR. T (10,0 -',p:10.6,d:'1er'},
{c:'1124f',n:'Vorhebehalte Lenkerhandstand R. T (10,8 -',p:11.4,d:'1er'},
{c:'1124g',n:'Vorhebehalte Lenkerhandstand S T (11,6 -',p:12.2,d:'1er'},
{c:'1124h',n:'Vorhebehalte Lenkerhandstand 8 T (13,2 -',p:13.8,d:'1er'},
{c:'1124i',n:'Vorhebehalte Schweizer Lenkerhandstand HR.',p:10.6,d:'1er'},
{c:'1124j',n:'Vorhebehalte Schweizer Lenkerhandstand R.',p:11.4,d:'1er'},
{c:'1124k',n:'Vorhebehalte Schweizer Lenkerhandstand S',p:12.2,d:'1er'},
{c:'1124l',n:'Vorhebehalte Schweizer Lenkerhandstand 8',p:13.8,d:'1er'},
{c:'1124m',n:'Vorhebehalte Deutscher Lenkerhandstand HR.',p:11.2,d:'1er'},
{c:'1124n',n:'Vorhebehalte Deutscher Lenkerhandstand R.',p:12.0,d:'1er'},
{c:'1124o',n:'Vorhebehalte Deutscher Lenkerhandstand S',p:12.8,d:'1er'},
{c:'1124p',n:'Vorhebehalte Deutscher Lenkerhandstand 8',p:14.4,d:'1er'},
{c:'1124q',n:'Lenkerstützgrätsche Lenkerhandstand HR.',p:10.0,d:'1er'},
{c:'1124r',n:'Lenkerstützgrätsche Lenkerhandstand R.',p:10.8,d:'1er'},
{c:'1124s',n:'Lenkerstützgrätsche Lenkerhandstand S',p:11.6,d:'1er'},
{c:'1124t',n:'Lenkerstützgrätsche Lenkerhandstand 8',p:13.2,d:'1er'},
{c:'1141a',n:'Pedalstillstand',p:1.0,d:'1er'},
{c:'1141b',n:'Pedalstillstand frh.',p:1.2,d:'1er'},
{c:'1141c',n:'Pedalvorderradstillstand',p:1.3,d:'1er'},
{c:'1141d',n:'Pedalvorderradstillstand frh.',p:1.5,d:'1er'},
{c:'1151a',n:'Seitenstandwende',p:1.7,d:'1er'},
{c:'1156a',n:'Reitsitzhocke',p:1.7,d:'1er'},
{c:'1156b',n:'Reitsitzhocke rw.',p:3.1,d:'1er'},
{c:'1157a',n:'Fronthanghocke abgestoßen',p:1.8,d:'1er'},
{c:'1157b',n:'Fronthanghocke',p:2.0,d:'1er'},
{c:'1157c',n:'Fronthanghocke rw.',p:3.5,d:'1er'},
{c:'1158a',n:'Kehrhanghocke abgestoßen',p:1.7,d:'1er'},
{c:'1158b',n:'Kehrhanghocke',p:1.9,d:'1er'},
{c:'1158c',n:'Kehrhanghocke rw.',p:3.5,d:'1er'},
{c:'1159a',n:'Kehrlenkersitzhocke',p:1.7,d:'1er'},
{c:'1159b',n:'Kehrlenkersitzhocke rw.',p:2.9,d:'1er'},
{c:'1171a',n:'Kehrlenkersitzscherensprung',p:2.2,d:'1er'},
{c:'1171b',n:'Kehrhangscherensprung',p:2.6,d:'1er'},
{c:'1172a',n:'Drehsprung Seitenstand Kehrlenkersitz',p:2.0,d:'1er'},
{c:'1172b',n:'Drehsprung Reitsitz Kehrlenkersitz',p:2.3,d:'1er'},
{c:'1172c',n:'Drehsprung Kehrlenkersitz Reitsitz',p:2.3,d:'1er'},
{c:'1172d',n:'Drehsprung Reitsitz Kehrrahmenbeugestand',p:2.8,d:'1er'},
{c:'1172e',n:'Drehscherensprung',p:3.8,d:'1er'},
{c:'1173a',n:'Drehsprung Seitenstand Vorderradlauf',p:2.2,d:'1er'},
{c:'1173b',n:'Drehsprung Reitsitz Vorderradlauf',p:2.8,d:'1er'},
{c:'1174a',n:'Drehsprung Seitenstand Kehrhang',p:1.8,d:'1er'},
{c:'1174b',n:'Drehsprung Reitsitz Kehrhang',p:2.2,d:'1er'},
{c:'1174c',n:'Drehsprung Kehrhang Reitsitz',p:2.3,d:'1er'},
{c:'1175a',n:'Drehsprung 1-fach',p:4.8,d:'1er'},
{c:'1175b',n:'Drehsprung 2-fach T (7,5 -',p:8.2,d:'1er'},
{c:'1175c',n:'Drehsprung 3-fach T (9,5 -',p:10.2,d:'1er'},
{c:'1175d',n:'Drehsprung 4-fach T (10,7 -',p:11.4,d:'1er'},
{c:'1175e',n:'Drehsprung 5-fach T (11,8 -',p:12.5,d:'1er'},
{c:'1186a',n:'Maute Sprung',p:7.3,d:'1er'},
{c:'1201a',n:'Reitsitzsteiger HR.',p:2.4,d:'1er'},
{c:'1201b',n:'Reitsitzsteiger R.',p:2.6,d:'1er'},
{c:'1201c',n:'Reitsitzsteiger frh. HR.',p:2.5,d:'1er'},
{c:'1201d',n:'Reitsitzsteiger frh. R.',p:2.7,d:'1er'},
{c:'1201e',n:'Reitsitzsteiger einb. HR.',p:3.1,d:'1er'},
{c:'1201f',n:'Reitsitzsteiger einb. R.',p:3.3,d:'1er'},
{c:'1201g',n:'Reitsitzsteiger einb. frh. HR.',p:3.4,d:'1er'},
{c:'1201h',n:'Reitsitzsteiger einb. frh. R.',p:3.6,d:'1er'},
{c:'1202a',n:'Reitsitzsteiger rw. HR.',p:4.3,d:'1er'},
{c:'1202b',n:'Reitsitzsteiger rw. R.',p:4.5,d:'1er'},
{c:'1202c',n:'Reitsitzsteiger rw. frh. HR.',p:4.6,d:'1er'},
{c:'1202d',n:'Reitsitzsteiger rw. frh. R.',p:4.8,d:'1er'},
{c:'1202e',n:'Reitsitzsteiger rw. einb. HR.',p:5.7,d:'1er'},
{c:'1202f',n:'Reitsitzsteiger rw. einb. R.',p:6.5,d:'1er'},
{c:'1202g',n:'Reitsitzsteiger rw. einb. frh. HR.',p:6.7,d:'1er'},
{c:'1202h',n:'Reitsitzsteiger rw. einb. frh. R.',p:7.5,d:'1er'},
{c:'1202i',n:'Reitsitzsteiger Dreh. rw. frh.',p:5.3,d:'1er'},
{c:'1203a',n:'Kehrreitsitzsteiger frh. HR.',p:3.1,d:'1er'},
{c:'1203b',n:'Kehrreitsitzsteiger frh. R.',p:3.5,d:'1er'},
{c:'1203c',n:'Kehrreitsitzsteiger frh. S',p:3.9,d:'1er'},
{c:'1203d',n:'Kehrreitsitzsteiger frh. 8',p:5.1,d:'1er'},
{c:'1203e',n:'Kehrreitsitzsteiger einb. frh. HR.',p:3.9,d:'1er'},
{c:'1203f',n:'Kehrreitsitzsteiger einb. frh. R.',p:4.6,d:'1er'},
{c:'1203g',n:'Kehrreitsitzsteiger Dreh. frh.',p:5.7,d:'1er'},
{c:'1204a',n:'Kehrreitsitzsteiger rw. frh. HR.',p:4.8,d:'1er'},
{c:'1204b',n:'Kehrreitsitzsteiger rw. frh. R.',p:5.2,d:'1er'},
{c:'1204c',n:'Kehrreitsitzsteiger rw. frh. S',p:6.3,d:'1er'},
{c:'1204d',n:'Kehrreitsitzsteiger rw. frh. 8',p:7.8,d:'1er'},
{c:'1211a',n:'Damensitzsteiger HR.',p:3.1,d:'1er'},
{c:'1211b',n:'Damensitzsteiger R.',p:3.3,d:'1er'},
{c:'1211c',n:'Damensitzsteiger frh. HR.',p:3.4,d:'1er'},
{c:'1211d',n:'Damensitzsteiger frh. R.',p:3.6,d:'1er'},
{c:'1212a',n:'Damensitzsteiger rw. HR.',p:5.4,d:'1er'},
{c:'1212b',n:'Damensitzsteiger rw. R.',p:6.2,d:'1er'},
{c:'1212c',n:'Damensitzsteiger rw. frh. HR.',p:6.4,d:'1er'},
{c:'1212d',n:'Damensitzsteiger rw. frh. R.',p:7.2,d:'1er'},
{c:'1216a',n:'Dornstandsteiger HR.',p:3.0,d:'1er'},
{c:'1216b',n:'Dornstandsteiger R.',p:3.2,d:'1er'},
{c:'1216c',n:'Dornstandsteiger frh. HR.',p:3.3,d:'1er'},
{c:'1216d',n:'Dornstandsteiger frh. R.',p:3.5,d:'1er'},
{c:'1216e',n:'Seitenstandsteiger HR.',p:3.2,d:'1er'},
{c:'1216f',n:'Seitenstandsteiger R.',p:3.4,d:'1er'},
{c:'1216g',n:'Seitenstandsteiger frh. HR.',p:3.5,d:'1er'},
{c:'1216h',n:'Seitenstandsteiger frh. R.',p:3.7,d:'1er'},
{c:'1217a',n:'Dornstandsteiger rw. HR.',p:5.2,d:'1er'},
{c:'1217b',n:'Dornstandsteiger rw. R.',p:6.0,d:'1er'},
{c:'1217c',n:'Dornstandsteiger rw. frh. HR.',p:6.2,d:'1er'},
{c:'1217d',n:'Dornstandsteiger rw. frh. R.',p:7.0,d:'1er'},
{c:'1217e',n:'Dornstandsteiger Dreh. rw.',p:7.2,d:'1er'},
{c:'1217f',n:'Seitenstandsteiger rw. HR.',p:4.8,d:'1er'},
{c:'1217g',n:'Seitenstandsteiger rw. R.',p:5.6,d:'1er'},
{c:'1219a',n:'Kehrdornstandsteiger rw. HR.',p:3.9,d:'1er'},
{c:'1219b',n:'Kehrdornstandsteiger rw. R.',p:4.7,d:'1er'},
{c:'1219c',n:'Kehrseitenstandsteiger rw. HR.',p:4.2,d:'1er'},
{c:'1219d',n:'Kehrseitenstandsteiger rw. R.',p:5.0,d:'1er'},
{c:'1226a',n:'Lenkersitzsteiger HR.',p:2.5,d:'1er'},
{c:'1226b',n:'Lenkersitzsteiger R.',p:2.7,d:'1er'},
{c:'1226c',n:'Lenkersitzsteiger frh. HR.',p:2.6,d:'1er'},
{c:'1226d',n:'Lenkersitzsteiger frh. R.',p:2.8,d:'1er'},
{c:'1227a',n:'Lenkersitzsteiger rw. HR.',p:4.3,d:'1er'},
{c:'1227b',n:'Lenkersitzsteiger rw. R.',p:4.5,d:'1er'},
{c:'1227c',n:'Lenkersitzsteiger rw. frh. HR.',p:4.4,d:'1er'},
{c:'1227d',n:'Lenkersitzsteiger rw. frh. R.',p:4.6,d:'1er'},
{c:'1227e',n:'Lenkersitzsteiger Dreh. rw. frh.',p:5.1,d:'1er'},
{c:'1228a',n:'Kehrlenkersitzsteiger frh. HR.',p:3.0,d:'1er'},
{c:'1228b',n:'Kehrlenkersitzsteiger frh. R.',p:3.4,d:'1er'},
{c:'1228c',n:'Kehrlenkersitzsteiger frh. S',p:3.8,d:'1er'},
{c:'1228d',n:'Kehrlenkersitzsteiger frh. 8',p:5.0,d:'1er'},
{c:'1228e',n:'Kehrlenkersitzsteiger Dreh. frh.',p:5.5,d:'1er'},
{c:'1229a',n:'Kehrlenkersitzsteiger rw. frh. HR.',p:4.8,d:'1er'},
{c:'1229b',n:'Kehrlenkersitzsteiger rw. frh. R.',p:5.2,d:'1er'},
{c:'1229c',n:'Kehrlenkersitzsteiger rw. frh. S',p:5.9,d:'1er'},
{c:'1229d',n:'Kehrlenkersitzsteiger rw. frh. 8',p:7.4,d:'1er'},
{c:'1236a',n:'Steuerrohrsteiger frh. HR.',p:2.6,d:'1er'},
{c:'1236b',n:'Steuerrohrsteiger frh. R.',p:2.8,d:'1er'},
{c:'1236c',n:'Steuerrohrsteiger einb. frh. HR.',p:3.0,d:'1er'},
{c:'1236d',n:'Steuerrohrsteiger einb. frh. R.',p:3.2,d:'1er'},
{c:'1236e',n:'Steuerrohrsteiger Dreh. frh.',p:5.1,d:'1er'},
{c:'1237a',n:'Steuerrohrsteiger rw. frh. HR.',p:4.4,d:'1er'},
{c:'1237b',n:'Steuerrohrsteiger rw. frh. R.',p:4.6,d:'1er'},
{c:'1237c',n:'Steuerrohrsteiger Dreh. rw. frh.',p:5.1,d:'1er'},
{c:'1238a',n:'Kehrsteuerrohrsteiger frh. HR.',p:3.0,d:'1er'},
{c:'1238b',n:'Kehrsteuerrohrsteiger frh. R.',p:3.4,d:'1er'},
{c:'1238c',n:'Kehrsteuerrohrsteiger Dreh. frh.',p:5.5,d:'1er'},
{c:'1239a',n:'Kehrsteuerrohrsteiger rw. frh. HR.',p:4.8,d:'1er'},
{c:'1239b',n:'Kehrsteuerrohrsteiger rw. frh. R.',p:5.2,d:'1er'},
{c:'1246a',n:'Standsteiger HR.',p:4.0,d:'1er'},
{c:'1246b',n:'Standsteiger R.',p:4.6,d:'1er'},
{c:'1247a',n:'Standsteiger rw. HR.',p:5.3,d:'1er'},
{c:'1247b',n:'Standsteiger rw. R.',p:5.9,d:'1er'},
{c:'1247c',n:'Standsteiger Dreh. rw.',p:6.5,d:'1er'},
{c:'1248a',n:'Kehrstandsteiger HR.',p:4.2,d:'1er'},
{c:'1248b',n:'Kehrstandsteiger R.',p:4.8,d:'1er'},
{c:'1248c',n:'Kehrstandsteiger Dreh.',p:6.5,d:'1er'},
{c:'1249a',n:'Kehrstandsteiger rw. HR.',p:5.5,d:'1er'},
{c:'1249b',n:'Kehrstandsteiger rw. R.',p:6.1,d:'1er'},
{c:'1249c',n:'Kehrstandsteiger rw. S',p:6.8,d:'1er'},
{c:'1249d',n:'Kehrstandsteiger rw. 8',p:8.8,d:'1er'},
{c:'1281a',n:'Übergang Fronthang Steuerrohrsteiger',p:5.0,d:'1er'},
{c:'1281b',n:'Übergang Steuerrohrsteiger Fronthang',p:2.4,d:'1er'},
{c:'1282a',n:'Übergang Fronthang Kehrstandsteiger',p:7.0,d:'1er'},
{c:'1282b',n:'Übergang Kehrstandsteiger Fronthang',p:3.0,d:'1er'},
{c:'1283a',n:'Übergang Reitsitzsteiger Lenkersitzsteiger',p:3.1,d:'1er'},
{c:'1283b',n:'Übergang Lenkersitzsteiger Reitsitzsteiger',p:2.1,d:'1er'},
{c:'1284a',n:'Übergang Reitsitzsteiger Steuerrohrsteiger',p:5.3,d:'1er'},
{c:'1284b',n:'Übergang Steuerrohrsteiger Reitsitzsteiger',p:4.3,d:'1er'},
{c:'1285a',n:'Übergang Reitsitzsteiger Kehrstandsteiger',p:6.4,d:'1er'},
{c:'1285b',n:'Übergang Kehrstandsteiger Reitsitzsteiger',p:4.7,d:'1er'},
{c:'1286a',n:'Übergang Lenkersitzsteiger Steuerrohrsteiger',p:3.6,d:'1er'},
{c:'1286b',n:'Übergang Steuerrohrsteiger Lenkersitzsteiger',p:2.7,d:'1er'},
{c:'1287a',n:'Übergang Steuerrohrsteiger Kehrstandsteiger',p:4.1,d:'1er'},
{c:'1287b',n:'Übergang Kehrstandsteiger Steuerrohrsteiger',p:1.9,d:'1er'},
{c:'1288a',n:'Übergang Kehrhang Kehrsteuerrohrsteiger',p:3.7,d:'1er'},
{c:'1288b',n:'Übergang Kehrsteuerrohrsteiger Kehrhang',p:1.4,d:'1er'},
{c:'1289a',n:'Übergang Kehrhang Standsteiger',p:6.1,d:'1er'},
{c:'1289b',n:'Übergang Standsteiger Kehrhang',p:2.4,d:'1er'},
{c:'1290a',n:'Übergang Kehrreitsitz Kehrlenkersitzsteiger',p:5.1,d:'1er'},
{c:'1290b',n:'Übergang Kehrlenkersitzsteiger Kehrreitsitz',p:1.7,d:'1er'},
{c:'1291a',n:'Übergang Kehrlenkersitzsteiger Standsteiger',p:6.8,d:'1er'},
{c:'1291b',n:'Übergang Standsteiger Kehrlenkersitzsteiger',p:5.1,d:'1er'},
{c:'1292a',n:'Übergang Kehrsteuerrohrsteiger Kehrlenkersitzsteiger',p:3.9,d:'1er'},
{c:'1292b',n:'Übergang Kehrlenkersitzsteiger Kehrsteuerrohrsteiger',p:5.8,d:'1er'},
{c:'1293a',n:'Übergang Standsteiger Kehrsteuerrohrsteiger',p:1.8,d:'1er'},
{c:'1293b',n:'Übergang Kehrsteuerrohrsteiger Standsteiger',p:3.6,d:'1er'},
{c:'2001a',n:'Reitsitz HR.',p:0.4,d:'2er'},
{c:'2001b',n:'Reitsitz R.',p:0.5,d:'2er'},
{c:'2001c',n:'Reitsitz frh. HR.',p:0.8,d:'2er'},
{c:'2001d',n:'Reitsitz frh. R.',p:0.9,d:'2er'},
{c:'2001e',n:'Reitsitz Mühle',p:0.5,d:'2er'},
{c:'2001f',n:'Reitsitz Mühle frh.',p:0.9,d:'2er'},
{c:'2001g',n:'Reitsitz Mühle Eschl. frh.',p:1.5,d:'2er'},
{c:'2002a',n:'Reitsitz rw. HR.',p:0.8,d:'2er'},
{c:'2002b',n:'Reitsitz rw. R.',p:1.0,d:'2er'},
{c:'2002c',n:'Reitsitz Eschl rw.',p:2.4,d:'2er'},
{c:'2004a',n:'Reitsitz Mühle rw.',p:0.9,d:'2er'},
{c:'2004b',n:'Reitsitz Mühle Eschl rw.',p:2.0,d:'2er'},
{c:'2005a',n:'Kehrreitsitz HR.',p:0.7,d:'2er'},
{c:'2005b',n:'Kehrreitsitz R.',p:0.8,d:'2er'},
{c:'2005c',n:'Kehrreitsitz frh. HR.',p:1.1,d:'2er'},
{c:'2005d',n:'Kehrreitsitz frh. R.',p:1.2,d:'2er'},
{c:'2011a',n:'Fußsteuerung HR.',p:0.8,d:'2er'},
{c:'2011b',n:'Fußsteuerung R.',p:0.9,d:'2er'},
{c:'2011c',n:'Fußsteuerung frh. HR.',p:1.0,d:'2er'},
{c:'2011d',n:'Fußsteuerung frh. R.',p:1.2,d:'2er'},
{c:'2012a',n:'Damensitz HR.',p:0.7,d:'2er'},
{c:'2012b',n:'Damensitz R.',p:0.8,d:'2er'},
{c:'2012c',n:'Damensitz frh. HR.',p:1.1,d:'2er'},
{c:'2012d',n:'Damensitz frh. R.',p:1.2,d:'2er'},
{c:'2013a',n:'Damensitz rw. HR.',p:1.4,d:'2er'},
{c:'2013b',n:'Damensitz rw. R.',p:1.5,d:'2er'},
{c:'2021a',n:'Lenkersitz HR.',p:1.8,d:'2er'},
{c:'2021b',n:'Lenkersitz R.',p:2.0,d:'2er'},
{c:'2021c',n:'Lenkersitz frh. HR.',p:2.0,d:'2er'},
{c:'2021d',n:'Lenkersitz frh. R.',p:2.2,d:'2er'},
{c:'2022a',n:'Kehrlenkersitz HR.',p:0.9,d:'2er'},
{c:'2022b',n:'Kehrlenkersitz R.',p:1.0,d:'2er'},
{c:'2022c',n:'Kehrlenkersitz frh. HR.',p:1.3,d:'2er'},
{c:'2022d',n:'Kehrlenkersitz frh. R.',p:1.5,d:'2er'},
{c:'2026a',n:'Reitstand HR.',p:0.7,d:'2er'},
{c:'2026b',n:'Reitstand R.',p:0.8,d:'2er'},
{c:'2026c',n:'Reitstand frh. HR.',p:1.1,d:'2er'},
{c:'2026d',n:'Reitstand frh. R.',p:1.2,d:'2er'},
{c:'2027a',n:'Kehrreitstand HR.',p:1.3,d:'2er'},
{c:'2027b',n:'Kehrreitstand R.',p:1.5,d:'2er'},
{c:'2027c',n:'Kehrreitstand frh. HR.',p:1.5,d:'2er'},
{c:'2027d',n:'Kehrreitstand frh. R.',p:1.7,d:'2er'},
{c:'2031a',n:'Frontstand HR.',p:1.8,d:'2er'},
{c:'2031b',n:'Frontstand R.',p:2.0,d:'2er'},
{c:'2031c',n:'Frontstand frh. HR.',p:2.0,d:'2er'},
{c:'2031d',n:'Frontstand frh. R.',p:2.2,d:'2er'},
{c:'2036a',n:'Seitenstand Fußantrieb HR.',p:0.9,d:'2er'},
{c:'2036b',n:'Seitenstand Fußantrieb R.',p:1.0,d:'2er'},
{c:'2037a',n:'Seitenstand HR.',p:0.8,d:'2er'},
{c:'2037b',n:'Seitenstand R.',p:1.0,d:'2er'},
{c:'2037c',n:'Seitenstand frh. HR.',p:1.2,d:'2er'},
{c:'2037d',n:'Seitenstand frh. R.',p:1.4,d:'2er'},
{c:'2046a',n:'Dornenstand HR.',p:0.8,d:'2er'},
{c:'2046b',n:'Dornenstand R.',p:1.0,d:'2er'},
{c:'2046c',n:'Dornenstand frh. HR.',p:1.7,d:'2er'},
{c:'2046d',n:'Dornenstand frh. R.',p:1.9,d:'2er'},
{c:'2047a',n:'Dornbeugestand HR.',p:1.1,d:'2er'},
{c:'2047b',n:'Dornbeugestand R.',p:1.2,d:'2er'},
{c:'2047c',n:'Dornbeugestand frh. HR.',p:1.9,d:'2er'},
{c:'2047d',n:'Dornbeugestand frh. R.',p:2.1,d:'2er'},
{c:'2051a',n:'Kniebeugesitz HR.',p:1.2,d:'2er'},
{c:'2051b',n:'Kniebeugesitz R.',p:1.3,d:'2er'},
{c:'2052a',n:'Sattelknien HR.',p:1.2,d:'2er'},
{c:'2052b',n:'Sattelknien R.',p:1.3,d:'2er'},
{c:'2061a',n:'Sattellage HR.',p:1.1,d:'2er'},
{c:'2061b',n:'Sattellage R.',p:1.2,d:'2er'},
{c:'2061c',n:'Sattellenkerlage HR.',p:1.9,d:'2er'},
{c:'2061d',n:'Sattellenkerlage R.',p:2.1,d:'2er'},
{c:'2062a',n:'Wasserwaage unter dem Sattel HR.',p:1.5,d:'2er'},
{c:'2062b',n:'Wasserwaage unter dem Sattel R.',p:1.7,d:'2er'},
{c:'2062c',n:'Wasserwaage auf dem Sattel HR.',p:2.2,d:'2er'},
{c:'2062d',n:'Wasserwaage auf dem Sattel R.',p:2.4,d:'2er'},
{c:'2066a',n:'Rahmenstand HR.',p:1.1,d:'2er'},
{c:'2066b',n:'Rahmenstand frh. HR.',p:1.9,d:'2er'},
{c:'2066c',n:'Rahmenstand frh. R.',p:2.1,d:'2er'},
{c:'2067a',n:'Sattellenkerstand Einzeln HR.',p:2.9,d:'2er'},
{c:'2067b',n:'Sattellenkerstand Einzeln R.',p:3.3,d:'2er'},
{c:'2067c',n:'Sattellenkerstand HR.',p:2.9,d:'2er'},
{c:'2067d',n:'Sattellenkerstand R.',p:3.3,d:'2er'},
{c:'2067e',n:'Sattellenkerstand Eschl.',p:3.9,d:'2er'},
{c:'2067f',n:'Sattellenkerstand Gg-8',p:4.4,d:'2er'},
{c:'2068a',n:'Sattellenkerstand rw. Einzeln HR.',p:5.8,d:'2er'},
{c:'2068b',n:'Sattellenkerstand rw. Einzeln R.',p:6.4,d:'2er'},
{c:'2069a',n:'Sattelstand Einzeln HR.',p:4.2,d:'2er'},
{c:'2069b',n:'Sattelstand Einzeln R.',p:4.5,d:'2er'},
{c:'2069c',n:'Sattelstand HR.',p:4.1,d:'2er'},
{c:'2069d',n:'Sattelstand R.',p:4.3,d:'2er'},
{c:'2069e',n:'Sattelstand Eschl.',p:5.8,d:'2er'},
{c:'2069f',n:'Sattelstand Gg-8',p:6.7,d:'2er'},
{c:'2070a',n:'Frontlenkerstand Einzeln HR.',p:3.7,d:'2er'},
{c:'2070b',n:'Frontlenkerstand Einzeln R.',p:3.9,d:'2er'},
{c:'2070c',n:'Frontlenkerstand HR.',p:3.7,d:'2er'},
{c:'2070d',n:'Frontlenkerstand R.',p:3.9,d:'2er'},
{c:'2070e',n:'Frontlenkerstand Eschl.',p:4.8,d:'2er'},
{c:'2070f',n:'Frontlenkerstand Gg-8',p:5.4,d:'2er'},
{c:'2070g',n:'Frontlenkerstanddrehung ½-fach',p:6.8,d:'2er'},
{c:'2070h',n:'Frontlenkerstanddrehung 1-fach T (8,0 -',p:8.5,d:'2er'},
{c:'2070i',n:'Frontlenkerstanddrehung 1½-fach T (8,8 -',p:9.3,d:'2er'},
{c:'2070j',n:'Frontlenkerstanddrehung 2-fach T (9,5 -',p:10.0,d:'2er'},
{c:'2070k',n:'Gg. Runde Frontlenkerstanddrehung ½-fach',p:6.5,d:'2er'},
{c:'2071a',n:'Kehrlenkerstand Einzeln HR.',p:3.9,d:'2er'},
{c:'2071b',n:'Kehrlenkerstand Einzeln R.',p:4.1,d:'2er'},
{c:'2071c',n:'Kehrlenkerstand HR.',p:3.9,d:'2er'},
{c:'2071d',n:'Kehrlenkerstand R.',p:4.1,d:'2er'},
{c:'2071e',n:'Kehrlenkerstand Eschl.',p:5.0,d:'2er'},
{c:'2071f',n:'Kehrlenkerstand Gg-8',p:5.7,d:'2er'},
{c:'2073a',n:'Kopfstand Einzeln HR.',p:4.4,d:'2er'},
{c:'2073b',n:'Kopfstand Einzeln R.',p:4.6,d:'2er'},
{c:'2074a',n:'Schulterstand Einzeln HR.',p:4.2,d:'2er'},
{c:'2074b',n:'Schulterstand Einzeln R.',p:4.4,d:'2er'},
{c:'2076a',n:'Sattellenkerhandstand Einzeln HR.',p:9.2,d:'2er'},
{c:'2076b',n:'Sattellenkerhandstand Einzeln R.',p:9.6,d:'2er'},
{c:'2076c',n:'Sattellenkerhandstand Gg-8',p:11.4,d:'2er'},
{c:'2076f',n:'Seitvorhebehalte Sattellenkerhandstand Gg-8 T (14,2 -',p:14.8,d:'2er'},
{c:'2076g',n:'Seitvorhebehalte Schweizer Sattellenkerhandstand Einzeln HR.',p:12.6,d:'2er'},
{c:'2076h',n:'Seitvorhebehalte Schweizer Sattellenkerhandstand Einzeln R.',p:13.0,d:'2er'},
{c:'2076i',n:'Seitvorhebehalte Schweizer Sattellenkerhandstand Gg-8',p:14.8,d:'2er'},
{c:'2076j',n:'Seitvorhabehalte Deutscher Sattellenkerhandstand Einzeln HR.',p:13.2,d:'2er'},
{c:'2076k',n:'Seitvorhabehalte Deutscher Sattellenkerhandstand Einzeln R.',p:13.6,d:'2er'},
{c:'2076l',n:'Seitvorhabehalte Deutscher Sattellenkerhandstand Gg-8',p:15.4,d:'2er'},
{c:'2077a',n:'Lenkerhandstand Einzeln HR.',p:9.1,d:'2er'},
{c:'2077b',n:'Lenkerhandstand Einzeln R.',p:9.5,d:'2er'},
{c:'2077c',n:'Lenkerhandstand Gg-8',p:11.3,d:'2er'},
{c:'2077d',n:'Vorhebehalte Lenkerhandstand Einzeln HR. T (11,9 -',p:12.5,d:'2er'},
{c:'2077e',n:'Vorhebehalte Lenkerhandstand Einzeln R. T (12,3 -',p:12.9,d:'2er'},
{c:'2077f',n:'Vorhebehalte Lenkerhandstand Gg-8 T (14,1 -',p:14.7,d:'2er'},
{c:'2077g',n:'Vorhebehalte Schweizer Lenkerhandstand Einzeln HR.',p:12.5,d:'2er'},
{c:'2077h',n:'Vorhebehalte Schweizer Lenkerhandstand Einzeln R.',p:12.9,d:'2er'},
{c:'2077i',n:'Vorhebehalte Schweizer Lenkerhandstand Gg-8',p:14.7,d:'2er'},
{c:'2077j',n:'Vorhebehalte Deutscher Lenkerhandstand Einzeln HR.',p:13.1,d:'2er'},
{c:'2077k',n:'Vorhebehalte Deutscher Lenkerhandstand Einzeln R.',p:13.5,d:'2er'},
{c:'2077l',n:'Vorhebehalte Deutscher Lenkerhandstand Gg-8',p:15.3,d:'2er'},
{c:'2077m',n:'Lenkerstützgrätsche Lenkerhandstand Einzeln HR.',p:11.9,d:'2er'},
{c:'2077n',n:'Lenkerstützgrätsche Lenkerhandstand Einzeln R.',p:12.3,d:'2er'},
{c:'2077o',n:'Lenkerstützgrätsche Lenkerhandstand Gg-8',p:14.1,d:'2er'},
{c:'2091a',n:'Pedalstillstand',p:0.8,d:'2er'},
{c:'2091b',n:'Pedalstillstand frh.',p:1.2,d:'2er'},
{c:'2091c',n:'Pedalvorderradstillstand',p:1.1,d:'2er'},
{c:'2091d',n:'Pedalvorderradstillstand frh.',p:1.6,d:'2er'},
{c:'2131a',n:'Reitsitzsteiger HR.',p:1.5,d:'2er'},
{c:'2131b',n:'Reitsitzsteiger R.',p:1.7,d:'2er'},
{c:'2131c',n:'Reitsitzsteiger frh. HR.',p:1.9,d:'2er'},
{c:'2131d',n:'Reitsitzsteiger frh. R.',p:2.1,d:'2er'},
{c:'2131e',n:'Reitsitzsteiger Eschl.',p:3.1,d:'2er'},
{c:'2131f',n:'Reitsitzsteiger Eschl. frh.',p:3.6,d:'2er'},
{c:'2132a',n:'Reitsitzsteiger rw. frh. HR.',p:2.3,d:'2er'},
{c:'2132b',n:'Reitsitzsteiger rw. frh. R.',p:2.5,d:'2er'},
{c:'2132c',n:'Reitsitzsteiger Eschl. rw. frh.',p:4.5,d:'2er'},
{c:'2133a',n:'Reitsitzsteiger Mühle',p:1.6,d:'2er'},
{c:'2133b',n:'Reitsitzsteiger Mühle frh.',p:2.0,d:'2er'},
{c:'2133c',n:'Reitsitzsteiger Mühle Eschl.',p:2.7,d:'2er'},
{c:'2133d',n:'Reitsitzsteiger Mühle Eschl. frh.',p:3.3,d:'2er'},
{c:'2134a',n:'Reitsitzsteiger Mühle rw. frh.',p:2.3,d:'2er'},
{c:'2134b',n:'Reitsitzsteiger Mühle Eschl. rw. frh.',p:4.1,d:'2er'},
{c:'2134c',n:'Reitsitzsteiger Mühle Dreh. rw. frh.',p:5.5,d:'2er'},
{c:'2135a',n:'Kehrreitsitzsteiger frh. HR.',p:2.3,d:'2er'},
{c:'2135b',n:'Kehrreitsitzsteiger frh. R.',p:2.5,d:'2er'},
{c:'2135c',n:'Kehrreitsitzsteiger Eschl. frh.',p:4.7,d:'2er'},
{c:'2136a',n:'Kehrreitsitzsteiger rw. frh. HR.',p:2.9,d:'2er'},
{c:'2136b',n:'Kehrreitsitzsteiger rw. frh. R.',p:3.1,d:'2er'},
{c:'2136c',n:'Kehrreitsitzsteiger Eschl. rw. frh.',p:5.7,d:'2er'},
{c:'2137a',n:'Kehrreitsitzsteiger Mühle frh.',p:2.4,d:'2er'},
{c:'2137b',n:'Kehrreitsitzsteiger Mühle Eschl. frh.',p:4.3,d:'2er'},
{c:'2137c',n:'Kehrreitsitzsteiger Mühle Dreh. frh.',p:6.0,d:'2er'},
{c:'2138a',n:'Kehrreitsitzsteiger Mühle rw. frh.',p:2.9,d:'2er'},
{c:'2138b',n:'Kehrreitsitzsteiger Mühle Eschl. rw. frh.',p:5.3,d:'2er'},
{c:'2147a',n:'Damensitzsteiger Eschl. rw. frh.',p:6.6,d:'2er'},
{c:'2151a',n:'Dornstandsteiger HR.',p:2.2,d:'2er'},
{c:'2151b',n:'Dornstandsteiger R.',p:2.4,d:'2er'},
{c:'2152a',n:'Dornstandsteiger Eschl. rw.',p:5.4,d:'2er'},
{c:'2154a',n:'Dornstandsteiger Mühle Eschl. rw.',p:5.0,d:'2er'},
{c:'2161a',n:'Lenkersitzsteiger HR.',p:1.7,d:'2er'},
{c:'2161b',n:'Lenkersitzsteiger R.',p:1.9,d:'2er'},
{c:'2161c',n:'Lenkersitzsteiger frh. HR.',p:2.1,d:'2er'},
{c:'2161d',n:'Lenkersitzsteiger frh. R.',p:2.3,d:'2er'},
{c:'2161e',n:'Lenkersitzsteiger Eschl. frh.',p:3.8,d:'2er'},
{c:'2162a',n:'Lenkersitzsteiger rw. frh. HR.',p:2.5,d:'2er'},
{c:'2162b',n:'Lenkersitzsteiger rw. frh. R.',p:2.7,d:'2er'},
{c:'2162c',n:'Lenkersitzsteiger Eschl. rw. frh.',p:4.7,d:'2er'},
{c:'2163a',n:'Lenkersitzsteiger Mühle',p:1.8,d:'2er'},
{c:'2163b',n:'Lenkersitzsteiger Mühle frh.',p:2.2,d:'2er'},
{c:'2163c',n:'Lenkersitzsteiger Mühle Eschl. frh.',p:3.4,d:'2er'},
{c:'2164a',n:'Lenkersitzsteiger Mühle rw. frh.',p:2.9,d:'2er'},
{c:'2164b',n:'Lenkersitzsteiger Mühle Eschl. rw. frh.',p:4.3,d:'2er'},
{c:'2164c',n:'Lenkersitzsteiger Mühle Dreh. rw. frh.',p:5.5,d:'2er'},
{c:'2165a',n:'Kehrlenkersitzsteiger frh. HR.',p:2.3,d:'2er'},
{c:'2165b',n:'Kehrlenkersitzsteiger frh. R.',p:2.5,d:'2er'},
{c:'2165c',n:'Kehrlenkersitzsteiger Eschl. frh.',p:4.4,d:'2er'},
{c:'2166a',n:'Kehrlenkersitzsteiger rw. frh. HR.',p:2.8,d:'2er'},
{c:'2166b',n:'Kehrlenkersitzsteiger rw. frh. R.',p:3.0,d:'2er'},
{c:'2166c',n:'Kehrlenkersitzsteiger Eschl. rw. frh.',p:5.0,d:'2er'},
{c:'2167a',n:'Kehrlenkersitzsteiger Mühle frh.',p:2.4,d:'2er'},
{c:'2167b',n:'Kehrlenkersitzsteiger Mühle Eschl. frh.',p:4.0,d:'2er'},
{c:'2167c',n:'Kehrlenkersitzsteiger Mühle Dreh. frh.',p:5.6,d:'2er'},
{c:'2168a',n:'Kehrlenkersitzsteiger Mühle rw. frh.',p:3.2,d:'2er'},
{c:'2168b',n:'Kehrlenkersitzsteiger Mühle Eschl. rw. frh.',p:4.8,d:'2er'},
{c:'2176a',n:'Steuerrohrsteiger frh. HR.',p:1.6,d:'2er'},
{c:'2176b',n:'Steuerrohrsteiger frh R.',p:1.8,d:'2er'},
{c:'2176c',n:'Steuerrohrsteiger Eschl. frh.',p:3.2,d:'2er'},
{c:'2177a',n:'Steuerrohrsteiger rw. frh. HR.',p:2.1,d:'2er'},
{c:'2177b',n:'Steuerrohrsteiger rw. frh. R.',p:2.3,d:'2er'},
{c:'2177c',n:'Steuerrohrsteiger Eschl. rw. frh.',p:4.1,d:'2er'},
{c:'2178a',n:'Steuerrohrsteiger Mühle frh.',p:1.8,d:'2er'},
{c:'2178b',n:'Steuerrohrsteiger Mühle Eschl. frh.',p:2.7,d:'2er'},
{c:'2179a',n:'Steuerrohrsteiger Mühle rw. frh.',p:2.1,d:'2er'},
{c:'2179b',n:'Steuerrohrsteiger Mühle Eschl. rw. frh.',p:3.7,d:'2er'},
{c:'2179c',n:'Steuerrohrsteiger Mühle Dreh. rw. frh.',p:5.0,d:'2er'},
{c:'2180a',n:'Kehrsteuerrohrsteiger frh. HR.',p:2.4,d:'2er'},
{c:'2180b',n:'Kehrsteuerrohrsteiger frh. R.',p:2.6,d:'2er'},
{c:'2180c',n:'Kehrsteuerrohrsteiger Eschl. frh.',p:4.2,d:'2er'},
{c:'2181a',n:'Kehrsteuerrohrsteiger rw. frh. HR.',p:2.9,d:'2er'},
{c:'2181b',n:'Kehrsteuerrohrsteiger rw. frh. R.',p:3.1,d:'2er'},
{c:'2181c',n:'Kehrsteuerrohrsteiger Eschl. rw. frh.',p:5.1,d:'2er'},
{c:'2182a',n:'Kehrsteuerrohrsteiger Mühle frh.',p:2.5,d:'2er'},
{c:'2182b',n:'Kehrsteuerrohrsteiger Mühle Eschl. frh.',p:3.8,d:'2er'},
{c:'2182c',n:'Kehrsteuerrohrsteiger Mühle Dreh. frh.',p:5.9,d:'2er'},
{c:'2183a',n:'Kehrsteuerrohrsteiger Mühle rw. frh.',p:3.0,d:'2er'},
{c:'2183b',n:'Kehrsteuerrohrsteiger Mühle Eschl. rw. frh.',p:4.7,d:'2er'},
{c:'2191a',n:'Standsteiger HR.',p:2.6,d:'2er'},
{c:'2191b',n:'Standsteiger R.',p:2.8,d:'2er'},
{c:'2191c',n:'Standsteiger Eschl.',p:4.4,d:'2er'},
{c:'2192a',n:'Standsteiger rw. HR.',p:2.9,d:'2er'},
{c:'2192b',n:'Standsteiger rw. R.',p:3.1,d:'2er'},
{c:'2192c',n:'Standsteiger Eschl. rw.',p:4.9,d:'2er'},
{c:'2193a',n:'Standsteiger Mühle',p:2.7,d:'2er'},
{c:'2193b',n:'Standsteiger Mühle Eschl.',p:4.0,d:'2er'},
{c:'2194a',n:'Standsteiger Mühle rw.',p:2.9,d:'2er'},
{c:'2194b',n:'Standsteiger Mühle Eschl. rw.',p:4.5,d:'2er'},
{c:'2194c',n:'Standsteiger Mühle Dreh. rw.',p:5.9,d:'2er'},
{c:'2195a',n:'Kehrstandsteiger HR.',p:2.9,d:'2er'},
{c:'2195b',n:'Kehrstandsteiger R.',p:3.1,d:'2er'},
{c:'2195c',n:'Kehrstandsteiger Eschl.',p:4.7,d:'2er'},
{c:'2196a',n:'Kehrstandsteiger rw. HR.',p:3.2,d:'2er'},
{c:'2196b',n:'Kehrstandsteiger rw. R.',p:3.4,d:'2er'},
{c:'2196c',n:'Kehrstandsteiger Eschl. rw.',p:5.4,d:'2er'},
{c:'2197a',n:'Kehrstandsteiger Mühle',p:3.0,d:'2er'},
{c:'2197b',n:'Kehrstandsteiger Mühle Eschl.',p:4.3,d:'2er'},
{c:'2197c',n:'Kehrstandsteiger Mühle Dreh.',p:6.3,d:'2er'},
{c:'2198a',n:'Kehrstandsteiger Mühle rw.',p:3.2,d:'2er'},
{c:'2198b',n:'Kehrstandsteiger Mühle Eschl rw.',p:5.0,d:'2er'},
{c:'2211a',n:'Lenkersitzsteiger 1 Standdrehung',p:4.6,d:'2er'},
{c:'2211b',n:'Lenkersitzsteiger 2 Standdrehungen T (6,8 -',p:7.3,d:'2er'},
{c:'2211c',n:'Lenkersitzsteiger 3 Standdrehungen T (7,8)',p:7.2,d:'2er'},
{c:'2212a',n:'Kehrlenkersitzsteiger 1 Standdrehung',p:4.9,d:'2er'},
{c:'2212b',n:'Kehrlenkersitzsteiger 2 Standdrehungen T (7,0 -',p:7.5,d:'2er'},
{c:'2212c',n:'Kehrlenkersitzsteiger 3 Standdrehungen T (8,1)',p:7.5,d:'2er'},
{c:'2213a',n:'Steuerrohrsteiger 1 Standdrehung',p:4.4,d:'2er'},
{c:'2213b',n:'Steuerrohrsteiger 2 Standdrehungen T (6,5 -',p:7.0,d:'2er'},
{c:'2213c',n:'Steuerrohrsteiger 3 Standdrehungen T (7,6)',p:7.0,d:'2er'},
{c:'2214a',n:'Kehrsteuerrohrsteiger 1 Standdrehung',p:4.9,d:'2er'},
{c:'2214b',n:'Kehrsteuerrohrsteiger 2 Standdrehungen T (7,0 -',p:7.5,d:'2er'},
{c:'2214c',n:'Kehrsteuerrohrsteiger 3 Standdrehungen T (8,1)',p:7.5,d:'2er'},
{c:'2215a',n:'Standsteiger 1 Standdrehung',p:5.2,d:'2er'},
{c:'2215b',n:'Standsteiger 2 Standdrehungen T (7,4 -',p:7.9,d:'2er'},
{c:'2215c',n:'Standsteiger 3 Standdrehungen T (8,4)',p:7.8,d:'2er'},
{c:'2216a',n:'Kehrstandsteiger 1 Standdrehung',p:5.5,d:'2er'},
{c:'2216b',n:'Kehrstandsteiger 2 Standdrehungen T (7,7 -',p:8.2,d:'2er'},
{c:'2216c',n:'Kehrstandsteiger 3 Standdrehungen T (8,7)',p:8.1,d:'2er'},
{c:'2236a',n:'Übergang Reitsitzsteiger Lenkersitzsteiger',p:1.9,d:'2er'},
{c:'2236b',n:'Übergang Lenkersitzsteiger Reitsitzsteiger',p:1.9,d:'2er'},
{c:'2237a',n:'Übergang Reitsitzsteiger Steuerrohrsteiger',p:2.9,d:'2er'},
{c:'2237b',n:'Übergang Steuerrohrsteiger Reitsitzsteiger',p:2.9,d:'2er'},
{c:'2238a',n:'Übergang Lenkersitzsteiger Steuerrohrsteiger',p:2.4,d:'2er'},
{c:'2238b',n:'Übergang Steuerrohrsteiger Lenkersitzsteiger',p:2.4,d:'2er'},
{c:'2239a',n:'Übergang Steuerrohrsteiger Kehrstandsteiger',p:2.1,d:'2er'},
{c:'2239b',n:'Übergang Kehrstandsteiger Steuerrohrsteiger',p:2.1,d:'2er'},
{c:'2240a',n:'Übergang Standsteiger Kehrsteuerrohrsteiger',p:2.1,d:'2er'},
{c:'2240b',n:'Übergang Kehrsteuerrohrsteiger Standsteiger',p:2.2,d:'2er'},
{c:'2241a',n:'Übergang Kehrsteuerrohrsteiger Kehrlenkersitzsteiger',p:3.4,d:'2er'},
{c:'2241b',n:'Übergang Kehrlenkersitzsteiger Kehrsteuerrohrsteiger',p:3.5,d:'2er'},
{c:'2242a',n:'Übergang Kehrhang Standsteiger einzeln',p:5.7,d:'2er'},
{c:'2243a',n:'Übergang Kehrhang Kehrsteuerrohrsteiger einzeln',p:4.6,d:'2er'},
{c:'2250a',n:'Kehrlenkerstand Salto rw. gehockt',p:12.1,d:'2er'},
{c:'2261a',n:'Reitsitz / Dornenstand HR.',p:0.3,d:'2er'},
{c:'2261b',n:'Reitsitz / Dornenstand R.',p:0.4,d:'2er'},
{c:'2261c',n:'Reitsitz / Sattelstand HR.',p:0.7,d:'2er'},
{c:'2261d',n:'Reitsitz / Sattelstand R.',p:0.9,d:'2er'},
{c:'2266a',n:'Reitsitz / Schultersitz HR.',p:0.7,d:'2er'},
{c:'2266b',n:'Reitsitz / Schultersitz R.',p:0.9,d:'2er'},
{c:'2266c',n:'Reitsitz frh. / Schultersitz HR.',p:1.6,d:'2er'},
{c:'2266d',n:'Reitsitz frh. / Schultersitz R.',p:1.9,d:'2er'},
{c:'2267a',n:'Reitsitz rw. / Schultersitz HR.',p:1.9,d:'2er'},
{c:'2267b',n:'Reitsitz rw. / Schultersitz R.',p:2.2,d:'2er'},
{c:'2268a',n:'Reitsitz / Schulterstand HR.',p:2.0,d:'2er'},
{c:'2268b',n:'Reitsitz / Schulterstand R.',p:2.3,d:'2er'},
{c:'2268c',n:'Reitsitz frh. / Schulterstand HR.',p:3.0,d:'2er'},
{c:'2268d',n:'Reitsitz frh. / Schulterstand R.',p:3.4,d:'2er'},
{c:'2269a',n:'Reitsitz rw. / Schulterstand HR.',p:3.7,d:'2er'},
{c:'2269b',n:'Reitsitz rw. / Schulterstand R.',p:4.1,d:'2er'},
{c:'2270a',n:'Reitsitz / Brustschwebehang HR.',p:1.3,d:'2er'},
{c:'2270b',n:'Reitsitz / Brustschwegehang R.',p:1.5,d:'2er'},
{c:'2270c',n:'Reitsitz frh. / Brustschwebehang HR.',p:2.1,d:'2er'},
{c:'2270d',n:'Reitsitz frh. / Brustschwebehang R.',p:2.4,d:'2er'},
{c:'2271a',n:'Reitsitz rw. / Brustschwebehang HR.',p:2.3,d:'2er'},
{c:'2271b',n:'Reitsitz rw. / Brustschwegehang R.',p:2.6,d:'2er'},
{c:'2276a',n:'Reitsitz / Lenkerstand HR.',p:1.2,d:'2er'},
{c:'2276b',n:'Reitsitz / Lenkerstand R.',p:1.3,d:'2er'},
{c:'2277a',n:'Reitsitz / Lenkerhandstand HR.',p:5.0,d:'2er'},
{c:'2277b',n:'Reitsitz / Lenkerhandstand R.',p:5.4,d:'2er'},
{c:'2277c',n:'Reitsitz / Lenkerstützgrätsche Lenkerhandstand HR.',p:6.5,d:'2er'},
{c:'2277d',n:'Reitsitz / Lenkerstützgrätsche Lenkerhandstand R.',p:6.9,d:'2er'},
{c:'2281a',n:'Kehrreitsitz / Schultersitz HR.',p:1.1,d:'2er'},
{c:'2281b',n:'Kehrreitsitz / Schultersitz R.',p:1.3,d:'2er'},
{c:'2282a',n:'Kehrreitsitz rw. / Schultersitz HR.',p:1.9,d:'2er'},
{c:'2282b',n:'Kehrreitsitz rw. / Schultersitz R.',p:2.1,d:'2er'},
{c:'2283a',n:'Kehrreitsitz / Schulterstand HR.',p:2.7,d:'2er'},
{c:'2283b',n:'Kehrreitsitz / Schulterstand R.',p:3.0,d:'2er'},
{c:'2285a',n:'Kehrreitsitz / Brustschwebehang HR.',p:1.7,d:'2er'},
{c:'2285b',n:'Kehrreitsitz / Brustschwebehang R.',p:1.9,d:'2er'},
{c:'2286a',n:'Kehrreitsitz rw. / Brustschwebehang HR.',p:2.5,d:'2er'},
{c:'2286b',n:'Kehrreitsitz rw. / Brustschwebehang R.',p:2.7,d:'2er'},
{c:'2296a',n:'Lenkersitz / Dornenstand HR.',p:1.1,d:'2er'},
{c:'2296b',n:'Lenkersitz / Dornenstand R.',p:1.2,d:'2er'},
{c:'2296c',n:'Lenkersitz frh. / Dornenstand HR.',p:1.6,d:'2er'},
{c:'2296d',n:'Lenkersitz frh. / Dornenstand R.',p:1.8,d:'2er'},
{c:'2296e',n:'Lenkersitz / Sattelstand HR.',p:1.8,d:'2er'},
{c:'2296f',n:'Lenkersitz / Sattelstand R.',p:2.0,d:'2er'},
{c:'2296g',n:'Lenkersitz frh. / Sattelstand HR.',p:2.3,d:'2er'},
{c:'2296h',n:'Lenkersitz frh. / Sattelstand R.',p:2.5,d:'2er'},
{c:'2301a',n:'Kehrlenkersitz / Dornenstand HR.',p:0.8,d:'2er'},
{c:'2301b',n:'Kehrlenkersitz / Dornenstand R.',p:0.9,d:'2er'},
{c:'2301c',n:'Kehrlenkersitz frh. / Dornenstand HR.',p:1.3,d:'2er'},
{c:'2301d',n:'Kehrlenkersitz frh. / Dornenstand R.',p:1.4,d:'2er'},
{c:'2302a',n:'Kehrlenkersitz / Sattellenkerstand HR.',p:1.3,d:'2er'},
{c:'2302b',n:'Kehrlenkersitz / Sattellenkerstand R.',p:1.4,d:'2er'},
{c:'2302c',n:'Kehrlenkersitz frh. / Sattellenkerstand HR.',p:1.8,d:'2er'},
{c:'2302d',n:'Kehrlenkersitz frh. / Sattellenkerstand R.',p:1.9,d:'2er'},
{c:'2302e',n:'Kehrlenkersitz / Sattelstand HR.',p:1.4,d:'2er'},
{c:'2302f',n:'Kehrlenkersitz / Sattelstand R.',p:1.7,d:'2er'},
{c:'2302g',n:'Kehrlenkersitz frh. / Sattelstand HR.',p:2.0,d:'2er'},
{c:'2302h',n:'Kehrlenkersitz frh. / Sattelstand R.',p:2.3,d:'2er'},
{c:'2303a',n:'Kehrlenkersitz / Schultersitz HR.',p:1.3,d:'2er'},
{c:'2303b',n:'Kehrlenkersitz / Schultersitz R.',p:1.5,d:'2er'},
{c:'2303c',n:'Kehrlenkersitz frh. / Schultersitz HR.',p:1.9,d:'2er'},
{c:'2303d',n:'Kehrlenkersitz frh. / Schultersitz R.',p:2.2,d:'2er'},
{c:'2304a',n:'Kehrlenkersitz / Schulterstand HR.',p:2.9,d:'2er'},
{c:'2304b',n:'Kehrlenkersitz / Schulterstand R.',p:3.2,d:'2er'},
{c:'2304c',n:'Kehrlenkersitz frh. / Schulterstand HR.',p:3.6,d:'2er'},
{c:'2304d',n:'Kehrlenkersitz frh. / Schulterstand R.',p:3.9,d:'2er'},
{c:'2305a',n:'Kehrlenkersitz / Brustschwebehang HR.',p:1.8,d:'2er'},
{c:'2305b',n:'Kehrlenkersitz / Brustschwebehang R.',p:2.0,d:'2er'},
{c:'2305c',n:'Kehrlenkersitz frh. / Brustschwebehang HR.',p:2.4,d:'2er'},
{c:'2305d',n:'Kehrlenkersitz frh. / Brustschwebehang R.',p:2.6,d:'2er'},
{c:'2306a',n:'Kehrlenkersitz / Kopfstand HR.',p:2.7,d:'2er'},
{c:'2306b',n:'Kehrlenkersitz / Kopfstand R.',p:2.9,d:'2er'},
{c:'2311a',n:'Frontstand / Dornenstand HR.',p:0.9,d:'2er'},
{c:'2311b',n:'Frontstand / Dornenstand R.',p:1.0,d:'2er'},
{c:'2311c',n:'Frontstand frh. / Dornenstand HR.',p:1.4,d:'2er'},
{c:'2311d',n:'Frontstand frh. / Dornenstand R.',p:1.6,d:'2er'},
{c:'2311e',n:'Frontstand / Sattelstand HR.',p:1.6,d:'2er'},
{c:'2311f',n:'Frontstand / Sattelstand R.',p:1.8,d:'2er'},
{c:'2311g',n:'Frontstand frh. / Sattelstand HR.',p:2.1,d:'2er'},
{c:'2311h',n:'Frontstand frh. / Sattelstand R.',p:2.3,d:'2er'},
{c:'2316a',n:'Reitstand / Schultersitz HR.',p:1.0,d:'2er'},
{c:'2316b',n:'Reitstand / Schultersitz R.',p:1.2,d:'2er'},
{c:'2316c',n:'Reitstand frh. / Schultersitz HR.',p:1.6,d:'2er'},
{c:'2316d',n:'Reitstand frh. / Schultersitz R.',p:1.8,d:'2er'},
{c:'2317a',n:'Seitenstand / Seitenstand Ringf. HR.',p:1.4,d:'2er'},
{c:'2317b',n:'Seitenstand / Seitenstand Ringf. R.',p:1.6,d:'2er'},
{c:'2319a',n:'Sattelbeugestand / Kehrlenkerbeugestand HR.',p:1.8,d:'2er'},
{c:'2319b',n:'Sattelbeugestand / Kehrlenkerbeugestand R.',p:2.0,d:'2er'},
{c:'2321a',n:'Rahmensitz / Sattelbeugestand HR.',p:1.1,d:'2er'},
{c:'2321b',n:'Rahmensitz / Sattelbeugestand R.',p:1.2,d:'2er'},
{c:'2322a',n:'Rahmensitz / Sattellenkerstand HR.',p:1.5,d:'2er'},
{c:'2322b',n:'Rahmensitz / Sattellenkerstand R.',p:1.7,d:'2er'},
{c:'2322c',n:'Rahmensitz / Sattelstand HR.',p:1.8,d:'2er'},
{c:'2322d',n:'Rahmensitz / Sattelstand R.',p:2.0,d:'2er'},
{c:'2323a',n:'Rahmensitz / Sattelstützwaage HR.',p:2.4,d:'2er'},
{c:'2323b',n:'Rahmensitz / Sattelstützwaage R.',p:2.8,d:'2er'},
{c:'2331a',n:'Fronthang / Sattelbeugestand HR.',p:1.0,d:'2er'},
{c:'2331b',n:'Fronthang / Sattelbeugestand R.',p:1.2,d:'2er'},
{c:'2332a',n:'Fronthang / Sattellenkerstand HR.',p:1.5,d:'2er'},
{c:'2332b',n:'Fronthang / Sattellenkerstand R.',p:1.7,d:'2er'},
{c:'2332c',n:'Fronthang / Sattelstand HR.',p:1.8,d:'2er'},
{c:'2332d',n:'Fronthang / Sattelstand R.',p:2.0,d:'2er'},
{c:'2334a',n:'Fronthang / Kopfstand HR.',p:2.8,d:'2er'},
{c:'2334b',n:'Fronthang / Kopfstand R.',p:3.0,d:'2er'},
{c:'2334c',n:'Fronthang / Sattellenkerhandstand HR.',p:6.1,d:'2er'},
{c:'2334d',n:'Fronthang / Sattellenkerhandstand R.',p:6.5,d:'2er'},
{c:'2341a',n:'Kehrhang / Dornenstand HR.',p:0.9,d:'2er'},
{c:'2341b',n:'Kehrhang / Dornenstand R.',p:1.0,d:'2er'},
{c:'2342a',n:'Kehrhang / Sattellenkerstand HR.',p:1.4,d:'2er'},
{c:'2342b',n:'Kehrhang / Sattellenkerstand R.',p:1.5,d:'2er'},
{c:'2342c',n:'Kehrhang / Sattelstand HR.',p:1.7,d:'2er'},
{c:'2342d',n:'Kehrhang / Sattelstand R.',p:1.9,d:'2er'},
{c:'2343a',n:'Kehrhang / Lenkerstand HR.',p:1.8,d:'2er'},
{c:'2343b',n:'Kehrhang / Lenkerstand R.',p:1.9,d:'2er'},
{c:'2346a',n:'Kehrhang / Kopfstand HR.',p:2.7,d:'2er'},
{c:'2346b',n:'Kehrhang / Kopfstand R.',p:2.9,d:'2er'},
{c:'2346c',n:'Kehrhang / Sattellenkerhandstand HR.',p:6.1,d:'2er'},
{c:'2346d',n:'Kehrhang / Sattellenkerhandstand R.',p:6.5,d:'2er'},
{c:'2351a',n:'Lenkerlage / Sattelbeugestand HR.',p:1.3,d:'2er'},
{c:'2351b',n:'Lenkerlage / Sattelbeugestand R.',p:1.5,d:'2er'},
{c:'2351c',n:'Lenkerlage / Sattelstand HR.',p:2.2,d:'2er'},
{c:'2351d',n:'Lenkerlage / Sattelstand R.',p:2.4,d:'2er'},
{c:'2352a',n:'Sattellage / Lenkerstand HR.',p:1.9,d:'2er'},
{c:'2352b',n:'Sattellage / Lenkerstand R.',p:2.0,d:'2er'},
{c:'2352c',n:'Sattellage / Lenkerhandstand HR.',p:5.5,d:'2er'},
{c:'2352d',n:'Sattellage / Lenkerhandstand R.',p:5.9,d:'2er'},
{c:'2353a',n:'Wasserwaage / Sattelbeugestand HR.',p:1.5,d:'2er'},
{c:'2353b',n:'Wasserwaage / Sattelbeugestand R.',p:1.6,d:'2er'},
{c:'2353c',n:'Wasserwaage / Sattelstand HR.',p:2.2,d:'2er'},
{c:'2353d',n:'Wasserwaage / Sattelstand R.',p:2.4,d:'2er'},
{c:'2356a',n:'Sattellenkerstand / Sattellenkerstand HR.',p:3.0,d:'2er'},
{c:'2356b',n:'Sattellenkerstand / Sattellenkerstand R.',p:3.2,d:'2er'},
{c:'2356c',n:'Sattellenkerstand / Sattellenkerstand S',p:3.6,d:'2er'},
{c:'2356d',n:'Sattellenkerstand / Sattellenkerstand 8',p:4.1,d:'2er'},
{c:'2357a',n:'Sattellenkerstand / Dornenstand HR.',p:2.5,d:'2er'},
{c:'2357b',n:'Sattellenkerstand / Dornenstand R.',p:2.6,d:'2er'},
{c:'2357c',n:'Sattellenkerstand / Sattelstand HR.',p:3.1,d:'2er'},
{c:'2357d',n:'Sattellenkerstand / Sattelstand R.',p:3.2,d:'2er'},
{c:'2357e',n:'Sattellenkerstand / Lenkerstand HR.',p:3.7,d:'2er'},
{c:'2357f',n:'Sattellenkerstand / Lenkerstand R.',p:3.8,d:'2er'},
{c:'2358a',n:'Lenkerstand / Dornenstand HR.',p:3.2,d:'2er'},
{c:'2358b',n:'Lenkerstand / Dornenstand R.',p:3.4,d:'2er'},
{c:'2358c',n:'Lenkerstanddrehung ½-fach / Dornenstand',p:5.9,d:'2er'},
{c:'2358g',n:'Lenkerstand aus Reitsitz / Dornenstand HR.',p:4.0,d:'2er'},
{c:'2358h',n:'Lenkerstand aus Reitsitz / Dornenstand R.',p:4.1,d:'2er'},
{c:'2358i',n:'Lenkerstanddrehung aus Reitsitz ½-fach / Dornenstand',p:6.7,d:'2er'},
{c:'2359a',n:'Lenkerstand / Sattelstand Ringf. HR.',p:3.6,d:'2er'},
{c:'2359b',n:'Lenkerstand / Sattelstand Ringf. R.',p:3.7,d:'2er'},
{c:'2359c',n:'Lenkerstand / Sattelstand HR.',p:4.9,d:'2er'},
{c:'2359d',n:'Lenkerstand / Sattelstand R.',p:5.1,d:'2er'},
{c:'2359e',n:'Lenkerstand / Sattelstand S',p:5.6,d:'2er'},
{c:'2359f',n:'Lenkerstand / Sattelstand 8',p:6.1,d:'2er'},
{c:'2366a',n:'Lenkervorhebehalte / Dornenstand HR.',p:3.0,d:'2er'},
{c:'2366b',n:'Lenkervorhebehalte / Dornenstand R.',p:3.5,d:'2er'},
{c:'2366c',n:'Lenkervorhebehalte / Sattelstand HR.',p:3.8,d:'2er'},
{c:'2366d',n:'Lenkervorhebehalte / Sattelstand R.',p:4.2,d:'2er'},
{c:'2366e',n:'Lenkervorhebehalte / Sattelstützgrätsche HR.',p:5.0,d:'2er'},
{c:'2366f',n:'Lenkervorhebehalte / Sattelstützgrätsche R.',p:5.4,d:'2er'},
{c:'2366g',n:'Lenkerstützgrätsche / Sattelstützgrätsche HR.',p:6.0,d:'2er'},
{c:'2366h',n:'Lenkerstützgrätsche / Sattelstützgrätsche R.',p:6.4,d:'2er'},
{c:'2371a',n:'Kopfstand / Lenkerstand HR.',p:3.8,d:'2er'},
{c:'2371b',n:'Kopfstand / Lenkerstand R.',p:4.1,d:'2er'},
{c:'2372a',n:'Kopfstand / Rahmenschulterstand HR.',p:5.1,d:'2er'},
{c:'2372b',n:'Kopfstand / Rahmenschulterstand R.',p:5.5,d:'2er'},
{c:'2373a',n:'Kopfstand / Lenkerstützgrätsche HR.',p:6.1,d:'2er'},
{c:'2373b',n:'Kopfstand / Lenkerstützgrätsche R.',p:6.5,d:'2er'},
{c:'2374a',n:'Kopfstand / Lenkerhandstand HR.',p:8.5,d:'2er'},
{c:'2374b',n:'Kopfstand / Lenkerhandstand R.',p:9.0,d:'2er'},
{c:'2374c',n:'Kopfstand / Lenkerhandstand S',p:9.8,d:'2er'},
{c:'2374d',n:'Kopfstand / Lenkerhandstand 8',p:10.6,d:'2er'},
{c:'2374e',n:'Kopfstand / Lenkerstützgrätsche Lenkerhandstand HR.',p:11.0,d:'2er'},
{c:'2374f',n:'Kopfstand / Lenkerstützgrätsche Lenkerhandstand R.',p:11.5,d:'2er'},
{c:'2374g',n:'Kopfstand / Lenkerstützgrätsche Lenkerhandstand S',p:12.3,d:'2er'},
{c:'2374h',n:'Kopfstand / Lenkerstützgrätsche Lenkerhandstand 8',p:13.1,d:'2er'},
{c:'2376a',n:'Sattellenkerhandstand / Lenkerstand HR.',p:7.7,d:'2er'},
{c:'2376b',n:'Sattellenkerhandstand / Lenkerstand R.',p:8.1,d:'2er'},
{c:'2376c',n:'Lenkerhandstand / Sattelstand HR.',p:7.6,d:'2er'},
{c:'2376d',n:'Lenkerhandstand / Sattelstand R.',p:8.0,d:'2er'},
{c:'2377a',n:'Lenkerhandstand / Sattellenkerhandstand HR.',p:10.6,d:'2er'},
{c:'2377b',n:'Lenkerhandstand / Sattellenkerhandstand R.',p:11.0,d:'2er'},
{c:'2391a',n:'Pedalstillstand / Schultersitz',p:1.3,d:'2er'},
{c:'2391b',n:'Pedalstillstand frh. / Schultersitz',p:1.8,d:'2er'},
{c:'2391c',n:'Pedalstillstand / Schulterstand',p:2.7,d:'2er'},
{c:'2391d',n:'Pedalstillstand frh. / Schulterstand',p:3.2,d:'2er'},
{c:'2411a',n:'Reitsitzsteiger / Dornenstand HR.',p:2.2,d:'2er'},
{c:'2411b',n:'Reitsitzsteiger / Dornenstand R.',p:2.4,d:'2er'},
{c:'2412a',n:'Reitsitzsteiger / Schultersitz HR.',p:2.9,d:'2er'},
{c:'2412b',n:'Reitsitzsteiger / Schultersitz R.',p:3.1,d:'2er'},
{c:'2412c',n:'Reitsitzsteiger frh. / Schultersitz HR.',p:3.5,d:'2er'},
{c:'2412d',n:'Reitsitzsteiger frh. / Schultersitz R.',p:3.8,d:'2er'},
{c:'2413a',n:'Reitsitzsteiger rw. frh. / Schultersitz HR.',p:4.1,d:'2er'},
{c:'2413b',n:'Reitsitzsteiger rw. frh. / Schultersitz R.',p:4.4,d:'2er'},
{c:'2413c',n:'Reitsitzsteiger Dreh. rw. frh. / Schultersitz',p:6.1,d:'2er'},
{c:'2414a',n:'Reitsitzsteiger / Brustschwebehang HR.',p:3.1,d:'2er'},
{c:'2414b',n:'Reitsitzsteiger / Brustschwebehang R.',p:3.3,d:'2er'},
{c:'2414c',n:'Reitsitzsteiger frh. / Brustschwebehang HR.',p:3.8,d:'2er'},
{c:'2414d',n:'Reitsitzsteiger frh. / Brustschwebehang R.',p:4.2,d:'2er'},
{c:'2415a',n:'Reitsitzsteiger rw. frh. / Brustschwebehang HR.',p:4.4,d:'2er'},
{c:'2415b',n:'Reisitzsteiger rw. frh. / Brustschwebehang R.',p:4.6,d:'2er'},
{c:'2416a',n:'Reitsitzsteiger / Schulterstand HR.',p:4.8,d:'2er'},
{c:'2416b',n:'Reitsitzsteiger / Schulterstand R.',p:5.1,d:'2er'},
{c:'2416c',n:'Reitsitzsteiger frh. / Schulterstand HR.',p:5.6,d:'2er'},
{c:'2416d',n:'Reitsitzsteiger frh. / Schulterstand R.',p:6.0,d:'2er'},
{c:'2417a',n:'Reitsitzsteiger rw. frh. / Schulterstand HR.',p:6.5,d:'2er'},
{c:'2417b',n:'Reitsitzsteiger rw. frh. / Schulterstand R.',p:7.0,d:'2er'},
{c:'2418a',n:'Kehrreitsitzsteiger frh. / Schultersitz HR.',p:3.9,d:'2er'},
{c:'2418b',n:'Kehrreitsitzsteiger frh. / Schultersitz R.',p:4.3,d:'2er'},
{c:'2418c',n:'Kehrreitsitzsteiger Dreh. frh. / Schultersitz',p:6.5,d:'2er'},
{c:'2419a',n:'Kehrreitsitzsteiger rw. frh. / Schultersitz HR.',p:4.9,d:'2er'},
{c:'2419b',n:'Kehrreitsitzsteiger rw. frh. / Schultersitz R.',p:5.3,d:'2er'},
{c:'2420a',n:'Kehrreitsitzsteiger frh. / Brustschwebehang HR.',p:4.1,d:'2er'},
{c:'2420b',n:'Kehrreitsitzsteiger frh. / Brustschwebehang R.',p:4.5,d:'2er'},
{c:'2421a',n:'Kehrreitsitzsteiger rw. frh. / Brustschwebehang HR.',p:5.1,d:'2er'},
{c:'2421b',n:'Kehrreitsitzsteiger rw. frh. / Brustschwebehang R.',p:5.5,d:'2er'},
{c:'2422a',n:'Kehrreitsitzsteiger frh. / Schulterstand HR.',p:6.7,d:'2er'},
{c:'2422b',n:'Kehrreitsitzsteiger frh. / Schulterstand R.',p:7.1,d:'2er'},
{c:'2426a',n:'Lenkersitzsteiger / Schultersitz HR.',p:3.4,d:'2er'},
{c:'2426b',n:'Lenkersitzsteiger / Schultersitz R.',p:3.7,d:'2er'},
{c:'2426c',n:'Lenkersitzsteiger frh. / Schultersitz HR.',p:4.0,d:'2er'},
{c:'2426d',n:'Lenkersitzsteiger frh. / Schultersitz R.',p:4.4,d:'2er'},
{c:'2427a',n:'Lenkersitzsteiger rw. frh. / Schultersitz HR.',p:4.7,d:'2er'},
{c:'2427b',n:'Lenkersitzsteiger rw. frh. / Schultersitz R.',p:5.0,d:'2er'},
{c:'2427c',n:'Lenkersitzsteiger Dreh. rw. frh. / Schultersitz',p:6.9,d:'2er'},
{c:'2428a',n:'Lenkersitzsteiger / Schulterstand HR.',p:5.5,d:'2er'},
{c:'2428b',n:'Lenkersitzsteiger / Schulterstand R.',p:5.9,d:'2er'},
{c:'2428c',n:'Lenkersitzsteiger frh. / Schulterstand HR.',p:6.3,d:'2er'},
{c:'2428d',n:'Lenkersitzsteiger frh. / Schulterstand R.',p:6.7,d:'2er'},
{c:'2429a',n:'Lenkersitzsteiger rw. frh. / Schulterstand HR.',p:7.4,d:'2er'},
{c:'2429b',n:'Lenkersitzsteiger rw. frh. / Schulterstand R.',p:8.0,d:'2er'},
{c:'2436a',n:'Steuerrohrsteiger frh. / Schultersitz HR.',p:3.6,d:'2er'},
{c:'2436b',n:'Steuerrohrsteiger frh. / Schultersitz R.',p:4.0,d:'2er'},
{c:'2437a',n:'Steuerrohrsteiger rw. frh. / Schultersitz HR.',p:4.2,d:'2er'},
{c:'2437b',n:'Steuerrohrsteiger rw. frh. / Schultersitz R.',p:4.6,d:'2er'},
{c:'2437c',n:'Steuerrohrsteiger Dreh. rw. frh. / Schultersitz',p:6.4,d:'2er'},
{c:'2438a',n:'Steuerrohrsteiger frh. / Schulterstand HR.',p:6.0,d:'2er'},
{c:'2438b',n:'Steuerrohrsteiger frh. / Schulterstand R.',p:6.4,d:'2er'},
{c:'2439a',n:'Steuerrohrsteiger rw. frh. / Schulterstand HR.',p:7.0,d:'2er'},
{c:'2439b',n:'Steuerrohrsteiger rw. frh. / Schulterstand R.',p:7.6,d:'2er'},
{c:'2446a',n:'Kehrsteuerrohrsteiger frh. / Schultersitz HR.',p:4.3,d:'2er'},
{c:'2446b',n:'Kehrsteuerrohrsteiger frh. / Schultersitz R.',p:4.7,d:'2er'},
{c:'2446c',n:'Kehrsteuerrohrsteiger Dreh. frh. / Schultersitz',p:7.0,d:'2er'},
{c:'2447a',n:'Kehrsteuerrohrsteiger rw. frh. / Schultersitz HR.',p:5.3,d:'2er'},
{c:'2447b',n:'Kehrsteuerrohrsteiger rw. frh. / Schultersitz R.',p:5.7,d:'2er'},
{c:'2448a',n:'Kehrsteuerrohrsteiger frh. / Schulterstand HR.',p:6.4,d:'2er'},
{c:'2448b',n:'Kehrsteuerrohrsteiger frh. / Schulterstand R.',p:6.8,d:'2er'},
{c:'2449a',n:'Kehrsteuerrohrsteiger rw. frh. / Schulterstand HR.',p:7.9,d:'2er'},
{c:'2449b',n:'Kehrsteuerrohrsteiger rw. frh. / Schulterstand R.',p:8.5,d:'2er'},
{c:'2471a',n:'Übergang Reitsitzsteiger Lenkersitzsteiger / Schultersitz',p:4.8,d:'2er'},
{c:'2471b',n:'Übergang Reitsitzsteiger Lenkersitzsteiger / Schulterstand',p:6.7,d:'2er'},
{c:'2472a',n:'Übergang Reitsitzsteiger Steuerrohrsteiger / Schultersitz',p:7.0,d:'2er'},
{c:'4001a',n:'4 hinter. HR.',p:0.8,d:'4er'},
{c:'4001b',n:'4 hinter. R.',p:1.0,d:'4er'},
{c:'4001c',n:'4 hinter. HR. 4 Lschl.',p:1.4,d:'4er'},
{c:'4001d',n:'4 hinter. R. 4 Lschl.',p:1.6,d:'4er'},
{c:'4001e',n:'4 hinter. HR. 4 Rschl.',p:1.4,d:'4er'},
{c:'4001f',n:'4 hinter. R. 4 Rschl.',p:1.6,d:'4er'},
{c:'4001g',n:'4 hinter. HR. 2 Lschl. 2 Rschl.',p:1.6,d:'4er'},
{c:'4001h',n:'4 hinter. R. 2 Lschl. 2 Rschl.',p:1.8,d:'4er'},
{c:'4001i',n:'4 Wschl. überlagernd',p:2.7,d:'4er'},
{c:'4002a',n:'4 hinter. HR. rw.',p:1.6,d:'4er'},
{c:'4002b',n:'4 hinter. R. rw.',p:2.0,d:'4er'},
{c:'4002c',n:'4 hinter. HR. 4 Lschl. rw.',p:2.7,d:'4er'},
{c:'4002d',n:'4 hinter. R. 4 Lschl. rw.',p:3.1,d:'4er'},
{c:'4002e',n:'4 Wschl. überlagernd rw.',p:4.9,d:'4er'},
{c:'4003a',n:'4 hinter. HR. Stg.',p:2.0,d:'4er'},
{c:'4003b',n:'4 hinter. R. Stg.',p:2.5,d:'4er'},
{c:'4003c',n:'4 hinter. HR. Stg. frh.',p:2.6,d:'4er'},
{c:'4003d',n:'4 hinter. R. Stg. frh.',p:3.3,d:'4er'},
{c:'4003e',n:'4 hinter. HR. 4 Lschl. Stg.',p:3.4,d:'4er'},
{c:'4003f',n:'4 hinter. R. 4 Lschl. Stg.',p:3.9,d:'4er'},
{c:'4003g',n:'4 hinter. HR. 4 Lschl. Stg. frh.',p:4.4,d:'4er'},
{c:'4003h',n:'4 hinter. R. 4 Lschl. Stg. frh.',p:5.1,d:'4er'},
{c:'4004a',n:'4 hinter. HR. Stg. rw. frh.',p:3.4,d:'4er'},
{c:'4004b',n:'4 hinter. R. Stg. rw. frh.',p:4.3,d:'4er'},
{c:'4004c',n:'4 hinter. HR. 4 Lschl. Stg. rw. frh.',p:5.8,d:'4er'},
{c:'4004d',n:'4 hinter. R. 4 Lschl. Stg. rw. frh.',p:6.6,d:'4er'},
{c:'4004e',n:'4 hinter. HR. 4 Rschl. Stg. rw. frh.',p:6.0,d:'4er'},
{c:'4004f',n:'4 hinter. R. 4 Rschl. Stg. rw. frh.',p:6.8,d:'4er'},
{c:'4004g',n:'4 hinter. HR. 2 Lschl. 2 Rschl. Stg. rw. frh.',p:6.6,d:'4er'},
{c:'4004h',n:'4 hinter. R. 2 Lschl. 2 Rschl. Stg. rw. frh.',p:7.5,d:'4er'},
{c:'4005a',n:'4 Wschl. überlagernd Stg. rw. frh.',p:9.4,d:'4er'},
{c:'4006a',n:'4 hinter. Schrägzug',p:1.0,d:'4er'},
{c:'4006b',n:'4 hinter. Schrägzug 2 Lschl. 2 Rschl.',p:1.8,d:'4er'},
{c:'4007a',n:'4 hinter. S',p:1.8,d:'4er'},
{c:'4007b',n:'4 hinter. 8',p:2.2,d:'4er'},
{c:'4007c',n:'4 hinter. 8 durch.',p:2.6,d:'4er'},
{c:'4008a',n:'4 hinter. S rw.',p:3.6,d:'4er'},
{c:'4008b',n:'4 hinter. 8 rw.',p:4.4,d:'4er'},
{c:'4008c',n:'4 hinter. 8 durch. rw.',p:5.2,d:'4er'},
{c:'4010a',n:'4 hinter. S Stg. rw. frh.',p:7.7,d:'4er'},
{c:'4010b',n:'4 hinter. 8 Stg. rw. frh.',p:9.4,d:'4er'},
{c:'4010c',n:'4 hinter. 8 durch. Stg. rw. frh.',p:10.6,d:'4er'},
{c:'4011a',n:'4 hinter. Längszug',p:1.0,d:'4er'},
{c:'4011b',n:'4 hinter. Längszug 2 Lschl. 2 Rschl.',p:1.8,d:'4er'},
{c:'4012a',n:'2 hinter. Gegenlängszug',p:1.6,d:'4er'},
{c:'4012b',n:'2 hinter. Gegenlängszug 2 Mühlen',p:2.7,d:'4er'},
{c:'4013a',n:'2 neben. Gegenlängszug',p:1.2,d:'4er'},
{c:'4013b',n:'2 neben. Gegenlängszug 4 Lschl.',p:1.7,d:'4er'},
{c:'4013c',n:'2 neben. Gegenlängszug durch.',p:1.6,d:'4er'},
{c:'4013d',n:'2 neben. Gegenlängszug durch. 4 Lschl.',p:2.1,d:'4er'},
{c:'4013e',n:'2 neben. Gegenlängszug durch. 4 Rschl.',p:2.2,d:'4er'},
{c:'4013f',n:'2 neben. Gegenlängszug durch. 2 Mühlen',p:2.7,d:'4er'},
{c:'4014a',n:'2 hinter. Gegenschrägzug',p:1.6,d:'4er'},
{c:'4015a',n:'4 neben. halbe Quer-Wschl.',p:2.0,d:'4er'},
{c:'4015b',n:'4 neben. Quer-Wschl.',p:2.4,d:'4er'},
{c:'4016a',n:'4 neben. halbe Quer-Wschl. Stg. rw. frh.',p:8.7,d:'4er'},
{c:'4016b',n:'4 neben. Quer-Wschl. Stg. rw. frh.',p:10.4,d:'4er'},
{c:'4017a',n:'4 neben. Querzug',p:1.0,d:'4er'},
{c:'4017b',n:'4 neben. Querzug 4 Lschl.',p:1.6,d:'4er'},
{c:'4018a',n:'4 neben. Querzug rw.',p:2.1,d:'4er'},
{c:'4018b',n:'4 neben. Querzug 4 Lschl. rw.',p:3.2,d:'4er'},
{c:'4024a',n:'2er Flügelmühle HU. Dreh. Stg. rw. frh. T (10,3)',p:9.3,d:'4er'},
{c:'4024b',n:'2er Flügelmühle Dreh. Stg. rw. frh. T (11,2)',p:10.2,d:'4er'},
{c:'4024c',n:'Remmlinger Dreh. Stg. rw. frh. T (13,6)',p:12.6,d:'4er'},
{c:'4026a',n:'2 hinter. halbe Doppelrunde',p:0.8,d:'4er'},
{c:'4026b',n:'2 hinter. Doppelrunde',p:1.2,d:'4er'},
{c:'4026c',n:'2 hinter. Doppelrunde durch.',p:1.6,d:'4er'},
{c:'4026d',n:'2 hinter. halbe Doppelrunde 4 Lschl.',p:1.4,d:'4er'},
{c:'4026e',n:'2 hinter. Doppelrunde 4 Lschl.',p:1.8,d:'4er'},
{c:'4026f',n:'2 hinter. Doppelrunde durch. 4 Lschl.',p:2.2,d:'4er'},
{c:'4027a',n:'2 hinter. halbe Doppelrunde rw.',p:1.7,d:'4er'},
{c:'4027b',n:'2 hinter. Doppelrunde rw.',p:2.5,d:'4er'},
{c:'4027c',n:'2 hinter. Doppelrunde durch. rw.',p:3.3,d:'4er'},
{c:'4027d',n:'2 hinter. halbe Doppelrunde 4 Lschl. rw.',p:2.8,d:'4er'},
{c:'4027e',n:'2 hinter. Doppelrunde 4 Lschl. rw.',p:3.6,d:'4er'},
{c:'4027f',n:'2 hinter. Doppelrunde durch. 4 Lschl. rw.',p:4.4,d:'4er'},
{c:'4028a',n:'2 hinter. halbe Doppelrunde Stg.',p:2.1,d:'4er'},
{c:'4028b',n:'2 hinter. Doppelrunde Stg.',p:3.1,d:'4er'},
{c:'4028c',n:'2 hinter. Doppelrunde durch. Stg.',p:4.1,d:'4er'},
{c:'4028d',n:'2 hinter. halbe Doppelrunde Stg. frh.',p:2.7,d:'4er'},
{c:'4028e',n:'2 hinter. Doppelrunde Stg. frh.',p:3.5,d:'4er'},
{c:'4028f',n:'2 hinter. Doppelrunde durch. Stg. frh.',p:5.3,d:'4er'},
{c:'4028g',n:'2 hinter. halbe Doppelrunde 4 Lschl. Stg.',p:3.5,d:'4er'},
{c:'4028h',n:'2 hinter. Doppelrunde 4 Lschl. Stg.',p:4.5,d:'4er'},
{c:'4028i',n:'2 hinter. Doppelrunde durch. 4 Lschl. Stg.',p:5.5,d:'4er'},
{c:'4028j',n:'2 hinter. halbe Doppelrunde 4 Lschl. Stg. frh.',p:4.6,d:'4er'},
{c:'4028k',n:'2 hinter. Doppelrunde 4 Lschl. Stg. frh.',p:5.4,d:'4er'},
{c:'4028l',n:'2 hinter. Doppelrunde durch. 4 Lschl. Stg. frh.',p:7.2,d:'4er'},
{c:'4029a',n:'2 hinter. halbe Doppelrunde Stg. rw. frh.',p:4.1,d:'4er'},
{c:'4029b',n:'2 hinter. Doppelrunde Stg. rw. frh.',p:5.3,d:'4er'},
{c:'4029c',n:'2 hinter. Doppelrunde durch. Stg. rw. frh.',p:7.0,d:'4er'},
{c:'4029d',n:'2 hinter. halbe Doppelrunde 4 Lschl. Stg. rw. frh.',p:6.5,d:'4er'},
{c:'4029e',n:'2 hinter. Doppelrunde 4 Lschl. Stg. rw. frh.',p:7.7,d:'4er'},
{c:'4029f',n:'2 hinter. Doppelrunde durch. 4 Lschl. Stg. rw. frh.',p:9.4,d:'4er'},
{c:'4031a',n:'2 hinter. Querzug',p:1.0,d:'4er'},
{c:'4031b',n:'2 hinter. Querzug 4 Lschl.',p:1.6,d:'4er'},
{c:'4031c',n:'2 hinter. Querzug 2 Lschl. 2 Rschl.',p:1.8,d:'4er'},
{c:'4032a',n:'2 hinter. Querzug rw.',p:2.0,d:'4er'},
{c:'4032b',n:'2 hinter. Querzug 4 Lschl. rw.',p:3.1,d:'4er'},
{c:'4032c',n:'2 hinter. Querzug 2 Lschl. 2 Rschl. rw.',p:3.5,d:'4er'},
{c:'4044a',n:'2 neben. Gegenquerzug',p:1.2,d:'4er'},
{c:'4044b',n:'2 neben. Gegenquerzug 4 Lschl.',p:1.7,d:'4er'},
{c:'4044c',n:'2 neben. Gegenquerzug durch.',p:1.6,d:'4er'},
{c:'4044d',n:'2 neben. Gegenquerzug durch. 4 Lschl.',p:2.1,d:'4er'},
{c:'4044e',n:'2 neben. Gegenquerzug durch. 2 Mühlen',p:2.7,d:'4er'},
{c:'4044f',n:'2 neben. halbe Ggquer-Wschl.',p:2.0,d:'4er'},
{c:'4044g',n:'2 neben. Ggquer-Wschl.',p:2.4,d:'4er'},
{c:'4045a',n:'2 neben. Gegenquerzug rw.',p:2.3,d:'4er'},
{c:'4045b',n:'2 neben. Gegenquerzug durch. rw.',p:3.1,d:'4er'},
{c:'4045c',n:'2 neben. Gegenquerzug 4 Lschl. rw.',p:3.4,d:'4er'},
{c:'4045d',n:'2 neben. halbe Ggquer-Wschl. rw.',p:3.9,d:'4er'},
{c:'4045e',n:'2 neben. Ggquer-Wschl. rw.',p:4.7,d:'4er'},
{c:'4048a',n:'2 neben. halbe Ggquer-Wschl. Stg. rw. frh.',p:9.0,d:'4er'},
{c:'4048b',n:'2 neben. Ggquer-Wschl. Stg. rw. frh.',p:10.0,d:'4er'},
{c:'4048c',n:'2 neben. Ggquer-Wschl. durch. Stg. rw. frh. T (11,3 -',p:12.1,d:'4er'},
{c:'4071a',n:'2er HR.',p:0.4,d:'4er'},
{c:'4071b',n:'2er R.',p:0.6,d:'4er'},
{c:'4071c',n:'2er HR. 2er Lschl.',p:0.6,d:'4er'},
{c:'4071d',n:'2er R. 2er Lschl.',p:1.0,d:'4er'},
{c:'4071e',n:'2er HR. 4 Lschl.',p:1.2,d:'4er'},
{c:'4071f',n:'2er R. 4 Lschl.',p:1.4,d:'4er'},
{c:'4072a',n:'2er HR. rw.',p:0.8,d:'4er'},
{c:'4072b',n:'2er R. rw.',p:1.2,d:'4er'},
{c:'4072c',n:'2er HR. 2er Lschl. rw.',p:1.1,d:'4er'},
{c:'4072d',n:'2er R. 2er Lschl. rw.',p:1.5,d:'4er'},
{c:'4072e',n:'2er HR. 4 Lschl. rw.',p:2.9,d:'4er'},
{c:'4072f',n:'2er R. 4 Lschl. rw.',p:3.3,d:'4er'},
{c:'4073a',n:'2er HR. Stg.',p:1.0,d:'4er'},
{c:'4073b',n:'2er R. Stg.',p:1.5,d:'4er'},
{c:'4073c',n:'2er HR. Stg. frh.',p:1.3,d:'4er'},
{c:'4073d',n:'2er R. Stg. frh.',p:2.0,d:'4er'},
{c:'4073e',n:'2er HR. 2er Lschl. Stg.',p:1.9,d:'4er'},
{c:'4073f',n:'2er R. 2er Lschl. Stg.',p:2.4,d:'4er'},
{c:'4073g',n:'2er HR. 2er Lschl. Stg. frh.',p:2.3,d:'4er'},
{c:'4073h',n:'2er R. 2er Lschl. Stg. frh.',p:3.0,d:'4er'},
{c:'4073i',n:'2er HR. 4 Lschl. Stg.',p:2.9,d:'4er'},
{c:'4073j',n:'2er R. 4 Lschl. Stg.',p:3.4,d:'4er'},
{c:'4073k',n:'2er HR. 4 Lschl. Stg. frh.',p:3.6,d:'4er'},
{c:'4073l',n:'2er R. 4 Lschl. Stg. frh.',p:4.3,d:'4er'},
{c:'4073m',n:'2er HR. 4 Lschl. durch. Stg.',p:3.9,d:'4er'},
{c:'4073n',n:'2er R. 4 Lschl. durch. Stg.',p:4.4,d:'4er'},
{c:'4073o',n:'2er HR. 4 Lschl. durch. Stg. frh.',p:4.4,d:'4er'},
{c:'4073p',n:'2er R. 4 Lschl. durch. Stg. frh.',p:5.1,d:'4er'},
{c:'4074a',n:'2er HR. Stg. rw. frh.',p:1.7,d:'4er'},
{c:'4074b',n:'2er R. Stg. rw. frh.',p:2.6,d:'4er'},
{c:'4074c',n:'2er HR. 2er Lschl. Stg. rw. frh.',p:2.4,d:'4er'},
{c:'4074d',n:'2er R. 2er Lschl. Stg. rw. frh.',p:3.2,d:'4er'},
{c:'4074e',n:'2er HR. 4 Lschl. Stg. rw. frh.',p:5.1,d:'4er'},
{c:'4074f',n:'2er R. 4 Lschl. Stg. rw. frh.',p:5.9,d:'4er'},
{c:'4074g',n:'2er HR. 4 Lschl. durch. Stg. rw. frh.',p:6.8,d:'4er'},
{c:'4074h',n:'2er R. 4 Lschl. durch. Stg. rw. frh.',p:7.6,d:'4er'},
{c:'4081a',n:'2er hinter. Längszug Stg. frh.',p:2.0,d:'4er'},
{c:'4081b',n:'2er hinter. Längszug 2er Lschl. Stg. frh.',p:2.5,d:'4er'},
{c:'4081c',n:'2er hinter. Längszug 2er Rschl. Stg. frh.',p:2.7,d:'4er'},
{c:'4081d',n:'2er hinter. Längszug 4 Lschl. Stg. frh.',p:3.8,d:'4er'},
{c:'4082a',n:'2er hinter. Längszug Stg. rw. frh.',p:2.6,d:'4er'},
{c:'4082b',n:'2er hinter. Längszug 2 Lschl. 2 Rschl. Stg. rw. frh.',p:6.8,d:'4er'},
{c:'4083a',n:'2er Gegenlängszug durch. 4 Lschl. Stg. rw. frh.',p:9.2,d:'4er'},
{c:'4083b',n:'2er Gegenlängszug durch. 4 Rschl. Stg. rw. frh.',p:10.4,d:'4er'},
{c:'4083c',n:'2er Gegenlängszug durch. 2 Mühlen Stg. rw. frh.',p:11.6,d:'4er'},
{c:'4086a',n:'2er Querzug',p:0.6,d:'4er'},
{c:'4086b',n:'2er Querzug 2er Lschl.',p:0.8,d:'4er'},
{c:'4086c',n:'2er Querzug 2er Rschl.',p:0.8,d:'4er'},
{c:'4086d',n:'2er Querzug 4 Lschl.',p:1.7,d:'4er'},
{c:'4087a',n:'2er Querzug rw.',p:1.2,d:'4er'},
{c:'4087b',n:'2er Querzug 2er Lschl. rw.',p:1.7,d:'4er'},
{c:'4087c',n:'2er Querzug 4 Lschl. rw.',p:2.5,d:'4er'},
{c:'4088a',n:'2er Querzug Stg.',p:1.5,d:'4er'},
{c:'4088b',n:'2er Querzug Stg. frh.',p:2.0,d:'4er'},
{c:'4088c',n:'2er Querzug 2er Lschl. Stg.',p:1.9,d:'4er'},
{c:'4088d',n:'2er Querzug 2er Lschl. Stg. frh.',p:2.5,d:'4er'},
{c:'4088e',n:'2er Querzug 2er Rschl. Stg. frh.',p:2.7,d:'4er'},
{c:'4088f',n:'2er Querzug 4 Lschl. Stg.',p:3.9,d:'4er'},
{c:'4088g',n:'2er Querzug 4 Lschl. Stg. frh.',p:4.8,d:'4er'},
{c:'4089a',n:'2er Querzug Stg. rw. frh.',p:2.6,d:'4er'},
{c:'4089b',n:'2er Querzug 2er Lschl. Stg. rw. frh.',p:3.2,d:'4er'},
{c:'4089c',n:'2er Querzug 2er Rschl. Stg. rw. frh.',p:3.6,d:'4er'},
{c:'4089d',n:'2er Querzug 4 Lschl. Stg. rw. frh.',p:6.4,d:'4er'},
{c:'4096a',n:'2er halbe Quer-Wschl.',p:0.7,d:'4er'},
{c:'4096b',n:'2er Quer-Wschl.',p:1.1,d:'4er'},
{c:'4097a',n:'2er halbe Quer-Wschl. rw.',p:1.4,d:'4er'},
{c:'4097b',n:'2er Quer-Wschl. rw.',p:2.2,d:'4er'},
{c:'4098a',n:'2er halbe Quer-Wschl. Stg.',p:1.8,d:'4er'},
{c:'4098b',n:'2er Quer-Wschl. Stg.',p:2.8,d:'4er'},
{c:'4098c',n:'2er halbe Quer-Wschl. Stg. frh.',p:2.3,d:'4er'},
{c:'4098d',n:'2er Quer-Wschl. Stg. frh.',p:3.6,d:'4er'},
{c:'4099a',n:'2er halbe Quer-Wschl. Stg. rw. frh.',p:3.0,d:'4er'},
{c:'4099b',n:'2er Quer-Wschl. Stg. rw. frh.',p:4.7,d:'4er'},
{c:'4105a',n:'2er Gegenquerzug',p:1.2,d:'4er'},
{c:'4105b',n:'2er Gegenquerzug 2er Lschl.',p:1.4,d:'4er'},
{c:'4105c',n:'2er Gegenquerzug 4 Lschl.',p:1.8,d:'4er'},
{c:'4106a',n:'2er Gegenquerzug rw.',p:2.4,d:'4er'},
{c:'4106b',n:'2er Gegenquerzug 2er Lschl. rw.',p:2.7,d:'4er'},
{c:'4106c',n:'2er Gegenquerzug 4 Lschl. rw.',p:3.5,d:'4er'},
{c:'4107a',n:'2er Gegenquerzug Stg.',p:3.0,d:'4er'},
{c:'4107b',n:'2er Gegenquerzug Stg. frh.',p:3.9,d:'4er'},
{c:'4107c',n:'2er Gegenquerzug 2er Lschl. Stg.',p:3.4,d:'4er'},
{c:'4107d',n:'2er Gegenquerzug 2er Lschl. Stg. frh.',p:4.4,d:'4er'},
{c:'4107e',n:'2er Gegenquerzug 4 Lschl. Stg.',p:4.9,d:'4er'},
{c:'4107f',n:'2er Gegenquerzug 4 Lschl. Stg. frh.',p:5.7,d:'4er'},
{c:'4108a',n:'2er Gegenquerzug Stg. rw. frh.',p:4.1,d:'4er'},
{c:'4108b',n:'2er Gegenquerzug 4 Lschl. Stg. rw. frh.',p:7.5,d:'4er'},
{c:'4108c',n:'2er Gegenquerzug 2 Lschl. 2 Rschl. Stg. rw. frh.',p:8.3,d:'4er'},
{c:'4116a',n:'Umfahrt 1 um 1',p:1.6,d:'4er'},
{c:'4117a',n:'Umfahrt 1 um 1 rw.',p:2.2,d:'4er'},
{c:'4121a',n:'Zwei Mühlen',p:0.8,d:'4er'},
{c:'4121b',n:'Zwei Mühlen 4 Rschl.',p:1.4,d:'4er'},
{c:'4122a',n:'Zwei Mühlen rw.',p:1.7,d:'4er'},
{c:'4122b',n:'Zwei Mühlen rw. angef.',p:2.6,d:'4er'},
{c:'4122c',n:'Zwei Mühlen rw. an- u. abgef.',p:3.1,d:'4er'},
{c:'4123a',n:'Zwei Mühlen Stg.',p:2.1,d:'4er'},
{c:'4123b',n:'Zwei Mühlen Stg. frh.',p:2.7,d:'4er'},
{c:'4123c',n:'Zwei Mühlen Stg. frh. angef.',p:4.3,d:'4er'},
{c:'4123d',n:'Zwei Mühlen Stg. angef. frh.',p:4.3,d:'4er'},
{c:'4123e',n:'Zwei Mühlen Stg. frh. an- u. abgef.',p:4.6,d:'4er'},
{c:'4123f',n:'Zwei Mühlen Stg. an- u. abgef. frh.',p:5.1,d:'4er'},
{c:'4124a',n:'Zwei Mühlen Stg. rw. frh.',p:3.6,d:'4er'},
{c:'4124b',n:'Zwei Mühlen Stg. rw. angef. frh.',p:5.6,d:'4er'},
{c:'4124c',n:'Zwei Mühlen Stg. rw. an- u. abgef. frh.',p:6.6,d:'4er'},
{c:'4124d',n:'Zwei Mühlen Dreh. Stg. rw. an- u. abgef. frh. T (10,4)',p:9.4,d:'4er'},
{c:'4124e',n:'Zwei Mühlen 4 Rschl. Stg. rw. an- u. abgef. frh.',p:7.7,d:'4er'},
{c:'4133a',n:'Zwei Innenringe Stg.',p:1.7,d:'4er'},
{c:'4133b',n:'Zwei Innenringe Stg. angef.',p:2.9,d:'4er'},
{c:'4133c',n:'Zwei Innenringe Stg. angef. frh.',p:3.8,d:'4er'},
{c:'4133d',n:'Zwei Innenringe Stg. an- u. abgef.',p:3.5,d:'4er'},
{c:'4133e',n:'Zwei Innenringe Stg. an- u. abgef. frh.',p:4.6,d:'4er'},
{c:'4134a',n:'Zwei Innenringe Stg. rw.',p:2.4,d:'4er'},
{c:'4134b',n:'Zwei Innenringe Stg. rw. angef. frh.',p:4.9,d:'4er'},
{c:'4134c',n:'Zwei Innenringe Stg. rw. an- u. abgef. frh.',p:6.0,d:'4er'},
{c:'4134d',n:'Zwei Innenringe 4 Rschl. Stg. rw. an- u. abgef. frh.',p:8.5,d:'4er'},
{c:'4134e',n:'Zwei Innenringe Dreh. Stg. rw. an- u. abgef. frh. T (11,7)',p:10.7,d:'4er'},
{c:'4135a',n:'Zwei Außenringe Stg.',p:2.5,d:'4er'},
{c:'4135b',n:'Zwei Außenringe Stg. angef.',p:3.7,d:'4er'},
{c:'4135c',n:'Zwei Außenringe Stg. angef. frh.',p:4.8,d:'4er'},
{c:'4135d',n:'Zwei Außenringe Stg. an- u. abgef.',p:4.3,d:'4er'},
{c:'4135e',n:'Zwei Außenringe Stg. an- u. abgef. frh.',p:5.6,d:'4er'},
{c:'4136a',n:'Zwei Außenringe Stg. rw.',p:3.5,d:'4er'},
{c:'4136b',n:'Zwei Außenringe Stg. rw. angef. frh.',p:6.3,d:'4er'},
{c:'4136c',n:'Zwei Außenringe Stg. rw. an- u. abgef. frh.',p:7.3,d:'4er'},
{c:'4136d',n:'Zwei Außenringe 4 Rschl. Stg. rw. an- u. abgef. frh.',p:9.9,d:'4er'},
{c:'4136e',n:'Zwei Außenringe Dreh. Stg. rw. an- u. abgef. frh. T (13,1)',p:12.1,d:'4er'},
{c:'4151a',n:'4er HR.',p:0.8,d:'4er'},
{c:'4151b',n:'4er R.',p:1.0,d:'4er'},
{c:'4151c',n:'4er HR. 2er Lschl.',p:1.2,d:'4er'},
{c:'4151d',n:'4er R. 2er Lschl.',p:1.4,d:'4er'},
{c:'4151e',n:'4er HR. 4 Lschl.',p:2.4,d:'4er'},
{c:'4151f',n:'4er R. 4 Lschl.',p:2.8,d:'4er'},
{c:'4152a',n:'4er HR. rw.',p:1.7,d:'4er'},
{c:'4152b',n:'4er R. rw.',p:2.1,d:'4er'},
{c:'4152c',n:'4er HR. 2er Lschl. rw.',p:2.4,d:'4er'},
{c:'4152d',n:'4er R. 2er Lschl. rw.',p:2.8,d:'4er'},
{c:'4152e',n:'4er HR. 4 Lschl. rw.',p:3.8,d:'4er'},
{c:'4152f',n:'4er R. 4 Lschl. rw.',p:4.2,d:'4er'},
{c:'4153a',n:'4er HR. Stg.',p:2.1,d:'4er'},
{c:'4153b',n:'4er R. Stg.',p:2.6,d:'4er'},
{c:'4153c',n:'4er HR. Stg. frh.',p:2.7,d:'4er'},
{c:'4153d',n:'4er R. Stg. frh.',p:3.4,d:'4er'},
{c:'4153e',n:'4er HR. 2er Lschl. Stg.',p:3.0,d:'4er'},
{c:'4153f',n:'4er R. 2er Lschl. Stg.',p:3.5,d:'4er'},
{c:'4153g',n:'4er HR. 2er Lschl. Stg. frh',p:3.9,d:'4er'},
{c:'4153h',n:'4er R. 2er Lschl. Stg. frh',p:3.6,d:'4er'},
{c:'4153i',n:'4er HR. 4 Lschl. Stg.',p:4.5,d:'4er'},
{c:'4153j',n:'4er R. 4 Lschl. Stg.',p:5.0,d:'4er'},
{c:'4153k',n:'4er HR. 4 Lschl. Stg. frh.',p:5.6,d:'4er'},
{c:'4153l',n:'4er R. 4 Lschl. Stg. frh.',p:6.2,d:'4er'},
{c:'4154a',n:'4er HR. Stg. rw. frh.',p:3.6,d:'4er'},
{c:'4154b',n:'4er R. Stg. rw. frh.',p:4.4,d:'4er'},
{c:'4154c',n:'4er HR. 2er Lschl. Stg. rw. frh.',p:5.1,d:'4er'},
{c:'4154d',n:'4er R. 2er Lschl. Stg. rw. frh.',p:6.0,d:'4er'},
{c:'4154e',n:'4er HR. 4 Lschl. Stg. rw. frh.',p:7.0,d:'4er'},
{c:'4154f',n:'4er R. 4 Lschl. Stg. rw. frh.',p:7.8,d:'4er'},
{c:'4154g',n:'4er HR. Dreh. Stg. rw. frh.',p:9.3,d:'4er'},
{c:'4154h',n:'4er R. Dreh. Stg. rw. frh.',p:10.2,d:'4er'},
{c:'4161a',n:'4er Querzug',p:1.0,d:'4er'},
{c:'4161b',n:'4er Querzug 2er Lschl.',p:1.4,d:'4er'},
{c:'4161c',n:'4er Querzug 2er Rschl.',p:1.5,d:'4er'},
{c:'4161d',n:'4er Querzug 4 Lschl.',p:1.6,d:'4er'},
{c:'4162a',n:'4er Querzug rw.',p:2.1,d:'4er'},
{c:'4162b',n:'4er Querzug 2er Lschl. rw.',p:2.8,d:'4er'},
{c:'4162c',n:'4er Querzug 2er Rschl. rw.',p:3.0,d:'4er'},
{c:'4162d',n:'4er Querzug 4 Lschl. rw.',p:3.2,d:'4er'},
{c:'4163a',n:'4er Querzug Stg.',p:2.6,d:'4er'},
{c:'4163b',n:'4er Querzug Stg. frh.',p:3.4,d:'4er'},
{c:'4163c',n:'4er Querzug 2er Lschl. Stg.',p:3.5,d:'4er'},
{c:'4163d',n:'4er Querzug 2er Lschl. Stg. frh.',p:4.1,d:'4er'},
{c:'4163e',n:'4er Querzug 4 Lschl. Stg.',p:5.0,d:'4er'},
{c:'4163f',n:'4er Querzug 4 Lschl. Stg. frh.',p:5.2,d:'4er'},
{c:'4164a',n:'4er Querzug Stg. rw. frh.',p:3.4,d:'4er'},
{c:'4164b',n:'4er Querzug 2er Lschl. Stg. rw. frh',p:5.0,d:'4er'},
{c:'4164c',n:'4er Querzug 4 Lschl. Stg. rw. frh.',p:6.8,d:'4er'},
{c:'4164d',n:'4er Querzug 2 Lschl. 2 Rschl. Stg. rw. frh.',p:7.7,d:'4er'},
{c:'4164e',n:'4er Querzug Dreh. Stg. rw. frh.',p:10.2,d:'4er'},
{c:'4171a',n:'Umfahrt 3er um 1',p:1.1,d:'4er'},
{c:'4172a',n:'Umfahrt 3er um 1 rw.',p:2.2,d:'4er'},
{c:'4173a',n:'Umfahrt 3er um 1 Stg.',p:2.8,d:'4er'},
{c:'4173b',n:'Umfahrt 3er um 1 Stg. frh.',p:3.6,d:'4er'},
{c:'4174a',n:'Umfahrt 3er um 1 Stg. rw. frh.',p:4.8,d:'4er'},
{c:'4181a',n:'Kutsche HR.',p:0.6,d:'4er'},
{c:'4181b',n:'Kutsche R.',p:0.8,d:'4er'},
{c:'4182a',n:'Kutsche HR. Stg.',p:1.5,d:'4er'},
{c:'4182b',n:'Kutsche R. Stg.',p:2.0,d:'4er'},
{c:'4183a',n:'Schlange HR.',p:0.6,d:'4er'},
{c:'4183b',n:'Schlange R.',p:0.8,d:'4er'},
{c:'4191a',n:'Kette HR.',p:0.6,d:'4er'},
{c:'4191b',n:'Kette R.',p:0.8,d:'4er'},
{c:'4192a',n:'Kette HR. Stg. frh.',p:2.0,d:'4er'},
{c:'4192b',n:'Kette R. Stg. frh.',p:2.6,d:'4er'},
{c:'4196a',n:'Sattelgriff HR.',p:1.0,d:'4er'},
{c:'4196b',n:'Sattelgriff R.',p:1.2,d:'4er'},
{c:'4197a',n:'Sattelgriffdurchzug',p:1.2,d:'4er'},
{c:'4198a',n:'Sattelgriffring',p:0.8,d:'4er'},
{c:'4198b',n:'Sattelgriffring 4 Rschl.',p:1.8,d:'4er'},
{c:'4199a',n:'Sattelgriffring rw.',p:1.6,d:'4er'},
{c:'4199b',n:'Sattelgriffring rw. angef.',p:2.6,d:'4er'},
{c:'4199c',n:'Sattelgriffring rw. an- u. abgef.',p:3.0,d:'4er'},
{c:'4211a',n:'2er Flügelmühle',p:1.3,d:'4er'},
{c:'4211b',n:'2er Flügelmühle HU. 2er Rschl.',p:1.7,d:'4er'},
{c:'4211c',n:'2er Flügelmühle 2er Rschl.',p:1.9,d:'4er'},
{c:'4211d',n:'2er Flügelmühle HU. 4 Rschl.',p:2.1,d:'4er'},
{c:'4211e',n:'2er Flügelmühle 4 Rschl.',p:2.4,d:'4er'},
{c:'4212a',n:'2er Flügelmühle rw.',p:1.6,d:'4er'},
{c:'4212b',n:'2er Flügelmühle HU. 2er Rschl. rw.',p:2.4,d:'4er'},
{c:'4212c',n:'2er Flügelmühle 2er Rschl. rw.',p:3.1,d:'4er'},
{c:'4212d',n:'2er Flügelmühle rw. angef.',p:2.6,d:'4er'},
{c:'4212e',n:'2er Flügelmühle rw. an- u. abgef.',p:3.0,d:'4er'},
{c:'4213a',n:'2er Flügelmühle Stg.',p:2.0,d:'4er'},
{c:'4213b',n:'2er Flügelmühle Stg. frh.',p:2.6,d:'4er'},
{c:'4213c',n:'2er Flügelmühle Stg. frh. angef.',p:4.2,d:'4er'},
{c:'4213d',n:'2er Flügelmühle Stg. angef. frh.',p:4.2,d:'4er'},
{c:'4213e',n:'2er Flügelmühle Stg. frh. an- u. abgef.',p:4.4,d:'4er'},
{c:'4213f',n:'2er Flügelmühle Stg. an- u. abgef. frh.',p:4.9,d:'4er'},
{c:'4214a',n:'2er Flügelmühle Stg. rw. frh.',p:3.4,d:'4er'},
{c:'4214b',n:'2er Flügelmühle Stg. rw. angef. frh.',p:5.4,d:'4er'},
{c:'4214c',n:'2er Flügelmühle Stg. rw. an- u. abgef. frh.',p:6.0,d:'4er'},
{c:'4214d',n:'2er Flügelmühle HU. Mühle mit 2 Rschl. Stg. rw. frh.',p:5.1,d:'4er'},
{c:'4214e',n:'2er Flügelmühle HU. 2er Rschl. Stg. rw. frh.',p:4.1,d:'4er'},
{c:'4214f',n:'2er Flügelmühle 2er Rschl. Stg. rw. frh.',p:5.4,d:'4er'},
{c:'4214g',n:'2er Flügelmühle HU. 4 Rschl. Stg. rw. frh.',p:5.6,d:'4er'},
{c:'4214h',n:'2er Flügelmühle HU. 4 Rschl. Stg. rw. angef. frh.',p:6.6,d:'4er'},
{c:'4214i',n:'2er Flügelmühle HU. 4 Rschl. Stg. rw. an- u. abgef. frh.',p:7.2,d:'4er'},
{c:'4214j',n:'2er Flügelmühle 4 Rschl. Stg. rw. frh.',p:6.0,d:'4er'},
{c:'4214k',n:'2er Flügelmühle 4 Rschl. Stg. rw. angef. frh.',p:7.5,d:'4er'},
{c:'4214l',n:'2er Flügelmühle 4 Rschl. Stg. rw. an- u. abgef. frh.',p:8.5,d:'4er'},
{c:'4223a',n:'2er Flügelring Stg.',p:2.0,d:'4er'},
{c:'4223b',n:'2er Flügelring Stg. frh.',p:2.6,d:'4er'},
{c:'4223c',n:'2er Flügelring Stg. frh. angef.',p:3.7,d:'4er'},
{c:'4223d',n:'2er Flügelring Stg. angef. frh.',p:4.2,d:'4er'},
{c:'4223e',n:'2er Flügelring Stg. frh. an- u. abgef.',p:4.4,d:'4er'},
{c:'4223f',n:'2er Flügelring Stg. an- u. abgef. frh.',p:4.9,d:'4er'},
{c:'4224a',n:'2er Flügelring Stg. rw. frh.',p:3.4,d:'4er'},
{c:'4224b',n:'2er Flügelring Stg. rw. angef. frh.',p:5.4,d:'4er'},
{c:'4224c',n:'2er Flügelring Stg. rw. an- u. abgef. frh.',p:6.5,d:'4er'},
{c:'4230a',n:'2er Flügelmühle Mühle mit 2 hinter. R.',p:1.7,d:'4er'},
{c:'4231a',n:'2er Flügelmühle Mühle mit 2 hinter. R. rw.',p:3.4,d:'4er'},
{c:'4232a',n:'2er Flügelmühle Mühle mit 2 hinter. R. Stg.',p:3.8,d:'4er'},
{c:'4232b',n:'2er Flügelmühle Mühle mit 2 hinter. R. Stg. frh.',p:4.6,d:'4er'},
{c:'4232c',n:'2er Flügelring Innenring mit 2 hinter. R. Stg.',p:3.9,d:'4er'},
{c:'4232d',n:'2er Flügelring Innenring mit 2 hinter. R. Stg. frh.',p:4.9,d:'4er'},
{c:'4233a',n:'2er Flügelmühle Mühle mit 2 hinter. R. Stg. rw. frh.',p:5.3,d:'4er'},
{c:'4233b',n:'2er Flügelring Innenring mit 2 hinter. R. Stg. rw. frh.',p:5.6,d:'4er'},
{c:'4233c',n:'2er Flügelmühle HU. Mühle mit Dreh. Stg. rw. frh. T (9,0)',p:8.2,d:'4er'},
{c:'4241a',n:'Mühle',p:2.0,d:'4er'},
{c:'4241b',n:'Mühle 4 Rschl.',p:2.6,d:'4er'},
{c:'4242a',n:'Mühle rw.',p:3.1,d:'4er'},
{c:'4242b',n:'Mühle rw. angef.',p:4.0,d:'4er'},
{c:'4242c',n:'Mühle rw. an- u. abgef.',p:4.5,d:'4er'},
{c:'4243a',n:'Mühle Stg.',p:2.6,d:'4er'},
{c:'4243b',n:'Mühle Stg. frh.',p:3.4,d:'4er'},
{c:'4243c',n:'Mühle Stg. frh. angef.',p:4.4,d:'4er'},
{c:'4243d',n:'Mühle Stg. angef. frh.',p:4.9,d:'4er'},
{c:'4243e',n:'Mühle Stg. frh. an- u. abgef.',p:5.2,d:'4er'},
{c:'4243f',n:'Mühle Stg. an- u. abgef. frh.',p:5.7,d:'4er'},
{c:'4244a',n:'Mühle Stg rw. frh.',p:4.4,d:'4er'},
{c:'4244b',n:'Mühle Stg. rw. angef. frh.',p:6.5,d:'4er'},
{c:'4244c',n:'Mühle Stg. rw. an- u. abgef. frh.',p:7.0,d:'4er'},
{c:'4244d',n:'Mühle 4 Rschl. Stg. rw. frh.',p:8.0,d:'4er'},
{c:'4244e',n:'Mühle 4 Rschl. Stg. rw. an- u. abgef. frh.',p:9.0,d:'4er'},
{c:'4251a',n:'Innenring um 1 Stg.',p:2.8,d:'4er'},
{c:'4251b',n:'Innenring um 1 Stg. angef.',p:4.0,d:'4er'},
{c:'4251c',n:'Innenring um 1 Stg. angef. frh.',p:4.7,d:'4er'},
{c:'4251d',n:'Innenring um 1 Stg. an- u. abgef.',p:4.6,d:'4er'},
{c:'4251e',n:'Innenring um 1 Stg. an- u. abgef. frh.',p:5.5,d:'4er'},
{c:'4252a',n:'Innenring um 1 Stg. rw.',p:3.9,d:'4er'},
{c:'4252b',n:'Innenring um 1 Stg. rw. angef. frh.',p:6.8,d:'4er'},
{c:'4252c',n:'Innenring um 1 Stg. rw. an- u. abgef. frh.',p:7.8,d:'4er'},
{c:'4252d',n:'Innenring um 1 Stg. rw. angedr. u. abgef. frh. T (9,8)',p:8.8,d:'4er'},
{c:'4252e',n:'Innenring um 1 3 Rschl. um Dreh. Stg. rw. an- u. abgef. frh.',p:11.5,d:'4er'},
{c:'4258a',n:'Innenring Stg.',p:2.2,d:'4er'},
{c:'4258b',n:'Innenring Stg. angef.',p:3.4,d:'4er'},
{c:'4258c',n:'Innenring Stg. angef. frh.',p:3.9,d:'4er'},
{c:'4258d',n:'Innenring Stg. an- u. abgef.',p:4.0,d:'4er'},
{c:'4258e',n:'Innenring Stg. an- u. abgef. frh.',p:5.2,d:'4er'},
{c:'4259a',n:'Innenring Stg. rw.',p:3.1,d:'4er'},
{c:'4259b',n:'Innenring Stg. rw. angef. frh.',p:5.8,d:'4er'},
{c:'4259c',n:'Innenring Stg. rw. an- u. abgef. frh.',p:6.3,d:'4er'},
{c:'4259d',n:'Innenring Stg. rw. angedr. frh. T (8,0)',p:7.0,d:'4er'},
{c:'4259e',n:'Innenring Stg. rw. angedr. u. abgef. frh. T (8,5)',p:7.5,d:'4er'},
{c:'4267a',n:'Wechselring Stg.',p:2.7,d:'4er'},
{c:'4267b',n:'Wechselring HU. / Innenring HU. Stg.',p:4.1,d:'4er'},
{c:'4267c',n:'Wechselring Stg. angef.',p:3.9,d:'4er'},
{c:'4267d',n:'Wechselring Stg. angef. frh.',p:4.6,d:'4er'},
{c:'4267e',n:'Wechselring Stg. an- u. abgef.',p:4.5,d:'4er'},
{c:'4267f',n:'Wechselring Stg. an- u. abgef. frh.',p:5.9,d:'4er'},
{c:'4268a',n:'Wechselring Stg. rw.',p:3.8,d:'4er'},
{c:'4268b',n:'Wechselring HU. / Innenring HU. Stg. rw.',p:5.7,d:'4er'},
{c:'4268c',n:'Wechselring Stg. rw. angef. frh.',p:6.6,d:'4er'},
{c:'4268d',n:'Wechselring Stg. rw. an- u. abgef. frh.',p:7.7,d:'4er'},
{c:'4268e',n:'Wechselring Stg. rw. angedr. u. abgef. frh. T (8,8)',p:7.8,d:'4er'},
{c:'4272a',n:'Außenring Stg.',p:3.0,d:'4er'},
{c:'4272b',n:'Außenring Stg. angef.',p:4.2,d:'4er'},
{c:'4272c',n:'Außenring Stg. angef. frh.',p:5.0,d:'4er'},
{c:'4272d',n:'Außenring Stg. an- u. abgef.',p:4.8,d:'4er'},
{c:'4272e',n:'Außenring Stg. an- u. abgef. frh.',p:5.7,d:'4er'},
{c:'4272f',n:'Außenring HU. / Innenring HU. Stg.',p:4.4,d:'4er'},
{c:'4273a',n:'Außenring Stg. rw.',p:4.2,d:'4er'},
{c:'4273b',n:'Außenring Stg. rw. angef. frh.',p:7.1,d:'4er'},
{c:'4273c',n:'Außenring Stg. rw. an- u. abgef. frh.',p:8.2,d:'4er'},
{c:'4273d',n:'Außenring HU. / Innenring HU. Stg. rw.',p:6.2,d:'4er'},
{c:'4273e',n:'Außenring 4 Rschl. Stg. rw. an- u. abgef. frh.',p:10.7,d:'4er'},
{c:'4280a',n:'Halbe Torfahrt',p:0.8,d:'4er'},
{c:'4280b',n:'Torfahrt',p:1.2,d:'4er'},
{c:'4280c',n:'Halbe Synchrontorfahrt',p:1.4,d:'4er'},
{c:'4280d',n:'Synchrontorfahrt',p:2.8,d:'4er'},
{c:'4280e',n:'Gegentorfahrt glz.',p:3.4,d:'4er'},
{c:'4281a',n:'Halbe Torfahrt rw.',p:1.6,d:'4er'},
{c:'4281b',n:'Torfahrt rw.',p:2.4,d:'4er'},
{c:'4281c',n:'Halbe Synchrontorfahrt rw.',p:2.8,d:'4er'},
{c:'4281d',n:'Synchrontorfahrt rw.',p:3.6,d:'4er'},
{c:'4281e',n:'Gegentorfahrt glz. rw.',p:4.8,d:'4er'},
{c:'4281f',n:'Gegentorfahrt Wschl. glz. rw.',p:6.6,d:'4er'},
{c:'4282a',n:'Halbe Torfahrt Stg.',p:2.0,d:'4er'},
{c:'4282b',n:'Torfahrt Stg.',p:3.0,d:'4er'},
{c:'4282c',n:'Halbe Torfahrt Stg. frh.',p:2.6,d:'4er'},
{c:'4282d',n:'Torfahrt Stg. frh.',p:3.9,d:'4er'},
{c:'4283a',n:'Halbe Torfahrt Stg. rw. frh.',p:4.4,d:'4er'},
{c:'4283b',n:'Torfahrt Stg. rw. frh.',p:5.1,d:'4er'},
{c:'4284a',n:'Gegentorfahrt glz. Stg. rw. frh.',p:8.2,d:'4er'},
{c:'4284b',n:'Mühle mit Gegentorfahrt glz. Stg. rw. frh.',p:9.2,d:'4er'},
{c:'4285a',n:'Halbe Synchrontorfahrt Stg.',p:3.0,d:'4er'},
{c:'4285b',n:'Synchrontorfahrt Stg.',p:4.0,d:'4er'},
{c:'4285c',n:'Halbe Synchrontorfahrt Stg. frh.',p:4.1,d:'4er'},
{c:'4285d',n:'Synchrontorfahrt Stg. frh.',p:4.9,d:'4er'},
{c:'4286a',n:'Halbe Synchrontorfahrt Stg. rw. frh.',p:6.0,d:'4er'},
{c:'4286b',n:'Synchrontorfahrt Stg. rw. frh.',p:6.7,d:'4er'},
{c:'4287a',n:'Gegentorfahrt glz. Stg.',p:6.0,d:'4er'},
{c:'4287b',n:'Gegentorfahrt glz. Stg. frh.',p:6.8,d:'4er'},
{c:'4288a',n:'Mühle mit halber Synchrontorfahrt Stg. rw. frh.',p:6.0,d:'4er'},
{c:'4288b',n:'Mühle mit Synchrontorfahrt Stg. rw. frh.',p:7.2,d:'4er'},
{c:'4289a',n:'Mühle mit Synchrontorfahrt Stg.',p:5.1,d:'4er'},
{c:'4289b',n:'Mühle mit Gegentorfahrt glz. Stg.',p:6.6,d:'4er'},
{c:'4290a',n:'Schleifentorfahrt glz. Stg. rw. frh.',p:9.4,d:'4er'},
{c:'4291a',n:'Doppeltorfahrt',p:1.4,d:'4er'},
{c:'4292a',n:'Doppeltorfahrt rw.',p:3.8,d:'4er'},
{c:'4292b',n:'Schlangenbogendoppeltorfahrt rw.',p:5.1,d:'4er'},
{c:'4293a',n:'Doppeltorfahrt Stg. rw. frh.',p:7.0,d:'4er'},
{c:'4293b',n:'Turbine Doppeltorfahrt gegenf. Stg. rw. frh.',p:9.9,d:'4er'},
{c:'4294a',n:'Schlangenbogendoppeltorfahrt Stg. rw. frh.',p:7.7,d:'4er'},
{c:'4294b',n:'Turbine Schlangenbogendoppeltorfahrt gegenf. Stg. rw. frh.',p:9.6,d:'4er'},
{c:'4296a',n:'Wschl. Torfahrt rw.',p:5.2,d:'4er'},
{c:'4297a',n:'Wschl. Torfahrt Stg. rw. frh.',p:9.6,d:'4er'},
{c:'4298a',n:'Gegentorfahrt Wschl. glz. Stg. rw. frh.',p:11.2,d:'4er'},
{c:'4298b',n:'Mühle mit Gegentorfahrt Wschl. glz. Stg. rw. frh.',p:12.2,d:'4er'},
{c:'4307a',n:'Halber Torring Stg. rw.',p:5.1,d:'4er'},
{c:'4307b',n:'Torring Stg. rw.',p:6.5,d:'4er'},
{c:'4307c',n:'Zirkel mit Innenring gegenf. Stg. rw.',p:8.4,d:'4er'},
{c:'4316a',n:'Innenstern',p:1.7,d:'4er'},
{c:'4316b',n:'Innenstern 4 Lschl.',p:2.2,d:'4er'},
{c:'4317a',n:'Innenstern Stg.',p:3.2,d:'4er'},
{c:'4317b',n:'Innenstern Stg. 2er angef. frh.',p:4.2,d:'4er'},
{c:'4317c',n:'Innenstern Stg. 4er angef. frh.',p:5.2,d:'4er'},
{c:'4317d',n:'Innenstern Stg. angef.',p:5.4,d:'4er'},
{c:'4317e',n:'Innenstern Stg. angef. frh.',p:6.0,d:'4er'},
{c:'4317f',n:'Innenstern Stg. rw. angef. frh.',p:9.2,d:'4er'},
{c:'4317g',n:'Innenstern 4 Lschl. Stg. rw. angef. frh.',p:10.6,d:'4er'},
{c:'4317h',n:'Innenstern 4 Rschl. Stg. rw. angef. frh.',p:11.2,d:'4er'},
{c:'4326a',n:'Außenstern',p:1.0,d:'4er'},
{c:'4326b',n:'Außenstern rw. angef.',p:3.0,d:'4er'},
{c:'4326c',n:'Außenstern 4 Lschl. rw. angef.',p:4.1,d:'4er'},
{c:'4327a',n:'Wechselstern',p:1.4,d:'4er'},
{c:'4327b',n:'Wechselstern Stg.',p:3.5,d:'4er'},
{c:'4327c',n:'Wechselstern Stg. angef.',p:4.7,d:'4er'},
{c:'4327d',n:'Wechselstern Stg. angef. frh.',p:5.1,d:'4er'},
{c:'4327e',n:'Wechselstern Stg. rw. angef. frh.',p:8.0,d:'4er'},
{c:'4328a',n:'Außenstern Stg.',p:2.5,d:'4er'},
{c:'4328b',n:'Außenstern Stg. rw. 2er angef. frh.',p:4.6,d:'4er'},
{c:'4328c',n:'Außenstern Stg. rw. 4er angef. frh.',p:3.9,d:'4er'},
{c:'4328d',n:'Außenstern Stg. rw. angef. frh.',p:6.3,d:'4er'},
{c:'4328e',n:'Außenstern 4 Lschl. Stg. rw. angef. frh.',p:8.2,d:'4er'},
{c:'4328f',n:'Außenstern 4 Rschl. Stg. rw. angef. frh.',p:8.8,d:'4er'},
{c:'4331a',n:'Innenstern Stg. ½ Standdrehung',p:6.7,d:'4er'},
{c:'4331b',n:'Innenstern Stg. 1 Standdrehung',p:9.7,d:'4er'},
{c:'4341a',n:'2er Stg. ½ Standdrehung',p:6.0,d:'4er'},
{c:'4341b',n:'2er Stg. 1 Standdrehung',p:7.0,d:'4er'},
{c:'4341c',n:'2er Stg. 1½ Standdrehungen',p:8.0,d:'4er'},
{c:'4341d',n:'2er Stg. 2 Standdrehungen',p:9.0,d:'4er'},
{c:'6001a',n:'6 hinter. HR.',p:0.8,d:'6er'},
{c:'6001b',n:'6 hinter. R.',p:1.0,d:'6er'},
{c:'6001c',n:'6 hinter. HR. 6 Lschl.',p:1.4,d:'6er'},
{c:'6001d',n:'6 hinter. R. 6 Lschl.',p:1.6,d:'6er'},
{c:'6001e',n:'6 hinter. HR. 6 Rschl.',p:1.4,d:'6er'},
{c:'6001f',n:'6 hinter. R. 6 Rschl.',p:1.6,d:'6er'},
{c:'6001g',n:'6 hinter. HR. 3 Lschl. 3 Rschl.',p:1.6,d:'6er'},
{c:'6001h',n:'6 hinter. R. 3 Lschl. 3 Rschl.',p:1.8,d:'6er'},
{c:'6001i',n:'6 hinter. 6 Wschl. überlagernd',p:2.7,d:'6er'},
{c:'6002a',n:'6 hinter. HR. rw.',p:1.6,d:'6er'},
{c:'6002b',n:'6 hinter. R. rw.',p:2.0,d:'6er'},
{c:'6002c',n:'6 hinter. HR. 6 Lschl. rw.',p:2.7,d:'6er'},
{c:'6002d',n:'6 hinter. R. 6 Lschl. rw.',p:3.1,d:'6er'},
{c:'6002e',n:'6 hinter. 6 Wschl. überlagernd rw.',p:4.9,d:'6er'},
{c:'6003a',n:'6 hinter. HR. Stg.',p:2.0,d:'6er'},
{c:'6003b',n:'6 hinter. R. Stg.',p:2.5,d:'6er'},
{c:'6003c',n:'6 hinter. HR. Stg. frh.',p:2.6,d:'6er'},
{c:'6003d',n:'6 hinter. R. Stg. frh.',p:3.3,d:'6er'},
{c:'6003e',n:'6 hinter. HR. 6 Lschl. Stg.',p:3.4,d:'6er'},
{c:'6003f',n:'6 hinter. R. 6 Lschl. Stg.',p:3.9,d:'6er'},
{c:'6003g',n:'6 hinter. HR. 6 Lschl. Stg. frh.',p:4.4,d:'6er'},
{c:'6003h',n:'6 hinter. R. 6 Lschl. Stg. frh.',p:5.1,d:'6er'},
{c:'6004a',n:'6 hinter. HR. Stg. rw. frh.',p:3.4,d:'6er'},
{c:'6004b',n:'6 hinter. R. Stg. rw. frh.',p:4.3,d:'6er'},
{c:'6004c',n:'6 hinter. HR. 6 Lschl. Stg. rw. frh.',p:5.8,d:'6er'},
{c:'6004d',n:'6 hinter. R. 6 Lschl. Stg. rw. frh.',p:6.6,d:'6er'},
{c:'6004e',n:'6 hinter. HR. 6 Rschl. Stg. rw. frh.',p:6.0,d:'6er'},
{c:'6004f',n:'6 hinter. R. 6 Rschl. Stg. rw. frh.',p:6.8,d:'6er'},
{c:'6004g',n:'6 hinter. HR. 3 Lschl. 3 Rschl. Stg. rw. frh.',p:6.6,d:'6er'},
{c:'6004h',n:'6 hinter. R. 3 Lschl. 3 Rschl. Stg. rw. frh.',p:7.5,d:'6er'},
{c:'6004i',n:'6 hinter. 6 Wschl. überlagernd Stg. rw. frh.',p:9.4,d:'6er'},
{c:'6006a',n:'6 hinter. Schrägzug',p:1.0,d:'6er'},
{c:'6006b',n:'6 hinter. Schrägzug 3 Lschl. 3 Rschl.',p:1.8,d:'6er'},
{c:'6007a',n:'6 hinter. S',p:1.8,d:'6er'},
{c:'6007b',n:'6 hinter. 8',p:2.2,d:'6er'},
{c:'6007c',n:'6 hinter. 8 durch.',p:2.6,d:'6er'},
{c:'6008a',n:'6 hinter. S rw.',p:3.6,d:'6er'},
{c:'6008b',n:'6 hinter. 8 rw.',p:4.4,d:'6er'},
{c:'6008c',n:'6 hinter. 8 durch. rw.',p:5.2,d:'6er'},
{c:'6010a',n:'6 hinter. S Stg. rw. frh.',p:7.7,d:'6er'},
{c:'6010b',n:'6 hinter. 8 Stg. rw. frh.',p:9.4,d:'6er'},
{c:'6010c',n:'6 hinter. 8 durch. Stg. rw. frh.',p:10.6,d:'6er'},
{c:'6011a',n:'6 hinter. Längszug',p:1.0,d:'6er'},
{c:'6011b',n:'6 hinter. Längszug 3 Lschl. 3 Rschl.',p:1.8,d:'6er'},
{c:'6012a',n:'3 hinter. Gegenlängszug',p:1.6,d:'6er'},
{c:'6012b',n:'3 hinter. Gegenlängszug 3 Mühlen',p:2.7,d:'6er'},
{c:'6013a',n:'3 neben. Gegenlängszug',p:1.2,d:'6er'},
{c:'6013b',n:'3 neben. Gegenlängszug 6 Lschl.',p:1.7,d:'6er'},
{c:'6013c',n:'3 neben. Gegenlängszug durch.',p:1.6,d:'6er'},
{c:'6013d',n:'3 neben. Gegenlängszug durch. 6 Lschl.',p:2.1,d:'6er'},
{c:'6013e',n:'3 neben. Gegenlängszug durch. 6 Rschl.',p:2.2,d:'6er'},
{c:'6013f',n:'3 neben. Gegenlängszug durch. 3 Mühlen',p:2.7,d:'6er'},
{c:'6014a',n:'3 hinter. Gegenschrägzug',p:1.6,d:'6er'},
{c:'6015a',n:'6 neben. halbe Quer-Wschl.',p:2.0,d:'6er'},
{c:'6015b',n:'6 neben. Quer-Wschl.',p:2.4,d:'6er'},
{c:'6016a',n:'6 neben. halbe Quer-Wschl. Stg. rw. frh.',p:8.7,d:'6er'},
{c:'6016b',n:'6 neben. Quer-Wschl. Stg. rw. frh.',p:10.4,d:'6er'},
{c:'6017a',n:'6 neben. Querzug',p:1.0,d:'6er'},
{c:'6017b',n:'6 neben. Querzug 6 Lschl.',p:1.6,d:'6er'},
{c:'6018a',n:'6 neben. Querzug rw.',p:2.1,d:'6er'},
{c:'6018b',n:'6 neben. Querzug 6 Lschl. rw.',p:3.2,d:'6er'},
{c:'6024a',n:'2er Flügelmühle HU. Dreh. Stg. rw. frh. T (11,3)',p:10.3,d:'6er'},
{c:'6024b',n:'2er Flügelmühle Dreh. Stg. rw. frh. T (12,2)',p:11.2,d:'6er'},
{c:'6025a',n:'3er Flügelmühle HU. Dreh. Stg. rw. frh. T (10,3)',p:9.3,d:'6er'},
{c:'6025b',n:'3er Flügelmühle Dreh. Stg. rw. frh. T (11,2)',p:10.2,d:'6er'},
{c:'6026a',n:'3 hinter. halbe Doppelrunde',p:0.8,d:'6er'},
{c:'6026b',n:'3 hinter. Doppelrunde',p:1.2,d:'6er'},
{c:'6026c',n:'3 hinter. halbe Doppelrunde 6 Lschl.',p:1.4,d:'6er'},
{c:'6026d',n:'3 hinter. Doppelrunde 6 Lschl.',p:1.8,d:'6er'},
{c:'6027a',n:'3 hinter. halbe Doppelrunde rw.',p:1.7,d:'6er'},
{c:'6027b',n:'3 hinter. Doppelrunde rw.',p:2.5,d:'6er'},
{c:'6027c',n:'3 hinter. halbe Doppelrunde 6 Lschl. rw.',p:2.8,d:'6er'},
{c:'6027d',n:'3 hinter. Doppelrunde 6 Lschl. rw.',p:3.6,d:'6er'},
{c:'6028a',n:'3 hinter. halbe Doppelrunde Stg.',p:2.1,d:'6er'},
{c:'6028b',n:'3 hinter. Doppelrunde Stg.',p:3.1,d:'6er'},
{c:'6028c',n:'3 hinter. halbe Doppelrunde Stg frh.',p:2.7,d:'6er'},
{c:'6028d',n:'3 hinter. Doppelrunde Stg frh.',p:3.5,d:'6er'},
{c:'6028e',n:'3 hinter. halbe Doppelrunde 6 Lschl. Stg.',p:3.5,d:'6er'},
{c:'6028f',n:'3 hinter. Doppelrunde 6 Lschl. Stg.',p:4.5,d:'6er'},
{c:'6028g',n:'3 hinter. halbe Doppelrunde 6 Lschl. Stg. frh.',p:4.6,d:'6er'},
{c:'6028h',n:'3 hinter. Doppelrunde 6 Lschl. Stg. frh.',p:5.4,d:'6er'},
{c:'6029a',n:'3 hinter. halbe Doppelrunde Stg. rw. frh.',p:4.1,d:'6er'},
{c:'6029b',n:'3 hinter. Doppelrunde Stg. rw. frh.',p:5.3,d:'6er'},
{c:'6029c',n:'3 hinter. halbe Doppelrunde 6 Lschl. Stg. rw. frh.',p:6.5,d:'6er'},
{c:'6029d',n:'3 hinter. Doppelrunde 6 Lschl. Stg. rw. frh.',p:7.7,d:'6er'},
{c:'6039a',n:'3 neben. Gegenquerzug',p:1.2,d:'6er'},
{c:'6039b',n:'3 neben. Gegenquerzug 6 Lschl.',p:1.7,d:'6er'},
{c:'6039c',n:'3 neben. Gegenquerzug durch.',p:1.6,d:'6er'},
{c:'6039d',n:'3 neben. Gegenquerzug durch. 6 Lschl.',p:2.1,d:'6er'},
{c:'6039e',n:'3 neben. Gegenquerzug durch. 3 Mühlen',p:2.7,d:'6er'},
{c:'6039f',n:'3 neben. halbe Ggquer-Wschl.',p:2.0,d:'6er'},
{c:'6039g',n:'3 neben. Ggquer-Wschl.',p:2.4,d:'6er'},
{c:'6040a',n:'3 neben. Gegenquerzug rw.',p:2.3,d:'6er'},
{c:'6040b',n:'3 neben. Gegenquerzug durch. rw.',p:3.1,d:'6er'},
{c:'6040c',n:'3 neben. Gegenquerzug 6 Lschl. rw.',p:3.4,d:'6er'},
{c:'6040d',n:'3 neben. halbe Ggquer-Wschl. rw.',p:3.9,d:'6er'},
{c:'6040e',n:'3 neben. Ggquer-Wschl. rw.',p:4.7,d:'6er'},
{c:'6042a',n:'3 neben. halbe Ggquer-Wschl. Stg. rw. frh.',p:9.0,d:'6er'},
{c:'6042b',n:'3 neben. Ggquer-Wschl. Stg. rw. frh.',p:10.0,d:'6er'},
{c:'6042c',n:'3 neben. Ggquer-Wschl. durch. Stg. rw. frh. T (11,3 -',p:12.1,d:'6er'},
{c:'6052a',n:'2 hinter. Querzug',p:1.0,d:'6er'},
{c:'6052b',n:'2 hinter. Querzug 6 Lschl.',p:1.6,d:'6er'},
{c:'6053a',n:'2 hinter. Querzug rw.',p:2.0,d:'6er'},
{c:'6053b',n:'2 hinter. Querzug 6 Lschl. rw.',p:3.1,d:'6er'},
{c:'6061a',n:'Triple R.',p:1.8,d:'6er'},
{c:'6062a',n:'Triple R. rw.',p:3.6,d:'6er'},
{c:'6063a',n:'Triple R. Stg.',p:3.4,d:'6er'},
{c:'6063b',n:'Triple R. Stg. frh.',p:3.9,d:'6er'},
{c:'6064a',n:'Triple R. Stg. rw. frh.',p:6.0,d:'6er'},
{c:'6081a',n:'2er HR.',p:0.4,d:'6er'},
{c:'6081b',n:'2er R.',p:0.6,d:'6er'},
{c:'6081c',n:'2er HR. 2er Lschl.',p:0.6,d:'6er'},
{c:'6081d',n:'2er R. 2er Lschl.',p:1.0,d:'6er'},
{c:'6081e',n:'2er HR. 6 Lschl.',p:1.2,d:'6er'},
{c:'6081f',n:'2er R. 6 Lschl.',p:1.4,d:'6er'},
{c:'6082a',n:'2er HR. rw.',p:0.8,d:'6er'},
{c:'6082b',n:'2er R. rw.',p:1.2,d:'6er'},
{c:'6082c',n:'2er HR. 2er Lschl. rw.',p:1.1,d:'6er'},
{c:'6082d',n:'2er R. 2er Lschl. rw.',p:1.5,d:'6er'},
{c:'6082e',n:'2er HR. 6 Lschl. rw.',p:2.9,d:'6er'},
{c:'6082f',n:'2er R. 6 Lschl. rw.',p:3.3,d:'6er'},
{c:'6083a',n:'2er HR. Stg.',p:1.0,d:'6er'},
{c:'6083b',n:'2er R. Stg.',p:1.5,d:'6er'},
{c:'6083c',n:'2er HR. Stg. frh.',p:1.3,d:'6er'},
{c:'6083d',n:'2er R. Stg. frh.',p:2.0,d:'6er'},
{c:'6083e',n:'2er HR. 2er Lschl. Stg.',p:1.9,d:'6er'},
{c:'6083f',n:'2er R. 2er Lschl. Stg.',p:2.4,d:'6er'},
{c:'6083g',n:'2er HR. 2er Lschl. Stg. frh.',p:2.3,d:'6er'},
{c:'6083h',n:'2er R. 2er Lschl. Stg. frh.',p:3.0,d:'6er'},
{c:'6083i',n:'2er HR. 6 Lschl. Stg.',p:2.9,d:'6er'},
{c:'6083j',n:'2er R. 6 Lschl. Stg.',p:3.4,d:'6er'},
{c:'6083k',n:'2er HR. 6 Lschl. Stg. frh.',p:3.6,d:'6er'},
{c:'6083l',n:'2er R. 6 Lschl. Stg. frh.',p:4.3,d:'6er'},
{c:'6084a',n:'2er HR. Stg. rw. frh.',p:1.7,d:'6er'},
{c:'6084b',n:'2er R. Stg. rw. frh.',p:2.6,d:'6er'},
{c:'6084c',n:'2er HR. 2er Lschl. Stg. rw. frh.',p:2.4,d:'6er'},
{c:'6084d',n:'2er R. 2er Lschl. Stg. rw. frh.',p:3.2,d:'6er'},
{c:'6084e',n:'2er HR. 6 Lschl. Stg. rw. frh.',p:5.1,d:'6er'},
{c:'6084f',n:'2er R. 6 Lschl. Stg. rw. frh.',p:5.9,d:'6er'},
{c:'6091a',n:'2er hinter. Längszug Stg. frh.',p:2.0,d:'6er'},
{c:'6091b',n:'2er hinter. Längszug 2er Lschl. Stg. frh.',p:2.5,d:'6er'},
{c:'6091c',n:'2er hinter. Längszug 2er Rschl. Stg. frh.',p:2.7,d:'6er'},
{c:'6091d',n:'2er hinter. Längszug 6 Lschl. Stg. frh.',p:3.8,d:'6er'},
{c:'6092a',n:'2er hinter. Längszug Stg. rw. frh.',p:2.6,d:'6er'},
{c:'6092b',n:'2er hinter. Längszug 3 Lschl. 3 Rschl. Stg. rw. frh.',p:6.8,d:'6er'},
{c:'6093a',n:'3er Gegenlängszug durch. 6 Lschl. Stg. rw. frh.',p:9.2,d:'6er'},
{c:'6093b',n:'3er Gegenlängszug durch. 6 Rschl. Stg. rw. frh.',p:10.4,d:'6er'},
{c:'6093c',n:'3er Gegenlängszug durch. 3 Mühlen Stg. rw. frh.',p:11.6,d:'6er'},
{c:'6096a',n:'2er Querzug',p:0.6,d:'6er'},
{c:'6096b',n:'2er Querzug 2er Lschl.',p:0.8,d:'6er'},
{c:'6096c',n:'2er Querzug 2er Rschl.',p:0.8,d:'6er'},
{c:'6096d',n:'2er Querzug 6 Lschl.',p:1.7,d:'6er'},
{c:'6097a',n:'2er Querzug rw.',p:1.2,d:'6er'},
{c:'6097b',n:'2er Querzug 2er Lschl. rw.',p:1.7,d:'6er'},
{c:'6097c',n:'2er Querzug 6 Lschl. rw',p:2.5,d:'6er'},
{c:'6098a',n:'2er Querzug Stg.',p:1.5,d:'6er'},
{c:'6098b',n:'2er Querzug Stg. frh.',p:2.0,d:'6er'},
{c:'6098c',n:'2er Querzug 2er Lschl. Stg.',p:1.9,d:'6er'},
{c:'6098d',n:'2er Querzug 2er Lschl. Stg. frh.',p:2.5,d:'6er'},
{c:'6098e',n:'2er Querzug 2er Rschl. Stg. frh.',p:2.7,d:'6er'},
{c:'6098f',n:'2er Querzug 6 Lschl. Stg.',p:3.9,d:'6er'},
{c:'6098g',n:'2er Querzug 6 Lschl. Stg. frh.',p:4.8,d:'6er'},
{c:'6099a',n:'2er Querzug Stg. rw. frh.',p:2.6,d:'6er'},
{c:'6099b',n:'2er Querzug 2er Lschl. Stg. rw. frh.',p:3.2,d:'6er'},
{c:'6099c',n:'2er Querzug 2er Rschl. Stg. rw. frh.',p:3.6,d:'6er'},
{c:'6099d',n:'2er Querzug 6 Lschl. Stg. rw. frh.',p:6.4,d:'6er'},
{c:'6106a',n:'2er halbe Quer-Wschl.',p:0.7,d:'6er'},
{c:'6106b',n:'2er Quer-Wschl.',p:1.1,d:'6er'},
{c:'6107a',n:'2er halbe Quer-Wschl. rw.',p:1.4,d:'6er'},
{c:'6107b',n:'2er Quer-Wschl. rw.',p:2.2,d:'6er'},
{c:'6108a',n:'2er halbe Quer-Wschl. Stg.',p:1.8,d:'6er'},
{c:'6108b',n:'2er Quer-Wschl. Stg.',p:2.8,d:'6er'},
{c:'6108c',n:'2er halbe Quer-Wschl. Stg. frh.',p:2.3,d:'6er'},
{c:'6108d',n:'2er Quer-Wschl. Stg. frh.',p:3.6,d:'6er'},
{c:'6109a',n:'2er halbe Quer-Wschl. Stg. rw. frh.',p:3.0,d:'6er'},
{c:'6109b',n:'2er Quer-Wschl. Stg. rw. frh.',p:4.7,d:'6er'},
{c:'6121a',n:'Drei Mühlen',p:0.8,d:'6er'},
{c:'6121b',n:'Drei Mühlen 6 Rschl.',p:1.4,d:'6er'},
{c:'6122a',n:'Drei Mühlen rw.',p:1.7,d:'6er'},
{c:'6122b',n:'Drei Mühlen rw. angef.',p:2.6,d:'6er'},
{c:'6122c',n:'Drei Mühlen rw. an -u. abgef.',p:3.1,d:'6er'},
{c:'6123a',n:'Drei Mühlen Stg.',p:2.1,d:'6er'},
{c:'6123b',n:'Drei Mühlen Stg. frh.',p:2.7,d:'6er'},
{c:'6123c',n:'Drei Mühlen Stg. frh. angef.',p:4.3,d:'6er'},
{c:'6123d',n:'Drei Mühlen Stg. angef. frh.',p:4.3,d:'6er'},
{c:'6123e',n:'Drei Mühlen Stg. frh. an- u. abgef.',p:4.6,d:'6er'},
{c:'6123f',n:'Drei Mühlen Stg. an- u. abgef. frh.',p:5.1,d:'6er'},
{c:'6124a',n:'Drei Mühlen Stg. rw. frh.',p:3.6,d:'6er'},
{c:'6124b',n:'Drei Mühlen Stg. rw. angef. frh.',p:5.6,d:'6er'},
{c:'6124c',n:'Drei Mühlen Stg. rw. an- u. abgef. frh.',p:6.6,d:'6er'},
{c:'6124d',n:'Drei Mühlen Dreh. Stg. rw. an- u. abgef. frh. T (10,4)',p:9.4,d:'6er'},
{c:'6124e',n:'Drei Mühlen 6 Rschl. Stg. rw. an- u. abgef. frh.',p:7.7,d:'6er'},
{c:'6133a',n:'Drei Innenringe Stg.',p:1.7,d:'6er'},
{c:'6133b',n:'Drei Innenringe Stg. angef.',p:2.9,d:'6er'},
{c:'6133c',n:'Drei Innenringe Stg. angef. frh.',p:3.8,d:'6er'},
{c:'6133d',n:'Drei Innenringe Stg. an- u. abgef.',p:3.5,d:'6er'},
{c:'6133e',n:'Drei Innenringe Stg. an- u. abgef. frh.',p:4.6,d:'6er'},
{c:'6134a',n:'Drei Innenringe Stg. rw.',p:2.4,d:'6er'},
{c:'6134b',n:'Drei Innenringe Stg. rw. angef. frh.',p:4.9,d:'6er'},
{c:'6134c',n:'Drei Innenringe Stg. rw. an- u. abgef. frh.',p:6.0,d:'6er'},
{c:'6134d',n:'Drei Innenringe 6 Rschl. Stg. rw. an- u. abgef. frh.',p:8.5,d:'6er'},
{c:'6134e',n:'Drei Innenringe Dreh. Stg. rw. an- u. abgef. frh. T (11,7)',p:10.7,d:'6er'},
{c:'6135a',n:'Drei Außenringe Stg.',p:2.5,d:'6er'},
{c:'6135b',n:'Drei Außenringe Stg. angef.',p:3.7,d:'6er'},
{c:'6135c',n:'Drei Außenringe Stg. angef. frh.',p:4.8,d:'6er'},
{c:'6135d',n:'Drei Außenringe Stg. an- u. abgef.',p:4.3,d:'6er'},
{c:'6135e',n:'Drei Außenringe Stg. an- u. abgef. frh',p:5.6,d:'6er'},
{c:'6136a',n:'Drei Außenringe Stg. rw.',p:3.5,d:'6er'},
{c:'6136b',n:'Drei Außenringe Stg. rw. angef. frh.',p:6.3,d:'6er'},
{c:'6136c',n:'Drei Außenringe Stg. rw. an- u. abgef. frh.',p:7.3,d:'6er'},
{c:'6136d',n:'Drei Außenringe Dreh. Stg. rw. an- u. abgef. frh. T (10,9)',p:9.9,d:'6er'},
{c:'6136e',n:'Drei Außenringe 6 Rschl. Stg. rw. an- u. abgef. frh.',p:12.1,d:'6er'},
{c:'6151a',n:'3er HR.',p:0.7,d:'6er'},
{c:'6151b',n:'3er R.',p:0.9,d:'6er'},
{c:'6151c',n:'3er HR. 6 Lschl.',p:1.3,d:'6er'},
{c:'6151d',n:'3er R. 6 Lschl.',p:1.5,d:'6er'},
{c:'6152a',n:'3er HR. rw.',p:1.4,d:'6er'},
{c:'6152b',n:'3er R. rw.',p:1.8,d:'6er'},
{c:'6152c',n:'3er HR. 6 Lschl. rw.',p:2.6,d:'6er'},
{c:'6152d',n:'3er R. 6 Lschl. rw.',p:3.0,d:'6er'},
{c:'6153a',n:'3er HR. Stg.',p:1.8,d:'6er'},
{c:'6153b',n:'3er R. Stg.',p:2.3,d:'6er'},
{c:'6153c',n:'3er HR. Stg. frh.',p:2.3,d:'6er'},
{c:'6153d',n:'3er R. Stg. frh.',p:3.0,d:'6er'},
{c:'6153e',n:'3er HR. 6 Lschl. Stg.',p:3.2,d:'6er'},
{c:'6153f',n:'3er R. 6 Lschl. Stg.',p:3.7,d:'6er'},
{c:'6153g',n:'3er HR. 6 Lschl. Stg. frh.',p:4.2,d:'6er'},
{c:'6153h',n:'3er R. 6 Lschl. Stg. frh.',p:4.8,d:'6er'},
{c:'6154a',n:'3er HR. Stg. rw. frh.',p:3.1,d:'6er'},
{c:'6154b',n:'3er R. Stg. rw. frh.',p:3.9,d:'6er'},
{c:'6154c',n:'3er HR. 6 Lschl. Stg. rw. frh.',p:5.4,d:'6er'},
{c:'6154d',n:'3er R. 6 Lschl. Stg. rw. frh.',p:6.3,d:'6er'},
{c:'6165a',n:'3er Querzug',p:0.9,d:'6er'},
{c:'6165b',n:'3er Querzug 6 Lschl.',p:1.5,d:'6er'},
{c:'6165c',n:'3er Querzug 6 Rschl.',p:1.5,d:'6er'},
{c:'6166a',n:'3er Querzug rw.',p:1.8,d:'6er'},
{c:'6166b',n:'3er Querzug 6 Lschl. rw.',p:3.0,d:'6er'},
{c:'6166c',n:'3er Querzug 6 Rschl. rw.',p:3.0,d:'6er'},
{c:'6167a',n:'3er Querzug Stg.',p:2.3,d:'6er'},
{c:'6167b',n:'3er Querzug Stg. frh.',p:3.0,d:'6er'},
{c:'6167c',n:'3er Querzug 6 Lschl. Stg.',p:3.7,d:'6er'},
{c:'6167d',n:'3er Querzug 6 Lschl. Stg. frh.',p:4.8,d:'6er'},
{c:'6168a',n:'3er Querzug Stg. rw. frh.',p:3.9,d:'6er'},
{c:'6168b',n:'3er Querzug 6 Lschl. Stg. rw. frh.',p:6.3,d:'6er'},
{c:'6168c',n:'3er Querzug 6 Rschl. Stg. rw. frh.',p:7.2,d:'6er'},
{c:'6170a',n:'3er Gegenquerzug',p:1.2,d:'6er'},
{c:'6170b',n:'3er Gegenquerzug 6 Lschl.',p:1.8,d:'6er'},
{c:'6171a',n:'3er Gegenquerzug rw.',p:2.4,d:'6er'},
{c:'6171b',n:'3er Gegenquerzug 6 Lschl. rw.',p:3.5,d:'6er'},
{c:'6172a',n:'3er Gegenquerzug Stg.',p:3.0,d:'6er'},
{c:'6172b',n:'3er Gegenquerzug Stg. frh.',p:3.9,d:'6er'},
{c:'6172c',n:'3er Gegenquerzug 6 Lschl. Stg.',p:4.9,d:'6er'},
{c:'6172d',n:'3er Gegenquerzug 6 Lschl. Stg. frh.',p:5.7,d:'6er'},
{c:'6173a',n:'3er Gegenquerzug Stg. rw. frh.',p:4.1,d:'6er'},
{c:'6173b',n:'3er Gegenquerzug 6 Lschl. Stg. rw. frh.',p:7.5,d:'6er'},
{c:'6184a',n:'Umfahrt 1 um 1',p:1.6,d:'6er'},
{c:'6185a',n:'Umfahrt 1 um 1 rw.',p:2.2,d:'6er'},
{c:'6186a',n:'Umfahrt 2er um 1',p:1.2,d:'6er'},
{c:'6187a',n:'Umfahrt 2er um 1 rw.',p:2.4,d:'6er'},
{c:'6208a',n:'Zwei Turbinen Stg.',p:3.0,d:'6er'},
{c:'6208b',n:'Zwei Turbinen Stg. frh.',p:3.9,d:'6er'},
{c:'6208c',n:'Zwei Turbinen Stg. frh. angef.',p:4.5,d:'6er'},
{c:'6208d',n:'Zwei Turbinen Stg. angef. frh.',p:4.5,d:'6er'},
{c:'6208e',n:'Zwei Turbinen Stg. frh. an- u. abgef.',p:4.7,d:'6er'},
{c:'6208f',n:'Zwei Turbinen Stg. an- u. abgef. frh.',p:5.2,d:'6er'},
{c:'6209a',n:'Zwei Turbinen Stg. rw. frh',p:4.1,d:'6er'},
{c:'6209b',n:'Zwei Turbinen Stg. rw. angef. frh.',p:6.1,d:'6er'},
{c:'6209c',n:'Zwei Turbinen Stg. rw. an- u. abgef. frh.',p:6.7,d:'6er'},
{c:'6209d',n:'Zwei Turbinen Dreh. Stg. rw. an- u. abgef. frh.',p:7.9,d:'6er'},
{c:'6216a',n:'Zwei Mühlen',p:0.8,d:'6er'},
{c:'6217a',n:'Zwei Mühlen rw.',p:1.7,d:'6er'},
{c:'6217b',n:'Zwei Mühlen rw. angef.',p:2.6,d:'6er'},
{c:'6217c',n:'Zwei Mühlen rw. an- u. abgef.',p:3.1,d:'6er'},
{c:'6218a',n:'Zwei Mühlen Stg.',p:2.1,d:'6er'},
{c:'6218b',n:'Zwei Mühlen Stg. frh.',p:2.7,d:'6er'},
{c:'6218c',n:'Zwei Mühlen Stg. frh. angef.',p:4.3,d:'6er'},
{c:'6218d',n:'Zwei Mühlen Stg. angef. frh.',p:4.3,d:'6er'},
{c:'6218e',n:'Zwei Mühlen Stg. frh. an- u. abgef.',p:4.6,d:'6er'},
{c:'6218f',n:'Zwei Mühlen Stg. an- u. abgef. frh.',p:5.1,d:'6er'},
{c:'6219a',n:'Zwei Mühlen Stg. rw. frh.',p:3.6,d:'6er'},
{c:'6219b',n:'Zwei Mühlen Stg. rw. angef. frh.',p:5.6,d:'6er'},
{c:'6219c',n:'Zwei Mühlen Stg. rw. an- u. abgef. frh.',p:6.6,d:'6er'},
{c:'6219d',n:'Zwei Mühlen 6 Rschl. Stg. rw. an- u. abgef. frh.',p:9.2,d:'6er'},
{c:'6228a',n:'Zwei Innenringe Stg.',p:1.7,d:'6er'},
{c:'6228b',n:'Zwei Innenringe Stg. angef.',p:3.4,d:'6er'},
{c:'6228c',n:'Zwei Innenringe Stg. angef. frh.',p:3.8,d:'6er'},
{c:'6228d',n:'Zwei Innenringe Stg. an- u. abgef.',p:4.0,d:'6er'},
{c:'6228e',n:'Zwei Innenringe Stg. an- u. abgef. frh.',p:4.6,d:'6er'},
{c:'6229a',n:'Zwei Innenringe Stg. rw.',p:2.4,d:'6er'},
{c:'6229b',n:'Zwei Innenringe Stg. rw. angef. frh.',p:4.9,d:'6er'},
{c:'6229c',n:'Zwei Innenringe Stg. rw. an- u. abgef. frh.',p:6.0,d:'6er'},
{c:'6229d',n:'Zwei Innenringe 6 Rschl. Stg. rw. an- u. abgef. frh.',p:8.5,d:'6er'},
{c:'6236a',n:'Zwei Außenringe Stg.',p:2.5,d:'6er'},
{c:'6236b',n:'Zwei Außenringe Stg. angef.',p:4.2,d:'6er'},
{c:'6236c',n:'Zwei Außenringe Stg. angef. frh.',p:4.8,d:'6er'},
{c:'6236d',n:'Zwei Außenringe Stg. an- u. abgef.',p:4.3,d:'6er'},
{c:'6236e',n:'Zwei Außenringe Stg. an­ u. abgef. frh.',p:4.8,d:'6er'},
{c:'6236f',n:'Zwei Außenringe HU. / Zwei Innenringe HU. Stg.',p:3.9,d:'6er'},
{c:'6237a',n:'Zwei Außenringe Stg. rw.',p:3.5,d:'6er'},
{c:'6237b',n:'Zwei Außenringe Stg. rw. angef. frh.',p:6.3,d:'6er'},
{c:'6237c',n:'Zwei Außenringe Stg. rw. an- u. abgef. frh.',p:7.3,d:'6er'},
{c:'6237d',n:'Zwei Außenringe HU. / Zwei Innenringe HU. Stg. rw.',p:5.5,d:'6er'},
{c:'6238a',n:'Zwei Innensterne Stg. 3er angef. frh.',p:4.1,d:'6er'},
{c:'6238b',n:'Zwei Innensterne Stg. angef. frh.',p:6.4,d:'6er'},
{c:'6238c',n:'Zwei Innensterne Stg. rw. angef. frh.',p:8.3,d:'6er'},
{c:'6251a',n:'Zwei Außensterne rw. angef.',p:3.6,d:'6er'},
{c:'6252a',n:'Zwei Außensterne Stg. rw. 3er angef. frh.',p:4.7,d:'6er'},
{c:'6252b',n:'Zwei Außensterne Stg. rw. angef. frh.',p:6.4,d:'6er'},
{c:'6271a',n:'6er HR.',p:0.8,d:'6er'},
{c:'6271b',n:'6er R.',p:1.0,d:'6er'},
{c:'6271c',n:'6er HR. 2er Lschl.',p:1.2,d:'6er'},
{c:'6271d',n:'6er R. 2er Lschl.',p:1.4,d:'6er'},
{c:'6271e',n:'6er HR. 6 Lschl.',p:2.4,d:'6er'},
{c:'6271f',n:'6er R. 6 Lschl.',p:2.8,d:'6er'},
{c:'6272a',n:'6er HR. rw.',p:1.7,d:'6er'},
{c:'6272b',n:'6er R. rw.',p:2.1,d:'6er'},
{c:'6272c',n:'6er HR. 2er Lschl. rw.',p:2.4,d:'6er'},
{c:'6272d',n:'6er R. 2er Lschl. rw.',p:2.8,d:'6er'},
{c:'6272e',n:'6er HR. 6 Lschl. rw.',p:3.8,d:'6er'},
{c:'6272f',n:'6er R. 6 Lschl. rw.',p:4.2,d:'6er'},
{c:'6273a',n:'6er HR. Stg.',p:2.1,d:'6er'},
{c:'6273b',n:'6er R. Stg.',p:2.6,d:'6er'},
{c:'6273c',n:'6er HR. Stg. frh.',p:2.7,d:'6er'},
{c:'6273d',n:'6er R. Stg. frh.',p:3.4,d:'6er'},
{c:'6273e',n:'6er HR. 2er Lschl. Stg.',p:3.0,d:'6er'},
{c:'6273f',n:'6er R. 2er Lschl. Stg.',p:3.5,d:'6er'},
{c:'6273g',n:'6er HR. 2er Lschl. Stg. frh.',p:3.9,d:'6er'},
{c:'6273h',n:'6er R. 2er Lschl. Stg. frh.',p:3.6,d:'6er'},
{c:'6273i',n:'6er HR. 6 Lschl. Stg.',p:4.5,d:'6er'},
{c:'6273j',n:'6er R. 6 Lschl. Stg.',p:5.0,d:'6er'},
{c:'6273k',n:'6er HR. 6 Lschl. Stg. frh.',p:5.6,d:'6er'},
{c:'6273l',n:'6er R. 6 Lschl. Stg. frh.',p:6.2,d:'6er'},
{c:'6274a',n:'6er HR. Stg. rw. frh.',p:3.6,d:'6er'},
{c:'6274b',n:'6er R. Stg. rw. frh.',p:4.4,d:'6er'},
{c:'6274c',n:'6er HR. 2er Lschl. Stg. rw. frh.',p:5.1,d:'6er'},
{c:'6274d',n:'6er R. 2er Lschl. Stg. rw. frh.',p:6.0,d:'6er'},
{c:'6274e',n:'6er HR. 6 Lschl. Stg. rw. frh.',p:7.0,d:'6er'},
{c:'6274f',n:'6er R. 6 Lschl. Stg. rw. frh.',p:7.8,d:'6er'},
{c:'6281a',n:'6er Querzug',p:1.0,d:'6er'},
{c:'6281b',n:'6er Querzug 2er Lschl.',p:1.4,d:'6er'},
{c:'6281c',n:'6er Querzug 2er Rschl.',p:1.5,d:'6er'},
{c:'6281d',n:'6er Querzug 6 Lschl.',p:1.6,d:'6er'},
{c:'6282a',n:'6er Querzug rw.',p:2.1,d:'6er'},
{c:'6282b',n:'6er Querzug 2er Lschl. rw.',p:2.8,d:'6er'},
{c:'6282c',n:'6er Querzug 2er Rschl. rw.',p:3.0,d:'6er'},
{c:'6282d',n:'6er Querzug 6 Lschl. rw.',p:3.2,d:'6er'},
{c:'6283a',n:'6er Querzug Stg.',p:2.6,d:'6er'},
{c:'6283b',n:'6er Querzug Stg. frh.',p:3.4,d:'6er'},
{c:'6283c',n:'6er Querzug 2er Lschl. Stg.',p:3.5,d:'6er'},
{c:'6283d',n:'6er Querzug 2er Lschl. Stg. frh.',p:4.1,d:'6er'},
{c:'6283e',n:'6er Querzug 6 Lschl. Stg.',p:5.0,d:'6er'},
{c:'6283f',n:'6er Querzug 6 Lschl. Stg. frh.',p:5.2,d:'6er'},
{c:'6284a',n:'6er Querzug Stg. rw. frh.',p:3.4,d:'6er'},
{c:'6284b',n:'6er Querzug 2er Lschl. Stg. rw. frh.',p:5.0,d:'6er'},
{c:'6284c',n:'6er Querzug 6 Lschl. Stg. rw. frh.',p:6.8,d:'6er'},
{c:'6284d',n:'6er Querzug 3 Lschl. 3 Rschl. Stg. rw. frh.',p:7.7,d:'6er'},
{c:'6284e',n:'6er Querzug Dreh. Stg. rw. frh.',p:10.2,d:'6er'},
{c:'6291a',n:'Umfahrt 5er um 1',p:1.1,d:'6er'},
{c:'6292a',n:'Umfahrt 5er um 1 rw.',p:2.2,d:'6er'},
{c:'6293a',n:'Umfahrt 5er um 1 Stg.',p:2.8,d:'6er'},
{c:'6293b',n:'Umfahrt 5er um 1 Stg. frh.',p:3.6,d:'6er'},
{c:'6294a',n:'Umfahrt 5er um 1 Stg. rw. frh.',p:4.8,d:'6er'},
{c:'6301a',n:'Kutsche HR.',p:0.6,d:'6er'},
{c:'6301b',n:'Kutsche R.',p:0.8,d:'6er'},
{c:'6302a',n:'Kutsche HR. Stg.',p:1.5,d:'6er'},
{c:'6302b',n:'Kutsche R. Stg.',p:2.0,d:'6er'},
{c:'6311a',n:'Schlange HR.',p:0.6,d:'6er'},
{c:'6311b',n:'Schlange R.',p:0.8,d:'6er'},
{c:'6316a',n:'Kette HR.',p:0.6,d:'6er'},
{c:'6316b',n:'Kette R.',p:0.8,d:'6er'},
{c:'6317a',n:'Kette HR. Stg. frh.',p:2.0,d:'6er'},
{c:'6317b',n:'Kette R. Stg. frh.',p:2.6,d:'6er'},
{c:'6321a',n:'Sattelgriff HR.',p:1.0,d:'6er'},
{c:'6321b',n:'Sattelgriff R.',p:1.2,d:'6er'},
{c:'6322a',n:'Sattelgriffdurchzug',p:1.2,d:'6er'},
{c:'6323a',n:'Sattelgriffring',p:0.8,d:'6er'},
{c:'6323b',n:'Sattelgriffring 6 Rschl.',p:1.8,d:'6er'},
{c:'6324a',n:'Sattelgriffring rw.',p:1.6,d:'6er'},
{c:'6324b',n:'Sattelgriffring rw. angef.',p:2.6,d:'6er'},
{c:'6324c',n:'Sattelgriffring rw. an- u. abgef.',p:3.0,d:'6er'},
{c:'6331a',n:'2er Flügelmühle Gegentorfahrt außen glz. rw.',p:5.2,d:'6er'},
{c:'6331b',n:'2er Flügelmühle Gegentorfahrt glz. rw.',p:6.4,d:'6er'},
{c:'6332a',n:'2er Flügelmühle Gegentorfahrt außen glz. Stg.',p:4.5,d:'6er'},
{c:'6332b',n:'2er Flügelmühle Gegentorfahrt außen glz. Stg. frh.',p:5.0,d:'6er'},
{c:'6332c',n:'2er Flügelmühle Gegentorfahrt glz. Stg.',p:6.0,d:'6er'},
{c:'6332d',n:'2er Flügelmühle Gegentorfahrt glz. Stg. frh.',p:6.9,d:'6er'},
{c:'6333a',n:'2er Flügelmühle Gegentorfahrt außen glz. Stg. rw. frh.',p:7.1,d:'6er'},
{c:'6333b',n:'2er Flügelmühle Gegentorfahrt glz. Stg. rw. frh.',p:8.6,d:'6er'},
{c:'6341a',n:'3er Flügelmühle',p:2.1,d:'6er'},
{c:'6341b',n:'3er Flügelmühle HU. 6 Rschl.',p:2.8,d:'6er'},
{c:'6341c',n:'3er Flügelmühle 6 Rschl.',p:3.1,d:'6er'},
{c:'6342a',n:'3er Flügelmühle rw.',p:2.2,d:'6er'},
{c:'6342b',n:'3er Flügelmühle rw. angef.',p:3.2,d:'6er'},
{c:'6342c',n:'3er Flügelmühle rw. an- u. abgef.',p:3.7,d:'6er'},
{c:'6343a',n:'3er Flügelmühle Stg.',p:2.8,d:'6er'},
{c:'6343b',n:'3er Flügelmühle Stg. frh.',p:3.1,d:'6er'},
{c:'6343c',n:'3er Flügelmühle Stg. frh. angef.',p:4.2,d:'6er'},
{c:'6343d',n:'3er Flügelmühle Stg. angef. frh.',p:4.7,d:'6er'},
{c:'6343e',n:'3er Flügelmühle Stg. frh. an- u. abgef.',p:5.0,d:'6er'},
{c:'6343f',n:'3er Flügelmühle Stg. an- u. abgef. frh.',p:5.5,d:'6er'},
{c:'6344a',n:'3er Flügelmühle Stg. rw. frh.',p:3.8,d:'6er'},
{c:'6344b',n:'3er Flügelmühle Stg. rw. angef. frh.',p:5.8,d:'6er'},
{c:'6344c',n:'3er Flügelmühle Stg. rw. an- u. abgef. frh.',p:6.8,d:'6er'},
{c:'6344d',n:'3er Flügelmühle HU. Mühle mit 4 Rschl. Stg. rw. frh.',p:7.7,d:'6er'},
{c:'6344e',n:'3er Flügelmühle HU. 6 Rschl. Stg. rw. frh.',p:8.0,d:'6er'},
{c:'6344f',n:'3er Flügelmühle 6 Rschl. Stg. rw. frh.',p:9.3,d:'6er'},
{c:'6351a',n:'2er Flügelmühle',p:1.3,d:'6er'},
{c:'6351b',n:'2er Flügelmühle HU. 2er Rschl.',p:1.7,d:'6er'},
{c:'6351c',n:'2er Flügelmühle 2er Rschl.',p:1.9,d:'6er'},
{c:'6351d',n:'2er Flügelmühle HU. 6 Rschl.',p:2.1,d:'6er'},
{c:'6351e',n:'2er Flügelmühle 6 Rschl.',p:2.4,d:'6er'},
{c:'6352a',n:'2er Flügelmühle rw.',p:1.6,d:'6er'},
{c:'6352b',n:'2er Flügelmühle HU. 2er Rschl. rw.',p:2.4,d:'6er'},
{c:'6352c',n:'2er Flügelmühle 2er Rschl. rw.',p:3.1,d:'6er'},
{c:'6352d',n:'2er Flügelmühle rw. angef.',p:2.6,d:'6er'},
{c:'6352e',n:'2er Flügelmühle rw. an- u. abgef.',p:3.0,d:'6er'},
{c:'6353a',n:'2er Flügelmühle Stg.',p:2.0,d:'6er'},
{c:'6353b',n:'2er Flügelmühle Stg. frh.',p:2.6,d:'6er'},
{c:'6353c',n:'2er Flügelmühle Stg. frh. angef.',p:4.2,d:'6er'},
{c:'6353d',n:'2er Flügelmühle Stg. angef. frh.',p:4.2,d:'6er'},
{c:'6353e',n:'2er Flügelmühle Stg. frh. an- u. abgef.',p:4.4,d:'6er'},
{c:'6353f',n:'2er Flügelmühle Stg. an- u. abgef. frh.',p:4.9,d:'6er'},
{c:'6354a',n:'2er Flügelmühle Stg. rw. frh.',p:3.4,d:'6er'},
{c:'6354b',n:'2er Flügelmühle Stg. rw. angef. frh.',p:5.4,d:'6er'},
{c:'6354c',n:'2er Flügelmühle Stg. rw. an­ u. abgef. frh.',p:6.0,d:'6er'},
{c:'6354d',n:'2er Flügelmühle HU. Mühle mit 3 Rschl. Stg. rw. frh.',p:5.1,d:'6er'},
{c:'6354e',n:'2er Flügelmühle HU. 2er Rschl. Stg. rw. frh.',p:4.1,d:'6er'},
{c:'6354f',n:'2er Flügelmühle 2er Rschl. Stg. rw. frh.',p:5.4,d:'6er'},
{c:'6354g',n:'2er Flügelmühle HU. 6 Rschl. Stg. rw. frh.',p:5.6,d:'6er'},
{c:'6354h',n:'2er Flügelmühle HU. 6 Rschl. Stg. rw. angef. frh.',p:6.6,d:'6er'},
{c:'6354i',n:'2er Flügelmühle HU. 6 Rschl. Stg. rw. an- u. abgef. frh.',p:7.2,d:'6er'},
{c:'6354j',n:'2er Flügelmühle 6 Rschl. Stg. rw. frh.',p:6.0,d:'6er'},
{c:'6354k',n:'2er Flügelmühle 6 Rschl. Stg. rw. angef. frh.',p:7.5,d:'6er'},
{c:'6354l',n:'2er Flügelmühle 6 Rschl. Stg. rw. an- u. abgef. frh.',p:8.5,d:'6er'},
{c:'6363a',n:'2er Flügelring Stg.',p:2.0,d:'6er'},
{c:'6363b',n:'2er Flügelring Stg. frh.',p:2.6,d:'6er'},
{c:'6363c',n:'2er Flügelring Stg. frh. angef.',p:3.7,d:'6er'},
{c:'6363d',n:'2er Flügelring Stg. angef. frh.',p:4.2,d:'6er'},
{c:'6363e',n:'2er Flügelring Stg. frh. an- u. abgef.',p:4.4,d:'6er'},
{c:'6363f',n:'2er Flügelring Stg. an- u. abgef. frh.',p:4.9,d:'6er'},
{c:'6364a',n:'2er Flügelring Stg. rw. frh.',p:3.4,d:'6er'},
{c:'6364b',n:'2er Flügelring Stg. rw. angef. frh.',p:5.4,d:'6er'},
{c:'6364c',n:'2er Flügelring Stg. rw. an- u. abgef. frh.',p:6.5,d:'6er'},
{c:'6371a',n:'3er Flügelmühle Mühle mit 4 hinter. R. rw.',p:3.7,d:'6er'},
{c:'6371b',n:'3er Flügelring Innenring mit 4 hinter. R. rw.',p:3.4,d:'6er'},
{c:'6372a',n:'3er Flügelmühle Mühle mit 4 hinter. R. Stg.',p:3.4,d:'6er'},
{c:'6372b',n:'3er Flügelmühle Mühle mit 4 hinter. R. Stg. frh.',p:3.7,d:'6er'},
{c:'6372c',n:'3er Flügelring Innenring mit 4 hinter. R. Stg.',p:3.5,d:'6er'},
{c:'6372d',n:'3er Flügelring Innenring mit 4 hinter. R. Stg. frh.',p:4.2,d:'6er'},
{c:'6373a',n:'3er Flügelmühle Mühle mit 4 hinter. R. Stg. rw. frh.',p:6.0,d:'6er'},
{c:'6373b',n:'3er Flügelring Innenring mit 4 hinter. R. Stg. rw. frh.',p:6.4,d:'6er'},
{c:'6375a',n:'2er Flügelmühle Mühle mit 3 hinter. R.',p:1.7,d:'6er'},
{c:'6376a',n:'2er Flügelmühle Mühle mit 3 hinter. R. rw.',p:3.4,d:'6er'},
{c:'6377a',n:'2er Flügelmühle Mühle mit 3 hinter. R. Stg.',p:3.8,d:'6er'},
{c:'6377b',n:'2er Flügelmühle Mühle mit 3 hinter. R. Stg. frh.',p:4.6,d:'6er'},
{c:'6377c',n:'2er Flügelring Innenring mit 3 hinter. R. Stg.',p:3.9,d:'6er'},
{c:'6377d',n:'2er Flügelring Innenring mit 3 hinter. R. Stg. frh.',p:4.9,d:'6er'},
{c:'6378a',n:'2er Flügelmühle Mühle mit 3 hinter. R. Stg. rw. frh.',p:5.3,d:'6er'},
{c:'6378b',n:'2er Flügelring Innenring mit 3 hinter. R. Stg. rw. frh.',p:5.6,d:'6er'},
{c:'6378c',n:'2er Flügelmühle HU. Mühle mit Dreh. Stg. rw. frh. T (9,0)',p:8.2,d:'6er'},
{c:'6386a',n:'Mühle',p:2.0,d:'6er'},
{c:'6386b',n:'Mühle 6 Rschl.',p:2.6,d:'6er'},
{c:'6387a',n:'Mühle rw.',p:3.1,d:'6er'},
{c:'6387b',n:'Mühle rw. angef.',p:4.0,d:'6er'},
{c:'6387c',n:'Mühle rw. an- u. abgef.',p:4.5,d:'6er'},
{c:'6388a',n:'Mühle Stg.',p:2.6,d:'6er'},
{c:'6388b',n:'Mühle Stg. frh.',p:3.4,d:'6er'},
{c:'6388c',n:'Mühle Stg. frh. angef.',p:4.4,d:'6er'},
{c:'6388d',n:'Mühle Stg. angef. frh.',p:4.9,d:'6er'},
{c:'6388e',n:'Mühle Stg. frh. an- u. abgef.',p:5.2,d:'6er'},
{c:'6388f',n:'Mühle Stg. an- u. abgef. frh.',p:5.7,d:'6er'},
{c:'6389a',n:'Mühle Stg. rw. frh.',p:4.4,d:'6er'},
{c:'6389b',n:'Mühle Stg. rw. angef. frh.',p:6.5,d:'6er'},
{c:'6389c',n:'Mühle Stg. rw. an- u. abgef. frh.',p:7.0,d:'6er'},
{c:'6389d',n:'Mühle 6 Rschl. Stg. rw. frh.',p:8.0,d:'6er'},
{c:'6389e',n:'Mühle 6 Rschl. Stg. rw. an- u. abgef. frh.',p:9.0,d:'6er'},
{c:'6396a',n:'Innenring um 2 Stg.',p:2.8,d:'6er'},
{c:'6396b',n:'Innenring um 2 Stg. angef.',p:4.0,d:'6er'},
{c:'6396c',n:'Innenring um 2 Stg. angef. frh.',p:4.7,d:'6er'},
{c:'6396d',n:'Innenring um 2 gegenf. Stg. angef. frh.',p:6.0,d:'6er'},
{c:'6396e',n:'Innenring um 2 Stg. an- u. abgef.',p:4.6,d:'6er'},
{c:'6396f',n:'Innenring um 2 Stg. an- u. abgef. frh.',p:5.5,d:'6er'},
{c:'6396g',n:'Innenring um 2 gegenf. Stg. an- u. abgef. frh.',p:6.8,d:'6er'},
{c:'6397a',n:'Innenring um 2 Stg. rw.',p:3.9,d:'6er'},
{c:'6397b',n:'Innenring um 2 Stg. rw. angef. frh.',p:6.8,d:'6er'},
{c:'6397c',n:'Innenring um 2 gegenf. Stg. rw. angef. frh.',p:8.1,d:'6er'},
{c:'6397d',n:'Innenring um 2 Stg. rw. an- u. abgef. frh.',p:7.8,d:'6er'},
{c:'6397e',n:'Innenring um 2 gegenf. Stg. rw. an- u. abgef. frh.',p:8.9,d:'6er'},
{c:'6403a',n:'Innenring Stg.',p:2.2,d:'6er'},
{c:'6403b',n:'Innenring Stg. angef.',p:3.4,d:'6er'},
{c:'6403c',n:'Innenring Stg. angef. frh.',p:3.9,d:'6er'},
{c:'6403d',n:'Innenring Stg. an- u. abgef.',p:4.0,d:'6er'},
{c:'6403e',n:'Innenring Stg. an- u. abgef. frh.',p:5.2,d:'6er'},
{c:'6404a',n:'Innenring Stg. rw.',p:3.1,d:'6er'},
{c:'6404b',n:'Innenring Stg. rw. angef. frh.',p:5.8,d:'6er'},
{c:'6404c',n:'Innenring Stg. rw. an- u. abgef. frh.',p:6.3,d:'6er'},
{c:'6404d',n:'Innenring Stg. rw. angedr. frh.',p:8.0,d:'6er'},
{c:'6404e',n:'Innenring Stg. rw. angedr. u. abgef. frh.',p:8.5,d:'6er'},
{c:'6412a',n:'Wechselring Stg.',p:2.7,d:'6er'},
{c:'6412b',n:'Wechselring HU. / Innenring HU. Stg.',p:4.1,d:'6er'},
{c:'6412c',n:'Wechselring Stg. angef.',p:3.9,d:'6er'},
{c:'6412d',n:'Wechselring Stg. angef. frh.',p:4.6,d:'6er'},
{c:'6412e',n:'Wechselring Stg. an- u. abgef.',p:4.5,d:'6er'},
{c:'6412f',n:'Wechselring Stg. an- u. abgef. frh.',p:5.9,d:'6er'},
{c:'6413a',n:'Wechselring Stg. rw.',p:3.8,d:'6er'},
{c:'6413b',n:'Wechselring HU. / Innenring HU. Stg. rw.',p:5.7,d:'6er'},
{c:'6413c',n:'Wechselring Stg. rw. angef. frh.',p:6.6,d:'6er'},
{c:'6413d',n:'Wechselring Stg. rw. an- u. abgef. frh.',p:7.7,d:'6er'},
{c:'6413e',n:'Wechselring Stg. rw. angedr. u. abgef. frh.',p:8.8,d:'6er'},
{c:'6417a',n:'Außenring Stg.',p:3.0,d:'6er'},
{c:'6417b',n:'Außenring Stg. angef.',p:4.2,d:'6er'},
{c:'6417c',n:'Außenring Stg. angef. frh.',p:5.0,d:'6er'},
{c:'6417d',n:'Außenring Stg. an- u. abgef.',p:4.8,d:'6er'},
{c:'6417e',n:'Außenring Stg. an- u. abgef. frh.',p:5.7,d:'6er'},
{c:'6417f',n:'Außenring HU. / Innenring HU. Stg.',p:4.4,d:'6er'},
{c:'6418a',n:'Außenring Stg. rw.',p:4.2,d:'6er'},
{c:'6418b',n:'Außenring Stg. rw. angef. frh.',p:7.1,d:'6er'},
{c:'6418c',n:'Außenring Stg. rw. an- u. abgef. frh.',p:8.2,d:'6er'},
{c:'6418d',n:'Außenring HU. / Innenring HU. Stg. rw.',p:6.2,d:'6er'},
{c:'6418e',n:'Außenring 6 Rschl. Stg. rw. an- u. abgef. frh.',p:10.7,d:'6er'},
{c:'6425a',n:'Halbe Torfahrt',p:0.8,d:'6er'},
{c:'6425b',n:'Torfahrt',p:1.2,d:'6er'},
{c:'6425c',n:'Halbe Synchrontorfahrt',p:1.4,d:'6er'},
{c:'6425d',n:'Synchrontorfahrt',p:2.8,d:'6er'},
{c:'6425e',n:'Gegentorfahrt glz.',p:3.4,d:'6er'},
{c:'6426a',n:'Halbe Torfahrt rw.',p:1.6,d:'6er'},
{c:'6426b',n:'Torfahrt rw.',p:2.4,d:'6er'},
{c:'6426c',n:'Halbe Synchrontorfahrt rw.',p:2.8,d:'6er'},
{c:'6426d',n:'Synchrontorfahrt rw.',p:3.6,d:'6er'},
{c:'6426e',n:'Gegentorfahrt glz. rw.',p:4.8,d:'6er'},
{c:'6427a',n:'Halbe Torfahrt Stg.',p:2.0,d:'6er'},
{c:'6427b',n:'Torfahrt Stg.',p:3.0,d:'6er'},
{c:'6427c',n:'Halbe Torfahrt Stg. frh.',p:2.6,d:'6er'},
{c:'6427d',n:'Torfahrt Stg. frh.',p:3.9,d:'6er'},
{c:'6428a',n:'Halbe Torfahrt Stg. rw. frh.',p:4.4,d:'6er'},
{c:'6428b',n:'Torfahrt Stg. rw. frh.',p:5.1,d:'6er'},
{c:'6429a',n:'Gegentorfahrt glz. Stg. rw. frh.',p:8.2,d:'6er'},
{c:'6429b',n:'Mühle mit Gegentorfahrt glz. Stg. rw. frh.',p:9.2,d:'6er'},
{c:'6430a',n:'Halbe Synchrontorfahrt Stg.',p:3.0,d:'6er'},
{c:'6430b',n:'Synchrontorfahrt Stg.',p:4.0,d:'6er'},
{c:'6430c',n:'Halbe Synchrontorfahrt Stg. frh.',p:4.1,d:'6er'},
{c:'6430d',n:'Synchrontorfahrt Stg. frh.',p:4.9,d:'6er'},
{c:'6431a',n:'Halbe Synchrontorfahrt Stg. rw. frh.',p:6.0,d:'6er'},
{c:'6431b',n:'Synchrontorfahrt Stg. rw. frh.',p:6.7,d:'6er'},
{c:'6432a',n:'Gegentorfahrt glz. Stg.',p:6.0,d:'6er'},
{c:'6432b',n:'Gegentorfahrt glz. Stg. frh.',p:6.8,d:'6er'},
{c:'6433a',n:'Mühle mit halber Synchrontorfahrt Stg. rw. frh.',p:6.0,d:'6er'},
{c:'6433b',n:'Mühle mit Synchrontorfahrt Stg. rw. frh.',p:7.2,d:'6er'},
{c:'6434a',n:'Mühle mit Synchrontorfahrt Stg.',p:5.1,d:'6er'},
{c:'6434b',n:'Mühle mit Gegentorfahrt glz. Stg.',p:6.6,d:'6er'},
{c:'6435a',n:'Schleifentorfahrt glz. Stg. rw. frh.',p:9.4,d:'6er'},
{c:'6436a',n:'Doppeltorfahrt',p:1.4,d:'6er'},
{c:'6436b',n:'Synchrondoppeltorfahrt',p:2.0,d:'6er'},
{c:'6437a',n:'Doppeltorfahrt rw.',p:3.8,d:'6er'},
{c:'6437b',n:'Schlangenbogendoppeltorfahrt rw.',p:5.1,d:'6er'},
{c:'6437c',n:'Synchrondoppeltorfahrt rw',p:4.8,d:'6er'},
{c:'6438a',n:'Doppeltorfahrt Stg. rw. frh.',p:7.0,d:'6er'},
{c:'6438b',n:'Turbine Doppeltorfahrt gegenf. Stg. rw. frh.',p:9.9,d:'6er'},
{c:'6438c',n:'Synchrondoppeltorfahrt Stg. rw. frh.',p:8.5,d:'6er'},
{c:'6441a',n:'Schlangenbogendoppeltorfahrt Stg. rw. frh.',p:7.7,d:'6er'},
{c:'6442a',n:'Wschl. Torfahrt rw.',p:5.2,d:'6er'},
{c:'6443a',n:'Wschl. Torfahrt Stg. rw. frh.',p:9.6,d:'6er'},
{c:'6452a',n:'Halber Torring Stg.',p:3.5,d:'6er'},
{c:'6452b',n:'Torring Stg.',p:4.2,d:'6er'},
{c:'6453a',n:'Halber Torring Stg. rw.',p:5.1,d:'6er'},
{c:'6453b',n:'Torring Stg. rw.',p:6.5,d:'6er'},
{c:'6462a',n:'Halber Doppeltorring Stg.',p:2.7,d:'6er'},
{c:'6462b',n:'Doppeltorring Stg.',p:3.7,d:'6er'},
{c:'6463a',n:'Halber Doppeltorring Stg. rw.',p:3.8,d:'6er'},
{c:'6463b',n:'Doppeltorring Stg. rw.',p:5.2,d:'6er'},
{c:'6471a',n:'Innenstern',p:1.7,d:'6er'},
{c:'6471b',n:'Innenstern 6 Lschl.',p:2.2,d:'6er'},
{c:'6472a',n:'Innenstern Stg.',p:3.2,d:'6er'},
{c:'6472b',n:'Innenstern Stg. 2er angef. frh.',p:4.2,d:'6er'},
{c:'6472c',n:'Innenstern Stg. 6er angef. frh.',p:5.2,d:'6er'},
{c:'6472d',n:'Innenstern Stg. angef.',p:5.4,d:'6er'},
{c:'6472e',n:'Innenstern Stg. angef. frh.',p:6.0,d:'6er'},
{c:'6472f',n:'Innenstern Stg. rw. angef. frh.',p:9.2,d:'6er'},
{c:'6472g',n:'Innenstern 6 Lschl. Stg. rw. angef. frh.',p:10.6,d:'6er'},
{c:'6472h',n:'Innenstern 6 Rschl. Stg. rw. angef. frh.',p:11.2,d:'6er'},
{c:'6481a',n:'Außenstern',p:1.0,d:'6er'},
{c:'6481b',n:'Außenstern rw. angef.',p:3.0,d:'6er'},
{c:'6481c',n:'Außenstern 6 Lschl. rw. angef.',p:4.1,d:'6er'},
{c:'6482a',n:'Wechselstern',p:1.4,d:'6er'},
{c:'6482b',n:'Wechselstern Stg.',p:3.5,d:'6er'},
{c:'6482c',n:'Wechselstern Stg. angef.',p:4.7,d:'6er'},
{c:'6482d',n:'Wechselstern Stg. angef. frh.',p:5.1,d:'6er'},
{c:'6482e',n:'Wechselstern Stg. rw. angef. frh.',p:8.0,d:'6er'},
{c:'6483a',n:'Außenstern Stg.',p:2.5,d:'6er'},
{c:'6483b',n:'Außenstern Stg. rw. 2er angef. frh.',p:4.6,d:'6er'},
{c:'6483c',n:'Außenstern Stg. rw. 6er angef. frh.',p:3.9,d:'6er'},
{c:'6483d',n:'Außenstern Stg. rw. angef. frh.',p:6.3,d:'6er'},
{c:'6483e',n:'Außenstern 6 Lschl. Stg. rw. angef. frh.',p:8.2,d:'6er'},
{c:'6483f',n:'Außenstern 6 Rschl. Stg. rw. angef. frh.',p:8.8,d:'6er'},
{c:'6485a',n:'Zwei Innensterne Stg. ½ Standdrehung',p:6.2,d:'6er'},
{c:'6486a',n:'Innenstern Stg. ½ Standdrehung',p:6.7,d:'6er'},
{c:'6486b',n:'Innenstern Stg. 1 Standdrehung',p:9.7,d:'6er'},
{c:'6496a',n:'2er Stg. ½ Standdrehung',p:6.0,d:'6er'},
{c:'6496b',n:'2er Stg. 1 Standdrehung',p:7.0,d:'6er'},
{c:'6496c',n:'2er Stg. 1½ Standdrehungen',p:8.0,d:'6er'},
{c:'6496d',n:'2er Stg. 2 Standdrehungen',p:9.0,d:'6er'},
{c:'6496e',n:'3er Stg. ½ Standdrehung',p:6.5,d:'6er'},
{c:'6496f',n:'3er Stg. 1 Standdrehung',p:7.5,d:'6er'},
{c:'6496g',n:'3er Stg. 1½ Standdrehungen',p:8.5,d:'6er'},
{c:'6496h',n:'3er Stg. 2 Standdrehungen',p:9.5,d:'6er'},
{c:'6497a',n:'6er Stg. ½ Standdrehung',p:7.1,d:'6er'},
{c:'6497b',n:'6er Stg. 1 Standdrehung',p:8.1,d:'6er'},
{c:'6497c',n:'6er Stg. 1½ Standdrehungen',p:9.1,d:'6er'},
{c:'6497d',n:'6er Stg. 2 Standdrehungen',p:10.1,d:'6er'},
];

const DISCIPLINES = [
  { id: '1er', label: '1er Kunstradsport' },
  { id: '2er', label: '2er Kunstradsport' },
  { id: '4er', label: '4er Mannschaft' },
  { id: '6er', label: '6er Mannschaft' }
];

// Globale Referenz auf aktive Datenbank — wird von App via setActiveDb() umgeschaltet
let activeUciDb = UCI_DB_2026;
let activeUciByCode = new Map(UCI_DB_2026.map(e => [e.c, e]));
function getUciDb() { return activeUciDb; }
function setActiveDb(db) {
  activeUciDb = (db && db.length > 0) ? db : UCI_DB_2026;
  activeUciByCode = new Map(activeUciDb.map(e => [e.c, e]));
}

// Lokalisierter Übungs-Name: wenn die Übung einen UCI-Code hat, ziehen wir
// den Namen aus der aktiven UCI-DB (die schon in der gewählten Reglement-
// Sprache geladen ist). Sonst Fallback auf den vom User gespeicherten
// Namen. Damit folgt auch eine schon angelegte User-Übung der Sprach-
// Einstellung, ohne dass der User sie umbenennen muss.
function localizedExerciseName(ex) {
  if (!ex) return '';
  // Akzeptiert sowohl `uci_code` (User-Übungen) als auch `code` (Programm-
  // Übungs-Einträge) — beide Schemata kommen im Code vor.
  const code = ex.uci_code || ex.code;
  if (code) {
    const hit = activeUciByCode.get(code);
    if (hit && hit.n) return hit.n;
  }
  // Reparatur-Fallback für generische Namen ("Übung 18") aus PDF-Imports,
  // wo der Parser den Namen nicht extrahieren konnte: per Punkte+Disziplin
  // EINDEUTIG in der UCI-DB matchen. Nur wenn genau 1 Treffer → übernehmen.
  const isGeneric = /^Übung\s+\d+$/.test((ex.name || '').trim());
  if (isGeneric) {
    const pts = Number(ex.points || 0);
    const disc = ex.uci_disc;
    if (pts > 0 && disc) {
      const candidates = activeUciDb.filter(u => Math.abs(u.p - pts) < 0.001 && u.d === disc);
      if (candidates.length === 1) return candidates[0].n;
    }
  }
  return ex.name || '';
}

const DATA_KEY = 'artcyc:test:v3';
// Echte UUID (v4) — die DB-Tabellen erwarten UUID-Format. crypto.randomUUID()
// gibt es ab iOS Safari 15.4 und in allen aktuellen Browsern; der manuelle
// Fallback ist für sehr alte Umgebungen (eigentlich nicht mehr nötig).
const uid = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // RFC4122 v4 Fallback (basiert auf Math.random — nur als Notbremse)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
};

// Berechnung der Abzüge pro Übung
// =============================================================
// PDF-Loading Helper (klassisches Script-Tag von cdnjs)
// =============================================================
let _pdfJsPromise = null;
function loadPdfJs() {
  if (typeof window === 'undefined') return Promise.reject(new Error('Kein Browser'));
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
  if (_pdfJsPromise) return _pdfJsPromise;
  _pdfJsPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.min.mjs';
    s.type = 'module';
    s.onload = () => {
      // Bei ESM-Script: pdfjsLib wird nicht global gesetzt, müssen wir manuell importieren
      // Fallback auf klassisches Build:
      const s2 = document.createElement('script');
      s2.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      s2.onload = () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          resolve(window.pdfjsLib);
        } else {
          reject(new Error('pdfjsLib nicht verfügbar nach Laden'));
        }
      };
      s2.onerror = () => reject(new Error('PDF-Bibliothek konnte nicht geladen werden'));
      document.head.appendChild(s2);
    };
    s.onerror = () => {
      // Direkter Versuch mit klassischem Build
      const s2 = document.createElement('script');
      s2.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      s2.onload = () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          resolve(window.pdfjsLib);
        } else {
          reject(new Error('pdfjsLib nicht verfügbar'));
        }
      };
      s2.onerror = () => reject(new Error('PDF-Bibliothek konnte nicht geladen werden (cdnjs)'));
      document.head.appendChild(s2);
    };
    document.head.appendChild(s);
  });
  return _pdfJsPromise;
}

async function extractPdfText(file) {
  const pdfjs = await loadPdfJs();
  const arrBuf = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrBuf }).promise;
  let fullText = '';
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const txt = await page.getTextContent();
    fullText += '\n' + txt.items.map(it => it.str).join(' ');
  }
  return fullText;
}

// Extrahiere PDF-Items mit X/Y-Koordinaten (für Wertungsbericht-Parser)
async function extractPdfItems(file) {
  const pdfjs = await loadPdfJs();
  const arrBuf = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrBuf }).promise;
  const allItems = [];
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const viewport = page.getViewport({ scale: 1 });
    const txt = await page.getTextContent();
    for (const it of txt.items) {
      // pdfjs Transform-Matrix: [scaleX, 0, 0, scaleY, x, y]
      // y ist die Baseline-Position (von unten gerechnet).
      // WICHTIG: Wir nutzen die Baseline direkt (ohne Item-Höhe abzuziehen),
      // damit alle Items in der gleichen Tabellenzeile den GLEICHEN y-Wert haben —
      // unabhängig von ihrer individuellen Schriftgröße/Höhe.
      const x = it.transform[4];
      const yBaseline = it.transform[5];
      const y = viewport.height - yBaseline; // y wächst nach unten
      allItems.push({
        text: it.str.trim(),
        x: x,
        y: y,
        width: it.width || 0,
        height: it.height || 0,
        page: p
      });
    }
  }
  return allItems;
}

// Wertungsbericht-Parser: liest Werte mit Positions-Information
// Spalten-Mapping (Header-Mitten in PDF):
//   Pkte=339.3
//   T1=364.7  T2=390.3  T3=415.8   (taktische Aufwertung pro KG)
//   %1=441.3  %2=466.8  %3=491.5   (Schwierigkeitsabwertung in %)
//   X1=517.8  X2=543.3  X3=568.8   (x = Kreuz, ×0,2)
//   W1=594.4  W2=619.9  W3=645.4   (~ = Welle, ×0,5)
//   S1=670.9  S2=696.4  S3=721.9   (| = Strich, ×1,0)
//   K1=747.4  K2=772.9  K3=798.5   (○ = Kreis/Sturz, ×2,0)
const WERTUNGSBERICHT_COLS = {
  'Pkte': 339.3,
  'T1': 364.7, 'T2': 390.3, 'T3': 415.8,
  'p1': 441.3, 'p2': 466.8, 'p3': 491.5,
  'X1': 517.8, 'X2': 543.3, 'X3': 568.8,
  'W1': 594.4, 'W2': 619.9, 'W3': 645.4,
  'S1': 670.9, 'S2': 696.4, 'S3': 721.9,
  'K1': 747.4, 'K2': 772.9, 'K3': 798.5
};

function classifyColumn(xMid, maxDist = 12) {
  let best = null, bestD = 999;
  for (const [name, cx] of Object.entries(WERTUNGSBERICHT_COLS)) {
    const d = Math.abs(xMid - cx);
    if (d < bestD) { best = name; bestD = d; }
  }
  return bestD < maxDist ? best : null;
}

// Parse pro-Übung-Werte aus PDF-Items.
// Gibt zurück: Array von { y, pkte, kg1: {x,w,s,k,p,t}, kg2: {...} }
function parseWertungsbogenRows(items) {
  // Schritt 1: Items in Zeilen clustern (Items mit ähnlichem y gehören zur selben Zeile)
  const sorted = items.slice().sort((a, b) => a.y - b.y);
  const lines = []; // { y, items[] }
  for (const it of sorted) {
    const last = lines[lines.length - 1];
    if (last && Math.abs(it.y - last.y) <= 5) {
      last.items.push(it);
    } else {
      lines.push({ y: it.y, items: [it] });
    }
  }

  // Schritt 2: Für jede Zeile prüfen, ob sie einen Anchor hat (Punkt-Wert in der Pkte-Spalte)
  const rows = [];
  for (const line of lines) {
    const anchor = line.items.find(it => {
      const xMid = it.x + (it.width || 0) / 2;
      if (Math.abs(xMid - 339.3) >= 12) return false;
      if (!/^\d+,\d+$/.test(it.text)) return false;
      // Sanity-Check: realistische Übungspunkte sind 0,5 bis 20 — alles darüber stammt aus dem Footer
      const val = parseFloat(it.text.replace(',', '.'));
      return val >= 0.5 && val <= 20;
    });
    if (!anchor) continue;

    const row = {
      y: anchor.y,
      pkte: parseFloat(anchor.text.replace(',', '.')),
      points: parseFloat(anchor.text.replace(',', '.')),
      kg1: {}, kg2: {}, kg3: {},
      code: null,
      name: ''
    };

    // Schritt 3: Items dieser Zeile verarbeiten
    const nameTokens = [];
    for (const it of line.items) {
      if (it === anchor) continue;

      // Code-Spalte (sehr links)
      if (it.x < 60) {
        const m = it.text.match(/^\d{0,2}(\d{4}[a-z]?)$/);
        if (m) row.code = m[1];
        continue;
      }

      // Name-Spalte
      if (it.x < 330) {
        nameTokens.push({ x: it.x, text: it.text });
        continue;
      }

      // Daten-Spalten — Klassifikation per xMid
      const xMid = it.x + (it.width || 0) / 2;
      const col = classifyColumn(xMid, 15); // großzügige Toleranz
      if (!col || col === 'Pkte') continue;
      const num = parseFloat(it.text.replace(',', '.'));
      if (isNaN(num)) continue;
      const kg = col[col.length - 1]; // 1, 2, oder 3
      const prefix = col.slice(0, -1); // T, p, X, W, S, K
      const target = row['kg' + kg];
      if (target) target[prefix] = num;
    }

    nameTokens.sort((a, b) => a.x - b.x);
    row.name = nameTokens.map(t => t.text).join(' ').replace(/\s+/g, ' ').trim();

    rows.push(row);
  }
  return rows;
}

// Footer aus Items mit Positionen extrahieren — robust gegen Text-Stream-Reihenfolge
// Layout: Linke Spalte (x < ~420) = KG1, Rechte Spalte (x > ~420) = KG2
function parseFooterPositional(items) {
  const result = {};
  const COL_SPLIT = 420; // x-Mitte zwischen den beiden Footer-Spalten

  // Findet Items deren Text das Label-Wort enthält (kann "Schwierigkeit:", "Abzug Schwierigkeit:", etc. sein)
  // Der Wert ist die nächste Zahl rechts in derselben y-Zeile
  const findValuesByLabel = (labelWord) => {
    const matches = [];
    const seen = new Set(); // damit wir nicht mehrere Items mit dem gleichen Wort doppelt verarbeiten
    for (const it of items) {
      const t = it.text;
      if (!t) continue;
      if (!t.includes(labelWord)) continue;
      // y der Label-Position
      const labelY = it.y;
      const key = Math.round(labelY) + '|' + Math.round(it.x);
      if (seen.has(key)) continue;
      seen.add(key);
      // Suche nächsten Wert rechts in derselben Zeile (oder im selben Item-Kontext)
      let bestVal = null, bestDx = 99999, bestX = 0;
      for (const w of items) {
        if (Math.abs(w.y - labelY) > 4) continue;
        if (w.x <= it.x) continue;
        if (w.x - it.x > 250) continue;
        if (!/^\d+[.,]\d+$/.test(w.text.trim())) continue;
        const dx = w.x - it.x;
        if (dx < bestDx) {
          bestDx = dx;
          bestVal = parseFloat(w.text.trim().replace(',', '.'));
          bestX = w.x;
        }
      }
      if (bestVal !== null) {
        // Verwende die Position des LABELS, nicht des Werts, für die Spalten-Zuordnung
        // (Werte können bei Sportlern mit verschiedener Punktzahl unterschiedlich weit liegen)
        matches.push({ x: it.x, y: labelY, value: bestVal });
      }
    }
    return matches;
  };

  const schwMatches = findValuesByLabel('Schwierigkeit');
  for (const m of schwMatches) {
    if (m.x < COL_SPLIT) result.kg1_schwierigkeit = m.value;
    else result.kg2_schwierigkeit = m.value;
  }

  const ausfMatches = findValuesByLabel('Ausführung');
  for (const m of ausfMatches) {
    if (m.x < COL_SPLIT) result.kg1_ausfuehrung = m.value;
    else result.kg2_ausfuehrung = m.value;
  }

  const gesMatches = findValuesByLabel('Gesamtabzug');
  for (const m of gesMatches) {
    if (m.x < COL_SPLIT) result.kg1_gesamtabzug = m.value;
    else result.kg2_gesamtabzug = m.value;
  }

  // "Ausgefahrene Punkte" — kann als ein Item oder zwei Items kommen
  const ausgefMatches = findValuesByLabel('Ausgefahrene');
  for (const m of ausgefMatches) {
    if (m.x < COL_SPLIT) result.kg1_ausgefahren = m.value;
    else result.kg2_ausgefahren = m.value;
  }

  // "Aufgestellte Punkte" und "Endergebnis" — global, nicht pro KG
  const aufMatches = findValuesByLabel('Aufgestellte');
  if (aufMatches.length > 0) result.aufgestellt = aufMatches[0].value;

  const endMatches = findValuesByLabel('Endergebnis');
  if (endMatches.length > 0) result.endergebnis = endMatches[0].value;

  return result;
}

// =============================================================
// Berechnung
// =============================================================
// Reglement-konforme Fehlergruppen-Abwertung (UCI 8.4.027 ff.)
//   x (Kreuz) = 0,2 Pkt — Fehlergruppe 1a/1b optisch schwach/kurz
//   ~ (Welle) = 0,5 Pkt — Fehlergruppe 1a-1h stark/lang sichtbar
//   | (Strich)= 1,0 Pkt — Fehlergruppe 2 (kurze Bodenberührung etc.)
//   ○ (Kreis) = 2,0 Pkt — Fehlergruppe 3 (Sturz, Bodenstand >1s)
function calcExerciseDeduction(w) {
  if (!w) return 0;
  return Number(w.cross||0)*0.2 + Number(w.wave||0)*0.5 + Number(w.bar||0)*1.0 + Number(w.circle||0)*2.0;
}

// Schwierigkeitsabwertung pro Übung in % (Reglement: 10%, 50%, 100%)
// Wird vom anerkannten Punktwert (taktische Aufwertung) berechnet, falls vorhanden
function calcExerciseSchwierigkeit(w, exercise) {
  if (!w || !exercise) return 0;
  const pct = Number(w.schwPct || 0);
  const pkt = Number(w.taktischePunkte || exercise.points || 0);
  return (pct / 100) * pkt;
}

// Anerkannter Punktwert einer Übung (taktische Aufwertung > Standardpunkte)
function getAnerkanntePunkte(w, exercise) {
  if (!exercise) return 0;
  const t = Number((w && w.taktischePunkte) || 0);
  return t > 0 ? t : Number(exercise.points || 0);
}

function calcTableResult(program, entries, schwierigkeit = 0) {
  // Aufgestellt = STRENG die Summe der Programm-Standardpunkte.
  // Taktische Aufwertung (T = "Retusche") ist KEINE aufgestellte Schwierigkeit,
  // sondern eine separate Aufwertung. Sie fließt ins Endergebnis (= anerkannt)
  // ein, aber NICHT in die ausgewiesene Schwierigkeit.
  const aufgestellt = program.exercises.reduce((sum, ex) => sum + Number(ex.points || 0), 0);
  // Anerkannt = Summe der jeweils GELTENDEN Punkte (T wenn gesetzt, sonst Standard).
  // Diese Logik ist identisch zum vorigen Verhalten — Endergebnisse bleiben gleich.
  const anerkannt = program.exercises.reduce((sum, ex, idx) => {
    const e = (entries || [])[idx];
    return sum + getAnerkanntePunkte(e, ex);
  }, 0);
  const taktBonus = anerkannt - aufgestellt;
  let exec = 0;
  let schw = Number(schwierigkeit || 0); // optionaler Pauschal-Schwierigkeitsabzug für Altdaten
  (entries || []).forEach((e, idx) => {
    if (!e || e.included === false) return;
    exec += calcExerciseDeduction(e);
    const ex = program.exercises[idx];
    schw += calcExerciseSchwierigkeit(e, ex);
  });
  const total = exec + schw;
  return {
    aufgestellt: Math.round(aufgestellt * 100) / 100,
    taktBonus: Math.round(taktBonus * 100) / 100,
    anerkannt: Math.round(anerkannt * 100) / 100,
    abzugAusfuehrung: Math.round(exec * 100) / 100,
    abzugSchwierigkeit: Math.round(schw * 100) / 100,
    abzugGesamt: Math.round(total * 100) / 100,
    ergebnis: Math.round((anerkannt - total) * 100) / 100
  };
}

// Wettkampf-Statistik pro Übung — summiert x/~/|/○ über alle Wettkämpfe in beiden KGs
function calcExerciseCompetitionStats(exercise, programs, competitions) {
  const stats = {
    cross: 0, wave: 0, bar: 0, circle: 0,
    schwPctSum: 0,                     // Summe Schwierigkeits-Abwertung in % über alle Stellungen
    schwPctNonZero: 0,                 // Anzahl Stellungen mit %-Abwertung > 0
    schwPctHist: {},                   // { '10': 2, '50': 1, '100': 3, ... } — Häufigkeit pro %-Stufe
    taktSum: 0,                        // Summe anerkannte taktische Punktzahl
    taktCount: 0,                      // Anzahl Stellungen mit taktischer Aufwertung
    taktHist: {},                      // { '3.7': 2, '3.5': 1, ... } — Häufigkeit pro Punkt-Wert
    count: 0, wettkaempfe: 0
  };
  if (!exercise || !competitions || competitions.length === 0) return stats;
  const programMap = new Map((programs || []).map(p => [p.id, p]));
  const matches = (ex) => {
    if (exercise.uci_code && ex.code) return exercise.uci_code === ex.code;
    return (ex.name || '').trim().toLowerCase() === (exercise.name || '').trim().toLowerCase()
      && Number(ex.points || 0) === Number(exercise.points || 0);
  };
  for (const comp of competitions) {
    const program = programMap.get(comp.program_id);
    if (!program || !program.exercises) continue;
    let foundInThisComp = false;
    program.exercises.forEach((ex, idx) => {
      if (!matches(ex)) return;
      foundInThisComp = true;
      const e1 = (comp.table1 || [])[idx];
      const e2 = (comp.table2 || [])[idx];
      [e1, e2].forEach(e => {
        if (!e) return;
        stats.cross += Number(e.cross || 0);
        stats.wave += Number(e.wave || 0);
        stats.bar += Number(e.bar || 0);
        stats.circle += Number(e.circle || 0);
        const pct = Number(e.schwPct || 0);
        stats.schwPctSum += pct;
        if (pct > 0) {
          stats.schwPctNonZero += 1;
          const key = String(pct);
          stats.schwPctHist[key] = (stats.schwPctHist[key] || 0) + 1;
        }
        const takt = Number(e.taktischePunkte || 0);
        if (takt > 0) {
          stats.taktSum += takt;
          stats.taktCount += 1;
          const tk = takt.toFixed(1);
          stats.taktHist[tk] = (stats.taktHist[tk] || 0) + 1;
        }
        stats.count += 1;
      });
    });
    if (foundInThisComp) stats.wettkaempfe += 1;
  }
  return stats;
}

// Training-Statistik pro Übung — Quote aus Sessions
// ropeFilter: null = alle Sessions, true = nur mit Seil, false = nur ohne Seil
// =============================================================
// KI-Insight für eine Übung — regel-basierter „Trainer-Tipp".
// Bei wenig Daten: ein kurzer Satz.
// Bei viel Daten: mehrere Zeilen (Volumen → Trend → Frequenz →
// Risiko → Empfehlung). Keine externe AI-Anfrage nötig.
// Rückgabe: { lines: string[], rich: boolean }
// =============================================================
function generateExerciseInsight(exercise, sessions, t, programs, competitions) {
  if (!exercise || !sessions) return null;
  const exSessions = sessions.filter(s => s.exerciseId === exercise.id);
  const entries = exSessions.flatMap(s => s.entries || []);
  const total = entries.length;
  const success = entries.filter(e => e === 'success').length;
  const fail    = entries.filter(e => e === 'fail').length;
  const third   = entries.filter(e => e === 'third').length;
  const rate = total > 0 ? Math.round((success / total) * 100) : 0;
  const target = typeof exercise.target_rate === 'number' ? exercise.target_rate : null;

  // Edge cases — sehr wenig Daten
  // Edge-Cases: wenige/keine Trainingsdaten — aber falls Wettkampf-Daten
  // vorhanden sind, hängen wir die trotzdem dran (Trainer-Tipp wirkt sonst
  // nutzlos für rein wettkampf-aktive Übungen).
  if (total === 0) {
    const lines = [t('aiInsight.noData')];
    appendCompetitionInsight(lines, exercise, programs, competitions, 0, t);
    return { lines, rich: lines.length > 1 };
  }
  if (total < 10) {
    const lines = [t('aiInsight.veryNew', { n: total })];
    appendCompetitionInsight(lines, exercise, programs, competitions, rate, t);
    return { lines, rich: lines.length > 1 };
  }

  // Stale check (länger als 30 Tage)
  const sessionDates = exSessions.map(s => s.date).filter(Boolean).sort();
  const firstDate = sessionDates[0];
  const lastDate  = sessionDates[sessionDates.length - 1];
  let daysSinceLast = null;
  if (lastDate) daysSinceLast = Math.floor((Date.now() - new Date(lastDate).getTime()) / 86400000);

  // Trainings-Spanne in Wochen / Monaten
  let weeks = null, months = null;
  if (firstDate && lastDate) {
    const ms = new Date(lastDate).getTime() - new Date(firstDate).getTime();
    weeks  = Math.max(1, Math.round(ms / (7 * 86400000)));
    months = Math.max(1, Math.round(ms / (30 * 86400000)));
  }

  // Trend: letzte 4 Wochen vs. vorherige 4 Wochen
  const now = Date.now();
  const recentStart = new Date(now - 28 * 86400000).toISOString().slice(0, 10);
  const olderStart  = new Date(now - 56 * 86400000).toISOString().slice(0, 10);
  const recentEntries = exSessions.filter(s => (s.date || '') >= recentStart).flatMap(s => s.entries || []);
  const olderEntries  = exSessions.filter(s => (s.date || '') >= olderStart && (s.date || '') < recentStart).flatMap(s => s.entries || []);
  const recentRate = recentEntries.length >= 5 ? Math.round(recentEntries.filter(e => e === 'success').length / recentEntries.length * 100) : null;
  const olderRate  = olderEntries.length  >= 5 ? Math.round(olderEntries.filter(e => e === 'success').length / olderEntries.length * 100)  : null;

  // Frequenz pro Woche (Schnitt über trainierte Spanne)
  const perWeek = weeks ? (exSessions.length / weeks).toFixed(1) : null;

  // Beste Erfolgs-Serie (Streak) über alle Versuche
  let bestStreak = 0, curStreak = 0;
  for (const e of entries) {
    if (e === 'success') { curStreak++; if (curStreak > bestStreak) bestStreak = curStreak; }
    else curStreak = 0;
  }

  // Mit/Ohne Seil getrennt
  let ropeWithRate = null, ropeWithoutRate = null;
  if (exercise.has_rope_variant) {
    const withRopeEntries = exSessions.filter(s => s.withRope === true).flatMap(s => s.entries || []);
    const withoutRopeEntries = exSessions.filter(s => s.withRope === false).flatMap(s => s.entries || []);
    if (withRopeEntries.length >= 10) {
      ropeWithRate = Math.round(withRopeEntries.filter(e => e === 'success').length / withRopeEntries.length * 100);
    }
    if (withoutRopeEntries.length >= 10) {
      ropeWithoutRate = Math.round(withoutRopeEntries.filter(e => e === 'success').length / withoutRopeEntries.length * 100);
    }
  }

  // ─── Reicher Multi-Line-Tipp wenn genug Daten (≥ 30 Versuche) ───
  if (total >= 30) {
    const lines = [];

    // 1) Volumen-Headline
    if (months && months >= 3)      lines.push(t('aiInsight.volumeMonths', { months, sessions: exSessions.length, total, rate }));
    else if (weeks && weeks >= 3)   lines.push(t('aiInsight.volumeLong',   { weeks,  sessions: exSessions.length, total, rate }));
    else                             lines.push(t('aiInsight.volumeShort',  { sessions: exSessions.length, total, rate }));

    // 2) Quote-Einordnung
    if      (rate >= 85) lines.push(t('aiInsight.rateExcellent'));
    else if (rate >= 70) lines.push(t('aiInsight.rateGood'));
    else if (rate >= 55) lines.push(t('aiInsight.rateMedium'));
    else                 lines.push(t('aiInsight.rateLow'));

    // 3) Trend (wenn beide Fenster ≥ 5 Versuche)
    if (recentRate != null && olderRate != null) {
      const delta = recentRate - olderRate;
      if      (delta >= 8)  lines.push(t('aiInsight.trendUp',     { recent: recentRate, older: olderRate, delta }));
      else if (delta <= -8) lines.push(t('aiInsight.trendDown',   { recent: recentRate, older: olderRate, delta: -delta }));
      else                  lines.push(t('aiInsight.trendStable', { recent: recentRate }));
    }

    // 4) Frequenz (nur wenn Spanne >= 4 Wochen sinnvoll)
    if (perWeek && weeks >= 4) {
      const pw = Number(perWeek);
      if      (pw >= 2.5) lines.push(t('aiInsight.freqHigh',   { perWeek }));
      else if (pw >= 1)   lines.push(t('aiInsight.freqMedium', { perWeek }));
      else                lines.push(t('aiInsight.freqLow',    { perWeek }));
    }

    // 5) Stale-Check (zuletzt vor X Tagen)
    if (daysSinceLast != null) {
      if      (daysSinceLast > 60) lines.push(t('aiInsight.veryStale', { days: daysSinceLast }));
      else if (daysSinceLast > 14) lines.push(t('aiInsight.staleDays', { days: daysSinceLast }));
    }

    // 6) Ziel-Quote
    if (target != null) {
      if      (rate >= target)          lines.push(t('aiInsight.targetReached', { target }));
      else if (target - rate <= 5)      lines.push(t('aiInsight.targetClose',   { gap: target - rate, target }));
      else                              lines.push(t('aiInsight.targetFar',     { gap: target - rate, target }));
    }

    // 7) Risiko-Profil bei 3-Kategorien-Übungen
    if (exercise.category_mode === 3 && (fail + third) >= 5) {
      const riskPct = Math.round(third / (fail + third) * 100);
      const label = exercise.third_label || 'Gefährlich';
      if (riskPct >= 30) lines.push(t('aiInsight.riskHigh', { pct: riskPct, label }));
      else if (riskPct < 15) lines.push(t('aiInsight.riskLow',  { pct: riskPct, label }));
    }

    // 8) Mit/Ohne Seil-Vergleich
    if (ropeWithRate != null && ropeWithoutRate != null) {
      const diff = ropeWithRate - ropeWithoutRate;
      if      (diff >= 8)  lines.push(t('aiInsight.ropeBetterWith',    { rWith: ropeWithRate, rWithout: ropeWithoutRate }));
      else if (diff <= -8) lines.push(t('aiInsight.ropeBetterWithout', { rWith: ropeWithRate, rWithout: ropeWithoutRate }));
      else                 lines.push(t('aiInsight.ropeSplit',         { rWith: ropeWithRate, rWithout: ropeWithoutRate }));
    }

    // 9) Streak (Erfolge am Stück) — nur erwähnen wenn beeindruckend
    if (bestStreak >= 10) lines.push(t('aiInsight.bestStreak', { n: bestStreak }));

    // 10) Wettkampf-Insight ergänzen (vor der Empfehlung, damit die Reco
    //     auch die Wettkampf-Daten reflektieren könnte)
    appendCompetitionInsight(lines, exercise, programs, competitions, rate, t);

    // 11) Konkrete Empfehlung am Ende
    if      (target != null && rate < target - 5)   lines.push(t('aiInsight.recoFocus'));
    else if (rate >= 85)                             lines.push(rate >= 95 ? t('aiInsight.recoVariety') : t('aiInsight.recoMaintain'));
    else if (rate < 55)                              lines.push(t('aiInsight.recoTechnique'));
    else if (recentRate != null && olderRate != null && recentRate - olderRate >= 8) lines.push(t('aiInsight.recoMaintain'));
    else                                             lines.push(t('aiInsight.recoFocus'));

    return { lines, rich: true };
  }

  // ─── Mittel-Range (10–29 Versuche) — 1–2 Zeilen ───
  const lines = [t('aiInsight.volumeShort', { sessions: exSessions.length, total, rate })];
  if      (rate >= 85) lines.push(t('aiInsight.rateExcellent'));
  else if (rate >= 70) lines.push(t('aiInsight.rateGood'));
  else if (rate < 50)  lines.push(t('aiInsight.rateLow'));
  if (recentRate != null && olderRate != null) {
    const delta = recentRate - olderRate;
    if      (delta >= 10) lines.push(t('aiInsight.trendUp',   { recent: recentRate, older: olderRate, delta }));
    else if (delta <= -10) lines.push(t('aiInsight.trendDown', { recent: recentRate, older: olderRate, delta: -delta }));
  }
  if (daysSinceLast != null && daysSinceLast > 30) lines.push(t('aiInsight.staleDays', { days: daysSinceLast }));

  // Wettkampf-Insight ergänzen (auch bei mittlerem/wenig Trainings-Volumen)
  appendCompetitionInsight(lines, exercise, programs, competitions, rate, t);
  return { lines, rich: lines.length > 2 };
}

// Hängt Wettkampf-bezogene Tipps an die Insight-Zeilenliste an.
// Punkt-Abzug-Logik:
//   x  = 0.2,  ~ = 0.5,  | = 1.0,  ○ = 2.0  (siehe UCI 8.4.027)
function appendCompetitionInsight(lines, exercise, programs, competitions, trainRate, t) {
  if (!programs || !competitions || !exercise) return;
  const stats = calcExerciseCompetitionStats(exercise, programs, competitions);
  if (stats.wettkaempfe === 0) {
    lines.push(t('aiInsight.compNoData'));
    return;
  }
  if (stats.wettkaempfe < 3) {
    lines.push(t('aiInsight.compFew', { n: stats.wettkaempfe }));
    return;
  }
  const totalDeduction = stats.cross * 0.2 + stats.wave * 0.5 + stats.bar * 1.0 + stats.circle * 2.0;
  const avgDedRaw = totalDeduction / stats.wettkaempfe;
  const avgDed = avgDedRaw.toFixed(2);

  if      (avgDedRaw < 0.15) lines.push(t('aiInsight.compClean',  { n: stats.wettkaempfe, avgDed }));
  else if (avgDedRaw < 0.6)  lines.push(t('aiInsight.compMixed',  { n: stats.wettkaempfe, avgDed }));
  else                       lines.push(t('aiInsight.compShaky',  { n: stats.wettkaempfe, avgDed }));

  // Häufigstes Symbol: zeigt was bei Wettkämpfen am meisten kostet.
  // Sortiert nach gesamtem Punkt-Beitrag (count × weight) — Stürze haben
  // mehr Gewicht als Kreuze, daher landet '○' bei gleich vielen Vorkommen oben.
  const symbols = [
    { keySingular: 'Kreuz',  keyPlural: 'Kreuze',  sym: 'x', count: stats.cross,  weight: 0.2 },
    { keySingular: 'Welle',  keyPlural: 'Wellen',  sym: '~', count: stats.wave,   weight: 0.5 },
    { keySingular: 'Maute',  keyPlural: 'Mauten',  sym: '|', count: stats.bar,    weight: 1.0 },
    { keySingular: 'Sturz',  keyPlural: 'Stürze',  sym: '○', count: stats.circle, weight: 2.0 },
  ].filter(s => s.count > 0);

  if (symbols.length > 0) {
    const top = [...symbols].sort((a, b) => (b.count * b.weight) - (a.count * a.weight))[0];
    const avgPerWk = (top.count / stats.wettkaempfe).toFixed(1).replace('.', ',');
    const name = top.count === 1 ? top.keySingular : top.keyPlural;
    lines.push(t('aiInsight.compTopSymbol', {
      name, sym: top.sym, total: top.count, avg: avgPerWk, n: stats.wettkaempfe
    }));
  }

  // Vergleich Training vs. Wettkampf — Mismatch wenn Training sehr gut aber Wettkampf instabil
  if (trainRate >= 80 && avgDedRaw >= 0.4) {
    lines.push(t('aiInsight.compMismatch', { trainRate }));
  } else if (trainRate >= 60 && avgDedRaw < 0.3) {
    lines.push(t('aiInsight.compMatch', { trainRate }));
  }
}

function calcExerciseTrainingStats(exercise, sessions, ropeFilter = null) {
  const stats = { total: 0, success: 0, fail: 0, third: 0, rate: 0, sessions: 0 };
  if (!exercise || !sessions) return stats;
  let exSessions = sessions.filter(s => s.exerciseId === exercise.id);
  if (ropeFilter !== null) {
    exSessions = exSessions.filter(s => s.withRope === ropeFilter);
  }
  const allEntries = exSessions.flatMap(s => s.entries || []);
  stats.sessions = exSessions.length;
  stats.total = allEntries.length;
  stats.success = allEntries.filter(e => e === 'success').length;
  stats.fail = allEntries.filter(e => e === 'fail').length;
  stats.third = allEntries.filter(e => e === 'third').length;
  stats.rate = stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 0;
  return stats;
}

// =============================================================
// Status-Labels — eine Übung hat 2 oder 3 Status-Kategorien.
// Default-Bezeichnungen können pro Übung überschrieben werden.
// =============================================================
// Datum kompakt: "12.04.26"
function formatDateShort(iso) {
  if (!iso) return '';
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso;
  return m[3] + '.' + m[2] + '.' + m[1].slice(2);
}

function statusLabel(ex, status) {
  if (status === 'success') {
    return (ex && ex.success_label) || 'Geklappt';
  }
  if (status === 'third') {
    return (ex && ex.third_label) || 'Mittel';
  }
  // fail
  if (ex && ex.fail_label) return ex.fail_label;
  if (ex && ex.category_mode === 3) return 'Gefährlich';
  return 'Nicht geklappt';
}

// =============================================================
// XLSX-Import: Maute-Sprung-Statistik
// =============================================================
// Erwartetes Format: Spalten "Datum", "Geklappt", "Getroffen", "Gefährlich"
// Semantik (laut Maute-Sprung-Legende):
//   Geklappt   = sauber gelandet           → success (bestes)
//   Getroffen  = nicht geklappt aber ok    → third  (mittel)
//   Gefährlich = Trainer musste eingreifen → fail   (schlechtestes)
async function parseMauteXlsx(file) {
  const xlsx = await import('xlsx');
  const buf = await file.arrayBuffer();
  const wb = xlsx.read(new Uint8Array(buf), { type: 'array', cellDates: true });
  const sheetName = wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(ws, { defval: null });

  const sessions = [];
  const errors = [];
  for (const r of rows) {
    const rawDate = r['Datum'] ?? r['datum'] ?? r['Date'];
    if (!rawDate) continue;
    let dateStr;
    if (rawDate instanceof Date) {
      dateStr = rawDate.toISOString().slice(0, 10);
    } else if (typeof rawDate === 'string' && /^\d{4}-\d{2}-\d{2}/.test(rawDate)) {
      dateStr = rawDate.slice(0, 10);
    } else if (typeof rawDate === 'string' && /^\d{1,2}[.\/]\d{1,2}[.\/]\d{2,4}/.test(rawDate)) {
      const [d, m, y] = rawDate.split(/[.\/]/);
      const yyyy = y.length === 2 ? '20' + y : y;
      dateStr = yyyy + '-' + m.padStart(2, '0') + '-' + d.padStart(2, '0');
    } else {
      errors.push('Datum unklar: ' + rawDate);
      continue;
    }
    const success = Number(r['Geklappt'] ?? r['geklappt'] ?? 0);
    const third = Number(r['Getroffen'] ?? r['getroffen'] ?? 0);
    const fail = Number(r['Gefährlich'] ?? r['gefaehrlich'] ?? r['Gefaehrlich'] ?? 0);
    if (success + fail + third === 0) continue;
    const entries = [
      ...Array(success).fill('success'),
      ...Array(fail).fill('fail'),
      ...Array(third).fill('third')
    ];
    sessions.push({ date: dateStr, entries });
  }
  return { sessions, errors };
}

const storage = {
  async get(key) {
    const v = localStorage.getItem(key);
    return v !== null ? { value: v } : null;
  },
  async set(key, value) {
    localStorage.setItem(key, value);
    return { value };
  },
  async delete(key) {
    localStorage.removeItem(key);
    return { deleted: true };
  }
};

// Einmalige Migration: alte Maute-Sprung-Labels (third_label='Gefährlich')
// auf neues Schema (third='Getroffen', fail='Gefährlich') anpassen.
// Idempotent — mehrfacher Aufruf richtet keinen Schaden an.
function migrateExerciseLabels(data) {
  if (!data || !data.exercises) return { data, changed: false };
  let changed = false;
  // 1. Übungen: Maute-Labels + has_rope_variant einschalten
  const mauteIds = new Set();
  const exercises = data.exercises.map(ex => {
    const isMaute = (ex.name || '').toLowerCase().includes('maute');
    if (isMaute) {
      mauteIds.add(ex.id);
      const updates = {};
      if (ex.category_mode === 3) {
        if (ex.third_label !== 'Getroffen') updates.third_label = 'Getroffen';
        if (!ex.fail_label) updates.fail_label = 'Gefährlich';
        if (!ex.success_label) updates.success_label = 'Geklappt';
      }
      // Phase 10 — Mit-Seil-Variante einmalig aktivieren
      if (!ex.has_rope_variant) updates.has_rope_variant = true;
      if (Object.keys(updates).length > 0) {
        changed = true;
        return { ...ex, ...updates };
      }
    }
    return ex;
  });
  // 2. Sessions: bestehende Maute-Sprung-Sessions ohne withRope auf true setzen
  //    (User-Wunsch — bisher wurde mit Seil trainiert)
  let sessions = data.sessions || [];
  if (Array.isArray(sessions) && sessions.length > 0 && mauteIds.size > 0) {
    let sessionChanged = false;
    sessions = sessions.map(s => {
      if (s && mauteIds.has(s.exerciseId) && s.withRope === undefined) {
        sessionChanged = true;
        return { ...s, withRope: true };
      }
      return s;
    });
    if (sessionChanged) { changed = true; }
  }
  return { data: { ...data, exercises, sessions }, changed };
}

// =============================================================
// KI-COACH — Floating-Chat (Phase 11)
// =============================================================
// FloatingChat-Button rechts unten + Slide-up-Sheet mit Chat.
// Schreiboperationen werden als Action-Proposal angezeigt und
// erfordern explizite User-Bestätigung.
// =============================================================

const CHAT_HISTORY_KEY = 'artcyc:chat:v1';

async function callChatApi(messages, appData, userName, lang) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) throw new Error('Nicht angemeldet');
  const SUPABASE_URL = 'https://cpxsfctijcsezkspjlxy.supabase.co';
  const res = await fetch(SUPABASE_URL + '/functions/v1/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
    body: JSON.stringify({
      messages: sanitizeMessagesForApi(messages),
      app_data: {
        exercises: appData?.exercises || [],
        sessions: appData?.sessions || [],
        competitions: appData?.competitions || [],
        programs: appData?.programs || [],
      },
      user_name: userName || null,
      lang: lang || 'de',
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    let detail = txt;
    try { const j = JSON.parse(txt); detail = j.error || txt; } catch {}
    throw new Error('Coach nicht erreichbar (' + res.status + '): ' + detail);
  }
  return await res.json();
}

// Anthropic's Messages API erlaubt nur 'user' und 'assistant' als Rolle.
// Wir nutzen intern 'system' für Audit-Einträge nach ausgeführten Aktionen
// („✓ Session aktualisiert"). Vor dem Senden mappen wir die auf 'assistant'
// damit das Modell den Kontext sieht („das ist passiert"), aber die API
// die Rolle akzeptiert.
function sanitizeMessagesForApi(msgs) {
  const out = [];
  for (const m of (msgs || [])) {
    if (!m || !m.content) continue;
    if (m.role === 'user' || m.role === 'assistant') {
      out.push({ role: m.role, content: m.content });
    } else if (m.role === 'system') {
      // Aktions-Audit als Assistant-Note umfassen — die KI versteht
      // den Kontext („ich habe gerade X gemacht") für Folgefragen.
      out.push({ role: 'assistant', content: '[Aktion ausgeführt] ' + m.content });
    }
  }
  return out;
}

/**
 * Streaming-Variante des Chat-API-Calls.
 * Liefert Text-Deltas während Anthropic schreibt — der Client kann
 * sie sofort in der UI rendern statt auf die komplette Antwort zu
 * warten. Am Ende kommt ein eigenes „final"-Event mit dem
 * gesammelten action-Objekt (falls die KI ein Tool aufgerufen hat).
 *
 * Callbacks:
 *   onTextDelta(chunk)   für jeden Text-Token-Block
 *   onPhase(name)        für interne Phasen ('thinking', 'tool')
 *   onFinal(content,act) am Ende mit komplettem Text + ggf. Action
 */
async function callChatApiStream(messages, appData, userName, lang, callbacks) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) throw new Error('Nicht angemeldet');
  const SUPABASE_URL = 'https://cpxsfctijcsezkspjlxy.supabase.co';
  const res = await fetch(SUPABASE_URL + '/functions/v1/chat?stream=1', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
    body: JSON.stringify({
      messages: sanitizeMessagesForApi(messages),
      app_data: {
        exercises: appData?.exercises || [],
        sessions: appData?.sessions || [],
        competitions: appData?.competitions || [],
        programs: appData?.programs || [],
      },
      user_name: userName || null,
      lang: lang || 'de',
    }),
  });
  if (!res.ok || !res.body) {
    const txt = await res.text().catch(() => '');
    let detail = txt;
    try { const j = JSON.parse(txt); detail = j.error || txt; } catch {}
    throw new Error('Coach nicht erreichbar (' + res.status + '): ' + detail);
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buf = '';
  let aggregatedText = '';
  let finalAction = null;
  let finalContent = null;
  let gotFinal = false;
  while (!gotFinal) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const parts = buf.split('\n\n');
    buf = parts.pop() || '';
    for (const part of parts) {
      const lines = part.split('\n');
      let evName = 'message';
      let dataStr = '';
      for (const ln of lines) {
        if (ln.startsWith('event:'))      evName = ln.slice(6).trim();
        else if (ln.startsWith('data:'))  dataStr += ln.slice(5).trim();
      }
      if (!dataStr) continue;
      let ev;
      try { ev = JSON.parse(dataStr); } catch { continue; }
      if (evName === 'final') {
        finalAction = ev.action || null;
        finalContent = ev.content || aggregatedText;
        if (finalAction && callbacks && callbacks.onPhase) callbacks.onPhase('tool');
        // Final-Event empfangen → wir warten NICHT auf den Server-Close
        // (manche Provider schließen TCP nicht sauber). Stream selbst
        // canceln, Loop verlassen.
        gotFinal = true;
        break;
      } else if (evName === 'content_block_start') {
        if (ev.content_block?.type === 'tool_use' && callbacks && callbacks.onPhase) {
          callbacks.onPhase('tool');
        }
      } else if (evName === 'content_block_delta') {
        if (ev.delta?.type === 'text_delta') {
          const t = ev.delta.text || '';
          aggregatedText += t;
          if (callbacks && callbacks.onTextDelta) callbacks.onTextDelta(t);
        }
      }
    }
  }
  // Reader fire-and-forget schließen (nicht awaiten — sonst hängt's
  // falls die TCP-Verbindung kein FIN bekommt)
  try { reader.cancel(); } catch {}
  if (callbacks && callbacks.onFinal) callbacks.onFinal(finalContent ?? aggregatedText, finalAction);
  return { content: finalContent ?? aggregatedText, action: finalAction };
}

// =============================================================
// Mini-Markdown-Renderer für Chat-Bubbles
// =============================================================
// Behandelt die häufigsten Markdown-Patterns der KI-Antworten:
//   **bold**        → fett
//   *italic*        → kursiv (nur wenn nicht Teil von **)
//   `code`          → mono mit subtilem Hintergrund
//   - / • Punkte    → Bullet-Liste (mit orangefarbenen Markern)
//   \n\n            → Absatz-Abstand
//   12% / 12,5 %    → kleines orangefarbenes Chip
// Robust gegen Streaming: unvollständige ** lassen wir einfach als Text.
// =============================================================
function renderInline(text, isUser) {
  if (!text) return null;
  // Tokens sammeln: { type: 'text' | 'strong' | 'em' | 'code' | 'percent', value }
  const out = [];
  let i = 0;
  while (i < text.length) {
    // **bold** — gierig bis zum nächsten **
    if (text[i] === '*' && text[i + 1] === '*') {
      const end = text.indexOf('**', i + 2);
      if (end > i + 2) {
        out.push({ type: 'strong', value: text.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }
    // `code`
    if (text[i] === '`') {
      const end = text.indexOf('`', i + 1);
      if (end > i + 1) {
        out.push({ type: 'code', value: text.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }
    // *italic* (single star, nicht Teil von **)
    if (text[i] === '*' && text[i + 1] !== '*') {
      const end = text.indexOf('*', i + 1);
      if (end > i + 1 && text[end + 1] !== '*') {
        out.push({ type: 'em', value: text.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }
    // Prozent-Wert (z. B. „63 %" oder „80%") als Chip
    const m = text.slice(i).match(/^(\d+(?:[,.]\d+)?)\s?%/);
    if (m) {
      out.push({ type: 'percent', value: m[0] });
      i += m[0].length;
      continue;
    }
    // Normaler Text bis zum nächsten Sonderzeichen
    const next = text.slice(i).search(/(\*\*|`|\*|\d+(?:[,.]\d+)?\s?%)/);
    const chunk = next === -1 ? text.slice(i) : text.slice(i, i + next);
    if (chunk) out.push({ type: 'text', value: chunk });
    i += chunk.length || 1;
  }
  return out.map((tok, idx) => {
    if (tok.type === 'strong')  return <strong key={idx} className="font-semibold">{tok.value}</strong>;
    if (tok.type === 'em')      return <em key={idx}>{tok.value}</em>;
    if (tok.type === 'code')    return <code key={idx} className={(isUser ? 'bg-white/15' : 'bg-slate-100') + ' text-[13px] px-1 py-0.5 rounded'}>{tok.value}</code>;
    if (tok.type === 'percent') return (
      <span key={idx} className={(isUser
        ? 'bg-white/20 text-white'
        : 'bg-[#FF9500]/12 text-[#FF9500]') +
        ' text-[14px] font-semibold px-1.5 py-0.5 rounded-md mx-0.5 whitespace-nowrap'
      }>{tok.value}</span>
    );
    return <span key={idx}>{tok.value}</span>;
  });
}

function ChatMarkdown({ text, isUser }) {
  if (!text) return null;
  // Erst pro Zeile mappen: Bullet-Lines erkennen
  const lines = text.split('\n');
  const blocks = [];
  let currentList = null;
  let currentPara = [];
  const flushPara = () => {
    if (currentPara.length === 0) return;
    blocks.push({ type: 'p', lines: currentPara });
    currentPara = [];
  };
  const flushList = () => {
    if (!currentList) return;
    blocks.push({ type: 'ul', items: currentList });
    currentList = null;
  };
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line) {
      // Leerzeile → Block-Trenner
      flushPara();
      flushList();
      continue;
    }
    const bullet = line.match(/^\s*(?:[-•*])\s+(.+)$/);
    if (bullet) {
      flushPara();
      if (!currentList) currentList = [];
      currentList.push(bullet[1]);
    } else {
      flushList();
      currentPara.push(line);
    }
  }
  flushPara();
  flushList();
  return (
    <div className="space-y-2">
      {blocks.map((b, i) => {
        if (b.type === 'ul') {
          return (
            <ul key={i} className="space-y-1 ml-1">
              {b.items.map((it, j) => (
                <li key={j} className="flex gap-2">
                  <span className={isUser ? 'text-white/80 shrink-0' : 'text-[#FF9500] shrink-0 font-semibold'}>•</span>
                  <span className="flex-1">{renderInline(it, isUser)}</span>
                </li>
              ))}
            </ul>
          );
        }
        // Paragraph: Zeilen mit \n verbinden, whitespace-pre-line damit Umbrüche bleiben
        return (
          <p key={i} className="whitespace-pre-line leading-snug">
            {b.lines.map((ln, j) => (
              <span key={j}>
                {renderInline(ln, isUser)}
                {j < b.lines.length - 1 && '\n'}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

// Tool-Namen → menschenlesbare Aktions-Bezeichnung (statt rohem
// "propose_update_session" im UI-Confirm-Card).
function toolLabel(toolName) {
  switch (toolName) {
    case 'propose_create_session':       return 'Neue Session anlegen';
    case 'propose_update_session':       return 'Session ändern';
    case 'propose_bulk_update_sessions': return 'Mehrere Sessions ändern';
    case 'propose_delete_session':       return 'Session löschen';
    case 'propose_create_exercise':      return 'Übung anlegen';
    case 'propose_update_exercise':      return 'Übung ändern';
    default: return 'Aktion ausführen';
  }
}

// Blob-Feld-Namen (camelCase) auf DB-Feld-Namen (snake_case) mappen
// — wichtig wenn migrated_to_tables aktiv ist und wir per Supabase-API
// schreiben. Reduziert auf die Felder die der KI-Coach setzen kann.
function blobFieldsToDb(fields) {
  const out = {};
  if (fields.withRope !== undefined) out.with_rope = fields.withRope;
  if (fields.notes    !== undefined) out.notes    = fields.notes;
  if (fields.date     !== undefined) out.date     = fields.date;
  if (fields.entries  !== undefined) out.entries  = fields.entries;
  return out;
}

// Aktion vom AI auf den App-State anwenden.
// ASYNC, weil DB-Pfad bei migrated_to_tables aktive Supabase-Aufrufe nötig.
// onRefresh-Callbacks werden danach gerufen damit die UI frische Daten zieht.
async function applyChatAction(action, data, setData, refreshers) {
  if (!action || !action.tool) return 'Keine Aktion.';
  const p = action.params || {};
  const useDb = !!data.migrated_to_tables;
  if (action.tool === 'propose_create_session') {
    const ex = (data.exercises || []).find(e => e.id === p.exerciseId);
    const entries = Array.isArray(p.entries) ? p.entries : [];
    const withRope = (ex && ex.has_rope_variant) ? (typeof p.withRope === 'boolean' ? p.withRope : null) : null;
    const succ = entries.filter(x => x === 'success').length;
    const ropeTag = withRope === true ? ' · mit Seil' : withRope === false ? ' · ohne Seil' : '';
    if (useDb) {
      const { error } = await insertSession({
        athlete_id: null,
        exercise_id: p.exerciseId,
        date: p.date || new Date().toISOString().slice(0, 10),
        entries,
        notes: p.notes || '',
        exercise_name: ex ? ex.name : '',
        with_rope: withRope,
      });
      if (error) return '⚠ DB-Fehler: ' + error.message;
      if (refreshers && refreshers.sessions) await refreshers.sessions();
      return '✓ Session angelegt: ' + (ex ? ex.name : 'Übung') + ' · ' + entries.length + ' Serien (' + succ + ' geklappt)' + ropeTag;
    }
    const newSession = {
      id: uid(),
      date: p.date || new Date().toISOString().slice(0, 10),
      exerciseId: p.exerciseId,
      exerciseName: ex ? ex.name : '',
      entries,
      notes: p.notes || null,
      withRope,
      athleteId: null,
    };
    setData({ ...data, sessions: [...(data.sessions || []), newSession] });
    return '✓ Session angelegt: ' + (ex ? ex.name : 'Übung') + ' · ' + entries.length + ' Serien (' + succ + ' geklappt)' + ropeTag;
  }
  if (action.tool === 'propose_update_session') {
    const fields = p.fields || {};
    const fieldList = Object.keys(fields).filter(k => fields[k] !== undefined).join(', ');
    if (!fieldList) {
      return '⚠ KI-Coach hat keine Feld-Änderungen angegeben — bitte konkreter fragen (z. B. „setze withRope auf true").';
    }
    if (useDb) {
      const { error } = await updateSession(p.sessionId, blobFieldsToDb(fields));
      if (error) return '⚠ DB-Fehler: ' + error.message;
      if (refreshers && refreshers.sessions) await refreshers.sessions();
      return '✓ Session aktualisiert (' + fieldList + ')';
    }
    let updated = 0;
    const next = (data.sessions || []).map(s => {
      if (s.id === p.sessionId) { updated++; return { ...s, ...fields }; }
      return s;
    });
    setData({ ...data, sessions: next });
    return updated > 0
      ? '✓ Session aktualisiert (' + fieldList + ')'
      : '⚠ Session nicht gefunden (ID: ' + (p.sessionId || '—') + ')';
  }
  if (action.tool === 'propose_bulk_update_sessions') {
    const filter = p.filter || {};
    const fields = p.fields || {};
    const fieldList = Object.keys(fields).filter(k => fields[k] !== undefined).join(', ');
    if (!fieldList) {
      return '⚠ KI-Coach hat keine Feld-Änderungen angegeben.';
    }
    if (useDb) {
      const dbFilter = {};
      if (filter.exerciseId) dbFilter.exercise_id = filter.exerciseId;
      if (typeof filter.withRopeIs === 'boolean') dbFilter.with_rope_is = filter.withRopeIs;
      const { error, count } = await bulkUpdateSessions(dbFilter, blobFieldsToDb(fields));
      if (error) return '⚠ DB-Fehler: ' + error.message;
      if (refreshers && refreshers.sessions) await refreshers.sessions();
      return count > 0
        ? '✓ ' + count + ' Sessions aktualisiert (' + fieldList + ')'
        : '⚠ Keine passenden Sessions gefunden';
    }
    let updated = 0;
    const next = (data.sessions || []).map(s => {
      if (filter.exerciseId && s.exerciseId !== filter.exerciseId) return s;
      if (typeof filter.withRopeIs === 'boolean' && s.withRope !== filter.withRopeIs) return s;
      updated++;
      return { ...s, ...fields };
    });
    setData({ ...data, sessions: next });
    return updated > 0
      ? '✓ ' + updated + ' Sessions aktualisiert (' + fieldList + ')'
      : '⚠ Keine passenden Sessions gefunden';
  }
  if (action.tool === 'propose_delete_session') {
    if (useDb) {
      const { error } = await deleteSession(p.sessionId);
      if (error) return '⚠ DB-Fehler: ' + error.message;
      if (refreshers && refreshers.sessions) await refreshers.sessions();
      return '✓ Session gelöscht';
    }
    const before = (data.sessions || []).length;
    const next = (data.sessions || []).filter(s => s.id !== p.sessionId);
    setData({ ...data, sessions: next });
    return next.length < before ? '✓ Session gelöscht' : '⚠ Session nicht gefunden';
  }
  if (action.tool === 'propose_create_exercise') {
    const newEx = {
      name: p.name,
      uci_code: p.uci_code || null,
      uci_disc: p.uci_disc || null,
      active: true,
      category_mode: p.category_mode || 2,
      third_label: p.category_mode === 3 ? (p.third_label || 'Dritte') : null,
      default_series: p.default_series || 10,
      target_rate: typeof p.target_rate === 'number' ? p.target_rate : null,
      has_rope_variant: !!p.has_rope_variant,
    };
    if (useDb) {
      const { error } = await upsertExercise(newEx);
      if (error) return '⚠ DB-Fehler: ' + error.message;
      if (refreshers && refreshers.exercises) await refreshers.exercises();
      return '✓ Übung „' + newEx.name + '" angelegt';
    }
    setData({ ...data, exercises: [...(data.exercises || []), { ...newEx, id: uid() }] });
    return '✓ Übung „' + newEx.name + '" angelegt';
  }
  if (action.tool === 'propose_update_exercise') {
    const fields = p.fields || {};
    const fieldList = Object.keys(fields).filter(k => fields[k] !== undefined).join(', ');
    if (!fieldList) {
      return '⚠ KI-Coach hat keine Feld-Änderungen angegeben — bitte konkreter fragen.';
    }
    if (useDb) {
      // Bestehende Übung holen, fields drüber-mergen, upserten
      const existing = (data.exercises || []).find(e => e.id === p.exerciseId);
      if (!existing) return '⚠ Übung nicht gefunden (ID: ' + (p.exerciseId || '—') + ')';
      const { error } = await upsertExercise({ ...existing, ...fields, id: p.exerciseId });
      if (error) return '⚠ DB-Fehler: ' + error.message;
      if (refreshers && refreshers.exercises) await refreshers.exercises();
      return '✓ Übung aktualisiert (' + fieldList + ')';
    }
    let updated = 0;
    const next = (data.exercises || []).map(e => {
      if (e.id === p.exerciseId) { updated++; return { ...e, ...fields }; }
      return e;
    });
    setData({ ...data, exercises: next });
    return updated > 0
      ? '✓ Übung aktualisiert (' + fieldList + ')'
      : '⚠ Übung nicht gefunden (ID: ' + (p.exerciseId || '—') + ')';
  }
  return '⚠ Aktion „' + action.tool + '" nicht erkannt';
}

function FloatingChat({ data, setData, profile, refreshers, open, onClose }) {
  const { t, lang } = useI18n();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState(''); // '' | 'thinking' | 'writing' | 'tool'
  const [streamingText, setStreamingText] = useState(''); // Live-Text-Aufbau während Streaming
  const [err, setErr] = useState('');
  const [pendingAction, setPendingAction] = useState(null);
  const scrollRef = useRef(null);

  // History laden
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHAT_HISTORY_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setMessages(parsed);
      }
    } catch {}
  }, []);

  // History speichern
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Auto-Scroll bei neuer Nachricht
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, busy, pendingAction]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setErr('');
    setPendingAction(null);
    const userMsg = { role: 'user', content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setBusy(true);
    setPhase('thinking');
    setStreamingText('');
    let firstDelta = true;
    let partialText = '';
    // Safety-Timeout — falls Stream wegen TCP-Hänger nie returnt:
    // nach 60 Sek hart auf nicht-busy zurückfallen damit Input wieder frei
    // ist. Fängt seltene Edge-Function/iOS-Safari-Race-Conditions ab.
    const safetyTimer = setTimeout(() => {
      setBusy(false);
      setPhase('');
      setStreamingText('');
      setErr('Antwort wurde unterbrochen — bitte nochmal probieren.');
    }, 60000);
    try {
      const result = await callChatApiStream(next, data, profile?.display_name, lang, {
        onTextDelta: (t) => {
          if (firstDelta) { setPhase('writing'); firstDelta = false; }
          partialText += t;
          setStreamingText(partialText);
        },
        onPhase: (p) => setPhase(p),
        onFinal: (content, action) => {
          // Letztes Update kommt automatisch über streamingText
        }
      });
      const assistantMsg = {
        role: 'assistant',
        content: result.content || partialText || '',
        action: result.action || null,
      };
      setMessages([...next, assistantMsg]);
      if (result.action) setPendingAction({ action: result.action, msgIdx: next.length });
    } catch (e) {
      // Bei Stream-Abbruch: schon empfangenen Text als Assistant-Message
      // speichern (mit Hinweis), damit der User die Teil-Antwort behält.
      if (partialText) {
        const isLoadFailed = /load failed|networkerror|failed to fetch/i.test(e.message || '');
        const suffix = isLoadFailed
          ? '\n\n_(Verbindung wurde abgebrochen — frag noch mal nach falls die Antwort unvollständig wirkt.)_'
          : '\n\n_(Antwort wurde unterbrochen.)_';
        setMessages([...next, { role: 'assistant', content: partialText + suffix }]);
      } else {
        const msg = e.message || String(e);
        const friendly = /load failed|networkerror|failed to fetch/i.test(msg)
          ? 'Verbindung unterbrochen. Bitte nochmal probieren — meist hilft schon Reload.'
          : msg;
        setErr(friendly);
      }
    } finally {
      clearTimeout(safetyTimer);
      setBusy(false);
      setPhase('');
      setStreamingText('');
    }
  };

  const approveAction = async () => {
    if (!pendingAction) return;
    // Pending-Action sofort wegnehmen + temporäres Status-Pending zeigen
    const action = pendingAction.action;
    setPendingAction(null);
    setMessages(m => [...m, { role: 'system', content: '⏳ Wird ausgeführt…' }]);
    const result = await applyChatAction(action, data, setData, refreshers);
    // Letzte Status-Message durch das echte Ergebnis ersetzen
    setMessages(m => [...m.slice(0, -1), { role: 'system', content: result }]);
  };

  const denyAction = () => {
    setMessages([...messages, { role: 'system', content: 'Aktion abgebrochen.' }]);
    setPendingAction(null);
  };

  const clearChat = () => {
    if (!confirm('Chatverlauf löschen?')) return;
    setMessages([]);
    setPendingAction(null);
    setErr('');
    // Auch transienten Stream-State zurücksetzen — sonst bleibt der
    // blinkende Cursor sichtbar wenn der vorherige Stream gehangen hat.
    setBusy(false);
    setPhase('');
    setStreamingText('');
    try { localStorage.removeItem(CHAT_HISTORY_KEY); } catch {}
  };

  // Der Trigger-Button sitzt jetzt im App-Header (siehe App-Component).
  // Hier wird nur noch das Chat-Sheet kontrolliert via open-prop.
  if (!open) return null;

  return (
    <>
      {/* Chat-Sheet */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
          <div
            className="bg-[#F2F2F7] rounded-t-3xl sm:rounded-3xl w-full max-w-2xl h-[85vh] sm:h-[80vh] shadow-2xl flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-4 py-3 flex items-center justify-between">
              <button onClick={onClose} className="text-amber-500 font-medium text-[15px]">{t('chat.done')}</button>
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" />
                <span className="font-semibold text-[15px]">ArtCyc Coach</span>
              </div>
              <button onClick={clearChat} disabled={messages.length === 0}
                className="text-slate-500 text-[13px] disabled:opacity-30">{t('chat.titleNew')}</button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.length === 0 && !busy && (
                <div className="text-center py-12 px-4">
                  <div className="inline-block w-14 h-14 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-3">
                    <Sparkles size={26} className="text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{t('chat.askYourCoach')}</h3>
                  <p className="text-sm text-slate-500 mb-4">
                    {t('chat.intro')}
                  </p>
                  <div className="space-y-2 text-left">
                    {[
                      t('chat.suggest1'),
                      t('chat.suggest2'),
                      t('chat.suggest3'),
                      t('chat.suggest4')
                    ].map(s => (
                      <button key={s} onClick={() => setInput(s)}
                        className="block w-full text-left text-[13px] bg-white border border-slate-200 rounded-xl px-3 py-2.5 active:bg-slate-50">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => {
                if (m.role === 'system') {
                  const isOk = m.content.startsWith('✓');
                  const isWarn = m.content.startsWith('⚠');
                  return (
                    <div key={i} className="flex justify-center">
                      <div className={'text-[13px] rounded-2xl px-3.5 py-2 max-w-[90%] text-center leading-snug ' + (
                        isOk   ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/60' :
                        isWarn ? 'bg-amber-50 text-amber-900 border border-amber-200/60' :
                                 'bg-slate-100 text-slate-700 border border-slate-200/60'
                      )}>
                        {m.content}
                      </div>
                    </div>
                  );
                }
                const isUser = m.role === 'user';
                const content = m.content || (m.action ? 'Vorschlag siehe unten' : '…');
                return (
                  <div key={i} className={'flex ' + (isUser ? 'justify-end' : 'justify-start')}>
                    <div className={(isUser
                      ? 'bg-[#007AFF] text-white rounded-br-md'
                      : 'bg-white text-slate-900 rounded-bl-md border border-slate-200/60'
                    ) + ' max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[15px] break-words'}>
                      {isUser
                        ? <span className="whitespace-pre-wrap leading-snug">{content}</span>
                        : <ChatMarkdown text={content} isUser={false} />}
                    </div>
                  </div>
                );
              })}
              {/* Live-Text während Streaming (vor dem finalen Speichern in messages) */}
              {busy && streamingText && (
                <div className="flex justify-start">
                  <div className="bg-white text-slate-900 rounded-2xl rounded-bl-md border border-slate-200/60 max-w-[85%] px-3.5 py-2.5 text-[15px] break-words">
                    <ChatMarkdown text={streamingText} isUser={false} />
                    <span className="inline-block w-1.5 h-3.5 bg-[#FF9500] ml-0.5 align-text-bottom animate-pulse" />
                  </div>
                </div>
              )}

              {/* Pending Action — saubere iOS-Karte mit lesbarem Tool-Label */}
              {pendingAction && (
                <div className="bg-amber-50 border border-amber-300/70 rounded-2xl p-4 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0">
                      <AlertTriangle size={16} className="text-amber-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-semibold text-amber-800 uppercase tracking-wide mb-0.5">Bestätigung nötig</div>
                      <div className="text-[15px] text-slate-900 font-semibold leading-tight">
                        {toolLabel(pendingAction.action.tool)}
                      </div>
                      {pendingAction.action.summary && (
                        <div className="text-[13px] text-slate-700 mt-1 leading-snug">
                          {pendingAction.action.summary}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={denyAction}
                      className="flex-1 py-2.5 rounded-xl bg-white border border-slate-300 font-medium text-[14px] active:opacity-60">
                      Abbrechen
                    </button>
                    <button onClick={approveAction}
                      className="flex-1 py-2.5 rounded-xl bg-[#FF9500] text-white font-semibold text-[14px] flex items-center justify-center gap-1.5 active:scale-95 transition shadow-[0_2px_8px_rgba(255,149,0,0.3)]">
                      <Check size={14} strokeWidth={2.6} /> Bestätigen
                    </button>
                  </div>
                </div>
              )}

              {/* Phase-Indikator — zeigt dem User was der Coach gerade tut */}
              {busy && !streamingText && (
                <div className="flex items-center gap-2 text-[#8E8E93] text-[14px]">
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF9500] animate-pulse" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF9500] animate-pulse" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF9500] animate-pulse" style={{ animationDelay: '300ms' }} />
                  </span>
                  <span>
                    {phase === 'tool' ? t('chat.phase.tool')
                      : phase === 'writing' ? t('chat.phase.writing')
                      : t('chat.phase.thinking')}
                  </span>
                </div>
              )}
              {busy && streamingText && phase === 'tool' && (
                <div className="flex items-center gap-2 text-[#8E8E93] text-[13px] pl-1">
                  <Loader2 size={12} className="animate-spin" /> bereitet Aktion vor…
                </div>
              )}
              {err && (
                <div className="bg-rose-50 border border-rose-200 text-rose-900 text-sm rounded-xl p-3">
                  ✗ {err}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="bg-white/90 backdrop-blur-xl border-t border-slate-200/60 p-3 flex items-end gap-2"
              style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder={t('chat.placeholder')}
                rows={1}
                disabled={busy}
                className="flex-1 px-3 py-2.5 bg-slate-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-amber-500 text-[15px] resize-none max-h-32" />
              <button onClick={send} disabled={!input.trim() || busy}
                className="w-10 h-10 rounded-full bg-[#FF9500] text-white flex items-center justify-center disabled:opacity-30 active:scale-95 transition shrink-0">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// =============================================================
// BottomNav — Liquid-Glass-Pille mit Finger-Drag-Tab-Wechsel
// =============================================================
// Finger irgendwo auf der Bar runterdrücken und über die Symbole ziehen —
// die aktive Tab folgt dem Finger. Beim Loslassen bleibt es bei der zuletzt
// angefahrenen Tab. Tap funktioniert wie gehabt.
function BottomNav({ items, view, setView }) {
  const navRef = useRef(null);
  const draggingRef = useRef(false);

  const updateFromTouch = (clientX) => {
    const root = navRef.current;
    if (!root) return;
    const buttons = root.querySelectorAll('[data-nav-id]');
    let closest = null;
    let closestDist = Infinity;
    for (const b of buttons) {
      const rect = b.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const dist = Math.abs(clientX - cx);
      if (dist < closestDist) { closestDist = dist; closest = b; }
    }
    if (closest) {
      const id = closest.dataset.navId;
      if (id !== view) setView(id);
    }
  };

  const onTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    draggingRef.current = true;
    updateFromTouch(e.touches[0].clientX);
  };
  const onTouchMove = (e) => {
    if (!draggingRef.current || e.touches.length !== 1) return;
    updateFromTouch(e.touches[0].clientX);
  };
  const onTouchEnd = () => { draggingRef.current = false; };

  return (
    <nav
      ref={navRef}
      className="sm:hidden fixed bottom-0 left-0 right-0 z-30 px-4 select-none"
      style={{
        paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        WebkitTouchCallout: 'none',
        touchAction: 'none' // verhindert dass iOS scroll/zoom auf der Bar triggert
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}>
      <div
        className="ios-bottom-pill rounded-full flex justify-around items-stretch py-2 px-2"
        style={{
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)'
        }}>
        {items.map((n) => {
          const Icon = n.icon;
          const active = view === n.id;
          return (
            <button
              key={n.id}
              type="button"
              data-nav-id={n.id}
              onClick={() => setView(n.id)}
              style={{ WebkitTapHighlightColor: 'transparent', WebkitTouchCallout: 'none' }}
              className={'flex flex-col items-center justify-center gap-1 flex-1 py-1.5 px-1 rounded-full transition-all duration-150 active:scale-[0.92] select-none ' +
                (active ? 'text-[#FF9500]' : 'text-[#8E8E93]')}>
              <Icon size={24} strokeWidth={active ? 2.4 : 1.8} />
              <span className={'text-[10px] tracking-tight leading-none ' + (active ? 'font-semibold' : 'font-medium')}>{n.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// =============================================================
// SwipeableMain — Hauptbereich mit horizontalem Swipe für Tab-Wechsel
// =============================================================
// Erkennt seitliche Wisch-Gesten und schaltet zur Nachbar-Tab.
// Schwellen: |dx| > 60px, |dy| < 50px, Dauer < 600ms.
// Swipes innerhalb scrollbarer Bereiche werden ignoriert (data-no-swipe).
function SwipeableMain({ view, setView, visibleNav, children }) {
  const stateRef = useRef({ x: 0, y: 0, time: 0, lock: null, active: false });

  const onTouchStart = (e) => {
    if (e.touches.length !== 1) { stateRef.current.active = false; return; }
    let el = e.target;
    while (el) {
      if (el.dataset && el.dataset.noSwipe) { stateRef.current.active = false; return; }
      el = el.parentElement;
    }
    const t = e.touches[0];
    stateRef.current = { x: t.clientX, y: t.clientY, time: Date.now(), lock: null, active: true };
  };

  const onTouchMove = (e) => {
    const s = stateRef.current;
    if (!s.active || e.touches.length !== 1) return;
    if (s.lock != null) return;
    const t = e.touches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    // Erst nach 12px Bewegung Richtung festlegen — verhindert Mis-Lock auf Vertikal
    if (Math.abs(dx) > 12 || Math.abs(dy) > 12) {
      s.lock = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    }
  };

  const onTouchEnd = (e) => {
    const s = stateRef.current;
    stateRef.current.active = false;
    if (!s.active || s.lock !== 'x') return;
    const t = e.changedTouches[0];
    const dx = t.clientX - s.x;
    const dt = Date.now() - s.time;
    if (Math.abs(dx) < 50 || dt > 700) return;
    const idx = visibleNav.findIndex((n) => n.id === view);
    if (idx === -1) return;
    if (dx < 0 && idx < visibleNav.length - 1) setView(visibleNav[idx + 1].id);
    else if (dx > 0 && idx > 0) setView(visibleNav[idx - 1].id);
  };

  return (
    <main
      className="flex-1 sm:pb-8"
      style={{
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 6.5rem)',
        touchAction: 'pan-y'
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}>
      {children}
    </main>
  );
}

function Brand({ size = 'md' }) {
  const iconSize = size === 'sm' ? 18 : 22;
  const titleClass = size === 'sm' ? 'text-[15px] font-semibold tracking-tight' : 'text-[17px] font-bold tracking-tight';
  return (
    <div className="flex items-center gap-2 select-none">
      <div className="w-8 h-8 bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl flex items-center justify-center shadow-sm">
        <Trophy className="text-amber-400" size={iconSize - 4} />
      </div>
      <span className={titleClass}>ArtCyc Coach</span>
    </div>
  );
}

// =============================================================
// HAUPT-APP
// =============================================================
const THEME_KEY = 'artcyc:theme'; // 'system' | 'light' | 'dark'

// =============================================================
// Pull-to-Refresh — globaler Hook + Indikator
// =============================================================
// Native iOS-Mail-Style: am oberen Rand nach unten ziehen löst
// einen Daten-Refresh aus. Wir hängen uns an Window-Touch-Events,
// weil das App-Layout window-scroll nutzt (kein innerer Container).
// Trigger-Schwelle: 60px gezogen → onRefresh. Über 120px gedämpft.
function usePullToRefresh(onRefresh, enabled = true) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const pullRef = useRef(0);
  const startRef = useRef(0);
  const pullingRef = useRef(false);
  const refreshingRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const onStart = (e) => {
      if (refreshingRef.current) return;
      if (window.scrollY > 5) return;
      startRef.current = e.touches[0].clientY;
      pullingRef.current = true;
    };
    const onMove = (e) => {
      if (!pullingRef.current || refreshingRef.current) return;
      if (window.scrollY > 5) {
        pullingRef.current = false; pullRef.current = 0; setPull(0); return;
      }
      const dy = e.touches[0].clientY - startRef.current;
      if (dy < 0) {
        pullingRef.current = false; pullRef.current = 0; setPull(0); return;
      }
      // Resistance: dy * 0.5, clamped at 120
      const p = Math.min(dy * 0.5, 120);
      pullRef.current = p;
      setPull(p);
    };
    const onEnd = async () => {
      if (!pullingRef.current) return;
      pullingRef.current = false;
      const shouldRefresh = pullRef.current > 60;
      if (shouldRefresh) {
        refreshingRef.current = true;
        setRefreshing(true);
        setPull(60);
        try { await onRefresh(); } catch (e) { console.warn('PTR refresh failed:', e); }
        refreshingRef.current = false;
        setRefreshing(false);
      }
      pullRef.current = 0;
      setPull(0);
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
    window.addEventListener('touchcancel', onEnd);
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
      window.removeEventListener('touchcancel', onEnd);
    };
  }, [onRefresh, enabled]);

  return { pull, refreshing };
}

function PullToRefreshIndicator({ pull, refreshing }) {
  if (pull === 0 && !refreshing) return null;
  const progress = Math.min(pull / 60, 1);
  const offset = refreshing ? 60 : pull;
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] flex justify-center pointer-events-none"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="bg-white/95 dark:bg-[#1c1c1e]/95 backdrop-blur-xl shadow-[0_2px_8px_rgba(0,0,0,0.15)] rounded-full p-2.5 mt-2"
        style={{ transform: `translateY(${offset - 56}px)`, transition: refreshing ? 'transform 0.2s ease-out' : 'none' }}>
        {refreshing ? (
          <Loader2 size={18} className="text-[#FF9500] animate-spin" />
        ) : (
          <RotateCcw size={18} className="text-[#FF9500]"
            style={{ transform: `rotate(${progress * 360}deg)`, opacity: 0.3 + progress * 0.7 }} />
        )}
      </div>
    </div>
  );
}

export default function App() {
  const { t, lang, langPref, setLangPref } = useI18n();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('dashboard');
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // Reglement-Sprache: separat von App-Sprache wählbar. 'auto' = App-Sprache spiegeln
  // mit Fallback auf 'en' falls App-Sprache keine UCI-Sprache ist.
  const [rulesLangPref, setRulesLangPrefState] = useState(() => {
    try {
      const v = localStorage.getItem(RULES_LANG_KEY);
      if (v === 'auto' || SUPPORTED_RULES_LANGS.includes(v)) return v;
    } catch {}
    return 'auto';
  });
  const setRulesLangPref = useCallback((v) => {
    setRulesLangPrefState(v);
    try { localStorage.setItem(RULES_LANG_KEY, v); } catch {}
  }, []);
  const effectiveRulesLang = getRulesLanguage(lang, rulesLangPref);

  // UCI-Übungen aus DB nachladen sobald wir wissen welche Sprache; bei Wechsel re-fetchen.
  useEffect(() => {
    if (!session) return; // erst nach Login DB-Zugriff
    let cancelled = false;
    loadUciExercisesFromDb(effectiveRulesLang).then(rows => {
      if (cancelled || !rows) return;
      setActiveDb(rows);
    });
    return () => { cancelled = true; };
  }, [session, effectiveRulesLang]);

  // App-Notices (UCI-Reglement-Update etc.)
  const [notices, setNotices] = useState([]);
  useEffect(() => {
    if (!session) { setNotices([]); return; }
    fetchActiveNotices().then(setNotices);
  }, [session?.user?.id]);
  const dismissNoticeLocal = useCallback(async (id) => {
    setNotices(ns => ns.filter(n => n.id !== id));
    await dismissNotice(id);
  }, []);

  // Theme: 'system' folgt prefers-color-scheme, 'light'/'dark' überschreiben
  const [theme, setTheme] = useState(() => {
    try {
      const v = localStorage.getItem(THEME_KEY);
      return v === 'light' || v === 'dark' ? v : 'system';
    } catch { return 'system'; }
  });
  useEffect(() => {
    try { localStorage.setItem(THEME_KEY, theme); } catch {}
    const applyTheme = () => {
      const effective = theme === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : theme;
      document.documentElement.setAttribute('data-theme', effective);
    };
    applyTheme();
    if (theme === 'system' && window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme();
      // Safari: addListener, modern: addEventListener
      if (mq.addEventListener) mq.addEventListener('change', handler);
      else if (mq.addListener) mq.addListener(handler);
      return () => {
        if (mq.removeEventListener) mq.removeEventListener('change', handler);
        else if (mq.removeListener) mq.removeListener(handler);
      };
    }
  }, [theme]);

  // Globale Feedback-Bridge für KI-Coach attachen (einmalig)
  useEffect(() => { attachGlobalFeedbackBridge(); }, []);

  // Feedback-Modal-State auf App-Level — kann aus Dashboard, Settings
  // und ggf. KI-Coach getriggert werden.
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const openFeedback = () => setFeedbackOpen(true);

  // Supabase-Session prüfen + Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthChecked(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, sess) => {
      setSession(sess);
      if (!sess) { setProfile(null); setData(null); }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Profil laden bei Login
  useEffect(() => {
    if (session) getCurrentProfile().then(setProfile);
  }, [session?.user?.id]);

  // Athletes aus Supabase laden (Phase 9a — DB-basiert statt JSONB-Blob)
  const [dbAthletes, setDbAthletes] = useState([]);
  const [dbProfiles, setDbProfiles] = useState([]);
  // Phase 9d-3: alle "großen" Entitäten kommen aus DB-Tabellen
  const [dbSessions, setDbSessions] = useState([]);
  const [dbCompetitions, setDbCompetitions] = useState([]);
  const [dbPrograms, setDbPrograms] = useState([]);
  const [dbExercises, setDbExercises] = useState([]);
  const refreshAthletes = useCallback(async () => {
    if (!session) { setDbAthletes([]); setDbProfiles([]); return; }
    const [list, profs] = await Promise.all([fetchAthletes(), fetchProfiles()]);
    setDbAthletes(list);
    setDbProfiles(profs);
  }, [session]);
  const refreshSessions = useCallback(async () => {
    if (!session) { setDbSessions([]); return; }
    const list = await fetchSessions();
    setDbSessions(list);
  }, [session]);
  const refreshCompetitions = useCallback(async () => {
    if (!session) { setDbCompetitions([]); return; }
    setDbCompetitions(await fetchCompetitions());
  }, [session]);
  const refreshPrograms = useCallback(async () => {
    if (!session) { setDbPrograms([]); return; }
    setDbPrograms(await fetchPrograms());
  }, [session]);
  const refreshExercises = useCallback(async () => {
    if (!session) { setDbExercises([]); return; }
    setDbExercises(await fetchExercises());
  }, [session]);
  useEffect(() => {
    refreshAthletes();
    refreshSessions();
    refreshCompetitions();
    refreshPrograms();
    refreshExercises();
  }, [refreshAthletes, refreshSessions, refreshCompetitions, refreshPrograms, refreshExercises]);

  // Pull-to-Refresh: alle relationalen Tabellen + Athleten neu laden
  const refreshAll = useCallback(async () => {
    await Promise.all([
      refreshAthletes(),
      refreshSessions(),
      refreshCompetitions(),
      refreshPrograms(),
      refreshExercises(),
    ]);
  }, [refreshAthletes, refreshSessions, refreshCompetitions, refreshPrograms, refreshExercises]);
  const { pull: ptrPull, refreshing: ptrRefreshing } = usePullToRefresh(refreshAll, !!session);

  // Lokale Daten erst nach Login laden (DATA_KEY pro User getrennt)
  const userDataKey = session ? DATA_KEY + ':' + session.user.id : null;
  const [cloudStatus, setCloudStatus] = useState('idle'); // 'idle' | 'syncing' | 'error' | 'offline'
  useEffect(() => {
    if (!session) { setLoading(false); return; }
    setLoading(true);
    (async () => {
      // 1. Lokale Daten laden (für sofortige Anzeige + Offline-Fallback)
      let localData = null;
      const r = await storage.get(userDataKey);
      if (r && r.value) {
        try {
          const parsed = JSON.parse(r.value);
          const { data: migrated } = migrateExerciseLabels(parsed);
          localData = migrated;
        } catch (_) { localData = null; }
      }

      // 2. Cloud-Snapshot ziehen
      let cloud = null;
      try { cloud = await fetchCloudSnapshot(); } catch (_) { cloud = null; }

      let chosen = localData;
      if (cloud && cloud.data) {
        // Wenn Cloud vorhanden: Cloud gewinnt (other-device-Szenario).
        // Falls lokal aber neuer (lokal hat lokales Bearbeitungs-Datum?), nehmen wir lokal.
        // Vereinfachung: wenn lokal leer → Cloud nehmen. Wenn beides vorhanden → Cloud nehmen
        // (da Cloud-Push bei jeder Änderung, sind sie in der Regel synchron).
        if (!localData) chosen = migrateExerciseLabels(cloud.data).data;
        else chosen = migrateExerciseLabels(cloud.data).data;
      } else if (localData) {
        // Cloud leer, lokal vorhanden → später wird beim ersten save() automatisch hochgeladen
        chosen = localData;
      }

      if (chosen) {
        setActiveDb(chosen.uci_custom);
        setData(chosen);
        // Lokal cachen
        await storage.set(userDataKey, JSON.stringify(chosen));
      } else {
        setData(null);
      }
      setLoading(false);
    })();
  }, [userDataKey]);

  // Cloud-Push debounced — bei jeder Änderung 2s warten, dann hochladen
  const cloudPushTimer = useMemo(() => ({ id: null, last: null }), []);

  // DB-Shapes ↔ Blob-Shapes Mapping (für rückwärtskompatible UI-Anzeige)
  const dbSessionToBlob = useCallback((s) => ({
    id: s.id,
    date: s.date,
    athleteId: s.athlete_id,
    exerciseId: s.exercise_id,
    entries: s.entries || [],
    notes: s.notes || '',
    exerciseName: s.exercise_name || '',
    withRope: typeof s.with_rope === 'boolean' ? s.with_rope : null
  }), []);
  const dbCompetitionToBlob = useCallback((c) => ({
    id: c.id,
    athlete_id: c.athlete_id,
    program_id: c.program_id,
    name: c.name,
    date: c.date,
    location: c.location || '',
    host: c.host || '',
    start_nr: c.start_nr || '',
    table1: c.table1 || [],
    table2: c.table2 || [],
    t1_schwierigkeit: Number(c.t1_schwierigkeit || 0),
    t2_schwierigkeit: Number(c.t2_schwierigkeit || 0),
    pdf_ref: c.pdf_ref,
    target_score: c.target_score
  }), []);
  const dbProgramToBlob = useCallback((p) => ({
    id: p.id,
    name: p.name,
    discipline: p.discipline,
    exercises: p.exercises || [],
    created: p.created_at
  }), []);
  const dbExerciseToBlob = useCallback((e) => ({
    id: e.id,
    name: e.name,
    uci_code: e.uci_code,
    uci_disc: e.uci_disc,
    points: e.points,
    active: e.active,
    category_mode: e.category_mode,
    third_label: e.third_label,
    success_label: e.success_label,
    fail_label: e.fail_label,
    default_series: e.default_series,
    target_rate: e.target_rate,
    has_rope_variant: !!e.has_rope_variant
  }), []);

  // Phase 9d-3: Diff-basierter Sync Blob → DB-Tabellen
  const syncSessionsToDb = useCallback(async (oldSessions, newSessions) => {
    const oldById = new Map((oldSessions || []).filter(s => s && s.id).map(s => [s.id, s]));
    const newById = new Map((newSessions || []).filter(s => s && s.id).map(s => [s.id, s]));
    const toInsert = (newSessions || []).filter(s => !s || !s.id || !oldById.has(s.id));
    if (toInsert.length > 0) {
      const payload = toInsert.map(s => ({
        athlete_id: s.athleteId || s.athlete_id || null,
        exercise_id: s.exerciseId || s.exercise_id,
        date: s.date,
        entries: s.entries || [],
        notes: s.notes || '',
        exercise_name: s.exerciseName || s.exercise_name || '',
        with_rope: typeof s.withRope === 'boolean' ? s.withRope
                  : typeof s.with_rope === 'boolean' ? s.with_rope
                  : null
      })).filter(p => p.exercise_id);
      if (payload.length > 0) {
        const { error } = await bulkInsertSessions(payload);
        if (error) console.warn('Session bulk insert:', error.message);
      }
    }
    for (const o of (oldSessions || [])) {
      if (o && o.id && !newById.has(o.id)) {
        const { error } = await deleteSession(o.id);
        if (error) console.warn('Session delete:', error.message);
      }
    }
  }, []);

  // Generischer Diff-Sync für upsertable Entitäten (competitions, programs, exercises)
  const syncListToDb = useCallback(async (oldList, newList, upsertFn, deleteFn, normalizeFn) => {
    const oldById = new Map((oldList || []).filter(x => x && x.id).map(x => [x.id, x]));
    const newById = new Map((newList || []).filter(x => x && x.id).map(x => [x.id, x]));
    // Inserts (kein id) + Updates (id mit anderem Inhalt)
    for (const item of (newList || [])) {
      if (!item) continue;
      const payload = normalizeFn(item);
      if (!item.id) {
        // INSERT
        const { error } = await upsertFn(payload);
        if (error) console.warn('Upsert (insert):', error.message);
      } else if (oldById.has(item.id)) {
        // UPDATE — nur wenn sich Inhalt geändert hat (deep equal vereinfacht)
        const oldStr = JSON.stringify(normalizeFn(oldById.get(item.id)));
        const newStr = JSON.stringify(payload);
        if (oldStr !== newStr) {
          const { error } = await upsertFn({ ...payload, id: item.id });
          if (error) console.warn('Upsert (update):', error.message);
        }
      } else {
        // ID gesetzt aber nicht in alt → eingeschmuggelt von außen, INSERT
        const { error } = await upsertFn({ ...payload, id: item.id });
        if (error) console.warn('Upsert (new-id):', error.message);
      }
    }
    // DELETES
    for (const o of (oldList || [])) {
      if (o && o.id && !newById.has(o.id)) {
        const { error } = await deleteFn(o.id);
        if (error) console.warn('Delete:', error.message);
      }
    }
  }, []);

  // Normalizer: Blob-Shape → DB-Shape (für upserts)
  const normalizeCompetition = useCallback((c) => ({
    athlete_id: c.athlete_id || c.athleteId || null,
    program_id: c.program_id || null,
    name: c.name,
    date: c.date,
    location: c.location || '',
    host: c.host || '',
    start_nr: c.start_nr || '',
    table1: c.table1 || [],
    table2: c.table2 || [],
    t1_schwierigkeit: Number(c.t1_schwierigkeit || 0),
    t2_schwierigkeit: Number(c.t2_schwierigkeit || 0),
    pdf_ref: c.pdf_ref || null,
    target_score: c.target_score
  }), []);
  const normalizeProgram = useCallback((p) => ({
    name: p.name,
    discipline: p.discipline,
    exercises: p.exercises || []
  }), []);
  const normalizeExercise = useCallback((e) => ({
    name: e.name,
    uci_code: e.uci_code || null,
    uci_disc: e.uci_disc || null,
    points: e.points,
    active: e.active !== false,
    category_mode: e.category_mode || 2,
    third_label: e.third_label || null,
    success_label: e.success_label || null,
    fail_label: e.fail_label || null,
    default_series: e.default_series || 10,
    target_rate: e.target_rate,
    has_rope_variant: !!e.has_rope_variant
  }), []);

  // Athleten-Auswahl: standardmäßig eigener Athlet (wenn vorhanden),
  // sonst null (= „nur Trainer" — muss aktiv Sportler wählen).
  // MUSS vor `save` stehen, damit dessen useCallback-Deps darauf zugreifen können.
  const myAthleteId = useMemo(
    () => dbAthletes.find(a => a.auth_user_id === session?.user?.id)?.id || null,
    [dbAthletes, session?.user?.id]
  );
  const [selectedAthleteId, setSelectedAthleteId] = useState(null);
  useEffect(() => {
    if (selectedAthleteId) return;
    if (myAthleteId) setSelectedAthleteId(myAthleteId);
  }, [myAthleteId, selectedAthleteId]);
  const selectedAthlete = useMemo(
    () => dbAthletes.find(a => a.id === selectedAthleteId) || null,
    [dbAthletes, selectedAthleteId]
  );
  const isOwnAthlete = !selectedAthlete || selectedAthlete.auth_user_id === session?.user?.id;
  const isReadOnlyView = !!selectedAthleteId && !isOwnAthlete;

  const save = useCallback(async (next) => {
    setActiveDb(next.uci_custom);

    // Athleten-Scope für DB-Sync:
    //  • selectedAthleteId gesetzt → wir bearbeiten genau diesen Athleten.
    //    Sessions/Competitions werden auf athlete_id gefiltert (für current UND next),
    //    damit der Diff nur Daten dieses Athleten anfasst — Daten anderer Athleten
    //    bleiben in der DB unangetastet.
    //  • Programs/Exercises: nur wenn eigener Athlet schreiben (sonst würde der
    //    Trainer die Programme des Sportlers mit owner_id=trainer überschreiben).
    const filterId = selectedAthleteId;
    const sf = (s) => !filterId || (s.athleteId || s.athlete_id) === filterId;
    const cf = (c) => !filterId || (c.athlete_id || c.athleteId) === filterId;
    const ownerWritable = isOwnAthlete; // = eigener Athlet ODER kein Filter

    if (data && data.migrated_to_tables) {
      try {
        if (ownerWritable && next.exercises) {
          const current = dbExercises.map(dbExerciseToBlob);
          await syncListToDb(current, next.exercises, upsertExercise, deleteExercise, normalizeExercise);
          await refreshExercises();
        }
        if (ownerWritable && next.programs) {
          const current = dbPrograms.map(dbProgramToBlob);
          await syncListToDb(current, next.programs, upsertProgram, deleteProgram, normalizeProgram);
          await refreshPrograms();
        }
        if (next.sessions) {
          const current = dbSessions.map(dbSessionToBlob).filter(sf);
          const newOnes = (next.sessions || []).filter(sf);
          await syncSessionsToDb(current, newOnes);
          await refreshSessions();
        }
        if (next.competitions) {
          const current = dbCompetitions.map(dbCompetitionToBlob).filter(cf);
          const newOnes = (next.competitions || []).filter(cf);
          await syncListToDb(current, newOnes, upsertCompetition, deleteCompetition, normalizeCompetition);
          await refreshCompetitions();
        }
      } catch (e) {
        console.warn('DB-Sync fehlgeschlagen:', e);
      }
    }

    // localStorage/Cloud-Snapshot nur bei eigenem Athleten anfassen.
    // Bei fremdem Athleten: data + Blob unverändert lassen — die UI rebuildet
    // sich nach refreshSessions/Competitions über effectiveData neu.
    if (ownerWritable) {
      const blobNext = (data && data.migrated_to_tables)
        ? { ...next, sessions: [], competitions: [], programs: [], exercises: [] }
        : next;
      setData(next);
      if (userDataKey) await storage.set(userDataKey, JSON.stringify(blobNext));
      if (cloudPushTimer.id) clearTimeout(cloudPushTimer.id);
      setCloudStatus('syncing');
      cloudPushTimer.id = setTimeout(async () => {
        const { error } = await pushCloudSnapshot(blobNext);
        setCloudStatus(error ? 'error' : 'idle');
      }, 2000);
    }
  }, [
    userDataKey, cloudPushTimer, data,
    dbSessions, dbCompetitions, dbPrograms, dbExercises,
    dbSessionToBlob, dbCompetitionToBlob, dbProgramToBlob, dbExerciseToBlob,
    syncSessionsToDb, syncListToDb,
    refreshSessions, refreshCompetitions, refreshPrograms, refreshExercises,
    normalizeCompetition, normalizeProgram, normalizeExercise,
    selectedAthleteId, isOwnAthlete
  ]);

  const resetAll = useCallback(() => {
    if (confirm('Wirklich ALLES lokale Daten zurücksetzen? (Account bleibt bestehen)')) {
      if (userDataKey) localStorage.removeItem(userDataKey);
      window.location.reload();
    }
  }, [userDataKey]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setData(null);
    setView('dashboard');
  }, []);

  // Phase 9d-3: effektive Daten — bei migrierten Usern werden DB-Tabellen
  // in die Blob-Form gemerged. Komponenten lesen weiter wie bisher.
  // WICHTIG: Hook muss VOR allen conditional returns stehen (Rules of Hooks),
  // sonst Whitescreen-Crash sobald loading von true → false wechselt.
  const effectiveData = useMemo(() => {
    if (!data) return data;
    if (!data.migrated_to_tables) return data;
    // Maute-Sprung: has_rope_variant auto-aktivieren falls in DB nicht gesetzt
    const exercises = dbExercises.map(e => {
      const blob = dbExerciseToBlob(e);
      if (!blob.has_rope_variant && (blob.name || '').toLowerCase().includes('maute')) {
        return { ...blob, has_rope_variant: true };
      }
      return blob;
    });
    // Sessions/Competitions auf den ausgewählten Athleten filtern.
    // Bei „eigener Sportler" filtern wir trotzdem (auch eigene Daten haben
    // athlete_id gesetzt, also konsistente Filterung).
    const filterId = selectedAthleteId;
    const sessions = (filterId
      ? dbSessions.filter(s => s.athlete_id === filterId)
      : dbSessions
    ).map(dbSessionToBlob);
    const competitions = (filterId
      ? dbCompetitions.filter(c => c.athlete_id === filterId)
      : dbCompetitions
    ).map(dbCompetitionToBlob);
    return {
      ...data,
      sessions,
      competitions,
      programs: dbPrograms.map(dbProgramToBlob),
      exercises,
      _viewingAthleteId: selectedAthleteId,
      _isReadOnly: isReadOnlyView,
    };
  }, [data, dbSessions, dbCompetitions, dbPrograms, dbExercises, dbSessionToBlob, dbCompetitionToBlob, dbProgramToBlob, dbExerciseToBlob, selectedAthleteId, isReadOnlyView]);

  if (!authChecked || loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F2F2F7] gap-5"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}>
      <div className="w-20 h-20 bg-gradient-to-br from-slate-900 to-slate-700 rounded-[24px] flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
        <Trophy className="text-amber-400" size={38} />
      </div>
      <div className="flex flex-col items-center gap-3">
        <span className="text-[22px] font-bold tracking-tight text-[#0f172a] dark:text-white">ArtCyc Coach</span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF9500] animate-pulse" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF9500] animate-pulse" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF9500] animate-pulse" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );

  // Nicht eingeloggt → AuthScreen
  if (!session) return <AuthScreen />;

  if (!data) {
    return <SetupScreen onStart={() => save({
      sessions: [],
      // Keine Default-Übungen — neue User starten mit leerer Liste.
      // Übungen werden über „+ Neu", PDF-Import oder Programm-Import angelegt.
      exercises: [],
      // Programme leer — User legt selbst an oder importiert XML/XQZ/PDF.
      programs: [],
      competitions: [],
      athletes: [],
      uci_version: '2026',
      uci_updated: null,
      uci_custom: null,
      created: new Date().toISOString()
    })} />;
  }

  // Navigation
  const isCoach = profile?.role === 'coach' || profile?.role === 'admin';
  // Export ist jetzt eine Sektion innerhalb der Einstellungen, nicht mehr im Nav.
  const nav = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: Home },
    { id: 'training', label: t('nav.training'), icon: Dumbbell },
    { id: 'wettkampf', label: t('nav.wettkampf'), icon: Trophy },
    { id: 'uebungen', label: t('nav.uebungen'), icon: BarChart3 },
    ...(isCoach ? [{ id: 'sportler', label: t('nav.sportler'), icon: Users }] : [])
  ];

  // View dispatcher
  let viewEl;
  if (view === 'dashboard') viewEl = <Dashboard data={effectiveData} setView={setView} onOpenFeedback={openFeedback} />;
  else if (view === 'training') viewEl = <TrainingView data={effectiveData} setData={save} setView={setView} />;
  else if (view === 'erfassen') viewEl = <Erfassen data={effectiveData} setData={save} dbAthletes={dbAthletes} onDone={() => setView('training')} />;
  else if (view === 'uebungen') viewEl = <UebungenView data={effectiveData} setData={save} onBack={() => setView('dashboard')} />;
  else if (view === 'wettkampf') viewEl = <WettkampfView data={effectiveData} setData={save} dbAthletes={dbAthletes} />;
  else if (view === 'einstellungen') viewEl = <SettingsView data={effectiveData} setData={save} onResetAll={resetAll} profile={profile} session={session} onLogout={logout} cloudStatus={cloudStatus} dbAthletes={dbAthletes} dbProfiles={dbProfiles} refreshAthletes={refreshAthletes} theme={theme} setTheme={setTheme} langPref={langPref} setLangPref={setLangPref} rulesLangPref={rulesLangPref} setRulesLangPref={setRulesLangPref} setView={setView} onOpenFeedback={openFeedback} />;
  else if (view === 'sportler') viewEl = <SportlerView profile={profile} session={session} athletes={dbAthletes} profiles={dbProfiles} refreshAthletes={refreshAthletes} ownData={effectiveData} onPickAthlete={(id) => { setSelectedAthleteId(id); setView('dashboard'); }} myAthleteId={myAthleteId} />;
  else if (view === 'export') viewEl = <ExportView data={effectiveData} setView={setView} />;
  else if (view === 'kuer' || view === 'video') {
    viewEl = <ComingSoon viewId={view} />;
  } else {
    viewEl = <Dashboard data={data} setView={setView} />;
  }

  return (
    <div
      className="min-h-screen bg-[#F2F2F7] text-slate-900 flex flex-col sm:flex-row antialiased"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, "Segoe UI", Roboto, sans-serif' }}>
      <PullToRefreshIndicator pull={ptrPull} refreshing={ptrRefreshing} />
      {/* Mobile Header — iOS Navigation Bar Style */}
      <div
        className="ios-header-bg sm:hidden px-4 pb-3 flex items-center justify-between gap-2 sticky top-0 z-30"
        style={{
          paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)'
        }}>
        <Brand size="sm" />
        <div className="flex items-center gap-2">
          {/* KI-Coach — eckige Pille mit Sparkles + voller 'KI-Coach'-Label
              (im geöffneten Sheet erscheint dann der volle Name 'ArtCyc Coach') */}
          <button onClick={() => setChatOpen(true)}
            className="bg-gradient-to-br from-[#FF9500] to-[#FF6D00] text-white rounded-xl px-2.5 py-1.5 text-[12px] font-semibold flex items-center gap-1 shadow-[0_2px_6px_rgba(255,149,0,0.25)] active:scale-95 transition"
            aria-label="ArtCyc Coach öffnen">
            <Sparkles size={14} strokeWidth={2.4} />
            <span>KI-Coach</span>
          </button>
          <button onClick={() => setView('einstellungen')}
            className={'w-9 h-9 rounded-full flex items-center justify-center transition active:scale-90 ' +
              (view === 'einstellungen' ? 'text-[#FF9500]' : 'text-[#3C3C43]')}
            aria-label={t('nav.einstellungen')}>
            <SettingsIcon size={22} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden sm:flex sm:flex-col w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 p-4 gap-1 sticky top-0 h-screen overflow-y-auto">
        <div className="flex items-start justify-between px-2 py-3 mb-2">
          <Brand size="md" />
          <button onClick={() => setView('einstellungen')} title="Einstellungen"
            className={'p-2 rounded-full transition ' + (view === 'einstellungen' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100')}>
            <SettingsIcon size={18} />
          </button>
        </div>

        {nav.map(n => {
          const Icon = n.icon;
          const active = view === n.id;
          return (
            <button key={n.id} onClick={() => setView(n.id)}
              className={'flex items-center justify-between px-3 py-2.5 rounded-2xl text-left transition ' +
                (active ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100')}>
              <span className="flex items-center gap-3"><Icon size={18} strokeWidth={active ? 2.4 : 1.8} /><span className="font-medium">{n.label}</span></span>
              {n.soon && <span className="bg-amber-100 text-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">bald</span>}
            </button>
          );
        })}

        {/* KI-Coach — eigene Pille im Brand-Look, abgehoben vom regulären Nav */}
        <button onClick={() => setChatOpen(true)}
          className="mt-3 flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left transition bg-gradient-to-br from-[#FF9500] to-[#FF6D00] text-white shadow-[0_2px_8px_rgba(255,149,0,0.25)] hover:brightness-105 active:scale-[0.98]">
          <Sparkles size={18} strokeWidth={2.4} />
          <span className="font-semibold">Coach öffnen</span>
        </button>
      </aside>

      <SwipeableMain
        view={view}
        setView={setView}
        visibleNav={nav.filter(n => !n.soon).slice(0, 5)}>
        <div className="max-w-5xl mx-auto p-4 sm:p-8">
          {selectedAthlete && !isOwnAthlete && (
            <div className="mb-4 -mt-1 bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-200 rounded-2xl px-4 py-2.5 flex items-center gap-2 text-[13px] font-medium shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <Crown size={14} strokeWidth={2.4} className="shrink-0" />
              <span className="flex-1 truncate">
                Du bearbeitest gerade <strong>{selectedAthlete.name}</strong>
              </span>
              {myAthleteId && (
                <button onClick={() => setSelectedAthleteId(myAthleteId)}
                  className="text-[12px] underline underline-offset-2 active:opacity-60 shrink-0">
                  Zurück zu mir
                </button>
              )}
            </div>
          )}
          {viewEl}
        </div>
      </SwipeableMain>

      {/* Mobile Bottom-Nav — iOS 26 Liquid Glass Pill mit Finger-Drag */}
      <BottomNav
        items={nav.filter(n => !n.soon).slice(0, 5)}
        view={view}
        setView={setView} />

      {/* KI-Coach Chat-Sheet — Trigger sitzt im Header/Sidebar */}
      <FloatingChat
        data={effectiveData}
        setData={save}
        profile={profile}
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        refreshers={{
          sessions:    refreshSessions,
          exercises:   refreshExercises,
          competitions: refreshCompetitions,
          programs:    refreshPrograms,
        }} />

      {/* Globales Feedback-Modal — kann aus Dashboard, Settings o.\xa0a. geöffnet werden */}
      {feedbackOpen && <FeedbackModal onClose={() => setFeedbackOpen(false)} />}

      {/* App-Notices (z. B. neues UCI-Reglement) — als floatender Toast */}
      {notices.length > 0 && (
        <NoticeBanner notices={notices} onDismiss={dismissNoticeLocal} />
      )}
    </div>
  );
}

// =============================================================
// NoticeBanner — zeigt aktive app_notices als floatenden Toast unten
// =============================================================
function NoticeBanner({ notices, onDismiss }) {
  const { t } = useI18n();
  const top = notices[0]; // nur die neueste auf einmal zeigen
  if (!top) return null;
  const Icon = top.category === 'update' ? FileText : (top.category === 'warning' ? AlertTriangle : Info);
  const color = top.category === 'update' ? '#FF9500' : (top.category === 'warning' ? '#FF3B30' : '#007AFF');
  return (
    <div className="fixed left-0 right-0 z-40 px-3 pointer-events-none"
         style={{ bottom: 'calc(env(safe-area-inset-bottom) + 84px)' }}>
      <div className="mx-auto max-w-md bg-white dark:bg-[#1c1c1e] rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.18)] border border-slate-200/60 dark:border-slate-800 p-4 pointer-events-auto">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: color + '22', color }}>
            <Icon size={20} strokeWidth={2.4} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-[15px]">{top.title || t('rulesUpdate.bannerTitle')}</div>
            {top.body && <div className="text-[13px] text-[#3C3C43] dark:text-slate-300 mt-0.5 leading-snug">{top.body}</div>}
            <div className="flex gap-2 mt-2.5">
              {top.link_url && (
                <a href={top.link_url} target="_blank" rel="noopener noreferrer"
                  className="text-[13px] font-medium px-3 py-1.5 rounded-full active:opacity-70"
                  style={{ background: color, color: '#fff' }}>
                  {top.link_label || t('rulesUpdate.openPdf')}
                </a>
              )}
              <button onClick={() => onDismiss(top.id)}
                className="text-[13px] font-medium px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 active:opacity-70">
                {t('rulesUpdate.dismiss')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================
// BRAND
// =============================================================
// =============================================================
// iOS UI HELPERS — wiederverwendbare iOS 26 Patterns
// =============================================================

// iOS Inset Grouped List (zusammenhängende weiße Karte mit Innen-Dividern)
function IOSList({ children, header, footer }) {
  const items = Array.isArray(children) ? children.filter(Boolean) : [children];
  return (
    <div className="space-y-1.5">
      {header && (
        <div className="text-[12px] uppercase tracking-wide text-[#8E8E93] px-4 font-medium">
          {header}
        </div>
      )}
      <div className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        {items.map((child, idx) => (
          <div key={idx} className={idx < items.length - 1 ? 'border-b border-[#C6C6C8]/40' : ''}>
            {child}
          </div>
        ))}
      </div>
      {footer && (
        <div className="text-[12px] text-[#8E8E93] px-4 leading-snug pt-1">
          {footer}
        </div>
      )}
    </div>
  );
}

// iOS Listenelement mit Pfeil rechts
function IOSListRow({ onClick, children, trailing, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={'w-full text-left px-4 py-3.5 flex items-center gap-3 active:bg-[#D1D1D6]/40 transition ' + className}>
      <div className="flex-1 min-w-0">{children}</div>
      {trailing !== undefined ? trailing : <ChevronRight size={18} strokeWidth={2.4} className="text-[#C7C7CC] shrink-0" />}
    </button>
  );
}

// iOS Tag/Badge
function IOSTag({ color = 'gray', children }) {
  const colors = {
    gray: 'bg-[#8E8E93]/15 text-[#8E8E93]',
    blue: 'bg-[#007AFF]/10 text-[#007AFF]',
    orange: 'bg-[#FF9500]/15 text-[#FF9500]',
    green: 'bg-[#34C759]/15 text-[#34C759]',
    red: 'bg-[#FF3B30]/15 text-[#FF3B30]',
    purple: 'bg-[#AF52DE]/15 text-[#AF52DE]'
  };
  return (
    <span className={'text-[10px] font-semibold px-2 py-0.5 rounded-full ' + (colors[color] || colors.gray)}>
      {children}
    </span>
  );
}

// =============================================================
// AUTH-SCREEN — Login / Signup mit Rollen-Wahl
// =============================================================
function AuthScreen() {
  const { t, langPref, setLangPref } = useI18n();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('athlete'); // 'athlete' | 'coach'
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [info, setInfo] = useState('');
  const [langPickerOpen, setLangPickerOpen] = useState(false);

  const validEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  const validPwd = password.length >= 10;
  const canSubmit = mode === 'login'
    ? validEmail && password.length >= 1
    : validEmail && validPwd && displayName.trim().length >= 2;

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true); setErr(''); setInfo('');
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        // App reagiert auf onAuthStateChange — kein manueller Redirect nötig
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              display_name: displayName.trim(),
              role
            },
            emailRedirectTo: window.location.origin
          }
        });
        if (error) throw error;
        if (data.user && !data.session) {
          // Bestätigungs-E-Mail wurde geschickt
          setInfo(t('validation.confirmEmailSent', { email: email.trim() }));
        }
      }
    } catch (e) {
      setErr(e.message || t('validation.genericError'));
    } finally {
      setBusy(false);
    }
  };

  const forgot = async () => {
    if (!validEmail) { setErr(t('validation.invalidEmail')); return; }
    setBusy(true); setErr(''); setInfo('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: window.location.origin });
      if (error) throw error;
      setInfo(t('validation.resetSent'));
    } catch (e) {
      setErr(e.message || t('validation.resetError'));
    } finally { setBusy(false); }
  };

  const currentLang = LANGUAGES.find(l => l.code === langPref);

  return (
    <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center p-4"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}>
      <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-8 max-w-md w-full relative">
        {/* Sprach-Picker oben rechts */}
        <div className="absolute top-4 right-4">
          <button onClick={() => setLangPickerOpen(o => !o)}
            className="flex items-center gap-1 text-[#8E8E93] text-[13px] active:opacity-60 px-2 py-1 rounded-full"
            aria-label={t('auth.language')}>
            <Globe size={14} />
            <span>{currentLang ? currentLang.flag + ' ' + currentLang.native : '🌐 Auto'}</span>
          </button>
          {langPickerOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setLangPickerOpen(false)} />
              <div className="absolute right-0 top-full mt-1 z-40 w-52 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.15)] overflow-hidden border border-slate-200/50">
                <button onClick={() => { setLangPref('auto'); setLangPickerOpen(false); }}
                  className="w-full text-left px-4 py-2.5 flex items-center gap-2 active:bg-[#D1D1D6]/40 transition text-[14px]">
                  <Globe size={16} className="text-[#8E8E93]" />
                  <span>{t('settings.languageAuto')}</span>
                  {langPref === 'auto' && <Check size={16} className="text-[#FF9500] ml-auto" />}
                </button>
                <div className="border-t border-[#C6C6C8]/40" />
                {LANGUAGES.map(l => (
                  <button key={l.code} onClick={() => { setLangPref(l.code); setLangPickerOpen(false); }}
                    className="w-full text-left px-4 py-2.5 flex items-center gap-2 active:bg-[#D1D1D6]/40 transition text-[14px]">
                    <span>{l.flag}</span>
                    <span>{l.native}</span>
                    {langPref === l.code && <Check size={16} className="text-[#FF9500] ml-auto" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Trophy className="text-amber-400" size={26} />
          </div>
          <h1 className="text-[28px] font-bold tracking-tight">ArtCyc Coach</h1>
          <p className="text-[#8E8E93] text-[14px]">{t('auth.appTagline')}</p>
        </div>

        {/* Mode-Tabs — iOS Segmented Control */}
        <div className="bg-[#E5E5EA] dark:bg-white/10 rounded-2xl p-1 flex gap-1 mb-6">
          <button type="button" onClick={() => { setMode('login'); setErr(''); setInfo(''); }}
            className={'flex-1 py-2 rounded-xl text-[14px] font-semibold transition ' +
              (mode === 'login' ? 'ios-seg-active' : 'text-[#3C3C43] dark:text-slate-300 active:opacity-70')}>
            {t('auth.signIn')}
          </button>
          <button type="button" onClick={() => { setMode('signup'); setErr(''); setInfo(''); }}
            className={'flex-1 py-2 rounded-xl text-[14px] font-semibold transition ' +
              (mode === 'signup' ? 'ios-seg-active' : 'text-[#3C3C43] dark:text-slate-300 active:opacity-70')}>
            {t('auth.signUp')}
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === 'signup' && (
            <>
              <div>
                <label className="text-[12px] font-medium text-[#8E8E93] block mb-1.5 px-1">{t('auth.displayName')}</label>
                <input value={displayName} onChange={e => setDisplayName(e.target.value)}
                  placeholder="Vor- oder Spitzname"
                  autoComplete="name"
                  className="w-full px-4 py-3 bg-[#F2F2F7] dark:bg-white/5 rounded-2xl text-[15px] outline-none focus:ring-2 focus:ring-[#FF9500]/40 transition placeholder:text-[#C7C7CC]" />
              </div>
              <div>
                <label className="text-[12px] font-medium text-[#8E8E93] block mb-1.5 px-1">{t('auth.role')}</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setRole('athlete')}
                    className={'py-3 px-3 rounded-2xl text-[14px] font-medium flex items-center justify-center gap-1.5 transition ' +
                      (role === 'athlete'
                        ? 'bg-[#FF9500] text-white shadow-[0_2px_8px_rgba(255,149,0,0.3)]'
                        : 'bg-[#F2F2F7] dark:bg-white/5 text-[#3C3C43] active:opacity-70')}>
                    <Dumbbell size={16} /> {t('auth.roleAthlete')}
                  </button>
                  <button type="button" onClick={() => setRole('coach')}
                    className={'py-3 px-3 rounded-2xl text-[14px] font-medium flex items-center justify-center gap-1.5 transition ' +
                      (role === 'coach'
                        ? 'bg-[#FF9500] text-white shadow-[0_2px_8px_rgba(255,149,0,0.3)]'
                        : 'bg-[#F2F2F7] dark:bg-white/5 text-[#3C3C43] active:opacity-70')}>
                    <UserCog size={16} /> {t('auth.roleCoach')}
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-[12px] font-medium text-[#8E8E93] block mb-1.5 px-1">{t('auth.email')}</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="name@beispiel.de"
                autoComplete="email"
                inputMode="email"
                className="w-full pl-11 pr-4 py-3 bg-[#F2F2F7] dark:bg-white/5 rounded-2xl text-[15px] outline-none focus:ring-2 focus:ring-[#FF9500]/40 transition placeholder:text-[#C7C7CC]" />
            </div>
          </div>

          <div>
            <label className="text-[12px] font-medium text-[#8E8E93] block mb-1.5 px-1">
              {t('auth.password')} {mode === 'signup' && <span className="text-[#C7C7CC]">(min. 10)</span>}
            </label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder={t('auth.password')}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                className="w-full pl-11 pr-4 py-3 bg-[#F2F2F7] dark:bg-white/5 rounded-2xl text-[15px] outline-none focus:ring-2 focus:ring-[#FF9500]/40 transition placeholder:text-[#C7C7CC]" />
            </div>
          </div>

          {err && (
            <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-rose-900 dark:text-rose-300 text-[14px] rounded-2xl p-3">
              ✗ {err}
            </div>
          )}
          {info && (
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-300 text-[14px] rounded-2xl p-3">
              ✓ {info}
            </div>
          )}

          <button type="submit" disabled={!canSubmit || busy}
            className="bg-[#FF9500] text-white px-5 py-3.5 rounded-full font-semibold w-full text-[15px] active:scale-[0.98] transition shadow-[0_4px_14px_rgba(255,149,0,0.35)] disabled:opacity-40 disabled:shadow-none">
            {busy ? '…' : (mode === 'login' ? t('auth.signIn') : t('auth.signUp'))}
          </button>

          {mode === 'login' && (
            <button type="button" onClick={forgot} disabled={busy}
              className="text-[14px] text-[#007AFF] block mx-auto mt-2 active:opacity-60 disabled:opacity-50 font-medium">
              {t('auth.forgotPassword')}
            </button>
          )}
        </form>

        {mode === 'signup' && (
          <p className="text-[11px] text-slate-500 text-center mt-4">
            Mit der Registrierung akzeptierst du, dass deine Trainings-Daten in unserer
            Datenbank in Frankfurt gespeichert werden. Du kannst deinen Account jederzeit löschen.
          </p>
        )}
      </div>
    </div>
  );
}

// =============================================================
// SETUP
// =============================================================
function SetupScreen({ onStart }) {
  return (
    <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center p-4"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}>
      <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-8 max-w-md w-full text-center">
        <div className="w-14 h-14 bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Trophy className="text-amber-400" size={26} />
        </div>
        <h1 className="text-[28px] font-bold tracking-tight mb-1">ArtCyc Coach</h1>
        <p className="text-[#8E8E93] text-[15px] mb-7">Trainings- und Wettkampf-Tool für Kunstradsport</p>
        <button onClick={onStart}
          className="bg-slate-900 text-white px-5 py-3.5 rounded-2xl font-semibold w-full active:scale-[0.98] transition shadow-sm">
          Starten
        </button>
      </div>
    </div>
  );
}

// =============================================================
// DASHBOARD
// =============================================================
function Dashboard({ data, setView, onOpenFeedback }) {
  const { t } = useI18n();
  // Saison-Filter
  const [season, setSeason] = useState('all'); // 'all' | '2026' | '2025' | '90d' | '30d'
  const seasonRange = useMemo(() => {
    const today = new Date();
    if (season === 'all') return { from: null, to: null, label: 'Alle Zeit' };
    if (season === '90d') {
      const d = new Date(today); d.setDate(d.getDate() - 89);
      return { from: d.toISOString().slice(0, 10), to: null, label: 'Letzte 90 Tage' };
    }
    if (season === '30d') {
      const d = new Date(today); d.setDate(d.getDate() - 29);
      return { from: d.toISOString().slice(0, 10), to: null, label: 'Letzte 30 Tage' };
    }
    // Year filter
    return { from: season + '-01-01', to: season + '-12-31', label: season };
  }, [season]);
  const inRange = (date) => {
    if (!date) return false;
    const d = date.slice(0, 10);
    if (seasonRange.from && d < seasonRange.from) return false;
    if (seasonRange.to && d > seasonRange.to) return false;
    return true;
  };

  // Verfügbare Jahre aus Daten ableiten
  const availableYears = useMemo(() => {
    const years = new Set();
    for (const c of (data.competitions || [])) if (c.date) years.add(c.date.slice(0, 4));
    for (const s of (data.sessions || [])) if (s.date) years.add(s.date.slice(0, 4));
    return Array.from(years).sort((a, b) => b.localeCompare(a)); // neueste zuerst
  }, [data.competitions, data.sessions]);

  // Wettkampf-Stats (gefiltert nach Saison)
  const compStats = useMemo(() => {
    const comps = (data.competitions || []).filter(c => season === 'all' ? true : inRange(c.date));
    const programMap = new Map((data.programs || []).map(p => [p.id, p]));
    const withResult = comps.map(c => {
      const program = programMap.get(c.program_id);
      if (!program) return null;
      const t1 = calcTableResult(program, c.table1, c.t1_schwierigkeit);
      const t2 = calcTableResult(program, c.table2, c.t2_schwierigkeit);
      const final = Math.round(((t1.ergebnis + t2.ergebnis) / 2) * 100) / 100;
      return { competition: c, final };
    }).filter(Boolean);
    const sorted = withResult.slice().sort((a, b) => b.final - a.final);
    const byDate = withResult.slice().sort((a, b) => (b.competition.date || '').localeCompare(a.competition.date || ''));
    return {
      count: comps.length,
      best: sorted[0] || null,
      last: byDate[0] || null,
      withResult
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.competitions, data.programs, season]);

  // Trainings-Stats (gefiltert nach Saison)
  const trainStats = useMemo(() => {
    const sessions = (data.sessions || []).filter(s => season === 'all' ? true : inRange(s.date));
    const distinctDays = new Set(sessions.map(s => s.date)).size;
    const sortedByDate = sessions.slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    const lastSessionDate = sortedByDate[0]?.date || null;
    return {
      totalSessions: sessions.length,
      distinctDays,
      lastSessionDate
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.sessions, season]);

  // Pro Übung: Quote + Trend über letzte 4 Wochen
  const perExercise = useMemo(() => {
    return data.exercises.filter(ex => ex.active).map(ex => {
      const sessions = data.sessions.filter(s => s.exerciseId === ex.id);
      const allEntries = sessions.flatMap(s => s.entries);
      const total = allEntries.length;
      const success = allEntries.filter(e => e === 'success').length;
      const fail = allEntries.filter(e => e === 'fail').length;
      const third = allEntries.filter(e => e === 'third').length;

      // 4-Wochen-Trend: pro Woche die Quote
      const trend = [];
      for (let i = 3; i >= 0; i--) {
        const end = new Date();
        end.setDate(end.getDate() - i * 7);
        const start = new Date(end);
        start.setDate(start.getDate() - 6);
        const startStr = start.toISOString().slice(0, 10);
        const endStr = end.toISOString().slice(0, 10);
        const weekSessions = sessions.filter(s => s.date >= startStr && s.date <= endStr);
        const weekEntries = weekSessions.flatMap(s => s.entries);
        const ws = weekEntries.filter(e => e === 'success').length;
        const wt = weekEntries.length;
        trend.push({ rate: wt > 0 ? Math.round((ws / wt) * 100) : null, total: wt });
      }

      return {
        ex, total, success, fail, third,
        rate: total > 0 ? Math.round((success / total) * 100) : 0,
        // Risiko-Quote: wie viele der NICHT-geklappten Versuche waren "gefährlich"
        riskRate: (fail + third) > 0 ? Math.round((third / (fail + third)) * 100) : 0,
        sessions: sessions.length,
        trend
      };
    }).filter(r => r.total > 0);
  }, [data]);

  return (
    <div className="space-y-6">
      <header className="pt-2 px-1">
        <h1 className="text-[34px] font-bold tracking-tight leading-none">{t('dashboard.title')}</h1>
        <p className="text-[#8E8E93] text-[15px] mt-1">{t('dashboard.subtitle')}</p>
      </header>

      {/* Saison-Filter — iOS Pills, scrollable */}
      <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1" data-no-swipe="true">
        {[
          { id: 'all', label: 'Alle Zeit' },
          ...availableYears.map(y => ({ id: y, label: y })),
          { id: '90d', label: '90 Tage' },
          { id: '30d', label: '30 Tage' }
        ].map(s => (
          <button
            key={s.id}
            onClick={() => setSeason(s.id)}
            className={'px-3.5 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition active:scale-95 ' +
              (season === s.id
                ? 'bg-[#FF9500] text-white shadow-[0_1px_3px_rgba(255,149,0,0.35)]'
                : 'bg-white text-[#3C3C43] shadow-[0_1px_2px_rgba(0,0,0,0.04)]')}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={Trophy}
          label={t('dashboard.bestScore')}
          value={compStats.best ? compStats.best.final.toFixed(2) : '—'}
          sub={compStats.best ? compStats.best.competition.name.slice(0, 24) : '—'}
          color="amber"
        />
        <StatCard
          icon={Target}
          label={t('dashboard.competitions')}
          value={compStats.count}
          sub={compStats.last ? t('dashboard.lastTrained', { date: formatDateShort(compStats.last.competition.date) }) : (season === 'all' ? '—' : seasonRange.label)}
          color="emerald"
        />
        <StatCard
          icon={Calendar}
          label={t('dashboard.trainingDays')}
          value={trainStats.distinctDays}
          sub={season === 'all' ? '' : seasonRange.label}
          color="sky"
        />
        <StatCard
          icon={Dumbbell}
          label={t('dashboard.sessions')}
          value={trainStats.totalSessions}
          sub={trainStats.lastSessionDate ? t('dashboard.lastTrained', { date: formatDateShort(trainStats.lastSessionDate) }) : '—'}
          color="violet"
        />
      </div>

      {/* Schnellzugriff — iOS Action Tiles */}
      <div className="grid sm:grid-cols-2 gap-3">
        <button onClick={() => setView('erfassen')}
          className="bg-[#FF9500] text-white p-5 rounded-2xl text-left active:scale-[0.98] transition-transform shadow-[0_2px_8px_rgba(255,149,0,0.25)]">
          <div className="flex items-center gap-2 mb-1.5 font-semibold text-[16px]">
            <Plus size={20} strokeWidth={2.5} /> <span>{t('dashboard.logSession')}</span>
          </div>
        </button>
        <button onClick={() => setView('uebungen')}
          className="bg-white p-5 rounded-2xl text-left active:scale-[0.98] transition-transform shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2 mb-1.5 font-semibold text-[16px]">
            <ListChecks size={20} strokeWidth={2.2} className="text-[#FF9500]" /> <span>{t('dashboard.manageExercises')}</span>
          </div>
          <div className="text-[13px] text-[#8E8E93]">{t('dashboard.uciExercises', { n: getUciDb().length })}</div>
        </button>
      </div>

      {/* Wettkampf-Verlauf */}
      {compStats.count >= 2 && (
        <CompetitionTrendChart
          competitions={(data.competitions || []).filter(c => season === 'all' ? true : inRange(c.date))}
          programs={data.programs || []}
          best={compStats.best}
          onTapWettkampf={() => setView('wettkampf')} />
      )}

      {/* (Trainings-Aktivitäts-Heatmap entfernt — sagt einem Sportler/Trainer
           wenig über tatsächliche Fortschritte; die Top-Stats und der
           Wettkampf-Verlauf sind aussagekräftiger.) */}

      {/* Pro Übung */}
      <section className="space-y-3">
        <div className="px-4 text-[12px] uppercase tracking-wide text-[#8E8E93] font-medium">
          {t('dashboard.progressByExercise')}
        </div>

        {perExercise.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-8 text-center">
            <Sparkles size={32} className="mx-auto text-[#C7C7CC] mb-3" />
            <h3 className="font-semibold mb-1">{t('dashboard.noTrainingData')}</h3>
            <p className="text-[14px] text-[#8E8E93] mb-4">{t('dashboard.noTrainingHint')}</p>
            <button onClick={() => setView('erfassen')}
              className="bg-[#FF9500] text-white px-5 py-2.5 rounded-full text-[14px] font-medium active:scale-95 transition-transform">
              {t('dashboard.logSession')}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {perExercise.map(r => <ExerciseStatsCard key={r.ex.id} {...r} />)}
          </div>
        )}
      </section>

      {/* Feedback-Karte — prominenter Eingang ans Ende des Dashboards.
          Geht in dasselbe Modal wie der Eintrag in den Einstellungen. */}
      {onOpenFeedback && (
        <button onClick={onOpenFeedback}
          className="w-full bg-gradient-to-br from-[#007AFF]/12 to-[#5856D6]/8 rounded-2xl p-4 flex items-center gap-3 active:scale-[0.98] transition text-left">
          <div className="w-11 h-11 rounded-full bg-[#007AFF]/15 flex items-center justify-center shrink-0">
            <MessageCircle size={20} className="text-[#007AFF]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-semibold text-[#007AFF]">{t('feedback.title')}</div>
            <div className="text-[13px] text-[#3C3C43] leading-snug">{t('feedback.subtitle')}</div>
          </div>
          <ChevronRight size={18} strokeWidth={2.4} className="text-[#007AFF]/60 shrink-0" />
        </button>
      )}

      <div className="h-4" />
    </div>
  );
}

// =============================================================
// Wettkampf-Verlauf-Chart — Linie der Endergebnisse über Zeit
// =============================================================
function CompetitionTrendChart({ competitions, programs, best, onTapWettkampf }) {
  const points = useMemo(() => {
    const programMap = new Map(programs.map(p => [p.id, p]));
    return competitions
      .map(c => {
        const program = programMap.get(c.program_id);
        if (!program) return null;
        const t1 = calcTableResult(program, c.table1, c.t1_schwierigkeit);
        const t2 = calcTableResult(program, c.table2, c.t2_schwierigkeit);
        const final = Math.round(((t1.ergebnis + t2.ergebnis) / 2) * 100) / 100;
        return { date: c.date, name: c.name, final, id: c.id };
      })
      .filter(Boolean)
      .sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  }, [competitions, programs]);

  if (points.length < 2) return null;

  // SVG-Maße
  const W = 600, H = 180, P = 28;
  const minY = Math.min(...points.map(p => p.final));
  const maxY = Math.max(...points.map(p => p.final));
  const yPadding = Math.max(2, (maxY - minY) * 0.1);
  const yMin = Math.max(0, Math.floor((minY - yPadding) * 10) / 10);
  const yMax = Math.ceil((maxY + yPadding) * 10) / 10;
  const yRange = Math.max(1, yMax - yMin);

  const svgPoints = points.map((p, i) => {
    const x = points.length === 1 ? W / 2 : P + (i / (points.length - 1)) * (W - 2 * P);
    const y = H - P - ((p.final - yMin) / yRange) * (H - 2 * P);
    return { ...p, x, y };
  });
  const linePath = svgPoints.map((p, i) => (i === 0 ? 'M' : 'L') + p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' ');
  const areaPath = linePath + ' L' + svgPoints[svgPoints.length - 1].x.toFixed(1) + ',' + (H - P).toFixed(1) + ' L' + svgPoints[0].x.toFixed(1) + ',' + (H - P).toFixed(1) + ' Z';
  const bestPoint = svgPoints.find(p => p.id === (best && best.competition && best.competition.id));

  return (
    <section>
      <div className="flex items-center justify-between mb-2 px-4">
        <div className="text-[12px] uppercase tracking-wide text-[#8E8E93] font-medium">
          Wettkampf-Verlauf
        </div>
        <button onClick={onTapWettkampf} className="text-[13px] text-[#007AFF] font-medium active:opacity-60">Alle ansehen ›</button>
      </div>
      <div className="bg-white rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5">
        <svg viewBox={'0 0 ' + W + ' ' + H} className="w-full" preserveAspectRatio="none" style={{ height: 'auto' }}>
          {/* Y-Gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map(r => {
            const y = H - P - r * (H - 2 * P);
            const val = yMin + r * yRange;
            return (
              <g key={r}>
                <line x1={P} y1={y} x2={W - P} y2={y}
                  stroke="#E5E5EA" strokeWidth="1"
                  strokeDasharray={r === 0 || r === 1 ? '' : '2 3'} />
                <text x={P - 4} y={y + 3} fontSize="9" fill="#8E8E93" textAnchor="end">
                  {val.toFixed(0)}
                </text>
              </g>
            );
          })}
          {/* Fläche unter der Linie */}
          <path d={areaPath} fill="rgba(255, 149, 0, 0.12)" />
          {/* Linie */}
          <path d={linePath} fill="none" stroke="#FF9500" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Punkte */}
          {svgPoints.map((p, i) => {
            const isBest = bestPoint && p.id === bestPoint.id;
            return (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r={isBest ? 6 : 3.5} fill={isBest ? '#FBBF24' : '#FF9500'} stroke="#fff" strokeWidth="1.5" />
                {isBest && (
                  <text x={p.x} y={p.y - 12} fontSize="10" fontWeight="700" fill="#92400E" textAnchor="middle">
                    Best
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-7">
          <span>{formatDateShort(svgPoints[0].date)}</span>
          <span className="text-slate-500 font-medium">
            {points.length} Wettkämpfe · Bestleistung {Math.max(...points.map(p => p.final)).toFixed(2)}
          </span>
          <span>{formatDateShort(svgPoints[svgPoints.length - 1].date)}</span>
        </div>
      </div>
    </section>
  );
}

// =============================================================
// Trainings-Heatmap — GitHub-Style Aktivitäts-Kalender
// =============================================================
// Zeigt die letzten 26 Wochen (≈6 Monate) als 7×26-Grid.
// Jede Zelle ein Tag, gefärbt nach Anzahl Sessions/Serien.
function TrainingHeatmap({ sessions }) {
  const { t } = useI18n();
  const { weeks, monthLabels, totalDaysActive, totalSeries } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const numWeeks = 26;
    // Anker: nächster Sonntag (Wochenende), damit aktuelle Woche rechts steht
    const dayOfWeek = today.getDay(); // 0=So, 1=Mo, ...
    const daysFromMonday = (dayOfWeek + 6) % 7; // Mo=0, So=6
    // Wir benutzen Mo-So-Wochen
    const startMonday = new Date(today);
    startMonday.setDate(today.getDate() - daysFromMonday - (numWeeks - 1) * 7);

    // Sessions nach Datum gruppieren
    const byDate = new Map();
    let totalSeries = 0;
    for (const s of sessions || []) {
      const d = (s.date || '').slice(0, 10);
      if (!d) continue;
      const cur = byDate.get(d) || { sessions: 0, entries: 0 };
      cur.sessions += 1;
      cur.entries += (s.entries || []).length;
      totalSeries += (s.entries || []).length;
      byDate.set(d, cur);
    }

    const weeks = [];
    let totalDaysActive = 0;
    for (let w = 0; w < numWeeks; w++) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const day = new Date(startMonday);
        day.setDate(startMonday.getDate() + w * 7 + d);
        const dayStr = day.toISOString().slice(0, 10);
        const future = day > today;
        const data = byDate.get(dayStr) || { sessions: 0, entries: 0 };
        if (data.sessions > 0) totalDaysActive++;
        week.push({ date: dayStr, ...data, future });
      }
      weeks.push(week);
    }

    // Monats-Labels: nur am Wochen-Anfang wenn der Monat wechselt
    const monthLabels = weeks.map((week, i) => {
      const firstDay = new Date(week[0].date);
      const isFirstWeekOfMonth = firstDay.getDate() <= 7;
      if (i === 0 || isFirstWeekOfMonth) {
        return firstDay.toLocaleDateString('de-DE', { month: 'short' });
      }
      return null;
    });

    return { weeks, monthLabels, totalDaysActive, totalSeries };
  }, [sessions]);

  // Farbskala: 0 / 1-9 / 10-19 / 20-29 / 30+ Serien
  const colorFor = (entries) => {
    if (entries === 0) return '#F2F2F7';
    if (entries < 10) return '#FED7AA';
    if (entries < 20) return '#FB923C';
    if (entries < 30) return '#EA580C';
    return '#C2410C';
  };

  const dayLabels = ['Mo', '', 'Mi', '', 'Fr', '', ''];
  const cellSize = 14;
  const gap = 3;
  const labelW = 18;
  const labelH = 14;
  const W = labelW + weeks.length * (cellSize + gap) - gap;
  const H = labelH + 7 * (cellSize + gap) - gap;

  return (
    <section>
      <div className="flex items-center justify-between mb-2 px-4">
        <div className="text-[12px] uppercase tracking-wide text-[#8E8E93] font-medium">
          {t('dashboard.trainingActivity')}
        </div>
        <span className="text-[12px] text-[#8E8E93]">{t('dashboard.activityFooter', { n: totalDaysActive, series: totalSeries })}</span>
      </div>
      <div className="bg-white rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-4 overflow-x-auto" data-no-swipe="true">
        <svg width={W} height={H} style={{ minWidth: W }}>
          {/* Monats-Labels */}
          {monthLabels.map((lbl, i) => lbl ? (
            <text key={i} x={labelW + i * (cellSize + gap)} y={labelH - 4} fontSize="9" fill="#8E8E93">{lbl}</text>
          ) : null)}
          {/* Wochentag-Labels */}
          {dayLabels.map((lbl, i) => lbl ? (
            <text key={i} x={labelW - 4} y={labelH + i * (cellSize + gap) + cellSize - 3} fontSize="9" fill="#8E8E93" textAnchor="end">{lbl}</text>
          ) : null)}
          {/* Heatmap-Zellen */}
          {weeks.map((week, wIdx) =>
            week.map((day, dIdx) => (
              <rect key={day.date}
                x={labelW + wIdx * (cellSize + gap)}
                y={labelH + dIdx * (cellSize + gap)}
                width={cellSize}
                height={cellSize}
                rx={3}
                fill={day.future ? '#FFF' : colorFor(day.entries)}
                opacity={day.future ? 0.3 : 1}
                stroke={day.future ? '#E5E5EA' : 'none'}
                strokeWidth={day.future ? 1 : 0}>
                <title>{day.date}{day.entries > 0 ? ' — ' + day.sessions + ' Session(s), ' + day.entries + ' Serien' : ''}</title>
              </rect>
            ))
          )}
        </svg>
        {/* Legende */}
        <div className="flex items-center gap-2 mt-3 text-[10px] text-slate-500">
          <span>weniger</span>
          {[0, 5, 15, 25, 35].map((n, i) => (
            <span key={i} style={{ width: 12, height: 12, borderRadius: 3, background: colorFor(n), display: 'inline-block', border: n === 0 ? '1px solid #E5E5EA' : 'none' }} />
          ))}
          <span>mehr</span>
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon: Icon, label, value, sub, color = 'sky', size = 'normal' }) {
  // Farb-Map: jede Farbe deckt Hintergrund, Akzent (Icon + Label) und Border ab.
  // Bei dunklen Modi greift dark:* damit die Cards auf dem dunklen Dashboard
  // gut wirken (siehe Screenshot des Users).
  const colors = {
    amber:   'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/40',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900/40',
    sky:     'bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-950/30 dark:text-sky-300 dark:border-sky-900/40',
    violet:  'bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-950/30 dark:text-violet-300 dark:border-violet-900/40',
    orange:  'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-950/30 dark:text-orange-300 dark:border-orange-900/40',
    rose:    'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-900/40',
    blue:    'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-900/40',
    slate:   'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/40 dark:text-slate-300 dark:border-slate-800',
  };
  const sizes = {
    normal: { wrap: 'p-4', icon: 14, label: 'text-xs', value: 'text-2xl', sub: 'text-xs' },
    large:  { wrap: 'p-5', icon: 16, label: 'text-[13px]', value: 'text-[32px] leading-tight', sub: 'text-[13px]' },
  };
  const s = sizes[size] || sizes.normal;
  return (
    <div className={'rounded-2xl border ' + s.wrap + ' ' + (colors[color] || colors.sky)}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon size={s.icon} />
        <span className={s.label + ' font-medium'}>{label}</span>
      </div>
      <div className={s.value + ' font-bold text-slate-900 dark:text-white'}>{value}</div>
      {sub !== undefined && sub !== '' && (
        <div className={s.sub + ' text-slate-500 dark:text-slate-400 mt-0.5'}>{sub}</div>
      )}
    </div>
  );
}

function ExerciseStatsCard({ ex, total, success, fail, third, rate, riskRate, sessions, trend }) {
  const target = typeof ex.target_rate === 'number' ? ex.target_rate : null;
  const belowTarget = target !== null && rate < target;
  const aboveTarget = target !== null && rate >= target;
  const cardClass = 'bg-white rounded-2xl border shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5 ' +
    (belowTarget ? 'border-rose-200 ring-1 ring-rose-100' : 'border-slate-200/60');
  return (
    <div className={cardClass}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-lg">{localizedExerciseName(ex)}</h3>
            {ex.uci_code && (
              <span className="bg-sky-100 text-sky-700 text-xs font-medium px-2 py-0.5 rounded-full">
                UCI {ex.uci_code}
              </span>
            )}
            {ex.category_mode === 3 && (
              <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-0.5 rounded-full">
                3-Status: {ex.third_label}
              </span>
            )}
            {target !== null && (
              <span className={'text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ' +
                (aboveTarget ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700')}>
                <Target size={11} /> Ziel {target}%
              </span>
            )}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            {sessions} Sessions · {total} Serien
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className={'text-3xl font-bold ' + (belowTarget ? 'text-rose-700' : aboveTarget ? 'text-emerald-700' : 'text-slate-900')}>{rate}%</div>
          <div className="text-xs text-slate-500">
            {target !== null
              ? (rate >= target ? 'über Ziel ✓' : (target - rate) + '% unter Ziel')
              : 'Quote'}
          </div>
        </div>
      </div>

      {/* SVG-Trend */}
      <TrendSparkline trend={trend} />

      {/* Status-Aufteilung */}
      <div className="flex gap-2 mt-3 text-xs">
        <span className="flex-1 py-1.5 px-2 bg-emerald-50 text-emerald-700 rounded-lg text-center font-medium">
          ✓ {success}
        </span>
        <span className="flex-1 py-1.5 px-2 bg-rose-50 text-rose-700 rounded-lg text-center font-medium">
          ✗ {fail}
        </span>
        {ex.category_mode === 3 && (
          <span className="flex-1 py-1.5 px-2 bg-amber-50 text-amber-700 rounded-lg text-center font-medium">
            ⚠ {third}
          </span>
        )}
      </div>

      {ex.category_mode === 3 && (fail + third) > 0 && (
        <div className="text-xs text-slate-400 mt-2">
          Davon {ex.third_label.toLowerCase()}: <strong className="text-amber-700">{riskRate}%</strong> der nicht geklappten Versuche
        </div>
      )}
    </div>
  );
}

function TrendSparkline({ trend }) {
  // SVG-Sparkline zeichnen
  const width = 280;
  const height = 50;
  const padding = 4;
  const points = trend.map((t, i) => ({ ...t, x: i }));
  const validPoints = points.filter(p => p.rate !== null);

  if (validPoints.length === 0) {
    return (
      <div className="text-xs text-slate-400 text-center py-3 bg-slate-50 rounded-lg">
        Trend braucht mehrere Wochen Daten
      </div>
    );
  }

  const stepX = (width - 2 * padding) / Math.max(trend.length - 1, 1);
  const yFor = (rate) => padding + ((100 - rate) / 100) * (height - 2 * padding);

  const path = validPoints.map((p, i) => {
    const x = padding + p.x * stepX;
    const y = yFor(p.rate);
    return (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1);
  }).join(' ');

  return (
    <div>
      <svg viewBox={'0 0 ' + width + ' ' + height} className="w-full h-12">
        {/* Hintergrund-Linien */}
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2,2" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2,2" />
        {/* Linie */}
        <path d={path} fill="none" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {/* Punkte */}
        {validPoints.map((p, i) => {
          const x = padding + p.x * stepX;
          const y = yFor(p.rate);
          return <circle key={i} cx={x} cy={y} r="3" fill="#f59e0b" />;
        })}
      </svg>
      <div className="flex justify-between text-[10px] text-slate-400 mt-0.5 px-1">
        <span>vor 4 Wo.</span>
        <span>vor 3 Wo.</span>
        <span>vor 2 Wo.</span>
        <span>diese Wo.</span>
      </div>
    </div>
  );
}

// =============================================================
// TRAINING (eigener Bereich, war vorher Home)
// =============================================================
// Gruppiert Sessions in Datums-Buckets relativ zum heutigen Tag.
function groupSessionsByDate(sessions) {
  const todayIso = new Date().toISOString().slice(0, 10);
  const yesterdayIso = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const weekAgoIso = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const today = [];
  const yesterday = [];
  const week = [];
  // Alles ab >7 Tagen wird nach Monat gebucketed (z. B. „Mai 2026", „April 2026")
  const monthMap = new Map(); // key: 'YYYY-MM', value: { label, items: [] }
  const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
                      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  for (const s of sessions) {
    const d = s.date || '';
    if (d === todayIso) today.push(s);
    else if (d === yesterdayIso) yesterday.push(s);
    else if (d > weekAgoIso) week.push(s);
    else if (d) {
      const ym = d.slice(0, 7); // 'YYYY-MM'
      if (!monthMap.has(ym)) {
        const [year, month] = ym.split('-');
        const monthLabel = monthNames[Number(month) - 1] + ' ' + year;
        monthMap.set(ym, { key: ym, label: monthLabel, items: [] });
      }
      monthMap.get(ym).items.push(s);
    }
  }
  // Monate sortieren: neueste zuerst
  const months = Array.from(monthMap.values()).sort((a, b) => b.key.localeCompare(a.key));
  return { today, yesterday, week, months };
}

// Sessions nach Übung gruppieren — pro Übung: Anzahl Serien, Quote, Trend.
function groupSessionsByExercise(sessions) {
  const byEx = new Map();
  for (const s of sessions) {
    const key = s.exerciseId || s.exerciseName || '_unknown';
    if (!byEx.has(key)) {
      byEx.set(key, {
        exerciseId: s.exerciseId,
        exerciseName: s.exerciseName || 'Übung',
        items: [],
        totalEntries: 0,
        totalSuccess: 0,
        lastDate: ''
      });
    }
    const g = byEx.get(key);
    g.items.push(s);
    g.totalEntries += (s.entries || []).length;
    g.totalSuccess += (s.entries || []).filter(e => e === 'success').length;
    if ((s.date || '') > g.lastDate) g.lastDate = s.date || '';
  }
  // Nach letztem Trainingsdatum sortieren (neueste Übung zuerst)
  return Array.from(byEx.values()).sort((a, b) => b.lastDate.localeCompare(a.lastDate));
}

function TrainingView({ data, setData, setView }) {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null); // { session, origIdx }
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [filterExId, setFilterExId] = useState(''); // '' = alle Übungen
  const [filterRange, setFilterRange] = useState('all'); // 'all'|'7d'|'30d'|'90d'|'thisMonth'|'thisYear'
  // Sortier-Modus: nach Datum (default) oder nach Übung
  const [sortMode, setSortMode] = useState(() => {
    try { return localStorage.getItem('artcyc:training-sort') || 'date'; } catch { return 'date'; }
  });
  useEffect(() => {
    try { localStorage.setItem('artcyc:training-sort', sortMode); } catch {}
  }, [sortMode]);
  // Welche Übungs-Gruppen sind ausgeklappt? (Nur im „Nach Übung"-Modus)
  const [openExercises, setOpenExercises] = useState(new Set());
  const toggleExercise = (key) => {
    setOpenExercises(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  // Sessions mit Original-Index versehen damit Edit/Delete den richtigen
  // Eintrag findet — auch wenn Session noch keine id hat (alte Blob-Daten).
  // Außerdem: exerciseName aus data.exercises auflösen (Fallback für Sessions
  // ohne gespeicherten exerciseName).
  const exerciseMap = useMemo(() => {
    const m = new Map();
    for (const ex of (data.exercises || [])) m.set(ex.id, ex);
    return m;
  }, [data.exercises]);
  const indexedAll = useMemo(() => (
    (data.sessions || []).map((s, i) => {
      const ex = s.exerciseId ? exerciseMap.get(s.exerciseId) : null;
      const resolvedName = s.exerciseName || (ex && ex.name) || 'Übung';
      return { ...s, _origIdx: i, exerciseName: resolvedName };
    })
  ), [data.sessions, exerciseMap]);

  // Zeitraum-Filter berechnen
  const rangeFrom = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const iso = (d) => d.toISOString().slice(0, 10);
    if (filterRange === '7d')        { const d = new Date(today); d.setDate(d.getDate() - 6);  return iso(d); }
    if (filterRange === '30d')       { const d = new Date(today); d.setDate(d.getDate() - 29); return iso(d); }
    if (filterRange === '90d')       { const d = new Date(today); d.setDate(d.getDate() - 89); return iso(d); }
    if (filterRange === 'thisMonth') { return iso(new Date(today.getFullYear(), today.getMonth(), 1)); }
    if (filterRange === 'thisYear')  { return iso(new Date(today.getFullYear(), 0, 1)); }
    return null;
  }, [filterRange]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    // Search matched gegen: exerciseName, notes, formatiertes Datum (z. B. „15.5.26") und ISO-Datum
    return indexedAll
      .filter(s => !filterExId || s.exerciseId === filterExId)
      .filter(s => !rangeFrom || (s.date || '') >= rangeFrom)
      .filter(s => {
        if (!q) return true;
        const name = (s.exerciseName || '').toLowerCase();
        const notes = (s.notes || '').toLowerCase();
        const date = (s.date || '').toLowerCase();
        const dateShort = s.date ? formatDateShort(s.date).toLowerCase() : '';
        return name.includes(q) || notes.includes(q) || date.includes(q) || dateShort.includes(q);
      })
      .slice()
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }, [indexedAll, query, filterExId, rangeFrom]);

  const groups = useMemo(() => groupSessionsByDate(filtered), [filtered]);
  const exerciseGroups = useMemo(() => groupSessionsByExercise(filtered), [filtered]);

  const saveEdit = (updated) => {
    const next = (data.sessions || []).slice();
    next[updated._origIdx] = { ...updated };
    delete next[updated._origIdx]._origIdx;
    setData({ ...data, sessions: next });
    setEditing(null);
  };

  const doDelete = (origIdx) => {
    const next = (data.sessions || []).filter((_, i) => i !== origIdx);
    setData({ ...data, sessions: next });
    setConfirmDelete(null);
    setEditing(null);
  };

  const renderRow = (s) => {
    const success = (s.entries || []).filter(e => e === 'success').length;
    const total = (s.entries || []).length;
    const fail = (s.entries || []).filter(e => e === 'fail').length;
    const third = (s.entries || []).filter(e => e === 'third').length;
    const rate = total > 0 ? Math.round((success / total) * 100) : 0;
    const rateColor = rate >= 80 ? 'text-emerald-600' : rate >= 60 ? 'text-amber-600' : 'text-rose-600';
    return (
      <button key={s._origIdx} onClick={() => setEditing(s)}
        className="w-full text-left px-4 py-3 hover:bg-slate-50 active:bg-slate-100 transition flex items-center gap-3 border-b border-slate-100 last:border-0">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-[15px] truncate">{s.exerciseName || 'Übung'}</span>
            {s.withRope === true && (
              <span className="text-[10px] font-medium text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full shrink-0">Seil</span>
            )}
            {s.withRope === false && (
              <span className="text-[10px] font-medium text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded-full shrink-0">ohne</span>
            )}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            {formatDateShort(s.date)} · {total} Serien
            {fail > 0 && <span className="text-rose-600 ml-1">· {fail}✗</span>}
            {third > 0 && <span className="text-amber-600 ml-1">· {third}△</span>}
          </div>
          {s.notes && (
            <div className="text-xs text-slate-500 italic mt-1 line-clamp-1 border-l-2 border-amber-200 pl-2">
              {s.notes}
            </div>
          )}
        </div>
        <div className="text-right shrink-0">
          <div className={'font-semibold text-base ' + rateColor}>{rate}%</div>
          <div className="text-[10px] text-slate-400">{success}/{total}</div>
        </div>
        <ChevronRight size={16} className="text-slate-300 shrink-0" />
      </button>
    );
  };

  const renderGroup = (label, list) => {
    if (!list || list.length === 0) return null;
    return (
      <div key={label}>
        <div className="text-[12px] uppercase tracking-wide font-medium text-[#8E8E93] px-4 mb-1.5 mt-4">
          {label} <span className="font-normal opacity-70">· {list.length}</span>
        </div>
        <div className="bg-white rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">
          {list.map(renderRow)}
        </div>
      </div>
    );
  };

  const renderExerciseGroup = (g) => {
    const rate = g.totalEntries > 0 ? Math.round((g.totalSuccess / g.totalEntries) * 100) : 0;
    const rateColor = rate >= 80 ? 'text-[#34C759]' : rate >= 60 ? 'text-[#FF9500]' : 'text-[#FF3B30]';
    const isOpen = openExercises.has(g.exerciseId || g.exerciseName);
    const key = g.exerciseId || g.exerciseName;
    return (
      <div key={key} className="bg-white rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">
        <button onClick={() => toggleExercise(key)}
          className="w-full text-left px-4 py-3 flex items-center gap-3 active:bg-[#D1D1D6]/40 transition">
          <div className="min-w-0 flex-1">
            <div className="font-medium text-[15px] truncate">{g.exerciseName}</div>
            <div className="text-[12px] text-[#8E8E93] mt-0.5">
              {g.items.length} Sessions · {g.totalEntries} Serien · zuletzt {formatDateShort(g.lastDate)}
            </div>
          </div>
          <div className={'font-semibold text-[17px] ' + rateColor}>{rate}%</div>
          <ChevronRight size={18} strokeWidth={2.4}
            className={'text-[#C7C7CC] shrink-0 transition-transform ' + (isOpen ? 'rotate-90' : '')} />
        </button>
        {isOpen && (
          <div className="border-t border-[#C6C6C8]/40">
            {g.items
              .slice()
              .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
              .map(renderRow)}
          </div>
        )}
      </div>
    );
  };

  const totalCount = indexedAll.length;
  const exerciseList = useMemo(() => {
    const map = new Map();
    for (const s of indexedAll) {
      if (s.exerciseId && !map.has(s.exerciseId)) {
        map.set(s.exerciseId, s.exerciseName || 'Übung');
      }
    }
    return Array.from(map, ([id, name]) => ({ id, name }));
  }, [indexedAll]);

  // Aggregat-Stats für die Top-Cards
  const trainTopStats = (() => {
    const all = data.sessions || [];
    const entries = all.flatMap(s => s.entries || []);
    const total = entries.length;
    const success = entries.filter(e => e === 'success').length;
    const rate = total > 0 ? Math.round(success / total * 100) : 0;
    const days = new Set(all.map(s => s.date).filter(Boolean));
    const exIds = new Set(all.map(s => s.exerciseId).filter(Boolean));
    // Aktuelle Streak: aufeinanderfolgende Trainingstage rückwärts ab heute
    const dayStrs = Array.from(days).sort((a, b) => b.localeCompare(a));
    let streak = 0;
    if (dayStrs.length > 0) {
      let cursor = new Date();
      cursor.setHours(0, 0, 0, 0);
      const set = new Set(dayStrs);
      for (let i = 0; i < 365; i++) {
        const k = cursor.toISOString().slice(0, 10);
        if (set.has(k)) { streak += 1; cursor.setDate(cursor.getDate() - 1); }
        else break;
      }
    }
    return { sessionCount: all.length, days: days.size, exCount: exIds.size, rate, streak };
  })();

  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between flex-wrap gap-3 pt-2 px-1">
        <div>
          <h1 className="text-[34px] font-bold tracking-tight leading-none">{t('training.title')}</h1>
          <p className="text-[#8E8E93] text-[15px] mt-1">{t('training.totalSessions', { n: totalCount })}</p>
        </div>
        <button onClick={() => setView('erfassen')}
          className="bg-[#FF9500] text-white px-4 py-2 rounded-full font-semibold text-[14px] flex items-center gap-1.5 shadow-[0_2px_8px_rgba(255,149,0,0.25)] active:scale-95 transition">
          <Plus size={16} strokeWidth={2.5} /> {t('training.logButton')}
        </button>
      </header>

      {/* Top-Stats — nur sichtbar wenn Sessions vorhanden */}
      {totalCount > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            icon={TrendingUp}
            label="Erfolgsquote"
            value={trainTopStats.rate + '%'}
            sub="über alle Sessions"
            color={trainTopStats.rate >= 80 ? 'emerald' : trainTopStats.rate >= 60 ? 'amber' : 'rose'}
          />
          <StatCard
            icon={Calendar}
            label="Trainingstage"
            value={trainTopStats.days}
            sub={trainTopStats.streak > 1 ? trainTopStats.streak + '× in Serie' : (trainTopStats.streak === 1 ? 'heute aktiv' : '—')}
            color="sky"
          />
          <StatCard
            icon={Dumbbell}
            label="Sessions"
            value={trainTopStats.sessionCount}
            sub={trainTopStats.exCount + ' Übungen'}
            color="violet"
          />
          <StatCard
            icon={Activity}
            label="Aktuelle Serie"
            value={trainTopStats.streak}
            sub={trainTopStats.streak === 1 ? 'Tag' : 'Tage'}
            color="orange"
          />
        </div>
      )}

      {/* Suche */}
      {totalCount > 0 && (
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
          {query && (
            <button onClick={() => setQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#8E8E93]/60 text-white flex items-center justify-center active:opacity-70"
              aria-label="Suche löschen">
              <X size={12} strokeWidth={3} />
            </button>
          )}
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder={t('training.searchPlaceholder')}
            className="w-full pl-9 pr-9 py-2.5 bg-slate-100 rounded-xl outline-none text-[15px]" />
        </div>
      )}

      {/* Zeitraum-Pills */}
      {totalCount > 0 && (
        <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1" data-no-swipe="true">
          {[
            { id: 'all',       label: t('training.range.all') },
            { id: '7d',        label: t('training.range.7d') },
            { id: '30d',       label: t('training.range.30d') },
            { id: '90d',       label: t('training.range.90d') },
            { id: 'thisMonth', label: t('training.range.thisMonth') },
            { id: 'thisYear',  label: t('training.range.thisYear') }
          ].map(r => (
            <button key={r.id} onClick={() => setFilterRange(r.id)}
              className={'px-3.5 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition active:scale-95 ' +
                (filterRange === r.id
                  ? 'bg-[#FF9500] text-white shadow-[0_1px_3px_rgba(255,149,0,0.35)]'
                  : 'bg-white text-[#3C3C43] shadow-[0_1px_2px_rgba(0,0,0,0.04)]')}>
              {r.label}
            </button>
          ))}
        </div>
      )}

      {/* Übungs-Filter (Dropdown) */}
      {totalCount > 0 && exerciseList.length > 1 && (
        <select value={filterExId} onChange={e => setFilterExId(e.target.value)}
          className="w-full px-3 py-2.5 bg-white rounded-xl outline-none text-[15px] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <option value="">{t('training.allExercises', { n: totalCount })}</option>
          {exerciseList.map(e => (
            <option key={e.id} value={e.id}>{localizedExerciseName(e)}</option>
          ))}
        </select>
      )}

      {/* Sortier-Modus — Datum / Übung */}
      {totalCount > 0 && (
        <div className="bg-[#E5E5EA]/70 rounded-xl p-0.5 flex">
          <button onClick={() => setSortMode('date')}
            className={'flex-1 py-1.5 rounded-[10px] text-[13px] font-medium transition ' +
              (sortMode === 'date' ? 'ios-seg-active' : 'text-[#3C3C43] active:opacity-70')}>
            {t('training.sortByDate')}
          </button>
          <button onClick={() => setSortMode('exercise')}
            className={'flex-1 py-1.5 rounded-[10px] text-[13px] font-medium transition ' +
              (sortMode === 'exercise' ? 'ios-seg-active' : 'text-[#3C3C43] active:opacity-70')}>
            {t('training.sortByExercise')}
          </button>
        </div>
      )}

      {totalCount === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-8 text-center">
          <Dumbbell size={32} className="mx-auto text-slate-300 mb-3" />
          <h3 className="font-semibold mb-1">{t('training.empty')}</h3>
          <p className="text-sm text-slate-500 mb-4">{t('training.emptyHint')}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-6 text-center text-[14px] text-[#8E8E93]">
          {t('training.noMatches')}
        </div>
      ) : sortMode === 'exercise' ? (
        <div className="space-y-2">
          {exerciseGroups.map(renderExerciseGroup)}
        </div>
      ) : (
        <div className="space-y-1">
          {renderGroup(t('training.today'), groups.today)}
          {renderGroup(t('training.yesterday'), groups.yesterday)}
          {renderGroup(t('training.thisWeek'), groups.week)}
          {groups.months.map(m => renderGroup(m.label, m.items))}
        </div>
      )}

      {/* Edit-Modal */}
      {editing && (
        <SessionEditModal
          session={editing}
          exercises={data.exercises || []}
          onSave={saveEdit}
          onDelete={() => setConfirmDelete(editing._origIdx)}
          onClose={() => setEditing(null)} />
      )}

      {/* Delete-Confirm */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-3xl sm:rounded-2xl w-full max-w-sm p-5 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center"><Trash2 size={18} className="text-rose-600" /></div>
              <div>
                <h3 className="font-semibold">Session löschen?</h3>
                <p className="text-xs text-slate-500">Kann nicht rückgängig gemacht werden.</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-xl bg-slate-100 font-medium text-sm">Abbrechen</button>
              <button onClick={() => doDelete(confirmDelete)} className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-medium text-sm">Löschen</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================
// Session-Edit-Modal — Datum, Entries umtoggeln, Notiz, Mit/Ohne Seil
// =============================================================
function SessionEditModal({ session, exercises, onSave, onDelete, onClose }) {
  const { t } = useI18n();
  const exercise = exercises.find(e => e.id === session.exerciseId);
  const [date, setDate] = useState(session.date || new Date().toISOString().slice(0, 10));
  const [entries, setEntries] = useState(session.entries || []);
  const [notes, setNotes] = useState(session.notes || '');
  const [withRope, setWithRope] = useState(
    typeof session.withRope === 'boolean' ? session.withRope : null
  );

  const use3 = exercise && exercise.category_mode === 3;
  const success = entries.filter(e => e === 'success').length;
  const fail = entries.filter(e => e === 'fail').length;
  const third = entries.filter(e => e === 'third').length;

  const handleSave = () => {
    onSave({
      ...session,
      date,
      entries,
      notes: notes.trim() || null,
      withRope: exercise && exercise.has_rope_variant ? withRope : null
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-5 py-3 flex items-center justify-between">
          <button onClick={onClose} className="text-amber-500 font-medium text-[15px]">Abbrechen</button>
          <h3 className="font-semibold text-[15px]">Session bearbeiten</h3>
          <button onClick={handleSave} className="text-amber-500 font-semibold text-[15px]">Fertig</button>
        </div>

        <div className="p-5 space-y-4">
          {/* Übung (read-only Info) */}
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="text-xs text-slate-500">Übung</div>
            <div className="font-medium">{exercise ? exercise.name : (session.exerciseName || '—')}</div>
          </div>

          {/* Datum */}
          <div>
            <label className="text-sm font-medium block mb-1.5">Datum</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
          </div>

          {/* Mit/Ohne Seil */}
          {exercise && exercise.has_rope_variant && (
            <div>
              <label className="text-sm font-medium block mb-1.5">{t('log.variant')}</label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setWithRope(true)}
                  className={'py-2.5 rounded-xl text-sm font-medium border transition active:scale-95 ' +
                    (withRope === true ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-slate-700 border-slate-300')}>
                  {t('log.withRope')}
                </button>
                <button type="button" onClick={() => setWithRope(false)}
                  className={'py-2.5 rounded-xl text-sm font-medium border transition active:scale-95 ' +
                    (withRope === false ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-slate-700 border-slate-300')}>
                  {t('log.withoutRope')}
                </button>
              </div>
            </div>
          )}

          {/* Entries */}
          <div>
            <label className="text-sm font-medium block mb-2">Serien · {entries.length}</label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button onClick={() => setEntries([...entries, 'success'])}
                className="bg-emerald-600 text-white py-3.5 rounded-2xl font-semibold flex flex-col items-center gap-0.5 active:scale-95 transition-transform">
                <Check size={20} /><span className="text-sm">{statusLabel(exercise, 'success')}</span>
                <span className="text-xs opacity-80">{success}</span>
              </button>
              <button onClick={() => setEntries([...entries, 'fail'])}
                className="bg-rose-600 text-white py-3.5 rounded-2xl font-semibold flex flex-col items-center gap-0.5 active:scale-95 transition-transform">
                <X size={20} /><span className="text-sm">{statusLabel(exercise, 'fail')}</span>
                <span className="text-xs opacity-80">{fail}</span>
              </button>
            </div>
            {use3 && (
              <button onClick={() => setEntries([...entries, 'third'])}
                className="w-full bg-amber-500 text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 mb-2 active:scale-95 transition-transform">
                <AlertTriangle size={18} /><span className="text-sm">{statusLabel(exercise, 'third')}</span>
                <span className="text-xs opacity-80">· {third}</span>
              </button>
            )}

            {entries.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {entries.map((s, i) => (
                  <button key={i} onClick={() => {
                    const order = use3 ? ['success', 'fail', 'third'] : ['success', 'fail'];
                    const next = [...entries];
                    next[i] = order[(order.indexOf(s) + 1) % order.length];
                    setEntries(next);
                  }}
                    className={'w-9 h-9 rounded-lg font-bold text-white text-sm flex items-center justify-center ' +
                      (s === 'success' ? 'bg-emerald-600' : s === 'fail' ? 'bg-rose-600' : 'bg-amber-500')}>
                    {i + 1}
                  </button>
                ))}
              </div>
            )}

            <button onClick={() => setEntries(entries.slice(0, -1))} disabled={entries.length === 0}
              className="text-xs text-slate-500 disabled:opacity-50">
              ← Letzte entfernen
            </button>
          </div>

          {/* Notiz */}
          <div>
            <label className="text-sm font-medium block mb-1.5">Notiz</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              rows={2} placeholder="Optional…"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 text-sm resize-y" />
          </div>

          {/* Löschen */}
          <button onClick={onDelete}
            className="w-full py-2.5 rounded-xl text-rose-600 font-medium text-sm border border-rose-200 bg-rose-50 active:bg-rose-100 flex items-center justify-center gap-2">
            <Trash2 size={14} /> Session löschen
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================================
// EINSTELLUNGEN (Skeleton — wird in Stufe 8 ausgebaut)
// =============================================================
function SettingsView({ data, setData, onResetAll, profile, session, onLogout, cloudStatus, dbAthletes, dbProfiles, refreshAthletes, theme, setTheme, langPref, setLangPref, rulesLangPref, setRulesLangPref, setView, onOpenFeedback }) {
  const { t } = useI18n();
  const roleLabel = profile?.role === 'admin' ? t('role.admin') : profile?.role === 'coach' ? t('role.coach') : t('role.athlete');
  const syncLabel = cloudStatus === 'syncing' ? t('settings.cloudSyncing') : cloudStatus === 'error' ? t('settings.cloudSyncError') : t('settings.cloudSynced');
  const syncTagColor = cloudStatus === 'syncing' ? 'orange' : cloudStatus === 'error' ? 'red' : 'green';

  // Trainer-Verknüpfungen: zeigen wer Zugriff auf MEINE Daten hat
  const myUserId = session?.user?.id;
  const myAthletes = (dbAthletes || []).filter(a => a.auth_user_id === myUserId);
  const trainerLinks = myAthletes
    .filter(a => a.created_by_coach_id)
    .map(a => {
      const coachProfile = (dbProfiles || []).find(p => p.id === a.created_by_coach_id);
      return { athleteId: a.id, athleteName: a.name, coachId: a.created_by_coach_id, coachName: coachProfile?.display_name || 'Unbekannt' };
    });
  const [revokeBusy, setRevokeBusy] = useState(false);
  const onRevokeTrainer = async (athleteId, coachName) => {
    if (!confirm('Trainer „' + coachName + '" den Zugriff auf deine Daten entziehen?')) return;
    setRevokeBusy(true);
    const { error } = await updateAthlete(athleteId, { created_by_coach_id: null });
    if (error) alert('Fehler: ' + error.message);
    await refreshAthletes();
    setRevokeBusy(false);
  };

  // Phase 9d-2: Migration Blob → Tabellen
  const [migrateBusy, setMigrateBusy] = useState(false);
  const [migrateResult, setMigrateResult] = useState(null);
  const alreadyMigrated = data && data.migrated_to_tables === true;
  const onMigrate = async () => {
    if (!confirm('Daten in Cloud-Tabellen migrieren?\n\nDeine Sessions, Wettkämpfe, Programme und Übungen werden in echte DB-Tabellen verschoben. Vorteil: Trainer können sie dann sehen UND bearbeiten. Der Vorgang ist sicher (Blob bleibt erhalten).')) return;
    setMigrateBusy(true);
    setMigrateResult(null);
    const { data: result, error } = await migrateBlobToTables();
    if (error) {
      setMigrateResult({ error: error.message });
    } else {
      setMigrateResult(result);
    }
    setMigrateBusy(false);
  };
  const themeOptions = [
    { id: 'system', label: t('settings.appearanceAuto'),  Icon: SunMoon },
    { id: 'light',  label: t('settings.appearanceLight'), Icon: Sun },
    { id: 'dark',   label: t('settings.appearanceDark'),  Icon: Moon },
  ];

  // Owner-Only Admin-Bereich (sichtbar nur für Ruben)
  const isOwner = isAppOwner(session);
  const [showAdminAccounts, setShowAdminAccounts] = useState(false);

  return (
    <div className="space-y-6">
      <header className="pt-2 px-1">
        <h1 className="text-[34px] font-bold tracking-tight leading-none">{t('settings.title')}</h1>
        <p className="text-[#8E8E93] text-[15px] mt-1">{t('settings.subtitle')}</p>
      </header>

      {/* Account */}
      {session && (
        <IOSList header={t('settings.account')}>
          <div className="px-4 py-3.5 flex items-center justify-between gap-3">
            <span className="text-[15px] text-[#3C3C43]">{t('settings.loggedInAs')}</span>
            <span className="text-[15px] font-medium text-right truncate ml-3">{profile?.display_name || session.user.email}</span>
          </div>
          <div className="px-4 py-3.5 flex items-center justify-between gap-3">
            <span className="text-[15px] text-[#3C3C43]">{t('settings.email')}</span>
            <span className="text-[15px] text-[#8E8E93] text-right truncate ml-3">{session.user.email}</span>
          </div>
          <div className="px-4 py-3.5 flex items-center justify-between gap-3">
            <span className="text-[15px] text-[#3C3C43]">{t('settings.role')}</span>
            <IOSTag color={profile?.role === 'admin' ? 'orange' : 'gray'}>{roleLabel}</IOSTag>
          </div>
          <div className="px-4 py-3.5 flex items-center justify-between gap-3">
            <span className="text-[15px] text-[#3C3C43]">{t('settings.cloudSync')}</span>
            <IOSTag color={syncTagColor}>{syncLabel}</IOSTag>
          </div>
          <IOSListRow onClick={onLogout} trailing={<LogOut size={18} className="text-[#FF3B30]" />}>
            <span className="text-[15px] text-[#FF3B30] font-medium">{t('settings.signOut')}</span>
          </IOSListRow>
        </IOSList>
      )}

      {/* Owner-Admin — nur für Ruben sichtbar */}
      {isOwner && (
        <IOSList header="Admin" footer="Account-Verwaltung für alle registrierten Nutzer.">
          <IOSListRow
            onClick={() => setShowAdminAccounts(true)}
            trailing={<ChevronRight size={16} className="text-[#C7C7CC]" />}>
            <div className="flex items-center gap-3">
              <Crown size={18} className="text-[#FF9500]" />
              <span className="text-[15px]">Alle Accounts verwalten</span>
            </div>
          </IOSListRow>
        </IOSList>
      )}

      {isOwner && (
        <AdminAccountsView open={showAdminAccounts} onClose={() => setShowAdminAccounts(false)} />
      )}

      {/* Feedback — prominent direkt unter Account, blau-akzentuiert */}
      <IOSList header={t('feedback.section')} footer={t('feedback.footer')}>
        <IOSListRow
          onClick={onOpenFeedback}
          trailing={<ChevronRight size={18} strokeWidth={2.4} className="text-[#C7C7CC]" />}>
          <span className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-[#007AFF]/12 flex items-center justify-center shrink-0">
              <MessageCircle size={18} className="text-[#007AFF]" />
            </span>
            <span className="flex flex-col min-w-0">
              <span className="text-[15px] font-medium text-[#007AFF]">{t('feedback.title')}</span>
              <span className="text-[12px] text-[#8E8E93]">{t('feedback.subtitle')}</span>
            </span>
          </span>
        </IOSListRow>
      </IOSList>

      {/* Erscheinungsbild */}
      <IOSList header={t('settings.appearance')} footer={t('settings.appearanceFooter')}>
        {themeOptions.map(opt => {
          const selected = theme === opt.id;
          return (
            <IOSListRow
              key={opt.id}
              onClick={() => setTheme(opt.id)}
              trailing={selected ? <Check size={20} strokeWidth={2.8} className="text-[#FF9500]" /> : <span className="w-5" />}>
              <span className="flex items-center gap-3">
                <opt.Icon size={18} className="text-[#8E8E93]" />
                <span className="text-[15px]">{opt.label}</span>
              </span>
            </IOSListRow>
          );
        })}
      </IOSList>

      {/* Sprache */}
      <IOSList header={t('settings.language')} footer={t('settings.languageFooter')}>
        <IOSListRow
          onClick={() => setLangPref('auto')}
          trailing={langPref === 'auto' ? <Check size={20} strokeWidth={2.8} className="text-[#FF9500]" /> : <span className="w-5" />}>
          <span className="flex items-center gap-3">
            <Globe size={18} className="text-[#8E8E93]" />
            <span className="text-[15px]">{t('settings.languageAuto')}</span>
          </span>
        </IOSListRow>
        {LANGUAGES.map(l => (
          <IOSListRow
            key={l.code}
            onClick={() => setLangPref(l.code)}
            trailing={langPref === l.code ? <Check size={20} strokeWidth={2.8} className="text-[#FF9500]" /> : <span className="w-5" />}>
            <span className="flex items-center gap-3">
              <span className="text-[18px] leading-none">{l.flag}</span>
              <span className="text-[15px]">{l.native}</span>
              {l.native !== l.label && <span className="text-[13px] text-[#8E8E93]">· {l.label}</span>}
            </span>
          </IOSListRow>
        ))}
      </IOSList>

      {/* Reglement-Sprache — separate Wahl für UCI-Übungs-Namen */}
      {setRulesLangPref && (
        <IOSList header={t('settings.rulesLanguage')} footer={t('settings.rulesLanguageFooter')}>
          <IOSListRow
            onClick={() => setRulesLangPref('auto')}
            trailing={rulesLangPref === 'auto' ? <Check size={20} strokeWidth={2.8} className="text-[#FF9500]" /> : <span className="w-5" />}>
            <span className="flex items-center gap-3">
              <FileText size={18} className="text-[#8E8E93]" />
              <span className="text-[15px]">{t('settings.rulesLanguageAuto')}</span>
            </span>
          </IOSListRow>
          {LANGUAGES.filter(l => SUPPORTED_RULES_LANGS.includes(l.code)).map(l => (
            <IOSListRow
              key={l.code}
              onClick={() => setRulesLangPref(l.code)}
              trailing={rulesLangPref === l.code ? <Check size={20} strokeWidth={2.8} className="text-[#FF9500]" /> : <span className="w-5" />}>
              <span className="flex items-center gap-3">
                <span className="text-[18px] leading-none">{l.flag}</span>
                <span className="text-[15px]">{l.native}</span>
              </span>
            </IOSListRow>
          ))}
        </IOSList>
      )}

      {/* Trainer-Zugriff */}
      {session && (
        <IOSList
          header={t('settings.trainerAccess')}
          footer={trainerLinks.length === 0
            ? (profile?.role === 'athlete'
                ? t('settings.trainerAccessEmptyAthlete')
                : t('settings.trainerAccessEmptyOther'))
            : t('settings.trainerAccessFooter')}>
          {trainerLinks.length === 0 ? (
            <div className="px-4 py-3.5 flex items-center gap-3">
              <Shield size={18} className="text-[#8E8E93]" />
              <span className="text-[15px] text-[#8E8E93]">{t('settings.noTrainerAccess')}</span>
            </div>
          ) : (
            trainerLinks.map(link => (
              <div key={link.athleteId} className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-[15px] truncate">{link.coachName}</div>
                  <div className="text-[13px] text-[#8E8E93] truncate">„{link.athleteName}"</div>
                </div>
                <button
                  onClick={() => onRevokeTrainer(link.athleteId, link.coachName)}
                  disabled={revokeBusy}
                  className="text-[14px] text-[#FF3B30] px-3 py-1.5 rounded-full font-medium active:opacity-50 disabled:opacity-40 shrink-0">
                  {t('settings.trainerRevoke')}
                </button>
              </div>
            ))
          )}
        </IOSList>
      )}

      {/* Cloud-Migration */}
      <IOSList
        header={t('settings.cloudData')}
        footer={alreadyMigrated
          ? t('settings.cloudDataFooter')
          : t('settings.cloudDataNotMigratedFooter')}>
        {alreadyMigrated ? (
          <div className="px-4 py-3.5 flex items-center gap-3">
            <Archive size={18} className="text-[#34C759]" />
            <span className="text-[15px] flex-1">{t('settings.migrated')}</span>
            <IOSTag color="green">{t('settings.migrationActive')}</IOSTag>
          </div>
        ) : (
          <IOSListRow
            onClick={migrateBusy ? undefined : onMigrate}
            trailing={migrateBusy ? <Loader2 size={18} className="animate-spin text-[#FF9500]" /> : <ChevronRight size={18} strokeWidth={2.4} className="text-[#C7C7CC]" />}>
            <span className="flex items-center gap-3">
              <Archive size={18} className="text-[#FF9500]" />
              <span className="text-[15px] text-[#FF9500] font-medium">
                {migrateBusy ? 'Migriere…' : 'In Cloud-Tabellen migrieren'}
              </span>
            </span>
          </IOSListRow>
        )}
        {migrateResult && !migrateResult.error && !alreadyMigrated && (
          <div className="px-4 py-3 bg-emerald-50 text-[13px] text-emerald-900">
            <strong>✓ Migration erfolgreich:</strong> {migrateResult.exercises} Übungen · {migrateResult.programs} Programme · {migrateResult.sessions} Sessions · {migrateResult.competitions} Wettkämpfe
          </div>
        )}
        {migrateResult && migrateResult.error && (
          <div className="px-4 py-3 bg-rose-50 text-[13px] text-rose-900">
            ✗ Fehler: {migrateResult.error}
          </div>
        )}
      </IOSList>

      {/* Export */}
      <IOSList header={t('export.title')} footer={t('export.footer')}>
        <IOSListRow
          onClick={() => setView && setView('export')}
          trailing={<ChevronRight size={18} strokeWidth={2.4} className="text-[#C7C7CC]" />}>
          <span className="flex items-center gap-3">
            <Download size={18} className="text-[#FF9500]" />
            <span className="text-[15px] font-medium">{t('export.openButton')}</span>
          </span>
        </IOSListRow>
      </IOSList>

      <BackupSettings data={data} setData={setData} />

      {/* Reset */}
      <IOSList footer={t('settings.resetFooter')}>
        <IOSListRow
          onClick={onResetAll}
          trailing={<ChevronRight size={18} strokeWidth={2.4} className="text-[#C7C7CC]" />}>
          <span className="flex items-center gap-3">
            <RotateCcw size={18} className="text-[#FF3B30]" />
            <span className="text-[15px] text-[#FF3B30] font-medium">{t('settings.resetButton')}</span>
          </span>
        </IOSListRow>
      </IOSList>

      {/* Über */}
      <IOSList header={t('settings.about')}>
        <div className="px-4 py-3.5 flex items-center justify-between gap-3">
          <span className="text-[15px] text-[#3C3C43]">{t('settings.aboutApp')}</span>
          <span className="text-[15px] font-medium">ArtCyc Coach</span>
        </div>
        <div className="px-4 py-3.5 flex items-center justify-between gap-3">
          <span className="text-[15px] text-[#3C3C43]">{t('settings.aboutVersion')}</span>
          <span className="text-[15px] text-[#8E8E93] tabular-nums">{__APP_VERSION__} · Build {__BUILD_DATE__}</span>
        </div>
        <div className="px-4 py-3.5 flex items-center justify-between gap-3">
          <span className="text-[15px] text-[#3C3C43]">{t('settings.aboutRulesVersion')}</span>
          <span className="text-[15px] text-[#8E8E93]">UCI {data.uci_version || '2026'}</span>
        </div>
        <div className="px-4 py-3.5 flex items-center justify-between gap-3">
          <span className="text-[15px] text-[#3C3C43]">{t('settings.aboutUciCount')}</span>
          <span className="text-[15px] text-[#8E8E93]">{t('settings.aboutUciCountValue', { n: getUciDb().length })}</span>
        </div>
      </IOSList>

      <div className="h-4" />
    </div>
  );
}

// =============================================================
// FEEDBACK-MODAL — User schickt Feedback, wird lokal gespeichert,
// optional per Mail an Entwickler weitergeleitet.
// =============================================================
function FeedbackModal({ onClose }) {
  const { t } = useI18n();
  const [text, setText] = useState('');
  const [category, setCategory] = useState('idea');
  const [busy, setBusy] = useState(false);
  const [list, setList] = useState(() => getFeedback());
  const [justSent, setJustSent] = useState(false);
  // attachments-Pipeline: jeder Eintrag = { id, name, type, size, dataUrl, base64 }
  const [attachments, setAttachments] = useState([]);
  const [attachError, setAttachError] = useState(null);
  const fileInputRef = useRef(null);

  const ATTACH_MAX_PER_FILE_MB = 10;
  const ATTACH_MAX_TOTAL_MB    = 20;

  const categories = [
    { id: 'bug',      label: t('feedback.categoryBug'),      color: 'text-[#FF3B30]' },
    { id: 'idea',     label: t('feedback.categoryIdea'),     color: 'text-[#FF9500]' },
    { id: 'question', label: t('feedback.categoryQuestion'), color: 'text-[#007AFF]' },
    { id: 'other',    label: t('feedback.categoryOther'),    color: 'text-[#8E8E93]' }
  ];

  const handleFilesPicked = async (fileList) => {
    setAttachError(null);
    const files = Array.from(fileList || []);
    if (!files.length) return;
    const currentTotal = attachments.reduce((sum, a) => sum + (a.size || 0), 0);
    const limitFile  = ATTACH_MAX_PER_FILE_MB * 1024 * 1024;
    const limitTotal = ATTACH_MAX_TOTAL_MB    * 1024 * 1024;
    const next = [...attachments];
    let runningTotal = currentTotal;
    for (const f of files) {
      if (f.size > limitFile) {
        setAttachError(t('feedback.attachTooBig', { size: (f.size / 1024 / 1024).toFixed(1), max: ATTACH_MAX_PER_FILE_MB }));
        continue;
      }
      if (runningTotal + f.size > limitTotal) {
        setAttachError(t('feedback.attachTotalTooBig', { totalMax: ATTACH_MAX_TOTAL_MB }));
        continue;
      }
      try {
        const base64 = await fileToBase64(f);
        next.push({
          id: 'att_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
          name: f.name,
          type: f.type || 'application/octet-stream',
          size: f.size,
          dataUrl: f.type && f.type.startsWith('image/') ? ('data:' + f.type + ';base64,' + base64) : null,
          base64,
        });
        runningTotal += f.size;
      } catch (err) {
        setAttachError(String(err?.message || err));
      }
    }
    setAttachments(next);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (id) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
    setAttachError(null);
  };

  const [mailWarning, setMailWarning] = useState(null); // null | string (Fehler-Text vom Server)
  const send = async () => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setBusy(true);
    setMailWarning(null);
    const id = submitFeedback({ text: trimmed, category, source: 'user', attachments });
    const attsForUpload = attachments.map(a => ({
      name: a.name,
      type: a.type,
      content_base64: a.base64,
    }));
    setText('');
    setAttachments([]);
    setList(getFeedback());
    setJustSent(true);
    // Im Hintergrund in die Cloud pushen — DB-Insert + Auto-Mail.
    // Fehlschlag schlägt nicht durch: der Eintrag bleibt lokal mit
    // synced=false und kann manuell per Mail-Knopf rausgeschickt werden.
    pushFeedbackToCloud(supabase, getFeedback().find(e => e.id === id), attsForUpload.length ? attsForUpload : null)
      .then(r => {
        setList(getFeedback());
        if (r && r.ok && !r.mail_sent) {
          setMailWarning(r.mail_error || 'Mail wurde nicht verschickt — Resend-API-Key fehlt oder Empfänger ist nicht freigeschaltet (Resend Test-Modus erlaubt nur Senden an die Resend-Account-Mail bis Domain verifiziert ist).');
        } else if (r && r.ok && r.attachment_warning) {
          setMailWarning(r.attachment_warning);
        }
      })
      .catch(() => {});
    setBusy(false);
    setTimeout(() => setJustSent(false), 2200);
  };

  const sendByMail = () => {
    if (list.length === 0) return;
    window.location.href = buildFeedbackMailto(list);
  };

  const clearAll = () => {
    if (!confirm(t('feedback.clearAll') + '?')) return;
    clearFeedback();
    setList([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#F2F2F7] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* iOS Header */}
        <div className="sticky top-0 bg-[#F2F2F7]/95 backdrop-blur-xl px-4 py-3 flex items-center justify-between z-10">
          <button onClick={onClose} className="text-[17px] text-[#007AFF] active:opacity-60 px-1">
            {t('common.cancel')}
          </button>
          <h3 className="font-semibold text-[17px]">{t('feedback.title')}</h3>
          <span className="w-12" />
        </div>

        <div className="px-3 py-4 space-y-5">
          {/* Hinweis-Text */}
          <p className="text-[14px] text-[#8E8E93] px-2">{t('feedback.subtitle')}</p>

          {/* Kategorie */}
          <IOSList header={t('feedback.category')}>
            {categories.map(c => (
              <IOSListRow
                key={c.id}
                onClick={() => setCategory(c.id)}
                trailing={category === c.id ? <Check size={20} strokeWidth={2.8} className="text-[#FF9500]" /> : <span className="w-5" />}>
                <span className={'text-[15px] font-medium ' + c.color}>{c.label}</span>
              </IOSListRow>
            ))}
          </IOSList>

          {/* Text-Eingabe */}
          <div className="bg-white rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-3">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={t('feedback.placeholder')}
              rows={5}
              className="w-full bg-transparent text-[15px] outline-none resize-y placeholder:text-[#C7C7CC]" />
          </div>

          {/* Anhänge: Datei/Foto picker + Vorschau-Liste */}
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,application/pdf,text/plain,application/json,.csv,.log"
              onChange={e => handleFilesPicked(e.target.files)}
              className="hidden" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-white text-[#007AFF] py-3 rounded-2xl text-[15px] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.04)] active:opacity-60 flex items-center justify-center gap-2">
              <Paperclip size={16} strokeWidth={2.4} /> {t('feedback.attach')}
            </button>
            <p className="text-[12px] text-[#8E8E93] text-center px-3 leading-snug">
              {t('feedback.attachHint', { max: ATTACH_MAX_PER_FILE_MB, totalMax: ATTACH_MAX_TOTAL_MB })}
            </p>
            {attachError && (
              <div className="bg-red-50 text-[#FF3B30] text-[13px] rounded-xl p-3">
                {attachError}
              </div>
            )}
            {attachments.length > 0 && (
              <div className="bg-white rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">
                {attachments.map((a, i) => (
                  <div key={a.id} className={'flex items-center gap-3 px-3 py-2.5 ' + (i > 0 ? 'border-t border-[rgba(198,198,200,0.4)]' : '')}>
                    {a.dataUrl
                      ? <img src={a.dataUrl} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                      : <div className="w-12 h-12 rounded-lg bg-[#F2F2F7] flex items-center justify-center flex-shrink-0">
                          <Paperclip size={18} className="text-[#8E8E93]" />
                        </div>}
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-medium truncate">{a.name}</div>
                      <div className="text-[12px] text-[#8E8E93]">
                        {(a.size / 1024).toFixed(a.size > 1024 * 1024 ? 0 : 1)} {a.size > 1024 * 1024 ? 'MB' : 'KB'}
                      </div>
                    </div>
                    <button
                      onClick={() => removeAttachment(a.id)}
                      aria-label={t('feedback.attachRemove')}
                      className="text-[#FF3B30] active:opacity-60 p-1">
                      <X size={18} strokeWidth={2.4} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Send-Button */}
          <button
            onClick={send}
            disabled={!text.trim() || busy}
            className="w-full bg-[#FF9500] text-white py-3 rounded-2xl font-semibold text-[15px] shadow-[0_2px_8px_rgba(255,149,0,0.25)] active:scale-95 transition disabled:opacity-40">
            <span className="inline-flex items-center gap-2">
              <Send size={16} strokeWidth={2.4} /> {t('feedback.send')}
            </span>
          </button>

          {/* Klarstellung: Senden = Auto-Mail an Entwickler */}
          <p className="text-[12px] text-[#8E8E93] text-center px-3 leading-snug -mt-2">
            Geht direkt an den Entwickler — keine weitere Aktion nötig.
          </p>

          {justSent && (
            <div className="bg-emerald-50 text-emerald-900 text-[14px] rounded-xl p-3 text-center">
              ✓ {t('feedback.thanks')}
            </div>
          )}

          {mailWarning && (
            <div className="bg-amber-50 text-amber-900 text-[13px] rounded-xl p-3 leading-snug">
              <strong>⚠ Mail-Versand fehlgeschlagen:</strong>
              <div className="mt-1 font-mono text-[12px] break-words">{mailWarning}</div>
              <div className="mt-2">In der Cloud-DB ist das Feedback gespeichert. Mit „Per Mail senden" unten kannst du es manuell schicken.</div>
            </div>
          )}

          {/* Bisheriges Feedback */}
          {list.length > 0 ? (
            <IOSList
              header={t('feedback.history') + ' · ' + list.length}>
              {list.slice(0, 30).map(e => (
                <div key={e.id} className="px-4 py-3">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[12px] uppercase tracking-wide text-[#8E8E93] font-medium">
                      {t('feedback.category' + (e.category || 'other').charAt(0).toUpperCase() + (e.category || 'other').slice(1))} · {e.source === 'ai' ? t('feedback.sourceAi') : t('feedback.sourceUser')}
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] text-[#8E8E93]">
                      {e.synced
                        ? <span className="text-[#34C759]" title="An Entwickler gesendet">✓</span>
                        : <span className="text-[#FF9500]" title="Noch nicht gesendet">⏳</span>}
                      {new Date(e.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-[14px] whitespace-pre-wrap">{e.text}</div>
                  {Array.isArray(e.attachments) && e.attachments.length > 0 && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-[12px] text-[#8E8E93]">
                      <Paperclip size={12} />
                      <span>{e.attachments.length} · {e.attachments.map(a => a.name).join(', ')}</span>
                    </div>
                  )}
                </div>
              ))}
            </IOSList>
          ) : (
            <p className="text-[13px] text-[#8E8E93] text-center px-2">{t('feedback.empty')}</p>
          )}

          {/* Fallback-Mailversand nur bei nicht-synchronisierten Einträgen
              (z. B. wenn der Cloud-Push wegen Offline-State fehlgeschlagen ist).
              Plus Löschen-Button für lokale History. */}
          {list.length > 0 && (
            <IOSList>
              {list.some(e => !e.synced) && (
                <IOSListRow
                  onClick={sendByMail}
                  trailing={<Mail size={18} className="text-[#007AFF]" />}>
                  <span className="flex flex-col">
                    <span className="text-[15px] text-[#007AFF] font-medium">Nicht gesendete als Mail schicken</span>
                    <span className="text-[12px] text-[#8E8E93]">Fallback falls Online-Versand fehlschlug</span>
                  </span>
                </IOSListRow>
              )}
              <IOSListRow
                onClick={clearAll}
                trailing={<Trash2 size={18} className="text-[#FF3B30]" />}>
                <span className="text-[15px] text-[#FF3B30] font-medium">Lokale History löschen</span>
              </IOSListRow>
            </IOSList>
          )}

          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}


// =============================================================
// BACKUP-EINSTELLUNGEN (komplettes App-Backup)
// =============================================================
function BackupSettings({ data, setData }) {
  const exportAll = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'artcyc-coach-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importAll = async (file) => {
    if (!file) return;
    if (!confirm('Aktuelle App-Daten durch Backup ersetzen?\n\nAlle bestehenden Daten werden überschrieben!')) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!parsed || !parsed.exercises || !parsed.sessions) {
        throw new Error('Ungültiges Backup-Format');
      }
      setData(parsed);
      alert('Backup erfolgreich importiert.');
    } catch (err) {
      alert('Fehler: ' + (err.message || 'Backup konnte nicht geladen werden'));
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5 space-y-3">
      <h2 className="font-semibold flex items-center gap-2"><Archive size={16} /> App-Backup</h2>
      <p className="text-sm text-slate-500">
        Komplettes Backup aller Daten (Übungen, Sessions, Wettkämpfe, Sportler, Programme, UCI-DB) als JSON.
      </p>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={exportAll}
          className="bg-white border border-slate-300 hover:bg-slate-50 px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 justify-center">
          <Download size={14} /> Backup speichern
        </button>
        <label className="bg-white border border-slate-300 hover:bg-slate-50 px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 justify-center cursor-pointer">
          <FileText size={14} /> Backup laden
          <input type="file" accept="application/json"
            onChange={e => importAll(e.target.files && e.target.files[0])}
            className="hidden" />
        </label>
      </div>
    </div>
  );
}

// =============================================================
// COMING SOON (Platzhalter für noch nicht gebaute Bereiche)
// =============================================================
function ComingSoon({ viewId }) {
  const titles = {
    wettkampf: 'Wettkampf', programme: 'Programme', sportler: 'Sportler',
    export: 'Export', kuer: 'Kür-Planung', video: 'Video-Analyse'
  };
  const descs = {
    wettkampf: 'Wertungsbögen mit beiden Kampfgerichten erfassen, Endergebnis berechnen.',
    programme: 'Übungsfolgen für Wettkämpfe definieren — frei oder aus UCI-Liste.',
    sportler: 'Sportler verwalten und per Code einladen.',
    export: 'Daten als CSV oder Excel im Maute-Format exportieren.',
    kuer: 'Ablaufpläne mit Musik-Timing und Schwierigkeits-Optimierung.',
    video: 'Trainings-Videos hochladen, Notizen direkt zum Zeitstempel.'
  };
  const stages = {
    wettkampf: 'Stufe 5', programme: 'Stufe 5', sportler: 'Stufe 6',
    export: 'Stufe 7', kuer: 'später', video: 'später'
  };
  return (
    <div className="space-y-5">
      <header>
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-0.5 rounded-full">Coming soon</span>
          <span className="bg-slate-100 text-slate-700 text-xs font-medium px-2 py-0.5 rounded-full">{stages[viewId]}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{titles[viewId]}</h1>
      </header>
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-8 text-center">
        <Lock size={32} className="mx-auto text-slate-300 mb-3" />
        <p className="text-slate-600 max-w-md mx-auto">{descs[viewId]}</p>
      </div>
    </div>
  );
}

// =============================================================
// ÜBUNGS-DETAIL — Statistik-Ansicht (Training + Wettkampf)
// =============================================================
// =============================================================
// MAUTE-Spezial-Statistik (3-Kategorie-Visualisierung)
// =============================================================
function MauteStatsPanel({ exercise, sessions }) {
  const [period, setPeriod] = useState('total'); // 'total' | '4w'

  const exSessions = useMemo(() => {
    return (sessions || [])
      .filter(s => s.exerciseId === exercise.id)
      .map(s => {
        const e = s.entries || [];
        return {
          date: s.date,
          success: e.filter(x => x === 'success').length,
          third: e.filter(x => x === 'third').length,
          fail: e.filter(x => x === 'fail').length,
          total: e.length
        };
      })
      .filter(s => s.total > 0)
      .sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  }, [exercise.id, sessions]);

  if (exSessions.length === 0) return null;

  // Aggregat pro Monat
  const byMonth = new Map();
  for (const s of exSessions) {
    const m = (s.date || '').slice(0, 7);
    if (!m) continue;
    const cur = byMonth.get(m) || { month: m, success: 0, third: 0, fail: 0, total: 0, sessions: 0 };
    cur.success += s.success; cur.third += s.third; cur.fail += s.fail; cur.total += s.total; cur.sessions += 1;
    byMonth.set(m, cur);
  }
  const months = Array.from(byMonth.values()).sort((a, b) => a.month.localeCompare(b.month));

  // Gesamt-Aggregat
  const total = exSessions.reduce((acc, s) => ({
    success: acc.success + s.success,
    third: acc.third + s.third,
    fail: acc.fail + s.fail,
    total: acc.total + s.total
  }), { success: 0, third: 0, fail: 0, total: 0 });

  // 4-Wochen-Fenster für Trend-Vergleich
  const today = new Date();
  const cutoff4w = new Date(today.getTime() - 28 * 24 * 3600 * 1000).toISOString().slice(0, 10);
  const window4w = exSessions.filter(s => s.date >= cutoff4w).reduce((acc, s) => ({
    success: acc.success + s.success,
    third: acc.third + s.third,
    fail: acc.fail + s.fail,
    total: acc.total + s.total
  }), { success: 0, third: 0, fail: 0, total: 0 });

  // Aktive Auswahl
  const view = period === '4w' ? window4w : total;
  const viewLabel = period === '4w' ? 'Letzte 4 Wochen' : 'Gesamt';
  const otherLabel = period === '4w' ? 'Gesamt' : 'Letzte 4 Wochen';
  const otherView = period === '4w' ? total : window4w;
  const pct = (n, base) => (base || total.total) ? Math.round((n / (base || total.total)) * 100) : 0;
  const gefPctView = view.total > 0 ? Math.round((view.fail / view.total) * 1000) / 10 : 0;
  const gefPctOther = otherView.total > 0 ? Math.round((otherView.fail / otherView.total) * 1000) / 10 : null;
  const trendDelta = gefPctOther !== null ? Math.round((gefPctView - gefPctOther) * 10) / 10 : null;

  // SVG-Maße für Trend-Linie
  const TW = 320, TH = 120, TP = 12;
  const trendPoints = months.map((m, i) => {
    const x = months.length === 1 ? TW / 2 : TP + (i / (months.length - 1)) * (TW - 2 * TP);
    const successRate = m.total > 0 ? m.success / m.total : 0;
    const failRate = m.total > 0 ? m.fail / m.total : 0;
    const ySuccess = TH - TP - successRate * (TH - 2 * TP);
    const yFail = TH - TP - failRate * (TH - 2 * TP);
    return { x, ySuccess, yFail, successRate, failRate, month: m.month };
  });
  const successPath = trendPoints.map((p, i) => (i === 0 ? 'M' : 'L') + p.x.toFixed(1) + ',' + p.ySuccess.toFixed(1)).join(' ');
  const failPath = trendPoints.map((p, i) => (i === 0 ? 'M' : 'L') + p.x.toFixed(1) + ',' + p.yFail.toFixed(1)).join(' ');
  const successAreaPath = trendPoints.length > 0
    ? successPath + ' L' + trendPoints[trendPoints.length - 1].x.toFixed(1) + ',' + (TH - TP).toFixed(1) + ' L' + trendPoints[0].x.toFixed(1) + ',' + (TH - TP).toFixed(1) + ' Z'
    : '';

  // Stacked-Bars pro Monat
  const BW = 320, BH = 110, BP = 10;
  const barWidth = months.length > 0 ? (BW - 2 * BP) / months.length : 0;
  const maxJumpsPerMonth = Math.max(1, ...months.map(m => m.total));

  const trendArrow = trendDelta === null ? '' : (trendDelta < -0.05 ? '↓' : trendDelta > 0.05 ? '↑' : '·');
  const trendColor = trendDelta === null ? 'text-[#8E8E93]'
    : (trendDelta < -0.05 ? 'text-[#34C759]'
      : trendDelta > 0.05 ? 'text-[#FF3B30]'
        : 'text-[#8E8E93]');

  return (
    <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl border border-slate-200/60 dark:border-white/10 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="font-semibold flex items-center gap-2 text-[#000] dark:text-white">
          <Target size={18} className="text-[#FF9500]" /> Sprung-Statistik
        </h2>
        <span className="text-xs text-[#8E8E93]">{exSessions.length} Sessions · seit {exSessions[0].date}</span>
      </div>

      {/* iOS-Segmented-Control: Zeitraum-Switch */}
      <div className="bg-[#E5E5EA] dark:bg-white/10 rounded-2xl p-1 flex gap-1">
        <button onClick={() => setPeriod('total')}
          className={'flex-1 px-3 py-1.5 rounded-xl text-[13px] font-medium transition ' +
            (period === 'total' ? 'bg-white dark:bg-[#2c2c2e] shadow-sm text-[#000] dark:text-white' : 'text-[#3C3C43] dark:text-[#EBEBF5] active:opacity-60')}>
          Gesamt
        </button>
        <button onClick={() => setPeriod('4w')}
          className={'flex-1 px-3 py-1.5 rounded-xl text-[13px] font-medium transition ' +
            (period === '4w' ? 'bg-white dark:bg-[#2c2c2e] shadow-sm text-[#000] dark:text-white' : 'text-[#3C3C43] dark:text-[#EBEBF5] active:opacity-60')}>
          Letzte 4 Wochen
        </button>
      </div>

      {/* Headline: Gefahren-Quote — wichtigste Kennzahl */}
      <div className="bg-[#FFE5E5] dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2 gap-2">
          <div className="flex items-center gap-1.5">
            <AlertTriangle size={14} className="text-rose-600 dark:text-rose-400" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-300">Gefahren-Quote · {viewLabel}</span>
          </div>
          {trendDelta !== null && view.total > 0 && (
            <span className={'text-[11px] font-semibold ' + trendColor}>
              {trendArrow} {Math.abs(trendDelta).toFixed(1)}% vs. {otherLabel}
            </span>
          )}
        </div>
        {view.total > 0 ? (
          <div className="flex items-baseline gap-2">
            <div className="text-5xl font-bold text-rose-600 dark:text-rose-300 leading-none">{gefPctView.toFixed(1)}<span className="text-2xl">%</span></div>
            <div className="text-xs text-rose-700/80 dark:text-rose-300/80">
              <div className="font-medium">{view.fail} von {view.total}</div>
              <div className="opacity-75">Trainer am Seil</div>
            </div>
          </div>
        ) : (
          <div className="text-[14px] text-rose-700/70 dark:text-rose-300/70">Keine Daten in diesem Zeitraum.</div>
        )}
      </div>

      {/* 3-Box-Aufteilung — passend zum gewählten Zeitraum */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-xl py-2.5 px-1">
          <div className="text-emerald-700 dark:text-emerald-400 font-bold text-2xl">{pct(view.success, view.total)}%</div>
          <div className="text-[#3C3C43] dark:text-[#EBEBF5]">{statusLabel(exercise, 'success')}</div>
          <div className="text-[10px] text-[#8E8E93] mt-0.5">{view.success}× absolut</div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-950/40 rounded-xl py-2.5 px-1">
          <div className="text-amber-700 dark:text-amber-400 font-bold text-2xl">{pct(view.third, view.total)}%</div>
          <div className="text-[#3C3C43] dark:text-[#EBEBF5]">{statusLabel(exercise, 'third')}</div>
          <div className="text-[10px] text-[#8E8E93] mt-0.5">{view.third}× absolut</div>
        </div>
        <div className="bg-rose-50 dark:bg-rose-950/40 rounded-xl py-2.5 px-1">
          <div className="text-rose-700 dark:text-rose-400 font-bold text-2xl">{pct(view.fail, view.total)}%</div>
          <div className="text-[#3C3C43] dark:text-[#EBEBF5]">{statusLabel(exercise, 'fail')}</div>
          <div className="text-[10px] text-[#8E8E93] mt-0.5">{view.fail}× absolut</div>
        </div>
      </div>

      {/* Trend pro Monat — zwei Linien: Geklappt-% (grün) + Gefahren-% (rot) */}
      {months.length >= 2 && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="text-[10px] uppercase tracking-wide text-slate-500 font-medium">
              Verlauf pro Monat
            </div>
            <div className="flex items-center gap-3 text-[10px] text-slate-500">
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-emerald-500" />Geklappt</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-rose-500" />Gefahren</span>
            </div>
          </div>
          <svg viewBox={'0 0 ' + TW + ' ' + TH} className="w-full" preserveAspectRatio="none">
            {/* Achsen */}
            {[0, 0.25, 0.5, 0.75, 1].map(r => (
              <line key={r} x1={TP} y1={TH - TP - r * (TH - 2 * TP)} x2={TW - TP} y2={TH - TP - r * (TH - 2 * TP)}
                stroke="#E5E5EA" strokeWidth="1" strokeDasharray={r === 0 || r === 1 ? '' : '2 3'} />
            ))}
            <path d={successAreaPath} fill="rgba(16, 185, 129, 0.10)" />
            <path d={successPath} fill="none" stroke="#10B981" strokeWidth="2" />
            <path d={failPath} fill="none" stroke="#F43F5E" strokeWidth="2" />
            {trendPoints.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.ySuccess} r="2.2" fill="#10B981" />
                <circle cx={p.x} cy={p.yFail} r="2.2" fill="#F43F5E" />
              </g>
            ))}
            {/* Y-Beschriftung */}
            <text x={TP - 2} y={TP + 4} fontSize="9" fill="#8E8E93" textAnchor="end">100%</text>
            <text x={TP - 2} y={TH / 2 + 3} fontSize="9" fill="#8E8E93" textAnchor="end">50%</text>
            <text x={TP - 2} y={TH - TP + 4} fontSize="9" fill="#8E8E93" textAnchor="end">0%</text>
          </svg>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-3">
            <span>{months[0].month}</span>
            <span>{months[months.length - 1].month}</span>
          </div>
        </div>
      )}

      {/* Stacked-Bars pro Monat: Anteile geklappt / dritter / fail */}
      <div>
        <div className="text-[10px] uppercase tracking-wide text-slate-500 font-medium mb-1">
          Verteilung pro Monat (relativ)
        </div>
        <svg viewBox={'0 0 ' + BW + ' ' + BH} className="w-full" preserveAspectRatio="none">
          {months.map((m, i) => {
            const x = BP + i * barWidth;
            const w = Math.max(1, barWidth - 1);
            const sH = (m.success / m.total) * (BH - 2 * BP);
            const tH = (m.third / m.total) * (BH - 2 * BP);
            const fH = (m.fail / m.total) * (BH - 2 * BP);
            const yStart = BP;
            return (
              <g key={i}>
                <rect x={x} y={yStart} width={w} height={sH} fill="#10B981" />
                <rect x={x} y={yStart + sH} width={w} height={tH} fill="#F59E0B" />
                <rect x={x} y={yStart + sH + tH} width={w} height={fH} fill="#F43F5E" />
                {/* Aktivitäts-Indikator: Größe = total Anzahl Sprünge in dem Monat */}
                <rect x={x} y={BH - BP + 2} width={w} height={Math.max(1, 4 * (m.total / maxJumpsPerMonth))} fill="#94A3B8" opacity="0.6" />
              </g>
            );
          })}
        </svg>
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-3">
          <span>{months[0].month}</span>
          <span>{months[months.length - 1].month}</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-2 flex-wrap">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />{statusLabel(exercise, 'success')}</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />{statusLabel(exercise, 'third')}</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />{statusLabel(exercise, 'fail')}</span>
          <span className="flex items-center gap-1 ml-auto"><span className="w-2.5 h-2.5 rounded-sm bg-slate-400 opacity-60" />Aktivität</span>
        </div>
      </div>
    </div>
  );
}

function ExerciseDetail({ exercise, data, setData, onBack, onEdit, onArchive, onDelete }) {
  const { t } = useI18n();
  const [importStatus, setImportStatus] = useState(null); // null | 'parsing' | 'preview' | 'error'
  const [importPreview, setImportPreview] = useState(null);
  const [importMsg, setImportMsg] = useState('');
  // Rope-Filter: null = alle, true = mit Seil, false = ohne Seil
  const [ropeFilter, setRopeFilter] = useState(null);

  const trainStats = calcExerciseTrainingStats(exercise, data.sessions || [], ropeFilter);
  // Übersichts-Stats für die Filter-Tabs (Counts pro Variante)
  const ropeStats = exercise.has_rope_variant ? {
    withRope: calcExerciseTrainingStats(exercise, data.sessions || [], true),
    withoutRope: calcExerciseTrainingStats(exercise, data.sessions || [], false)
  } : null;
  const compStats = calcExerciseCompetitionStats(exercise, data.programs || [], data.competitions || []);

  // Liste aller Wettkämpfe mit dieser Übung
  const compList = (() => {
    const programMap = new Map((data.programs || []).map(p => [p.id, p]));
    const matches = (ex) => {
      if (exercise.uci_code && ex.code) return exercise.uci_code === ex.code;
      return (ex.name || '').trim().toLowerCase() === (exercise.name || '').trim().toLowerCase()
        && Number(ex.points || 0) === Number(exercise.points || 0);
    };
    const result = [];
    for (const comp of data.competitions || []) {
      const program = programMap.get(comp.program_id);
      if (!program || !program.exercises) continue;
      program.exercises.forEach((ex, idx) => {
        if (!matches(ex)) return;
        const e1 = (comp.table1 || [])[idx] || {};
        const e2 = (comp.table2 || [])[idx] || {};
        result.push({
          competition: comp,
          exPoints: Number(ex.points || 0),
          k1cross: Number(e1.cross || 0), k1wave: Number(e1.wave || 0), k1bar: Number(e1.bar || 0), k1circle: Number(e1.circle || 0),
          k2cross: Number(e2.cross || 0), k2wave: Number(e2.wave || 0), k2bar: Number(e2.bar || 0), k2circle: Number(e2.circle || 0),
          k1schwPct: Number(e1.schwPct || 0), k2schwPct: Number(e2.schwPct || 0),
          k1takt: Number(e1.taktischePunkte || 0), k2takt: Number(e2.taktischePunkte || 0)
        });
      });
    }
    result.sort((a, b) => (b.competition.date || '').localeCompare(a.competition.date || ''));
    return result;
  })();

  // Sessions-Liste mit Datum + Quote
  const sessionList = (() => {
    let exSessions = (data.sessions || []).filter(s => s.exerciseId === exercise.id);
    if (ropeFilter !== null) {
      exSessions = exSessions.filter(s => s.withRope === ropeFilter);
    }
    exSessions = exSessions.slice();
    exSessions.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    return exSessions.map(s => {
      const total = (s.entries || []).length;
      const success = (s.entries || []).filter(e => e === 'success').length;
      const fail = (s.entries || []).filter(e => e === 'fail').length;
      const third = (s.entries || []).filter(e => e === 'third').length;
      return {
        session: s, total, success, fail, third,
        rate: total > 0 ? Math.round((success / total) * 100) : 0
      };
    });
  })();

  return (
    <div className="min-h-screen bg-[#F2F2F7] p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-4">
        <header className="flex items-start gap-2 pt-2">
          <button onClick={onBack} className="p-2 -ml-2 text-amber-500 active:opacity-50 shrink-0 mt-0.5">
            <ChevronLeft size={28} strokeWidth={2.6} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[28px] font-bold tracking-tight leading-tight">{localizedExerciseName(exercise)}</h1>
            <div className="flex items-center gap-2 flex-wrap mt-1.5">
              {exercise.uci_code && (
                <span className="bg-sky-100 text-sky-700 text-xs font-medium px-2 py-0.5 rounded-full">
                  UCI {exercise.uci_code} · {exercise.uci_disc}
                </span>
              )}
              {Number(exercise.points) > 0 && (
                <span className="text-xs text-slate-600 font-medium">{Number(exercise.points).toFixed(1)} Pkt</span>
              )}
              {exercise.category_mode === 3 && (
                <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  3-Status: {exercise.third_label}
                </span>
              )}
              {!exercise.active && (
                <span className="bg-slate-100 text-slate-700 text-xs font-medium px-2 py-0.5 rounded-full">archiviert</span>
              )}
            </div>
          </div>
        </header>

        {/* Top-Stats: 2x2 farbige StatCards für Erfolgsquote, Sessions, Versuche, Wettkämpfe */}
        {trainStats.total > 0 && (
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={Target}
              label={t('detail.successRate')}
              value={trainStats.rate + '%'}
              sub={trainStats.success + ' / ' + trainStats.total}
              color={trainStats.rate >= 80 ? 'emerald' : trainStats.rate >= 60 ? 'amber' : 'rose'}
            />
            <StatCard
              icon={Dumbbell}
              label={t('detail.sessions')}
              value={trainStats.sessions}
              sub={t('detail.attempts') + ': ' + trainStats.total}
              color="violet"
            />
            {compList.length > 0 && (
              <StatCard
                icon={Trophy}
                label={t('detail.competitions')}
                value={compList.length}
                sub={compList[0]?.competition?.date ? formatDateShort(compList[0].competition.date) : t('detail.noData')}
                color="orange"
              />
            )}
            {sessionList.length > 0 && (
              <StatCard
                icon={Calendar}
                label={t('detail.lastTrained')}
                value={formatDateShort(sessionList[0].session.date)}
                sub={sessionList[0].rate + '% · ' + sessionList[0].success + '/' + sessionList[0].total}
                color="sky"
              />
            )}
          </div>
        )}

        {/* KI-Insight — regel-basierter Trainer-Tipp (1 Zeile bei wenig Daten, ausführlich ab ≥ 30 Versuchen) */}
        {(() => {
          const insight = generateExerciseInsight(exercise, data.sessions || [], t, data.programs || [], data.competitions || []);
          if (!insight || !insight.lines || insight.lines.length === 0) return null;
          return (
            <div className="bg-gradient-to-br from-[#FF9500]/10 to-[#FF6D00]/10 rounded-2xl p-4 flex gap-3 items-start">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF9500] to-[#FF6D00] flex items-center justify-center shrink-0">
                <Sparkles size={18} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] uppercase tracking-wide text-[#FF9500] font-semibold mb-1.5">
                  {t('aiInsight.title')}
                </div>
                {insight.rich ? (
                  <ul className="text-[14px] leading-snug space-y-1.5 list-disc pl-4 marker:text-[#FF9500]">
                    {insight.lines.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-[14px] leading-snug space-y-1">
                    {insight.lines.map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Training-Statistik */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2">
              <Dumbbell size={18} className="text-amber-500" /> {t('nav.training')}
            </h2>
            {trainStats.total > 0 && (
              <span className="text-xs text-slate-500">{trainStats.sessions} Sess. · {trainStats.total} Serien</span>
            )}
          </div>

          {/* Rope-Filter-Tabs (nur wenn Übung Seil-Variante hat) */}
          {ropeStats && (
            <div className="flex gap-1 p-1 bg-slate-100 rounded-full text-xs font-medium">
              <button onClick={() => setRopeFilter(null)}
                className={'flex-1 py-1.5 rounded-full transition ' +
                  (ropeFilter === null ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500')}>
                {t('training.range.all')}
                <span className="ml-1 opacity-60">{ropeStats.withRope.sessions + ropeStats.withoutRope.sessions}</span>
              </button>
              <button onClick={() => setRopeFilter(true)}
                className={'flex-1 py-1.5 rounded-full transition ' +
                  (ropeFilter === true ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500')}>
                {t('log.withRope')}
                <span className="ml-1 opacity-60">{ropeStats.withRope.sessions}</span>
              </button>
              <button onClick={() => setRopeFilter(false)}
                className={'flex-1 py-1.5 rounded-full transition ' +
                  (ropeFilter === false ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500')}>
                Ohne Seil
                <span className="ml-1 opacity-60">{ropeStats.withoutRope.sessions}</span>
              </button>
            </div>
          )}
          {trainStats.total > 0 ? (
            <>
              <div className="flex items-baseline gap-3">
                <div className={'text-4xl font-bold ' + (trainStats.rate >= 80 ? 'text-emerald-600' : trainStats.rate >= 60 ? 'text-amber-600' : 'text-rose-600')}>
                  {trainStats.rate}%
                </div>
                <div className="text-sm text-slate-600">{statusLabel(exercise, 'success').toLowerCase()} insgesamt</div>
              </div>
              <div className={'grid gap-2 text-center text-xs ' + (exercise.category_mode === 3 ? 'grid-cols-3' : 'grid-cols-2')}>
                <div className="bg-emerald-50 rounded-lg py-2">
                  <div className="text-emerald-700 font-bold text-base">{trainStats.success}</div>
                  <div className="text-slate-600">{statusLabel(exercise, 'success')}</div>
                </div>
                {exercise.category_mode === 3 && (
                  <div className="bg-amber-50 rounded-lg py-2">
                    <div className="text-amber-700 font-bold text-base">{trainStats.third}</div>
                    <div className="text-slate-600">{statusLabel(exercise, 'third')}</div>
                  </div>
                )}
                <div className="bg-rose-50 rounded-lg py-2">
                  <div className="text-rose-700 font-bold text-base">{trainStats.fail}</div>
                  <div className="text-slate-600">{statusLabel(exercise, 'fail')}</div>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100">
                <div className="text-[10px] uppercase tracking-wide text-slate-500 font-medium mb-2">Letzte Sessions</div>
                <div className="space-y-1.5">
                  {sessionList.slice(0, 10).map((s, i) => (
                    <div key={i} className="py-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-slate-700 shrink-0">{s.session.date}</span>
                          {exercise.has_rope_variant && s.session.withRope === true && (
                            <span className="text-[10px] font-medium text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full shrink-0">Seil</span>
                          )}
                          {exercise.has_rope_variant && s.session.withRope === false && (
                            <span className="text-[10px] font-medium text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded-full shrink-0">ohne</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-500">{s.success}/{s.total}</span>
                          <span className={'text-sm font-bold w-10 text-right ' + (s.rate >= 80 ? 'text-emerald-600' : s.rate >= 60 ? 'text-amber-600' : 'text-rose-600')}>
                            {s.rate}%
                          </span>
                        </div>
                      </div>
                      {s.session.notes && (
                        <div className="text-xs text-slate-500 italic mt-0.5 pl-1 border-l-2 border-amber-200 pl-2">
                          {s.session.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {sessionList.length > 10 && (
                  <div className="text-xs text-slate-400 mt-2">+{sessionList.length - 10} ältere Sessions</div>
                )}
              </div>
            </>
          ) : (
            <div className="text-sm text-slate-400 italic">Noch keine Trainingsdaten erfasst.</div>
          )}
        </div>

        {/* Wettkampf-Statistik */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2">
              <Trophy size={18} className="text-amber-500" /> Wettkampf
            </h2>
            {compStats.wettkaempfe > 0 && (
              <span className="text-xs text-slate-500">{compStats.wettkaempfe}× absolviert</span>
            )}
          </div>
          {compStats.wettkaempfe > 0 ? (
            <>
              {/* Symbol-Verteilung — Ø pro Wettkampf, kompakt mit dezenten
                  Farben (Dashboard-Stil, dark-mode-fest) */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-slate-100 dark:bg-slate-900/50 rounded-xl py-2.5">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-bold leading-none">x</div>
                  <div className="font-bold text-[17px] text-slate-900 dark:text-slate-100 leading-tight mt-1 tabular-nums">Ø {(compStats.cross / compStats.wettkaempfe).toFixed(1)}</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">{compStats.cross} ges.</div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-900/50 rounded-xl py-2.5">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-bold leading-none">~</div>
                  <div className="font-bold text-[17px] text-slate-900 dark:text-slate-100 leading-tight mt-1 tabular-nums">Ø {(compStats.wave / compStats.wettkaempfe).toFixed(1)}</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">{compStats.wave} ges.</div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-900/50 rounded-xl py-2.5">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-bold leading-none">|</div>
                  <div className="font-bold text-[17px] text-slate-900 dark:text-slate-100 leading-tight mt-1 tabular-nums">Ø {(compStats.bar / compStats.wettkaempfe).toFixed(1)}</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">{compStats.bar} ges.</div>
                </div>
                <div className="bg-rose-50 dark:bg-rose-950/30 rounded-xl py-2.5 border border-rose-100 dark:border-rose-900/40">
                  <div className="text-[11px] text-rose-600 dark:text-rose-400 font-bold leading-none">○</div>
                  <div className="font-bold text-[17px] text-rose-700 dark:text-rose-300 leading-tight mt-1 tabular-nums">Ø {(compStats.circle / compStats.wettkaempfe).toFixed(1)}</div>
                  <div className="text-[10px] text-rose-400 dark:text-rose-500 leading-tight">{compStats.circle} ges.</div>
                </div>
              </div>

              {/* Ø Punktabzug pro Wettkampf — inklusive Schwierigkeits-Effekt
                  (Punkte × Σ%/100). Im Dashboard-Stil mit dark-mode. */}
              {(() => {
                const dedSymbols = compStats.cross * 0.2 + compStats.wave * 0.5 + compStats.bar * 1.0 + compStats.circle * 2.0;
                const dedSchw    = (Number(exercise.points || 0) * compStats.schwPctSum) / 100;
                const totalDed = dedSymbols + dedSchw;
                const avgDed = compStats.count > 0 ? totalDed / compStats.count : 0;
                return (
                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 rounded-2xl py-3 px-4 flex items-baseline justify-between">
                    <div>
                      <div className="text-[12px] text-amber-900 dark:text-amber-200 font-medium">Ø Punktabzug pro Wettkampf</div>
                      {dedSchw > 0 && (
                        <div className="text-[10px] text-amber-700/70 dark:text-amber-400/70">inkl. Schwierigkeits-Abwertung</div>
                      )}
                    </div>
                    <div className="font-bold text-[22px] text-amber-700 dark:text-amber-300 tabular-nums">−{avgDed.toFixed(2)}</div>
                  </div>
                );
              })()}

              {/* Schwierigkeits-Abwertung — Histogramm pro %-Stufe, sortiert
                  absteigend. Zeigt sofort, wie oft welche Stufe gefallen ist. */}
              {compStats.schwPctNonZero > 0 && (() => {
                const entries = Object.entries(compStats.schwPctHist)
                  .map(([pct, n]) => ({ pct: Number(pct), n }))
                  .sort((a, b) => b.pct - a.pct);
                const maxN = Math.max(...entries.map(e => e.n));
                const sharePct = Math.round((compStats.schwPctNonZero / compStats.count) * 100);
                return (
                  <div className="bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/40 rounded-2xl py-3 px-4 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <div className="text-[12px] text-violet-900 dark:text-violet-200 font-medium">Schwierigkeits-Abwertung</div>
                      <div className="text-[10px] text-violet-700/70 dark:text-violet-400/70">in {sharePct}% der Stellungen</div>
                    </div>
                    <div className="space-y-1">
                      {entries.map(({ pct, n }) => (
                        <div key={pct} className="flex items-center gap-2 text-[12px]">
                          <span className="text-violet-900 dark:text-violet-200 font-medium tabular-nums w-12 shrink-0">−{pct}%</span>
                          <div className="flex-1 bg-violet-100 dark:bg-violet-900/40 rounded-full h-2 overflow-hidden">
                            <div className="h-full bg-violet-500 dark:bg-violet-400 rounded-full"
                              style={{ width: ((n / maxN) * 100) + '%' }} />
                          </div>
                          <span className="text-violet-900 dark:text-violet-200 tabular-nums w-8 text-right shrink-0">{n}×</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Taktische Aufwertung — Original-Punkte zum Vergleich, plus
                  Häufigkeit pro taktisch gewertetem Wert (z.B. 3,7 Pkt × 2). */}
              {compStats.taktCount > 0 && (() => {
                const entries = Object.entries(compStats.taktHist)
                  .map(([pts, n]) => ({ pts: Number(pts), n }))
                  .sort((a, b) => b.pts - a.pts);
                const maxN = Math.max(...entries.map(e => e.n));
                const sharePct = Math.round((compStats.taktCount / compStats.count) * 100);
                const origPts = Number(exercise.points || 0);
                return (
                  <div className="bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40 rounded-2xl py-3 px-4 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <div className="text-[12px] text-sky-900 dark:text-sky-200 font-medium">Taktische Aufwertung</div>
                        {origPts > 0 && (
                          <div className="text-[10px] text-sky-700/70 dark:text-sky-400/70">Original {origPts.toFixed(1)} Pkt</div>
                        )}
                      </div>
                      <div className="text-[10px] text-sky-700/70 dark:text-sky-400/70">in {sharePct}% der Stellungen</div>
                    </div>
                    <div className="space-y-1">
                      {entries.map(({ pts, n }) => (
                        <div key={pts} className="flex items-center gap-2 text-[12px]">
                          <span className="text-sky-900 dark:text-sky-200 font-medium tabular-nums w-14 shrink-0">{pts.toFixed(1)} Pkt</span>
                          <div className="flex-1 bg-sky-100 dark:bg-sky-900/40 rounded-full h-2 overflow-hidden">
                            <div className="h-full bg-sky-500 dark:bg-sky-400 rounded-full"
                              style={{ width: ((n / maxN) * 100) + '%' }} />
                          </div>
                          <span className="text-sky-900 dark:text-sky-200 tabular-nums w-8 text-right shrink-0">{n}×</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
              <div className="pt-3 border-t border-slate-100">
                <div className="text-[10px] uppercase tracking-wide text-slate-500 font-medium mb-2">Pro Wettkampf</div>
                <div className="space-y-2">
                  {compList.map((c, i) => {
                    const xSum = c.k1cross + c.k2cross;
                    const wSum = c.k1wave + c.k2wave;
                    const bSum = c.k1bar + c.k2bar;
                    const cSum = c.k1circle + c.k2circle;
                    const totalSymbols = xSum + wSum + bSum + cSum;
                    // Schw% und Taktik aggregiert über beide KGs: max statt sum,
                    // weil in beiden KGs derselbe %-Wert üblich ist (eine Stellung
                    // ist taktisch oder nicht — die zwei KG bewerten denselben Ablauf).
                    const schwPct = Math.max(c.k1schwPct, c.k2schwPct);
                    const taktPts = Math.max(c.k1takt, c.k2takt);
                    const hasMod = schwPct > 0 || taktPts > 0;
                    return (
                      <div key={i} className="flex items-start justify-between gap-2 text-sm py-1">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{c.competition.name}</div>
                          <div className="text-xs text-slate-500">{c.competition.date}</div>
                        </div>
                        <div className="flex flex-wrap gap-1 text-xs justify-end shrink-0 max-w-[55%]">
                          {totalSymbols === 0 && !hasMod ? (
                            <span className="text-emerald-700 font-medium">✓ sauber</span>
                          ) : (
                            <>
                              {xSum > 0 && <span className="bg-slate-100 px-1.5 py-0.5 rounded"><strong>x</strong>×{xSum}</span>}
                              {wSum > 0 && <span className="bg-slate-100 px-1.5 py-0.5 rounded"><strong>~</strong>×{wSum}</span>}
                              {bSum > 0 && <span className="bg-slate-100 px-1.5 py-0.5 rounded"><strong>|</strong>×{bSum}</span>}
                              {cSum > 0 && <span className="bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded"><strong>○</strong>×{cSum}</span>}
                              {schwPct > 0 && <span className="bg-violet-100 text-violet-800 px-1.5 py-0.5 rounded">Schw −{schwPct}%</span>}
                              {taktPts > 0 && <span className="bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded">Takt {taktPts.toFixed(1)}</span>}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="text-sm text-slate-400 italic">Noch keine Wettkampfdaten erfasst.</div>
          )}
        </div>

        {/* Maute-Spezial-Statistik bei 3-Status-Übungen */}
        {exercise.category_mode === 3 && (
          <MauteStatsPanel exercise={exercise} sessions={data.sessions || []} />
        )}

        {/* XLSX-Import bei 3-Status-Übungen */}
        {exercise.category_mode === 3 && setData && (
          <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-start gap-2">
              <FileSpreadsheet size={18} className="text-violet-700 shrink-0 mt-0.5" />
              <div className="text-sm text-violet-900">
                <strong>Statistik-Daten importieren</strong>
                <p className="text-xs mt-0.5 opacity-90">
                  Maute-Sprung-XLSX (Spalten: Datum, Geklappt, Getroffen, Gefährlich) hochladen.
                </p>
              </div>
            </div>
            {importStatus === 'parsing' && (
              <div className="bg-white rounded-xl p-3 text-sm">⏳ {importMsg}</div>
            )}
            {importStatus === 'error' && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-sm text-rose-900">
                ✗ {importMsg}
              </div>
            )}
            {importStatus === 'preview' && importPreview && (
              <div className="bg-white rounded-xl p-3 space-y-2">
                <div className="text-sm">
                  ✓ <strong>{importPreview.sessions.length} Sessions</strong> erkannt
                  ({importPreview.sessions[0]?.date} – {importPreview.sessions[importPreview.sessions.length - 1]?.date}).
                </div>
                <div className="text-xs text-slate-600">
                  Mapping: <strong>Geklappt</strong>=geklappt,{' '}
                  <strong>Getroffen</strong>={exercise.third_label || 'mittel'},{' '}
                  <strong>Gefährlich</strong>=nicht
                </div>
                <div className="flex gap-2 pt-1 flex-wrap">
                  <button
                    onClick={() => {
                      const existing = (data.sessions || []).filter(s => s.exerciseId !== exercise.id);
                      const newSessions = importPreview.sessions.map((s, idx) => ({
                        id: 'imp_' + exercise.id + '_' + idx + '_' + Date.now(),
                        exerciseId: exercise.id,
                        athleteId: null,
                        date: s.date,
                        entries: s.entries
                      }));
                      setData({ ...data, sessions: [...existing, ...newSessions] });
                      setImportStatus(null);
                      setImportPreview(null);
                    }}
                    className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                    Ersetzen ({importPreview.sessions.length})
                  </button>
                  <button
                    onClick={() => {
                      const newSessions = importPreview.sessions.map((s, idx) => ({
                        id: 'imp_' + exercise.id + '_' + idx + '_' + Date.now(),
                        exerciseId: exercise.id,
                        athleteId: null,
                        date: s.date,
                        entries: s.entries
                      }));
                      setData({ ...data, sessions: [...(data.sessions || []), ...newSessions] });
                      setImportStatus(null);
                      setImportPreview(null);
                    }}
                    className="bg-white border border-slate-300 px-3 py-1.5 rounded-lg text-sm font-medium">
                    Hinzufügen
                  </button>
                  <button
                    onClick={() => { setImportStatus(null); setImportPreview(null); }}
                    className="bg-white border border-slate-300 px-3 py-1.5 rounded-lg text-sm font-medium">
                    Verwerfen
                  </button>
                </div>
              </div>
            )}
            {!importStatus && (
              <label className="bg-white border border-violet-300 hover:bg-violet-50 px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 justify-center cursor-pointer">
                <FileSpreadsheet size={14} /> XLSX-Datei auswählen
                <input
                  type="file"
                  accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={async (e) => {
                    const file = e.target.files && e.target.files[0];
                    if (!file) return;
                    setImportStatus('parsing');
                    setImportMsg('Lese XLSX…');
                    try {
                      const result = await parseMauteXlsx(file);
                      if (result.sessions.length === 0) {
                        setImportStatus('error');
                        setImportMsg('Keine Sessions erkannt — Spalten "Datum/Geklappt/Getroffen/Gefährlich" prüfen.');
                        return;
                      }
                      setImportPreview(result);
                      setImportStatus('preview');
                    } catch (err) {
                      setImportStatus('error');
                      setImportMsg('Fehler: ' + (err.message || 'Datei konnte nicht gelesen werden'));
                    } finally {
                      e.target.value = '';
                    }
                  }}
                  className="hidden" />
              </label>
            )}
          </div>
        )}

        {/* Aktionen */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-3 space-y-2">
          <button onClick={onEdit} className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2">
            <Edit2 size={16} /> Bearbeiten
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={onArchive} className="bg-white border border-slate-300 px-4 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2">
              <Archive size={14} /> {exercise.active ? 'Archivieren' : 'Aktivieren'}
            </button>
            <button onClick={onDelete} className="bg-white border border-rose-200 text-rose-600 px-4 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2">
              <Trash2 size={14} /> Löschen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================
// ÜBUNGEN VERWALTEN
// =============================================================
function UebungenView({ data, setData, onBack }) {
  const { t } = useI18n();
  const [editing, setEditing] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [selected, setSelected] = useState(null); // Übung in Detail-Ansicht
  const [pendingDelete, setPendingDelete] = useState(null);

  // Sortierung wie beim Protokollieren: aktive Übungen zuerst, davon die
  // häufigst-trainierten oben (= „was ich oft anpacke ist sofort sichtbar"),
  // dann untrainierte aktive alphabetisch, archivierte ganz unten.
  const sortedExercises = useMemo(() => {
    const count = new Map();
    for (const s of (data.sessions || [])) {
      if (s.exerciseId) count.set(s.exerciseId, (count.get(s.exerciseId) || 0) + 1);
    }
    const cmp = (a, b) => {
      if (a.active !== b.active) return a.active ? -1 : 1;
      const ca = count.get(a.id) || 0;
      const cb = count.get(b.id) || 0;
      if (ca !== cb) return cb - ca;
      return (a.name || '').localeCompare(b.name || '', 'de');
    };
    return [...(data.exercises || [])].sort(cmp);
  }, [data.exercises, data.sessions]);

  const upsert = (ex) => {
    const exists = data.exercises.find(e => e.id === ex.id);
    setData({
      ...data,
      exercises: exists ? data.exercises.map(e => e.id === ex.id ? ex : e) : [...data.exercises, ex]
    });
  };

  const toggleArchive = (id) => {
    setData({
      ...data,
      exercises: data.exercises.map(e => e.id === id ? { ...e, active: !e.active } : e)
    });
    // Selection auch aktualisieren
    if (selected && selected.id === id) {
      setSelected({ ...selected, active: !selected.active });
    }
  };

  const remove = (id) => {
    setData({ ...data, exercises: data.exercises.filter(e => e.id !== id) });
    setSelected(null);
    setPendingDelete(null);
  };

  if (showNew || editing) {
    return <ExerciseEditor
      exercise={editing}
      onSave={(ex) => {
        upsert(ex);
        setShowNew(false);
        setEditing(null);
        // Wenn aus Detail-Ansicht editiert: Detail mit aktualisierten Daten zeigen
        if (selected && selected.id === ex.id) setSelected(ex);
      }}
      onCancel={() => { setShowNew(false); setEditing(null); }}
    />;
  }

  if (selected) {
    // Hole das aktuelle Objekt aus data (falls geändert wurde)
    const current = data.exercises.find(e => e.id === selected.id) || selected;
    return (
      <>
        <ExerciseDetail
          exercise={current}
          data={data}
          setData={setData}
          onBack={() => setSelected(null)}
          onEdit={() => setEditing(current)}
          onArchive={() => toggleArchive(current.id)}
          onDelete={() => setPendingDelete(current)}
        />
        {pendingDelete && (
          <DeleteConfirmModal
            title="Übung löschen?"
            message={'"' + pendingDelete.name + '" wirklich löschen? Erfasste Sessions bleiben erhalten.'}
            onConfirm={() => remove(pendingDelete.id)}
            onCancel={() => setPendingDelete(null)}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7] p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-1.5 sm:space-y-5">
        <header className="flex items-end justify-between gap-3 pt-2 mb-3 sm:mb-0">
          <div className="min-w-0">
            <h1 className="text-[34px] font-bold tracking-tight leading-none">{t('exercises.title')}</h1>
            <p className="text-[13px] text-[#8E8E93] mt-1">{data.exercises.filter(e => e.active).length} aktiv · {data.exercises.filter(e => !e.active).length} {t('exercises.archived')}</p>
          </div>
          <button onClick={() => setShowNew(true)}
            className="bg-[#FF9500] text-white px-4 py-2 rounded-full font-semibold text-[14px] flex items-center gap-1.5 shadow-[0_2px_8px_rgba(255,149,0,0.25)] active:scale-95 transition">
            <Plus size={16} strokeWidth={2.5} /> {t('common.new')}
          </button>
        </header>

        {/* iOS-style Inset Grouped List
            Layout pro Zeile:
              [Name groß]                           [Code mono + chevron]
              [stats-zeile sekundär — kompakt]
            Trainings-Rate wird als farbige Badge rechts gezeigt, damit
            man auf einen Blick sieht welche Übung sicher sitzt. */}
        <IOSList footer="Tippe auf eine Übung um Statistik (Training + Wettkampf) zu sehen.">
          {sortedExercises.map(ex => {
            const compStats = calcExerciseCompetitionStats(ex, data.programs || [], data.competitions || []);
            // Vollständiger Punktverlust = Symbol-Abzüge + Schwierigkeits-Abwertung.
            // Symbol-Logik (UCI 8.4.027): x=0.2, ~=0.5, |=1.0, ○=2.0.
            // Schw-Effekt pro Stellung: ex.points × schwPct/100. Aufsummiert für
            // alle Stellungen, dann durch count (= 2 × wettkaempfe) geteilt =
            // mittlerer Beitrag aufs Endergebnis. Ohne diesen Anteil würde eine
            // 100%-Schw-Abwertung als 'sauber' erscheinen, obwohl die halbe
            // Übungspunktzahl weggefallen ist.
            const dedSymbols = compStats.cross * 0.2 + compStats.wave * 0.5 + compStats.bar * 1.0 + compStats.circle * 2.0;
            const dedSchw    = (Number(ex.points || 0) * compStats.schwPctSum) / 100;
            const totalDeduction = dedSymbols + dedSchw;
            const avgDeduction = compStats.count > 0 ? totalDeduction / compStats.count : 0;
            const trainStats = calcExerciseTrainingStats(ex, data.sessions || []);
            const rateColor = trainStats.rate >= 80 ? 'text-[#34C759]'
              : trainStats.rate >= 60 ? 'text-[#FF9500]'
              : 'text-[#FF3B30]';
            return (
              <IOSListRow
                key={ex.id}
                onClick={() => setSelected(ex)}
                className={!ex.active ? 'opacity-60' : ''}
                trailing={
                  <div className="flex items-center gap-2 shrink-0">
                    {trainStats.total > 0 && (
                      <span className={'text-[13px] font-semibold tabular-nums ' + rateColor}>{trainStats.rate}%</span>
                    )}
                    <ChevronRight size={18} strokeWidth={2.4} className="text-[#C7C7CC]" />
                  </div>
                }>
                <div className="flex items-center gap-2 min-w-0 flex-wrap">
                  <h3 className="font-medium text-[15px] text-[#000] truncate">{localizedExerciseName(ex)}</h3>
                  {ex.uci_code && <IOSTag color="blue">{ex.uci_code}</IOSTag>}
                  {ex.category_mode === 3 && <IOSTag color="orange">3-Status</IOSTag>}
                  {!ex.active && <IOSTag color="gray">archiviert</IOSTag>}
                </div>
                <div className="text-[13px] text-[#8E8E93] mt-0.5 flex items-center gap-1.5 flex-wrap">
                  {Number(ex.points) > 0 && <span className="font-medium">{Number(ex.points).toFixed(1)} Pkt</span>}
                  {compStats.wettkaempfe > 0 && (
                    <>
                      {Number(ex.points) > 0 && <span>·</span>}
                      <span>{compStats.wettkaempfe}× Wettkampf</span>
                      <span>·</span>
                      {totalDeduction === 0
                        ? <span className="text-[#34C759]">Ø sauber ✓</span>
                        : <span>Ø −{avgDeduction.toFixed(2).replace('.', ',')} Pkt</span>}
                    </>
                  )}
                </div>
              </IOSListRow>
            );
          })}
        </IOSList>
      </div>
    </div>
  );
}

// =============================================================
// ÜBUNGS-EDITOR
// =============================================================
function ExerciseEditor({ exercise, onSave, onCancel }) {
  const [mode, setMode] = useState(exercise && exercise.uci_code ? 'uci' : 'custom');
  const [uciCode, setUciCode] = useState((exercise && exercise.uci_code) || '');
  const [uciDisc, setUciDisc] = useState((exercise && exercise.uci_disc) || '1er');
  const [name, setName] = useState((exercise && exercise.name) || '');
  const [statusMode, setStatusMode] = useState((exercise && exercise.category_mode) || 2);
  const [thirdLabel, setThirdLabel] = useState((exercise && exercise.third_label) || 'Gefährlich');
  const [series, setSeries] = useState((exercise && exercise.default_series) || 10);
  const [targetRate, setTargetRate] = useState(
    exercise && typeof exercise.target_rate === 'number' ? String(exercise.target_rate) : ''
  );
  const [hasRopeVariant, setHasRopeVariant] = useState(
    exercise ? !!exercise.has_rope_variant : false
  );

  const handleUciSelect = (selected) => {
    setUciCode(selected.c);
    setUciDisc(selected.d);
    setName(selected.n);
  };

  const save = () => {
    if (!name.trim()) return;
    onSave({
      id: (exercise && exercise.id) || uid(),
      name: name.trim(),
      uci_code: mode === 'uci' ? uciCode : null,
      uci_disc: mode === 'uci' ? uciDisc : null,
      active: exercise ? exercise.active : true,
      category_mode: Number(statusMode),
      third_label: Number(statusMode) === 3 ? (thirdLabel.trim() || 'Dritte') : null,
      default_series: Number(series) || 10,
      target_rate: targetRate.trim() === '' ? null : Math.max(0, Math.min(100, Number(targetRate) || 0)),
      has_rope_variant: hasRopeVariant
    });
  };

  const canSave = name.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#F2F2F7] pb-12">
      {/* iOS Large-Title Header mit Action-Bar */}
      <div className="sticky top-0 z-10 ios-header-bg backdrop-blur-xl px-4 py-3 flex items-center justify-between">
        <button onClick={onCancel} className="text-[17px] text-[#007AFF] active:opacity-60 px-1">
          Abbrechen
        </button>
        <h1 className="font-semibold text-[17px]">{exercise ? 'Übung bearbeiten' : 'Neue Übung'}</h1>
        <button onClick={save} disabled={!canSave}
          className="text-[17px] text-[#FF9500] font-semibold active:opacity-60 disabled:opacity-30 px-1">
          Fertig
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-3 py-4 space-y-5">
        {/* Modus-Wahl — iOS Segmented Control */}
        <div className="bg-[#E5E5EA]/70 rounded-xl p-0.5 flex">
          <button onClick={() => setMode('uci')}
            className={'flex-1 py-1.5 text-[13px] font-medium rounded-[10px] transition ' +
              (mode === 'uci' ? 'ios-seg-active' : 'text-[#3C3C43]')}>
            Aus UCI-Liste
          </button>
          <button onClick={() => { setMode('custom'); setUciCode(''); setUciDisc(null); }}
            className={'flex-1 py-1.5 text-[13px] font-medium rounded-[10px] transition ' +
              (mode === 'custom' ? 'ios-seg-active' : 'text-[#3C3C43]')}>
            Eigene Übung
          </button>
        </div>

        {/* UCI-Suche */}
        {mode === 'uci' && (
          <IOSList header="UCI-Übung">
            <div className="px-4 py-3 flex items-center gap-3">
              <label className="text-[15px] text-[#3C3C43] w-24 shrink-0">Disziplin</label>
              <select value={uciDisc} onChange={e => { setUciDisc(e.target.value); setUciCode(''); setName(''); }}
                className="flex-1 bg-transparent text-[15px] outline-none appearance-none text-right">
                {DISCIPLINES.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
              </select>
              <ChevronRight size={16} className="text-[#C7C7CC] rotate-90 shrink-0" />
            </div>
            <div className="px-4 py-3">
              <UciPicker discipline={uciDisc} onSelect={handleUciSelect} selectedCode={uciCode} />
            </div>
          </IOSList>
        )}

        {/* Name */}
        <IOSList header={mode === 'uci' ? 'Anzeigename' : 'Name'}>
          <div className="px-4 py-3">
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder={mode === 'custom' ? 'z. B. Maute-Sprung' : 'anpassbar'}
              className="w-full bg-transparent text-[15px] outline-none placeholder:text-[#C7C7CC]" />
          </div>
        </IOSList>

        {/* Status-Modus */}
        <IOSList
          header="Status-Modus"
          footer={Number(statusMode) === 3
            ? 'Für Risiko-Übungen wie den Maute-Sprung. Die dritte Kategorie ist eine Sonderform von „nicht geklappt" — z. B. wenn die Übung nicht geklappt UND zusätzlich gefährlich war (Sturz).'
            : 'Wähle 3 Kategorien, wenn du z. B. „gefährliche" Versuche getrennt auswerten willst.'}>
          <IOSListRow
            onClick={() => setStatusMode(2)}
            trailing={Number(statusMode) === 2 ? <Check size={20} strokeWidth={2.8} className="text-[#FF9500]" /> : <span className="w-5" />}>
            <span className="text-[15px]">2 Kategorien <span className="text-[#8E8E93]">(Geklappt / Nicht)</span></span>
          </IOSListRow>
          <IOSListRow
            onClick={() => setStatusMode(3)}
            trailing={Number(statusMode) === 3 ? <Check size={20} strokeWidth={2.8} className="text-[#FF9500]" /> : <span className="w-5" />}>
            <span className="text-[15px]">3 Kategorien <span className="text-[#8E8E93]">(+ z. B. Gefährlich)</span></span>
          </IOSListRow>
          {Number(statusMode) === 3 && (
            <div className="px-4 py-3 flex items-center gap-3">
              <label className="text-[15px] text-[#3C3C43] w-28 shrink-0">Name</label>
              <input value={thirdLabel} onChange={e => setThirdLabel(e.target.value)}
                placeholder="Gefährlich, Unsicher, …"
                className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-[#C7C7CC] text-right" />
            </div>
          )}
        </IOSList>

        {/* Standard-Serienanzahl + Ziel-Quote */}
        <IOSList
          header="Training"
          footer="Dashboard markiert die Übung farblich, wenn deine Quote unter dem Ziel liegt — Trainings-Bedarf auf einen Blick.">
          <div className="px-4 py-3 flex items-center gap-3">
            <label className="text-[15px] text-[#3C3C43] flex-1">Serien pro Session</label>
            <input type="number" inputMode="numeric" value={series} onChange={e => setSeries(e.target.value)}
              className="w-20 bg-transparent text-[15px] outline-none text-right" />
          </div>
          <div className="px-4 py-3 flex items-center gap-3">
            <label className="text-[15px] text-[#3C3C43] flex-1 flex items-center gap-2">
              <Target size={14} className="text-[#8E8E93]" /> Ziel-Quote <span className="text-[12px] text-[#8E8E93]">(optional)</span>
            </label>
            <input type="number" min="0" max="100" inputMode="numeric"
              value={targetRate} onChange={e => setTargetRate(e.target.value)}
              placeholder="z. B. 80"
              className="w-20 bg-transparent text-[15px] outline-none text-right placeholder:text-[#C7C7CC]" />
            <span className="text-[15px] text-[#8E8E93]">%</span>
          </div>
        </IOSList>

        {/* Mit-Seil-Variante — iOS Toggle */}
        <IOSList footer="Beim Protokollieren kannst du dann pro Serie wählen ob mit oder ohne Seil trainiert wurde — z. B. für den Maute-Sprung. Statistiken werden getrennt ausgewertet.">
          <div className="px-4 py-3 flex items-center gap-3">
            <span className="flex-1 text-[15px]">Mit-Seil-Variante</span>
            <IOSToggle checked={hasRopeVariant} onChange={setHasRopeVariant} />
          </div>
        </IOSList>
      </div>
    </div>
  );
}

// iOS-Style Toggle Switch
function IOSToggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={'relative w-[51px] h-[31px] rounded-full transition-colors shrink-0 ' +
        (checked ? 'bg-[#34C759]' : 'bg-[#E5E5EA]')}>
      <span
        className={'absolute top-[2px] left-[2px] w-[27px] h-[27px] bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.2)] transition-transform ' +
          (checked ? 'translate-x-[20px]' : 'translate-x-0')} />
    </button>
  );
}

// =============================================================
// UCI-PICKER mit Suche
// =============================================================
function UciPicker({ discipline, onSelect, selectedCode }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const inDiscipline = getUciDb().filter(e => e.d === discipline);
    if (!query.trim()) return inDiscipline.slice(0, 30);
    const q = query.toLowerCase();
    return inDiscipline.filter(e => e.n.toLowerCase().includes(q) || e.c.toLowerCase().includes(q)).slice(0, 50);
  }, [query, discipline]);

  const selected = selectedCode ? getUciDb().find(e => e.c === selectedCode) : null;

  return (
    <div>
      <label className="text-sm font-medium block mb-1.5">UCI-Übung suchen</label>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={query} onChange={e => setQuery(e.target.value)}
          placeholder="z.B. 'Lenkerhandstand' oder '1124c'"
          className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
      </div>

      {selected && (
        <div className="mt-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm">
          <div className="font-medium text-emerald-900">✓ Ausgewählt: {selected.n}</div>
          <div className="text-xs text-emerald-700">UCI {selected.c} · {selected.p} Pkt.</div>
        </div>
      )}

      <div className="mt-2 border border-slate-200 rounded-xl max-h-64 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="p-4 text-sm text-slate-500 text-center">Keine Übung gefunden</div>
        ) : (
          filtered.map(e => (
            <button key={e.c} onClick={() => onSelect(e)}
              className={'w-full text-left px-3 py-2 hover:bg-slate-50 border-b border-slate-100 last:border-0 ' +
                (selectedCode === e.c ? 'bg-amber-50' : '')}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{e.n}</div>
                  <div className="text-xs text-slate-500">UCI {e.c}</div>
                </div>
                <span className="bg-sky-100 text-sky-700 text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
                  {e.p} Pkt
                </span>
              </div>
            </button>
          ))
        )}
      </div>
      <p className="text-xs text-slate-400 mt-1">{filtered.length} von {getUciDb().filter(e => e.d === discipline).length} Übungen aus {discipline}</p>
    </div>
  );
}

// =============================================================
// SERIE PROTOKOLLIEREN (Erfassen)
// =============================================================
function Erfassen({ data, setData, dbAthletes, onDone }) {
  const { t } = useI18n();
  const activeExercises = data.exercises.filter(e => e.active);
  // Athletes aus DB (Phase 9a). Fallback auf data.athletes für legacy
  const athletes = (dbAthletes && dbAthletes.length > 0) ? dbAthletes : (data.athletes || []);

  // Übungen nach Trainings-Häufigkeit sortieren: bereits trainierte zuerst,
  // dann nach Anzahl Sessions absteigend. Übrige danach alphabetisch.
  const exerciseSort = useMemo(() => {
    const count = new Map();
    for (const s of (data.sessions || [])) {
      if (s.exerciseId) count.set(s.exerciseId, (count.get(s.exerciseId) || 0) + 1);
    }
    const trained = activeExercises.filter(e => (count.get(e.id) || 0) > 0)
      .sort((a, b) => (count.get(b.id) || 0) - (count.get(a.id) || 0));
    const untrained = activeExercises.filter(e => !count.get(e.id))
      .sort((a, b) => (a.name || '').localeCompare(b.name || '', 'de'));
    return { trained, untrained, count };
  }, [activeExercises, data.sessions]);

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  // Default-Übung: die häufigst-trainierte, sonst erste der Liste
  const [exerciseId, setExerciseId] = useState(
    (exerciseSort.trained[0] && exerciseSort.trained[0].id) ||
    (activeExercises[0] && activeExercises[0].id) || ''
  );
  const [athleteId, setAthleteId] = useState((athletes[0] && athletes[0].id) || '');
  const [entries, setEntries] = useState([]);
  const [notes, setNotes] = useState('');
  const [withRope, setWithRope] = useState(true); // default Mit Seil, häufiger Fall

  useEffect(() => { setEntries([]); setNotes(''); setWithRope(true); }, [exerciseId]);

  const exercise = data.exercises.find(e => e.id === exerciseId);

  if (activeExercises.length === 0) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] p-4 sm:p-8">
        <div className="max-w-2xl mx-auto space-y-5">
          <header className="flex items-center gap-3">
            <button onClick={onDone} className="p-2 -m-2 text-slate-500"><ChevronLeft size={22} /></button>
            <h1 className="text-2xl font-bold">Serie protokollieren</h1>
          </header>
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
            <Dumbbell size={32} className="mx-auto text-slate-300 mb-3" />
            <h3 className="font-semibold mb-1">Keine aktiven Übungen</h3>
            <p className="text-sm text-slate-500 mb-4">Lege zuerst eine Übung an.</p>
            <button onClick={onDone} className="bg-white border border-slate-300 px-5 py-2 rounded-xl font-medium">
              Zurück
            </button>
          </div>
        </div>
      </div>
    );
  }

  const success = entries.filter(e => e === 'success').length;
  const fail = entries.filter(e => e === 'fail').length;
  const third = entries.filter(e => e === 'third').length;
  const use3 = exercise && exercise.category_mode === 3;
  const thirdLabel = (exercise && exercise.third_label) || 'Dritte';

  const save = () => {
    if (entries.length === 0 || !exercise) return;
    setData({
      ...data,
      sessions: [...data.sessions, {
        id: uid(),
        date,
        athleteId: athleteId || null,
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        entries,
        notes: notes.trim() || null,
        withRope: exercise.has_rope_variant ? withRope : null
      }]
    });
    onDone();
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] p-4 sm:p-8">
      <div className="max-w-2xl mx-auto space-y-5">
        <header className="flex items-center gap-1 -ml-1">
          <button onClick={onDone} className="text-[17px] text-[#007AFF] flex items-center active:opacity-60">
            <ChevronLeft size={22} strokeWidth={2.6} className="text-[#FF9500]" /> {t('common.back')}
          </button>
          <h1 className="text-[28px] font-bold tracking-tight ml-2">{t('log.title')}</h1>
        </header>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
          {/* Übung zuerst — wichtigste Auswahl, beeinflusst alle anderen Felder */}
          <div>
            <label className="text-sm font-medium block mb-1.5">{t('log.exercise')}</label>
            <select value={exerciseId} onChange={e => setExerciseId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-amber-500">
              {exerciseSort.trained.length > 0 && (
                <optgroup label={t('log.exerciseTrained')}>
                  {exerciseSort.trained.map(e => (
                    <option key={e.id} value={e.id}>
                      {localizedExerciseName(e)}
                    </option>
                  ))}
                </optgroup>
              )}
              {exerciseSort.untrained.length > 0 && (
                <optgroup label={exerciseSort.trained.length > 0 ? t('log.exerciseUntrained') : t('log.exerciseAll')}>
                  {exerciseSort.untrained.map(e => (
                    <option key={e.id} value={e.id}>
                      {localizedExerciseName(e)}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>

          {/* Mit/Ohne-Seil direkt unter der Übung — Variante gehört zur Übung */}
          {exercise && exercise.has_rope_variant && (
            <div>
              <label className="text-sm font-medium block mb-1.5">{t('log.variant')}</label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setWithRope(true)}
                  className={'py-2.5 rounded-xl text-sm font-medium border transition active:scale-95 ' +
                    (withRope ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-slate-700 border-slate-300')}>
                  {t('log.withRope')}
                </button>
                <button type="button" onClick={() => setWithRope(false)}
                  className={'py-2.5 rounded-xl text-sm font-medium border transition active:scale-95 ' +
                    (!withRope ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-slate-700 border-slate-300')}>
                  {t('log.withoutRope')}
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium block mb-1.5">{t('log.date')}</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          {athletes.length > 0 && (
            <div>
              <label className="text-sm font-medium block mb-1.5">{t('log.athlete')}</label>
              <select value={athleteId} onChange={e => setAthleteId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-amber-500">
                <option value="">{t('log.athleteNone')}</option>
                {athletes.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name}{a.type === 'team' ? ' (Team)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">{t('log.series')}</h2>
            <span className="bg-sky-100 text-sky-700 text-xs font-medium px-2 py-0.5 rounded-full">
              {entries.length} / {(exercise && exercise.default_series) || '∞'}
            </span>
          </div>

          <div className={'grid gap-3 mb-3 ' + (use3 ? 'grid-cols-3' : 'grid-cols-2')}>
            <button onClick={() => setEntries([...entries, 'success'])}
              className="bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-semibold flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform">
              <Check size={26} strokeWidth={2.6} />
              <span className="text-[13px] leading-tight text-center px-1">{statusLabel(exercise, 'success')}</span>
              <span className="text-xs opacity-80">{success}</span>
            </button>
            {use3 && (
              <button onClick={() => setEntries([...entries, 'third'])}
                className="bg-amber-500 hover:bg-amber-600 text-white py-5 rounded-2xl font-semibold flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform">
                <AlertTriangle size={26} strokeWidth={2.4} />
                <span className="text-[13px] leading-tight text-center px-1">{thirdLabel}</span>
                <span className="text-xs opacity-80">{third}</span>
              </button>
            )}
            <button onClick={() => setEntries([...entries, 'fail'])}
              className="bg-rose-600 hover:bg-rose-700 text-white py-5 rounded-2xl font-semibold flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform">
              <X size={26} strokeWidth={2.6} />
              <span className="text-[13px] leading-tight text-center px-1">{statusLabel(exercise, 'fail')}</span>
              <span className="text-xs opacity-80">{fail}</span>
            </button>
          </div>

          {entries.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {entries.map((s, i) => (
                <button key={i} onClick={() => {
                  const order = use3 ? ['success', 'fail', 'third'] : ['success', 'fail'];
                  const next = [...entries];
                  next[i] = order[(order.indexOf(s) + 1) % order.length];
                  setEntries(next);
                }}
                  className={'w-9 h-9 rounded-lg font-bold text-white text-sm flex items-center justify-center ' +
                    (s === 'success' ? 'bg-emerald-600' : s === 'fail' ? 'bg-rose-600' : 'bg-amber-500')}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}

          <button onClick={() => setEntries(entries.slice(0, -1))} disabled={entries.length === 0}
            className="text-sm text-slate-500 disabled:opacity-50 hover:text-slate-900">
            {t('log.removeLast')}
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <label className="text-sm font-medium block mb-1.5 flex items-center gap-2">
            <Edit2 size={14} className="text-slate-500" /> {t('log.note')}
          </label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder={t('log.notePlaceholder')}
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 text-sm resize-y" />
        </div>

        <div className="flex gap-2">
          <button onClick={onDone}
            className="flex-1 bg-white border border-slate-200 px-5 py-3 rounded-xl font-medium text-[15px] active:opacity-60">
            {t('common.cancel')}
          </button>
          <button onClick={save} disabled={entries.length === 0}
            className="flex-1 bg-[#FF9500] text-white px-5 py-3 rounded-xl font-semibold text-[15px] disabled:opacity-40 flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(255,149,0,0.25)] active:scale-95 transition">
            <Save size={16} strokeWidth={2.4} /> {t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================================
// PROGRAMME
// =============================================================
function ProgrammeView({ data, setData }) {
  const { t } = useI18n();
  const [editId, setEditId] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const upsert = (prog) => {
    const list = data.programs || [];
    const exists = list.find(p => p.id === prog.id);
    setData({
      ...data,
      programs: exists ? list.map(p => p.id === prog.id ? prog : p) : [...list, prog]
    });
  };

  const remove = (id) => {
    setData({ ...data, programs: (data.programs || []).filter(p => p.id !== id) });
  };

  if (showNew || editId) {
    const editing = editId ? (data.programs || []).find(p => p.id === editId) : null;
    return <ProgrammEditor
      program={editing}
      onSave={(p) => { upsert(p); setShowNew(false); setEditId(null); }}
      onCancel={() => { setShowNew(false); setEditId(null); }}
    />;
  }

  const programs = data.programs || [];

  return (
    <div className="space-y-5">
      <header className="flex items-end justify-between flex-wrap gap-3 pt-2 px-1">
        <div>
          <h1 className="text-[34px] font-bold tracking-tight leading-none">{t('competition.programs')}</h1>
        </div>
        <button onClick={() => setShowNew(true)}
          className="bg-[#FF9500] text-white px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-1.5 shadow-[0_2px_8px_rgba(255,149,0,0.25)] active:scale-95 transition">
          <Plus size={16} strokeWidth={2.5} /> {t('common.new')}
        </button>
      </header>

      {programs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-8 text-center">
          <ListChecks size={32} className="mx-auto text-slate-300 mb-3" />
          <h3 className="font-semibold mb-1">Noch keine Programme</h3>
          <p className="text-sm text-slate-500 mb-4">Lege dein erstes Wettkampf-Programm an.</p>
          <button onClick={() => setShowNew(true)}
            className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium">
            Programm anlegen
          </button>
        </div>
      ) : (
        <IOSList>
          {programs.map(p => {
            const total = p.exercises.reduce((s, ex) => s + Number(ex.points || 0), 0);
            return (
              <IOSListRow
                key={p.id}
                onClick={() => setEditId(p.id)}
                trailing={
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(p.id); }}
                      className="p-2 text-[#FF3B30] active:bg-[#D1D1D6]/40 rounded-full">
                      <Trash2 size={16} />
                    </button>
                    <ChevronRight size={18} strokeWidth={2.4} className="text-[#C7C7CC]" />
                  </div>
                }>
                <div className="font-medium text-[15px] text-[#000]">{p.name}</div>
                <div className="text-[13px] text-[#8E8E93] mt-0.5">
                  {p.discipline || '—'} · {p.exercises.length} Übungen · {total.toFixed(2)} Pkt
                </div>
              </IOSListRow>
            );
          })}
        </IOSList>
      )}

      {confirmDeleteId && (() => {
        const p = (data.programs || []).find(x => x.id === confirmDeleteId);
        if (!p) return null;
        return (
          <DeleteConfirmModal
            title="Programm löschen?"
            message={'„' + p.name + '" wirklich löschen? Bestehende Wettkämpfe mit diesem Programm bleiben erhalten, können aber nicht mehr ausgewertet werden.'}
            onConfirm={() => {
              const id = confirmDeleteId;
              setConfirmDeleteId(null);
              setTimeout(() => remove(id), 0);
            }}
            onCancel={() => setConfirmDeleteId(null)}
          />
        );
      })()}
    </div>
  );
}

// =============================================================
// PROGRAMM-EDITOR
// =============================================================
function ProgrammEditor({ program, onSave, onCancel }) {
  const { t } = useI18n();
  const [name, setName] = useState((program && program.name) || '');
  const [discipline, setDiscipline] = useState((program && program.discipline) || '1er');
  const [exercises, setExercises] = useState((program && program.exercises) || []);
  // Programm-Import-Status
  const [importStatus, setImportStatus] = useState(null); // null | 'parsing' | 'success' | 'error'
  const [importMsg, setImportMsg] = useState('');
  const fileInputRef = useRef(null);

  const addEmptyRow = () => {
    setExercises([...exercises, { id: uid(), nr: exercises.length + 1, name: '', code: '', points: 0 }]);
  };

  const setUci = (idx, uciExercise) => {
    setExercises(exercises.map((e, i) =>
      i === idx ? { ...e, code: uciExercise.c, name: uciExercise.n, points: uciExercise.p } : e
    ));
  };

  const updateField = (idx, key, val) => {
    setExercises(exercises.map((e, i) => i === idx ? { ...e, [key]: val } : e));
  };

  const removeEx = (idx) => {
    setExercises(exercises.filter((_, i) => i !== idx).map((e, i) => ({ ...e, nr: i + 1 })));
  };

  // Programm-Datei importieren (BDR-XML / WeBo-XML / .xqz / PDF).
  // Erkennt Übungen mit UCI-Nr, Name und Punktwert automatisch.
  const handleFileImport = async (file) => {
    if (!file) return;
    if (exercises.length > 0 && !confirm(t('programImport.replace'))) {
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setImportStatus('parsing');
    setImportMsg(t('programImport.parsing'));
    const uciLookup = (code) => {
      const hit = getUciDb().find(e => e.c === code);
      return hit ? { n: hit.n, p: hit.p } : null;
    };
    const result = await parseProgramFile(file, { uciLookup, extractPdfText });
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (!result.ok) {
      setImportStatus('error');
      const err = result.error === 'unknownFormat' ? t('programImport.unknownFormat')
        : result.error === 'noExercises'   ? t('programImport.noExercises')
        : t('programImport.error', { msg: result.error });
      setImportMsg(err);
      return;
    }
    setExercises(result.exercises.map(e => ({ ...e, id: uid() })));
    if (!name && result.name) setName(result.name);
    if (result.discipline) setDiscipline(result.discipline);
    setImportStatus('success');
    setImportMsg(t('programImport.success', { n: result.exercises.length, name: result.name }));
  };

  const total = exercises.reduce((s, e) => s + Number(e.points || 0), 0);

  const save = () => {
    if (!name.trim() || exercises.length === 0) return;
    onSave({
      id: (program && program.id) || uid(),
      name: name.trim(),
      discipline,
      exercises,
      created: (program && program.created) || new Date().toISOString()
    });
  };

  const canSave = name.trim().length > 0 && exercises.length > 0;

  return (
    <div className="-mx-3 sm:mx-0">
      {/* iOS Header */}
      <div className="sticky top-0 z-10 ios-header-bg backdrop-blur-xl px-4 py-3 flex items-center justify-between">
        <button onClick={onCancel} className="text-[17px] text-[#007AFF] active:opacity-60 flex items-center -ml-1">
          <ChevronLeft size={22} strokeWidth={2.6} className="text-[#FF9500]" /> Zurück
        </button>
        <h1 className="font-semibold text-[17px] truncate px-2">{program ? 'Programm' : 'Neues Programm'}</h1>
        <button onClick={save} disabled={!canSave}
          className="text-[17px] text-[#FF9500] font-semibold active:opacity-60 disabled:opacity-30 px-1">
          Fertig
        </button>
      </div>

      <div className="px-3 py-4 space-y-5">
        {/* Basis-Infos */}
        <IOSList header="Programm">
          <div className="px-4 py-3 flex items-center gap-3">
            <label className="text-[15px] text-[#3C3C43] w-24 shrink-0">Name</label>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="z. B. 1er Elite Männer"
              className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-[#C7C7CC] text-right" />
          </div>
          <div className="px-4 py-3 flex items-center gap-3">
            <label className="text-[15px] text-[#3C3C43] w-24 shrink-0">Disziplin</label>
            <select value={discipline} onChange={e => setDiscipline(e.target.value)}
              className="flex-1 bg-transparent text-[15px] outline-none appearance-none text-right">
              {DISCIPLINES.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
            </select>
            <ChevronRight size={16} className="text-[#C7C7CC] rotate-90 shrink-0" />
          </div>
          <IOSListRow
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            trailing={<FileText size={18} className="text-[#FF9500]" />}>
            <span className="text-[15px] text-[#FF9500] font-medium">
              {importStatus === 'parsing' ? importMsg : t('programImport.title')}
            </span>
          </IOSListRow>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xml,.xqz,.pdf,application/xml,text/xml,application/pdf"
            onChange={e => handleFileImport(e.target.files && e.target.files[0])}
            className="hidden" />
        </IOSList>

        {/* Import-Status-Feedback */}
        {importStatus === 'success' && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 text-[13px] text-emerald-900">
            {importMsg}
          </div>
        )}
        {importStatus === 'error' && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3 text-[13px] text-rose-900">
            {importMsg}
          </div>
        )}

        {/* Hinweis welche Formate erkannt werden */}
        <p className="text-[12px] text-[#8E8E93] px-4 leading-snug -mt-2">
          {t('programImport.subtitle')}
        </p>

        {/* Übungen-Liste */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-4">
            <div className="text-[12px] uppercase tracking-wide text-[#8E8E93] font-medium">
              Übungen ({exercises.length})
            </div>
            <div className="text-[12px] uppercase tracking-wide text-[#8E8E93] font-medium">
              Σ {total.toFixed(2)} Pkt.
            </div>
          </div>

          {exercises.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-6 text-center">
              <p className="text-[14px] text-[#8E8E93]">
                Noch keine Übungen. Lade die Maute-Vorlage oder füge einzelne hinzu.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">
              {exercises.map((e, idx) => (
                <div key={e.id} className={idx < exercises.length - 1 ? 'border-b border-[#C6C6C8]/40' : ''}>
                  <ProgrammExerciseRow
                    ex={e}
                    discipline={discipline}
                    onUci={(u) => setUci(idx, u)}
                    onUpdate={(k, v) => updateField(idx, k, v)}
                    onRemove={() => removeEx(idx)}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">
            <IOSListRow
              onClick={addEmptyRow}
              trailing={<Plus size={20} strokeWidth={2.4} className="text-[#FF9500]" />}>
              <span className="text-[15px] text-[#FF9500] font-medium">Übung hinzufügen</span>
            </IOSListRow>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgrammExerciseRow({ ex, discipline, onUci, onUpdate, onRemove }) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="text-[13px] text-[#8E8E93] w-6 shrink-0 font-medium">{ex.nr}</div>
        <div className="flex-1 min-w-0">
          {ex.name ? (
            <>
              <div className="font-medium text-[15px] truncate">{localizedExerciseName(ex)}</div>
              <div className="text-[12px] text-[#8E8E93]">
                {ex.code ? 'UCI ' + ex.code : 'Eigene'} · {Number(ex.points).toFixed(1)} Pkt.
              </div>
            </>
          ) : (
            <div className="text-[15px] text-[#C7C7CC] italic">Noch nicht ausgewählt</div>
          )}
        </div>
        <button onClick={() => setPickerOpen(!pickerOpen)}
          className="text-[13px] text-[#007AFF] font-medium px-2 py-1 active:opacity-60">
          {ex.name ? 'Ändern' : 'Wählen'}
        </button>
        <button onClick={onRemove}
          className="p-1.5 text-[#FF3B30] active:opacity-60">
          <Trash2 size={16} />
        </button>
      </div>

      {pickerOpen && (
        <div className="px-4 pb-4 pt-1 border-t border-[#C6C6C8]/40 bg-[#F2F2F7]/40">
          <UciPicker discipline={discipline}
            onSelect={(u) => { onUci(u); setPickerOpen(false); }}
            selectedCode={ex.code} />
          <div className="text-[12px] text-[#8E8E93] mt-3 mb-1.5">
            Oder Name + Punkte selbst eintippen:
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input value={ex.name || ''} onChange={e => onUpdate('name', e.target.value)}
              placeholder="Name"
              className="col-span-2 px-3 py-2 text-[14px] bg-white rounded-xl outline-none border border-slate-200/60" />
            <input type="number" step="0.1" value={ex.points || 0} onChange={e => onUpdate('points', e.target.value)}
              placeholder="Pkt."
              className="px-3 py-2 text-[14px] bg-white rounded-xl outline-none text-right border border-slate-200/60" />
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================
// WETTKAMPF
// =============================================================
// Persistiert WettkampfView- + Editor-State über Tab-Wechsel hinweg.
// Sonst geht beim Wechsel auf Training/Dashboard alles verloren, weil
// React die View-Komponente unmoutet. localStorage = einfacher Auto-Save.
const WK_VIEW_STATE_KEY = 'artcyc:wk-view:v1';

// =============================================================
// BULK-IMPORT — mehrere PDFs auf einmal als Wettkämpfe übernehmen
// =============================================================
function BulkImportModal({ data, athletes, onApply, onClose }) {
  const [items, setItems] = useState([]); // { filename, parsed, duplicate, error, selected, athleteId }
  const [busy, setBusy] = useState(false);
  const defaultAthleteId = (athletes && athletes[0] && athletes[0].id) || '';

  const handleFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    setBusy(true);
    const additions = [];
    for (const file of Array.from(fileList)) {
      try {
        const parsed = await parsePdfFully(file);
        const dup = (data.competitions || []).find(c => {
          if ((c.name || '').trim() !== (parsed.wettbewerb || '').trim()) return false;
          if ((c.date || '') !== (parsed.datum || '')) return false;
          if (parsed.startnr && c.start_nr) return String(c.start_nr).trim() === String(parsed.startnr).trim();
          return true;
        });
        additions.push({
          filename: file.name, parsed, duplicate: dup || null, error: null,
          selected: !dup, athleteId: defaultAthleteId
        });
      } catch (e) {
        additions.push({ filename: file.name, parsed: null, duplicate: null, error: e.message || 'Fehler', selected: false });
      }
    }
    setItems(prev => [...prev, ...additions]);
    setBusy(false);
  };

  const toggle = (idx) => setItems(items.map((it, i) => i === idx ? { ...it, selected: !it.selected } : it));
  const setAthlete = (idx, aId) => setItems(items.map((it, i) => i === idx ? { ...it, athleteId: aId } : it));

  // Aus allen ausgewählten Items neue Programme/Übungen/Wettkämpfe aufbauen.
  // Pro PDF wird ein eigenes Programm angelegt (keine sophistizierten Matches —
  // bei Bedarf kann der User später Programme zusammenführen).
  const apply = () => {
    const newComps = [];
    const newProgs = [];
    const newExes = [];
    const dbExes = data.exercises || [];

    for (const item of items) {
      if (!item.selected || !item.parsed) continue;
      const p = item.parsed;
      if (!p.exerciseRows || p.exerciseRows.length === 0) continue;

      const disc = p.disziplin
        ? (['1er', '2er', '4er', '6er'].find(d => p.disziplin.toLowerCase().includes(d)) || '1er')
        : '1er';
      const progId = uid();
      const progExercises = p.exerciseRows.map((r, idx) => {
        // Wenn Name fehlt, versuche UCI-DB:
        //  1. via Code (eindeutig)
        //  2. via Punkte + Disziplin (nur wenn eindeutiger Treffer)
        let resolvedName = r.name || null;
        let resolvedCode = r.code || null;
        if (!resolvedName) {
          if (resolvedCode) {
            const hit = activeUciByCode.get(resolvedCode);
            if (hit && hit.n) resolvedName = hit.n;
          } else {
            const pts = Number(r.points || 0);
            if (pts > 0 && disc) {
              const cands = activeUciDb.filter(u => Math.abs(u.p - pts) < 0.001 && u.d === disc);
              if (cands.length === 1) {
                resolvedName = cands[0].n;
                resolvedCode = cands[0].c;
              }
            }
          }
        }
        return {
          id: 'p_ex_' + idx + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
          nr: idx + 1,
          name: resolvedName || ('Übung ' + (idx + 1)),
          code: resolvedCode,
          points: Number(r.points || 0)
        };
      });
      newProgs.push({
        id: progId,
        name: p.disziplin ? p.disziplin.replace('Kunstradsport', '').trim() : (p.wettbewerb || 'Programm') + ' (' + disc + ')',
        discipline: disc,
        exercises: progExercises,
        created: new Date().toISOString()
      });

      // Neue Übungen sammeln
      for (const ex of progExercises) {
        const isMatch = (dbEx) => {
          if (ex.code && dbEx.uci_code) return ex.code === dbEx.uci_code;
          return (dbEx.name || '').trim().toLowerCase() === (ex.name || '').trim().toLowerCase()
            && Number(dbEx.points || 0) === Number(ex.points || 0);
        };
        if (!dbExes.some(isMatch) && !newExes.some(isMatch)) {
          newExes.push({
            id: uid(),
            name: ex.name,
            uci_code: ex.code || null,
            uci_disc: disc || null,
            points: Number(ex.points || 0),
            active: true,
            category_mode: 2,
            third_label: null,
            default_series: 10,
            created: new Date().toISOString()
          });
        }
      }

      const buildTable = (kgKey) => progExercises.map((ex, idx) => {
        const r = p.exerciseRows[idx] || {};
        const kg = r[kgKey] || {};
        return {
          exerciseId: ex.id, included: true,
          cross: Number(kg.X || 0), wave: Number(kg.W || 0),
          bar: Number(kg.S || 0), circle: Number(kg.K || 0),
          schwPct: Number(kg.p || 0), taktischePunkte: Number(kg.T || 0)
        };
      });

      newComps.push({
        id: uid(),
        name: p.wettbewerb || 'Wettkampf',
        date: p.datum || new Date().toISOString().slice(0, 10),
        location: p.ort || '',
        host: p.ausrichter || '',
        start_nr: p.startnr || '',
        athlete_id: item.athleteId || null,
        program_id: progId,
        table1: buildTable('kg1'),
        table2: buildTable('kg2'),
        t1_schwierigkeit: 0,
        t2_schwierigkeit: 0,
        pdf_ref: {
          kg1_ausfuehrung: p.kg1_ausfuehrung, kg2_ausfuehrung: p.kg2_ausfuehrung,
          kg1_schwierigkeit: p.kg1_schwierigkeit, kg2_schwierigkeit: p.kg2_schwierigkeit,
          kg1_gesamt: p.kg1_gesamtabzug, kg2_gesamt: p.kg2_gesamtabzug,
          kg1_ausgefahren: p.kg1_ausgefahren, kg2_ausgefahren: p.kg2_ausgefahren,
          endergebnis: p.endergebnis
        },
        created: new Date().toISOString()
      });
    }

    onApply({ newComps, newProgs, newExes });
  };

  const selectedCount = items.filter(it => it.selected).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}>
      <div className="bg-white dark:bg-[#1c1c1e] rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}>
        <div className="px-4 py-3 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800">
          <button onClick={onClose} className="text-[#007AFF] font-medium text-[15px]">Abbrechen</button>
          <span className="font-semibold text-[15px]">Mehrere PDFs</span>
          <button onClick={apply} disabled={selectedCount === 0}
            className="text-[#FF9500] font-semibold text-[15px] disabled:opacity-30">
            {selectedCount > 0 ? selectedCount + ' anlegen' : 'Anlegen'}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {items.length === 0 && !busy && (
            <div className="text-center py-8">
              <FileText size={36} className="mx-auto text-slate-300 mb-3" />
              <p className="text-sm text-slate-500 mb-4 px-6">Mehrere Wertungsberichts-PDFs auf einmal hochladen. Pro PDF wird ein eigener Wettkampf-Eintrag mit Programm angelegt.</p>
              <label className="inline-flex bg-[#FF9500] text-white px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer items-center gap-1.5">
                <FileText size={14} strokeWidth={2.4} /> PDFs auswählen
                <input type="file" accept="application/pdf" multiple
                  onChange={e => handleFiles(e.target.files)} className="hidden" />
              </label>
            </div>
          )}
          {busy && <div className="text-center py-6 text-sm text-slate-500">⏳ Lese PDFs …</div>}
          {items.length > 0 && items.map((item, i) => (
            <div key={i} className={'rounded-xl border p-3 ' +
              (item.error ? 'bg-rose-50 border-rose-200 dark:bg-rose-950/30 dark:border-rose-900/40'
                : item.duplicate ? 'bg-amber-50 border-amber-300 dark:bg-amber-950/30 dark:border-amber-900/40'
                : item.selected ? 'bg-emerald-50 border-emerald-300 dark:bg-emerald-950/30 dark:border-emerald-900/40'
                : 'bg-slate-50 border-slate-200 dark:bg-slate-900/40 dark:border-slate-800')}>
              <div className="flex items-start gap-3">
                {!item.error && (
                  <input type="checkbox" checked={item.selected} onChange={() => toggle(i)}
                    className="mt-1 w-4 h-4 accent-emerald-600 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  {item.error ? (
                    <>
                      <div className="text-sm font-medium text-rose-900 dark:text-rose-200">✗ {item.filename}</div>
                      <div className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">{item.error}</div>
                    </>
                  ) : (
                    <>
                      <div className="text-sm font-medium truncate text-slate-900 dark:text-slate-100">
                        {item.parsed.wettbewerb || item.filename}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        {item.parsed.datum && formatDateShort(item.parsed.datum)}
                        {item.parsed.starter && ' · ' + item.parsed.starter}
                        {item.parsed.exerciseRows && ' · ' + item.parsed.exerciseRows.length + ' Übungen'}
                        {typeof item.parsed.endergebnis === 'number' && ' · ' + item.parsed.endergebnis.toFixed(2) + ' Pkt'}
                      </div>
                      {item.duplicate && (
                        <div className="text-xs text-amber-800 dark:text-amber-200 mt-1.5 flex items-start gap-1">
                          <AlertTriangle size={12} className="shrink-0 mt-0.5" />
                          <span>Bereits importiert — „{item.duplicate.name}" am {formatDateShort(item.duplicate.date)}</span>
                        </div>
                      )}
                      {athletes && athletes.length > 1 && (
                        <select value={item.athleteId} onChange={e => setAthlete(i, e.target.value)}
                          className="mt-2 text-xs bg-white dark:bg-white/10 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 w-full text-slate-900 dark:text-slate-100">
                          <option value="">— Sportler:in wählen —</option>
                          {athletes.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          {items.length > 0 && !busy && (
            <label className="block text-center text-[14px] text-[#007AFF] cursor-pointer py-2 mt-2">
              + weitere PDFs hinzufügen
              <input type="file" accept="application/pdf" multiple
                onChange={e => handleFiles(e.target.files)} className="hidden" />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}

function WettkampfView({ data, setData, dbAthletes }) {
  const { t } = useI18n();
  const [tab, setTab] = useState('wettkaempfe'); // 'wettkaempfe' | 'programme'

  // Persistierter Editor-Öffnungs-Zustand
  const initView = (() => {
    try {
      const raw = localStorage.getItem(WK_VIEW_STATE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return { editId: null, showNew: false };
  })();
  const [editId, setEditId] = useState(initView.editId);
  const [showNew, setShowNew] = useState(initView.showNew);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [viewId, setViewId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(WK_VIEW_STATE_KEY, JSON.stringify({ editId, showNew }));
    } catch {}
  }, [editId, showNew]);

  // Wenn Tab Programme, render ProgrammeView eingebettet
  if (tab === 'programme') {
    return (
      <div className="space-y-4">
        <div className="bg-[#E5E5EA] rounded-xl p-1 flex gap-1">
          <button onClick={() => setTab('wettkaempfe')}
            className={'flex-1 py-1.5 rounded-lg text-[14px] font-medium transition ' +
              (tab === 'wettkaempfe' ? 'ios-seg-active' : 'text-[#3C3C43] active:opacity-70')}>
            {t('competition.competitions')}
          </button>
          <button onClick={() => setTab('programme')}
            className={'flex-1 py-1.5 rounded-lg text-[14px] font-medium transition ' +
              (tab === 'programme' ? 'ios-seg-active' : 'text-[#3C3C43] active:opacity-70')}>
            {t('competition.programs')}
          </button>
        </div>
        <ProgrammeView data={data} setData={setData} />
      </div>
    );
  }

  const competitions = data.competitions || [];
  const programs = data.programs || [];
  // Athletes aus DB (Phase 9a). Fallback auf data.athletes für legacy
  const athletes = (dbAthletes && dbAthletes.length > 0) ? dbAthletes : (data.athletes || []);

  const upsert = (comp) => {
    const exists = competitions.find(c => c.id === comp.id);
    setData({
      ...data,
      competitions: exists
        ? competitions.map(c => c.id === comp.id ? comp : c)
        : [...competitions, comp]
    });
  };

  const remove = (id) => {
    setData({ ...data, competitions: competitions.filter(c => c.id !== id) });
  };

  // Detail-Ansicht
  if (viewId && !editId) {
    const c = competitions.find(x => x.id === viewId);
    if (!c) { setViewId(null); return null; }
    return (
      <>
        <WettkampfDetail
          competition={c}
          program={programs.find(p => p.id === c.program_id)}
          athlete={athletes.find(a => a.id === c.athlete_id)}
          onBack={() => setViewId(null)}
          onEdit={() => { setEditId(viewId); setViewId(null); }}
          onDelete={() => setConfirmDeleteId(viewId)}
        />
        {confirmDeleteId && (
          <DeleteConfirmModal
            title="Wettkampf löschen?"
            message={'„' + c.name + '" wirklich löschen? Das kann nicht rückgängig gemacht werden.'}
            onConfirm={() => {
              const id = confirmDeleteId;
              setConfirmDeleteId(null);
              setViewId(null);
              setTimeout(() => remove(id), 0);
            }}
            onCancel={() => setConfirmDeleteId(null)}
          />
        )}
      </>
    );
  }

  if (showNew || editId) {
    const editing = editId ? competitions.find(c => c.id === editId) : null;
    return <WettkampfEditor
      competition={editing}
      programs={programs}
      athletes={athletes}
      existingExercises={data.exercises || []}
      existingCompetitions={competitions}
      onSave={(payload) => {
        // ALLES in EINEM setData-Call → keine Race-Conditions
        const c = payload.competition;
        const compsList = data.competitions || [];
        const exists = compsList.find(x => x.id === c.id);
        const newCompetitions = exists
          ? compsList.map(x => x.id === c.id ? c : x)
          : [...compsList, c];

        const newProgramsList = payload.newProgram
          ? [...(data.programs || []), payload.newProgram]
          : (data.programs || []);

        const newExercisesList = payload.newExercises && payload.newExercises.length > 0
          ? [...(data.exercises || []), ...payload.newExercises]
          : (data.exercises || []);

        setData({
          ...data,
          competitions: newCompetitions,
          programs: newProgramsList,
          exercises: newExercisesList
        });
        setShowNew(false);
        setEditId(null);
      }}
      onCancel={() => { setShowNew(false); setEditId(null); }}
    />;
  }

  // Wettkämpfe mit berechnetem Endergebnis + Gesamtabzug pro KG-Mittel annotieren
  const enriched = competitions.map(c => {
    const program = programs.find(p => p.id === c.program_id);
    const t1 = program ? calcTableResult(program, c.table1, c.t1_schwierigkeit) : null;
    const t2 = program ? calcTableResult(program, c.table2, c.t2_schwierigkeit) : null;
    const final = (t1 && t2) ? Math.round(((t1.ergebnis + t2.ergebnis) / 2) * 100) / 100 : null;
    const ded = (t1 && t2) ? Math.round(((t1.abzugGesamt + t2.abzugGesamt) / 2) * 100) / 100 : null;
    return { c, final, ded };
  });
  const sorted = [...enriched].sort((a, b) => (b.c.date || '').localeCompare(a.c.date || ''));

  // Aggregat-Statistiken über alle Wettkämpfe mit gültigem Endergebnis
  const withFinal = enriched.filter(x => x.final !== null);
  const stats = (() => {
    if (withFinal.length === 0) return { best: null, avg: null, minDed: null, last: sorted[0] || null };
    const best = withFinal.reduce((a, b) => b.final > a.final ? b : a);
    const avg = withFinal.reduce((s, x) => s + x.final, 0) / withFinal.length;
    const withDed = withFinal.filter(x => x.ded !== null);
    const minDed = withDed.length > 0
      ? withDed.reduce((a, b) => b.ded < a.ded ? b : a)
      : null;
    return { best, avg, minDed, last: sorted[0] };
  })();
  const currentYear = new Date().getFullYear();
  const thisYearCount = competitions.filter(c => (c.date || '').startsWith(String(currentYear))).length;

  // Gruppierung pro Jahr (descending). „—" wenn Datum fehlt.
  const byYear = sorted.reduce((acc, x) => {
    const y = (x.c.date || '').slice(0, 4) || '—';
    (acc[y] = acc[y] || []).push(x);
    return acc;
  }, {});
  const years = Object.keys(byYear).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-5">
      <div className="bg-[#E5E5EA] rounded-xl p-1 flex gap-1">
        <button onClick={() => setTab('wettkaempfe')}
          className={'flex-1 py-1.5 rounded-lg text-[14px] font-medium transition ' +
            (tab === 'wettkaempfe' ? 'ios-seg-active' : 'text-[#3C3C43] active:opacity-70')}>
          {t('competition.competitions')}
        </button>
        <button onClick={() => setTab('programme')}
          className={'flex-1 py-1.5 rounded-lg text-[14px] font-medium transition ' +
            (tab === 'programme' ? 'ios-seg-active' : 'text-[#3C3C43] active:opacity-70')}>
          {t('competition.programs')}
        </button>
      </div>
      <header className="flex items-end justify-between flex-wrap gap-3 pt-2 px-1">
        <div>
          <h1 className="text-[34px] font-bold tracking-tight leading-none">{t('competition.title')}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowBulkImport(true)}
            className="bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 px-3 py-2 rounded-full font-medium text-[13px] flex items-center gap-1.5 active:scale-95 transition"
            title="Mehrere PDFs auf einmal importieren">
            <FileText size={14} strokeWidth={2.4} /> Bulk
          </button>
          <button onClick={() => setShowNew(true)}
            className="bg-[#FF9500] text-white px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-1.5 shadow-[0_2px_8px_rgba(255,149,0,0.25)] active:scale-95 transition">
            <Plus size={16} strokeWidth={2.5} /> {t('common.new')}
          </button>
        </div>
      </header>

      {showBulkImport && (
        <BulkImportModal
          data={data}
          athletes={athletes}
          onClose={() => setShowBulkImport(false)}
          onApply={({ newComps, newProgs, newExes }) => {
            // ALLES in EINEM setData — Programme/Übungen VOR den Wettkämpfen,
            // sonst verweisen FKs auf noch-nicht-existierende Datensätze.
            setData({
              ...data,
              programs: [...(data.programs || []), ...newProgs],
              exercises: [...(data.exercises || []), ...newExes],
              competitions: [...(data.competitions || []), ...newComps]
            });
            setShowBulkImport(false);
          }}
        />
      )}

      {competitions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-8 text-center">
          <Trophy size={32} className="mx-auto text-slate-300 mb-3" />
          <h3 className="font-semibold mb-1">Noch keine Wettkämpfe</h3>
          <p className="text-sm text-slate-500 mb-4">Erfasse deinen ersten Wertungsbogen.</p>
          <button onClick={() => setShowNew(true)}
            className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium">
            Wertungsbogen erfassen
          </button>
        </div>
      ) : (
        <>
          {/* Top-Stats (Design wie Dashboard) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              icon={Trophy}
              label={t('dashboard.bestScore')}
              value={stats.best ? stats.best.final.toFixed(2) : '—'}
              sub={stats.best ? stats.best.c.name.slice(0, 24) : '—'}
              color="amber"
            />
            <StatCard
              icon={Target}
              label={t('dashboard.competitions')}
              value={competitions.length}
              sub={stats.last ? formatDateShort(stats.last.c.date) : '—'}
              color="emerald"
            />
            <StatCard
              icon={Calendar}
              label={String(currentYear)}
              value={thisYearCount}
              sub={thisYearCount === 1 ? 'Wettkampf' : 'Wettkämpfe'}
              color="sky"
            />
            <StatCard
              icon={TrendingUp}
              label="Geringster Abzug"
              value={stats.minDed ? stats.minDed.ded.toFixed(2) : '—'}
              sub={stats.minDed ? stats.minDed.c.name.slice(0, 24) : '—'}
              color="violet"
            />
          </div>

          {/* Wettkampf-Listen pro Jahr (absteigend, neuestes Jahr oben) */}
          {years.map(year => (
            <IOSList key={year} header={year === '—' ? 'Ohne Datum' : year}>
              {byYear[year].map(({ c, final }) => {
                const athlete = athletes.find(a => a.id === c.athlete_id);
                return (
                  <IOSListRow
                    key={c.id}
                    onClick={() => setViewId(c.id)}
                    trailing={
                      <div className="flex items-center gap-2 shrink-0">
                        {final !== null && (
                          <div className="text-right">
                            <div className="text-[14px] font-bold text-[#FF9500] leading-none">{final.toFixed(2)}</div>
                            <div className="text-[10px] text-[#8E8E93] uppercase tracking-wide font-medium mt-0.5">Pkt</div>
                          </div>
                        )}
                        <ChevronRight size={18} strokeWidth={2.4} className="text-[#C7C7CC]" />
                      </div>
                    }>
                    <div className="font-medium text-[15px] text-[#000] truncate">{c.name}</div>
                    <div className="text-[13px] text-[#8E8E93] mt-0.5 truncate">
                      {formatDateShort(c.date)}{c.location ? ' · ' + c.location : ''}{athlete ? ' · ' + athlete.name : ''}
                    </div>
                  </IOSListRow>
                );
              })}
            </IOSList>
          ))}
        </>
      )}
    </div>
  );
}

// =============================================================
// WETTKAMPF-EDITOR
// =============================================================

// Wertungsbericht-Text → strukturierte Stammdaten + Footer-Punktwerte.
// Top-Level, damit Single-Editor UND Bulk-Import sie verwenden können.
function parseWertungsbericht(text) {
  const result = { errors: [] };
  // STOP-Lookahead: Pattern muss zwei Sorten Begrenzer akzeptieren, weil das PDF
  // alles in eine Zeile streamt:
  //   1. Echte Labels mit Doppelpunkt — z.B. "Datum:", "Startnummer:" — sicher
  //      identifizierbar.
  //   2. Tabellen-Header ohne Doppelpunkt — "Üb-Nr", "Übungstext", "Pkte" — die
  //      direkt nach den Stammdaten als Spalten-Überschriften auftauchen.
  // (.*?) statt (.+?), damit ein leeres Feld (PDF mit "Ort:" direkt gefolgt
  // von "Datum:") sauber als null erkannt wird statt den Folge-Wert einzusaugen.
  const LABELS_WITH_COLON = '(?:Wettbewerb|Ort|Datum|Ausrichter|Startnummer|Starter|Verein|Disziplin|Ansager|Schreiber|Chief|Abzug|Gesamtabzug|Aufgestellte|Endergebnis|Ausgefahrene)';
  // \b funktioniert in JS-Regex nur mit ASCII — `Üb-Nr` startet mit Ü und hätte
  // keine Wortgrenze davor. Daher fordern wir explizit \s+ vor dem Tabellen-Marker.
  const TABLE_MARKERS = '(?:Üb-Nr|Übungstext|Pkte)';
  const STOP = '(?=\\s*' + LABELS_WITH_COLON + '\\s*:|\\s+' + TABLE_MARKERS + '|\\n|\\r|$)';
  const field = (label) => {
    const m = text.match(new RegExp(label + ':\\s*(.*?)' + STOP));
    if (!m) return null;
    let v = m[1].trim();
    if (v.length > 100) v = v.slice(0, 100).trim();
    return v || null;
  };

  result.wettbewerb = field('Wettbewerb');
  result.ort = field('Ort');
  result.ausrichter = field('Ausrichter');
  result.startnr = field('Startnummer');
  result.starter = field('Starter');
  result.verein = field('Verein');
  const dM = text.match(/Disziplin:\s*([^]+?)(?=\s*(?:\d{4}[a-z]|Üb-Nr|Übungstext|\b\d{1,2}\s+\d{4})|\s{2,}|\n|$)/);
  if (dM) {
    let d = dM[1].trim();
    if (d.length > 80) d = d.slice(0, 80).trim();
    result.disziplin = d || null;
  }

  const datumM = text.match(/Datum:\s*(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (datumM) {
    result.datum = datumM[3] + '-' + datumM[2].padStart(2, '0') + '-' + datumM[1].padStart(2, '0');
  }

  const schwM = [...text.matchAll(/Abzug Schwierigkeit:\s*([\d,\.]+)/g)];
  const ausfM = [...text.matchAll(/Abzug Ausführung:\s*([\d,\.]+)/g)];
  const gesM = [...text.matchAll(/Gesamtabzug:\s*([\d,\.]+)/g)];
  const ausgefM = [...text.matchAll(/Ausgefahrene Punkte:\s*([\d,\.]+)/g)];
  const aufM = text.match(/Aufgestellte Punkte:\s*([\d,\.]+)/);
  const endM = text.match(/Endergebnis:\s*([\d,\.]+)/);
  const num = (s) => parseFloat(String(s).replace(',', '.'));

  if (schwM.length >= 2) { result.kg1_schwierigkeit = num(schwM[0][1]); result.kg2_schwierigkeit = num(schwM[1][1]); }
  if (ausfM.length >= 2) { result.kg1_ausfuehrung = num(ausfM[0][1]);   result.kg2_ausfuehrung = num(ausfM[1][1]); }
  if (gesM.length >= 2)  { result.kg1_gesamtabzug = num(gesM[0][1]);    result.kg2_gesamtabzug = num(gesM[1][1]); }
  if (ausgefM.length >= 2) { result.kg1_ausgefahren = num(ausgefM[0][1]); result.kg2_ausgefahren = num(ausgefM[1][1]); }
  if (aufM) result.aufgestellt = num(aufM[1]);
  if (endM) result.endergebnis = num(endM[1]);

  if (!result.wettbewerb && !result.starter) {
    result.errors.push('Konnte keine Wettkampf-Daten erkennen — ist das ein Wertungsbericht-PDF?');
  }
  return result;
}

// Komplettes PDF → parsed Object inkl. exerciseRows + position-aware Footer.
// Wird vom Bulk-Import benutzt; der Single-Editor hat noch eigene Logik für
// das Status-Update zwischendurch.
async function parsePdfFully(file) {
  const fullText = await extractPdfText(file);
  const parsed = parseWertungsbericht(fullText);
  if (parsed.errors.length > 0) throw new Error(parsed.errors.join(', '));
  try {
    const items = await extractPdfItems(file);
    const rows = parseWertungsbogenRows(items);
    if (rows.length > 0) parsed.exerciseRows = rows;
    const footerPos = parseFooterPositional(items);
    // Position-aware Footer überschreibt Text-Werte (zuverlässiger)
    ['kg1_schwierigkeit','kg2_schwierigkeit','kg1_ausfuehrung','kg2_ausfuehrung',
     'kg1_gesamtabzug','kg2_gesamtabzug','kg1_ausgefahren','kg2_ausgefahren',
     'aufgestellt','endergebnis'].forEach(k => {
      if (typeof footerPos[k] === 'number') parsed[k] = footerPos[k];
    });
  } catch {
    // Position-Parser fehlgeschlagen — wir behalten Text-Werte
  }
  return parsed;
}

// =============================================================
// VALIDIERUNG gegen PDF-Soll
// =============================================================
function ValidationCheck({ pdfRef, t1, t2 }) {
  const TOL = 0.01; // Toleranz wegen Rundungen

  // Pro KG: Ist (berechnet) vs. Soll (aus PDF)
  const checks = [
    { label: 'Kampfgericht 1 Ausführung', ist: t1.abzugAusfuehrung, soll: pdfRef.kg1_ausfuehrung },
    { label: 'Kampfgericht 1 Schwierigkeit', ist: t1.abzugSchwierigkeit, soll: pdfRef.kg1_schwierigkeit },
    { label: 'Kampfgericht 1 Gesamt', ist: t1.abzugGesamt, soll: pdfRef.kg1_gesamt },
    { label: 'Kampfgericht 2 Ausführung', ist: t2.abzugAusfuehrung, soll: pdfRef.kg2_ausfuehrung },
    { label: 'Kampfgericht 2 Schwierigkeit', ist: t2.abzugSchwierigkeit, soll: pdfRef.kg2_schwierigkeit },
    { label: 'Kampfgericht 2 Gesamt', ist: t2.abzugGesamt, soll: pdfRef.kg2_gesamt }
  ];

  // Endergebnis berechnet vs. PDF
  const endIst = Math.round(((t1.ergebnis + t2.ergebnis) / 2) * 100) / 100;
  if (typeof pdfRef.endergebnis === 'number') {
    checks.push({ label: 'Endergebnis (Ø)', ist: endIst, soll: pdfRef.endergebnis });
  }

  const compared = checks.filter(c => typeof c.soll === 'number');
  const mismatches = compared.filter(c => Math.abs(c.ist - c.soll) > TOL);
  const allOk = mismatches.length === 0 && compared.length > 0;

  if (compared.length === 0) return null;

  if (allOk) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm flex items-start gap-2">
        <Check size={18} className="text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-emerald-900">
          <strong>Validierung OK:</strong> Alle Einzelabzüge stimmen mit PDF-Soll überein.
          <span className="text-xs text-emerald-700 ml-1">
            (Endergebnis {endIst.toFixed(2)} = PDF-Soll {pdfRef.endergebnis.toFixed(2)})
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-sm">
      <div className="flex items-start gap-2 mb-2">
        <AlertTriangle size={18} className="text-amber-700 shrink-0 mt-0.5" />
        <div className="text-amber-900">
          <strong>Abweichung zum PDF</strong> — {mismatches.length} {mismatches.length === 1 ? 'Wert' : 'Werte'} stimmen nicht überein:
        </div>
      </div>
      <div className="space-y-1 ml-6 text-xs">
        {mismatches.map((c, i) => {
          const diff = c.ist - c.soll;
          return (
            <div key={i} className="flex justify-between gap-2">
              <span className="text-amber-900">{c.label}:</span>
              <span className="font-mono text-amber-900">
                Ist {c.ist.toFixed(2)} · PDF {c.soll.toFixed(2)} ·
                <span className={'ml-1 font-bold ' + (diff > 0 ? 'text-rose-700' : 'text-blue-700')}>
                  {diff > 0 ? '+' : ''}{diff.toFixed(2)}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WettkampfEditor({ competition, programs, athletes, existingExercises, existingCompetitions, onSave, onCancel }) {
  const { t } = useI18n();
  const isNew = !competition;

  // Draft-Persistierung: alle Form-Felder werden bei Änderung in localStorage
  // gespiegelt, damit ein Tab-Wechsel oder App-Reload nichts wegwirft.
  // Beim Speichern + bewussten Verwerfen wird der Draft gelöscht.
  const DRAFT_KEY = 'artcyc:wk-draft:' + (competition?.id || 'new');
  const draftRef = useRef(null);
  if (draftRef.current === null) {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      draftRef.current = raw ? JSON.parse(raw) : false;
    } catch {
      draftRef.current = false;
    }
  }
  const draft = draftRef.current || null;
  const clearDraft = () => { try { localStorage.removeItem(DRAFT_KEY); } catch {} };

  const initVal = (key, fallback) => (draft && key in draft) ? draft[key] : fallback;

  const [name, setName] = useState(() => initVal('name', (competition && competition.name) || ''));
  const [date, setDate] = useState(() => initVal('date', (competition && competition.date) || new Date().toISOString().slice(0, 10)));
  const [location, setLocation] = useState(() => initVal('location', (competition && competition.location) || ''));
  const [host, setHost] = useState(() => initVal('host', (competition && competition.host) || ''));
  const [startNr, setStartNr] = useState(() => initVal('startNr', (competition && competition.start_nr) || ''));
  const [athleteId, setAthleteId] = useState(() => initVal('athleteId', (competition && competition.athlete_id) || ((athletes || [])[0] && (athletes || [])[0].id) || ''));
  const [programId, setProgramId] = useState(() => initVal('programId', (competition && competition.program_id) || (programs[0] && programs[0].id) || ''));
  // Beim PDF-Import: neue Programme und Übungen werden hier zwischengespeichert,
  // erst beim Speichern committet (eine atomare Datenänderung statt mehrere)
  const [pendingNewProgram, setPendingNewProgram] = useState(() => initVal('pendingNewProgram', null));
  const [pendingNewExercises, setPendingNewExercises] = useState(() => initVal('pendingNewExercises', []));

  // pendingNewProgram hat Vorrang — neu erstelltes Programm aus PDF wird angezeigt, bevor es gespeichert ist
  const program = pendingNewProgram || programs.find(p => p.id === programId);

  const initEntries = (existing) => {
    if (!program) return [];
    return program.exercises.map(ex => {
      const found = existing && existing.find(e => e.exerciseId === ex.id);
      return found || { exerciseId: ex.id, included: true, cross: 0, wave: 0, bar: 0, circle: 0, schwPct: 0, taktischePunkte: 0 };
    });
  };

  const [table1, setTable1] = useState(() => initVal('table1', initEntries(competition && competition.table1)));
  const [table2, setTable2] = useState(() => initVal('table2', initEntries(competition && competition.table2)));
  const [t1S, setT1S] = useState(() => initVal('t1S', (competition && competition.t1_schwierigkeit) || 0));
  const [t2S, setT2S] = useState(() => initVal('t2S', (competition && competition.t2_schwierigkeit) || 0));
  const [activeTable, setActiveTable] = useState(1);
  const [showExercises, setShowExercises] = useState(true);
  // Referenz-Werte aus letztem PDF-Import zur Validierung
  const [pdfRef, setPdfRef] = useState(() => initVal('pdfRef', competition && competition.pdf_ref ? competition.pdf_ref : null));

  // PDF-Import State — wird ebenfalls mit-persistiert, damit nach einem
  // Tab-Wechsel die 'Erkannt'-Karte + der Übernehmen-Button erhalten bleiben.
  // 'parsing' wird nicht restauriert (kein laufender Parse mehr) — fällt auf null.
  const [importStatus, setImportStatus] = useState(() => {
    const v = initVal('importStatus', null);
    return v === 'parsing' ? null : v;
  });
  const [importMsg, setImportMsg] = useState(() => initVal('importMsg', ''));
  const [importPreview, setImportPreview] = useState(() => initVal('importPreview', null));
  const [showPasteArea, setShowPasteArea] = useState(false);
  const [pasteText, setPasteText] = useState('');

  // Draft schreiben sobald sich etwas ändert (nach allen useStates!).
  // importPreview kann groß sein (mit exerciseRows) — passt aber locker
  // in localStorage (5MB-Limit pro Origin).
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({
        name, date, location, host, startNr, athleteId, programId,
        pendingNewProgram, pendingNewExercises, table1, table2, t1S, t2S, pdfRef,
        importStatus, importMsg, importPreview
      }));
    } catch {}
  }, [DRAFT_KEY, name, date, location, host, startNr, athleteId, programId,
      pendingNewProgram, pendingNewExercises, table1, table2, t1S, t2S, pdfRef,
      importStatus, importMsg, importPreview]);

  // (Früher: useEffect der bei programId-Wechsel table1/table2 reset hat — entfernt,
  //  weil das Programm nur noch beim PDF-Import gesetzt wird und applyImport die Tabellen
  //  bereits korrekt befüllt. Der Reset hier hat das beim Import gerade gesetzte überschrieben.)

  const t1 = program ? calcTableResult(program, table1, t1S) : null;
  const t2 = program ? calcTableResult(program, table2, t2S) : null;
  const finalScore = (t1 && t2) ? Math.round(((t1.ergebnis + t2.ergebnis) / 2) * 100) / 100 : 0;

  const updateEntry = (tableNum, idx, key, val) => {
    const setter = tableNum === 1 ? setTable1 : setTable2;
    setter(prev => prev.map((e, i) => i === idx ? { ...e, [key]: val } : e));
  };

  // (parseWertungsbericht ist jetzt eine top-level Funktion — siehe oben.
  // Damit kann auch der Bulk-Import sie nutzen.)

  const applyImport = (parsed) => {
    if (parsed.wettbewerb) setName(parsed.wettbewerb);
    if (parsed.datum) setDate(parsed.datum);
    if (parsed.ort) setLocation(parsed.ort);
    if (parsed.ausrichter) setHost(parsed.ausrichter);
    if (parsed.startnr) setStartNr(parsed.startnr);

    let activeProgram = pendingNewProgram || programs.find(p => p.id === programId);
    let createdNewProgram = null;

    // Wenn das PDF detaillierte Übungs-Zeilen liefert, ist es die Source-of-Truth
    // für die Programm-Übungen + ihre Punkte. Wir matchen NICHT auf Disziplin-Basis,
    // weil das zu falschen Aufgestellt-Werten führt wenn fremde Programme zufällig
    // dieselbe Disziplin haben.
    if (parsed.exerciseRows && parsed.exerciseRows.length > 0) {
      // Prüfen ob ein bestehendes Programm zu 100% passt (gleiche Anzahl, Codes, Punkte)
      const matchesExactly = (p) => {
        if (!p.exercises || p.exercises.length !== parsed.exerciseRows.length) return false;
        return p.exercises.every((e, idx) => {
          const r = parsed.exerciseRows[idx];
          const codeMatch = (e.code || '') === (r.code || '');
          const pointsMatch = Math.abs(Number(e.points || 0) - Number(r.points || 0)) < 0.01;
          return codeMatch && pointsMatch;
        });
      };
      const exactExisting = (programs || []).find(matchesExactly);

      if (exactExisting) {
        // 100% Match → bestehendes Programm wiederverwenden
        activeProgram = exactExisting;
        if (exactExisting.id !== programId) setProgramId(exactExisting.id);
      } else {
        // Frisches Programm aus PDF bauen (auch wenn Disziplin zu einem alten passt)
        const disc = parsed.disziplin
          ? (['1er', '2er', '4er', '6er'].find(d => parsed.disziplin.toLowerCase().includes(d)) || '1er')
          : '1er';
        const newProg = {
          id: uid(),
          name: parsed.disziplin
            ? parsed.disziplin.replace('Kunstradsport', '').trim()
            : (parsed.wettbewerb || 'Programm') + ' (' + disc + ')',
          discipline: disc,
          exercises: parsed.exerciseRows.map((r, idx) => {
            // UCI-DB-Lookup wenn Name fehlt: erst per Code, dann per Punkte+Disziplin
            let resolvedName = r.name || null;
            let resolvedCode = r.code || null;
            if (!resolvedName) {
              if (resolvedCode) {
                const hit = activeUciByCode.get(resolvedCode);
                if (hit && hit.n) resolvedName = hit.n;
              } else {
                const pts = Number(r.points || 0);
                if (pts > 0 && disc) {
                  const cands = activeUciDb.filter(u => Math.abs(u.p - pts) < 0.001 && u.d === disc);
                  if (cands.length === 1) {
                    resolvedName = cands[0].n;
                    resolvedCode = cands[0].c;
                  }
                }
              }
            }
            return {
              id: 'p_ex_' + idx + '_' + Date.now(),
              nr: idx + 1,
              name: resolvedName || ('Übung ' + (idx + 1)),
              code: resolvedCode,
              points: Number(r.points || 0)
            };
          }),
          created: new Date().toISOString()
        };
        setPendingNewProgram(newProg);
        setProgramId(newProg.id);
        activeProgram = newProg;
        createdNewProgram = newProg;
      }
    } else {
      // Fallback: kein detaillierter Parse → Disziplin-basiertes Matching wie bisher
      // (aber nur als Lückenfüller — Aufgestellt wird ungenau sein)
      if (parsed.disziplin && programs && programs.length > 0) {
        const dText = parsed.disziplin.toLowerCase();
        let match = programs.find(p => p.name && dText.includes(p.name.toLowerCase()));
        if (!match) {
          const discMatch = ['1er', '2er', '4er', '6er'].find(d => dText.includes(d));
          if (discMatch) match = programs.find(p => p.discipline === discMatch);
        }
        if (match && match.id !== programId) {
          setProgramId(match.id);
          activeProgram = match;
        }
      }
    }

    // Übungen ermitteln, die NEU sind — beim Speichern committen
    if (activeProgram && activeProgram.exercises) {
      const isMatch = (ex, dbEx) => {
        if (ex.code && dbEx.uci_code) return ex.code === dbEx.uci_code;
        return (dbEx.name || '').trim().toLowerCase() === (ex.name || '').trim().toLowerCase()
          && Number(dbEx.points || 0) === Number(ex.points || 0);
      };
      const newOnes = [];
      const dbExes = existingExercises || [];
      for (const ex of activeProgram.exercises) {
        const exists = dbExes.some(dbEx => isMatch(ex, dbEx));
        if (!exists && !newOnes.some(n => isMatch(ex, n))) {
          newOnes.push({
            id: uid(),
            name: ex.name,
            uci_code: ex.code || null,
            uci_disc: activeProgram.discipline || null,
            points: Number(ex.points || 0),
            active: true,
            category_mode: 2,
            third_label: null,
            default_series: 10,
            created: new Date().toISOString()
          });
        }
      }
      setPendingNewExercises(newOnes);
    }

    // Pro-Übung-Werte: PDF-Spalten X/W/S/K → cross/wave/bar/circle
    if (parsed.exerciseRows && parsed.exerciseRows.length > 0 && activeProgram) {
      const newT1 = activeProgram.exercises.map((ex, idx) => {
        const r = parsed.exerciseRows[idx];
        const kg1 = (r && r.kg1) || {};
        return {
          exerciseId: ex.id,
          included: true,
          cross: Number(kg1.X || 0),
          wave: Number(kg1.W || 0),
          bar: Number(kg1.S || 0),
          circle: Number(kg1.K || 0),
          schwPct: Number(kg1.p || 0),
          taktischePunkte: Number(kg1.T || 0)
        };
      });
      const newT2 = activeProgram.exercises.map((ex, idx) => {
        const r = parsed.exerciseRows[idx];
        const kg2 = (r && r.kg2) || {};
        return {
          exerciseId: ex.id,
          included: true,
          cross: Number(kg2.X || 0),
          wave: Number(kg2.W || 0),
          bar: Number(kg2.S || 0),
          circle: Number(kg2.K || 0),
          schwPct: Number(kg2.p || 0),
          taktischePunkte: Number(kg2.T || 0)
        };
      });
      setTable1(newT1);
      setTable2(newT2);
      // Pauschal-Schwierigkeit auf 0 (jetzt pro Übung)
      setT1S(0);
      setT2S(0);
    } else {
      // Fallback: nur Pauschal-Schwierigkeit aus Footer
      if (typeof parsed.kg1_schwierigkeit === 'number') setT1S(parsed.kg1_schwierigkeit);
      if (typeof parsed.kg2_schwierigkeit === 'number') setT2S(parsed.kg2_schwierigkeit);
    }

    // PDF-Referenz für Validierung speichern
    setPdfRef({
      kg1_ausfuehrung: parsed.kg1_ausfuehrung,
      kg2_ausfuehrung: parsed.kg2_ausfuehrung,
      kg1_schwierigkeit: parsed.kg1_schwierigkeit,
      kg2_schwierigkeit: parsed.kg2_schwierigkeit,
      kg1_gesamt: parsed.kg1_gesamtabzug,
      kg2_gesamt: parsed.kg2_gesamtabzug,
      kg1_ausgefahren: parsed.kg1_ausgefahren,
      kg2_ausgefahren: parsed.kg2_ausgefahren,
      endergebnis: parsed.endergebnis
    });

    // Übungsliste kollabieren — du musst sie nicht durchscrollen
    setShowExercises(false);

    setImportPreview(null);
    setImportStatus(null);
    setImportMsg('');
    setShowPasteArea(false);
    setPasteText('');
  };

  const handlePdfImport = async (file) => {
    if (!file) return;
    setImportStatus('parsing');
    setImportMsg('Lade PDF…');
    try {
      // 1. Text-Extract für Stammdaten + Footer
      const fullText = await extractPdfText(file);
      setImportMsg('Analysiere Wertungsbericht…');
      const parsed = parseWertungsbericht(fullText);
      if (parsed.errors.length > 0) {
        throw new Error(parsed.errors.join(', '));
      }

      // 2. Position-aware Parsing für Pro-Übung-Werte UND Footer
      try {
        setImportMsg('Lese pro-Übung-Werte…');
        const items = await extractPdfItems(file);
        const rows = parseWertungsbogenRows(items);
        // Roh-Daten der Übungs-Zeilen speichern — Mapping passiert in applyImport
        // (dort kann das Programm noch gewechselt werden)
        if (rows.length > 0) {
          parsed.exerciseRows = rows;
        }

        // Footer-Werte position-aware ÜBERSCHREIBEN. Text-Stream-Reihenfolge ist
        // unzuverlässig — wir LÖSCHEN die Text-Werte und nehmen NUR positions-Werte.
        const footerPos = parseFooterPositional(items);
        // KG-spezifische Werte: erst löschen, dann nur positions-Werte setzen
        delete parsed.kg1_schwierigkeit;
        delete parsed.kg2_schwierigkeit;
        delete parsed.kg1_ausfuehrung;
        delete parsed.kg2_ausfuehrung;
        delete parsed.kg1_gesamtabzug;
        delete parsed.kg2_gesamtabzug;
        delete parsed.kg1_ausgefahren;
        delete parsed.kg2_ausgefahren;
        if (typeof footerPos.kg1_schwierigkeit === 'number') parsed.kg1_schwierigkeit = footerPos.kg1_schwierigkeit;
        if (typeof footerPos.kg2_schwierigkeit === 'number') parsed.kg2_schwierigkeit = footerPos.kg2_schwierigkeit;
        if (typeof footerPos.kg1_ausfuehrung === 'number') parsed.kg1_ausfuehrung = footerPos.kg1_ausfuehrung;
        if (typeof footerPos.kg2_ausfuehrung === 'number') parsed.kg2_ausfuehrung = footerPos.kg2_ausfuehrung;
        if (typeof footerPos.kg1_gesamtabzug === 'number') parsed.kg1_gesamtabzug = footerPos.kg1_gesamtabzug;
        if (typeof footerPos.kg2_gesamtabzug === 'number') parsed.kg2_gesamtabzug = footerPos.kg2_gesamtabzug;
        if (typeof footerPos.kg1_ausgefahren === 'number') parsed.kg1_ausgefahren = footerPos.kg1_ausgefahren;
        if (typeof footerPos.kg2_ausgefahren === 'number') parsed.kg2_ausgefahren = footerPos.kg2_ausgefahren;
        if (typeof footerPos.aufgestellt === 'number') parsed.aufgestellt = footerPos.aufgestellt;
        if (typeof footerPos.endergebnis === 'number') parsed.endergebnis = footerPos.endergebnis;
      } catch (rowErr) {
        // Position-Parser fehlgeschlagen — Fallback auf Stammdaten + Schwierigkeit nur
        console.warn('Pro-Übung-Parser fehlgeschlagen:', rowErr);
      }

      setImportPreview(parsed);
      setImportStatus('success');
      setImportMsg('Wertungsbericht erkannt');
    } catch (err) {
      setImportStatus('error');
      setImportMsg('Fehler: ' + (err.message || 'PDF konnte nicht verarbeitet werden'));
    }
  };

  const handlePasteImport = () => {
    if (!pasteText.trim()) return;
    try {
      const parsed = parseWertungsbericht(pasteText);
      if (parsed.errors.length > 0) {
        setImportStatus('error');
        setImportMsg('Fehler: ' + parsed.errors.join(', '));
        return;
      }
      setImportPreview(parsed);
      setImportStatus('success');
      setImportMsg('Wertungsbericht erkannt');
    } catch (err) {
      setImportStatus('error');
      setImportMsg('Fehler: ' + (err.message || 'Text konnte nicht verarbeitet werden'));
    }
  };

  const save = () => {
    if (!name.trim()) return;
    // Wenn ein neues Programm aus PDF erzeugt wurde, dessen ID nehmen
    const finalProgramId = pendingNewProgram ? pendingNewProgram.id : programId;
    if (!finalProgramId) return;
    clearDraft(); // erfolgreich gespeichert → Draft entsorgen
    onSave({
      competition: {
        id: (competition && competition.id) || uid(),
        name: name.trim(),
        date, location, host,
        start_nr: startNr,
        athlete_id: athleteId || null,
        program_id: finalProgramId,
        table1, table2,
        t1_schwierigkeit: Number(t1S) || 0,
        t2_schwierigkeit: Number(t2S) || 0,
        pdf_ref: pdfRef,
        created: (competition && competition.created) || new Date().toISOString()
      },
      newProgram: pendingNewProgram,
      newExercises: pendingNewExercises
    });
  };

  const canSave = name.trim() && program;

  // Abbrechen mit Confirm, damit der User nicht versehentlich Daten verliert.
  // (User-Feedback: hat versehentlich „Fertig" gedrückt und alles war weg.)
  const handleCancel = () => {
    const confirmMsg = t('competition.discardChanges');
    if (window.confirm(confirmMsg)) {
      clearDraft(); // bewusst verworfen → Draft auch weg
      onCancel();
    }
  };

  // Duplikats-Erkennung: prüft, ob der aktuell geöffnete Import-Preview bereits
  // als Wettkampf existiert (gleicher Name + Datum, optional auch Startnummer).
  // Beim Bearbeiten (competition gesetzt) ignorieren wir den Wettkampf selbst.
  const duplicateCompetition = (() => {
    if (!importPreview) return null;
    if (!importPreview.wettbewerb || !importPreview.datum) return null;
    const list = existingCompetitions || [];
    return list.find(c => {
      if (competition && c.id === competition.id) return false;
      if ((c.name || '').trim() !== (importPreview.wettbewerb || '').trim()) return false;
      if ((c.date || '') !== (importPreview.datum || '')) return false;
      // Zusätzlich Startnummer matchen, falls beide gesetzt
      if (importPreview.startnr && c.start_nr) {
        return String(c.start_nr).trim() === String(importPreview.startnr).trim();
      }
      return true;
    }) || null;
  })();

  // Übernehmen mit Duplikat-Confirm
  const handleApplyImport = () => {
    if (duplicateCompetition) {
      const msg = 'Es existiert bereits ein Wettkampf mit gleichem Namen und Datum:\n\n„' +
        duplicateCompetition.name + '" am ' + formatDateShort(duplicateCompetition.date) +
        '\n\nTrotzdem übernehmen? Es wird ein zweiter Wettkampf-Eintrag angelegt.';
      if (!window.confirm(msg)) return;
    }
    applyImport(importPreview);
  };

  return (
    <div className="-mx-3 sm:mx-0">
      {/* iOS Sticky Top-Bar */}
      <div className="sticky top-0 z-20 ios-header-bg backdrop-blur-xl px-4 py-3 flex items-center justify-between border-b border-black/5 dark:border-white/5">
        <button onClick={handleCancel} className="text-[17px] text-[#007AFF] active:opacity-60 px-1">
          {t('common.cancel')}
        </button>
        <h1 className="font-semibold text-[17px] truncate px-2">{isNew ? t('competition.scoreSheet') : t('competition.editTitle')}</h1>
        <button onClick={save} disabled={!canSave}
          className="text-[17px] text-[#FF9500] font-semibold active:opacity-60 disabled:opacity-30 px-1">
          {t('common.save')}
        </button>
      </div>

      {/* Sticky-Bereich direkt unter dem Header.
          Drei mögliche Zustände:
          - Kein Programm geladen → leer (kein sticky)
          - Programm da + offener Import-Preview → eindeutige „Vorschau, noch nicht übernommen"-Karte
          - Programm da, Werte bereits aktiv → normale Score-Card */}
      {program && importPreview ? (
        <div className="sticky top-[52px] z-10 px-3 pt-2 pb-2 ios-header-bg backdrop-blur-xl space-y-1.5">
          <div className={'rounded-2xl px-3 py-2 flex items-center gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.15)] ' +
            (duplicateCompetition
              ? 'bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900/60'
              : 'bg-violet-50 dark:bg-violet-950/40 border border-violet-300 dark:border-violet-900/60')}>
            {duplicateCompetition
              ? <AlertTriangle size={16} className="text-amber-700 dark:text-amber-300 shrink-0" />
              : <FileText size={16} className="text-violet-700 dark:text-violet-300 shrink-0" />}
            <div className="flex-1 min-w-0">
              <div className={'text-[10px] uppercase tracking-wide font-semibold leading-tight ' +
                (duplicateCompetition ? 'text-amber-700 dark:text-amber-300' : 'text-violet-700 dark:text-violet-300')}>
                {duplicateCompetition ? 'Bereits importiert' : 'Vorschau · nicht übernommen'}
              </div>
              <div className="text-[12px] text-slate-800 dark:text-violet-100 leading-tight truncate">
                {duplicateCompetition
                  ? '„' + duplicateCompetition.name + '" am ' + formatDateShort(duplicateCompetition.date)
                  : (typeof importPreview.endergebnis === 'number'
                      ? 'PDF-Endergebnis: ' + importPreview.endergebnis.toFixed(2)
                      : 'PDF erkannt — Werte unten übernehmen')}
              </div>
            </div>
            <button onClick={handleApplyImport}
              className={'text-white px-3 py-1.5 rounded-lg text-[12px] font-semibold flex items-center gap-1 shrink-0 ' +
                (duplicateCompetition ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700')}>
              <Check size={12} strokeWidth={3} /> {t('pdfImport.apply')}
            </button>
          </div>
        </div>
      ) : program && (
        <div className="sticky top-[52px] z-10 px-3 pt-2 pb-2 ios-header-bg backdrop-blur-xl">
          <div className="bg-slate-900 text-white rounded-2xl px-3 py-2 grid grid-cols-3 items-center gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
            <div className="text-center">
              <div className="text-[10px] text-slate-400 uppercase tracking-wide leading-tight">{t('competition.tabled')}</div>
              <div className="text-[17px] font-bold leading-tight tabular-nums">{(t1 && t1.aufgestellt || 0).toFixed(2)}</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-slate-400 uppercase tracking-wide leading-tight">KG 1 · 2</div>
              <div className="text-[13px] font-bold leading-tight tabular-nums">
                {t1 && t1.ergebnis.toFixed(2)}<span className="text-slate-500 mx-1">·</span>{t2 && t2.ergebnis.toFixed(2)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-amber-300 uppercase tracking-wide leading-tight">{t('competition.finalScore')}</div>
              <div className="text-[22px] font-bold text-amber-400 leading-tight tabular-nums">{finalScore.toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}

      <div className="px-3 py-4 space-y-5">

      {/* PDF-Import (Beta) - nur bei neuen Wettkämpfen */}
      {isNew && (
        <div className="bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-900/40 rounded-2xl p-4 space-y-3">
          <div className="flex items-start gap-2">
            <FileText size={18} className="text-violet-700 dark:text-violet-300 shrink-0 mt-0.5" />
            <div className="text-sm text-violet-900 dark:text-violet-200">
              <strong>{t('pdfImport.bannerTitle')}</strong>
              <p className="text-xs mt-0.5 opacity-90">
                {t('pdfImport.bannerHint')}
              </p>
            </div>
          </div>

          {!importPreview && (
            <div className="grid grid-cols-2 gap-2">
              <label className="bg-white dark:bg-white/10 border border-violet-300 dark:border-violet-700/60 text-violet-900 dark:text-violet-100 hover:bg-violet-50 dark:hover:bg-white/15 px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 justify-center cursor-pointer">
                <FileText size={14} /> {t('pdfImport.choosePdf')}
                <input type="file" accept="application/pdf"
                  onChange={e => handlePdfImport(e.target.files && e.target.files[0])}
                  className="hidden" />
              </label>
              <button onClick={() => setShowPasteArea(!showPasteArea)}
                className="bg-white dark:bg-white/10 border border-violet-300 dark:border-violet-700/60 text-violet-900 dark:text-violet-100 hover:bg-violet-50 dark:hover:bg-white/15 px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 justify-center">
                <Edit2 size={14} /> {showPasteArea ? t('pdfImport.closePaste') : t('pdfImport.pasteText')}
              </button>
            </div>
          )}

          {showPasteArea && !importPreview && (
            <div className="space-y-2">
              <textarea value={pasteText} onChange={e => setPasteText(e.target.value)}
                placeholder={t('pdfImport.pastePlaceholder')}
                rows={4}
                className="w-full text-xs px-3 py-2 bg-white dark:bg-white/10 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 font-mono" />
              <button onClick={handlePasteImport} disabled={!pasteText.trim()}
                className="bg-violet-600 hover:bg-violet-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium disabled:opacity-50">
                {t('pdfImport.evaluateText')}
              </button>
            </div>
          )}

          {importStatus === 'parsing' && (
            <div className="bg-white dark:bg-white/10 rounded-xl p-3 text-sm text-violet-900 dark:text-violet-100">⏳ {importMsg}</div>
          )}
          {importStatus === 'error' && (
            <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl p-3 text-sm text-rose-900 dark:text-rose-200">
              ✗ {importMsg}
              <div className="text-xs mt-1 opacity-80">
                {t('pdfImport.errorTip')}
              </div>
            </div>
          )}
          {importStatus === 'success' && importPreview && (
            <div className="bg-white dark:bg-white/10 rounded-xl p-3 space-y-2">
              <div className="text-sm font-medium text-emerald-900 dark:text-emerald-300">✓ {t('pdfImport.recognized')}</div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-slate-900 dark:text-slate-100">
                {importPreview.wettbewerb && <div><span className="text-slate-500 dark:text-slate-400">{t('pdfImport.competition')}:</span> <strong>{importPreview.wettbewerb}</strong></div>}
                {importPreview.datum && <div><span className="text-slate-500 dark:text-slate-400">{t('pdfImport.date')}:</span> <strong>{importPreview.datum}</strong></div>}
                {importPreview.ort && <div><span className="text-slate-500 dark:text-slate-400">{t('pdfImport.location')}:</span> <strong>{importPreview.ort}</strong></div>}
                {importPreview.ausrichter && <div><span className="text-slate-500 dark:text-slate-400">{t('pdfImport.host')}:</span> <strong>{importPreview.ausrichter}</strong></div>}
                {importPreview.startnr && <div><span className="text-slate-500 dark:text-slate-400">{t('pdfImport.startNr')}:</span> <strong>{importPreview.startnr}</strong></div>}
                {importPreview.starter && <div><span className="text-slate-500 dark:text-slate-400">{t('pdfImport.starter')}:</span> <strong>{importPreview.starter}</strong></div>}
                {importPreview.disziplin && <div className="col-span-2"><span className="text-slate-500 dark:text-slate-400">{t('pdfImport.discipline')}:</span> <strong>{importPreview.disziplin}</strong></div>}
                {typeof importPreview.aufgestellt === 'number' && <div><span className="text-slate-500 dark:text-slate-400">{t('pdfImport.tabled')}:</span> <strong>{importPreview.aufgestellt.toFixed(2)}</strong></div>}
                {typeof importPreview.endergebnis === 'number' && <div className="col-span-2 text-amber-700 dark:text-amber-300"><span className="text-slate-500 dark:text-slate-400">{t('pdfImport.finalScorePdf')}:</span> <strong>{importPreview.endergebnis.toFixed(2)}</strong></div>}
              </div>
              {importPreview.exerciseRows && importPreview.exerciseRows.length > 0 ? (
                <p className="text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-lg p-2">
                  ✓ <strong>{t('pdfImport.exercisesRecognized', { n: importPreview.exerciseRows.length })}</strong>
                </p>
              ) : (
                <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-lg p-2">
                  {t('pdfImport.noExerciseRows')}
                </p>
              )}
              {importPreview.warnings && importPreview.warnings.length > 0 && (
                <div className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-lg p-2">
                  ⚠️ {importPreview.warnings.join(' · ')}
                </div>
              )}
              {duplicateCompetition && (
                <div className="text-xs bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900/60 rounded-lg p-2 flex items-start gap-2">
                  <AlertTriangle size={14} className="text-amber-700 dark:text-amber-300 shrink-0 mt-0.5" />
                  <div className="text-amber-900 dark:text-amber-200">
                    <strong>Wettkampf bereits importiert.</strong> „{duplicateCompetition.name}" am {formatDateShort(duplicateCompetition.date)} ist schon angelegt. Beim Übernehmen wird ein zweiter Eintrag erzeugt.
                  </div>
                </div>
              )}
              <div className="flex gap-2 pt-1">
                <button onClick={handleApplyImport}
                  className={'text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 ' +
                    (duplicateCompetition ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700')}>
                  <Check size={14} /> {t('pdfImport.apply')}
                </button>
                <button onClick={() => { setImportPreview(null); setImportStatus(null); setImportMsg(''); }}
                  className="bg-white dark:bg-white/10 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 px-3 py-1.5 rounded-lg text-sm font-medium">
                  {t('pdfImport.discard')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stammdaten */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5 space-y-3">
        <h2 className="font-semibold mb-1">Wettkampf-Daten</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Wettkampf-Name *</label>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="z.B. DM Elite 2025"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Datum *</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Ort</label>
            <input value={location} onChange={e => setLocation(e.target.value)}
              placeholder="z.B. Lübbecke"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Ausrichter</label>
            <input value={host} onChange={e => setHost(e.target.value)}
              placeholder="z.B. RKV Niedermehnen"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Startnummer</label>
            <input value={startNr} onChange={e => setStartNr(e.target.value)}
              placeholder="z.B. 117"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          {(athletes || []).length > 0 && (
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">Sportler/Team</label>
              <select value={athleteId} onChange={e => setAthleteId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-amber-500">
                <option value="">— Kein Sportler —</option>
                {athletes.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Programm</label>
            <div className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-700">
              {program ? (
                <span><strong>{program.name}</strong> · {(program.exercises || []).length} Übungen</span>
              ) : (
                <span className="text-slate-400">Wird beim PDF-Import automatisch erkannt oder neu angelegt</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* (Live-Ergebnis-Card wurde nach oben verschoben — direkt unter Header sticky) */}

      {/* Tisch-Tabs */}
      {program && (
        <>
          <div className="flex gap-2">
            <button onClick={() => setActiveTable(1)}
              className={'flex-1 py-3 rounded-xl font-semibold transition-colors ' +
                (activeTable === 1 ? 'bg-slate-900 text-white' : 'bg-white border border-slate-300 text-slate-700')}>
              Kampfgericht 1
              <div className="text-xs font-normal opacity-80 mt-0.5">{t1 && t1.ergebnis.toFixed(2)} Pkt.</div>
            </button>
            <button onClick={() => setActiveTable(2)}
              className={'flex-1 py-3 rounded-xl font-semibold transition-colors ' +
                (activeTable === 2 ? 'bg-slate-900 text-white' : 'bg-white border border-slate-300 text-slate-700')}>
              Kampfgericht 2
              <div className="text-xs font-normal opacity-80 mt-0.5">{t2 && t2.ergebnis.toFixed(2)} Pkt.</div>
            </button>
          </div>

          {/* Validierungs-Check gegen PDF-Soll */}
          {pdfRef && t1 && t2 && (
            <ValidationCheck pdfRef={pdfRef} t1={t1} t2={t2} />
          )}

          {/* Collapse-Knopf für Übungs-Liste */}
          <button onClick={() => setShowExercises(!showExercises)}
            className="w-full bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between hover:bg-slate-50">
            <span className="flex items-center gap-2">
              <ListChecks size={16} className="text-slate-500" />
              <span>Einzelübungen</span>
              <span className="text-xs text-slate-500">({program.exercises.length})</span>
            </span>
            <span className="text-slate-500 text-xs flex items-center gap-1">
              {showExercises ? 'Ausblenden ▲' : 'Anzeigen ▼'}
            </span>
          </button>

          {/* Wertungstisch-Tabelle */}
          {showExercises && (
            <WertungstischEditor
              program={program}
              entries={activeTable === 1 ? table1 : table2}
              onUpdate={(idx, key, val) => updateEntry(activeTable, idx, key, val)}
              result={activeTable === 1 ? t1 : t2}
            />
          )}
        </>
      )}

      {/* Speichern erfolgt über den „Speichern"-Button oben rechts im Header. */}
      </div>
    </div>
  );
}

function WertungstischEditor({ program, entries, onUpdate, result }) {
  const SCHW_OPTIONS = [0, 10, 50, 100];
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-4">
      {/* Mobile: Karten pro Übung */}
      <div className="sm:hidden space-y-2">
        {program.exercises.map((ex, idx) => {
          const e = entries[idx] || { included: true, cross: 0, wave: 0, bar: 0, circle: 0, schwPct: 0, taktischePunkte: 0 };
          const exec = calcExerciseDeduction(e);
          const schw = calcExerciseSchwierigkeit(e, ex);
          const total = exec + schw;
          const isTaktisch = Number(e.taktischePunkte || 0) > 0 && Number(e.taktischePunkte) !== Number(ex.points);
          return (
            <div key={ex.id} className="bg-slate-50 rounded-xl p-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs flex-wrap">
                    <span className="text-slate-500 font-medium">#{ex.nr}</span>
                    {ex.code && <span className="text-[10px] text-slate-400">{ex.code}</span>}
                    <span className="text-slate-500">·</span>
                    {isTaktisch ? (
                      <span className="font-medium">
                        <span className="text-slate-400 line-through">{Number(ex.points).toFixed(1)}</span>
                        <span className="text-amber-700 ml-1">→ {Number(e.taktischePunkte).toFixed(1)} Pkt</span>
                        <span className="ml-1 text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded uppercase font-bold tracking-wide">T</span>
                      </span>
                    ) : (
                      <span className="text-slate-700 font-medium">{Number(ex.points).toFixed(1)} Pkt</span>
                    )}
                  </div>
                  <div className="font-medium text-sm leading-tight mt-0.5">{localizedExerciseName(ex)}</div>
                </div>
                <div className={'text-sm font-bold shrink-0 ' + (total > 0 ? 'text-rose-600' : 'text-slate-400')}>
                  {total > 0 ? '-' + total.toFixed(2) : '0'}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-1.5 mb-2">
                {[
                  { k: 'cross',  label: 'x', title: 'Kreuz (0,2)' },
                  { k: 'wave',   label: '~', title: 'Welle (0,5)' },
                  { k: 'bar',    label: '|', title: 'Strich (1,0)' },
                  { k: 'circle', label: '○', title: 'Kreis/Sturz (2,0)' }
                ].map(c => (
                  <div key={c.k}>
                    <label className="text-[10px] text-slate-500 block text-center">{c.label}</label>
                    <input type="number" min="0" inputMode="numeric"
                      value={e[c.k] || ''}
                      onChange={ev => onUpdate(idx, c.k, ev.target.value)}
                      className="w-full px-1 py-1.5 text-center border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-amber-500 text-sm" />
                  </div>
                ))}
              </div>
              {/* Schwierigkeitsabzug pro Übung */}
              <div>
                <div className="text-[10px] text-slate-500 mb-1">Schwierigkeit (% Abzug):</div>
                <div className="grid grid-cols-4 gap-1">
                  {SCHW_OPTIONS.map(p => (
                    <button key={p} type="button"
                      onClick={() => onUpdate(idx, 'schwPct', p)}
                      className={'text-xs py-1.5 rounded-lg font-medium border ' +
                        (Number(e.schwPct||0) === p
                          ? 'bg-amber-500 text-slate-900 border-amber-500'
                          : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100')}>
                      {p === 0 ? '—' : p + '%'}
                    </button>
                  ))}
                </div>
                {schw > 0 && (
                  <div className="text-[10px] text-amber-700 mt-1">
                    -{schw.toFixed(2)} Pkt ({e.schwPct}% von {Number(ex.points).toFixed(1)})
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: Tabelle */}
      <div className="hidden sm:block overflow-x-auto -mx-4 px-4">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="text-left py-2 px-1 font-medium w-7">#</th>
              <th className="text-left py-2 px-1 font-medium">Übung</th>
              <th className="py-2 px-1 font-medium w-12">Pkt</th>
              <th className="py-2 px-1 font-medium w-10" title="Kreuz (0,2)">x</th>
              <th className="py-2 px-1 font-medium w-10" title="Welle (0,5)">~</th>
              <th className="py-2 px-1 font-medium w-10" title="Strich (1,0)">|</th>
              <th className="py-2 px-1 font-medium w-10" title="Kreis/Sturz (2,0)">○</th>
              <th className="py-2 px-1 font-medium w-16" title="Schwierigkeit %">Schw</th>
              <th className="py-2 px-1 font-medium w-12 text-right">Σ</th>
            </tr>
          </thead>
          <tbody>
            {program.exercises.map((ex, idx) => {
              const e = entries[idx] || { included: true, cross: 0, wave: 0, bar: 0, circle: 0, schwPct: 0, taktischePunkte: 0 };
              const exec = calcExerciseDeduction(e);
              const schw = calcExerciseSchwierigkeit(e, ex);
              const total = exec + schw;
              return (
                <tr key={ex.id} className="border-b border-slate-100">
                  <td className="py-1.5 px-1 text-slate-500">{ex.nr}</td>
                  <td className="py-1.5 px-1">
                    <div className="font-medium leading-tight line-clamp-2">{localizedExerciseName(ex)}</div>
                    {ex.code && <div className="text-[10px] text-slate-400">{ex.code}</div>}
                  </td>
                  <td className="py-1.5 px-1 text-center text-slate-600">
                    {Number(e.taktischePunkte || 0) > 0 && Number(e.taktischePunkte) !== Number(ex.points) ? (
                      <span title={'Taktisch anerkannt (Standard: ' + Number(ex.points).toFixed(1) + ')'}>
                        <span className="text-amber-700 font-semibold">{Number(e.taktischePunkte).toFixed(1)}</span>
                        <span className="text-[9px] text-amber-700 ml-0.5">T</span>
                      </span>
                    ) : (
                      <span>{Number(ex.points).toFixed(1)}</span>
                    )}
                  </td>
                  {['cross', 'wave', 'bar', 'circle'].map(k => (
                    <td key={k} className="py-1 px-0.5">
                      <input type="number" min="0" value={e[k] || ''}
                        onChange={ev => onUpdate(idx, k, ev.target.value)}
                        className="w-full px-1 py-1 text-center border border-slate-200 rounded outline-none focus:ring-1 focus:ring-amber-500 text-xs" />
                    </td>
                  ))}
                  <td className="py-1 px-0.5">
                    <select value={Number(e.schwPct||0)}
                      onChange={ev => onUpdate(idx, 'schwPct', Number(ev.target.value))}
                      className="w-full px-1 py-1 text-center border border-slate-200 rounded outline-none focus:ring-1 focus:ring-amber-500 text-xs bg-white">
                      <option value={0}>—</option>
                      <option value={10}>10%</option>
                      <option value={50}>50%</option>
                      <option value={100}>100%</option>
                    </select>
                  </td>
                  <td className="py-1.5 px-1 text-right font-semibold text-slate-700">
                    {total > 0 ? '-' + total.toFixed(2) : '0'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {result && (
        <div className="mt-4 pt-4 border-t border-slate-200 bg-slate-50 -mx-4 -mb-4 px-4 py-3 rounded-b-2xl grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div>
            <div className="text-slate-500">Ausführung</div>
            <div className="font-semibold text-slate-900">-{result.abzugAusfuehrung.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-slate-500">Schwierigkeit</div>
            <div className="font-semibold text-slate-900">-{result.abzugSchwierigkeit.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-slate-500">Gesamt</div>
            <div className="font-semibold text-slate-900">-{result.abzugGesamt.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-amber-700">Ergebnis</div>
            <div className="font-bold text-amber-700">{result.ergebnis.toFixed(2)}</div>
          </div>
        </div>
      )}

      <p className="text-xs text-slate-400 mt-3 leading-relaxed">
        Ausführung: <strong>x</strong> 0,2 · <strong>~</strong> 0,5 · <strong>|</strong> 1,0 · <strong>○</strong> 2,0 · Schwierigkeit: 10/50/100% des Übungs-Punktwerts
      </p>
    </div>
  );
}

// =============================================================
// SPORTLER & EINLADUNGEN
// =============================================================
// =============================================================
// AthleteDetailView — Coach-View für Trainings/Wettkämpfe eines Sportlers (read-only)
// =============================================================
function AthleteDetailView({ athlete, ownData, onBack }) {
  const { t } = useI18n();
  const [remoteData, setRemoteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!athlete) return;
      if (athlete.auth_user_id) {
        // Sportler mit Account → relationale Tabellen abfragen.
        // RLS lässt durch wenn ich Coach des Sportlers oder Admin bin.
        // Fallback auf alten Cloud-Snapshot, falls Tabellen leer (nicht migriert).
        setLoading(true); setErr('');
        try {
          const [sessions, competitions, programs, exercises] = await Promise.all([
            fetchSessions(),
            fetchCompetitions(),
            fetchPrograms(),
            fetchExercises(),
          ]);
          // Wenn relational nichts kam → Legacy-Snapshot probieren
          if ((sessions || []).length === 0 && (competitions || []).length === 0) {
            const snap = await fetchCloudSnapshot(athlete.auth_user_id);
            if (!cancelled) setRemoteData(snap?.data || { sessions: [], competitions: [], programs: [], exercises: [] });
          } else {
            if (!cancelled) setRemoteData({ sessions, competitions, programs, exercises });
          }
        } catch (e) {
          if (!cancelled) setErr('Daten konnten nicht geladen werden: ' + (e.message || e));
        } finally {
          if (!cancelled) setLoading(false);
        }
      } else {
        setRemoteData(null); // signal: use ownData (Trainer-managed ohne Account)
      }
    })();
    return () => { cancelled = true; };
  }, [athlete?.id, athlete?.auth_user_id]);

  const sourceData = athlete?.auth_user_id ? remoteData : ownData;
  const sessions = useMemo(() =>
    ((sourceData?.sessions) || []).filter(s => s.athleteId === athlete?.id || s.athlete_id === athlete?.id)
  , [sourceData, athlete?.id]);
  const competitions = useMemo(() =>
    ((sourceData?.competitions) || []).filter(c => c.athlete_id === athlete?.id || c.athleteId === athlete?.id)
  , [sourceData, athlete?.id]);
  const programs = (sourceData?.programs) || [];

  // Top-Übungs-Statistik (Quote pro Übung)
  const exerciseStats = useMemo(() => {
    const exMap = new Map();
    for (const s of sessions) {
      const exId = s.exerciseId || s.exercise_id;
      const exName = s.exerciseName || '';
      if (!exMap.has(exId)) exMap.set(exId, { id: exId, name: exName, total: 0, success: 0, fail: 0, third: 0 });
      const stats = exMap.get(exId);
      for (const e of (s.entries || [])) {
        stats.total++;
        if (e === 'success') stats.success++;
        else if (e === 'fail') stats.fail++;
        else if (e === 'third') stats.third++;
      }
    }
    return Array.from(exMap.values())
      .map(s => ({ ...s, rate: s.total ? Math.round((s.success / s.total) * 100) : 0 }))
      .sort((a, b) => b.total - a.total);
  }, [sessions]);

  // Wettkampf-Liste mit Endergebnissen
  const compRows = useMemo(() => {
    const programMap = new Map(programs.map(p => [p.id, p]));
    return competitions
      .map(c => {
        const program = programMap.get(c.program_id);
        if (!program) return null;
        const t1 = calcTableResult(program, c.table1, c.t1_schwierigkeit);
        const t2 = calcTableResult(program, c.table2, c.t2_schwierigkeit);
        const final = Math.round(((t1.ergebnis + t2.ergebnis) / 2) * 100) / 100;
        return { c, final };
      })
      .filter(Boolean)
      .sort((a, b) => (b.c.date || '').localeCompare(a.c.date || ''));
  }, [competitions, programs]);

  const bestComp = compRows.length > 0 ? compRows.slice().sort((a, b) => b.final - a.final)[0] : null;
  const lastSessionDate = sessions.length > 0 ? sessions.slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''))[0].date : null;

  return (
    <div className="space-y-5">
      <header className="flex items-start gap-2 pt-2">
        <button onClick={onBack} className="p-2 -ml-2 text-amber-500 active:opacity-50 shrink-0 mt-0.5">
          <ChevronLeft size={28} strokeWidth={2.6} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-[28px] font-bold tracking-tight leading-tight">{athlete?.name}</h1>
          <div className="flex items-center gap-2 flex-wrap mt-1.5">
            <span className="bg-slate-100 text-slate-700 text-xs font-medium px-2 py-0.5 rounded-full">
              {athlete?.auth_user_id ? 'Sportler-Account' : 'Vom Trainer verwaltet'}
            </span>
            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded-full">
              Read-only-Ansicht
            </span>
          </div>
        </div>
      </header>

      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-8 text-center text-slate-500 text-sm">
          Lade Daten…
        </div>
      )}
      {err && (
        <div className="bg-rose-50 border border-rose-200 text-rose-900 text-sm rounded-xl p-3">
          ✗ {err}
        </div>
      )}

      {!loading && !err && (
        <>
          {/* Top Stats — konsistente StatCards wie im Dashboard */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={Trophy}
              label={t('dashboard.bestScore')}
              value={bestComp ? bestComp.final.toFixed(2) : t('detail.noData')}
              sub={bestComp ? bestComp.c.name : '—'}
              color="amber"
            />
            <StatCard
              icon={Target}
              label={t('detail.competitions')}
              value={compRows.length}
              sub={compRows[0] ? t('dashboard.lastTrained', { date: formatDateShort(compRows[0].c.date) }) : t('detail.noData')}
              color="emerald"
            />
            <StatCard
              icon={Dumbbell}
              label={t('detail.sessions')}
              value={sessions.length}
              sub={lastSessionDate ? t('dashboard.lastTrained', { date: formatDateShort(lastSessionDate) }) : t('detail.noData')}
              color="sky"
            />
            <StatCard
              icon={BarChart3}
              label={t('nav.uebungen')}
              value={exerciseStats.length}
              sub={t('detail.attempts').toLowerCase()}
              color="violet"
            />
          </div>

          {/* Übungen */}
          {exerciseStats.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <TrendingUp size={18} className="text-slate-700" /> Übungen
              </h2>
              <IOSList>
                {exerciseStats.slice(0, 12).map(ex => (
                  <div key={ex.id} className="px-4 py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-[15px] truncate">{localizedExerciseName(ex) || t('nav.uebungen')}</div>
                      <div className="text-[13px] text-slate-500">
                        {ex.total} Serien · {ex.success} geklappt
                      </div>
                    </div>
                    <div className={'text-xl font-bold ' + (ex.rate >= 80 ? 'text-emerald-600' : ex.rate >= 60 ? 'text-amber-600' : 'text-rose-600')}>
                      {ex.rate}%
                    </div>
                  </div>
                ))}
              </IOSList>
            </section>
          )}

          {/* Wettkampf-Verlauf */}
          {compRows.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Trophy size={18} className="text-slate-700" /> Wettkämpfe
              </h2>
              <IOSList>
                {compRows.map(({ c, final }) => (
                  <div key={c.id} className="px-4 py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-[15px] truncate">{c.name}</div>
                      <div className="text-[13px] text-slate-500">
                        {formatDateShort(c.date)}{c.location ? ' · ' + c.location : ''}
                      </div>
                    </div>
                    <div className="text-xl font-bold text-amber-600">
                      {final.toFixed(2)}
                    </div>
                  </div>
                ))}
              </IOSList>
            </section>
          )}

          {sessions.length === 0 && competitions.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/60 p-8 text-center">
              <Sparkles size={32} className="mx-auto text-slate-300 mb-3" />
              <h3 className="font-semibold mb-1">Noch keine Daten</h3>
              <p className="text-sm text-slate-500">
                Dieser Sportler hat bisher weder Trainings noch Wettkämpfe eingetragen.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// =============================================================
// ADMIN — Account-Verwaltung (NUR für App-Owner sichtbar)
// =============================================================
// Diese Komponenten werden ausschließlich für info@neue-weberei.de
// gerendert. Die Edge-Function hat zusätzlich eine harte Allowlist,
// d. h. selbst wenn ein anderer User durch UI-Manipulation diese
// Komponente sieht, kann er keine Aktion ausführen.

function fmtDateTime(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' });
  } catch { return iso; }
}

function AdminUserPanel({ open, user, onClose, onMutated }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [info, setInfo] = useState('');
  const [actionLink, setActionLink] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState('');
  const [editEmail, setEditEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  // Reset nur bei echtem User-Wechsel (user.id ändert sich), NICHT bei
  // bloßem Refresh des gleichen Users (sonst würde der gerade gesetzte
  // actionLink nach onMutated→reload sofort wieder verschwinden).
  useEffect(() => {
    if (open && user) {
      setNewName(user.profile?.display_name || '');
      setNewEmail(user.email || '');
      setErr(''); setInfo(''); setActionLink('');
      setConfirmDelete(false); setEditName(false); setEditEmail(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user?.id]);

  if (!open || !user) return null;

  const isConfirmed = !!user.email_confirmed_at;
  const role = user.profile?.role || '—';
  const displayName = user.profile?.display_name || user.user_metadata?.display_name || '—';

  const run = async (label, fn) => {
    setBusy(true); setErr(''); setInfo(''); setActionLink('');
    try {
      const { data, error } = await fn();
      if (error) throw new Error(error.message);
      setInfo(label);
      if (data?.action_link) setActionLink(data.action_link);
      if (onMutated) await onMutated();
    } catch (e) {
      setErr(e.message || 'Aktion fehlgeschlagen');
    } finally { setBusy(false); }
  };

  const copyLink = async () => {
    if (!actionLink) return;
    try {
      await navigator.clipboard.writeText(actionLink);
      setInfo('Link in Zwischenablage kopiert');
    } catch {
      setErr('Konnte nicht in Zwischenablage kopieren');
    }
  };

  const doImpersonate = async () => {
    if (!confirm('Als „' + (user.email || user.id) + '" einloggen?\n\nDeine aktuelle Admin-Session wird beendet. Du musst dich danach selbst wieder neu einloggen.')) return;
    setBusy(true); setErr(''); setInfo(''); setActionLink('');
    try {
      const { data, error } = await adminCreateImpersonation(user.id);
      if (error) throw new Error(error.message);
      if (!data?.action_link) throw new Error('Kein Login-Link erhalten');
      // Eigene Session beenden, dann Link öffnen (Magic-Link loggt automatisch ein)
      await supabase.auth.signOut();
      window.location.href = data.action_link;
    } catch (e) {
      setErr(e.message || 'Impersonation fehlgeschlagen');
      setBusy(false);
    }
  };

  const doDelete = async () => {
    setBusy(true); setErr(''); setInfo('');
    try {
      const { error } = await adminDeleteUser(user.id);
      if (error) throw new Error(error.message);
      setInfo('User gelöscht');
      if (onMutated) await onMutated();
      onClose();
    } catch (e) {
      setErr(e.message || 'Löschen fehlgeschlagen');
    } finally { setBusy(false); }
  };

  const saveName = async () => {
    if (!newName.trim()) { setErr('Name darf nicht leer sein'); return; }
    await run('Anzeigename gespeichert', () => adminSetDisplayName(user.id, newName.trim()));
    setEditName(false);
  };

  const saveEmail = async () => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(newEmail.trim())) { setErr('E-Mail ungültig'); return; }
    await run('E-Mail geändert', () => adminUpdateEmail(user.id, newEmail.trim(), false));
    setEditEmail(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#F2F2F7] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-[#F2F2F7]/95 backdrop-blur-xl px-4 py-3 flex items-center justify-between z-10 border-b border-[#C6C6C8]/40">
          <button onClick={onClose} className="text-[17px] text-[#FF9500] active:opacity-60 px-1 flex items-center gap-1">
            <ChevronLeft size={20} strokeWidth={2.6} /> Zurück
          </button>
          <h3 className="font-semibold text-[17px]">Admin · Account</h3>
          <span className="w-12" />
        </div>

        <div className="px-3 py-4 space-y-5">
          {/* Identität */}
          <IOSList header="Account">
            <div className="px-4 py-3 flex items-center justify-between gap-3">
              <span className="text-[15px] text-[#3C3C43]">E-Mail</span>
              {editEmail ? (
                <div className="flex items-center gap-2 flex-1 ml-3">
                  <input value={newEmail} onChange={e => setNewEmail(e.target.value)} type="email"
                    className="flex-1 bg-white border border-slate-300 rounded-lg px-2 py-1 text-[13px] outline-none" />
                  <button onClick={saveEmail} disabled={busy} className="text-[13px] text-[#FF9500] font-medium">OK</button>
                  <button onClick={() => setEditEmail(false)} className="text-[13px] text-[#8E8E93]">×</button>
                </div>
              ) : (
                <button onClick={() => setEditEmail(true)} className="text-[15px] text-right truncate ml-3 active:opacity-60">
                  {user.email || '—'}
                </button>
              )}
            </div>
            <div className="px-4 py-3 flex items-center justify-between gap-3">
              <span className="text-[15px] text-[#3C3C43]">Name</span>
              {editName ? (
                <div className="flex items-center gap-2 flex-1 ml-3">
                  <input value={newName} onChange={e => setNewName(e.target.value)}
                    className="flex-1 bg-white border border-slate-300 rounded-lg px-2 py-1 text-[13px] outline-none" />
                  <button onClick={saveName} disabled={busy} className="text-[13px] text-[#FF9500] font-medium">OK</button>
                  <button onClick={() => setEditName(false)} className="text-[13px] text-[#8E8E93]">×</button>
                </div>
              ) : (
                <button onClick={() => setEditName(true)} className="text-[15px] text-right truncate ml-3 active:opacity-60">
                  {displayName}
                </button>
              )}
            </div>
            <div className="px-4 py-3 flex items-center justify-between gap-3">
              <span className="text-[15px] text-[#3C3C43]">Rolle</span>
              <div className="flex gap-1">
                {['athlete', 'coach', 'admin'].map(r => (
                  <button key={r} onClick={() => run('Rolle gesetzt: ' + r, () => adminSetRole(user.id, r))}
                    disabled={busy || role === r}
                    className={'text-[12px] px-2.5 py-1 rounded-full font-medium ' + (role === r
                      ? 'bg-[#FF9500] text-white'
                      : 'bg-white border border-slate-300 text-slate-700 active:opacity-60')}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="px-4 py-3 flex items-center justify-between gap-3">
              <span className="text-[15px] text-[#3C3C43]">Status</span>
              <span className="text-[13px]">
                {isConfirmed
                  ? <IOSTag color="green">bestätigt {fmtDateTime(user.email_confirmed_at)}</IOSTag>
                  : <IOSTag color="orange">noch nicht bestätigt</IOSTag>}
              </span>
            </div>
            <div className="px-4 py-3 flex items-center justify-between gap-3">
              <span className="text-[15px] text-[#3C3C43]">Registriert</span>
              <span className="text-[13px] text-[#8E8E93]">{fmtDateTime(user.created_at)}</span>
            </div>
            <div className="px-4 py-3 flex items-center justify-between gap-3">
              <span className="text-[15px] text-[#3C3C43]">Letzter Login</span>
              <span className="text-[13px] text-[#8E8E93]">{fmtDateTime(user.last_sign_in_at)}</span>
            </div>
            <div className="px-4 py-3 flex items-center justify-between gap-3">
              <span className="text-[15px] text-[#3C3C43]">User-ID</span>
              <button onClick={() => { navigator.clipboard.writeText(user.id); setInfo('User-ID kopiert'); }}
                className="text-[11px] font-mono text-[#8E8E93] truncate ml-3 active:opacity-60 max-w-[180px]">
                {user.id}
              </button>
            </div>
          </IOSList>

          {/* Mail-Aktionen */}
          <IOSList header="Mail-Aktionen" footer={'„Action-Link" ist auch ohne Mail-Empfang nutzbar — kannst du direkt an Simon weitergeben.'}>
            {!isConfirmed && (
              <button onClick={() => run('Bestätigungs-Mail erneut verschickt', () => adminResendConfirmation({ user_id: user.id }))}
                disabled={busy}
                className="w-full px-4 py-3 flex items-center gap-3 text-left active:bg-[#D1D1D6]/40 disabled:opacity-50">
                <MailCheck size={18} className="text-[#FF9500]" />
                <span className="text-[15px]">Bestätigungs-Mail erneut senden</span>
              </button>
            )}
            {!isConfirmed && (
              <button onClick={() => run('E-Mail manuell bestätigt', () => adminConfirmEmail(user.id))}
                disabled={busy}
                className="w-full px-4 py-3 flex items-center gap-3 text-left active:bg-[#D1D1D6]/40 disabled:opacity-50">
                <Check size={18} className="text-[#34C759]" />
                <span className="text-[15px]">E-Mail manuell als bestätigt markieren</span>
              </button>
            )}
            <button onClick={() => run('Magic-Link erzeugt', () => adminSendMagicLink({ user_id: user.id }))}
              disabled={busy}
              className="w-full px-4 py-3 flex items-center gap-3 text-left active:bg-[#D1D1D6]/40 disabled:opacity-50">
              <KeyRound size={18} className="text-[#007AFF]" />
              <span className="text-[15px]">Magic-Login-Link erzeugen</span>
            </button>
            <button onClick={() => run('Passwort-Reset-Mail erzeugt', () => adminSendPasswordReset({ user_id: user.id }))}
              disabled={busy}
              className="w-full px-4 py-3 flex items-center gap-3 text-left active:bg-[#D1D1D6]/40 disabled:opacity-50">
              <RefreshCw size={18} className="text-[#007AFF]" />
              <span className="text-[15px]">Passwort-Reset-Link senden</span>
            </button>
          </IOSList>

          {/* Action-Link Anzeige */}
          {actionLink && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 space-y-2">
              <div className="text-[12px] font-semibold text-amber-900 uppercase tracking-wide">Action-Link</div>
              <div className="text-[11px] font-mono text-amber-900 break-all">{actionLink}</div>
              <div className="flex gap-2">
                <button onClick={copyLink} className="flex-1 bg-white border border-amber-300 px-3 py-1.5 rounded-full text-[12px] font-medium flex items-center justify-center gap-1.5 active:opacity-60">
                  <Copy size={12} /> Kopieren
                </button>
                <a href={actionLink} target="_blank" rel="noopener noreferrer"
                  className="flex-1 bg-amber-600 text-white px-3 py-1.5 rounded-full text-[12px] font-medium flex items-center justify-center gap-1.5 active:opacity-60">
                  <ExternalLink size={12} /> Öffnen
                </a>
              </div>
            </div>
          )}

          {/* Gefährliche Aktionen */}
          <IOSList header="Power-User" footer="Impersonation: Du wirst ausgeloggt und automatisch als Ziel-User eingeloggt — danach musst du dich selbst wieder neu anmelden.">
            <button onClick={doImpersonate} disabled={busy}
              className="w-full px-4 py-3 flex items-center gap-3 text-left active:bg-[#D1D1D6]/40 disabled:opacity-50">
              <Crown size={18} className="text-[#FF9500]" />
              <span className="text-[15px]">Als dieser User einloggen</span>
            </button>
            <button onClick={() => setConfirmDelete(true)} disabled={busy}
              className="w-full px-4 py-3 flex items-center gap-3 text-left active:bg-[#D1D1D6]/40 disabled:opacity-50">
              <UserX size={18} className="text-[#FF3B30]" />
              <span className="text-[15px] text-[#FF3B30]">Account komplett löschen</span>
            </button>
          </IOSList>

          {/* Verknüpfte Athleten */}
          {user.athletes && user.athletes.length > 0 && (
            <IOSList header="Verknüpfte Sportler">
              {user.athletes.map(a => (
                <div key={a.id + a.link} className="px-4 py-3 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] truncate">{a.name}</div>
                    <div className="text-[12px] text-[#8E8E93]">
                      {a.link === 'self' ? 'eigener Sportler-Eintrag' : 'vom User als Trainer angelegt'}
                    </div>
                  </div>
                  <IOSTag color={a.link === 'self' ? 'blue' : 'purple'}>
                    {a.link === 'self' ? 'self' : 'coach'}
                  </IOSTag>
                </div>
              ))}
            </IOSList>
          )}

          {/* Feedback */}
          {err && (
            <div className="bg-rose-50 border border-rose-200 text-rose-900 text-sm rounded-xl p-3">✗ {err}</div>
          )}
          {info && !err && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm rounded-xl p-3">✓ {info}</div>
          )}
        </div>

        {/* Delete-Confirm */}
        {confirmDelete && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" onClick={() => setConfirmDelete(false)}>
            <div className="bg-white rounded-3xl p-5 max-w-sm w-full" onClick={e => e.stopPropagation()}>
              <h3 className="font-semibold text-[17px] mb-2">Account löschen?</h3>
              <p className="text-[14px] text-[#8E8E93] mb-4">
                „{user.email}" wird endgültig gelöscht. Alle verknüpften Sportler-Einträge, Sessions, Wettkämpfe etc. werden via Cascade ebenfalls entfernt. Das ist nicht rückgängig zu machen.
              </p>
              <div className="flex gap-2">
                <button onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 font-medium text-sm">Abbrechen</button>
                <button onClick={() => { setConfirmDelete(false); doDelete(); }}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-medium text-sm">Löschen</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminAccountsView({ open, onClose, initialFilter = '', autoOpenUserId = null }) {
  const [users, setUsers] = useState(null);
  const [err, setErr] = useState('');
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all|unconfirmed|orphan
  const [selectedUser, setSelectedUser] = useState(null);

  const reload = useCallback(async () => {
    setErr('');
    const { data, error } = await adminListUsers();
    if (error) { setErr(error.message); setUsers([]); return; }
    setUsers(data?.users || []);
  }, []);

  useEffect(() => { if (open) { setFilter(initialFilter); reload(); } }, [open, initialFilter, reload]);

  // Auto-open Panel wenn autoOpenUserId gesetzt und User in Liste gefunden
  useEffect(() => {
    if (autoOpenUserId && users) {
      const hit = users.find(u => u.id === autoOpenUserId);
      if (hit) setSelectedUser(hit);
    }
  }, [autoOpenUserId, users]);

  // Selected-User nach reload mit fresher Version aus der Liste ersetzen
  useEffect(() => {
    if (selectedUser && users) {
      const fresh = users.find(u => u.id === selectedUser.id);
      if (fresh && fresh !== selectedUser) setSelectedUser(fresh);
    }
  }, [users]);  // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;

  const filtered = (users || []).filter(u => {
    if (statusFilter === 'unconfirmed' && u.email_confirmed_at) return false;
    if (statusFilter === 'orphan' && (u.athletes && u.athletes.length > 0)) return false;
    if (!filter.trim()) return true;
    const q = filter.toLowerCase();
    return (u.email || '').toLowerCase().includes(q)
      || (u.profile?.display_name || '').toLowerCase().includes(q)
      || u.id.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-40 bg-[#F2F2F7] flex flex-col"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="bg-[#F2F2F7]/95 backdrop-blur-xl px-4 py-3 flex items-center justify-between z-10 border-b border-[#C6C6C8]/40">
        <button onClick={onClose} className="text-[17px] text-[#FF9500] active:opacity-60 px-1 flex items-center gap-1">
          <ChevronLeft size={20} strokeWidth={2.6} /> Zurück
        </button>
        <h3 className="font-semibold text-[17px]">Alle Accounts</h3>
        <button onClick={reload} className="text-[#007AFF] active:opacity-60 px-1">
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
        {/* Suche + Filter */}
        <div className="bg-white rounded-2xl px-3 py-2 flex items-center gap-2">
          <Search size={16} className="text-[#8E8E93]" />
          <input value={filter} onChange={e => setFilter(e.target.value)}
            placeholder="E-Mail, Name oder ID suchen…"
            className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-[#C7C7CC]" />
        </div>
        <div className="bg-[#E5E5EA] rounded-2xl p-1 flex gap-1 text-[13px]">
          {[
            { id: 'all', label: 'Alle' },
            { id: 'unconfirmed', label: 'Unbestätigt' },
            { id: 'orphan', label: 'Ohne Sportler' },
          ].map(f => (
            <button key={f.id} onClick={() => setStatusFilter(f.id)}
              className={'flex-1 px-3 py-1.5 rounded-xl font-medium ' + (statusFilter === f.id ? 'bg-white shadow-sm' : 'text-[#3C3C43] active:opacity-60')}>
              {f.label}
            </button>
          ))}
        </div>

        {err && (
          <div className="bg-rose-50 border border-rose-200 text-rose-900 text-sm rounded-xl p-3">✗ {err}</div>
        )}

        {users === null ? (
          <div className="text-center py-12 text-[#8E8E93]">
            <Loader2 size={20} className="animate-spin mx-auto mb-2" /> Lade Accounts…
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-[#8E8E93]">Keine Accounts gefunden.</div>
        ) : (
          <IOSList header={`${filtered.length} Account${filtered.length === 1 ? '' : 's'}`}>
            {filtered.map(u => {
              const isConfirmed = !!u.email_confirmed_at;
              const role = u.profile?.role || 'athlete';
              return (
                <button key={u.id} onClick={() => setSelectedUser(u)}
                  className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left active:bg-[#D1D1D6]/40">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[15px] font-medium truncate">{u.profile?.display_name || u.email || u.id.slice(0, 8)}</span>
                      {!isConfirmed && <IOSTag color="orange">unbestätigt</IOSTag>}
                      {role === 'admin' && <IOSTag color="orange">admin</IOSTag>}
                      {role === 'coach' && <IOSTag color="purple">coach</IOSTag>}
                      {u.athletes && u.athletes.length > 0 && (
                        <IOSTag color="blue">{u.athletes.length} Sportler</IOSTag>
                      )}
                    </div>
                    <div className="text-[13px] text-[#8E8E93] truncate mt-0.5">{u.email}</div>
                    <div className="text-[11px] text-[#C7C7CC] mt-0.5">
                      Reg. {fmtDateTime(u.created_at)} · Login {fmtDateTime(u.last_sign_in_at)}
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-[#C7C7CC] shrink-0" />
                </button>
              );
            })}
          </IOSList>
        )}
      </div>

      <AdminUserPanel
        open={!!selectedUser}
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onMutated={reload}
      />
    </div>
  );
}

function SportlerView({ profile, session, athletes, profiles, refreshAthletes, ownData, onPickAthlete, myAthleteId }) {
  const { t } = useI18n();
  // ALLE Hooks MÜSSEN vor dem ersten conditional return aufgerufen werden
  // (Rules-of-Hooks). Nach dem viewingAthlete-Early-Return waren ehemals
  // weitere useState-Calls — das hat den weißen-Bildschirm-Crash erzeugt.
  const profileById = useMemo(() => {
    const m = new Map();
    (profiles || []).forEach(p => m.set(p.id, p));
    return m;
  }, [profiles]);
  const [editing, setEditing] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [info, setInfo] = useState('');
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [redeemCode, setRedeemCode] = useState('');
  // Owner-only Admin-UI State
  const [showAdminAccounts, setShowAdminAccounts] = useState(false);
  const [adminPrefilter, setAdminPrefilter] = useState('');
  const [adminPreselectUserId, setAdminPreselectUserId] = useState(null);

  // „Daten ansehen" auf einem Athleten → wechselt die ganze App in die
  // Sicht dieses Athleten (Dashboard/Training/Wettkampf/Übungen zeigen
  // dessen Daten). Trainer können dann sogar Sessions/Wettkämpfe FÜR
  // diesen Sportler erfassen (RLS lässt durch, wenn `created_by_coach_id`
  // den Trainer enthält).

  // Owner = harter Email-Check. NUR für Ruben sichtbar.
  // Selbst wenn jemand anders versehentlich profiles.role = 'admin' bekommt,
  // sieht er hier nichts — und die Edge-Function lehnt seine Calls eh ab.
  const isOwner = isAppOwner(session);
  const isAdmin = profile?.role === 'admin';
  const isCoach = profile?.role === 'coach' || isAdmin;

  const openAdminFor = (a) => {
    // Per-Athlet Admin-Panel: wir öffnen die Account-Übersicht und
    // filtern auf die Athleten-Email (oder, wenn verknüpft, auf die User-ID).
    setAdminPrefilter(a.email || a.name || '');
    setAdminPreselectUserId(a.auth_user_id || null);
    setShowAdminAccounts(true);
  };
  const myUserId = session?.user?.id;
  const myAthlete = athletes.find(a => a.auth_user_id === myUserId);
  const managedAthletes = athletes.filter(a => a.created_by_coach_id === myUserId && a.id !== (myAthlete?.id));
  const otherAthletesAdminView = isAdmin
    ? athletes.filter(a => a.id !== (myAthlete?.id) && a.created_by_coach_id !== myUserId)
    : [];

  const onGenerateCode = async (athleteId) => {
    setBusy(true); setErr(''); setInfo('');
    const { error } = await generateClaimCodeForAthlete(athleteId);
    if (error) setErr(error.message);
    else setInfo('Code generiert. Gib ihn an den Sportler weiter.');
    await refreshAthletes();
    setBusy(false);
  };

  const onClearCode = async (athleteId) => {
    if (!confirm('Code zurückziehen? Wer den alten Code hat, kann sich dann nicht mehr verknüpfen.')) return;
    setBusy(true); setErr(''); setInfo('');
    const { error } = await clearClaimCodeForAthlete(athleteId);
    if (error) setErr(error.message);
    else setInfo('Code wurde widerrufen.');
    await refreshAthletes();
    setBusy(false);
  };

  // Sportler löst Trainer-Verknüpfung UND generiert direkt neuen Code,
  // damit ein anderer Trainer einlösen kann. Die redeem-RPC würde sonst
  // mit „bereits mit Trainer verknüpft" abblocken.
  const onSwitchCoach = async (athleteId, coachName) => {
    if (!confirm('Aktuellen Trainer (' + (coachName || '—') + ') entfernen und neuen Code generieren?\n\nDer bisherige Trainer hat danach keinen Zugriff mehr auf deine Daten.')) return;
    setBusy(true); setErr(''); setInfo('');
    const { error: revokeErr } = await updateAthlete(athleteId, { created_by_coach_id: null });
    if (revokeErr) { setErr(revokeErr.message); setBusy(false); return; }
    const { error: codeErr } = await generateClaimCodeForAthlete(athleteId);
    if (codeErr) { setErr(codeErr.message); setBusy(false); return; }
    setInfo('Neuer Code generiert — gib ihn deinem neuen Trainer weiter.');
    await refreshAthletes();
    setBusy(false);
  };

  const onRedeemCode = async () => {
    if (!redeemCode.trim()) return;
    setBusy(true); setErr(''); setInfo('');
    const { data, error } = await redeemAthleteCode(redeemCode.trim());
    if (error) {
      setErr(error.message);
    } else if (data) {
      const role = data.role_granted === 'coach' ? 'als Trainer' : 'als Sportler';
      setInfo('✓ „' + data.athlete_name + '" wurde verknüpft (' + role + ').');
      setShowRedeemModal(false);
      setRedeemCode('');
    }
    await refreshAthletes();
    setBusy(false);
  };

  const onSaveAthlete = async (formData) => {
    setBusy(true); setErr('');
    try {
      if (formData.id) {
        const { error } = await updateAthlete(formData.id, {
          name: formData.name, type: formData.type, notes: formData.notes, email: formData.email
        });
        if (error) throw error;
      } else {
        const { error } = await createAthlete(formData);
        if (error) throw error;
      }
      await refreshAthletes();
      setShowNew(false); setEditing(null);
    } catch (e) {
      setErr(e.message || 'Speichern fehlgeschlagen');
    } finally { setBusy(false); }
  };

  const onDeleteAthlete = async (a) => {
    if (!confirm('Sportler „' + a.name + '" wirklich löschen?\n\nTrainings/Wettkämpfe von diesem Sportler bleiben in deinen Daten erhalten, sind aber nicht mehr zugeordnet.')) return;
    setBusy(true); setErr('');
    const { error } = await deleteAthlete(a.id);
    if (error) setErr(error.message);
    await refreshAthletes();
    setBusy(false);
  };

  const renderAthleteCard = (a, badges) => {
    const isMine = a.auth_user_id === myUserId;
    const isManagedByMe = a.created_by_coach_id === myUserId;
    const linkedToUser = !!a.auth_user_id;
    const linkedToCoach = !!a.created_by_coach_id;
    const canEdit = isMine || isManagedByMe || isAdmin;
    const canDelete = isManagedByMe || isAdmin;
    // Wer kann Code generieren?
    // - Trainer/Admin auf einem managed Athleten ohne Account → für Sportler-Claim
    // - Sportler auf seinem eigenen Eintrag ohne Coach → um Trainer einzuladen
    const canGenerateCode =
      (isManagedByMe && !linkedToUser) ||
      (isMine && !linkedToCoach);
    return (
      <div key={a.id} className="px-4 py-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-medium text-[15px] text-[#000] truncate">{a.name}</h3>
              <IOSTag color={a.type === 'team' ? 'blue' : 'gray'}>
                {a.type === 'team' ? t('athletes.tagTeam') : t('athletes.tagAthlete')}
              </IOSTag>
              {badges}
              {linkedToUser ? (
                <IOSTag color="green">{t('athletes.tagOwnAccount')}</IOSTag>
              ) : (
                <IOSTag color="orange">{t('athletes.tagNoAccount')}</IOSTag>
              )}
              {linkedToCoach && (() => {
                const coach = profileById.get(a.created_by_coach_id);
                const coachName = coach?.display_name || t('role.coach');
                if (isMine) {
                  return <IOSTag color="purple">{t('athletes.tagCoach', { name: coachName })}</IOSTag>;
                }
                return isManagedByMe
                  ? <IOSTag color="blue">{t('athletes.tagByMe')}</IOSTag>
                  : <IOSTag color="purple">{coachName}</IOSTag>;
              })()}
            </div>
            {a.email && <div className="text-[13px] text-[#8E8E93] mt-1 truncate">{a.email}</div>}
            {a.notes && <div className="text-[13px] text-[#8E8E93] mt-0.5 truncate">{a.notes}</div>}
            {a.claim_code && (
              <div className="text-[12px] mt-2 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
                <div className="text-amber-900 font-medium mb-0.5">{t('athletes.claimCodePending')}</div>
                <div className="font-mono text-base text-amber-900 tracking-wider">{a.claim_code}</div>
                <div className="text-[11px] text-amber-700 mt-0.5">
                  {!linkedToUser
                    ? t('athletes.claimCodeAthleteHint')
                    : t('athletes.claimCodeCoachHint')}
                </div>
              </div>
            )}
          </div>
          {(canEdit || isOwner) && (
            <div className="flex gap-1">
              {isOwner && (linkedToUser || a.email) && (
                <button onClick={() => openAdminFor(a)}
                  className="p-2 text-[#FF9500] active:bg-[#D1D1D6]/40 rounded-full"
                  title="Admin: Account verwalten">
                  <Crown size={16} />
                </button>
              )}
              {canEdit && (
                <button onClick={() => setEditing(a)}
                  className="p-2 text-[#007AFF] active:bg-[#D1D1D6]/40 rounded-full">
                  <Edit2 size={16} />
                </button>
              )}
              {canDelete && (
                <button onClick={() => onDeleteAthlete(a)}
                  className="p-2 text-[#FF3B30] active:bg-[#D1D1D6]/40 rounded-full">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          )}
        </div>
        <div className="mt-2 flex gap-2 flex-wrap items-center">
          {/* "Daten ansehen / verwalten" → wechselt die ganze App in die
              Sicht dieses Athleten (Trainer arbeitet dann FÜR ihn). */}
          {!isMine && (isManagedByMe || isAdmin) && onPickAthlete && (
            <button onClick={() => onPickAthlete(a.id)}
              className="text-[13px] bg-slate-100 text-slate-800 px-3 py-1.5 rounded-full font-medium active:opacity-70 flex items-center gap-1.5">
              <BarChart3 size={13} /> {t('athletes.viewData')}
            </button>
          )}
          {canGenerateCode && (
            a.claim_code ? (
              <button onClick={() => onClearCode(a.id)} disabled={busy}
                className="text-[13px] text-[#FF3B30] px-2 py-1 active:opacity-70 font-medium">
                {t('athletes.revokeCode')}
              </button>
            ) : (
              <button onClick={() => onGenerateCode(a.id)} disabled={busy}
                className="text-[13px] bg-amber-100 text-amber-900 px-3 py-1.5 rounded-full font-medium active:opacity-70 flex items-center gap-1.5">
                <KeyRound size={13} /> {!linkedToUser ? t('athletes.generateCodeForAthlete') : t('athletes.inviteCoach')}
              </button>
            )
          )}
          {/* Sportler mit bestehender Trainer-Verknüpfung: Trainer wechseln */}
          {isMine && linkedToCoach && !a.claim_code && (() => {
            const coach = profileById.get(a.created_by_coach_id);
            return (
              <button onClick={() => onSwitchCoach(a.id, coach?.display_name)} disabled={busy}
                className="text-[13px] bg-amber-100 text-amber-900 px-3 py-1.5 rounded-full font-medium active:opacity-70 flex items-center gap-1.5">
                <KeyRound size={13} /> Trainer wechseln
              </button>
            );
          })()}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <header className="flex items-end justify-between flex-wrap gap-3 pt-2 px-1">
        <div>
          <h1 className="text-[34px] font-bold tracking-tight leading-none">{t('athletes.title')}</h1>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => { setShowRedeemModal(true); setRedeemCode(''); }}
            className="bg-white border border-slate-300 px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-1.5 active:scale-95 transition">
            <KeyRound size={16} /> {t('athletes.redeemCode')}
          </button>
          {isCoach && (
            <button onClick={() => setShowNew(true)}
              className="bg-slate-900 text-white px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-1.5 shadow-sm active:scale-95 transition">
              <Plus size={16} /> {t('athletes.createAthlete')}
            </button>
          )}
        </div>
      </header>

      <div className="bg-sky-50/80 backdrop-blur rounded-2xl p-4 text-sm text-sky-900">
        <div className="flex gap-2 items-start">
          <Info size={18} className="shrink-0 mt-0.5" />
          <div>
            <strong>{t('athletes.codesInfoTitle')}</strong>
            <ul className="list-disc ml-4 mt-1 space-y-0.5 text-[13px]">
              <li><strong>{t('role.coach')}</strong> {t('athletes.codesInfoCoachLine')}</li>
              <li><strong>{t('role.athlete')}</strong> {t('athletes.codesInfoAthleteLine')}</li>
            </ul>
          </div>
        </div>
      </div>

      {err && (
        <div className="bg-rose-50 border border-rose-200 text-rose-900 text-sm rounded-xl p-3">
          ✗ {err}
        </div>
      )}
      {info && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm rounded-xl p-3">
          {info}
        </div>
      )}

      {/* Eigener Sportler-Eintrag */}
      {myAthlete && (
        <IOSList header={t('athletes.sectionMyProfile')}>
          {renderAthleteCard(myAthlete, <IOSTag color="blue">{t('athletes.tagMe')}</IOSTag>)}
        </IOSList>
      )}

      {/* Vom User verwaltete Sportler */}
      {managedAthletes.length > 0 && (
        <IOSList header={t('athletes.sectionManagedByMe')}>
          {managedAthletes.map(a => renderAthleteCard(a, null))}
        </IOSList>
      )}

      {/* Admin-Sicht: alle anderen */}
      {isAdmin && otherAthletesAdminView.length > 0 && (
        <IOSList header={t('athletes.sectionAdminOthers')}>
          {otherAthletesAdminView.map(a => renderAthleteCard(a, null))}
        </IOSList>
      )}

      {(managedAthletes.length === 0 && !myAthlete) && (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-8 text-center">
          <Users size={32} className="mx-auto text-slate-300 mb-3" />
          <h3 className="font-semibold mb-1">{t('athletes.empty')}</h3>
          <p className="text-sm text-slate-500 mb-4">{t('athletes.emptyHint')}</p>
          <button onClick={() => setShowNew(true)}
            className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium">
            {t('athletes.createAthlete')}
          </button>
        </div>
      )}

      <AthleteEditor
        open={showNew || !!editing}
        athlete={editing}
        busy={busy}
        onClose={() => { setShowNew(false); setEditing(null); setErr(''); }}
        onSave={onSaveAthlete}
      />

      {/* Redeem-Code Modal */}
      {showRedeemModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40"
          onClick={() => setShowRedeemModal(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-semibold text-lg">{t('athletes.redeemModalTitle')}</h3>
              <button onClick={() => setShowRedeemModal(false)} className="p-2 -m-2 text-slate-500"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-slate-600">
                {t('athletes.redeemModalHint')}
              </p>
              <input
                type="text"
                value={redeemCode}
                onChange={e => setRedeemCode(e.target.value.toUpperCase())}
                placeholder={t('athletes.redeemPlaceholder')}
                maxLength={8}
                autoFocus
                inputMode="latin"
                autoCapitalize="characters"
                style={{ fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}
                className="w-full px-3 py-3 text-center text-xl tracking-widest border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 uppercase" />
              {err && (
                <div className="bg-rose-50 border border-rose-200 text-rose-900 text-sm rounded-xl p-3">
                  ✗ {err}
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={() => setShowRedeemModal(false)}
                  className="flex-1 bg-white border border-slate-300 px-5 py-3 rounded-xl font-medium">
                  {t('common.cancel')}
                </button>
                <button onClick={onRedeemCode} disabled={busy || !redeemCode.trim()}
                  className="flex-1 bg-emerald-600 text-white px-5 py-3 rounded-xl font-medium disabled:opacity-50">
                  {busy ? '…' : t('athletes.redeem')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Owner-only Admin-Account-Übersicht */}
      {isOwner && (
        <AdminAccountsView
          open={showAdminAccounts}
          onClose={() => { setShowAdminAccounts(false); setAdminPreselectUserId(null); setAdminPrefilter(''); }}
          initialFilter={adminPrefilter}
          autoOpenUserId={adminPreselectUserId}
        />
      )}
    </div>
  );
}

function AthleteEditor({ open, athlete, onClose, onSave, busy = false }) {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [type, setType] = useState('athlete');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (athlete) {
      setName(athlete.name);
      setType(athlete.type || 'athlete');
      setNotes(athlete.notes || '');
    } else {
      setName(''); setType('athlete'); setNotes('');
    }
  }, [athlete, open]);

  if (!open) return null;

  const canSave = name.trim().length > 0 && !busy;
  const doSave = () => canSave && onSave({
    id: athlete && athlete.id ? athlete.id : null,
    name: name.trim(),
    type,
    notes,
    email: (athlete && athlete.email) || ''
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#F2F2F7] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* iOS Header: Cancel | Title | Save */}
        <div className="sticky top-0 bg-[#F2F2F7]/95 backdrop-blur-xl px-4 py-3 flex items-center justify-between z-10">
          <button onClick={onClose} className="text-[17px] text-[#007AFF] active:opacity-60 px-1">
            {t('common.cancel')}
          </button>
          <h3 className="font-semibold text-[17px]">{athlete ? t('athletes.editorTitleEdit') : t('athletes.editorTitleNew')}</h3>
          <button onClick={doSave} disabled={!canSave}
            className="text-[17px] text-[#FF9500] font-semibold active:opacity-60 disabled:opacity-30 px-1">
            {busy ? '…' : t('common.done')}
          </button>
        </div>

        <div className="px-3 py-4 space-y-5">
          {/* Name + Typ */}
          <IOSList header={t('athletes.typeAthlete')}>
            <div className="px-4 py-3 flex items-center gap-3">
              <label className="text-[15px] text-[#3C3C43] w-20 shrink-0">{t('athletes.editorName')}</label>
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder={t('athletes.editorNamePlaceholder')} autoFocus
                className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-[#C7C7CC]" />
            </div>
            <div className="px-4 py-3 flex items-center gap-3">
              <label className="text-[15px] text-[#3C3C43] w-20 shrink-0">{t('athletes.type')}</label>
              <select value={type} onChange={e => setType(e.target.value)}
                className="flex-1 bg-transparent text-[15px] outline-none appearance-none">
                <option value="athlete">{t('athletes.typeAthlete')}</option>
                <option value="team">{t('athletes.typeTeam')}</option>
              </select>
              <ChevronRight size={16} className="text-[#C7C7CC] rotate-90 shrink-0" />
            </div>
          </IOSList>

          {/* Verein / Notizen */}
          <IOSList header={t('athletes.notes')}>
            <div className="px-4 py-3">
              <input value={notes} onChange={e => setNotes(e.target.value)}
                placeholder={t('athletes.notesPlaceholder')}
                className="w-full bg-transparent text-[15px] outline-none placeholder:text-[#C7C7CC]" />
            </div>
          </IOSList>
        </div>
      </div>
    </div>
  );
}

function InviteModal({ open, athlete, onClose, onInvite }) {
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (athlete && athlete._new) setEmail('');
    else if (athlete && athlete.email) setEmail(athlete.email);
    setErr(''); setCopied(false);
  }, [athlete]);

  if (!open || !athlete) return null;

  const hasInvite = athlete.invite_status === 'invited' && !athlete._new;

  const submit = () => {
    const e = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) { setErr('Bitte gültige E-Mail eingeben.'); return; }
    setErr('');
    onInvite(e);
  };

  const shareText = hasInvite
    ? 'Hi ' + athlete.name + ', du wurdest zu ArtCyc Coach eingeladen.\n\nE-Mail: ' + athlete.email + '\nCode: ' + athlete.login_code + '\n\nDamit kannst du dich einloggen.'
    : '';

  const copyShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between rounded-t-3xl sm:rounded-t-2xl z-10">
          <h3 className="font-semibold text-lg">
            {hasInvite ? 'Einladung für ' + athlete.name : athlete.name + ' einladen'}
          </h3>
          <button onClick={onClose} className="p-2 -m-2 text-slate-500"><X size={20} /></button>
        </div>
        <div className="p-5">
          {hasInvite ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">Teile diese Zugangsdaten:</p>
              <div className="bg-slate-900 text-white rounded-xl p-4 font-mono text-sm space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-400 text-xs">E-Mail:</span>
                  <span className="font-semibold truncate">{athlete.email}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-400 text-xs">Code:</span>
                  <span className="font-bold text-lg tracking-wider text-amber-400">{athlete.login_code}</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-slate-600">Als Nachricht kopieren:</span>
                  <button onClick={copyShare}
                    className="text-xs text-slate-500 hover:text-slate-900 px-2 py-1 rounded-lg hover:bg-slate-100">
                    {copied ? 'Kopiert!' : 'Kopieren'}
                  </button>
                </div>
                <pre className="text-xs text-slate-600 whitespace-pre-wrap font-sans">{shareText}</pre>
              </div>
              <button onClick={onClose}
                className="w-full bg-white border border-slate-300 px-5 py-3 rounded-xl font-medium">
                Schließen
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                E-Mail eingeben, mit der <strong>{athlete.name}</strong> sich einloggen soll.
              </p>
              <div>
                <label className="text-sm font-medium block mb-1.5">E-Mail</label>
                <input value={email} onChange={e => setEmail(e.target.value)}
                  type="email" placeholder="sportler@beispiel.de" autoFocus
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              {err && <p className="text-rose-600 text-sm">{err}</p>}
              <div className="flex gap-2 pt-2">
                <button onClick={onClose} className="flex-1 bg-white border border-slate-300 px-5 py-3 rounded-xl font-medium">
                  Abbrechen
                </button>
                <button onClick={submit}
                  className="flex-1 bg-slate-900 text-white px-5 py-3 rounded-xl font-medium">
                  Einladen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================================
// EXPORT
// =============================================================
function ExportView({ data, setView }) {
  const { t } = useI18n();
  const [tab, setTab] = useState('wettkampf');
  return (
    <div className="space-y-5">
      <header className="pt-2 px-1">
        {setView && (
          <button onClick={() => setView('einstellungen')}
            className="text-[15px] text-[#007AFF] flex items-center -ml-1 active:opacity-60 mb-1">
            <ChevronLeft size={20} strokeWidth={2.6} className="text-[#FF9500]" /> {t('common.back')}
          </button>
        )}
        <h1 className="text-[34px] font-bold tracking-tight leading-none">{t('nav.export')}</h1>
        <p className="text-[#8E8E93] text-[15px] mt-1">{t('export.subtitle')}</p>
      </header>

      {/* iOS-style Segmented Control */}
      <div className="bg-[#E5E5EA] rounded-xl p-1 flex gap-1">
        <button onClick={() => setTab('wettkampf')}
          className={'flex-1 py-1.5 rounded-lg font-medium text-sm transition ' +
            (tab === 'wettkampf' ? 'ios-seg-active' : 'text-[#3C3C43] active:opacity-70')}>
          <span className="inline-flex items-center gap-1.5 justify-center">
            <Trophy size={14} /> {t('nav.wettkampf')}
          </span>
        </button>
        <button onClick={() => setTab('training')}
          className={'flex-1 py-1.5 rounded-lg font-medium text-sm transition ' +
            (tab === 'training' ? 'ios-seg-active' : 'text-[#3C3C43] active:opacity-70')}>
          <span className="inline-flex items-center gap-1.5 justify-center">
            <Dumbbell size={14} /> {t('nav.training')}
          </span>
        </button>
      </div>

      {tab === 'wettkampf'
        ? <ExportWettkampf data={data} />
        : <ExportTraining data={data} />}
    </div>
  );
}

// CSV Helper
function downloadCSV(rows, filename) {
  const csv = rows.map(r => r.map(v => {
    const s = String(v == null ? '' : v);
    return /[",;\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }).join(';')).join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// =============================================================
// EXPORT WETTKAMPF (Maute-Format)
// =============================================================
function ExportWettkampf({ data }) {
  const [athleteFilter, setAthleteFilter] = useState('');
  const [programId, setProgramId] = useState((data.programs && data.programs[0] && data.programs[0].id) || '');

  const programs = data.programs || [];
  const competitions = data.competitions || [];
  const athletes = data.athletes || [];
  const program = programs.find(p => p.id === programId);

  const filtered = useMemo(() => {
    return competitions
      .filter(c => c.program_id === programId)
      .filter(c => !athleteFilter || c.athlete_id === athleteFilter)
      .sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  }, [competitions, programId, athleteFilter]);

  const exportMauteCSV = () => {
    if (!program) return;

    const rows = [];
    const ath = athleteFilter ? athletes.find(a => a.id === athleteFilter) : null;

    // Header-Zeilen wie Maute-Format
    const r0 = ['Name', '', 'Kampfg.'];
    const r1 = ['', '', 'Anz.'];
    const r2 = ['ArtCyc Coach' + (ath ? ' · ' + ath.name : ''), 'Pkt.', 'i.P.'];

    // Pro Wettkampf 2 Blöcke (KG1 + KG2) à 9 Spalten
    filtered.forEach(c => {
      [1, 2].forEach(t => {
        r0.push('', c.name + ' (KG' + t + ')', '', '', '', '', '', '', '');
        r1.push('', c.date || '', '', '', '', '', '', '', '');
        r2.push('x', '~', '|', '○', '', '', '', '', '');
      });
    });
    rows.push(r0, r1, r2);

    // Übungs-Zeilen
    program.exercises.forEach(ex => {
      const row = [ex.nr + '. ' + ex.name, Number(ex.points).toFixed(1), ''];
      filtered.forEach(c => {
        [1, 2].forEach(tNum => {
          const tableEntries = (tNum === 1 ? c.table1 : c.table2) || [];
          const e = tableEntries.find(en => en.exerciseId === ex.id) ||
            { included: 0, cross: 0, wave: 0, bar: 0, circle: 0 };
          row.push(
            e.included ? 1 : 0,
            e.cross || '',
            e.wave || '',
            e.bar || '',
            e.circle || '',
            '',
            '',
            '',
            ''
          );
        });
      });
      rows.push(row);
    });

    // Footer (Summen)
    const totalPoints = program.exercises.reduce((s, e) => s + Number(e.points), 0);
    const fAuf = ['Aufgestellte Punkte', totalPoints.toFixed(2), ''];
    const fSchw = ['Abzug Schwierigkeit', '', ''];
    const fAusf = ['Abzug Ausführung', '', ''];
    const fGes = ['Gesamtabzug', '', ''];
    const fEnd = ['Endergebnis', '', ''];

    filtered.forEach(c => {
      [1, 2].forEach(tNum => {
        const r = calcTableResult(
          program,
          tNum === 1 ? c.table1 : c.table2,
          tNum === 1 ? c.t1_schwierigkeit : c.t2_schwierigkeit
        );
        fAuf.push(totalPoints.toFixed(2), '', '', '', '', '', '', '', '');
        fSchw.push(r.abzugSchwierigkeit.toFixed(2), '', '', '', '', '', '', '', '');
        fAusf.push(r.abzugAusfuehrung.toFixed(2), '', '', '', '', '', '', '', '');
        fGes.push(r.abzugGesamt.toFixed(2), '', '', '', '', '', '', '', '');
        fEnd.push(r.ergebnis.toFixed(2), '', '', '', '', '', '', '', '');
      });
    });

    // Endergebnis-Zeile als Mittelwert pro Wettkampf
    const fFinal = ['Endergebnis (Ø KG1+KG2)', '', ''];
    filtered.forEach(c => {
      const t1 = calcTableResult(program, c.table1, c.t1_schwierigkeit);
      const t2 = calcTableResult(program, c.table2, c.t2_schwierigkeit);
      const final = ((t1.ergebnis + t2.ergebnis) / 2).toFixed(2);
      // Über beide Blöcke gespannt
      fFinal.push(final, '', '', '', '', '', '', '', '');
      fFinal.push('', '', '', '', '', '', '', '', '');
    });

    rows.push([], fAuf, fSchw, fAusf, fGes, fEnd, fFinal);

    const filename = 'Wettkampfstatistik' +
      (ath ? '_' + ath.name.replace(/\s+/g, '_') : '') +
      '_' + new Date().getFullYear() + '.csv';
    downloadCSV(rows, filename);
  };

  if (programs.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-amber-900 text-sm">
        <strong>Kein Programm vorhanden.</strong>
        <p className="mt-1">Lege im Bereich „Programme" mindestens ein Programm an, bevor du exportieren kannst.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-4 space-y-3">
        <div>
          <label className="text-xs font-medium text-slate-500 block mb-1.5">Programm</label>
          <select value={programId} onChange={e => setProgramId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-amber-500">
            {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        {athletes.length > 0 && (
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1.5">Sportler/Team</label>
            <select value={athleteFilter} onChange={e => setAthleteFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-amber-500">
              <option value="">Alle Sportler</option>
              {athletes.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <FileSpreadsheet size={20} className="text-amber-700" />
          </div>
          <div className="flex-1">
            <div className="font-semibold">Maute-Format CSV</div>
            <div className="text-xs text-slate-500">
              {filtered.length} Wettkämpfe · 1:1 Maute-Layout
            </div>
          </div>
        </div>

        <button onClick={exportMauteCSV}
          disabled={filtered.length === 0 || !program}
          className="w-full bg-amber-500 text-slate-900 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-3 rounded-xl font-semibold flex items-center gap-2 justify-center">
          <Download size={18} /> CSV exportieren
        </button>

        {filtered.length === 0 && (
          <p className="text-sm text-slate-500 mt-3 text-center">
            Keine Wettkämpfe für dieses Programm{athleteFilter ? ' und diesen Sportler' : ''}.
          </p>
        )}
      </div>

      <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-600 space-y-1">
        <div><strong>Format:</strong> Maute-Standard (Programm-Sheet)</div>
        <div><strong>Spalten pro Wettkampf:</strong> i.P. · T · X · ~ · | · 0.0 · 0.1 · 0.5 · 1.0</div>
        <div><strong>2 Blöcke pro Wettkampf:</strong> Kampfgericht 1 + Kampfgericht 2</div>
        <div><strong>Footer:</strong> Aufgestellt, Abzüge, Endergebnis (Ø KG1+KG2)</div>
        <div className="mt-2 text-slate-500">💡 In Excel/Numbers öffnen: Doppelklick auf Datei. UTF-8 BOM ist enthalten für Umlaute.</div>
      </div>
    </div>
  );
}

// =============================================================
// EXPORT TRAINING
// =============================================================
function ExportTraining({ data }) {
  const [athleteFilter, setAthleteFilter] = useState('');
  const athletes = data.athletes || [];

  const sessions = useMemo(() => {
    return [...data.sessions]
      .filter(s => !athleteFilter || s.athleteId === athleteFilter)
      .sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  }, [data.sessions, athleteFilter]);

  const exportTrainingCSV = () => {
    const rows = [['Datum', 'Sportler/Team', 'Übung', 'Serie', 'Status', 'Notizen']];
    const labels = { success: 'Geklappt', fail: 'Nicht geklappt', third: 'Dritte Kategorie' };

    sessions.forEach(sess => {
      const ath = athletes.find(a => a.id === sess.athleteId);
      sess.entries.forEach((status, i) => {
        rows.push([
          sess.date,
          (ath && ath.name) || '—',
          sess.exerciseName || '—',
          i + 1,
          labels[status] || status,
          sess.notes || ''
        ]);
      });
    });

    const ath = athleteFilter ? athletes.find(a => a.id === athleteFilter) : null;
    const filename = 'Training_' +
      (ath ? ath.name.replace(/\s+/g, '_') : 'alle') +
      '_' + new Date().toISOString().slice(0, 10) + '.csv';
    downloadCSV(rows, filename);
  };

  const totalSeries = sessions.reduce((s, sess) => s + sess.entries.length, 0);
  const ath = athleteFilter ? athletes.find(a => a.id === athleteFilter) : null;

  return (
    <div className="space-y-4">
      {athletes.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-4">
          <label className="text-xs font-medium text-slate-500 block mb-1.5">Sportler/Team</label>
          <select value={athleteFilter} onChange={e => setAthleteFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-amber-500">
            <option value="">Alle Sportler/Teams</option>
            {athletes.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
            <FileSpreadsheet size={20} className="text-slate-700" />
          </div>
          <div className="flex-1">
            <div className="font-semibold">Trainings-Daten CSV</div>
            <div className="text-xs text-slate-500">
              {sessions.length} Sessions · {totalSeries} Serien
              {ath ? ' · ' + ath.name : ''}
            </div>
          </div>
        </div>

        <button onClick={exportTrainingCSV}
          disabled={sessions.length === 0}
          className="w-full bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-3 rounded-xl font-semibold flex items-center gap-2 justify-center">
          <Download size={18} /> CSV exportieren
        </button>

        {sessions.length === 0 && (
          <p className="text-sm text-slate-500 mt-3 text-center">
            Noch keine Trainings-Sessions zum Exportieren.
          </p>
        )}
      </div>

      <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-600 space-y-1">
        <div><strong>Spalten:</strong> Datum · Sportler · Übung · Serie · Status · Notizen</div>
        <div><strong>Eine Zeile pro Serie</strong> (für Pivot-Auswertungen in Excel/Numbers)</div>
      </div>
    </div>
  );
}

// =============================================================
// WETTKAMPF-DETAIL (read-only)
// =============================================================
function WettkampfDetail({ competition, program, athlete, onBack, onEdit, onDelete }) {
  const { t } = useI18n();
  const [activeTable, setActiveTable] = useState(1);

  if (!competition) return null;

  const t1 = program ? calcTableResult(program, competition.table1, competition.t1_schwierigkeit) : null;
  const t2 = program ? calcTableResult(program, competition.table2, competition.t2_schwierigkeit) : null;
  const finalScore = (t1 && t2) ? Math.round(((t1.ergebnis + t2.ergebnis) / 2) * 100) / 100 : null;

  const entries = activeTable === 1 ? (competition.table1 || []) : (competition.table2 || []);
  const result = activeTable === 1 ? t1 : t2;

  return (
    <div className="space-y-5">
      <header className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 -m-2 text-slate-500"><ChevronLeft size={22} /></button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold truncate">{competition.name}</h1>
          <p className="text-slate-500 text-sm">
            {competition.date}{competition.location ? ' · ' + competition.location : ''}
          </p>
        </div>
        <button onClick={onEdit}
          className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg" title="Bearbeiten">
          <Edit2 size={18} />
        </button>
        <button onClick={onDelete}
          className="p-2 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg" title="Löschen">
          <Trash2 size={18} />
        </button>
      </header>

      {/* Stammdaten */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-4">
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
          {competition.start_nr && (
            <div>
              <div className="text-xs text-slate-500">{t('detail.startNumber')}</div>
              <div className="font-medium">{competition.start_nr}</div>
            </div>
          )}
          {athlete && (
            <div>
              <div className="text-xs text-slate-500">{t('detail.athlete')}</div>
              <div className="font-medium truncate">{athlete.name}</div>
            </div>
          )}
          {competition.host && (
            <div>
              <div className="text-xs text-slate-500">{t('detail.host')}</div>
              <div className="font-medium truncate">{competition.host}</div>
            </div>
          )}
          {program && (
            <div>
              <div className="text-xs text-slate-500">{t('detail.program')}</div>
              <div className="font-medium truncate">{program.name}</div>
            </div>
          )}
        </div>
      </div>

      {/* Ergebnis-Übersicht — farbige StatCards im Dashboard-Stil */}
      {t1 && t2 && (
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={Trophy}
            label={t('detail.finalScore')}
            value={finalScore !== null ? finalScore.toFixed(2) : t('detail.noData')}
            sub={t('detail.difficulty') + ': ' + t1.aufgestellt.toFixed(2)}
            color="orange"
            size="large"
          />
          <StatCard
            icon={Sparkles}
            label={t('detail.difficulty')}
            value={t1.aufgestellt.toFixed(2)}
            sub=""
            color="violet"
            size="large"
          />
          <StatCard
            icon={BarChart3}
            label={t('detail.kg1Score')}
            value={t1.ergebnis.toFixed(2)}
            sub={'-' + t1.abzugAusfuehrung.toFixed(2) + ' · -' + t1.abzugSchwierigkeit.toFixed(2)}
            color="sky"
          />
          <StatCard
            icon={BarChart3}
            label={t('detail.kg2Score')}
            value={t2.ergebnis.toFixed(2)}
            sub={'-' + t2.abzugAusfuehrung.toFixed(2) + ' · -' + t2.abzugSchwierigkeit.toFixed(2)}
            color="emerald"
          />
        </div>
      )}

      {!program && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-900 text-sm">
          ⚠️ Programm zu diesem Wettkampf nicht mehr vorhanden — Detail-Werte können nicht angezeigt werden.
        </div>
      )}

      {/* Tab-Umschaltung Kampfgericht 1 / 2 */}
      {program && (
        <>
          <div className="flex gap-2">
            <button onClick={() => setActiveTable(1)}
              className={'flex-1 py-2.5 rounded-xl font-semibold ' +
                (activeTable === 1 ? 'bg-slate-900 text-white' : 'bg-white border border-slate-300 text-slate-700')}>
              Kampfgericht 1: {t1 && t1.ergebnis.toFixed(2)}
            </button>
            <button onClick={() => setActiveTable(2)}
              className={'flex-1 py-2.5 rounded-xl font-semibold ' +
                (activeTable === 2 ? 'bg-slate-900 text-white' : 'bg-white border border-slate-300 text-slate-700')}>
              Kampfgericht 2: {t2 && t2.ergebnis.toFixed(2)}
            </button>
          </div>

          {/* Übungs-Liste read-only */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-4">
            <h3 className="font-semibold mb-3">Übungen</h3>
            <div className="space-y-1.5">
              {program.exercises.map((ex, idx) => {
                const e = entries[idx] || {};
                const exec = calcExerciseDeduction(e);
                const schw = calcExerciseSchwierigkeit(e, ex);
                const total = exec + schw;
                const hasAnyValue = (e.cross || e.wave || e.bar || e.circle || e.schwPct);
                const isTaktisch = Number(e.taktischePunkte || 0) > 0 && Number(e.taktischePunkte) !== Number(ex.points);
                return (
                  <div key={ex.id}
                    className={'rounded-lg p-2.5 ' + (hasAnyValue ? 'bg-rose-50' : 'bg-slate-50')}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-xs flex-wrap">
                          <span className="text-slate-500">#{ex.nr}</span>
                          {ex.code && <span className="text-[10px] text-slate-400">{ex.code}</span>}
                          <span className="text-slate-500">·</span>
                          {isTaktisch ? (
                            <span>
                              <span className="text-slate-400 line-through">{Number(ex.points).toFixed(1)}</span>
                              <span className="text-amber-700 font-semibold ml-1">→ {Number(e.taktischePunkte).toFixed(1)} Pkt</span>
                              <span className="ml-1 text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded uppercase font-bold tracking-wide">T</span>
                            </span>
                          ) : (
                            <span className="text-slate-700 font-medium">{Number(ex.points).toFixed(1)} Pkt</span>
                          )}
                        </div>
                        <div className="text-sm font-medium leading-tight mt-0.5">{localizedExerciseName(ex)}</div>
                        {hasAnyValue && (
                          <div className="flex flex-wrap gap-2 mt-1.5 text-xs">
                            {e.cross > 0 && <span className="text-slate-700"><strong>x</strong>×{e.cross}</span>}
                            {e.wave > 0 && <span className="text-slate-700"><strong>~</strong>×{e.wave}</span>}
                            {e.bar > 0 && <span className="text-slate-700"><strong>|</strong>×{e.bar}</span>}
                            {e.circle > 0 && <span className="text-rose-700"><strong>○</strong>×{e.circle}</span>}
                            {e.schwPct > 0 && <span className="text-amber-700"><strong>Schw</strong> {e.schwPct}%</span>}
                          </div>
                        )}
                      </div>
                      <div className={'text-sm font-bold shrink-0 ' + (total > 0 ? 'text-rose-600' : 'text-slate-300')}>
                        {total > 0 ? '-' + total.toFixed(2) : '0'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {result && (
              <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 rounded-lg p-2">
                  <div className="text-slate-500">Abzug Ausführung</div>
                  <div className="font-bold">-{result.abzugAusfuehrung.toFixed(2)}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-2">
                  <div className="text-slate-500">Abzug Schwierigkeit</div>
                  <div className="font-bold">-{result.abzugSchwierigkeit.toFixed(2)}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-2">
                  <div className="text-slate-500">Gesamtabzug</div>
                  <div className="font-bold">-{result.abzugGesamt.toFixed(2)}</div>
                </div>
                <div className="bg-amber-50 rounded-lg p-2">
                  <div className="text-amber-700">Ergebnis</div>
                  <div className="font-bold text-amber-700">{result.ergebnis.toFixed(2)}</div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Aktionen */}
      <div className="flex gap-2">
        <button onClick={onEdit}
          className="flex-1 bg-slate-900 text-white px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2">
          <Edit2 size={16} /> Bearbeiten
        </button>
        <button onClick={onBack}
          className="flex-1 bg-white border border-slate-300 px-4 py-3 rounded-xl font-medium">
          Zurück
        </button>
      </div>
    </div>
  );
}

// =============================================================
// LÖSCH-BESTÄTIGUNG (zuverlässiger als window.confirm)
// =============================================================
function DeleteConfirmModal({ title, message, onConfirm, onCancel }) {
  // iOS-Style Action Sheet — Bottom-Sheet auf Mobile, zentriert auf Desktop
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 bg-black/40 backdrop-blur-sm"
         onClick={onCancel}>
      <div className="w-full sm:max-w-sm space-y-2"
           onClick={e => e.stopPropagation()}>
        {/* Action-Block: Titel/Message + Destruktive Aktion */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden">
          <div className="px-6 pt-5 pb-4 text-center">
            <h3 className="font-semibold text-[17px] mb-1">{title}</h3>
            <p className="text-[13px] text-[#3C3C43] leading-snug">{message}</p>
          </div>
          <div className="border-t border-[#C6C6C8]/40" />
          <button onClick={onConfirm}
            className="w-full py-3.5 text-[17px] text-[#FF3B30] font-semibold active:bg-[#D1D1D6]/40 transition">
            Löschen
          </button>
        </div>
        {/* Cancel-Block — separater Card im iOS-Stil */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden">
          <button onClick={onCancel}
            className="w-full py-3.5 text-[17px] text-[#007AFF] font-semibold active:bg-[#D1D1D6]/40 transition">
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
}
