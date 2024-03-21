import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";

export type CardsType = {
  maskGroup?: string;
  logoFrame?: string;
  propPadding?: CSSProperties["padding"];
  propPadding1?: CSSProperties["padding"];
};

const TrendingProductCard: NextPage<CardsType> = ({
  maskGroup,
  logoFrame,
  propPadding,
  propPadding1,
}) => {
  const upperContentStyle: CSSProperties = useMemo(() => {
    return {
      padding: propPadding,
    };
  }, [propPadding]);

  const belowContentStyle: CSSProperties = useMemo(() => {
    return {
      padding: propPadding1,
    };
  }, [propPadding1]);

  return (
    <div className="text-2xl-1 text-whte font-barlow relative box-border flex min-h-[524px] max-w-full flex-row items-end justify-center py-0 pl-0 pr-px text-left">
      <div className="absolute bottom-[0px] left-[0px] right-[0px] top-[0px] z-[0] !m-[0] flex h-full w-full items-center justify-center">
        <img
          className="absolute left-[0px] top-[0px] h-full max-h-full w-full max-w-full overflow-hidden object-contain [transform:scale(1.881)]"
          alt=""
          src={maskGroup}
        />
      </div>
      <div className="rounded-b-7xl-4 bg-gray-200 z-[1] box-border flex max-w-full flex-1 flex-col items-center justify-start gap-[11px_0px] rounded-t-none pb-[25px] pl-[22px] pr-[15px] pt-[18px] [backdrop-filter:blur(176.87px)]">
        <div className="rounded-b-7xl-4 bg-gray-200 relative hidden h-[154.4px] w-[401.2px] max-w-full rounded-t-none [backdrop-filter:blur(176.87px)]" />
        <div className="box-border flex max-w-full flex-row items-start justify-start self-stretch py-0 pl-0 pr-1.5">
          <div
            className="rounded-7xl-4 z-[2] box-border flex max-w-full flex-1 flex-row items-center justify-center py-0 pl-[3px] pr-1"
            style={upperContentStyle}
          >
            <b className="mq450:text-mid mq450:leading-[32px] relative inline-block max-w-full flex-1 leading-[39.6px] tracking-[0.02em]">
              Da Viper
            </b>
          </div>
        </div>
        <div
          className="rounded-7xl-4 text-base-8 text-whitesmoke z-[2] flex flex-col items-start justify-center self-stretch py-0 pl-0 pr-px"
          style={belowContentStyle}
        >
          <div className="mq450:flex-wrap flex flex-row items-center justify-between gap-[20px] self-stretch">
            <div className="flex h-[60.7px] w-[209px] flex-row items-center justify-center gap-[0px_13.2px]">
              <img
                className="relative h-[42.2px] w-[42.2px] rounded-[50%] object-cover"
                loading="lazy"
                alt=""
                src={logoFrame}
              />
              <div className="flex flex-1 flex-col items-start justify-center gap-[5.28px_0px] self-stretch">
                <div className="relative font-medium">Creator</div>
                <div className="text-lg-5 text-whte relative font-medium">
                  Tom Edison
                </div>
              </div>
            </div>
            <div className="flex h-[60px] flex-col items-end justify-center gap-[5.28px_0px] text-right">
              <div className="relative font-medium">Amount</div>
              <b className="text-4xl-8 text-whte mq450:text-lgi relative text-left">
                45.50 USD
              </b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingProductCard;
