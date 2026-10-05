import { Suspense } from "react";
import type { Metadata } from "next";
import { Roboto_Flex } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { ToastProvider } from "@/components/Toast/ToastContext";
import { CartProvider } from "@/components/Cart/CartContext";
import { PurchaseModalProvider } from "@/components/PurchaseModal/PurchaseModalContext";
import { AuthProvider } from "@/components/Auth/AuthContext";
import PurchaseModal from "@/components/PurchaseModal/PurchaseModal";
import NavigationProgress from "@/components/Navigation/NavigationProgress";

const robotoFlex = Roboto_Flex({
  subsets: ["latin", "vietnamese"],
  variable: "--font-roboto-flex",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://nexus-gaming.vercel.app"),
  title: "Nexus Gaming - Thiết bị công nghệ & Gaming Gear hàng đầu",
  description:
    "Nexus Gaming - Hệ thống phân phối thiết bị công nghệ, laptop, linh kiện máy tính và gaming gear cao cấp chính hãng. Tư vấn cấu hình và đặt mua trực tiếp qua Messenger.",
  keywords: [
    "nexus gaming",
    "gaming gear",
    "thiết bị công nghệ",
    "laptop gaming",
    "linh kiện máy tính",
    "bàn phím cơ",
    "tai nghe gaming",
    "mua hàng qua messenger",
  ],
  icons: {
    icon: "https://i.ibb.co/kscwh90r/1791124308042-505601018264934382-505601018264934382-7dda37cbc2520338fabb83f6966bb96b.jpg",
    apple: "https://i.ibb.co/kscwh90r/1791124308042-505601018264934382-505601018264934382-7dda37cbc2520338fabb83f6966bb96b.jpg",
  },
  openGraph: {
    title: "Nexus Gaming - Thiết bị công nghệ & Gaming Gear hàng đầu",
    description:
      "Nexus Gaming - Hệ thống phân phối thiết bị công nghệ, gaming gear, laptop và linh kiện máy tính chính hãng.",
    type: "website",
    images: [
      {
        url: "https://i.ibb.co/kscwh90r/1791124308042-505601018264934382-505601018264934382-7dda37cbc2520338fabb83f6966bb96b.jpg",
        width: 800,
        height: 800,
        alt: "Nexus Gaming Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning className={robotoFlex.variable}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('nexusgaming_theme') || localStorage.getItem('tamstore_theme') || localStorage.getItem('techstore_theme');
                const isDark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <PurchaseModalProvider>
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
                <PurchaseModal />
              </PurchaseModalProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
