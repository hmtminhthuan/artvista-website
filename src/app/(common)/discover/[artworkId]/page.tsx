import { Metadata } from "next";
import ArtworkDetailProvider from "./components/ArtworkDetailProvider";

export const metadata: Metadata = {
  title: "Artvista",
  description: "This is Artwork Detail Page for Artvista",
};

export default function ArtworkDetailPage() {
  return (
    <>
      <ArtworkDetailProvider />
    </>
  );
}
