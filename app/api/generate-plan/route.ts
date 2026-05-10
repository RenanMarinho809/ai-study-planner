import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import { StudyLevel } from '@/lib/types';
import dbConnect from '@/lib/mongodb';
import StudyPlan from '@/models/StudyPlan';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { objective, description, dailyTime, totalDuration, level } = await req.json();

    // Validação básica dos inputs
    if (!objective) {
      return NextResponse.json({ error: 'Objetivo é obrigatório' }, { status: 400 });
    }

    const safeDailyTime = Math.min(Math.max(Number(dailyTime) || 1, 1), 24);
    const safeTotalDuration = Math.min(Math.max(Number(totalDuration) || 1, 1), 12); // Cap at 12 months for safety

    const apiKey = process.env.GROK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GROK_API_KEY não configurada' },
        { status: 500 }
      );
    }

    const grok = new OpenAI({
      apiKey: apiKey,
      baseURL: process.env.GROK_BASE_URL!
    });

    const systemPrompt = `
      Você é um especialista em educação e planejamento de estudos.
      Sua tarefa é criar um plano de estudos detalhado e personalizado estritamente em formato JSON.
      
      O JSON deve seguir exatamente esta estrutura:
      {
        "id": "plan-1",
        "objective": "Objetivo do usuário",
        "dailyTime": ${safeDailyTime},
        "totalDuration": ${safeTotalDuration},
        "level": "${level}",
        "createdAt": "${new Date().toISOString()}",
        "progress": 0,
        "modules": [
          {
            "id": "module-1",
            "title": "Título do Módulo",
            "description": "Descrição do que será aprendido",
            "week": 1,
            "tasks": [
              {
                "id": "task-1",
                "title": "Título da Tarefa",
                "description": "O que fazer",
                "estimatedTime": 60,
                "status": "pendente",
                "date": "2024-05-10T10:00:00.000Z",
                "moduleId": "module-1"
              }
            ]
          }
        ]
      }

      REGRAS:
      1. Retorne APENAS o objeto JSON.
      2. Não inclua blocos de código markdown (como \`\`\`json).
      3. O plano deve cobrir ${safeTotalDuration} meses.
      4. Divida o conteúdo em módulos semanais (~4 semanas por mês).
      5. Distribua as tarefas respeitando o tempo diário de ${safeDailyTime} horas.
      6. O nível de dificuldade deve ser ${level}.
      7. As datas das tarefas devem começar a partir de hoje (${new Date().toLocaleDateString()}) e seguir cronologicamente.
    `;

    const userPrompt = `
      Crie um plano de estudos para:
      Objetivo: ${objective}
      Descrição adicional: ${description}
      Tempo disponível: ${safeDailyTime} horas por dia
      Duração total: ${safeTotalDuration} meses
      Nível atual: ${level}
    `;

    const response = await grok.chat.completions.create({
      model: process.env.GROK_MODEL || 'grok-2',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 4096,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('Falha ao obter resposta do Grok');
    }

    const planData = JSON.parse(content);
    
    // Remover o ID gerado pela IA para deixar o MongoDB gerar um novo
    delete planData.id;
    
    const newPlan = new StudyPlan(planData);
    await newPlan.save();
    
    return NextResponse.json(newPlan);
  } catch (error: any) {
    console.error('Erro detalhado na geração do plano:', {
      message: error.message,
      status: error.status,
      type: error.type,
      code: error.code,
      details: error.details || error.failed_generation,
    });
    
    return NextResponse.json(
      { 
        error: error.message || 'Erro interno do servidor',
        details: error.failed_generation || null
      },
      { status: error.status || 500 }
    );
  }
}
