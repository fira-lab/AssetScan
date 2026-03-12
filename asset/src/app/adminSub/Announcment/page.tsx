"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Fade, useToast } from "@chakra-ui/react";

interface Announcement {
  _id: string;
  Description: string;
  date: string;
  location: string;
  mapLink: string;
  contactNumber: string;
  status: string;
  language: string;
}

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [formData, setFormData] = useState({
    Description: "",
    date: "",
    location: "",
    mapLink: "",
    contactNumber: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [expandedAnnouncementId, setExpandedAnnouncementId] = useState<
    string | null
  >(null);
  const [deleteAnnouncementId, setDeleteAnnouncementId] = useState<
    string | null
  >(null);
  const toast = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      fetchAnnouncements();
    }
  }, [isMounted]);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch("/api/announcement/announce");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error + (errorData.details ? `: ${errorData.details}` : "")
        );
      }
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      setError((error as Error).message);
      console.error("Fetch Error:", error);
      toast({
        title: "Error",
        description: `Failed to fetch announcements: ${(error as Error).message}`,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    if (formData.Description.length < 5) {
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
      const response = await fetch("/api/announcement/announce", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          ...formData,
          status: editingId ? undefined : "Draft",
          language: editingId ? undefined : "English",
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
          ? "Announcement updated successfully!"
          : "Announcement created successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setFormData({
        Description: "",
        date: "",
        location: "",
        mapLink: "",
        contactNumber: "",
      });
      setEditingId(null);
      setShowForm(false);
      fetchAnnouncements();
    } catch (error) {
      setError((error as Error).message);
      toast({
        title: "Error",
        description: `Failed to submit announcement: ${(error as Error).message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteAnnouncementId(id);
  };

  const confirmDelete = async () => {
    if (!deleteAnnouncementId) return;
    setError(null);
    try {
      const response = await fetch(
        `/api/announcement/announce?id=${deleteAnnouncementId}`,
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
        description: "Announcement deleted successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchAnnouncements();
    } catch (error) {
      setError((error as Error).message);
      toast({
        title: "Error",
        description: `Failed to delete announcement: ${(error as Error).message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setDeleteAnnouncementId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteAnnouncementId(null);
  };

  const handleEdit = (announcement: Announcement) => {
    setFormData({
      Description: announcement.Description || "",
      date: announcement.date.split("T")[0] || "",
      location: announcement.location || "",
      mapLink: announcement.mapLink || "",
      contactNumber: announcement.contactNumber || "",
    });
    setEditingId(announcement._id);
    setShowForm(true);
  };

  const handleAddAnnouncement = () => {
    setFormData({
      Description: "",
      date: "",
      location: "",
      mapLink: "",
      contactNumber: "",
    });
    setEditingId(null);
    setShowForm(true);
  };

  const toggleAnnouncementExpand = (id: string) => {
    setExpandedAnnouncementId(expandedAnnouncementId === id ? null : id);
  };

  // Handle card interaction
  const handleCardInteraction = () => {
    console.log("Interacted with Announcements Card");
    // Add your interaction logic here (e.g., navigate, open modal, etc.)
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Card
      className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-none cursor-pointer touch-auto"
      onClick={handleCardInteraction}
      onTouchStart={handleCardInteraction}
      onKeyDown={(e) => e.key === "Enter" && handleCardInteraction()}
      role="button"
      tabIndex={0}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent group-hover:from-blue-500/20 transition-all duration-300"></div>
      <div className="inset-1 w-full max-w-none mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg font-semibold text-blue-600 dark:text-blue-300">
            <span className="text-2xl animate-pulse">📢</span> Latest
            Announcements
          </CardTitle>
        </CardHeader>
        {error && (
          <p className="text-center text-red-500 bg-red-50 dark:bg-red-900 py-2 rounded mb-4">
            {error}
          </p>
        )}

        <div className="flex justify-end mb-4">
          <Button
            onClick={handleAddAnnouncement}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Announcement
          </Button>
        </div>

        <Fade in={showForm}>
          {showForm && (
            <div
              className={cn(
                "rounded-[10px] bg-white px-4 sm:px-7.5 pt-7.5 pb-4 shadow-1 dark:bg-gray-dark dark:shadow-card mb-8 w-full"
              )}
            >
              <CardHeader>
                <CardTitle className="text-body-2xlg font-bold text-dark dark:text-white">
                  {editingId ? "Edit Announcement" : "Create Announcement"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-dark dark:text-white">
                      Description
                    </label>
                    <Textarea
                      placeholder="Description (minimum 5 characters)"
                      value={formData.Description}
                      onChange={(e) =>
                        handleInputChange("Description", e.target.value)
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

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      className="bg-blue-500 text-white hover:bg-blue-600"
                    >
                      {editingId
                        ? "Update Announcement"
                        : "Create Announcement"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFormData({
                          Description: "",
                          date: "",
                          location: "",
                          mapLink: "",
                          contactNumber: "",
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
          )}
        </Fade>

        <Fade in={!!deleteAnnouncementId}>
          {deleteAnnouncementId && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div
                className={cn(
                  "rounded-[10px] bg-white px-6 py-6 shadow-1 dark:bg-gray-dark dark:shadow-card w-full max-w-md"
                )}
              >
                <CardHeader>
                  <CardTitle className="text-body-2xlg font-bold text-dark dark:text-white">
                    Confirm Deletion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-dark dark:text-white mb-6">
                    Are you sure you want to delete this announcement? This
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
            </div>
          )}
        </Fade>

        <div
          className={cn(
            "rounded-[10px] bg-white px-4 sm:px-7.5 pt-7.5 pb-4 shadow-1 dark:bg-gray-dark dark:shadow-card w-full"
          )}
        >
          <CardContent>
            {announcements.length === 0 ? (
              <p className="text-dark dark:text-white">
                No announcements available.
              </p>
            ) : (
              <div className="space-y-2">
                {announcements
                  .slice()
                  .reverse()
                  .map((announcement) => (
                    <div
                      key={announcement._id}
                      className="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                    >
                      <div
                        className="flex justify-between items-center py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        onClick={() =>
                          toggleAnnouncementExpand(announcement._id)
                        }
                      >
                        <span className="text-lg font-medium text-dark dark:text-white">
                          {announcement.Description || "No Description"}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(announcement);
                            }}
                            className="text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(announcement._id);
                            }}
                            className="text-dark dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          {expandedAnnouncementId === announcement._id ? (
                            <ChevronUp className="h-5 w-5 text-dark dark:text-white" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-dark dark:text-white" />
                          )}
                        </div>
                      </div>
                      <Fade in={expandedAnnouncementId === announcement._id}>
                        {expandedAnnouncementId === announcement._id && (
                          <div className="pb-4 pl-4 pr-4 space-y-2 transition-all duration-300">
                            <p className="text-dark dark:text-white">
                              <strong>Date:</strong>
                              {announcement.date
                                ? new Date(
                                    announcement.date
                                  ).toLocaleDateString()
                                : "N/A"}
                            </p>
                            <p className="text-dark dark:text-white">
                              <strong>Location:</strong>
                              {announcement.location || "N/A"}
                            </p>
                            <p className="text-dark dark:text-white">
                              <strong>Map Link:</strong>
                              {announcement.mapLink ? (
                                <a
                                  href={announcement.mapLink}
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
                              {announcement.contactNumber || "N/A"}
                            </p>
                            <p className="text-dark dark:text-white">
                              <strong>Status:</strong>
                              {announcement.status || "N/A"}
                            </p>
                            <p className="text-dark dark:text-white">
                              <strong>Language:</strong>
                              {announcement.language || "N/A"}
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
      </div>

      {/* Inline styles for touch compatibility */}
      <style jsx>{`
        .touch-auto {
          touch-action: auto !important;
        }
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </Card>
  );
};

export default AnnouncementsPage;
