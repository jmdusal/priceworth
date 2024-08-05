import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import Product from './product.entity';

@Entity({ name: 'feature' })
export default class Feature {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'Feature id',
  })
  id: number;

  @Column()
  @ApiProperty({
    description: 'Feature key',
  })
  key: string;

  @Column()
  @ApiProperty({
    description: 'Feature value',
  })
  value: string;

  @ManyToOne(() => Product, (product) => product.features)
  @JoinColumn({ name: 'productId' })
  product: Product;
}
