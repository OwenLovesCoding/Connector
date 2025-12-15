import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { WordService } from './word.service';

@Controller('word')
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @HttpCode(HttpStatus.OK)
  @Post('send-message')
  async getResponse(@Body() message: string) {
    return this.wordService.sendMessage(message);
  }
}
