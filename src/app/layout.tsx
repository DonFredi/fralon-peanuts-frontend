import type { Metadata } from "next";
import { Sofia_Sans, Fraunces } from "next/font/google";
import "@/styles/globals.css";
import { generateSEO } from "@/shared/lib/seo";
import QueryProvider from "@/providers/QueryProvider";
import AuthProvider from "@/providers/AuthProvider";
import { CartProvider } from "@/modules/cart/context/cart-context";
import CartDrawer from "@/modules/cart/components/CartDrawer";

const secondary = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const primary = Sofia_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = generateSEO();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="min-h-screen">
      <body className={`${primary.variable} ${secondary.variable} antialiased gap-y-10 flex flex-col`}>
        {/* Organization */}
        {/* <JsonLd data={organizationSchema} /> */}
        {/* Website */}
        {/* <JsonLd data={websiteSchema} /> */}
        <QueryProvider>
          <AuthProvider>
            <CartProvider>
              {children}
              {/* CartDrawer is mounted once here — opened via useCart().openDrawer() from anywhere */}
              <CartDrawer />
            </CartProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
