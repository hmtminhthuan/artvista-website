"use client";
import { AppProvider } from "@/contexts/AppContext";
import ShopLayout from "@/components/Shop/ShopLayout";
import AOSWrapper from "@/components/AOSWrapper/AOSWrapper";
import TrendingProduct from "@/components/Shop/TrendingProduct";
import HomeCategories from "@/components/Shop/HomeCategories";
import Carousel from "@/components/Shop/Carousel";
import PackageSection from "@/components/Shop/Package";

const HomePageProvider = (props: {}) => {
  return (
    <>
      <AppProvider>
        <AOSWrapper>
          <ShopLayout>
            <Carousel />
            <TrendingProduct />
            <PackageSection />
            <HomeCategories />
          </ShopLayout>
        </AOSWrapper>
      </AppProvider>
    </>
  );
};

export default HomePageProvider;
