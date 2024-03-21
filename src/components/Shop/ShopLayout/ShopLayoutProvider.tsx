"use client";

import ChattingOfCustomer from "@/components/Chatting/Chatting";
import HeaderShop from "../HeaderShop";
import FooterShop from "../FooterShop";
import useAppContext from "@/hooks/useAppContext";

export default function ShopLayoutComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    chattingOfCustomer,
    chattingOfCustomerId,
    chattingOfCustomerArtworkId,
  } = useAppContext();

  return (
    <>
      <div className="min-h-screen mq450:gap-[74px_0px] mq750:gap-[74px_0px] relative flex w-full flex-col items-center justify-start gap-[20px_0px] overflow-hidden bg-neutral-dark tracking-[normal]">
        <ChattingOfCustomer
          isOpen={chattingOfCustomer}
          chattingOfCustomerId={chattingOfCustomerId}
          artworkIdInput={chattingOfCustomerArtworkId}
        />
        <HeaderShop />
        <main>{children}</main>
        <FooterShop />
      </div>
    </>
  );
}
