import { NextResponse } from 'next/server';
import  dbConnect  from '@/lib/mongodb'
import StudyPlan from '@/models/StudyPlan';
import mongoose from 'mongoose';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const data = await req.json();

    const updatedPlan = await StudyPlan.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!updatedPlan) {
      return NextResponse.json(
        { error: 'Plano não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedPlan);
  } catch (error: any) {
    console.error('Erro ao atualizar plano:', error);
    const message =
      error?.code === 'MONGODB_NETWORK_ACCESS'
        ? error.message
        : 'Erro ao atualizar plano';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const deletedPlan = await StudyPlan.findByIdAndDelete(id);

    if (!deletedPlan) {
      return NextResponse.json(
        { error: 'Plano não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Plano deletado com sucesso' });
  } catch (error: any) {
    console.error('Erro ao deletar plano:', error);
    const message =
      error?.code === 'MONGODB_NETWORK_ACCESS'
        ? error.message
        : 'Erro ao deletar plano';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
