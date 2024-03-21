// AOSWrapper.tsx
import { ReactNode, useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";

function AOSWrapper({ children }: { children: ReactNode }) {
  useEffect(() => {
    Aos.init();
  }, []);

  return <>{children}</>;
}

export default AOSWrapper;
