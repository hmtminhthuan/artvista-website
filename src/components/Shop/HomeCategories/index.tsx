"use client";
import categoryManagementApi from "@/api/management/category";
import CategoryCard from "./CategoryCard";
import { useEffect, useState } from "react";
import { CategoryManagementDTO } from "@/types/management/CategoryManagementDTO";
import { useRouter } from "next/navigation";
import { PATH_SHOP } from "@/routes/paths";

const HomeCategories = (props: {}) => {
  const iconOptions = [
    "paintbrush.svg",
    "swatches.svg",
    "musicnotes.svg",
    "camera.svg",
    "basketball.svg",
    "planet.svg",
    "image-placeholder-4@2x.png",
    "image-placeholder-4@2x.png",
  ];
  const [categoryList, setCategoryList] = useState<CategoryManagementDTO[]>([]);
  const router = useRouter();

  const renderCategory = () => {
    categoryManagementApi
      .getAllCategory()
      .then((response) => {
        if (
          response.data.isSuccess &&
          response.data.result &&
          response.data.result.isSuccess
        ) {
          setCategoryList(response.data.result.result);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
  };

  useEffect(() => {
    renderCategory();
  }, []);

  if (!categoryList) {
    return <></>;
  }

  return (
    <section className="text-19xl text-neutral-white font-barlow mq450:gap-[72px_0px] mq750:gap-[72px_0px] mq750:pb-[20px] mq750:box-border mq1100:pb-[20px] mq1100:box-border box-border flex w-[1327px] max-w-full flex-col items-start justify-start gap-[72px_0px] px-5 pb-[20px] pt-0 text-left">
      <div>
        <h1 className="mt-6 font-inherit mq450:text-10xl mq750:text-19xl relative m-0 font-semibold text-inherit">
          Categories
        </h1>
        <div className="mt-3 mq450:text-lg mq450:leading-[28px] relative self-stretch text-3xl capitalize leading-[160%]">
          Let's spcify which topic you are interested in.
        </div>
      </div>
      <div className="mq750:gap-[37px_32.15px] flex min-h-[811px] flex-row flex-wrap items-start justify-center gap-[37px_32.15px] self-stretch text-8xl">
        {categoryList.map((category, index) => {
          return (
            <div
              key={index}
              className="cursor-pointer"
              onClick={() => {
                localStorage.setItem(
                  "DISCOVER_CATEGORY_SORT",
                  category.categoryId
                );
                router.push(PATH_SHOP.general.discover);
              }}
            >
              <CategoryCard
                imagePlaceholder={`/images/shop/HomePage/Categories/image-placeholder${index >= 1 ? `-${index}` : ""}@2x.png`}
                image={`/images/shop/HomePage/Categories/${iconOptions[index]}`}
                categoryName={category.categoryName}
              />
            </div>
          );
        })}

        {/* <CategoryCard
          imagePlaceholder="/images/shop/HomePage/Categories/image-placeholder-1@2x.png"
          image="/images/shop/HomePage/Categories/swatches.svg"
          categoryName="Game assets"
        />

        <CategoryCard
          imagePlaceholder="/images/shop/HomePage/Categories/image-placeholder-2@2x.png"
          image="/images/shop/HomePage/Categories/musicnotes.svg"
          categoryName="Audio"
        />

        <CategoryCard
          imagePlaceholder="/images/shop/HomePage/Categories/image-placeholder-3@2x.png"
          image="/images/shop/HomePage/Categories/camera.svg"
          categoryName="Photography"
        />

        <CategoryCard
          imagePlaceholder="/images/shop/HomePage/Categories/image-placeholder-6@2x.png"
          image="/images/shop/HomePage/Categories/basketball.svg"
          categoryName="Game art"
        />

        <CategoryCard
          imagePlaceholder="/images/shop/HomePage/Categories/image-placeholder-7@2x.png"
          image="/images/shop/HomePage/Categories/planet.svg"
          categoryName="Illustration"
        />
        <CategoryCard
          image="/images/shop/HomePage/Categories/videocamera.svg"
          imagePlaceholder="/images/shop/HomePage/Categories/image-placeholder-4@2x.png"
          categoryName="Animation"
        />
        <CategoryCard
          image="/images/shop/HomePage/Categories/magicwand.svg"
          imagePlaceholder="/images/shop/HomePage/Categories/image-placeholder-5@2x.png"
          categoryName="Modeling"
        /> */}
      </div>
    </section>
  );
};

export default HomeCategories;
