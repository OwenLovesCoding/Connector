// api/index.ts - VERCEL SERVERLESS ENTRY POINT
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

let cachedApp: any = null;

async function bootstrapServer() {
  if (!cachedApp) {
    const expressApp = express();
    const adapter = new ExpressAdapter(expressApp);

    const app = await NestFactory.create(
      AppModule,
      adapter,
      { logger: false, cors: { origin: '*', allowedHeaders: '*' } }, // Optional: disable NestJS logger in production
    );

    app.enableCors(); // Enable CORS if needed
    app.setGlobalPrefix('api'); // Optional: add global prefix

    await app.init();
    cachedApp = expressApp;
  }
  return cachedApp;
}

export default async function handler(req: any, res: any) {
  const app = await bootstrapServer();
  return app(req, res);
}
