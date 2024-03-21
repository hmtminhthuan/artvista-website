import React from "react";
import Sidebar from "@/components/sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="d-flex flex-row">
      <Sidebar />
      <main className="flex-grow-1 p-3">
        {children}
      </main>
    </div>
  );
};

export default Layout;
