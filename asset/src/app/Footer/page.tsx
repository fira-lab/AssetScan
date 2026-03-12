"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Flex,
  Text,
  Heading,
  VStack,
  Divider,
  Input,
  FormControl,
  FormErrorMessage,
  HStack,
  useToast,
  Link,
  IconButton, // Import Link and IconButton from Chakra UI
} from "@chakra-ui/react";
import { Button } from "@/components/ui/button"; // shadcn/ui Button

// --- Import Social Media Icons ---
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaLinkedin,
} from "react-icons/fa";

import { useColorMode } from "@/components/ui/color-mode";
import { useLanguageStore } from "../LanguageStore/languageStore";

// --- Translations object updated with "Follow Us" ---
const translations = {
  // ... (all your existing translations) ...
  subscribe: {
    en: "Subscribe",
    am: "ይመዝገቡ",
    kor: "구독",
    oro: "Itti makama",
    chn: "订阅",
  },
  emailPlaceholder: {
    en: "Enter your email",
    am: "ኢሜልዎን ያስገቡ",
    kor: "이메일을 입력하세요",
    oro: "Imeelii kee galchi",
    chn: "输入您的电子邮件",
  },
  newsletter: {
    en: "Stay Updated",
    am: "የቅርብ ጊዜ መረጃ ያግኙ",
    kor: "최신 소식 받기",
    oro: "Odeeffannoo Haaromsa",
    chn: "保持更新",
  },
  newsletterDescription: {
    en: "Subscribe to receive updates on upcoming missions.",
    am: "ስለ መጪ ተልዕኮዎች መረጃ ለመቀበል ይመዝገቡ።",
    kor: "예정된 미션에 대한 업데이트를 받으려면 구독하세요.",
    oro: "Mishiniiwwan dhufan irratti odeeffannoo argachuuf galmaa'aa.",
    chn: "订阅以接收即将进行的任务的更新。",
  },
  errorMessage: {
    en: "Failed to subscribe. Please try again.",
    am: "መመዝገብ አልተሳካም። እባክዎ እንደገና ይሞክሩ።",
    kor: "구독에 실패했습니다. 다시 시도해 주세요.",
    oro: "Makamuu hin danda'amne. Irra deebi'aa yaali.",
    chn: "订阅失败。请重试。",
  },
  subscribedSuccessTitle: {
    en: "Subscribed!",
    am: "ተመዝግበዋል!",
    kor: "구독 완료!",
    oro: "Galmooftaniittu!",
    chn: "订阅成功！",
  },
  subscribedSuccessDesc: {
    en: "You'll receive updates on upcoming missions.",
    am: "ስለ መጪ ተልዕኮዎች መረጃ ይደርስዎታል።",
    kor: "예정된 미션에 대한 업데이트를 받으실 겁니다.",
    oro: "Mishiniiwwan dhufan irratti odeeffannoo ni argattu.",
    chn: "您将收到有关即将进行的任务的更新。",
  },
  toastErrorTitle: {
    en: "Error",
    am: "ስህተት",
    kor: "오류",
    oro: "Dogoggora",
    chn: "错误",
  },
  emailRequiredError: {
    en: "Email is required",
    am: "ኢሜል ያስፈልጋል",
    kor: "이메일은 필수입니다",
    oro: "Imeeliin barbaachisaadha",
    chn: "电子邮件是必需的",
  },
  invalidEmailError: {
    en: "Please enter a valid email",
    am: "እባክዎ ትክክለኛ ኢሜል ያስገቡ",
    kor: "유효한 이메일을 입력해주세요",
    oro: "Mee imeelii sirrii galchi",
    chn: "请输入有效的电子邮件",
  },
  orgName: {
    en: "Global Onesmos Missionary Movement (OMM)",
    am: "ግሎባል ወንጌላዊ ንቅናቄ (ኦኤምኤም)",
    kor: "글로벌 오네스모스 선교 운동 (OMM)",
    oro: "Sochii Mishiinii Addunyaa Onesmos (OMM)",
    chn: "全球奥尼斯摩斯宣教运动 (OMM)",
  },
  founded: {
    en: "Founded: June 29, 2007",
    am: "የተመሰረተው: ሰኔ 29, 2007",
    kor: "설립일: 2007년 6월 29일",
    oro: "Hundeefame: Waxabajjii 29, 2007",
    chn: "成立日期：2007年6月29日",
  },
  motto: {
    en: '"Forward Ever, Backward Never!"',
    am: '"ሁሌም ወደፊት እንጂ ወደኋላ በጭራሽ!"',
    kor: '"항상 전진, 절대 후퇴는 없다!"',
    oro: '"Yoomiyyuu Gara Fuulduraatti, Gara Duubaatti Gonkumaa!"',
    chn: "“永远向前，决不后退！”",
  },
  contactUs: {
    en: "Contact Us",
    am: "ያግኙን",
    kor: "문의하기",
    oro: "Nu qunnami",
    chn: "联系我们",
  },
  presenter: {
    en: "Presenter: Dr. Jiregna Chali (MD)",
    am: "አቅራቢ: ዶ/ር ጅረኛ ጫሊ (MD)",
    kor: "발표자: 지레냐 찰리 박사 (MD)",
    oro: "Dhiyeessaan: Dr. Jireegnaa Caalii (MD)",
    chn: "主持人：Jiregna Chali 博士 (MD)",
  },
  emailInfo: {
    en: "Email: info@g-omm.com",
    am: "ኢሜይል: info@g-omm.com",
    kor: "이메일: info@g-omm.com",
    oro: "Imeelii: info@g-omm.com",
    chn: "电子邮件：info@g-omm.com",
  },
  phoneInfo: {
    en: "Phone: +251912091671",
    am: "ስልክ: +251912091671",
    kor: "전화: +251912091671",
    oro: "Bilbila: +251912091671",
    chn: "电话：+251912091671",
  },
  locationInfo: {
    en: "Location: Jimma, Ethiopia",
    am: "አካባቢ: ጂማ, ኢትዮጵያ",
    kor: "위치: 짐마, 에티오피아",
    oro: "Iddoo: Jimmaa, Itoophiyaa",
    chn: "地点：埃塞俄比亚，吉马",
  },
  ourMission: {
    en: "Our Mission",
    am: "ተልዕኳችን",
    kor: "우리의 미션",
    oro: "Ergamni Keenya",
    chn: "我们的使命",
  },
  missionStatement: {
    en: "Training and sending missionaries to proclaim the Gospel of Jesus Christ worldwide in accordance with Acts 1:8",
    am: "በሐዋርያት ሥራ 1:8 መሰረት የወንጌልን የኢየሱስ ክርስቶስን ወንጌል በዓለም ዙሪያ ለማወጅ ሚሽነሪዎችን ማሰልጠንና መላክ",
    kor: "사도행전 1장 8절에 따라 전 세계에 예수 그리스도의 복음을 선포하기 위해 선교사들을 훈련하고 파송하는 것",
    oro: "Hojii Ergamootaa 1:8 irratti hundaa'uun addunyaa maratti Wangeela Yesus Kiristoos labsuuf misiyoonaroota leenjisuufi erguu",
    chn: "根据使徒行传 1:8，培训并派遣传教士到世界各地宣讲耶稣基督的福音",
  },
  learnMore: {
    en: "Learn More",
    am: "ተጨማሪ ይወቁ",
    kor: "더 알아보기",
    oro: "Caalaatti Baradhu",
    chn: "了解更多",
  },
  // --- ✨ NEW TRANSLATION ADDED ---
  followUs: {
    en: "Follow Us",
    am: "ይከተሉን",
    kor: "팔로우하세요",
    oro: "Nu Hordofaa",
    chn: "关注我们",
  },
  copyright: {
    en: "© {year} Global Onesmos Missionary Movement. All Rights Reserved.",
    am: "© {year} ግሎባል ወንጌላዊ ንቅናቄ። ሁሉም መብቶች የተጠበቁ ናቸው።",
    kor: "© {year} 글로벌 오네스모스 선교 운동. 모든 권리 보유.",
    oro: "© {year} Sochii Mishiinii Addunyaa Onesmos. Mirgi Hundi Seeraan Eegamaadha.",
    chn: "© {year} 全球奥尼斯摩斯宣教运动。版权所有。",
  },
};
// ---------------------------------------

type LanguageCode = keyof typeof translations.subscribe;

// --- ✨ NEW: Social Media Links Array ---
// Central place to manage your social links. Remember to update the hrefs!
const socialLinks = [
  {
    href: "https://www.tiktok.com/@gomm59?lang=en",
    label: "TikTok",
    icon: <FaTiktok fontSize="20px" />,
  },
  {
    href: "https://web.facebook.com/p/Global-Onesmos-Missionary-MinistryG-OMM-100069484219049/?locale=en_GB&_rdc=1&_rdr#",
    label: "Facebook",
    icon: <FaFacebook fontSize="20px" />,
  },
  {
    href: "https://youtube.com/c/yourchannel",
    label: "YouTube",
    icon: <FaYoutube fontSize="20px" />,
  },
  {
    href: "https://www.instagram.com/gomm01099/",
    label: "Instagram",
    icon: <FaInstagram fontSize="20px" />,
  },
  {
    href: "https://www.linkedin.com/company/global-onesmos-missionary-movement/about/?viewAsMember=true",
    label: "LinkedIn",
    icon: <FaLinkedin fontSize="20px" />,
  },
];
// ------------------------------------------

const Footer = () => {
  const { colorMode } = useColorMode();
  const { selectedLanguage } = useLanguageStore();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const toast = useToast();

  const currentLang: LanguageCode = (
    ["en", "am", "kor", "oro", "chn"].includes(selectedLanguage?.value)
      ? selectedLanguage.value
      : "en"
  ) as LanguageCode;

  // --- handleSubscribe and validateEmail functions remain unchanged ---
  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubscribe = async () => {
    setEmailError("");

    if (!email) {
      setEmailError(translations.emailRequiredError[currentLang]);
      return;
    }
    if (!validateEmail(email)) {
      setEmailError(translations.invalidEmailError[currentLang]);
      return;
    }

    try {
      const response = await fetch("/api/subscribe/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        let errorData = { error: "Subscription failed" };
        try {
          errorData = await response.json();
        } catch (e) {
          console.log(e);
        }
        throw new Error(errorData.error || "Subscription request failed");
      }

      toast({
        title: translations.subscribedSuccessTitle[currentLang],
        description: translations.subscribedSuccessDesc[currentLang],
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setEmail("");
      setEmailError("");
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : translations.errorMessage[currentLang];
      console.error("Subscription Error:", error);
      toast({
        title: translations.toastErrorTitle[currentLang],
        description: errorMsg,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };
  // ----------------------------------------------------------------------

  return (
    <Box
      as="footer"
      bg={colorMode === "light" ? "gray.50" : "gray.800"}
      borderTop="1px solid"
      borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
      py={10}
      className="w-full"
    >
      <Container maxW="container.xl" px={4}>
        {/* Newsletter Subscription Section (unchanged) */}
        <Flex
          justify="center"
          align="center"
          mb={10}
          py={6}
          bg={colorMode === "light" ? "white" : "gray.700"}
          borderRadius="lg"
          boxShadow="md"
        >
          <VStack spacing={4} w={{ base: "full", md: "lg" }} px={4}>
            <Heading
              as="h3"
              size="lg"
              textAlign="center"
              color={colorMode === "light" ? "gray.800" : "white"}
            >
              {translations.newsletter[currentLang]}
            </Heading>
            <Text
              textAlign="center"
              fontSize="md"
              color={colorMode === "light" ? "gray.600" : "gray.300"}
            >
              {translations.newsletterDescription[currentLang]}
            </Text>
            <FormControl isInvalid={!!emailError} w="full">
              <HStack w="full" justify="center" spacing={2}>
                <Input
                  type="email"
                  placeholder={translations.emailPlaceholder[currentLang]}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                  size="md"
                  borderColor={colorMode === "light" ? "gray.300" : "gray.600"}
                  _focus={{
                    borderColor: "teal.500",
                    boxShadow: "0 0 0 1px teal.500",
                  }}
                  maxW={{ base: "full", sm: "350px" }}
                  aria-label={translations.emailPlaceholder[currentLang]}
                  aria-invalid={!!emailError}
                  aria-describedby={
                    emailError ? "email-error-message" : undefined
                  }
                />
                <Button color="teal" onClick={handleSubscribe}>
                  {translations.subscribe[currentLang]}
                </Button>
              </HStack>
              {emailError && (
                <FormErrorMessage
                  id="email-error-message"
                  fontSize="sm"
                  justifyContent="center"
                  mt={2}
                >
                  {emailError}
                </FormErrorMessage>
              )}
            </FormControl>
          </VStack>
        </Flex>

        {/* Footer Main Content Grid */}
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "center", md: "start" }}
          gap={8}
        >
          {/* Organization Info */}
          <VStack align={{ base: "center", md: "start" }} spacing={3}>
            <Heading
              as="h3"
              size="md"
              fontWeight="semibold"
              color={colorMode === "light" ? "gray.800" : "white"}
            >
              {translations.orgName[currentLang]}
            </Heading>
            <Text
              fontSize="sm"
              color={colorMode === "light" ? "gray.600" : "gray.300"}
            >
              {translations.founded[currentLang]}
            </Text>
            <Text
              fontSize="sm"
              fontWeight="medium"
              fontStyle="italic"
              color={colorMode === "light" ? "gray.600" : "gray.300"}
            >
              {translations.motto[currentLang]}
            </Text>
          </VStack>

          {/* Contact Info */}
          <VStack align={{ base: "center", md: "start" }} spacing={2}>
            <Heading
              as="h4"
              size="sm"
              color={colorMode === "light" ? "gray.700" : "gray.200"}
              textTransform="uppercase"
              letterSpacing="wider"
            >
              {translations.contactUs[currentLang]}
            </Heading>
            <Text
              fontSize="sm"
              color={colorMode === "light" ? "gray.600" : "gray.300"}
            >
              {translations.emailInfo[currentLang]}
            </Text>
            <Text
              fontSize="sm"
              color={colorMode === "light" ? "gray.600" : "gray.300"}
            >
              {translations.phoneInfo[currentLang]}
            </Text>
            <Text
              fontSize="sm"
              color={colorMode === "light" ? "gray.600" : "gray.300"}
            >
              {translations.locationInfo[currentLang]}
            </Text>
          </VStack>

          {/* Mission */}
          <VStack align={{ base: "center", md: "start" }} spacing={2} maxW="xs">
            <Heading
              as="h4"
              size="sm"
              color={colorMode === "light" ? "gray.700" : "gray.200"}
              textTransform="uppercase"
              letterSpacing="wider"
            >
              {translations.ourMission[currentLang]}
            </Heading>
            <Text
              fontSize="sm"
              textAlign={{ base: "center", md: "left" }}
              color={colorMode === "light" ? "gray.600" : "gray.300"}
            >
              {translations.missionStatement[currentLang]}
            </Text>
          </VStack>

          {/* ✨ --- NEW Social Media Section --- ✨ */}
          <VStack align={{ base: "center", md: "start" }} spacing={3}>
            <Heading
              as="h4"
              size="sm"
              color={colorMode === "light" ? "gray.700" : "gray.200"}
              textTransform="uppercase"
              letterSpacing="wider"
            >
              {translations.followUs[currentLang]}
            </Heading>
            <HStack spacing={4}>
              {socialLinks.map((social) => (
                <Link key={social.label} href={social.href} isExternal>
                  <IconButton
                    aria-label={social.label}
                    icon={social.icon}
                    variant="ghost"
                    color={colorMode === "light" ? "gray.600" : "gray.300"}
                    _hover={{
                      color: "teal.500",
                      bg: colorMode === "light" ? "gray.100" : "gray.700",
                    }}
                    isRound
                  />
                </Link>
              ))}
            </HStack>
          </VStack>
          {/* ✨ --- End of New Section --- ✨ */}
        </Flex>

        {/* Bottom Bar */}
        <Divider
          my={8}
          borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
        />
        <Text
          textAlign="center"
          fontSize="sm"
          color={colorMode === "light" ? "gray.500" : "gray.400"}
        >
          {translations.copyright[currentLang].replace(
            "{year}",
            new Date().getFullYear().toString()
          )}
        </Text>
      </Container>
    </Box>
  );
};

export default Footer;
