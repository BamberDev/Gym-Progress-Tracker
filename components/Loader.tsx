import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center text-white py-10">
      <Loader2 className="h-24 w-24 animate-spin" />
      <p className="text-2xl">Loading...</p>
    </div>
  );
}
