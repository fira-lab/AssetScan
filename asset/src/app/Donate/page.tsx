"use client";

import { Button, Card } from "@chakra-ui/react";
import { useState, useEffect } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  serial: string; 
  phone: string;
  location: string;
  message: string;
  subscribe: boolean;
  imageUrl?: string;
}

export default function GatekeeperPage() {
  const [requests, setRequests] = useState<User[]>([]);

  // Fetch pending requests on mount
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch('/api/users/requests'); // Adjust endpoint if needed
        if (res.ok) {
          const data: User[] = await res.json();
          setRequests(data);
        }
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const handleDecision = async (userId: string, action: 'CHECK_IN' | 'CHECK_OUT') => {
    try {
      await fetch('/api/users/transaction', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action, gatekeeperId: "GK_ID_01" })
      });

      // Remove the processed request from the list
      setRequests(prev => prev.filter(user => user._id !== userId));
    } catch (error) {
      console.error("Failed to process decision:", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Gatekeeper Verification Portal</h1>

      {requests.length === 0 ? (
        <p className="text-gray-500">No pending requests at the moment.</p>
      ) : (
        requests.map(user => (
          <Card key={user._id} className="mb-4 p-4 flex justify-between items-center">
            <div>
              <p className="font-bold">{user.name} requesting {user.message}</p>
              <p className="text-sm text-gray-500">Serial: {user.serial} • Email: {user.email}</p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => handleDecision(user._id, 'CHECK_OUT')} 
                className="bg-green-600 hover:bg-green-700"
              >
                Approve
              </Button>
              <Button 
                onClick={() => handleDecision(user._id, 'CHECK_IN')} 
                className="bg-red-600 hover:bg-red-700"
              >
                Deny/Return
              </Button>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}