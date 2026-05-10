'use client'

import { BookOpen, Calendar, CheckCircle2, Circle, Clock, PlayCircle, Target, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/lib/app-context'
import { TaskStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

const statusConfig: Record<TaskStatus, { label: string; icon: typeof Circle; color: string }> = {
  pendente: { label: 'Pendente', icon: Circle, color: 'text-muted-foreground' },
  em_andamento: { label: 'Em andamento', icon: PlayCircle, color: 'text-warning' },
  concluido: { label: 'Concluído', icon: CheckCircle2, color: 'text-success' }
}

export function ResultView() {
  const { currentPlan, updateTaskStatus, setCurrentView, deletePlan } = useApp()

  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja deletar este plano de estudo?')) {
      await deletePlan(currentPlan!.id)
    }
  }

  if (!currentPlan) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <Card className="max-w-md text-center">
          <CardContent className="p-8">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-foreground">
              Nenhum plano selecionado
            </h2>
            <p className="mb-6 text-muted-foreground">
              Crie um novo plano de estudos para começar
            </p>
            <Button onClick={() => setCurrentView('setup')}>
              Criar plano
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const levelLabel = {
    iniciante: 'Iniciante',
    intermediario: 'Intermediário',
    avancado: 'Avançado'
  }

  const allTasks = currentPlan.modules.flatMap(m => m.tasks)
  const completedTasks = allTasks.filter(t => t.status === 'concluido').length

  const cycleStatus = (current: TaskStatus): TaskStatus => {
    const order: TaskStatus[] = ['pendente', 'em_andamento', 'concluido']
    const currentIndex = order.indexOf(current)
    return order[(currentIndex + 1) % order.length]
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-8">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Target className="h-3 w-3" />
              {levelLabel[currentPlan.level]}
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Clock className="h-3 w-3" />
              {currentPlan.dailyTime}h/dia
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Calendar className="h-3 w-3" />
              {currentPlan.totalDuration} {currentPlan.totalDuration === 1 ? 'mês' : 'meses'}
            </Badge>
          </div>

          <h1 className="text-3xl font-bold text-foreground md:text-4xl">
            {currentPlan.objective}
          </h1>
          
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progresso geral</span>
                <span className="font-medium text-foreground">{currentPlan.progress}%</span>
              </div>
              <Progress value={currentPlan.progress} className="h-3" />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setCurrentView('calendar')}
                className="gap-2"
              >
                <Calendar className="h-4 w-4" />
                Ver calendário
              </Button>
              <Button 
                variant="destructive" 
                size="icon"
                onClick={handleDelete}
                title="Deletar plano"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-4 flex gap-6 text-sm text-muted-foreground">
            <span>{completedTasks} de {allTasks.length} tarefas concluídas</span>
            <span>{currentPlan.modules.length} módulos</span>
          </div>
        </div>

        {/* Roadmap */}
        <div className="space-y-6">
          {currentPlan.modules.map((module, moduleIndex) => {
            const moduleTasks = module.tasks
            const moduleCompleted = moduleTasks.filter(t => t.status === 'concluido').length
            const moduleProgress = Math.round((moduleCompleted / moduleTasks.length) * 100)

            return (
              <Card key={module.id} className="overflow-hidden">
                <CardHeader className="bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                        {moduleIndex + 1}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <CardDescription>{module.description}</CardDescription>
                      </div>
                    </div>
                    <div className="hidden text-right sm:block">
                      <div className="text-sm font-medium text-foreground">{moduleProgress}%</div>
                      <div className="text-xs text-muted-foreground">
                        {moduleCompleted}/{moduleTasks.length} tarefas
                      </div>
                    </div>
                  </div>
                  <Progress value={moduleProgress} className="mt-4 h-1.5" />
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {moduleTasks.map((task) => {
                      const StatusIcon = statusConfig[task.status].icon
                      
                      return (
                        <div 
                          key={task.id}
                          className="flex items-start gap-4 p-4 transition-colors hover:bg-muted/30"
                        >
                          <button
                            onClick={() => updateTaskStatus(
                              currentPlan.id, 
                              task.id, 
                              cycleStatus(task.status)
                            )}
                            className={cn(
                              "mt-0.5 flex-shrink-0 transition-colors",
                              statusConfig[task.status].color
                            )}
                          >
                            <StatusIcon className="h-5 w-5" />
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className={cn(
                                "font-medium",
                                task.status === 'concluido' && "line-through text-muted-foreground"
                              )}>
                                {task.title}
                              </h3>
                              <Badge 
                                variant={task.status === 'concluido' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {statusConfig[task.status].label}
                              </Badge>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {task.description}
                            </p>
                            <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {task.estimatedTime} min
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(task.date).toLocaleDateString('pt-BR', { 
                                  day: 'numeric', 
                                  month: 'short' 
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
