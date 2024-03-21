"use client";
import React, { useState, ReactNode } from "react";
import ShopLayoutComponent from "./ShopLayoutProvider";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/JWTContext";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppProvider>
        <AuthProvider>
          <ShopLayoutComponent>{children}</ShopLayoutComponent>
        </AuthProvider>
      </AppProvider>
    </>
  );
}
