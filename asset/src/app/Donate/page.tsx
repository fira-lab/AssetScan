"use client";

import { Button, Card } from "@chakra-ui/react";
import { useState } from "react";
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

  const handleDecision = async (userId: string, action: 'CHECK_IN' | 'CHECK_OUT') => {
    // Only 'CHECK_OUT' acts as an Approval here
    await fetch('/api/users/transaction', {
      method: 'POST',
      body: JSON.stringify({ userId, action, gatekeeperId: "GK_ID_01" })
    });
    // Refresh list
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Gatekeeper Verification Portal</h1>
      {requests.map(user => (
        <Card key={user._id} className="mb-4 p-4 flex justify-between items-center">
          <div>
            <p className="font-bold">{user.name} requesting {user.message}</p>
            <p className="text-sm text-gray-500">Serial: {user.email}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => handleDecision(user._id, 'CHECK_OUT')} className="bg-green-600">Approve</Button>
            <Button onClick={() => handleDecision(user._id, 'CHECK_IN')} className="bg-red-600">Deny/Return</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}