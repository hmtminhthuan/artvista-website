"use client";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/JWTContext";
import ConfirmEmail from "./ConfirmEmailComponent";

const ConfirmEmailProvider = (props: {}) => {
  return (
    <>
      <AppProvider>
        <AuthProvider>
          <ConfirmEmail />
        </AuthProvider>
      </AppProvider>
    </>
  );
};

export default ConfirmEmailProvider;
