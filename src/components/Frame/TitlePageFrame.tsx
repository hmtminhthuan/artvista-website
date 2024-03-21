"use client";
import type { NextPage } from "next";

export type TitlePageFrameType = {
  title?: string;
  subtitle?: string;
};

const TitlePageFrame: NextPage<TitlePageFrameType> = ({ title, subtitle }) => {
  return (
    <>
      <div className="h-[15rem] w-screen relative bg-neutral-dark overflow-hidden flex flex-col items-end justify-start box-border gap-[2.306rem] tracking-[normal] text-left text-[4.231rem] text-neutral-white font-barlow mq450:gap-[1.125rem_2.306rem]">
        <div className="w-full self-stretch flex flex-row items-start justify-start pt-[0rem] px-[0rem] pb-[1.656rem] box-border max-w-full">
          <div className="w-full overflow-hidden flex flex-col items-center justify-start px-[1.25rem] py-[2rem] pb-[2.5rem] box-border gap-[1rem] bg-[url('/images/frame/title_page_frame.png')] bg-cover bg-no-repeat bg-[top] max-w-full">
            <div className="w-full flex flex-row items-start justify-center max-w-full">
              <div className="relative font-semibold">{title}</div>
            </div>
            <div className="relative text-[2.381rem] inline-block max-w-full mq450:text-[1.438rem] mq1050:text-[1.875rem]">
              {subtitle}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TitlePageFrame;
