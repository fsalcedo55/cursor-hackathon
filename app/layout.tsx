import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "RaiseSignal — Fundraising OS",
  description: "Get investor-ready with RaiseSignal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      style={{
        ["--font-geist-sans" as string]:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        ["--font-geist-mono" as string]:
          "SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace",
      }}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
