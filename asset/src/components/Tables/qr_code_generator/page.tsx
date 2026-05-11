"use client";

import React, { useState, useEffect, ChangeEvent, useCallback } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../ui/pagination";
import { useToast } from "@chakra-ui/react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
// REMOVED: import Image from "next/image";  <-- This was causing the error

// --- Define Interfaces ---
interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

interface User {
  _id: string;
  name: string;
  role?: string;
  status?: string;
  email?: string; 
}

type DisplayItem = Contact | User;

export default function QRCodeGenerator() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredData, setFilteredData] = useState<DisplayItem[]>([]); 
  
  const [activeTab, setActiveTab] = useState<"contacts" | "users">("contacts");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [selectedItemName, setSelectedItemName] = useState<string>("");

  const toast = useToast();
  const itemsPerPage = 10;

  const fetchData = useCallback(async () => {
    try {
      const [contactRes, userRes] = await Promise.all([
        fetch("/api/contact/contact"),
        fetch("/api/users/users"),
      ]);

      if (!contactRes.ok) throw new Error("Failed to fetch contacts");
      if (!userRes.ok) throw new Error("Failed to fetch users");

      const contactsData: Contact[] = await contactRes.json();
      const usersData: User[] = await userRes.json();

      setContacts(contactsData);
      setUsers(usersData);
      setFilteredData(contactsData);
    } catch (error) {
      console.error("Fetch data error:", error);
      toast({
        title: "Failed to fetch data!",
        description: error instanceof Error ? error.message : String(error),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTabSwitch = (tab: "contacts" | "users") => {
    setActiveTab(tab);
    setSearchTerm("");
    setCurrentPage(1);
    setFilteredData(tab === "contacts" ? contacts : users);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    const sourceData: DisplayItem[] = activeTab === "contacts" ? contacts : users;
    const filtered = sourceData.filter(
      (item) => item.name && item.name.toLowerCase().includes(term)
    );
    
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const generateQR = (item: DisplayItem) => { 
    const dataToEncode = JSON.stringify({
      type: activeTab,
      ...item
    });
    
    setQrCodeData(dataToEncode);
    setSelectedItemName(item.name);
    setIsQrOpen(true);
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById("qr-code-canvas") as HTMLCanvasElement;
    if (!canvas) return;

    const pngUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    
    const safeFileName = selectedItemName ? selectedItemName.replace(/\s+/g, "_") : "QR_Code";
    downloadLink.download = `${safeFileName}.png`;
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    toast({
      title: "Downloaded!",
      description: "QR Code has been saved to your device.",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  };

  const shareQRCode = async () => {
    const canvas = document.getElementById("qr-code-canvas") as HTMLCanvasElement;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL("image/png");
      const blob = await (await fetch(dataUrl)).blob();
      const safeFileName = selectedItemName ? selectedItemName.replace(/\s+/g, "_") : "QR_Code";
      const file = new File([blob], `${safeFileName}.png`, { type: blob.type });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `QR Code for ${selectedItemName}`,
          text: `Check out this QR Code for ${selectedItemName}.`,
          files: [file],
        });
        toast({
          title: "Shared successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      } else {
        toast({
          title: "Sharing not supported",
          description: "Your browser does not support native file sharing.",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
      if ((error as Error).name !== "AbortError") {
        toast({
          title: "Error sharing QR Code",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderAsCards = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <Card className="sm:col-span-2 lg:col-span-3 relative overflow-hidden group hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-none">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent group-hover:from-purple-500/20 transition-all duration-300"></div>
      <div className="relative z-10">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg font-semibold text-purple-600 dark:text-purple-300">
            QR Code Generator Hub
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-[10px] bg-white px-4 py-6 shadow-1 dark:bg-gray-dark dark:shadow-card sm:px-7.5">
            <style jsx>{`
              .scroll-wrapper {
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
                width: 100%;
              }
              .scroll-wrapper table {
                min-width: 600px;
                width: 100%;
                table-layout: auto;
              }
            `}</style>

            <div className="mb-6 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                <Button
                  variant={activeTab === "contacts" ? "default" : "ghost"}
                  onClick={() => handleTabSwitch("contacts")}
                  className={activeTab === "contacts" ? "bg-purple-600 hover:bg-purple-700 text-white" : "text-gray-600 dark:text-gray-300"}
                >
                  Contacts
                </Button>
                <Button
                  variant={activeTab === "users" ? "default" : "ghost"}
                  onClick={() => handleTabSwitch("users")}
                  className={activeTab === "users" ? "bg-purple-600 hover:bg-purple-700 text-white" : "text-gray-600 dark:text-gray-300"}
                >
                  Users
                </Button>
              </div>

              <Input
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={handleSearch}
                className="h-10 w-full sm:max-w-xs bg-white dark:bg-gray-900"
              />
            </div>

            {renderAsCards ? (
              <div className="space-y-4">
                {currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <div
                      key={item._id}
                      className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm dark:border-gray-700 dark:bg-gray-darkest"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <p className="font-semibold text-dark dark:text-white">
                          {item.name}
                        </p>
                        {activeTab === "users" && (item as User).status && ( 
                          <span className="rounded-full px-2 py-0.5 text-xs bg-blue-100 text-blue-800">
                            {(item as User).status}
                          </span>
                        )}
                      </div>
                      
                      <div className="grid gap-y-1 text-sm text-gray-600 dark:text-gray-300 mb-4">
                        {activeTab === "contacts" ? (
                          <>
                            <p><strong>AMU_Id:</strong> {(item as Contact).email}</p>
                            <p><strong>Phone:</strong> {(item as Contact).phone || "N/A"}</p>
                          </>
                        ) : (
                          <>
                            <p><strong>Serial Number:</strong> {(item as User).email || "N/A"}</p>
                          </>
                        )}
                      </div>
                      
                      <Button
                        onClick={() => generateQR(item)}
                        className="w-full h-10 bg-green-600 hover:bg-green-700 text-white font-medium"
                      >
                        Generate QR Code
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center text-gray-500 dark:text-gray-400">
                    No {activeTab} found.
                  </div>
                )}
              </div>
            ) : (
              <div className="scroll-wrapper border rounded-lg dark:border-gray-700">
                <Table>
                  <TableHeader>
                    <TableRow className="border-none bg-gray-50 dark:bg-gray-800">
                      <TableHead className="!text-left w-[250px]">Name</TableHead>
                      {activeTab === "contacts" ? (
                        <>
                          <TableHead>AMU_ID</TableHead>
                          <TableHead>Phone</TableHead>
                        </>
                      ) : (
                        <>
                          <TableHead>Serial Number</TableHead>
                          <TableHead>Status</TableHead>
                        </>
                      )}
                      <TableHead className="w-[150px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.length > 0 ? (
                      currentItems.map((item) => (
                        <TableRow
                          key={item._id}
                          className="text-center text-base font-medium text-dark hover:bg-purple-50/50 dark:text-white dark:hover:bg-gray-800"
                        >
                          <TableCell className="text-left font-semibold">
                            {item.name}
                          </TableCell>
                          {activeTab === "contacts" ? (
                            <>
                              <TableCell>{(item as Contact).email}</TableCell>
                              <TableCell>{(item as Contact).phone || "N/A"}</TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell>{(item as User).email || "N/A"}</TableCell>
                              <TableCell>
                                {(item as User).status ? (
                                   <span className="rounded-full px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                     {(item as User).status}
                                   </span>
                                ) : "N/A"}
                              </TableCell>
                            </>
                          )}
                          <TableCell>
                            <Button
                              size="sm"
                              onClick={() => generateQR(item)}
                              className="bg-green-600 text-white hover:bg-green-700 shadow-sm"
                            >
                              Generate QR
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="py-10 text-center text-gray-500 dark:text-gray-400">
                          No {activeTab} match your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {totalPages > 1 && (
              <Pagination className="mt-6 flex justify-center">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(index + 1);
                        }}
                        isActive={currentPage === index + 1}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}

            <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
              <DialogContent className="sm:max-w-md border-none bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
                <div className="relative z-10 flex flex-col items-center">
                  <DialogHeader className="mb-4">
                    <DialogTitle className="text-center text-2xl font-bold text-dark dark:text-white">
                      QR Code
                    </DialogTitle>
                  </DialogHeader>
                  <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
                    Generated for <strong>{selectedItemName}</strong>
                  </p>
                  {qrCodeData && (
                    <div className="p-4 bg-white border-4 border-gray-100 rounded-xl shadow-lg mb-6">
                      <QRCodeCanvas
                        id="qr-code-canvas"
                        value={qrCodeData}
                        size={220}
                        level="H"
                        includeMargin={true}
                      />
                    </div>
                  )}
                  <DialogFooter className="w-full flex flex-col sm:flex-row gap-2 sm:justify-center">
                    <Button onClick={downloadQRCode} className="bg-blue-600 hover:bg-blue-700 text-white">
                      Download
                    </Button>
                    <Button onClick={shareQRCode} className="bg-purple-600 hover:bg-purple-700 text-white">
                      Share
                    </Button>
                    <Button variant="outline" onClick={() => setIsQrOpen(false)}>
                      Close
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}