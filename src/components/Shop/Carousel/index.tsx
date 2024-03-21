import Link from "next/link";
import CarouselContent from "../CarouselContent";

const Carousel = (props: {}) => {
  return (
    <section className="mq450:gap-[99px_0px] mq750:gap-[99px_0px] mq750:pt-5 mq750:pb-[88px] mq750:box-border mq1100:pt-[31px] mq1100:pb-[135px] mq1100:box-border relative box-border flex max-w-full flex-col items-center justify-start gap-[99px_0px] self-stretch bg-neutral-dark pb-52 pl-5 pr-[22px] pt-[0px]">
      <div className="box-border flex max-w-full flex-row items-start justify-start py-0 pl-0 pr-0.5">
        <div className="absolute right-[-150.5px] top-[-145px] z-[0] !m-[0] flex h-[297.8px] w-[292.5px] items-center justify-center">
          <img
            className="absolute left-[-200px] top-[200px] h-full w-full object-contain [transform:scale(2.368)]"
            alt=""
            src="/images/shop/HomePage/Carousel/group-34363.svg"
          />
        </div>
        <CarouselContent />
      </div>
      <div className="absolute bottom-[-126px] left-[-150px] !m-[0] h-[1108px] w-[676px]">
        <img
          className="absolute left-[0px] top-[0px] h-[982px] w-[413px] overflow-hidden"
          alt=""
          src="/images/shop/HomePage/Carousel/group.svg"
        />
        <div className="absolute left-[399px] top-[826px] z-[1] h-[282px] w-[277px] rounded-[50%] bg-primary-colour [filter:blur(319.37px)]" />
      </div>
    </section>
  );
};

export default Carousel;
