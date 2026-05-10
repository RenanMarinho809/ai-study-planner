'use client'

import { useState } from 'react'
import { ArrowLeft, Loader2, Sparkles, Target, Clock, Calendar, BarChart3, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useApp } from '@/lib/app-context'
import { StudyLevel, StudyPlanFormData } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'

export function SetupForm() {
  const { setCurrentView, createPlan, isLoading } = useApp()
  const { toast } = useToast()
  const [formData, setFormData] = useState<StudyPlanFormData>({
    objective: '',
    description: '',
    dailyTime: 1,
    totalDuration: 3,
    level: 'iniciante'
  })
  const [errors, setErrors] = useState<Partial<Record<keyof StudyPlanFormData, string>>>({})

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof StudyPlanFormData, string>> = {}
    
    if (!formData.objective.trim()) {
      newErrors.objective = 'Informe seu objetivo de estudo'
    } else if (formData.objective.length < 3) {
      newErrors.objective = 'O objetivo deve ter pelo menos 3 caracteres'
    }
    
    if (formData.dailyTime <= 0) {
      newErrors.dailyTime = 'Informe um tempo válido'
    }
    
    if (formData.totalDuration <= 0) {
      newErrors.totalDuration = 'Informe um prazo válido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      try {
        await createPlan(formData)
        toast({
          title: 'Sucesso!',
          description: 'Seu plano de estudos foi gerado com sucesso.',
        })
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Erro ao gerar plano',
          description: error.message || 'Ocorreu um erro inesperado. Tente novamente.',
        })
      }
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-8 md:py-16">
      <div className="container mx-auto max-w-2xl">
        <Button 
          variant="ghost" 
          onClick={() => setCurrentView('landing')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Sparkles className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Configure seu plano de estudos
          </h1>
          <p className="mt-2 text-muted-foreground">
            Preencha as informações abaixo para a IA gerar um plano personalizado
          </p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Informações do plano</CardTitle>
            <CardDescription>
              Quanto mais detalhes você fornecer, melhor será seu plano
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Objetivo */}
              <div className="space-y-2">
                <Label htmlFor="objective" className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Qual e seu objetivo de estudo?
                </Label>
                <Input
                  id="objective"
                  placeholder="Ex: Aprender React, Dominar Python, Estudar Machine Learning..."
                  value={formData.objective}
                  onChange={(e) => setFormData(prev => ({ ...prev, objective: e.target.value }))}
                  className={errors.objective ? 'border-destructive' : ''}
                />
                {errors.objective && (
                  <p className="text-sm text-destructive">{errors.objective}</p>
                )}
              </div>

              {/* Descricao detalhada para IA */}
              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Descreva em detalhes o que voce quer aprender
                </Label>
                <Textarea
                  id="description"
                  placeholder="Conte para a IA mais detalhes sobre seu objetivo. Por exemplo: 'Quero aprender React do zero para conseguir um emprego como desenvolvedor frontend. Ja sei HTML, CSS e JavaScript basico. Tenho interesse especial em criar interfaces modernas e responsivas. Gostaria de aprender tambem sobre hooks, context API e integracao com APIs REST.'"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-[140px] resize-none"
                  rows={5}
                />
                <p className="text-xs text-muted-foreground">
                  Quanto mais detalhes voce fornecer, mais personalizado sera seu plano de estudos.
                </p>
              </div>

              {/* Tempo diário */}
              <div className="space-y-2">
                <Label htmlFor="dailyTime" className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Quanto tempo por dia você pode estudar?
                </Label>
                <Select
                  value={formData.dailyTime.toString()}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, dailyTime: Number(value) }))}
                >
                  <SelectTrigger id="dailyTime">
                    <SelectValue placeholder="Selecione o tempo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">30 minutos</SelectItem>
                    <SelectItem value="1">1 hora</SelectItem>
                    <SelectItem value="1.5">1 hora e 30 minutos</SelectItem>
                    <SelectItem value="2">2 horas</SelectItem>
                    <SelectItem value="3">3 horas</SelectItem>
                    <SelectItem value="4">4 horas ou mais</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Prazo */}
              <div className="space-y-2">
                <Label htmlFor="totalDuration" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Qual é o prazo total?
                </Label>
                <Select
                  value={formData.totalDuration.toString()}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, totalDuration: Number(value) }))}
                >
                  <SelectTrigger id="totalDuration">
                    <SelectValue placeholder="Selecione o prazo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 mês</SelectItem>
                    <SelectItem value="2">2 meses</SelectItem>
                    <SelectItem value="3">3 meses</SelectItem>
                    <SelectItem value="6">6 meses</SelectItem>
                    <SelectItem value="12">1 ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Nível */}
              <div className="space-y-2">
                <Label htmlFor="level" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Qual seu nível atual no assunto?
                </Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, level: value as StudyLevel }))}
                >
                  <SelectTrigger id="level">
                    <SelectValue placeholder="Selecione seu nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iniciante">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-success" />
                        Iniciante - Estou começando do zero
                      </div>
                    </SelectItem>
                    <SelectItem value="intermediario">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-warning" />
                        Intermediário - Já tenho alguma experiência
                      </div>
                    </SelectItem>
                    <SelectItem value="avancado">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        Avançado - Quero me especializar
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="w-full gap-2" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Gerando plano com IA...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Gerar plano
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Tips */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { icon: '🎯', title: 'Seja específico', desc: 'Objetivos claros geram planos melhores' },
            { icon: '⏰', title: 'Seja realista', desc: 'Considere sua rotina ao definir o tempo' },
            { icon: '📈', title: 'Mantenha o foco', desc: 'Um objetivo por vez traz melhores resultados' },
          ].map((tip, i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="mb-2 text-2xl">{tip.icon}</div>
              <h3 className="font-medium text-foreground">{tip.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
