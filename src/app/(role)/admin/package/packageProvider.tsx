"use client";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/JWTContext";
import AuthGuard from "@/guards/AuthGuard";
import RoleBasedGuard from "@/guards/RoleBasedGuard";
import { Role } from "@/enums/accountRole";
import Package from "./package";

const PackageProvider: React.FC = () => {
  return (
    <AppProvider>
      <AuthProvider>
        <AuthGuard>
          <RoleBasedGuard accessibleRoles={[Role.ADMIN]}>
            <Package />
          </RoleBasedGuard>
        </AuthGuard>
      </AuthProvider>
    </AppProvider>
  );
};

export default PackageProvider;
