"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
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
  phone: string;
  location: string;
  message: string;
  subscribe: boolean;
}

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  location: string;
  message: string;
  subscribe: "Active" | "Inactive" | "Pending" | "";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<EditUserFormData | null>(null);
  const [newUser, setNewUser] = useState<UserFormData>({
    name: "",
    email: "",
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
        description:
          "Please fill in all required fields (Name, Email, Message).",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const userData = {
      name: newUser.name,
      email: newUser.email,
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

      if (!response.ok) {
        let errorData = {
          error: `Request failed with status ${response.status}`,
        };
        try {
          errorData = await response.json();
        } catch {
          /* Ignore */
        }
        throw new Error(errorData.error || "Failed to add user");
      }

      await fetchUsers();
      setNewUser({
        name: "",
        email: "",
        phone: "",
        location: "",
        message: "",
        subscribe: "",
      });
      setIsAddOpen(false);
      toast({
        title: "User added successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Add user error:", error);
      toast({
        title: "Failed to add user",
        description: error instanceof Error ? error.message : String(error),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const updateUser = async () => {
    if (!editUser) {
      toast({
        title: "Error",
        description: "No user selected for editing.",
        status: "error",
      });
      return;
    }

    if (!editUser.name || !editUser.email || !editUser.message) {
      toast({
        title: "Missing Fields",
        description:
          "Please fill in all required fields (Name, Email, Message).",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const userData = {
      name: editUser.name,
      email: editUser.email,
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

      if (!response.ok) {
        let errorData = {
          error: `Request failed with status ${response.status}`,
        };
        try {
          errorData = await response.json();
        } catch {
          /* Ignore */
        }
        throw new Error(errorData.error || "Failed to update user");
      }

      await fetchUsers();
      setEditUser(null);
      setIsEditOpen(false);
      toast({
        title: "User updated successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Update user error:", error);
      toast({
        title: "Failed to update user!",
        description: error instanceof Error ? error.message : String(error),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const deleteUser = async () => {
    if (!deleteUserId) {
      toast({
        title: "Error",
        description: "No user selected for deletion.",
        status: "error",
      });
      return;
    }
    try {
      const response = await fetch(`/api/contact/contact?id=${deleteUserId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        let errorData = {
          error: `Request failed with status ${response.status}`,
        };
        try {
          errorData = await response.json();
        } catch {
          /* Ignore */
        }
        throw new Error(errorData.error || "Failed to delete user");
      }

      await fetchUsers();
      setDeleteUserId(null);
      setIsDeleteOpen(false);
      toast({
        title: "User deleted successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Delete user error:", error);
      toast({
        title: "Failed to delete user!",
        description: error instanceof Error ? error.message : String(error),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = users.filter(
      (user) =>
        user.name &&
        typeof user.name === "string" &&
        user.name.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const prepareEditFormData = (user: User): EditUserFormData => {
    return {
      _id: user._id,
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      location: user.location || "",
      message: user.message || "",
      subscribe: user.subscribe ? "Active" : "Inactive",
    };
  };

  // Handle card interaction
  const handleCardInteraction = (context: string) => {
    console.log(`Interacted with ${context} Card`);
    // Add your interaction logic here (e.g., navigate, open modal, etc.)
  };

  return (
    <Card
      className="sm:col-span-2 lg:col-span-3 relative overflow-hidden group hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-none cursor-pointer touch-auto"
      onClick={() => handleCardInteraction("Contact Records")}
      onTouchStart={() => handleCardInteraction("Contact Records")}
      onKeyDown={(e) =>
        e.key === "Enter" && handleCardInteraction("Contact Records")
      }
      role="button"
      tabIndex={0}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent group-hover:from-indigo-500/20 transition-all duration-300"></div>
      <div className="relative z-10">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg font-semibold text-indigo-600 dark:text-indigo-300"></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card bg-gradient-to-r from-indigo-500/10 to-transparent group-hover:from-indigo-500/20 transition-all duration-300">
            <style jsx>{`
              .scroll-wrapper {
                overflow-x: auto !important;
                -webkit-overflow-scrolling: touch;
                width: 100%;
              }
              .scroll-wrapper table {
                min-width: 900px;
                width: 100%;
                table-layout: auto;
              }
              .scroll-wrapper th.col-name,
              .scroll-wrapper td.col-name {
                width: 150px;
                text-align: left;
              }
              .scroll-wrapper th.col-email,
              .scroll-wrapper td.col-email {
                width: 200px;
              }
              .scroll-wrapper th.col-phone,
              .scroll-wrapper td.col-phone {
                width: 120px;
              }
              .scroll-wrapper th.col-location,
              .scroll-wrapper td.col-location {
                width: 150px;
              }
              .scroll-wrapper th.col-message,
              .scroll-wrapper td.col-message {
                width: 250px;
              }
              .scroll-wrapper th.col-subscribe,
              .scroll-wrapper td.col-subscribe {
                width: 100px;
              }
              .scroll-wrapper th.col-actions,
              .scroll-wrapper td.col-actions {
                width: 130px;
              }
              .scrollable-cell {
                max-width: 250px;
                overflow-x: auto;
                white-space: nowrap;
                -webkit-overflow-scrolling: touch;
                padding: 8px;
                display: block;
              }
              .touch-auto {
                touch-action: auto !important;
              }
              .cursor-pointer {
                cursor: pointer;
              }
            `}</style>
            <div className="mb-5.5 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-body-2xlg font-bold text-dark dark:text-white dark:bg-gray-650">
                Contact Info
              </h2>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => setIsAddOpen(true)}
                      className="h-10 w-full bg-blue-600 text-white hover:bg-blue-700 sm:w-auto"
                    >
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <Card
                      className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-none cursor-pointer touch-auto"
                      onClick={() => handleCardInteraction("Add User Dialog")}
                      onTouchStart={() =>
                        handleCardInteraction("Add User Dialog")
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        handleCardInteraction("Add User Dialog")
                      }
                      role="button"
                      tabIndex={0}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent group-hover:from-indigo-500/20 transition-all duration-300"></div>
                      <div className="relative z-10">
                        <DialogHeader>
                          <DialogTitle className="text-dark dark:text-white">
                            Add New User
                          </DialogTitle>
                        </DialogHeader>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            addUser();
                          }}
                          className="space-y-4 p-4"
                        >
                          <Input
                            placeholder="Name *"
                            value={newUser.name}
                            onChange={(e) =>
                              setNewUser({ ...newUser, name: e.target.value })
                            }
                            className="h-10"
                            required
                          />
                          <Input
                            placeholder="Email *"
                            type="email"
                            value={newUser.email}
                            onChange={(e) =>
                              setNewUser({ ...newUser, email: e.target.value })
                            }
                            className="h-10"
                            required
                          />
                          <Input
                            placeholder="Phone"
                            value={newUser.phone}
                            onChange={(e) =>
                              setNewUser({ ...newUser, phone: e.target.value })
                            }
                            className="h-10"
                          />
                          <Input
                            placeholder="Location"
                            value={newUser.location}
                            onChange={(e) =>
                              setNewUser({
                                ...newUser,
                                location: e.target.value,
                              })
                            }
                            className="h-10"
                          />
                          <Input
                            placeholder="Message *"
                            value={newUser.message}
                            onChange={(e) =>
                              setNewUser({
                                ...newUser,
                                message: e.target.value,
                              })
                            }
                            className="h-10"
                            required
                          />
                          <Select
                            value={newUser.subscribe}
                            onValueChange={(
                              value: "Active" | "Inactive" | "Pending" | ""
                            ) => setNewUser({ ...newUser, subscribe: value })}
                          >
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Select subscribe status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                          <DialogFooter>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsAddOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              className="h-10 bg-blue-600 text-white hover:bg-blue-700"
                            >
                              Add
                            </Button>
                          </DialogFooter>
                        </form>
                      </div>
                    </Card>
                  </DialogContent>
                </Dialog>
                <Input
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="h-10 w-full sm:max-w-xs"
                />
              </div>
            </div>
            <div className="scroll-wrapper">
              <Table>
                <TableHeader>
                  <TableRow className="border-none bg-gray-150 dark:bg-gray-650 dark:hover:bg-gray-700 [&>th]:px-4 [&>th]:py-3 [&>th]:text-center [&>th]:font-medium [&>th]:uppercase [&>th]:text-dark [&>th]:dark:text-white">
                    <TableHead className="col-name !text-left">Name</TableHead>
                    <TableHead className="col-email">Email</TableHead>
                    <TableHead className="col-phone">Phone</TableHead>
                    <TableHead className="col-location hidden sm:table-cell">
                      Location
                    </TableHead>
                    <TableHead className="col-message hidden sm:table-cell">
                      Message
                    </TableHead>
                    <TableHead className="col-subscribe">Subscribe</TableHead>
                    <TableHead className="col-actions">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user) => (
                      <TableRow
                        key={user._id}
                        className="text-center text-base font-medium text-dark hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700 [&>td]:border-t [&>td]:border-gray-200 [&>td]:px-4 [&>td]:py-3 dark:[&>td]:border-gray-700"
                      >
                        <TableCell className="col-name text-left">
                          {user.name}
                        </TableCell>
                        <TableCell className="col-email break-words">
                          {user.email}
                        </TableCell>
                        <TableCell className="col-phone">
                          {user.phone}
                        </TableCell>
                        <TableCell className="col-location hidden sm:table-cell">
                          {user.location}
                        </TableCell>
                        <TableCell className="col-message hidden sm:table-cell">
                          <div className="scrollable-cell">{user.message}</div>
                        </TableCell>
                        <TableCell className="col-subscribe">
                          {user.subscribe ? "Active" : "Inactive"}
                        </TableCell>
                        <TableCell className="col-actions">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditUser(prepareEditFormData(user));
                                setIsEditOpen(true);
                              }}
                              className="h-8 border-blue-600 text-blue-600 hover:bg-blue-50"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setDeleteUserId(user._id);
                                setIsDeleteOpen(true);
                              }}
                              className="h-8 bg-red-600 text-white hover:bg-red-700"
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="py-10 text-center text-gray-500 dark:text-gray-400"
                      >
                        {users.length > 0
                          ? "No users match your search."
                          : "No users found."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <Pagination className="mt-6 flex justify-center dark:text-gray-50 text-gray-900">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage - 1);
                      }}
                      aria-disabled={currentPage === 1}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
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
                        aria-current={
                          currentPage === index + 1 ? "page" : undefined
                        }
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
                      aria-disabled={currentPage === totalPages}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogContent>
                <Card
                  className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-none cursor-pointer touch-auto"
                  onClick={() => handleCardInteraction("Edit User Dialog")}
                  onTouchStart={() => handleCardInteraction("Edit User Dialog")}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    handleCardInteraction("Edit User Dialog")
                  }
                  role="button"
                  tabIndex={0}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent group-hover:from-indigo-500/20 transition-all duration-300"></div>
                  <div className="relative z-10">
                    <DialogHeader>
                      <DialogTitle className="text-dark dark:text-white">
                        Edit User
                      </DialogTitle>
                    </DialogHeader>
                    {editUser && (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          updateUser();
                        }}
                        className="space-y-4 p-4"
                      >
                        <Input
                          placeholder="Name *"
                          value={editUser.name}
                          onChange={(e) =>
                            editUser &&
                            setEditUser({ ...editUser, name: e.target.value })
                          }
                          className="h-10"
                          required
                        />
                        <Input
                          placeholder="Email *"
                          type="email"
                          value={editUser.email}
                          onChange={(e) =>
                            editUser &&
                            setEditUser({ ...editUser, email: e.target.value })
                          }
                          className="h-10"
                          required
                        />
                        <Input
                          placeholder="Phone"
                          value={editUser.phone}
                          onChange={(e) =>
                            editUser &&
                            setEditUser({ ...editUser, phone: e.target.value })
                          }
                          className="h-10"
                        />
                        <Input
                          placeholder="Location"
                          value={editUser.location}
                          onChange={(e) =>
                            editUser &&
                            setEditUser({
                              ...editUser,
                              location: e.target.value,
                            })
                          }
                          className="h-10"
                        />
                        <Input
                          placeholder="Message *"
                          value={editUser.message}
                          onChange={(e) =>
                            editUser &&
                            setEditUser({
                              ...editUser,
                              message: e.target.value,
                            })
                          }
                          className="h-10"
                          required
                        />
                        <Select
                          value={editUser.subscribe}
                          onValueChange={(
                            value: "Active" | "Inactive" | "Pending" | ""
                          ) =>
                            editUser &&
                            setEditUser({ ...editUser, subscribe: value })
                          }
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select subscribe status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <DialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="h-10 bg-blue-600 text-white hover:bg-blue-700"
                          >
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </form>
                    )}
                  </div>
                </Card>
              </DialogContent>
            </Dialog>
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
              <DialogContent>
                <Card
                  className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-none cursor-pointer touch-auto"
                  onClick={() => handleCardInteraction("Delete User Dialog")}
                  onTouchStart={() =>
                    handleCardInteraction("Delete User Dialog")
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    handleCardInteraction("Delete User Dialog")
                  }
                  role="button"
                  tabIndex={0}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent group-hover:from-indigo-500/20 transition-all duration-300"></div>
                  <div className="relative z-10">
                    <DialogHeader>
                      <DialogTitle className="text-dark dark:text-white">
                        Confirm Deletion
                      </DialogTitle>
                    </DialogHeader>
                    <p className="py-4 text-dark dark:text-gray-300">
                      Are you sure you want to delete this user? This action
                      cannot be undone.
                    </p>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDeleteOpen(false)}
                        className="h-10"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={deleteUser}
                        className="h-10 bg-red-600 text-white hover:bg-red-700"
                      >
                        Delete
                      </Button>
                    </DialogFooter>
                  </div>
                </Card>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
