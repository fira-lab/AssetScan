"use server";
import type { NextApiRequest, NextApiResponse } from "next";

import Overview, { IOverview } from "@/models/Overview";
import connectDB from "@/types/db";

export async function getOverviewData(): Promise<IOverview> {
  try {
    await connectDB();
    let overview = await Overview.findOne();
    if (!overview) {
      // Create default if none exists
      overview = new Overview({
        views: { value: 0, change: 0 },
        profit: { value: 0, change: 0 },
        products: { value: 0, change: 0 },
        users: { value: 0, change: 0 },
      });
      await overview.save();
    }
    return overview;
  } catch (error) {
    console.error("Error fetching overview data:", error);
    throw error;
  }
}

export async function postOverviewData(data: IOverview): Promise<IOverview> {
  try {
    await connectDB();
    let overview = await Overview.findOne();
    if (overview) {
      overview.views = data.views;
      overview.profit = data.profit;
      overview.products = data.products;
      overview.users = data.users;
      await overview.save();
    } else {
      overview = new Overview(data);
      await overview.save();
    }
    return overview;
  } catch (error) {
    console.error("Error saving overview data:", error);
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  switch (req.method) {
    case "GET":
      try {
        const data = await getOverviewData();
        res.status(200).json(data);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to fetch overview data" });
      }
      break;

    case "POST":
      try {
        const data = req.body;
        const savedData = await postOverviewData(data);
        res.status(201).json(savedData);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to save overview data" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
