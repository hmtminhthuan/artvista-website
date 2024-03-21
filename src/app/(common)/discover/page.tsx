import { Metadata } from "next";
import DiscoverProvider from "./components/pageProvider";

export const metadata: Metadata = {
  title: "Artvista",
  description: "This is Discover Page for Artvista",
};

export default function DiscoverPage() {
  return (
    <>
      <DiscoverProvider />
    </>
  );
}
