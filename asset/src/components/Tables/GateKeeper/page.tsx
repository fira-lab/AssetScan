'use client';

import React, { useEffect, useState, useCallback } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  UserPlus, 
  Search, 
  Trash2, 
  ShieldAlert, 
  ShieldCheck, 
  Loader2, 
  ChevronRight,
  Mail,
  Clock
} from "lucide-react";

interface Gatekeeper {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  role: string;
  createdAt: number | null;
  lastSignInAt: number | null;
  dbGateKeeperId: string | null;
  dbGateKeeperName: string | null;
  dbGateKeeperMessage: string | null;
}

const ManageGatekeepersPage: React.FC = () => {
  const { isLoaded, userId, getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const [gatekeepers, setGatekeepers] = useState<Gatekeeper[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Fetch gatekeepers - Wrapped in useCallback to fix dependency warning
  const fetchGatekeepers = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const token = await getToken();

      const res = await fetch("/api/admin/gatekeepers", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401 || res.status === 403) {
        setError("You don't have permission to access this page.");
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch gatekeepers");

      const data: Gatekeeper[] = await res.json();
      setGatekeepers(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong.";
      console.error(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId, getToken]);

  useEffect(() => {
    if (isLoaded) {
      if (!userId) {
        router.push("/sign-in");
      } else if (user?.publicMetadata?.role !== 'admin') {
        setError("You don't have permission to view this page.");
        setLoading(false);
      } else {
        fetchGatekeepers();
      }
    }
  }, [isLoaded, userId, user?.publicMetadata?.role, router, fetchGatekeepers]);

  // Register new gatekeeper
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.firstName || !formData.lastName) {
      setError("First name, last name and email are required.");
      return;
    }

    setFormSubmitting(true);
    setError(null);

    try {
      const token = await getToken();

      const res = await fetch("/api/admin/gatekeepers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to register gatekeeper");
      }

      setMessage("Gatekeeper registered successfully! Invitation sent.");
      setShowRegisterForm(false);
      setFormData({ firstName: "", lastName: "", email: "", message: "" });
      fetchGatekeepers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to register gatekeeper";
      setError(errorMessage);
    } finally {
      setFormSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ firstName: "", lastName: "", email: "", message: "" });
    setShowRegisterForm(false);
  };

  // Change Role
  const changeRole = async (
    targetUserId: string,
    newRole: string,
    successMsg: string,
    removeFromList = false
  ) => {
    setActionLoading(targetUserId);
    setError(null);
    setMessage(null);

    try {
      const token = await getToken();

      const res = await fetch(`/api/admin/gatekeepers`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: targetUserId, newRole }),
      });

      if (!res.ok) throw new Error("Failed to update role");

      setMessage(successMsg);

      if (removeFromList) {
        setGatekeepers((prev) => prev.filter((g) => g.id !== targetUserId));
      } else {
        setGatekeepers((prev) =>
          prev.map((g) => (g.id === targetUserId ? { ...g, role: newRole } : g))
        );
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Update failed";
      setError(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevoke = (targetUserId: string, name: string) => {
    if (!confirm(`Revoke gatekeeper role from ${name}?`)) return;
    changeRole(targetUserId, "user", `Gatekeeper role revoked from ${name}.`, true);
  };

  const handleDelete = async (targetUserId: string, name: string) => {
    if (!confirm(`Permanently delete ${name}? This cannot be undone.`)) return;

    setActionLoading(targetUserId);
    try {
      const token = await getToken();
      const res = await fetch(`/api/admin/gatekeepers?userId=${targetUserId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete user");

      setMessage(`${name} has been permanently deleted.`);
      setGatekeepers((prev) => prev.filter((g) => g.id !== targetUserId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Delete failed";
      setError(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (ts: number | null | undefined) => {
    if (!ts) return "Never";
    return new Date(ts).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filtered = gatekeepers.filter((g) => {
    const q = searchQuery.toLowerCase();
    return (
      g.email.toLowerCase().includes(q) ||
      `${g.firstName} ${g.lastName}`.toLowerCase().includes(q) ||
      (g.dbGateKeeperName || "").toLowerCase().includes(q)
    );
  });

  if (!isLoaded) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
      <p className="text-slate-500 animate-pulse">Initializing Dashboard...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 px-4 py-8 md:px-10">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div>
            <nav className="flex items-center gap-2 text-sm mb-3 text-slate-500">
              <button onClick={() => router.push("/admin")} className="hover:text-blue-600 transition-colors">Admin</button>
              <ChevronRight className="w-4 h-4" />
              <span className="font-medium text-slate-900 dark:text-slate-100">Gatekeepers</span>
            </nav>
            <h1 className="text-4xl font-extrabold tracking-tight">Manage Gatekeepers</h1>
            <p className="mt-2 text-slate-500">Add, monitor, and manage security personnel access levels.</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowRegisterForm(true)}
              className="group px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
            >
              <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Register New
            </button>

            <div className="hidden sm:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-3 text-center shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{gatekeepers.length}</div>
              <div className="text-[10px] uppercase font-bold tracking-tighter text-slate-400">Personnel</div>
            </div>
          </div>
        </div>

        {/* Modal, Messages, and Table logic follows... */}
        {showRegisterForm && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
             <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">New Registration</h2>
                  <ShieldCheck className="text-blue-600 w-8 h-8" />
                </div>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1 ml-1">First Name</label>
                      <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1 ml-1">Last Name</label>
                      <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1 ml-1">Email</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1 ml-1">Welcome Message</label>
                    <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={3} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={resetForm} className="flex-1 py-3 font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">Cancel</button>
                    <button type="submit" disabled={formSubmitting} className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center">
                      {formSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Invite User"}
                    </button>
                  </div>
                </form>
             </div>
          </div>
        )}

        {message && <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2">
          <ShieldCheck className="w-5 h-5" /> {message}
        </div>}
        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2">
          <ShieldAlert className="w-5 h-5" /> {error}
        </div>}

        <div className="relative max-w-md mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Filter by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-5 py-3.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
          />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-[11px] uppercase tracking-widest font-bold">
                  <th className="px-8 py-5">Personnel Profile</th>
                  <th className="px-8 py-5">Contact</th>
                  <th className="px-8 py-5">Assigned Name</th>
                  <th className="px-8 py-5">Activity</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading && filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
                      Loading Database...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400">No personnel matching your criteria</td>
                  </tr>
                ) : (
                  filtered.map((gk) => (
                    <tr key={gk.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative h-12 w-12 rounded-2xl overflow-hidden shadow-inner bg-slate-100 border border-slate-200 dark:border-slate-700">
                            <Image 
                              src={gk.profileImageUrl || `https://ui-avatars.com/api/?name=${gk.firstName}+${gk.lastName}`} 
                              alt={gk.firstName}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{gk.firstName} {gk.lastName}</div>
                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md mt-1 w-fit">
                              <ShieldCheck className="w-3 h-3" /> {gk.role}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Mail className="w-4 h-4 text-slate-300" />
                          {gk.email}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium">
                          {gk.dbGateKeeperName || 'Not Assigned'}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Clock className="w-4 h-4" />
                          {formatDate(gk.lastSignInAt)}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {actionLoading === gk.id ? (
                             <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                          ) : (
                            <>
                              <button 
                                onClick={() => handleRevoke(gk.id, `${gk.firstName} ${gk.lastName}`)} 
                                className="p-2 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded-lg transition-colors"
                                title="Revoke Access"
                              >
                                <ShieldAlert className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => handleDelete(gk.id, `${gk.firstName} ${gk.lastName}`)} 
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                                title="Delete Forever"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageGatekeepersPage;