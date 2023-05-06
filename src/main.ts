import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  const options = new DocumentBuilder()
    .setTitle('DTU API')
    .setDescription('Swagger documentation for DTU API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(80); // here need to get from config instead of hardcode - i don't understand how
}
bootstrap();
