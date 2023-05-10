import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { AppConfig } from './app.config';

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
    //cors: false,
  });

  const options = new DocumentBuilder()
    .setTitle('DoTheyUse Service API')
    .setDescription('Swagger documentation for DoTheyUse Service API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  const config = await app.get<ConfigService<AppConfig>>(ConfigService);
  const { HTTP_PORT } = config.getConfig();

  await app.listen(HTTP_PORT);
}
bootstrap();
