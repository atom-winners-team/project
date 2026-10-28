import app from './app.js';
import { config } from './config/index.js';

const port = config.port;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

server.on('error', (error) => {
  console.error('Failed to start server:', error);
  process.exitCode = 1;
});

// Здесь у нас запускается проект
