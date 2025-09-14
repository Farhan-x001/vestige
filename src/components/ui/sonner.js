"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg""var(--popover)",
          "--normal-text""var(--popover-foreground)",
          "--normal-border""var(--border)",
        } as React.CSSProperties
      }
      toastOptions={{
        success{
          style{
            borderColor"hsl(142.1 76.2% 36.3%)", // Green for success
          },
        },
        error{
          style{
            borderColor"hsl(0 84.2% 60.2%)", // Red for error
          },
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
