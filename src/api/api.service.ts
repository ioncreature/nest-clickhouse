import { Injectable } from '@nestjs/common';
import { ClickHouseService } from '../clickhouse/clickhouse.service';
import { QueryResult } from '@clickhouse/client/dist/connection';
import { ApiDto } from './api.dto';
import { GetSelectQuery } from './api.controller';

const TABLE_INTERACTIONS = 'rx_data';

function enrich_rows(data) { // enriching report with required data even if SDK didn't sent it
  let enriched_rows = [];
  for (let i in data) {
    let r = data[i];

    if (!r.topic)
      r.topic = "default";

    if (!r.element_path)
      r.element_path = ['', r.element];
    if (r.element_path[0] !== '')
      r.element_path.unshift(''); // add to the beginning as "all" elements for filter

    r.element_path_string = String(r.element_path);
    enriched_rows.push(r);
  }
  return enriched_rows;
}

@Injectable()
export class ApiService {
  constructor(private readonly clickHouseService: ClickHouseService) {}

  async insertApi(data: ApiDto): Promise<QueryResult> {
    const rows = Array.isArray(data) ? data : [data];
    const enriched_rows = enrich_rows(rows);
    return this.clickHouseService.insert(TABLE_INTERACTIONS, enriched_rows);
  }

  async readApi(query: GetSelectQuery) {
    let whereClause = `SELECT toUnixTimestamp64Micro(date_time) / 1000 as date_time, element, element_path, element_path_string, element_type, topic, uid, url_domain_name, url_path, value FROM dtu.rx_data WHERE `
    whereClause += `ctag = '${query.ctag}' `;
    for (let key in query) {
      if (!['ctag', 'element_path', 'element_path_string'].includes(key))
        whereClause += `AND ` + key + ` = '` + query[key] + `' `;
      if (key == 'element_path_string')
        whereClause += `AND ` + key + ` like '` + query[key] + `%' `;
    }
    whereClause += ` ORDER BY date_time ASC`;
    //console.log(whereClause, query);
    return await this.clickHouseService.query(whereClause);
  }

  async readDistinctApi(query: GetSelectQuery, something_distinct) {
    //let whereClause = `SELECT DISTINCT ${something_distinct} FROM dtu.rx_data WHERE `
    let whereClause = `SELECT toUnixTimestamp64Micro(date_time) / 1000 as date_time, element, element_path, element_path_string, element_type, topic, uid, url_domain_name, url_path, value FROM dtu.rx_data WHERE `
    whereClause += `ctag = '${query.ctag}' `;
    for (let key in query) {
      if (!['ctag', 'element_path', 'element_path_string'].includes(key))
        whereClause += `AND ` + key + ` = '` + query[key] + `' `;
      if (key == 'element_path_string')
        whereClause += `AND ` + key + ` like '` + query[key] + `%' `;
    }
    whereClause += ` ORDER BY date_time ASC`;
    //console.log(whereClause, query);
    return await this.clickHouseService.query(whereClause);
  }

  async readAggregatedApi(query: GetSelectQuery) {
    let whereClause = "ctag = '${query.ctag}'";

    return this.clickHouseService.query<ApiDto[]>(
      `SELECT * FROM dtu.rx_data WHERE ${whereClause};`,
    );
  }
}
