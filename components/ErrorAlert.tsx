import { ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export default function ErrorAlert({
  alertDescription,
}: {
  alertDescription: ReactNode;
}) {
  return (
    <Alert variant="destructive">
      <AlertTitle>Something went wrong!</AlertTitle>
      <AlertDescription>{alertDescription}</AlertDescription>
    </Alert>
  );
}
