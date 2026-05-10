import mongoose, { Schema } from 'mongoose';
import { User as IUser } from '@/lib/types';

// Extend the User interface for Mongoose with a password field
interface IUserDocument extends Omit<IUser, 'id'> {
  password?: string;
}

const UserSchema = new Schema<IUserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Optional if using OAuth
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: {
    transform: (_doc, ret: any) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      delete ret.password;
    }
  }
});

const User = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);

export default User;
