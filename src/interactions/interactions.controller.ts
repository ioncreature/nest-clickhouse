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

*/