import { Injectable } from '@nestjs/common';
import { ClickHouseService } from '../clickhouse/clickhouse.service';
import { QueryResult } from '@clickhouse/client/dist/connection';
import { InteractionDto } from './interaction.dto';

const TABLE_INTERACTIONS = 'rx_data';

@Injectable()
export class InteractionsService {
  constructor(private readonly clickHouseService: ClickHouseService) {}

  async addInteraction(data: InteractionDto): Promise<QueryResult> {
    const rows = Array.isArray(data) ? data : [data];
    return this.clickHouseService.insert(TABLE_INTERACTIONS, rows);
  }
}
