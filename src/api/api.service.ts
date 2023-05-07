import { Injectable } from '@nestjs/common';
import { ClickHouseService } from '../clickhouse/clickhouse.service';
import { QueryResult } from '@clickhouse/client/dist/connection';
import { ApiDto } from './api.dto';
import { GetSelectQuery } from './api.controller';

const TABLE_INTERACTIONS = 'rx_data';

@Injectable()
export class ApiService {
  constructor(private readonly clickHouseService: ClickHouseService) {}

  async insertApi(data: ApiDto): Promise<QueryResult> {
    const rows = Array.isArray(data) ? data : [data];
    return this.clickHouseService.insert(TABLE_INTERACTIONS, rows);
  }

  async readApi(query: GetSelectQuery) {
    let whereClause = "ctag = '${query.ctag}'";
    whereClause = "ctag = 'DEMO MVP'"

    if (query.date_to) {
      whereClause += `AND date_time <= '${query.date_to}'`;
    }

    if (query.date_from) {
      whereClause += `AND date_time >= '${query.date_from}'`;
    }

    return this.clickHouseService.query<ApiDto[]>(
      `SELECT * FROM dtu.rx_data WHERE ${whereClause};`,
    );
  }
}
