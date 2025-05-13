"use client";

import React, { useState, useEffect } from "react";
import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes";
import {ImageKitProvider} from "imagekitio-next"
import { ToastProvider } from "@heroui/react";

export interface ProviderProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

// ImageKit authentication function
const authenticator = async () => {
  try {
    const response = await fetch("/api/imagekit-auth");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
};

const Providers = ({ children, themeProps }: ProviderProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; 

  return (
    <HeroUIProvider>
      <ImageKitProvider authenticator={authenticator}
      publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || ""}
        urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ""}
      >
        <ToastProvider placement="top-right"/>
      <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      </ImageKitProvider>
    </HeroUIProvider>
  );
};

export default Providers;
