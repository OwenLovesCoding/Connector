import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { envValidationSchema } from './config/env.validation';
import { WordService } from './word/word.service';
import { WordController } from './word/word.controller';
import { WordModule } from './word/word.module';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: envValidationSchema,
      isGlobal: true,
    }),
    WordModule,
    HttpModule,
  ],
  controllers: [AppController, WordController],
  providers: [AppService, WordService, ConfigService],
})
export class AppModule {}
