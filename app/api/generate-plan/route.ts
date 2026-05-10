import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
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

    const apiKey = process.env.GROK_API_KEY || process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GROK_API_KEY/GROQ_API_KEY não configurada' },
        { status: 500 }
      );
    }

    const baseURL = process.env.GROK_BASE_URL || process.env.GROQ_BASE_URL;
    if (!baseURL) {
      return NextResponse.json(
        { error: 'GROK_BASE_URL/GROQ_BASE_URL não configurada' },
        { status: 500 }
      );
    }

    const grok = new OpenAI({
      apiKey: apiKey,
      baseURL
    });

    const sanitizedObjective = String(objective).trim().slice(0, 180);
    const sanitizedDescription = String(description || '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 800);

    const maxModules = Math.min(safeTotalDuration, 12);
    const maxTasksPerModule = safeDailyTime <= 1 ? 4 : safeDailyTime <= 2 ? 5 : 6;

    const systemPrompt = `Você é um especialista em educação. Crie um plano de estudos personalizado em JSON.
Você deve retornar APENAS um objeto JSON válido, sem texto adicional, sem formatação markdown (como \`\`\`json).
A estrutura ESPERADA é:
{
  "objective": "string",
  "dailyTime": number,
  "totalDuration": number,
  "level": "iniciante|intermediario|avancado",
  "createdAt": "${new Date().toISOString()}",
  "progress": 0,
  "modules": [{
    "id": "m1",
    "title": "Título",
    "description": "Descrição",
    "week": 1,
    "tasks": [{
      "id": "t1",
      "title": "Título",
      "description": "Descrição",
      "estimatedTime": 60,
      "status": "pendente",
      "date": "${new Date().toISOString()}",
      "moduleId": "m1"
    }]
  }]
}
REGRAS:
1. APENAS JSON VÁLIDO.
2. Preencha objective/dailyTime/totalDuration/level exatamente conforme o pedido do usuário.
3. Cobre ${safeTotalDuration} meses em módulos.
4. IMPORTANTE: Para evitar cortes, crie no MÁXIMO ${maxModules} módulos no total.
5. Para evitar JSON enorme: cada módulo deve ter no máximo ${maxTasksPerModule} tasks.
6. Respeite ${safeDailyTime}h/dia.
7. IDs curtos.
8. Datas ISO8601.
9. Descrições curtas e diretas.`;

    const userPrompt = `Objetivo: ${sanitizedObjective}\nDescrição: ${sanitizedDescription}\nTempo: ${safeDailyTime}h/dia\nDuração: ${safeTotalDuration} meses\nNível: ${level}\nIMPORTANTE: Retorne apenas o JSON.`;

    const response = await grok.chat.completions.create({
      model: process.env.GROK_MODEL || 'grok-2',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.5,
      max_tokens: 4096,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('Falha ao obter resposta do Grok');
    }

    // Clean up potential markdown formatting
    let cleanedContent = content.trim();
    const jsonMatch = cleanedContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      cleanedContent = jsonMatch[1].trim();
    } else {
      cleanedContent = cleanedContent.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    }

    const planData = JSON.parse(cleanedContent);
    
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

    const rawDetails = error.failed_generation || error.details || null;
    const safeDetails =
      typeof rawDetails === 'string' ? rawDetails.slice(0, 2000) : null;
    
    return NextResponse.json(
      { 
        error: error.message || 'Erro interno do servidor',
        details: safeDetails
      },
      { status: error.status || 500 }
    );
  }
}
