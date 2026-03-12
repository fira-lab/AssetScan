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
  PaginationLink,
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
import { Checkbox } from "../../../components/ui/checkbox";
import { useToast } from "@chakra-ui/react";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

// Interface for fetched data
interface DonorData {
  _id: string;
  email: string;
  name: string;
  title: string;
  donationAmount: number;
  currency: string;
  transactionId: string;
  createdAt: string;
}

// Type for adding a new donor (amount as string initially)
type NewDonorData = Omit<DonorData, "_id" | "createdAt" | "donationAmount"> & {
  donationAmount: string;
};

// Type for the edit state (amount as string)
type EditDonorState = Omit<DonorData, "donationAmount"> & {
  donationAmount: string;
};

export default function DonateUsers() {
  const [donors, setDonors] = useState<DonorData[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<DonorData[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDonorId, setDeleteDonorId] = useState<string | null>(null);
  const [editDonor, setEditDonor] = useState<EditDonorState | null>(null);
  const [emailRange, setEmailRange] = useState("1-100");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailLink, setEmailLink] = useState(
    "https://firaol-developer.vercel.app/"
  );
  const [isSending, setIsSending] = useState(false);
  const [emailSelectionMode, setEmailSelectionMode] = useState("manual");
  const [randomCount, setRandomCount] = useState("1");
  const [newDonor, setNewDonor] = useState<NewDonorData>({
    email: "",
    name: "",
    title: "",
    donationAmount: "",
    currency: "USD",
    transactionId: "",
  });
  const toast = useToast();
  const donorsPerPage = 10;

  const fetchDonors = useCallback(async () => {
    try {
      const response = await fetch("/api/donation/donation");
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const data: DonorData[] = await response.json();
      // Normalize data to handle missing title fields
      const normalizedData = data.map((donor) => ({
        ...donor,
        title: donor.title || "", // Fallback for missing titles
      }));
      setDonors(normalizedData);
      setFilteredDonors(normalizedData);
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Fetch Donors Error:", error);
      toast({
        title: "Error Fetching Donors",
        description: `Failed to fetch donors: ${errorMsg}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchDonors();
  }, [fetchDonors]);

  const addDonor = async () => {
    const { email, name, title, donationAmount, transactionId } = newDonor;
    if (!email || !name || !title || !donationAmount || !transactionId) {
      toast({
        title: "Validation Error",
        description: "All fields are required.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    const parsedAmount = parseFloat(donationAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid donation amount.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    try {
      const donorData = { ...newDonor, donationAmount: parsedAmount };
      const response = await fetch("/api/donation/donation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donorData),
      });
      if (!response.ok) {
        let errorData = { error: "Failed to add donor" };
        try {
          errorData = await response.json();
        } catch (e) {
          console.log(e);
          /* Ignore */
        }
        throw new Error(errorData.error);
      }
      await fetchDonors();
      setNewDonor({
        email: "",
        name: "",
        title: "",
        donationAmount: "",
        currency: "USD",
        transactionId: "",
      });
      setIsAddOpen(false);
      toast({
        title: "Success",
        description: "Donor added successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Add Donor Error:", error);
      toast({
        title: "Error Adding Donor",
        description: `Failed to add donor: ${errorMsg}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const updateDonor = async () => {
    if (!editDonor) {
      console.error("Update attempt with no donor selected.");
      toast({
        title: "Error",
        description: "No donor selected for editing.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (
      !editDonor.email ||
      !editDonor.name ||
      !editDonor.title ||
      !editDonor.donationAmount ||
      !editDonor.transactionId
    ) {
      toast({
        title: "Validation Error",
        description: "All fields are required.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    const parsedAmount = parseFloat(editDonor.donationAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid donation amount.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    try {
      const donorData = {
        email: editDonor.email,
        name: editDonor.name,
        title: editDonor.title,
        donationAmount: parsedAmount,
        currency: editDonor.currency,
        transactionId: editDonor.transactionId,
      };
      const response = await fetch(
        `/api/donation/donation?id=${editDonor._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(donorData),
        }
      );
      if (!response.ok) {
        let errorData = { error: "Failed to update donor" };
        try {
          errorData = await response.json();
        } catch (e) {
          console.log(e);
          /* Ignore */
        }
        throw new Error(errorData.error);
      }
      await fetchDonors();
      setEditDonor(null);
      setIsEditOpen(false);
      toast({
        title: "Success",
        description: "Donor updated successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Update Donor Error:", error);
      toast({
        title: "Error Updating Donor",
        description: `Failed to update donor: ${errorMsg}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const deleteDonor = async () => {
    if (!deleteDonorId) {
      console.error("Delete attempt with no ID.");
      toast({
        title: "Error",
        description: "No donor selected for deletion.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      const response = await fetch(
        `/api/donation/donation?id=${deleteDonorId}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        let errorData = { error: "Failed to delete donor" };
        try {
          errorData = await response.json();
        } catch (e) {
          console.log(e);
          /* Ignore */
        }
        throw new Error(errorData.error);
      }
      await fetchDonors();
      setDeleteDonorId(null);
      setIsDeleteOpen(false);
      toast({
        title: "Success",
        description: "Donor deleted successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Delete Donor Error:", error);
      toast({
        title: "Error Deleting Donor",
        description: `Failed to delete donor: ${errorMsg}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const sendEmails = async () => {
    if (!emailSubject || !emailMessage) {
      toast({
        title: "Validation Error",
        description: "Subject and message are required.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setIsSending(true);
    try {
      let emailsToSend: string[] = [];
      let namesToSend: string[] = [];
      if (emailSelectionMode === "manual") {
        emailsToSend = selectedEmails;
        namesToSend = selectedNames;
        if (selectedEmails.length !== selectedNames.length) {
          throw new Error("Mismatch between selected emails and names.");
        }
      } else if (emailSelectionMode === "random") {
        const count = parseInt(randomCount, 10);
        if (isNaN(count) || count <= 0) {
          throw new Error("Invalid random count selected.");
        }
        const shuffled = [...donors].sort(() => 0.5 - Math.random());
        emailsToSend = shuffled.slice(0, count).map((donor) => donor.email);
        namesToSend = shuffled.slice(0, count).map((donor) => donor.name);
        setSelectedEmails(emailsToSend);
        setSelectedNames(namesToSend);
      } else {
        const [startStr, endStr] = emailRange.split("-");
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (isNaN(start) || isNaN(end) || start <= 0 || end < start) {
          throw new Error("Invalid range selected.");
        }
        emailsToSend = donors.slice(start - 1, end).map((donor) => donor.email);
        namesToSend = donors.slice(start - 1, end).map((donor) => donor.name);
        setSelectedEmails(emailsToSend);
        setSelectedNames(namesToSend);
      }
      if (!emailsToSend.length) {
        throw new Error(
          "No donors selected for sending emails based on criteria."
        );
      }
      const response = await fetch("/api/subscribe/donation-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emails: emailsToSend,
          names: namesToSend,
          subject: emailSubject,
          message: emailMessage,
          link: emailLink,
        }),
      });
      if (!response.ok) {
        let errorData = { error: "Failed to send emails" };
        try {
          errorData = await response.json();
        } catch (e) {
          console.log(e);
          /* Ignore */
        }
        throw new Error(errorData.error);
      }
      toast({
        title: "Success",
        description: "Emails sent successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setEmailSubject("");
      setEmailMessage("");
      setEmailLink("https://firaol-developer.vercel.app/");
      setSelectedEmails([]);
      setSelectedNames([]);
      setSelectAll(false);
      setIsEmailOpen(false);
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Send Emails Error:", error);
      toast({
        title: "Error Sending Emails",
        description: `Failed to send emails: ${errorMsg}`,
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
    setFilteredDonors(
      donors.filter(
        (donor) =>
          donor.email.toLowerCase().includes(term) ||
          donor.name.toLowerCase().includes(term) ||
          donor.title.toLowerCase().includes(term) ||
          (donor.transactionId &&
            donor.transactionId.toLowerCase().includes(term))
      )
    );
    setCurrentPage(1);
    setSelectedEmails([]);
    setSelectedNames([]);
    setSelectAll(false);
  };

  const handleSelectEmail = (email: string, name: string) => {
    setSelectedEmails((prev) => {
      const newEmails = prev.includes(email)
        ? prev.filter((e) => e !== email)
        : [...prev, email];
      const currentEmails = currentDonors.map((d) => d.email);
      setSelectAll(
        currentEmails.length > 0 &&
          currentEmails.every((e) => newEmails.includes(e))
      );
      return newEmails;
    });
    setSelectedNames((prev) => {
      return prev.includes(name)
        ? prev.filter((n) => n !== name)
        : [...prev, name];
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedEmails([]);
      setSelectedNames([]);
      setSelectAll(false);
    } else {
      const emailsToSelect = currentDonors.map((donor) => donor.email);
      const namesToSelect = currentDonors.map((donor) => donor.name);
      setSelectedEmails(emailsToSelect);
      setSelectedNames(namesToSelect);
      setSelectAll(true);
    }
  };

  const getRangeOptions = () => {
    const options = [];
    const step = 100;
    for (let i = 1; i <= donors.length; i += step) {
      const end = Math.min(i + step - 1, donors.length);
      options.push(`${i}-${end}`);
    }
    return options;
  };

  const indexOfLastDonor = currentPage * donorsPerPage;
  const indexOfFirstDonor = indexOfLastDonor - donorsPerPage;
  const currentDonors = filteredDonors.slice(
    indexOfFirstDonor,
    indexOfLastDonor
  );
  const totalPages = Math.ceil(filteredDonors.length / donorsPerPage);

  // Handle card interaction
  const handleCardInteraction = (context: string) => {
    console.log(`Interacted with ${context} Card`);
    // Add your interaction logic here (e.g., navigate, open modal, etc.)
  };

  return (
    <Card
      className="sm:col-span-2 relative overflow-hidden group hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-none cursor-pointer touch-auto"
      onClick={() => handleCardInteraction("Donation Overview")}
      onTouchStart={() => handleCardInteraction("Donation Overview")}
      onKeyDown={(e) =>
        e.key === "Enter" && handleCardInteraction("Donation Overview")
      }
      role="button"
      tabIndex={0}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent group-hover:from-red-500/20 transition-all duration-300"></div>
      <div className="relative z-10">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg font-semibold text-red-600 dark:text-red-300"></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-800 dark:shadow-card bg-gradient-to-r from-red-500/10 to-transparent group-hover:from-red-500/20 transition-all duration-300">
            <style jsx>{`
              .scroll-wrapper {
                overflow-x: auto;
                padding-bottom: 10px;
              }
              .scrollable-cell {
                max-width: 200px;
                overflow-x: auto;
                white-space: nowrap;
                padding: 8px;
              }
              @media (max-width: 640px) {
                .scroll-wrapper table {
                  min-width: 900px;
                }
                .scrollable-cell {
                  max-width: 150px;
                }
              }
            `}</style>
            <div className="flex items-center justify-between mb-5 ">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white ">
                Donations Received ({filteredDonors.length})
              </h2>
              <div className="flex gap-4">
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                  <DialogTrigger asChild>
                    <Button className="h-10 bg-blue-600 hover:bg-blue-700 text-white">
                      Add Donation
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <Card
                      className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-none cursor-pointer touch-auto"
                      onClick={() =>
                        handleCardInteraction("Add Donation Dialog")
                      }
                      onTouchStart={() =>
                        handleCardInteraction("Add Donation Dialog")
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        handleCardInteraction("Add Donation Dialog")
                      }
                      role="button"
                      tabIndex={0}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent group-hover:from-red-500/20 transition-all duration-300"></div>
                      <div className="relative z-10">
                        <DialogHeader>
                          <DialogTitle className="text-gray-900 dark:text-white">
                            Add New Donation
                          </DialogTitle>
                        </DialogHeader>
                        <form
                          onSubmit={(_e: FormEvent<HTMLFormElement>) => {
                            _e.preventDefault();
                            addDonor();
                          }}
                          className="space-y-4 p-4"
                        >
                          <Input
                            placeholder="Email"
                            type="email"
                            required
                            value={newDonor.email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setNewDonor({
                                ...newDonor,
                                email: e.target.value,
                              })
                            }
                            className="h-10 dark:bg-gray-700 dark:text-white"
                          />
                          <Input
                            placeholder="Name"
                            required
                            value={newDonor.name}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setNewDonor({ ...newDonor, name: e.target.value })
                            }
                            className="h-10 dark:bg-gray-700 dark:text-white"
                          />
                          <Input
                            placeholder="Title"
                            required
                            value={newDonor.title}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setNewDonor({
                                ...newDonor,
                                title: e.target.value,
                              })
                            }
                            className="h-10 dark:bg-gray-700 dark:text-white"
                          />
                          <Input
                            placeholder="Donation Amount"
                            type="number"
                            required
                            min="0.01"
                            step="0.01"
                            value={newDonor.donationAmount}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setNewDonor({
                                ...newDonor,
                                donationAmount: e.target.value,
                              })
                            }
                            className="h-10 dark:bg-gray-700 dark:text-white"
                          />
                          <Select
                            value={newDonor.currency}
                            onValueChange={(value) =>
                              setNewDonor({ ...newDonor, currency: value })
                            }
                          >
                            <SelectTrigger className="h-10 dark:bg-gray-700 dark:text-white">
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-gray-700">
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                              <SelectItem value="ETB">ETB</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="Transaction ID"
                            required
                            value={newDonor.transactionId}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setNewDonor({
                                ...newDonor,
                                transactionId: e.target.value,
                              })
                            }
                            className="h-10 dark:bg-gray-700 dark:text-white"
                          />
                          <Button
                            type="submit"
                            className="h-10 bg-blue-600 hover:bg-blue-700 text-white w-full"
                          >
                            Add
                          </Button>
                        </form>
                      </div>
                    </Card>
                  </DialogContent>
                </Dialog>
                <Dialog open={isEmailOpen} onOpenChange={setIsEmailOpen}>
                  <DialogTrigger asChild>
                    <Button className="h-10 bg-green-600 hover:bg-green-700 text-white">
                      Send Emails (
                      {selectedEmails.length > 0
                        ? `${selectedEmails.length} (${selectedNames.length} names)`
                        : "Range/Random"}
                      )
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
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent group-hover:from-red-500/20 transition-all duration-300"></div>
                      <div className="relative z-10">
                        <DialogHeader>
                          <DialogTitle className="text-gray-900 dark:text-white">
                            Send Emails to Donors
                          </DialogTitle>
                        </DialogHeader>
                        <form
                          onSubmit={(_e: FormEvent<HTMLFormElement>) => {
                            _e.preventDefault();
                            sendEmails();
                          }}
                          className="space-y-4 p-4"
                        >
                          <Select
                            value={emailSelectionMode}
                            onValueChange={(value) => {
                              setEmailSelectionMode(value);
                              setSelectedEmails([]);
                              setSelectedNames([]);
                              setSelectAll(false);
                            }}
                          >
                            <SelectTrigger className="h-10 dark:bg-gray-700 dark:text-white">
                              <SelectValue placeholder="Select email targeting mode" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-gray-700">
                              <SelectItem value="manual">
                                Manual Selection ({selectedEmails.length})
                              </SelectItem>
                              <SelectItem value="random">
                                Random Selection
                              </SelectItem>
                              <SelectItem value="range">
                                Range Selection
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          {emailSelectionMode === "range" && (
                            <Select
                              value={emailRange}
                              onValueChange={setEmailRange}
                            >
                              <SelectTrigger className="h-10 dark:bg-gray-700 dark:text-white">
                                <SelectValue placeholder="Select range" />
                              </SelectTrigger>
                              <SelectContent className="bg-white dark:bg-gray-700">
                                {getRangeOptions().map((range) => (
                                  <SelectItem key={range} value={range}>
                                    {range} (
                                    {range
                                      .split("-")
                                      .reduce(
                                        (acc, val, i, arr) =>
                                          acc +
                                          (i === 0
                                            ? parseInt(val, 10)
                                            : parseInt(val, 10) -
                                              parseInt(arr[0], 10) +
                                              1),
                                        0
                                      )}
                                    )
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          {emailSelectionMode === "random" && (
                            <Select
                              value={randomCount}
                              onValueChange={setRandomCount}
                            >
                              <SelectTrigger className="h-10 dark:bg-gray-700 dark:text-white">
                                <SelectValue placeholder="Select number of random donors" />
                              </SelectTrigger>
                              <SelectContent className="bg-white dark:bg-gray-700">
                                {[1, 2, 5, 10, 20, 50].map(
                                  (count) =>
                                    donors.length >= count && (
                                      <SelectItem
                                        key={count}
                                        value={String(count)}
                                      >
                                        {count} Donor(s)
                                      </SelectItem>
                                    )
                                )}
                                {donors.length > 50 && (
                                  <SelectItem value={String(donors.length)}>
                                    All ({donors.length})
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
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
                            required
                            value={emailMessage}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                              setEmailMessage(e.target.value)
                            }
                            className="h-20 dark:bg-gray-700 dark:text-white"
                          />
                          <Input
                            placeholder="Link URL (Optional)"
                            type="url"
                            value={emailLink}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setEmailLink(e.target.value)
                            }
                            className="h-10 dark:bg-gray-700 dark:text-white"
                          />
                          <Button
                            type="submit"
                            disabled={
                              isSending ||
                              (emailSelectionMode === "manual" &&
                                selectedEmails.length === 0)
                            }
                            className="h-10 bg-green-600 hover:bg-green-700 text-white w-full"
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
                        </form>
                      </div>
                    </Card>
                  </DialogContent>
                </Dialog>
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="h-10 max-w-sm dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="scroll-wrapper">
              <Table className="table-fixed min-w-[900px]">
                <TableHeader>
                  <TableRow className="border-gray-200 dark:border-gray-700 uppercase text-xs text-gray-500 dark:text-gray-400">
                    <TableHead className="w-[50px] pl-4">
                      <Checkbox
                        checked={selectAll}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all current page"
                      />
                    </TableHead>
                    <TableHead className="w-[150px]">Name</TableHead>

                    <TableHead className="w-[200px]">Email</TableHead>
                    <TableHead className="w-[100px] text-right">
                      Amount
                    </TableHead>
                    <TableHead className="w-[80px]">Currency</TableHead>
                    <TableHead className="w-[120px]">Transaction ID</TableHead>
                    <TableHead className="w-[100px]">Date</TableHead>
                    <TableHead className="w-[150px] text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentDonors.map((donor) => (
                    <TableRow
                      key={donor._id}
                      className="text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <TableCell className="pl-4">
                        <Checkbox
                          checked={selectedEmails.includes(donor.email)}
                          onCheckedChange={() =>
                            handleSelectEmail(donor.email, donor.name)
                          }
                          aria-label={`Select ${donor.name}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {donor.name}
                      </TableCell>

                      <TableCell className="scrollable-cell">
                        {donor.email}
                      </TableCell>
                      <TableCell className="text-right">
                        {donor.donationAmount.toFixed(2)}
                      </TableCell>
                      <TableCell>{donor.currency}</TableCell>
                      <TableCell className="scrollable-cell">
                        {donor.transactionId}
                      </TableCell>
                      <TableCell>
                        {new Date(donor.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="flex gap-2 justify-center">
                        <Dialog
                          open={editDonor?._id === donor._id}
                          onOpenChange={(open) => {
                            if (!open) setEditDonor(null);
                            setIsEditOpen(open);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setEditDonor({
                                  ...donor,
                                  donationAmount: String(donor.donationAmount),
                                })
                              }
                              className="h-8 text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-gray-700"
                            >
                              Edit
                            </Button>
                          </DialogTrigger>
                        </Dialog>
                        <Dialog
                          open={deleteDonorId === donor._id}
                          onOpenChange={(open) => {
                            if (!open) setDeleteDonorId(null);
                            setIsDeleteOpen(open);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setDeleteDonorId(donor._id)}
                              className="h-8 bg-red-600 hover:bg-red-700 text-white"
                            >
                              Delete
                            </Button>
                          </DialogTrigger>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                  {currentDonors.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="h-24 text-center text-gray-500 dark:text-gray-400"
                      >
                        No donors found matching your criteria.
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
                      onClick={(_e: MouseEvent<HTMLAnchorElement>) => {
                        _e.preventDefault();
                        setCurrentPage((prev) => Math.max(prev - 1, 1));
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : undefined
                      }
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        onClick={(_e: MouseEvent<HTMLAnchorElement>) => {
                          _e.preventDefault();
                          setCurrentPage(i + 1);
                        }}
                        isActive={currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(_e: MouseEvent<HTMLAnchorElement>) => {
                        _e.preventDefault();
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, totalPages)
                        );
                      }}
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
            <Dialog
              open={isEditOpen}
              onOpenChange={(open) => {
                if (!open) setEditDonor(null);
                setIsEditOpen(open);
              }}
            >
              <DialogContent>
                <Card
                  className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-none cursor-pointer touch-auto"
                  onClick={() => handleCardInteraction("Edit Donor Dialog")}
                  onTouchStart={() =>
                    handleCardInteraction("Edit Donor Dialog")
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    handleCardInteraction("Edit Donor Dialog")
                  }
                  role="button"
                  tabIndex={0}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent group-hover:from-red-500/20 transition-all duration-300"></div>
                  <div className="relative z-10">
                    <DialogHeader>
                      <DialogTitle className="text-gray-900 dark:text-white">
                        Edit Donor
                      </DialogTitle>
                    </DialogHeader>
                    {editDonor && (
                      <form
                        onSubmit={(_e: FormEvent<HTMLFormElement>) => {
                          _e.preventDefault();
                          updateDonor();
                        }}
                        className="space-y-4 p-4"
                      >
                        <Input
                          placeholder="Email"
                          type="email"
                          required
                          value={editDonor.email}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setEditDonor({
                              ...editDonor,
                              email: e.target.value,
                            })
                          }
                          className="h-10 dark:bg-gray-700 dark:text-white"
                        />
                        <Input
                          placeholder="Name"
                          required
                          value={editDonor.name}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setEditDonor({ ...editDonor, name: e.target.value })
                          }
                          className="h-10 dark:bg-gray-700 dark:text-white"
                        />
                        <Input
                          placeholder="Title"
                          required
                          value={editDonor.title}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setEditDonor({
                              ...editDonor,
                              title: e.target.value,
                            })
                          }
                          className="h-10 dark:bg-gray-700 dark:text-white"
                        />
                        <Input
                          placeholder="Donation Amount"
                          type="number"
                          required
                          min="0.01"
                          step="0.01"
                          value={editDonor.donationAmount}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setEditDonor({
                              ...editDonor,
                              donationAmount: e.target.value,
                            })
                          }
                          className="h-10 dark:bg-gray-700 dark:text-white"
                        />
                        <Select
                          value={editDonor.currency}
                          onValueChange={(value) =>
                            setEditDonor({ ...editDonor, currency: value })
                          }
                        >
                          <SelectTrigger className="h-10 dark:bg-gray-700 dark:text-white">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-gray-700">
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                            <SelectItem value="ETB">ETB</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="Transaction ID"
                          required
                          value={editDonor.transactionId}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setEditDonor({
                              ...editDonor,
                              transactionId: e.target.value,
                            })
                          }
                          className="h-10 dark:bg-gray-700 dark:text-white"
                        />
                        <DialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditOpen(false)}
                            className="h-10 dark:text-white dark:border-gray-600"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="h-10 bg-blue-600 hover:bg-blue-700 text-white"
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
                  onClick={() =>
                    handleCardInteraction("Confirm Deletion Dialog")
                  }
                  onTouchStart={() =>
                    handleCardInteraction("Confirm Deletion Dialog")
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    handleCardInteraction("Confirm Deletion Dialog")
                  }
                  role="button"
                  tabIndex={0}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent group-hover:from-red-500/20 transition-all duration-300"></div>
                  <div className="relative z-10">
                    <DialogHeader>
                      <DialogTitle className="text-gray-900 dark:text-white">
                        Confirm Deletion
                      </DialogTitle>
                    </DialogHeader>
                    <p className="text-gray-900 dark:text-white py-4">
                      Are you sure you want to delete this donor? This action
                      cannot be undone.
                    </p>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsDeleteOpen(false)}
                        className="h-10 dark:text-white dark:border-gray-600"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={deleteDonor}
                        className="h-10 bg-red-600 hover:bg-red-700 text-white"
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
