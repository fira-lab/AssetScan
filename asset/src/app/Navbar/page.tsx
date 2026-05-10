"use client";

import { Box, Flex, HStack, Button, Text } from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";
import ColorMode from "../ColorMode/page";
import { useState } from "react";
import Link from "next/link";
import Language from "../Language/page";
import Image from "next/image";

import { GiHamburgerMenu } from "react-icons/gi";
import { X } from "lucide-react";
import Notification from "../notification/page";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import LoginGif from "./Login.gif";
import { useLanguageStore } from "../LanguageStore/languageStore";

type LanguageCode = "en" | "am" | "kor" | "oro" | "chn";

const Navbar = () => {
  const { colorMode } = useColorMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { selectedLanguage } = useLanguageStore();
  const pathname = usePathname();

  const isAdminSubPage = pathname ? pathname.startsWith("/adminSub") : false;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const translations = {
    home: { en: "Home", am: "ቤት", kor: "홈", oro: "Mana", chn: "首页" },
    about: {
      en: "About",
      am: "ስለ እኛ",
      kor: "소개",
      oro: "Waa'ee",
      chn: "关于我们",
    },
    recentMissions: {
      en: "Recent Missions",
      am: "የቅርብ ጊዜ ሚስዮኖች",
      kor: "최근 선교",
      oro: "Ergama Dhiyoo",
      chn: "近期宣教",
    },
    contact: {
      en: "Login",
      am: "ንብረትን ያረጋግጡ",
      kor: "자산 확인",
      oro: "Qabeenya Mirkaneessi",
      chn: "验证资产"
    },
    donate: {
      en: "Donate",
      am: "ልገሳ",
      kor: "기부",
      oro: "Kennaa",
      chn: "捐赠",
    },
    openMenuAria: {
      en: "Open Menu",
      am: "ምናሌ ክፈት",
      kor: "메뉴 열기",
      oro: "Baniitii Banaa",
      chn: "打开菜单",
    },
    closeMenuAria: {
      en: "Close Menu",
      am: "ምናሌ ዝጋ",
      kor: "메뉴 닫기",
      oro: "Baniitii Cufi",
      chn: "关闭菜单",
    },
  };

  const currentLang: LanguageCode = (
    ["en", "am", "kor", "oro", "chn"].includes(selectedLanguage?.value || "")
      ? (selectedLanguage.value as LanguageCode)
      : "en"
  );

  const navbarHeight = "72px";

  return (
    <>
      <Box
        as="nav"
        bg={colorMode === "light" ? "white" : "gray.900"}
        px={{ base: 4, md: 24 }}
        py={3}
        boxShadow="md"
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={20}
        borderBottom="1px solid"
        borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
        height={navbarHeight}
      >
        <Flex
          align="center"
          justify="space-between"
          maxW="1400px"
          mx="auto"
          height="100%"
        >
          <Flex align="center" gap={3}>
            {/* Uncomment when you want to use the logo */}
            {/* 
            <Image
              src={Omm}
              alt="GOMM Logo"
              width={50}
              height={35}
              style={{ objectFit: "contain" }}
              priority
            /> 
            */}

            <Text
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="bold"
              color="mediumslateblue"
            >
              Smart Laptop Asset Verification System
            </Text>
          </Flex>

          <HStack
            as="nav"
            spacing={4}
            display={{ base: "none", md: "flex" }}
            align="center"
          >
            <Link href="/">
              <Button
                variant="ghost"
                color="mediumslateblue"
                fontWeight="medium"
                px={3}
                _hover={{ bg: colorMode === "light" ? "teal.50" : "teal.800" }}
              >
                {translations.home[currentLang]}
              </Button>
            </Link>

            <Link href="/Contact">
              <Button
                color="white"
                variant="solid"
                bg="green.400"
                px={5}
                size="sm"
                _hover={{
                  bg: colorMode === "light" ? "green.600" : "green.500",
                }}
              >
                {translations.contact[currentLang]}
              </Button>
            </Link>

            <ColorMode />
            <Language />

            {isAdminSubPage && (
              <>
                <SignedOut>
                  <SignInButton>
                    <Button variant="ghost" px={3}>
                      <Image
                        src={LoginGif}
                        alt="Login"
                        width={50}
                        height={40}
                        style={{ marginRight: "8px" }}
                      />
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </>
            )}
          </HStack>

          <HStack
            spacing={2}
            display={{ base: "flex", md: "none" }}
            align="center"
          >
            <Language />
            <ColorMode />

            {isAdminSubPage && (
              <>
                <SignedOut>
                  <SignInButton>
                    <Button variant="ghost" px={3}>
                      <Image
                        src={LoginGif}
                        alt="Login"
                        width={50}
                        height={40}
                        style={{ marginRight: "8px" }}
                      />
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </>
            )}

            <Button
              onClick={toggleMenu}
              variant="ghost"
              color="mediumslateblue"
              size="md"
              aria-label={
                isMenuOpen
                  ? translations.closeMenuAria[currentLang]
                  : translations.openMenuAria[currentLang]
              }
              p={2}
            >
              {isMenuOpen ? <X size={24} /> : <GiHamburgerMenu size={24} />}
            </Button>
          </HStack>
        </Flex>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <Box
            bg={colorMode === "light" ? "white" : "gray.900"}
            p={4}
            position="absolute"
            top={navbarHeight}
            left={0}
            right={0}
            boxShadow="md"
            borderBottom="1px solid"
            borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
            zIndex={15}
            display={{ base: "block", md: "none" }}
          >
            <Flex direction="column" gap={3}>
              <Link href="/" passHref>
                <Button
                  variant="ghost"
                  color="mediumslateblue"
                  w="full"
                  justifyContent="flex-start"
                  onClick={closeMenu}
                >
                  {translations.home[currentLang]}
                </Button>
              </Link>

              <Link href="/Contact" passHref>
                <Button
                  variant="ghost"
                  color="mediumslateblue"
                  w="full"
                  justifyContent="flex-start"
                  onClick={closeMenu}
                >
                  {translations.contact[currentLang]}
                </Button>
              </Link>

              <Link href="/Donate" passHref>
                <Button
                  variant="solid"
                  bg="green.400"
                  color="white"
                  w="full"
                  justifyContent="flex-start"
                  onClick={closeMenu}
                  _hover={{
                    bg: colorMode === "light" ? "green.600" : "green.500",
                  }}
                >
                  {translations.donate[currentLang]}
                </Button>
              </Link>
            </Flex>
          </Box>
        )}
      </Box>

      <Box pt={navbarHeight}>
        <Notification />
      </Box>
    </>
  );
};

export default Navbar;