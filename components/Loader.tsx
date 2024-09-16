import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center text-white">
      <Loader2 className="h-8 w-8 animate-spin" />
      <p>Loading...</p>
    </div>
  );
}
