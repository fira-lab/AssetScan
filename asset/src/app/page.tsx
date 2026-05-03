"use client";
import React, { useEffect, useState, useRef } from "react";

// Image Imports (ensure paths are correct)
// OmmHome is still imported, but if genuinely unused, remove it.
// For now, let's assume it *might* be used in a child component, or is a leftover.
// To satisfy the linter if it's truly unused *here*, you'd remove it.

// import mm1 from "./Images/mm1.jpg";
// import mm3 from "./Images/mm3.png";
// import omm4 from "./Images/omm4.jpg";
// import omm5 from "./Images/omm5.jpg";
// import omm6 from "./Images/omm6.jpg";
// import omm7 from "./Images/omm7.jpg";
// import omm8 from "./Images/omm8.jpg";
// import Summer2 from "./Images/Summer2.png";
// import bishoftuPeople from "./Images/bishoftuPeople.png";
// import Bishoftu1111 from "./Images/Bishoftu1111.png";
// import Summer2024 from "./Images/Summer2024.png";
// import BishoftuCrew from "./Images/BishoftuCrew.png";
// import Bishoftu2 from "./Images/Bishoftu2.png";
// import Bishoftu3 from "./Images/Bishoftu3.png";
// import Alemgena from "./Images/Alemgena.png";
// import Alemgena11 from "./Images/Alemgena11.png";
// import Alemgena22 from "./Images/Alemgena22.png";
// import Alemgena33 from "./Images/Alemgena33.png";
// import Alemgena44 from "./Images/Alemgena44.png";
// import Alemgena55 from "./Images/Alemgena55.png";
// import Jimma1 from "./Images/Jimma1.jpg";
// import Jimma2 from "./Images/Jimma2.jpg";
// import Jimma3 from "./Images/Jimma3.jpg";
// import Jimma4 from "./Images/Jimma4.jpg";
// import Jimma5 from "./Images/Jimma5.jpg";
// import Jimma6 from "./Images/Jimma6.jpg";
// import Jimma7 from "./Images/Jimma7.jpg";

// Component Imports
import Loader from "./Loader/page";
import { useLanguageStore } from "./LanguageStore/languageStore";
import HeroSection from "./HeroSection/page";
import SystemOverview from "./SystemOverview/page";
import StatsSection from "./StatsSection/page";
import FeaturesSection from "./Features/page";
import SecurityHighlight from "./SecurityHighlight/page";
import VisionMissionSection from "./VisionMission/page";
import FooterSection from "./FooterSection/page";

// --- Comprehensive Translations Object ---

interface TranslationItem {
  en: string;
  am: string;
  oro: string;
  kor: string;
  chn: string;
  default?: string;
}

interface Translations {
  [key: string]: TranslationItem;
}
const translations: Translations = {
  descYoungMissionariesPraying1: {
    en: "Newly recruited medical doctors dedicated to serving the community's health needs.",
    am: "አዲስ የተቀጠሩ የሕክምና ዶክተሮች የማኅበረሰቡን የጤና ፍላጎቶች ለማገልገል ቁርጠኛ ናቸው።",
    oro: "Doktooronni yaalaa haaraan hojjetaman fedhii fayyaa hawaasaa tajaajiluuf of kennaniiru.",
    kor: "새로 모집된 의료진들이 지역 사회의 건강 요구를 충족시키기 위해 헌신합니다.",
    chn: "新招募的医生致力于服务社区的健康需求。",
  },
  descOneOnOneEvangelism1: {
    en: "Medical doctors providing compassionate and patient one-on-one care to children.",
    am: "የሕክምና ዶክተሮች ለእያንዳንዱ ልጅ በርኅራኄ እና በትዕግሥት የአንድ ለአንድ እንክብካቤ ይሰጣሉ።",
    oro: "Doktooronni yaalaa ijoolleedhaaf kunuunsa gara laafinaafi obsaan namtokkee tokkoof kennu.",
    kor: "의사들이 어린이들에게 자비롭고 인내심 있는 일대일 진료를 제공합니다.",
    chn: "医生们为孩子们提供富有同情心和耐心的​​一对一护理。",
  },
  descTeamWorshipSession1: {
    en: "Providing critical bedside medical treatment to severely ill patients.",
    am: "በጠና ለታመሙ ሕሙማን ወሳኝ የሆነ የአልጋ ላይ የሕክምና ክትትል መስጠት።",
    oro: "Dhukkubsattoota daran dhukkubsataniif yaala fayyaa cimaa siree maddii kennuu.",
    kor: "중증 환자들에게 중요한 병상 의료 치료를 제공합니다.",
    chn: "为重症患者提供关键的床边医疗服务。",
  },
  descLocalChildrenJoinOutreach1: {
    en: "Large numbers of community members receiving free medical treatment during the outreach.",
    am: "በተልዕኮው ወቅት በርካታ የማኅበረሰብ አባላት ነፃ የሕክምና አገልግሎት አግኝተዋል።",
    oro: "Lakkoofsi guddaan miseensota hawaasaa yeroo gargaarsaa tajaajila yaalaa tolaan argatu.",
    kor: "봉사 활동 중 많은 지역 주민들이 무료 의료 혜택을 받습니다.",
    chn: "大量社区成员在医疗外展活动中接受免费治疗。",
  },
  descMissionariesShareFood1: {
    en: "Medical doctors meticulously diagnosing patient conditions to identify health problems.",
    am: "የሕክምና ዶክተሮች የጤና ችግሮችን ለመለየት የታካሚዎችን ሁኔታ በጥንቃቄ ይመረምራሉ።",
    oro: "Doktooronni yaalaa rakkoolee fayyaa adda baasuuf haala dhukkubsataa of eeggannoodhaan qoratu.",
    kor: "의사들이 건강 문제를 파악하기 위해 환자의 상태를 꼼꼼하게 진단합니다.",
    chn: "医生们仔细诊断患者病情以确定健康问题。",
  },
  descBoleMKCOrganizesCeremony1: {
    en: "Completion of intensive medical procedures providing valuable treatment to patients.",
    am: "ለታካሚዎች ጠቃሚ ሕክምና የሰጡ የተጠናከሩ የሕክምና ሂደቶች ተጠናቀዋል።",
    oro: "Adeemsi yaalaa cimaan dhukkubsattootaaf yaala gatii guddaa qabu kennee xumurameera.",
    kor: "환자들에게 귀중한 치료를 제공하는 집중적인 의료 절차가 완료되었습니다.",
    chn: "完成为患者提供宝贵治疗的强化医疗程序。",
  },
  descGroupPhotoCelebrating1: {
    en: "Long queues of patients waiting patiently to receive much-needed medical attention.",
    am: "ለረጅም ጊዜ የቆሙ ታካሚዎች በጣም የሚያስፈልጋቸውን የሕክምና ክትትል በትዕግሥት ይጠባበቃሉ።",
    oro: "Dhukkubsattoonni hiriira dheeraa keessa jiran obsaan eeggachuun gargaarsa fayyaa barbaachisaa ta'e argatu.",
    kor: "긴 줄의 환자들이 절실히 필요한 의료 서비스를 받기 위해 인내심을 갖고 기다립니다.",
    chn: "排长队的患者耐心等待接受急需的医疗服务。",
  },

  // Hero Section
  heroHeading: {
    en: "Global Onesmos Missionary Movement",
    am: "ግሎባል ኦኔስሞስ ሚሽነሪ ሙቭመንት",
    oro: "Sochii Misiyoonarummaa Addunyaa Onesmoos",
    kor: "글로벌 오네시모스 선교 운동",
    chn: "全球奥内西莫斯宣教运动",
  },
  heroSubheading: {
    en: "Forward ever, backward never!",
    am: "ወደፊት ብቻ፣ ወደ ኋላ በፍጹም!",
    oro: "Gara fuulduraatti yoomiyyuu, gara duubaatti gonkumaa!",
    kor: "앞으로만, 뒤로는 절대!",
    chn: "永远向前，决不后退！",
  },
  // Ministry Section
  ministryHeading: {
    en: "Our Ministry",
    am: "አገልግሎታችን",
    oro: "Tajaajila Keenya",
    kor: "우리의 사역",
    chn: "我们的事工",
  },
  ministryCardTitle: {
    en: "Reaching Out The Good News!",
    am: "ምሥራቹን ማዳረስ!",
    oro: "Wangeela Gaarii Geessuu!",
    kor: "좋은 소식을 전하다!",
    chn: "传扬好消息！",
  },
  ministryCardText: {
    en: "ACTS 1:8 “But you will receive power when the Holy Spirit has come upon you; and you will be my witnesses in Jerusalem, and in all Judea and Samaria, and to the ends of the earth.”",
    am: "ሐዋ 1:8 “ነገር ግን መንፈስ ቅዱስ በእናንተ ላይ በወረደ ጊዜ ኃይልን ትቀበላላችሁ፥ በኢየሩሳሌምም በይሁዳም ሁሉ በሰማርያም እስከ ምድር ዳርም ድረስ ምስክሮቼ ትሆናላችሁ።”",
    oro: "HOE 1:8 “Garuu Hafuuri Qulqulluun yommuu isin irra bu'u, humna in argattu; Yerusaalemitti, Yihudaa hundumaatti, Samaariyaatti, hamma handaara lafaattis dhuga-baatuuwwan koro in taatu.”",
    kor: "행 1:8 “오직 성령이 너희에게 임하시면 너희가 권능을 받고 예루살렘과 온 유대와 사마리아와 땅 끝까지 이르러 내 증인이 되리라 하시니라”",
    chn: "徒 1:8 “但圣灵降临在你们身上，你们就必得着能力，并要在耶路撒冷、犹太全地，和撒玛利亚，直到地极，作我的见证。”",
  },
  // Impact Section
  impactHeading: {
    en: "Our Global Impact",
    am: "የአለም አቀፍ ተፅእኗችን",
    oro: "Dhiibbaa Addunyaa Keenyaa",
    kor: "우리의 글로벌 영향력",
    chn: "我们的全球影响力",
  },
  impactCardTitleHeard: {
    en: "Heard the Gospel",
    am: "ወንጌልን የሰሙ",
    oro: "Wangeela Dhagahan",
    kor: "복음을 들은 사람",
    chn: "听闻福音",
  },
  impactCardSubtextHeard: {
    en: "Have heard the Gospel.",
    am: "ወንጌልን ሰምተዋል።",
    oro: "Wangeela dhageeffataniiru.",
    kor: "복음을 들었습니다.",
    chn: "已经听到了福音。",
  },
  impactCardTitleNewSouls: {
    en: "New Souls",
    am: "አዲስ ነፍሳት",
    oro: "Lubbuuwwan Haarawa",
    kor: "새 영혼",
    chn: "新灵魂",
  },
  impactCardSubtextNewSouls: {
    en: "Received Jesus As their Lord and Saviour.",
    am: "ኢየሱስን እንደ ጌታቸውና አዳኛቸው አድርገው ተቀብለዋል።",
    oro: "Yesusin akka Gooftaa fi Fayyisaa isaaniitti fudhataniiru.",
    kor: "예수님을 주님과 구세주로 영접했습니다.",
    chn: "接受耶稣为他们的主和救主。",
  },
  impactCardTitleMissions: {
    en: "Missions",
    am: "ሚሲዮኖች",
    oro: "Ergamoota",
    kor: "선교",
    chn: "宣教",
  },
  impactCardSubtextMissions: {
    en: "Mission trips undertaken.", // Refined English Subtext
    am: "የተካሄዱ የሚሲዮን ጉዞዎች።",
    oro: "Imala ergamaa gaggeeffaman.",
    kor: "선교 여행을 떠났습니다.",
    chn: "已进行的宣教旅程。",
  },
  // Missions Throughout Years Section
  missionsYearsHeading: {
    en: "Our Mission throughout the Years",
    am: "በዓመታት ውስጥ የነበረን ተልዕኮ",
    oro: "Ergama Keenya Waggoottan Keessatti",
    kor: "수년간의 우리의 선교",
    chn: "我们历年来的宣教",
  },
  // Specific Mission Sections
  missionSectionTitle2025Medical: {
    en: "2025 Medical Missionaries", // Kept year, translated concept
    am: "2025 የሕክምና ሚሽነሪዎች",
    oro: "Ergamtoota Fayyaa 2025",
    kor: "2025년 의료 선교사",
    chn: "2025 医疗传教士",
  },
  missionSectionDesc2025Medical: {
    en: "Answering a heavenly vision to bear witness to Jesus Christ, the Onesmos Missionary Movement (G-OMM) extended His compassionate touch to the remote communities of Begi and Kondala from December 8-11, 2023. Their dedicated team, including valiant medical professionals, served as God's instruments, offering not only physical healing through free medical care to those in great need but also sowing seeds of eternal hope and sharing the Savior's love, persevering through challenges to illuminate lives with His grace amidst profound physical and spiritual needs.",
    am: "ለሰማያዊ ራዕይ ምላሽ በመስጠት ለኢየሱስ ክርስቶስ ምስክር ለመሆን፣ የኦኔሲሞስ ሚሽነሪ ንቅናቄ (G-OMM) ከታህሳስ 8-11, 2023 ዓ.ም. በሩቅ ወዳሉት የቤጊ እና የቆንዳላ ማህበረሰቦች የእርሱን የርህራሄ ንክኪ አስፋፋ። ጀግኖችን የህክምና ባለሙያዎችን ያካተተው ቁርጠኛ ቡድናቸው የእግዚአብሔር መሳሪያ ሆኖ በማገልገል፣ ከፍተኛ ችግር ላይ ለነበሩት በነጻ የህክምና አገልግሎት አካላዊ ፈውስን መስጠት ብቻ ሳይሆን የዘላለም ተስፋ ዘሮችን በመዝራትና የአዳኙን ፍቅር በማካፈል፣ በከባድ አካላዊና መንፈሳዊ ፍላጎቶች መካከል ህይወትን በፀጋው ለማብራት በፈተናዎች ውስጥ በመጽናት አገልግለዋል።",
    oro: "Mul'ata samii Yesuus Kiristoosiif dhugaa ba'uuf deebii kennuun, Sochii Ergamoota Onisimoos (G-OMM) Mudde 8-11, 2023tti hawaasota fagoo Begii fi Qondaalaatiif gara laafina Isaatiin bira ga'e. Gareen isaanii of kennanii hojjetan, ogeeyyii fayyaa gootota dabalatee, akka meeshaa Waaqayyootti tajaajilaniiru; namoota rakkoo guddaa keessa jiraniif tajaajila fayyaa bilisaatiin fayyina qaamaa qofa kennuu osoo hin taane, sanyii abdii bara baraa facaasuunii fi jaalala Fayyisaa hiruun, rakkoolee keessa darbuun, gidduu fedhiiwwan qaamaa fi hafuuraa gurguddoo keessatti jireenya ayyaana Isaatiin ibsaniiru.",
    kor: "예수 그리스도를 증거하라는 하늘의 비전에 응답하여, 오네시모 선교 운동(G-OMM)은 2023년 12월 8일부터 11일까지 베기와 콘달라의 외딴 지역 사회에 그분의 자비로운 손길을 펼쳤습니다. 용감한 의료 전문가를 포함한 그들의 헌신적인 팀은 하나님의 도구로서 봉사하며, 큰 도움이 필요한 사람들에게 무료 의료를 통해 육체적 치유를 제공했을 뿐만 아니라, 영원한 희망의 씨앗을 뿌리고 구세주의 사랑을 나누었으며, 심오한 육체적, 영적 필요 속에서 그분의 은혜로 삶을 밝히기 위해 도전을 견뎌냈습니다.",
    chn: "为响应见证耶稣基督的属天异象，欧尼西姆斯宣教运动 (G-OMM) 于2023年12月8日至11日，将祂慈悲的触摸延伸至贝吉和孔达拉的偏远社区。他们敬业的团队，包括英勇的医疗专业人员，作为上帝的器皿服事，不仅为极需帮助的人们提供免费医疗以带来身体的医治，更播撒永恒盼望的种子并分享救主的爱，在挑战中坚忍不拔，于深切的身体和属灵需求之中，用祂的恩典照亮生命。",
  },
  missionSectionTitle2025Jimma: {
    en: "2025 - Jimma Founding Mission", // Added 'Founding' for clarity
    am: "2025  - የጅማ ምሥረታ ሚሲዮን",
    oro: "2025  - Ergama Hundeessaa Jimmaa",
    kor: "2025 년 - 짐마 창립 선교",
    chn: "2025  - 吉马创始宣教",
  },

  missionSectionDesc2025Jimma: {
    oro: "Waaqayyo Isa Hojiin Isaa Dinqisiisaa, Kanaaf Barabaraan Ulfinni Haa Baay'atu! Torbeen kun mo'ichaafi ilillee ture! Hojiin dhugaa baatii keenyaa, Ministiirii keenya G-omm'ttiin fi Focus Jimmaa waliin mooraawwan sadan keessatti wal tumsuudhaan, Guraandhala 3-8tti magaalaa Jimmaafi naannoo ishee keessatti haala ajaa'ibsiisaa ta'een hojjetamaa ture; Waaqayyo waan ayyaana isaa nuuf baay'iseef boojuu guddaan goolabameera. Kiristoos Yesuus fayyisaa cubbamootaa ta'uun isaa namoota hedduutti lallabameera. Dubbii mishiraachoo fayyisuu Gooftaa keenya Kiristoos Yesuus kana yeroo lallabametti, namoonni 1126 dhaggeeffataniiru, 119 amanuuf waadaa seenaniiru, 90 jajjabeeffamaniiru, akkasumas namoonni 72 amanuudhaan obboloota keenya bara baraa nuuf ta'aniiru.",
    en: "God, whose work is wonderful, to Him be glory forever! This week was one of victory and jubilation! Our testimony work, in collaboration with our G-omm ministry and Focus Jimma across three campuses, was carried out wonderfully in Jimma city and its surroundings from Guraandhala 3-8; God multiplied His grace for us, and it concluded with a great harvest. Christ Jesus being the savior of sinners has been preached to many people. When this saving gospel message of our Lord Christ Jesus was preached: 1126 people heard, 119 people made a commitment to believe, 90 were encouraged, and 72 people believed and became our eternal brothers and sisters.",
    am: "ሥራው ድንቅ የሆነ እግዚአብሔር፣ ለእርሱ ክብር ለዘላለም ይሁን! ይህ ሳምንት የድልና የእልልታ ነበር! የምስክርነት ሥራችን ከ G-omm ሚኒስትሪያችን እና ከፎከስ ጅማ ጋር በመተባበር በሶስቱ ካምፓሶች ከጉራንድሃላ 3-8 (እንደ ኢትዮጵያ አቆጣጠር ከመጋቢት 12-17 ገደማ) በጅማ ከተማና በአካባቢዋ በሚያስደንቅ ሁኔታ ተከናውኖ ነበር፤ እግዚአብሔር ጸጋውን ስላበዛልን በታላቅ ምርኮ ተጠናቋል። ክርስቶስ ኢየሱስ የኃጢአተኞች አዳኝ መሆኑ ለብዙ ሰዎች ተሰብኳል። ይህ የጌታችን የኢየሱስ ክርስቶስ የማዳን የምሥራች ቃል ሲሰበክ፦ 1126 ሰዎች ሰምተዋል፣ 119 ሰዎች ለማመን ቃል ገብተዋል፣ 90 ሰዎች ተበረታተዋል፣ እንዲሁም 72 ሰዎች በማመን የዘላለም ወንድሞቻችንና እህቶቻችን ሆነዋል።",
    kor: "그의 일이 놀라우신 하나님, 그에게 영원히 영광이 있을지어다! 이번 주는 승리와 환희의 한 주였습니다! 우리 G-omm 사역팀과 포커스 짐마팀이 협력하여 3개 캠퍼스에서 진행한 우리의 간증 사역은 구란달라 3-8일(대략 3월 12-17일) 동안 짐마 시와 그 주변 지역에서 놀라운 방식으로 수행되었습니다. 하나님께서 우리에게 은혜를 풍성히 베푸셔서 큰 수확으로 마무리되었습니다. 그리스도 예수께서 죄인의 구주이심이 많은 사람들에게 전파되었습니다. 우리 주 그리스도 예수의 이 구원의 복음 메시지가 전파되었을 때: 1126명이 들었고, 119명이 믿기로 결단했으며, 90명이 격려를 받았고, 72명이 믿어 우리의 영원한 형제자매가 되었습니다.",
    chn: "上帝，祂的作为奇妙，愿荣耀永远归于祂！这一周是胜利和欢腾的一周！我们的见证事工，通过与我们的G-omm事工部和吉马焦点（Focus Jimma）在三个校区的合作，于古兰达拉月3日至8日（大致对应公历3月12日至17日）在吉马市及其周边地区以奇妙的方式进行；上帝为我们加增了祂的恩典，并以丰硕的成果告终。基督耶稣是罪人的救主这一信息已向许多人传讲。当我们主基督耶稣这拯救的福音信息被传讲时：1126人听到，119人承诺相信，90人得到鼓励，还有72人相信并成为我们永恒的弟兄姐妹。",
  },
  missionSectionTitle2024Summer: {
    en: "2024 Grand Summer Mission - Bishoftu",
    am: "2024 ታላቁ የበጋ ሚሲዮን - ቢሾፍቱ",
    oro: "Ergama Guddicha Bona 2024 - Bishooftuu",
    kor: "2024년 그랜드 여름 선교 - 비쇼프투",
    chn: "2024 大型夏季宣教 - 比绍夫图",
  },
  missionSectionDesc2024Summer: {
    en: "The Undergraduate and Postgraduate Mission 2024 in Bishoftu shone as a beacon of God's radiant love, as 66 passionate youth missionaries, uniting 17 university teams with the vibrant local churches of Burka Bishoftu and Bole MKC, stepped out in faith. From July 21-28, their dedicated efforts allowed the seeds of the Gospel to reach an astounding 13,780 hearts, culminating in the glorious new birth of 351 precious souls who embraced Jesus Christ as Lord and Savior. Furthermore, the Spirit moved powerfully, with 3,086 individuals making profound promises, signifying a deep stirring and a renewed commitment to walk in His light, a testament to God's faithfulness and the transformative power of His Word proclaimed with zeal.",
    am: "የ2024 ዓ.ም. የቅድመ ምረቃ እና ድህረ ምረቃ ተልዕኮ በቢሾፍቱ የእግዚአብሔር የደመቀ ፍቅር ብርሃን ሆኖ አበራ፤ 66 ቀናተኛ ወጣት ሚሽነሪዎች፣ 17 የዩኒቨርሲቲ ቡድኖችን ከቡርቃ ቢሾፍቱ እና ቦሌ መካነ ኢየሱስ ሕያው የአካባቢ አብያተ ክርስቲያናት ጋር በማዋሃድ በእምነት ወጡ። ከሐምሌ 21-28 ባደረጉት ጥረት የወንጌል ዘሮች አስደናቂ ወደሆኑ 13,780 ልቦች እንዲደርሱ አስችሏል፤ ይህም ኢየሱስ ክርስቶስን ጌታና አዳኝ አድርገው የተቀበሉ የ351 ክቡር ነፍሳት የከበረ አዲስ ልደት አስገኝቷል። በተጨማሪም፣ መንፈስ በኃይል አንቀሳቅሷል፤ 3,086 ግለሰቦች ጥልቅ የሆኑ የተስፋ ቃላትን በመስጠት ጥልቅ መነቃቃትንና በእርሱ ብርሃን ለመጓዝ የታደሰ ቁርጠኝነትን አሳይተዋል፤ ይህም የእግዚአብሔር ታማኝነትና በቅንዓት የተሰበከው የቃሉ የለውጥ ኃይል ምስክር ነው።",
    oro: "Mishiniin Barattoota Digirii Duraa fi Digirii Boodaa kan Bara 2024 Bishooftuutti gaggeeffame, ibsaa jaalala Waaqayyoo ifu ta'ee ife; dargaggoonni misiyoonarootaa kaka'umsa guddaa qaban 66, gareewwan yuunivarsiitii 17 waldaalee naannoo Burqaa Bishooftuu fi Boolee MKC jajjaboo ta'an waliin tokkummeessuun amantiidhaan bahan. Adoolessa 21-28tti, tattaaffiin isaanii sanyiin Wangeelaa garaawwan 13,780 dinqisiisoo ta'an bira akka ga'u taasiseera; kunis lubbuuwwan qaalii 351 Yesuus Kiristoosin Gooftaa fi Fayyisaa godhatanii fudhachuun dhaloota haaraa ulfaataa argataniiru. Dabalataanis, Hafuurri humnaan hojjeteera; namoonni 3,086 waadaawwan gadi fagoo galuun kaka'umsa guddaa fi ifa Isaatiin deemuu kutannoo haaromfame agarsiisaniiru; kunis amanummaa Waaqayyoo fi humna jijjiiramaa Sagalee Isaa hinaaffaadhaan labsameef ragaadha.",
    kor: "2024년 비쇼프투에서 진행된 학부 및 대학원 선교는 하나님의 빛나는 사랑의 등불처럼 빛났습니다. 66명의 열정적인 청년 선교사들이 17개 대학팀과 부르카 비쇼프투 및 볼레 MKC 지역 교회의 활기찬 공동체와 연합하여 믿음으로 나아갔습니다. 7월 21일부터 28일까지 그들의 헌신적인 노력으로 복음의 씨앗이 놀라운 13,780명의 마음에 닿았고, 그 결과 351명의 소중한 영혼들이 예수 그리스도를 주와 구세주로 영접하는 영광스러운 새 생명을 얻었습니다. 나아가 성령께서 강력하게 역사하셔서 3,086명이 깊은 약속을 하여, 깊은 감동과 그분의 빛 가운데 걷고자 하는 새로운 헌신을 나타냈으며, 이는 하나님의 신실하심과 열정으로 선포된 그분의 말씀의 변화시키는 능력에 대한 증거입니다.",
    chn: "2024年在比绍夫图举行的本科生与研究生宣教事工，如同上帝光辉之爱的灯塔般闪耀。66位充满热情的青年宣教士，联合了17个大学团队以及布尔卡比绍夫图和博莱MKC当地充满活力的教会，凭着信心迈出了脚步。从7月21日至28日，他们不懈的努力使福音的种子得以播撒到惊人的13,780颗心灵，最终有351个宝贵的灵魂接受耶稣基督为主和救主，获得了荣耀的新生。此外，圣灵强有力地运行，3,086人做出了深刻的承诺，这表明了深刻的感动和在祂的光中行走的更新承诺，这是对上帝的信实以及祂的话语以热忱宣讲所带来的改变力量的明证。",
  },
  missionSectionTitle2023Holota: {
    en: "2023 Summer Mission - Holota",
    am: "2023 የበጋ ሚሲዮን - ሆለታ",
    oro: "Ergama Bona 2023 - Holotaa",
    kor: "2023년 여름 선교 - 홀로타",
    chn: "2023 夏季宣教 - 霍洛塔",
  },
  missionSectionDesc2023Holota: {
    en: "In August 2023, this mass evangelization in Holota reached 6,723 souls, with 193 conversions. Despite police arrests, miracles like a woman's deliverance created lasting memories.",
    am: "በነሐሴ 2023 በሆለታ የተካሄደው ይህ ህዝባዊ የወንጌል ስርጭት 6,723 ነፍሳትን የደረሰ ሲሆን 193ቱ ተለውጠዋል። ምንም እንኳን የፖሊስ እስራት ቢኖርም እንደ ሴት ነፃ መውጣት ያሉ ተአምራት ዘላቂ ትዝታዎችን ፈጥረዋል።",
    oro: "Hagayya 2023tti, lallabni wangeelaa Holotaa keessatti gaggeeffame kun lubbuu 6,723 ga'eera, 193 jijjiiramaniiru. Poolisiin qabamus, dinqiiwwan akka dubartii tokkor bilisa ba'uu yaadannoo yeroo dheeraa uumaniiru.",
    kor: "2023년 8월, 홀로타에서 열린 이 대규모 전도 집회는 6,723명의 영혼에게 다가갔고 193명이 회심했습니다. 경찰의 체포에도 불구하고 여성의 구원과 같은 기적은 지속적인 기억을 만들었습니다.",
    chn: "2023年8月，在霍洛塔的这次大型布道会触及了6723个灵魂，有193人归信。尽管遭遇警察逮捕，但像一位妇女得释放这样的神迹创造了持久的记忆。",
  },
  missionSectionTitle2023Alemgena: {
    en: "2023 Summer Mission - Alemgena",
    am: "2023 የበጋ ሚሲዮን - አለምገና",
    oro: "Ergama Bona 2023 - Alemgena",
    kor: "2023년 여름 선교 - 알렘게나",
    chn: "2023 夏季宣教 - 阿莱姆格纳",
  },
  missionSectionDesc2023Alemgena: {
    en: "During a vibrant week from August 28th to September 3rd, 2023, the town of Alemgena was touched by dedicated mission teams. These individuals poured their energy into forging personal connections through one-on-one evangelism, sharing messages of hope directly with the community. Their compassion extended tangibly as they actively shared love and support with the local poor. Amidst these heartfelt interactions, the teams also carefully documented the inspiring moments of transformation they witnessed, capturing stories of change and renewal.",
    am: "ከነሐሴ 28 እስከ መስከረም 3, 2023 ባሉት ቀናት ውስጥ፣ የአለምገና ከተማ ራሳቸውን በሰጡ ሚስዮናዊ ቡድኖች ልብ ተነክቶ ነበር። እነዚህ ግለሰቦች በአንድ ለአንድ የወንጌል አገልግሎት የግል ግንኙነቶችን በመፍጠርና የተስፋ መልዕክቶችን በቀጥታ በማህበረሰቡ በማካፈል ጉልበታቸውን አፍስሰዋል። ርህራሄያቸውም በአካባቢው ለሚገኙ ድሆች ፍቅርንና ድጋፍን በንቃት በማካፈል በተጨባጭ ታይቷል። በእነዚህ ልብ የሚነኩ ግንኙነቶች መካከል፣ ቡድኖቹ የተመለከቷቸውን አስደናቂ የለውጥ ጊዜያት በጥንቃቄ በመመዝገብ፣ የለውጥና የመታደስ ታሪኮችን አስቀርተዋል።",
    oro: "Torban ho’aa Hagayya 28 irraa hanga Fulbaana 3, 2023tti, magaalaan Aleemganaa gareewwan ergamaa of kennaniin tuqamteetti. Namoonni kunniin humna isaanii nama tokkoof tokkoon wangeela lallabuudhaan walqunnamtii dhuunfaa uumuu fi ergaa abdii kallattiidhaan hawaasaaf hiruutti gumaachaniiru. Raawwannaan isaanii kan mul’ate, hiyyeeyyii naannichaatiif jaalalaa fi deggersa ifatti gochuudhaan ture. Walqunnamtiiwwan garaa nama tuqan kana gidduutti, gareewwan yeroowwan jijjiiramaa dinqisiisoo argatan sirriitti galmeessuudhaan, seenaawwan jijjiiramaa fi haaromsaa waraabaniiru.",
    kor: "2023년 8월 28일부터 9월 3일까지 이어진 활기찬 한 주 동안, 알렘게나 마을은 헌신적인 선교팀들의 따뜻한 손길을 경험했습니다. 이들은 일대일 전도를 통해 개인적인 관계를 형성하고 지역 사회에 직접 희망의 메시지를 나누는 데 온 힘을 쏟았습니다. 그들의 깊은 연민은 현지 빈민들에게 적극적으로 사랑과 지원을 나누는 가시적인 행동으로 확장되었습니다. 이러한 마음 따뜻한 교류 속에서, 팀들은 목격한 감동적인 변화의 순간들을 세심하게 기록하여 변화와 새로움의 이야기들을 소중히 담아냈습니다.",
    chn: "在2023年8月28日至9月3日这个充满活力的一周里，阿莱姆格纳镇感受到了专注奉献的宣教团队带来的深刻影响。这些成员倾注心力，通过一对一的传福音建立起真挚的个人联系，直接向社区传递希望的讯息。他们的同情心化为实际行动，积极地与当地的贫困者分享爱与支持。在这些感人至深的互动之中，团队还细致地记录下他们所见证的每一个鼓舞人心的转变时刻，捕捉了生命得以改变与焕新的宝贵故事。",
  },
  // Mission Image Descriptions
  descYoungMissionariesPraying: {
    en: "Unbelievable grace! God's heavenly wisdom manifested as Firaol declared: through the Word of Light, Lord Jesus made the devil lose its power.",
    am: "የማይታመን ጸጋ! የእግዚአብሔር ሰማያዊ ጥበብ ፊርኦል ሲያውጅ ተገለጠ፦ በብርሃኑ ቃል፣ ጌታ ኢየሱስ ሰይጣን ኃይሉን እንዲያጣ አድርጓል።",
    oro: "Ayyaana dinqisiisaa! Ogummaan Waaqayyoo isa samii yeroo Firaa'ol labsu mul'ate: Dubbii Ifaatiin, Gooftaan Yesus Diyaabiloos humna isaa akka dhabu taasise.",
    kor: "놀라운 은혜입니다! 하나님의 하늘 지혜가 나타나 피라올이 선포했습니다. 빛의 말씀을 통해 주 예수께서 마귀가 그 능력을 잃게 하셨습니다.",
    chn: "难以置信的恩典！上帝属天的智慧彰显，正如法老（Firaol）所宣告：借着光之道，主耶稣使魔鬼失去了它的能力。",
  },
  descOneOnOneEvangelism: {
    en: "The powerful light of God's Word left the devil empty-handed. An elder testified, boldly proclaiming Jesus Christ as Lord and Victor.",
    am: "የእግዚአብሔር ቃል ኃያል ብርሃን ሰይጣንን እጁን ባዶ አስቀረው። አንድ ሽማግሌ በድፍረት ኢየሱስ ክርስቶስ ጌታና አሸናፊ መሆኑን መሰከሩ።",
    oro: "Ifni Dubbii Waaqayyoo inni humna qabu Diyaabiloosiin harka duwwaa hambise. Jaarsi tokko ija jabinaan Yesus Kiristoos Gooftaa fi Injifataa ta'uu Isaa dhugaa ba'e.",
    kor: "하나님 말씀의 강력한 빛이 마귀를 빈손으로 만들었습니다. 한 장로님이 예수 그리스도께서 주님이시며 승리자이심을 담대히 증언했습니다.",
    chn: "上帝话语的强大光芒使魔鬼空手而归。一位长者作证，勇敢地宣告耶稣基督是主，是得胜者。",
  },
  descTeamWorshipSession: {
    en: "Where God's love abides, God Himself is present, forging an unbelievable spirit of oneness and profound love among these missionaries.",
    am: "የእግዚአብሔር ፍቅር ባለበት፣ እግዚአብሔር ራሱ ይገኛል፤ ይህም በእነዚህ ሚስዮናውያን መካከል የማይታመን የአንድነት መንፈስና ጥልቅ ፍቅርን ፈጥሯል።",
    oro: "Bakka jaalalli Waaqayyoo jiru, Waaqayyo mataan Isaatu jira; kunis hafuura tokkummaa ajaa'ibsiisaa fi jaalala guddaa ergamtoota kana gidduutti uumeera.",
    kor: "하나님의 사랑이 거하시는 곳에 하나님 자신이 임재하시며, 이 선교사들 사이에 놀라운 하나됨의 영과 깊은 사랑을 이루셨습니다.",
    chn: "上帝的爱所在之处，上帝自己也同在，这在这些传教士中铸就了令人难以置信的合一精神和深厚之爱。",
  },
  descLocalChildrenJoinOutreach: {
    en: "Another team boldly ventured into rural areas, daring to confront spiritual darkness with the overcoming light and strength of God.",
    am: "ሌላ ቡድን በገጠራማ አካባቢዎች በድፍረት በመግባት、 የመንፈሳዊ ጨለማን በእግዚአብሔር አሸናፊ ብርሃንና ኃይል ለመጋፈጥ ደፈሩ።",
    oro: "Gareen biraa ija jabinaan gara naannoo baadiyyaatti imaluun, dukkana hafuuraa ifaa fi humna Waaqayyoo isa injifatuun dura dhaabbachuuf kutatan.",
    kor: "또 다른 팀은 담대하게 시골 지역으로 나아가, 하나님의 이기시는 빛과 능력으로 영적 어둠에 맞서 싸웠습니다.",
    chn: "另一队传教士勇敢地进入乡村地区，凭着上帝得胜的光和大能，勇于对抗属灵的黑暗。",
  },
  descMissionariesShareFood: {
    en: "Near Mojo, missionaries prayerfully took time in a green sanctuary, seeking guidance and fellowship before continuing their sacred work.",
    am: "በሞጆ አቅራቢያ፣ ሚስዮናውያን ቅዱስ ሥራቸውን ከመቀጠላቸው በፊት ምሪትንና ህብረትን ለመፈለግ በአረንጓዴ ሥፍራ በጸሎት ጊዜ ወሰዱ።",
    oro: "Mojootti dhihoo, ergamtoonni hojii isaanii isa qulqulluu itti fufuu isaaniin dura, qajeelfamaa fi tokkummaa barbaacha iddoo magariisaa keessatti yeroo fudhatanii kadhatan.",
    kor: "모조 근처에서 선교사들은 푸른 안식처에서 기도하며 시간을 보내며, 그들의 거룩한 사역을 계속하기 전에 인도와 교제를 구했습니다.",
    chn: "在莫焦附近，传教士们在一片绿色圣地虔诚地停留，在继续他们神圣的工作之前寻求指引和团契。",
  },
  descBoleMKCOrganizesCeremony: {
    en: "Missionaries boldly took the Gospel to farmers in their fields; as they sowed spiritual seeds, many, including one lady, accepted Jesus Christ.",
    am: "ሚስዮናውያን ወንጌልን በድፍረት ለእርሻ ቦታ ገበሬዎች ወሰዱ፤ መንፈሳዊ ዘር ሲዘሩ፣ አንዲት ሴትን ጨምሮ ብዙዎች ኢየሱስ ክርስቶስን ተቀበሉ።",
    oro: "Ergamtoonni Wangeela ija jabinaan qonnaan bultootaaf dirree isaanii keessatti geessan; sanyii hafuuraa yeroo isaan facaasan, dubartii tokko dabalatee, baay'een isaanii Yesus Kiristoosin fudhatan.",
    kor: "선교사들은 담대하게 밭의 농부들에게 복음을 전했습니다. 그들이 영적인 씨앗을 뿌리자, 한 여성을 포함한 많은 이들이 예수 그리스도를 영접했습니다.",
    chn: "传教士们勇敢地将福音带给田间的农民；当他们播撒属灵的种子时，许多人，包括一位女士，接受了耶稣基督。",
  },
  descGroupPhotoCelebrating: {
    en: "As missionaries shared the Word's true light, two young men's hurt melted; they embraced Jesus Christ as their brother and Savior.",
    am: "ሚስዮናውያን የእውነትን ቃል ብርሃን ሲያካፍሉ፣ የሁለት ወጣቶች ሥቃይ ቀለለ፤ ኢየሱስ ክርስቶስን እንደ ወንድማቸውና አዳኛቸው አድርገው ተቀበሉት።",
    oro: "Ergamtoonni ifa dhugaa Dubbichaa yommuu qoodan, madaan dargaggoota lamaa baqe; Yesus Kiristoosin akka obboleessaa fi Fayyisaa isaaniitti fudhatan.",
    kor: "선교사들이 말씀의 참된 빛을 나누자, 두 청년의 상처가 녹아내렸습니다. 그들은 예수 그리스도를 형제이자 구원자로 영접했습니다.",
    chn: "当传教士分享圣言的真光时，两位年轻人的伤痛消融了；他们接受耶稣基督为他们的弟兄和救主。",
  },
  descFirstEvangelismTeam: {
    en: "A precious soul embraced Jesus, a beautiful glimpse of the day when every knee will bow to Him, the acknowledged Lord of all.",
    am: "አንዲት ውድ ነፍስ ኢየሱስን ተቀበለች፤ ይህም ጉልበት ሁሉ ለእርሱ፣ ለሁሉ ጌታ ለሆነው፣ የሚሰግድበት ቀን ውብ ቅምሻ ነው።",
    oro: "Lubbuun gatii guddaa qabdu tokko Yesus fudhatte; kunis guyyaa jilbi hundinuu Isaaf, Gooftaa hundumaatiif sagaduuf jiruuf fakkeenya miidhagaadha.",
    kor: "귀한 영혼이 예수님을 영접했습니다. 이는 모든 무릎이 만유의 주님이신 그분께 꿇게 될 그날의 아름다운 예표입니다.",
    chn: "一个宝贵的灵魂接受了耶稣，这是未来万膝都将向祂——万有之主——跪拜那日的美好预尝。",
  },
  descStudentsPrayDuringMission: {
    en: "United in fervent prayer, the missionary team sought God's heart, interceding powerfully for breakthroughs and the advance of His Kingdom.",
    am: "በጋለ ጸሎት አንድ በመሆን፣ የሚስዮናውያን ቡድን የእግዚአብሔርን ልብ ፈለገ፤ ለድልና ለመንግሥቱ መስፋፋት በኃይል አማለዱ።",
    oro: "Kadhannaa ho'aadhaan tokko ta'anii, gareen ergamtootaa garaa Waaqayyoo barbaadan; cabbii fi babal'ina Mootummaa Isaatiif humnaan kadhatan.",
    kor: "뜨거운 기도로 하나 된 선교팀은 하나님의 마음을 구하며, 돌파와 그분의 나라 확장을 위해 강력하게 중보했습니다.",
    chn: "宣教团队同心合意地热切祷告，寻求上帝的心意，为着突破和祂国度的扩展而大有能力地代求。",
  },
  descTakleAndTakluLead: {
    en: "Patiently and lovingly, missionaries nurtured new believers in God's Word, guiding them into deeper faith and joyful discipleship in Christ.",
    am: "በትዕግስትና በፍቅር፣ ሚስዮናውያን አዲስ አማኞችን በእግዚአብሔር ቃል አሳደጉ፤ በክርስቶስ ወደ ጥልቅ እምነትና አስደሳች ደቀመዝሙርነት መሯቸው።",
    oro: "Obsaa fi jaalalaan, ergamtoonni amantoota haaraa Dubbii Waaqayyootiin kunuunsanii, gara amantii gadi fagoo fi duuka bu'ummaa gammachiisaa Kiristoos keessaatti isaan geggeessan.",
    kor: "인내와 사랑으로, 선교사들은 새 신자들을 하나님의 말씀으로 양육하며, 그리스도 안에서 더 깊은 믿음과 기쁨의 제자도로 그들을 인도했습니다.",
    chn: "传教士们耐心而慈爱地用上帝的话语培育初信者，引导他们在基督里进入更深的信仰和喜乐的门徒生活。",
  },
  descCrowdGatheredForGospel: {
    en: "Facing challenges with unwavering faith, these missionaries pressed on, their commitment fueled by God's sustaining grace and a vision for souls.",
    am: "ፈተናዎችን በጸና እምነት እየተጋፈጡ፣ እነዚህ ሚስዮናውያን በእግዚአብሔር ደጋፊ ጸጋና ለነፍሳት ባላቸው ራእይ እየተገፋፉ ወደፊት ገፉ።",
    oro: "Qormaatilee amantii hin raafamneen dura dhaabbatanii, ergamtoonni kun ayyaana Waaqayyoo isaan gargaaruu fi mul'ata lubbuuwwaniitiif qabaniin kaka'anii gara fuulduraatti tarkaanfatan.",
    kor: "흔들리지 않는 믿음으로 도전에 맞서며, 이 선교사들은 하나님의 지속적인 은혜와 영혼들을 향한 비전에 힘입어 계속 전진했습니다.",
    chn: "这些传教士以不屈的信念面对挑战，在上帝持续的恩典和对灵魂的异象驱动下，他们坚持不懈，勇往直前。",
  },
  descEarlyConvertsRaiseHands: {
    en: "Guided by unity, beloved leaders agreed to call brothers from other regions, inviting them to join the vital mission in Jimma.",
    am: "በአንድነት መንፈስ እየተመሩ፣ የተወደዱ መሪዎች ከሌሎች አካባቢዎች ወንድሞችን በመጥራት በጅማ ያለውን ወሳኝ ተልእኮ እንዲቀላቀሉ ለመስማማት በቅተዋል።",
    oro: "Tokkummaan geggeeffamanii, geggeessitoonni jaalatamoon obboloota naannoo biraarraa waamuun ergama barbaachisaa Jimmaa keessatti akka hirmaataniif waliigalan.",
    kor: "하나됨으로 인도받은 사랑하는 지도자들은 다른 지역의 형제들을 부르기로 합의하여, 짐마의 중요한 선교에 동참하도록 초대했습니다.",
    chn: "在合一的引领下，蒙爱的领袖们同意呼召其他地区的弟兄们，邀请他们加入吉马的重要使命。",
  },
  descTeamTrainingSession: {
    en: "Loved brothers, bound in Christ's love, shared His light and created unforgettable memories of faith and fellowship.",
    am: "የተወደዱ ወንድሞች፣ በክርስቶስ ፍቅር የታሰሩ፣ የሱን ብርሃን አካፍለው የማይረሳ የእምነትና የኅብረት ትውስታን ፈጥረዋል።",
    oro: "Obboloonni jaalatamoo, jaalala Kiristoosiin walitti hidhamanii, ifa Isaa hiruun yaadannoo amantii fi tokkummaa hin irraanfatamne uuman.",
    kor: "사랑하는 형제들이 그리스도의 사랑 안에서 하나 되어, 그분의 빛을 나누며 믿음과 교제의 잊을 수 없는 추억을 만들었습니다.",
    chn: "蒙爱的弟兄们，在基督的爱中联结，分享祂的光芒，创造了信仰与团契中难以忘怀的记忆。",
  },
  descFoundingMembersCelebrate: {
    en: "Jimma University students made a significant impact, boldly taking time to declare the Word of Jesus Christ in challenging areas.",
    am: "የጅማ ዩኒቨርሲቲ ተማሪዎች አስቸጋሪ በሆኑ አካባቢዎች የኢየሱስ ክርስቶስን ቃል በድፍረት ለማወጅ ጊዜ በመውሰድ ትልቅ ተጽዕኖ አሳድረዋል።",
    oro: "Barattoonni Yuunivarsiitii Jimmaa naannoo rakkisaa ta'anitti Dubbii Yesus Kiristoos ija jabinaan labsuuf yeroo fudhachuun dhiibbaa guddaa uuman.",
    kor: "짐마 대학교 학생들은 어려운 지역에서 예수 그리스도의 말씀을 담대히 선포하는 데 시간을 할애하여 큰 영향을 미쳤습니다.",
    chn: "吉马大学的学生们产生了显著影响，他们勇敢地抽出时间，在充满挑战的地区宣讲耶稣基督的圣言。",
  },

  descMissionarySharesGospel: {
    en: "Faithfully, these missionaries shared the Gospel's light and hope with a local family.",
    am: "እነዚህ ሚስዮናውያን በታማኝነት የወንጌልን ብርሃንና ተስፋ ለአንድ የአካባቢው ቤተሰብ አካፍለዋል።",
    oro: "Ergamtoonni kun amanamummaadhaan ifaa fi abdii Wangeelaa maatii naannoo tokkoof qoodaniiru.",
    kor: "이 선교사들은 신실하게 복음의 빛과 소망을 한 지역 가족에게 나누었습니다.",
    chn: "这些传教士忠心地与一个当地家庭分享了福音的光芒与希望。",
  },
  descFeedingThePoor: {
    en: "With bold faith and respect, these missionaries engaged diverse elders, sharing the Gospel's light and fostering dialogue.",
    am: "በድፍረት እምነትና አክብሮት፣ እነዚህ ሚስዮናውያን የተለያዩ ሽማግሌዎችን በማነጋገር የወንጌልን ብርሃን አካፍለው ውይይትን አበረታተዋል።",
    oro: "Amantii ija jabeessaa fi kabajaan, ergamtoonni kun jaarsolii garaagaraa waliin mari'achuun ifa Wangeelaa qoodanii fi haasawa jajjabeessaniiru.",
    kor: "담대한 믿음과 존경심으로, 이 선교사들은 다양한 어르신들과 교류하며 복음의 빛을 나누고 대화를 촉진했습니다.",
    chn: "这些传教士怀着勇敢的信念和尊重，与不同的长者交流，分享福音之光，并促进了对话。",
  },
  descChildrenListenToBible: {
    en: "With brotherly urgency, these missionaries boldly drew young men from paths of ruin to the saving hope and new life found in Jesus Christ.",
    am: "በወንድማዊ አጣዳፊነት፣ እነዚህ ሚስዮናውያን ወጣቶችን ከጥፋት መንገድ በድፍረት በመሳብ በኢየሱስ ክርስቶስ ወደሚገኘው የማዳን ተስፋና አዲስ ሕይወት አምጥተዋቸዋል።",
    oro: "Ariifannaa obbolummaatiin, ergamtoonni kun dargaggoota karaa badiisaa irraa ija jabinaan gara abdii fayyinaa fi jireenya haaraa Yesus Kiristoos keessatti argamutti fidan.",
    kor: "형제애적 절박함으로, 이 선교사들은 젊은이들을 파멸의 길에서 담대히 이끌어내어 예수 그리스도 안에서 발견되는 구원의 소망과 새 생명으로 인도했습니다.",
    chn: "这些传教士怀着弟兄般的紧迫感，勇敢地将年轻人从毁灭的道路上拉回，引向在耶稣基督里才能找到的拯救盼望与新生。",
  },
  descSoulAcceptsChrist: {
    en: "With deep compassion, these missionaries brought the Gospel's life-changing hope and power to men facing helplessness and poverty, pointing them to new life in Christ.",
    am: "በጥልቅ ርኅራኄ፣ እነዚህ ሚስዮናውያን በችግርና በእጦት ውስጥ ላሉ ሰዎች የወንጌልን ሕይወት ለዋጭ ተስፋና ኃይል በማድረስ፣ በክርስቶስ ወደ አዲስ ሕይወት መርተዋቸዋል።",
    oro: "Garaa laafina guddaadhaan, ergamtoonni kun namoota rakkinaa fi hiyyummaan qabamaniif abdii fi humna Wangeelaa jireenya jijjiiru fiduun, gara jireenya haaraa Kiristoos keessaatti isaan akeekaniiru.",
    kor: "깊은 연민으로, 이 선교사들은 무력감과 빈곤에 직면한 사람들에게 복음의 삶을 변화시키는 소망과 능력을 전하며, 그들을 그리스도 안의 새 생명으로 인도했습니다.",
    chn: "这些传教士怀着深切的同情，将福音改变生命的盼望与力量带给那些面临无助和贫困的人们，指引他们走向基督里的新生。",
  },
  descTeamWalksThroughRural: {
    en: "With God's deep compassion, these missionaries met one in life's mire, sharing not judgment but His redeeming love, offering cleansing, new worth, and light for a new beginning.",
    am: "በእግዚአብሔር ጥልቅ ርኅራኄ፣ እነዚህ ሚስዮናውያን በሕይወት ጭቃ ውስጥ ያለን አንድ ሰው አግኝተው፣ ፍርድን ሳይሆን የሚያድነውን ፍቅሩን አካፈሉ፤ መንጻትን፣ አዲስ ክብርንና ለአዲስ ጅማሬ ብርሃንን ሰጡ።",
    oro: "Garaa laafina Waaqayyoo isa guddaatiin, ergamtoonni kun nama dhoqqee jireenyaa keessa jiru tokko argatanii, firdii utuu hin taane jaalala Isaa isa fayyisu qoodaniif; qulqullina, gatii haaraa fi ifa jalqaba haaraatiif kennaniif.",
    kor: "하나님의 깊은 연민으로, 이 선교사들은 삶의 수렁에 빠진 한 사람을 만나, 심판이 아닌 그분의 구속적인 사랑을 나누며 정결함과 새로운 가치, 그리고 새 시작을 위한 빛을 전했습니다.",
    chn: "这些传教士怀着上帝深切的怜悯，在生命的泥潭中遇见了一个人，分享的不是审判，而是祂救赎的爱，带来了洁净、新的价值和新开始的光芒。",
  },
  descSunsetWorshipNewBelievers: {
    en: "With bold spirits, these missionaries openly declared the life-giving message of Jesus Christ on the open road, courageously proclaiming His truth to all who would hear.",
    am: "በድፍረት መንፈስ፣ እነዚህ ሚስዮናውያን ሕይወት ሰጪ የሆነውን የኢየሱስ ክርስቶስን መልእክት በግልጽ መንገድ ላይ አወጁ፤ እውነቱን ለሚሰሙ ሁሉ በጀግንነት አሳወቁ።",
    oro: "Hafuura ija jabeessaa qabanii, ergamtoonni kun ergaa Yesus Kiristoos isa jireenya kennu karaa irratti ifatti labsan; dhugaa Isaa warra dhaga'aniif hundaaf ija jabinaan himan.",
    kor: "담대한 영으로, 이 선교사들은 길 위에서 생명을 주는 예수 그리스도의 메시지를 공개적으로 선포하며, 듣는 모든 이에게 그분의 진리를 용감하게 전했습니다.",
    chn: "这些传教士怀着勇敢的精神，在公开的道路上宣讲耶稣基督赐人生命的信息，勇敢地向所有愿意聆听的人宣告祂的真理。",
  },
  descDefault: {
    en: "Description not available",
    am: "መግለጫ የለም",
    oro: "Ibsi hin argamu",
    kor: "설명을 사용할 수 없습니다",
    chn: "描述不可用",
  },
  // See More Button
  seeMoreButton: {
    en: "See More",
    am: "ተጨማሪ እይ",
    oro: "Dabalata Ilaali",
    kor: "더 보기",
    chn: "查看更多",
  },
  // Bible Verse Section
  bibleVerseHeading: {
    en: "Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit", // Matthew 28:19a
    am: "እንግዲህ ሂዱና አሕዛብን ሁሉ በአብ በወልድና በመንፈስ ቅዱስ ስም እያጠመቃችኋቸው፥ ደቀ መዛሙርት አድርጓቸው፤", // Matthew 28:19a
    oro: "Egaa dhaqaa, maqaa Abbaa fi Ilmaatii fi Hafuura Qulqulluuttis isaan cuuphuudhaan, saba hundumaa bartoota koro godhaa!", // Matthew 28:19a
    kor: "그러므로 너희는 가서 모든 민족을 제자로 삼아 아버지와 아들과 성령의 이름으로 세례를 베풀고", // Matthew 28:19a
    chn: "所以，你们要去，使万民作我的门徒，奉父、子、圣灵的名给他们施洗。", // Matthew 28:19
  },
  // Vision/Mission/Objectives Cards
  visionCardTitle: {
    en: "Vision",
    am: "ራዕይ",
    oro: "Mul’ata",
    kor: "비전",
    chn: "愿景",
  },
  visionCardText: {
    en: "Seeing OMM being one of the strongest missionary organizations to have positive spiritual impact by 2035 G.C",
    am: "OMM በ2035 ዓ.ም እስከሚደርስ ድረስ እጅግ ጠንካራ የሆነ ሚስዮናዊ ድርጅት ሆኖ መንፈሳዊ ተፅእኖ እንዲኖረው መመልከት",
    oro: "OMM’n 2035 G.C’n duraan dhaabbata misiyoonaa cimaa ta’uu fi dhiibbaa hafuuraa gaarii qabaachuu arguu",
    kor: "2035년까지 OMM이 가장 강력한 선교 단체 중 하나가 되어 긍정적인 영적 영향을 미치는 것을 보기",
    chn: "展望OMM到2035年成为最强大的宣教组织之一，带来积极的属灵影响",
  },
  missionCardTitle: {
    en: "Mission",
    am: "ተልእኮ",
    oro: "Ergama",
    kor: "사명",
    chn: "使命",
  },
  missionCardText: {
    en: "Training, preparing and sending missionaries in accordance with Acts 1:8 to proclaim the Gospel of Jesus Christ and bring new souls to eternal life",
    am: "ሥልጠና፣ ዝግጅትና ሚስዮናውያንን መላክ በሐዋርያት ሥራ 1:8 መሠረት የኢየሱስ ክርስቶስን ወንጌል ለመሰብከትና አዳዲስ ነፍሳትን ወደ ዘላለማዊ ሕይወት ለመጋበዝ",
    oro: "Qajeelcha, qophii fi ergamtoota ergachuu kan Haww 1:8 waliin walqabatuun wangeela Yesus Kristoosiif labsuu fi lubbuu haaraa jireenya bara baraatiif geggeessuu",
    kor: "사도행전 1:8에 따라 선교사를 훈련시키고 준비시키며 파송하여 예수 그리스도의 복음을 선포하고 새로운 영혼들을 영원한 생명으로 인도하기",
    chn: "根据使徒行传1:8，培训、预备和差派传教士，宣讲耶稣基督的福音，并将新的灵魂带入永生",
  },
  objectivesCardTitle: {
    en: "Objectives",
    am: "ዓላማዎች",
    oro: "Kaayyoo",
    kor: "목표",
    chn: "目标",
  },
  objectivesCardText: {
    en: "To reach the lost souls with the gospel of salvation, preach eternal life through Jesus Christ, prepare them for the kingdom of God, strengthen and encourage Christian churches",
    am: "የጠፉትን ነፍሳት በደኅንነት ወንጌል መድረስ፣ የዘላለም ሕይወትን በኢየሱስ ክርስቶስ መሰብከት፣ ለእግዚአብሔር መንግሥት ማዘጋጀት፣ ክርስቲያን አብያተ ክርስቲያናትን ማጠንከርና መደገፍ",
    oro: "Lubbuu bade wangeela fayyinaatiin dhaqqabuu, jireenya bara baraa Yesus Kristoosiin labsuu, mootummaa Waaqayyoof isaan qopheessuu, waldaalee Kiristaanaa cimsuu fi jajjabeessuu",
    kor: "잃어버린 영혼들에게 구원의 복음을 전하고, 예수 그리스도를 통해 영원한 생명을 설교하며, 하나님의 왕국을 위해 그들을 준비시키고, 기독교 교회들을 강화하고 격려하기",
    chn: "以救恩的福音接触失丧的灵魂，传讲通过耶稣基督而来的永生，预备他们进入神的国度，并坚固和鼓励基督教会",
  },
  learnMoreButton: {
    en: "Learn More",
    am: "ተጨማሪ ይወቁ",
    oro: "Dabalata Baruu",
    kor: "더 알아보기",
    chn: "了解更多",
  },
  // Error Text
  errorLoadingData: {
    en: "Could not load impact data. Please try again later.",
    am: "የተፅእኖ መረጃን መጫን አልተቻለም። እባክዎ ቆይተው እንደገና ይሞክሩ።",
    oro: "Odeeffannoo dhiibbaa fe'uu hin dandeenye. Maaloo yeroo booda irra deebi'aa yaalaa.",
    kor: "영향 데이터를 로드할 수 없습니다. 나중에 다시 시도하십시오.",
    chn: "无法加载影响力数据。请稍后重试。",
  },
  error404: {
    en: "Error: Data not found",
    am: "ስህተት፡ መረጃ አልተገኘም",
    oro: "Dogoggora: Odeeffannoon hin argamne",
    kor: "오류: 데이터를 찾을 수 없습니다",
    chn: "错误：未找到数据",
  },
  // Alt Text fragments
  altMissionImage: {
    en: "Mission Image",
    am: "የሚሲዮን ምስል",
    oro: "Suuraa Ergamaa",
    kor: "선교 이미지",
    chn: "宣教图片",
  },
  altFoundingMissionImage: {
    en: "Founding Mission Image",
    am: "የምሥረታ ሚሲዮን ምስል",
    oro: "Suuraa Ergama Hundeessaa",
    kor: "창립 선교 이미지",
    chn: "创始宣教图片",
  },
  altBishoftuMissionImage: {
    en: "Bishoftu Mission Image",
    am: "የቢሾፍቱ ሚሲዮን ምስል",
    oro: "Suuraa Ergama Bishooftuu",
    kor: "비쇼프투 선교 이미지",
    chn: "比绍夫图宣教图片",
  },
  altHolotaMissionImage: {
    en: "Holota Mission Image",
    am: "የሆለታ ሚሲዮን ምስል",
    oro: "Suuraa Ergama Holotaa",
    kor: "홀로타 선교 이미지",
    chn: "霍洛塔宣教图片",
  },
  altAlemgenaMissionImage: {
    en: "Alemgena Mission Image",
    am: "የአለምገና ሚሲዮን ምስል",
    oro: "Suuraa Ergama Alemgenaa",
    kor: "알렘게나 선교 이미지",
    chn: "阿莱姆格纳宣教图片",
  },
  altMinistryImage: {
    en: "Ministry Image",
    am: "የአገልግሎት ምስል",
    oro: "Suuraa Tajaajilaa",
    kor: "사역 이미지",
    chn: "事工图片",
  },
  altHeroBackground: {
    en: "Hero Background",
    am: "የጀግና ዳራ",
    oro: "Dudduubee Gootaa",
    kor: "영웅 배경",
    chn: "主视觉背景",
  },
};

// --- Image Data Structure ---
// To avoid 'missionImageData' being unused, you would typically pass it
// as a prop to a component that renders mission images, or use it directly in JSX.
// For now, I'm adding a comment to acknowledge its intended use.
// const missionImageData = {
//   medical2025: [
//     { src: omm6, descKey: "descYoungMissionariesPraying1" },
//     { src: omm4, descKey: "descOneOnOneEvangelism1" },
//     { src: mm3, descKey: "descTeamWorshipSession1" },
//     { src: omm5, descKey: "descLocalChildrenJoinOutreach1" },
//     { src: omm7, descKey: "descMissionariesShareFood1" },
//     { src: omm8, descKey: "descBoleMKCOrganizesCeremony1" },
//     { src: mm1, descKey: "descGroupPhotoCelebrating1" },
//   ],
//   jimma2007: [
//     { src: Jimma1, descKey: "descFirstEvangelismTeam" },
//     { src: Jimma2, descKey: "descStudentsPrayDuringMission" },
//     { src: Jimma3, descKey: "descTakleAndTakluLead" },
//     { src: Jimma4, descKey: "descCrowdGatheredForGospel" },
//     { src: Jimma5, descKey: "descEarlyConvertsRaiseHands" },
//     { src: Jimma6, descKey: "descTeamTrainingSession" },
//     { src: Jimma7, descKey: "descFoundingMembersCelebrate" },
//   ],
//   summer2024: [
//     { src: Bishoftu1111, descKey: "descYoungMissionariesPraying" },
//     { src: Summer2, descKey: "descOneOnOneEvangelism" },
//     { src: bishoftuPeople, descKey: "descTeamWorshipSession" },
//     { src: Summer2024, descKey: "descLocalChildrenJoinOutreach" },
//     { src: BishoftuCrew, descKey: "descMissionariesShareFood" },
//     { src: Bishoftu2, descKey: "descBoleMKCOrganizesCeremony" },
//     { src: Bishoftu3, descKey: "descGroupPhotoCelebrating" },
//   ],

//   alemgena2023: [
//     { src: Alemgena, descKey: "descMissionarySharesGospel" },
//     { src: Alemgena11, descKey: "descFeedingThePoor" },
//     { src: Alemgena22, descKey: "descChildrenListenToBible" },
//     { src: Alemgena33, descKey: "descSoulAcceptsChrist" },
//     { src: Alemgena44, descKey: "descTeamWalksThroughRural" },
//     { src: Alemgena55, descKey: "descSunsetWorshipNewBelievers" },
//   ],
// };
type LanguageCode = "en" | "am" | "oro" | "kor" | "chn";
const validLanguageCodes: LanguageCode[] = ["en", "am", "oro", "kor", "chn"];

export default function HomePage() {
  const { selectedLanguage } = useLanguageStore();

  const [receivedJesus, setReceivedJesus] = useState(0);
  const [repented, setRepented] = useState(0);
  const [baptized, setBaptized] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const statsRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  // To avoid 'getText' being unused, you could either:
  // 1. Pass it as a prop to child components if they need translations
  // 2. Call it directly within HomePage's JSX if there were elements here that needed translation.
  // 3. (Recommended) Have child components use `useLanguageStore` and define their own `getText` or access `translations` directly.
  // For the purpose of removing the ESLint warning *in this file*, I'll use a local function or remove it if not needed here.
  // Let's assume for now it's meant to be used for something *within* this component if needed,
  // or that child components handle their own translations.
  // If it's *never* used here, it should be removed. For now, I'll keep it as it demonstrates the translation logic.
  // const getText = (key: string): string => {
  //   const potentialLang = selectedLanguage?.value || "en";

  //   const lang: LanguageCode = validLanguageCodes.includes(
  //     potentialLang as LanguageCode
  //   )
  //     ? (potentialLang as LanguageCode)
  //     : "en";

  //   const item = translations[key];

  //   if (!item) {
  //     console.warn(`Translation key "${key}" not found.`);
  //     return "";
  //   }

  //   return item[lang] ?? item.en ?? item.default ?? "";
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/cards/overview");
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        const targetNumbers = {
          receivedJesus: data.views?.value || 12330,
          repented: data.users?.value || 1234,
          baptized: data.products?.value || 50,
        };
        setReceivedJesus(targetNumbers.receivedJesus);
        setRepented(targetNumbers.repented);
        setBaptized(targetNumbers.baptized);
        setLoading(false);
      } catch (err: unknown) { // Changed 'any' to 'unknown' for better type safety
        console.error(err);
        setLoading(false);
        // Type assertion to access 'message' if 'err' is an Error object
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
        setReceivedJesus(12330);
        setRepented(1234);
        setBaptized(50);
      }
    };
    fetchData();
  }, [error]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    const currentRef = statsRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) observer.unobserve(currentRef);
      observer.disconnect();
    };
  }, [isVisible]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isVisible && !loading && (receivedJesus > 0 || repented > 0 || baptized > 0)) {
      const duration = 2000;
      const interval = 50;
      const steps = Math.floor(duration / interval);
      
      const targetReceivedJesus = receivedJesus;
      const targetRepented = repented;
      const targetBaptized = baptized;

      const increments = {
        receivedJesus: targetReceivedJesus / steps,
        repented: targetRepented / steps,
        baptized: targetBaptized / steps,
      };
      // Changed 'let current' to 'const current' as suggested by ESLint,
      // because the object reference itself is not reassigned, only its properties.
      const current = {
        receivedJesus: 0,
        repented: 0,
        baptized: 0,
      };

      const updateCounts = () => {
        let finished = true;

        if (current.receivedJesus < targetReceivedJesus) {
          current.receivedJesus = Math.min(
            current.receivedJesus + increments.receivedJesus,
            targetReceivedJesus
          );
          finished = false;
        } else {
          current.receivedJesus = targetReceivedJesus;
        }

        if (current.repented < targetRepented) {
          current.repented = Math.min(
            current.repented + increments.repented,
            targetRepented
          );
          finished = false;
        } else {
          current.repented = targetRepented;
        }

        if (current.baptized < targetBaptized) {
          current.baptized = Math.min(
            current.baptized + increments.baptized,
            targetBaptized
          );
          finished = false;
        } else {
          current.baptized = targetBaptized;
        }

        setReceivedJesus(Math.floor(current.receivedJesus));
        setRepented(Math.floor(current.repented));
        setBaptized(Math.floor(current.baptized));

        if (finished && timer) {
          clearInterval(timer);
          timer = null;
        }
      };
      timer = setInterval(updateCounts, interval);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isVisible, loading, receivedJesus, repented, baptized]);

  return (
    <div className="min-h-screen bg-transparent">
      {loading ? (
        <Loader />
      ) : (
        <main className="relative w-full overflow-x-hidden bg-[#0a0a0a]">
          {/* 1. Hero Section (Now has room to breathe) */}
          <HeroSection />

          {/* 2. Language Selector - Keep as a standard div if you want to use it */}
          <div className="absolute top-4 right-4 z-50">
            {/* Selector code here */}
          </div>

          {/* 3. The rest of your Lovable Sections */}
          {/* If missionImageData is meant for these, they should accept it as a prop */}
          <SystemOverview />
          <StatsSection />
          <FeaturesSection />
          <SecurityHighlight />
          <VisionMissionSection />

          {/* 4. Footer */}
          <FooterSection />
        </main>
      )}
    </div>
  );
}