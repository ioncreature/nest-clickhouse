import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { AppConfig } from './app.config';
import { ClickHouseModule } from './clickhouse/clickhouse.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { StuffModule } from './stuff/stuff.module';

@Module({
  imports: [
    ConfigModule.forRoot(AppConfig),
    ClickHouseModule,
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'client') }),
    StuffModule,
  ],
})
export class AppModule {}
