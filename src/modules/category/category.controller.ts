import {
  Controller,
  Get,
  Post,
  HttpCode,
  Param,
  Body,
  UseGuards,
  Delete,
  Put,
} from '@nestjs/common';
import Product from '@/entities/product.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ApiOkResponseData } from '@/common/class/res.class';
import { AuthGuard } from '@/common/guards/auth.guard';
import { Roles } from '@/common/decorators/role.decorator';
import { ADMIN_PREFIX, ADMIN_USER } from '@/constants/admin';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import Category from '@/entities/category.entity';

@ApiTags('Category Module')
@Controller('category')
@UseGuards(AuthGuard)
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a category, need admin permission' })
  @ApiOkResponseData(Product)
  @ApiSecurity(ADMIN_PREFIX)
  @Post()
  @HttpCode(201)
  @Roles(ADMIN_USER)
  async create(@Body() dto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.createCategory(dto);
  }

  @ApiOperation({ summary: 'List all categories' })
  @ApiOkResponseData(Category)
  @Get('all')
  @HttpCode(200)
  async list(): Promise<Category[]> {
    return this.categoryService.list();
  }

  @ApiOperation({ summary: 'List all categories with parent category' })
  @ApiOkResponseData(Category)
  @Get('subcategory/all')
  @HttpCode(200)
  async listSubCategories(): Promise<Category[]> {
    return this.categoryService.listSubCategories();
  }

  @ApiOperation({ summary: 'Get category by id' })
  @ApiOkResponseData(Category)
  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id') id: number): Promise<Category> {
    return this.categoryService.getById(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update category by id' })
  @ApiOkResponseData(Category)
  @ApiSecurity(ADMIN_PREFIX)
  @Put(':id')
  @HttpCode(200)
  @Roles(ADMIN_USER)
  async updateOne(
    @Param('id') id: number,
    @Body() dto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.updateById(id, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete category by id' })
  @ApiOkResponseData(Category)
  @ApiSecurity(ADMIN_PREFIX)
  @Delete(':id')
  @HttpCode(200)
  @Roles(ADMIN_USER)
  async deleteOne(@Param('id') id: number): Promise<void> {
    await this.categoryService.deleteById(id);
  }
}
