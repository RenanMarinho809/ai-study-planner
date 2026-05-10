import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import StudyPlan from '@/models/StudyPlan';

export async function GET() {
  try {
    await dbConnect();
    const plans = await StudyPlan.find({}).sort({ createdAt: -1 });
    return NextResponse.json(plans);
  } catch (error: any) {
    console.error('Erro ao buscar planos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar planos' },
      { status: 500 }
    );
  }
}
