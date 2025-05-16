import Link from "next/link"
import { Linkedin, Github, MessageSquare, Zap, Brain, Dices } from "lucide-react"

// Social media link data
const socialLinks = [
  {
    href: "https://linkedin.com/in/andre-moura-tech/",
    icon: <Linkedin size={18} />,
    label: "LinkedIn"
  },
  {
    href: "https://github.com/andre-moura",
    icon: <Github size={18} />,
    label: "GitHub"
  },
  {
    href: "https://t.me/PragmaticThoughts",
    icon: <MessageSquare size={18} />,
    label: "Telegram"
  }
]

export function Footer() {
  return (
    <footer className="pt-8 border-t border-purple-400/30 relative z-10">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          {/* Game tagline */}
          <div className="flex items-center justify-center gap-2 text-sm text-purple-200 bg-purple-800/30 w-full py-3 backdrop-blur-sm border border-purple-400/20 rounded-lg">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Nobody exists on purpose. Nobody belongs anywhere. But everyone can match cards!</span>
            <Brain className="w-4 h-4 text-green-400" />
          </div>
          
          {/* Social links and copyright */}
          <div className="w-full flex flex-col sm:flex-row items-center gap-4 sm:gap-0 sm:justify-between py-3">
            <div className="flex gap-3">
              {socialLinks.map((link, index) => (
                <Link 
                  key={index}
                  href={link.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-purple-700/40 text-purple-200 hover:text-cyan-400 hover:bg-purple-600/50 transition-all duration-300 hover:scale-110 border border-purple-400/30 backdrop-blur-sm"
                  aria-label={link.label}
                >
                  {link.icon}
                </Link>
              ))}
            </div>
            
            <p className="text-sm text-purple-200/80 flex items-center gap-2">
              <span>&copy; 2025 Andre.</span>
              <span>All rights reserved.</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}