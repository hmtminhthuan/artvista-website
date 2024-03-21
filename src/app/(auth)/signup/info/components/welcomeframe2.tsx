import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";

export type WelcomeframeType = {
  /** Style props */
  propMargin?: CSSProperties["margin"];
};

const Welcomeframe2: NextPage<WelcomeframeType> = ({ propMargin }) => {
  const welcomeToOurStyle: CSSProperties = useMemo(() => {
    return {
      margin: propMargin,
    };
  }, [propMargin]);

  return (
    <div className="font-barlow mq800:pt-[3.438rem] mq800:pb-[3.438rem] mq800:box-border mq800:min-w-full mq1325:flex-1 mq1325:min-h-[auto] box-border flex min-h-[64rem] w-[44.375rem] min-w-[44.375rem] max-w-full shrink-0 flex-row items-start justify-start overflow-hidden bg-[url('/images/shop/SignUpPage/account-frame@3x.png')] bg-cover bg-[top] bg-no-repeat px-[1.438rem] py-[5.25rem] pt-45 text-left text-[2rem] text-neutral-white">
      <div className="rounded-11xl bg-gray-200 mq800:pl-[1.938rem] mq800:pr-[1.5rem] mq800:box-border box-border flex max-w-full flex-1 flex-col items-start justify-start gap-[1.5rem_0rem] overflow-hidden pb-[2.938rem] pl-[3.875rem] pr-[3rem] pt-[2.313rem] [backdrop-filter:blur(30px)]">
        <h2 className="font-inherit mq800:text-[1.625rem] mq450:text-[1.188rem] relative m-0 inline-block max-w-full text-inherit font-semibold">
          Discover and Own Unique Digital Art
        </h2>
        <div
          className="mq450:text-[1.125rem] mq450:leading-[1.625rem] relative flex h-[12.75rem] shrink-0 items-center self-stretch text-[1.375rem] font-medium leading-[145%]"
          style={welcomeToOurStyle}
        >
          Welcome to our digital art marketplace where you can discover and own
          unique digital creations from talented artists around the world. Our
          platform is dedicated to showcasing the finest digital artwork in
          various styles and formats, ranging from illustrations and paintings
          to 3D sculptures and animations.
        </div>
      </div>
    </div>
  );
};

export default Welcomeframe2;
