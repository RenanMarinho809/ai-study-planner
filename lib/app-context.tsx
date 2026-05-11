'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { StudyPlan, UserStats, StudyPlanFormData, TaskStatus, User, LoginFormData, RegisterFormData } from './types'
import { generateMockPlan, mockUserStats, mockExistingPlans } from './mock-data'

type AppView = 'landing' | 'setup' | 'result' | 'calendar' | 'dashboard' | 'profile' | 'login' | 'register'

interface AppContextType {
  currentView: AppView
  setCurrentView: (view: AppView) => void
  plans: StudyPlan[]
  currentPlan: StudyPlan | null
  userStats: UserStats
  isLoading: boolean
  user: User | null
  isAuthenticated: boolean
  createPlan: (data: StudyPlanFormData) => Promise<void>
  updatePlan: (planId: string, data: Partial<StudyPlan>) => Promise<void>
  deletePlan: (planId: string) => Promise<void>
  updateTaskStatus: (planId: string, taskId: string, status: TaskStatus) => void
  selectPlan: (planId: string) => void
  login: (data: LoginFormData) => Promise<void>
  register: (data: RegisterFormData) => Promise<void>
  logout: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<AppView>('login')
  const [plans, setPlans] = useState<StudyPlan[]>([])
  const [currentPlan, setCurrentPlan] = useState<StudyPlan | null>(null)
  const [userStats, setUserStats] = useState<UserStats>(mockUserStats)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const isAuthenticated = user !== null

  useEffect(() => {
    if (isAuthenticated) {
      fetchPlans()
    } else {
      setPlans([])
    }
  }, [isAuthenticated])

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/study-plans')
      if (response.ok) {
        const data = await response.json()
        const formattedPlans = data.map((plan: any) => ({
          ...plan,
          createdAt: new Date(plan.createdAt),
          modules: plan.modules.map((module: any) => ({
            ...module,
            tasks: module.tasks.map((task: any) => ({
              ...task,
              date: new Date(task.date)
            }))
          }))
        }))
        setPlans(formattedPlans)
        setUserStats(prev => ({ ...prev, totalPlans: formattedPlans.length }))
      }
    } catch (error) {
      console.error('Erro ao buscar planos:', error)
    }
  }

  const createPlan = async (data: StudyPlanFormData) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        let errorMessage = 'Falha ao gerar plano'
        const responseText = await response.text()
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.error || errorMessage
          
          // Se houver detalhes da falha de geração, logar para debug
          if (errorData.details) {
            console.error('Detalhes da falha de geração:', errorData.details)
          }
        } catch (e) {
          console.error('Erro na resposta (não JSON):', responseText)
        }
        throw new Error(errorMessage)
      }

      const responseText = await response.text()
      let newPlan: StudyPlan

      try {
        newPlan = JSON.parse(responseText)
      } catch (e) {
        console.error('Resposta não é JSON:', responseText)
        throw new Error('A API retornou uma resposta inválida (não JSON)')
      }
      
      // Converter strings de data de volta para objetos Date
      const formattedPlan: StudyPlan = {
        ...newPlan,
        createdAt: new Date(newPlan.createdAt),
        modules: newPlan.modules.map(module => ({
          ...module,
          tasks: module.tasks.map(task => ({
            ...task,
            date: new Date(task.date)
          }))
        }))
      }
      
      setPlans(prev => [...prev, formattedPlan])
      setCurrentPlan(formattedPlan)
      setUserStats(prev => ({ ...prev, totalPlans: prev.totalPlans + 1 }))
      setCurrentView('result')
    } catch (error) {
      console.error('Erro ao criar plano:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const deletePlan = async (planId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/study-plans/${planId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        let errorMessage = 'Falha ao deletar plano'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          // Se não for JSON, usa o status text
          if (response.status === 404) errorMessage = 'Plano não encontrado'
          else if (response.status === 400) errorMessage = 'ID de plano inválido'
        }
        throw new Error(errorMessage)
      }

      setPlans(prev => prev.filter(p => p.id !== planId))
      if (currentPlan?.id === planId) {
        setCurrentPlan(null)
        setCurrentView('dashboard')
      }
      setUserStats(prev => ({ ...prev, totalPlans: Math.max(0, prev.totalPlans - 1) }))
    } catch (error) {
      console.error('Erro ao deletar plano:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updatePlan = async (planId: string, data: Partial<StudyPlan>) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/study-plans/${planId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        let errorMessage = 'Falha ao atualizar plano'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          if (response.status === 404) errorMessage = 'Plano não encontrado'
          else if (response.status === 400) errorMessage = 'ID de plano inválido'
        }
        throw new Error(errorMessage)
      }

      const updatedPlan = await response.json()
      const formattedPlan = {
        ...updatedPlan,
        createdAt: new Date(updatedPlan.createdAt),
        modules: updatedPlan.modules.map((module: any) => ({
          ...module,
          tasks: module.tasks.map((task: any) => ({
            ...task,
            date: new Date(task.date)
          }))
        }))
      }

      setPlans(prev => prev.map(p => p.id === planId ? formattedPlan : p))
      if (currentPlan?.id === planId) {
        setCurrentPlan(formattedPlan)
      }
    } catch (error) {
      console.error('Erro ao atualizar plano:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateTaskStatus = async (planId: string, taskId: string, status: TaskStatus) => {
    // Atualização otimista no frontend
    let updatedPlanData: StudyPlan | null = null;
    
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
      
      updatedPlanData = { ...plan, modules: updatedModules, progress };
      return updatedPlanData;
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

    // Persiste no backend
    if (updatedPlanData) {
      try {
        await fetch(`/api/study-plans/${planId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            modules: (updatedPlanData as StudyPlan).modules,
            progress: (updatedPlanData as StudyPlan).progress 
          }),
        });
      } catch (error) {
        console.error('Erro ao sincronizar status da tarefa:', error);
      }
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

  const login = async (data: LoginFormData) => {
    setIsLoading(true)
    
    // Simula delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const mockUser: User = {
      id: 'user-1',
      name: data.email.split('@')[0],
      email: data.email,
      createdAt: new Date()
    }
    
    setUser(mockUser)
    setIsLoading(false)
    setCurrentView('dashboard')
  }

  const register = async (data: RegisterFormData) => {
    setIsLoading(true)
    
    // Simula delay de registro
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const mockUser: User = {
      id: 'user-' + Date.now(),
      name: data.name,
      email: data.email,
      createdAt: new Date()
    }
    
    setUser(mockUser)
    setIsLoading(false)
    setCurrentView('dashboard')
  }

  const logout = () => {
    setUser(null)
    setCurrentView('login')
  }

  return (
    <AppContext.Provider value={{
      currentView,
      setCurrentView,
      plans,
      currentPlan,
      userStats,
      isLoading,
      user,
      isAuthenticated,
      createPlan,
      updatePlan,
      deletePlan,
      updateTaskStatus,
      selectPlan,
      login,
      register,
      logout
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
