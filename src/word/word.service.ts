import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
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
import { Response } from 'express';

@Injectable()
export class WordService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async sendMessage(input: RequestData, res: Response): Promise<any> {
    // const geminiKey = this.configService.get<string>('GEMINI_API_KEY');
    // const ai = new GoogleGenAI({ apiKey: geminiKey });

    //Send to gemini
    try {
      // const response = await ai.models.generateContent({
      //   model: 'gemini-2.5-flash',
      //   contents: `${input.message}`,
      // });

      //convert to pdf
      // const doc = new PDFDocument();
      // doc.pipe(res);
      // doc
      //   //   // .font('Helvetica-Bold')
      //   .fontSize(16)
      //   .text(response.text, 100, 100);
      // doc.end();

      this.scholarHandle(input);
    } catch (err) {
      // if (err instanceof Error) {
      // console.log(err);
      // throw new BadRequestException(err.message);
      // if (err.message) {
      //   console.log('without model response is here******');
      //   this.scholarHandle(input);
      // }
      // }
      // console.log(err);
      // throw new InternalServerErrorException('There was an error');
    } finally {
      res.send();
    }
  }

  async scholarHandle(input, response?: string) {
    try {
      const response$ = this.httpService.get(
        `https://api.crossref.org/v1/works?rows=10&select=DOI,prefix,title,URL&order=desc&mailto=${input.email}&query.bibliographic=${input.message}`,
      );
      const res = await firstValueFrom(response$);

      // console.log(res.data);
      const items = res.data['message']['items'];
      if (res.data)
        this.handleEmailSending(
          input.email,
          input.message,
          items,
          response as string,
        );
      return;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  async handleEmailSending(
    to: string,
    subject: string,
    items: any[],
    response: string,
  ): Promise<void> {
    const server = this.configService.get<string>('BREVO_SMTP_SERVER');
    const brevoApiKey = this.configService.get<string>('BREVO_API_KEY');

    const html =
      items &&
      items.length >= 0 &&
      items
        .map((e: any, i: number) => {
          if (response != undefined) {
            return `<p>${response}</p><div><p>${i + 1}*</p><p>DOI:${e.DOI}</p><p>Prefix:${e.prefix}</p><p>Title:${e.title[0]}</p>Link:${e.URL}</div>\n`;
          }
          return `<div><p>${i + 1}*</p><p>DOI:${e.DOI}</p><p>Prefix:${e.prefix}</p><p>Title:${e.title[0]}</p>Link:${e.URL}</div>\n`;
        })
        .join('   ');

    // console.log('this is the resources from items', html);
    // console.log(resources);
    // return;
    // const login = this.configService.get<string>('BREVO_LOGIN');
    // const password = this.configService.get<string>('BREVO_PASSWORD');

    const bodyForm = {
      name: subject,
      subject,
      sender: { name: 'from Connector', email: 'connector@gmail.com' },
      type: 'classic',
      htmlContent: html,
      recipients: { emails: [to] },
    };

    try {
      const response$ = this.httpService.post(
        'https://api.brevo.com/v3/emailCampaigns',
        bodyForm,
        {
          headers: {
            api_key: brevoApiKey,
          },
        },
      );

      const emailRes = await firstValueFrom(response$);

      if (emailRes.data) {
        console.log('Email has been sent', emailRes.data);
      } else {
        console.log('email has not been sent');
      }

      // const transporter = nodemailer.createTransport({
      //   host: server,
      //   port: 587,
      //   secure: false, // true for 465, false for other ports
      //   auth: {
      //     user: login,
      //     pass: password,
      //   },
      // });

      // // const allData = [];

      // // (async () => {
      // const info = await transporter.sendMail({
      //   from: '"Owen Iraoya" <oweniraoya7@gmail.com>',
      //   to,
      //   subject,
      //   text: 'We got world class resources just for you...', // plain‑text body
      //   html, // HTML body
      // });

      // console.log('Message sent:', info.messageId);
      return;
      // })();
    } catch (err) {
      if (err instanceof Error) {
        throw new BadRequestException(err.message);
      }
      throw new InternalServerErrorException(err);
    }
  }
}
