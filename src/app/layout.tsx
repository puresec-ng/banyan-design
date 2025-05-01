import type { Metadata } from "next";
import { Lato, Roboto, Montserrat } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "./utils/ReactQueryProvider";
import { ToastProvider } from "./context/ToastContext";


const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-lato",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Banyan Claims Consultant Limited",
  description: "Nigeria's leading claims advocacy platform with a technology-driven approach",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${lato.variable} ${roboto.variable} ${montserrat.variable} font-roboto`}>
        <ReactQueryProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
