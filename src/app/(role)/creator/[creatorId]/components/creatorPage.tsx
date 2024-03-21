"use client";
import { PATH_AUTH, PATH_CREATOR } from "@/routes/paths";
import { Role, RoleString } from "@/enums/accountRole";
import type { NextPage } from "next";
import { useParams, useRouter } from "next/navigation";
import useAppContext from "@/hooks/useAppContext";
import { getUserInfo, getUserInfoId } from "@/utils/utils";
import Discover from "@/app/(common)/discover/components/Discover";
import { useEffect, useState } from "react";
import { getUserAvatar } from "@/utils/useFirebaseStorage";
import { AuthUser } from "@/types/authentication";
import authApi from "@/api/auth/auth";

const CreatorPage: NextPage = () => {
  const params = useParams();
  const creatorId = params.creatorId as string;
  const router = useRouter();
  const { enableChattingOfCustomer, disableLoading } = useAppContext();
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [creatorInfo, setCreatorInfo] = useState<AuthUser>(null);

  useEffect(() => {
    disableLoading();
    const fetchData = async () => {
      try {
        const avatarUrl = await getUserAvatar(creatorId ?? "");
        setUserAvatar(avatarUrl);
        authApi
          .getUserInfo(creatorId)
          .then((response) => {
            if (response.data.isSuccess) {
              setCreatorInfo(response.data.result);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.error("Error setting avatar:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex-1 flex flex-col items-end justify-start gap-[5.438rem_0rem] max-w-full text-left text-[1.5rem] text-bg font-barlow mq800:gap-[2.688rem_0rem] mq450:gap-[1.375rem_0rem]">
      <div className="self-stretch flex flex-col items-end justify-start gap-[0.625rem_0rem] max-w-full">
        <div className="w-[85rem] flex flex-row items-start justify-between max-w-full gap-[1.25rem] mq1350:flex-wrap">
          <div className="w-[15.188rem] flex flex-col items-start justify-start pt-[0.8rem] px-[0rem] pb-[0rem] box-border">
            <div className="self-stretch flex flex-col items-end justify-start gap-[0.938rem_0rem]">
              <div className="self-stretch flex flex-col items-center justify-start">
                <img
                  className="w-[8rem] h-[8rem] rounded-[50%] object-cover z-[1]"
                  loading="lazy"
                  alt=""
                  src={userAvatar ?? ""}
                />
                <div className="flex flex-col items-center justify-start py-[0rem] px-[1.25rem] gap-[0.813rem_0rem]">
                  <div className="text-neutral-white mt-3 relative leading-[1.5rem] font-semibold mq450:text-[1.188rem] mq450:leading-[1.188rem]">
                    {creatorInfo?.name}
                  </div>
                  <button
                    style={{ borderRadius: "3px" }}
                    onClick={() => {
                      if (
                        getUserInfo() &&
                        getUserInfoId() != creatorId &&
                        JSON.parse(getUserInfo() ?? "").role[0] == Role.CUSTOMER
                      ) {
                        localStorage.setItem(
                          "ARTWORKDETAIL_OPEN_CHAT_ID",
                          creatorId
                        );
                        enableChattingOfCustomer(creatorId, "");
                      } else if (getUserInfoId() == creatorId) {
                        router.push(PATH_CREATOR.uploadArtwork(creatorId));
                      }
                    }}
                    className="cursor-pointer [border:none] py-[0.4rem] px-[1.5rem] bg-primary-colour rounded-10xs overflow-hidden flex flex-row items-start justify-start gap-[0rem_0.5rem]"
                  >
                    {getUserInfoId() != creatorId &&
                    JSON.parse(getUserInfo() ?? "").role[0] == Role.CUSTOMER ? (
                      <>
                        <div className="flex flex-col items-start justify-start pt-[0.063rem] px-[0rem] pb-[0rem]">
                          <img
                            className="w-[1.5rem] h-[1.5rem] relative overflow-hidden shrink-0"
                            alt=""
                            src="/images/shop/CreatorVistPage/uilmessage.svg"
                          />{" "}
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                    <div className="relative text-[1rem] leading-[160.5%] font-medium font-barlow text-neutral-white text-left">
                      {getUserInfoId() != creatorId &&
                      JSON.parse(getUserInfo() ?? "").role[0] ==
                        Role.CUSTOMER ? (
                        <>Message</>
                      ) : (
                        <></>
                      )}
                      {getUserInfoId() == creatorId ? (
                        <>Upload New Art</>
                      ) : (
                        <></>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[64.25rem] rounded-6xl overflow-hidden shrink-0 flex flex-col items-start justify-start py-[2.688rem] px-[2.75rem] box-border gap-[2.5rem_0rem] bg-[url('/images/shop/CreatorVistPage/arrowleft-frame@3x.png')] bg-cover bg-no-repeat bg-[top] max-w-full text-[1.625rem] text-neutral-white mq800:gap-[1.25rem_0rem] mq800:pl-[1.375rem] mq800:pr-[1.375rem] mq800:box-border">
            {getUserInfoId() != creatorId ? (
              <>
                <h3 className="m-0 relative text-inherit leading-[160.5%] font-medium font-inherit inline-block max-w-full mq450:text-[1.313rem] mq450:leading-[2.063rem]">
                  <p className="m-0">Showcase and sell your art in the most</p>
                  <p className="m-0">awesome digital art marketplace</p>
                </h3>
                <div className="flex flex-row items-start justify-start gap-[0rem_1.188rem] text-primary-colour">
                  <h3
                    className="cursor-pointer m-0 relative text-inherit leading-[144.5%] font-normal font-inherit mq450:text-[1.313rem] mq450:leading-[1.875rem]"
                    onClick={() => {
                      localStorage.setItem("signuprole", RoleString.CREATOR);
                      router.push(PATH_AUTH.signupInfo);
                    }}
                  >
                    Become a seller
                  </h3>
                  <div className="flex flex-col items-start justify-start pt-[0.438rem] px-[0rem] pb-[0rem]">
                    <img
                      className="w-[1.5rem] h-[1.5rem] relative overflow-hidden shrink-0"
                      loading="lazy"
                      alt=""
                      src="/images/shop/CreatorVistPage/arrowright.svg"
                    />
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}

            {getUserInfoId() == creatorId ? (
              <>
                <h3 className="m-0 relative text-inherit leading-[160.5%] font-medium font-inherit inline-block max-w-full mq450:text-[1.313rem] mq450:leading-[2.063rem]">
                  <p className="m-0">
                    Let make your showcase more wonderful with
                  </p>
                  <p className="m-0">awesome digital art marketplace</p>
                </h3>
                <div className="flex flex-row items-start justify-start gap-[0rem_1.188rem] text-primary-colour">
                  <h3
                    className="cursor-pointer m-0 relative text-inherit leading-[144.5%] font-normal font-inherit mq450:text-[1.313rem] mq450:leading-[1.875rem]"
                    onClick={() => {
                      router.push(PATH_CREATOR.uploadArtwork(creatorId));
                    }}
                  >
                    Upload New Art Now
                  </h3>
                  <div className="flex flex-col items-start justify-start pt-[0.438rem] px-[0rem] pb-[0rem]">
                    <img
                      className="w-[1.5rem] h-[1.5rem] relative overflow-hidden shrink-0"
                      loading="lazy"
                      alt=""
                      src="/images/shop/CreatorVistPage/arrowright.svg"
                    />
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="mt-3 self-stretch flex flex-row flex-wrap items-start justify-start max-w-full text-center text-[1.25rem]">
          <Discover creatorId={creatorId} />
        </div>
      </div>
    </div>
  );
};

export default CreatorPage;
