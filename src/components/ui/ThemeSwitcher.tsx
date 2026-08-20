import { useState, useRef, useEffect } from 'react'
import { Palette, Check, Sun, Moon, Droplets, Sparkles, ChevronDown } from 'lucide-react'
import { useTheme, THEME_OPTIONS, type ThemeMode } from '../../context/ThemeContext'

interface ThemeSwitcherProps {
  compact?: boolean
  showLabel?: boolean
  className?: string
}

export default function ThemeSwitcher({ compact = false, showLabel = true, className = '' }: ThemeSwitcherProps) {
  const { theme, setTheme, currentThemeConfig } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getThemeIcon = (id: ThemeMode) => {
    switch (id) {
      case 'light':
        return <Sun size={15} className="text-amber-500" />
      case 'ocean':
        return <Droplets size={15} className="text-sky-400" />
      case 'emerald':
        return <Sparkles size={15} className="text-emerald-400" />
      case 'dark':
      default:
        return <Moon size={15} className="text-cyan-400" />
    }
  }

  if (compact) {
    return (
      <div className={`relative inline-block ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all hover:border-cyan-500/40 hover:bg-white/10 hover:text-white"
          title={`Theme: ${currentThemeConfig.name}`}
          aria-label="Toggle theme menu"
        >
          <Palette size={16} />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-navy-900/95 p-2 shadow-2xl backdrop-blur-xl animate-fadeIn">
            <div className="px-3 py-2 border-b border-white/5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Display Theme</p>
            </div>
            <div className="mt-1 space-y-1">
              {THEME_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setTheme(opt.id)
                    setIsOpen(false)
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                    theme === opt.id
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-3 w-3 rounded-full border border-white/20"
                      style={{ backgroundColor: opt.accentColor }}
                    />
                    <span>{opt.name}</span>
                  </div>
                  {theme === opt.id && <Check size={14} className="text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-200 shadow-sm backdrop-blur transition-all hover:border-cyan-500/40 hover:bg-white/[0.08]"
      >
        <div className="flex items-center gap-1.5">
          {getThemeIcon(theme)}
          {showLabel && <span>{currentThemeConfig.name}</span>}
        </div>
        <ChevronDown size={13} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-white/10 bg-navy-900/95 p-2 shadow-2xl backdrop-blur-xl animate-fadeIn">
          <div className="px-3 py-2 border-b border-white/5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Select Interface Theme</p>
            <p className="text-[10px] text-slate-500">Tailored for SIH demonstration</p>
          </div>
          <div className="mt-1 space-y-1">
            {THEME_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setTheme(opt.id)
                  setIsOpen(false)
                }}
                className={`flex w-full items-start justify-between rounded-xl p-2.5 text-left transition-all ${
                  theme === opt.id
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-4 w-4 items-center justify-center">
                    <span
                      className="h-3 w-3 rounded-full border border-white/20"
                      style={{ backgroundColor: opt.accentColor }}
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold">{opt.name}</p>
                    <p className="mt-0.5 text-[10px] text-slate-400 leading-tight">{opt.description}</p>
                  </div>
                </div>
                {theme === opt.id && <Check size={14} className="text-cyan-400 shrink-0 mt-1" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
