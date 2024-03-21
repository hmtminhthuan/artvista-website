import { Metadata } from "next";
import ResetPasswordProvider from "./ResetPasswordProvider";

export const metadata: Metadata = {
  title: "Artvista",
  description: "This is Confirm Mail Page for Artvista",
};

export default function ProfilePage() {
  return (
    <>
      <ResetPasswordProvider />
    </>
  );
}
