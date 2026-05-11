"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "../Loader/page";
import AnnouncementsPage from "./Announcment/page";
import SubscribedUsers from "./Subscribe/page";
import UserInfo from "@/components/Tables/UserInfo/page";
import ContactInfo from "@/components/Tables/ContactInfo/page";
import QRCodeGenerator from "@/components/Tables/qr_code_generator/page";
import { useColorMode } from "@/components/ui/color-mode";

import ManageGatekeepersPage from "@/components/Tables/GateKeeper/page";

type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};

export default function Home({ searchParams }: PropsType) {
  const { colorMode } = useColorMode();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const resolveSearchParams = async () => {
      await searchParams;
      setIsLoading(false);
    };
    resolveSearchParams();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800">
        <Loader />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        colorMode === "light" ? "bg-gray-200" : "bg-gray-900"
      }`}
    >
      <main className="container mx-auto p-4 md:p-6 xl:p-1 space-y-8">
        {/* Overview Section - Commented Out */}
        {/* 
        <Suspense fallback={<div>Loading Dashboard...</div>}>
          <OverviewCardsGroup />
        </Suspense> 
        */}

        {/* Dashboard Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2">
          {/* Announcements */}
          <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-none">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent group-hover:from-blue-500/20 transition-all duration-300"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg font-semibold text-blue-600 dark:text-blue-300">
                <span className="text-2xl animate-pulse">📢</span> Latest Announcements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnnouncementsPage />
            </CardContent>
          </Card>

          {/* Active Subscribers */}
          <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-none">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent group-hover:from-green-500/20 transition-all duration-300"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg font-semibold text-green-600 dark:text-green-300">
                <span className="text-2xl animate-pulse">📬</span> Active Subscribers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SubscribedUsers />
            </CardContent>
          </Card>

          {/* User Management */}
          <Card className="sm:col-span-2 lg:col-span-3 relative overflow-hidden group hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-none">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent group-hover:from-purple-500/20 transition-all duration-300"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg font-semibold text-purple-600 dark:text-purple-300">
                <span className="text-2xl animate-pulse">🧑‍💻</span> User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UserInfo />
            </CardContent>
          </Card>

          {/* QR Code Generator */}
          <Card className="sm:col-span-2 lg:col-span-3 relative overflow-hidden group hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-none">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent group-hover:from-purple-500/20 transition-all duration-300"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg font-semibold text-purple-600 dark:text-purple-300">
                <span className="text-2xl animate-pulse">📱</span> Generate QR Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <QRCodeGenerator />
            </CardContent>
          </Card>

         
          {/* Contact Records / GateKeeper Records */}
<Card className="sm:col-span-2 lg:col-span-3 relative hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-none">
  
  {/* Optional subtle background effect */}
  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent group-hover:from-indigo-500/20 transition-all duration-300 pointer-events-none" />

  <CardHeader>
    <CardTitle className="flex items-center gap-3 text-lg font-semibold text-indigo-600 dark:text-indigo-300">
      <span className="text-2xl">📇</span> 
      GateKeeper Records
    </CardTitle>
  </CardHeader>

  <CardContent className="p-0">   {/* Important: Remove padding if needed */}
   <ManageGatekeepersPage/>    {/* Use correct component name */}
  </CardContent>
</Card>
          {/* Contact Records */}
          <Card className="sm:col-span-2 lg:col-span-3 relative overflow-hidden group hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-none">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent group-hover:from-indigo-500/20 transition-all duration-300"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg font-semibold text-indigo-600 dark:text-indigo-300">
                <span className="text-2xl animate-pulse">📇</span> Contact Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ContactInfo />
            </CardContent>
          </Card>

          {/* Commented Sections - Ready to uncomment when needed */}
          {/* 
          <Card className="sm:col-span-2 relative overflow-hidden ...">
            <CardContent>
              <MissionsPage />
            </CardContent>
          </Card>

          <Card className="sm:col-span-2 relative overflow-hidden ...">
            <CardContent>
              <DonateUsers />
            </CardContent>
          </Card>
          */}
        </div>
      </main>
    </div>
  );
}