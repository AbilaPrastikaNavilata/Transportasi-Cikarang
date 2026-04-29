"use client"

import { motion } from "framer-motion"
import { Navigation } from "lucide-react"

interface LogoProps {
  className?: string
  textSize?: string
  iconSize?: number
  light?: boolean
}

export function Logo({ className = "", textSize = "text-2xl", iconSize = 28, light = false }: LogoProps) {
  return (
    <motion.div 
      className={`flex items-center gap-2 cursor-pointer select-none ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative flex items-center justify-center">
        {/* Glow effect behind icon */}
        <motion.div 
          className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-60"
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Modern Icon Box */}
        <div className="relative bg-gradient-to-tr from-[#0053db] to-blue-400 p-1.5 rounded-xl shadow-lg border border-blue-300/20">
          <Navigation size={iconSize} className="text-white fill-white/20" strokeWidth={2.5} />
        </div>
      </div>
      
      {/* Modern Typography */}
      <span className={`${textSize} font-extrabold tracking-tight ${light ? "text-white" : "text-[#0F172A]"} flex items-center`}>
        Cikarang
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0053db] to-emerald-400 ml-[1px]">
          Go
        </span>
      </span>
    </motion.div>
  )
}
