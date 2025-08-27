import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sway - Smart contract language of the future",
  description: "Safe, fast, and expressive smart contract language inspired by Rust. Built for the Fuel ecosystem.",
  icons: {
    icon: [
      { url: "/sway-light.png", media: "(prefers-color-scheme: light)" },
      { url: "/sway-dark.png", media: "(prefers-color-scheme: dark)" },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
