import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import { connectDB } from './config/db';
import tasksRouter from './routes/tasks';
import authRouter from './routes/auth';

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5176', credentials: true }));
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static uploads if using local storage
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
app.use('/uploads', express.static(path.join(process.cwd(), 'server', uploadDir)));

app.get('/health', (_, res) => res.json({ ok: true }));
app.use('/auth', authRouter);
app.use('/tasks', tasksRouter);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});


