import { Metadata } from "next";
import WishlistPageProvider from "./wishlistPageProvider";

export const metadata: Metadata = {
  title: "Artvista",
  description: "This is Favorite Art Page for Artvista",
};

export default function WishlistPage() {
  return (
    <>
      <WishlistPageProvider />
    </>
  );
}
