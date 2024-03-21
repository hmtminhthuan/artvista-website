"use client";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/JWTContext";
import GuestGuard from "@/guards/GuestGuard";
import { PATH_AUTH } from "@/routes/paths";
import { RoleString } from "@/enums/accountRole";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Frame1 = (props: {}) => {
  var router = useRouter();
  return (
    <AppProvider>
      <AuthProvider>
        <GuestGuard>
          <div className="mq800:pt-[52px] mq800:box-border mq800:min-w-full mq1325:flex-1 box-border flex w-[567px] min-w-[567px] max-w-full flex-col items-start justify-start px-0 pb-0 pt-15">
            <div className="mq800:gap-[67px_0px] mq450:gap-[33px_0px] flex max-w-full flex-col items-end justify-start gap-[10px_0px] self-stretch">
              <div className="flex flex-row items-start justify-start gap-[0px_6px] py-0 pl-5 pr-0">
                <div
                  className="relative cursor-pointer whitespace-nowrap font-medium leading-[28px]"
                  onClick={() => {
                    router.push("/");
                  }}
                >
                  {`Come back to `}
                  <span className="text-primary-colour">Home Page</span>
                </div>
              </div>
              <div className="flex flex-row items-start justify-start gap-[0px_6px] py-0 pl-5 pr-0">
                <div className="relative whitespace-nowrap font-medium leading-[28px]">{`Already have an account? `}</div>
                <div
                  className="relative cursor-pointer whitespace-nowrap font-medium leading-[28px] text-primary-colour"
                  onClick={() => {
                    router.push(PATH_AUTH.signin);
                  }}
                >
                  Sign In
                </div>
              </div>
              <div className="flex max-w-full flex-row items-start justify-start self-stretch text-left text-3xl text-black">
                <div className="box-border flex w-[523px] max-w-full flex-col items-start justify-start gap-[24px_0px] py-0 pl-0 pr-5">
                  <div className="box-border flex w-[429px] max-w-full flex-col items-start justify-start gap-[16px_0px] px-0 pb-2 pt-0 text-[36px]">
                    <h1 className="font-inherit mq800:text-10xl mq450:text-3xl relative m-0 text-inherit font-bold">
                      Join Us!
                    </h1>
                    <div className="mq450:text-base mq450:leading-[22px] relative self-stretch !bg-clip-text text-xl leading-[28px] text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] [background:linear-gradient(180deg,_#3b3e40,_#101212)]">
                      To begin this journey, tell us what type of account you’d
                      be opening.
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      localStorage.setItem("signuprole", RoleString.CUSTOMER);
                      router.push(PATH_AUTH.signupInfo);
                    }}
                    className="bg-ghostwhite box-border flex max-w-full cursor-pointer flex-row items-start justify-start self-stretch rounded-[7.08px] border-solid border-primary-colour pb-[13.5px] pl-[23.100000000000364px] pr-7 pt-3.5 shadow-[0px_4.7px_16.53px_1.18px_rgba(0,_0,_0,_0.04)] transition-all duration-300 ease-in hover:border-[1.2px] hover:border-opacity-100 active:border-opacity-100"
                  >
                    <div className="bg-ghostwhite relative box-border hidden h-[127.5px] w-[503px] max-w-full rounded-[7.08px] border-[1.2px] border-solid border-primary-colour shadow-[0px_4.7px_16.53px_1.18px_rgba(0,_0,_0,_0.04)]" />
                    <div className="mq450:flex-wrap z-[1] flex max-w-full flex-1 flex-row items-center justify-start [row-gap:20px]">
                      <div className="box-border flex min-w-[277px] max-w-full flex-1 flex-col items-start justify-start p-2.5">
                        <div className="mq450:flex-wrap mq450:gap-[0px_16px] flex flex-row items-center justify-start gap-[0px_33px] self-stretch">
                          <img
                            className="relative h-[61.4px] w-[61.4px]"
                            loading="lazy"
                            alt=""
                            src="/images/shop/SignUpPage/1/group-34366.svg"
                          />
                          <div className="flex min-w-[203px] flex-1 flex-col items-start justify-start gap-[10px_0px]">
                            <div className="mq450:text-lg relative font-medium">
                              Customer
                            </div>
                            <div className="text-dimgray-400 relative self-stretch text-lg">
                              Personal account to purchase artworks you want.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      localStorage.setItem("signuprole", RoleString.CREATOR);
                      router.push(PATH_AUTH.signupInfo);
                    }}
                    className="mq450:flex-wrap mq450:gap-[16px] box-border flex max-w-full cursor-pointer flex-row items-end justify-start gap-[33px] self-stretch rounded-[7.08px] border-solid bg-neutral-white px-[33.100000000000364px] pb-6 pt-[23.5px] shadow-[0px_2.4px_16.53px_1.18px_rgba(0,_0,_0,_0.06)] hover:border-[1.2px] hover:border-opacity-100 active:border-opacity-100"
                  >
                    <div className="relative hidden h-[127.5px] w-[503px] max-w-full rounded-[7.08px] bg-neutral-white shadow-[0px_2.4px_16.53px_1.18px_rgba(0,_0,_0,_0.06)]" />
                    <div className="flex flex-col items-start justify-start px-0 pb-[9.299999999999727px] pt-0">
                      <img
                        className="relative z-[1] h-[61.4px] w-[61.4px]"
                        loading="lazy"
                        alt=""
                        src="/images/shop/SignUpPage/1/group-34367.svg"
                      />
                    </div>
                    <div className="flex w-[282.2px] flex-col items-start justify-start gap-[10px_0px]">
                      <div className="mq450:text-lg relative z-[1] font-medium">
                        Creator
                      </div>
                      <div className="text-dimgray-400 relative z-[1] self-stretch text-lg">
                        Personal account to create and sell your artworks.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GuestGuard>
      </AuthProvider>
    </AppProvider>
  );
};

export default Frame1;
