import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ReduxProvider } from "@/providers/ReduxProvider";
import { AppUserWrapper } from "@/providers/AppUserWrap";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blogify - Share Your Stories",
  description:
    "A modern platform for sharing your thoughts and stories with the world",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(inter.className, "min-h-screen bg-background")}
        suppressHydrationWarning
      >
        <ReduxProvider>
          <AppUserWrapper>
            <Providers>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </Providers>
          </AppUserWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
}
