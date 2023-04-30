import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

process.on('uncaughtException', (err, origin) => {
  console.error(`Uncaught exception: ${err?.stack || err?.message || err}\nOrigin: ${origin}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason: any) => {
  console.error(`Unhandled promise rejection: ${reason?.stack || reason?.message || reason}`);
  process.exit(1);
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  await app.listen(3000);
}
bootstrap();
