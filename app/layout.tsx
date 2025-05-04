import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "./providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "My App",
  description: "Next.js + Tailwind + Clerk + HeroUI + Theme",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Providers
            themeProps={{
              attribute: "data-theme",
              defaultTheme: "dark", // or "light" or "system"
              enableSystem: false,
            }}
          >
            {children}
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
