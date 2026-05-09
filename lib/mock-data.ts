import { StudyPlan, UserStats, StudyModule, StudyTask, StudyLevel } from './types'

export const generateMockPlan = (
  objective: string,
  dailyTime: number,
  totalDuration: number,
  level: StudyLevel
): StudyPlan => {
  const baseTopics: Record<string, string[]> = {
    'React': [
      'Fundamentos do React e JSX',
      'Componentes e Props',
      'Estado e Ciclo de Vida',
      'Hooks Essenciais',
      'Context API e Gerenciamento de Estado',
      'React Router e Navegação',
      'Formulários e Validação',
      'Testes com React Testing Library',
      'Performance e Otimização',
      'Integração com APIs',
      'Next.js e SSR',
      'Deploy e Produção'
    ],
    'Python': [
      'Sintaxe Básica e Tipos de Dados',
      'Estruturas de Controle',
      'Funções e Módulos',
      'Programação Orientada a Objetos',
      'Manipulação de Arquivos',
      'Tratamento de Exceções',
      'Bibliotecas Essenciais',
      'Web Scraping',
      'Automação de Tarefas',
      'Análise de Dados com Pandas',
      'Visualização de Dados',
      'Machine Learning Básico'
    ],
    'default': [
      'Introdução e Fundamentos',
      'Conceitos Básicos',
      'Prática Inicial',
      'Conceitos Intermediários',
      'Projetos Práticos',
      'Técnicas Avançadas',
      'Especialização',
      'Projetos Reais',
      'Otimização e Boas Práticas',
      'Revisão e Consolidação',
      'Projetos Finais',
      'Certificação e Próximos Passos'
    ]
  }

  const getTopics = (obj: string): string[] => {
    const key = Object.keys(baseTopics).find(k => 
      obj.toLowerCase().includes(k.toLowerCase())
    )
    return baseTopics[key || 'default']
  }

  const topics = getTopics(objective)
  const weeksTotal = totalDuration * 4
  const topicsPerWeek = Math.ceil(topics.length / weeksTotal)

  const modules: StudyModule[] = []
  let taskIdCounter = 1

  for (let week = 1; week <= Math.min(weeksTotal, 12); week++) {
    const startIdx = (week - 1) * topicsPerWeek
    const weekTopics = topics.slice(startIdx, startIdx + topicsPerWeek)
    
    if (weekTopics.length === 0) continue

    const tasks: StudyTask[] = weekTopics.flatMap((topic, idx) => {
      const baseDate = new Date()
      baseDate.setDate(baseDate.getDate() + (week - 1) * 7 + idx)
      
      return [
        {
          id: `task-${taskIdCounter++}`,
          title: `Estudar: ${topic}`,
          description: `Estudo teórico sobre ${topic}. Inclui leitura, vídeos e anotações.`,
          estimatedTime: dailyTime * 30,
          status: week <= 1 && idx === 0 ? 'em_andamento' : 'pendente',
          date: baseDate,
          moduleId: `module-${week}`
        } as StudyTask,
        {
          id: `task-${taskIdCounter++}`,
          title: `Praticar: ${topic}`,
          description: `Exercícios práticos e projetos relacionados a ${topic}.`,
          estimatedTime: dailyTime * 30,
          status: 'pendente',
          date: new Date(baseDate.getTime() + 86400000),
          moduleId: `module-${week}`
        } as StudyTask
      ]
    })

    modules.push({
      id: `module-${week}`,
      title: `Semana ${week}: ${weekTopics[0] || 'Estudos'}`,
      description: `Foco em ${weekTopics.join(', ')}`,
      week,
      tasks
    })
  }

  return {
    id: `plan-${Date.now()}`,
    objective,
    dailyTime,
    totalDuration,
    level,
    modules,
    createdAt: new Date(),
    progress: 0
  }
}

export const mockUserStats: UserStats = {
  totalPlans: 3,
  daysStudied: 45,
  streak: 7,
  totalProgress: 68
}

const jsPlan = generateMockPlan('Aprender JavaScript', 2, 2, 'iniciante')
jsPlan.id = 'plan-js-001'
jsPlan.progress = 85

const tsPlan = generateMockPlan('Dominar TypeScript', 1.5, 1, 'intermediario')
tsPlan.id = 'plan-ts-002'
tsPlan.progress = 45

export const mockExistingPlans: StudyPlan[] = [jsPlan, tsPlan]
