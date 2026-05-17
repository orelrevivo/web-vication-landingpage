import type { Metadata } from "next";
import { Suez_One, Varela_Round } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const varelaRound = Varela_Round({
  subsets: ["hebrew", "latin"],
  variable: "--font-varela-round",
  weight: "400",
});

const suezOne = Suez_One({
  subsets: ["hebrew", "latin"],
  variable: "--font-suez-one",
  weight: "400",
});

export const metadata: Metadata = {
  title: "תן תן",
  description: "חוויית אירוח בלתי נשכחת עם הנוף היפה ביותר באזור ירושלים. סוויטת תן תן בבית נקופה.",
  icons: {
    icon: "/icon.png?v=2",
  },
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



