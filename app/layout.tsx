import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Terra Logger",
  description: "Geospatial planning tool for offgrid cabin layouts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
