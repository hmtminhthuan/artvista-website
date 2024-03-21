"use client";

import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/JWTContext";
import HeaderShopComponent from "./HeaderShop";

const HeaderShop = (props: {}) => {
  return (
    <AppProvider>
      <AuthProvider>
        <HeaderShopComponent />
      </AuthProvider>
    </AppProvider>
  );
};

export default HeaderShop;
