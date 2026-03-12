"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Announcement {
  _id: string;
  Description: string;
  date: string;
  location: string;
  contactNumber: string;
  status: string;
  language: string;
}

const Notification = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const router = useRouter();

  // Fetch the latest announcement
  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch("/api/announcement/announce");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error +
              (errorData.details ? `: ${errorData.details}` : "")
          );
        }
        const data: Announcement[] = await response.json();
        // Sort by date (descending) to get the latest announcement
        const latestAnnouncement = data.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];
        setAnnouncement(latestAnnouncement || null);
      } catch (error) {
        console.error("Fetch Announcement Error:", error);
      }
    };

    fetchAnnouncement();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleEnter = () => {
    if (announcement) {
      router.push(`/announcements/${announcement._id}`);
    }
  };

  // Only render when announcement is successfully fetched
  if (!isVisible || !announcement) return null;

  return (
    <div className="fixed top-18 left-0 right-0 z-50 bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-3">
          <svg
            className="w-6 h-6 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <div>
            <p className="text-sm md:text-base font-medium">
              {announcement.Description}
            </p>
            <p className="text-xs md:text-sm text-gray-200">
              Date:
              {new Date(announcement.date).toLocaleDateString()} |{" "}
              {announcement.location}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Link href={`/Contact/`}>
            <button
              onClick={handleEnter}
              className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-md hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105"
            >
              Enter
            </button>
          </Link>

          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 focus:outline-none transition-colors duration-200"
            aria-label="Close notification"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
