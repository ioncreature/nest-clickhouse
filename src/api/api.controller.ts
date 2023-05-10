import { Body, Controller, Get, HttpStatus, Post, Query, ValidationPipe, Param } from '@nestjs/common';
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

interface SendDetailsDTO {
  something_distinct: string;
}

@ApiTags('api')
@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post('submit')
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessResponseDto,
    description: 'API that receives analytics data from clients',
  })
  async insertApi(@Body(new ValidationPipe()) apiDto: ApiDto) {
    await this.apiService.insertApi(apiDto);
    return { success: true };
  }

  @Get('read')
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessResponseDto,
    description: 'Get some data from DB',
  })
  async readApi(@Query() query: GetSelectQuery) {
    return this.apiService.readApi(query);
  }

  @Get('read_distinct/:something_distinct')
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessResponseDto,
    description: 'Get some distinct data from DB',
  })
  async readDistinctApi(@Query() query: GetSelectQuery, @Param() params: SendDetailsDTO) {
    const result = this.apiService.readDistinctApi(query, params.something_distinct);
    return result;
  }

  @Get('read_aggregated')
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessResponseDto,
    description: 'Read aggregated data from DB',
  })
  async readAggregatedApi(@Query() query: GetSelectQuery) {
    return this.apiService.readAggregatedApi(query);
  }
}
