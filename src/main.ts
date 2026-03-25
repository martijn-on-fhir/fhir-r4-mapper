import { NestFactory } from '@nestjs/core';
import { raw } from 'express';
import { AppModule } from './app.module';
import { OperationOutcomeFilter } from './filters/operation-outcome.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.use(raw({ type: 'application/xml', limit: '10mb' }));
  app.useGlobalFilters(new OperationOutcomeFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
