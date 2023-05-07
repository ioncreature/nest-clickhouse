import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { AppConfig } from './app.config';
import { ClickHouseModule } from './clickhouse/clickhouse.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ApiModule } from './api/api.module';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot(AppConfig),
    ClickHouseModule,
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'src/dtu_app') }),
    ApiModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
