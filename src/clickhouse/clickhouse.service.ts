import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';

import { createClient } from '@clickhouse/client';
import { ClickHouseClient } from '@clickhouse/client/dist/client';
import { ConfigService } from '../config/config.service';
import { AppConfig } from '../app.config';

@Injectable()
export class ClickHouseService implements OnModuleInit, OnApplicationShutdown {
  client: ClickHouseClient;
  constructor(private readonly config: ConfigService<AppConfig>) {}

  onModuleInit() {
    const {
      CLICKHOUSE_URL,
      CLICKHOUSE_USER,
      CLICKHOUSE_PASSWORD,
      CLICKHOUSE_DATABASE,
    } = this.config.getConfig();
    this.client = createClient({
      host: CLICKHOUSE_URL,
      username: CLICKHOUSE_USER,
      password: CLICKHOUSE_PASSWORD,
      database: CLICKHOUSE_DATABASE,
    });
  }

  async onApplicationShutdown() {
    await this.client.close();
  }
}
