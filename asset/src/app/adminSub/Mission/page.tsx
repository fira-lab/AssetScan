"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";


import { Pencil, Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Fade, useToast } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Mission {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  mapLink: string;
  contactNumber: string;
  status: string;
  language: string;
  gallery: string[];
  audio: string;
}

const MissionsPage = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    mapLink: "",
    contactNumber: "",
    gallery: "",
    audio: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [expandedMissionId, setExpandedMissionId] = useState<string | null>(
    null
  );
  const [deleteMissionId, setDeleteMissionId] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      void fetchMissions();
    }
  }, [isMounted]);

  const fetchMissions = async () => {
    try {
      const response = await fetch("/api/mission/mission");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error + (errorData.details ? `: ${errorData.details}` : "")
        );
      }
      const data = await response.json();
      setMissions(data);
    } catch (error) {
      setError((error as Error).message);
      console.error("Fetch Error:", error);
      toast({
        title: "Error",
        description: `Failed to fetch missions: ${(error as Error).message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const isValidDate = (dateStr: string) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) return false;
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
  };

  const isValidPhoneNumber = (phone: string) => {
    const regex = /^\+?\d{10,15}$/;
    return regex.test(phone);
  };

  const isValidUrl = (url: string) => {
    const regex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/;
    return url === "" || regex.test(url);
  };

  const handleInputChange = (
    field: keyof typeof formData,
    inputValue: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: inputValue,
    }));
  };

  const handleSubmit = async () => {
    setError(null);

    if (!isValidDate(formData.date)) {
      setError("Invalid date format. Use YYYY-MM-DD (e.g., 2025-04-16)");
      toast({
        title: "Validation Error",
        description: "Invalid date format. Use YYYY-MM-DD (e.g., 2025-04-16)",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (!isValidPhoneNumber(formData.contactNumber)) {
      setError(
        "Invalid phone number. Use 10-15 digits, optionally starting with +"
      );
      toast({
        title: "Validation Error",
        description:
          "Invalid phone number. Use 10-15 digits, optionally starting with +",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (formData.description.length < 5) {
      setError("Description must be at least 5 characters long");
      toast({
        title: "Validation Error",
        description: "Description must be at least 5 characters long",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (!isValidUrl(formData.mapLink)) {
      setError("Invalid map link URL");
      toast({
        title: "Validation Error",
        description: "Invalid map link URL",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const galleryArray = formData.gallery
        .split(",")
        .map((path) => path.trim())
        .filter((path) => path);
      const response = await fetch("/api/mission/mission", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          title: formData.title,
          description: formData.description,
          date: formData.date,
          location: formData.location,
          mapLink: formData.mapLink,
          contactNumber: formData.contactNumber,
          status: editingId ? undefined : "Draft",
          language: editingId ? undefined : "English",
          gallery: galleryArray,
          audio: formData.audio,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error + (errorData.details ? `: ${errorData.details}` : "")
        );
      }

      toast({
        title: "Success",
        description: editingId
          ? "Mission updated successfully!"
          : "Mission created successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        mapLink: "",
        contactNumber: "",
        gallery: "",
        audio: "",
      });
      setEditingId(null);
      setShowForm(false);
      fetchMissions();
    } catch (error) {
      setError((error as Error).message);
      toast({
        title: "Error",
        description: `Failed to submit mission: ${(error as Error).message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteMissionId(id);
  };

  const confirmDelete = async () => {
    if (!deleteMissionId) return;
    setError(null);
    try {
      const response = await fetch(
        `/api/mission/mission?id=${deleteMissionId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error + (errorData.details ? `: ${errorData.details}` : "")
        );
      }
      toast({
        title: "Success",
        description: "Mission deleted successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchMissions();
    } catch (error) {
      setError((error as Error).message);
      toast({
        title: "Error",
        description: `Failed to delete mission: ${(error as Error).message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setDeleteMissionId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteMissionId(null);
  };

  const handleEdit = (mission: Mission) => {
    setFormData({
      title: mission.title || "",
      description: mission.description || "",
      date: mission.date.split("T")[0] || "",
      location: mission.location || "",
      mapLink: mission.mapLink || "",
      contactNumber: mission.contactNumber || "",
      gallery: mission.gallery.join(", ") || "",
      audio: mission.audio || "",
    });
    setEditingId(mission._id);
    setShowForm(true);
  };

  const handleAddMission = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      location: "",
      mapLink: "",
      contactNumber: "",
      gallery: "",
      audio: "",
    });
    setEditingId(null);
    setShowForm(true);
  };

  const toggleMissionExpand = (id: string) => {
    setExpandedMissionId(expandedMissionId === id ? null : id);
  };

  // Handle card interaction
  const handleCardInteraction = (context: string) => {
    console.log(`Interacted with ${context} Card`);
    // Add your interaction logic here (e.g., navigate, open modal, etc.)
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Card
      className="sm:col-span-2 relative overflow-hidden group hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-none cursor-pointer touch-auto"
      onClick={() => handleCardInteraction("Mission Progress")}
      onTouchStart={() => handleCardInteraction("Mission Progress")}
      onKeyDown={(e) =>
        e.key === "Enter" && handleCardInteraction("Mission Progress")
      }
      role="button"
      tabIndex={0}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent group-hover:from-orange-500/20 transition-all duration-300"></div>
      <div className="relative z-10">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg font-semibold text-orange-600 dark:text-orange-300"></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full max-w-none mx-auto p-4 sm:p-6 lg:p-8">
            {error && (
              <p className="text-center text-red-500 bg-red-50 dark:bg-red-900 py-2 rounded mb-4">
                {error}
              </p>
            )}
            <CardHeader>
              <CardTitle className="text-body-2xlg font-bold text-dark dark:text-white">
                Missions
              </CardTitle>
            </CardHeader>
            <div className="flex justify-end mb-4">
              <Button
                onClick={handleAddMission}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Mission
              </Button>
            </div>
            <Fade in={showForm}>
              {showForm && (
                <Card
                  className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-none cursor-pointer touch-auto mb-8 w-full"
                  onClick={() =>
                    handleCardInteraction(
                      editingId ? "Edit Mission" : "Create Mission"
                    )
                  }
                  onTouchStart={() =>
                    handleCardInteraction(
                      editingId ? "Edit Mission" : "Create Mission"
                    )
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    handleCardInteraction(
                      editingId ? "Edit Mission" : "Create Mission"
                    )
                  }
                  role="button"
                  tabIndex={0}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent group-hover:from-orange-500/20 transition-all duration-300"></div>
                  <div className="relative z-10">
                    <CardHeader>
                      <CardTitle className="text-body-2xlg font-bold text-dark dark:text-white">
                        {editingId ? "Edit Mission" : "Create Mission"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSubmit();
                        }}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-dark dark:text-white">
                            Title
                          </label>
                          <Textarea
                            placeholder="Title (minimum 5 characters)"
                            value={formData.title}
                            onChange={(e) =>
                              handleInputChange("title", e.target.value)
                            }
                            required
                            rows={3}
                            className="bg-gray-50 dark:bg-gray-700 text-dark dark:text-white border-gray-300 dark:border-gray-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-dark dark:text-white">
                            Description
                          </label>
                          <Textarea
                            placeholder="Description (minimum 5 characters)"
                            value={formData.description}
                            onChange={(e) =>
                              handleInputChange("description", e.target.value)
                            }
                            required
                            rows={3}
                            className="bg-gray-50 dark:bg-gray-700 text-dark dark:text-white border-gray-300 dark:border-gray-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-dark dark:text-white">
                            Date
                          </label>
                          <Input
                            placeholder="Date (e.g., 2025-04-16)"
                            value={formData.date}
                            onChange={(e) =>
                              handleInputChange("date", e.target.value)
                            }
                            required
                            type="date"
                            className="bg-gray-50 dark:bg-gray-700 text-dark dark:text-white border-gray-300 dark:border-gray-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-dark dark:text-white">
                            Location
                          </label>
                          <Input
                            placeholder="Location"
                            value={formData.location}
                            onChange={(e) =>
                              handleInputChange("location", e.target.value)
                            }
                            required
                            className="bg-gray-50 dark:bg-gray-700 text-dark dark:text-white border-gray-300 dark:border-gray-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-dark dark:text-white">
                            Map Link
                          </label>
                          <Input
                            placeholder="Map Link (e.g., https://maps.google.com/...)"
                            value={formData.mapLink}
                            onChange={(e) =>
                              handleInputChange("mapLink", e.target.value)
                            }
                            className="bg-gray-50 dark:bg-gray-700 text-dark dark:text-white border-gray-300 dark:border-gray-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-dark dark:text-white">
                            Contact Number
                          </label>
                          <Input
                            placeholder="Contact Number (e.g., +1234567890)"
                            value={formData.contactNumber}
                            onChange={(e) =>
                              handleInputChange("contactNumber", e.target.value)
                            }
                            required
                            type="tel"
                            className="bg-gray-50 dark:bg-gray-700 text-dark dark:text-white border-gray-300 dark:border-gray-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-dark dark:text-white">
                            Gallery Image Paths (comma-separated, optional)
                          </label>
                          <Textarea
                            placeholder="Gallery Image Paths (e.g., /images/mission_a.jpg, /images/mission_b.png)"
                            value={formData.gallery}
                            onChange={(e) =>
                              handleInputChange("gallery", e.target.value)
                            }
                            rows={3}
                            className="bg-gray-50 dark:bg-gray-700 text-dark dark:text-white border-gray-300 dark:border-gray-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-dark dark:text-white">
                            Audio Path (optional)
                          </label>
                          <Input
                            placeholder="Audio Path (e.g., /audio/fira.mp3)"
                            value={formData.audio}
                            onChange={(e) =>
                              handleInputChange("audio", e.target.value)
                            }
                            className="bg-gray-50 dark:bg-gray-700 text-dark dark:text-white border-gray-300 dark:border-gray-600"
                          />
                        </div>
                        <div className="flex gap-4">
                          <Button
                            type="submit"
                            className="bg-blue-500 text-white hover:bg-blue-600"
                          >
                            {editingId ? "Update Mission" : "Create Mission"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setFormData({
                                title: "",
                                description: "",
                                date: "",
                                location: "",
                                mapLink: "",
                                contactNumber: "",
                                gallery: "",
                                audio: "",
                              });
                              setEditingId(null);
                              setShowForm(false);
                            }}
                            className="border-gray-300 dark:border-gray-600 text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </div>
                </Card>
              )}
            </Fade>
            <Fade in={!!deleteMissionId}>
              {deleteMissionId && (
                <Card
                  className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-none cursor-pointer touch-auto w-full max-w-md mx-auto"
                  onClick={() => handleCardInteraction("Confirm Deletion")}
                  onTouchStart={() => handleCardInteraction("Confirm Deletion")}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    handleCardInteraction("Confirm Deletion")
                  }
                  role="button"
                  tabIndex={0}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent group-hover:from-orange-500/20 transition-all duration-300"></div>
                  <div className="relative z-10">
                    <CardHeader>
                      <CardTitle className="text-body-2xlg font-bold text-dark dark:text-white">
                        Confirm Deletion
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-dark dark:text-white mb-6">
                        Are you sure you want to delete this mission? This
                        action cannot be undone.
                      </p>
                      <div className="flex justify-end gap-4">
                        <Button
                          variant="outline"
                          onClick={cancelDelete}
                          className="border-gray-300 dark:border-gray-600 text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={confirmDelete}
                          className="bg-red-500 text-white hover:bg-red-600"
                        >
                          Confirm
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              )}
            </Fade>
            <Card
              className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-none cursor-pointer touch-auto w-full"
              onClick={() => handleCardInteraction("Mission List")}
              onTouchStart={() => handleCardInteraction("Mission List")}
              onKeyDown={(e) =>
                e.key === "Enter" && handleCardInteraction("Mission List")
              }
              role="button"
              tabIndex={0}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent group-hover:from-orange-500/20 transition-all duration-300"></div>
              <div className="relative z-10">
                <CardContent>
                  {missions.length === 0 ? (
                    <p className="text-dark dark:text-white">
                      No missions available.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {missions
                        .slice()
                        .reverse()
                        .map((mission) => (
                          <div
                            key={mission._id}
                            className="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                          >
                            <div
                              className="flex justify-between items-center py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                              onClick={() => toggleMissionExpand(mission._id)}
                            >
                              <span className="text-lg font-medium text-dark dark:text-white">
                                {mission.description || "No Description"}
                              </span>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(mission)}
                                  className="text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(mission._id)}
                                  className="text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                {expandedMissionId === mission._id ? (
                                  <ChevronUp className="h-5 w-5 text-dark dark:text-white" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-dark dark:text-white" />
                                )}
                              </div>
                            </div>
                            <Fade in={expandedMissionId === mission._id}>
                              {expandedMissionId === mission._id && (
                                <div className="pb-4 pl-4 pr-4 space-y-2 transition-all duration-300">
                                  <p className="text-dark dark:text-white">
                                    <strong>Title:</strong>
                                    {mission.title || "N/A"}
                                  </p>
                                  <p className="text-dark dark:text-white">
                                    <strong>Date:</strong>
                                    {mission.date
                                      ? new Date(
                                          mission.date
                                        ).toLocaleDateString()
                                      : "N/A"}
                                  </p>
                                  <p className="text-dark dark:text-white">
                                    <strong>Location:</strong>
                                    {mission.location || "N/A"}
                                  </p>
                                  <p className="text-dark dark:text-white">
                                    <strong>Map Link:</strong>
                                    {mission.mapLink ? (
                                      <a
                                        href={mission.mapLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                      >
                                        View Map
                                      </a>
                                    ) : (
                                      "N/A"
                                    )}
                                  </p>
                                  <p className="text-dark dark:text-white">
                                    <strong>Contact Number:</strong>
                                    {mission.contactNumber || "N/A"}
                                  </p>
                                  <p className="text-dark dark:text-white">
                                    <strong>Status:</strong>{" "}
                                    {mission.status || "N/A"}
                                  </p>
                                  <p className="text-dark dark:text-white">
                                    <strong>Language:</strong>
                                    {mission.language || "N/A"}
                                  </p>
                                  <p className="text-dark dark:text-white">
                                    <strong>Gallery:</strong>
                                    {mission.gallery &&
                                    mission.gallery.length > 0 ? (
                                      <div className="flex flex-wrap gap-2 mt-2">
                                        {mission.gallery.map((img, index) => {
                                          const isValid =
                                            typeof img === "string" &&
                                            isValidUrl(img);

                                          return isValid ? (
                                            <Image
                                              key={index}
                                              src={img}
                                              alt={`Gallery image ${index + 1}`}
                                              width={96}
                                              height={96}
                                              className="object-cover rounded"
                                              priority={index < 3}
                                              onError={() =>
                                                console.error(
                                                  `Failed to load image (Next Image): ${img}`
                                                )
                                              }
                                            />
                                          ) : (
                                            <img
                                              key={index}
                                              src={img}
                                              alt={`Gallery image ${index + 1}`}
                                              width={96}
                                              height={96}
                                              className="object-cover rounded"
                                              onError={() =>
                                                console.error(
                                                  `Failed to load image (fallback img): ${img}`
                                                )
                                              }
                                            />
                                          );
                                        })}
                                      </div>
                                    ) : (
                                      " No images"
                                    )}
                                  </p>
                                  <p className="text-dark dark:text-white">
                                    <strong>Audio:</strong>
                                    {mission.audio ? (
                                      <audio
                                        controls
                                        src={mission.audio}
                                        className="mt-2"
                                        onError={() =>
                                          console.error(
                                            `Failed to load audio: ${mission.audio}`
                                          )
                                        }
                                      >
                                        Your browser does not support the audio
                                        element.
                                      </audio>
                                    ) : (
                                      "No audio"
                                    )}
                                  </p>
                                </div>
                              )}
                            </Fade>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </div>
            </Card>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default MissionsPage;
