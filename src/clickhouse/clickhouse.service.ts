import { Injectable, Logger, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';

import { createClient } from '@clickhouse/client';
import { ClickHouseClient } from '@clickhouse/client/dist/client';
import { ConfigService } from '../config/config.service';
import { AppConfig } from '../app.config';
import { QueryResult } from '@clickhouse/client/dist/connection';

@Injectable()
export class ClickHouseService implements OnModuleInit, OnApplicationShutdown {
  private readonly logger = new Logger(ClickHouseService.name);

  private client: ClickHouseClient;

  constructor(private readonly config: ConfigService<AppConfig>) {}

  async onModuleInit() {
    const { CLICKHOUSE_URL, CLICKHOUSE_USER, CLICKHOUSE_PASSWORD, CLICKHOUSE_DATABASE } =
      this.config.getConfig();

    this.client = createClient({
      host: CLICKHOUSE_URL,
      username: CLICKHOUSE_USER,
      password: CLICKHOUSE_PASSWORD,
      //database: CLICKHOUSE_DATABASE,
    });
  }

  async onApplicationShutdown() {
    await this.client.close();
  }

  getClient() {
    return this.client;
  }

  async query<T>(query: string): Promise<T[]> {
    const resultSet = await this.client.query({ query });
    const json = await resultSet.json<{ data: T[] }>();
    return json.data;
  }

  async exec(query: string): Promise<QueryResult> {
    this.logger.debug(query);
    return this.client.exec({ query });
  }

  async insert<T extends Object>(table: string, rows: T[]): Promise<QueryResult> {
    const { CLICKHOUSE_DATABASE } = this.config.getConfig();

    if (!rows.length) {
      throw new Error('ClickHouseService#insert: empty rows list');
    }

    const fields = Object.keys(rows[0]);
    if (!fields.length) {
      throw new Error('ClickHouseService#insert: no fields names provided');
    }

    const fieldsValues = fields.join(',');
    const insertValues = rows
      .map((row) => `(${fields.map((f) => JSON.stringify(row[f]).replace(/"/g, "'")).join(',')})`)
      .join(',');

    return this.exec(
      `INSERT INTO ${CLICKHOUSE_DATABASE}.${table} (${fieldsValues}) VALUES ${insertValues};`,
    );
  }
}
