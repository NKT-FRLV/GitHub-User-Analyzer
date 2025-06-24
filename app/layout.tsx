import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import { AuthProvider } from './context/AuthContext';
import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';
// import CssBaseline from '@mui/material/CssBaseline';
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
  title: "Profile Analyzer - GitHub Profile Analysis Tool",
  description: "Comprehensive GitHub profile analyzer for users, repositories, languages analysis and developer insights. Analyze GitHub profiles, repositories, programming languages and get detailed statistics.",
  keywords: "GitHub, profile analyzer, repository analysis, developer tools, programming languages, GitHub statistics, code analysis",
  authors: [{ name: "Profile Analyzer Team" }],
  creator: "Profile Analyzer",
  publisher: "Profile Analyzer",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Profile Analyzer - GitHub Profile Analysis Tool",
    description: "Comprehensive GitHub profile analyzer for users, repositories, languages analysis and developer insights.",
    url: '/',
    siteName: 'Profile Analyzer',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Profile Analyzer - GitHub Profile Analysis Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Profile Analyzer - GitHub Profile Analysis Tool",
    description: "Comprehensive GitHub profile analyzer for users, repositories, languages analysis and developer insights.",
    creator: '@profile_analyzer',
    images: ['/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  console.log("RootLayout rendered")

  
  return (
    // CSS baseline is used to reset the CSS to the default values
	// Important for MUI to work properly
    <ScopedCssBaseline>

      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/og-image.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/og-image.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <meta name="theme-color" content="#000000" />
        </head>
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
    </ScopedCssBaseline>
  );
}
