'use client';

import React, { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

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

  // Fetch gatekeepers
  const fetchGatekeepers = async () => {
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
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

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
  }, [isLoaded, userId, user?.publicMetadata?.role]);

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
    } catch (err: any) {
      setError(err.message || "Failed to register gatekeeper");
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
    name: string,
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevoke = (targetUserId: string, name: string) => {
    if (!confirm(`Revoke gatekeeper role from ${name}?`)) return;
    changeRole(targetUserId, "user", name, `Gatekeeper role revoked from ${name}.`, true);
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
    } catch (err: any) {
      setError(err.message);
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

  // Early returns
  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (user?.publicMetadata?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <p className="text-red-600">Access Denied: Admin privileges required.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200 px-6 py-8 md:px-10">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <nav className="flex items-center gap-1.5 text-xs mb-2 text-slate-500">
            <button onClick={() => router.push("/admin")} className="text-blue-600 hover:underline">Admin</button>
            <span>/</span>
            <span>Manage Gatekeepers</span>
          </nav>
          <h1 className="text-3xl font-bold">Manage Gatekeepers</h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowRegisterForm(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2 transition-colors"
          >
            <span className="text-xl">+</span> Register New Gatekeeper
          </button>

          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-2xl px-6 py-4 text-center">
            <div className="text-4xl font-bold text-blue-600">{gatekeepers.length}</div>
            <div className="text-xs uppercase tracking-widest">Total</div>
          </div>
        </div>
      </div>

      {/* Register Modal */}
      {showRegisterForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-8 shadow-xl">
            <h2 className="text-2xl font-semibold mb-6">Register New Gatekeeper</h2>
            <form onSubmit={handleRegister} className="space-y-5">
              {/* Form fields remain the same */}
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message (Optional)</label>
                <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={3} className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:border-blue-500" placeholder="Add a welcome message..." />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={resetForm} className="flex-1 py-3 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">Cancel</button>
                <button type="submit" disabled={formSubmitting} className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-70">
                  {formSubmitting ? "Sending Invitation..." : "Register & Send Invitation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Messages */}
      {message && <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 text-emerald-700 rounded-xl">{message}</div>}
      {error && <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 text-red-700 rounded-xl">{error}</div>}

      {/* Search */}
      <input
        type="text"
        placeholder="Search gatekeepers..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-5 py-3 mb-6 focus:border-blue-500"
      />

      {/* Table */}
      {loading && gatekeepers.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Gatekeeper</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Sign In</th>
                <th className="px-6 py-3 w-32"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No gatekeepers found</td>
                </tr>
              ) : (
                filtered.map((gk) => (
                  <tr key={gk.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img className="h-10 w-10 rounded-full" src={gk.profileImageUrl || `https://ui-avatars.com/api/?name=${gk.firstName}+${gk.lastName}`} alt="" />
                        <div className="ml-4">
                          <div className="font-medium">{gk.firstName} {gk.lastName}</div>
                          <div className="text-sm text-slate-500">Role: {gk.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{gk.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{gk.dbGateKeeperName || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{formatDate(gk.lastSignInAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-4">
                      <button onClick={() => handleRevoke(gk.id, `${gk.firstName} ${gk.lastName}`)} className="text-red-600 hover:text-red-700">Revoke</button>
                      <button onClick={() => handleDelete(gk.id, `${gk.firstName} ${gk.lastName}`)} className="text-red-600 hover:text-red-700">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageGatekeepersPage;