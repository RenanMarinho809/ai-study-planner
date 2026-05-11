'use client'

import { Calendar, LogOut, Mail, User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/lib/app-context'
import { cn } from '@/lib/utils'

function formatDate(value: Date | string | number | undefined) {
  if (!value) return '-'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(date)
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function ProfilePage() {
  const { user, isAuthenticated, setCurrentView, userStats, plans, logout } = useApp()

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] px-4 py-8">
        <div className="container mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Meu Perfil</CardTitle>
              <CardDescription>Faça login para ver seus dados.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setCurrentView('login')}>Entrar</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const stats = [
    { label: 'Planos', value: plans.length, tone: 'bg-primary/10 text-primary' },
    { label: 'Dias estudados', value: userStats.daysStudied, tone: 'bg-accent/10 text-accent' },
    { label: 'Sequência', value: `${userStats.streak} dias`, tone: 'bg-warning/10 text-warning' },
    { label: 'Progresso médio', value: `${userStats.totalProgress}%`, tone: 'bg-success/10 text-success' },
  ] as const

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>
            <p className="mt-1 text-muted-foreground">Seus dados e métricas do app.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCurrentView('dashboard')}>
              Voltar ao dashboard
            </Button>
            <Button variant="destructive" onClick={logout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Dados do usuário</CardTitle>
              <CardDescription>Informações básicas da sua conta.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <Avatar className="h-16 w-16">
                  {user.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : null}
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-xl font-semibold text-foreground">{user.name}</p>
                    <Badge variant="secondary">Autenticado</Badge>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Membro desde {formatDate(user.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground sm:col-span-2">
                      <UserIcon className="h-4 w-4" />
                      <span className="truncate">ID: {user.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Métricas</CardTitle>
              <CardDescription>Resumo do seu uso.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {stats.map((s) => (
                <div key={s.label} className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                  <span className={cn('rounded-md px-2 py-1 text-sm font-medium', s.tone)}>
                    {s.value}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

