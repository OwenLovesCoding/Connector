import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class WordService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async sendMessage(message: string) {
    const geminiKey = this.configService.get<string>('GEMINI_API_KEY');
    const ai = new GoogleGenAI({ apiKey: geminiKey });

    //get message
    const userText = message['message'];
    Logger.log(userText['message']);

    //Send to gemini
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userText,
      });
      return response.text;
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);

        throw new BadRequestException(err.message);
      }
      throw new InternalServerErrorException('There was an error');
    }

    //send email
  }
}
