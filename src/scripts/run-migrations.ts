import { ClickHouseModule } from '../clickhouse/clickhouse.module';
import { ConfigModule } from '../config/config.module';
import { AppConfig } from '../app.config';
import { ClickhouseMigrationService } from '../clickhouse/clickhouse-migration.service';
import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

@Module({ imports: [ClickHouseModule, ConfigModule.forRoot(AppConfig)] })
class RunMigrationsModule {}

runMigrations().catch((e) => console.error(e));

async function runMigrations() {
  const app = await NestFactory.create(RunMigrationsModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  await app.init();

  const migrationService = app.get<ClickhouseMigrationService>(ClickhouseMigrationService);
  await migrationService.doMigration();
}
