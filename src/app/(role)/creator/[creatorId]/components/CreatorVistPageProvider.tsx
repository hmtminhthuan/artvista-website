"use client";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/JWTContext";
import CreatorPage from "./creatorPage";
import ShopLayout from "@/components/Shop/ShopLayout";

const CreatorVistPageProvider: React.FC = () => {
  return (
    <AppProvider>
      <AuthProvider>
        <ShopLayout>
          <CreatorPage />
        </ShopLayout>
      </AuthProvider>
    </AppProvider>
  );
};

export default CreatorVistPageProvider;
