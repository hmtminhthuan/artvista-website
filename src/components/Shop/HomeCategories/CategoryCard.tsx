import type { NextPage } from "next";

export type CategoryCardType = {
  image?: string;
  imagePlaceholder?: string;
  categoryName?: string;
};

const CategoryCard: NextPage<CategoryCardType> = ({
  image,
  imagePlaceholder,
  categoryName,
}) => {
  return (
    <div className="bg-darkslategray text-neutral-white font-barlow box-border flex w-[294px] flex-col items-center justify-start gap-[24px_0px] rounded-[24.51px] px-0 pb-[31px] pt-0 text-left text-8xl">
      <div className="flex flex-col items-start justify-start self-stretch rounded-b-none rounded-t-[24.51px]">
        <div className="bg-gray-100 z-[1] flex flex-row items-center justify-center self-stretch rounded-b-none rounded-t-[24.51px] pb-[87px] pl-[21px] pr-5 pt-[85px] [backdrop-filter:blur(18.39px)]">
          <img
            className="relative h-[122.6px] w-[122.6px]"
            loading="lazy"
            alt=""
            src={image}
          />
        </div>
        <img
          className="relative mt-[-294px] h-[294.2px] w-[294.2px] object-cover"
          alt=""
          src={imagePlaceholder}
        />
      </div>
      <h3 className="font-inherit mq450:text-3xl mq450:leading-[30px] relative m-0 inline-block w-[220px] font-semibold capitalize leading-[140%] text-inherit">
        {categoryName}
      </h3>
    </div>
  );
};

export default CategoryCard;
