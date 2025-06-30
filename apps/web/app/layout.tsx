import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ClientWrapper from "./clientWrapper";
import Script from "next/script";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Podler",
 description: 'Your online studio to record in high quality, edit in a flash, and go live with a bang. Not necessarily in that order. ',

  openGraph:{
    title:"PODLER",
  description: 'Your online studio to record in high quality, edit in a flash, and go live with a bang. Not necessarily in that order. ',
  url:"https://podler.space",
  siteName:"Podler",
  images:[
    {
      url:"https://podler.space/og-image.png",
      width: 1200,
        height: 630,
        alt: "OG IMAGE",
    }
  ],
 type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://framerusercontent.com/images/WvFh2TMS1tCIePziL9svv1pBVb8.png"/>
        <link href="https://framerusercontent.com/images/WvFh2TMS1tCIePziL9svv1pBVb8.png" rel="icon" media="(prefers-color-scheme: light)"></link>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-SVZJMN8VLY"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SVZJMN8VLY', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ClientWrapper>
          {children}
        </ClientWrapper>


        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
