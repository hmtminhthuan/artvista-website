import { useState, ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuth from "@/hooks/useAuth";

type AuthGuardProps = {
  children: ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isInitialized } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [requestedLocation, setRequestedLocation] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!isAuthenticated && isInitialized) {
      router.push("/");
    }
  }, [isAuthenticated, isInitialized, pathname, requestedLocation]);

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return <></>;
}
