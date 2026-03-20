"use client";
import {
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  Box,
  SimpleGrid,
  // useBreakpointValue // This was commented out, leaving it as is unless needed
} from "@chakra-ui/react";
import Image, { StaticImageData } from "next/image"; // <<< CHANGE HERE: Import StaticImageData
import { useColorMode } from "@/components/ui/color-mode";

import { motion } from "framer-motion";
import Footer from "../Footer/page";
import EvangelismImg from "../Images/Home.jpg";
import LeadershipImg from "../Images/leaders.png";
import BusinessImg from "../Images/enter.jpg";
import ScienceImg from "../Images/Nature.jpg";
import ProfessionalImg from "../Images/Profession.jpg";
import FaithActionImg from "../Images/Faith.jpg";
import PublicationImg from "../Images/Translation.jpg";
import Founders from "../Images/Founders.jpg";

import Link from "next/link";
import { useLanguageStore } from "../LanguageStore/languageStore";

// --- Enhanced Translation Data with Chinese (Simplified) ---

const translations = {
  // --- Section: Founders ---
  foundersSectionTitle: {
    en: "Our Genesis",
    am: "የእኛ አመጣጥ",
    oro: "Jalqabni Keenya",
    kor: "우리의 기원",
    chn: "我们的起源", // Added Chinese
  },
  foundersHeading: {
    en: "Forging a Path to Spread the Gospel Globally",
    am: "ወንጌልን በዓለም አቀፍ ደረጃ ለማስፋፋት መንገድ መቅደድ",
    oro: "Wangeela Addunyaa Guutuutti Babal'isuuf Karaa Saaquu",
    kor: "전 세계에 복음을 전파하기 위한 길을 개척하다",
    chn: "开辟全球福音传播之路", // Added Chinese
  },
  foundersText: {
    en: `Our journey began in 2007 at Jimma University, ignited by the vision of two brothers, Takle and Taklu. Inspired by the enduring legacy of Onesmos Nasib and deeply rooted in the call of Acts 1:8, they established the Global Onesmos Missionary Movement (G-OMM). What started as a dedicated student evangelism team—initially known as "Waldaa Kristaanaa Wangeela Barattootaan Barattootaaf"—has blossomed through consistent weekly training and impactful local missions in Jimma. Today, G-OMM stands as a global force, touching thousands of lives with an unwavering commitment to proclaiming the Gospel of Jesus Christ.`,
    am: `ጉዟችን የጀመረው በ2007 ዓ.ም በጅማ ዩኒቨርሲቲ ሲሆን፣ የታክሌ እና ታክሉ የተባሉ ሁለት ወንድማማቾች ራዕይ የለኮሰው ነው። በኦኔሲሞስ ነሲብ ዘላቂ ቅርስ በመነሳሳትና በሐዋርያት ሥራ 1፡8 ጥሪ ላይ በጥልቅ በመመስረት፣ ግሎባል ኦኔሲሞስ ሚሽነሪ ሙቭመንት (G-OMM)ን አቋቋሙ። በመጀመሪያ "ወልዳ ክርስታና ወንጌላ በረቶታን በረቶታፍ" ተብሎ የሚታወቀው የተማሪዎች የወንጌል ቡድን ሆኖ የጀመረው፣ በጅማ ውስጥ በተከታታይ ሳምንታዊ ሥልጠናዎችና ውጤታማ የአካባቢ ተልዕኮዎች አማካኝነት አብቧል። ዛሬ፣ G-OMM የኢየሱስ ክርስቶስን ወንጌል ለማወጅ ባለው ጽኑ ቁርጠኝነት በሺዎች የሚቆጠሩ ህይወቶችን የሚነካ ዓለም አቀፍ ኃይል ሆኖ ቆሟል።`,
    oro: `Imalli keenya bara 2007 Yunivarsiitii Jimmaatti, mul'ata obbolaan lama, Taklee fi Takluutiin qabsiifame. Dhaala Onesmoos Nasiib isa yeroo dheeraa tureen kaka'umsa argachuunii fi waamicha Hojii Ergamootaa 1:8 irratti hundaa'uun, Sochii Misiyoonarummaa Addunyaa Onesmoos (G-OMM) hundeessan. Gareen wangeelaa barattootaa kan jalqaba "Waldaa Kristaanaa Wangeela Barattootaan Barattootaaf" jedhamuun beekamu, leenjii torbanii walitti fufaa fi ergamoota naannoo Jimmaa bu'a qabeessa ta'an keessatti daraareera. Har'a, G-OMM humna addunyaa ta'ee dhaabbata, lubbuu kumaatamaatti Wangeela Yesuus Kiristoos lallabuuf kutannoo hin raafamneen tuqa.`,
    kor: `우리의 여정은 2007년 짐마 대학교에서 타클레와 타클루 두 형제의 비전으로 시작되었습니다. 오네시모스 나십의 영속적인 유산에 영감을 받고 사도행전 1장 8절의 부르심에 깊이 뿌리를 둔 그들은 글로벌 오네시모스 선교 운동(G-OMM)을 설립했습니다. 처음에는 "왈다 크리스타나 완겔라 바라투탄 바라투타프"로 알려진 헌신적인 학생 복음 전도팀으로 시작하여, 짐마에서의 꾸준한 주간 훈련과 영향력 있는 지역 선교를 통해 꽃피웠습니다. 오늘날 G-OMM은 예수 그리스도의 복음을 선포하는 확고한 헌신으로 수천 명의 삶에 영향을 미치는 세계적인 힘으로 서 있습니다.`,
    chn: `我们的旅程始于2007年的吉马大学，由塔克勒（Takle）和塔克鲁（Taklu）两兄弟的异象点燃。受到奥内西莫斯·纳西布（Onesmos Nasib）不朽遗产的启发，并深深植根于使徒行传1:8的呼召，他们建立了全球奥内西莫斯宣教运动（G-OMM）。最初是一个专注的学生福音团队——起初名为“Waldaa Kristaanaa Wangeela Barattootaan Barattootaaf”——通过在吉马持续的每周培训和有影响力的本地宣教活动而蓬勃发展。如今，G-OMM已成为一股全球性的力量，以宣扬耶稣基督福音的坚定承诺触及了成千上万的生命。`, // Added Chinese
  },
  // --- Section: Departments ---
  departmentsHeading: {
    en: "Our Departments",
    am: "የእኛ መምሪያዎች", // Translated "Our Departments" to Amharic
    oro: "Muummeewwan Keenya", // Translated "Our Departments" to Oromo
    kor: "우리 부서들", // Translated "Our Departments" to Korean
    chn: "我们的部门", // Translated "Our Departments" to Chinese
  },
  // --- Section: Vision & Mission ---
  visionHeading: {
    en: "Our Vision",
    am: "ራዕያችን",
    oro: "Mul'ata Keenya",
    kor: "우리의 비전",
    chn: "我们的愿景", // Added Chinese
  },
  visionText: {
    en: `We envision a world transformed by the Gospel, where dedicated missionaries, trained and empowered by G-OMM, reach every corner of the earth, starting from our roots in Jimma. Inspired by Acts 1:8, we strive to see countless souls brought into eternal life through Jesus Christ.`,
    am: `በወንጌል የተቀየረ ዓለምን እናልማለን፤ በ G-OMM የሰለጠኑና የበቁ ቁርጠኛ ሚሽነሪዎች ከጅማ ሥሮቻችን ጀምሮ እስከ ምድር ዳርቻ ድረስ የሚደርሱበት። በሐዋርያት ሥራ 1፡8 በመነሳሳት፣ ስፍር ቁጥር የሌላቸው ነፍሳት በኢየሱስ ክርስቶስ በኩል ወደ ዘላለም ሕይወት ሲገቡ ለማየት እንተጋለን።`,
    oro: `Addunyaa Wangeelaan jijjiiramte, kan misiyoonaronni G-OMMtiin leenjifamanii fi humneeffaman hundee keenya Jimmaa irraa ka'anii hanga handaara lafaatti ga'an argina. Hojii Ergamootaa 1:8tiin kakaanee, lubbuuwwan lakkoofsa hin qabne Yesuus Kiristoosiin gara jireenya bara baraatti dhufuu isaanii arguuf carraaqna.`,
    kor: `우리는 복음으로 변화된 세상을 꿈꿉니다. G-OMM에 의해 훈련받고 역량이 강화된 헌신적인 선교사들이 우리의 뿌리인 짐마에서 시작하여 땅 끝까지 이르는 세상입니다. 사도행전 1장 8절에 영감을 받아, 우리는 수많은 영혼이 예수 그리스도를 통해 영원한 생명으로 인도되는 것을 보기 위해 노력합니다.`,
    chn: `我们展望一个被福音改变的世界：由G-OMM培训和赋能的忠心宣教士，从我们在吉马的根基出发，到达地极的每一个角落。受使徒行传1:8的启发，我们努力见证无数灵魂通过耶稣基督被带入永生。`, // Added Chinese
  },
  missionHeading: {
    en: "Our Mission",
    am: "ተልዕኳችን",
    oro: "Ergama Keenya",
    kor: "우리의 사명",
    chn: "我们的使命", // Added Chinese
  },
  missionText: {
    en: `To strategically train, prepare, and deploy missionaries globally who effectively proclaim the Gospel of Jesus Christ. Rooted in the command of Acts 1:8, we commit to disciple nations, starting locally and extending our reach to the farthest ends of the earth, nurturing believers towards eternal life.`,
    am: `የኢየሱስ ክርስቶስን ወንጌል ውጤታማ በሆነ መንገድ የሚያውጁ ሚሽነሪዎችን በዓለም አቀፍ ደረጃ በስልታዊ መንገድ ማሰልጠን፣ ማዘጋጀትና መላክ ነው። በሐዋርያት ሥራ 1፡8 ትዕዛዝ ላይ በመመስረት፣ ከአካባቢው ጀምረን እስከ ምድር ዳርቻ ድረስ በመዘርጋት አሕዛብን ደቀ መዛሙርት ለማድረግና አማኞችን ወደ ዘላለም ሕይወት ለመንከባከብ ቃል እንገባለን።`,
    oro: `Misiyoonaroota Wangeela Yesuus Kiristoos bu'a qabeessummaan lallaban addunyaa maratti tarsiimoodhaan leenjisuu, qopheessuu fi erguudha. Ajaja Hojii Ergamootaa 1:8 irratti hundaa'uun, naannoo keenya irraa eegallee hanga handaara lafaatti geenyutti, saboota bartoota taasisuu fi amantoota gara jireenya bara baraatti kunuunsuuf nuti kutannaadha.`,
    kor: `예수 그리스도의 복음을 효과적으로 선포하는 선교사들을 전 세계적으로 전략적으로 훈련하고, 준비시키며, 파송하는 것입니다. 사도행전 1장 8절의 명령에 뿌리를 두고, 우리는 지역에서 시작하여 땅 끝까지 우리의 손길을 넓혀 민족들을 제자 삼고 신자들이 영원한 생명으로 나아가도록 양육하는 데 헌신합니다.`,
    chn: `战略性地在全球范围内培训、预备和差派能够有效宣讲耶稣基督福音的宣教士。植根于使徒行传1:8的命令，我们致力于使万民作门徒，从本地开始，将我们的触角延伸至地极，并牧养信徒走向永生。`, // Added Chinese
  },
  // --- Section: Join/Contact ---
  joinHeading: {
    en: "Partner with Us",
    am: "ከእኛ ጋር ይተባበሩ",
    oro: "Nu Waliin Hojjedhaa",
    kor: "우리와 함께하세요",
    chn: "与我们携手", // Added Chinese
  },
  joinText: {
    en: "Become an integral part of G-OMM’s mission to impact lives and communities globally through the power of the Gospel. Your support makes a difference.",
    am: "በወንጌል ኃይል በዓለም አቀፍ ደረጃ በህይወትና በማህበረሰቦች ላይ ተጽዕኖ ለማሳደር የ G-OMM ተልዕኮ ዋነኛ አካል ይሁኑ። የእርስዎ ድጋፍ ለውጥ ያመጣል።",
    oro: "Humna Wangeelaatiin addunyaa maratti jireenya fi hawaasarratti dhiibbaa geesisuuf ergama G-OMM keessatti qooda barbaachisaa ta'aa. Deeggarsi keessan garaagarummaa fida.",
    kor: "복음의 능력으로 전 세계의 삶과 공동체에 영향을 미치는 G-OMM 사명의 핵심적인 부분이 되십시오. 여러분의 지원이 변화를 만듭니다.",
    chn: "成为G-OMM使命不可或缺的一部分，通过福音的力量在全球范围内影响生命和社区。您的支持将带来改变。", // Added Chinese
  },
  emailLabel: {
    en: "Email:",
    am: "ኢሜይል፡",
    oro: "Imeelii:",
    kor: "이메일:",
    chn: "邮箱：", // Added Chinese
  },
  phoneLabel: {
    en: "Phone:",
    am: "ስልክ ቁጥር፡",
    oro: "Bilbila:",
    kor: "전화번호:",
    chn: "电话：", // Added Chinese
  },
  contactButton: {
    en: "Get In Touch",
    am: "ያግኙን",
    oro: "Nu Qunnamaa",
    kor: "연락하기",
    chn: "联系我们", // Added Chinese
  },
  // --- Department Titles ---
  evangelismTitle: {
    en: "Evangelism & Church Planting",
    am: "ወንጌላዊነት እና ቤተክርስቲያን ተከላ",
    oro: "Wangeela Lallabuu fi Waldaa Dhaabuu",
    kor: "복음 전도 및 교회 개척",
    chn: "福音布道与教会建立", // Added Chinese
  },
  leadershipTitle: {
    en: "Leadership Development",
    am: "የአመራር ልማት",
    oro: "Guddina Hoggansaa",
    kor: "리더십 개발",
    chn: "领袖力发展", // Added Chinese
  },
  businessTitle: {
    en: "Marketplace Ministry & Entrepreneurship",
    am: "የገበያ ቦታ አገልግሎት እና ሥራ ፈጠራ",
    oro: "Tajaajila Gabaa fi Hiriyummaa Daldalaa",
    kor: "시장 사역 및 기업가 정신",
    chn: "职场事工与创业精神", // Added Chinese
  },
  scienceTitle: {
    en: "Science, Health & Environmental Stewardship",
    am: "ሳይንስ፣ ጤና እና የአካባቢ ጥበቃ",
    oro: "Saayinsii, Fayyaa fi Kununsa Naannoo",
    kor: "과학, 건강 및 환경 관리",
    chn: "科学、健康与环境管理", // Added Chinese
  },
  professionalTitle: {
    en: "Professional Missions Integration",
    am: "የሙያ ተልዕኮ ውህደት",
    oro: "Ergama Ogummaa Walitti Makuu",
    kor: "전문인 선교 통합",
    chn: "专业宣教整合", // Added Chinese
  },
  faithActionTitle: {
    en: "Compassion & Faith in Action",
    am: "ርህራሄ እና እምነት በተግባር",
    oro: "Oo'aafi Amantii Hojiin Mul'isuu",
    kor: "긍휼과 실천하는 믿음",
    chn: "慈惠与行动中的信仰", // Added Chinese
  },
  publicationTitle: {
    en: "Bible Translation & Resource Development",
    am: "የመጽሐፍ ቅዱስ ትርጉም እና የሀብት ልማት",
    oro: "Hiikkaa Macaafa Qulqulluu fi Misooma Qabeenyaa",
    kor: "성경 번역 및 자료 개발",
    chn: "圣经翻译与资源开发", // Added Chinese
  },
  // --- Department Descriptions ---
  evangelismDesc: {
    en: "Making disciples, equipping missionaries, establishing churches, and bridging language barriers to share the Gospel with unreached people groups.",
    am: "ደቀ መዛሙርትን ማፍራት፣ ሚሽነሪዎችን ማስታጠቅ፣ አብያተ ክርስቲያናትን መመስረት፣ እና ላልደረሱ ሕዝቦች ወንጌልን ለማካፈል የቋንቋ መሰናክሎችን ማለፍ።",
    oro: "Bartoota taasisuu, misiyoonaroota hidhachiisuu, waldaalee dhaabuu, fi garee saba wangeelli bira hin geenyeef wangeela hiruuf danqaa afaanii ce'uu.",
    kor: "제자를 삼고, 선교사를 무장시키며, 교회를 설립하고, 미전도 종족에게 복음을 전하기 위해 언어 장벽을 극복합니다.",
    chn: "栽培门徒，装备宣教士，建立教会，并跨越语言障碍，向未得之民分享福音。", // Added Chinese
  },
  leadershipDesc: {
    en: "Empowering transformational leaders for churches, organizations, and society to foster lasting spiritual and societal impact.",
    am: "ለቤተክርስቲያናት፣ ለድርጅቶች እና ለማህበረሰቡ ለውጥ የሚያመጡ መሪዎችን ማብቃት፤ ዘላቂ መንፈሳዊ እና ማህበራዊ ተፅእኖን ለማሳደግ።",
    oro: "Waldaalee, dhaabbilee fi hawaasaaf hoggantoota jijjiirama fidan humneessuu; dhiibbaa hafuuraa fi hawaasummaa yeroo dheeraa turu guddisuuf.",
    kor: "교회, 조직, 사회를 위한 변화를 주도하는 리더들에게 권한을 부여하여 지속적인 영적, 사회적 영향력을 키웁니다.",
    chn: "为教会、组织和社会赋能转型领袖，以促进持久的属灵和社会影响力。", // Added Chinese
  },
  businessDesc: {
    en: "Cultivating Christian entrepreneurs and professionals to integrate faith and work, funding missions, and driving econoroic change through ethical, Kingdom-focused principles.",
    am: "ክርስቲያን ሥራ ፈጣሪዎችንና ባለሙያዎችን በማፍራት እምነትንና ሥራን እንዲያዋህዱ፣ ተልዕኮዎችን እንዲደግፉ፣ እና በሥነ ምግባራዊ፣ በመንግሥቱ ላይ ያተኮሩ መርሆዎች የኢኮኖሚ ለውጥ እንዲያመጡ ማድረግ።",
    oro: "Hiriyaa daldalaa fi ogeessota Kiristaanaa horachuun amantii fi hojii walitti makuu, misiyoonii maallaqaan deeggaruu, fi qajeeltoowwan naamusa qaban, mootummaa Waaqayyootti xiyyeeffataniin jijjiirama diinagdee fiduu.",
    kor: "기독교 기업가와 전문가들이 신앙과 일을 통합하고, 선교 자금을 지원하며, 윤리적이고 하나님 나라 중심의 원칙을 통해 경제 변화를 주도하도록 양성합니다.",
    chn: "培养基督徒企业家和专业人士，整合信仰与工作，资助宣教事工，并通过合乎道德、以神国为中心的原则推动经济变革。", // Added Chinese
  },
  scienceDesc: {
    en: "Promoting environmental stewardship, advancing community health, and equipping Christian scientists to develop innovative, faith-informed solutions.",
    am: "የአካባቢ ጥበቃን ማበረታታት፣ የማህበረሰብ ጤናን ማሻሻል፣ እና ክርስቲያን ሳይንቲስቶችን ለፈጠራ፣ በእምነት ላይ የተመሰረቱ መፍትሄዎች እንዲያዳብሩ ማስታጠቅ።",
    oro: "Kununsa naannoo jajjabeessuu, fayyaa hawaasaa guddisuu, fi saayintistoota Kiristaanaa furmaata haaraa, amantiidhaan beekumsa argatan akka horatan hidhachiisuu.",
    kor: "환경 관리 증진, 지역 사회 건강 증진, 기독교 과학자들이 혁신적이고 신앙에 기반한 해결책을 개발하도록 지원합니다.",
    chn: "倡导环境管理，促进社区健康，并装备基督徒科学家开发基于信仰的创新解决方案。", // Added Chinese
  },
  professionalDesc: {
    en: "Equipping professionals across all disciplines to leverage their careers as strategic platforms for fulfilling the Great Commission.",
    am: "በሁሉም የሙያ ዘርፎች ያሉ ባለሙያዎችን ታላቁን ተልዕኮ ለመፈጸም ሥራቸውን እንደ ስልታዊ መድረክ እንዲጠቀሙ ማስታጠቅ።",
    oro: "Ogeessota damee hojii hundarra jiran hojii isaanii akka waaltaa tarsiimoo Ergama Guddaa ittiin raawwataniitti akka fayyadaman hidhachiisuu.",
    kor: "모든 분야의 전문가들이 자신의 경력을 대위임령을 수행하기 위한 전략적 플랫폼으로 활용하도록 준비시킵니다.",
    chn: "装备各行各业的专业人士，利用他们的职业作为履行大使命的战略平台。", // Added Chinese
  },
  faithActionDesc: {
    en: "Demonstrating Christ's love through tangible acts of service to the poor, sick, marginalized, and persecuted, embodying the Gospel message.",
    am: "ለድሆች፣ ለበሽተኞች፣ ለተገለሉና ለተሰደዱ ሰዎች ተጨባጭ የአገልግሎት ሥራዎችን በማከናወን የክርስቶስን ፍቅር ማሳየት፤ የወንጌልን መልእክት በተግባር መግለጽ።",
    oro: "Hiyyeeyyii, dhukkubsattoota, warra hammatamanii fi ari'atamaniif hojii tajaajilaa mul'ataa raawwachuudhaan jaalala Kiristoos agarsiisuu; ergaa Wangeelaa qaamaan mul'isuu.",
    kor: "가난하고, 병들고, 소외되고, 박해받는 이들에게 실질적인 섬김의 행동을 통해 그리스도의 사랑을 보여주며 복음 메시지를 구현합니다.",
    chn: "通过对贫困者、病患者、边缘化群体和受迫害者提供切实的服侍行动来彰显基督的爱，体现福音信息。", // Added Chinese
  },
  publicationDesc: {
    en: "Making God's Word accessible by translating the Bible and developing essential Christian resources for diverse nations, tribes, and languages.",
    am: "የእግዚአብሔርን ቃል ተደራሽ ለማድረግ መጽሐፍ ቅዱስን መተርጎምና ለተለያዩ ብሔሮች፣ ነገዶችና ቋንቋዎች አስፈላጊ የሆኑ ክርስቲያናዊ ሀብቶችን ማዘጋጀት።",
    oro: "Dubbii Waaqayyoo salphaatti akka argamu gochuuf Macaafa Qulqulluu hiikuu fi saboota, gosaa fi afaanota adda addaatiif qabeenya Kiristaanaa barbaachisoo ta'an qopheessuu.",
    kor: "다양한 민족, 부족, 언어를 위해 성경을 번역하고 필수적인 기독교 자료를 개발하여 하나님의 말씀을 쉽게 접할 수 있도록 합니다.",
    chn: "通过翻译圣经和为不同国家、部落和语言开发必要的基督教资源，使神的话语易于获取。", // Added Chinese
  },
};

// Define a type alias for the keys of translations object for better type safety
type TranslationKey = keyof typeof translations;

// --- Department Data Structure (Updated type for img) ---
const departmentData: {
  titleKey: TranslationKey; // Use the type alias
  descKey: TranslationKey; // Use the type alias
  img: StaticImageData; // Use the imported type
}[] = [
  {
    titleKey: "evangelismTitle",
    descKey: "evangelismDesc",
    img: EvangelismImg,
  },
  {
    titleKey: "leadershipTitle",
    descKey: "leadershipDesc",
    img: LeadershipImg,
  },
  { titleKey: "businessTitle", descKey: "businessDesc", img: BusinessImg },
  { titleKey: "scienceTitle", descKey: "scienceDesc", img: ScienceImg },
  {
    titleKey: "professionalTitle",
    descKey: "professionalDesc",
    img: ProfessionalImg,
  },
  {
    titleKey: "faithActionTitle",
    descKey: "faithActionDesc",
    img: FaithActionImg,
  },
  {
    titleKey: "publicationTitle",
    descKey: "publicationDesc",
    img: PublicationImg,
  },
];

export default function About() {
  const { colorMode } = useColorMode();
  const { selectedLanguage } = useLanguageStore();

  // Add type definition for valid language codes
  type LanguageCode = "en" | "am" | "oro" | "kor" | "chn";

  // Update getText function with type safety
  const getText = (key: TranslationKey) => {
    // Use the type alias here too
    // Ensure selectedLanguage.value is one of the valid codes, default to 'en' if not
    const lang = ["en", "am", "oro", "kor", "chn"].includes(
      selectedLanguage.value
    )
      ? (selectedLanguage.value as LanguageCode)
      : "en";

    // Check if the key exists and the language exists for that key
    if (translations[key] && translations[key][lang]) {
      return translations[key][lang];
    }
    // Fallback to English if the specific language translation is missing
    return translations[key]?.en || `Missing translation for ${key}`;
  };

  // Theme colors and animations remain the same
  const themeColors = {
    primary: colorMode === "light" ? "blue.800" : "blue.300",
    secondary: colorMode === "light" ? "gray.700" : "gray.400",
    bgPrimary: colorMode === "light" ? "white" : "gray.800",
    bgSecondary: colorMode === "light" ? "gray.50" : "gray.900",
    accent: "teal.500",
    headingColor: colorMode === "light" ? "blue.700" : "blue.200",
    textColor: colorMode === "light" ? "gray.800" : "gray.200",
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const imageHover = {
    hover: { scale: 1.03, transition: { duration: 0.3 } },
    initial: { scale: 1 },
  };

  const headingFont = "'Merriweather', serif";
  const bodyFont = "'Open Sans', sans-serif"; // Browser handles fallbacks

  // --- Component JSX (No structural changes needed, uses updated getText) ---
  return (
    <Box
      bg={colorMode === "light" ? "gray.200" : "gray.700"}
      color={themeColors.textColor}
      minH="100vh"
    >
      {/* Consider if the Ai component import/usage is correct */}
     
      <Flex
        direction="column"
        maxW="1400px"
        mx="auto"
        py={{ base: 8, md: 16 }}
        px={{ base: 4, md: 8 }}
        gap={{ base: 12, md: 20 }}
      >
        {/* --- Founders Section --- */}
        <Flex
          as={motion.section}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
          direction={{ base: "column", lg: "row" }}
          align="center"
          justify="space-between"
          w="full"
          borderRadius="xl"
          boxShadow="lg"
          bg={colorMode === "light" ? "white" : "#130716"}
          overflow="hidden"
          transition="box-shadow 0.3s ease"
          _hover={{ boxShadow: "xl" }}
        >
          {/* Image Side */}
          <Box
            flex={{ base: "1", lg: "0 0 45%" }}
            position="relative"
            minH={{ base: "300px", sm: "400px", md: "550px" }}
            w={{ base: "100%", lg: "45%" }}
            as={motion.div}
            variants={imageHover}
            initial="initial"
            whileHover="hover"
            bg={colorMode === "light" ? "white" : "#130716"}
          >
            <Image
              src={Founders}
              alt={getText("foundersHeading")}
              fill={true}
              className="object-cover object-top rounded-md shadow-md" // Added rounded corners and shadow
              quality={100}
              priority
            />
            <Heading
              as="h3"
              color="white"
              size="md"
              fontWeight="bold"
              fontFamily={headingFont}
              textShadow="1px 1px 3px rgba(0,0,0,0.6)"
            >
              Our Founders
            </Heading>
            <Box
              position="absolute"
              inset={0}
              bgGradient="linear(to-t, blackAlpha.600, transparent)"
            />
          </Box>

          {/* Text Side */}
          <Flex
            flex={{ base: "1", lg: "0 0 55%" }}
            p={{ base: 6, md: 10, lg: 12 }}
            direction="column"
            textAlign={{ base: "center", lg: "left" }}
          >
            <Text
              color={themeColors.secondary}
              fontSize="md"
              fontWeight="bold"
              fontFamily={headingFont}
              mb={2}
              textTransform="uppercase"
              letterSpacing="wider"
            >
              {getText("foundersSectionTitle")}
            </Text>
            <Heading
              as="h2"
              size={{ base: "xl", md: "2xl" }}
              mb={5}
              color={themeColors.headingColor}
              fontFamily={headingFont}
            >
              {getText("foundersHeading")}
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="1.9"
              fontFamily={bodyFont}
              color={themeColors.secondary}
            >
              {getText("foundersText")}
            </Text>
          </Flex>
        </Flex>

        {/* --- Departments Grid Section --- */}
        <VStack
          as={motion.section}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeIn}
          w="full"
          spacing={8}
          align="center"
        >
          <Heading
            as="h2"
            size={{ base: "xl", md: "2xl" }}
            textAlign="center"
            color={themeColors.headingColor}
            fontFamily={headingFont}
            mb={4}
          >
            {getText("departmentsHeading")}
          </Heading>
          <SimpleGrid
            columns={{ base: 1, sm: 2, lg: 3 }}
            spacing={{ base: 6, md: 8 }}
            w="full"
          >
            {departmentData.map((dept, index) => (
              <motion.div
                key={index}
                variants={scaleUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                style={{ height: "100%" }} // Ensure div takes full height for Flex below
              >
                <Flex
                  direction="column"
                  bg={colorMode === "light" ? "white" : "#130716"}
                  borderRadius="lg"
                  boxShadow="md"
                  overflow="hidden"
                  _hover={{ boxShadow: "xl", transform: "translateY(-5px)" }}
                  transition="all 0.3s ease-out"
                  h="100%" // Make Flex container take full height of parent motion.div
                  as={motion.div} // Apply motion directly to Flex if preferred
                  whileHover={{ y: -5 }} // Simpler hover effect directly on Flex
                >
                  {/* Department Image */}
                  <Box
                    position="relative"
                    h={{ base: "200px", md: "240px" }}
                    w="full"
                  >
                    <Image
                      src={dept.img}
                      alt={getText(dept.titleKey)}
                      layout="fill"
                      objectFit="cover"
                      quality={90}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" // Add sizes prop for optimization
                    />

                    <Flex
                      position="absolute"
                      inset={0}
                      bgGradient="linear(to-t, blackAlpha.700 20%, transparent 80%)"
                      align="flex-end"
                      p={5}
                    >
                      <Heading
                        as="h3"
                        color="white"
                        size="md"
                        fontWeight="bold"
                        fontFamily={headingFont}
                        textShadow="1px 1px 3px rgba(0,0,0,0.6)"
                      >
                        {getText(dept.titleKey)}
                      </Heading>
                    </Flex>
                  </Box>
                  {/* Department Description */}
                  <Flex p={{ base: 5, md: 6 }} direction="column" flexGrow={1}>
                    <Text
                      fontSize={{ base: "sm", md: "md" }}
                      lineHeight="1.8"
                      fontFamily={bodyFont}
                      color={themeColors.secondary}
                    >
                      {getText(dept.descKey)}
                    </Text>
                  </Flex>
                </Flex>
              </motion.div>
            ))}
          </SimpleGrid>
        </VStack>

        {/* --- Vision & Mission Section --- */}
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          spacing={{ base: 10, md: 16 }}
          py={{ base: 8, md: 12 }}
          as={motion.section}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
        >
          {/* Our Vision */}
          <VStack spacing={4} align={{ base: "center", md: "start" }}>
            <Heading
              as="h2"
              size={{ base: "lg", md: "xl" }}
              color={themeColors.headingColor}
              fontFamily={headingFont}
              textAlign={{ base: "center", md: "left" }}
            >
              {getText("visionHeading")}
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="1.9"
              fontFamily={bodyFont}
              color={themeColors.secondary}
              textAlign={{ base: "center", md: "left" }}
            >
              {getText("visionText")}
            </Text>
          </VStack>

          {/* Our Mission */}
          <VStack spacing={4} align={{ base: "center", md: "start" }}>
            <Heading
              as="h2"
              size={{ base: "lg", md: "xl" }}
              color={themeColors.headingColor}
              fontFamily={headingFont}
              textAlign={{ base: "center", md: "left" }}
            >
              {getText("missionHeading")}
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              lineHeight="1.9"
              fontFamily={bodyFont}
              color={themeColors.secondary}
              textAlign={{ base: "center", md: "left" }}
            >
              {getText("missionText")}
            </Text>
          </VStack>
        </SimpleGrid>

        {/* --- Get in Touch / Partner Section --- */}
        <VStack
          as={motion.section}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={scaleUp}
          bg={themeColors.bgPrimary}
          py={{ base: 12, md: 16 }}
          px={{ base: 6, md: 10 }}
          textAlign="center"
          spacing={6}
          borderRadius="xl"
          boxShadow="lg"
        >
          <Heading
            as="h2"
            size={{ base: "xl", md: "2xl" }}
            color={themeColors.headingColor}
            fontFamily={headingFont}
            mb={2}
          >
            {getText("joinHeading")}
          </Heading>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            fontFamily={bodyFont}
            color={themeColors.secondary}
            maxW="700px"
            mx="auto"
            mb={4}
          >
            {getText("joinText")}
          </Text>
          <VStack spacing={2} mb={6}>
            <Text fontSize="md" color={themeColors.secondary}>
              <Box as="span" fontWeight="bold">
                {getText("emailLabel")}{" "}
              </Box>
              <Link
                href="mailto:info@g-omm.com"
                style={{
                  color: themeColors.accent,
                  textDecoration: "underline",
                }}
              >
                info@g-omm.com
              </Link>
            </Text>
            <Text fontSize="md" color={themeColors.secondary}>
              <Box as="span" fontWeight="bold">
                {getText("phoneLabel")}{" "}
              </Box>
              {/* Make sure to replace with the actual phone number */}
              +251912091671
            </Text>
          </VStack>
          <Link href="/Contact" passHref legacyBehavior>
            {/* Use legacyBehavior with passHref for Chakra Button */}
            <Button
              as={motion.a} // Use 'a' tag for Link component
              colorScheme="teal"
              bg={themeColors.accent}
              color="white"
              size="lg"
              px={10}
              py={6}
              whileHover={{
                scale: 1.05,
                boxShadow: "lg",
                backgroundColor:
                  colorMode === "light" ? "teal.600" : "teal.400",
              }}
              whileTap={{ scale: 0.95 }}
              fontFamily={bodyFont}
              fontWeight="bold"
            >
              {getText("contactButton")}
            </Button>
          </Link>
        </VStack>
      </Flex>
      <Footer />
    </Box>
  );
}
