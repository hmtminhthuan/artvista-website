"use client";

import { PATH_SHOP } from "@/routes/paths";
import { useRouter } from "next/navigation";
import "./index.scss";

const CarouselContent = (props: {}) => {
  const router = useRouter();
  return (
    <div className="font-barlow mq1250:flex-wrap flex max-w-full flex-row items-start justify-start gap-[0px_20px] text-left text-91xl text-neutral-white">
      <img
        className="mr-3 carousel-image carousel-image-1 relative z-[1] h-[564px] min-h-[564px] w-[273px] shrink-0 overflow-hidden object-cover"
        loading="lazy"
        alt=""
        src="/images/shop/HomePage/Carousel/frame-162791@2x.png"
      />
      <div className="box-border flex h-[564px] w-[292px] flex-col items-start justify-start py-0 pl-0 pr-[19px]">
        <img
          className="carousel-image carousel-image-2 relative max-h-full max-w-full flex-1 self-stretch overflow-hidden object-cover"
          alt=""
          src="/images/shop/HomePage/Carousel/frame-162791-1@2x.png"
        />
      </div>
      <div className="mq750:gap-[20px_0px] flex max-w-full flex-col items-start justify-center gap-[20px_0px]">
        <h1 className="home-carousel-animate-charcter font-inherit mq450:text-14xl mq750:text-36xl relative m-0 inline-block w-[581px] text-inherit font-semibold">
          <p className="m-0" style={{ fontSize: "80px" }}>
            Buy and Sell
          </p>
          <p className="m-0" style={{ fontSize: "80px" }}>
            Digital Arts
          </p>
        </h1>
        <div className=" mq450:text-lgi mq450:leading-[28px] relative inline-block w-[580px] text-5xl leading-[145%] tracking-[0.02em]">{`The world’s largest online marketplace of online digital art `}</div>
        <b
          onClick={() => {
            router.push(PATH_SHOP.general.discover);
          }}
          className="header_links_hover_explore home-carousel-animate-charcter header_links_hover mq450:text-base relative cursor-pointer text-xl"
        >
          Explore More Here
        </b>
        <div className="mq450:flex-wrap flex w-[388px] max-w-full flex-row items-start justify-between gap-[20px] text-13xl text-whte">
          <div className="flex flex-col items-start justify-start gap-[8px_0px]">
            <div className="mq450:text-lgi mq750:text-7xl relative font-semibold">
              Amazing
            </div>
            <div className="mq450:text-base relative text-xl font-medium">
              Digital art file
            </div>
          </div>
          <div className="flex flex-col items-start justify-start gap-[8px_0px]">
            <div className="mq450:text-lgi mq750:text-7xl relative font-semibold">
              Best
            </div>
            <div className="mq450:text-base relative text-xl font-medium">
              Art Seller
            </div>
          </div>
          <div className="flex flex-col items-start justify-start gap-[8px_0px]">
            <b className="mq450:text-lgi mq750:text-7xl relative">Fast</b>
            <div className="mq450:text-base relative text-xl font-medium">
              Payment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselContent;
