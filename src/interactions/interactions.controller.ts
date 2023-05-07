import { Body, Controller, Get, HttpStatus, Post, Query, ValidationPipe } from '@nestjs/common';
import { InteractionsService } from './interactions.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SuccessResponseDTO } from '../utils/success-response.dto';
import { InteractionDto } from './interaction.dto';

export type GetSelectQuery = {
  ctag: string;
  topic?: string;
  date_from?: number;
  date_to?: number;
};

@ApiTags('rx')
@Controller('rx')
export class InteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessResponseDTO,
    description: 'Send single interaction',
  })
  async insertInteraction(@Body(new ValidationPipe()) interactionDto: InteractionDto) {
    await this.interactionsService.addInteraction(interactionDto);
    return { success: true };
  }

  @Get('select')
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessResponseDTO,
    description: 'Get some data',
  })
  async getInteractions(@Query() query: GetSelectQuery) {
    return this.interactionsService.getInteractions(query);
  }
}

/*
CREATE TABLE IF NOT EXISTS dtu.rx_data (
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


INSERT INTO dtu.rx_data (
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
SELECT * FROM dtu.rx_data WHERE 1=1
AND ctag = 'DEMO MVP'
AND topic = 'your real usage now'
AND date_time >= 1681863554
AND date_time < 1681863555;

// 2. Aggregation with count:
SELECT uid, COUNT(uid) as count FROM dtu.rx_data WHERE 1=1
AND ctag = 'DEMO MVP'
AND topic = 'your real usage now'
GROUP BY uid;

// 3. SELECT distinct values:
SELECT DISTINCT topic FROM dtu.rx_data WHERE 1=1
AND ctag = 'DEMO MVP'
ORDER BY ctag ASC;
*/
