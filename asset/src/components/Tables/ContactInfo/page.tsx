"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import { QRCodeCanvas } from "qrcode.react";
import { formatDistanceToNow, parseISO } from "date-fns";
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
import { useToast } from "@chakra-ui/react";
import { Card, CardContent } from "../../ui/card";
import { uploadImage } from "@/app/actions/Image";

// ────────────────────────────────────────────────
// Interfaces
// ────────────────────────────────────────────────
interface ContactUser {
  _id: string;
  name: string;
  email: string;
  serial?: string;
  phone?: string;
  location?: string;
  message: string;
  imageUrl?: string;
}

interface HistoryEntry {
  timestamp: string;
  action: string;
  status: string;
  performedBy: string;
  notes?: string;
}

interface UserStatus {
  _id: string;
  email: string;           // ← Fixed: changed from 'any'
  status: string;
  history: HistoryEntry[];
}

interface ExtendedUser extends ContactUser {
  statusData?: UserStatus;
}

interface FormData {
  name: string;
  email: string;
  serial: string;
  phone: string;
  location: string;
  message: string;
}

interface EditFormData extends FormData {
  _id: string;
  imageUrl?: string;
}

export default function ContactInfo() {
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ExtendedUser[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [selectedNameForQr, setSelectedNameForQr] = useState("");
  const [selectedUserForHistory, setSelectedUserForHistory] = useState<ExtendedUser | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditFormData | null>(null);
  const [newForm, setNewForm] = useState<FormData>({
    name: "",
    email: "",
    serial: "",
    phone: "",
    location: "",
    message: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const toast = useToast();
  const pageSize = 10;

  // ────────────────────────────────────────────────
  // Load & merge data
  // ────────────────────────────────────────────────
  const fetchAndMerge = async () => {
    try {
      const [profileRes, statusRes] = await Promise.all([
        fetch("/api/contact/contact"),
        fetch("/api/users/users"),
      ]);

      if (!profileRes.ok) throw new Error("Failed to fetch profiles");
      if (!statusRes.ok) throw new Error("Failed to fetch status");

      const profiles: ContactUser[] = await profileRes.json();
      const statusDocs: UserStatus[] = await statusRes.json();

      const statusByEmail = new Map<string, UserStatus>();
      statusDocs.forEach((doc) => {
        const key = doc.email?.toLowerCase()?.trim();
        if (key) statusByEmail.set(key, doc);
      });

      const merged = profiles.map((p) => ({
        ...p,
        statusData: statusByEmail.get(p.email?.toLowerCase()?.trim() || ""),
      }));

      setUsers(merged);
      setFilteredUsers(merged);
    } catch (err) {
      console.error("Fetch error:", err);
      toast({ title: "Data load failed", status: "error" });
    }
  };

  useEffect(() => {
    fetchAndMerge();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = () => fetchAndMerge();

  // ────────────────────────────────────────────────
  // Status helpers
  // ────────────────────────────────────────────────
  const getDisplayedStatus = (user: ExtendedUser) => user.statusData?.status || "Unknown";

  const getLastMovementText = (user: ExtendedUser) => {
    const hist = user.statusData?.history;
    if (!hist?.length) return "No record";

    const latest = hist[hist.length - 1];
    const when = formatDistanceToNow(parseISO(latest.timestamp), { addSuffix: true });

    const act = latest.action.toLowerCase();
    if (act.includes("enter")) return `Entered ${when}`;
    if (act.includes("exit")) return `Exited ${when}`;
    return `${latest.action} ${when}`;
  };

  // ────────────────────────────────────────────────
  // CRUD Operations
  // ────────────────────────────────────────────────
  const handleAdd = async () => {
    if (!newForm.name || !newForm.email || !newForm.message) {
      toast({ title: "Required fields missing", status: "warning" });
      return;
    }

    setUploading(true);
    try {
      let imgUrl = "";
      if (imageFile) {
        const fd = new FormData();
        fd.append("image", imageFile);
        const up = await uploadImage(fd);
        if (up.success && up.url) imgUrl = up.url;
      }

      const res = await fetch("/api/contact/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newForm, imageUrl: imgUrl }),
      });

      if (!res.ok) throw new Error("Add failed");

      await refresh();
      setIsAddOpen(false);
      setNewForm({ name: "", email: "", serial: "", phone: "", location: "", message: "" });
      setImageFile(null);
      toast({ title: "Added successfully", status: "success" });
    } catch (err) {
      console.error(err);
      toast({ title: "Add failed", status: "error" });
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editForm) return;

    setUploading(true);
    try {
      let imgUrl = editForm.imageUrl;
      if (imageFile) {
        const fd = new FormData();
        fd.append("image", imageFile);
        const up = await uploadImage(fd);
        if (up.success && up.url) imgUrl = up.url;
      }

      const res = await fetch("/api/contact/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editForm, id: editForm._id, imageUrl: imgUrl }),
      });

      if (!res.ok) throw new Error("Update failed");

      await refresh();
      setIsEditOpen(false);
      setImageFile(null);
      toast({ title: "Updated successfully", status: "success" });
    } catch (err) {
      console.error(err);
      toast({ title: "Update failed", status: "error" });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/contact/contact?id=${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");

      await refresh();
      setIsDeleteOpen(false);
      toast({ title: "Deleted successfully", status: "success" });
    } catch (err) {
      console.error(err);
      toast({ title: "Delete failed", status: "error" });
    }
  };

  // ────────────────────────────────────────────────
  // Other Helpers
  // ────────────────────────────────────────────────
  const prepareEdit = (u: ExtendedUser): EditFormData => ({
    _id: u._id,
    name: u.name,
    email: u.email,
    serial: u.serial || "",
    phone: u.phone || "",
    location: u.location || "",
    message: u.message,
    imageUrl: u.imageUrl,
  });

  const generateQr = (u: ExtendedUser) => {
    setQrCodeData(JSON.stringify({ id: u._id, serial: u.serial || "" }));
    setSelectedNameForQr(u.name);
    setIsQrOpen(true);
  };

  const downloadQr = () => {
    const canvas = document.getElementById("qr-canvas") as HTMLCanvasElement | null;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `${selectedNameForQr.replace(/\s+/g, "_")}_qr.png`;
    a.click();
  };

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase();
    setSearchTerm(val);
    setFilteredUsers(
      users.filter((u) =>
        u.name.toLowerCase().includes(val) ||
        u.email.toLowerCase().includes(val) ||
        u.message.toLowerCase().includes(val)
      )
    );
    setCurrentPage(1);
  };

  const pageCount = Math.ceil(filteredUsers.length / pageSize);
  const currentPageUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-none shadow-xl">
      <CardContent className="pt-6">
        {/* ... rest of your JSX remains exactly the same ... */}
        {/* (I didn't repeat the entire JSX for brevity — only logic was changed) */}
      </CardContent>
    </Card>
  );
}