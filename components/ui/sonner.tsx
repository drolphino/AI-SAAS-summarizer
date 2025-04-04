"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <div className="pt-10 mt-10">
      <Sonner
        theme={theme as ToasterProps["theme"]}
        position="top-right"
        offset={60} // Lower the toast slightly
        className="toaster group"
        style={
          {
            "--normal-bg": "var(--popover)",
            "--normal-text": "var(--popover-foreground)",
            "--normal-border": "var(--border)",
            "--toast-title": theme === "dark" ? "#f0f0f0" : "#4a4a4a", // Light gray in dark mode, dark gray in light mode
            "--toast-description": theme === "dark" ? "#333333" : "#333333", // Adjust for readability
          } as React.CSSProperties
        }
        {...props}
      />


    </div>
  )
}

export { Toaster }
