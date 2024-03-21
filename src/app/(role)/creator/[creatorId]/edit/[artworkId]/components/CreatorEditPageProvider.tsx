"use client";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/JWTContext";
import ShopLayout from "@/components/Shop/ShopLayout";
import RoleBasedGuard from "@/guards/RoleBasedGuard";
import { Role } from "@/enums/accountRole";
import AuthGuard from "@/guards/AuthGuard";
import IdBasedGuard from "@/guards/IdBasedGuard";
import { getUserInfoId } from "@/utils/utils";
import CreatorCreatePage from "../../../create/components/CreatorCreatePage";

const CreatorEditPageProvider: React.FC = () => {
  return (
    <AppProvider>
      <AuthProvider>
        <AuthGuard>
          <RoleBasedGuard accessibleRoles={[Role.CREATOR]}>
            <IdBasedGuard accessibleIds={[getUserInfoId()]}>
              <ShopLayout>
                <CreatorCreatePage editMode={true} />
              </ShopLayout>
            </IdBasedGuard>
          </RoleBasedGuard>
        </AuthGuard>
      </AuthProvider>
    </AppProvider>
  );
};

export default CreatorEditPageProvider;
