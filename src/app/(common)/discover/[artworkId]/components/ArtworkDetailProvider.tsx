"use client";
import AOSWrapper from "@/components/AOSWrapper/AOSWrapper";
import { AppProvider } from "@/contexts/AppContext";
import ArtworkDetail from "./ArtworkDetail";
import { AuthProvider } from "@/contexts/JWTContext";
import ShopLayout from "@/components/Shop/ShopLayout";

const ArtworkDetailProvider = (props: {}) => {
  return (
    <>
      <AppProvider>
        <AuthProvider>
          <AOSWrapper>
            <ShopLayout>
              <section className="min-h-screen">
                <ArtworkDetail />
              </section>
            </ShopLayout>
          </AOSWrapper>
        </AuthProvider>
      </AppProvider>
    </>
  );
};

export default ArtworkDetailProvider;
