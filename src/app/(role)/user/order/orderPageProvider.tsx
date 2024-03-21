"use client";
import { AppProvider } from "@/contexts/AppContext";
import ShopLayout from "@/components/Shop/ShopLayout";
import AOSWrapper from "@/components/AOSWrapper/AOSWrapper";
import TitlePageFrame from "@/components/Frame/TitlePageFrame";
import AuthGuard from "@/guards/AuthGuard";
import RoleBasedGuard from "@/guards/RoleBasedGuard";
import { Role } from "@/enums/accountRole";
import { AuthProvider } from "@/contexts/JWTContext";
import OrderPageComponent from "./orderPageComponent";

const OrderPageProvider = (props: {}) => {
  return (
    <>
      <AppProvider>
        <AuthProvider>
          <AuthGuard>
            <RoleBasedGuard accessibleRoles={[Role.CUSTOMER]}>
              <AOSWrapper>
                <ShopLayout>
                  <section>
                    <div className="mb-5">
                      <TitlePageFrame
                        title={"Your Orders"}
                        subtitle={"Let's see all of your orders here"}
                      />
                    </div>
                  </section>
                  <section className="w-full flex flex-row justify-center items-start">
                    <OrderPageComponent />
                  </section>
                </ShopLayout>
              </AOSWrapper>
            </RoleBasedGuard>
          </AuthGuard>
        </AuthProvider>
      </AppProvider>
    </>
  );
};

export default OrderPageProvider;
