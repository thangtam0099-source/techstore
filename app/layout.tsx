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

const robotoFlex = Roboto_Flex({
  subsets: ["latin", "vietnamese"],
  variable: "--font-roboto-flex",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tâm Store - Thiết bị công nghệ cho cuộc sống hiện đại",
  description:
    "Cửa hàng thiết bị công nghệ chính hãng Tâm Store. Khám phá điện thoại, laptop, phụ kiện cao cấp và liên hệ đặt mua trực tiếp qua Messenger.",
  keywords: ["tâm store", "tam store", "công nghệ", "điện thoại", "laptop", "tai nghe", "mua hàng qua messenger"],
  openGraph: {
    title: "Tâm Store - Thiết bị công nghệ cho cuộc sống hiện đại",
    description: "Cửa hàng công nghệ cá nhân Tâm Store, tư vấn và mua sắm trực tiếp qua Messenger.",
    type: "website",
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('tamstore_theme') || localStorage.getItem('techstore_theme');
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
