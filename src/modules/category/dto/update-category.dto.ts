import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({
    example: 'category1',
    description: 'Category name',
  })
  @IsString()
  readonly name: string = 'category1';

  @ApiProperty({
    required: true,
    example: 'description',
    description: 'Category description',
  })
  @IsString()
  readonly description: string = 'description';

  @ApiProperty({
    required: true,
    example: '/',
    description: 'Category Image url',
  })
  @IsString()
  readonly image: string = '/';

  @ApiProperty({
    required: true,
    default: true,
    description: 'Show category on home page',
  })
  @IsBoolean()
  readonly showOnHomepage: boolean = true;

  @ApiProperty({
    required: true,
    default: true,
    description: 'Show category in top menu',
  })
  @IsBoolean()
  readonly includeInTopMenu: boolean = true;

  @ApiProperty({
    required: true,
    default: true,
    description: 'Category published',
  })
  @IsBoolean()
  readonly published: boolean = true;

  @ApiProperty({
    required: false,
    description: 'Parent category id',
  })
  @IsOptional()
  @IsNumber()
  readonly parentCategoryId: number | null = null;
}
