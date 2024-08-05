import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Product from '@/entities/product.entity';
import { AuthGuard } from '@/common/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import ProductVariant from '@/entities/product_variant.entity';
import Category from '@/entities/category.entity';
import Feature from '@/entities/feature.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductVariant, Category, Feature]),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],

  exports: [ProductService],
})
export class ProductModule {}
