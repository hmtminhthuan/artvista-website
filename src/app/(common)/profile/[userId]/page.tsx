import { Metadata } from "next";
import ProfileProvider from "./profileProvider";

export const metadata: Metadata = {
  title: "Artvista",
  description: "This is Profile Page for Artvista",
};

export default function ProfilePage() {
  return (
    <>
      <ProfileProvider />
    </>
  );
}
