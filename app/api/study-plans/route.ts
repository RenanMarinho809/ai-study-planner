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
    const message =
      error?.code === 'MONGODB_NETWORK_ACCESS'
        ? error.message
        : 'Erro ao buscar planos';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
