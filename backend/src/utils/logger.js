import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

const options = {
  level: process.env.LOG_LEVEL ?? 'info',
  // Чувствительные поля никогда не должны попадать в логи.
  redact: ['req.headers.authorization', 'req.headers.cookie', '*.password', '*.token'],
};

if (!isProduction && process.env.LOG_PRETTY === 'true') {
  options.transport = { target: 'pino-pretty', options: { translateTime: 'SYS:standard' } };
}

export const logger = pino(options);
