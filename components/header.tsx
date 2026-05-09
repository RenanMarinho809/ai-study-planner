'use client'

import { BookOpen, Calendar, LayoutDashboard, Home, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useApp } from '@/lib/app-context'

export function Header() {
  const { currentView, setCurrentView, currentPlan } = useApp()

  const navItems = [
    { id: 'landing', label: 'Início', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ...(currentPlan ? [
      { id: 'result', label: 'Plano', icon: BookOpen },
      { id: 'calendar', label: 'Calendário', icon: Calendar },
    ] : []),
  ] as const

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <button 
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold text-foreground">
            AI Study Planner
          </span>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={currentView === item.id ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView(item.id as typeof currentView)}
              className="gap-2"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>

        <Button 
          onClick={() => setCurrentView('setup')}
          className="gap-2"
          size="sm"
        >
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">Novo Plano</span>
        </Button>
      </div>
    </header>
  )
}
