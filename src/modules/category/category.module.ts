import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from '@/common/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import Category from '@/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ]
})

export class CategoryModule {}
