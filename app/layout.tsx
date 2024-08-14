import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppWalletProvider from "./components/AppWalletProvider";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Token-Play",
  description: "Create Tokens on Solana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
<AppWalletProvider>
  <section className="overflow-hidden">
   
    <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
             <Navbar/>
            {children}
            <Footer/>
            <Toaster />
          </ThemeProvider>

  </section>
</AppWalletProvider>
      
      </body>
    </html>
  );
}
