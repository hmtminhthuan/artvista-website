"use client";
import artworkManagementApi from "@/api/management/artwork";
import categoryManagementApi from "@/api/management/category";
import interactionManagementApi from "@/api/management/interaction";
import postManagementApi from "@/api/management/post";
import artworkMarketApi from "@/api/market/artwork";
import orderMarketApi from "@/api/market/order";
import wishlistMarketApi from "@/api/market/wishlist";
import Loading from "@/components/Loading/Loading";
import { Role } from "@/enums/accountRole";
import { OrderStatus } from "@/enums/order";
import useAppContext from "@/hooks/useAppContext";
import { PATH_CREATOR, PATH_SHOP } from "@/routes/paths";
import { InteractionManagementDTO } from "@/types/management/InteractionManagementDTO";
import { PostManagementDTO } from "@/types/management/PostManagementDTO";
import { ArtworkDTO } from "@/types/market/ArtworkDTO";
import { formatDate_YYYY_MMMM_DD } from "@/utils/formatDate";
import { formatPrice } from "@/utils/formatPrice";
import sweetAlert from "@/utils/sweetAlert";
import { getUserInfo, getUserInfoId } from "@/utils/utils";
import { Watermark } from "antd";
import { useParams, useRouter } from "next/navigation";
import { MouseEvent, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { v4 } from "uuid";

const ArtworkDetail = (props: {}) => {
  const params = useParams();
  const artworkId = params.artworkId as string;
  const [artworkDetail, setArtworkDetail] = useState<ArtworkDTO | null>(null);
  const [post, setPost] = useState<PostManagementDTO | null>(null);
  const [artworkCategory, setArtworkCategory] = useState<any>(null);
  const [paymentUrl, setPaymentUrl] = useState<string>("");
  const [isPurchased, setIsPurchased] = useState<boolean>(false);
  const [allInteractionOfPostQuantity, setAllInterctionOfPostQuantity] =
    useState<number>(0);
  const [allInteractionList, setAllInteractionList] = useState<
    InteractionManagementDTO[]
  >([]);
  const [interactionOfPost, setInteractionOfPost] = useState<
    InteractionManagementDTO[]
  >([]);
  const [interactionOfUser, setInteractionOfUser] = useState<
    InteractionManagementDTO[] | null
  >(null);
  const [finishRendering, setFinishRendering] = useState<boolean>(false);
  const {
    isLoading,
    enableLoading,
    disableLoading,
    enableChattingOfCustomer,
    disableChattingOfCustomer,
  } = useAppContext();
  const router = useRouter();

  const [uniqueArtworkIds, setUniqueArtworkIds] = useState<any>(null);

  const renderWishlist = () => {
    wishlistMarketApi
      .getWishList(getUserInfoId())
      .then((response) => {
        if (response.data.isSuccess && response.data.result) {
          const uniqueArtworkIds = Array.from(
            new Set(
              response.data.result.details.map(
                (detail: any) => detail.artworkId
              )
            )
          );
          if (response.data.result) {
            setUniqueArtworkIds(uniqueArtworkIds);
          } else {
            setUniqueArtworkIds(undefined);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const renderArtworkDetail = () => {
    enableLoading();
    artworkMarketApi
      .getAllArtworkMarketWithCondition()
      .then((response) => {
        if (response.data.isSuccess && response.data.result) {
          setArtworkDetail(
            response.data.result.filter(
              (artwork: ArtworkDTO) => artwork.artworkId == artworkId
            )[0]
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
    // artworkManagementApi
    //   .getAllArtwork()
    //   .then((response) => {
    //     if (
    //       response.data.isSuccess &&
    //       response.data.result &&
    //       response.data.result.isSuccess
    //     ) {
    //       setArtworkDetail(
    //         response.data.result.result.filter(
    //           (artwork: ArtworkDTO) => artwork.artworkId == artworkId
    //         )[0]
    //       );
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
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
          if (artworkDetail != null) {
            setArtworkCategory(
              response.data.result.result.filter(
                (category: any) =>
                  category.categoryId == artworkDetail?.categoryID ||
                  category.categoryId == artworkDetail?.categoryId
              )[0]
            );
          }
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        disableLoading();
      });
  };

  const getallInteractionOfPostQuantity = () => {
    interactionManagementApi
      .getAllInteraction()
      .then((response) => {
        if (
          response.data.isSuccess &&
          response.data.result &&
          response.data.result.isSuccess
        ) {
          setAllInteractionList(response.data.result.result);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getInteractionOfPost = (postId: string) => {
    interactionManagementApi
      .getInteractionByPostID(postId)
      .then((response) => {
        if (
          response.data.isSuccess &&
          response.data.result &&
          response.data.result.isSuccess
        ) {
          setInteractionOfPost(
            response.data.result.result.filter(
              (x: any) => x.like > 0 || x.comments != ""
            )
          );
          setAllInterctionOfPostQuantity(
            response.data.result.result.filter((x: any) => x.like > 0).length
          );

          var userId = getUserInfoId();
          if (userId) {
            setInteractionOfUser(
              response.data.result.result.filter(
                (x: any) => (x.id = userId && (x.like > 0 || x.comments != ""))
              )
            );
          }
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        getallInteractionOfPostQuantity();
      });
  };

  const renderPost = () => {
    var postId = "";
    postManagementApi
      .getAllPost()
      .then((response) => {
        if (
          response.data.isSuccess &&
          response.data.result &&
          response.data.result.isSuccess &&
          response.data.result.result
        ) {
          var post = response.data.result.result.filter(
            (post: PostManagementDTO) => post?.artworkId == artworkId
          )[0];
          setPost(post);
          postId = post.postId;
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        getInteractionOfPost(postId);
        disableLoading();
      });
  };

  const checkIsPurchasedYet = (artworkId: string) => {
    setFinishRendering(false);
    enableLoading();
    const userLoginId = getUserInfoId();
    if (userLoginId) {
      var orderList: any[] = [];
      orderMarketApi
        .getHistoryOrder(userLoginId)
        .then((response) => {
          if (response.data.isSuccess && response.data.result) {
            orderList = response.data.result;
            var index = 0;
            orderList.forEach((order) => {
              index++;
              if (order.orderStatus == OrderStatus.SUCCESS_PAY_VNPAY) {
                orderMarketApi
                  .getOrderByOrderId(order.orderId)
                  .then((response) => {
                    if (
                      response.data.result.orderDetails[0].artworkId
                        .artworkId == artworkId
                    ) {
                      setIsPurchased(true);
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  })
                  .finally(() => {
                    if (index == orderList.length) {
                      setFinishRendering(true);
                      disableLoading();
                    }
                  });
              }
            });
          } else {
            setFinishRendering(true);
            disableLoading();
          }
        })
        .catch((err) => {
          console.log(err);
          setFinishRendering(true);
        })
        .finally(() => {
          setFinishRendering(true);
          disableLoading();
        });
    }
  };

  const handleLikePost = () => {
    setAllInterctionOfPostQuantity((prev) => prev + 1);
    var interactionList = [...allInteractionList];
    const id =
      (
        parseInt(
          interactionList.reduce((max, current) =>
            max.id > current.id ? max : current
          ).interactionId
        ) + 1
      ).toString() + v4();

    interactionManagementApi
      .createInteraction(
        id,
        getUserInfoId(),
        new Date().toISOString(),
        1,
        "",
        post ? post.postId : ""
      )
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        renderPost();
      });
  };

  const handleUnLikePost = () => {
    setAllInterctionOfPostQuantity((prev) => prev - 1);
    if (interactionOfUser?.filter((x) => x.like > 0)[0]) {
      var interaction = interactionOfUser?.filter((x) => x.like > 0)[0];
      interactionManagementApi
        .deleteInteraction(interaction.interactionId)
        .then((response) => {})
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          renderPost();
        });
    }
  };

  const handleRemoveArtworkFromWishlist = (
    userID: string,
    artworkId: string
  ) => {
    wishlistMarketApi
      .removeArtWorkFromWishList(userID, artworkId)
      .then((res) => {
        console.log(res);
        sweetAlert.alertInfo(
          "Remove from favorites successfully",
          "",
          2200,
          28
        );
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        renderWishlist();
      });
  };

  const handleAddArtworkFromWishlist = (userID: string, artworkId: string) => {
    wishlistMarketApi
      .addArtWorkToWishList(userID, artworkId)
      .then((res) => {
        console.log(res);
        sweetAlert.alertSuccess("Add to favorites successfully", "", 2200, 25);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        renderWishlist();
      });
  };

  const handleCreateOrderPurcahseNow = (total: number, artwork: ArtworkDTO) => {
    enableLoading();
    const orderId = v4();
    orderMarketApi
      .createOrder(orderId, total, artwork)
      .then((response) => {
        console.log(response);
        if (response.data.isSuccess) {
          orderMarketApi
            .CreatePaymentUrl(
              orderId,
              getUserInfoId(),
              "1",
              OrderStatus.PENDING_PAY_VNPAY,
              total
            )
            .then((response) => {
              if (response.data.url && response.data.url != "") {
                disableLoading();
                Swal.fire({
                  icon: "info",
                  title: `Create Purchase Request Successfully`,
                  html: `Please checkout immediately to get your favorite art.</br>
                  After checkout, please click the button below to continue.`,
                  timerProgressBar: true,
                  showCancelButton: false,
                  showConfirmButton: true,
                  confirmButtonText: "Click here to continue",
                  showLoaderOnConfirm: true,
                  allowOutsideClick: false,
                })
                  .then((result) => {
                    if (artworkDetail) {
                      checkIsPurchasedYet(artworkDetail?.artworkId);
                    }
                  })
                  .catch((err) => {});
                setPaymentUrl(response.data.url);
                window.open(response.data.url);
              } else {
                sweetAlert.alertFailed(
                  "Request to pay failed",
                  "Please try again later. We are sorry.",
                  3000,
                  30
                );
              }
            });
        }
      })
      .catch((err) => {
        console.log(err);
        sweetAlert.alertFailed(
          "Request to pay failed",
          "Please try again later. We are sorry.",
          3000,
          30
        );
      })
      .finally(() => {
        disableLoading();
      });
  };

  useEffect(() => {
    renderArtworkDetail();
    renderPost();
    renderWishlist();
    const ARTWORKDETAIL_OPEN_CHAT_ID = localStorage.getItem(
      "ARTWORKDETAIL_OPEN_CHAT_ID"
    );
    if (ARTWORKDETAIL_OPEN_CHAT_ID) {
      enableChattingOfCustomer(ARTWORKDETAIL_OPEN_CHAT_ID, "");
      localStorage.removeItem("ARTWORKDETAIL_OPEN_CHAT_ID");
    }
  }, []);

  useEffect(() => {
    if (artworkDetail) {
      renderCategory();
      if (getUserInfo()) {
        const user = JSON.parse(getUserInfo() ?? "");
        if (user.role.filter((r: any) => r == Role.CUSTOMER)) {
          checkIsPurchasedYet(artworkDetail.artworkId);
        } else {
          setFinishRendering(true);
        }
      } else {
        setFinishRendering(true);
      }
    }
  }, [artworkDetail]);

  if (artworkDetail == null || post == null) {
    return (
      <>
        <Loading loading={isLoading} />
      </>
    );
  }

  if (!finishRendering) {
    return <></>;
  }

  return (
    <>
      {" "}
      <Loading loading={isLoading} />
      <div className="font-barlow flex w-full  max-w-full flex-col items-start justify-start text-left text-[1.75rem] text-gray">
        <h3 className="font-inherit mq450:text-[1.375rem] relative m-0 inline-block max-w-full text-inherit font-medium">{`Discover / ${artworkDetail.artworkName}`}</h3>
        <div className="text-bg font-para2-semi-14 mt-[-0.312rem] flex max-w-full flex-col items-end justify-start gap-[0.5rem_0rem] self-stretch text-[0.875rem]">
          <div className="flex flex-row items-start justify-start gap-[0rem_1.375rem]">
            <div className="flex flex-row items-start justify-start gap-[0rem_0.5rem]"></div>
          </div>
          <div className="font-barlow flex max-w-full flex-row items-start justify-start self-stretch text-neutral-white">
            <div className="mq750:flex-wrap flex w-[33.875rem] max-w-full flex-row items-start justify-between gap-[1.25rem]">
              <div className="flex flex-row items-start justify-start gap-[0rem_0.25rem]">
                {artworkDetail.creator ? (
                  <>
                    <div className="relative leading-[1.313rem]">by</div>
                    <div
                      className="relative capitalize leading-[1.313rem] text-primary-colour cursor-pointer"
                      onClick={() => {
                        router.push(
                          PATH_SHOP.creator.visitPage(artworkDetail.creator.id)
                        );
                      }}
                    >
                      {artworkDetail.creator.name}
                    </div>
                  </>
                ) : (
                  <></>
                )}
                {artworkCategory ? (
                  <>
                    <div className="relative leading-[1.313rem]">in</div>
                    <div
                      className="relative leading-[1.313rem] text-primary-colour cursor-pointer"
                      onClick={() => {
                        localStorage.setItem(
                          "DISCOVER_CATEGORY_SORT",
                          artworkDetail.categoryID
                        );
                        router.push(PATH_SHOP.general.discover);
                      }}
                    >
                      {artworkCategory.categoryName}
                    </div>
                  </>
                ) : (
                  <></>
                )}
                <div className="relative leading-[1.313rem]"> at </div>
                <div className="relative leading-[1.313rem] text-primary-colour cursor-pointer">
                  {formatDate_YYYY_MMMM_DD(post.createdOn)}
                </div>
              </div>
              {/* <div className="font-para2-semi-14 flex flex-row items-start justify-start gap-[0rem_0.313rem] text-[0.75rem]">
                <div className="flex flex-row items-start justify-start overflow-hidden rounded-sm bg-primary-colour py-[0rem] pl-[0.25rem] pr-[0.313rem]">
                  <div className="relative leading-[1.313rem]">5.0</div>
                </div>
                <div className="font-barlow relative text-[1rem] leading-[1.313rem]">
                  based on 10 ratings, 2 reviews
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <div className="text-neutral-black font-icons-18 mq750:gap-[1.188rem_0rem] mt-8 flex w-[83.813rem] max-w-full flex-col items-start justify-start gap-[2.438rem_0rem] text-center text-[1.125rem]">
        <div className="mq750:gap-[0rem_1.063rem] flex max-w-full flex-row items-start justify-start gap-[0rem_2.188rem] self-stretch lg:flex-wrap">
          <div className="mq750:min-w-full box-border flex min-w-[33.375rem] max-w-full flex-1 flex-col items-start justify-start px-[0rem] pb-[0rem] pt-[0.25rem]">
            <Watermark
              content={"Artvista"}
              style={{
                fontWeight: "bold",
              }}
              className="w-full"
            >
              <div
                style={{
                  backgroundImage: `url(${artworkDetail.imageUrl.split("://example")[0]})`,
                }}
                className="Artwork Name
                box-border flex h-[38.813rem] max-w-full flex-row items-start justify-end self-stretch rounded-xl bg-cover bg-[top] bg-no-repeat px-[1.75rem] py-[1.875rem]"
              >
                <div
                  onClick={() => {
                    if (allInteractionOfPostQuantity > 0) {
                      handleUnLikePost();
                    } else {
                      handleLikePost();
                    }
                  }}
                  style={{
                    backgroundColor: `${allInteractionOfPostQuantity > 0 ? "#a259ff" : ""}`,
                    border: `${allInteractionOfPostQuantity > 0 ? "none" : ""}`,
                    color: `${allInteractionOfPostQuantity > 0 ? "#fff" : ""}`,
                  }}
                  className="z-[1] box-border flex h-[2.688rem] w-[5.438rem] cursor-pointer flex-row items-center justify-center rounded-full border-[1px] border-solid border-dimgray-100 bg-neutral-white py-[0.625rem] pl-[1.125rem] pr-[1.375rem]"
                >
                  <div className="flex flex-col items-start justify-start px-[0rem] pb-[0rem] pt-[0.094rem]">
                    <div className="relative mx-1">♡</div>
                  </div>
                  <b className="font-text-labels-14px-bold relative text-left text-[0.875rem] leading-[1.313rem] mx-1">
                    {allInteractionOfPostQuantity}
                  </b>
                </div>
              </div>
            </Watermark>
          </div>
          <div className="font-barlow mq750:gap-[1.5rem_0rem] mq750:min-w-full flex w-[30.313rem] min-w-[30.313rem] max-w-full flex-col items-start justify-start gap-[3rem_0rem] text-left text-[0.938rem] text-neutral-white lg:flex-1">
            <div className="mq450:pt-[1.25rem] mq450:pb-[1.25rem] mq450:box-border box-border flex max-w-full flex-col items-start justify-start gap-[1.25rem_0rem] self-stretch overflow-hidden rounded-md border-[2px] border-solid border-dimgray-100 px-[1.188rem] pb-[1.313rem] pt-[1.688rem]">
              <div className="mq450:flex-wrap flex flex-row items-start justify-between gap-[1.25rem] self-stretch text-[1.25rem]">
                <div className="flex flex-col items-start justify-start gap-[1.25rem_0rem]">
                  <div className="mq450:text-[1rem] mq450:leading-[1.063rem] relative font-semibold leading-[1.313rem]">
                    {artworkDetail.artworkName}
                  </div>
                  {/* <div className="text-gray-500 flex flex-row items-start justify-start gap-[0rem_0.5rem] text-[0.938rem]">
                    <div className="relative font-medium leading-[1.313rem]">{`License: `}</div>
                    <div className="relative font-medium leading-[1.313rem] text-primary-colour">
                      Change
                    </div>
                  </div> */}
                </div>
                <div className="mq450:text-[1rem] mq450:leading-[1.063rem] relative font-semibold leading-[1.313rem] text-primary-colour">
                  {!isPurchased ? (
                    <>
                      {artworkDetail.discount &&
                      artworkDetail.price &&
                      artworkDetail.discount > 0
                        ? formatPrice(
                            artworkDetail.price -
                              (artworkDetail.price * artworkDetail.discount) /
                                100
                          )
                        : formatPrice(artworkDetail.price)}{" "}
                      VND
                      <span className="ml-2 text-grey line-through">
                        {artworkDetail.discount &&
                        artworkDetail.price &&
                        artworkDetail.discount > 0
                          ? `${formatPrice(artworkDetail.price)} VND`
                          : ""}
                      </span>
                    </>
                  ) : (
                    <>You have paid for this artwork</>
                  )}
                </div>
              </div>
              <div className="relative inline-block w-[26.5rem] max-w-full font-medium capitalize leading-[1.313rem]">
                {post.description}
              </div>
              {!getUserInfo() ||
              (getUserInfoId() != artworkDetail.creator.id &&
                JSON.parse(getUserInfo() ?? "").role.filter(
                  (r: any) => r == Role.CUSTOMER
                )) ? (
                <>
                  {!isPurchased && finishRendering ? (
                    <>
                      <button
                        onClick={() => {
                          handleCreateOrderPurcahseNow(
                            artworkDetail.price -
                              (artworkDetail.price * artworkDetail.discount) /
                                100,
                            artworkDetail
                          );
                        }}
                        className="hover:bg-blueviolet-100 flex cursor-pointer flex-row items-start justify-center self-stretch whitespace-nowrap rounded-md bg-primary-colour px-[1.25rem] py-[1rem] [border:none]"
                      >
                        <div className="font-barlow relative inline-block text-center text-[1.125rem] font-medium leading-[1.5rem] text-neutral-white">
                          Purchase Now
                        </div>
                      </button>
                    </>
                  ) : (
                    <></>
                  )}

                  {!getUserInfo() ||
                  (getUserInfo() &&
                    JSON.parse(getUserInfo() ?? "") &&
                    JSON.parse(getUserInfo() ?? "").role.filter(
                      (r: any) => r == Role.CUSTOMER
                    )[0]) ? (
                    <>
                      {isPurchased && finishRendering ? (
                        <>
                          <button
                            onClick={async () => {
                              try {
                                const imageUrl =
                                  artworkDetail.imageUrl.split(
                                    "://example.com"
                                  )[0];
                                window.open(imageUrl);
                              } catch (error) {
                                console.error(
                                  "Error downloading image:",
                                  error
                                );
                              }
                            }}
                            className="hover:bg-blueviolet-100 flex cursor-pointer flex-row items-start justify-center self-stretch whitespace-nowrap rounded-md bg-white px-[1.25rem] py-[1rem] [border:none]"
                          >
                            <div className="font-barlow relative inline-block text-center text-[1.125rem] font-medium leading-[1.5rem] text-primary-colour">
                              Download Now
                            </div>
                          </button>
                          {getUserInfo() &&
                          uniqueArtworkIds &&
                          uniqueArtworkIds?.includes(
                            artworkDetail.artworkId
                          ) ? (
                            <>
                              <button
                                onClick={() => {
                                  handleRemoveArtworkFromWishlist(
                                    getUserInfoId(),
                                    artworkDetail.artworkId
                                  );
                                }}
                                className="hover:bg-blueviolet-200 hover:border-blueviolet-100 flex cursor-pointer flex-row items-start justify-center self-stretch rounded-md border-[1px] border-solid border-danger bg-[transparent] px-[1.25rem] py-[1rem] hover:box-border hover:border-[1px] hover:border-solid"
                              >
                                <div className="font-barlow relative inline-block text-center text-[1.125rem] font-medium leading-[1.5rem] text-danger">
                                  Remove From Favorites
                                </div>
                              </button>
                            </>
                          ) : (
                            <></>
                          )}

                          {!getUserInfo() ||
                          !uniqueArtworkIds ||
                          (uniqueArtworkIds &&
                            !uniqueArtworkIds?.includes(
                              artworkDetail.artworkId
                            )) ? (
                            <>
                              <button
                                onClick={() => {
                                  handleAddArtworkFromWishlist(
                                    getUserInfoId(),
                                    artworkDetail.artworkId
                                  );
                                }}
                                className="hover:bg-blueviolet-200 hover:border-blueviolet-100 flex cursor-pointer flex-row items-start justify-center self-stretch rounded-md border-[1px] border-solid border-primary-colour bg-[transparent] px-[1.25rem] py-[1rem] hover:box-border hover:border-[1px] hover:border-solid"
                              >
                                <div className="font-barlow relative inline-block text-center text-[1.125rem] font-medium leading-[1.5rem] text-primary-colour">
                                  Add To Favorites
                                </div>
                              </button>
                            </>
                          ) : (
                            <></>
                          )}

                          <button
                            onClick={() => {
                              enableChattingOfCustomer(
                                artworkDetail.creator.id,
                                artworkId
                              );
                            }}
                            className="hover:bg-blueviolet-200 hover:border-blueviolet-100 flex cursor-pointer flex-row items-start justify-center self-stretch rounded-md border-[1px] border-solid border-white bg-[transparent] px-[1.25rem] py-[1rem] hover:box-border hover:border-[1px] hover:border-solid"
                          >
                            <div className="font-barlow relative inline-block text-center text-[1.125rem] font-medium leading-[1.5rem] text-white">
                              Chat With Creator
                            </div>
                          </button>
                        </>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <></>
              )}

              {getUserInfoId() == artworkDetail.creator.id ? (
                <>
                  <button
                    onClick={() => {
                      router.push(
                        PATH_CREATOR.editArtwork(
                          artworkDetail.creator.id,
                          artworkDetail.artworkId
                        )
                      );
                    }}
                    className="hover:bg-blueviolet-100 flex cursor-pointer flex-row items-start justify-center self-stretch whitespace-nowrap rounded-md bg-primary-colour px-[1.25rem] py-[1rem] [border:none]"
                  >
                    <div className="font-barlow relative inline-block text-center text-[1.125rem] font-medium leading-[1.5rem] text-neutral-white">
                      Edit Artwork
                    </div>
                  </button>
                  <button
                    onClick={() => {}}
                    className="hover:bg-blueviolet-200 hover:border-blueviolet-100 flex cursor-pointer flex-row items-start justify-center self-stretch rounded-md border-[1px] border-solid border-danger bg-[transparent] px-[1.25rem] py-[1rem] hover:box-border hover:border-[1px] hover:border-solid"
                  >
                    <div className="font-barlow relative inline-block text-center text-[1.125rem] font-medium leading-[1.5rem] text-danger">
                      Delete Artwork
                    </div>
                  </button>
                </>
              ) : (
                <></>
              )}
            </div>
            {artworkCategory ? (
              <>
                <div className="text-bg font-para2-semi-14 flex flex-col items-start justify-start gap-[0.625rem_0rem] self-stretch text-[0.75rem]">
                  <div className="relative font-medium leading-[1.125rem]">
                    CATEGORY
                  </div>
                  <div className="flex flex-col items-start justify-start gap-[0.5rem_0rem] self-stretch">
                    <div className="mq750:flex-wrap flex flex-row items-start justify-start gap-[0rem_0.75rem] self-stretch">
                      <button
                        onClick={() => {
                          localStorage.setItem(
                            "DISCOVER_CATEGORY_SORT",
                            artworkDetail.categoryID
                          );
                          router.push(PATH_SHOP.general.discover);
                        }}
                        className="hover:bg-silver-300 flex cursor-pointer flex-col items-start justify-start rounded-full bg-chip-fill px-[1.25rem] py-[0.75rem] [border:none]"
                      >
                        <b className="font-barlow text-bg relative text-left text-[0.75rem] leading-[1.125rem]">
                          {artworkCategory.categoryName}
                        </b>
                      </button>
                      <button
                        onClick={() => {
                          router.push(PATH_SHOP.general.discover);
                        }}
                        className="flex cursor-pointer flex-row items-start justify-start bg-[transparent] p-0 [border:none]"
                      >
                        <div className="flex flex-col items-start justify-start whitespace-nowrap rounded-full bg-chip-fill px-[1.25rem] py-[0.75rem]">
                          <b className="font-barlow relative text-left text-[0.75rem] leading-[1.125rem] text-grey">
                            See more..
                          </b>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ArtworkDetail;
