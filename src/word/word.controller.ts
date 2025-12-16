import {
  Body,
  Controller,
  Header,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseFilters,
} from '@nestjs/common';
import { WordService } from './word.service';
import { PDFExceptionFilter } from './filter/pdfException.filter';

@Controller('word')
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @Post('send-message')
  @HttpCode(HttpStatus.OK)
  @UseFilters(PDFExceptionFilter)
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="document.pdf"')
  async getResponse(@Body() message: string, @Res() res: Response) {
    return this.wordService.sendMessage(message, res);
  }
}
