import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Trophy, Dumbbell, Plus, ChevronLeft, ChevronRight, Save, Check, X, Edit2, Trash2,
  Search, Info, Archive, AlertTriangle, ListChecks,
  Home, BarChart3, Users, Download, Sparkles, FileText, Lock,
  Settings as SettingsIcon, Menu, LogOut, Shield, User, RotateCcw,
  TrendingUp, Calendar, Target, Activity, FileSpreadsheet,
  Mail, KeyRound, UserCog
} from 'lucide-react';
import { supabase, getCurrentProfile, fetchCloudSnapshot, pushCloudSnapshot } from './lib/supabase';

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
function getUciDb() { return activeUciDb; }
function setActiveDb(db) { activeUciDb = (db && db.length > 0) ? db : UCI_DB_2026; }

const DATA_KEY = 'artcyc:test:v3';
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

// Maute-Vorlage 1er Elite (30 Übungen mit UCI-Codes und Punkten)
const MAUTE_PROGRAM_1ER_ELITE = [
  { nr: 1, name: 'Sattelstand HR.', code: '1103a', points: 5.7 },
  { nr: 2, name: 'Seitvorhebehalte Schweizer Sattellenkerhandstand 8', code: '1123l', points: 13.6 },
  { nr: 3, name: 'Übergang Reitsitzsteiger Steuerrohrsteiger', code: '1284a', points: 5.3 },
  { nr: 4, name: 'Steuerrohrsteiger rw. frh. HR.', code: '1237a', points: 4.4 },
  { nr: 5, name: 'Übergang Fronthang Kehrstandsteiger', code: '1282a', points: 7.0 },
  { nr: 6, name: 'Kehrstandsteiger Dreh.', code: '1248c', points: 6.5 },
  { nr: 7, name: 'Übergang Fronthang Steuerrohrsteiger', code: '1281a', points: 5.0 },
  { nr: 8, name: 'Steuerrohrsteiger Dreh. frh.', code: '1236e', points: 5.1 },
  { nr: 9, name: 'Reitsitzsteiger rw. einb. R.', code: '1202f', points: 6.5 },
  { nr: 10, name: 'Damensitzsteiger rw. R.', code: '1212b', points: 6.2 },
  { nr: 11, name: 'Dornstandsteiger rw. R.', code: '1217b', points: 6.0 },
  { nr: 12, name: 'Seitvorhebehalte rw. HR.', code: '1117c', points: 6.5 },
  { nr: 13, name: 'Sattellenkerstand rw. HR.', code: '1102a', points: 6.5 },
  { nr: 14, name: 'Übergang Reitsitzsteiger Kehrstandsteiger', code: '1285a', points: 6.4 },
  { nr: 15, name: 'Kehrstandsteiger rw. 8', code: '1249d', points: 8.8 },
  { nr: 16, name: 'Frontlenkerstanddrehung 1½fach aus Reitsitz T', code: '1104o', points: 7.3 },
  { nr: 17, name: 'Kopfstand HR.', code: '1121a', points: 4.4 },
  { nr: 18, name: 'Lenkerhandstand S', code: '1124c', points: 8.8 },
  { nr: 19, name: 'Kehrreitsitzsteiger Dreh. frh.', code: '1203g', points: 5.7 },
  { nr: 20, name: 'Kehrreitsitzsteiger rw. frh. 8', code: '1204d', points: 7.8 },
  { nr: 21, name: 'Übergang Kehrreitsitz Kehrlenkersitzsteiger', code: '1290a', points: 5.1 },
  { nr: 22, name: 'Kehrlenkersitzsteiger rw. frh. 8', code: '1229d', points: 7.4 },
  { nr: 23, name: 'Kehrlenkersitzsteiger Dreh. frh.', code: '1228e', points: 5.5 },
  { nr: 24, name: 'Übergang Kehrlenkersitzsteiger Kehrsteuerrohrsteiger', code: '1292b', points: 5.8 },
  { nr: 25, name: 'Kehrsteuerrohrsteiger Dreh. frh.', code: '1238c', points: 5.5 },
  { nr: 26, name: 'Übergang Kehrlenkersitzsteiger Standsteiger', code: '1291a', points: 6.8 },
  { nr: 27, name: 'Standsteiger R.', code: '1246b', points: 4.6 },
  { nr: 28, name: 'Kehrsteuerrohrsteiger rw. frh. HR.', code: '1239a', points: 4.8 },
  { nr: 29, name: 'Übergang Kehrhang Standsteiger', code: '1289a', points: 6.1 },
  { nr: 30, name: 'Standsteiger rw. R.', code: '1247b', points: 5.9 }
];

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
  // Aufgestellt = Summe der anerkannten Punkte (mit taktischer Aufwertung)
  const aufgestellt = program.exercises.reduce((sum, ex, idx) => {
    const e = (entries || [])[idx];
    return sum + getAnerkanntePunkte(e, ex);
  }, 0);
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
    abzugAusfuehrung: Math.round(exec * 100) / 100,
    abzugSchwierigkeit: Math.round(schw * 100) / 100,
    abzugGesamt: Math.round(total * 100) / 100,
    ergebnis: Math.round((aufgestellt - total) * 100) / 100
  };
}

// Wettkampf-Statistik pro Übung — summiert x/~/|/○ über alle Wettkämpfe in beiden KGs
function calcExerciseCompetitionStats(exercise, programs, competitions) {
  const stats = { cross: 0, wave: 0, bar: 0, circle: 0, schwPctSum: 0, count: 0, wettkaempfe: 0 };
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
        stats.schwPctSum += Number(e.schwPct || 0);
        stats.count += 1;
      });
    });
    if (foundInThisComp) stats.wettkaempfe += 1;
  }
  return stats;
}

// Training-Statistik pro Übung — Quote aus Sessions
function calcExerciseTrainingStats(exercise, sessions) {
  const stats = { total: 0, success: 0, fail: 0, third: 0, rate: 0, sessions: 0 };
  if (!exercise || !sessions) return stats;
  const exSessions = sessions.filter(s => s.exerciseId === exercise.id);
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
  const exercises = data.exercises.map(ex => {
    const isMaute = (ex.name || '').toLowerCase().includes('maute');
    if (isMaute && ex.category_mode === 3) {
      const updates = {};
      if (ex.third_label !== 'Getroffen') updates.third_label = 'Getroffen';
      if (!ex.fail_label) updates.fail_label = 'Gefährlich';
      if (!ex.success_label) updates.success_label = 'Geklappt';
      if (Object.keys(updates).length > 0) {
        changed = true;
        return { ...ex, ...updates };
      }
    }
    return ex;
  });
  return { data: { ...data, exercises }, changed };
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
export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

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

  const save = useCallback(async (next) => {
    setActiveDb(next.uci_custom);
    setData(next);
    if (userDataKey) await storage.set(userDataKey, JSON.stringify(next));
    // Debounced Cloud-Push
    if (cloudPushTimer.id) clearTimeout(cloudPushTimer.id);
    setCloudStatus('syncing');
    cloudPushTimer.id = setTimeout(async () => {
      const { error } = await pushCloudSnapshot(next);
      setCloudStatus(error ? 'error' : 'idle');
    }, 2000);
  }, [userDataKey, cloudPushTimer]);

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

  if (!authChecked || loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2F2F7] text-[#8E8E93]"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}>
      Lade ArtCyc Coach…
    </div>
  );

  // Nicht eingeloggt → AuthScreen
  if (!session) return <AuthScreen />;

  if (!data) {
    return <SetupScreen onStart={() => save({
      sessions: [],
      exercises: [
        { id: 'ex1', name: 'Lenkerhandstand', uci_code: '1124c', uci_disc: '1er', active: true, category_mode: 2, third_label: null, default_series: 10 },
        { id: 'ex2', name: 'Maute-Sprung', uci_code: null, uci_disc: null, active: true, category_mode: 3, third_label: 'Getroffen', fail_label: 'Gefährlich', success_label: 'Geklappt', default_series: 10 }
      ],
      programs: [
        {
          id: 'prog_default',
          name: '1er Kunstrad Elite Männer',
          discipline: '1er',
          exercises: MAUTE_PROGRAM_1ER_ELITE.map(e => ({ ...e, id: uid() })),
          created: new Date().toISOString()
        }
      ],
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
  const nav = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'training', label: 'Training', icon: Dumbbell },
    { id: 'wettkampf', label: 'Wettkampf', icon: Trophy },
    { id: 'uebungen', label: 'Übungen', icon: BarChart3 },
    ...(isCoach ? [{ id: 'sportler', label: 'Sportler', icon: Users }] : []),
    { id: 'export', label: 'Export', icon: Download },
    { id: 'kuer', label: 'Kür-Planung', icon: Sparkles, soon: true },
    { id: 'video', label: 'Video-Analyse', icon: FileText, soon: true }
  ];

  // View dispatcher
  let viewEl;
  if (view === 'dashboard') viewEl = <Dashboard data={data} setView={setView} />;
  else if (view === 'training') viewEl = <TrainingView data={data} setData={save} setView={setView} />;
  else if (view === 'erfassen') viewEl = <Erfassen data={data} setData={save} onDone={() => setView('training')} />;
  else if (view === 'uebungen') viewEl = <UebungenView data={data} setData={save} onBack={() => setView('dashboard')} />;
  else if (view === 'wettkampf') viewEl = <WettkampfView data={data} setData={save} />;
  else if (view === 'einstellungen') viewEl = <SettingsView data={data} setData={save} onResetAll={resetAll} profile={profile} session={session} onLogout={logout} cloudStatus={cloudStatus} />;
  else if (view === 'sportler') viewEl = <SportlerView data={data} setData={save} />;
  else if (view === 'export') viewEl = <ExportView data={data} />;
  else if (view === 'kuer' || view === 'video') {
    viewEl = <ComingSoon viewId={view} />;
  } else {
    viewEl = <Dashboard data={data} setView={setView} />;
  }

  return (
    <div
      className="min-h-screen bg-[#F2F2F7] text-slate-900 flex flex-col sm:flex-row antialiased"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, "Segoe UI", Roboto, sans-serif' }}>
      {/* Mobile Header — iOS Navigation Bar Style */}
      <div
        className="sm:hidden px-4 pb-3 flex items-center justify-between sticky top-0 z-30 border-b border-slate-200/30"
        style={{
          paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)',
          background: 'rgba(242, 242, 247, 0.78)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)'
        }}>
        <Brand size="sm" />
        <div className="flex items-center gap-1">
          <button onClick={() => setView('einstellungen')}
            className={'p-2 -m-2 rounded-full transition active:scale-90 ' + (view === 'einstellungen' ? 'text-[#FF9500]' : 'text-[#3C3C43]')}
            aria-label="Einstellungen">
            <SettingsIcon size={22} strokeWidth={1.8} />
          </button>
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 -m-2 text-[#3C3C43] active:scale-90 transition" aria-label="Menü">
            <Menu size={24} strokeWidth={1.8} />
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
      </aside>

      {/* Mobile Drawer (für Items, die nicht in die Bottom-Bar passen) */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white/95 backdrop-blur-xl p-4 flex flex-col gap-1 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <Brand size="sm" />
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 -m-2 rounded-full text-slate-500 active:bg-slate-100"><X size={20} /></button>
            </div>
            {nav.map(n => {
              const Icon = n.icon;
              const active = view === n.id;
              return (
                <button key={n.id} onClick={() => { setView(n.id); setMobileMenuOpen(false); }}
                  className={'flex items-center justify-between px-3 py-3 rounded-2xl text-left transition ' +
                    (active ? 'bg-slate-900 text-white' : 'text-slate-700 active:bg-slate-100')}>
                  <span className="flex items-center gap-3"><Icon size={18} /><span className="font-medium">{n.label}</span></span>
                  {n.soon && <span className="bg-amber-100 text-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">bald</span>}
                </button>
              );
            })}
            <button onClick={() => { setView('einstellungen'); setMobileMenuOpen(false); }}
              className={'flex items-center gap-3 px-3 py-3 rounded-2xl text-left mt-2 border-t border-slate-200/60 pt-4 transition ' +
                (view === 'einstellungen' ? 'bg-slate-900 text-white' : 'text-slate-700 active:bg-slate-100')}>
              <SettingsIcon size={18} /> <span className="font-medium">Einstellungen</span>
            </button>
          </div>
        </div>
      )}

      <main
        className="flex-1 sm:pb-8"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 6.5rem)' }}>
        <div className="max-w-5xl mx-auto p-4 sm:p-8">{viewEl}</div>
      </main>

      {/* Mobile Bottom-Nav — iOS 26 Liquid Glass Pill */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-30 px-4"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
        <div
          className="rounded-full flex justify-around items-stretch py-2 px-2"
          style={{
            background: 'rgba(255, 255, 255, 0.72)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            border: '0.5px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.6) inset'
          }}>
          {nav.filter(n => !n.soon).slice(0, 5).map(n => {
            const Icon = n.icon;
            const active = view === n.id;
            return (
              <button key={n.id} onClick={() => setView(n.id)}
                className={'flex flex-col items-center justify-center gap-1 flex-1 py-1.5 px-1 rounded-full transition-all duration-150 active:scale-[0.92] ' +
                  (active ? 'text-[#FF9500]' : 'text-[#8E8E93]')}>
                <Icon size={24} strokeWidth={active ? 2.4 : 1.8} />
                <span className={'text-[10px] tracking-tight leading-none ' + (active ? 'font-semibold' : 'font-medium')}>{n.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
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
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('athlete'); // 'athlete' | 'coach'
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [info, setInfo] = useState('');

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
          setInfo('Wir haben dir eine Bestätigungs-E-Mail an ' + email.trim() + ' geschickt. Klicke den Link in der E-Mail, dann kannst du dich einloggen.');
        }
      }
    } catch (e) {
      setErr(e.message || 'Es ist ein Fehler aufgetreten.');
    } finally {
      setBusy(false);
    }
  };

  const forgot = async () => {
    if (!validEmail) { setErr('Bitte E-Mail eintragen.'); return; }
    setBusy(true); setErr(''); setInfo('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: window.location.origin });
      if (error) throw error;
      setInfo('Falls die Adresse registriert ist, hast du gleich eine E-Mail mit einem Reset-Link.');
    } catch (e) {
      setErr(e.message || 'Fehler beim Reset.');
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center p-4"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}>
      <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Trophy className="text-amber-400" size={26} />
          </div>
          <h1 className="text-[28px] font-bold tracking-tight">ArtCyc Coach</h1>
          <p className="text-[#8E8E93] text-[14px]">Trainings- und Wettkampf-Tool für Kunstradsport</p>
        </div>

        {/* Mode-Tabs */}
        <div className="bg-[#E5E5EA] rounded-xl p-1 flex gap-1 mb-5">
          <button type="button" onClick={() => { setMode('login'); setErr(''); setInfo(''); }}
            className={'flex-1 py-2 rounded-lg text-[14px] font-medium transition ' +
              (mode === 'login' ? 'bg-white shadow-sm' : 'text-[#3C3C43] active:opacity-70')}>
            Anmelden
          </button>
          <button type="button" onClick={() => { setMode('signup'); setErr(''); setInfo(''); }}
            className={'flex-1 py-2 rounded-lg text-[14px] font-medium transition ' +
              (mode === 'signup' ? 'bg-white shadow-sm' : 'text-[#3C3C43] active:opacity-70')}>
            Registrieren
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === 'signup' && (
            <>
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">Anzeigename</label>
                <input value={displayName} onChange={e => setDisplayName(e.target.value)}
                  placeholder="z.B. Ruben"
                  autoComplete="name"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 block mb-1">Ich bin</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setRole('athlete')}
                    className={'py-2.5 px-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-1.5 ' +
                      (role === 'athlete' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300')}>
                    <Dumbbell size={16} /> Sportler:in
                  </button>
                  <button type="button" onClick={() => setRole('coach')}
                    className={'py-2.5 px-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-1.5 ' +
                      (role === 'coach' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300')}>
                    <UserCog size={16} /> Trainer:in
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {role === 'athlete'
                    ? 'Du protokollierst dein eigenes Training.'
                    : 'Du verwaltest deine Sportler und kannst für sie Trainings/Wettkämpfe eintragen.'}
                </p>
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">E-Mail</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="name@beispiel.de"
                autoComplete="email"
                inputMode="email"
                className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">
              Passwort {mode === 'signup' && <span className="text-slate-400">(min. 10 Zeichen)</span>}
            </label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'mindestens 10 Zeichen' : 'Passwort'}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
          </div>

          {err && (
            <div className="bg-rose-50 border border-rose-200 text-rose-900 text-sm rounded-xl p-3">
              ✗ {err}
            </div>
          )}
          {info && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm rounded-xl p-3">
              ✓ {info}
            </div>
          )}

          <button type="submit" disabled={!canSubmit || busy}
            className="bg-slate-900 text-white px-5 py-3 rounded-2xl font-semibold w-full active:scale-[0.98] transition shadow-sm disabled:opacity-50">
            {busy ? '…' : (mode === 'login' ? 'Anmelden' : 'Account erstellen')}
          </button>

          {mode === 'login' && (
            <button type="button" onClick={forgot} disabled={busy}
              className="text-sm text-[#007AFF] block mx-auto mt-2 disabled:opacity-50">
              Passwort vergessen?
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
function Dashboard({ data, setView }) {
  // Gesamt-Stats berechnen
  const stats = useMemo(() => {
    const allEntries = data.sessions.flatMap(s => s.entries);
    const total = allEntries.length;
    const success = allEntries.filter(e => e === 'success').length;
    const fail = allEntries.filter(e => e === 'fail').length;
    const third = allEntries.filter(e => e === 'third').length;

    // Diese Woche (letzte 7 Tage)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weekStart = oneWeekAgo.toISOString().slice(0, 10);
    const sessionsThisWeek = data.sessions.filter(s => s.date >= weekStart);
    const entriesThisWeek = sessionsThisWeek.flatMap(s => s.entries);
    const weekSuccess = entriesThisWeek.filter(e => e === 'success').length;

    return {
      total, success, fail, third,
      successRate: total > 0 ? Math.round((success / total) * 100) : 0,
      sessionsCount: data.sessions.length,
      sessionsThisWeek: sessionsThisWeek.length,
      seriesThisWeek: entriesThisWeek.length,
      weekSuccessRate: entriesThisWeek.length > 0 ? Math.round((weekSuccess / entriesThisWeek.length) * 100) : 0
    };
  }, [data]);

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
    <div className="space-y-5">
      <header className="pt-2">
        <h1 className="text-[34px] font-bold tracking-tight leading-none">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Deine Trainings-Statistiken im Überblick</p>
      </header>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={Target}
          label="Gesamtquote"
          value={stats.total > 0 ? stats.successRate + '%' : '—'}
          sub={stats.total + ' Serien'}
          color="emerald"
        />
        <StatCard
          icon={Calendar}
          label="Diese Woche"
          value={stats.sessionsThisWeek}
          sub="Sessions"
          color="sky"
        />
        <StatCard
          icon={Activity}
          label="Serien Woche"
          value={stats.seriesThisWeek}
          sub={stats.seriesThisWeek > 0 ? stats.weekSuccessRate + '% Quote' : '—'}
          color="violet"
        />
        <StatCard
          icon={ListChecks}
          label="Übungen aktiv"
          value={data.exercises.filter(e => e.active).length}
          sub="trainiert"
          color="amber"
        />
      </div>

      {/* Schnellzugriff */}
      <div className="grid sm:grid-cols-2 gap-3">
        <button onClick={() => setView('erfassen')}
          className="bg-slate-900 text-white p-5 rounded-2xl text-left hover:bg-slate-800 transition-colors">
          <div className="flex items-center gap-2 mb-2 font-semibold">
            <Plus size={20} /> <span>Serie protokollieren</span>
          </div>
          <div className="text-xs text-slate-300">Neue Trainings-Session erfassen</div>
        </button>
        <button onClick={() => setView('uebungen')}
          className="bg-white border-2 border-slate-200 p-5 rounded-2xl text-left hover:border-amber-400 transition-colors">
          <div className="flex items-center gap-2 mb-2 font-semibold">
            <ListChecks size={20} className="text-amber-500" /> <span>Übungen verwalten</span>
          </div>
          <div className="text-xs text-slate-500">{getUciDb().length} UCI-Übungen verfügbar</div>
        </button>
      </div>

      {/* Pro Übung */}
      <section>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <TrendingUp size={18} className="text-slate-700" /> Fortschritt pro Übung
        </h2>

        {perExercise.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-8 text-center">
            <Sparkles size={32} className="mx-auto text-slate-300 mb-3" />
            <h3 className="font-semibold mb-1">Noch keine Trainings-Daten</h3>
            <p className="text-sm text-slate-500 mb-4">Protokolliere deine erste Serie, um den Fortschritt zu sehen.</p>
            <button onClick={() => setView('erfassen')}
              className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium">
              Serie protokollieren
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {perExercise.map(r => <ExerciseStatsCard key={r.ex.id} {...r} />)}
          </div>
        )}
      </section>

      <div className="text-xs text-slate-400 text-center pt-2">
        Stufe 4 · Dashboard aktiv
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }) {
  const colors = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    sky: 'bg-sky-50 text-sky-700 border-sky-100',
    violet: 'bg-violet-50 text-violet-700 border-violet-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100'
  };
  return (
    <div className={'rounded-2xl border p-4 ' + colors[color]}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon size={14} />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500 mt-0.5">{sub}</div>
    </div>
  );
}

function ExerciseStatsCard({ ex, total, success, fail, third, rate, riskRate, sessions, trend }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-lg">{ex.name}</h3>
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
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            {sessions} Sessions · {total} Serien
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-3xl font-bold text-slate-900">{rate}%</div>
          <div className="text-xs text-slate-500">Quote</div>
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
function TrainingView({ data, setData, setView }) {
  return (
    <div className="space-y-5">
      <header className="flex items-end justify-between flex-wrap gap-3 pt-2">
        <div>
          <h1 className="text-[34px] font-bold tracking-tight leading-none">Training</h1>
          <p className="text-slate-500 text-sm mt-1">Serien protokollieren und Sessions verwalten</p>
        </div>
        <button onClick={() => setView('erfassen')}
          className="bg-slate-900 text-white px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-1.5 shadow-sm active:scale-95 transition">
          <Plus size={16} /> Serie protokollieren
        </button>
      </header>

      <div className="bg-amber-50/80 backdrop-blur rounded-2xl p-4 text-sm text-amber-900">
        <div className="flex gap-2 items-start">
          <Info size={18} className="shrink-0 mt-0.5" />
          <div>
            <strong>Tipp:</strong> Übungen wie der <em>Maute-Sprung</em> kannst du im <strong>3-Kategorien-Modus</strong> erfassen — neben „Geklappt" / „Nicht geklappt" gibt's eine dritte Kategorie wie „Gefährlich" für besonders kritische Misserfolge (Sturz, Hilfe nötig). Aktivierbar im Bereich <strong>Übungen</strong>.
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5">
        <h2 className="font-semibold mb-3">Letzte Sessions</h2>
        {data.sessions.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-4">Noch keine Sessions erfasst.</p>
        ) : (
          <div className="space-y-2">
            {[...data.sessions].slice(-15).reverse().map((s, i) => {
              const success = s.entries.filter(e => e === 'success').length;
              const total = s.entries.length;
              const rate = total > 0 ? Math.round((success / total) * 100) : 0;
              return (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm truncate">{s.exerciseName}</div>
                    <div className="text-xs text-slate-500">{s.date} · {total} Serien</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm">{rate}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================
// EINSTELLUNGEN (Skeleton — wird in Stufe 8 ausgebaut)
// =============================================================
function SettingsView({ data, setData, onResetAll, profile, session, onLogout, cloudStatus }) {
  const roleLabel = profile?.role === 'admin' ? 'Admin' : profile?.role === 'coach' ? 'Trainer:in' : 'Sportler:in';
  const syncLabel = cloudStatus === 'syncing' ? '⏳ wird synchronisiert…' : cloudStatus === 'error' ? '⚠ Sync-Fehler' : '✓ synchronisiert';
  const syncColor = cloudStatus === 'syncing' ? 'text-amber-600' : cloudStatus === 'error' ? 'text-rose-600' : 'text-emerald-600';
  return (
    <div className="space-y-5">
      <header className="pt-2">
        <h1 className="text-[34px] font-bold tracking-tight leading-none">Einstellungen</h1>
        <p className="text-slate-500 text-sm mt-1">Account, Reglement, Datenverwaltung</p>
      </header>

      {session && (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5">
          <h2 className="font-semibold mb-3 flex items-center gap-2"><User size={16} /> Account</h2>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Angemeldet als</span><strong>{profile?.display_name || session.user.email}</strong></div>
            <div className="flex justify-between"><span className="text-slate-500">E-Mail</span><span>{session.user.email}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Rolle</span><span className={'font-medium ' + (profile?.role === 'admin' ? 'text-amber-700' : 'text-slate-700')}>{roleLabel}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Cloud-Sync</span><span className={'font-medium ' + syncColor}>{syncLabel}</span></div>
          </div>
          <button onClick={onLogout}
            className="mt-4 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5">
            <LogOut size={14} /> Abmelden
          </button>
        </div>
      )}

      <ReglementSettings data={data} setData={setData} />

      <BackupSettings data={data} setData={setData} />

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5">
        <h2 className="font-semibold mb-3 flex items-center gap-2 text-rose-700">
          <RotateCcw size={16} /> Daten zurücksetzen
        </h2>
        <p className="text-sm text-slate-600 mb-3">
          Setzt alle Daten zurück: Übungen, Sessions, Wettkämpfe, Programme, Sportler, UCI-Reglement.
          <strong className="text-rose-600"> Kann nicht rückgängig gemacht werden!</strong>
        </p>
        <button onClick={onResetAll}
          className="bg-rose-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5">
          <RotateCcw size={14} /> Alles zurücksetzen
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5">
        <h2 className="font-semibold mb-2">Über</h2>
        <div className="text-sm text-slate-600 space-y-1">
          <div><strong>ArtCyc Coach</strong> — Trainings- und Wettkampf-Tool für Kunstradsport</div>
          <div className="text-xs text-slate-500">Stufe 8 · Vollständige Test-Version</div>
          <div className="text-xs text-slate-500 mt-2">UCI-Reglement: {data.uci_version || '2026'} · {getUciDb().length} Übungen aktiv</div>
        </div>
      </div>
    </div>
  );
}

// =============================================================
// REGLEMENT-EINSTELLUNGEN
// =============================================================
function ReglementSettings({ data, setData }) {
  const [parseStatus, setParseStatus] = useState(null); // null | 'parsing' | 'success' | 'error'
  const [parseMsg, setParseMsg] = useState('');
  const [previewDb, setPreviewDb] = useState(null);
  const [showAllExercises, setShowAllExercises] = useState(false);
  const [filterDisc, setFilterDisc] = useState('1er');
  const fileInputRef = useState(null)[0];

  const isCustom = !!(data.uci_custom && data.uci_custom.length > 0);
  const currentCount = getUciDb().length;
  const byDiscipline = useMemo(() => {
    const counts = {};
    DISCIPLINES.forEach(d => counts[d.id] = 0);
    getUciDb().forEach(e => { if (counts[e.d] !== undefined) counts[e.d]++; });
    return counts;
  }, [data.uci_custom]);

  const handlePdfUpload = async (file) => {
    if (!file) return;
    setParseStatus('parsing');
    setParseMsg('Lade PDF-Bibliothek…');
    setPreviewDb(null);

    try {
      setParseMsg('Lade PDF-Bibliothek…');
      const fullText = await extractPdfText(file);

      setParseMsg('Extrahiere Übungen…');
      // Pattern: "1001  a  Reitsitz HR. 0,5"
      const pattern = /(\d{4})\s+([a-z])\s+([^\n]+?)\s+(\d+,\d+)/g;
      const seen = new Map();
      let m;
      while ((m = pattern.exec(fullText)) !== null) {
        const code = m[1];
        const letter = m[2];
        const name = m[3].trim();
        const pts = parseFloat(m[4].replace(',', '.'));
        const fullCode = code + letter;
        // Disziplin aus erstem Ziffer ableiten
        const first = code[0];
        let disc = null;
        if (first === '1') disc = '1er';
        else if (first === '2') disc = '2er';
        else if (first === '4') disc = '4er';
        else if (first === '6') disc = '6er';
        if (!disc) continue;
        if (seen.has(fullCode)) continue;
        seen.set(fullCode, { c: fullCode, n: name, p: pts, d: disc });
      }

      const newDb = Array.from(seen.values());
      if (newDb.length < 100) {
        throw new Error('Nur ' + newDb.length + ' Übungen gefunden — das PDF-Layout passt nicht zum erwarteten Format. Übernahme abgebrochen.');
      }

      setPreviewDb(newDb);
      setParseStatus('success');
      const counts = {};
      DISCIPLINES.forEach(d => counts[d.id] = 0);
      newDb.forEach(e => counts[e.d]++);
      const summary = DISCIPLINES.map(d => d.id + ': ' + counts[d.id]).join(' · ');
      setParseMsg(newDb.length + ' Übungen erkannt (' + summary + ')');
    } catch (err) {
      setParseStatus('error');
      setParseMsg('Fehler: ' + (err.message || 'PDF konnte nicht verarbeitet werden'));
    }
  };

  const applyPreview = () => {
    if (!previewDb) return;
    if (!confirm('Aktuelle UCI-Datenbank durch ' + previewDb.length + ' neue Übungen ersetzen?')) return;
    setData({
      ...data,
      uci_custom: previewDb,
      uci_updated: new Date().toISOString()
    });
    setPreviewDb(null);
    setParseStatus(null);
    setParseMsg('');
  };

  const resetToDefault = () => {
    if (!confirm('Auf eingebaute UCI 2026 zurücksetzen?')) return;
    setData({ ...data, uci_custom: null, uci_updated: null });
  };

  const exportJson = () => {
    const json = JSON.stringify(getUciDb(), null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'uci-database-' + (data.uci_version || '2026') + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleJsonUpload = async (file) => {
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) throw new Error('Datei muss ein Array sein');
      // Validierung
      const valid = parsed.every(e => e.c && e.n && typeof e.p === 'number' && e.d);
      if (!valid) throw new Error('Format falsch — jeder Eintrag braucht c, n, p, d');
      if (parsed.length === 0) throw new Error('Datei ist leer');
      if (!confirm('Datenbank durch ' + parsed.length + ' Übungen ersetzen?')) return;
      setData({ ...data, uci_custom: parsed, uci_updated: new Date().toISOString() });
      alert('UCI-Datenbank aktualisiert.');
    } catch (err) {
      alert('Fehler: ' + (err.message || 'JSON konnte nicht geladen werden'));
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5 space-y-4">
      <h2 className="font-semibold flex items-center gap-2"><FileText size={16} /> UCI-Reglement</h2>

      {/* Status */}
      <div className="bg-slate-50 rounded-xl p-3 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-slate-500">Aktive Datenbank:</span>
          <span className={'text-xs font-medium px-2 py-0.5 rounded-full ' +
            (isCustom ? 'bg-violet-100 text-violet-700' : 'bg-sky-100 text-sky-700')}>
            {isCustom ? 'Custom · ' + currentCount + ' Übungen' : 'UCI 2026 · ' + currentCount + ' Übungen'}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1 text-xs">
          {DISCIPLINES.map(d => (
            <div key={d.id} className="bg-white rounded-lg px-2 py-1.5 text-center">
              <div className="font-semibold text-slate-900">{byDiscipline[d.id]}</div>
              <div className="text-slate-500">{d.id}</div>
            </div>
          ))}
        </div>
        {data.uci_updated && (
          <div className="text-xs text-slate-500">
            Zuletzt aktualisiert: {new Date(data.uci_updated).toLocaleString('de-DE')}
          </div>
        )}
      </div>

      {/* PDF Upload */}
      <div>
        <h3 className="text-sm font-semibold mb-2">📄 Neues UCI-Reglement (PDF)</h3>
        <p className="text-xs text-slate-500 mb-2 leading-relaxed">
          ⚠️ <strong>Beta-Funktion:</strong> Der PDF-Parser sucht nach dem typischen UCI-Tabellenformat (z.B. „1001 a Reitsitz HR. 0,5"). Bei Layout-Änderungen kann's schiefgehen. Im Zweifel JSON-Import nutzen.
        </p>
        <label className="block">
          <input type="file" accept="application/pdf"
            onChange={e => handlePdfUpload(e.target.files && e.target.files[0])}
            className="hidden" id="pdf-upload-input" />
          <button onClick={() => document.getElementById('pdf-upload-input').click()}
            disabled={parseStatus === 'parsing'}
            className="w-full bg-white border-2 border-dashed border-slate-300 hover:border-amber-400 px-4 py-4 rounded-xl text-sm font-medium flex items-center gap-2 justify-center disabled:opacity-50">
            <FileText size={16} /> PDF auswählen
          </button>
        </label>

        {parseStatus === 'parsing' && (
          <div className="mt-2 p-3 bg-sky-50 border border-sky-200 rounded-xl text-sm text-sky-900">
            ⏳ {parseMsg}
          </div>
        )}
        {parseStatus === 'success' && previewDb && (
          <div className="mt-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm space-y-2">
            <div className="text-emerald-900">✓ {parseMsg}</div>
            <div className="flex gap-2">
              <button onClick={applyPreview}
                className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium">
                Übernehmen
              </button>
              <button onClick={() => { setPreviewDb(null); setParseStatus(null); setParseMsg(''); }}
                className="bg-white border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-medium">
                Verwerfen
              </button>
            </div>
          </div>
        )}
        {parseStatus === 'error' && (
          <div className="mt-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-900">
            ✗ {parseMsg}
            <div className="text-xs mt-1 opacity-80">
              Tipp: Nutze stattdessen den JSON-Import unten oder schick mir das PDF.
            </div>
          </div>
        )}
      </div>

      {/* JSON Import/Export */}
      <div>
        <h3 className="text-sm font-semibold mb-2">📦 Backup als JSON</h3>
        <p className="text-xs text-slate-500 mb-2">
          Sicherer Weg: Aktuelle DB exportieren oder eine geprüfte JSON-Version importieren.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={exportJson}
            className="bg-white border border-slate-300 hover:bg-slate-50 px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 justify-center">
            <Download size={14} /> Exportieren
          </button>
          <label className="bg-white border border-slate-300 hover:bg-slate-50 px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 justify-center cursor-pointer">
            <FileText size={14} /> Importieren
            <input type="file" accept="application/json"
              onChange={e => handleJsonUpload(e.target.files && e.target.files[0])}
              className="hidden" />
          </label>
        </div>
      </div>

      {/* Reset auf Default */}
      {isCustom && (
        <div className="pt-3 border-t border-slate-200">
          <button onClick={resetToDefault}
            className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1.5">
            <RotateCcw size={14} /> Auf eingebaute UCI 2026 zurücksetzen
          </button>
        </div>
      )}

      {/* Übungen browsen */}
      <div className="pt-3 border-t border-slate-200">
        <button onClick={() => setShowAllExercises(!showAllExercises)}
          className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1.5">
          {showAllExercises ? '↑ Übungen verbergen' : '↓ Aktive Übungen anzeigen'}
        </button>
        {showAllExercises && (
          <div className="mt-3 space-y-2">
            <div className="flex gap-1.5">
              {DISCIPLINES.map(d => (
                <button key={d.id} onClick={() => setFilterDisc(d.id)}
                  className={'text-xs px-2 py-1 rounded-lg ' +
                    (filterDisc === d.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700')}>
                  {d.id} ({byDiscipline[d.id]})
                </button>
              ))}
            </div>
            <div className="border border-slate-200 rounded-xl max-h-64 overflow-y-auto">
              {getUciDb().filter(e => e.d === filterDisc).slice(0, 100).map(e => (
                <div key={e.c} className="px-3 py-1.5 border-b border-slate-100 text-xs flex justify-between gap-2">
                  <span className="truncate"><span className="text-slate-400">{e.c}</span> {e.n}</span>
                  <span className="text-slate-500 shrink-0">{e.p} Pkt</span>
                </div>
              ))}
              {byDiscipline[filterDisc] > 100 && (
                <div className="px-3 py-2 text-xs text-slate-500 text-center">
                  …und {byDiscipline[filterDisc] - 100} weitere
                </div>
              )}
            </div>
          </div>
        )}
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
  const pct = (n) => total.total ? Math.round((n / total.total) * 100) : 0;

  // Gefahren-Quote pro Zeitfenster (gesamt + letzte 30 Tage + letzte 90 Tage)
  const today = new Date();
  const cutoff30 = new Date(today.getTime() - 30 * 24 * 3600 * 1000).toISOString().slice(0, 10);
  const cutoff90 = new Date(today.getTime() - 90 * 24 * 3600 * 1000).toISOString().slice(0, 10);
  const window30 = exSessions.filter(s => s.date >= cutoff30).reduce((acc, s) => ({ fail: acc.fail + s.fail, total: acc.total + s.total }), { fail: 0, total: 0 });
  const window90 = exSessions.filter(s => s.date >= cutoff90).reduce((acc, s) => ({ fail: acc.fail + s.fail, total: acc.total + s.total }), { fail: 0, total: 0 });
  const gefPct30 = window30.total > 0 ? Math.round((window30.fail / window30.total) * 1000) / 10 : null;
  const gefPct90 = window90.total > 0 ? Math.round((window90.fail / window90.total) * 1000) / 10 : null;
  const gefPctTotal = total.total > 0 ? Math.round((total.fail / total.total) * 1000) / 10 : 0;

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

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold flex items-center gap-2">
          <Target size={18} className="text-amber-500" /> Sprung-Statistik
        </h2>
        <span className="text-xs text-slate-500">{exSessions.length} Sessions · seit {exSessions[0].date}</span>
      </div>

      {/* Headline: Gefahren-Quote — wichtigste Kennzahl */}
      <div className="bg-gradient-to-br from-rose-50 to-rose-100 border-2 border-rose-200 rounded-2xl p-4">
        <div className="flex items-center gap-1.5 mb-2">
          <AlertTriangle size={14} className="text-rose-700" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-800">Gefahren-Quote</span>
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-5xl font-bold text-rose-700 leading-none">{gefPctTotal.toFixed(1)}<span className="text-2xl">%</span></div>
          <div className="text-xs text-rose-700/80">
            <div className="font-medium">{total.fail} von {total.total}</div>
            <div className="opacity-75">Trainer am Seil</div>
          </div>
        </div>
        {(gefPct30 !== null || gefPct90 !== null) && (
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-rose-200/60">
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-wide text-rose-700/70 font-medium">Letzte 30 Tage</div>
              <div className="font-bold text-rose-700">
                {gefPct30 === null ? '—' : gefPct30.toFixed(1) + '%'}
              </div>
              {window30.total > 0 && (
                <div className="text-[10px] text-rose-700/60">{window30.fail} / {window30.total} Sprünge</div>
              )}
            </div>
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-wide text-rose-700/70 font-medium">Letzte 90 Tage</div>
              <div className="font-bold text-rose-700">
                {gefPct90 === null ? '—' : gefPct90.toFixed(1) + '%'}
              </div>
              {window90.total > 0 && (
                <div className="text-[10px] text-rose-700/60">{window90.fail} / {window90.total} Sprünge</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Gesamt-Zahlen */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-emerald-50 rounded-lg py-2.5">
          <div className="text-emerald-700 font-bold text-2xl">{pct(total.success)}%</div>
          <div className="text-slate-600">{statusLabel(exercise, 'success')}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{total.success}× absolut</div>
        </div>
        <div className="bg-amber-50 rounded-lg py-2.5">
          <div className="text-amber-700 font-bold text-2xl">{pct(total.third)}%</div>
          <div className="text-slate-600">{statusLabel(exercise, 'third')}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{total.third}× absolut</div>
        </div>
        <div className="bg-rose-50 rounded-lg py-2.5">
          <div className="text-rose-700 font-bold text-2xl">{pct(total.fail)}%</div>
          <div className="text-slate-600">{statusLabel(exercise, 'fail')}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{total.fail}× absolut</div>
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
  const [importStatus, setImportStatus] = useState(null); // null | 'parsing' | 'preview' | 'error'
  const [importPreview, setImportPreview] = useState(null);
  const [importMsg, setImportMsg] = useState('');

  const trainStats = calcExerciseTrainingStats(exercise, data.sessions || []);
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
          k1cross: Number(e1.cross || 0), k1wave: Number(e1.wave || 0), k1bar: Number(e1.bar || 0), k1circle: Number(e1.circle || 0),
          k2cross: Number(e2.cross || 0), k2wave: Number(e2.wave || 0), k2bar: Number(e2.bar || 0), k2circle: Number(e2.circle || 0)
        });
      });
    }
    result.sort((a, b) => (b.competition.date || '').localeCompare(a.competition.date || ''));
    return result;
  })();

  // Sessions-Liste mit Datum + Quote
  const sessionList = (() => {
    const exSessions = (data.sessions || []).filter(s => s.exerciseId === exercise.id).slice();
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
            <h1 className="text-[28px] font-bold tracking-tight leading-tight">{exercise.name}</h1>
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

        {/* Training-Statistik */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2">
              <Dumbbell size={18} className="text-amber-500" /> Training
            </h2>
            {trainStats.total > 0 && (
              <span className="text-xs text-slate-500">{trainStats.sessions} Sess. · {trainStats.total} Serien</span>
            )}
          </div>
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
                    <div key={i} className="flex items-center justify-between text-sm py-1">
                      <div className="text-slate-700">{s.session.date}</div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500">{s.success}/{s.total}</span>
                        <span className={'text-sm font-bold w-10 text-right ' + (s.rate >= 80 ? 'text-emerald-600' : s.rate >= 60 ? 'text-amber-600' : 'text-rose-600')}>
                          {s.rate}%
                        </span>
                      </div>
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
              {/* Durchschnitt pro Wettkampf (Summe KG1 + KG2 / Anzahl WK) */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-slate-100 rounded-lg py-2">
                  <div className="text-xs text-slate-600 font-bold">x</div>
                  <div className="font-bold text-lg">Ø {(compStats.cross / compStats.wettkaempfe).toFixed(1)}</div>
                  <div className="text-[10px] text-slate-400">{compStats.cross} ges.</div>
                </div>
                <div className="bg-slate-100 rounded-lg py-2">
                  <div className="text-xs text-slate-600 font-bold">~</div>
                  <div className="font-bold text-lg">Ø {(compStats.wave / compStats.wettkaempfe).toFixed(1)}</div>
                  <div className="text-[10px] text-slate-400">{compStats.wave} ges.</div>
                </div>
                <div className="bg-slate-100 rounded-lg py-2">
                  <div className="text-xs text-slate-600 font-bold">|</div>
                  <div className="font-bold text-lg">Ø {(compStats.bar / compStats.wettkaempfe).toFixed(1)}</div>
                  <div className="text-[10px] text-slate-400">{compStats.bar} ges.</div>
                </div>
                <div className="bg-rose-100 rounded-lg py-2">
                  <div className="text-xs text-rose-700 font-bold">○</div>
                  <div className="font-bold text-lg text-rose-700">Ø {(compStats.circle / compStats.wettkaempfe).toFixed(1)}</div>
                  <div className="text-[10px] text-rose-400">{compStats.circle} ges.</div>
                </div>
              </div>
              {/* Durchschnittlicher Punktabzug pro Wettkampf */}
              {(() => {
                const totalDed = compStats.cross * 0.2 + compStats.wave * 0.5 + compStats.bar * 1.0 + compStats.circle * 2.0;
                const avgDed = totalDed / compStats.wettkaempfe;
                return (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg py-3 px-4 flex items-baseline justify-between">
                    <div className="text-xs text-slate-700">Ø Punktabzug pro Wettkampf</div>
                    <div className="font-bold text-2xl text-amber-700">−{avgDed.toFixed(2)}</div>
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
                    const total = xSum + wSum + bSum + cSum;
                    return (
                      <div key={i} className="flex items-start justify-between gap-2 text-sm py-1">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{c.competition.name}</div>
                          <div className="text-xs text-slate-500">{c.competition.date}</div>
                        </div>
                        <div className="flex flex-wrap gap-1 text-xs justify-end shrink-0">
                          {total === 0 ? (
                            <span className="text-emerald-700 font-medium">✓ sauber</span>
                          ) : (
                            <>
                              {xSum > 0 && <span className="bg-slate-100 px-1.5 py-0.5 rounded"><strong>x</strong>×{xSum}</span>}
                              {wSum > 0 && <span className="bg-slate-100 px-1.5 py-0.5 rounded"><strong>~</strong>×{wSum}</span>}
                              {bSum > 0 && <span className="bg-slate-100 px-1.5 py-0.5 rounded"><strong>|</strong>×{bSum}</span>}
                              {cSum > 0 && <span className="bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded"><strong>○</strong>×{cSum}</span>}
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
  const [editing, setEditing] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [selected, setSelected] = useState(null); // Übung in Detail-Ansicht
  const [pendingDelete, setPendingDelete] = useState(null);

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
          <div className="flex items-end gap-1 min-w-0">
            <button onClick={onBack} className="p-2 -ml-2 text-[#FF9500] active:opacity-50">
              <ChevronLeft size={28} strokeWidth={2.6} />
            </button>
            <div className="min-w-0">
              <h1 className="text-[34px] font-bold tracking-tight leading-none">Übungen</h1>
              <p className="text-[13px] text-[#8E8E93] mt-1">{data.exercises.filter(e => e.active).length} aktiv · {data.exercises.filter(e => !e.active).length} archiviert</p>
            </div>
          </div>
          <button onClick={() => setShowNew(true)}
            className="bg-slate-900 text-white px-4 py-2 rounded-full font-semibold text-[14px] flex items-center gap-1.5 shadow-sm active:scale-95 transition">
            <Plus size={16} /> Neu
          </button>
        </header>

        {/* iOS-style Inset Grouped List */}
        <IOSList footer="Tippe auf eine Übung um Statistik (Training + Wettkampf) zu sehen.">
          {data.exercises.map(ex => {
            const compStats = calcExerciseCompetitionStats(ex, data.programs || [], data.competitions || []);
            const totalErrors = compStats.cross + compStats.wave + compStats.bar + compStats.circle;
            const trainStats = calcExerciseTrainingStats(ex, data.sessions || []);
            return (
              <IOSListRow
                key={ex.id}
                onClick={() => setSelected(ex)}
                className={!ex.active ? 'opacity-60' : ''}>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-medium text-[15px] text-[#000]">{ex.name}</h3>
                  {ex.uci_code && <IOSTag color="blue">UCI {ex.uci_code}</IOSTag>}
                  {ex.category_mode === 3 && <IOSTag color="orange">3-Status</IOSTag>}
                  {!ex.active && <IOSTag color="gray">archiviert</IOSTag>}
                </div>
                <div className="text-[13px] text-[#8E8E93] mt-0.5 flex items-center gap-1.5 flex-wrap">
                  {Number(ex.points) > 0 && <span>{Number(ex.points).toFixed(1)} Pkt</span>}
                  {trainStats.total > 0 && (
                    <>
                      <span>·</span>
                      <span className={trainStats.rate >= 80 ? 'text-[#34C759]' : trainStats.rate >= 60 ? 'text-[#FF9500]' : 'text-[#FF3B30]'}>
                        Training {trainStats.rate}%
                      </span>
                    </>
                  )}
                  {compStats.wettkaempfe > 0 && (
                    <>
                      <span>·</span>
                      <span>{compStats.wettkaempfe} WK{totalErrors === 0 ? ' ✓' : ' · ' + totalErrors + ' Fehler'}</span>
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
      default_series: Number(series) || 10
    });
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] p-4 sm:p-8">
      <div className="max-w-2xl mx-auto space-y-5">
        <header className="flex items-center gap-3">
          <button onClick={onCancel} className="p-2 -m-2 text-slate-500"><ChevronLeft size={22} /></button>
          <h1 className="text-2xl font-bold">{exercise ? 'Übung bearbeiten' : 'Neue Übung'}</h1>
        </header>

        {/* Modus-Wahl */}
        <div className="flex gap-2">
          <button onClick={() => setMode('uci')}
            className={'flex-1 py-3 rounded-xl font-medium ' + (mode === 'uci' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-300')}>
            Aus UCI-Liste
          </button>
          <button onClick={() => { setMode('custom'); setUciCode(''); setUciDisc(null); }}
            className={'flex-1 py-3 rounded-xl font-medium ' + (mode === 'custom' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-300')}>
            Eigene Übung
          </button>
        </div>

        {/* UCI-Suche */}
        {mode === 'uci' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
            <div>
              <label className="text-sm font-medium block mb-1.5">Disziplin</label>
              <select value={uciDisc} onChange={e => { setUciDisc(e.target.value); setUciCode(''); setName(''); }}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-amber-500">
                {DISCIPLINES.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
              </select>
            </div>
            <UciPicker discipline={uciDisc} onSelect={handleUciSelect} selectedCode={uciCode} />
          </div>
        )}

        {/* Name */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
          <div>
            <label className="text-sm font-medium block mb-1.5">
              {mode === 'uci' ? 'Anzeigename (anpassbar)' : 'Name'}
            </label>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder={mode === 'custom' ? 'z.B. Maute-Sprung' : ''}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">Status-Modus</label>
            <select value={statusMode} onChange={e => setStatusMode(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-amber-500">
              <option value={2}>2 Kategorien (Geklappt / Nicht geklappt)</option>
              <option value={3}>3 Kategorien (+ z.B. Gefährlich)</option>
            </select>
            {Number(statusMode) === 3 && (
              <p className="text-xs text-slate-500 mt-1.5">
                💡 Für Risiko-Übungen wie den Maute-Sprung. Die dritte Kategorie ist eine Sonderform von „nicht geklappt" — z.B. wenn die Übung nicht geklappt UND zusätzlich gefährlich war (Sturz). So kannst du diese Versuche getrennt auswerten.
              </p>
            )}
          </div>

          {Number(statusMode) === 3 && (
            <div>
              <label className="text-sm font-medium block mb-1.5">Name der dritten Kategorie</label>
              <input value={thirdLabel} onChange={e => setThirdLabel(e.target.value)}
                placeholder="z.B. Gefährlich, Unsicher, Mit Hilfe"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
          )}

          <div>
            <label className="text-sm font-medium block mb-1.5">Standard-Serienanzahl</label>
            <input type="number" value={series} onChange={e => setSeries(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 bg-white border border-slate-300 px-5 py-3 rounded-xl font-medium">
            Abbrechen
          </button>
          <button onClick={save} disabled={!name.trim()}
            className="flex-1 bg-emerald-600 text-white px-5 py-3 rounded-xl font-medium disabled:opacity-50 flex items-center justify-center gap-2">
            <Save size={16} /> Speichern
          </button>
        </div>
      </div>
    </div>
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
function Erfassen({ data, setData, onDone }) {
  const activeExercises = data.exercises.filter(e => e.active);
  const athletes = data.athletes || [];
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [exerciseId, setExerciseId] = useState((activeExercises[0] && activeExercises[0].id) || '');
  const [athleteId, setAthleteId] = useState((athletes[0] && athletes[0].id) || '');
  const [entries, setEntries] = useState([]);

  useEffect(() => { setEntries([]); }, [exerciseId]);

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
        date,
        athleteId: athleteId || null,
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        entries
      }]
    });
    onDone();
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] p-4 sm:p-8">
      <div className="max-w-2xl mx-auto space-y-5">
        <header className="flex items-center gap-3">
          <button onClick={onDone} className="p-2 -m-2 text-slate-500"><ChevronLeft size={22} /></button>
          <h1 className="text-2xl font-bold">Serie protokollieren</h1>
        </header>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
          <div>
            <label className="text-sm font-medium block mb-1.5">Datum</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          {athletes.length > 0 && (
            <div>
              <label className="text-sm font-medium block mb-1.5">Sportler / Team</label>
              <select value={athleteId} onChange={e => setAthleteId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-amber-500">
                <option value="">— Kein Sportler —</option>
                {athletes.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name}{a.type === 'team' ? ' (Team)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="text-sm font-medium block mb-1.5">Übung</label>
            <select value={exerciseId} onChange={e => setExerciseId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-amber-500">
              {activeExercises.map(e => (
                <option key={e.id} value={e.id}>
                  {e.name}{e.category_mode === 3 ? ' (+ ' + e.third_label + ')' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Serien</h2>
            <span className="bg-sky-100 text-sky-700 text-xs font-medium px-2 py-0.5 rounded-full">
              {entries.length} / {(exercise && exercise.default_series) || '∞'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <button onClick={() => setEntries([...entries, 'success'])}
              className="bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-semibold flex flex-col items-center gap-1 active:scale-95 transition-transform">
              <Check size={28} /><span>{statusLabel(exercise, 'success')}</span>
              <span className="text-xs opacity-80">{success}</span>
            </button>
            <button onClick={() => setEntries([...entries, 'fail'])}
              className="bg-rose-600 hover:bg-rose-700 text-white py-5 rounded-2xl font-semibold flex flex-col items-center gap-1 active:scale-95 transition-transform">
              <X size={28} /><span>{statusLabel(exercise, 'fail')}</span>
              <span className="text-xs opacity-80">{fail}</span>
            </button>
          </div>

          {use3 && (
            <button onClick={() => setEntries([...entries, 'third'])}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 mb-3 active:scale-95 transition-transform">
              <AlertTriangle size={20} /><span>{thirdLabel}</span>
              <span className="text-sm opacity-80">· {third}</span>
            </button>
          )}

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
            ← Letzte entfernen
          </button>
        </div>

        <div className="flex gap-2">
          <button onClick={onDone}
            className="flex-1 bg-white border border-slate-300 px-5 py-3 rounded-xl font-medium">
            Abbrechen
          </button>
          <button onClick={save} disabled={entries.length === 0}
            className="flex-1 bg-emerald-600 text-white px-5 py-3 rounded-xl font-medium disabled:opacity-50 flex items-center justify-center gap-2">
            <Save size={16} /> Speichern
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
      <header className="flex items-end justify-between flex-wrap gap-3 pt-2">
        <div>
          <h1 className="text-[34px] font-bold tracking-tight leading-none">Programme</h1>
          <p className="text-slate-500 text-sm mt-1">Übungsfolgen für Wettkämpfe</p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="bg-slate-900 text-white px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-1.5 shadow-sm active:scale-95 transition">
          <Plus size={16} /> Neues Programm
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
  const [name, setName] = useState((program && program.name) || '');
  const [discipline, setDiscipline] = useState((program && program.discipline) || '1er');
  const [exercises, setExercises] = useState((program && program.exercises) || []);

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

  const loadMaute = () => {
    if (exercises.length > 0 && !confirm('Bestehende Übungen ersetzen?')) return;
    setExercises(MAUTE_PROGRAM_1ER_ELITE.map(e => ({ ...e, id: uid() })));
    if (!name) setName('1er Kunstrad Elite Männer');
    setDiscipline('1er');
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

  return (
    <div className="space-y-5">
      <header className="flex items-center gap-3">
        <button onClick={onCancel} className="p-2 -m-2 text-slate-500"><ChevronLeft size={22} /></button>
        <div>
          <h1 className="text-2xl font-bold">{program ? 'Programm bearbeiten' : 'Neues Programm'}</h1>
          <p className="text-slate-500 text-sm">Übungen aus UCI-Liste oder eigene</p>
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-5 space-y-3">
        <div>
          <label className="text-sm font-medium block mb-1.5">Name</label>
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder="z.B. 1er Elite Männer"
            className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">Disziplin</label>
          <select value={discipline} onChange={e => setDiscipline(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-amber-500">
            {DISCIPLINES.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
          </select>
        </div>
        <button onClick={loadMaute}
          className="w-full bg-white border border-slate-300 px-4 py-2 rounded-xl font-medium text-sm flex items-center gap-1.5 justify-center">
          <Sparkles size={14} /> Maute-Vorlage 1er Elite laden
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Übungen ({exercises.length})</h3>
          <div className="text-sm font-semibold text-slate-700">Σ {total.toFixed(2)} Pkt.</div>
        </div>

        {exercises.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">
            Noch keine Übungen. Lade die Maute-Vorlage oder füge einzelne hinzu.
          </p>
        ) : (
          <div className="space-y-2">
            {exercises.map((e, idx) => (
              <ProgrammExerciseRow
                key={e.id}
                ex={e}
                discipline={discipline}
                onUci={(u) => setUci(idx, u)}
                onUpdate={(k, v) => updateField(idx, k, v)}
                onRemove={() => removeEx(idx)}
              />
            ))}
          </div>
        )}

        <button onClick={addEmptyRow}
          className="mt-3 w-full text-sm text-slate-600 hover:bg-slate-50 px-3 py-2 rounded-lg flex items-center gap-1.5 justify-center">
          <Plus size={14} /> Übung hinzufügen
        </button>
      </div>

      <div className="flex gap-2">
        <button onClick={onCancel}
          className="flex-1 bg-white border border-slate-300 px-5 py-3 rounded-xl font-medium">
          Abbrechen
        </button>
        <button onClick={save} disabled={!name.trim() || exercises.length === 0}
          className="flex-1 bg-emerald-600 text-white px-5 py-3 rounded-xl font-medium disabled:opacity-50 flex items-center justify-center gap-2">
          <Save size={16} /> Speichern
        </button>
      </div>
    </div>
  );
}

function ProgrammExerciseRow({ ex, discipline, onUci, onUpdate, onRemove }) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="bg-slate-50 rounded-xl p-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-xs text-slate-500 w-7 shrink-0">#{ex.nr}</div>
        <div className="flex-1 min-w-0">
          {ex.name ? (
            <div>
              <div className="font-medium text-sm truncate">{ex.name}</div>
              <div className="text-xs text-slate-500">
                {ex.code ? 'UCI ' + ex.code : 'Eigene'} · {Number(ex.points).toFixed(1)} Pkt.
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-400 italic">Noch nicht ausgewählt</div>
          )}
        </div>
        <button onClick={() => setPickerOpen(!pickerOpen)}
          className="text-xs px-2 py-1 bg-white border border-slate-300 rounded-lg hover:bg-slate-100">
          {ex.name ? 'Ändern' : 'UCI wählen'}
        </button>
        <button onClick={onRemove} className="p-1 text-slate-400 hover:text-rose-600">
          <Trash2 size={14} />
        </button>
      </div>

      {pickerOpen && (
        <div className="mt-2 pt-2 border-t border-slate-200">
          <UciPicker discipline={discipline}
            onSelect={(u) => { onUci(u); setPickerOpen(false); }}
            selectedCode={ex.code} />
          <div className="text-xs text-slate-500 mt-2">
            Oder Name + Punkte selbst eintippen für eigene Übung:
          </div>
          <div className="grid grid-cols-3 gap-1.5 mt-1.5">
            <input value={ex.name || ''} onChange={e => onUpdate('name', e.target.value)}
              placeholder="Name" className="col-span-2 px-2 py-1.5 text-xs border border-slate-300 rounded-lg outline-none" />
            <input type="number" step="0.1" value={ex.points || 0} onChange={e => onUpdate('points', e.target.value)}
              placeholder="Pkt." className="px-2 py-1.5 text-xs border border-slate-300 rounded-lg outline-none text-right" />
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================
// WETTKAMPF
// =============================================================
function WettkampfView({ data, setData }) {
  const [tab, setTab] = useState('wettkaempfe'); // 'wettkaempfe' | 'programme'
  const [editId, setEditId] = useState(null);
  const [viewId, setViewId] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Wenn Tab Programme, render ProgrammeView eingebettet
  if (tab === 'programme') {
    return (
      <div className="space-y-4">
        <div className="bg-[#E5E5EA] rounded-xl p-1 flex gap-1">
          <button onClick={() => setTab('wettkaempfe')}
            className={'flex-1 py-1.5 rounded-lg text-[14px] font-medium transition ' +
              (tab === 'wettkaempfe' ? 'bg-white shadow-sm text-[#000]' : 'text-[#3C3C43] active:opacity-70')}>
            Wettkämpfe
          </button>
          <button onClick={() => setTab('programme')}
            className={'flex-1 py-1.5 rounded-lg text-[14px] font-medium transition ' +
              (tab === 'programme' ? 'bg-white shadow-sm text-[#000]' : 'text-[#3C3C43] active:opacity-70')}>
            Programme
          </button>
        </div>
        <ProgrammeView data={data} setData={setData} />
      </div>
    );
  }

  const competitions = data.competitions || [];
  const programs = data.programs || [];
  const athletes = data.athletes || [];

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

  const sorted = [...competitions].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  return (
    <div className="space-y-5">
      <div className="bg-[#E5E5EA] rounded-xl p-1 flex gap-1">
        <button onClick={() => setTab('wettkaempfe')}
          className={'flex-1 py-1.5 rounded-lg text-[14px] font-medium transition ' +
            (tab === 'wettkaempfe' ? 'bg-white shadow-sm text-[#000]' : 'text-[#3C3C43] active:opacity-70')}>
          Wettkämpfe
        </button>
        <button onClick={() => setTab('programme')}
          className={'flex-1 py-1.5 rounded-lg text-[14px] font-medium transition ' +
            (tab === 'programme' ? 'bg-white shadow-sm text-[#000]' : 'text-[#3C3C43] active:opacity-70')}>
          Programme
        </button>
      </div>
      <header className="flex items-end justify-between flex-wrap gap-3 pt-2">
        <div>
          <h1 className="text-[34px] font-bold tracking-tight leading-none">Wettkampf</h1>
          <p className="text-slate-500 text-sm mt-1">Wertungsbögen — beide Kampfgerichte + Endergebnis</p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="bg-slate-900 text-white px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-1.5 shadow-sm active:scale-95 transition">
          <Plus size={16} /> Wertungsbogen erfassen
        </button>
      </header>

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
        <IOSList>
          {sorted.map(c => {
            const program = programs.find(p => p.id === c.program_id);
            const t1 = program ? calcTableResult(program, c.table1, c.t1_schwierigkeit) : null;
            const t2 = program ? calcTableResult(program, c.table2, c.t2_schwierigkeit) : null;
            const final = (t1 && t2) ? Math.round(((t1.ergebnis + t2.ergebnis) / 2) * 100) / 100 : null;
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
                  {c.date}{c.location ? ' · ' + c.location : ''}{athlete ? ' · ' + athlete.name : ''}
                </div>
              </IOSListRow>
            );
          })}
        </IOSList>
      )}
    </div>
  );
}

// =============================================================
// WETTKAMPF-EDITOR
// =============================================================
// =============================================================
// VALIDIERUNG gegen PDF-Soll
// =============================================================
function ValidationCheck({ pdfRef, t1, t2 }) {
  const TOL = 0.01; // Toleranz wegen Rundungen

  // Pro KG: Ist (berechnet) vs. Soll (aus PDF)
  const checks = [
    { label: 'KG 1 Ausführung', ist: t1.abzugAusfuehrung, soll: pdfRef.kg1_ausfuehrung },
    { label: 'KG 1 Schwierigkeit', ist: t1.abzugSchwierigkeit, soll: pdfRef.kg1_schwierigkeit },
    { label: 'KG 1 Gesamt', ist: t1.abzugGesamt, soll: pdfRef.kg1_gesamt },
    { label: 'KG 2 Ausführung', ist: t2.abzugAusfuehrung, soll: pdfRef.kg2_ausfuehrung },
    { label: 'KG 2 Schwierigkeit', ist: t2.abzugSchwierigkeit, soll: pdfRef.kg2_schwierigkeit },
    { label: 'KG 2 Gesamt', ist: t2.abzugGesamt, soll: pdfRef.kg2_gesamt }
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

function WettkampfEditor({ competition, programs, athletes, existingExercises, onSave, onCancel }) {
  const isNew = !competition;
  const [name, setName] = useState((competition && competition.name) || '');
  const [date, setDate] = useState((competition && competition.date) || new Date().toISOString().slice(0, 10));
  const [location, setLocation] = useState((competition && competition.location) || '');
  const [host, setHost] = useState((competition && competition.host) || '');
  const [startNr, setStartNr] = useState((competition && competition.start_nr) || '');
  const [athleteId, setAthleteId] = useState((competition && competition.athlete_id) || ((athletes || [])[0] && (athletes || [])[0].id) || '');
  const [programId, setProgramId] = useState((competition && competition.program_id) || (programs[0] && programs[0].id) || '');
  // Beim PDF-Import: neue Programme und Übungen werden hier zwischengespeichert,
  // erst beim Speichern committet (eine atomare Datenänderung statt mehrere)
  const [pendingNewProgram, setPendingNewProgram] = useState(null);
  const [pendingNewExercises, setPendingNewExercises] = useState([]);

  // pendingNewProgram hat Vorrang — neu erstelltes Programm aus PDF wird angezeigt, bevor es gespeichert ist
  const program = pendingNewProgram || programs.find(p => p.id === programId);

  const initEntries = (existing) => {
    if (!program) return [];
    return program.exercises.map(ex => {
      const found = existing && existing.find(e => e.exerciseId === ex.id);
      return found || { exerciseId: ex.id, included: true, cross: 0, wave: 0, bar: 0, circle: 0, schwPct: 0, taktischePunkte: 0 };
    });
  };

  const [table1, setTable1] = useState(() => initEntries(competition && competition.table1));
  const [table2, setTable2] = useState(() => initEntries(competition && competition.table2));
  const [t1S, setT1S] = useState((competition && competition.t1_schwierigkeit) || 0);
  const [t2S, setT2S] = useState((competition && competition.t2_schwierigkeit) || 0);
  const [activeTable, setActiveTable] = useState(1);
  const [showExercises, setShowExercises] = useState(true);
  // Referenz-Werte aus letztem PDF-Import zur Validierung
  const [pdfRef, setPdfRef] = useState(competition && competition.pdf_ref ? competition.pdf_ref : null);

  // PDF-Import State
  const [importStatus, setImportStatus] = useState(null); // null | 'parsing' | 'success' | 'error'
  const [importMsg, setImportMsg] = useState('');
  const [importPreview, setImportPreview] = useState(null);
  const [showPasteArea, setShowPasteArea] = useState(false);
  const [pasteText, setPasteText] = useState('');

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

  // Wertungsbericht aus PDF-Text parsen
  const parseWertungsbericht = (text) => {
    const result = { errors: [] };
    // Bekannte Feld-Labels — Pattern stoppt am nächsten Label (Browser liefert oft alles in einer Zeile)
    const STOP = '(?=\\s*(?:Wettbewerb|Ort|Datum|Ausrichter|Startnummer|Starter|Verein|Disziplin|Üb-Nr|Übungstext|Ansager|Schreiber|Chief|Abzug|Gesamtabzug|Aufgestellte|Endergebnis|Ausgefahrene)\\b|\\n|\\r|$)';
    const field = (label) => {
      const m = text.match(new RegExp(label + ':\\s*(.+?)' + STOP));
      if (!m) return null;
      // Aufräumen: zu langes? abschneiden
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
    // Disziplin extra: stoppt am ersten 4-stelligen Code (Übungs-Bereich) oder bei "1 " "2 " etc.
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

    // Footer (zwei Mal: KG1 + KG2)
    const schwM = [...text.matchAll(/Abzug Schwierigkeit:\s*([\d,\.]+)/g)];
    const ausfM = [...text.matchAll(/Abzug Ausführung:\s*([\d,\.]+)/g)];
    const gesM = [...text.matchAll(/Gesamtabzug:\s*([\d,\.]+)/g)];
    const ausgefM = [...text.matchAll(/Ausgefahrene Punkte:\s*([\d,\.]+)/g)];
    const aufM = text.match(/Aufgestellte Punkte:\s*([\d,\.]+)/);
    const endM = text.match(/Endergebnis:\s*([\d,\.]+)/);

    const num = (s) => parseFloat(String(s).replace(',', '.'));

    if (schwM.length >= 2) {
      result.kg1_schwierigkeit = num(schwM[0][1]);
      result.kg2_schwierigkeit = num(schwM[1][1]);
    }
    if (ausfM.length >= 2) {
      result.kg1_ausfuehrung = num(ausfM[0][1]);
      result.kg2_ausfuehrung = num(ausfM[1][1]);
    }
    if (gesM.length >= 2) {
      result.kg1_gesamtabzug = num(gesM[0][1]);
      result.kg2_gesamtabzug = num(gesM[1][1]);
    }
    if (ausgefM.length >= 2) {
      result.kg1_ausgefahren = num(ausgefM[0][1]);
      result.kg2_ausgefahren = num(ausgefM[1][1]);
    }
    if (aufM) result.aufgestellt = num(aufM[1]);
    if (endM) result.endergebnis = num(endM[1]);

    if (!result.wettbewerb && !result.starter) {
      result.errors.push('Konnte keine Wettkampf-Daten erkennen — ist das ein Wertungsbericht-PDF?');
    }
    return result;
  };

  const applyImport = (parsed) => {
    if (parsed.wettbewerb) setName(parsed.wettbewerb);
    if (parsed.datum) setDate(parsed.datum);
    if (parsed.ort) setLocation(parsed.ort);
    if (parsed.ausrichter) setHost(parsed.ausrichter);
    if (parsed.startnr) setStartNr(parsed.startnr);

    // Programm aus Disziplin-Text auto-erkennen
    let activeProgram = pendingNewProgram || programs.find(p => p.id === programId);
    let createdNewProgram = null;

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

    // Wenn kein passendes Programm: aus den PDF-Übungen ein neues erzeugen (PENDING — wird beim Speichern committet)
    if (!activeProgram && parsed.exerciseRows && parsed.exerciseRows.length > 0) {
      const disc = parsed.disziplin
        ? (['1er', '2er', '4er', '6er'].find(d => parsed.disziplin.toLowerCase().includes(d)) || '1er')
        : '1er';
      const newProg = {
        id: uid(),
        name: parsed.disziplin
          ? parsed.disziplin.replace('Kunstradsport', '').trim()
          : (parsed.wettbewerb || 'Programm') + ' (' + disc + ')',
        discipline: disc,
        exercises: parsed.exerciseRows.map((r, idx) => ({
          id: 'p_ex_' + idx + '_' + Date.now(),
          nr: idx + 1,
          name: r.name || ('Übung ' + (idx + 1)),
          code: r.code || null,
          points: Number(r.points || 0)
        })),
        created: new Date().toISOString()
      };
      setPendingNewProgram(newProg);
      setProgramId(newProg.id);
      activeProgram = newProg;
      createdNewProgram = newProg;
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

  return (
    <div className="space-y-5">
      <header className="flex items-center gap-3">
        <button onClick={onCancel} className="p-2 -m-2 text-slate-500"><ChevronLeft size={22} /></button>
        <div>
          <h1 className="text-2xl font-bold">{isNew ? 'Wertungsbogen erfassen' : 'Wettkampf bearbeiten'}</h1>
          <p className="text-slate-500 text-sm">Beide Kampfgerichte + Endergebnis</p>
        </div>
      </header>

      {/* PDF-Import (Beta) - nur bei neuen Wettkämpfen */}
      {isNew && (
        <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-start gap-2">
            <FileText size={18} className="text-violet-700 shrink-0 mt-0.5" />
            <div className="text-sm text-violet-900">
              <strong>Wertungsbericht importieren (Beta)</strong>
              <p className="text-xs mt-0.5 opacity-90">
                PDF auswählen → Stammdaten und alle Abzüge pro Übung werden automatisch gesetzt.
              </p>
            </div>
          </div>

          {!importPreview && (
            <div className="grid grid-cols-2 gap-2">
              <label className="bg-white border border-violet-300 hover:bg-violet-50 px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 justify-center cursor-pointer">
                <FileText size={14} /> PDF auswählen
                <input type="file" accept="application/pdf"
                  onChange={e => handlePdfImport(e.target.files && e.target.files[0])}
                  className="hidden" />
              </label>
              <button onClick={() => setShowPasteArea(!showPasteArea)}
                className="bg-white border border-violet-300 hover:bg-violet-50 px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 justify-center">
                <Edit2 size={14} /> {showPasteArea ? 'Text-Eingabe schließen' : 'Text einfügen'}
              </button>
            </div>
          )}

          {showPasteArea && !importPreview && (
            <div className="space-y-2">
              <textarea value={pasteText} onChange={e => setPasteText(e.target.value)}
                placeholder="Falls PDF-Upload nicht klappt: PDF in einem Viewer öffnen, gesamten Text markieren (Strg+A), kopieren (Strg+C) und hier einfügen."
                rows={4}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 font-mono" />
              <button onClick={handlePasteImport} disabled={!pasteText.trim()}
                className="bg-violet-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium disabled:opacity-50">
                Text auswerten
              </button>
            </div>
          )}

          {importStatus === 'parsing' && (
            <div className="bg-white rounded-xl p-3 text-sm text-violet-900">⏳ {importMsg}</div>
          )}
          {importStatus === 'error' && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-sm text-rose-900">
              ✗ {importMsg}
              <div className="text-xs mt-1 opacity-80">
                Tipp: Versuche „Text einfügen" als Alternative.
              </div>
            </div>
          )}
          {importStatus === 'success' && importPreview && (
            <div className="bg-white rounded-xl p-3 space-y-2">
              <div className="text-sm font-medium text-emerald-900">✓ Erkannt:</div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                {importPreview.wettbewerb && <div><span className="text-slate-500">Wettbewerb:</span> <strong>{importPreview.wettbewerb}</strong></div>}
                {importPreview.datum && <div><span className="text-slate-500">Datum:</span> <strong>{importPreview.datum}</strong></div>}
                {importPreview.ort && <div><span className="text-slate-500">Ort:</span> <strong>{importPreview.ort}</strong></div>}
                {importPreview.ausrichter && <div><span className="text-slate-500">Ausrichter:</span> <strong>{importPreview.ausrichter}</strong></div>}
                {importPreview.startnr && <div><span className="text-slate-500">Startnr:</span> <strong>{importPreview.startnr}</strong></div>}
                {importPreview.starter && <div><span className="text-slate-500">Starter:</span> <strong>{importPreview.starter}</strong></div>}
                {importPreview.disziplin && <div className="col-span-2"><span className="text-slate-500">Disziplin:</span> <strong>{importPreview.disziplin}</strong></div>}
                {typeof importPreview.aufgestellt === 'number' && <div><span className="text-slate-500">Aufgestellt:</span> <strong>{importPreview.aufgestellt.toFixed(2)}</strong></div>}
                {typeof importPreview.endergebnis === 'number' && <div className="col-span-2 text-amber-700"><span className="text-slate-500">Endergebnis (laut PDF):</span> <strong>{importPreview.endergebnis.toFixed(2)}</strong></div>}
              </div>
              {importPreview.exerciseRows && importPreview.exerciseRows.length > 0 ? (
                <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-2">
                  ✓ <strong>{importPreview.exerciseRows.length} Übungen</strong> automatisch erkannt
                </p>
              ) : (
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2">
                  ⚠️ Pro-Übung-Werte konnten nicht erkannt werden — nur Stammdaten und Schwierigkeit werden gesetzt. Abzüge bitte manuell pro Übung eintragen.
                </p>
              )}
              {importPreview.warnings && importPreview.warnings.length > 0 && (
                <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2">
                  ⚠️ {importPreview.warnings.join(' · ')}
                </div>
              )}
              <div className="flex gap-2 pt-1">
                <button onClick={() => applyImport(importPreview)}
                  className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1">
                  <Check size={14} /> Übernehmen
                </button>
                <button onClick={() => { setImportPreview(null); setImportStatus(null); setImportMsg(''); }}
                  className="bg-white border border-slate-300 px-3 py-1.5 rounded-lg text-sm font-medium">
                  Verwerfen
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

      {/* Live-Ergebnis */}
      {program && (
        <div className="bg-slate-900 text-white rounded-2xl p-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-xs text-slate-400">Aufgestellt</div>
              <div className="text-xl font-bold">{(t1 && t1.aufgestellt || 0).toFixed(2)}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">KG 1 / KG 2</div>
              <div className="text-base font-bold">
                {t1 && t1.ergebnis.toFixed(2)}
                <span className="text-slate-500 mx-1">·</span>
                {t2 && t2.ergebnis.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-xs text-amber-300">Endergebnis</div>
              <div className="text-2xl font-bold text-amber-400">{finalScore.toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}

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

      <div className="flex gap-2">
        <button onClick={onCancel}
          className="flex-1 bg-white border border-slate-300 px-5 py-3 rounded-xl font-medium">
          Abbrechen
        </button>
        <button onClick={save} disabled={!name.trim() || !program}
          className="flex-1 bg-emerald-600 text-white px-5 py-3 rounded-xl font-medium disabled:opacity-50 flex items-center justify-center gap-2">
          <Save size={16} /> Speichern
        </button>
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
                  <div className="font-medium text-sm leading-tight mt-0.5">{ex.name}</div>
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
                    <div className="font-medium leading-tight line-clamp-2">{ex.name}</div>
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
function SportlerView({ data, setData }) {
  const [editing, setEditing] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [inviteFor, setInviteFor] = useState(null);

  const athletes = data.athletes || [];

  const upsert = (a) => {
    const exists = athletes.find(x => x.id === a.id);
    setData({
      ...data,
      athletes: exists ? athletes.map(x => x.id === a.id ? a : x) : [...athletes, a]
    });
  };

  const remove = (id) => {
    if (!confirm('Sportler wirklich löschen?')) return;
    setData({ ...data, athletes: athletes.filter(a => a.id !== id) });
  };

  const generateCode = () => String(Math.floor(100000 + Math.random() * 900000));

  const invite = (athleteId, email) => {
    const ath = athletes.find(a => a.id === athleteId);
    if (!ath) return;
    const code = generateCode();
    const updated = {
      ...ath,
      email: email.toLowerCase(),
      login_code: code,
      invite_status: 'invited',
      invited_at: new Date().toISOString()
    };
    setData({ ...data, athletes: athletes.map(a => a.id === athleteId ? updated : a) });
    setInviteFor(updated);
  };

  const revoke = (id) => {
    if (!confirm('Einladung widerrufen?')) return;
    setData({
      ...data,
      athletes: athletes.map(a => a.id === id
        ? { ...a, email: '', login_code: '', invite_status: 'none' }
        : a)
    });
  };

  const regenCode = (id) => {
    const ath = athletes.find(a => a.id === id);
    if (!ath) return;
    const code = generateCode();
    const u = { ...ath, login_code: code };
    setData({ ...data, athletes: athletes.map(a => a.id === id ? u : a) });
    setInviteFor(u);
  };

  return (
    <div className="space-y-5">
      <header className="flex items-end justify-between flex-wrap gap-3 pt-2">
        <div>
          <h1 className="text-[34px] font-bold tracking-tight leading-none">Sportler</h1>
          <p className="text-slate-500 text-sm mt-1">
            {athletes.length} Einträge · {athletes.filter(a => a.invite_status === 'invited').length} eingeladen
          </p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="bg-slate-900 text-white px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-1.5 shadow-sm active:scale-95 transition">
          <Plus size={16} /> Neu
        </button>
      </header>

      <div className="bg-sky-50/80 backdrop-blur rounded-2xl p-4 text-sm text-sky-900">
        <div className="flex gap-2 items-start">
          <Info size={18} className="shrink-0 mt-0.5" />
          <div>
            <strong>Einladen:</strong> Du erstellst E-Mail + 6-stelligen Code, teilst ihn persönlich oder per Messenger. Sportler sieht später nur eigene Daten.
            <div className="text-xs mt-1 opacity-80">Hinweis: Login-System funktioniert in dieser Test-Version lokal. Echte Trennung kommt mit Backend.</div>
          </div>
        </div>
      </div>

      {athletes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-8 text-center">
          <Users size={32} className="mx-auto text-slate-300 mb-3" />
          <h3 className="font-semibold mb-1">Noch keine Sportler</h3>
          <p className="text-sm text-slate-500 mb-4">Lege deinen ersten Sportler oder ein Team an.</p>
          <button onClick={() => setShowNew(true)}
            className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium">
            Sportler anlegen
          </button>
        </div>
      ) : (
        <IOSList>
          {athletes.map(a => {
            const sessions = data.sessions.filter(s => s.athleteId === a.id);
            const competitions = (data.competitions || []).filter(c => c.athlete_id === a.id);
            return (
              <div key={a.id} className="px-4 py-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium text-[15px] text-[#000] truncate">{a.name}</h3>
                      <IOSTag color={a.type === 'team' ? 'blue' : 'gray'}>
                        {a.type === 'team' ? 'Team' : 'Sportler'}
                      </IOSTag>
                      {a.invite_status === 'invited' && (
                        <IOSTag color="purple">eingeladen</IOSTag>
                      )}
                    </div>
                    {a.email && <div className="text-[13px] text-[#8E8E93] mt-1 truncate">{a.email}</div>}
                    {a.notes && <div className="text-[13px] text-[#8E8E93] mt-0.5 truncate">{a.notes}</div>}
                    <div className="text-[13px] text-[#8E8E93] mt-1">
                      {sessions.length} Sessions · {competitions.length} Wettkämpfe
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setEditing(a)}
                      className="p-2 text-[#007AFF] active:bg-[#D1D1D6]/40 rounded-full">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => remove(a.id)}
                      className="p-2 text-[#FF3B30] active:bg-[#D1D1D6]/40 rounded-full">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex gap-2 flex-wrap">
                  {a.invite_status === 'invited' ? (
                    <>
                      <button onClick={() => setInviteFor(a)}
                        className="text-[13px] bg-[#E5E5EA] text-[#000] px-3 py-1.5 rounded-full font-medium active:opacity-70">
                        Code anzeigen
                      </button>
                      <button onClick={() => regenCode(a.id)}
                        className="text-[13px] text-[#007AFF] px-2 py-1.5 active:opacity-70 font-medium">
                        Neuer Code
                      </button>
                      <button onClick={() => revoke(a.id)}
                        className="text-[13px] text-[#FF3B30] px-2 py-1.5 active:opacity-70 font-medium">
                        Widerrufen
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setInviteFor({ ...a, _new: true })}
                      className="text-[13px] bg-slate-900 text-white px-3 py-1.5 rounded-full flex items-center gap-1 font-medium active:scale-95 transition">
                      Einladen
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </IOSList>
      )}

      <AthleteEditor
        open={showNew || !!editing}
        athlete={editing}
        onClose={() => { setShowNew(false); setEditing(null); }}
        onSave={(a) => { upsert(a); setShowNew(false); setEditing(null); }}
      />

      <InviteModal
        open={!!inviteFor}
        athlete={inviteFor}
        onClose={() => setInviteFor(null)}
        onInvite={(email) => invite(inviteFor.id, email)}
      />
    </div>
  );
}

function AthleteEditor({ open, athlete, onClose, onSave }) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between rounded-t-3xl sm:rounded-t-2xl z-10">
          <h3 className="font-semibold text-lg">{athlete ? 'Bearbeiten' : 'Neu anlegen'}</h3>
          <button onClick={onClose} className="p-2 -m-2 text-slate-500"><X size={20} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">Name</label>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="Name oder Teamname" autoFocus
              className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Typ</label>
            <select value={type} onChange={e => setType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-amber-500">
              <option value="athlete">Sportler:in</option>
              <option value="team">Team / Mannschaft</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Verein / Notizen</label>
            <input value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="z.B. RKV Denkendorf"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={onClose} className="flex-1 bg-white border border-slate-300 px-5 py-3 rounded-xl font-medium">
              Abbrechen
            </button>
            <button onClick={() => name.trim() && onSave({
              id: (athlete && athlete.id) || uid(),
              name: name.trim(),
              type, notes,
              email: (athlete && athlete.email) || '',
              login_code: (athlete && athlete.login_code) || '',
              invite_status: (athlete && athlete.invite_status) || 'none',
              invited_at: athlete && athlete.invited_at
            })} disabled={!name.trim()}
              className="flex-1 bg-emerald-600 text-white px-5 py-3 rounded-xl font-medium disabled:opacity-50">
              Speichern
            </button>
          </div>
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
function ExportView({ data }) {
  const [tab, setTab] = useState('wettkampf');
  return (
    <div className="space-y-5">
      <header className="pt-2">
        <h1 className="text-[34px] font-bold tracking-tight leading-none">Export</h1>
        <p className="text-slate-500 text-sm mt-1">Daten als CSV herunterladen (Excel/Numbers-kompatibel)</p>
      </header>

      {/* iOS-style Segmented Control */}
      <div className="bg-slate-200/60 rounded-xl p-1 flex gap-1">
        <button onClick={() => setTab('wettkampf')}
          className={'flex-1 py-1.5 rounded-lg font-medium text-sm transition ' +
            (tab === 'wettkampf' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 active:bg-slate-300/40')}>
          <span className="inline-flex items-center gap-1.5 justify-center">
            <Trophy size={14} /> Wettkampf
          </span>
        </button>
        <button onClick={() => setTab('training')}
          className={'flex-1 py-1.5 rounded-lg font-medium text-sm transition ' +
            (tab === 'training' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 active:bg-slate-300/40')}>
          <span className="inline-flex items-center gap-1.5 justify-center">
            <Dumbbell size={14} /> Training
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
              <div className="text-xs text-slate-500">Startnummer</div>
              <div className="font-medium">{competition.start_nr}</div>
            </div>
          )}
          {athlete && (
            <div>
              <div className="text-xs text-slate-500">Sportler</div>
              <div className="font-medium truncate">{athlete.name}</div>
            </div>
          )}
          {competition.host && (
            <div>
              <div className="text-xs text-slate-500">Ausrichter</div>
              <div className="font-medium truncate">{competition.host}</div>
            </div>
          )}
          {program && (
            <div>
              <div className="text-xs text-slate-500">Programm</div>
              <div className="font-medium truncate">{program.name}</div>
            </div>
          )}
        </div>
      </div>

      {/* Ergebnis-Übersicht */}
      {t1 && t2 && (
        <div className="bg-slate-900 text-white rounded-2xl p-4">
          <div className="grid grid-cols-2 gap-3 text-center mb-3">
            <div className="bg-slate-800 rounded-xl p-3">
              <div className="text-xs text-slate-400 uppercase tracking-wide">Aufgestellt</div>
              <div className="text-2xl font-bold mt-1">{t1.aufgestellt.toFixed(2)}</div>
            </div>
            <div className="bg-amber-500 text-slate-900 rounded-xl p-3">
              <div className="text-xs uppercase tracking-wide font-semibold">Endergebnis</div>
              <div className="text-2xl font-bold mt-1">{finalScore !== null ? finalScore.toFixed(2) : '—'}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-800 rounded-xl p-3">
              <div className="text-xs text-slate-400">Kampfgericht 1</div>
              <div className="font-bold text-lg">{t1.ergebnis.toFixed(2)}</div>
              <div className="text-xs text-slate-400 mt-1">
                Ausf -{t1.abzugAusfuehrung.toFixed(2)} · Schw -{t1.abzugSchwierigkeit.toFixed(2)}
              </div>
            </div>
            <div className="bg-slate-800 rounded-xl p-3">
              <div className="text-xs text-slate-400">Kampfgericht 2</div>
              <div className="font-bold text-lg">{t2.ergebnis.toFixed(2)}</div>
              <div className="text-xs text-slate-400 mt-1">
                Ausf -{t2.abzugAusfuehrung.toFixed(2)} · Schw -{t2.abzugSchwierigkeit.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}

      {!program && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-900 text-sm">
          ⚠️ Programm zu diesem Wettkampf nicht mehr vorhanden — Detail-Werte können nicht angezeigt werden.
        </div>
      )}

      {/* Tab-Umschaltung KG1/KG2 */}
      {program && (
        <>
          <div className="flex gap-2">
            <button onClick={() => setActiveTable(1)}
              className={'flex-1 py-2.5 rounded-xl font-semibold ' +
                (activeTable === 1 ? 'bg-slate-900 text-white' : 'bg-white border border-slate-300 text-slate-700')}>
              KG 1: {t1 && t1.ergebnis.toFixed(2)}
            </button>
            <button onClick={() => setActiveTable(2)}
              className={'flex-1 py-2.5 rounded-xl font-semibold ' +
                (activeTable === 2 ? 'bg-slate-900 text-white' : 'bg-white border border-slate-300 text-slate-700')}>
              KG 2: {t2 && t2.ergebnis.toFixed(2)}
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
                        <div className="text-sm font-medium leading-tight mt-0.5">{ex.name}</div>
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
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50"
         onClick={onCancel}>
      <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md p-5 space-y-4"
           onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center shrink-0">
            <AlertTriangle size={20} className="text-rose-600" />
          </div>
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        <p className="text-sm text-slate-600">{message}</p>
        <div className="flex gap-2 pt-2">
          <button onClick={onCancel}
            className="flex-1 bg-white border border-slate-300 px-5 py-3 rounded-xl font-medium">
            Abbrechen
          </button>
          <button onClick={onConfirm}
            className="flex-1 bg-rose-600 text-white px-5 py-3 rounded-xl font-medium flex items-center justify-center gap-2">
            <Trash2 size={16} /> Löschen
          </button>
        </div>
      </div>
    </div>
  );
}
