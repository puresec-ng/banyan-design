import type { Metadata } from "next";
import Script from "next/script";
import { Lato, Roboto, Montserrat } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "./utils/ReactQueryProvider";
import { ToastProvider } from "./context/ToastContext";
import { siteConfig } from './site';


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
  title: {
    default: "Banyan Claims | Claims Advisory and Support in Nigeria",
    template: "%s",
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: 'website',
  },
  twitter: {
    title: siteConfig.name,
    description: siteConfig.description,
  },
  icons: {
    icon: '/real-favicon.ico',
    shortcut: '/real-favicon.ico',
    apple: '/real-favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${lato.variable} ${roboto.variable} ${montserrat.variable} font-roboto`}>
        <ReactQueryProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ReactQueryProvider>
        <Script id="zoho-salesiq-config" strategy="afterInteractive">
          {`window.$zoho = window.$zoho || {}; window.$zoho.salesiq = window.$zoho.salesiq || { ready: function () {} };`}
        </Script>
        <Script
          id="zsiqscript"
          src="https://salesiq.zohopublic.com/widget?wc=siq19c436bf10fb92b0176b13350429aa51512a3d2eb85b0a48dab4d1184e7d96fcafbd86e7b7b321da3b4329de3462aef4"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
