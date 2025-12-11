import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import SideBar from "../components/sideBar";
import SideBarMobile from "../components/mobile/sideBarMobile";
import { AppContextProvider } from "../components/context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MMCar",
  description: "Manage your company car fleet",
};

export default function HomeLayout({
  modals,
  children,
}: {
  modals: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex-row sm:flex-col`}
      >
        <AppContextProvider>
          <div className="hidden sm:flex w-14 lg:w-52 fixed top-0 left-0 z-20 h-screen">
            <SideBar></SideBar>
          </div>
          <div className="flex sm:hidden fixed top-0">
            <SideBarMobile></SideBarMobile>
          </div>
          <div className="flex-1 mt-12 sm:mt-0 sm:ml-14 lg:ml-52 sm:min-w-[820px]">
            {children}
          </div>
          {modals}
        </AppContextProvider>
      </body>
    </html>
  );
}
