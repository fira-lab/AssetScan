"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
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
  DialogTrigger,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { useToast } from "@chakra-ui/react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

// --- Define User Interfaces ---
interface User {
  _id: string;
  name: string;
  email: string;
  serial: string; // Added Serial Number
  phone: string;
  location: string;
  message: string;
  subscribe: boolean;
}

interface UserFormData {
  name: string;
  email: string;
  serial: string; // Added Serial Number
  phone: string;
  location: string;
  message: string;
  subscribe: "Active" | "Inactive" | "Pending" | "admin" | "gateKeeper" | "owner" | "";
}

interface EditUserFormData extends UserFormData {
  _id: string;
}
// ---------------------------

export default function ContactInfo() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  // --- QR Code States ---
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [selectedItemName, setSelectedItemName] = useState<string>("");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<EditUserFormData | null>(null);
  const [newUser, setNewUser] = useState<UserFormData>({
    name: "",
    email: "",
    serial: "", // Added Initial State
    phone: "",
    location: "",
    message: "",
    subscribe: "",
  });
  const toast = useToast();
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/contact/contact");
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }
      const data: User[] = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Fetch users error:", error);
      toast({
        title: "Failed to fetch users!",
        description: error instanceof Error ? error.message : String(error),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const addUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.message) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields (Name, Email, Message).",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const userData = {
      name: newUser.name,
      email: newUser.email,
      serial: newUser.serial, // Added serial payload
      phone: newUser.phone,
      location: newUser.location,
      message: newUser.message,
      subscribe: newUser.subscribe === "Active",
    };

    try {
      const response = await fetch("/api/contact/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error("Failed to add user");

      await fetchUsers();
      setNewUser({ name: "", email: "", serial: "", phone: "", location: "", message: "", subscribe: "" });
      setIsAddOpen(false);
      toast({ title: "User added successfully", status: "success", duration: 5000 });
    } catch (error) {
      toast({ title: "Failed to add user", status: "error", duration: 5000 });
    }
  };

  const updateUser = async () => {
    if (!editUser) return;
    if (!editUser.name || !editUser.email || !editUser.message) {
      toast({ title: "Missing Fields", status: "warning", duration: 5000 });
      return;
    }

    const userData = {
      name: editUser.name,
      email: editUser.email,
      serial: editUser.serial, // Added serial payload
      phone: editUser.phone,
      location: editUser.location,
      message: editUser.message,
      subscribe: editUser.subscribe === "Active",
    };

    try {
      const response = await fetch(`/api/contact/contact?id=${editUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error("Failed to update user");

      await fetchUsers();
      setEditUser(null);
      setIsEditOpen(false);
      toast({ title: "User updated successfully!", status: "success", duration: 5000 });
    } catch (error) {
      toast({ title: "Failed to update user!", status: "error", duration: 5000 });
    }
  };

  const deleteUser = async () => {
    if (!deleteUserId) return;
    try {
      const response = await fetch(`/api/contact/contact?id=${deleteUserId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete user");

      await fetchUsers();
      setDeleteUserId(null);
      setIsDeleteOpen(false);
      toast({ title: "User deleted successfully!", status: "success", duration: 5000 });
    } catch (error) {
      toast({ title: "Failed to delete user!", status: "error", duration: 5000 });
    }
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = users.filter((user) => user.name && user.name.toLowerCase().includes(term));
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  // --- QR Code Functions ---
  const generateQR = (user: User) => {
    // Encoded the Serial Number inside the QR
    const dataToEncode = JSON.stringify({
      _id: user._id,
      name: user.name,
      email: user.email,
      serial: user.serial,
      phone: user.phone,
      department: user.location,
    });
    setQrCodeData(dataToEncode);
    setSelectedItemName(user.name);
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
    toast({ title: "Downloaded!", status: "success", duration: 3000 });
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
          files: [file],
        });
        toast({ title: "Shared successfully!", status: "success", duration: 3000 });
      } else {
        toast({ title: "Sharing not supported natively. Please use download.", status: "warning", duration: 5000 });
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        toast({ title: "Error sharing QR Code", status: "error", duration: 3000 });
      }
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const prepareEditFormData = (user: User): EditUserFormData => {
    return {
      _id: user._id,
      name: user.name || "",
      email: user.email || "",
      serial: user.serial || "", // Extracting serial for Edit Modal
      phone: user.phone || "",
      location: user.location || "",
      message: user.message || "",
      subscribe: user.subscribe ? "Active" : "Inactive",
    };
  };

  return (
    <Card className="sm:col-span-2 lg:col-span-3 relative overflow-hidden group hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-none cursor-pointer touch-auto">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent group-hover:from-indigo-500/20 transition-all duration-300"></div>
      <div className="relative z-10">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg font-semibold text-indigo-600 dark:text-indigo-300"></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-900 dark:shadow-card bg-gradient-to-r from-indigo-500/10 to-transparent group-hover:from-indigo-500/20 transition-all duration-300">
            <style jsx>{`
              .scroll-wrapper {
                overflow-x: auto !important;
                -webkit-overflow-scrolling: touch;
                width: 100%;
              }
              .scroll-wrapper table {
                min-width: 1100px;
                width: 100%;
                table-layout: auto;
              }
              .scroll-wrapper th.col-name, .scroll-wrapper td.col-name { width: 150px; text-align: left; }
              .scroll-wrapper th.col-email, .scroll-wrapper td.col-email { width: 180px; }
              .scroll-wrapper th.col-serial, .scroll-wrapper td.col-serial { width: 120px; } /* New Serial Column CSS */
              .scroll-wrapper th.col-phone, .scroll-wrapper td.col-phone { width: 120px; }
              .scroll-wrapper th.col-location, .scroll-wrapper td.col-location { width: 150px; }
              .scroll-wrapper th.col-message, .scroll-wrapper td.col-message { width: 200px; }
              .scroll-wrapper th.col-subscribe, .scroll-wrapper td.col-subscribe { width: 100px; }
              .scroll-wrapper th.col-actions, .scroll-wrapper td.col-actions { width: 220px; }
              .scrollable-cell { max-width: 200px; overflow-x: auto; white-space: nowrap; padding: 8px; display: block; }
            `}</style>
            
            <div className="mb-5.5 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-body-2xlg font-bold text-gray-900 dark:text-white">
                Owners' Info
              </h2>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setIsAddOpen(true)} className="h-10 w-full bg-blue-600 text-white hover:bg-blue-700 sm:w-auto">
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white dark:bg-gray-800">
                    <DialogHeader>
                      <DialogTitle className="text-gray-900 dark:text-white">Add New User</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={(e) => { e.preventDefault(); addUser(); }} className="space-y-4 p-4">
                      <Input placeholder="Name *" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} className="h-10 text-gray-900 dark:text-white dark:bg-gray-900" required />
                      <Input placeholder="AMU_ID *" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="h-10 text-gray-900 dark:text-white dark:bg-gray-900" required />
                      {/* Added Serial Number Input */}
                      <Input placeholder="Serial Number" value={newUser.serial} onChange={(e) => setNewUser({ ...newUser, serial: e.target.value })} className="h-10 text-gray-900 dark:text-white dark:bg-gray-900" />
                      <Input placeholder="Phone" value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} className="h-10 text-gray-900 dark:text-white dark:bg-gray-900" />
                      <Input placeholder="Department" value={newUser.location} onChange={(e) => setNewUser({ ...newUser, location: e.target.value })} className="h-10 text-gray-900 dark:text-white dark:bg-gray-900" />
                      <Input placeholder="Asset Info *" value={newUser.message} onChange={(e) => setNewUser({ ...newUser, message: e.target.value })} className="h-10 text-gray-900 dark:text-white dark:bg-gray-900" required />
                      <Select value={newUser.subscribe} onValueChange={(value: any) => setNewUser({ ...newUser, subscribe: value })}>
                        <SelectTrigger className="h-10 text-gray-900 dark:text-white dark:bg-gray-900">
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="gateKeeper">GateKeeper</SelectItem>
                          <SelectItem value="owner">Owner</SelectItem> 
                        </SelectContent>
                      </Select>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="text-gray-900 dark:text-white">Cancel</Button>
                        <Button type="submit" className="h-10 bg-blue-600 text-white hover:bg-blue-700">Add</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
                <Input placeholder="Search by name..." value={searchTerm} onChange={handleSearch} className="h-10 w-full sm:max-w-xs text-gray-900 dark:text-white dark:bg-gray-800" />
              </div>
            </div>

            <div className="scroll-wrapper">
              <Table>
                <TableHeader>
                  <TableRow className="border-none bg-gray-100 dark:bg-gray-800 [&>th]:px-4 [&>th]:py-3 [&>th]:text-center [&>th]:font-medium [&>th]:uppercase text-gray-900 dark:text-gray-200">
                    <TableHead className="col-name !text-left">Name</TableHead>
                    <TableHead className="col-email">AMU_ID</TableHead>
                    {/* Added Serial Column Header */}
                    <TableHead className="col-serial">Serial No.</TableHead> 
                    <TableHead className="col-phone">Phone</TableHead>
                    <TableHead className="col-location hidden sm:table-cell">Department</TableHead>
                    <TableHead className="col-message hidden sm:table-cell">Asset Info</TableHead>
                    <TableHead className="col-subscribe">Subscribe</TableHead>
                    <TableHead className="col-actions">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user) => (
                      <TableRow key={user._id} className="text-center text-base font-medium text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 [&>td]:px-4 [&>td]:py-3 border-t dark:border-gray-700">
                        <TableCell className="col-name text-left">{user.name}</TableCell>
                        <TableCell className="col-email break-words">{user.email}</TableCell>
                        {/* Added Serial Table Cell Output */}
                        <TableCell className="col-serial">{user.serial || "-"}</TableCell>
                        <TableCell className="col-phone">{user.phone}</TableCell>
                        <TableCell className="col-location hidden sm:table-cell">{user.location}</TableCell>
                        <TableCell className="col-message hidden sm:table-cell"><div className="scrollable-cell">{user.message}</div></TableCell>
                        <TableCell className="col-subscribe">{user.subscribe ? "Active" : "Inactive"}</TableCell>
                        <TableCell className="col-actions">
                          <div className="flex items-center justify-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => generateQR(user)} className="h-8 bg-green-600 hover:bg-green-700 text-white border-none">
                              Generate QR
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => { setEditUser(prepareEditFormData(user)); setIsEditOpen(true); }} className="h-8 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30">
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => { setDeleteUserId(user._id); setIsDeleteOpen(true); }} className="h-8 bg-red-600 text-white hover:bg-red-700">
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      {/* Changed colSpan from 7 to 8 to fit the new Serial column smoothly */}
                      <TableCell colSpan={8} className="py-10 text-center text-gray-500 dark:text-gray-400">
                        {users.length > 0 ? "No users match your search." : "No users found."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <Pagination className="mt-6 flex justify-center text-gray-900 dark:text-white">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} className={currentPage === 1 ? "pointer-events-none opacity-50" : ""} />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(index + 1); }} isActive={currentPage === index + 1}>
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }} className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}

            {/* EDIT MODAL */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogContent className="bg-white dark:bg-gray-800">
                <DialogHeader><DialogTitle className="text-gray-900 dark:text-white">Edit User</DialogTitle></DialogHeader>
                {editUser && (
                  <form onSubmit={(e) => { e.preventDefault(); updateUser(); }} className="space-y-4 p-4">
                    <Input placeholder="Name *" value={editUser.name} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} className="h-10 text-gray-900 dark:text-white dark:bg-gray-900" required />
                    <Input placeholder="Email *" value={editUser.email} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} className="h-10 text-gray-900 dark:text-white dark:bg-gray-900" required />
                    {/* Edit Form Serial Input */}
                    <Input placeholder="Serial Number" value={editUser.serial} onChange={(e) => setEditUser({ ...editUser, serial: e.target.value })} className="h-10 text-gray-900 dark:text-white dark:bg-gray-900" />
                    <Input placeholder="Phone" value={editUser.phone} onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })} className="h-10 text-gray-900 dark:text-white dark:bg-gray-900" />
                    <Input placeholder="Department" value={editUser.location} onChange={(e) => setEditUser({ ...editUser, location: e.target.value })} className="h-10 text-gray-900 dark:text-white dark:bg-gray-900" />
                    <Input placeholder="Asset Info *" value={editUser.message} onChange={(e) => setEditUser({ ...editUser, message: e.target.value })} className="h-10 text-gray-900 dark:text-white dark:bg-gray-900" required />
                    <Select value={editUser.subscribe} onValueChange={(value: any) => setEditUser({ ...editUser, subscribe: value })}>
                      <SelectTrigger className="h-10 text-gray-900 dark:text-white dark:bg-gray-900"><SelectValue placeholder="Select Role" /></SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} className="text-gray-900 dark:text-white">Cancel</Button>
                      <Button type="submit" className="h-10 bg-blue-600 text-white hover:bg-blue-700">Save Changes</Button>
                    </DialogFooter>
                  </form>
                )}
              </DialogContent>
            </Dialog>

            {/* DELETE MODAL */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
              <DialogContent className="bg-white dark:bg-gray-800">
                <DialogHeader><DialogTitle className="text-gray-900 dark:text-white">Confirm Deletion</DialogTitle></DialogHeader>
                <p className="py-4 text-gray-700 dark:text-gray-300">Are you sure you want to delete this user? This action cannot be undone.</p>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)} className="h-10 text-gray-900 dark:text-white">Cancel</Button>
                  <Button type="button" variant="destructive" onClick={deleteUser} className="h-10 bg-red-600 text-white hover:bg-red-700">Delete</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* QR CODE MODAL */}
            <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
              <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 border-none shadow-2xl">
                <div className="flex flex-col items-center">
                  <DialogHeader><DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">QR Code</DialogTitle></DialogHeader>
                  <p className="text-center mb-6 text-gray-600 dark:text-gray-300">Generated for <strong className="text-gray-900 dark:text-white">{selectedItemName}</strong></p>
                  
                  {qrCodeData && (
                    <div className="p-4 bg-white border-4 border-gray-200 dark:border-gray-700 rounded-xl mb-6 shadow-inner">
                      {/* The canvas handles generating the actual QR image */}
                      <QRCodeCanvas id="qr-code-canvas" value={qrCodeData} size={220} level="H" includeMargin={true} />
                    </div>
                  )}

                  <DialogFooter className="w-full flex flex-col sm:flex-row gap-3">
                    <Button onClick={downloadQRCode} className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">Download</Button>
                    <Button onClick={shareQRCode} className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto">Share</Button>
                    <Button variant="outline" onClick={() => setIsQrOpen(false)} className="w-full sm:w-auto text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">Close</Button>
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