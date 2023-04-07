import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { AppConfig } from './app.config';
import { ClickHouseModule } from './clickhouse/clickhouse.module';

@Module({
  imports: [ConfigModule.forRoot(AppConfig), ClickHouseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
