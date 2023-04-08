import { Injectable } from '@nestjs/common';

@Injectable()
export class StuffService {
  getHello(): string {
    return 'Hello World!';
  }
}
