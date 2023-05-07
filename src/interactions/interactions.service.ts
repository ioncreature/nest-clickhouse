import { Injectable } from '@nestjs/common';
import { ClickHouseService } from '../clickhouse/clickhouse.service';
import { QueryResult } from '@clickhouse/client/dist/connection';
import { InteractionDto } from './interaction.dto';
import { GetSelectQuery } from './interactions.controller';

const TABLE_INTERACTIONS = 'rx_data';

@Injectable()
export class InteractionsService {
  constructor(private readonly clickHouseService: ClickHouseService) {}

  async addInteraction(data: InteractionDto): Promise<QueryResult> {
    const rows = Array.isArray(data) ? data : [data];
    return this.clickHouseService.insert(TABLE_INTERACTIONS, rows);
  }

  async getInteractions(query: GetSelectQuery) {
    let whereClause = "ctag = '${query.ctag}'";

    if (query.date_to) {
      whereClause += `AND date_time <= '${query.date_to}'`;
    }

    if (query.date_from) {
      whereClause += `AND date_time >= '${query.date_from}'`;
    }

    return this.clickHouseService.query<InteractionDto[]>(
      `SELECT * FROM dtu.rx_data WHERE ${whereClause};`,
    );
  }
}
