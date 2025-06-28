import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT ?? 3000
  app.setGlobalPrefix('api')
  
  const config = new DocumentBuilder()
    .setTitle("4-oy_Imtihon APIs")
    .addBearerAuth()
    .build()
  
  const documentFactory = () => SwaggerModule.createDocument(app,config)
  SwaggerModule.setup('swagger',app,documentFactory)

  await app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
}
bootstrap();
