import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/navbar";
import { Metadata, Viewport } from "next";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
}
