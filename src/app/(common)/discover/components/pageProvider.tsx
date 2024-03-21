"use client";
import { AppProvider } from "@/contexts/AppContext";
import Discover from "./Discover";
import ShopLayout from "@/components/Shop/ShopLayout";
import AOSWrapper from "@/components/AOSWrapper/AOSWrapper";
import TitlePageFrame from "@/components/Frame/TitlePageFrame";

const DiscoverProvider = (props: {}) => {
  return (
    <>
      <AppProvider>
        <AOSWrapper>
          <ShopLayout>
            <section>
              <div className="mb-5">
                <TitlePageFrame
                  title={"Artwork Showcase"}
                  subtitle={"Let's discover your favorite arts now"}
                />
              </div>
              <Discover numberOfItems={undefined} />
            </section>
          </ShopLayout>
        </AOSWrapper>
      </AppProvider>
    </>
  );
};

export default DiscoverProvider;
