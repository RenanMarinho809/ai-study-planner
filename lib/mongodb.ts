import mongoose from 'mongoose';

class MongoNetworkAccessError extends Error {
  code = 'MONGODB_NETWORK_ACCESS';
  constructor(message: string) {
    super(message);
    this.name = 'MongoNetworkAccessError';
  }
}

function getMongoUri() {
  const uri = process.env.MONGODB_URI!
  if (uri) return uri;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('MONGODB_URI não configurada no ambiente de produção');
  }
  return 'mongodb://localhost:27017/study-planner';
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    };

    const uri = getMongoUri();
    cached.promise = mongoose.connect(uri, opts).then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    const err = e as any;
    const msg = String(err?.message || '');
    if (
      /not\s+whitelisted/i.test(msg) ||
      /IP\s+that\s+isn't\s+whitelisted/i.test(msg) ||
      /Could\s+not\s+connect\s+to\s+any\s+servers/i.test(msg)
    ) {
      throw new MongoNetworkAccessError(
        'Conexão com MongoDB Atlas bloqueada (IP não liberado). Em Atlas > Network Access, libere o acesso do ambiente (em Vercel normalmente use 0.0.0.0/0) ou configure uma rede privada.'
      );
    }
    throw err;
  }

  return cached.conn;
}

export default dbConnect;
