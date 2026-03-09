import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Ein Jahr mit Laura",
  description: "Eine kleine Seite für unser erstes gemeinsames Jahr.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
