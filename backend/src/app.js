import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { randomUUID } from 'node:crypto';
import { pinoHttp } from 'pino-http';
import { logger } from './utils/logger.js';

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
  }),
);

app.use(express.json());
// Не забываем, что в логере есть креды!!! 
// Подключаем логирование до маршрутов и остальных middleware,
// чтобы учитывать в том числе запросы, завершившиеся ошибкой.
app.use(
  pinoHttp({
    logger,

    genReqId(_req, res) {
      // По этому ID можно сопоставить ответ клиенту с записью в логах.
      const requestId = randomUUID();

      res.setHeader('X-Request-Id', requestId);

      return requestId;
    },

    // Ограничиваем поля HTTP-логов:
    // не записываем query-параметры, тело запроса и заголовки.
    serializers: {
      req(request) {
        const requestUrl = String(request.url);
        const path = requestUrl.split('?')[0];

        return {
          id: request.id,
          method: request.method,
          path,
        };
      },

      res(response) {
        return {
          statusCode: response.statusCode,
        };
      },

      err() {
        return {
          message: 'Request failed',
        };
      },
    },
  }),
);

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API is running',
  });
});

export default app;

// Это главный файл где мы подключаем все модули


import equipmentRoutes from './routes/equipmentRoutes.js';

app.use('/api/equipment', equipmentRoutes);
