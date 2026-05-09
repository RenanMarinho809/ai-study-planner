'use client'

import { ArrowRight, BookOpen, Brain, Calendar, CheckCircle2, Sparkles, Target, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useApp } from '@/lib/app-context'

const features = [
  {
    icon: Brain,
    title: 'Inteligência Artificial',
    description: 'Planos personalizados gerados por IA baseados nos seus objetivos e disponibilidade.'
  },
  {
    icon: Calendar,
    title: 'Calendário Interativo',
    description: 'Visualize e gerencie suas tarefas em um calendário intuitivo e responsivo.'
  },
  {
    icon: Target,
    title: 'Acompanhe seu Progresso',
    description: 'Dashboard completo com métricas, streaks e visualização do seu avanço.'
  },
  {
    icon: CheckCircle2,
    title: 'Marque como Concluído',
    description: 'Mantenha o controle das suas tarefas e celebre cada conquista.'
  }
]

const steps = [
  { number: '01', title: 'Defina seu objetivo', description: 'Diga o que você quer aprender' },
  { number: '02', title: 'Configure seu tempo', description: 'Informe sua disponibilidade' },
  { number: '03', title: 'Receba seu plano', description: 'A IA gera um roadmap completo' },
]

export function LandingPage() {
  const { setCurrentView } = useApp()

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pb-20 pt-16 md:pb-32 md:pt-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))]" />
        
        <div className="container mx-auto text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Potencializado por Inteligência Artificial
          </div>
          
          <h1 className="mx-auto max-w-4xl text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Planeje seus estudos com{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Inteligência Artificial
            </span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            Crie planos de estudo personalizados, acompanhe seu progresso e alcance 
            seus objetivos de aprendizado com a ajuda da IA.
          </p>
          
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button 
              size="lg" 
              onClick={() => setCurrentView('setup')}
              className="gap-2 px-8"
            >
              Começar agora
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => setCurrentView('dashboard')}
              className="gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Ver Dashboard
            </Button>
          </div>
        </div>

        {/* Floating Cards Illustration */}
        <div className="mx-auto mt-16 max-w-5xl px-4">
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-50 blur-3xl" />
            <Card className="relative overflow-hidden border-2 shadow-2xl">
              <CardContent className="p-0">
                <div className="grid gap-0 md:grid-cols-3">
                  <div className="border-b border-r-0 bg-card p-6 md:border-b-0 md:border-r">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <span className="font-semibold text-foreground">Semana 1</span>
                    </div>
                    <div className="space-y-3">
                      {['Fundamentos', 'Sintaxe Básica', 'Primeiro Projeto'].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className={`h-4 w-4 ${i === 0 ? 'text-success' : ''}`} />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-b border-r-0 bg-card p-6 md:border-b-0 md:border-r">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <Target className="h-5 w-5" />
                      </div>
                      <span className="font-semibold text-foreground">Progresso</span>
                    </div>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-primary">68%</div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 w-[68%] rounded-full bg-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">34 de 50 tarefas concluídas</p>
                    </div>
                  </div>
                  <div className="bg-card p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <span className="font-semibold text-foreground">Streak</span>
                    </div>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-warning">7 dias</div>
                      <div className="flex gap-1">
                        {[1,2,3,4,5,6,7].map(i => (
                          <div key={i} className="h-6 w-6 rounded bg-warning/20" />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">Continue assim!</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border bg-card px-4 py-20">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Como funciona
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Três passos simples para começar a estudar de forma inteligente
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
                  {step.number}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                {index < steps.length - 1 && (
                  <ArrowRight className="absolute right-0 top-8 hidden h-6 w-6 -translate-x-1/2 text-muted-foreground md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Tudo que você precisa para estudar melhor
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Ferramentas poderosas para maximizar seu aprendizado
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="group transition-all hover:shadow-lg hover:shadow-primary/5">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20">
        <div className="container mx-auto">
          <Card className="relative overflow-hidden bg-primary text-primary-foreground">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent)]" />
            <CardContent className="relative flex flex-col items-center p-12 text-center">
              <Sparkles className="mb-6 h-12 w-12" />
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Pronto para começar?
              </h2>
              <p className="mb-8 max-w-xl text-lg opacity-90">
                Crie seu primeiro plano de estudos personalizado em menos de um minuto.
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => setCurrentView('setup')}
                className="gap-2 px-8"
              >
                Criar meu plano
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 text-center text-sm text-muted-foreground md:flex-row md:text-left">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>AI Study Planner</span>
          </div>
          <p>© 2024 Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
