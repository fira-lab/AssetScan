"use client";
import React, { useState, useRef, useEffect } from "react";

import { Send, X, MoreVertical } from "lucide-react";

import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  IconButton,
  HStack,
  Avatar,
  usePrefersReducedMotion,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorMode,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
// import Link from "next/link"; // Only if needed for internal navigation

import { BsChat } from "react-icons/bs";
import { runGeminiAi } from "../actions/geminiAi"; // Ensure this path is correct
import { ChevronDownIcon } from "@chakra-ui/icons";
import { FaGlobeAmericas } from "react-icons/fa";

interface ChatMessage {
  type: "bot" | "user";
  content: string;
  timestamp?: Date;
}

const translations = {
  Eng: {
    initialMessage:
      "Hey there! I'm an AI assistant knowledgeable about OMM. How can I help you today?",
    poweredBy: "Powered by Firaol Terefe",
    online: "Online",
    subscribe: "OMM Related Link (Example)",
    newChat: "New Chat",
    endChat: "End Chat",
    placeholder: "Ask about OMM...",
    error:
      "I apologize, but I encountered an error processing information about OMM. Please try again.",
    quickReplies: [
      "What is the mission of OMM?",
      "Who was Onesmos Nasib?",
      "What are OMM's main activities?",
      "How can I join OMM?",
      "What departments does OMM have?",
      "Who developed you?",
    ],
  },
  Spa: {
    // Spanish
    initialMessage:
      "¡Hola! Soy un asistente de IA con conocimientos sobre OMM. ¿Cómo puedo ayudarte hoy?",
    poweredBy: "Desarrollado por Firaol Terefe",
    online: "En línea",
    subscribe: "Enlace relacionado con OMM (Ejemplo)",
    newChat: "Nuevo Chat",
    endChat: "Finalizar Chat",
    placeholder: "Pregunta sobre OMM...",
    error:
      "Disculpa, pero encontré un error al procesar la información sobre OMM. Por favor, inténtalo de nuevo.",
    quickReplies: [
      "¿Cuál es la misión de OMM?",
      "¿Quién fue Onesmos Nasib?",
      "¿Cuáles son las principales actividades de OMM?",
      "¿Cómo puedo unirme a OMM?",
      "¿Qué departamentos tiene OMM?",
      "¿Quién te desarrolló?",
    ],
  },
  Ara: {
    // Arabic
    initialMessage:
      "أهلاً بك! أنا مساعد ذكاء اصطناعي على دراية بـ OMM. كيف يمكنني مساعدتك اليوم؟",
    poweredBy: "بدعم من Firaol Terefe",
    online: "متصل",
    subscribe: "رابط متعلق بـ OMM (مثال)",
    newChat: "محادثة جديدة",
    endChat: "إنهاء المحادثة",
    placeholder: "اسأل عن OMM...",
    error:
      "أعتذر، ولكن واجهت خطأ أثناء معالجة المعلومات حول OMM. يرجى المحاولة مرة أخرى.",
    quickReplies: [
      "ما هي مهمة OMM؟",
      "من كان أونسموس نسيب؟",
      "ما هي الأنشطة الرئيسية لـ OMM؟",
      "كيف يمكنني الانضمام إلى OMM؟",
      "ما هي الأقسام الموجودة في OMM؟",
      "من الذي طورك؟",
    ],
  },
  Tur: {
    // Turkish
    initialMessage:
      "Merhaba! Ben OMM hakkında bilgili bir yapay zeka asistanıyım. Bugün size nasıl yardımcı olabilirim?",
    poweredBy: "Firaol Terefe tarafından desteklenmektedir",
    online: "Çevrimiçi",
    subscribe: "OMM İlgili Bağlantı (Örnek)",
    newChat: "Yeni Sohbet",
    endChat: "Sohbeti Bitir",
    placeholder: "OMM hakkında soru sorun...",
    error:
      "Özür dilerim, OMM hakkındaki bilgileri işlerken bir hatayla karşılaştım. Lütfen tekrar deneyin.",
    quickReplies: [
      "OMM'nin misyonu nedir?",
      "Onesmos Nasib kimdi?",
      "OMM'nin ana faaliyetleri nelerdir?",
      "OMM'ye nasıl katılabilirim?",
      "OMM'nin hangi departmanları var?",
      "Seni kim geliştirdi?",
    ],
  },
  Fre: {
    // French
    initialMessage:
      "Bonjour ! Je suis un assistant IA expert sur OMM. Comment puis-je vous aider aujourd'hui ?",
    poweredBy: "Propulsé par Firaol Terefe",
    online: "En ligne",
    subscribe: "Lien lié à OMM (Exemple)",
    newChat: "Nouveau Chat",
    endChat: "Terminer le Chat",
    placeholder: "Posez une question sur OMM...",
    error:
      "Je m'excuse, mais j'ai rencontré une erreur en traitant les informations sur OMM. Veuillez réessayer.",
    quickReplies: [
      "Quelle est la mission d'OMM ?",
      "Qui était Onesmos Nasib ?",
      "Quelles sont les principales activités d'OMM ?",
      "Comment puis-je rejoindre OMM ?",
      "Quels départements OMM a-t-il ?",
      "Qui vous a développé ?",
    ],
  },
  Ger: {
    // German
    initialMessage:
      "Hallo! Ich bin ein KI-Assistent mit Wissen über OMM. Wie kann ich Ihnen heute helfen?",
    poweredBy: "Unterstützt von Firaol Terefe",
    online: "Online",
    subscribe: "OMM-bezogener Link (Beispiel)",
    newChat: "Neuer Chat",
    endChat: "Chat beenden",
    placeholder: "Fragen Sie nach OMM...",
    error:
      "Ich entschuldige mich, aber bei der Verarbeitung von Informationen über OMM ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
    quickReplies: [
      "Was ist die Mission von OMM?",
      "Wer war Onesmos Nasib?",
      "Was sind die Hauptaktivitäten von OMM?",
      "Wie kann ich OMM beitreten?",
      "Welche Abteilungen hat OMM?",
      "Wer hat dich entwickelt?",
    ],
  },
  Rus: {
    // Russian
    initialMessage:
      "Здравствуйте! Я — ИИ-помощник, знающий об OMM. Чем я могу вам помочь сегодня?",
    poweredBy: "Работает на Firaol Terefe",
    online: "Онлайн",
    subscribe: "Ссылка, связанная с OMM (Пример)",
    newChat: "Новый чат",
    endChat: "Завершить чат",
    placeholder: "Спросите об OMM...",
    error:
      "Приношу извинения, но при обработке информации об OMM произошла ошибка. Пожалуйста, попробуйте еще раз.",
    quickReplies: [
      "Какова миссия OMM?",
      "Кем был Онесмос Насиб?",
      "Каковы основные направления деятельности OMM?",
      "Как я могу присоединиться к OMM?",
      "Какие отделы есть в OMM?",
      "Кто тебя разработал?",
    ],
  },
  Kor: {
    initialMessage:
      "안녕하세요! 저는 OMM에 대해 알려드릴 수 있는 AI 비서입니다. 오늘 무엇을 도와드릴까요?",
    poweredBy: "Firaol Terefe 제공",
    online: "온라인",
    subscribe: "OMM 관련 링크 (예시)",
    newChat: "새 채팅",
    endChat: "채팅 종료",
    placeholder: "OMM에 대해 질문하세요...",
    error:
      "죄송합니다, OMM 정보를 처리하는 중 오류가 발생했습니다. 다시 시도해 주세요.",
    quickReplies: [
      "OMM의 주요 임무는 무엇인가요?",
      "오네스모스 나십은 누구였나요?",
      "OMM의 주요 활동은 무엇인가요?",
      "OMM에 어떻게 가입할 수 있나요?",
      "OMM에는 어떤 부서들이 있나요?",
      "누가 당신을 개발했나요?",
    ],
  },
  Oro: {
    initialMessage:
      "Akkam Jirtu! Ani AI waa'ee OMM si gargaaruu danda'uudha. Har'a maal isiin gargaaru?",
    poweredBy: "Firaol Terefe'n tajaajilama",
    online: "Online",
    subscribe: "OMM Linkii Walqabatu (Fakkeenya)",
    newChat: "Haasaa Haaraa",
    endChat: "Haasaa Xumuri",
    placeholder: "Waa'ee OMM gaafadhu...",
    error:
      "Dhiifama, odeeffannoo OMM qindeessuu irratti rakkoon mudateera. Irra deebi'aa yaalaa.",
    quickReplies: [
      "Ergamni OMM inni guddaan maali?",
      "Onesmoos Nasib eenyu ture?",
      "Hojiiwwan gurguddoon OMM maal fa'i?",
      "OMM'tti akkamittan makamuu danda'a?",
      "OMM dameewwan akkamii qaba?",
      "Eenyutu si hojjatee?",
    ],
  },
  Amh: {
    initialMessage:
      "ሰላም! እኔ ስለ ኦኤምኤም መረጃ መስጠት የምችል AI ረዳት ነኝ። ዛሬ እንዴት ልረዳዎት እችላለሁ?",
    poweredBy: "በፊራኦል ተረፈ የተጎላበተ",
    online: "መስመር ላይ",
    subscribe: "ከኦኤምኤም ጋር የተያያዘ ሊንክ (ምሳሌ)",
    newChat: "አዲስ ውይይት",
    endChat: "ውይይት ጨርስ",
    placeholder: "ስለ ኦኤምኤም ይጠይቁ...",
    error: "ይቅርታ፣ ስለ ኦኤምኤም መረጃ በማቀናበር ላይ ሳለ ስህተት አጋጥሟል። እባክዎ እንደገና ይሞክሩ።",
    quickReplies: [
      "የኦኤምኤም ዋና ተልዕኮ ምንድን ነው?",
      "ኦንስሞስ ናሲብ ማን ነበር?",
      "የኦኤምኤም ዋና ተግባራት ምንድን ናቸው?",
      "ኦኤምኤምን እንዴት መቀላቀል እችላለሁ?",
      "ኦኤምኤም ምን ክፍሎች አሉት?",
      "ማን ነው ያዳበረህ?",
    ],
  },
  Chn: {
    initialMessage:
      "你好！我是一个了解OMM的人工智能助手。今天能为您提供什么帮助？",
    poweredBy: "由 Firaol Terefe 提供支持",
    online: "在线",
    subscribe: "OMM 相关链接 (示例)",
    newChat: "新聊天",
    endChat: "结束聊天",
    placeholder: "询问关于OMM...",
    error: "抱歉，处理OMM信息时遇到错误。请重试。",
    quickReplies: [
      "OMM的使命是什么？",
      "Onesmos Nasib 是谁？",
      "OMM的主要活动有哪些？",
      "我如何加入OMM？",
      "OMM有哪些部门？",
      "是谁开发了你？",
    ],
  },
};
type LanguageCode = keyof typeof translations;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;
const unfoldAnimation = keyframes`
    0% { transform: scaleY(0); transform-origin: bottom right; }
    100% { transform: scaleY(1); transform-origin: bottom right; }
  `;

export default function Ai() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>("Eng");
  const chatEndRef = useRef<null | HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [isNotificationShown, setIsNotificationShown] = useState(true);
  const [hasBeenClicked, setHasBeenClicked] = useState(false);
  const [usedQuickReplies, setUsedQuickReplies] = useState<string[]>([]);

  const prefersReducedMotion = usePrefersReducedMotion();
  const { colorMode } = useColorMode();

  useEffect(() => {
    setChatHistory([
      {
        type: "bot",
        content: translations[selectedLanguage].initialMessage,
        timestamp: new Date(),
      },
    ]);
    setMessage("");
    setIsTyping(false);
    setUsedQuickReplies([]);
  }, [selectedLanguage]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const startNewChat = () => {
    setChatHistory([
      {
        type: "bot",
        content: translations[selectedLanguage].initialMessage,
        timestamp: new Date(),
      },
    ]);
    setMessage("");
    setIsTyping(false);
    setUsedQuickReplies([]);
  };

  const handleQuickReply = async (reply: string) => {
    if (isTyping) return;
    setUsedQuickReplies((prev) => [...prev, reply]);
    await sendMessage(reply);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === "" || isTyping) return;
    await sendMessage(message);
  };

  const sendMessage = async (currentMessage: string) => {
    const newMessage: ChatMessage = {
      type: "user",
      content: currentMessage,
      timestamp: new Date(),
    };
    setChatHistory((prev) => [...prev, newMessage]);
    setMessage("");
    setIsTyping(true);

    try {
      const botResponse = await runGeminiAi(currentMessage, selectedLanguage);
      setChatHistory((prev) => [
        ...prev,
        {
          type: "bot",
          content: botResponse,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error calling AI:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          type: "bot",
          content: translations[selectedLanguage].error,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const openChat = () => {
    setOpen(true);
    setIsNotificationShown(false);
    setHasBeenClicked(true);
  };

  const minimizeChat = () => {
    setOpen(false);
  };

  const renderChatMessage = (text: string) => {
    const parts: (string | React.ReactElement)[] = [];
    let lastIndex = 0;
    const urlRegex =
      /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])|(www\.[^\s]+)/gi;

    let match;
    while ((match = urlRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {text.substring(lastIndex, match.index)}
          </span>
        );
      }

      const url = match[0];
      let linkText = url.length > 35 ? url.substring(0, 32) + "..." : url;
      if (url.includes("firaol-developer.vercel.app")) {
        linkText = "Firaol's Personal Site";
      } else if (url.includes("eagledemy.vercel.app")) {
        linkText = "EagleDemy Platform";
      } else if (url.includes("youtu.be") || url.includes("youtube.com")) {
        linkText = "YouTube Link";
      }
      const formattedUrl = url.startsWith("www.") ? `https://${url}` : url;

      parts.push(
        <ChakraLink
          key={`link-${match.index}`}
          href={formattedUrl}
          isExternal
          color="blue.400"
          textDecoration="underline"
          _hover={{ color: "blue.600" }}
          fontWeight="medium"
        >
          {linkText}
        </ChakraLink>
      );
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
      parts.push(
        <span key={`text-${lastIndex}`}>{text.substring(lastIndex)}</span>
      );
    }
    return parts;
  };

  const chatBoxStyle = {
    position: "fixed" as const,
    bottom: { base: 0, md: "90px" },
    right: { base: 0, md: "20px" },
    width: { base: "100vw", sm: "380px", md: "400px" },
    height: { base: "calc(100vh - 70px)", md: "600px" },
    bg: colorMode === "light" ? "white" : "gray.800",
    rounded: { base: "none", md: "xl" },
    shadow: "2xl",
    borderWidth: { base: 0, md: "1px" },
    borderColor: colorMode === "light" ? "gray.200" : "gray.700",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column" as const,
    animation:
      isOpen && !prefersReducedMotion
        ? `${unfoldAnimation} 0.3s ease-out forwards`
        : "none",
    transformOrigin: "bottom right",
    zIndex: 1000,
  };

  return (
    <Box position="fixed" bottom="4" right="4" zIndex={1050}>
      {/* Tooltip/Initial message bubble */}
      {!isOpen && !hasBeenClicked && (
        <Box
          position="absolute"
          top="-20"
          right="0"
          mb="2"
          // bg={colorMode === "dark" ? "gray.800" : "blue.500"}
          rounded="lg"
          className="bg-gradient-to-r from-indigo-600 to-blue-500"
          shadow="lg"
          p="4"
          minW="240px"
        >
          <HStack spacing="3">
            <Avatar
              size="sm"
              src="https://res.cloudinary.com/dgbopjzbu/image/upload/v1738656555/IMG_20250204_105911_723_l8qjbr_wvfxny.jpg"
              name="eagledemy AI"
            />
            <Box flex="1">
              <Text fontWeight="medium">
                {translations[selectedLanguage].initialMessage.split("!")[0]}
              </Text>
              <Text fontSize="sm" color="black">
                Click to start chatting
              </Text>
            </Box>
          </HStack>
        </Box>
      )}

      {/* Floating Action Button (FAB) */}
      <IconButton
        aria-label={isOpen ? "Close chat" : "Open chat"}
        icon={isOpen ? <X /> : <BsChat size={32} />}
        onClick={isOpen ? minimizeChat : openChat}
        colorScheme="indigo-600"
        className="bg-gradient-to-r from-indigo-600 to-blue-500"
        rounded="full"
        size="lg"
        boxShadow="lg"
        position="relative"
        // isAttached={false} // <<< THIS LINE IS REMOVED
        variant="solid"
        _hover={{ transform: "scale(1.1)", boxShadow: "xl" }}
        _active={{ transform: "scale(0.95)" }}
        transition="transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out"
      >
        {/* Notification Badge */}
        {!isOpen && isNotificationShown && (
          <Box
            position="absolute"
            top="-1"
            right="-1"
            boxSize="5"
            bg="red.500"
            rounded="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            border="2px solid white"
          >
            <Text fontSize="xs" color="white" fontWeight="bold">
              1
            </Text>
          </Box>
        )}
      </IconButton>

      {/* Chat Window */}
      {isOpen && (
        <Box sx={chatBoxStyle}>
          {/* Header */}
          <Flex
            justify="space-between"
            align="center"
            p="3"
            borderBottomWidth="1px"
            borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
            className="bg-gradient-to-r from-indigo-500 to-blue-500"
          >
            <HStack spacing="3">
              <Avatar
                size="sm"
                src="https://res.cloudinary.com/dgbopjzbu/image/upload/v1738656942/apple-icon-57x57_tiw7c9.png"
                name="OMM AI"
              />
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  color={colorMode === "light" ? "gray.800" : "white"}
                >
                  OMM Assistant
                </Text>
                <Text fontSize="xs" color="green.500">
                  {translations[selectedLanguage].online}
                </Text>
              </Box>
            </HStack>
            <HStack spacing="1">
              {/* Language Menu */}
              <Menu placement="bottom-end">
                <MenuButton
                  as={Button}
                  variant="ghost"
                  size="sm"
                  color={colorMode === "light" ? "gray.100" : "gray.100"}
                  bg={colorMode === "light" ? "gray.800" : "gray.700"}
                  leftIcon={<FaGlobeAmericas />}
                  rightIcon={<ChevronDownIcon />}
                  _hover={{
                    bg: colorMode === "light" ? "gray.800" : "gray.700",
                  }}
                >
                  {selectedLanguage}
                </MenuButton>
                <MenuList
                  zIndex={1100}
                  bg={colorMode === "light" ? "white" : "gray.800"}
                >
                  {(Object.keys(translations) as LanguageCode[]).map(
                    (langCode) => (
                      <MenuItem
                        key={langCode}
                        onClick={() => setSelectedLanguage(langCode)}
                        bg={
                          selectedLanguage === langCode
                            ? colorMode === "light"
                              ? "blue.100"
                              : "blue.800"
                            : "transparent"
                        }
                        _hover={{
                          bg: colorMode === "light" ? "gray.100" : "gray.700",
                        }}
                        color={colorMode === "light" ? "gray.800" : "white"}
                      >
                        {langCode === "Eng" && "English"}
                        {langCode === "Kor" && "Korean"}
                        {langCode === "Oro" && "Oromo"}
                        {langCode === "Amh" && "Amharic"}
                        {langCode === "Chn" && "Chinese"}
                      </MenuItem>
                    )
                  )}
                </MenuList>
              </Menu>
              {/* Options Menu */}
              <Menu placement="bottom-end">
                <MenuButton
                  as={IconButton}
                  aria-label="Chat options"
                  icon={<MoreVertical size="20px" />}
                  variant="ghost"
                  colorScheme="gray"
                  size="sm"
                />
                <MenuList
                  zIndex={1100}
                  bg={colorMode === "light" ? "white" : "gray.800"}
                >
                  <MenuItem
                    onClick={startNewChat}
                    _hover={{
                      bg: colorMode === "light" ? "gray.100" : "gray.700",
                    }}
                    color={colorMode === "light" ? "gray.800" : "white"}
                  >
                    {translations[selectedLanguage].newChat}
                  </MenuItem>
                </MenuList>
              </Menu>
              {/* Close Button */}
              <IconButton
                aria-label="Close chat"
                icon={<X size="20px" />}
                variant="ghost"
                colorScheme="gray"
                size="sm"
                onClick={minimizeChat}
              />
            </HStack>
          </Flex>

          {/* Chat History */}
          <Box
            flex="1"
            overflowY="auto"
            p="4"
            bg={colorMode === "light" ? "gray.50" : "gray.900"}
            aria-live="polite"
            css={{
              "&::-webkit-scrollbar": { width: "6px" },
              "&::-webkit-scrollbar-track": {
                background: colorMode === "light" ? "gray.100" : "gray.700",
              },
              "&::-webkit-scrollbar-thumb": {
                background: colorMode === "light" ? "blue.300" : "blue.600",
                borderRadius: "20px",
              },
              scrollBehavior: "smooth",
            }}
          >
            {chatHistory.map((chat, index) => (
              <Flex
                key={index}
                direction={chat.type === "user" ? "row-reverse" : "row"}
                mb="3"
                align="flex-start"
                gap="2"
              >
                <Avatar
                  size="sm"
                  src={
                    chat.type === "bot"
                      ? "https://res.cloudinary.com/dgbopjzbu/image/upload/v1738656555/IMG_20250204_105911_723_l8qjbr_wvfxny.jpg"
                      : undefined
                  }
                  name={chat.type === "user" ? "You" : "AI"}
                  bg={
                    chat.type === "user"
                      ? "blue.500"
                      : colorMode === "light"
                        ? "gray.300"
                        : "gray.600"
                  }
                  color={
                    chat.type === "user"
                      ? "white"
                      : colorMode === "light"
                        ? "black"
                        : "white"
                  }
                />
                <Box
                  maxW="80%"
                  px="3"
                  py="2"
                  rounded="lg"
                  bg={
                    chat.type === "user"
                      ? "blue.500"
                      : colorMode === "light"
                        ? "white"
                        : "gray.700"
                  }
                  color={
                    chat.type === "user"
                      ? "white"
                      : colorMode === "light"
                        ? "gray.800"
                        : "white"
                  }
                  boxShadow="sm"
                  position="relative"
                >
                  <Text fontSize="sm" lineHeight="tall">
                    {renderChatMessage(chat.content)}
                  </Text>
                </Box>
              </Flex>
            ))}
            {/* Typing Indicator */}
            {isTyping && (
              <Flex align="center" justify="flex-start" gap="2" pl="10" mt="2">
                <Avatar
                  size="sm"
                  src="https://res.cloudinary.com/dgbopjzbu/image/upload/v1738656555/IMG_20250204_105911_723_l8qjbr_wvfxny.jpg"
                  name="AI"
                  bg={colorMode === "light" ? "gray.300" : "gray.600"}
                />
                <Box
                  display="flex"
                  gap="1.5"
                  p="3"
                  rounded="lg"
                  bg={colorMode === "light" ? "white" : "gray.700"}
                  boxShadow="sm"
                >
                  {[...Array(3)].map((_, i) => (
                    <Box
                      key={i}
                      w="6px"
                      h="6px"
                      bg={colorMode === "light" ? "gray.500" : "gray.400"}
                      rounded="full"
                      animation={
                        !prefersReducedMotion
                          ? `${float} 1.4s infinite ${i * 0.2}s ease-in-out`
                          : undefined
                      }
                    />
                  ))}
                </Box>
              </Flex>
            )}
            <Box ref={chatEndRef} h="1px" />
          </Box>

          {/* Quick Replies Area */}
          {!isTyping && message === "" && chatHistory.length > 0 && (
            <Flex
              wrap="wrap"
              gap="2"
              px="4"
              py="2"
              borderTopWidth="1px"
              borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
              justify="flex-start"
            >
              {translations[selectedLanguage].quickReplies.map(
                (reply, index) =>
                  !usedQuickReplies.includes(reply) && (
                    <Button
                      key={index}
                      size="xs"
                      variant="outline"
                      colorScheme="blue"
                      rounded="full"
                      onClick={() => handleQuickReply(reply)}
                      fontWeight="medium"
                      _hover={{
                        bg: colorMode === "light" ? "blue.50" : "blue.900",
                        transform: "translateY(-1px)",
                      }}
                      transition="all 0.2s"
                    >
                      {reply}
                    </Button>
                  )
              )}
            </Flex>
          )}

          {/* Input Area */}
          <Box
            p="3"
            borderTopWidth="1px"
            borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
            bg={colorMode === "light" ? "gray.50" : "gray.900"}
          >
            <form onSubmit={handleSubmit}>
              <HStack spacing="2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={translations[selectedLanguage].placeholder}
                  rounded="full"
                  size="sm"
                  bg={colorMode === "light" ? "white" : "gray.800"}
                  color={colorMode === "light" ? "gray.800" : "white"}
                  _placeholder={{
                    color: colorMode === "light" ? "gray.400" : "gray.500",
                  }}
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: `0 0 0 1px ${colorMode === "light" ? "rgba(49, 130, 206, 0.5)" : "rgba(99, 179, 237, 0.5)"}`,
                  }}
                  aria-label="Chat message input"
                />
                <IconButton
                  type="submit"
                  aria-label="Send message"
                  icon={<Send size={18} />}
                  isDisabled={isTyping || !message.trim()}
                  colorScheme="blue"
                  rounded="full"
                  size="sm"
                  isLoading={isTyping}
                  _hover={{ transform: "scale(1.05)" }}
                  transition="transform 0.2s"
                />
              </HStack>
            </form>
            {/* Powered by link */}
            <Text textAlign="center" fontSize="xs" color="gray.500" mt="2">
              <ChakraLink
                href="https://firaol-developer.vercel.app/"
                isExternal
                _hover={{ textDecoration: "underline" }}
              >
                {translations[selectedLanguage].poweredBy}
              </ChakraLink>
            </Text>
          </Box>
        </Box>
      )}
    </Box>
  );
}
