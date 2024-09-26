import { Metadata } from "next";
import GroupContent from "./GroupContent";

export const metadata: Metadata = {
  title: "Group Exercises | Gym Progress Tracker",
  description: "View and manage exercises for a specific workout group.",
};

export default function GroupPage({ params }: { params: { id: string } }) {
  return <GroupContent params={params} />;
}
