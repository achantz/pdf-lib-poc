import { Injectable } from '@nestjs/common';
import { Message } from '@pdf-lib-poc/api-interfaces';

@Injectable()
export class AppService {
  getData(): Message {
    return { message: 'Welcome to api!' };
  }
}
