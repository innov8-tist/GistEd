"use client"

import { useState } from "react"
import { Theme, themes } from "../types/theme"
import { Navbar } from "../components/Navbar"

export default function StudyPlayground() {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[1])

  return (
    <div className={`min-h-screen} ${currentTheme.background} ${currentTheme.text}`}>
      <div className="flex flex-col h-screen">
        <Navbar 
          currentTheme={currentTheme} 
          setCurrentTheme={setCurrentTheme}
        />
      </div>
    </div>
  )
}

