'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { StudyPlan, UserStats, StudyPlanFormData, TaskStatus } from './types'
import { generateMockPlan, mockUserStats, mockExistingPlans } from './mock-data'

type AppView = 'landing' | 'setup' | 'result' | 'calendar' | 'dashboard'

interface AppContextType {
  currentView: AppView
  setCurrentView: (view: AppView) => void
  plans: StudyPlan[]
  currentPlan: StudyPlan | null
  userStats: UserStats
  isLoading: boolean
  createPlan: (data: StudyPlanFormData) => Promise<void>
  updateTaskStatus: (planId: string, taskId: string, status: TaskStatus) => void
  selectPlan: (planId: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<AppView>('landing')
  const [plans, setPlans] = useState<StudyPlan[]>(mockExistingPlans)
  const [currentPlan, setCurrentPlan] = useState<StudyPlan | null>(null)
  const [userStats, setUserStats] = useState<UserStats>(mockUserStats)
  const [isLoading, setIsLoading] = useState(false)

  const createPlan = async (data: StudyPlanFormData) => {
    setIsLoading(true)
    
    // Simula delay de geração da IA
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newPlan = generateMockPlan(
      data.objective,
      data.dailyTime,
      data.totalDuration,
      data.level
    )
    
    setPlans(prev => [...prev, newPlan])
    setCurrentPlan(newPlan)
    setUserStats(prev => ({ ...prev, totalPlans: prev.totalPlans + 1 }))
    setIsLoading(false)
    setCurrentView('result')
  }

  const updateTaskStatus = (planId: string, taskId: string, status: TaskStatus) => {
    setPlans(prev => prev.map(plan => {
      if (plan.id !== planId) return plan
      
      const updatedModules = plan.modules.map(module => ({
        ...module,
        tasks: module.tasks.map(task => 
          task.id === taskId ? { ...task, status } : task
        )
      }))
      
      // Calcula novo progresso
      const allTasks = updatedModules.flatMap(m => m.tasks)
      const completedTasks = allTasks.filter(t => t.status === 'concluido').length
      const progress = Math.round((completedTasks / allTasks.length) * 100)
      
      return { ...plan, modules: updatedModules, progress }
    }))

    // Atualiza currentPlan se necessário
    if (currentPlan?.id === planId) {
      setCurrentPlan(prev => {
        if (!prev) return null
        const updatedModules = prev.modules.map(module => ({
          ...module,
          tasks: module.tasks.map(task => 
            task.id === taskId ? { ...task, status } : task
          )
        }))
        const allTasks = updatedModules.flatMap(m => m.tasks)
        const completedTasks = allTasks.filter(t => t.status === 'concluido').length
        const progress = Math.round((completedTasks / allTasks.length) * 100)
        return { ...prev, modules: updatedModules, progress }
      })
    }

    // Atualiza stats
    if (status === 'concluido') {
      setUserStats(prev => ({
        ...prev,
        daysStudied: prev.daysStudied + 1,
        streak: prev.streak + 1
      }))
    }
  }

  const selectPlan = (planId: string) => {
    const plan = plans.find(p => p.id === planId)
    if (plan) {
      setCurrentPlan(plan)
      setCurrentView('result')
    }
  }

  return (
    <AppContext.Provider value={{
      currentView,
      setCurrentView,
      plans,
      currentPlan,
      userStats,
      isLoading,
      createPlan,
      updateTaskStatus,
      selectPlan
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
