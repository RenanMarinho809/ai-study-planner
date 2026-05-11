'use client'

import { BookOpen, Calendar, Home, LayoutDashboard, Plus, LogIn, User } from 'lucide-react'
import { useApp } from '@/lib/app-context'
import { cn } from '@/lib/utils'

export function MobileNav() {
  const { currentView, setCurrentView, currentPlan, isAuthenticated } = useApp()

  const navItems = [
    { id: 'landing', label: 'Inicio', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'setup', label: 'Novo', icon: Plus, isAction: true },
    ...(currentPlan ? [
      { id: 'result', label: 'Plano', icon: BookOpen },
      { id: 'calendar', label: 'Calendario', icon: Calendar },
    ] : []),
    ...(isAuthenticated ? [
      { id: 'profile', label: 'Perfil', icon: User },
    ] : [
      { id: 'login', label: 'Entrar', icon: LogIn },
    ]),
  ] as const

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = currentView === item.id
          const isAction = 'isAction' in item && item.isAction

          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as typeof currentView)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-colors",
                isAction && "relative",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isAction ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                  <item.icon className="h-5 w-5" />
                </div>
              ) : (
                <>
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
