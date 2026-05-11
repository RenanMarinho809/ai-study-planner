'use client'

import { AppProvider, useApp } from '@/lib/app-context'
import { Header } from '@/components/header'
import { LandingPage } from '@/components/landing-page'
import { SetupForm } from '@/components/setup-form'
import { ResultView } from '@/components/result-view'
import { CalendarView } from '@/components/calendar-view'
import { Dashboard } from '@/components/dashboard'
import { MobileNav } from '@/components/mobile-nav'
import { LoginForm } from '@/components/login-form'
import { RegisterForm } from '@/components/register-form'
import { ProfilePage } from '@/components/profile-page'

function AppContent() {
  const { currentView } = useApp()

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage />
      case 'setup':
        return <SetupForm />
      case 'result':
        return <ResultView />
      case 'calendar':
        return <CalendarView />
      case 'dashboard':
        return <Dashboard />
      case 'profile':
        return <ProfilePage />
      case 'login':
        return <LoginForm />
      case 'register':
        return <RegisterForm />
      default:
        return <LandingPage />
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      <main>
        {renderView()}
      </main>
      <MobileNav />
    </div>
  )
}

export default function Page() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
