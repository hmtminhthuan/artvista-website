import { Metadata } from "next";
import Welcomeframe from "./components/welcomeframe";
import Frame1 from "./components/frame1";

export const metadata: Metadata = {
  title: "Artvista",
  description: "This is Sign Up Page for Artvista",
};

export default function Signup() {
  return (
    <>
      <div>
        <div className="bg-neutral-white text-lightslategray font-barlow mq800:gap-[0px_60px] mq1325:flex-wrap mq450:gap-[0px_30px] relative flex h-full w-full flex-row items-start justify-start gap-[0px_120px] overflow-hidden text-right text-lg tracking-[normal]">
          <Welcomeframe />
          <Frame1 />
        </div>
      </div>
    </>
  );
}
