"use client";

import { PATH_AUTH, PATH_SHOP } from "@/routes/paths";
import { useRouter } from "next/navigation";
import "./index.scss";

const FooterShop = (props: {}) => {
  const router = useRouter();

  return (
    <footer className="text-13xl text-input-field-text font-barlow mq750:gap-[52px_0px] mq750:pt-[42px] mq750:pb-[47px] mq750:box-border mq1250:pl-[34px] mq1250:box-border relative box-border flex max-w-full flex-col items-center justify-start gap-[52px_0px] self-stretch overflow-hidden pb-[50px] pl-[68px] pr-5 pt-16 text-left">
      <img
        className="absolute right-[-311.5px] top-[-312px] !m-[0] h-[875.2px] w-[667.5px] object-contain"
        loading="lazy"
        alt=""
        src="/images/shop/HomePage/Footer/group-34356@2x.png"
      />
      <div className="box-border flex w-[1308px] max-w-full flex-row items-start justify-start pb-[22px] pl-0 pr-[29px] pt-0">
        <div className="mq450:gap-[0px_70px] mq750:gap-[0px_70px] mq1250:flex-wrap flex max-w-full flex-1 flex-row items-start justify-start gap-[0px_70px]">
          <div className="mq450:gap-[34px_0px] mq750:min-w-full mq1250:flex-1 flex min-w-[393px] max-w-full flex-col items-start justify-start gap-[34px_0px]">
            <div className="text-neutral-white flex flex-row items-center justify-center">
              <h2 className="font-inherit mq450:text-lgi mq750:text-7xl relative m-0 font-semibold text-inherit">
                Artvista
              </h2>
            </div>
            <div className="relative inline-block w-[393px] text-base leading-[24px]">
              The world’s largest online marketplace of online digital art.{" "}
            </div>
            <div className="flex flex-row items-center justify-center gap-[0px_20px]">
              <img
                className="relative h-5 min-h-[20px] w-5 cursor-pointer"
                alt=""
                src="/images/shop/HomePage/Footer/vector-6.svg"
              />
              <img
                className="relative h-5 min-h-[20px] w-5 cursor-pointer"
                alt=""
                src="/images/shop/HomePage/Footer/vector-7.svg"
              />
              <img
                className="relative h-5 min-h-[20px] w-5 cursor-pointer"
                alt=""
                src="/images/shop/HomePage/Footer/vector-8.svg"
              />
            </div>
          </div>
          <div
            style={{ transform: "translateX(-20rem)" }}
            className="text-neutral-white mq750:flex-wrap mq750:min-w-full z-[1] flex min-w-[530px] max-w-full flex-1 flex-row items-start justify-end gap-[20px] text-xl"
          >
            <div className="flex flex-col items-start justify-start gap-[22px_0px]">
              <div className="mq450:text-base mq450:leading-[22px] relative font-semibold leading-[27px]">
                Links
              </div>
              <div className="text-input-field-text flex flex-col items-start justify-start gap-[15px_0px] text-lg">
                <div
                  className="relative leading-[24px] footer_links"
                  onClick={() => {
                    router.push(PATH_SHOP.general.discover);
                  }}
                >
                  Discover
                </div>
                <div
                  className="relative leading-[24px] footer_links"
                  onClick={() => {
                    router.push(PATH_SHOP.general.package);
                  }}
                >
                  Package
                </div>
                <div
                  className="relative leading-[24px] footer_links"
                  onClick={() => {
                    router.push(PATH_AUTH.signup);
                  }}
                >
                  Sign Up
                </div>
                <div
                  className="relative leading-[24px] footer_links"
                  onClick={() => {
                    router.push(PATH_AUTH.signin);
                  }}
                >
                  Sign In
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="border-grey text-neutral-white font-para2-semi-14 relative box-border
      items-start justify-start self-stretch border-t-[1px] border-solid py-0 pl-0 text-center text-sm opacity-[0.3]"
      >
        <div className="relative pt-5 font-semibold leading-[21px]">
          © Artvista @ All Rights Reserved
        </div>
      </div>
    </footer>
  );
};

export default FooterShop;
