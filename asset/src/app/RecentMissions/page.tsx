"use client";
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Image,
  IconButton,
  useDisclosure,
  HStack,
} from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/react";

import { useColorMode } from "@/components/ui/color-mode";
import Footer from "../Footer/page";

import { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import {
  FaPlay,
  FaPause,
  FaPhone,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Loader from "../Loader/page";

interface MissionData {
  _id?: string;
  gallery?: string[];
  title?: string;
  description?: string;
  date?: string | Date;
  mapLink?: string;
  contactNumber?: string;
  audio?: string;
}

const RecentMissions = () => {
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedMission, setSelectedMission] = useState<MissionData | null>(
    null
  );
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [showAudioControls, setShowAudioControls] = useState(false);
  const [missions, setMissions] = useState<MissionData[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0); // Track current slide
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sliderRef = useRef<Slider | null>(null);

  console.log("currentSlide:", currentSlide);
  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const response = await fetch("/api/mission/mission", {
          cache: "no-store",
        });
        if (!response.ok) {
          let errorData = { error: `HTTP error! status: ${response.status}` };
          try {
            errorData = await response.json();
          } catch (e) {
            console.log(e);
          }
          throw new Error(errorData.error);
        }
        const data = await response.json();
        console.log("Fetched missions:", data);
        setMissions(data);
      } catch (error) {
        console.error("Error fetching missions:", error);
      }
    };

    fetchMissions();
  }, []);

  useEffect(() => {
    if (isOpen && selectedMission?.audio && audioRef.current) {
      setAudioError(null);
      setShowAudioControls(false);
      audioRef.current.load();
      audioRef.current
        .play()
        .then(() => setIsAudioPlaying(true))
        .catch((error) => {
          console.error("Audio play failed:", error);
          setAudioError(
            "Failed to play audio automatically. Use the controls below."
          );
          setShowAudioControls(true);
        });
    }
  }, [isOpen, selectedMission]);

  const handleLearnMore = (mission: MissionData) => {
    setSelectedMission(mission);
    setIsAudioPlaying(false);
    setAudioError(null);
    setShowAudioControls(false);
    setCurrentSlide(0); // Reset slide index when opening modal
    onOpen();
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isAudioPlaying) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
      setAudioError(null);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsAudioPlaying(true);
          setAudioError(null);
        })
        .catch((error) => {
          console.error("Audio play failed:", error);
          setAudioError("Failed to play audio. Use the controls below.");
          setShowAudioControls(true);
        });
    }
  };

  const allGalleryImages = missions
    .flatMap((mission) => mission.gallery || [])
    .filter((img) => img);

  const mainSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  const [modalSliderSettings, setModalSliderSettings] = useState({
    dots: true,
    infinite: false, // Disable infinite looping
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    afterChange: (index: number) => {
      setCurrentSlide(index); // Update current slide
      // Stop autoplay when reaching the last slide
      if (
        selectedMission?.gallery &&
        index === selectedMission.gallery.length - 1
      ) {
        setModalSliderSettings((prev) => ({
          ...prev,
          autoplay: false,
        }));
      }
    },
  });

  useEffect(() => {
    if (selectedMission) {
      setModalSliderSettings((prev) => ({
        ...prev,
        infinite: false, // Always disable infinite looping
        autoplay: true, // Reset autoplay when a new mission is selected
      }));
      setCurrentSlide(0); // Reset slide index when mission changes
    }
  }, [selectedMission]);

  return (
    <div>
      <Box
        bg={colorMode === "light" ? "gray.200" : "gray.700"}
        color={colorMode === "light" ? "black" : "white"}
        p={8}
      >
      
        <Heading as="h2" size="xl" textAlign="center" mb={4}>
          Recent Missions
        </Heading>
        {missions.length === 0 && allGalleryImages.length === 0 ? (
          <Loader />
        ) : allGalleryImages.length > 0 ? (
          <Box maxW="80vw" mx="auto" mb={8} height="300px" overflow="hidden">
            <Slider {...mainSliderSettings}>
              {allGalleryImages.map((img, index) => (
                <Box key={index}>
                  <Image
                    src={img}
                    alt={`Mission image ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "300px",
                      objectFit: "cover",
                    }}
                    borderRadius="md"
                  />
                </Box>
              ))}
            </Slider>
          </Box>
        ) : (
          <Text textAlign="center" my={4}>
            No gallery images to display.
          </Text>
        )}
        {missions.length === 0 ? (
          <Text textAlign="center">Loading missions or none available.</Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            {missions
              .slice()
              .reverse()
              .map((mission, index) => (
                <Box
                  key={mission._id || index}
                  bg={colorMode === "light" ? "gray.100" : "#130716"}
                  borderRadius="md"
                  overflow="hidden"
                  boxShadow="md"
                >
                  <Image
                    src={
                      mission.gallery && mission.gallery[0]
                        ? mission.gallery[0]
                        : "/placeholder.jpg"
                    }
                    alt={mission.title || mission.description || "Mission"}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                  <VStack p={4} align="start" spacing={3}>
                    <Heading as="h3" size="lg">
                      {mission.title || `Mission ${index + 1}`}
                    </Heading>
                    <Text noOfLines={3}>
                      {mission.description || "No description."}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Date:{" "}
                      {mission.date
                        ? new Date(mission.date).toLocaleDateString()
                        : "Unknown date"}
                    </Text>
                    {(mission.mapLink || mission.contactNumber) && (
                      <HStack
                        spacing={4}
                        wrap="wrap"
                        color="blue.500"
                        _hover={{ color: "blue.400" }}
                      >
                        {mission.mapLink && (
                          <HStack
                            as="a"
                            href={mission.mapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View mission location on map"
                            _hover={{ textDecoration: "underline" }}
                          >
                            <FaMapMarkerAlt size="16px" />
                            <Text fontSize="sm">View Location</Text>
                          </HStack>
                        )}
                        {mission.contactNumber && (
                          <HStack
                            as="a"
                            href={`tel:${mission.contactNumber}`}
                            aria-label={`Call mission contact at ${mission.contactNumber}`}
                            _hover={{ textDecoration: "underline" }}
                          >
                            <FaPhone size="16px" />
                            <Text fontSize="sm">{mission.contactNumber}</Text>
                          </HStack>
                        )}
                      </HStack>
                    )}
                    <Button
                      colorScheme="blue"
                      mt={2}
                      size="sm"
                      onClick={() => handleLearnMore(mission)}
                    >
                      Learn More
                    </Button>
                  </VStack>
                </Box>
              ))}
          </SimpleGrid>
        )}
      </Box>

      {selectedMission && (
        <Modal isOpen={isOpen} onClose={onClose} size="full">
          <ModalOverlay />
          <ModalContent bg={colorMode === "light" ? "white" : "gray.800"}>
            <ModalHeader color={colorMode === "light" ? "black" : "white"}>
              <Box>
                <Text fontSize={{ base: "lg", md: "2xl" }} fontWeight="bold">
                  {selectedMission?.title || "Mission Title"}
                </Text>
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  mt={2}
                  color="gray.500"
                >
                  {selectedMission?.description || "Mission Description"}
                </Text>
              </Box>

              <HStack spacing={3} mt={4}>
                {selectedMission.audio && !showAudioControls && (
                  <Tooltip
                    label={isAudioPlaying ? "Pause Audio" : "Play Audio"}
                  >
                    <IconButton
                      aria-label={isAudioPlaying ? "Pause audio" : "Play audio"}
                      icon={isAudioPlaying ? <FaPause /> : <FaPlay />}
                      onClick={toggleAudio}
                      size="sm"
                      colorScheme="blue"
                      isDisabled={!!audioError}
                    />
                  </Tooltip>
                )}
                {selectedMission.gallery &&
                  selectedMission.gallery.length > 1 && (
                    <Tooltip
                      label={
                        modalSliderSettings.autoplay
                          ? "Pause Slideshow"
                          : "Play Slideshow"
                      }
                    >
                      <IconButton
                        aria-label={
                          modalSliderSettings.autoplay
                            ? "Pause autoplay"
                            : "Resume autoplay"
                        }
                        icon={
                          modalSliderSettings.autoplay ? (
                            <FaPause />
                          ) : (
                            <FaPlay />
                          )
                        }
                        onClick={() => {
                          setModalSliderSettings((prev) => ({
                            ...prev,
                            autoplay: !prev.autoplay,
                          }));
                        }}
                        size="sm"
                        colorScheme="blue"
                      />
                    </Tooltip>
                  )}
              </HStack>
            </ModalHeader>

            <ModalCloseButton
              color={colorMode === "light" ? "black" : "white"}
            />

            <ModalBody>
              {selectedMission.gallery && selectedMission.gallery.length > 0 ? (
                <Box
                  w="100%"
                  maxW="95vw"
                  maxH={{ base: "50vh", md: "70vh" }}
                  mx="auto"
                  overflow="hidden"
                  position="relative"
                  mb={4}
                >
                  {/* Previous Button */}
                  <IconButton
                    aria-label="Previous slide"
                    icon={<FaArrowLeft />}
                    onClick={() => sliderRef.current?.slickPrev()}
                    size="md"
                    colorScheme="blackAlpha"
                    isRound
                    position="absolute"
                    left="5px"
                    top="50%"
                    transform="translateY(-50%)"
                    zIndex={2}
                    _hover={{ bg: "blackAlpha.500" }}
                  />

                  {/* Slider */}
                  <Slider {...modalSliderSettings} ref={sliderRef}>
                    {selectedMission.gallery.map((img, index) => (
                      <Box key={index} px={2}>
                        <Image
                          src={img}
                          alt={`Image ${index + 1}`}
                          borderRadius="md"
                          objectFit="contain"
                          maxH={{ base: "45vh", md: "60vh" }}
                          w="100%"
                          mx="auto"
                          fallbackSrc="/placeholder.jpg"
                        />
                      </Box>
                    ))}
                  </Slider>

                  {/* Next Button */}
                  <IconButton
                    aria-label="Next slide"
                    icon={<FaArrowRight />}
                    onClick={() => sliderRef.current?.slickNext()}
                    size="md"
                    colorScheme="blackAlpha"
                    isRound
                    position="absolute"
                    right="5px"
                    top="50%"
                    transform="translateY(-50%)"
                    zIndex={2}
                    _hover={{ bg: "blackAlpha.500" }}
                  />
                </Box>
              ) : (
                <Text textAlign="center">
                  No gallery images for this mission.
                </Text>
              )}

              {/* Audio Section */}
              {selectedMission.audio && (
                <Box textAlign="center" mb={4} mt={2}>
                  {audioError && (
                    <Text color="red.500" fontSize="sm" mb={2}>
                      {audioError}
                    </Text>
                  )}
                  <audio
                    ref={audioRef}
                    src={selectedMission.audio}
                    loop
                    controls={showAudioControls}
                    onPlay={() => {
                      setIsAudioPlaying(true);
                      setAudioError(null);
                    }}
                    onPause={() => setIsAudioPlaying(false)}
                    onError={(e) => {
                      console.error("Audio load error:", {
                        error: e,
                        audioSrc: selectedMission.audio,
                      });
                      setAudioError(
                        "Failed to load audio. Try using controls below."
                      );
                      setShowAudioControls(true);
                    }}
                    style={{
                      display: showAudioControls ? "block" : "none",
                      margin: "0 auto",
                      width: "100%",
                      maxWidth: "500px",
                    }}
                  />
                </Box>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
      <Footer />
    </div>
  );
};

export default RecentMissions;
