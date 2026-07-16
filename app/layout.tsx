import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MAGNAtech Robotics",
  description: "WM Rebel Robotics, FRC Team 3468, in West Monroe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
