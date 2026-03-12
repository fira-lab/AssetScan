"use client";

import {
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  FormEvent,
  MouseEvent,
} from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../../components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../../../components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { useToast } from "@chakra-ui/react";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";
import { Checkbox } from "../../../components/ui/checkbox";

// Define SubscriberData interface
interface SubscriberData {
  _id: string;
  email: string;
  subscribe: boolean;
  createdAt?: string;
}

// Type for the edit state
type EditSubscriberState = Omit<SubscriberData, "subscribe"> & {
  subscribe: "Active" | "Inactive" | string;
};

export default function SubscribedUsers() {
  const [subscribers, setSubscribers] = useState<SubscriberData[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<
    SubscriberData[]
  >([]);
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteSubscriberId, setDeleteSubscriberId] = useState<string | null>(
    null
  );
  const [editSubscriber, setEditSubscriber] =
    useState<EditSubscriberState | null>(null);
  const [emailRange, setEmailRange] = useState("1-100");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailLink, setEmailLink] = useState(
    "https://firaol-developer.vercel.app/"
  );
  const [isSending, setIsSending] = useState(false);
  const [newSubscriber, setNewSubscriber] = useState<{
    email: string;
    subscribe: string;
  }>({
    email: "",
    subscribe: "Active", // Default to Active
  });
  const [selectionMode, setSelectionMode] = useState<"auto" | "manual">("auto");

  console.log(isDeleteOpen);
  console.log(isEditOpen);
  const toast = useToast();
  const subscribersPerPage = 10;

  const fetchSubscribers = useCallback(async () => {
    try {
      const response = await fetch("/api/subscribe/subscribe");
      if (!response.ok) {
        throw new Error(`Failed to fetch subscribers: ${response.status}`);
      }
      const data: SubscriberData[] = await response.json();
      setSubscribers(data);
      setFilteredSubscribers(data);
      if (data.length > 0) {
        const firstOption = `1-${Math.min(100, data.length)}`;
        setEmailRange(firstOption);
      } else {
        setEmailRange("0-0");
      }
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error fetching subscribers:", error);
      toast({
        title: "Error",
        description: `Failed to fetch subscribers: ${errorMsg}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const addSubscriber = async () => {
    if (!newSubscriber.email || !newSubscriber.subscribe) {
      toast({
        title: "Validation Error",
        description: "Email and subscription status are required.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newSubscriber.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const subscriberData = {
      email: newSubscriber.email,
      subscribe: newSubscriber.subscribe === "Active", // Default to true (Active)
    };

    try {
      const response = await fetch("/api/subscribe/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscriberData),
      });
      if (!response.ok) {
        let errorData = { error: "Failed to add subscriber" };
        try {
          errorData = await response.json();
        } catch (e) {
          console.log(e);
        }
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      await fetchSubscribers();
      setNewSubscriber({ email: "", subscribe: "Active" });
      setIsAddOpen(false);
      toast({
        title: "Success",
        description: "Subscriber added successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error adding subscriber:", error);
      toast({
        title: "Error",
        description: `Failed to add subscriber: ${errorMsg}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const updateSubscriber = async () => {
    if (!editSubscriber) {
      toast({
        title: "Error",
        description: "No subscriber selected for editing.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!editSubscriber.email || !editSubscriber.subscribe) {
      toast({
        title: "Validation Error",
        description: "Email and subscription status are required.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editSubscriber.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const subscriberData = {
      email: editSubscriber.email,
      subscribe: editSubscriber.subscribe === "Active",
    };

    try {
      const response = await fetch(
        `/api/subscribe/subscribe?id=${editSubscriber._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subscriberData),
        }
      );
      if (!response.ok) {
        let errorData = { error: "Failed to update subscriber" };
        try {
          errorData = await response.json();
        } catch (e) {
          console.log(e);
        }
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      await fetchSubscribers();
      setEditSubscriber(null);
      setIsEditOpen(false);
      toast({
        title: "Success",
        description: "Subscriber updated successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error updating subscriber:", error);
      toast({
        title: "Error",
        description: `Failed to update subscriber: ${errorMsg}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const deleteSubscriber = async () => {
    if (!deleteSubscriberId) {
      toast({
        title: "Error",
        description: "No subscriber ID specified for deletion.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      const response = await fetch(
        `/api/subscribe/subscribe?id=${deleteSubscriberId}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        let errorData = { error: "Failed to delete subscriber" };
        try {
          errorData = await response.json();
        } catch (e) {
          console.log(e);
        }
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      await fetchSubscribers();
      setSelectedSubscribers((prev) =>
        prev.filter((id) => id !== deleteSubscriberId)
      );
      const newTotalPages = Math.ceil(
        (filteredSubscribers.length - 1) / subscribersPerPage
      );
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      } else if (newTotalPages === 0) {
        setCurrentPage(1);
      }
      setDeleteSubscriberId(null);
      setIsDeleteOpen(false);
      toast({
        title: "Success",
        description: "Subscriber deleted successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error deleting subscriber:", error);
      toast({
        title: "Error",
        description: `Failed to delete subscriber: ${errorMsg}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const sendEmails = async () => {
    if (!emailSubject) {
      toast({
        title: "Validation Error",
        description: "Please fill in email subject.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setIsSending(true);
    try {
      let selectedEmails: string[] = [];
      if (selectionMode === "auto") {
        const [startStr, endStr] = emailRange.split("-");
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);

        if (isNaN(start) || isNaN(end) || start <= 0 || end < start) {
          toast({
            title: "Error",
            description: "Invalid email range selected.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          setIsSending(false);
          return;
        }

        // Select all subscribers in the range, regardless of subscribe status
        selectedEmails = subscribers
          .slice(start - 1, end)
          .map((sub) => sub.email);
      } else {
        selectedEmails = subscribers
          .filter((sub) => selectedSubscribers.includes(sub._id))
          .map((sub) => sub.email);
      }

      if (selectedEmails.length === 0) {
        toast({
          title: "Info",
          description:
            selectionMode === "auto"
              ? "No subscribers found in the selected range."
              : "No subscribers selected.",
          status: "info",
          duration: 5000,
          isClosable: true,
        });
        setIsSending(false);
        return;
      }

      // Send emails one by one and show toast for each
      for (const email of selectedEmails) {
        const payload = {
          emails: [email],
          subject: emailSubject,
          message: emailMessage,
          link: emailLink,
        };
        try {
          const response = await fetch("/api/subscribe/send-emails", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            const contentType = response.headers.get("content-type");
            let errorMsg = `Failed to send email to ${email} (Status: ${response.status})`;
            if (contentType && contentType.includes("application/json")) {
              try {
                const errorData = await response.json();
                errorMsg = errorData.error || errorData.message || errorMsg;
              } catch (e) {
                console.log(e);
              }
            } else {
              try {
                const text = await response.text();
                errorMsg = `${errorMsg}: ${text.slice(0, 100)}`;
              } catch (e) {
                console.log(e);
              }
            }
            throw new Error(errorMsg);
          }

          toast({
            title: "Success",
            description: `Email sent successfully to ${email}!`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } catch (error: unknown) {
          const errorMsg =
            error instanceof Error
              ? error.message
              : "An unknown error occurred";
          console.error(`Error sending email to ${email}:`, error);
          toast({
            title: "Error",
            description: `Failed to send email to ${email}: ${errorMsg}`,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      }

      setEmailSubject("");
      setEmailMessage("");
      setEmailLink("https://firaol-developer.vercel.app/");
      setSelectedSubscribers([]);
      setIsEmailOpen(false);
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error in sendEmails:", error);
      toast({
        title: "Error",
        description: `An error occurred: ${errorMsg}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = subscribers.filter((subscriber) =>
      subscriber.email.toLowerCase().includes(term)
    );
    setFilteredSubscribers(filtered);
    setCurrentPage(1);
    setSelectedSubscribers([]);
  };

  const getRangeOptions = () => {
    const options = [];
    const total = subscribers.length;
    const step = 100;
    if (total === 0) return ["0-0"];

    for (let i = 1; i <= total; i += step) {
      const end = Math.min(i + step - 1, total);
      options.push(`${i}-${end}`);
    }
    return options;
  };

  const handleSelectSubscriber = (id: string) => {
    setSelectedSubscribers((prev) =>
      prev.includes(id) ? prev.filter((subId) => subId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedSubscribers.length === filteredSubscribers.length) {
      setSelectedSubscribers([]);
    } else {
      setSelectedSubscribers(filteredSubscribers.map((sub) => sub._id));
    }
  };

  const indexOfLastSubscriber = currentPage * subscribersPerPage;
  const indexOfFirstSubscriber = indexOfLastSubscriber - subscribersPerPage;
  const currentSubscribers = filteredSubscribers.slice(
    indexOfFirstSubscriber,
    indexOfLastSubscriber
  );
  const totalPages = Math.ceil(filteredSubscribers.length / subscribersPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEditDialogChange = (open: boolean) => {
    if (!open) {
      setEditSubscriber(null);
    }
    setIsEditOpen(open);
  };

  const handleDeleteDialogChange = (open: boolean) => {
    if (!open) {
      setDeleteSubscriberId(null);
    }
    setIsDeleteOpen(open);
  };

  const handleCardInteraction = (context: string) => {
    console.log(`Interacted with ${context} Card`);
  };

  return (
    <Card
      className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-none cursor-pointer touch-auto"
      onClick={() => handleCardInteraction("Subscribers")}
      onTouchStart={() => handleCardInteraction("Subscribers")}
      onKeyDown={(e) =>
        e.key === "Enter" && handleCardInteraction("Subscribers")
      }
      role="button"
      tabIndex={0}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent group-hover:from-green-500/20 transition-all duration-300"></div>
      <div className="relative z-10">
        <CardContent>
          <div
            className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-800 dark:shadow-card bg-gradient-to-r from-green-500/10 to-transparent group-hover:from-green-500/20 transition-all duration-300"
            style={{ overflow: "visible" }}
          >
            <style jsx>{`
              .scroll-wrapper {
                overflow-x: auto !important;
                -webkit-overflow-scrolling: touch;
                padding-bottom: 10px;
              }
              .touch-auto {
                touch-action: auto !important;
              }
              .cursor-pointer {
                cursor: pointer;
              }
            `}</style>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5.5">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
                Subscribed Users ({filteredSubscribers.length})
              </h2>
              <div className="flex flex-wrap items-center gap-2 justify-end w-full sm:w-auto">
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                  <DialogTrigger asChild>
                    <Button className="h-9 text-sm bg-blue-600 hover:bg-blue-700 text-white">
                      Add Subscriber
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <Card
                      className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-none cursor-pointer touch-auto"
                      onClick={() =>
                        handleCardInteraction("Add Subscriber Dialog")
                      }
                      onTouchStart={() =>
                        handleCardInteraction("Add Subscriber Dialog")
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        handleCardInteraction("Add Subscriber Dialog")
                      }
                      role="button"
                      tabIndex={0}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent group-hover:from-green-500/20 transition-all duration-300"></div>
                      <div className="relative z-10">
                        <DialogHeader>
                          <DialogTitle className="text-gray-900 dark:text-white">
                            Add New Subscriber
                          </DialogTitle>
                        </DialogHeader>
                        <form
                          onSubmit={(e: FormEvent<HTMLFormElement>) => {
                            e.preventDefault();
                            addSubscriber();
                          }}
                          className="space-y-4 p-4"
                        >
                          <Input
                            placeholder="Email"
                            type="email"
                            required
                            value={newSubscriber.email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setNewSubscriber({
                                ...newSubscriber,
                                email: e.target.value,
                              })
                            }
                            className="h-10 dark:bg-gray-700 dark:text-white"
                          />
                          <Select
                            value={newSubscriber.subscribe}
                            onValueChange={(value) =>
                              setNewSubscriber({
                                ...newSubscriber,
                                subscribe: value,
                              })
                            }
                          >
                            <SelectTrigger className="h-10 dark:bg-gray-700 dark:text-white">
                              <SelectValue placeholder="Select subscription status" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-gray-700">
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                          <DialogFooter>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsAddOpen(false)}
                              className="h-9 dark:text-white dark:border-gray-600"
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              className="h-9 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Add Subscriber
                            </Button>
                          </DialogFooter>
                        </form>
                      </div>
                    </Card>
                  </DialogContent>
                </Dialog>

                <Dialog open={isEmailOpen} onOpenChange={setIsEmailOpen}>
                  <DialogTrigger asChild>
                    <Button className="h-9 text-sm bg-green-600 hover:bg-green-700 text-white">
                      Send Emails
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <Card
                      className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-none cursor-pointer touch-auto"
                      onClick={() =>
                        handleCardInteraction("Send Emails Dialog")
                      }
                      onTouchStart={() =>
                        handleCardInteraction("Send Emails Dialog")
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        handleCardInteraction("Send Emails Dialog")
                      }
                      role="button"
                      tabIndex={0}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent group-hover:from-green-500/20 transition-all duration-300"></div>
                      <div className="relative z-10">
                        <DialogHeader>
                          <DialogTitle className="text-gray-900 dark:text-white">
                            Send Emails to Subscribers
                          </DialogTitle>
                        </DialogHeader>
                        <form
                          onSubmit={(e: FormEvent<HTMLFormElement>) => {
                            e.preventDefault();
                            sendEmails();
                          }}
                          className="space-y-4 p-4"
                        >
                          <Select
                            value={selectionMode}
                            onValueChange={(value: "auto" | "manual") =>
                              setSelectionMode(value)
                            }
                          >
                            <SelectTrigger className="h-10 dark:bg-gray-700 dark:text-white">
                              <SelectValue placeholder="Select selection mode" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-gray-700">
                              <SelectItem value="auto">Automatic</SelectItem>
                              <SelectItem value="manual">Manual</SelectItem>
                            </SelectContent>
                          </Select>
                          {selectionMode === "auto" && (
                            <>
                              <Select
                                value={emailRange}
                                onValueChange={setEmailRange}
                              >
                                <SelectTrigger className="h-10 dark:bg-gray-700 dark:text-white">
                                  <SelectValue placeholder="Select range of subscribers" />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-gray-700">
                                  {getRangeOptions().map((range) => (
                                    <SelectItem
                                      key={range}
                                      value={range}
                                      className="dark:text-white"
                                    >
                                      {range}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Selects range based on the full list of
                                subscribers.
                              </p>
                            </>
                          )}
                          {selectionMode === "manual" && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Emails will be sent to manually selected
                              subscribers.
                            </p>
                          )}
                          <Input
                            placeholder="Email Subject"
                            required
                            value={emailSubject}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setEmailSubject(e.target.value)
                            }
                            className="h-10 dark:bg-gray-700 dark:text-white"
                          />
                          <Textarea
                            placeholder="Email Message (HTML allowed)"
                            value={emailMessage}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                              setEmailMessage(e.target.value)
                            }
                            className="h-20 dark:bg-gray-700 dark:text-white"
                          />
                          <Input
                            placeholder="Button Link URL (Optional)"
                            type="url"
                            value={emailLink}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setEmailLink(e.target.value)
                            }
                            className="h-10 dark:bg-gray-700 dark:text-white"
                          />
                          <DialogFooter>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsEmailOpen(false)}
                              className="h-9 dark:text-white dark:border-gray-600"
                              disabled={isSending}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              className="h-9 bg-green-600 hover:bg-green-700 text-white"
                              disabled={isSending}
                            >
                              {isSending ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Sending...
                                </>
                              ) : (
                                "Send Emails"
                              )}
                            </Button>
                          </DialogFooter>
                        </form>
                      </div>
                    </Card>
                  </DialogContent>
                </Dialog>
                <Input
                  placeholder="Search by email..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="h-9 text-sm w-full sm:w-auto max-w-xs dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="scroll-wrapper">
              <Table className="min-w-[600px] w-full table-fixed">
                <TableHeader>
                  <TableRow className="border-b border-gray-200 dark:border-gray-700 uppercase text-xs text-gray-500 dark:text-gray-400 text-left">
                    <TableHead className="w-[10%] pl-4">
                      <Checkbox
                        checked={
                          selectedSubscribers.length ===
                          filteredSubscribers.length
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="w-[40%]">Email</TableHead>
                    <TableHead className="w-[20%]">Status</TableHead>
                    <TableHead className="w-[30%] text-center pr-4">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentSubscribers.map((subscriber) => (
                    <TableRow
                      key={subscriber._id}
                      className="text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <TableCell className="pl-4 py-2">
                        <Checkbox
                          checked={selectedSubscribers.includes(subscriber._id)}
                          onCheckedChange={() =>
                            handleSelectSubscriber(subscriber._id)
                          }
                        />
                      </TableCell>
                      <TableCell className="py-2 break-words">
                        {subscriber.email}
                      </TableCell>
                      <TableCell className="py-2">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            subscriber.subscribe
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {subscriber.subscribe ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="py-2 flex gap-2 justify-center pr-4">
                        <Dialog
                          open={editSubscriber?._id === subscriber._id}
                          onOpenChange={handleEditDialogChange}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setIsEditOpen(true);
                                setEditSubscriber({
                                  ...subscriber,
                                  subscribe: subscriber.subscribe
                                    ? "Active"
                                    : "Inactive",
                                });
                              }}
                              className="h-8 text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-gray-700"
                            >
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <Card
                              className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-none cursor-pointer touch-auto"
                              onClick={() =>
                                handleCardInteraction("Edit Subscriber Dialog")
                              }
                              onTouchStart={() =>
                                handleCardInteraction("Edit Subscriber Dialog")
                              }
                              onKeyDown={(e) =>
                                e.key === "Enter" &&
                                handleCardInteraction("Edit Subscriber Dialog")
                              }
                              role="button"
                              tabIndex={0}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent group-hover:from-green-500/20 transition-all duration-300"></div>
                              <div className="relative z-10">
                                <DialogHeader>
                                  <DialogTitle className="text-gray-900 dark:text-white">
                                    Edit Subscriber
                                  </DialogTitle>
                                </DialogHeader>
                                {editSubscriber && (
                                  <form
                                    onSubmit={(
                                      e: FormEvent<HTMLFormElement>
                                    ) => {
                                      e.preventDefault();
                                      updateSubscriber();
                                    }}
                                    className="space-y-4 p-4"
                                  >
                                    <Input
                                      placeholder="Email"
                                      type="email"
                                      required
                                      value={editSubscriber.email}
                                      onChange={(
                                        e: ChangeEvent<HTMLInputElement>
                                      ) =>
                                        editSubscriber &&
                                        setEditSubscriber({
                                          ...editSubscriber,
                                          email: e.target.value,
                                        })
                                      }
                                      className="h-10 dark:bg-gray-700 dark:text-white"
                                    />
                                    <Select
                                      value={editSubscriber.subscribe}
                                      onValueChange={(value) =>
                                        editSubscriber &&
                                        setEditSubscriber({
                                          ...editSubscriber,
                                          subscribe: value,
                                        })
                                      }
                                    >
                                      <SelectTrigger className="h-10 dark:bg-gray-700 dark:text-white">
                                        <SelectValue placeholder="Select subscription status" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-white dark:bg-gray-700">
                                        <SelectItem value="Active">
                                          Active
                                        </SelectItem>
                                        <SelectItem value="Inactive">
                                          Inactive
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <DialogFooter>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                          handleEditDialogChange(false)
                                        }
                                        className="h-9 dark:text-white dark:border-gray-600"
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        type="submit"
                                        className="h-9 bg-blue-600 hover:bg-blue-700 text-white"
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
                        <Dialog
                          open={deleteSubscriberId === subscriber._id}
                          onOpenChange={handleDeleteDialogChange}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setIsDeleteOpen(true);
                                setDeleteSubscriberId(subscriber._id);
                              }}
                              className="h-8 bg-red-600 hover:bg-red-700 text-white"
                            >
                              Delete
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <Card
                              className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-none cursor-pointer touch-auto"
                              onClick={() =>
                                handleCardInteraction(
                                  "Delete Subscriber Dialog"
                                )
                              }
                              onTouchStart={() =>
                                handleCardInteraction(
                                  "Delete Subscriber Dialog"
                                )
                              }
                              onKeyDown={(e) =>
                                e.key === "Enter" &&
                                handleCardInteraction(
                                  "Delete Subscriber Dialog"
                                )
                              }
                              role="button"
                              tabIndex={0}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent group-hover:from-green-500/20 transition-all duration-300"></div>
                              <div className="relative z-10">
                                <DialogHeader>
                                  <DialogTitle className="text-gray-900 dark:text-white">
                                    Confirm Deletion
                                  </DialogTitle>
                                </DialogHeader>
                                <p className="text-gray-900 dark:text-white py-4">
                                  Are you sure you want to delete this
                                  subscriber? This action cannot be undone.
                                </p>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      handleDeleteDialogChange(false)
                                    }
                                    className="h-9 dark:text-white dark:border-gray-600"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={deleteSubscriber}
                                    className="h-9 bg-red-600 hover:bg-red-700 text-white"
                                  >
                                    Delete
                                  </Button>
                                </DialogFooter>
                              </div>
                            </Card>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                  {currentSubscribers.length === 0 &&
                    filteredSubscribers.length > 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="h-24 text-center text-gray-500 dark:text-gray-400"
                        >
                          No results for this page.
                        </TableCell>
                      </TableRow>
                    )}
                  {filteredSubscribers.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="h-24 text-center text-gray-500 dark:text-gray-400"
                      >
                        {searchTerm
                          ? `No subscribers found matching "${searchTerm}".`
                          : "No subscribers found."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <Pagination className="mt-4 flex justify-center">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                        e.preventDefault();
                        handlePageChange(currentPage - 1);
                      }}
                      aria-disabled={currentPage === 1}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : undefined
                      }
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Page {currentPage} of {totalPages}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                        e.preventDefault();
                        handlePageChange(currentPage + 1);
                      }}
                      aria-disabled={currentPage === totalPages}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : undefined
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
