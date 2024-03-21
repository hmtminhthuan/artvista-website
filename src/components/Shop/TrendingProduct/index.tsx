"use client";
import Discover from "@/app/(common)/discover/components/Discover";
import { PATH_SHOP } from "@/routes/paths";
import { useRouter } from "next/navigation";

const TrendingProduct = (props: {}) => {
  const router = useRouter();
  return (
    <section className="text-29xl text-whte font-barlow mq450:pb-10 mq450:box-border mq750:gap-[51px_0px] mq750:pb-[61px] mq750:box-border box-border flex w-[1327px] max-w-full flex-col items-start justify-start gap-[51px_0px] px-5 pb-[94px] pt-0 text-left">
      <div className="box-border flex w-[1060px] max-w-full flex-row items-start justify-start px-[7px] py-0">
        <div className="flex max-w-full flex-1 flex-col items-start justify-start gap-[16px_0px]">
          <h1 className="mt-6 font-inherit mq450:text-10xl mq750:text-19xl relative m-0 font-semibold text-inherit">
            Trending Sales
          </h1>
          <div className="mq450:text-lg mq450:leading-[28px] relative self-stretch text-3xl capitalize leading-[160%]">
            Checkout our weekly updated trending sales.{" "}
            <span
              className="header_links_hover cursor-pointer fw-bolder"
              style={{ color: "#A259FF" }}
              onClick={() => {
                router.push(PATH_SHOP.general.discover);
              }}
            >
              Explore More {">"}
            </span>
          </div>
        </div>
      </div>
      <div className="ms-10">
        <Discover numberOfItems={3} />
      </div>
    </section>
  );
};

export default TrendingProduct;
