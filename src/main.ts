import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './setup-swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { LoggerService } from './shares/logger/logger.service';
import { ApiTransformInterceptor } from '@/common/interceptors/api-transform.interceptor';
const PORT = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://priceworth-admin.vercel.app',
      'https://priceworth-furniture.vercel.app',
    ], // or the address of your front-end if different
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  app.useLogger(app.get(LoggerService));
  // api interceptor
  app.useGlobalInterceptors(new ApiTransformInterceptor(new Reflector()));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  setupSwagger(app);
  await app.listen(PORT, '0.0.0.0');
  const serverUrl = await app.getUrl();
  Logger.log(`The API service has started, please visit: ${serverUrl}`);
  Logger.log(
    `The API documentation has been generated, please visit: ${serverUrl}/${process.env.SWAGGER_PATH}/`,
  );
}
bootstrap();
