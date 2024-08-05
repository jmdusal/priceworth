import { Module } from '@nestjs/common';
import { ProductModule } from './modules/product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ConfigurationKeyPaths,
  getConfiguration,
} from './config/configuration';
import { AdminModule } from './modules/admin/admin.module';
import { SharesModule } from './shares/shares.module';
import {
  LoggerModuleOptions,
  WinstonLogLevel,
} from './shares/logger/logger.interface';
import { LoggerModule } from './shares/logger/logger.module';
import { TypeORMLoggerService } from './shares/logger/typeorm-logger.service';
import { LOGGER_MODULE_OPTIONS } from './shares/logger/logger.constants';
import { CategoryModule } from './modules/category/category.module';
import { CustomerModule } from './modules/customer/customer.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/order/order.module';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [getConfiguration],
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, LoggerModule],
      inject: [ConfigService, LOGGER_MODULE_OPTIONS],
      useFactory: (
        configService: ConfigService<ConfigurationKeyPaths>,
        loggerOptions: LoggerModuleOptions,
      ) => {
        return {
          autoLoadEntities: true,
          type: configService.get<any>('database.type'),
          host: configService.get<string>('database.host'),
          port: configService.get<number>('database.port'),
          username: configService.get<string>('database.username'),
          password: configService.get<string>('database.password'),
          database: configService.get<string>('database.database'),
          synchronize: configService.get<boolean>('database.synchronize'),
          logging: configService.get('database.logging'),
          logger: new TypeORMLoggerService(
            configService.get('database.logging'),
            loggerOptions,
          ),
        };
      },
    }),
    LoggerModule.forRootAsync(
      {
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          return {
            level: configService.get<WinstonLogLevel>('logger.level'),
            consoleLevel: configService.get<WinstonLogLevel>(
              'logger.consoleLevel',
            ),
            timestamp: configService.get<boolean>('logger.timestamp'),
            maxFiles: configService.get<string>('logger.maxFiles'),
            maxFileSize: configService.get<string>('logger.maxFileSize'),
            disableConsoleAtProd: configService.get<boolean>(
              'logger.disableConsoleAtProd',
            ),
            dir: configService.get<string>('logger.dir'),
            errorLogName: configService.get<string>('logger.errorLogName'),
            appLogName: configService.get<string>('logger.appLogName'),
          };
        },
        inject: [ConfigService],
      },
      // global module
      true,
    ),
    SharesModule,
    ProductModule,
    CategoryModule,
    AdminModule,
    CustomerModule,
    CartModule,
    OrderModule,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
