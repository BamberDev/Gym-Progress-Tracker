import { redirect } from "next/navigation";

export default function redirectToSignIn() {
  redirect("/sign-in");
}
