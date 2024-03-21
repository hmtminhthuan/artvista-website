"use client";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/JWTContext";
import ResetPassword from "./ResetPasswordComponent";

const ResetPasswordProvider = (props: {}) => {
  return (
    <>
      <AppProvider>
        <AuthProvider>
          <ResetPassword />
        </AuthProvider>
      </AppProvider>
    </>
  );
};

export default ResetPasswordProvider;
