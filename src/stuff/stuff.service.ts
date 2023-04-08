import { Injectable } from '@nestjs/common';
import { ClickHouseService } from '../clickhouse/clickhouse.service';
import { QueryResult } from '@clickhouse/client/dist/connection';

const TABLE_INTERACTIONS = 'interactions';

export interface UsageRecord {
  aid: string;
  scope: string[];
}

@Injectable()
export class StuffService {
  constructor(private readonly clickHouseService: ClickHouseService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async addUsageRecord(data: UsageRecord | UsageRecord[]): Promise<QueryResult> {
    const now = Date.now();
    const rows = Array.isArray(data) ? data : [data];
    return this.clickHouseService.insert(
      TABLE_INTERACTIONS,
      rows.map((row) => {
        return { ...row, ts: now };
      }),
    );
  }
}
