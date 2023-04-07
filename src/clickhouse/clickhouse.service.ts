import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';

import { createClient } from '@clickhouse/client';
import { ClickHouseClient } from '@clickhouse/client/dist/client';

@Injectable()
export class ClickHouseService implements OnModuleInit, OnApplicationShutdown {
  client: ClickHouseClient;
  constructor() {}

  onModuleInit() {
    this.client = createClient({
      /* configuration */
    });
  }

  async onApplicationShutdown() {
    await this.client.close();
  }
}
