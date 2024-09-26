import { Metadata } from "next";
import DashboardContent from "./DashboardContent";

export const metadata: Metadata = {
  title: "Dashboard | Gym Progress Tracker",
  description: "View and manage your workout groups.",
};

export default function Dashboard() {
  return <DashboardContent />;
}
