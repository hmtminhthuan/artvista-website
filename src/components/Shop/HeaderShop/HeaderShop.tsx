"use client";
import { useRouter } from "next/navigation";
import {
  PATH_ADMIN,
  PATH_AUTH,
  PATH_COMMON_USER,
  PATH_CREATOR,
  PATH_CUSTOMER,
  PATH_SHOP,
} from "@/routes/paths";
import useAuth from "@/hooks/useAuth";
import sweetAlert from "@/utils/sweetAlert";
import { getUserInfo } from "@/utils/utils";
import { Role } from "@/enums/accountRole";
import "./index.scss";
import { getUserAvatar } from "@/utils/useFirebaseStorage";
import { useEffect, useState } from "react";
import useAppContext from "@/hooks/useAppContext";
import {
  database,
  ref,
  push,
  onValue,
  serverTimestamp,
} from "@/config/firebaseConfig";
import ChattingOfCustomer from "@/components/Chatting/Chatting";

const getLocalStorage = (name: string) => {
  if (typeof window !== "undefined") {
    try {
      const value = localStorage.getItem(name);
      return value;
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return null;
    }
  } else {
    console.error("localStorage is not available on the server.");
    return null;
  }
};

const HeaderShopComponent = (props: {}) => {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const {
    isLoading,
    chatting,
    enableLoading,
    disableLoading,
    enableChattingOfCustomer,
    disableChattingOfCustomer,
  } = useAppContext();
  const accessToken = getLocalStorage("accessToken");
  const user = getUserInfo();
  const userLogin = user ? JSON.parse(user) : null;
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [notiList, setNotiList] = useState<any[]>([]);
  const [notiMessage, setNotiMessage] = useState<boolean>(false);
  const {
    chattingOfCustomer,
    chattingOfCustomerId,
    chattingOfCustomerArtworkId,
  } = useAppContext();

  const setUserAvatarAction = async (USER_LOGIN: any) => {
    try {
      const avatarUrl = await getUserAvatar(USER_LOGIN.id);
      setUserAvatar(avatarUrl);
    } catch (error) {
      console.error("Error setting avatar:", error);
    }
  };

  useEffect(() => {
    if (userLogin) {
      const fetchData = async () => {
        try {
          const avatarUrl = await getUserAvatar(userLogin.id ?? "");
          setUserAvatar(avatarUrl);
        } catch (error) {
          console.error("Error setting avatar:", error);
        }

        onValue(ref(database, `messageNoti/${userLogin.id}`), (data) => {
          let getMsg: any = [];
          data.forEach((d) => {
            if (
              !getMsg.filter((x: any) => x.userIDFrom == d.val().userIDFrom)[0]
            ) {
              getMsg.push(d.val());
            }
          });
          setNotiList(getMsg);
        });
      };

      fetchData();
    }
  }, [userLogin, isLoading]);

  return (
    <>
      <ChattingOfCustomer
        isOpen={chattingOfCustomer}
        chattingOfCustomerId={chattingOfCustomerId}
        artworkIdInput={chattingOfCustomerArtworkId}
      />{" "}
      <header className="home-title-animation mt-2 font-barlow mq450:gap-[0px_233px] mq750:gap-[0px_233px] mq1250:gap-[0px_233px] sticky top-[0] z-[99] flex w-10/12 max-w-full flex-row items-center justify-start gap-[0px_233px] pt-[10px] text-left text-21xl text-neutral-white">
        <h1
          className="header_title font-inherit relative m-0 cursor-pointer whitespace-nowrap text-inherit font-bold"
          onClick={() => {
            router.push("/");
          }}
        >
          Artvista
        </h1>
        <div className="flex max-w-full flex-1 flex-row items-center justify-end gap-[20px] text-3xl text-whte">
          <div className="flex flex-row">
            <div
              className="relative cursor-pointer font-semibold mr-7 header_links_hover"
              onClick={() => {
                router.push(PATH_SHOP.general.discover);
              }}
            >
              Discover
            </div>
            <div
              className="relative cursor-pointer font-semibold mr-7 header_links_hover"
              onClick={() => {
                router.push(PATH_SHOP.general.package);
              }}
            >
              Package
            </div>

            {accessToken &&
            userLogin &&
            userLogin.role &&
            userLogin.role.filter((role: any) => role == Role.CUSTOMER)[0] ? (
              <>
                <div
                  className="relative cursor-pointer font-semibold mr-7 header_links_hover"
                  onClick={() => {
                    router.push(PATH_CUSTOMER.wishlist(userLogin.id));
                  }}
                >
                  Favorites
                </div>
              </>
            ) : (
              <></>
            )}

            {accessToken &&
            userLogin &&
            userLogin.role &&
            userLogin.role.filter((role: any) => role == Role.ADMIN)[0] ? (
              <>
                <div
                  className="relative cursor-pointer font-semibold mr-7 header_links_hover"
                  onClick={() => {
                    router.push(PATH_ADMIN.dashboard);
                  }}
                >
                  Dashboard
                </div>
              </>
            ) : (
              <></>
            )}
            {accessToken &&
            userLogin &&
            userLogin.role &&
            userLogin.role.filter((role: any) => role == Role.CREATOR)[0] ? (
              <>
                <div
                  className="relative cursor-pointer font-semibold mr-7 header_links_hover"
                  onClick={() => {
                    router.push(PATH_SHOP.creator.visitPage(userLogin.id));
                  }}
                >
                  Showcase
                </div>
              </>
            ) : (
              <></>
            )}

            {accessToken && userLogin ? (
              <>
                <div className="mr-5 self-stretch flex flex-row items-start justify-between gap-[1.25rem]">
                  {userLogin.role &&
                  userLogin.role.filter(
                    (role: any) => role == Role.CUSTOMER || role == Role.CREATOR
                  )[0] ? (
                    <>
                      <img
                        className="cursor-pointer h-[2.25rem] w-[2.25rem] relative overflow-hidden shrink-0 min-h-[2.25rem]"
                        loading="lazy"
                        alt=""
                        src="/images/shop/Header/order_icon.svg"
                        onClick={() => {
                          router.push(PATH_COMMON_USER.order);
                        }}
                      />
                    </>
                  ) : (
                    <></>
                  )}

                  {userLogin.role &&
                  (userLogin.role.filter(
                    (role: any) => role == Role.CREATOR
                  )[0] ||
                    userLogin.role.filter(
                      (role: any) => role == Role.CUSTOMER
                    )[0]) ? (
                    <>
                      <img
                        className="relative cursor-pointer h-[2.25rem] w-[2.25rem] overflow-hidden shrink-0 min-h-[2.25rem]"
                        loading="lazy"
                        alt=""
                        src={
                          notiList.filter((n: any) => !n.seen)[0]
                            ? "/images/shop/Header/message_icon_active.svg"
                            : "/images/shop/Header/message_icon.svg"
                        }
                        style={{ zIndex: "999" }}
                        onClick={() => {
                          if (!notiMessage) {
                            setNotiMessage(true);
                          } else {
                            setNotiMessage(false);
                          }
                        }}
                      />
                      <div
                        className="fixed"
                        style={{
                          right: "20px",
                          display: notiMessage ? "block" : "none",
                        }}
                      >
                        <div
                          className=" bg-black text-neutral-white"
                          style={{
                            width: "20rem",
                            height: "20rem",
                            transform: "translateY(2.5rem)",
                            borderRadius: "5px",
                          }}
                        >
                          {notiList.map((noti, index) => {
                            return (
                              <div
                                key={index}
                                className="px-3 cursor-pointer"
                                style={{
                                  borderBottom: "1px solid #fff",
                                }}
                                onClick={() => {
                                  setNotiMessage(false);
                                  enableChattingOfCustomer(noti.userIDFrom, "");
                                }}
                              >
                                {noti.name}
                                <p className="text-[1rem] text-whitesmoke">
                                  + New message
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}

                  <img
                    className="cursor-pointer *:h-[2.25rem] w-[2.25rem] relative rounded-[50%] object-cover min-h-[2.25rem]"
                    loading="lazy"
                    alt=""
                    src={userAvatar ?? ""}
                    onClick={() => {
                      router.push(PATH_SHOP.profile(userLogin.id));
                    }}
                  />
                </div>
              </>
            ) : (
              <></>
            )}

            {!isAuthenticated && !accessToken ? (
              <>
                <div
                  className="header_links_hover  flex cursor-pointer flex-row items-center justify-center whitespace-nowrap rounded-full bg-white px-6 py-4 text-center text-base text-primary-colour"
                  onClick={() => {
                    router.push(PATH_AUTH.signin);
                  }}
                >
                  <div className="text-primary-colour relative font-semibold leading-[1px]">
                    Sign In
                  </div>
                </div>
                <div
                  className="ms-4 header_links_hover_signup flex cursor-pointer flex-row items-center justify-center whitespace-nowrap rounded-full bg-primary-colour px-6 py-4 text-center text-base text-neutral-white"
                  onClick={() => {
                    router.push(PATH_AUTH.signup);
                  }}
                >
                  <div className="relative font-semibold leading-[1px]">
                    Sign Up
                  </div>
                </div>
              </>
            ) : (
              <>
                <div
                  className="header_links_hover_signup header_btn_hover flex cursor-pointer flex-row items-center justify-center whitespace-nowrap rounded-full bg-primary-colour px-6 py-4 text-center text-base text-neutral-white"
                  onClick={() => {
                    logout();
                    sweetAlert.alertSuccess(
                      "Log Out Successfully",
                      "",
                      1000,
                      22
                    );
                  }}
                >
                  <div className="relative font-semibold leading-[1px]">
                    Log Out
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default HeaderShopComponent;
