import type { Metadata } from "next";
import { Suez_One } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";

const varelaRound = localFont({
  src: "../public/fonts/VarelaRound-Regular.ttf",
  variable: "--font-varela-round",
});

const suezOne = Suez_One({
  subsets: ["hebrew", "latin"],
  variable: "--font-suez-one",
  weight: "400",
});

export const metadata: Metadata = {
  title: "סוויטת טן טן - נופש יוקרתי בבית נקופה",
  description: "חוויית אירוח בלתי נשכחת עם הנוף היפה ביותר באזור ירושלים. סוויטת טן טן בבית נקופה.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        suezOne.variable,
        varelaRound.variable,
        "font-varela"
      )}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-white text-black font-varela">
        {children}
      </body>
    </html>

  );
}



