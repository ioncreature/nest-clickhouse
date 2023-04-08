import { Injectable } from '@nestjs/common';
import { ClickHouseService } from '../clickhouse/clickhouse.service';
import { QueryResult } from '@clickhouse/client/dist/connection';

const TABLE_INTERACTIONS = 'interactions';

export interface UsageRecord {
  aid: string;
  scope: string[];
}

@Injectable()
export class InteractionsService {
  constructor(private readonly clickHouseService: ClickHouseService) {}

  async addUsage(data: UsageRecord | UsageRecord[]): Promise<QueryResult> {
    const now = Date.now();
    const rows = Array.isArray(data) ? data : [data];
    return this.clickHouseService.insert(
      TABLE_INTERACTIONS,
      rows.map((row) => {
        return { ...row, ts: now };
      }),
    );
  }

  async getUsage(): Promise<void> {
    throw new Error('not implemented');
  }
}
