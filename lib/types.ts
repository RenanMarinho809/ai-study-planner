export type StudyLevel = 'iniciante' | 'intermediario' | 'avancado'

export type TaskStatus = 'pendente' | 'em_andamento' | 'concluido'

export interface StudyTask {
  id: string
  title: string
  description: string
  estimatedTime: number // em minutos
  status: TaskStatus
  date: Date
  moduleId: string
}

export interface StudyModule {
  id: string
  title: string
  description: string
  week: number
  tasks: StudyTask[]
}

export interface StudyPlan {
  id: string
  objective: string
  dailyTime: number // em horas
  totalDuration: number // em meses
  level: StudyLevel
  modules: StudyModule[]
  createdAt: Date
  progress: number // porcentagem
}

export interface UserStats {
  totalPlans: number
  daysStudied: number
  streak: number
  totalProgress: number
}

export interface StudyPlanFormData {
  objective: string
  description: string
  dailyTime: number
  totalDuration: number
  level: StudyLevel
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: Date
}

export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}
