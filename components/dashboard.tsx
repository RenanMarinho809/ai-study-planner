'use client'

import { BookOpen, Calendar, Flame, Target, TrendingUp, Clock, Plus, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/lib/app-context'
import { cn } from '@/lib/utils'

export function Dashboard() {
  const { userStats, plans, selectPlan, setCurrentView } = useApp()

  const stats = [
    {
      title: 'Planos criados',
      value: userStats.totalPlans,
      icon: BookOpen,
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    {
      title: 'Dias estudados',
      value: userStats.daysStudied,
      icon: Calendar,
      color: 'text-accent',
      bg: 'bg-accent/10'
    },
    {
      title: 'Sequência atual',
      value: `${userStats.streak} dias`,
      icon: Flame,
      color: 'text-warning',
      bg: 'bg-warning/10'
    },
    {
      title: 'Progresso médio',
      value: `${userStats.totalProgress}%`,
      icon: TrendingUp,
      color: 'text-success',
      bg: 'bg-success/10'
    }
  ]

  const levelLabel = {
    iniciante: 'Iniciante',
    intermediario: 'Intermediário',
    avancado: 'Avançado'
  }

  const levelColor = {
    iniciante: 'bg-success/10 text-success',
    intermediario: 'bg-warning/10 text-warning',
    avancado: 'bg-primary/10 text-primary'
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="mt-1 text-muted-foreground">
              Acompanhe seu progresso e gerencie seus planos de estudo
            </p>
          </div>
          <Button onClick={() => setCurrentView('setup')} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo plano
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", stat.bg)}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Streak visualization */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-warning" />
              <CardTitle>Sua sequência de estudos</CardTitle>
            </div>
            <CardDescription>
              Mantenha sua sequência estudando todos os dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 30 }).map((_, i) => {
                const isActive = i < userStats.streak
                const isToday = i === userStats.streak - 1
                return (
                  <div
                    key={i}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-all",
                      isActive 
                        ? "bg-warning text-warning-foreground" 
                        : "bg-muted text-muted-foreground",
                      isToday && "ring-2 ring-warning ring-offset-2 ring-offset-background"
                    )}
                  >
                    {i + 1}
                  </div>
                )
              })}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {userStats.streak > 0 
                ? `Você está em uma sequência de ${userStats.streak} dias! Continue assim!`
                : 'Comece a estudar hoje para iniciar sua sequência!'}
            </p>
          </CardContent>
        </Card>

        {/* Plans List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Seus planos de estudo</CardTitle>
                <CardDescription>
                  Clique em um plano para ver os detalhes
                </CardDescription>
              </div>
              <Badge variant="secondary">{plans.length} planos</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {plans.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  Nenhum plano ainda
                </h3>
                <p className="mb-6 text-muted-foreground">
                  Crie seu primeiro plano de estudos para começar
                </p>
                <Button onClick={() => setCurrentView('setup')} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Criar primeiro plano
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {plans.map((plan) => {
                  const allTasks = plan.modules.flatMap(m => m.tasks)
                  const completedTasks = allTasks.filter(t => t.status === 'concluido').length
                  const totalTime = plan.dailyTime * plan.totalDuration * 30

                  return (
                    <button
                      key={plan.id}
                      onClick={() => selectPlan(plan.id)}
                      className="group w-full rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/50 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-foreground group-hover:text-primary">
                              {plan.objective}
                            </h3>
                            <Badge className={levelColor[plan.level]} variant="secondary">
                              {levelLabel[plan.level]}
                            </Badge>
                          </div>
                          
                          <div className="mb-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {plan.dailyTime}h/dia
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {plan.totalDuration} {plan.totalDuration === 1 ? 'mês' : 'meses'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Target className="h-4 w-4" />
                              {completedTasks}/{allTasks.length} tarefas
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <Progress value={plan.progress} className="h-2 flex-1" />
                            <span className="text-sm font-medium text-foreground">
                              {plan.progress}%
                            </span>
                          </div>
                        </div>

                        <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
