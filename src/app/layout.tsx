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
  title: {
    default: "Banyan Claims | Claims Support and Documentation Review in Nigeria",
    template: "%s | Banyan Claims",
  },
  description: "Claims advisory and documentation support for individuals and businesses. Organise claim documents, identify gaps and track next steps before insurer review.",
  openGraph: {
    title: "Banyan Claims Consultant Limited",
    description: "Claims support, documentation review and workflow support for individuals, SMEs and business users.",
  },
  twitter: {
    title: "Banyan Claims Consultant Limited",
    description: "Claims support, documentation review and workflow support for individuals, SMEs and business users.",
  },
  icons: {
    icon: 'https://banyanclaims.com/real-favicon.ico',
    shortcut: 'https://banyanclaims.com/real-favicon.ico',
    apple: 'https://banyanclaims.com/real-favicon.ico',
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
      </body>
    </html>
  );
}
