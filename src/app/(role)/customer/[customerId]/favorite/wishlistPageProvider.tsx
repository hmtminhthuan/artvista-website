"use client";
import { AppProvider } from "@/contexts/AppContext";
import ShopLayout from "@/components/Shop/ShopLayout";
import AOSWrapper from "@/components/AOSWrapper/AOSWrapper";
import TitlePageFrame from "@/components/Frame/TitlePageFrame";
import Discover from "@/app/(common)/discover/components/Discover";
import AuthGuard from "@/guards/AuthGuard";
import RoleBasedGuard from "@/guards/RoleBasedGuard";
import { Role } from "@/enums/accountRole";
import { AuthProvider } from "@/contexts/JWTContext";
import { useEffect, useState } from "react";
import wishlistMarketApi from "@/api/market/wishlist";
import { getUserInfoId } from "@/utils/utils";

const WishlistPageProvider = (props: {}) => {
  const [uniqueArtworkIds, setUniqueArtworkIds] = useState<any>(null);

  useEffect(() => {
    wishlistMarketApi
      .getWishList(getUserInfoId())
      .then((response) => {
        if (response.data.isSuccess) {
          const uniqueArtworkIds = Array.from(
            new Set(
              response.data.result.details.map(
                (detail: any) => detail.artworkId
              )
            )
          );
          if (response.data.result) {
            setUniqueArtworkIds(uniqueArtworkIds);
          } else {
            setUniqueArtworkIds(undefined);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (uniqueArtworkIds == null) {
    return <></>;
  }

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
                        title={"Your Favorites"}
                        subtitle={"Let's see your favorite arts here"}
                      />
                    </div>
                    <Discover uniqueArtworkIds={uniqueArtworkIds} />
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

export default WishlistPageProvider;
