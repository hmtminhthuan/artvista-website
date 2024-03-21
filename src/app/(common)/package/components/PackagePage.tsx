"use client";
import { useEffect, useState } from "react";
import useAppContext from "@/hooks/useAppContext";
import Loading from "@/components/Loading/Loading";
import { NextPage } from "next";
import { PackageMarketDTO } from "@/types/market/PackageMarketDTO";
import packagePurchaseMarketApi from "@/api/market/packagePurchase";
import PackageCard from "./PackageCard";

export type PackagePageType = {};

const PackagePage: NextPage<PackagePageType> = ({}) => {
  const [packageList, setPackageList] = useState<PackageMarketDTO[]>([]);
  const { isLoading, enableLoading, disableLoading } = useAppContext();
  const [sortedPrice, setSortedPrice] = useState<string>("all");
  const sortedPriceOptions = [
    { value: "all", name: "All" },
    { value: "lowtohigh", name: "Low to high" },
    { value: "hightolow", name: "High to low" },
  ];
  const [sortedMaximum, setSortedMaximum] = useState<string>("all");
  const sortedMaximumOptions = [
    { value: "all", name: "All" },
    { value: "lowtohigh", name: "Low to high" },
    { value: "hightolow", name: "High to low" },
  ];

  const renderPackge = () => {
    packagePurchaseMarketApi
      .getAllAvailablePackage()
      .then((response) => {
        if (response.data.isSuccess && response.data.result) {
          setPackageList(response.data.result);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        disableLoading();
      });
  };

  useEffect(() => {
    enableLoading();
    renderPackge();
  }, []);

  useEffect(() => {
    if (sortedPrice == "all") {
      enableLoading();
      renderPackge();
    }
  }, [sortedPrice]);

  useEffect(() => {
    if (sortedMaximum == "all") {
      enableLoading();
      renderPackge();
    }
  }, [sortedMaximum]);

  return (
    <>
      <Loading loading={isLoading} />
      <div
        className={`min-w-full text-bg font-barlow flex max-w-full flex-1 flex-col items-end justify-start gap-[5.438rem_0rem] text-left text-[1.5rem]`}
      >
        <div className="flex min-w-full max-w-full flex-col items-end justify-start gap-[0.625rem_0rem]">
          <div className="w-full min-w-full mq1150:flex-wrap flex max-w-full flex-row items-end justify-start gap-[0rem_0.875rem] px-25">
            <div className="w-full">
              <p className="mb-1 text-[1.1rem] text-white">Price</p>
              <div className="w-full rounded-10xs border-gray-600 relative flex min-w-[8rem] cursor-pointer flex-row items-start justify-center gap-[0rem_0.625rem] overflow-hidden border-[1px] border-solid bg-[transparent] px-[1rem] py-[0.469rem] text-[1rem]">
                <select
                  value={sortedPrice}
                  className="w-full relative cursor-pointer overflow-hidden border-0 bg-[transparent] text-[1rem]"
                  onChange={(e) => {
                    setSortedPrice(e.target.value);
                  }}
                >
                  {sortedPriceOptions.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="w-full">
              <p className="mb-1 text-[1.1rem] text-white">Maximum Artworks</p>
              <div className="w-full rounded-10xs border-gray-600 relative flex min-w-[8rem] cursor-pointer flex-row items-start justify-center gap-[0rem_0.625rem] overflow-hidden border-[1px] border-solid bg-[transparent] px-[1rem] py-[0.469rem] text-[1rem]">
                <select
                  value={sortedMaximum}
                  className="w-full relative cursor-pointer overflow-hidden border-0 bg-[transparent] text-[1rem]"
                  onChange={(e) => {
                    setSortedMaximum(e.target.value);
                  }}
                >
                  {sortedMaximumOptions.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="min-w-full mq800:gap-[0rem_2.25rem] mq450:gap-[0rem_1.125rem] flex max-w-full flex-row flex-wrap items-start justify-start gap-[0rem_4.563rem]  text-center text-[1.25rem]">
            <div className="w-full flex max-w-full flex-row flex-wrap items-start justify-start gap-[1rem_1rem]">
              <div
                style={{ borderRadius: "10px" }}
                className="px-[3rem] justify-around w-full slate-950 pricing-gd-left pric-7-1 text-neutral-white flex flex-row flex-wrap"
              >
                {packageList
                  .sort((a, b) => {
                    if (sortedPrice == sortedPriceOptions[0].value) {
                      return -1;
                    }
                    if (sortedPrice == sortedPriceOptions[1].value) {
                      return (
                        a.maximumArtworks -
                        (b.price - (b.price * b.discount) / 100)
                      );
                    }
                    if (sortedPrice == sortedPriceOptions[2].value) {
                      return (
                        b.price -
                        (b.price * b.discount) / 100 -
                        (a.price - (a.price * a.discount) / 100)
                      );
                    }
                    return -1;
                  })
                  .sort((a, b) => {
                    if (sortedMaximum == sortedMaximumOptions[0].value) {
                      return -1;
                    }
                    if (sortedMaximum == sortedMaximumOptions[1].value) {
                      return a.maximumArtworks - b.maximumArtworks;
                    }
                    if (sortedMaximum == sortedMaximumOptions[2].value) {
                      return b.maximumArtworks - a.maximumArtworks;
                    }
                    return -1;
                  })
                  .map((pkg, index) => {
                    const {
                      packageId,
                      packageName,
                      maximumArtworks,
                      price,
                      discount,
                      packageTime,
                    } = pkg;
                    return (
                      <PackageCard
                        key={index}
                        packageId={packageId}
                        packageName={packageName}
                        maximumArtworks={maximumArtworks}
                        price={price}
                        discount={discount}
                        packageTime={packageTime}
                      />
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PackagePage;
