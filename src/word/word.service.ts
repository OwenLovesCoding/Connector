import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  StreamableFile,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { GoogleGenAI } from '@google/genai';
import PDFDocument from 'pdfkit';
import fs, { createReadStream } from 'fs';

@Injectable()
export class WordService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async sendMessage(message: string, res: any): Promise<any> {
    const geminiKey = this.configService.get<string>('GEMINI_API_KEY');
    const ai = new GoogleGenAI({ apiKey: geminiKey });

    //get message
    const textStr = message['message'];
    // console.log(textStr);

    //Send to gemini
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: textStr,
      });

      // console.log(response.text);

      //convert to pdf
      const doc = new PDFDocument();

      doc.pipe(res);

      doc
        //   // .font('Helvetica-Bold')
        .fontSize(16)
        .text(response.text, 100, 100);

      doc.end();
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);

        throw new BadRequestException(err.message);
      }
      throw new InternalServerErrorException('There was an error');
    }
  }
}
