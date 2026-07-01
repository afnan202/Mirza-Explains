import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jbmono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jbmono",
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mirza Explains — Information-Geometric Bone Health Classification",
  description:
    "An interactive walkthrough of IG-CNN: Fisher attention, curvature pooling, and information-bottleneck regularization for staging bone health from knee radiographs.",
};

// Inline script avoids a flash of wrong theme before hydration.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('mirza-theme');
    var theme = stored || 'dark';
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.classList.toggle('dark', theme !== 'light');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${fraunces.variable} ${inter.variable} ${jbmono.variable} font-body antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
