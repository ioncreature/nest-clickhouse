import { Body, Controller, Get, HttpStatus, Post, Query, ValidationPipe } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SuccessResponseDto } from '../utils/success-response.dto';
import { ApiDto } from './api.dto';

export type GetSelectQuery = {
  ctag: string;
  topic?: string;
  date_from?: number;
  date_to?: number;
};

@ApiTags('api')
@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessResponseDto,
    description: 'API that receives analytics data from clients',
  })
  async insertApi(@Body(new ValidationPipe()) apiDto: ApiDto) {
    await this.apiService.insertApi(apiDto);
    return { success: true };
  }

  @Get('select')
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessResponseDto,
    description: 'Get some data',
  })
  async readApi(@Query() query: GetSelectQuery) {
    return this.apiService.readApi(query);
  }
}


/*
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