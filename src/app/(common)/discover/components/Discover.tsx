"use client";
import ArtworkCard from "./ArtworkCard";
import { useEffect, useState } from "react";
import { ArtworkDTO } from "@/types/market/ArtworkDTO";
import useAppContext from "@/hooks/useAppContext";
import Loading from "@/components/Loading/Loading";
import { CategoryManagementDTO } from "@/types/management/CategoryManagementDTO";
import artworkMarketApi from "@/api/market/artwork";
import categoryManagementApi from "@/api/management/category";
import { NextPage } from "next";
import { ArtworkStatus } from "@/enums/artwork";

export type DiscoverType = {
  numberOfItems?: number;
  creatorId?: string;
  uniqueArtworkIds?: string[];
};

const Discover: NextPage<DiscoverType> = ({
  numberOfItems,
  creatorId,
  uniqueArtworkIds,
}) => {
  const [artworkList, setArtworkList] = useState<ArtworkDTO[] | null>(null);
  const [displayArtworkList, setDisplayArtworkList] = useState<
    ArtworkDTO[] | null
  >(null);
  const { isLoading, enableLoading, disableLoading } = useAppContext();
  const [searchKey, setSearchKey] = useState<string>("");
  const [searchCreatorName, setSearchCreatorName] = useState<string>("");
  const [searchMessage, setSearchMessage] = useState<string>("");
  const [performSearchKey, setPerformSearchKey] = useState<boolean>(false);
  const [sortedPrice, setSortedPrice] = useState<string>("all");
  const [searchCateId, setSearchCateId] = useState<string>("all");
  const [searchCateIdOptions, setSearchCateIdOptions] = useState<
    CategoryManagementDTO[]
  >([]);
  const sortedPriceOptions = [
    { value: "all", name: "All" },
    { value: "lowtohigh", name: "Low to high" },
    { value: "hightolow", name: "High to low" },
  ];
  const renderArtwork = (
    searchkey: string = "",
    minPrice: number = 0,
    maxPrice: number = 0,
    discount: number = 0,
    status: string = "",
    cateID: string = ""
  ) => {
    enableLoading();
    artworkMarketApi
      .getAllArtworkMarketWithCondition(
        searchkey,
        minPrice,
        maxPrice,
        discount,
        status,
        cateID
      )
      .then((response) => {
        if (response.data.isSuccess && response.data.result) {
          setArtworkList(response.data.result);
          setDisplayArtworkList(response.data.result);
        } else {
          setArtworkList([]);
          setDisplayArtworkList([]);
        }
      })
      .catch((error) => {
        console.log(error);
        setArtworkList([]);
        setDisplayArtworkList([]);
      })
      .finally(() => {
        disableLoading();
      });
  };

  const renderCategory = () => {
    categoryManagementApi
      .getAllCategory()
      .then((response) => {
        if (
          response.data.isSuccess &&
          response.data.result &&
          response.data.result.isSuccess
        ) {
          setSearchCateIdOptions([
            {
              categoryId: "all",
              categoryName: "All",
            },
            ...response.data.result.result,
          ]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    renderCategory();
    renderArtwork();
  }, []);

  useEffect(() => {
    if (
      artworkList &&
      artworkList.length > 0 &&
      searchCateIdOptions.length > 0
    ) {
      const DISCOVER_CATEGORY_SORT = localStorage.getItem(
        "DISCOVER_CATEGORY_SORT"
      );
      if (DISCOVER_CATEGORY_SORT) {
        localStorage.removeItem("DISCOVER_CATEGORY_SORT");
        setSearchCateId(DISCOVER_CATEGORY_SORT);
      }
    }
  }, [artworkList, searchCateIdOptions]);

  const handleChangeSearchKey = (searchKey: string) => {
    setSearchKey(searchKey);
  };

  const handleChangeSearchCreatorName = (searchCreatorName: string) => {
    setSearchCreatorName(searchCreatorName);
  };

  const handleSearch = () => {
    if (artworkList) {
      setDisplayArtworkList(
        [...artworkList].filter((a) => {
          if (searchKey.trim() == "" && searchCreatorName.trim() == "") {
            return true;
          }
          if (searchKey.trim() == "") {
            return (
              searchCreatorName != "" &&
              a.creator.name
                .toLowerCase()
                .includes(searchCreatorName.trim().toLowerCase())
            );
          }
          if (searchCreatorName.trim() == "") {
            return (
              searchKey != "" &&
              a.artworkName
                .toLowerCase()
                .includes(searchKey.trim().toLowerCase())
            );
          }
          return (
            (searchKey != "" &&
              a.artworkName
                .toLowerCase()
                .includes(searchKey.trim().toLowerCase())) ||
            (searchCreatorName != "" &&
              a.creator.name
                .toLowerCase()
                .includes(searchCreatorName.trim().toLowerCase()))
          );
        })
      );
      if (searchKey.trim() != "" && searchCreatorName.trim() != "") {
        setSearchMessage(
          `All artworks found with name containing "${searchKey}" and creator related to "${searchCreatorName}"`
        );
      } else if (searchKey.trim() != "" && searchCreatorName.trim() == "") {
        setSearchMessage(
          `All artworks found with name containing "${searchKey}"`
        );
      } else if (searchKey.trim() == "" && searchCreatorName.trim() != "") {
        setSearchMessage(
          `All artworks found with creator related to "${searchCreatorName}"`
        );
      } else {
        setSearchMessage("");
      }
    }
  };

  useEffect(() => {
    if (sortedPrice == "all") {
      renderArtwork();
      handleSearch();
    }
  }, [sortedPrice]);

  if (!displayArtworkList) {
    return <></>;
  }

  return (
    <>
      {!numberOfItems ? (
        <>
          <Loading loading={isLoading} />
        </>
      ) : (
        <></>
      )}

      <div
        className={`min-w-full text-bg font-barlow flex max-w-full flex-1 flex-col items-end justify-start ${numberOfItems ? "gap-[0rem_0rem]" : "gap-[5.438rem_0rem]"} text-left text-[1.5rem]`}
      >
        <div className="flex min-w-full max-w-full flex-col items-end justify-start gap-[0.625rem_0rem]">
          {!numberOfItems ? (
            <>
              <div className="min-w-full mq1150:flex-wrap flex max-w-full flex-row items-end justify-start gap-[0rem_0.875rem] px-25">
                <div className="rounded-10xs border-gray-600 box-border flex min-w-[10.5rem] max-w-full flex-1 flex-row items-start justify-start gap-[0rem_1.563rem] overflow-hidden border-[1px] border-solid px-[1.188rem] py-[0.4rem]">
                  <img
                    className="relative h-[1.5rem] min-h-[1.5rem] w-[1.5rem] shrink-0 cursor-pointer overflow-hidden"
                    alt=""
                    src="/images/shop/DiscoverPage/search.svg"
                    onClick={() => {
                      setPerformSearchKey(true);
                      handleSearch();
                    }}
                  />
                  <input
                    className="font-barlow text-gray-500 box-border flex h-[1.344rem] w-full flex-col items-start justify-start bg-[transparent] px-[0rem] pb-[0rem] pt-[0.156rem] text-[1rem] leading-[160.5%] text-neutral-white [border:none] [outline:none]"
                    placeholder="Search by artwork name"
                    type="text"
                    value={searchKey}
                    onChange={(e) => {
                      setPerformSearchKey(false);
                      handleChangeSearchKey(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setPerformSearchKey(true);
                        handleSearch();
                      }
                    }}
                  />
                </div>

                {!creatorId ? (
                  <>
                    <div className="rounded-10xs border-gray-600 box-border flex min-w-[10.5rem] max-w-full flex-1 flex-row items-start justify-start gap-[0rem_1.563rem] overflow-hidden border-[1px] border-solid px-[1.188rem] py-[0.4rem]">
                      <img
                        className="relative h-[1.5rem] min-h-[1.5rem] w-[1.5rem] shrink-0 cursor-pointer overflow-hidden"
                        alt=""
                        src="/images/shop/DiscoverPage/search.svg"
                        onClick={() => {
                          setPerformSearchKey(true);
                          handleSearch();
                        }}
                      />
                      <input
                        className="font-barlow text-gray-500 box-border flex h-[1.344rem] w-full flex-col items-start justify-start bg-[transparent] px-[0rem] pb-[0rem] pt-[0.156rem] text-[1rem] leading-[160.5%] text-neutral-white [border:none] [outline:none]"
                        placeholder="Search by creator name"
                        type="text"
                        value={searchCreatorName}
                        onChange={(e) => {
                          setPerformSearchKey(false);
                          handleChangeSearchCreatorName(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setPerformSearchKey(true);
                            handleSearch();
                          }
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <></>
                )}

                {searchMessage != "" ? (
                  <div
                    onClick={() => {
                      setSearchCreatorName("");
                      setSearchKey("");
                      setSearchMessage("");
                      renderArtwork();
                    }}
                    className="cursor-pointer rounded-full text-black fw-bolder bg-white text-[1rem] flex max-w-full flex-row items-center justify-center overflow-hidden border-[0px] px-[1.5rem] py-[0.4rem]"
                  >
                    Clear Search
                  </div>
                ) : (
                  <></>
                )}

                <div>
                  <p className="mb-1 text-[1.1rem] text-white">Price</p>
                  <div className="rounded-10xs border-gray-600 relative flex min-w-[8rem] cursor-pointer flex-row items-start justify-center gap-[0rem_0.625rem] overflow-hidden border-[1px] border-solid bg-[transparent] px-[1rem] py-[0.469rem] text-[1rem]">
                    <select
                      value={sortedPrice}
                      className="relative cursor-pointer overflow-hidden border-0 bg-[transparent] text-[1rem]"
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

                <div>
                  <p className="mb-1 text-[1.1rem] text-white">Category</p>
                  <div className="rounded-10xs border-gray-600 relative flex min-w-[8rem] cursor-pointer flex-row items-start justify-center gap-[0rem_0.625rem] overflow-hidden border-[1px] border-solid bg-[transparent] px-[1rem] py-[0.469rem] text-[1rem]">
                    <select
                      value={searchCateId}
                      className="relative w-full cursor-pointer overflow-hidden border-0 bg-[transparent] text-[1rem]"
                      onChange={(e) => {
                        setSearchCateId(e.target.value);
                      }}
                    >
                      {searchCateIdOptions.map((option, index) => (
                        <option key={index} value={option.categoryId}>
                          {option.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              {searchMessage != "" ? (
                <>
                  <div className="min-w-full mq1150:flex-wrap flex max-w-full flex-row items-start justify-start gap-[0rem_0.875rem]  px-25">
                    <h1 className="text-[1.2rem]">{searchMessage}</h1>
                  </div>
                </>
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )}

          <div className="min-w-full mq800:gap-[0rem_2.25rem] mq450:gap-[0rem_1.125rem] flex max-w-full flex-row flex-wrap items-start justify-start gap-[0rem_4.563rem]  text-center text-[1.25rem]">
            <div className="mt-5 flex max-w-full flex-row flex-wrap items-start justify-start gap-[1rem_1rem]  pl-[3rem] text-neutral-white">
              {displayArtworkList && displayArtworkList.length == 0 ? (
                <h1 className="text-whitesmoke text-center">
                  No artworks found yet.
                </h1>
              ) : (
                <></>
              )}
              {displayArtworkList
                .filter((a) => {
                  if (a.status) {
                    return (
                      a.status.trim().toLowerCase() ==
                        ArtworkStatus.Available.trim().toLowerCase() ||
                      a.status.trim().toLowerCase() ==
                        ArtworkStatus.Sold.trim().toLowerCase()
                    );
                  }
                  return true;
                })
                .filter((a) => {
                  if (creatorId) {
                    return a.creator.id == creatorId;
                  }
                  return true;
                })
                .filter((a) => {
                  if (uniqueArtworkIds && uniqueArtworkIds.length > 0) {
                    return uniqueArtworkIds?.includes(a.artworkId);
                  }
                  if (uniqueArtworkIds && uniqueArtworkIds.length == 0) {
                    return false;
                  }
                  return true;
                })
                .sort((a, b) => {
                  if (sortedPrice == sortedPriceOptions[0].value) {
                    return -1;
                  }
                  if (sortedPrice == sortedPriceOptions[1].value) {
                    return (
                      a.price -
                      (a.price * a.discount) / 100 -
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
                .filter((artwork) => {
                  if (searchCateId == "all") {
                    return true;
                  }
                  return artwork.categoryID == searchCateId;
                })
                .map((artwork, index) => {
                  if (numberOfItems && index >= numberOfItems) {
                    return <></>;
                  }
                  return (
                    <ArtworkCard
                      key={index}
                      artworkId={artwork.artworkId}
                      maskGroup={
                        artwork.imageUrl
                          ? artwork.imageUrl.split("://example")[0]
                          : ""
                      }
                      artworkName={artwork.artworkName}
                      creatorkName={artwork.creator.name}
                      creatorId={artwork.creator.id}
                      logoFrame="/images/shop/DiscoverPage/ellipse-2@2x.png"
                      price={artwork.price}
                      discount={artwork.discount}
                      translateYNumber={
                        creatorId || uniqueArtworkIds
                          ? 20
                          : numberOfItems
                            ? index + 11
                            : (index % 4) + 1
                      }
                    />
                  );
                })}
              {/* <ArtworkCard
                maskGroup="https://imgv3.fotor.com/images/cover-photo-image/a-beautiful-girl-with-gray-hair-and-lucxy-neckless-generated-by-Fotor-AI.jpg"
                artworkName="Dreamy Virgin"
                artworkId="1"
                creatorkName="My creator"
                logoFrame="/images/shop/DiscoverPage/ellipse-2@2x.png"
                price={45.5}
                discount={2}
                translateYNumber={1}
              />
              <ArtworkCard
                maskGroup="https://mpost.io/wp-content/uploads/image-74-7.jpg"
                artworkName="Red devil"
                creatorkName="My creator"
                artworkId="1"
                logoFrame="/images/shop/DiscoverPage/ellipse-2@2x.png"
                price={45.5}
                discount={2}
                translateYNumber={2}
              />
              <ArtworkCard
                maskGroup="/images/shop/DiscoverPage/mask-group-7@2x.png"
                artworkName="Emo Girl"
                artworkId="1"
                creatorkName="My creator"
                logoFrame="/images/shop/DiscoverPage/ellipse-2@2x.png"
                price={45.5}
                discount={2}
                translateYNumber={3}
              />
              <ArtworkCard
                maskGroup="/images/shop/DiscoverPage/mask-group-5@2x.png"
                artworkName="Practice I"
                artworkId="1"
                creatorkName="My creator"
                logoFrame="/images/shop/DiscoverPage/ellipse-2@2x.png"
                price={45.5}
                discount={2}
                translateYNumber={4}
              />
              <ArtworkCard
                maskGroup="https://imgv3.fotor.com/images/cover-photo-image/a-beautiful-girl-with-gray-hair-and-lucxy-neckless-generated-by-Fotor-AI.jpg"
                artworkName="Dreamy Virgin"
                artworkId="1"
                creatorkName="My creator"
                logoFrame="/images/shop/DiscoverPage/ellipse-2@2x.png"
                price={45.5}
                discount={2}
                translateYNumber={1}
              />
              <ArtworkCard
                maskGroup="https://mpost.io/wp-content/uploads/image-74-7.jpg"
                artworkName="Red devil"
                creatorkName="My creator"
                artworkId="1"
                logoFrame="/images/shop/DiscoverPage/ellipse-2@2x.png"
                price={45.5}
                discount={2}
                translateYNumber={2}
              />
              <ArtworkCard
                maskGroup="/images/shop/DiscoverPage/mask-group-7@2x.png"
                artworkName="Emo Girl"
                artworkId="1"
                creatorkName="My creator"
                logoFrame="/images/shop/DiscoverPage/ellipse-2@2x.png"
                price={45.5}
                discount={2}
                translateYNumber={3}
              />
              <ArtworkCard
                maskGroup="/images/shop/DiscoverPage/mask-group-5@2x.png"
                artworkName="Practice I"
                artworkId="1"
                creatorkName="My creator"
                logoFrame="/images/shop/DiscoverPage/ellipse-2@2x.png"
                price={45.5}
                discount={2}
                translateYNumber={4}
              />
              <ArtworkCard
                maskGroup="https://imgv3.fotor.com/images/cover-photo-image/a-beautiful-girl-with-gray-hair-and-lucxy-neckless-generated-by-Fotor-AI.jpg"
                artworkName="Dreamy Virgin"
                artworkId="1"
                creatorkName="My creator"
                logoFrame="/images/shop/DiscoverPage/ellipse-2@2x.png"
                price={45.5}
                discount={2}
                translateYNumber={1}
              />
              <ArtworkCard
                maskGroup="https://mpost.io/wp-content/uploads/image-74-7.jpg"
                artworkName="Red devil"
                creatorkName="My creator"
                artworkId="1"
                logoFrame="/images/shop/DiscoverPage/ellipse-2@2x.png"
                price={45.5}
                discount={2}
                translateYNumber={2}
              />
              <ArtworkCard
                maskGroup="/images/shop/DiscoverPage/mask-group-7@2x.png"
                artworkName="Emo Girl"
                artworkId="1"
                creatorkName="My creator"
                logoFrame="/images/shop/DiscoverPage/ellipse-2@2x.png"
                price={45.5}
                discount={2}
                translateYNumber={3}
              />
              <ArtworkCard
                maskGroup="/images/shop/DiscoverPage/mask-group-5@2x.png"
                artworkName="Practice I"
                artworkId="1"
                creatorkName="My creator"
                logoFrame="/images/shop/DiscoverPage/ellipse-2@2x.png"
                price={45.5}
                discount={2}
                translateYNumber={4}
              /> */}
            </div>
          </div>
        </div>
        <div className="box-border flex w-full max-w-full justify-center px-[11.25rem] py-[0rem]"></div>
      </div>
    </>
  );
};

export default Discover;
