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
    let whereClause = " ctag = '${query.ctag}'";
    for (let key in query)
      whereClause += ` AND ` + key + ` = '` + query[key] + `'`;

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

  async readDistinctApi(query: GetSelectQuery, something_distinct) {
    let whereClause = `SELECT DISTINCT ${something_distinct} FROM dtu.rx_data WHERE `
    whereClause += `ctag = '${query.ctag}' `;
    //whereClause += `FORMAT JSONCompactColumns`;
    //console.log(whereClause);
    
    const db_returned_improper_format = await this.clickHouseService.query(whereClause);
    let db_returned_proper_format = []; // to JSONCompactColumns https://clickhouse.com/docs/en/interfaces/formats#jsoncompactcolumns
    for (let i in db_returned_improper_format)
      db_returned_proper_format.push(db_returned_improper_format[i][something_distinct]);
    console.log('got from db:', db_returned_improper_format);
    console.log('sent in reply:', db_returned_proper_format);
    
    return db_returned_proper_format;
  }

  async readAggregatedApi(query: GetSelectQuery) {
    let whereClause = "ctag = '${query.ctag}'";

    return this.clickHouseService.query<ApiDto[]>(
      `SELECT * FROM dtu.rx_data WHERE ${whereClause};`,
    );
  }
}
