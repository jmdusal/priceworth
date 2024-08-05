import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Product from './product.entity';

@Entity({ name: 'product_variant' })
export default class ProductVariant {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'Product Variant id',
  })
  id: number;

  @Column()
  @ApiProperty({
    description: 'Product Variant name',
  })
  name: string;

  @Column({ unique: true })
  @ApiProperty({
    description: 'Product Variant sku',
  })
  sku: string;

  @Column()
  @ApiProperty({
    description: 'Product Variant Color',
  })
  color: string;

  @Column({ type: 'float', nullable: false, default: 100 })
  @ApiProperty({
    description: 'Product Dimension Height',
  })
  dimensionHeight: number;

  @Column({ type: 'float', nullable: false, default: 100 })
  @ApiProperty({
    description: 'Product Dimension Length',
  })
  dimensionLength: number;

  @Column({ type: 'float', nullable: false, default: 100 })
  @ApiProperty({
    description: 'Product Dimension Width',
  })
  dimensionWidth: number;

  @Column()
  @ApiProperty({
    description: 'Product Weight',
  })
  weight: number;

  @Column()
  @ApiProperty({
    description: 'Product Price',
  })
  price: number;

  @Column()
  @ApiProperty({
    description: 'Total Inventory',
  })
  totalInventory: number;

  @Column({
    type: 'simple-json',
    nullable: true,
    comment: 'Images in JSON format',
  })
  @ApiProperty({
    description: 'Images',
    type: [String], 
  })
  images: string[];

  @ManyToOne(() => Product, (product) => product.productVariants)
  @JoinColumn({ name: 'productId' })
  product: Product;
}
