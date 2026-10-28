import pino from 'pino';
import { config } from '../config/index.js';

const options = {
  level: config.logLevel,
  // Чувствительные поля никогда не должны попадать в логи.
  redact: ['req.headers.authorization', 'req.headers.cookie', '*.password', '*.token'],
};

if (!config.isProduction && config.logPretty) {
  options.transport = { target: 'pino-pretty', options: { translateTime: 'SYS:standard' } };
}

export const logger = pino(options);
