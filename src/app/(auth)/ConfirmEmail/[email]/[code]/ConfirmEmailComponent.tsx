"use client";

import authApi from "@/api/auth/auth";
import Loading from "@/components/Loading/Loading";
import useAppContext from "@/hooks/useAppContext";
import useAuth from "@/hooks/useAuth";
import sweetAlert from "@/utils/sweetAlert";
import { NextPage } from "next";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ConfirmEmail: NextPage = () => {
  const params = useParams();
  const email = params.email as string;
  const code = params.code as string;
  const { isLoading, enableLoading, disableLoading } = useAppContext();
  const { loginWithEmail } = useAuth();
  const router = useRouter();

  useEffect(() => {
    enableLoading();
    authApi
      .ConfirmEmail(email, code)
      .then((response) => {
        if (
          response.data.isSuccess &&
          response.data.result &&
          response.data.result.succeeded
        ) {
          loginWithEmail(email);
        } else if (
          response.data.isSuccess &&
          response.data.result &&
          !response.data.result.succeeded
        ) {
          sweetAlert.alertFailed(
            "Failed to confirm",
            "Please try again...",
            2000,
            22
          );
          router.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <section className="w-screnn h-screen">
        <Loading loading={isLoading} />
      </section>
    </>
  );
};
export default ConfirmEmail;
