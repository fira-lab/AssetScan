"use client";

import { useState, useEffect } from "react";
import { compactFormat } from "@/lib/format-number";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OverviewCard } from "./card"; // Assuming OverviewCard expects { value: string | number; growthRate: number; }
import * as icons from "./icons";

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

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const fetchOverviewData = async () => {
    try {
      const response = await fetch("/api/overview");
      if (response.ok) {
        const data = await response.json();
        // Ensure fetched data conforms to the expected state structure
        const validatedData = {
          views: {
            value: data.views?.value ?? 0,
            change: data.views?.change ?? 0,
          },
          profit: {
            value: data.profit?.value ?? 0,
            change: data.profit?.change ?? 0,
          },
          products: {
            value: data.products?.value ?? 0,
            change: data.products?.change ?? 0,
          },
          users: {
            value: data.users?.value ?? 0,
            change: data.users?.change ?? 0,
          },
        };
        setOverviewData(validatedData);
        setEditData({
          views: validatedData.views.value.toString(),
          profit: validatedData.profit.value.toString(),
          products: validatedData.products.value.toString(),
          users: validatedData.users.value.toString(),
        });
      } else {
        console.error("Failed to fetch overview data:", response.statusText);
        // Set default state or handle error appropriately
        setOverviewData({
          views: { value: 0, change: 0 },
          profit: { value: 0, change: 0 },
          products: { value: 0, change: 0 },
          users: { value: 0, change: 0 },
        });
        setEditData({ views: "0", profit: "0", products: "0", users: "0" });
      }
    } catch (error) {
      console.error("Error fetching overview data:", error);
      // Set default state or handle error appropriately
      setOverviewData({
        views: { value: 0, change: 0 },
        profit: { value: 0, change: 0 },
        products: { value: 0, change: 0 },
        users: { value: 0, change: 0 },
      });
      setEditData({ views: "0", profit: "0", products: "0", users: "0" });
    }
  };

  const saveOverviewData = async () => {
    // Ensure editData values are valid numbers before saving
    const updatedData = {
      views: {
        value: Number(editData.views) || 0, // Default to 0 if conversion fails
        change: overviewData.views.change,
      },
      profit: {
        value: Number(editData.profit) || 0,
        change: overviewData.profit.change,
      },
      products: {
        value: Number(editData.products) || 0,
        change: overviewData.products.change,
      },
      users: {
        value: Number(editData.users) || 0,
        change: overviewData.users.change,
      },
    };

    try {
      const response = await fetch("/api/overview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        setOverviewData(updatedData); // Update state with the successfully saved data
        setIsOpen(false);
      } else {
        console.error("Failed to save overview data:", response.statusText);
        // Optionally show an error message to the user
      }
    } catch (error) {
      console.error("Error saving overview data:", error);
      // Optionally show an error message to the user
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      {/* --- FIX START --- */}
      <OverviewCard
        label="Total Souls Who Heard The Good News"
        data={{
          value: compactFormat(overviewData.views.value), // Keep the formatted value
          growthRate: overviewData.views.change, // Map 'change' to 'growthRate'
        }}
        Icon={icons.Views}
      />

      <OverviewCard
        label="Total New Souls"
        data={{
          value: compactFormat(overviewData.profit.value), // Keep the formatted value
          growthRate: overviewData.profit.change, // Map 'change' to 'growthRate'
        }}
        Icon={icons.Profit}
      />

      <OverviewCard
        label="Total Promised Souls"
        data={{
          value: compactFormat(overviewData.products.value), // Keep the formatted value
          growthRate: overviewData.products.change, // Map 'change' to 'growthRate'
        }}
        Icon={icons.Product}
      />

      <OverviewCard
        label="Total Missions"
        data={{
          value: compactFormat(overviewData.users.value), // Keep the formatted value
          growthRate: overviewData.users.change, // Map 'change' to 'growthRate'
        }}
        Icon={icons.Users}
      />
      {/* --- FIX END --- */}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {/* Add col-span-full or similar if needed to position button correctly below cards */}
          <Button
            onClick={() => {
              // Reset edit data to current overview data when opening dialog
              setEditData({
                views: overviewData.views.value.toString(),
                profit: overviewData.profit.value.toString(),
                products: overviewData.products.value.toString(),
                users: overviewData.users.value.toString(),
              });
              setIsOpen(true);
            }}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white sm:col-span-2 xl:col-span-4" // Example positioning
          >
            Edit Overview
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Overview Numbers</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {" "}
            {/* Added py-4 for spacing */}
            <div>
              <label
                htmlFor="edit-views"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Total Assets Registered
              </label>
              <Input
                id="edit-views"
                type="number"
                value={editData.views}
                onChange={(e) =>
                  setEditData({ ...editData, views: e.target.value })
                }
                className="h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter number" // Added placeholder
              />
            </div>
            <div>
              <label
                htmlFor="edit-profit"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Total New Souls
              </label>
              <Input
                id="edit-profit"
                type="number"
                value={editData.profit}
                onChange={(e) =>
                  setEditData({ ...editData, profit: e.target.value })
                }
                className="h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter number"
              />
            </div>
            <div>
              <label
                htmlFor="edit-products"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Total Promised Souls
              </label>
              <Input
                id="edit-products"
                type="number"
                value={editData.products}
                onChange={(e) =>
                  setEditData({ ...editData, products: e.target.value })
                }
                className="h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter number"
              />
            </div>
            <div>
              <label
                htmlFor="edit-users"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Total Missions
              </label>
              <Input
                id="edit-users"
                type="number"
                value={editData.users}
                onChange={(e) =>
                  setEditData({ ...editData, users: e.target.value })
                }
                className="h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter number"
              />
            </div>
            <Button
              onClick={saveOverviewData}
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-md" // Added rounded-md
            >
              Save Changes {/* Slightly better button text */}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
