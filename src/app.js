import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pino from 'pino';
import { pinoHttp } from 'pino-http';

const app = express();

const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
});
// Не забываем, что в логере есть креды!!! 

app.use(helmet());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
  }),
);

app.use(express.json());

app.use(pinoHttp({ logger }));

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API is running',
  });
});

export default app;

// Это главный файл где мы подключаем все модули
