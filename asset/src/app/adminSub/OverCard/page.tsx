"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OverviewCard } from "../overview-cards/card";
import * as icons from "./icons";
import { compactFormat } from "@/lib/format-number";
import { useToast } from "@chakra-ui/react";

export default function OverviewCardsGroup() {
  const [overviewData, setOverviewData] = useState({
    views: { value: 0, change: 0 },
    profit: { value: 0, change: 0 },
    products: { value: 0, change: 0 },
    users: { value: 0, change: 0 },
  });
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState({
    views: "",
    profit: "",
    products: "",
    users: "",
  });
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const fetchOverviewData = async () => {
    try {
      const response = await fetch("/api/cards/overview", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setOverviewData(data);
      setEditData({
        views: data.views.value.toString(),
        profit: data.profit.value.toString(),
        products: data.products.value.toString(),
        users: data.users.value.toString(),
      });
    } catch (error) {
      console.error("Error fetching overview data:", error);
      setError("Failed to load overview data");
      toast({
        title: "Error",
        description: `Failed to load overview data: ${(error as Error).message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const saveOverviewData = async () => {
    const updatedData = {
      views: {
        value: Number(editData.views),
        change: overviewData.views.change,
      },
      profit: {
        value: Number(editData.profit),
        change: overviewData.profit.change,
      },
      products: {
        value: Number(editData.products),
        change: overviewData.products.change,
      },
      users: {
        value: Number(editData.users),
        change: overviewData.users.change,
      },
    };

    try {
      const response = await fetch("/api/cards/overview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setOverviewData(updatedData);
      setIsOpen(false);
      toast({
        title: "Success",
        description: "Overview data saved successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error saving overview data:", error);
      setError("Failed to save overview data");
      toast({
        title: "Error",
        description: `Failed to save overview data: ${(error as Error).message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <OverviewCard
        label="Total Souls Who Heard The Good News"
        data={{
          ...overviewData.views,
          value: compactFormat(overviewData.views.value),
          growthRate: overviewData.views.change,
        }}
        Icon={icons.Views}
      />

      <OverviewCard
        label="Total New Souls"
        data={{
          value: compactFormat(overviewData.profit.value),
          growthRate: overviewData.profit.change,
        }}
        Icon={icons.Profit}
      />

      <OverviewCard
        label="Total Missions"
        data={{
          ...overviewData.products,
          value: compactFormat(overviewData.products.value),
          growthRate: overviewData.products.change,
        }}
        Icon={icons.Product}
      />

      <OverviewCard
        label="Total New Souls"
        data={{
          value: compactFormat(overviewData.users.value),
          growthRate: overviewData.users.change,
        }}
        Icon={icons.Users}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={() => setIsOpen(true)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Edit Overview
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Overview Numbers</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-1">
                Total Souls Who Heard The Good News
              </label>
              <Input
                type="number"
                value={editData.views}
                onChange={(e) =>
                  setEditData({ ...editData, views: e.target.value })
                }
                className="h-10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-1">
                Total New Souls
              </label>
              <Input
                type="number"
                value={editData.profit}
                onChange={(e) =>
                  setEditData({ ...editData, profit: e.target.value })
                }
                className="h-10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-1">
                Total Missions
              </label>
              <Input
                type="number"
                value={editData.products}
                onChange={(e) =>
                  setEditData({ ...editData, products: e.target.value })
                }
                className="h-10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark dark:text-white mb-1">
                Total New Souls
              </label>
              <Input
                type="number"
                value={editData.users}
                onChange={(e) =>
                  setEditData({ ...editData, users: e.target.value })
                }
                className="h-10"
              />
            </div>
            <Button
              onClick={saveOverviewData}
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
