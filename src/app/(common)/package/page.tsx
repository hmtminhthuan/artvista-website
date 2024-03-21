import { Metadata } from "next";
import PackagePageProvider from "./components/pageProvider";

export const metadata: Metadata = {
  title: "Artvista",
  description: "This is Package Page for Artvista",
};

export default function PackagePageMain() {
  return (
    <>
      <PackagePageProvider />
    </>
  );
}
