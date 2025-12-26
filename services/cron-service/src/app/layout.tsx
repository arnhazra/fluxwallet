import React from "react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Ok</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
        />
        <meta name="theme-color" content="#121212" />
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
