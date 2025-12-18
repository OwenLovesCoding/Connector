import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseFilters,
} from '@nestjs/common';
import { WordService } from './word.service';
import { PDFExceptionFilter } from './filter/pdfException.filter';
import { RequestData } from './reuest-data.dto';
import { type Response } from 'express';

@Controller('word')
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @Post('send-message')
  @HttpCode(HttpStatus.OK)
  // @UseFilters(PDFExceptionFilter)
  // @Header('Content-Type', 'application/pdf')
  // @Header('Content-Disposition', 'attachment; filename="document.pdf"')
  async getResponse(
    @Body() input: any,
    @Res()
    res: Response,
  ): Promise<void> {
    this.wordService.sendMessage(input, res);
    // return;
  }

  @Get('track-end')
  async sendInfo(): Promise<string> {
    return 'This is the endpoint';
  }
}
