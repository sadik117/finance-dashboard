import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'


export const metadata: Metadata = {

  title: 'FinanceTrack - Personal Finance Dashboard',

  description: 'Track your finances, manage transactions, and gain insights into your spending patterns with FinanceTrack.',
  
  icons: {
    icon: [
      {
        url: '/public/icon-light.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/public/icon-dark.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/public/icon.png',
        type: 'image/png',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
