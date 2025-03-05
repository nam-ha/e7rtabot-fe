import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E7 RTA Bot",
  description: "Epic7 RTA match-ups analysis. Give you more insights and interest in RTA. Pick wiser and win more!",
};

function Navbar() {
  return (
    <nav className="grid grid-cols-[0.3fr_0.4fr_0.3fr] h-24 w-full text-white pl-16 pr-16 items-center">
      <h1 className="text-3xl font-bold">E7 RTA Bot</h1>

      <div className="flex flex-row justify-end w-full">

      </div>

      <div className="flex justify-end">
        <a
          href="https://www.buymeacoffee.com/namhatankhu"
          target="_blank"
          rel="noopener noreferrer"
          style={
            {
              padding: '10px 20px',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '16px',
              color: '#ffffff',
              backgroundColor: '#40DCA5',
              border: '2px solid #000000',
              borderRadius: '5px',
              textDecoration: 'none',
            }
          }
        >
          ☕ Buy me a coffee
        </a>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="grid grid-cols-[0.4fr_0.3fr_0.3fr] h-32 w-full text-white pl-16 pr-16 items-center">
      <p> The data used in this application is collected from <a href="https://epic7.onstove.com/en/gg" className="text-blue-500 hover:underline"> Epic7 Match History </a> </p>
    </footer>
  );
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
