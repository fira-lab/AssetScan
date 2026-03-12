"use client";

import { IconButton, Skeleton } from "@chakra-ui/react";
import { useColorMode } from "../../components/ui/color-mode"; // Verify this path

import { ClientOnly } from "../../components/ui/ClientOnly"; // Verify this path
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

export default function ColorMode() {
  const { toggleColorMode, colorMode } = useColorMode();

  // If needed: const { toggleColorMode } = useChakraColorMode();

  // Define colors for the icon based on the mode for better contrast
  const iconColor = colorMode === "light" ? "gray.600" : "yellow.400"; // Dark grey in light mode, Yellowish in dark mode (like a sun/moon!)
  // Define hover background color based on mode
  const hoverBg = colorMode === "light" ? "gray.100" : "whiteAlpha.200";
  return (
    <ClientOnly fallback={<Skeleton boxSize="8" />}>
      <IconButton
        aria-label={`Switch to ${colorMode === "light" ? "dark" : "light"} mode`}
        variant="ghost" // Ghost variant removes background/border, relying on icon color
        // *** Set the icon color dynamically based on the color mode ***
        color={iconColor}
        _hover={{
          bg: hoverBg, // Use a subtle background on hover
        }}
        // Use the 'icon' prop for IconButton
        icon={
          colorMode === "light" ? (
            <MoonIcon boxSize={5} />
          ) : (
            <SunIcon boxSize={5} />
          )
        }
        onClick={toggleColorMode}
        size="md" // Match hamburger menu size for consistency
      />
    </ClientOnly>
  );
}
