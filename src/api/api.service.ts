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
    if (typeof(r.element_path) == 'string')
      r.element_path = r.element_path.split(',');
    if (r.element_path[0] !== '')
      r.element_path.unshift(''); // add to the beginning as "all" elements for filter

    if (r.value)
      r.value = r.value.split(',');

    if (typeof(r.ugids) == 'string')
      r.ugids = r.ugids.split(',');
    //delete r['ugids_string'];

    r.element_path_string = String(r.element_path);
    enriched_rows.push(r);
  }
  //console.log(data, enriched_rows)
  //console.warn("make element path to lower case both for rx and tx apis")
  return enriched_rows;
}

function make_where_clause_from_query(query) {
  let whereClause = `SELECT toUnixTimestamp64Micro(date_time) / 1000 as date_time, element, element_path, element_path_string, element_type, topic, uid, ugids, url_domain_name, url_path, value FROM dtu.rx_data WHERE`
  whereClause += ` ctag = '${query.ctag}'`;
  for (let key in query) {
    if (!['ctag', 'element_path_string', 'datetime_from', 'datetime_to', 'uids', 'ugids'].includes(key))
      whereClause += ` AND ` + key + ` = '` + query[key] + `'`;
    if (key == 'element_path_string')
      whereClause += ` AND ` + key + ` like '` + query[key] + `%'`;
    if (['datetime_from', 'datetime_to'].includes(key)) {
      if (query['datetime_from'] == query['datetime_to']) {
        continue; // means: no time limited
      }
      else {
        if (key == 'datetime_from')
          whereClause += ` AND date_time >= ` + query['datetime_from'];
        if (key == 'datetime_to')
          whereClause += ` AND date_time <= ` + query['datetime_to'];
      }
    }
    if (key == 'uids') {
      let uids = query[key];
      if (uids != '[""]') {
        whereClause += ` AND uid IN ('` + JSON.parse(query[key]).join("','") + `')`;
      }
    }
    if (key == 'ugids') {
      let ugids = query[key];
      //console.log(ugids, ugids == '[""]')
      if (ugids != '[""]') {
        ugids = JSON.parse(ugids);
        whereClause += ` AND hasAll(ugids, ['` + ugids.join('\',\'') + `'])`;
      }
    }
  }
  whereClause += ` ORDER BY date_time ASC`;
  console.log(1, whereClause)
  return whereClause;
}

@Injectable()
export class ApiService {
  constructor(private readonly clickHouseService: ClickHouseService) {}

  async insertApi(data: ApiDto): Promise<QueryResult> {
    let data_string = Object.keys(data)[0];
    console.log(2, data_string)
    data = JSON.parse(data_string);
    const rows = Array.isArray(data) ? data : [data];
    const enriched_rows = enrich_rows(rows);
    return this.clickHouseService.insert(TABLE_INTERACTIONS, enriched_rows);
  }

  async readApi(query: GetSelectQuery) {
    const whereClause = make_where_clause_from_query(query);
    //console.log(whereClause, query);
    return await this.clickHouseService.query(whereClause);
  }

  async readDistinctApi(query: GetSelectQuery, something_distinct) {
    //let whereClause = `SELECT DISTINCT ${something_distinct} FROM dtu.rx_data WHERE `
    const whereClause = make_where_clause_from_query(query);
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
