import { Metadata } from "next";
import OrderPageProvider from "./orderPageProvider";

export const metadata: Metadata = {
  title: "Artvista",
  description: "This is Order Page for Artvista",
};

export default function UserOrderPage() {
  return (
    <>
      <OrderPageProvider />
    </>
  );
}
