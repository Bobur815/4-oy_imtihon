import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const PORT = process.env.PORT ?? 3000
  app.setGlobalPrefix('api')

  app.useGlobalPipes(
    new ValidationPipe({
      transform:true,
      whitelist: true,
      forbidNonWhitelisted: true,
  })
  )
app.use('/', express.static(join(__dirname, '..', 'src', 'common', 'uploads', 'avatars')));
app.use('/', express.static(join(__dirname, '..', 'src', 'common', 'uploads', 'posters')));
  const config = new DocumentBuilder()
    .setTitle("4-oy_Imtihon APIs")
    .addBearerAuth()
    .build()
  
  const documentFactory = () => SwaggerModule.createDocument(app,config)
  SwaggerModule.setup('swagger',app,documentFactory)

  await app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
}
bootstrap();
