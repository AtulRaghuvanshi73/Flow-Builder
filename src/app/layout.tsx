import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chatbot Flow Builder",
  description: "Create and manage chatbot flows with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}