import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    // console.log('this is it');

    return 'Welcome to the project';
  }
}
