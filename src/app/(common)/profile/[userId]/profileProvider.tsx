"use client";
import { AppProvider } from "@/contexts/AppContext";
import ShopLayout from "@/components/Shop/ShopLayout";
import AOSWrapper from "@/components/AOSWrapper/AOSWrapper";
import { AuthProvider } from "@/contexts/JWTContext";
import AuthGuard from "@/guards/AuthGuard";
import ProfileComponent from "./profileComponent";
import IdBasedGuard from "@/guards/IdBasedGuard";
import { getUserInfoId } from "@/utils/utils";

const ProfileProvider = (props: {}) => {
  return (
    <>
      <AppProvider>
        <AuthProvider>
          <AuthGuard>
            <IdBasedGuard accessibleIds={[getUserInfoId()]}>
              <AOSWrapper>
                <ShopLayout>
                  <section>
                    <ProfileComponent />
                  </section>
                </ShopLayout>
              </AOSWrapper>
            </IdBasedGuard>
          </AuthGuard>
        </AuthProvider>
      </AppProvider>
    </>
  );
};

export default ProfileProvider;
