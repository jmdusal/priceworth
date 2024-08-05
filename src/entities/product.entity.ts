import { BaseEntity } from '@/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import ProductVariant from './product_variant.entity';
import Category from './category.entity';
import Feature from './feature.entity';

@Entity({ name: 'product' })
export default class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'Product id',
  })
  id: number;

  @Column()
  @ApiProperty({
    description: 'Product name',
  })
  name: string;

  @Column()
  @ApiProperty({
    description: 'Product model',
  })
  model: string;

  @Column()
  @ApiProperty({
    description: 'Product Category Id',
  })
  productCategoryId: number;

  @Column({
    type: 'longtext'
  })
  @ApiProperty({
    description: 'Short Description',
  })
  shortDescription: string;

  @Column({
    type: 'longtext'
  })
  @ApiProperty({
    description: 'Long Description',
  })
  longDescription: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  @ApiProperty({
    description: 'Product Published',
    default: true,
    type: Boolean,
  })
  published: boolean;

  @OneToMany(() => Feature, (feature) => feature.product, {
    cascade: true,
  })
  features: Feature[];

  @OneToMany(() => ProductVariant, (productVariant) => productVariant.product, {
    cascade: true,
  })
  productVariants: ProductVariant[];

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'productCategoryId' })
  category: Category;
}
