import "./globals.css";
import LayoutClient from "@/components/LayoutClient";

export const metadata = {
  title: "سوق الملخصات الجامعية",
  description:
    "منصة لبيع وشراء الملخصات الجامعية بين الطلاب، وفر وقتك واستفد من خبرات زملائك",
  keywords: [
    "ملخصات",
    "جامعة",
    "طلاب",
    "مذاكرة",
    "بيع",
    "شراء",
    "ملخصات جامعية",
  ],
  authors: [{ name: " أ+" }],
  creator: " أ+ Team",
  openGraph: {
    title: "سوق الملخصات الجامعية",
    description: "اشترِ أو بع ملخصاتك الجامعية بسهولة وأمان عبر منصة  أ+",
    url: "https://aplusplatformsa.com",
    siteName: "سوق الملخصات الجامعية",
    locale: "ar_EG",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "سوق الملخصات الجامعية",
    description: "منصة تبادل ملخصات دراسية بين طلاب الجامعات.",
    creator: "@your_handle",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Tajawal:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          fontFamily: "Tajawal, sans-serif",
          width: "100%",
          overflowX: "hidden",
        }}
      >
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
