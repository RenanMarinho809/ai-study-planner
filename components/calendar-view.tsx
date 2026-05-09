'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, PlayCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/lib/app-context'
import { StudyTask, TaskStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

const statusConfig: Record<TaskStatus, { icon: typeof Circle; color: string; bg: string }> = {
  pendente: { icon: Circle, color: 'text-muted-foreground', bg: 'bg-muted' },
  em_andamento: { icon: PlayCircle, color: 'text-warning', bg: 'bg-warning/20' },
  concluido: { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/20' }
}

export function CalendarView() {
  const { currentPlan, updateTaskStatus, setCurrentView } = useApp()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const allTasks = useMemo(() => {
    if (!currentPlan) return []
    return currentPlan.modules.flatMap(m => m.tasks)
  }, [currentPlan])

  const getTasksForDate = (date: Date): StudyTask[] => {
    return allTasks.filter(task => {
      const taskDate = new Date(task.date)
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    
    return { daysInMonth, startingDay }
  }

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate)

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    setSelectedDate(null)
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    setSelectedDate(null)
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (day: number) => {
    if (!selectedDate) return false
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    )
  }

  const cycleStatus = (current: TaskStatus): TaskStatus => {
    const order: TaskStatus[] = ['pendente', 'em_andamento', 'concluido']
    const currentIndex = order.indexOf(current)
    return order[(currentIndex + 1) % order.length]
  }

  const selectedTasks = selectedDate ? getTasksForDate(selectedDate) : []

  if (!currentPlan) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <Card className="max-w-md text-center">
          <CardContent className="p-8">
            <h2 className="mb-2 text-xl font-semibold">Nenhum plano selecionado</h2>
            <p className="mb-6 text-muted-foreground">
              Selecione ou crie um plano para ver o calendário
            </p>
            <Button onClick={() => setCurrentView('setup')}>Criar plano</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Calendário</h1>
          <p className="mt-2 text-muted-foreground">{currentPlan.objective}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Calendar */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-xl">
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <div className="flex gap-1">
                <Button variant="outline" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Days header */}
              <div className="mb-2 grid grid-cols-7 gap-1 text-center text-sm font-medium text-muted-foreground">
                {DAYS.map(day => (
                  <div key={day} className="py-2">{day}</div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before month starts */}
                {Array.from({ length: startingDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {/* Days of the month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1
                  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                  const dayTasks = getTasksForDate(date)
                  const hasCompleted = dayTasks.some(t => t.status === 'concluido')
                  const hasInProgress = dayTasks.some(t => t.status === 'em_andamento')
                  const hasPending = dayTasks.some(t => t.status === 'pendente')

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(date)}
                      className={cn(
                        "relative flex aspect-square flex-col items-center justify-center rounded-lg p-1 text-sm transition-colors",
                        "hover:bg-muted",
                        isToday(day) && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                        isSelected(day) && "bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                    >
                      <span className={cn(
                        "font-medium",
                        isSelected(day) ? "text-primary-foreground" : "text-foreground"
                      )}>
                        {day}
                      </span>
                      {dayTasks.length > 0 && (
                        <div className="mt-0.5 flex gap-0.5">
                          {hasCompleted && (
                            <span className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              isSelected(day) ? "bg-primary-foreground" : "bg-success"
                            )} />
                          )}
                          {hasInProgress && (
                            <span className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              isSelected(day) ? "bg-primary-foreground" : "bg-warning"
                            )} />
                          )}
                          {hasPending && !hasCompleted && !hasInProgress && (
                            <span className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              isSelected(day) ? "bg-primary-foreground/50" : "bg-muted-foreground/50"
                            )} />
                          )}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-success" />
                  Concluído
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-warning" />
                  Em andamento
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/50" />
                  Pendente
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected day tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedDate 
                  ? selectedDate.toLocaleDateString('pt-BR', { 
                      day: 'numeric', 
                      month: 'long',
                      year: 'numeric'
                    })
                  : 'Selecione um dia'
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedDate ? (
                <p className="text-center text-sm text-muted-foreground">
                  Clique em um dia para ver as tarefas
                </p>
              ) : selectedTasks.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground">
                  Nenhuma tarefa para este dia
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedTasks.map(task => {
                    const StatusIcon = statusConfig[task.status].icon
                    return (
                      <div 
                        key={task.id}
                        className={cn(
                          "rounded-lg border p-3",
                          statusConfig[task.status].bg
                        )}
                      >
                        <div className="flex items-start gap-2">
                          <button
                            onClick={() => updateTaskStatus(
                              currentPlan.id,
                              task.id,
                              cycleStatus(task.status)
                            )}
                            className={statusConfig[task.status].color}
                          >
                            <StatusIcon className="h-5 w-5" />
                          </button>
                          <div className="flex-1">
                            <h4 className={cn(
                              "font-medium text-foreground",
                              task.status === 'concluido' && "line-through text-muted-foreground"
                            )}>
                              {task.title}
                            </h4>
                            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                              {task.description}
                            </p>
                            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {task.estimatedTime} min
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
