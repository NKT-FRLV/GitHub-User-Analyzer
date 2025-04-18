import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from './context/AuthContext';
import ThemeRegistry from './theme/ThemeRegistry';
import styles from './page.module.css';
import Header from './components/header/Header';
import Footer from './components/footer/footer';
import { AuthProviderWrapper } from './providers/AuthProviderWrapper';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "profile-analyzer",
  description: "profile-analyzer for GitHub users, repositories, languages, etc.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeRegistry>
          <AuthProviderWrapper>
              <div className={styles.page}>
                <Header />
                {children}
                <Footer />              
              </div>
          </AuthProviderWrapper>
        </ThemeRegistry>
      </body>
    </html>
  );
}
