import type { Metadata } from "next";
import { headers } from "next/headers";
import Header from "@/components/header";
import "./globals.scss";
import "./fonts.scss";
import type { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

export const metadata: Metadata = {
  title: "国能资源一张图",
  description: "国能资源一张图",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers() as unknown as ReadonlyHeaders;
  // const pathname = headersList.get("x-pathname");

  // console.log(pathname);
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        {/* <Footer /> */}
      </body>
    </html>
  );
}
