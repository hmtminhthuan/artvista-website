import { Metadata } from "next";
import ConfirmEmailProvider from "./ConfirmEmailProvider";

export const metadata: Metadata = {
  title: "Artvista",
  description: "This is Confirm Mail Page for Artvista",
};

export default function ProfilePage() {
  return (
    <>
      <ConfirmEmailProvider />
    </>
  );
}
