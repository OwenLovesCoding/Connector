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
import { RequestData } from './reuest-data.dto';
import nodemailer from 'nodemailer';

@Injectable()
export class WordService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async sendMessage(input: RequestData, res: any): Promise<any> {
    const geminiKey = this.configService.get<string>('GEMINI_API_KEY');
    const ai = new GoogleGenAI({ apiKey: geminiKey });

    //Send to gemini
    try {
      // const response = await ai.models.generateContent({
      //   model: 'gemini-2.5-flash',
      //   // config:{},
      //   // contents: `You are a friend. Always return a JSON response with a context, and search word or phrase or summary
      //   // It should be in this format:
      //   // search: In here In here you output the phrase or summary or word that relates with the request.
      //   // response: In here you put your response
      //   // Now this is the text query - ${textStr}
      //   // `,
      // contents: input.message,
      // });
      // console.log('This is the request:', textStr);
      // return response.text;
      // console.log(response.text);
      //convert to pdf
      // const doc = new PDFDocument();
      // doc.pipe(res);
      // doc
      //   //   // .font('Helvetica-Bold')
      //   .fontSize(16)
      //   .text(response.text, 100, 100);
      // doc.end();

      const response$ = this.httpService.get(
        `https://api.crossref.org/v1/works?rows=10&select=DOI,prefix,title&order=desc&mailto=${input.email}`,
      );
      const res = await firstValueFrom(response$);

      console.log(res.data);
      const items = res.data['message']['items'];
      if (res.data)
        return this.handleEmailSending(input.email, input.message, items);
      return;
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);

        throw new BadRequestException(err.message);
      }
      throw new InternalServerErrorException('There was an error');
    }
  }

  async handleEmailSending(
    to: string,
    subject: string,
    items: any,
  ): Promise<void> {
    const server = this.configService.get<string>('BREVO_SMTP_SERVER');
    const login = this.configService.get<string>('BREVO_LOGIN');
    const password = this.configService.get<string>('BREVO_PASSWORD');

    try {
      const transporter = nodemailer.createTransport({
        host: server,
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: login,
          pass: password,
        },
      });

      // const allData = [];

      const resources = items.map((e: any, i: number) => {
        return `
        ${e + 1}*

        DOI: ${e.DOI},
        Prefix: ${e.prefix},
        Title: ${e.title[0]}
        `;
      })(async () => {
        const info = await transporter.sendMail({
          from: '"Owen Iraoya" <oweniraoya7@gmail.com>',
          to,
          subject,
          text: 'We got world class resources just for you...', // plain‑text body
          html: resources, // HTML body
        });

        console.log('Message sent:', info.messageId);
      })();
    } catch (err) {
      if (err instanceof Error) {
        throw new BadRequestException(err.message);
      }
      throw new InternalServerErrorException(err);
    }
  }
}
