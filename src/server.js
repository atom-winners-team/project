import 'dotenv/config';

import app from './app.js';

const PORT = Number(process.env.PORT ?? 4000);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.on('error', (error) => {
  console.error('Failed to start server:', error);
  process.exitCode = 1;
});

// Здесь у нас запускается проект
