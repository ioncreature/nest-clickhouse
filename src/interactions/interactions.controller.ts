import { Controller, Get, Post } from '@nestjs/common';
import { InteractionsService } from './interactions.service';

@Controller('interactions')
export class InteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  @Post()
  async sendUsage() {
    await this.interactionsService.addUsage({ aid: 'test-app', scope: ['some', 'scope'] });
    return 'ok';
  }

  @Get()
  async getUsage() {
    // const result = await this.interactionsService.getUsage();
    return 'ok';
  }
}

/*
CREATE TABLE IF NOT EXISTS dtu.rx_reports (
  "ctag" String,
  "date_time" DateTime64(3, 'UTC'),
  "element" String,
  "element_path" Array(String),
  "element_type" String,
  "event_type" String,
  "page_title" String,
  "topic" String,
  "uid" String,
  "url_domain_name" String,
  "url_parameters" String,
  "url_path" String,
  "url_port" String,
  "url_scheme" String,
  "value" String
)
ENGINE = MergeTree
ORDER BY "date_time";


INSERT INTO dtu.rx_reports (
  "ctag", 
  "date_time", 
  "element", 
  "element_path", 
  "element_type", 
  "event_type", 
  "page_title", 
  "topic", 
  "uid", 
  "url_domain_name", 
  "url_parameters", 
  "url_path", 
  "url_port", 
  "url_scheme", 
  "value"
) VALUES (
  'DEMO MVP',
  1681863554176,
  '5 min',
  ['', 'Show data for', '5 min'],
  'anchor',
  'click',
  'Demo account for "Do They Use" Product Intelligence app',
  'your real usage now',
  'you@example.com',
  '',
  '',
  '/index.html',
  '',
  'file:',
  '5 min'
);


// 3 types of SELECT statements are used.
// Number of "AND" params in each SELECT statement is variable and is given from user_filters = {...} dict:
// for (let key in user_filters) {
//    select += 'AND ' + key + ' = ' + user_filters[key]
// }
// If Node.js provides built-in mechanisms for SQL injection prevention please apply them
// If not, we will need to make something like: https://www.stackhawk.com/blog/node-js-sql-injection-guide-examples-and-prevention
// (the same for INSERT statements, now they are vulnerable)

// 1. Simple SELECT:
SELECT * FROM dtu.rx_reports WHERE 1=1
AND ctag = 'DEMO MVP'
AND topic = 'your real usage now'
AND date_time >= 1681863554 
AND date_time < 1681863555;

// 2. Aggregation with count:
SELECT uid, COUNT(uid) as count FROM dtu.rx_reports WHERE 1=1
AND ctag = 'DEMO MVP'
AND topic = 'your real usage now'
GROUP BY uid;

// 3. SELECT distinct values:
SELECT DISTINCT topic FROM dtu.rx_reports WHERE 1=1
AND ctag = 'DEMO MVP' 
ORDER BY ctag ASC;
*/