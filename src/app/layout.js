import { Kumbh_Sans, Roboto_Slab, Space_Mono } from "next/font/google";
import "./globals.css";

const kumbh_sans = Kumbh_Sans({
  subsets: ["latin"],
  variable: "--kumbh-sans",
});

const roboto_slab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--roboto-slab",
});

const space_mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--space-mono",
});

export const metadata = {
  title: "Frontend Mentor | Pomodoro app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`bg-background ${kumbh_sans.variable} ${roboto_slab.variable} ${space_mono.variable} h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
