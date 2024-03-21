"use client";

import { AuthProvider } from "@/contexts/JWTContext";
import GuestGuard from "@/guards/GuestGuard";
import SignUpInfoScreen from "./SignUpInfoScreen";
import { AppProvider } from "@/contexts/AppContext";
import { AuthContextProvider } from "@/contexts/AuthGoogleContext";

const SignUpAuth = (props: {}) => {
  return (
    <>
      <AppProvider>
        <AuthContextProvider>
          <AuthProvider>
            <GuestGuard>
              <SignUpInfoScreen />
            </GuestGuard>
          </AuthProvider>
        </AuthContextProvider>
      </AppProvider>
    </>
  );
};

export default SignUpAuth;
