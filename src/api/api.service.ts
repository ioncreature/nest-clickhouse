import { Injectable, BadRequestException } from '@nestjs/common';
import { ClickHouseService } from '../clickhouse/clickhouse.service';
import { QueryResult } from '@clickhouse/client/dist/connection';
import { ApiDto } from './api.dto';
import { GetSelectQuery } from './api.controller';
import { Base64 } from '../utils/base64';


const TABLE_INTERACTIONS = 'rx_data';

function enrich_rows(data) { // enriching report with required data even if SDK didn't sent it
  let enriched_rows = [];

  for (let i in data) {
    let r = data[i];

    if (!r.topic)
      r.topic = "default";

    if (r.element == '') {
      const status = 'Bad request';
      const description = 'Element can not be empty';
      console.warn(status, description);
      throw new BadRequestException(status, { cause: new Error(), description: description })
    }

    if (!r.element_path)
      r.element_path = ['', r.element];
    if (typeof(r.element_path) == 'string')
      r.element_path = r.element_path.split(',');
    if (r.element_path[0] !== '')
      r.element_path.unshift(''); // add to the beginning as "all" elements for filter

    // replacing internal ' mark in strings like: 'Who's there'
    for (let key in r) {
      if (typeof(r[key]) == 'string')
        r[key] = r[key].replace(/'/g, "''");
      else {
        for (let j in r[key]) {
          r[key][j] = r[key][j].replace(/'/g, "''");
        }
      }
      //console.log(r[key])
    }

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
    data_string = data_string.replace(/ /g, "+");
    //console.log(data_string);
    //console.log(Base64.decode(data_string));
    data = JSON.parse(Base64.decode(data_string).replace(/\x00/g, '')); // remove sometimes trailing =/== in base64 encoding
    const rows = Array.isArray(data) ? data : [data];
    const enriched_rows = enrich_rows(rows);
    //console.error(10, enriched_rows)
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
