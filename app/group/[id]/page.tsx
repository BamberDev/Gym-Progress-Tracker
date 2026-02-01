import { Metadata } from "next";
import GroupContent from "./GroupContent";

export const metadata: Metadata = {
  title: "Group Exercises | Gym Progress Tracker",
  description: "View and manage exercises for a specific workout group.",
};

export default async function GroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <GroupContent params={resolvedParams} />;
}
