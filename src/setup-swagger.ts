import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigurationKeyPaths } from '@/config/configuration';
import { ADMIN_PREFIX } from './constants/admin';

export function setupSwagger(app: INestApplication): void {
  const configService: ConfigService<ConfigurationKeyPaths> =
    app.get(ConfigService);

  const enable = configService.get<boolean>('swagger.enable', true);

  if (!enable) {
    return;
  }

  const swaggerConfig = new DocumentBuilder()
    .setTitle(configService.get<string>('swagger.title'))
    .setDescription(configService.get<string>('swagger.desc'))
    .setLicense('MIT', 'https://github.com/llii0046/my-nestjs-boilerplate')
    // JWT Authentication
    .addSecurity(ADMIN_PREFIX, {
      description: 'backend admin api Authorize',
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
    })
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(
    configService.get<string>('swagger.path', '/swagger-api'),
    app,
    document,
  );
}
