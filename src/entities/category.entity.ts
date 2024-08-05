import { BaseEntity } from '@/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import Product from './product.entity';

@Entity({ name: 'category' })
export default class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'Category id',
  })
  id: number;

  @Column({ nullable: false, unique: true })
  @ApiProperty({
    description: 'Category name',
  })
  name: string;

  @Column({
    type: 'longtext'
  })
  @ApiProperty({
    description: 'Category Description',
  })
  description: string;

  @Column()
  @ApiProperty({
    description: 'Category image',
  })
  image: string;

  @Column()
  @ApiProperty({
    description: 'Show On Homepage',
  })
  showOnHomepage: boolean;

  @Column()
  @ApiProperty({
    description: 'Include In Top Menu',
  })
  includeInTopMenu: boolean;

  @Column()
  @ApiProperty({
    description: 'Category published',
  })
  published: boolean;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Parent Category id',
    required: false,
  })
  parentCategoryId: number | null;

  @ManyToOne(() => Category, (category) => category.children)
  @JoinColumn({ name: 'parentCategoryId' })
  parent: Category;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
