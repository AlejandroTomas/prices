import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { fonts } from "./fonts";
import { Toaster } from "react-hot-toast";
import Header from "@/components/Header";
import "../styles/global.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: "Precios Miscelanea",
  description: "Aplicacion de precios y stock",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={fonts.rubik.variable}
      style={{ fontSize: "23px" }}
    >
      <body className={inter.className}>
        <Providers>
          <Header />
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
