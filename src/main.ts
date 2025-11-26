// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpAdapterHost } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  await app.listen(3000);
}
bootstrap();
