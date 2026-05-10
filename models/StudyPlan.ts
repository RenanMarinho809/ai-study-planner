import mongoose, { Schema } from 'mongoose';
import { StudyPlan as IStudyPlan, StudyModule as IStudyModule, StudyTask as IStudyTask } from '@/lib/types';

const StudyTaskSchema = new Schema<IStudyTask>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  estimatedTime: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pendente', 'em_andamento', 'concluido'], 
    default: 'pendente' 
  },
  date: { type: Date, required: true },
  moduleId: { type: String, required: true }
}, { _id: false });

const StudyModuleSchema = new Schema<IStudyModule>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  week: { type: Number, required: true },
  tasks: [StudyTaskSchema]
}, { _id: false });

const StudyPlanSchema = new Schema<IStudyPlan>({
  objective: { type: String, required: true },
  dailyTime: { type: Number, required: true },
  totalDuration: { type: Number, required: true },
  level: { 
    type: String, 
    enum: ['iniciante', 'intermediario', 'avancado'], 
    required: true 
  },
  modules: [StudyModuleSchema],
  createdAt: { type: Date, default: Date.now },
  progress: { type: Number, default: 0 }
}, {
  timestamps: true,
  toJSON: {
    transform: (_, ret: any) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
    }
  }
});

// Use existing model if available, otherwise create a new one
const StudyPlan = mongoose.models.StudyPlan || mongoose.model<IStudyPlan>('StudyPlan', StudyPlanSchema);

export default StudyPlan;
