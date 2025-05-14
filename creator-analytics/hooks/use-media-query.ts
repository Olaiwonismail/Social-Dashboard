"use client"

import { useState, useEffect } from "react"

/**
 * Custom hook that returns whether a media query matches the current viewport
 * @param query The media query to check (e.g., "(max-width: 768px)")
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Default to false on the server or during initial client render
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    // Create a media query list
    const mediaQuery = window.matchMedia(query)

    // Set the initial value
    setMatches(mediaQuery.matches)

    // Define a callback function to handle changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Add the event listener
    mediaQuery.addEventListener("change", handleChange)

    // Clean up the event listener when the component unmounts
    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [query])

  return matches
}
