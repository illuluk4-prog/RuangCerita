import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { AppNavigation } from "@/components/app-navigation";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RuangCerita | Ruang tumbuh dan belajar",
  description: "Dukungan belajar yang personal untuk setiap hari.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} h-full antialiased`}>
      <body className="min-h-full">
        <AppNavigation>{children}</AppNavigation>
      </body>
    </html>
  );
}
