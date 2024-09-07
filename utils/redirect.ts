import { redirect } from "next/navigation";

export const redirectToSignIn = () => {
  redirect("/sign-in");
};
