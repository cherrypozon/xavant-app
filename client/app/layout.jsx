import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PageLoader from "./components/PageLoader/main";
import { Providers } from "./provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Xavant",
  description: "Powered by Smart Sensing & Gen AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <PageLoader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
