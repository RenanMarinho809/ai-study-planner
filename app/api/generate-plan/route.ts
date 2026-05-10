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

    const systemPrompt = `Você é um especialista em educação. Crie um plano de estudos personalizado em JSON.
ESTRUTURA:
{
  "objective": "${objective}",
  "dailyTime": ${safeDailyTime},
  "totalDuration": ${safeTotalDuration},
  "level": "${level}",
  "createdAt": "${new Date().toISOString()}",
  "progress": 0,
  "modules": [{
    "id": "m1",
    "title": "...",
    "description": "...",
    "week": 1,
    "tasks": [{
      "id": "t1",
      "title": "...",
      "description": "...",
      "estimatedTime": 60,
      "status": "pendente",
      "date": "ISO8601",
      "moduleId": "m1"
    }]
  }]
}
REGRAS: 1. Apenas JSON. 2. Cobre ${safeTotalDuration} meses em módulos semanais. 3. Respeite ${safeDailyTime}h/dia. 4. IDs curtos. 5. Datas ISO8601 começando em ${new Date().toISOString()}. 6. Descrições concisas.`;

    const userPrompt = `Objetivo: ${objective}\nDescrição: ${description?.substring(0, 500)}\nTempo: ${safeDailyTime}h/dia\nDuração: ${safeTotalDuration} meses\nNível: ${level}`;

    const response = await grok.chat.completions.create({
      model: process.env.GROK_MODEL || 'grok-2',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5,
      max_tokens: 3000,
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
