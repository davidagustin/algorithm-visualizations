import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Algomations - Algorithm Visualization",
    template: "%s | Algomations",
  },
  description:
    "Visualize coding interview algorithms step by step with interactive animations, line-by-line code execution, and custom inputs across multiple languages.",
  keywords: [
    "algorithm",
    "visualization",
    "leetcode",
    "data structures",
    "coding interview",
    "animation",
    "two pointers",
    "dynamic programming",
    "binary search",
    "backtracking",
  ],
};

const themeScript = `
(function() {
  var t = localStorage.getItem('algomations-theme');
  if (t === 'light' || t === 'dark') {
    document.documentElement.setAttribute('data-theme', t);
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
