"use client";
import { AppProvider } from "@/contexts/AppContext";
import ShopLayout from "@/components/Shop/ShopLayout";
import AOSWrapper from "@/components/AOSWrapper/AOSWrapper";
import PackagePage from "./PackagePage";
import TitlePageFrame from "@/components/Frame/TitlePageFrame";

const PackagePageProvider = (props: {}) => {
  return (
    <>
      <AppProvider>
        <AOSWrapper>
          <ShopLayout>
            <div className="mb-5">
              <TitlePageFrame
                title={"Package Library"}
                subtitle={"Let's choose your appropriate package now"}
              />
            </div>
            <section className="package_page_area w-screen">
              <PackagePage />
            </section>
          </ShopLayout>
        </AOSWrapper>
      </AppProvider>
    </>
  );
};

export default PackagePageProvider;
