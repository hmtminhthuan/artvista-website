"use client";
import { AuthProvider } from "@/contexts/JWTContext";
import SignIn from "./SignIn";
import { AppProvider } from "@/contexts/AppContext";
import { AuthContextProvider } from "@/contexts/AuthGoogleContext";

const SignInAuth = (props: {}) => {
  return (
    <>
      <AppProvider>
        <AuthProvider>
          <AuthContextProvider>
            <SignIn />
          </AuthContextProvider>
        </AuthProvider>
      </AppProvider>
    </>
  );
};

export default SignInAuth;
