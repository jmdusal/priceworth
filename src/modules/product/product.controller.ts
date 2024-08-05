import {
  Controller,
  Get,
  Post,
  HttpCode,
  Param,
  Body,
  UseGuards,
  Put,
  Delete,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
// import Product from '@/entities/product.entity';
import Product from '../../entities/product.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
// import {
//   ApiOkResponseData,
//   ApiOkResponsePaginated,
// } from '@/common/class/res.class';
import {
    ApiOkResponseData,
    ApiOkResponsePaginated,
} from '../../common/class/res.class';

// import { AuthGuard } from '@/common/guards/auth.guard';
// import { Roles } from '@/common/decorators/role.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Roles } from '../../common/decorators/role.decorator';
// import { ADMIN_PREFIX, ADMIN_USER } from '@/constants/admin';
import { ADMIN_PREFIX, ADMIN_USER } from '../../constants/admin';
import {
  CreateProductVariantDto,
  UpdateProductDto,
  UpdateProductFeatureDto,
  UpdateProductVariantDto,
} from './dto';
// import ProductVariant from '@/entities/product_variant.entity';
import ProductVariant from '../../entities/product_variant.entity';
import { CreateProductFeatureDto } from './dto/create-product_feature.dto';
// import Feature from '@/entities/feature.entity';
import Feature from '../../entities/feature.entity';

@ApiTags('Product Module')
@Controller('product')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(private productsService: ProductService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a product variant, need admin permission' })
  @ApiOkResponseData(ProductVariant)
  @ApiSecurity(ADMIN_PREFIX)
  @Post('variant')
  @HttpCode(201)
  @Roles(ADMIN_USER)
  async createProductVariant(
    @Body() createProductVariantDto: CreateProductVariantDto,
  ): Promise<ProductVariant> {
    return this.productsService.createProductVariant(createProductVariantDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a product feature, need admin permission' })
  @ApiOkResponseData(ProductVariant)
  @ApiSecurity(ADMIN_PREFIX)
  @Post('feature')
  @HttpCode(201)
  @Roles(ADMIN_USER)
  async createProductFeature(
    @Body() createProductFeatureDto: CreateProductFeatureDto,
  ): Promise<Feature> {
    return this.productsService.createProductFeature(createProductFeatureDto);
  }

  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a product, need admin permission' })
  @ApiOkResponseData(Product)
  // @ApiSecurity(ADMIN_PREFIX)
  @Post()
  @HttpCode(201)
  // @Roles(ADMIN_USER)
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.createProduct(createProductDto);
  }

  @ApiOperation({ summary: 'List all products' })
  @ApiOkResponsePaginated(Product)
  @Get('all')
  async findAll(): Promise<Product[]> {
    return this.productsService.getAllProducts();
  }

  @ApiOperation({ summary: 'Find Product by id' })
  @ApiOkResponseData(Product)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Product> {
    return this.productsService.findProductById(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Product Variant by variant id' })
  @ApiOkResponseData(ProductVariant)
  @ApiSecurity(ADMIN_PREFIX)
  @Put('variant/:id')
  @HttpCode(201)
  @Roles(ADMIN_USER)
  async updateOneVariant(
    @Param('id') id: number,
    @Body() updateProductVariantDto: UpdateProductVariantDto,
  ): Promise<ProductVariant> {
    return this.productsService.updateProductVariantById(
      id,
      updateProductVariantDto,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Product Feature by feature id' })
  @ApiOkResponseData(Feature)
  @ApiSecurity(ADMIN_PREFIX)
  @Put('feature/:id')
  @HttpCode(201)
  @Roles(ADMIN_USER)
  async updateOneFeature(
    @Param('id') id: number,
    @Body() updateProductFeatureDto: UpdateProductFeatureDto,
  ): Promise<Feature> {
    return this.productsService.updateFeatureById(
      id,
      updateProductFeatureDto,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Product by product id' })
  @ApiOkResponseData(Product)
  @ApiSecurity(ADMIN_PREFIX)
  @Put(':id')
  @HttpCode(201)
  @Roles(ADMIN_USER)
  async updateOne(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.updateProductById(id, updateProductDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Feature by feature id' })
  @ApiSecurity(ADMIN_PREFIX)
  @Delete('/feature/:id')
  @Roles(ADMIN_USER)
  async deleteOneFeature(@Param('id') id: number): Promise<void> {
    return this.productsService.deleteFeatureById(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Variant by variant id' })
  @ApiSecurity(ADMIN_PREFIX)
  @Delete('/variant/:id')
  @Roles(ADMIN_USER)
  async deleteOneVariant(@Param('id') id: number): Promise<void> {
    return this.productsService.deleteVariantById(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Product by id' })
  @ApiSecurity(ADMIN_PREFIX)
  @Delete(':id')
  @Roles(ADMIN_USER)
  async deleteOne(@Param('id') id: number): Promise<void> {
    return this.productsService.deleteProductById(id);
  }
}
