"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthService } from "@/services/AuthService";

const Guard = (WrappedComponent: React.FC<any>) => {
  const AuthGuard: React.FC<any> = (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = AuthService.getToken();
      if (!token) {
        router.push("/admin/login");
      }
    }, []);

    return <WrappedComponent {...props} />;
  };

  return AuthGuard;
};

export default Guard;
